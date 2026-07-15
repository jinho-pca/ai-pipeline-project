# CODEX HANDOFF - Galaxy Device Issue Triage Console

## 1. 프로젝트 개요

Galaxy Device Issue Triage Console은 Galaxy 디바이스 이슈를 `P0`, `P1`, `P2`로 분류하고, 이슈별 필수 QA 테스트와 담당 조직, Owner Review 필요 여부를 보여주는 웹 대시보드다.

- GitHub: https://github.com/jinho-pca/ai-pipeline-project
- 제출용 단일 파일: `submission/index.html`
- 원본 애플리케이션: Python 표준 라이브러리 서버 + `index.html`, `src/app.js`, `src/styles.css`
- 외부 패키지: 없음

## 2. 교육 목표와 구현 방식

이 프로젝트는 Main, Backend, Frontend, Integration, Tester 역할을 Git branch와 Codex managed worktree로 분리하는 실습이다.

1. Backend와 Frontend가 `master`에서 독립 분기해 병렬 구현한다.
2. Integration이 Backend 결과 위에 Frontend branch를 `--no-ff`로 병합한다.
3. 자동 검증 스크립트가 API 규칙과 DOM 계약을 검사한다.
4. Tester 증거는 코드와 분리된 report 및 approval draft로 남긴다.
5. 최종 판단은 diff, test output, Git commit, 역할별 report를 근거로 한다.

## 3. 주요 기능

- 12개 Galaxy 이슈 카드 표시
- 심각도, 재현율, 영향 범위 기반 P0/P1/P2 분류
- P0/P1/P2와 Owner Review 건수 요약
- 우선순위 및 Camera, Battery, Connectivity, Foldable UX, UI, Performance 필터
- ID, 제목, 디바이스 검색(제출용 단일 파일)
- P0 시각 강조
- 이슈별 필수 테스트, Owner Review, 담당 QA 표시
- 데스크톱/태블릿/모바일 반응형 UI
- 키보드 포커스, skip link, live region 등 기본 접근성 지원

## 4. 분류 규칙

- P0: `severity == High`이면서 영향 범위가 `System` 또는 `Multi-device`
- P0: 또는 재현율이 70 이상이고 핵심 영역(Camera, Battery, Connectivity, Foldable UX)
- P1: `severity == Medium`, 재현율 40 이상 또는 `App-wide`
- P2: 그 외
- 모든 이슈: `Smoke`
- P0/P1: `Regression`
- Multi-device: `Device Matrix`
- 영역별: Camera Smoke, Battery Drain, Reconnect, Foldable Layout
- Owner Review: 모든 P0, 그리고 핵심 영역의 P1

규칙의 단일 진실 공급원은 `tasks/acceptance.json`이다.

## 5. 실행 방법

### 제출용 단일 파일

`submission/index.html`을 브라우저에서 직접 연다. 데이터, CSS, JavaScript가 모두 내장되어 있어 서버와 네트워크가 필요 없다.

### 원본 API 프로젝트

```powershell
py server.py
```

브라우저에서 `http://127.0.0.1:8000`을 연다.

## 6. 검증 방법과 결과

```text
> py scripts/check_api.py
[check-api] PASS - 8 checks

> py scripts/check_dom.py
[check-dom] PASS - 4 checks

> py scripts/audit.py
[audit] api=PASS dom=PASS -> implementationRisk=LOW
```

Tester 증거:

- `docs/task_003/test/report.md`
- `docs/task_003/test/approval_draft.json`
- `docs/task_003/test/audit.json`

approval draft는 교육 규칙에 따라 자동 승인하지 않고 항상 `pending`이다.

## 7. 핵심 Git 증거

- Backend: `b1cf290` - issue triage backend 구현
- Frontend: `2f63e6c` - issue triage dashboard 구현
- Integration merge: `7a7ff21`
- Integration report: `0f449be`
- master 통합: `289b1f5`

## 8. 파일 구조

```text
server.py                         API 및 정적 파일 서버
index.html                        원본 앱 문서 구조
src/app.js                        API 호출, 카드/필터 렌더링
src/styles.css                    원본 앱 스타일
data/issues.json                  이슈 데이터
scripts/check_api.py              API 자동 검증
scripts/check_dom.py              DOM 계약 자동 검증
scripts/audit.py                  통합 위험도 산출
docs/task_003/*                   역할별 증거
submission/index.html             제출용 단일 파일 앱
submission/CODEX_HANDOFF.md       재현 및 인수인계 문서
```

## 9. 남은 리스크와 운영 메모

- 제출용 HTML은 평가와 시연을 위한 고정 스냅샷 데이터다. 운영 데이터 연동은 원본 API 버전을 사용한다.
- 원본 API는 교육용 Python 표준 라이브러리 서버로 인증, 영속 저장소, 동시 수정 기능이 없다.
- `approval_draft.json`은 승인 제안일 뿐 최종 승인이 아니다.
- 실제 운영 전에는 인증·권한, 감사 로그, 입력 스키마 검증, 배포 환경 테스트가 추가로 필요하다.

## 10. 제출 전 체크리스트

- [x] 단일 `index.html`이 서버 없이 열린다.
- [x] P0/P1/P2 요약과 Owner Review 건수가 표시된다.
- [x] 10개 필터와 검색이 동작한다.
- [x] 이슈별 priority, requiredTests, owner가 표시된다.
- [x] API 및 DOM 자동 검증이 PASS다.
- [x] implementationRisk가 LOW다.
- [x] `CODEX_HANDOFF.md`에 실행·검증·리스크가 기록되어 있다.
- [ ] 제출 폼은 사외 이메일로 최종 확인 후 1회 제출한다.
