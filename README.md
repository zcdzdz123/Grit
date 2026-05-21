# Grit Tools

> 작은 반복을 갈아버리는 미니 도구 모음

설치 없이, 로그인 없이 브라우저에서 바로 쓰는 개발자용 미니 도구 모음입니다.
모든 처리는 브라우저 안에서 이루어지며 파일·이미지는 서버로 전송되지 않습니다.

## 구성

| 경로 | 설명 |
|------|------|
| `index.html` | 랜딩/허브 페이지 — 도구 카탈로그 |
| `tools/` | 도구 모음 (카테고리별 하위 폴더: `image`, `text`, `file`) |
| `tools/image/pixel-coords.html` | 픽셀 좌표 추출기 (HMI / 임베디드 UI 개발용) |

## 실행

별도 빌드나 의존성이 없습니다. HTML 파일을 브라우저에서 직접 열면 됩니다.

```
index.html 더블클릭
```

## 도구 목록

### Image
- **Pixel Coords** ✅ — 이미지 클릭으로 픽셀 좌표 추출, 방향키 1px 조정, 코드 템플릿 복사
- Sprite Slicer, Color Picker, Px Ruler (예정)

### Text
- Case Converter, Text Cleaner (예정)

### File
- Batch Rename, JSON Formatter (예정)

## 기술 스택

- 순수 HTML / CSS / JavaScript (프레임워크·빌드 도구 없음)
- ES5 호환 스타일 (구형 브라우저 지원)
