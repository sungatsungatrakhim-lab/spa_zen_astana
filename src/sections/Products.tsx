import { useState } from 'react'
import { Section, at } from '../components/ui'
import { PRODUCTS } from '../data/content'
import arrowWhite from '../assets/icons/circle-arrow-right-white-sm.png'

const TOP = 4447

export default function Products() {
  // В макете показано активное (hover) состояние первой плитки: затемнение #261F17 40%, подпись и стрелка.
  // По умолчанию оно у «Moisturizers», при наведении переходит на плитку под курсором.
  const [active, setActive] = useState(0)

  return (
    <Section top={TOP} height={1145} id="products">
      <h2 className="display-9 w-[343px] whitespace-nowrap text-neutral-800" style={at(75, 4537.5, TOP)}>Спа-косметика</h2>
      <p className="paragraph-lg w-[463px] text-neutral-700" style={at(902, 4542.5, TOP)}>
        Масла, соли и инструменты, которые мы используем в кабинетах, — теперь и для дома.
      </p>

      <ul onMouseLeave={() => setActive(0)}>
        {PRODUCTS.map((p, i) => {
          const on = active === i
          return (
            <li key={p.name} className="h-[420px] overflow-hidden" style={at(p.x, p.y, TOP, { width: p.w })}
              onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <a href="#" className="relative block h-full w-full" aria-label={p.name}>
                <img src={p.img} alt={p.name} width={p.w} height={420} className={`h-full w-full object-cover transition-transform duration-700 ${on ? 'scale-[1.02]' : ''}`} />
                <div aria-hidden className={`absolute inset-0 bg-overlay-product/40 transition-opacity duration-300 ${on ? 'opacity-100' : 'opacity-0'}`} />
                {/* Подпись: x +25, низ −19; стрелка 35px: правый отступ 26 */}
                <span className={`absolute left-[25px] bottom-[19.6px] display-6 whitespace-nowrap text-white transition-[opacity,transform] duration-300 ${on ? 'translate-y-0 opacity-100' : 'translate-y-[8px] opacity-0'}`}>{p.name}</span>
                <img src={arrowWhite} alt="" width={35} height={35} className={`absolute right-[26px] bottom-[18.4px] transition-[opacity,transform] duration-300 ${on ? 'translate-y-0 opacity-100' : 'translate-y-[8px] opacity-0'}`} />
              </a>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
