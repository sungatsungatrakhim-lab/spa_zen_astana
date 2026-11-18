import type { CSSProperties } from 'react'
import { ButtonLink, Section, at } from '../components/ui'
import arch1 from '../assets/img/arch-1.webp'
import arch2 from '../assets/img/arch-2.webp'
import arch3 from '../assets/img/arch-3.webp'

const TOP = 6600

// Три фото в арочных («пилюля») масках — как в макете (Group 39544, 851×723 от x=74, y=6690).
// Арки открываются снизу вверх по очереди, фото внутри мягко отъезжают.
const ARCHES = [
  { src: arch1, alt: 'Маска для лица из глины', x: 0, y: 15, w: 296, h: 612, d: 0 },
  { src: arch2, alt: 'Керамическая ваза и свеча', x: 287, y: 111, w: 276, h: 612, d: 180 },
  { src: arch3, alt: 'Расслабляющий массаж спины', x: 563, y: 0, w: 288, h: 612, d: 360 },
]

export default function Instagram() {
  return (
    <Section top={TOP} height={903}>
      <div className="arch-wrap" style={at(74, 6690, TOP, { width: 851, height: 723 })}>
        {ARCHES.map((a) => (
          <a
            key={a.src}
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${a.alt} — Zen в Instagram`}
            data-cursor="view"
            className="arch"
            style={{ left: a.x, top: a.y, width: a.w, height: a.h, '--arch-d': `${a.d}ms` } as CSSProperties}
          >
            <img src={a.src} alt={a.alt} loading="lazy" />
          </a>
        ))}
      </div>

      <h2 className="display-9 w-[380px] text-neutral-800" style={at(985.2, 6913.4, TOP)}>Мы в Instagram</h2>
      <p className="paragraph-lg w-[380px] text-neutral-700" style={at(985.2, 7057.4, TOP)}>
        Делимся ритуалами, новинками и тихими моментами из жизни спа.
      </p>
      <ButtonLink href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={at(985.2, 7143.6, TOP)}>@Zen</ButtonLink>
    </Section>
  )
}
