# task_003 Frontend 구현 보고서

## 구현 내용

- `GET /api/issues`로 이슈 목록을 조회하고 각 이슈를 `POST /api/triage`로 분류한다.
- 이슈 정보와 분류 결과(priority, requiredTests, ownerReview, owner)를 카드로 렌더링한다.
- P0/P1/P2 및 Owner Review 건수를 요약 영역에 표시한다.
- All, 우선순위, 영역 필터를 제공하고 선택한 조건에 맞는 카드만 표시한다.
- P0 카드 강조, 필터 상태, 반응형 카드 그리드를 구현했다.
- DOM 생성 시 API 응답을 `textContent`로 삽입한다.

## 변경 파일

- `index.html`
- `src/app.js`
- `src/styles.css`
- `docs/task_003/frontend/report.md`

## 검증 결과

```text
> py scripts/check_dom.py
[check-dom] PASS - 4 checks

> git diff --check
PASS (no whitespace errors)
```

구현 위험도: LOW (`check_dom.py` PASS)

