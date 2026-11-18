import facials from '../assets/img/service-facials.webp'
import swedish from '../assets/img/service-swedish.webp'
import scrub from '../assets/img/service-body-scrubs.webp'
import arch3 from '../assets/img/arch-3.webp'
import arch1 from '../assets/img/arch-1.webp'
import booking from '../assets/img/booking.webp'
import about from '../assets/img/about.webp'
import intro from '../assets/img/intro-arch.webp'
import arch2 from '../assets/img/arch-2.webp'

export type Cat = 'massage' | 'face' | 'body' | 'ritual'
export type BookService = { id: string; title: string; duration: string; price: number; img: string; cat: Cat }

// Услуги для записи. id пакетов совпадают с названиями тарифов в блоке «Запись на процедуру».
export const BOOK_SERVICES: BookService[] = [
  { id: 'classic', title: 'Классический массаж', duration: '60 мин', price: 18000, img: swedish, cat: 'massage' },
  { id: 'stones', title: 'Массаж горячими камнями', duration: '90 мин', price: 26000, img: arch3, cat: 'massage' },
  { id: 'facial', title: 'Уход за лицом', duration: '60 мин', price: 22000, img: facials, cat: 'face' },
  { id: 'mask', title: 'Глиняная маска и массаж лица', duration: '45 мин', price: 16000, img: arch1, cat: 'face' },
  { id: 'scrub', title: 'Скраб для тела', duration: '45 мин', price: 15000, img: scrub, cat: 'body' },
  { id: 'aroma', title: 'Ароматерапия с массажем', duration: '60 мин', price: 20000, img: arch2, cat: 'massage' },
  { id: 'Silver', title: 'Ритуал Silver', duration: '90 мин', price: 45000, img: booking, cat: 'ritual' },
  { id: 'Gold', title: 'Ритуал Gold', duration: '2 часа', price: 75000, img: about, cat: 'ritual' },
  { id: 'Diamond', title: 'Ритуал Diamond', duration: 'весь день', price: 140000, img: intro, cat: 'ritual' },
]

// Карточки «Популярные услуги» на сайте → услуги записи
export const CARD_TO_SERVICE: Record<string, string> = {
  'Уход за лицом': 'facial',
  'Классический массаж': 'classic',
  'Скрабы для тела': 'scrub',
}

export const GUESTS = [
  { id: 'one', label: 'Один гость', k: 1 },
  { id: 'two', label: 'Вдвоём, спа для пары', k: 1.8 },
]

export type Master = { id: string; name: string; role: string; rating: number; exp: string; cats: Cat[] }
export const MASTERS: Master[] = [
  { id: 'aigerim', name: 'Айгерим Нурланова', role: 'Массажист, стоун-терапия', rating: 5.0, exp: '9 лет', cats: ['massage', 'body', 'ritual'] },
  { id: 'dana', name: 'Дана Ким', role: 'Косметолог', rating: 4.9, exp: '7 лет', cats: ['face', 'ritual'] },
  { id: 'aliya', name: 'Алия Сейткали', role: 'Спа-мастер, скрабы и обёртывания', rating: 4.9, exp: '6 лет', cats: ['body', 'face', 'ritual'] },
  { id: 'marat', name: 'Марат Ахметов', role: 'Массажист, спортивный массаж', rating: 4.8, exp: '11 лет', cats: ['massage', 'ritual'] },
]

export const SLOT_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

export const priceFor = (s: BookService, guests: string) =>
  Math.round((s.price * (GUESTS.find((g) => g.id === guests)?.k ?? 1)) / 500) * 500
export const fmt = (n: number) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₸'

export function formatPhoneInput(value: string, prev: string) {
  let n = value.startsWith('+7') ? value.slice(2).replace(/\D/g, '') : value.replace(/\D/g, '')
  if (n.length === 11 && /^[78]/.test(n)) n = n.slice(1)
  if (n === '8') n = ''
  n = n.slice(0, 10)
  if (!n && value.length < prev.length) return ''
  let out = '+7 (' + n.slice(0, 3)
  if (n.length > 3) out += ') ' + n.slice(3, 6)
  if (n.length > 6) out += '-' + n.slice(6, 8)
  if (n.length > 8) out += '-' + n.slice(8, 10)
  return out
}
export const phoneComplete = (p: string) => p.replace(/\D/g, '').length === 11
