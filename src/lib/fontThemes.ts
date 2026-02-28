export const FONT_THEME_VALUES = [
  'pretendard',
  'maplestory',
  'jenny',
  'hancom-malangmalang',
] as const

export type FontThemeName = (typeof FONT_THEME_VALUES)[number]

export const FONT_THEME_OPTIONS: ReadonlyArray<{
  value: FontThemeName
  label: string
}> = [
  { value: 'pretendard', label: 'Pretendard (기본)' },
  { value: 'maplestory', label: 'Maplestory' },
  { value: 'jenny', label: 'JENNY' },
  { value: 'hancom-malangmalang', label: '한컴 말랑말랑체' },
]

export const DEFAULT_FONT_THEME: FontThemeName = 'pretendard'

const FONT_THEME_SET = new Set<string>(FONT_THEME_VALUES)

export function isFontThemeName(
  value: string | null | undefined
): value is FontThemeName {
  return Boolean(value && FONT_THEME_SET.has(value))
}

const FONT_THEME_STACKS: Record<FontThemeName, string> = {
  pretendard:
    "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif",
  maplestory:
    "'Maplestory OTF', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif",
  jenny:
    "'JENNY', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif",
  'hancom-malangmalang':
    "'Hancom MalangMalang', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif",
}

export function getFontThemeStack(theme: FontThemeName): string {
  return FONT_THEME_STACKS[theme]
}
