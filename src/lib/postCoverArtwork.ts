import type { Post } from '@/types/notion'

type CoverMotif = 'voice' | 'frontend' | 'testing' | 'systems' | 'data' | 'editorial'

type CoverPalette = {
  base: string
  glow: string
  deep: string
  line: string
  soft: string
  chip: string
}

export type GeneratedPostCover = {
  motif: CoverMotif
  label: string
  ghost: string
  sourceLabel: 'blog' | 'portfolio'
  seed: number
  palette: CoverPalette
}

const MOTIF_LIBRARY: Array<{
  motif: CoverMotif
  label: string
  ghost: string
  baseHue: number
  keywords: string[]
}> = [
  {
    motif: 'voice',
    label: 'Voice AI',
    ghost: 'VOICE',
    baseHue: 186,
    keywords: ['voice', 'speech', 'audio', 'ai', 'llm', 'assistant', '음성', '인식', '대화', '챗봇'],
  },
  {
    motif: 'frontend',
    label: 'UI System',
    ghost: 'UI',
    baseHue: 227,
    keywords: ['frontend', 'react', 'next', 'ui', 'ux', 'css', 'design', 'web', '브라우저', '프론트', '디자인'],
  },
  {
    motif: 'testing',
    label: 'Test Flow',
    ghost: 'E2E',
    baseHue: 146,
    keywords: ['playwright', 'test', 'testing', 'e2e', 'qa', 'spec', '테스트', '검증', '시나리오'],
  },
  {
    motif: 'systems',
    label: 'Build Ops',
    ghost: 'OPS',
    baseHue: 29,
    keywords: ['build', 'deploy', 'docker', 'infra', 'server', 'yarn', 'webpack', 'vite', 'pipeline', '빌드', '배포', '서버', '의존성'],
  },
  {
    motif: 'data',
    label: 'Data Story',
    ghost: 'DATA',
    baseHue: 336,
    keywords: ['data', 'chart', 'metric', 'finance', 'trading', 'analytics', 'dashboard', '데이터', '분석', '지표', '통계'],
  },
]

function hashString(value: string): number {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

function detectMotif(text: string, seed: number) {
  const normalized = text.toLowerCase()

  for (const entry of MOTIF_LIBRARY) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return entry
    }
  }

  const fallbackPalette = [
    {
      motif: 'editorial' as const,
      label: 'Project Note',
      ghost: 'NOTE',
      baseHue: 262,
    },
    {
      motif: 'frontend' as const,
      label: 'UI System',
      ghost: 'UI',
      baseHue: 227,
    },
    {
      motif: 'systems' as const,
      label: 'Build Ops',
      ghost: 'OPS',
      baseHue: 29,
    },
  ]

  return fallbackPalette[seed % fallbackPalette.length]
}

function clampHue(hue: number) {
  return ((hue % 360) + 360) % 360
}

function createPalette(seed: number, baseHue: number): CoverPalette {
  const hue = clampHue(baseHue + (seed % 19) - 9)
  const accentHue = clampHue(hue + 32 + (seed % 17))
  const neutralHue = clampHue(hue - 24)

  return {
    base: `hsl(${hue} 47% 82%)`,
    glow: `hsla(${accentHue} 82% 68% / 0.58)`,
    deep: `hsl(${hue} 49% 28%)`,
    line: `hsla(${neutralHue} 36% 20% / 0.62)`,
    soft: `hsla(${hue} 92% 97% / 0.9)`,
    chip: `hsla(${neutralHue} 28% 99% / 0.74)`,
  }
}

function selectLabel(post: Pick<Post, 'title' | 'tags'>, fallbackLabel: string) {
  const firstTag = post.tags.find((tag) => tag.trim().length > 0 && tag.trim().length <= 14)
  return firstTag ?? fallbackLabel
}

export function getGeneratedPostCover(post: Pick<Post, 'title' | 'description' | 'tags' | 'slug' | 'source'>): GeneratedPostCover {
  const seedSource = [post.slug, post.title, post.tags.join('|')].join('::')
  const seed = hashString(seedSource || 'ryong-cover')
  const searchableText = [post.title, post.description, post.tags.join(' ')].join(' ')
  const detected = detectMotif(searchableText, seed)

  return {
    motif: detected.motif,
    label: selectLabel(post, detected.label),
    ghost: detected.ghost,
    sourceLabel: post.source,
    seed,
    palette: createPalette(seed, detected.baseHue),
  }
}
