// Контент страницы из макета Figma «Zen — Massage Free Figma Template», фрейм «🏠 Home V1».
// Тексты-«рыба» (Lorem ipsum) оставлены как в макете.
import facials from '../assets/img/service-facials.webp'
import swedish from '../assets/img/service-swedish.webp'
import bodyScrubs from '../assets/img/service-body-scrubs.webp'
import moisturizers from '../assets/img/product-moisturizers.webp'
import serum from '../assets/img/product-serum.webp'
import bathSalts from '../assets/img/product-bath-salts.webp'
import diffuser from '../assets/img/product-diffuser.webp'
import guaSha from '../assets/img/product-gua-sha.webp'
import oils from '../assets/img/product-oils.webp'
import articleTips from '../assets/img/article-tips.webp'
import articleChoose from '../assets/img/article-choose.webp'
import articleHolistic from '../assets/img/article-holistic.webp'
import testimonialMain from '../assets/img/testimonial-main.webp'
import testimonialSmall from '../assets/img/testimonial-small.webp'

export const NAV = [
  { label: 'Главная', href: '#top' },
  { label: 'О нас', href: '#about' },
  { label: 'Страницы', href: '#', dropdown: true },
  { label: 'Цены', href: '#booking' },
  { label: 'Корзина (2)', href: '#products' },
]

// Список страниц шаблона (из футера) — содержимое выпадающего меню «Pages»
export const PAGES = {
  pages: ['Главная V1', 'Главная V2', 'Главная V3', 'О нас', 'Команда', 'Мастер', 'Услуги', 'Услуга'],
  more: ['Блог V1', 'Блог V2', 'Блог V3', 'Статьи', 'Рубрика', 'Магазин', 'Товар', 'Контакты V1'],
  extra: ['Контакты V2', 'Контакты V3', 'Подписка', 'Скоро открытие'],
  utility: ['С чего начать', 'Стайлгайд', 'Страница 404', 'Вход по паролю', 'Лицензии', 'Изменения'],
}

export const SERVICES = [
  // Ширина карточек 360 / 359 / 359, шаг 384 (зазор 24px)
  { title: 'Уход за лицом', img: facials, width: 360 },
  { title: 'Классический массаж', img: swedish, width: 359 },
  // Третья карточка в макете обрезана краем фрейма — доступна только видимая часть (183px)
  { title: 'Скрабы для тела', img: bodyScrubs, width: 359 },
]

export type Plan = { name: string; text: string; benefits: string[]; price: string }
export const PLANS: Plan[] = [
  {
    name: 'Silver',
    text: 'Классический массаж всего тела с тёплым маслом и травяной чай после сеанса. Идеально для первого визита.',
    benefits: ['Расслабление и снятие стресса', 'Улучшение кровообращения', 'Травяной чай после сеанса'],
    price: '45 000 ₸',
  },
  // Для Gold и Diamond в макете показано только свёрнутое состояние —
  // текст и цена ниже повторяют структуру Silver. Замените на реальные данные.
  {
    name: 'Gold',
    text: 'Скраб для тела, массаж 90 минут и сауна — два часа полного отдыха для тела и головы.',
    benefits: ['Скраб и массаж горячими камнями', 'Сауна и купель', 'Отдельная комната отдыха'],
    price: '75 000 ₸',
  },
  {
    name: 'Diamond',
    text: 'Целый день в спа: три процедуры на выбор, лёгкий обед и личный мастер на весь визит.',
    benefits: ['Три процедуры на выбор', 'Обед и чайная церемония', 'Набор косметики в подарок'],
    price: '140 000 ₸',
  },
]

export const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', x: 125.5, iconX: 255.4 },
  { label: 'Instagram', href: 'https://instagram.com', x: 497.5, iconX: 635.4 },
  { label: 'YouTube', href: 'https://youtube.com', x: 877.5, iconX: 999.3 },
  { label: 'X', href: 'https://x.com', x: 1241.5, iconX: 1274.4 },
]

// Сетка продуктов: позиции плиток из макета
export const PRODUCTS = [
  { name: 'Увлажняющие кремы', img: moisturizers, x: 75, y: 4632, w: 630 },
  { name: 'Сыворотки', img: serum, x: 735, y: 4632, w: 300 },
  { name: 'Соль для ванн', img: bathSalts, x: 1065, y: 4632, w: 300 },
  { name: 'Диффузоры', img: diffuser, x: 75, y: 5082, w: 300 },
  { name: 'Гуаша', img: guaSha, x: 405, y: 5082, w: 300 },
  { name: 'Аромамасла', img: oils, x: 735, y: 5082, w: 630 },
]

export const TESTIMONIALS = [
  {
    quote: '«Каждый раз ухожу из Zen отдохнувшей и полной сил»',
    text: 'Хожу в Zen уже второй год. Мастера помнят, что я люблю, а после массажа с горячими камнями спина не болит неделями. Отдельное спасибо за травяной чай и тишину — здесь правда можно отключиться от города.',
    name: 'Айгерим Сулейменова',
    place: 'Астана',
    img: testimonialMain,
    imgSmall: testimonialSmall,
  },
]

export const ARTICLES = [
  { title: 'Как расслабиться по-настоящему: советы наших мастеров', category: 'Советы', date: '28 авг 2026', img: articleTips },
  { title: 'Как выбрать спа-процедуру под себя', category: 'Гид', date: '22 авг 2026', img: articleChoose },
  { title: 'Холистический подход: как спа помогает телу и душе', category: 'Новости', date: '20 авг 2026', img: articleHolistic },
]
