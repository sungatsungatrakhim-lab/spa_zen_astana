import { useEffect, useState } from 'react'
import { CANVAS_WIDTH } from '../components/ui'

/**
 * В Figma есть только десктопная версия (1440px), мобильных фреймов нет.
 * Поэтому на экранах уже 1440px весь холст пропорционально уменьшается через CSS zoom —
 * раскладка, отступы и шрифты остаются как в макете, а прокрутка и клики работают корректно.
 */
export function useCanvasScale() {
  const get = () => (typeof window === 'undefined' ? 1 : Math.min(1, window.innerWidth / CANVAS_WIDTH))
  const [scale, setScale] = useState(get)
  useEffect(() => {
    const onResize = () => setScale(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}
