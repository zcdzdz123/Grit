# Grit Tools — 도구 제작 디자인 가이드

> 새 도구를 만들 때 이 문서를 그대로 따른다. 모든 도구는 **단일 HTML 파일**, **다크 모드 전용**, **풀스크린 레이아웃**, **4개 언어 i18n**, **100% 클라이언트 사이드**.

기준 템플릿: `tools/calc/simple-interest.html` (구조·CSS·i18n·도움말 모달의 정본). 새 도구는 이 파일을 복제해서 시작하는 것을 권장한다.

---

## 1. 핵심 원칙

| 원칙 | 내용 |
|------|------|
| 단일 파일 | 도구 1개 = HTML 파일 1개. 빌드·번들 없음. |
| 클라이언트 전용 | 사용자 파일/이미지/입력은 **절대 서버로 전송하지 않는다.** 모든 처리는 브라우저에서. |
| ES5 호환 | `var`/`function`만 사용. **화살표 함수·`const`/`let`·템플릿 리터럴(백틱) 금지.** |
| 다크 전용 | 라이트 모드 없음. 테마 토글 없음. |
| 풀스크린 | 뷰포트를 꽉 채우는 앱 레이아웃. 내부 패널에서 스크롤. |
| 다국어 | `ko`(기본)·`en`·`ja`·`zh` 4개 언어 필수. |
| 외부 의존성 | 폰트 CDN은 허용. PDF/엑셀 등 바이너리 포맷은 **고정 버전 CDN 라이브러리** 1개 허용(pdf-lib, SheetJS, pdf.js). 라이브러리 JS만 받아오고 사용자 데이터는 전송하지 않는다. |

---

## 2. 색상 토큰 (다크 전용) — `:root`에 그대로 복사

```css
:root{
  --bg:#0f1115; --surface:#171a21; --surface-2:#1e222b;
  --blue:#54b0f7; --blue-dark:#7cc3fa; --blue-soft:rgba(84,176,247,.16);
  --text:#f2f4f7; --text-dim:#9aa3b2; --text-muted:#646e7e;
  --border:#2b313c; --border-lit:#3a4250;
  --radius-pill:9999px;
  --shadow-card:0 1px 3px rgba(0,0,0,.5),0 1px 2px rgba(0,0,0,.4);
  --font-ui:'Inter','Pretendard',ui-sans-serif,system-ui,sans-serif;
  --font-mono:'Consolas','JetBrains Mono',ui-monospace,monospace;
}
html { color-scheme:dark; }
```

**금지:** `html[data-theme="dark"]{…}` 블록, `localStorage["theme"]` 부트스트랩 `<script>`, 테마 토글 버튼, `color-scheme:light dark`.

- `--blue` 강조색은 액션 버튼·활성 상태·핵심 수치에만. 다른 채도 높은 색 추가 금지.
- 카드/패널 radius: `14px`(도구 패널) / `10px`(모달). 버튼·칩: `--radius-pill`.

---

## 3. 풀스크린 레이아웃 골격

```css
html, body { margin:0; height:100%; font-family:var(--font-ui); background:var(--bg); color:var(--text); }
body { padding-top:38px; overflow:hidden; }            /* 38px = 고정 grit-bar */
.app { height:calc(100vh - 38px); display:flex; flex-direction:column; gap:14px; padding:22px 26px; overflow:hidden; }
.panels { flex:1 1 auto; min-height:0; display:grid; gap:18px; }   /* 패널들이 남은 높이를 채움 */
.panel { display:flex; flex-direction:column; min-height:0; overflow:auto; background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:24px; box-shadow:var(--shadow-card); }

/* 좁은 화면: 풀스크린 해제 → 스크롤 스택 (반드시 포함) */
@media (max-width:1080px){ body{overflow:auto;} .app{height:auto; overflow:visible;} .panels{grid-template-columns:1fr;} }
```

- 페이지 자체는 스크롤하지 않는다. **남는 높이를 패널이 채우고, 넘치는 내용은 패널 내부에서 스크롤**(`min-height:0; overflow:auto`).
- 좁은 화면(`max-width:1080px`) 폴백은 필수. 그 이하에서는 한 컬럼 스택.

---

## 4. 공통 상단바(grit-bar)

```html
<div id="grit-bar">
  <a href="../../index.html" class="g-logo">Grit</a><span class="g-sep">/</span>
  <span class="g-tool" data-i18n="xxTool">도구 이름</span>
  <button type="button" id="helpBtn" class="g-help" data-i18n="xxHelpBtn">사용법</button>
  <span id="langMount"></span>
  <a href="../../index.html" class="g-home" data-i18n="xxAllTools">← 모든 도구</a>
</div>
```

- 경로는 항상 `../../index.html`, 스크립트는 `../../i18n.js` (도구는 `tools/<카테고리>/` 2단계 깊이).
- `사용법` 도움말 모달(3단계)을 표준으로 포함. ESC·배경 클릭으로 닫힌다.

---

## 5. i18n (`../../i18n.js` 공유 엔진)

- 마크업: `data-i18n`(textContent) / `data-i18n-html`(innerHTML) / `data-i18n-title` / `data-i18n-ph`(placeholder).
- JS 동적 문자열: `GritI18n.t("key")`.
- 도구마다 **고유 접두사**로 키를 짓는다 (예: 단리=`si`, PDF분할=`ps`). 충돌 방지.
- `register({ko,en,ja,zh})`에 **4개 언어 모두** 정의. `docTitle` 키 포함(문서 제목 자동 반영).
- 초기화: `GritI18n.init({ mount: document.getElementById("langMount"), onChange: 재계산함수 });`
- **마크업/JS에서 쓰는 모든 키는 4개 언어에 빠짐없이 존재해야 한다.** (정적 검수 항목)

---

## 6. 폴더 / 카테고리 구조

```
index.html              허브(도구 카탈로그)
i18n.js                 다국어 엔진(공유)
tools/
  image/   픽셀 좌표, 이미지 크기 조절, 색상 추출
  text/    표→마크다운, 영어주소 변환, 텍스트 합치기
  calc/    복리·단리, 연봉 실수령액, 디데이, 환율
  pdf/     PDF 나누기·합치기·이미지 변환
  file/    엑셀 시트 분할, 파일 이름 일괄 변경
```

- **한 폴더에 다 몰아넣지 않는다.** 성격에 맞는 카테고리 폴더에 둔다. 새 성격이면 새 카테고리(폴더 + 허브 섹션 + 사이드바 그룹)를 만든다.
- 새 도구 추가 시 `index.html`에 **반드시 3곳**을 갱신: ① 사이드바 `<nav>` 항목 + 그룹 카운트, ② 허브 카드 + `cat-count`, ③ `GritI18n.register`의 4개 언어 키(`nav<X>`, `home<X>Desc`).

---

## 7. 허브 카드 형식

```html
<a class="tool-card" href="tools/<cat>/<tool>.html">
  <div class="tool-icon"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true">…</svg></div>
  <div class="tool-name"><span data-i18n="nav<X>">이름</span><span class="badge-new">NEW</span></div>
  <p class="tool-desc" data-i18n="home<X>Desc">한 줄 설명</p>
  <div class="tool-meta"><span data-i18n="…">태그1</span><span data-i18n="…">태그2</span></div>
</a>
```

- 모든 카드에 **간단한 설명(`tool-desc`) + 태그 2개(`tool-meta`)**를 넣는다(좌표 계산기 카드 기준).
- 공용 태그 키 재사용: `metaNoUpload`(서버 전송 없음), `metaCopy`, `metaDownload`, `metaDragDrop`, `metaExcel`, `metaInstant`, `metaPreview`, `metaEstimate`, `metaLive`, `metaScript`, `metaImage`.
- 도구 이름(한국어)은 **이해하기 쉬운 동사형**으로: "PDF 나누기/합치기", "표를 마크다운으로", "파일 이름 일괄 변경" 등.

---

## 8. 외부 라이브러리 (바이너리 포맷 한정)

| 용도 | 라이브러리 | CDN | 전역 |
|------|-----------|-----|------|
| PDF 편집(분할/병합) | pdf-lib@1.17.1 | `cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js` | `PDFLib` |
| PDF 렌더(→이미지) | pdfjs-dist@3.11.174 | `…/pdfjs-dist@3.11.174/build/pdf.min.js` (+ `workerSrc` 설정) | `pdfjsLib` |
| 엑셀 읽기/쓰기 | xlsx@0.18.5 | `…/xlsx@0.18.5/dist/xlsx.full.min.js` | `XLSX` |

- 전역이 `undefined`일 때를 대비한 **로드 실패 가드**를 반드시 둔다.
- 사용자 파일은 여전히 브라우저 안에서만 처리한다(업로드 금지).

---

## 9. 새 도구 체크리스트

- [ ] `tools/<카테고리>/<도구>.html` 단일 파일, `../../` 경로
- [ ] 다크 전용 `:root` (라이트/토글/부트스트랩 없음)
- [ ] 풀스크린 `.app` + `@media(max-width:1080px)` 폴백
- [ ] grit-bar(로고/구분/이름/사용법/언어/모든 도구) + 3단계 도움말 모달
- [ ] 고유 접두사 i18n, 4개 언어 + `docTitle`, 모든 키 등록 확인
- [ ] ES5(화살표·const/let·백틱 금지) / 태그 균형
- [ ] `<head>` SEO 메타 + `theme-color #3ba6f1` + WebApplication ld+json
- [ ] (해당 시) CDN 라이브러리 + 로드 실패 가드, 파일 업로드 없음
- [ ] `index.html` 3곳(nav·허브 카드·i18n) 갱신, 카운트 갱신
