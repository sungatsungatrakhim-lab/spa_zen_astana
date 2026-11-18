import { useState, type FormEvent } from 'react'
import { PAGES } from '../data/content'
import logoLg from '../assets/icons/logo-lg.png'
import fb from '../assets/icons/social-facebook.png'
import ig from '../assets/icons/social-instagram.png'
import li from '../assets/icons/social-linkedin.png'
import yt from '../assets/icons/social-youtube.png'

// Footer V1: высота 984.535, координаты — от верха футера (y страницы 8429)
const H = 984.535
const CUT = 378 // высота удалённого верхнего блока «Спокойствие в руках опытных мастеров»
const ROW = 42 // шаг строк в колонках ссылок

const COLS = [
  { x: 735.8, items: PAGES.pages },
  { x: 890.8, items: PAGES.more },
  { x: 1045.4, items: PAGES.extra, extra: true },
]

const SOCIAL = [
  { label: 'Facebook', icon: fb, x: 75, href: 'https://facebook.com' },
  { label: 'Instagram', icon: ig, x: 111, href: 'https://instagram.com' },
  { label: 'LinkedIn', icon: li, x: 147, href: 'https://linkedin.com' },
  { label: 'YouTube', icon: yt, x: 183, href: 'https://youtube.com' },
]

export default function Footer() {
  return (
    <footer id="contacts" className="relative overflow-hidden bg-secondary-100" style={{ height: H - CUT }}>
      {/* Верхний CTA-блок удалён: содержимое сдвинуто вверх на CUT, координаты остальных элементов прежние */}
      <div data-sec className="relative mx-auto w-[1440px]" style={{ height: H, marginTop: -CUT, marginBottom: 0 }}>
        {/* Блок логотипа: Neutrals/300, слева от вертикальной линии, до левого края экрана */}
        <div aria-hidden className="absolute bottom-0 right-[815px] w-[3000px] bg-neutral-300" style={{ top: 813.4 }} />
        <div aria-hidden className="absolute bottom-0 w-px bg-neutral-500" style={{ left: 624.5, top: 378.3 }} />

        {/* Подписка */}
        <h3 className="absolute display-7 whitespace-nowrap text-neutral-800" style={{ left: 75, top: 484 }}>Подпишитесь на рассылку</h3>
        <p className="absolute paragraph-lg w-[476px] text-neutral-700" style={{ left: 75, top: 541 }}>
          Раз в месяц — советы мастеров, новые ритуалы и специальные предложения.
        </p>
        <Newsletter />
        <ul className="absolute flex" style={{ left: 75, top: 686.9 }}>
          {SOCIAL.map((s) => (
            <li key={s.label} className="absolute size-[20px]" style={{ left: s.x - 75 }}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="block transition-opacity hover:opacity-70">
                <img src={s.icon} alt="" width={20} height={20} />
              </a>
            </li>
          ))}
        </ul>

        {/* Колонки ссылок */}
        <p className="absolute display-2 text-neutral-800" style={{ left: 736, top: 432.4 }}>Страницы</p>
        <p className="absolute display-2 text-neutral-800" style={{ left: 1209.5, top: 432.4 }}>Служебные</p>
        {COLS.map((col) => (
          <ul key={col.x} className="absolute" style={{ left: col.x, top: 492.4 }}>
            {col.items.map((item, r) => (
              <li key={item} className="absolute whitespace-nowrap" style={{ top: r * ROW }}>
                <a href="#" className="paragraph-lg text-neutral-700 transition-colors hover:text-accent">{item}</a>
              </li>
            ))}
            {col.extra && (
              <li className="absolute whitespace-nowrap" style={{ top: 4 * ROW }}>
                <a href="#" className="block paragraph-lg text-neutral-700 underline decoration-solid underline-offset-[3px] transition-colors hover:text-accent">
                  Ещё<br />шаблоны
                </a>
              </li>
            )}
          </ul>
        ))}
        <ul className="absolute" style={{ left: 1209.2, top: 492.4 }}>
          {PAGES.utility.map((item, r) => (
            <li key={item} className="absolute whitespace-nowrap" style={{ top: r * ROW }}>
              <a href="#" className="paragraph-lg text-neutral-700 transition-colors hover:text-accent">{item}</a>
            </li>
          ))}
        </ul>

        {/* Логотип */}
        <a href="#top" aria-label="Zen — наверх" className="absolute flex items-center gap-[14.476px]" style={{ left: 255.5, top: 874.8 }}>
          <img src={logoLg} alt="" width={37} height={38} />
          <span className="font-primary text-[32.571px] leading-[1.25] text-neutral-800">Zen</span>
        </a>

        <p className="absolute whitespace-nowrap paragraph-lg text-neutral-700" style={{ left: 733.8, top: 903.4 }}>
          © Zen | Дизайн: <a href="https://brixtemplates.com" className="text-neutral-800 underline">BRIX Templates</a> · Работает на{' '}
          <a href="https://webflow.com" className="text-neutral-800 underline">Webflow</a>
        </p>
      </div>
    </footer>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'done' : 'error')
  }

  return (
    <form onSubmit={submit} noValidate className="absolute w-[376px]" style={{ left: 75, top: 614.6 }}>
      <div className={`flex min-h-[48px] items-center justify-between rounded-[200px] border bg-transparent py-[8px] pr-[8px] pl-[16px] shadow-input transition-colors focus-within:border-neutral-600 ${state === 'error' ? 'border-accent' : 'border-neutral-400'}`}>
        <label htmlFor="newsletter-email" className="sr-only">Электронная почта</label>
        <input id="newsletter-email" type="email" autoComplete="email" placeholder="Ваш e-mail" value={email}
          onChange={(e) => { setEmail(e.target.value); if (state !== 'idle') setState('idle') }}
          className="min-w-0 flex-1 bg-transparent display-1 text-neutral-800 outline-none placeholder:text-neutral-700" />
        <button type="submit" className="shrink-0 cursor-pointer rounded-[54px] bg-accent px-[16px] py-[8px] display-1-medium text-white transition-colors hover:bg-[#8a5640] active:scale-[0.98]">
          Подписаться
        </button>
      </div>
      <p role="status" aria-live="polite" className={`absolute top-[54px] left-[16px] display-1 ${state === 'error' ? 'text-accent' : 'text-neutral-700'}`}>
        {state === 'error' && 'Введите корректный e-mail.'}
        {state === 'done' && 'Спасибо за подписку!'}
      </p>
    </form>
  )
}
