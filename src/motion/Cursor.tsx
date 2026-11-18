import { useEffect, useRef, useState } from 'react'

/** Мягкий круглый курсор: следует за мышью с инерцией, растёт над ссылками, над фото показывает «View». */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<'' | 'link' | 'view'>('')
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('has-cursor')
    let x = innerWidth / 2,
      y = innerHeight / 2,
      cx = x,
      cy = y,
      raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      setOn(true)
      const t = e.target as HTMLElement
      if (t.closest?.('[data-cursor="view"]')) setMode('view')
      else if (t.closest?.('a, button, [role="button"], input, select, textarea, label')) setMode('link')
      else setMode('')
    }
    const leave = () => setOn(false)
    const tick = () => {
      cx += (x - cx) * 0.18
      cy += (y - cy) * 0.18
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div ref={dot} className={`zen-cursor ${on ? 'on' : ''} ${mode}`} aria-hidden>
      <span>Смотреть</span>
    </div>
  )
}
