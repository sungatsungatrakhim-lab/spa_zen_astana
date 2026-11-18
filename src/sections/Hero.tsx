import { ButtonLink, Section, at } from '../components/ui'
import hero from '../assets/img/hero.webp'

const TOP = 81 // секция под шапкой; линия-разделитель на y = 935

export default function Hero() {
  return (
    <div className="relative">
      {/* Line 10 — на всю ширину, под фото (в макете фото перекрывает линию) */}
      <div aria-hidden className="absolute left-0 h-px w-full bg-neutral-500" style={{ top: 935 - TOP }} />
      <Section top={TOP} height={855} id="top">
        <img src={hero} alt="Мастер делает расслабляющий массаж головы" width={705} height={860}
          className="pointer-events-none select-none object-cover" style={at(735, 80, TOP)} fetchPriority="high" />

        <h1 className="display-10 w-[630px] text-neutral-800" style={at(75, 177.5, TOP)}>
          Спа-ритуалы для вашего покоя
        </h1>
        <p className="paragraph-lg w-[531px] text-neutral-700" style={at(75, 686.5, TOP)}>
          Массаж, уход за лицом и ритуалы для тела — в тишине и с заботой о каждой детали.
        </p>
        <ButtonLink href="#booking" data-book="" style={at(75, 762.8, TOP)}>Запись</ButtonLink>
        <ButtonLink href="#services" variant="secondary" style={at(208.4, 761.8, TOP)}>Все услуги</ButtonLink>
      </Section>
    </div>
  )
}
