import Lenis from 'lenis'

/*
  Анимации «среднего уровня» без перестройки вёрстки (элементы стоят абсолютно по координатам Figma):
  — [data-rv]          текст/кнопки: подъём + проявление; заголовки (h1/h2) — «из-под маски»
  — [data-rv="img"]    фото: шторка снизу вверх + лёгкий отъезд (scale 1.12 → 1)
  — [data-par="n"]     параллакс: сдвиг n px на экран прокрутки (через CSS-свойство translate, не мешает transform)
  Триггер — секция ([data-sec]) входит в экран; задержки по порядку элементов внутри секции.
*/

export const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let lenis: Lenis | null = null
export const getLenis = () => lenis

export function initSmoothScroll() {
  if (reduced()) return null
  lenis = new Lenis({ duration: 1.25, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true })
  const raf = (t: number) => {
    lenis?.raf(t)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  // якорные ссылки — плавно
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null
    if (!a || !lenis) return
    const id = a.getAttribute('href')!
    if (id === '#' || id.length < 2) return
    const el = document.querySelector<HTMLElement>(id)
    if (!el) return
    e.preventDefault()
    lenis.scrollTo(flowTop(el))
  })
  return lenis
}

/*
  Секции лежат в «липких» карточках, поэтому getBoundingClientRect даёт их прилипшее положение,
  а не место в потоке страницы — прокрутка к ним «не срабатывала». Считаем позицию сами:
  начало сайта (конец интро) + высоты карточек до нужной + смещение элемента внутри своей карточки.
*/
export function flowTop(el: HTMLElement) {
  const card = el.closest<HTMLElement>('[data-card]')
  if (!card) return el.getBoundingClientRect().top + window.scrollY
  const intro = document.getElementById('intro')
  const siteTop = intro ? intro.offsetHeight - window.innerHeight : 0
  const zoom = Math.min(1, window.innerWidth / 1440)
  let y = siteTop
  for (const c of document.querySelectorAll<HTMLElement>('[data-card]')) {
    if (c === card) break
    y += c.offsetHeight * zoom
  }
  const inside = el === card ? 0 : el.getBoundingClientRect().top - card.getBoundingClientRect().top
  return Math.max(0, Math.round(y + inside))
}

export function scrollToEl(el: Element | null) {
  if (!el) return
  if (lenis) lenis.scrollTo(flowTop(el as HTMLElement))
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' })
}

export function initReveals() {
  const sections = document.querySelectorAll<HTMLElement>('[data-sec]')
  sections.forEach((sec) => {
    sec.querySelectorAll<HTMLElement>('[data-rv]').forEach((el, i) => {
      el.style.setProperty('--rv-d', `${Math.min(i, 8) * 90}ms`)
    })
  })
  if (reduced() || !('IntersectionObserver' in window)) {
    sections.forEach((s) => s.classList.add('in'))
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
  )
  sections.forEach((s) => io.observe(s))
  return () => io.disconnect()
}

export function initParallax() {
  if (reduced()) return () => {}
  const els = [...document.querySelectorAll<HTMLElement>('[data-par]')]
  let raf = 0
  const tick = () => {
    const vh = window.innerHeight
    for (const el of els) {
      const r = el.getBoundingClientRect()
      if (r.bottom < -200 || r.top > vh + 200) continue
      const k = parseFloat(el.dataset.par || '40')
      // −1 … 1: положение центра элемента относительно центра экрана
      const t = (r.top + r.height / 2 - vh / 2) / vh
      el.style.translate = `0 ${(-t * k).toFixed(1)}px`
    }
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(raf)
}

/** Размечает элементы секций для анимаций, не трогая вёрстку секций. */
export function tagSections() {
  document.querySelectorAll<HTMLElement>('[data-sec]').forEach((sec) => {
    const kids = [...sec.children] as HTMLElement[]
    for (const el of kids) {
      if (el.dataset.rv !== undefined || el.classList.contains('arch-wrap')) continue
      const cls = el.className?.toString() ?? ''
      if (/\bh-px\b|\bw-px\b/.test(cls)) continue // тонкие линии-разделители не трогаем
      if (/\bcontents\b/.test(cls)) continue // display:contents — дети размечены в JSX
      if (el.tagName === 'H1' || el.tagName === 'H2') el.dataset.rv = 'title'
      else if (el.tagName === 'IMG' && (el as HTMLImageElement).width >= 150) {
        el.dataset.rv = 'img'
        const w = (el as HTMLImageElement).width
        if (!el.dataset.par && w >= 500 && w < 1000) el.dataset.par = '36'
      } else if (el.tagName === 'UL') {
        ;[...el.children].forEach((li) => {
          ;(li as HTMLElement).dataset.rv = ''
          li.querySelectorAll('img').forEach((im) => {
            if ((im as HTMLImageElement).height >= 200) im.closest('li')!.dataset.cursor = 'view'
          })
        })
      } else el.dataset.rv = ''
    }
  })
}
