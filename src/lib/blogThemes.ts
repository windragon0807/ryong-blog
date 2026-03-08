export const BLOG_THEME_VALUES = [
  'ink',
  'moss',
  'sage',
  'cobalt',
  'denim',
  'coral',
  'rosewood',
  'amber',
  'sepia',
  'iris',
] as const

export type BlogThemeName = (typeof BLOG_THEME_VALUES)[number]

type BlogThemePalette = {
  accent: string
  accentDark: string
  selection: string
  progressStart: string
  progressMid: string
  progressEnd: string
  progressGlow: string
  progressDarkStart: string
  progressDarkMid: string
  progressDarkEnd: string
  progressDarkGlow: string
  inlineCodeBg: string
  inlineCodeBorder: string
  inlineCodeText: string
  inlineCodeDarkBg: string
  inlineCodeDarkBorder: string
  inlineCodeDarkText: string
}

export const BLOG_THEME_PALETTES: Record<BlogThemeName, BlogThemePalette> = {
  ink: {
    accent: '#171717',
    accentDark: '#f3f4f6',
    selection: 'Highlight',
    progressStart: '#18181b',
    progressMid: '#52525b',
    progressEnd: '#d4d4d8',
    progressGlow: 'rgba(82, 82, 91, 0.28)',
    progressDarkStart: '#f5f5f5',
    progressDarkMid: '#d4d4d8',
    progressDarkEnd: '#71717a',
    progressDarkGlow: 'rgba(228, 228, 231, 0.24)',
    inlineCodeBg: 'rgba(39, 39, 42, 0.06)',
    inlineCodeBorder: 'rgba(39, 39, 42, 0.12)',
    inlineCodeText: '#3f3f46',
    inlineCodeDarkBg: 'rgba(228, 228, 231, 0.08)',
    inlineCodeDarkBorder: 'rgba(228, 228, 231, 0.18)',
    inlineCodeDarkText: '#e4e4e7',
  },
  moss: {
    accent: '#1b8a6b',
    accentDark: '#1b8a6b',
    selection: 'rgba(27, 138, 107, 0.24)',
    progressStart: '#0f766e',
    progressMid: '#1b8a6b',
    progressEnd: '#86efac',
    progressGlow: 'rgba(27, 138, 107, 0.34)',
    progressDarkStart: '#34d399',
    progressDarkMid: '#10b981',
    progressDarkEnd: '#99f6e4',
    progressDarkGlow: 'rgba(52, 211, 153, 0.26)',
    inlineCodeBg: 'rgba(27, 138, 107, 0.10)',
    inlineCodeBorder: 'rgba(27, 138, 107, 0.28)',
    inlineCodeText: '#1b8a6b',
    inlineCodeDarkBg: 'rgba(27, 138, 107, 0.22)',
    inlineCodeDarkBorder: 'rgba(27, 138, 107, 0.44)',
    inlineCodeDarkText: '#59c2a7',
  },
  sage: {
    accent: '#5f7a67',
    accentDark: '#c8d8cb',
    selection: 'rgba(95, 122, 103, 0.22)',
    progressStart: '#495f50',
    progressMid: '#5f7a67',
    progressEnd: '#b8cdbd',
    progressGlow: 'rgba(95, 122, 103, 0.3)',
    progressDarkStart: '#9cb7a3',
    progressDarkMid: '#b4ccb8',
    progressDarkEnd: '#dce8de',
    progressDarkGlow: 'rgba(180, 204, 184, 0.24)',
    inlineCodeBg: 'rgba(95, 122, 103, 0.09)',
    inlineCodeBorder: 'rgba(95, 122, 103, 0.2)',
    inlineCodeText: '#526a59',
    inlineCodeDarkBg: 'rgba(180, 204, 184, 0.14)',
    inlineCodeDarkBorder: 'rgba(180, 204, 184, 0.24)',
    inlineCodeDarkText: '#c8d8cb',
  },
  cobalt: {
    accent: '#2f67da',
    accentDark: '#2f67da',
    selection: 'rgba(47, 103, 218, 0.24)',
    progressStart: '#1d4ed8',
    progressMid: '#2f67da',
    progressEnd: '#67e8f9',
    progressGlow: 'rgba(47, 103, 218, 0.34)',
    progressDarkStart: '#60a5fa',
    progressDarkMid: '#38bdf8',
    progressDarkEnd: '#a5f3fc',
    progressDarkGlow: 'rgba(96, 165, 250, 0.26)',
    inlineCodeBg: 'rgba(47, 103, 218, 0.10)',
    inlineCodeBorder: 'rgba(47, 103, 218, 0.28)',
    inlineCodeText: '#2f67da',
    inlineCodeDarkBg: 'rgba(47, 103, 218, 0.22)',
    inlineCodeDarkBorder: 'rgba(47, 103, 218, 0.44)',
    inlineCodeDarkText: '#8ab0ff',
  },
  denim: {
    accent: '#4f6893',
    accentDark: '#c6d3eb',
    selection: 'rgba(79, 104, 147, 0.22)',
    progressStart: '#344a72',
    progressMid: '#4f6893',
    progressEnd: '#b8c9e8',
    progressGlow: 'rgba(79, 104, 147, 0.3)',
    progressDarkStart: '#90abd9',
    progressDarkMid: '#a8bfe5',
    progressDarkEnd: '#d7e2f5',
    progressDarkGlow: 'rgba(168, 191, 229, 0.24)',
    inlineCodeBg: 'rgba(79, 104, 147, 0.09)',
    inlineCodeBorder: 'rgba(79, 104, 147, 0.2)',
    inlineCodeText: '#455c84',
    inlineCodeDarkBg: 'rgba(168, 191, 229, 0.14)',
    inlineCodeDarkBorder: 'rgba(168, 191, 229, 0.24)',
    inlineCodeDarkText: '#c6d3eb',
  },
  coral: {
    accent: '#d35b47',
    accentDark: '#d35b47',
    selection: 'rgba(211, 91, 71, 0.24)',
    progressStart: '#ea580c',
    progressMid: '#d35b47',
    progressEnd: '#fdba74',
    progressGlow: 'rgba(211, 91, 71, 0.34)',
    progressDarkStart: '#fb923c',
    progressDarkMid: '#f97316',
    progressDarkEnd: '#fdba74',
    progressDarkGlow: 'rgba(249, 115, 22, 0.26)',
    inlineCodeBg: 'rgba(211, 91, 71, 0.10)',
    inlineCodeBorder: 'rgba(211, 91, 71, 0.28)',
    inlineCodeText: '#d35b47',
    inlineCodeDarkBg: 'rgba(211, 91, 71, 0.22)',
    inlineCodeDarkBorder: 'rgba(211, 91, 71, 0.44)',
    inlineCodeDarkText: '#ff9e8f',
  },
  rosewood: {
    accent: '#9c5d72',
    accentDark: '#e4c5cf',
    selection: 'rgba(156, 93, 114, 0.22)',
    progressStart: '#7f4559',
    progressMid: '#9c5d72',
    progressEnd: '#e5b7c5',
    progressGlow: 'rgba(156, 93, 114, 0.3)',
    progressDarkStart: '#c990a2',
    progressDarkMid: '#d8aab8',
    progressDarkEnd: '#f1d6de',
    progressDarkGlow: 'rgba(216, 170, 184, 0.24)',
    inlineCodeBg: 'rgba(156, 93, 114, 0.09)',
    inlineCodeBorder: 'rgba(156, 93, 114, 0.2)',
    inlineCodeText: '#875165',
    inlineCodeDarkBg: 'rgba(216, 170, 184, 0.14)',
    inlineCodeDarkBorder: 'rgba(216, 170, 184, 0.24)',
    inlineCodeDarkText: '#e4c5cf',
  },
  amber: {
    accent: '#b87a1f',
    accentDark: '#b87a1f',
    selection: 'rgba(184, 122, 31, 0.26)',
    progressStart: '#a16207',
    progressMid: '#b87a1f',
    progressEnd: '#fcd34d',
    progressGlow: 'rgba(184, 122, 31, 0.34)',
    progressDarkStart: '#f59e0b',
    progressDarkMid: '#fbbf24',
    progressDarkEnd: '#fde68a',
    progressDarkGlow: 'rgba(251, 191, 36, 0.28)',
    inlineCodeBg: 'rgba(184, 122, 31, 0.11)',
    inlineCodeBorder: 'rgba(184, 122, 31, 0.28)',
    inlineCodeText: '#b87a1f',
    inlineCodeDarkBg: 'rgba(184, 122, 31, 0.24)',
    inlineCodeDarkBorder: 'rgba(184, 122, 31, 0.46)',
    inlineCodeDarkText: '#f2be6e',
  },
  sepia: {
    accent: '#8a644d',
    accentDark: '#ddc7b8',
    selection: 'rgba(138, 100, 77, 0.22)',
    progressStart: '#6b4c39',
    progressMid: '#8a644d',
    progressEnd: '#d9c0ad',
    progressGlow: 'rgba(138, 100, 77, 0.3)',
    progressDarkStart: '#b89175',
    progressDarkMid: '#ccab93',
    progressDarkEnd: '#eadbce',
    progressDarkGlow: 'rgba(204, 171, 147, 0.24)',
    inlineCodeBg: 'rgba(138, 100, 77, 0.09)',
    inlineCodeBorder: 'rgba(138, 100, 77, 0.2)',
    inlineCodeText: '#755544',
    inlineCodeDarkBg: 'rgba(204, 171, 147, 0.14)',
    inlineCodeDarkBorder: 'rgba(204, 171, 147, 0.24)',
    inlineCodeDarkText: '#ddc7b8',
  },
  iris: {
    accent: '#8657d8',
    accentDark: '#8657d8',
    selection: 'rgba(134, 87, 216, 0.24)',
    progressStart: '#6d28d9',
    progressMid: '#8657d8',
    progressEnd: '#c4b5fd',
    progressGlow: 'rgba(134, 87, 216, 0.34)',
    progressDarkStart: '#8b5cf6',
    progressDarkMid: '#a78bfa',
    progressDarkEnd: '#ddd6fe',
    progressDarkGlow: 'rgba(167, 139, 250, 0.28)',
    inlineCodeBg: 'rgba(134, 87, 216, 0.10)',
    inlineCodeBorder: 'rgba(134, 87, 216, 0.28)',
    inlineCodeText: '#8657d8',
    inlineCodeDarkBg: 'rgba(134, 87, 216, 0.22)',
    inlineCodeDarkBorder: 'rgba(134, 87, 216, 0.44)',
    inlineCodeDarkText: '#c2a2ff',
  },
}

export const BLOG_THEME_OPTIONS: ReadonlyArray<{
  value: BlogThemeName
  label: string
  accent: string
}> = [
  { value: 'ink', label: 'Ink (기본)', accent: BLOG_THEME_PALETTES.ink.accent },
  { value: 'moss', label: 'Moss', accent: BLOG_THEME_PALETTES.moss.accent },
  { value: 'sage', label: 'Sage', accent: BLOG_THEME_PALETTES.sage.accent },
  { value: 'cobalt', label: 'Cobalt', accent: BLOG_THEME_PALETTES.cobalt.accent },
  { value: 'denim', label: 'Denim', accent: BLOG_THEME_PALETTES.denim.accent },
  { value: 'coral', label: 'Coral', accent: BLOG_THEME_PALETTES.coral.accent },
  { value: 'rosewood', label: 'Rosewood', accent: BLOG_THEME_PALETTES.rosewood.accent },
  { value: 'amber', label: 'Amber', accent: BLOG_THEME_PALETTES.amber.accent },
  { value: 'sepia', label: 'Sepia', accent: BLOG_THEME_PALETTES.sepia.accent },
  { value: 'iris', label: 'Iris', accent: BLOG_THEME_PALETTES.iris.accent },
]

export const DEFAULT_BLOG_THEME: BlogThemeName = 'ink'

const BLOG_THEME_SET = new Set<string>(BLOG_THEME_VALUES)

export function isBlogThemeName(
  value: string | null | undefined
): value is BlogThemeName {
  return Boolean(value && BLOG_THEME_SET.has(value))
}

export function getBlogThemePalette(theme: BlogThemeName): BlogThemePalette {
  return BLOG_THEME_PALETTES[theme]
}
