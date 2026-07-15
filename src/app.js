// Galaxy Device Issue Triage Console - frontend

const FILTERS = [
  "All", "P0", "P1", "P2", "Camera", "Battery", "Connectivity",
  "Foldable UX", "UI", "Performance",
];

let triagedIssues = [];
let activeFilter = "All";

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

async function triageIssue(issue) {
  const res = await fetch("/api/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issue),
  });
  if (!res.ok) {
    throw new Error(`failed to triage ${issue.id}: ${res.status}`);
  }
  const result = await res.json();
  return { ...issue, ...result, id: issue.id };
}

function updateSummary(items) {
  for (const priority of ["P0", "P1", "P2"]) {
    document.getElementById(`summary-${priority.toLowerCase()}`).textContent =
      String(items.filter((item) => item.priority === priority).length);
  }
  document.getElementById("summary-review").textContent =
    String(items.filter((item) => item.ownerReview).length);
}

function createCard(item) {
  const card = makeElement("article", `card card-${item.priority.toLowerCase()}`);
  card.dataset.priority = item.priority;
  card.dataset.area = item.area;

  const heading = makeElement("div", "card-heading");
  heading.append(
    makeElement("span", `priority priority-${item.priority.toLowerCase()}`, item.priority),
    makeElement("span", "issue-id", item.id),
  );
  card.append(heading, makeElement("h2", "card-title", item.title));

  const metadata = makeElement("dl", "card-meta");
  const fields = [
    ["Device", item.device],
    ["Area", item.area],
    ["Severity", item.severity],
    ["Repro rate", `${item.reproRate}%`],
    ["Impact", item.impactScope],
    ["Owner", item.owner || "Unassigned"],
  ];
  for (const [label, value] of fields) {
    metadata.append(makeElement("dt", "", label), makeElement("dd", "", value));
  }
  card.append(metadata);

  const tests = makeElement("div", "tests");
  tests.append(makeElement("span", "tests-label", "Required tests"));
  const testList = makeElement("div", "test-list");
  for (const test of item.requiredTests || []) {
    testList.append(makeElement("span", "test-chip", test));
  }
  tests.append(testList);
  card.append(tests);

  if (item.ownerReview) {
    card.append(makeElement("p", "review-badge", "Owner review required"));
  }
  return card;
}

function matchesFilter(item, filter) {
  return filter === "All" || item.priority === filter || item.area === filter;
}

function renderBoard() {
  const board = document.getElementById("issue-board");
  const visibleItems = triagedIssues.filter((item) => matchesFilter(item, activeFilter));
  board.replaceChildren(...visibleItems.map(createCard));
  if (visibleItems.length === 0) {
    board.append(makeElement("p", "placeholder", "해당 조건의 이슈가 없습니다."));
  }
}

function renderFilters() {
  const bar = document.getElementById("filter-bar");
  const buttons = FILTERS.map((filter) => {
    const button = makeElement("button", "filter-button", filter);
    button.type = "button";
    button.dataset.filter = filter;
    button.setAttribute("aria-pressed", String(filter === activeFilter));
    button.addEventListener("click", () => {
      activeFilter = filter;
      for (const current of bar.querySelectorAll("button")) {
        current.setAttribute("aria-pressed", String(current === button));
      }
      renderBoard();
    });
    return button;
  });
  bar.replaceChildren(...buttons);
}

async function loadIssues() {
  const res = await fetch("/api/issues");
  if (!res.ok) {
    throw new Error("failed to fetch issues: " + res.status);
  }
  const issues = await res.json();
  if (!Array.isArray(issues)) {
    throw new Error("issues response must be an array");
  }
  triagedIssues = await Promise.all(issues.map(triageIssue));
  updateSummary(triagedIssues);
  renderFilters();
  renderBoard();
}

loadIssues().catch((err) => {
  console.error(err);
  const panel = document.getElementById("error-panel");
  if (panel) {
    panel.textContent = "이슈를 불러오지 못했습니다. 서버가 실행 중인지 확인하세요.";
  }
  const board = document.getElementById("issue-board");
  if (board) board.replaceChildren();
});
