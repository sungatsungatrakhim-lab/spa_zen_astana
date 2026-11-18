import { useEffect, useRef, useState } from 'react'
import { ButtonLink, at } from '../components/ui'
import { NAV, PAGES } from '../data/content'
import logo from '../assets/icons/logo.png'
import chevron from '../assets/icons/chevron-down.png'

const TOP = 0

export default function Header() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])

  return (
    <header className="relative z-30">
      <div className="relative mx-auto h-[81px] w-[1440px]">
        <nav aria-label="Главное меню" className="absolute flex items-center gap-[10px]" style={at(70, 25, TOP)}>
          {NAV.map((item) =>
            item.dropdown ? (
              <div key={item.label} ref={ref} className="relative p-[4px]">
                <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((v) => !v)}
                  className="group flex cursor-pointer items-center gap-[6px] display-2 text-neutral-800">
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">{item.label}</span>
                  <img src={chevron} alt="" width={16} height={16} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
                {open && (
                  <div role="menu" className="absolute left-0 top-[42px] grid w-[560px] grid-cols-3 gap-x-[32px] gap-y-[10px] rounded-[16px] border border-neutral-400 bg-neutral-200 p-[24px] shadow-[0_16px_40px_rgba(52,43,32,0.12)]">
                    {[...PAGES.pages, ...PAGES.more, ...PAGES.extra].map((p) => (
                      <a key={p} role="menuitem" href="#" onClick={() => setOpen(false)} className="paragraph-md text-neutral-700 transition-colors hover:text-accent">{p}</a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={item.label} href={item.href} className="group p-[4px] display-2 text-neutral-800">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-bottom-left bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">{item.label}</span>
              </a>
            ),
          )}
        </nav>

        {/* Logo Text/Color: иконка 23.3px + «Zen» 20.23px, gap 8.99px */}
        <a href="#top" aria-label="Zen — на главную" className="flex items-center gap-[8.99px]" style={at(657.4, 27.2, TOP)}>
          <img src={logo} alt="" width={30} height={28} className="-ml-[3px] -my-[2px]" />
          <span className="font-primary text-[20.229px] leading-[1.25] text-neutral-800 -ml-[3px]">Zen</span>
        </a>

        <div className="absolute right-[75px] top-[17px] flex items-center gap-[4px]">
          <ButtonLink variant="secondary" href="#login">Войти</ButtonLink>
        <ButtonLink variant="primary" href="#contacts" className="min-w-0! shadow-[0px_4px_4px_rgba(35,136,255,0.1)]" >Связаться</ButtonLink>
        </div>
      </div>
      <div aria-hidden className="absolute left-0 top-[80px] h-px w-full bg-neutral-500" />
    </header>
  )
}
