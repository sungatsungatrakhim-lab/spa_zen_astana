import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ARTICLES, PAGES, PLANS, PRODUCTS, SERVICES, TESTIMONIALS } from '../data/content'
import { CARD_TO_SERVICE } from '../booking/data'
import hero from '../assets/img/hero.webp'
import about from '../assets/img/about.webp'
import booking from '../assets/img/booking.webp'
import banner from '../assets/img/banner.webp'
import arch1 from '../assets/img/arch-1.webp'
import arch2 from '../assets/img/arch-2.webp'
import arch3 from '../assets/img/arch-3.webp'
import ctaBath from '../assets/img/cta-bath.webp'
import ctaInstagram from '../assets/img/cta-instagram.webp'
import logo from '../assets/icons/logo.png'
import checkCircle from '../assets/icons/check-circle.png'
import fb from '../assets/icons/social-facebook.png'
import ig from '../assets/icons/social-instagram.png'
import li from '../assets/icons/social-linkedin.png'
import yt from '../assets/icons/social-youtube.png'

/*
  Мобильная версия (экраны до 900px). Вместо уменьшенной копии десктопного холста —
  обычная вёрстка в одну колонку: крупный читаемый текст, кнопки под палец, карусели свайпом.
  Анимации появления — те же атрибуты data-sec / data-rv, что и на десктопе.
*/

const SOCIAL = [
  { label: 'Facebook', icon: fb, href: 'https://facebook.com' },
  { label: 'Instagram', icon: ig, href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: li, href: 'https://linkedin.com' },
  { label: 'YouTube', icon: yt, href: 'https://youtube.com' },
]

const MENU = [
  { label: 'О нас', href: '#m-about' },
  { label: 'Услуги', href: '#m-services' },
  { label: 'Цены', href: '#m-booking' },
  { label: 'Спа-косметика', href: '#m-products' },
  { label: 'Отзывы', href: '#m-reviews' },
  { label: 'Статьи', href: '#m-articles' },
]

function Btn({ children, href = '#', book, light, className = '' }: { children: ReactNode; href?: string; book?: string; light?: boolean; className?: string }) {
  const base = 'inline-flex h-[50px] items-center justify-center rounded-full px-6 font-primary text-[16px] transition active:scale-[.97]'
  const look = book !== undefined
    ? 'bg-accent text-white'
    : light
      ? 'border border-white/70 text-white'
      : 'border border-neutral-800 text-neutral-800'
  return (
    <a href={href} data-book={book} className={`${base} ${look} ${className}`}>
      {children}
    </a>
  )
}

function H2({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-primary text-[34px] leading-[1.12] tracking-[-0.01em] text-neutral-800 ${className}`}>{children}</h2>
}

function Sec({ id, children, className = '' }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} data-sec className={`px-5 py-14 ${className}`}>
      {children}
    </section>
  )
}

/* ---------- Шапка ---------- */
function MobileHeader({ show }: { show: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])
  return (
    <>
      <header className={`m-header ${show || open ? 'on' : ''}`}>
        <a href="#m-top" className="flex items-center gap-2 font-primary text-[22px] text-neutral-800" aria-label="Zen — наверх" onClick={() => setOpen(false)}>
          <img src={logo} alt="" width={22} height={23} /> Zen
        </a>
        <div className="flex items-center gap-2">
          <a href="#booking" data-book="" className="inline-flex h-10 items-center rounded-full bg-accent px-4 font-primary text-[15px] text-white">
            Запись
          </a>
          <button type="button" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-full border border-neutral-500">
            <span className="relative block h-3 w-[18px]">
              <span className={`absolute left-0 h-[1.5px] w-full bg-neutral-800 transition-all ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-[1.5px] w-full bg-neutral-800 transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-[1.5px] w-full bg-neutral-800 transition-all ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </header>
      <nav className={`m-menu ${open ? 'on' : ''}`} aria-label="Меню" aria-hidden={!open} inert={!open || undefined}>
        {MENU.map((m, i) => (
          <a key={m.href} href={m.href} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${60 + i * 45}ms` : '0ms' }}
            className="block border-b border-neutral-400 py-4 font-primary text-[28px] text-neutral-800">
            {m.label}
          </a>
        ))}
        <div className="mt-8 flex gap-4">
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-11 place-items-center rounded-full border border-neutral-400">
              <img src={s.icon} alt="" width={18} height={18} />
            </a>
          ))}
        </div>
        <p className="mt-6 text-[15px] text-neutral-600">Астана · ежедневно 09:00–23:00<br />+7 701 000 00 00</p>
      </nav>
    </>
  )
}

/* ---------- Отзывы ---------- */
function Reviews() {
  const [i, setI] = useState(0)
  const t = TESTIMONIALS[i]
  const n = TESTIMONIALS.length
  return (
    <Sec id="m-reviews" className="bg-secondary-100">
      <H2>Что говорят наши гости</H2>
      <img src={t.img} alt={t.name} className="mt-7 aspect-[4/5] w-full rounded-[24px] object-cover" loading="lazy" />
      <div key={i} className="m-fade">
        <blockquote className="mt-7 font-primary text-[24px] leading-[1.3] text-neutral-800">{t.quote}</blockquote>
        <p className="mt-4 text-[16px] leading-[1.6] text-neutral-700">{t.text}</p>
        <p className="mt-5 font-primary text-[18px] text-neutral-800">{t.name}</p>
        <p className="text-[14px] text-neutral-600">{t.place}</p>
      </div>
      {n > 1 && (
        <div className="mt-6 flex gap-3">
          <button type="button" aria-label="Предыдущий отзыв" onClick={() => setI((i - 1 + n) % n)} className="grid size-11 place-items-center rounded-full border border-neutral-800">←</button>
          <button type="button" aria-label="Следующий отзыв" onClick={() => setI((i + 1) % n)} className="grid size-11 place-items-center rounded-full border border-neutral-800">→</button>
        </div>
      )}
    </Sec>
  )
}

/* ---------- Тарифы ---------- */
function Plans() {
  const [open, setOpen] = useState(0)
  return (
    <Sec id="m-booking">
      <H2>Запись на процедуру</H2>
      <img src={booking} alt="Массажный стол в комнате с аркой" className="mt-7 aspect-[9/10] w-full rounded-t-full object-cover" loading="lazy" />
      <div className="mt-6">
        {PLANS.map((p, i) => {
          const on = open === i
          return (
            <div key={p.name} className="border-b border-neutral-400">
              <button type="button" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)} className="flex w-full items-center justify-between py-5 text-left">
                <span className={`font-primary text-[26px] ${on ? 'text-neutral-800' : 'text-neutral-600'}`}>{p.name}</span>
                <span className={`grid size-9 place-items-center rounded-full border text-[20px] transition ${on ? 'rotate-45 border-accent text-accent' : 'border-neutral-500 text-neutral-700'}`}>+</span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-400 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="text-[16px] leading-[1.6] text-neutral-700">{p.text}</p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-[15px] text-neutral-700">
                        <img src={checkCircle} alt="" width={18} height={18} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 mb-6 flex items-center justify-between gap-3">
                    <p className="font-primary text-[28px] text-neutral-800">
                      {p.price}
                    </p>
                    <Btn book={p.name}>Записаться</Btn>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Sec>
  )
}

/* ---------- Сайт ---------- */
export default function MobileSite({ headerOn }: { headerOn: boolean }) {
  const track = useRef<HTMLUListElement>(null)
  return (
    <div className="m-site bg-neutral-200 font-secondary text-neutral-800">
      <MobileHeader show={headerOn} />

      {/* Первый экран */}
      <Sec id="m-top" className="pt-24">
        <h1 className="font-primary text-[44px] leading-[1.05] tracking-[-0.02em]">Спа-ритуалы для вашего покоя</h1>
        <p className="mt-5 text-[17px] leading-[1.6] text-neutral-700">Массаж, уход за лицом и ритуалы для тела — в тишине и с заботой о каждой детали.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Btn book="">Запись</Btn>
          <Btn href="#m-services">Все услуги</Btn>
        </div>
        <img src={hero} alt="Мастер делает расслабляющий массаж головы" className="mt-9 aspect-[4/5] w-full rounded-[28px] object-cover" />
      </Sec>

      {/* О нас */}
      <Sec id="m-about" className="bg-secondary-100">
        <img src={about} alt="Спокойный интерьер спа" className="aspect-[4/5] w-full rounded-t-full object-cover" loading="lazy" />
        <H2 className="mt-8">О массаже</H2>
        <p className="mt-4 text-[17px] leading-[1.65] text-neutral-700">
          Мы создали Zen как место, где можно остановиться и выдохнуть. Наши мастера сочетают классические техники массажа с натуральными маслами и тёплыми камнями, чтобы снять напряжение и вернуть телу лёгкость.
        </p>
        <p className="mt-4 text-[17px] leading-[1.65] text-neutral-700">Каждый визит начинается с короткой беседы — так мы подбираем процедуру именно под вас.</p>
      </Sec>

      {/* Услуги */}
      <Sec id="m-services">
        <H2>Популярные услуги</H2>
        <p className="mt-4 text-[17px] leading-[1.6] text-neutral-700">Три процедуры, которые гости выбирают чаще всего. Каждая заканчивается чаем и временем для отдыха.</p>
        <ul ref={track} className="m-snap mt-7 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
          {SERVICES.map((s) => (
            <li key={s.title} className="w-[78%] shrink-0 snap-center">
              <a href="#booking" data-book={CARD_TO_SERVICE[s.title] ?? ''} className="block">
                <img src={s.img} alt={s.title} className="aspect-[3/4] w-full rounded-[22px] object-cover" loading="lazy" />
                <p className="mt-4 flex items-center justify-between font-primary text-[22px]">
                  {s.title} <span className="grid size-9 place-items-center rounded-full bg-accent text-[16px] text-white">→</span>
                </p>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-neutral-600">Листайте вбок →</p>
      </Sec>

      <Plans />

      {/* Баннер */}
      <section data-sec className="relative overflow-hidden px-5 py-20 text-center">
        <img src={banner} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-overlay-product/55" aria-hidden />
        <h2 className="relative font-primary text-[32px] leading-[1.15] text-white">Пора позаботиться о себе? Запишитесь уже сегодня</h2>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Btn book="">Запись</Btn>
          <Btn href="#m-services" light>Все услуги</Btn>
        </div>
      </section>

      {/* Спа-косметика */}
      <Sec id="m-products">
        <H2>Спа-косметика</H2>
        <p className="mt-4 text-[17px] leading-[1.6] text-neutral-700">Масла, соли и инструменты, которые мы используем в кабинетах, — теперь и для дома.</p>
        <ul className="mt-7 grid grid-cols-2 gap-3">
          {PRODUCTS.map((p) => (
            <li key={p.name} className="relative overflow-hidden rounded-[18px]">
              <img src={p.img} alt={p.name} className="aspect-[3/4] w-full object-cover" loading="lazy" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-8 pb-3 font-primary text-[17px] leading-tight text-white">{p.name}</span>
            </li>
          ))}
        </ul>
      </Sec>

      <Reviews />

      {/* Instagram */}
      <Sec>
        <div className="grid grid-cols-3 items-end gap-2">
          {[arch1, arch2, arch3].map((src, i) => (
            <a key={src} href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Zen в Instagram"
              className={`block overflow-hidden rounded-full ${i === 1 ? 'mb-0' : 'mb-8'}`}>
              <img src={src} alt="" className="aspect-[1/2] w-full object-cover" loading="lazy" />
            </a>
          ))}
        </div>
        <H2 className="mt-9">Мы в Instagram</H2>
        <p className="mt-4 text-[17px] leading-[1.6] text-neutral-700">Делимся ритуалами, новинками и тихими моментами из жизни спа.</p>
        <Btn href="https://instagram.com" className="mt-6">@Zen</Btn>
      </Sec>

      {/* Статьи */}
      <Sec id="m-articles" className="bg-secondary-100">
        <H2>Статьи и новости</H2>
        <ul className="mt-7 flex flex-col gap-9">
          {ARTICLES.map((a) => (
            <li key={a.title}>
              <img src={a.img} alt="" className="aspect-[4/3] w-full rounded-[22px] object-cover" loading="lazy" />
              <p className="mt-4 text-[13px] tracking-[0.08em] text-accent uppercase">
                {a.category} · {a.date}
              </p>
              <h3 className="mt-2 font-primary text-[22px] leading-[1.3]">{a.title}</h3>
            </li>
          ))}
        </ul>
      </Sec>

      {/* Подвал */}
      <footer data-sec className="px-5 pt-14 pb-10">
        <div className="grid grid-cols-2 gap-3">
          <img src={ctaBath} alt="Ванна для гидротерапии" className="aspect-square w-full rounded-[18px] object-cover" loading="lazy" />
          <img src={ctaInstagram} alt="" className="aspect-square w-full rounded-[18px] object-cover" loading="lazy" />
        </div>
        <H2 className="mt-8">Спокойствие в руках опытных мастеров</H2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Btn book="">Запись</Btn>
          <Btn href="#m-services">Все услуги</Btn>
        </div>
        <div className="mt-12 border-t border-neutral-400 pt-8">
          <p className="font-primary text-[18px]">Мы в соцсетях</p>
          <div className="mt-4 flex gap-3">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="grid size-11 place-items-center rounded-full border border-neutral-400">
                <img src={s.icon} alt="" width={18} height={18} />
              </a>
            ))}
          </div>
          <p className="mt-8 font-primary text-[18px]">Страницы</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[15px] text-neutral-700">
            {PAGES.pages.slice(0, 8).map((p) => (
              <li key={p}>
                <a href="#">{p}</a>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[15px] leading-[1.6] text-neutral-700">Астана, ул. Достык, 12 · ежедневно 09:00–23:00<br />+7 701 000 00 00</p>
          <div className="mt-8 flex items-center gap-2 font-primary text-[24px]">
            <img src={logo} alt="" width={24} height={25} /> Zen
          </div>
          <p className="mt-3 text-[13px] text-neutral-600">© Zen · Дизайн: BRIX Templates</p>
        </div>
      </footer>
    </div>
  )
}
