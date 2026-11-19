import { useEffect, useRef, type ReactNode } from 'react'
import { onScrollFrame, reduced } from './motion'

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

export function useStack(scale: number, enabled: boolean) {
  const scaleRef = useRef(scale)
  scaleRef.current = scale
  useEffect(() => {
    if (!enabled) return
    const cards = [...document.querySelectorAll<HTMLElement>('[data-card]')]
    let vhLast = 0
    const layout = () => {
      // высоту экрана берём с округлением до 40px: мелкие изменения (адресная строка) не двигают карточки
      const vh = Math.round(window.innerHeight / 40) * 40
      if (vh === vhLast && cards.every((c) => c.dataset.h === String(c.offsetHeight))) return
      vhLast = vh
      for (const c of cards) {
        c.dataset.h = String(c.offsetHeight)
        c.style.top = `${Math.min(0, vh / scaleRef.current - c.offsetHeight)}px`
      }
    }
    layout()
    const ro = new ResizeObserver(layout)
    cards.forEach((c) => ro.observe(c))
    window.addEventListener('resize', layout)

    const last: number[] = []
    const off = onScrollFrame(() => {
      if (reduced()) return
      const vh = window.innerHeight
      const rects = cards.map((c) => c.getBoundingClientRect())
      cards.forEach((c, i) => {
        const nr = rects[i + 1]
        const p = nr ? Math.min(Math.max((vh - nr.top) / vh, 0), 1) : 0
        const v = Math.round(p * 50) / 50
        // Карточка полностью закрыта следующей — не рисуем её вовсе: под стопкой лежат до 9 полноэкранных
        // слоёв, и браузер перерисовывал их все в каждом кадре прокрутки
        const hidden = !!nr && nr.top <= 0 && nr.bottom >= vh
        const key = hidden ? -1 : v
        if (last[i] === key) return
        last[i] = key
        c.style.visibility = hidden ? 'hidden' : ''
        if (!hidden) c.style.setProperty('--cover', String(v))
      })
    })
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', layout)
      off()
    }
  }, [enabled])
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [scale])
}
