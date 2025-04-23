# WebP 변환 MCP 서버

이 프로젝트는 이미지 파일을 WebP 형식으로 변환하는 Model Context Protocol(MCP) 서버입니다.

## 기능

- PNG, JPG, JPEG 파일을 WebP로 변환
- 클라이언트가 선택한 이미지 파일만 변환
- 변환 결과 상세 리포트 제공

## Smithery 배포 방법

1. Smithery에서 서버 추가 또는 기존 서버 선택
2. 배포 탭 접근 (인증된 소유자만 가능)
3. 배포 구성 및 배포 진행

## 로컬 개발 방법

### 필수 조건

- Node.js 16+ 설치
- npm 또는 yarn 설치

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 모드 실행
npm run dev

# 빌드
npm run build

# 프로덕션 모드 실행
npm start
```

## MCP 도구 목록

### convert_webp

클라이언트가 선택한 PNG, JPG, JPEG 이미지 파일을 WebP로 변환합니다.

**기능:**

- 클라이언트가 선택한 PNG, JPG, JPEG 파일만 처리
- 각 이미지를 80% 품질의 WebP로 변환
- 원본 파일명을 유지하면서 확장자만 .webp로 변경
- 변환 결과 상세 리포트 제공 (성공 및 실패 정보)

**사용 방법:**

1. 변환하려는 이미지 파일 선택
2. MCP 도구를 통해 `convert_webp` 명령어 실행
3. 변환 결과 확인

## 라이센스

MIT
