const LANGUAGE_ICON_MAP: Record<string, string> = {
  javascript: 'javascript.svg',
  js: 'javascript.svg',
  jsx: 'react.svg',
  typescript: 'typescript.svg',
  ts: 'typescript.svg',
  tsx: 'react_ts.svg',
  json: 'json.svg',
  jsonc: 'json.svg',
  json5: 'json.svg',
  html: 'html.svg',
  css: 'css.svg',
  scss: 'sass.svg',
  sass: 'sass.svg',
  less: 'less.svg',
  markdown: 'markdown.svg',
  md: 'markdown.svg',
  mdx: 'mdx.svg',
  bash: 'console.svg',
  shell: 'console.svg',
  sh: 'console.svg',
  zsh: 'console.svg',
  fish: 'console.svg',
  powershell: 'powershell.svg',
  yaml: 'yaml.svg',
  yml: 'yaml.svg',
  toml: 'toml.svg',
  docker: 'docker.svg',
  dockerfile: 'docker.svg',
  python: 'python.svg',
  py: 'python.svg',
  go: 'go.svg',
  golang: 'go.svg',
  rust: 'rust.svg',
  rs: 'rust.svg',
  java: 'java.svg',
  kotlin: 'kotlin.svg',
  swift: 'swift.svg',
  c: 'c.svg',
  cpp: 'cpp.svg',
  'c++': 'cpp.svg',
  csharp: 'csharp.svg',
  'c#': 'csharp.svg',
  php: 'php.svg',
  ruby: 'ruby.svg',
  sql: 'database.svg',
  graphql: 'graphql.svg',
  xml: 'xml.svg',
  vue: 'vue.svg',
  svelte: 'svelte.svg',
  astro: 'astro.svg',
  next: 'next.svg',
  nextjs: 'next.svg',
  node: 'nodejs.svg',
  nodejs: 'nodejs.svg',
  text: 'document.svg',
  plaintext: 'document.svg',
}

const LANGUAGE_ALIAS_MAP: Record<string, string> = {
  'plain text': 'text',
  plain_text: 'text',
  objectivec: 'c',
  objective_c: 'c',
}

export function getCodeLanguageIconSrc(language: string): string {
  const raw = language.trim().toLowerCase()
  const normalized = LANGUAGE_ALIAS_MAP[raw] ?? raw
  const compact = normalized.replace(/\s+/g, '')

  const icon =
    LANGUAGE_ICON_MAP[normalized] ??
    LANGUAGE_ICON_MAP[compact] ??
    LANGUAGE_ICON_MAP[normalized.replace(/[0-9.+-]/g, '')] ??
    'document.svg'

  return `/vscode-icons/${icon}`
}
