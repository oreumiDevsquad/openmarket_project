# openmarket_project

## 네이밍 규칙

| 규칙 적용 대상       | 규칙             | 예시                                  |
| -------------------- | ---------------- | ------------------------------------- |
| HTML                 | kebab-case       | `product-card, user-info`             |
| CSS 클래스           | BEM 방식         | `product-card\_\_title, btn--primary` |
| JavaScript 변수/함수 | camelCase        | `userName, fetchProducts`             |
| JavaScript 상수      | UPPER_SNAKE_CASE | `API_BASE_URL, MAX_ITEMS`             |
| 파일명               | kebab-case       | `product-detail.html, user-utils.js`  |

## 작업 흐름

1. develop에서 feature 브랜치 생성

```bash
git checkout develop
git pull origin develop
git checkout -b feature/product-list
```

2. 작업 진행 및 커밋

```bash
git add .
git commit -m "feat: 상품 목록 페이지 HTML 구조 완성"
```

3. Pull Request 생성

- feature → develop으로 PR 생성
- **코드 리뷰** 후 머지

배포 준비

- develop → main으로 최종 머지

## 커밋 컨벤션

커밋 메시지는 아래 규칙을 따릅니다.

### 💬 커밋 메시지 규칙

type: 간단한 설명 (50자 이내)

### type 종류:

```
feat: 새로운 기능 추가 (HTML, CSS, JS)
fix: 버그 수정
style: CSS 스타일 변경
refactor: 코드 리팩토링
docs: 문서 수정 (README, 주석 등)
chore: 기타 작업 (파일 정리 등)
```

### 예시

- `feat: 상품 상세 페이지 HTML 구조 구현`
- `fix: 모바일에서 네비게이션 메뉴 오류 수정`
- `style: 메인 페이지 반응형 CSS 개선`
- `refactor: 공통 유틸리티 함수 모듈화`

## 이슈 양식

```
name: "🐞 버그 리포트"
about: "문제가 발생했을 때 작성해주세요."
title: "[BUG] "
labels: "bug"
```

어떤 버그인가요?
발생한 문제에 대해 간단히 설명해주세요.

재현 방법
어떤 순서로 진행했을 때 버그가 발생했는지 알려주세요.

기대했던 결과
원래 어떻게 동작해야 했나요?

---

필요하다면 스크린샷을 첨부해주세요.

```
name: "✨ 기능 제안"
about: "새로운 아이디어를 제안해주세요."
title: "[FEAT] "
labels: "feature"
```

어떤 기능인가요?
추가하고 싶은 기능에 대해 간단히 설명해주세요.

왜 필요한가요?
이 기능이 어떤 점을 개선하거나 해결할 수 있는지 알려주세요.

## 코딩 컨벤션

### HTML 규칙

- 시맨틱 어떻게 사용할건지

### CSS 규칙

- 속성 순서

### Javascript 규칙

- 상수 , 함수 , 변수 , 이벤트 리스너 등 위치를 어디로 정할지

## 📁 폴더 구조

임시 데이터)

```
root/
├── index.html              # 메인 페이지
├── pages/                  # 각 페이지별 HTML 파일
│   ├── login.html         # 로그인 페이지
│   ├── signup.html        # 회원가입 페이지
│   ├── products.html      # 상품 목록 페이지
│   ├── product-detail.html # 상품 상세 페이지
│   ├── cart.html          # 장바구니 페이지
│   └── mypage.html        # 마이페이지
├── assets/                 # 정적 파일들
│   ├── css/               # CSS 파일들
│   │   ├── common.css     # 공통 스타일
│   │   ├── main.css       # 메인 페이지 스타일
│   │   ├── products.css   # 상품 관련 스타일
│   │   └── components.css # 컴포넌트별 스타일
│   ├── js/                # JavaScript 파일들
│   │   ├── common.js      # 공통 함수
│   │   ├── api.js         # API 관련 함수
│   │   ├── utils.js       # 유틸리티 함수
│   │   ├── validation.js  # 입력 검증 함수
│   │   └── pages/         # 페이지별 JS 파일
│   │       ├── main.js
│   │       ├── login.js
│   │       └── products.js
│   ├── images/            # 이미지 파일들
│   └── icons/             # 아이콘 파일들
├── components/            # 재사용 가능한 HTML 컴포넌트
│   ├── header.html        # 공통 헤더
│   ├── footer.html        # 공통 푸터
│   └── nav.html           # 내비게이션
└── README.md              # 프로젝트 설명서
```
