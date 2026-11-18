import { useEffect, useState } from 'react'
import logoLg from '../assets/icons/logo-lg.png'

/** Логотип и тонкая линия загрузки; затем «занавес» уезжает вверх. Ждёт первое видео интро (не дольше 2.6 c). */
export default function Preloader({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const [minTime, setMinTime] = useState(false)
  const [phase, setPhase] = useState<'load' | 'out' | 'gone'>('load')

  useEffect(() => {
    const t1 = setTimeout(() => setMinTime(true), 1300)
    document.documentElement.style.overflow = 'hidden'
    return () => clearTimeout(t1)
  }, [])

  const [timedOut, setTimedOut] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 2600)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (phase === 'load' && minTime && (ready || timedOut)) setPhase('out')
  }, [ready, timedOut, minTime, phase])

  // отдельный эффект для ухода занавеса: смена фазы не должна сбрасывать таймер
  useEffect(() => {
    if (phase !== 'out') return
    const t = setTimeout(() => {
      setPhase('gone')
      document.documentElement.style.overflow = ''
      onDone()
    }, 900)
    return () => clearTimeout(t)
  }, [phase, onDone])

  if (phase === 'gone') return null
  return (
    <div className={`zen-pre ${phase === 'out' ? 'out' : ''}`} role="status" aria-label="Загрузка">
      <div className="zen-pre-inner">
        <img src={logoLg} alt="" width={56} height={56} />
        <span className="zen-pre-word">Zen</span>
        <span className="zen-pre-line">
          <i />
        </span>
      </div>
    </div>
  )
}
