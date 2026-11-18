import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import {
  X, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Clock, Star, Users,
  Loader2, CalendarDays, User, Phone, MessageSquare, Sparkles, Home,
} from 'lucide-react'
import { BOOK_SERVICES, GUESTS, MASTERS, SLOT_HOURS, fmt, formatPhoneInput, phoneComplete, priceFor, type BookService, type Master } from './data'
import { getLenis } from '../motion/motion'

/*
  Онлайн-запись в 4 шага (как на сайте детейлинга): услуга → мастер → дата и время → данные.
  Справа — итог записи, после подтверждения — экран успеха с номером записи.
  Бэкенда нет: занятость слотов демо (детерминированная), отправка имитируется.
*/

const STEPS = ['Услуга', 'Мастер', 'Дата и время', 'Ваши данные']
const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']

type Data = { serviceId: string | null; guests: string; masterId: string | null; date: Date | null; time: string | null; name: string; phone: string; comment: string }
type SetData = (p: Partial<Data>) => void

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const keyOf = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
const fmtDate = (d: Date) => d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

// Детерминированный «псевдослучайный» генератор — демо-занятость слотов
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}
function slotsFor(date: Date, master: string | null) {
  const now = new Date()
  const isToday = keyOf(date) === keyOf(now)
  const weekend = [0, 6].includes(date.getDay())
  const fullDay = hash(`full-${keyOf(date)}`) < 0.1
  return SLOT_HOURS.filter((h) => !(weekend && (h < 11 || h > 19))).map((h) => {
    const past = isToday && h <= now.getHours()
    const busy = fullDay || hash(`${keyOf(date)}-${h}-${master}`) < (master === 'any' ? 0.2 : 0.38)
    return { h, label: hh(h), free: !past && !busy, past }
  })
}

const card = (sel: boolean) =>
  `cursor-pointer rounded-2xl border text-left transition duration-300 active:scale-[.99] ${
    sel ? 'border-accent bg-accent/[.06] shadow-[0_0_0_1px_var(--color-accent)]' : 'border-neutral-400 bg-white/60 hover:border-accent/60 hover:bg-white'
  }`

const Radio = ({ on }: { on: boolean }) => (
  <span className={`grid size-6 shrink-0 place-items-center rounded-full border transition ${on ? 'border-accent bg-accent text-white' : 'border-neutral-500'}`}>
    {on && <Check className="size-3.5" />}
  </span>
)

const initials = (n: string) => n.split(' ').map((w) => w[0]).join('')

/* ---------- Шаг 1: услуга ---------- */
function StepService({ data, set }: { data: Data; set: SetData }) {
  const groups: [string, BookService[]][] = [
    ['Процедуры', BOOK_SERVICES.filter((s) => s.cat !== 'ritual')],
    ['Спа-ритуалы', BOOK_SERVICES.filter((s) => s.cat === 'ritual')],
  ]
  return (
    <div className="animate-bk-slide-in space-y-8">
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Users className="size-4" /> Для кого
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {GUESTS.map((g) => (
            <button key={g.id} type="button" onClick={() => set({ guests: g.id })} className={`${card(data.guests === g.id)} px-4 py-3 text-[15px]`}>
              {g.label}
            </button>
          ))}
        </div>
      </div>
      {groups.map(([title, list]) => (
        <div key={title}>
          <h3 className="mb-3 text-sm font-medium text-neutral-700">{title}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((s) => {
              const sel = data.serviceId === s.id
              return (
                <button key={s.id} type="button" onClick={() => set({ serviceId: s.id, masterId: null, date: null, time: null })} className={`${card(sel)} group flex gap-4 p-3`}>
                  <img src={s.img} alt="" className="size-20 shrink-0 rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-start justify-between gap-2">
                      <span className="font-primary text-[17px] leading-snug text-neutral-800">{s.title}</span>
                      <Radio on={sel} />
                    </span>
                    <span className="mt-auto flex items-center justify-between pt-2 text-sm">
                      <span className="flex items-center gap-1 text-neutral-600">
                        <Clock className="size-3.5" />
                        {s.duration}
                      </span>
                      <span className="font-medium text-accent">{fmt(priceFor(s, data.guests))}</span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Шаг 2: мастер ---------- */
function StepMaster({ data, set, service }: { data: Data; set: SetData; service: BookService }) {
  const masters = MASTERS.filter((m) => m.cats.includes(service.cat))
  const pick = (id: string) => set({ masterId: id, time: null })
  return (
    <div className="animate-bk-slide-in">
      <p className="mb-5 text-neutral-700">Мастера, которые проводят «{service.title}»:</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => pick('any')} className={`${card(data.masterId === 'any')} flex items-center gap-4 p-4 sm:col-span-2`}>
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-accent/10 text-accent">
            <Users className="size-7" />
          </span>
          <span className="flex-1">
            <span className="block font-primary text-[17px] text-neutral-800">Любой свободный мастер</span>
            <span className="block text-sm text-neutral-600">Больше свободного времени для записи</span>
          </span>
          <Radio on={data.masterId === 'any'} />
        </button>
        {masters.map((m) => (
          <button key={m.id} type="button" onClick={() => pick(m.id)} className={`${card(data.masterId === m.id)} flex items-center gap-4 p-4`}>
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-secondary-200 font-primary text-xl text-neutral-800">{initials(m.name)}</span>
            <span className="min-w-0 flex-1">
              <span className="block font-primary text-[17px] text-neutral-800">{m.name}</span>
              <span className="block truncate text-sm text-neutral-600">{m.role}</span>
              <span className="mt-1 flex items-center gap-3 text-xs text-neutral-600">
                <span className="flex items-center gap-1">
                  <Star className="size-3.5 fill-accent text-accent" />
                  {m.rating.toFixed(1)}
                </span>
                <span>Опыт {m.exp}</span>
              </span>
            </span>
            <Radio on={data.masterId === m.id} />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- Шаг 3: календарь и время ---------- */
function StepDate({ data, set }: { data: Data; set: SetData }) {
  const [today] = useState(() => startOfDay(new Date()))
  const [view, setView] = useState(() => {
    const d = data.date ?? today
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const maxView = new Date(today.getFullYear(), today.getMonth() + 2, 1)
  const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1)
  const canNext = view < maxView

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1)
    const offset = (first.getDay() + 6) % 7
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()
    return [...Array(offset).fill(null), ...Array.from({ length: days }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))] as (Date | null)[]
  }, [view])

  const slots = data.date ? slotsFor(data.date, data.masterId) : []
  const navBtn =
    'grid size-10 cursor-pointer place-items-center rounded-full border border-neutral-400 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30'

  return (
    <div className="animate-bk-slide-in grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-3xl border border-neutral-400 bg-white/60 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} disabled={!canPrev} aria-label="Предыдущий месяц" className={navBtn}>
            <ChevronLeft className="size-5" />
          </button>
          <p className="font-primary text-lg text-neutral-800" aria-live="polite">
            {MONTHS[view.getMonth()]} {view.getFullYear()}
          </p>
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} disabled={!canNext} aria-label="Следующий месяц" className={navBtn}>
            <ChevronRight className="size-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-600">
          {WEEK.map((w, i) => (
            <span key={w} className={`py-2 ${i > 4 ? 'text-accent' : ''}`}>
              {w}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />
            const past = d < today
            const free = !past && slotsFor(d, data.masterId).some((s) => s.free)
            const sel = !!data.date && keyOf(d) === keyOf(data.date)
            const isToday = keyOf(d) === keyOf(today)
            return (
              <button
                key={keyOf(d)}
                type="button"
                disabled={!free}
                onClick={() => set({ date: d, time: null })}
                aria-label={`${fmtDate(d)}${free ? '' : past ? ', прошедшая дата' : ', нет свободного времени'}`}
                aria-pressed={sel}
                className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl text-sm font-medium transition duration-200
                  ${sel ? 'scale-105 bg-accent text-white shadow-[0_8px_24px_-8px_rgba(156,99,75,.8)]' : free ? 'text-neutral-800 hover:bg-secondary-200 active:scale-95' : 'cursor-not-allowed text-neutral-500/50'}
                  ${!past && !free ? 'line-through' : ''} ${isToday && !sel ? 'ring-1 ring-accent/50' : ''}`}
              >
                {d.getDate()}
                {free && !sel && <span className="absolute bottom-1.5 size-1 rounded-full bg-accent/70" />}
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent/70" />
            есть время
          </span>
          <span className="flex items-center gap-1.5">
            <span className="line-through">15</span>всё занято
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded ring-1 ring-accent/50" />
            сегодня
          </span>
        </div>
      </div>

      <div>
        {!data.date ? (
          <div className="grid h-full min-h-48 place-items-center rounded-3xl border border-dashed border-neutral-500 p-6 text-center text-neutral-600">
            <div>
              <CalendarDays className="mx-auto mb-3 size-8 text-accent/70" />
              Выберите дату в календаре, чтобы увидеть свободное время
            </div>
          </div>
        ) : (
          <div key={keyOf(data.date)} className="animate-bk-fade-in">
            <p className="mb-1 text-sm text-neutral-600">Свободное время</p>
            <p className="mb-4 font-primary text-lg text-neutral-800 first-letter:uppercase">{fmtDate(data.date)}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
              {slots.map((s) => {
                const sel = data.time === s.label
                return (
                  <button
                    key={s.h}
                    type="button"
                    disabled={!s.free}
                    onClick={() => set({ time: s.label })}
                    aria-pressed={sel}
                    title={s.free ? '' : s.past ? 'Время прошло' : 'Занято'}
                    className={`cursor-pointer rounded-xl border py-3 text-sm font-medium transition duration-200
                      ${sel ? 'border-accent bg-accent text-white' : s.free ? 'border-neutral-400 bg-white/60 text-neutral-800 hover:border-accent hover:text-accent active:scale-95' : 'cursor-not-allowed border-transparent bg-neutral-300/40 text-neutral-500 line-through'}`}
                  >
                    {s.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-neutral-600">Зачёркнутое время уже занято</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Шаг 4: данные клиента ---------- */
function Field({ label, required, hint, icon: I, error, children }: { label: string; required?: boolean; hint?: string; icon: ComponentType<{ className?: string }>; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-medium text-neutral-800">
        {label}
        {required && <span className="text-accent">*</span>}
        {hint && <span className="font-normal text-neutral-600">· {hint}</span>}
      </span>
      <span className="relative block">
        <I className="pointer-events-none absolute top-4 left-4 size-5 text-neutral-500" />
        {children}
      </span>
      {error && (
        <span className="mt-1.5 block text-sm text-accent" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}
function StepDetails({ data, set, errors }: { data: Data; set: SetData; errors: Record<string, string> }) {
  return (
    <div className="animate-bk-slide-in mx-auto max-w-xl space-y-5">
      <Field label="Ваше имя" required icon={User} error={errors.name}>
        <input value={data.name} onChange={(e) => set({ name: e.target.value })} placeholder="Например, Айгерим" autoComplete="name" aria-invalid={!!errors.name} className={`bk-field ${errors.name ? 'border-accent' : ''}`} />
      </Field>
      <Field label="Номер телефона" required icon={Phone} error={errors.phone}>
        <input
          value={data.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (7__) ___-__-__"
          aria-invalid={!!errors.phone}
          onChange={(e) => set({ phone: formatPhoneInput(e.target.value, data.phone) })}
          onFocus={() => !data.phone && set({ phone: '+7 (' })}
          onBlur={() => data.phone === '+7 (' && set({ phone: '' })}
          className={`bk-field ${errors.phone ? 'border-accent' : ''}`}
        />
      </Field>
      <Field label="Комментарий" icon={MessageSquare} hint="необязательно">
        <textarea value={data.comment} onChange={(e) => set({ comment: e.target.value })} rows={3} maxLength={300} placeholder="Пожелания, аллергии, предпочитаемая интенсивность массажа" className="bk-field resize-none" />
      </Field>
      <p className="text-xs text-neutral-600">Нажимая «Подтвердить запись», вы соглашаетесь на обработку персональных данных.</p>
    </div>
  )
}

/* ---------- Итог справа ---------- */
function Summary({ data, service, master }: { data: Data; service?: BookService; master?: Master }) {
  const rows = [
    { icon: Users, label: 'Гости', value: GUESTS.find((g) => g.id === data.guests)?.label },
    { icon: Sparkles, label: 'Мастер', value: data.masterId === 'any' ? 'Любой свободный' : master?.name },
    { icon: CalendarDays, label: 'Дата', value: data.date && fmtDate(data.date) },
    { icon: Clock, label: 'Время', value: data.time },
  ]
  return (
    <aside className="rounded-3xl border border-neutral-400 bg-secondary-100 p-5">
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Ваша запись</p>
      {service ? (
        <div className="mt-4 flex items-center gap-3">
          <img src={service.img} alt="" className="size-12 rounded-xl object-cover" />
          <span className="font-primary text-[17px] leading-snug text-neutral-800">{service.title}</span>
        </div>
      ) : (
        <p className="mt-4 text-sm text-neutral-600">Услуга не выбрана</p>
      )}
      <dl className="mt-5 space-y-3 border-t border-neutral-400 pt-5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start justify-between gap-3">
            <dt className="flex items-center gap-2 text-neutral-600">
              <r.icon className="size-4" />
              {r.label}
            </dt>
            <dd className={`text-right font-medium first-letter:uppercase ${r.value ? 'text-neutral-800' : 'text-neutral-500'}`}>{r.value || '—'}</dd>
          </div>
        ))}
      </dl>
      {service && (
        <div className="mt-5 flex items-end justify-between border-t border-neutral-400 pt-5">
          <span className="text-sm text-neutral-600">Стоимость</span>
          <span className="font-primary text-2xl text-accent">{fmt(priceFor(service, data.guests))}</span>
        </div>
      )}
    </aside>
  )
}

/* ---------- Экран успеха ---------- */
function Success({ data, service, master, onHome }: { data: Data; service: BookService; master?: Master; onHome: () => void }) {
  const code = `ZN-${Math.abs(Math.round(hash(data.phone + data.time) * 90000)) + 10000}`
  return (
    <div className="animate-bk-fade-in flex flex-col items-center px-2 py-2 text-center">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
        <span className="animate-bk-pop relative grid size-20 place-items-center rounded-full bg-accent text-white shadow-[0_20px_60px_-10px_rgba(156,99,75,.8)]">
          <Check className="size-10" strokeWidth={3} />
        </span>
      </div>
      <h2 className="mt-6 flex items-center gap-2 font-primary text-3xl text-neutral-800">
        Вы записаны <Sparkles className="size-6 text-accent" />
      </h2>
      <p className="mt-3 max-w-md text-neutral-700">
        {data.name.trim()}, спасибо! Мы отправим подтверждение в WhatsApp на номер {data.phone} и напомним о визите за день.
      </p>
      <div className="mt-6 w-full max-w-md rounded-3xl border border-accent/30 bg-accent/[.04] px-6 py-3 text-left">
        {[
          ['Услуга', service.title],
          ['Дата', data.date ? fmtDate(data.date) : ''],
          ['Время', data.time ?? ''],
          ['Мастер', data.masterId === 'any' ? 'Любой свободный' : master?.name ?? ''],
          ['Гость', data.name.trim()],
          ['Стоимость', fmt(priceFor(service, data.guests))],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-neutral-400/70 py-2.5 last:border-0">
            <span className="text-neutral-600">{k}</span>
            <span className="text-right font-medium text-neutral-800 first-letter:uppercase">{v}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-neutral-600">
        Номер записи: <b className="text-neutral-800">{code}</b>
      </p>
      <button type="button" onClick={onHome} className="bk-btn bk-btn-main mt-6 px-10">
        <Home className="size-5" /> Вернуться на сайт
      </button>
    </div>
  )
}

/* ---------- Модальное окно ---------- */
const empty: Data = { serviceId: null, guests: 'one', masterId: null, date: null, time: null, name: '', phone: '', comment: '' }

export default function BookingModal({ initialService, onClose }: { initialService: string | null; onClose: () => void }) {
  // Если пришли с карточки услуги или тарифа — сразу шаг «Мастер»
  const [step, setStep] = useState(initialService ? 1 : 0)
  const [data, setData] = useState<Data>({ ...empty, serviceId: initialService })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      getLenis()?.start()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const set: SetData = (patch) => {
    setData((d) => ({ ...d, ...patch }))
    setErrors({})
  }
  const service = BOOK_SERVICES.find((s) => s.id === data.serviceId)
  const master = MASTERS.find((m) => m.id === data.masterId)

  const canNext = [!!service, !!data.masterId, !!(data.date && data.time), true][step]
  const hints = ['Выберите услугу', 'Выберите мастера', data.date ? 'Выберите время' : 'Выберите дату', '']

  const next = () => {
    if (step < 3) return setStep(step + 1)
    const e: Record<string, string> = {}
    if (data.name.trim().length < 2) e.name = 'Введите имя — минимум 2 буквы'
    if (!phoneComplete(data.phone)) e.phone = 'Введите номер телефона полностью'
    setErrors(e)
    if (Object.keys(e).length) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setDone(true)
    }, 900)
  }

  return (
    <div className="fixed inset-0 z-[9000] flex items-end justify-center font-secondary sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Онлайн-запись">
      <div className="animate-bk-fade-in absolute inset-0 bg-overlay-product/70 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-bk-fade-up relative flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden bg-neutral-200 text-neutral-800 sm:h-auto sm:max-h-[92vh] sm:rounded-[32px] sm:border sm:border-neutral-400">
        <div className="flex items-center gap-4 border-b border-neutral-400 px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex-1">
            <p className="font-primary text-xl sm:text-2xl">{done ? 'Готово' : 'Онлайн-запись'}</p>
            {!done && (
              <p className="text-sm text-neutral-600">
                Шаг {step + 1} из 4 · {STEPS[step]}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="grid size-11 cursor-pointer place-items-center rounded-full border border-neutral-400 transition hover:rotate-90 hover:border-accent hover:text-accent">
            <X className="size-5" />
          </button>
        </div>

        {!done && (
          <ol className="flex gap-2 px-5 pt-5 sm:px-8">
            {STEPS.map((s, i) => (
              <li key={s} className="flex-1">
                <button type="button" disabled={i > step} onClick={() => setStep(i)} className="group w-full cursor-pointer text-left disabled:cursor-default">
                  <span className="block h-1 overflow-hidden rounded-full bg-neutral-400">
                    <span className={`block h-full rounded-full bg-accent transition-all duration-500 ${i <= step ? 'w-full' : 'w-0'}`} />
                  </span>
                  <span className={`mt-2 hidden items-center gap-1.5 text-xs font-medium transition sm:flex ${i === step ? 'text-neutral-800' : i < step ? 'text-accent group-hover:underline' : 'text-neutral-500'}`}>
                    {i < step && <Check className="size-3.5" />}
                    {s}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8" data-lenis-prevent>
          {done && service ? (
            <Success data={data} service={service} master={master} onHome={onClose} />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
              <div key={step}>
                {step === 0 && <StepService data={data} set={set} />}
                {step === 1 && service && <StepMaster data={data} set={set} service={service} />}
                {step === 2 && <StepDate data={data} set={set} />}
                {step === 3 && <StepDetails data={data} set={set} errors={errors} />}
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-0">
                  <Summary data={data} service={service} master={master} />
                </div>
              </div>
            </div>
          )}
        </div>

        {!done && (
          <div className="flex items-center gap-3 border-t border-neutral-400 bg-neutral-200/95 px-5 py-4 sm:px-8">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="bk-btn bk-btn-ghost px-5">
                <ArrowLeft className="size-4" /> <span className="hidden sm:inline">Назад</span>
              </button>
            ) : (
              <span />
            )}
            <div className="ml-auto hidden text-right text-sm sm:block">
              {service && (
                <>
                  <span className="text-neutral-600">Итого: </span>
                  <b className="font-primary text-lg font-normal text-accent">{fmt(priceFor(service, data.guests))}</b>
                </>
              )}
              {!canNext && <p className="text-xs text-neutral-600">{hints[step]}</p>}
            </div>
            <button type="button" onClick={next} disabled={!canNext || sending} className="bk-btn bk-btn-main ml-auto flex-1 sm:ml-0 sm:flex-none sm:px-8">
              {sending ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Отправляем…
                </>
              ) : step === 3 ? (
                <>
                  <Check className="size-5" /> Подтвердить запись
                </>
              ) : (
                <>
                  {canNext ? 'Далее' : hints[step]} <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
