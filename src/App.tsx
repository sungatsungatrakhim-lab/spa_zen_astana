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
import MobileSite from './mobile/MobileSite'
import { onScrollFrame, siteStart } from './motion/motion'

// Телефон и узкий планшет — отдельная мобильная вёрстка вместо уменьшенного десктопного холста
const MOBILE_Q = '(max-width: 900px)'
function useMobile() {
  const [m, setM] = useState(() => window.matchMedia(MOBILE_Q).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_Q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}

export default function App() {
  const scale = useCanvasScale()
  const mobile = useMobile()
  const [started, setStarted] = useState(false)
  const [fontsReady, setFontsReady] = useState(false)
  useStack(scale, !mobile)

  useEffect(() => {
    document.fonts?.ready.then(() => setFontsReady(true))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-mobile', mobile)
    tagSections()
    const offReveal = initReveals()
    const offPar = mobile ? () => {} : initParallax()
    // Плавная инерционная прокрутка — только для колеса мыши на десктопе; на телефоне родная прокрутка
    const lenis = mobile ? null : initSmoothScroll()
    return () => {
      offReveal()
      offPar()
      lenis?.destroy()
    }
  }, [mobile])

  const done = useCallback(() => setStarted(true), [])

  // Закреплённая шапка: появляется, когда обычная шапка (в первой карточке) уходит за верх экрана
  const [pinned, setPinned] = useState(false)
  useEffect(
    () =>
      onScrollFrame(() => {
        const headerH = mobile ? 0 : 81 * Math.min(1, window.innerWidth / 1440)
        setPinned(window.scrollY > siteStart() + headerH)
      }),
    [mobile],
  )

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
      {!mobile && <Cursor />}
      {!mobile && (
        <div className={`pinned-header ${pinned ? 'on' : ''}`} aria-hidden={!pinned} inert={!pinned || undefined}>
          <div className="min-w-[1440px]" style={{ zoom: scale }}>
            <Header />
          </div>
        </div>
      )}
      {booking.open && <BookingModal key={booking.n} initialService={booking.service} onClose={closeBooking} />}
      <IntroStage started={started} />
      {mobile ? (
        <div className="site-over">
          <MobileSite headerOn={pinned} />
        </div>
      ) : (
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
      )}
    </>
  )
}
