import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import photo from '../assets/img/intro-arch.webp'
import { reduced } from './motion'

/*
  Тёмный первый экран (как в референсе):
  — при загрузке буквы «ZEN» съезжаются из широкой разрядки, фото в арке поднимается, круг-акцент раскрывается;
  — при прокрутке сцена «наезжает» (scale), фото приближается сильнее букв — получается глубина;
  — дальше сайт выезжает снизу поверх, а сцена уменьшается, скругляется и темнеет.
  Сцена — sticky внутри высокого контейнера; всё считается от прогресса прокрутки этого контейнера.
*/

// Пункты сверху — кнопки: открывают онлайн-запись с выбранной услугой
const SERVICES = [
  { label: 'Массаж', id: 'classic' },
  { label: 'Уход за лицом', id: 'facial' },
  { label: 'Скрабы', id: 'scrub' },
  { label: 'Ароматерапия', id: 'aroma' },
]

export default function IntroStage({ started }: { started: boolean }) {
  const wrap = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    if (!started) return
    const t = setTimeout(() => setSettled(true), 2800)
    return () => clearTimeout(t)
  }, [started])

  useEffect(() => {
    if (reduced()) return
    let raf = 0
    const tick = () => {
      const w = wrap.current,
        s = stage.current
      if (w && s) {
        const r = w.getBoundingClientRect()
        const vh = window.innerHeight
        const total = r.height - vh // сколько прокручивается контейнер
        const y = Math.min(Math.max(-r.top, 0), total)
        // 0…1 — наезд (первые 55% пути), 0…1 — уход под сайт (оставшийся путь = один экран)
        const zoom = Math.min(y / (total - vh || 1), 1)
        const out = Math.min(Math.max((y - (total - vh)) / vh, 0), 1)
        s.style.setProperty('--zoom', zoom.toFixed(4))
        s.style.setProperty('--out', out.toFixed(4))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={wrap} className="intro-wrap" id="intro">
      <div ref={stage} className={`intro-stage ${started ? 'go' : ''} ${settled ? 'settled' : ''}`}>
        <div className="intro-inner">
          <div className="intro-top">
            {SERVICES.map((s, i) => (
              <button key={s.id} type="button" data-book={s.id} style={{ '--i': i } as CSSProperties}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="intro-scene">
            <div className="intro-word" aria-label="Zen">
              {['Z', 'E', 'N'].map((l, i) => (
                <span key={l} style={{ '--i': i - 1 } as CSSProperties} aria-hidden>
                  {l}
                </span>
              ))}
            </div>
            <div className="intro-visual">
              <div className="intro-circle" aria-hidden />
              <figure className="intro-photo">
                <img src={photo} alt="Девушка в халате отдыхает с травяным чаем" draggable={false} />
              </figure>
            </div>
          </div>

          <div className="intro-bottom">
            <p>
              <i />
              Спа-ритуалы
              <br />
              для тела и души
            </p>
            <div className="intro-actions">
              <a href="#booking" data-book="" className="intro-btn">
                Записаться <b>→</b>
              </a>
              <a href="#about" className="intro-badge" aria-label="Листать вниз к сайту">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <path id="badge-c" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                  </defs>
                  <text>
                    <textPath href="#badge-c">листайте · вниз · листайте · вниз ·</textPath>
                  </text>
                </svg>
                <em>Zen</em>
              </a>
            </div>
          </div>
        </div>
        <div className="intro-dim" aria-hidden />
      </div>
    </div>
  )
}
