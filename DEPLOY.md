# DEPLOY.md — Cloudflare 배포 + 도메인 가이드

Grit Tools(정적 사이트)를 Cloudflare Pages로 배포하고 도메인을 연결하는 절차.
**호스팅·배포는 무료, 도메인 값만 결제**한다.

전체 그림: ① 도메인 구입(Registrar) → ② 사이트 배포(Pages) → ③ 도메인 연결.

## 사전: 도메인 이름 확정

구매 단계에서 실제 가능 여부가 나오니 1순위/2순위 후보를 정해둔다
(예: `grittools.com`, `gritbox.com`).
`.com` 기준 Cloudflare 원가 ≈ 연 **$10~11**(약 1.4만원, ICANN 수수료 포함).

## ① Cloudflare 가입 + 도메인 구입

1. https://dash.cloudflare.com/sign-up 에서 가입 (무료, 신용카드는 도메인 결제 시에만).
2. 왼쪽 메뉴 **Domain Registration → Register Domains**.
3. 원하는 도메인 검색 → 사용 가능하면 장바구니 → 카드 결제.
   - Cloudflare는 마진 없이 원가로 판매. 자동으로 DNS도 Cloudflare에서 관리됨(③에 유리).

## ② Cloudflare Pages로 GitHub 저장소 배포

1. 왼쪽 메뉴 **Workers & Pages → Create → Pages 탭 → Connect to Git**.
2. GitHub 연동 승인 → 저장소 목록에서 `zcdzdz123/Grit` 선택.
3. 빌드 설정 (정적 사이트라 빌드 없음):
   - **Framework preset**: None
   - **Build command**: (비움)
   - **Build output directory**: `/` (저장소 루트 — `index.html`이 루트에 있음)
4. **Save and Deploy** → 잠시 후 `https://grit-xxxx.pages.dev` 주소로 배포됨.
   - 이때부터 GitHub `main`에 푸시할 때마다 **자동 재배포**.

## ③ 구입한 도메인 연결

1. 만든 Pages 프로젝트 → **Custom domains → Set up a domain**.
2. 구입한 도메인 입력(예: `grittools.com`, `www`도 추가 권장).
3. 도메인이 이미 Cloudflare에 있으므로 DNS 레코드가 자동 생성됨.
   수 분 내 `https://grittools.com` 접속 가능 (SSL 인증서도 자동).

## 진행 순서 추천

1. 지금 바로 **②번(Pages 배포)**만 해서 `grit-xxxx.pages.dev`로 동작 확인 (도메인 없이 무료).
2. 도메인 이름 확정 후 **①·③번**으로 브랜드 주소 연결.

> 막히는 단계가 있으면 화면에 보이는 내용을 알려주면 빌드 설정값·DNS를 정확히 짚어줄 수 있음.

## 도메인 확정 후 SEO 마무리 (TODO)

도메인이 정해지면 절대 URL이 필요한 항목을 추가한다. `index.html`에는 이미 도메인이
필요 없는 SEO(메타 설명·OG/트위터 카드·숨김 `<h1>`·JSON-LD 구조화 데이터)가 들어가 있음.

1. `index.html` `<head>`에 canonical + og:url 추가:
   `<link rel="canonical" href="https://<도메인>/">`, `<meta property="og:url" content="https://<도메인>/">`.
2. 다국어 hreflang(선택): 단일 URL이 4개 언어를 JS로 전환하므로 필수는 아님.
3. **robots.txt**(루트): `User-agent: *` / `Allow: /` / `Sitemap: https://<도메인>/sitemap.xml`.
4. **sitemap.xml**(루트): `/`(허브)와 `tools/image/pixel-coords.html` URL 등록.
5. **og:image**(선택): 1200×630 미리보기 이미지 만들어 `og:image`·`twitter:image`에 절대 URL로 연결(소셜 공유 카드).
6. 배포 후 **Google Search Console**에 도메인 등록 → sitemap 제출 → 색인 요청.
