# 교육 콘텐츠 학습 분석

## 1. 분석 범위

2026-07-15 기준 공개된 Notion 교육 허브와 다음 연결 콘텐츠를 확인했다.

- 교육 오버뷰 및 시간표
- 환경세팅 가이드와 트러블슈팅 항목
- 교안/실습 자료실 구조
- `practice3.pdf` 41쪽 전체 및 화면 레이아웃
- Practice 1 + 자율 실습 안내
- Claude Code·Codex 필수 커맨드 비교
- 터미널 명령어 및 Frontmatter 안내
- 프롬프트 엔지니어링 원칙
- 산출물 제출 요구사항과 유의사항

자료실의 `multi_agents_orchestration_theory.pdf`는 파일명과 크기(1.8 MiB)는 확인했으나 공개 브라우저에서 첨부 버튼이 비활성화되어 본문을 추출하지 못했다. 사전설문, 계정 리스트, 핑 시트, 질의응답, 만족도조사는 교육 운영·개인정보 성격이므로 구조만 확인하고 응답 데이터는 열람하지 않았다.

## 2. 교육의 핵심 명제

이 교육은 “여러 AI를 동시에 쓰는 것”보다 “작업 경계와 검증 증거를 설계하는 것”을 멀티에이전트 오케스트레이션의 본질로 다룬다.

핵심 흐름은 다음과 같다.

```text
Main이 작업 분해
  -> Backend / Frontend가 독립 branch와 managed worktree에서 병렬 구현
  -> Integration이 두 branch를 병합하고 전체 검증
  -> Tester가 코드 수정 없이 증거 작성
  -> Human이 diff, test output, report, approval draft를 검토해 최종 판단
```

이는 대화 내용이 아니라 Git branch·commit·diff·테스트 출력·저장소 내부 문서를 전달 단위로 삼는 증거 중심 개발 방식이다.

## 3. 콘텐츠별 학습 분석

### 교육 오버뷰

교육은 이론, 환경 구성, Codex Desktop 실습, Claude Code Agent Teams, 자율 MVP 구현 순으로 진행된다. 오전에는 모델·하네스·아키텍처 선택의 개념을 다지고, 오후에는 실제 저장소에서 역할 분리와 병렬 작업을 수행한다. 즉 도구 설명보다 “어떤 작업을 어떤 실행 환경과 역할에 배치할 것인가”를 체험하도록 설계됐다.

### 환경세팅 가이드

IDE, Node/npm, PowerShell Execution Policy, Claude Code/Codex CLI, Git/GitHub, 계정 연동을 다룬다. 교육의 실질적 의미는 설치 자체보다 재현 가능한 공통 작업 환경을 먼저 고정하는 데 있다. 실습 3은 외부 패키지 없이 Python 표준 라이브러리만 사용해 환경 편차를 줄인다.

### Practice 3 - Codex Desktop 병렬 Worktree

41쪽 교안은 Galaxy Device Issue Triage Console을 통해 다음 원칙을 반복 검증한다.

- Starting branch와 Role branch를 구분한다.
- Backend와 Frontend는 모두 `master`에서 독립 분기한다.
- 사람이 `git worktree add/remove`를 실행하지 않고 Codex managed worktree를 사용한다.
- 역할별 수정 파일을 겹치지 않게 설계해 병렬 충돌 가능성을 낮춘다.
- Integration은 충돌을 임의 해결하거나 구현 파일을 직접 고치지 않는다.
- Tester는 통합본 위에서만 검증하며 approval 상태를 항상 `pending`으로 둔다.
- 자동 테스트를 통과시키기 위한 하드코딩이나 기준 변경을 금지한다.
- 최종 merge는 사람이 증거를 검토한 뒤 수행한다.

학습 포인트는 Git 사용법 자체가 아니라 책임·권한·증거의 분리다. 작업자가 많아질수록 성능보다 경계가 중요하며, 독립 파일 범위와 명시적 acceptance criteria가 병렬화의 전제다.

### Practice 1 + 자율 실습

아이디어를 Agent Teams로 MVP 명세로 만들고, 그 산출물을 Codex Desktop worktree 병렬 세션에서 구현한다. Practice 3이 정해진 문제를 통해 오케스트레이션 패턴을 학습한다면, Practice 1은 문제 정의와 명세 작성 단계까지 AI 협업 범위를 확장한다.

학습 단계는 다음과 같이 해석할 수 있다.

1. 아이디어 발산
2. 역할별 비판과 요구사항 보강
3. MVP acceptance criteria 확정
4. 병렬 구현
5. 독립 검증
6. 단일 결과물과 handoff 문서로 전달

### Claude Code·Codex 커맨드 비교

두 도구는 `/init`, `/compact`, `/status`, `/plan`, 모델·컨텍스트 관리 같은 공통 기능이 있지만 운영 강점이 다르다.

- Claude Code: `/resume`, `/rewind`, `/clear`, `/context` 등을 통한 세션·코드 상태 관리
- Codex Desktop: `/goal`, `/review`, 작업·worktree UI를 통한 장시간 목표와 병렬 실행 관리

도구 선택은 모델 성능만으로 결정하지 않고 세션 복구, 리뷰, 작업 격리, 장기 실행 같은 하네스 기능까지 포함해야 한다.

### 터미널 명령어와 Frontmatter

파일·폴더·Git·Python 환경을 직접 확인하는 기본 명령을 제공한다. 멀티에이전트 작업에서 터미널은 단순 조작 도구가 아니라 현재 경로, branch, clean 상태, 변경 파일, 테스트 결과를 확인하는 관측 계층이다. Frontmatter는 재사용 지침이나 스킬의 메타데이터를 구조화해 실행 조건과 설명을 명확히 한다.

### 프롬프트 엔지니어링

자료는 좋은 프롬프트를 “길게 쓰는 것”이 아니라 불확실성과 작업 자유도를 통제하는 계약으로 설명한다.

주요 원칙:

- 역할 + 작업 목표 + 실제 코드 맥락 + 완료 기준을 함께 제시
- 예시로 출력 형식과 품질 기준을 고정
- 복잡한 문제를 단계와 하위 문제로 분해
- 청중과 설명 난이도를 지정
- XML/Markdown 구분자로 지시·자료·입력·출력을 분리
- 실제 파일, 함수, 선택자, 테스트 결과로 grounding
- 언제 읽고, 수정하고, 테스트할지 tool-use policy 지정
- 완료 전에 self-check 루브릭 수행
- 장기 작업은 progress 문서와 Git 상태로 이어가기
- 테스트 케이스만 맞춘 하드코딩 금지
- 여러 후보를 비교한 뒤 선택
- 정보 부족 시 질문·가정·중단 기준을 명시

이 원칙들은 Practice 3의 역할 프롬프트에 그대로 반영된다. 각 프롬프트가 역할, 허용 파일, 금지 행동, 실행할 테스트, 커밋 메시지와 중단 조건까지 명시하기 때문이다.

### 산출물 제출

제출 페이지는 프로젝트 링크와 다음 파일을 요구한다.

1. 고도화 최종 결과물: 단일 `index.html`
2. 실습 Markdown: `CODEX_HANDOFF.md`

1회만 제출 가능하고 제출 후 수정할 수 없으므로, 링크 접근성·브라우저 동작·파일명·사외 이메일 사용 여부를 최종 확인해야 한다.

## 4. 프로젝트 적용 평가

| 교육 원칙 | 프로젝트 증거 | 평가 |
| --- | --- | --- |
| 역할 분리 | Backend, Frontend, Integration branch와 report | 충족 |
| 독립 구현 | 서로 겹치지 않는 허용 파일 | 충족 |
| acceptance grounding | `tasks/acceptance.json` | 충족 |
| 자동 검증 | `check_api`, `check_dom`, `audit` | 모두 PASS |
| 위험도 정책 | API/DOM PASS -> LOW | 충족 |
| Tester 증거 | `docs/task_003/test/` 3개 파일 | 보완 완료 |
| 단일 제출 파일 | `submission/index.html` | 보완 완료 |
| 재현 가능한 handoff | `submission/CODEX_HANDOFF.md` | 보완 완료 |

## 5. 구현 결과의 학습적 의미

완성된 앱보다 중요한 결과는 다음 네 가지다.

1. 병렬화 가능한 작업은 파일 소유권이 겹치지 않도록 먼저 설계해야 한다.
2. Agent의 완료 보고보다 자동 테스트와 Git diff가 신뢰도가 높다.
3. Integration과 Tester가 구현을 고치지 않아야 실패 원인이 담당 역할로 되돌아간다.
4. 제출용 단일 파일과 handoff 문서는 실행 환경 차이를 줄이고 결과물 확인 실패 위험을 낮춘다.

## 6. 최종 결론

이 교육은 멀티에이전트를 “더 많은 생성”이 아니라 “분해된 책임, 격리된 실행, 검증 가능한 증거, 사람의 최종 통제”로 정의한다. Galaxy Issue Console 프로젝트는 이 패턴을 작은 웹앱에 적용한 사례이며, 동일한 구조를 결제 장애, 보안 이벤트, 품질 승인, 배포 전 점검과 같은 실제 업무로 확장할 수 있다.
