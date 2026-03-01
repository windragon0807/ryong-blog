import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UI Upgrade Preview',
  description: 'ryong.log UI 개선안 전/후 비교 페이지',
}

function SectionTitle({
  number,
  title,
  subtitle,
}: {
  number: number
  title: string
  subtitle: string
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          IDEA {number.toString().padStart(2, '0')}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
      </div>
      <span className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        Preview Only
      </span>
    </header>
  )
}

function ComparePanel({
  label,
  children,
}: {
  label: 'Before' | 'After'
  children: React.ReactNode
}) {
  const isAfter = label === 'After'
  return (
    <div
      className={`rounded-2xl border p-4 ${
        isAfter
          ? 'border-blue-300/80 bg-gradient-to-b from-blue-50/75 to-cyan-50/45 dark:border-blue-700/70 dark:from-blue-950/35 dark:to-cyan-950/15'
          : 'border-zinc-200 bg-zinc-50/80 dark:border-zinc-700 dark:bg-zinc-800/45'
      }`}
    >
      <p
        className={`mb-3 text-xs font-semibold uppercase tracking-[0.12em] ${
          isAfter
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

function CardStub({ rich = false }: { rich?: boolean }) {
  return (
    <article
      className={`overflow-hidden rounded-xl border ${
        rich
          ? 'border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900/80'
          : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900/80'
      }`}
    >
      <div
        className={`aspect-[16/9] ${
          rich
            ? 'bg-[radial-gradient(circle_at_25%_30%,#9ec4ff_0,#73a8ff_25%,#274d90_100%)]'
            : 'bg-[linear-gradient(135deg,#cad7eb,#9fb5d6)]'
        }`}
      />
      <div className="space-y-2 p-3">
        <p className="line-clamp-2 font-semibold text-zinc-900 dark:text-zinc-100">
          Next.js 마이그레이션 및 라이트하우스 최적화
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">2024년 12월 12일</p>
      </div>
    </article>
  )
}

function SearchEmpty({ rich = false }: { rich?: boolean }) {
  if (!rich) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400">
        검색 결과가 없습니다.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">검색 결과가 없어요</p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">다른 키워드로 다시 시도해보세요.</p>
    </div>
  )
}

function ComparisonRow({
  before,
  after,
}: {
  before: React.ReactNode
  after: React.ReactNode
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <ComparePanel label="Before">{before}</ComparePanel>
      <ComparePanel label="After">{after}</ComparePanel>
    </div>
  )
}

export default function UiUpgradePreviewPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 py-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900/70">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          UI Upgrade Playground
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          1~10번 개선안의 전/후 차이를 빠르게 비교하는 임시 페이지입니다. 실서비스에는 아직 적용되지 않습니다.
        </p>
      </section>

      <section className="space-y-4">
        <SectionTitle number={1} title="리스트 히어로 섹션" subtitle="최신 글 1개를 상단에서 강하게 노출" />
        <ComparisonRow
          before={<div className="h-40 rounded-xl border border-dashed border-zinc-300 bg-zinc-100/70 dark:border-zinc-600 dark:bg-zinc-800/45" />}
          after={
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80">
              <div className="aspect-[21/9] bg-[radial-gradient(circle_at_20%_30%,#8cb9ff_0,#4b7fd7_30%,#162f5f_100%)]" />
              <div className="p-4">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Featured · 2026년 2월 27일</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">BottomSheet Drag Close Handler 적용 가이드</p>
              </div>
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={2} title="카드 호버 디테일" subtitle="이미지 글레어/미세 파랄랙스로 밀도 향상" />
        <ComparisonRow before={<CardStub />} after={<CardStub rich />} />
      </section>

      <section className="space-y-4">
        <SectionTitle number={3} title="TOC 인터랙션 강화" subtitle="현재 섹션 강조선 + 활성 점프 반응" />
        <ComparisonRow
          before={
            <ul className="space-y-2 border-l border-zinc-200 pl-3 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <li>프로젝트 구조 설명</li>
              <li>yarn 설치하기</li>
              <li>이슈 트래킹</li>
            </ul>
          }
          after={
            <div className="relative border-l border-zinc-200 pl-3 dark:border-zinc-700">
              <div className="absolute top-[22px] -left-px h-6 w-[2px] rounded-full bg-blue-500" />
              <ul className="space-y-2 text-zinc-500 dark:text-zinc-400">
                <li>프로젝트 구조 설명</li>
                <li className="font-semibold text-zinc-900 dark:text-zinc-100">yarn 설치하기</li>
                <li>이슈 트래킹</li>
              </ul>
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={4} title="포스트 헤더 메타 디자인" subtitle="날짜/읽는시간/태그를 배지형으로 재배치" />
        <ComparisonRow
          before={<p className="text-sm text-zinc-500 dark:text-zinc-400">2024년 12월 12일 · 읽는 데 약 5분</p>}
          after={
            <div className="flex flex-wrap gap-2 text-xs">
              {['2024년 12월 12일', '읽는 시간 5분', 'Next.js', 'Optimization'].map((chip) => (
                <span key={chip} className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  {chip}
                </span>
              ))}
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={5} title="코드블록 도구바 강화" subtitle="파일명/복사/라인토글/접기 지원" />
        <ComparisonRow
          before={
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center justify-between bg-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                <span>typescript</span>
                <span>copy</span>
              </div>
              <div className="bg-zinc-50 p-4 text-sm dark:bg-zinc-900/70">{'const x = 1'}</div>
            </div>
          }
          after={
            <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-700">
              <div className="flex items-center justify-between bg-gradient-to-r from-zinc-100 to-zinc-50 px-3 py-2 text-xs dark:from-zinc-800 dark:to-zinc-900">
                <span className="font-medium text-zinc-700 dark:text-zinc-200">app/page.tsx</span>
                <div className="flex gap-1.5">
                  {['Line', 'Copy', 'Fold'].map((btn) => (
                    <span key={btn} className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">{btn}</span>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-50 p-4 text-sm dark:bg-zinc-900/70">{'const x = 1'}</div>
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={6} title="인라인 코드/인용/콜아웃 시스템 통일" subtitle="문맥 요소를 동일한 디자인 언어로 통합" />
        <ComparisonRow
          before={
            <div className="space-y-3 text-sm">
              <p><code className="rounded bg-zinc-100 px-1.5 py-0.5">app</code> 라우터로 이전했습니다.</p>
              <blockquote className="border-l-4 border-blue-400 bg-blue-50 p-3">기존 구조를 단계적으로 전환합니다.</blockquote>
              <div className="rounded border border-amber-200 bg-amber-50 p-3">주의: 배포 전 캐시를 확인하세요.</div>
            </div>
          }
          after={
            <div className="space-y-3 text-sm">
              <p><code className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300">app</code> 라우터로 이전했습니다.</p>
              <blockquote className="relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-3 pl-4 dark:border-zinc-700 dark:bg-zinc-800/40"><span className="absolute left-0 top-0 h-full w-1.5 bg-blue-500" />기존 구조를 단계적으로 전환합니다.</blockquote>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/40">주의: 배포 전 캐시를 확인하세요.</div>
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={7} title="이미지 뷰어 네비게이션" subtitle="라이트박스에서 좌/우 이동 컨트롤" />
        <ComparisonRow
          before={<div className="aspect-[16/8] rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/40" />}
          after={
            <div className="relative aspect-[16/8] rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/40">
              <button className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white/90 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900/80">←</button>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 bg-white/90 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-900/80">→</button>
            </div>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={8} title="빈 상태 화면 고도화" subtitle="문맥에 맞는 아이콘/메시지/가이드 추가" />
        <ComparisonRow before={<SearchEmpty />} after={<SearchEmpty rich />} />
      </section>

      <section className="space-y-4">
        <SectionTitle number={9} title="시리즈 타임라인 뷰" subtitle="연재 흐름을 수직 타임라인으로 시각화" />
        <ComparisonRow
          before={
            <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
              <li>1. 프로젝트 구조 설명</li>
              <li>2. yarn 설치하기</li>
              <li>3. 이슈 트래킹</li>
            </ul>
          }
          after={
            <ol className="relative space-y-3 border-l border-zinc-200 pl-4 text-sm dark:border-zinc-700">
              {['프로젝트 구조 설명', 'yarn 설치하기', '이슈 트래킹'].map((step) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-zinc-800 dark:text-zinc-100">{step}</span>
                </li>
              ))}
            </ol>
          }
        />
      </section>

      <section className="space-y-4">
        <SectionTitle number={10} title="설정 패널 완성도 업" subtitle="드롭다운 나열형에서 카드형 토글 그룹으로 정리" />
        <ComparisonRow
          before={
            <div className="space-y-2">
              <div className="rounded border border-zinc-200 p-2 text-sm dark:border-zinc-700">폰트 선택</div>
              <div className="rounded border border-zinc-200 p-2 text-sm dark:border-zinc-700">코드 테마 선택</div>
            </div>
          }
          after={
            <div className="grid gap-2 sm:grid-cols-2">
              {['폰트', '코드 테마', '밀도', '애니메이션'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-xl border border-zinc-200 bg-white p-3 text-left text-sm shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900/80 dark:hover:border-blue-700 dark:hover:bg-blue-900/25"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{item}</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">빠른 설정</p>
                </button>
              ))}
            </div>
          }
        />
      </section>
    </div>
  )
}
