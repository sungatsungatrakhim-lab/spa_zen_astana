import { Section, at } from '../components/ui'
import about from '../assets/img/about.webp'

const TOP = 936

export default function About() {
  return (
    <Section top={TOP} height={964} id="about">
      {/* Element: Secondary Colors/200, opacity 50% */}
      <div aria-hidden className="h-[568px] w-[690px] bg-secondary-200/50" style={at(595, 1240, TOP)} />
      <img src={about} alt="Спокойный интерьер спа с лестницей и полотенцами" width={551} height={568} style={at(155, 1116, TOP)} />

      <h2 className="display-9 w-[397px] text-neutral-800" style={at(775, 1384.5, TOP)}>О массаже</h2>
      <p className="paragraph-lg w-[437px] text-neutral-700" style={at(775, 1462.5, TOP)}>
        Мы создали Zen как место, где можно остановиться и выдохнуть. Наши мастера сочетают классические техники массажа с натуральными маслами и тёплыми камнями, чтобы снять напряжение и вернуть телу лёгкость.
      </p>
      <p className="paragraph-lg w-[437px] text-neutral-700" style={at(775, 1609.5, TOP)}>
        Каждый визит начинается с короткой беседы — так мы подбираем процедуру именно под вас.
      </p>
    </Section>
  )
}
