import { ButtonLink, Section, at } from '../components/ui'
import { ARTICLES } from '../data/content'
import arrowRight from '../assets/icons/circle-arrow-right.png'

const TOP = 7503
const GRID_X = 75.1
const COL_W = 430.1 // колонки разделены вертикальными линиями 1px

export default function Articles() {
  return (
    <Section top={TOP} height={926} id="articles">
      <h2 className="display-9 whitespace-nowrap text-neutral-800" style={at(75.1, 7593, TOP)}>Статьи и новости</h2>
      <ButtonLink href="#articles" variant="secondary" style={at(1195.7, 7600.8, TOP)}>Все статьи</ButtonLink>

      {/* Сетка: линии сверху (y 7688) и снизу (y 8248.9), вертикальные — между колонками */}
      <div className="h-[560.9px] w-[1290.4px] border-y border-neutral-500" style={at(75, 7688, TOP)} />
      {[0, 1, 2, 3].map((c) => (
        <div key={c} aria-hidden className="h-[560.9px] w-px bg-neutral-500" style={at(GRID_X + c * COL_W - 0.5, 7688, TOP)} />
      ))}

      <ul>
        {ARTICLES.map((a, i) => {
          const left = GRID_X + i * COL_W
          return (
            <li key={a.title} className="group w-[430px] h-[560.9px]" style={at(left, 7688, TOP)}>
              <a href="#articles" className="absolute inset-0" aria-label={a.title} />
              <div className="pointer-events-none absolute left-[31.5px] top-[35px] h-[289.8px] w-[366.5px] overflow-hidden">
                <img src={a.img} alt="" width={366} height={290} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <h3 className="pointer-events-none absolute left-[31.8px] top-[347.1px] w-[366.5px] display-6 text-neutral-800 transition-colors group-hover:text-accent">{a.title}</h3>
              <p className="pointer-events-none absolute left-[31.8px] top-[501.2px] flex items-center gap-[12px] display-3">
                <span className="text-neutral-800">{a.category}</span>
                <span aria-hidden className="h-px w-[14.1px] bg-neutral-500" />
                <span className="text-neutral-600">{a.date}</span>
              </p>
              <img src={arrowRight} alt="" width={40} height={40} className="pointer-events-none absolute left-[358.2px] top-[491.2px] transition-transform duration-200 group-hover:translate-x-[3px]" />
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
