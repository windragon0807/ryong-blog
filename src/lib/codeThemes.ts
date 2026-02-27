export const CODE_THEME_VALUES = [
  'andromeeda',
  'aurora-x',
  'ayu-dark',
  'ayu-light',
  'ayu-mirage',
  'catppuccin-frappe',
  'catppuccin-latte',
  'catppuccin-macchiato',
  'catppuccin-mocha',
  'dark-plus',
  'dracula',
  'dracula-soft',
  'everforest-dark',
  'everforest-light',
  'github-dark',
  'github-dark-default',
  'github-dark-dimmed',
  'github-dark-high-contrast',
  'github-light',
  'github-light-default',
  'github-light-high-contrast',
  'gruvbox-dark-hard',
  'gruvbox-dark-medium',
  'gruvbox-dark-soft',
  'gruvbox-light-hard',
  'gruvbox-light-medium',
  'gruvbox-light-soft',
  'horizon',
  'houston',
  'kanagawa-dragon',
  'kanagawa-lotus',
  'kanagawa-wave',
  'laserwave',
  'light-plus',
  'material-theme',
  'material-theme-darker',
  'material-theme-lighter',
  'material-theme-ocean',
  'material-theme-palenight',
  'min-dark',
  'min-light',
  'monokai',
  'night-owl',
  'night-owl-light',
  'nord',
  'one-dark-pro',
  'one-light',
  'plastic',
  'poimandres',
  'red',
  'rose-pine',
  'rose-pine-dawn',
  'rose-pine-moon',
  'slack-dark',
  'slack-ochin',
  'snazzy-light',
  'solarized-dark',
  'solarized-light',
  'synthwave-84',
  'tokyo-night',
  'vesper',
  'vitesse-black',
  'vitesse-dark',
  'vitesse-light',
] as const

export type CodeThemeName = (typeof CODE_THEME_VALUES)[number]

export const CODE_THEME_OPTIONS: ReadonlyArray<{
  value: CodeThemeName
  label: string
}> = CODE_THEME_VALUES.map((value) => ({
  value,
  label: toThemeLabel(value),
}))

export const DEFAULT_LIGHT_CODE_THEME: CodeThemeName = 'one-light'
export const DEFAULT_DARK_CODE_THEME: CodeThemeName = 'one-dark-pro'

export const SHIKI_THEME_RECORD = Object.fromEntries(
  CODE_THEME_VALUES.map((theme) => [theme, theme])
) as Record<CodeThemeName, CodeThemeName>

export const CODE_THEME_STYLE_TEXT = CODE_THEME_VALUES.map(
  (theme) => `
html[data-code-theme='${theme}'] .notion-code pre.shiki {
  color: var(--shiki-${theme}) !important;
  background-color: var(--shiki-${theme}-bg) !important;
}

html[data-code-theme='${theme}'] .notion-code pre.shiki span {
  color: var(--shiki-${theme}) !important;
}
`
).join('\n')

const CODE_THEME_SET = new Set<string>(CODE_THEME_VALUES)

export function isCodeThemeName(
  value: string | null | undefined
): value is CodeThemeName {
  return Boolean(value && CODE_THEME_SET.has(value))
}

function toThemeLabel(theme: string): string {
  return theme
    .split('-')
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ')
}
