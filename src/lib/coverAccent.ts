interface CoverAccent {
  light: string
  dark: string
  soft: string
}

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getCoverAccent(seed: string): CoverAccent {
  const hash = hashString(seed || 'ryong-log')
  const hue = hash % 360
  const altHue = (hue + 42) % 360

  return {
    light: `hsl(${hue} 72% 72%)`,
    dark: `hsl(${altHue} 62% 45%)`,
    soft: `hsla(${hue} 82% 74% / 0.42)`,
  }
}
