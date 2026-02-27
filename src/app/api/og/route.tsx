import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') ?? 'ryong.log'
  const tags = searchParams.get('tags')?.split(',').filter(Boolean) ?? []

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
          color: '#fafafa',
          fontFamily: 'sans-serif',
        }}
      >
        {/* 상단: 제목 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 30 ? '48px' : '56px',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
              letterSpacing: '-0.02em',
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>

          {tags.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '20px',
                    padding: '4px 14px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#a1a1aa',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 하단: 브랜드 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#71717a',
            }}
          >
            ryong.log
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
