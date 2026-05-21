# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 프로젝트 가이드입니다.

## 프로젝트 개요

**Grit Tools** — 브라우저에서 바로 쓰는 개발자용 미니 도구 모음 (정적 웹사이트).
브랜드명은 **Grit**. 컨셉: "작은 반복을 갈아버리는 도구 모음".

## 핵심 원칙

1. 작은 불편도 반복되면 큰 문제다 — 사소한 반복 작업을 해결한다.
2. 도구 페이지에서는 **작업에만 집중** — 광고·군더더기를 넣지 않는다.
3. **모든 처리는 브라우저 안에서** — 파일·이미지를 서버로 전송하지 않는다 (보안).
4. 불편한 게 생기면 도구가 된다 — 도구를 계속 추가한다.

> UI 카피에 "설치 불필요·로그인 없음·무료" 같은 마케팅 문구는 넣지 않는다(원칙이지 광고 문구가 아님). 매니페스토/철학 섹션도 두지 않는다.

## 구조

- `index.html` — 랜딩/허브 페이지. 사이드바 + 콘텐츠 2단 레이아웃:
  - **좌측 사이드바**: 로고 + 테마 토글(해/달), 카테고리별 **도구 리스트**, 하단에 **언어 스위처**(`#langMount`, 버튼 나열형 `inline:true`).
  - **콘텐츠**: 히어로 없이 곧장 카테고리별 **도구 카드 그리드**. 맨 위에 검색용 숨김 `<h1>`(`.visually-hidden`).
  - 광고 레일·하단 footer는 **현재 제거됨**(추후 필요 시 추가). 도구 페이지엔 광고를 넣지 않는다.
- `tools/` — 모든 도구는 카테고리 하위 폴더에 위치.
  - `tools/image/` · `tools/calc/` (그 외 `tools/text/`·`tools/file/`는 예정)
  - `tools/image/pixel-coords.html` — 픽셀 좌표 추출기. 단일 파일 템플릿의 기준.
  - `tools/calc/compound-interest.html` · `tools/calc/simple-interest.html` — 복리·단리 계산기. 인라인 SVG 그래프 + 엑셀(`.xls` SpreadsheetML, 라이브러리 없음) 저장.
  - 도구 파일은 허브 기준 2단계 깊이 → 도구 내 링크는 `../../index.html`, `../../i18n.js`.
- `i18n.js` — **모든 페이지가 공유하는 다국어 엔진**(루트). 아래 "다국어" 참고.
- `DESIGN.md` — 디자인 시스템 원본(Seline "Crisp Data Canvas"). 색·폰트·간격·모양의 기준.

현재 살아있는 도구: **이미지 좌표 계산기**(파일명 `pixel-coords`), **복리 계산기**, **단리 계산기** (3개).
모든 도구 상단 바엔 공통 **"사용법" 버튼 → 사용법 모달**이 있고, 페이지별 SEO(고유 title·description·JSON-LD)를 갖춘다.

## 디자인 시스템 (DESIGN.md 기준)

- **라이트 기본 + 다크 토글.** `html[data-theme="dark"]`로 다크, `localStorage["theme"]`에 저장(기본 라이트).
- **블루 앤 화이트, 단일 강조색.** 다른 채도 높은 색을 추가하지 않는다.
  - 페이지 `#fafaf9` / 카드·표면 `#ffffff` / 텍스트 `#0c0a09` / 보조 `#524d48` / 강조 Chartwell Blue `#3ba6f1`.
  - 토큰은 `index.html`·도구 `<style>`의 `:root`에 정의(`--bg --surface --surface-2 --blue --text --text-dim --border …`).
- **폰트**: UI/본문 **Inter**, 한글 **Pretendard**(둘 다 CDN), 제목은 `roobert`→Inter 폴백. 좌표/코드 등 고정폭은 `--font-mono`(Consolas 등 시스템). Inter 굵기 ≤600.
- **아이콘은 이모지 금지 → 인라인 SVG 라인 아이콘**(`svg.ic`, stroke 기반). 카드 아이콘 타일은 솔리드 블루 배경 + 흰 아이콘.
- **모양**: 카드 `--radius-card:10px`, 배지/버튼/칩 pill(`9999px`). 그림자는 큰 blur 금지 — 또렷한 1~3px(`--shadow-*`).
- "흐리멍텅"하지 않게 **대비를 충분히, 경계·그림자는 선명하게.**

## 다국어 (i18n.js / GritI18n)

- 전역 객체 `GritI18n`: `register(dict)`, `init({mount,onChange})`, `t(key)`, `setLang(code)`.
- 지원 언어 **ko·en·ja·zh**, 선택값은 `localStorage["gritLang"]`에 저장 → **홈·도구가 같은 키를 공유**(홈에서 바꾸면 도구에도 적용).
- 마크업 속성: `data-i18n`(textContent), `data-i18n-html`(innerHTML), `data-i18n-title`, `data-i18n-ph`. `docTitle` 키가 있으면 `<title>` 자동 반영.
- JS 안 동적 문자열은 `GritI18n.t("key")`.
- 스위처 색은 `--lang-*` CSS 변수로 테마에 맞춤. 스위처가 주입하는 🌐 글리프는 홈에선 CSS로 숨김(이모지 금지).
- 홈은 `home*` 키를 `index.html` 스크립트에서 직접 register + `#langMount`에 mount. 도구는 자기 키를 register + 자신의 `#grit-bar` 안 `#langMount`에 mount.

## 컨벤션

- **빌드 도구·프레임워크 없음.** 순수 HTML/CSS/JS, 파일 더블클릭으로 실행. (외부 의존성은 폰트 CDN과 공유 `i18n.js`뿐.)
- 새 도구는 **단일 HTML 파일**(CSS·JS 인라인).
- 도구 페이지 상단에 공통 `#grit-bar`(로고 / 도구명 / `#langMount` / "← 모든 도구"). `pixel-coords.html` 참고.
- 도구 JS는 구형 브라우저 호환 **ES5 스타일** 유지(`var`, `keyCode`, `execCommand` 폴백 등).
- 도구 페이지엔 광고를 넣지 않는다.
- UI 기본 한국어, 단 모든 사용자 노출 문자열은 i18n 키로 4개 언어 제공.

## 새 도구 추가 절차

1. `tools/image/pixel-coords.html`를 템플릿으로 `tools/<category>/` 안에 새 단일 HTML 파일 생성. 디자인 토큰(`:root`)과 폰트 링크를 동일하게 둔다.
2. `#grit-bar` 링크가 `../../index.html`, 그리고 `#langMount`·`<script src="../../i18n.js">`가 있는지 확인. `GritI18n.register({...})` + `GritI18n.init({ mount, onChange })`로 다국어 연결.
3. `index.html` **좌측 사이드바**의 해당 `.nav-group`에 `.nav-item`(아이콘 SVG + 이름 + `New` 배지) 추가, `href`를 `tools/<category>/<file>.html`로 연결.
4. `index.html` **콘텐츠**의 해당 카테고리 `.tool-grid`에 `.tool-card` 추가(아이콘 SVG, `.badge-new`, 설명, 메타). 설명/메타는 `home*` i18n 키로 등록.
5. 사이드바 `.gc`와 카테고리 헤더 `.cat-count` 숫자 갱신.
