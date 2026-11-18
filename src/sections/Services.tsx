import { useState } from 'react'
import { IconButton, Section, at } from '../components/ui'
import { SERVICES } from '../data/content'
import { CARD_TO_SERVICE } from '../booking/data'
import arrowLeftMuted from '../assets/icons/circle-arrow-left-muted.png'
import arrowRight from '../assets/icons/circle-arrow-right.png'

const TOP = 1900
// x карточек из макета: 485.1 / 869.1 / 1257.1 (зазоры 24 и 29px — как в Figma)
const CARD_X = [485.1, 869.1, 1257.1]
const TRACK_X = CARD_X[0]
const STEP = 384
// Карусель упирается в правый край фрейма: максимальный сдвиг = правый край последней карточки − 1440
const MAX_SHIFT = CARD_X[CARD_X.length - 1] + 359 - 1440

export default function Services() {
  const [shift, setShift] = useState(0)
  const canPrev = shift > 0
  const canNext = shift < MAX_SHIFT

  return (
    <Section top={TOP} height={720} id="services" className="overflow-hidden">
      <h2 className="display-9 w-[300px] text-neutral-800" style={at(75, 2065.5, TOP)}>Популярные услуги</h2>
      <p className="paragraph-lg w-[363px] text-neutral-700" style={at(75, 2209.5, TOP)}>
        Три процедуры, которые гости выбирают чаще всего. Каждая заканчивается чаем и временем для отдыха.
      </p>

      {/* Неактивная стрелка — в макете приглушённая (Neutrals/600), активная — тёмная */}
      <IconButton icon={canPrev ? arrowRight : arrowLeftMuted} label="Предыдущая услуга" disabled={!canPrev}
        className={canPrev ? 'rotate-180' : ''} onClick={() => setShift((s) => Math.max(0, s - STEP))} style={at(75.1, 2411.5, TOP)} />
      <IconButton icon={canNext ? arrowRight : arrowLeftMuted} label="Следующая услуга" disabled={!canNext}
        className={canNext ? '' : 'rotate-180'} onClick={() => setShift((s) => Math.min(MAX_SHIFT, s + STEP))} style={at(130.6, 2411.5, TOP)} />

      {/* Карточки уходят за левую границу карусели (x = 485), а не наезжают на заголовок */}
      <ul className="relative h-[530px] w-[1131px] transition-[transform,clip-path] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={at(TRACK_X, 1988.8, TOP, { transform: `translateX(${-shift}px)`, clipPath: `inset(0 0 0 ${shift}px)` })}>
        {SERVICES.map((s, i) => (
          <li key={s.title} style={{ width: s.width, left: CARD_X[i] - TRACK_X }} className="group absolute top-0">
            <a href="#booking" data-book={CARD_TO_SERVICE[s.title] ?? ''} className="block">
              <div className="h-[480px] overflow-hidden bg-neutral-300">
                <img src={s.img} alt={s.title} height={480} className="h-[480px] max-w-none object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ width: s.width }} />
              </div>
              <p className="mt-[17px] display-6 text-neutral-800">{s.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
