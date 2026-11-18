import { useCallback, useEffect, useState } from 'react'
import Header from './sections/Header'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Booking from './sections/Booking'
import Banner from './sections/Banner'
import Products from './sections/Products'
import Testimonials from './sections/Testimonials'
import Instagram from './sections/Instagram'
import Articles from './sections/Articles'
import Footer from './sections/Footer'
import { useCanvasScale } from './hooks/useCanvasScale'
import { initParallax, initReveals, initSmoothScroll, tagSections } from './motion/motion'
import IntroStage from './motion/IntroStage'
import Preloader from './motion/Preloader'
import Cursor from './motion/Cursor'
import { StackCard, useStack } from './motion/Stack'
import BookingModal from './booking/BookingModal'

export default function App() {
  const scale = useCanvasScale()
  const [started, setStarted] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  useStack(scale)

  useEffect(() => {
    document.fonts?.ready.then(() => setFontsReady(true))
    tagSections()
    const offReveal = initReveals()
    const offPar = initParallax()
    const lenis = initSmoothScroll()
    return () => {
      offReveal()
      offPar()
      lenis?.destroy()
    }
  }, [])

  const done = useCallback(() => setStarted(true), [])

  // Закреплённая шапка: появляется, когда обычная шапка (в первой карточке) уходит за верх экрана
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    // Карточки «липкие», поэтому считаем по прокрутке: сайт начинается там, где кончается интро
    const on = () => {
      const intro = document.getElementById('intro')
      if (!intro) return
      const siteTop = intro.offsetHeight - window.innerHeight
      const headerH = 81 * Math.min(1, window.innerWidth / 1440)
      setPinned(window.scrollY > siteTop + headerH)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  // Онлайн-запись: любая кнопка с data-book открывает окно (значение — услуга или тариф для предвыбора)
  const [booking, setBooking] = useState<{ open: boolean; service: string | null; n: number }>({ open: false, service: null, n: 0 })
  const closeBooking = useCallback(() => setBooking((b) => ({ ...b, open: false })), [])
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest?.('[data-book]') as HTMLElement | null
      if (!el) return
      e.preventDefault()
      e.stopPropagation()
      const v = el.dataset.book || null
      setBooking((b) => ({ open: true, service: v, n: b.n + 1 }))
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return (
    <>
      <Preloader ready={fontsReady} onDone={done} />
      <Cursor />
      <div className={`pinned-header ${pinned ? 'on' : ''}`} aria-hidden={!pinned} inert={!pinned || undefined}>
        <div className="min-w-[1440px]" style={{ zoom: scale }}>
          <Header />
        </div>
      </div>
      {booking.open && <BookingModal key={booking.n} initialService={booking.service} onClose={closeBooking} />}
      <IntroStage started={started} />
      {/* На экранах уже 1440px весь холст пропорционально уменьшается (мобильной версии в макете нет) */}
      <div className="site-over">
        <div className="min-w-[1440px] overflow-x-clip" style={{ zoom: scale }}>
          <StackCard first>
            <Header />
            <Hero />
          </StackCard>
          {/* display: contents — карточки остаются соседями в одной стопке (общий контейнер для sticky) */}
          <main className="contents">
            <StackCard tone="alt">
              <About />
            </StackCard>
            <StackCard>
              <Services />
            </StackCard>
            <StackCard tone="alt">
              <Booking />
            </StackCard>
            <StackCard>
              <Banner />
            </StackCard>
            <StackCard tone="alt">
              <Products />
            </StackCard>
            <StackCard>
              <Testimonials />
            </StackCard>
            <StackCard tone="alt">
              <Instagram />
            </StackCard>
            <StackCard>
              <Articles />
            </StackCard>
          </main>
          <StackCard>
            <Footer />
          </StackCard>
        </div>
      </div>
    </>
  )
}
