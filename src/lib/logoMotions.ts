export const LOGO_MOTION_VALUES = [
  'typing',
  'jump',
  'wave',
  'slide',
] as const

export type LogoMotionName = (typeof LOGO_MOTION_VALUES)[number]

export const LOGO_MOTION_OPTIONS: ReadonlyArray<{
  value: LogoMotionName
  label: string
  description: string
}> = [
  {
    value: 'typing',
    label: 'Typing',
    description: '글자가 왼쪽부터 차분하게 입력되는 방식',
  },
  {
    value: 'jump',
    label: 'Jump',
    description: '한 글자씩 위로 톡 튀었다가 내려오는 방식',
  },
  {
    value: 'wave',
    label: 'Wave',
    description: '글자가 순서대로 부드럽게 흔들리는 방식',
  },
  {
    value: 'slide',
    label: 'Slide Reveal',
    description: '각 글자가 아래에서 위로 올라오며 정렬되는 방식',
  },
]

export const DEFAULT_LOGO_MOTION: LogoMotionName = 'typing'

const LOGO_MOTION_SET = new Set<string>(LOGO_MOTION_VALUES)

export function isLogoMotionName(
  value: string | null | undefined
): value is LogoMotionName {
  return Boolean(value && LOGO_MOTION_SET.has(value))
}
