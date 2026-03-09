import type { CSSProperties } from 'react'
import type { Post } from '@/types/notion'
import { getGeneratedPostCover } from '@/lib/postCoverArtwork'

type Props = {
  post: Pick<Post, 'title' | 'description' | 'tags' | 'slug' | 'source'>
  compact?: boolean
}

export function PostCoverArtwork({ post, compact = false }: Props) {
  const art = getGeneratedPostCover(post)
  const style = {
    '--cover-base': art.palette.base,
    '--cover-glow': art.palette.glow,
    '--cover-deep': art.palette.deep,
    '--cover-line': art.palette.line,
    '--cover-soft': art.palette.soft,
    '--cover-chip': art.palette.chip,
  } as CSSProperties

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden" style={style}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(145deg, color-mix(in srgb, var(--cover-soft) 92%, white) 0%, color-mix(in srgb, var(--cover-base) 82%, white) 46%, color-mix(in srgb, var(--cover-deep) 34%, var(--cover-base)) 100%)',
        }}
      />
      <div
        className="absolute -top-10 left-[-8%] h-44 w-44 rounded-full opacity-80 blur-3xl animate-[pulse_5.6s_ease-in-out_infinite]"
        style={{ background: 'var(--cover-glow)' }}
      />
      <div
        className="absolute right-[-10%] bottom-[-12%] h-56 w-56 rounded-full opacity-70 blur-3xl animate-[pulse_6.4s_ease-in-out_infinite]"
        style={{ background: 'color-mix(in srgb, var(--cover-base) 68%, white)' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_34%,rgba(255,255,255,0.04)_56%,transparent_76%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.3),transparent_22%),radial-gradient(circle_at_22%_84%,rgba(255,255,255,0.26),transparent_28%)]" />

      <svg viewBox="0 0 800 450" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`cover-gradient-${art.seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.86)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
          </linearGradient>
        </defs>
        {renderArtwork(art)}
        <rect
          x="28"
          y="28"
          width="744"
          height="394"
          rx="34"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
        <rect
          x="44"
          y="44"
          width="712"
          height="362"
          rx="28"
          fill={`url(#cover-gradient-${art.seed})`}
          opacity="0.35"
        />
      </svg>

      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
        <span
          className={`inline-flex max-w-[55%] items-center rounded-full border border-white/55 px-3 py-1 font-medium tracking-[0.08em] text-white/90 uppercase backdrop-blur-md ${
            compact ? 'text-[9px]' : 'text-[10px]'
          }`}
          style={{ background: 'var(--cover-chip)' }}
        >
          {art.label}
        </span>
        <span className="rounded-full border border-white/30 bg-white/12 px-2.5 py-1 text-[9px] font-medium tracking-[0.12em] text-white/70 uppercase backdrop-blur-sm">
          {art.sourceLabel}
        </span>
      </div>

      <div
        className={`absolute right-4 bottom-3 font-semibold tracking-[0.34em] text-white/18 uppercase ${
          compact ? 'text-[28px]' : 'text-[40px]'
        }`}
      >
        {art.ghost}
      </div>
    </div>
  )
}

function renderArtwork(art: ReturnType<typeof getGeneratedPostCover>) {
  switch (art.motif) {
    case 'voice':
      return <VoiceArtwork art={art} />
    case 'frontend':
      return <FrontendArtwork art={art} />
    case 'testing':
      return <TestingArtwork art={art} />
    case 'systems':
      return <SystemsArtwork art={art} />
    case 'data':
      return <DataArtwork art={art} />
    default:
      return <EditorialArtwork art={art} />
  }
}

function VoiceArtwork({ art }: { art: ReturnType<typeof getGeneratedPostCover> }) {
  const phase = art.seed % 22
  return (
    <>
      <circle cx={596 - phase} cy={166 + phase} r="78" fill={art.palette.deep} opacity="0.18" />
      <circle cx={582 - phase} cy={178 + phase} r="48" fill={art.palette.glow} opacity="0.55" />
      {[0, 1, 2].map((index) => (
        <path
          key={index}
          d={`M ${164 + index * 8} ${260 - index * 18} C ${260 + index * 16} ${166 - index * 12}, ${430 + index * 18} ${156 + index * 10}, ${620 + index * 8} ${224 + index * 22}`}
          fill="none"
          stroke={index === 1 ? art.palette.deep : 'rgba(255,255,255,0.9)'}
          strokeWidth={index === 1 ? 18 : 10}
          strokeLinecap="round"
          opacity={index === 1 ? 0.68 : 0.56}
        />
      ))}
      {[0, 1, 2].map((index) => (
        <circle
          key={`dot-${index}`}
          cx={232 + index * 108}
          cy={146 + ((art.seed + index * 17) % 36)}
          r={index === 1 ? 11 : 8}
          fill="rgba(255,255,255,0.78)"
          opacity="0.88"
        />
      ))}
    </>
  )
}

function FrontendArtwork({ art }: { art: ReturnType<typeof getGeneratedPostCover> }) {
  const offset = art.seed % 18
  return (
    <>
      <rect x="124" y="98" width="334" height="212" rx="24" fill="rgba(255,255,255,0.7)" />
      <rect x="164" y="126" width="334" height="212" rx="24" fill="rgba(255,255,255,0.28)" />
      <rect x="224" y="154" width="334" height="212" rx="24" fill={art.palette.deep} opacity="0.22" />
      {[0, 1, 2].map((index) => (
        <circle
          key={`window-dot-${index}`}
          cx={158 + index * 24}
          cy="128"
          r="7"
          fill={index === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.46)'}
        />
      ))}
      {[0, 1, 2, 3].map((index) => (
        <rect
          key={`line-a-${index}`}
          x={276 + index * 12}
          y={194 + index * 44}
          width={180 - index * 24}
          height="12"
          rx="6"
          fill={index % 2 === 0 ? 'rgba(255,255,255,0.76)' : art.palette.glow}
          opacity="0.74"
        />
      ))}
      <path
        d={`M 154 ${280 + offset} Q 252 ${204 - offset}, 344 ${242} T 604 ${208 + offset}`}
        fill="none"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </>
  )
}

function TestingArtwork({ art }: { art: ReturnType<typeof getGeneratedPostCover> }) {
  const rise = art.seed % 18
  return (
    <>
      <rect x="108" y="104" width="590" height="236" rx="32" fill="rgba(255,255,255,0.16)" />
      <rect x="132" y="128" width="544" height="190" rx="24" fill="rgba(12,18,32,0.22)" />
      {[0, 1, 2].map((index) => (
        <g key={`test-row-${index}`}>
          <circle cx="182" cy={178 + index * 48} r="10" fill={art.palette.glow} opacity="0.84" />
          <path
            d={`M 176 ${178 + index * 48} l 6 7 l 14 -16`}
            fill="none"
            stroke="rgba(255,255,255,0.92)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="214"
            y={170 + index * 48}
            width={232 + index * 34}
            height="15"
            rx="7.5"
            fill="rgba(255,255,255,0.72)"
          />
        </g>
      ))}
      <path
        d={`M 182 ${292 - rise} C 288 ${202 + rise}, 406 ${314 - rise}, 544 ${176 + rise} S 664 ${224 - rise}, 694 ${154 + rise}`}
        fill="none"
        stroke={art.palette.glow}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.66"
      />
    </>
  )
}

function SystemsArtwork({ art }: { art: ReturnType<typeof getGeneratedPostCover> }) {
  const wobble = art.seed % 30
  const nodes = [
    { x: 176, y: 156 },
    { x: 304, y: 132 + wobble * 0.1 },
    { x: 470, y: 202 - wobble * 0.15 },
    { x: 286, y: 292 },
    { x: 566, y: 292 - wobble * 0.12 },
    { x: 648, y: 170 + wobble * 0.08 },
  ]

  return (
    <>
      {[
        [0, 1],
        [1, 2],
        [1, 3],
        [2, 4],
        [2, 5],
        [3, 4],
      ].map(([from, to]) => (
        <path
          key={`${from}-${to}`}
          d={`M ${nodes[from].x} ${nodes[from].y} L ${nodes[to].x} ${nodes[to].y}`}
          stroke="rgba(255,255,255,0.58)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}
      {nodes.map((node, index) => (
        <g key={`node-${index}`}>
          <circle cx={node.x} cy={node.y} r={index % 2 === 0 ? 22 : 18} fill={art.palette.deep} opacity="0.2" />
          <circle cx={node.x} cy={node.y} r={index % 2 === 0 ? 14 : 12} fill={index === 2 ? art.palette.glow : 'rgba(255,255,255,0.78)'} />
        </g>
      ))}
      <rect x="140" y="324" width="520" height="18" rx="9" fill="rgba(255,255,255,0.46)" />
    </>
  )
}

function DataArtwork({ art }: { art: ReturnType<typeof getGeneratedPostCover> }) {
  const jitter = art.seed % 14
  const bars = [112, 156, 208, 268, 334]

  return (
    <>
      <g opacity="0.82">
        {bars.map((height, index) => (
          <rect
            key={`bar-${index}`}
            x={180 + index * 86}
            y={318 - height + index * 6}
            width="46"
            height={height - index * 6}
            rx="16"
            fill={index === 3 ? art.palette.glow : 'rgba(255,255,255,0.68)'}
          />
        ))}
      </g>
      <path
        d={`M 154 ${294 - jitter} C 246 ${262 + jitter}, 294 ${206 - jitter}, 372 ${216} S 502 ${274 + jitter}, 640 ${160 - jitter}`}
        fill="none"
        stroke={art.palette.deep}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.52"
      />
      {[0, 1, 2, 3].map((index) => (
        <circle
          key={`point-${index}`}
          cx={214 + index * 132}
          cy={index === 0 ? 284 - jitter : index === 1 ? 224 + jitter : index === 2 ? 252 - jitter : 174 + jitter}
          r="9"
          fill="rgba(255,255,255,0.94)"
        />
      ))}
    </>
  )
}

function EditorialArtwork({ art }: { art: ReturnType<typeof getGeneratedPostCover> }) {
  const shift = art.seed % 20
  return (
    <>
      <rect x="146" y="118" width="510" height="220" rx="28" fill="rgba(255,255,255,0.22)" />
      <rect x="184" y="154" width="320" height="22" rx="11" fill="rgba(255,255,255,0.74)" />
      <rect x="184" y="194" width="240" height="16" rx="8" fill="rgba(255,255,255,0.52)" />
      <rect x="184" y="228" width="366" height="16" rx="8" fill="rgba(255,255,255,0.46)" />
      <path
        d={`M 526 ${128 + shift} C 594 ${148}, 650 ${212 + shift}, 630 ${294} C 612 ${352}, 530 ${356}, 488 ${322} C 452 ${290}, 450 ${236}, 474 ${188} C 490 ${156}, 502 ${138}, 526 ${128 + shift}`}
        fill={art.palette.glow}
        opacity="0.48"
      />
      <path
        d={`M 134 ${300 - shift} C 200 ${258}, 268 ${336}, 346 ${296} S 492 ${244 + shift}, 612 ${320 - shift}`}
        fill="none"
        stroke={art.palette.deep}
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.34"
      />
    </>
  )
}
