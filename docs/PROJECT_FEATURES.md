# ryong.log 기능 문서 (2026-03-01)

이 문서는 현재 코드베이스 기준 기능 지도를 제공합니다. 다음 작업(기능 추가/개편) 전에 빠르게 전체 구조를 이해하기 위한 용도입니다.

## 1. 아키텍처 요약

- 프레임워크: Next.js App Router (`src/app`)
- 콘텐츠 소스: Notion Database (`src/lib/notion.ts`)
- 렌더링: ISR + 캐시 태그 재검증
- 인증: NextAuth GitHub OAuth (`src/auth.ts`)
- 관리자 보호 라우트: `/ryong/*` (`middleware.ts`)

## 2. 사용자 라우트

| 경로 | 설명 | 주요 파일 |
|---|---|---|
| `/` | 전체 포스트 목록, 태그/시리즈 필터 | `src/app/page.tsx` |
| `/tags/[tag]` | 태그별 포스트 목록 | `src/app/tags/[tag]/page.tsx` |
| `/series/[series]` | 시리즈별 포스트 목록 | `src/app/series/[series]/page.tsx` |
| `/posts/[slug]` | 포스트 상세, 본문/TOC/댓글/관련글 | `src/app/posts/[slug]/page.tsx` |
| `/ryong` | 관리자 홈 (GitHub 관리자 계정만) | `src/app/ryong/page.tsx` |
| `/ryong/denied` | 관리자 인가 실패 페이지 | `src/app/ryong/denied/page.tsx` |

## 3. API 라우트

| 경로 | 메서드 | 설명 | 주요 파일 |
|---|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth 핸들러 | `src/app/api/auth/[...nextauth]/route.ts` |
| `/api/search-index` | GET | 검색용 문서 인덱스 제공 | `src/app/api/search-index/route.ts` |
| `/api/notion-media` | GET | Notion 만료 미디어 URL 재조회(cover/icon) | `src/app/api/notion-media/route.ts` |
| `/api/notion-webhook` | GET/POST | Notion Webhook 검증 및 경로 재검증 | `src/app/api/notion-webhook/route.ts` |
| `/api/revalidate` | GET/POST | 시크릿 기반 수동 재검증 | `src/app/api/revalidate/route.ts` |
| `/api/og` | GET | OG 이미지 생성 | `src/app/api/og/route.tsx` |

## 4. UI 시스템

### 4.1 헤더 우측 컨트롤

- 검색 오버레이: `HeaderSearchOverlay`
- 앱 런처: `AppLauncherMenu`
- 설정 패널: `ThemeSettingsMenu`
- 공통 아이콘 버튼 UI: `IconControlButton`

### 4.2 검색 UX (현재 동작)

- 돋보기 버튼으로 전역 포털 오버레이 오픈
- 배경 포스트 그리드는 고정 유지
- 검색 결과 카드는 오버레이 내부에서만 필터링/표시
- 단축키 지원:
  - `Cmd/Ctrl + K`: 오픈
  - `/`: 입력 포커스 아님 상태에서 오픈
  - `Esc`: 닫기

### 4.3 포스트 카드/아이콘

- 카드 컴포넌트: `PostCard`
- 아이콘 렌더러: `PostPageIcon`
- Notion 파일 아이콘은 정사각 컨테이너 + `object-contain` 정책 사용

## 5. 데이터/캐시

### 5.1 Notion 데이터 레이어

- DB 스키마 자동 탐지: `getDatabaseSchema*`
- 포스트 목록 조회: `getPosts`
- 상세 조회: `getPostBySlug`, `getPostByPageId`
- 블록 조회: `getPageBlocks`

### 5.2 캐시 전략

- 기본 ISR: 1시간 (`revalidate = 3600`)
- 개발 캐시 TTL은 운영보다 짧게 설정
- `NOTION_CACHE_TAGS`로 schema/posts/blocks 태그 분리
- Webhook/수동 API에서 태그+경로 재검증

## 6. 인증/인가

### 6.1 인증 공급자

- GitHub OAuth (NextAuth)

### 6.2 관리자 인가

- 환경변수 `ADMIN_GITHUB_LOGIN`과 로그인 GitHub 계정 비교
- `/ryong/*`는 `middleware.ts`에서 보호
- 비인가 시 `/api/auth/signin` 또는 `/ryong/denied`로 이동

## 7. 환경변수

- 콘텐츠:
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
  - `NOTION_WEBHOOK_VERIFICATION_TOKEN` (옵션)
  - `NOTION_REVALIDATE_SECRET` (수동 재검증 사용 시)
- 사이트:
  - `NEXT_PUBLIC_SITE_URL`
- 인증:
  - `AUTH_SECRET`
  - `GITHUB_ID`
  - `GITHUB_SECRET`
  - `ADMIN_GITHUB_LOGIN`

## 8. 운영 체크리스트

배포 전:

1. `npm run lint`
2. `npm run build`
3. 홈/태그/시리즈/상세 렌더 확인
4. 헤더 검색 오버레이 동작 확인
5. `/ryong` 접근 제어 확인

장애 의심 시:

1. `/api/search-index` 응답 확인
2. Notion 토큰/DB 권한 확인
3. Webhook 서명 토큰 일치 확인
4. 수동 재검증 API(`secret`) 경로 테스트
