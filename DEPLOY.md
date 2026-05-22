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

## SEO 현황 (도메인 `grit-tools.com` 기준 — 완료)

절대 URL이 필요한 항목까지 모두 적용 완료. 도메인을 바꾸면 아래 파일의 `https://grit-tools.com`을 일괄 치환하면 된다.

1. ✅ **canonical + og:url + og:image** — `index.html`과 도구 16개 전 페이지 `<head>`에 적용. og:image는 `/og.png`(1200×630) 절대 URL.
2. ✅ **robots.txt**(루트) — `Sitemap: https://grit-tools.com/sitemap.xml` 포함.
3. ✅ **sitemap.xml**(루트) — 허브 + 도구 16개 전부 등록.
4. ✅ **og.png**(루트) — 1200×630 다크 브랜드 소셜 카드. `og:image`·`twitter:image`에 연결, `twitter:card=summary_large_image`.
5. ✅ **다국어** — i18n 9개 언어(ko·en·ja·zh·es·fr·de·pt·ru). og:locale:alternate에 9개 로케일 명시.
   - hreflang은 **의도적으로 생략**: 단일 URL이 JS로 언어를 전환하므로 언어별 개별 URL이 없어 hreflang이 부적합.
6. ✅ **JSON-LD** — 허브는 WebSite + 도구 16개 ItemList, 각 도구는 SoftwareApplication. inLanguage 9개 언어.

### 남은 일 (배포 후 1회)
- 배포 후 **Google Search Console**에 `grit-tools.com` 등록(소유권 확인) → `sitemap.xml` 제출 → 색인 요청.
- (선택) Bing Webmaster Tools에도 동일하게 등록.
