import { useEffect, useRef, type ReactNode } from 'react'
import { reduced } from './motion'

/*
  «Стопка карточек»: каждая секция — sticky-карточка. Высокая карточка прилипает, когда её низ доходит
  до низа экрана (top = высота экрана − высота карточки), и следующая выезжает поверх со скруглёнными углами.
  Перекрываемая карточка слегка уменьшается и темнеет (--cover 0…1).
  Холст масштабируется через CSS zoom, поэтому высоту экрана переводим в координаты холста.
*/

export function StackCard({ children, tone = 'base', first = false }: { children: ReactNode; tone?: 'base' | 'alt'; first?: boolean }) {
  return (
    <div data-card className={`stack-card ${tone === 'alt' ? 'alt' : ''} ${first ? 'first' : ''}`}>
      <div className="stack-body">{children}</div>
      <div className="stack-shade" aria-hidden />
    </div>
  )
}

export function useStack(scale: number) {
  const scaleRef = useRef(scale)
  scaleRef.current = scale
  useEffect(() => {
    const cards = () => [...document.querySelectorAll<HTMLElement>('[data-card]')]
    const layout = () => {
      const vh = window.innerHeight / scaleRef.current
      for (const c of cards()) {
        const h = c.offsetHeight
        c.style.top = `${Math.min(0, vh - h)}px`
      }
    }
    layout()
    const ro = new ResizeObserver(layout)
    cards().forEach((c) => ro.observe(c))
    window.addEventListener('resize', layout)

    let raf = 0
    const tick = () => {
      if (!reduced()) {
        const list = cards()
        const vh = window.innerHeight
        list.forEach((c, i) => {
          const next = list[i + 1]
          let p = 0
          if (next) p = Math.min(Math.max((vh - next.getBoundingClientRect().top) / vh, 0), 1)
          c.style.setProperty('--cover', p.toFixed(4))
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', layout)
      cancelAnimationFrame(raf)
    }
  }, [])
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [scale])
}
