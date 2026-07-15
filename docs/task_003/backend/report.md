# task_003 Backend 작업 보고서

## 작업 정보

- 역할 브랜치: `task/003-backend`
- 기준 브랜치: `master`
- 작업일: 2026-07-15

## 변경 내용

- `server.py`의 `classify_issue`에 P0/P1/P2 분류 규칙을 구현했다.
- 우선순위에 따른 `Smoke`, `Regression` 테스트와 영향 범위 및 영역별 필수 테스트를 구성했다.
- 필수 테스트의 순서를 유지하면서 중복을 제거했다.
- 우선순위와 영역에 따른 `ownerReview` 및 영역별 `owner` 매핑을 구현했다.
- 분류 결과에 사람이 확인할 수 있는 `reasons` 배열을 포함했다.
- 기존 `GET /api/health`와 요청마다 `data/issues.json`을 다시 읽는 `GET /api/issues` 동작은 유지했다.

## 검증 결과

실행 명령:

```text
py scripts/check_api.py
```

결과:

```text
[check-api] PASS - 8 checks
```

Backend 허용 파일인 `server.py`와 이 보고서만 변경했다.
