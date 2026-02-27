# ryong.log

Notion Database를 CMS로 사용하는 Next.js 기반 개인 기술 블로그입니다.

## 주요 기능

- Notion DB 글 목록/상세 조회
- 카드형 포스트 리스트(반응형 1/2/3열)
- 포스트 커버/아이콘 렌더링
- 상세 페이지 본문 스트리밍 렌더링(`Suspense`)
- 코드 블록 Shiki 하이라이트 + 코드 복사 버튼
- 언어별 코드 아이콘 표시(VSCode 아이콘 리소스 기반)
- 다크/라이트 모드 토글(커스텀 애니메이션 UI)
- 헤더 설정 패널에서 폰트/코드 테마 선택
- 본문 우측 플로팅 TOC(h1/h2/h3 추적 + 스무스 스크롤)
- Notion `column_list`, `bookmark`, `toggle` 등 블록 렌더링 지원
- 북마크 OG 메타데이터 수집 및 카드 UI 렌더링
- SEO 메타데이터, `robots.txt`, `sitemap.xml`, OG 이미지 API

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Notion API (`@notionhq/client`)
- Shiki
- next-themes

## 프로젝트 구조

```txt
src
├─ app
│  ├─ api/og/route.tsx          # OG 이미지 생성 API
│  ├─ posts/[slug]/page.tsx     # 포스트 상세
│  ├─ tags/[tag]/page.tsx       # 태그별 목록
│  ├─ layout.tsx                # 전역 레이아웃/메타/테마 부트스크립트
│  ├─ page.tsx                  # 홈(글 목록)
│  ├─ robots.ts                 # robots
│  └─ sitemap.ts                # sitemap
├─ components
│  ├─ Header.tsx
│  ├─ ThemeToggle.tsx
│  ├─ ThemeSettingsMenu.tsx
│  ├─ FontThemeSelect.tsx
│  ├─ CodeThemeSelect.tsx
│  ├─ PostCard.tsx
│  └─ notion/*                  # Notion 블록 렌더러/코드/TOC
├─ lib
│  ├─ notion.ts                 # Notion 데이터 fetch + 캐시
│  ├─ codeThemes.ts             # 코드 테마 목록/매핑
│  ├─ fontThemes.ts             # 폰트 테마 목록/매핑
│  ├─ bookmark.ts               # 북마크 OG 메타 수집
│  ├─ toc.ts                    # TOC 추출/ID
│  └─ codeLanguageIcons.ts      # 언어-아이콘 매핑
└─ types/notion.ts

public
├─ brand/ryonglog-icon.svg
├─ fonts/maplestory/*.otf
└─ vscode-icons/*               # 코드 언어 아이콘 리소스
```

## 시작하기

### 1) 설치

```bash
npm install
```

### 2) 환경변수 설정

`.env.local` 파일을 생성하고 아래 값을 설정합니다.

```bash
NOTION_API_KEY=secret_xxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.example`도 함께 참고하세요.

### 3) 개발 서버 실행

```bash
npm run dev
```

기본 포트는 `3000`입니다.  
`3001`로 실행하려면:

```bash
npm run dev -- --port 3001
```

## Notion DB 설정 가이드

### 필수 조건

- Integration을 생성하고 해당 DB 페이지에 연결(Invite)해야 합니다.
- `NOTION_API_KEY`는 Integration Secret을 사용합니다.
- `NOTION_DATABASE_ID`는 Database ID를 사용합니다.

### Database ID 찾기

공유 링크 예시:

```txt
https://www.notion.so/workspace/8a85c5a7a1d94db4b7b367168fca1e2d?v=...
```

여기서 `8a85c5a7a1d94db4b7b367168fca1e2d`가 DB ID입니다.

### 권장 속성 스키마

`src/lib/notion.ts`에서 속성명을 자동 탐지하지만, 아래 형태를 권장합니다.

- `title` (title)
- `slug` (rich_text)
- `description` (rich_text)
- `tags` (multi_select)
- `published` (checkbox)
- `date` (date)

속성명이 달라도 alias 규칙으로 최대한 자동 매핑합니다.

## 캐시/재검증 정책

- ISR: 기본 `revalidate = 3600` (1시간)
- Notion 데이터 캐시:
  - 개발: 120초
  - 운영: 3600초

## 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 배포 체크리스트

- 배포 환경에 아래 환경변수 설정
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
  - `NEXT_PUBLIC_SITE_URL` (실제 도메인)
- Notion Integration이 DB에 초대되어 있는지 확인

## 커밋 메시지 추천

```txt
chore: prepare ryong.log for GitHub with complete project README
```

또는 기능 중심으로:

```txt
feat: ship ryong.log Notion blog with theming, code highlight, and floating TOC
```
