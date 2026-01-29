# Figma Banner Plugin

Figma에서 배너 템플릿을 추출하고 생성할 수 있는 플러그인입니다.

## 📋 프로젝트 개요

이 플러그인은 Figma에서 홈 배너 카드 템플릿을 자동으로 생성하는 도구입니다. React 기반의 UI와 Figma Plugin API를 활용하여 템플릿을 추출하고, 다양한 데이터로 배너를 생성할 수 있습니다.

## 🚀 주요 기능

- **템플릿 추출 (Extract)**: Figma에서 선택한 디자인을 템플릿으로 추출
- **템플릿 생성 (Generate)**: 추출된 템플릿을 기반으로 배너 카드 자동 생성
- **채팅 인터페이스**: AI 어시스턴트와의 대화형 인터페이스 제공
- **이미지 첨부**: 채팅에서 이미지를 첨부하여 작업 가능

## 📁 프로젝트 구조

```
banner_plugin/
├── src/
│   ├── plugin/              # Figma 플러그인 메인 코드
│   │   ├── code.ts         # 플러그인 로직 및 배너 생성 함수
│   │   └── templates/
│   │       └── card.ts     # 카드 템플릿 정의
│   ├── ui/                  # React UI 컴포넌트
│   │   ├── App.tsx         # 메인 UI 컴포넌트
│   │   ├── main.tsx        # React 진입점
│   │   ├── styles.ts       # 스타일 정의
│   │   └── index.html      # UI HTML 템플릿
│   └── shared/
│       └── messages.ts      # 메시지 타입 정의
├── dist/                    # 빌드 출력 디렉토리
├── manifest.json            # Figma 플러그인 매니페스트
├── vite.config.ts           # Vite 빌드 설정
└── package.json             # 프로젝트 의존성
```

## 🛠️ 기술 스택

- **React 18**: UI 프레임워크
- **TypeScript**: 타입 안정성
- **Vite**: 빌드 도구
- **esbuild**: 플러그인 코드 번들링
- **Figma Plugin API**: Figma 플러그인 개발

## 📦 설치 및 실행

### 의존성 설치

```bash
npm install
```

### 개발 모드

```bash
npm run dev
```

### 빌드

```bash
npm run build
```

빌드 스크립트는 다음을 수행합니다:
- `build:ui`: React UI를 단일 HTML 파일로 빌드
- `build:code`: 플러그인 코드를 번들링
- `build:manifest`: 매니페스트 파일 복사

## 🎨 배너 템플릿 구조

배너는 다음과 같은 구조로 생성됩니다:

```
variation / home_banner (root)
├── img (이미지 영역)
│   └── ai_image (AI 이미지 플레이스홀더)
└── text (텍스트 영역)
    └── Frame 427321433
        └── text (텍스트 컬럼)
            ├── eyebrow (상단 텍스트)
            ├── titleLine1 (제목 1줄)
            ├── titleLine2 (제목 2줄)
            └── caption (캡션)
```

### 템플릿 설정

템플릿 설정은 `src/plugin/templates/card.ts`에서 관리됩니다:

- **크기**: 335x122px
- **레이아웃**: 수평 배치
- **이미지 영역**: 60x122px (왼쪽)
- **텍스트 영역**: 275x122px (오른쪽)
- **스타일**: 둥근 모서리, 패딩, 간격 등

## 💻 주요 코드 설명

### 배너 생성 함수

```12:148:src/plugin/code.ts
// generateHomeBanner 함수는 데이터와 Y 오프셋을 받아 배너를 생성합니다
```

주요 기능:
- Figma Frame을 사용한 레이아웃 구성
- Auto Layout을 활용한 반응형 구조
- 텍스트 슬롯 기반 동적 콘텐츠 삽입
- 색상 및 스타일 자동 적용

### UI 컴포넌트

```12:198:src/ui/App.tsx
// React 기반 채팅 인터페이스와 템플릿 제어 버튼
```

주요 기능:
- Extract/Generate 버튼으로 템플릿 작업
- 채팅 인터페이스를 통한 AI 어시스턴트 상호작용
- 이미지 첨부 및 미리보기

## 📝 사용 방법

1. **플러그인 실행**: Figma에서 플러그인을 실행합니다
2. **템플릿 추출**: Extract 버튼을 클릭하여 현재 선택한 디자인을 템플릿으로 추출합니다
3. **배너 생성**: Generate 버튼을 클릭하여 템플릿을 기반으로 배너를 생성합니다
4. **채팅 사용**: 하단 채팅 인터페이스를 통해 AI 어시스턴트와 상호작용할 수 있습니다

## 🔧 개발 가이드

### 템플릿 수정

템플릿의 크기, 색상, 레이아웃 등을 수정하려면 `src/plugin/templates/card.ts` 파일을 편집하세요.

### 스타일 수정

UI 스타일을 변경하려면 `src/ui/styles.ts` 파일을 수정하세요.

### 메시지 통신

플러그인 코드와 UI 간의 통신은 `postMessage` API를 사용합니다:
- UI → Plugin: `parent.postMessage({ pluginMessage: {...} }, '*')`
- Plugin → UI: `figma.ui.postMessage({...})`

## 📄 라이선스

이 프로젝트는 비공개 프로젝트입니다.
