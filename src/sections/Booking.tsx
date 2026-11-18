import { useState } from 'react'
import { ButtonLink, Section, at } from '../components/ui'
import { PLANS } from '../data/content'
import booking from '../assets/img/booking.webp'
import checkCircle from '../assets/icons/check-circle.png'
import minus from '../assets/icons/circle-minus.png'
import plus from '../assets/icons/circle-plus.png'

const TOP = 2620

export default function Booking() {
  const [open, setOpen] = useState(0) // в макете раскрыт Silver

  return (
    <Section top={TOP} height={1006} id="booking">
      <h2 className="display-9 w-[561px] whitespace-nowrap text-center text-neutral-800" style={at(439.5, 2709.5, TOP)}>Запись на процедуру</h2>
      <img src={booking} alt="Массажный стол в комнате с аркой" width={630} height={700} style={at(75, 2836, TOP)} />

      {/* Аккордеон тарифов: x 772, ширина 593 */}
      <div className="w-[593px]" style={at(772, 2897.6, TOP)}>
        {PLANS.map((plan, i) => {
          const isOpen = open === i
          const panelId = `plan-${plan.name}`
          return (
            <div key={plan.name} className={i > 0 ? 'border-t border-neutral-500 pt-[26px]' : ''}>
              <h3>
                <button type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group flex w-full cursor-pointer items-start justify-between text-left">
                  <span className={`display-7 h-[46.3px] transition-colors duration-200 ${isOpen ? 'text-neutral-800' : 'text-neutral-600 group-hover:text-neutral-800'}`}>{plan.name}</span>
                  <img src={isOpen ? minus : plus} alt="" width={35} height={35} className="mt-[5.7px] transition-transform duration-200 group-hover:scale-105" />
                </button>
              </h3>
              <div id={panelId} role="region" aria-label={plan.name}
                className={`grid transition-[grid-template-rows] duration-400 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                  <p className="mt-[8.9px] w-[513px] paragraph-lg text-neutral-700">{plan.text}</p>
                  <ul className="mt-[20.4px] flex flex-col gap-[12px]">
                    {plan.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-[8px] paragraph-md text-neutral-700">
                        <img src={checkCircle} alt="" width={20} height={20} />{b}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-[16.5px] display-7 text-neutral-800">{plan.price}</p>
                  <ButtonLink href="#booking" data-book={plan.name} className="mt-[25.6px] ml-px">Записаться</ButtonLink>
                </div>
              </div>
              <div className={isOpen ? 'h-[47.9px]' : 'h-[25.4px]'} />
            </div>
          )
        })}
      </div>
    </Section>
  )
}
