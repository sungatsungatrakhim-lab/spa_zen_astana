import { ButtonLink, Section, at } from '../components/ui'
import { SOCIALS } from '../data/content'
import banner from '../assets/img/banner.webp'
import arrowWhite from '../assets/icons/circle-arrow-right-white.png'

const TOP = 3626

export default function Banner() {
  return (
    <Section top={TOP} height={821}>
      <div className="h-[636px] w-[1290px] overflow-hidden" style={at(75, 3716, TOP)}>
        <img src={banner} alt="" width={1290} height={636} className="pointer-events-none select-none" />
        {/* Element: Neutrals/800, opacity 40% */}
        <div aria-hidden className="absolute inset-0 bg-neutral-800/40" />
      </div>

      <h2 className="display-9 w-[870.75px] text-center text-white" style={at(304.25, 3929, TOP)}>
        Пора позаботиться о себе?
        <br />
        Запишитесь уже сегодня
      </h2>
      <ButtonLink href="#booking" data-book="" style={at(589, 4083.1, TOP)}>Запись</ButtonLink>
      <ButtonLink href="#services" variant="secondary-light" style={at(722.4, 4082.3, TOP)}>Все услуги</ButtonLink>

      {SOCIALS.map((s) => (
        <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-[16px]" style={at(s.x, 4264, TOP)}>
          <span className="display-6 text-white">{s.label}</span>
          <img src={arrowWhite} alt="" width={40} height={40} className="transition-transform duration-200 group-hover:translate-x-[4px]" />
        </a>
      ))}
    </Section>
  )
}

