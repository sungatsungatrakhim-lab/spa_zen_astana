import type { CSSProperties, ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

/** Холст макета: 1440px по ширине. Секции — относительные блоки, элементы внутри стоят
 *  по координатам Figma (pageY — координата во фрейме «🏠 Home V1», top — начало секции). */
export const CANVAS_WIDTH = 1440

type SectionProps = { top: number; height: number; className?: string; children: ReactNode; id?: string; as?: 'section' | 'header' | 'footer' }
export function Section({ top, height, className = '', children, id, as: Tag = 'section' }: SectionProps) {
  return (
    <Tag id={id} data-top={top} data-sec className={`relative mx-auto w-[1440px] ${className}`} style={{ height }}>
      {children}
    </Tag>
  )
}

/** Абсолютная позиция в координатах страницы Figma */
export function at(x: number, pageY: number, sectionTop: number, extra: CSSProperties = {}): CSSProperties {
  return { position: 'absolute', left: x, top: pageY - sectionTop, ...extra }
}

/* ---------- Кнопки (компоненты [A]--Primary Button / Secondary Button) ---------- */

type Variant = 'primary' | 'secondary' | 'secondary-light'
const base =
  'inline-flex items-center justify-center gap-[6px] whitespace-nowrap display-2-medium transition-[background-color,color,border-color,box-shadow,transform] duration-200 active:scale-[0.98] cursor-pointer select-none'
const variants: Record<Variant, string> = {
  // px 16 / py 12, min-width 122, радиус «пилюля»
  primary: 'min-w-[122px] px-[16px] py-[12px] rounded-[54px] bg-accent text-white hover:bg-[#8a5640]',
  secondary: 'px-[16px] py-[12px] rounded-[100px] border border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white',
  'secondary-light': 'px-[16px] py-[12px] rounded-[100px] border border-white text-white hover:bg-white hover:text-neutral-800',
}

type BtnProps = { variant?: Variant; className?: string; style?: CSSProperties; children: ReactNode }
export function Button({ variant = 'primary', className = '', style, children, ...rest }: BtnProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} style={style} {...rest}>
      {children}
    </button>
  )
}
export function ButtonLink({ variant = 'primary', className = '', style, children, ...rest }: BtnProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} style={style} {...rest}>
      {children}
    </a>
  )
}

/** Круглая кнопка-стрелка из макета (иконка 40px / 35px) */
export function IconButton({ icon, size = 40, label, disabled, onClick, style, className = '' }: {
  icon: string; size?: number; label: string; disabled?: boolean; onClick?: () => void; style?: CSSProperties; className?: string
}) {
  return (
    <button type="button" aria-label={label} disabled={disabled} onClick={onClick} style={{ width: size, height: size, ...style }}
      className={`grid place-items-center rounded-full transition-[transform,opacity] duration-200 enabled:cursor-pointer enabled:hover:scale-105 enabled:active:scale-95 disabled:cursor-default ${className}`}>
      <img src={icon} alt="" width={size} height={size} draggable={false} />
    </button>
  )
}

/** Горизонтальная линия-разделитель (1px Neutrals/500) */
export function HLine({ y, x = 0, width = CANVAS_WIDTH, top, className = '' }: { y: number; x?: number; width?: number; top: number; className?: string }) {
  return <div aria-hidden className={`absolute h-px bg-neutral-500 ${className}`} style={{ left: x, top: y - top, width }} />
}
