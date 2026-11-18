import { useState } from 'react'
import { IconButton, Section, at } from '../components/ui'
import { TESTIMONIALS } from '../data/content'
import arrowLeftMuted from '../assets/icons/circle-arrow-left-muted.png'
import arrowRight from '../assets/icons/circle-arrow-right.png'

const TOP = 5592

export default function Testimonials() {
  const [i, setI] = useState(0)
  const t = TESTIMONIALS[i]
  const canPrev = i > 0
  // В макете следующая стрелка активна — слайдер рассчитан на несколько отзывов (добавьте их в content.ts)
  const canNext = i < TESTIMONIALS.length - 1

  return (
    <Section top={TOP} height={1008} id="testimonials">
      <h2 className="display-9 w-[884.5px] text-center text-neutral-800" style={at(277.75, 5682, TOP)}>Что говорят наши гости</h2>

      <div aria-hidden className="h-[732.7px] w-[1290px] bg-secondary-200/50" style={at(75, 5778, TOP)} />
      <figure key={i} className="contents">
        <img src={t.img} alt={t.name} width={520} height={733} className="object-cover" data-rv="img" data-par="30" style={at(75, 5778, TOP)} />
        <blockquote data-rv="" className="display-8 w-[630px] text-neutral-800" style={at(655, 5940.5, TOP)}>{t.quote}</blockquote>
        <p data-rv="" className="paragraph-lg w-[330px] text-neutral-700" style={at(655, 6142.5, TOP)}>{t.text}</p>
        <img src={t.imgSmall} alt="" width={263} height={294} className="object-cover" data-rv="img" data-par="-45" style={at(1022, 6149, TOP)} />
        <figcaption data-rv="" className="flex items-center gap-[12px]" style={at(655, 6422.7, TOP)}>
          <span className="display-3 text-neutral-800">{t.name}</span>
          <span aria-hidden className="h-px w-[14.1px] bg-neutral-500" />
          <span className="display-3 text-neutral-600">{t.place}</span>
        </figcaption>
      </figure>

      <IconButton icon={canPrev ? arrowRight : arrowLeftMuted} className={canPrev ? 'rotate-180' : ''} label="Предыдущий отзыв"
        disabled={!canPrev} onClick={() => setI((v) => v - 1)} style={at(1189.5, 5849, TOP)} />
      <IconButton icon={arrowRight} label="Следующий отзыв" disabled={!canNext}
        className="disabled:opacity-100" onClick={() => setI((v) => v + 1)} style={at(1245, 5849, TOP)} />
    </Section>
  )
}
