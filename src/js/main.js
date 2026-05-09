import "../styles/main.css";

// Prompt data is fetched from a static JSON asset only when the library is near use.
let PROMPTS = [];
let promptLibraryPromise;
let promptLibraryStatus = "idle";

const PROMPT_DATA_URL = `${import.meta.env.BASE_URL}data/prompts.json`;

function updatePromptLibraryState(status) {
  promptLibraryStatus = status;
  const empty = document.getElementById("pm-empty");
  const count = document.getElementById("pm-count");
  const grid = document.getElementById("pm-grid");

  grid?.setAttribute("aria-busy", status === "loading" ? "true" : "false");
  if (count && status === "loading") count.textContent = "…";

  if (!empty || status === "loaded") return;
  empty.classList.add("visible");
  const title = empty.querySelector("h3");
  const body = empty.querySelector("p");
  if (status === "loading") {
    if (title) title.textContent = "Loading prompt library…";
    if (body) body.textContent = "Fetching paste-ready prompts only when you need them.";
  } else if (status === "error") {
    if (count) count.textContent = "0";
    if (title) title.textContent = "Prompt library unavailable";
    if (body) body.textContent = "Refresh the page or check the deployed data asset.";
  }
}

async function loadPromptLibrary() {
  if (promptLibraryPromise) return promptLibraryPromise;

  updatePromptLibraryState("loading");
  promptLibraryPromise = fetch(PROMPT_DATA_URL, { cache: "force-cache" })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Prompt library failed: ${response.status}`);
      PROMPTS = await response.json();
      updatePromptLibraryState("loaded");
      buildCategoryChips();
      renderPmGrid();
      return PROMPTS;
    })
    .catch((error) => {
      console.error(error);
      promptLibraryPromise = undefined;
      updatePromptLibraryState("error");
      return [];
    });

  return promptLibraryPromise;
}

function primePromptLibrary() {
  void loadPromptLibrary();
}

// ── Learning path data ──
const STEPS = [
  {
    num: 1,
    title: "What is AI?",
    desc: "Understand what AI actually is — in plain English, no jargon.",
    icon: "🤖",
    iconBg: "var(--teal-bg)",
    detail:
      "AI (Artificial Intelligence) is software that can understand language, recognize patterns, and generate responses — like a very well-read assistant who has processed millions of documents.",
    tips: [
      "AI doesn't 'think' like a human — it predicts what word or answer comes next based on patterns",
      "It's trained on huge amounts of text from the internet, books, and other sources",
      "You interact with it by typing in plain language — no coding required",
      "The most popular AI tools right now are ChatGPT, Copilot, Gemini, and Claude",
    ],
  },
  {
    num: 2,
    title: "What can AI help with?",
    desc: "Discover the most useful everyday work tasks where AI saves real time.",
    icon: "💡",
    iconBg: "var(--amber-bg)",
    detail:
      "AI is best at tasks involving language: writing, summarizing, explaining, translating, and generating ideas. It's less reliable for precise facts, numbers, or anything requiring real-world knowledge.",
    tips: [
      "Great for: drafting emails, summarizing documents, brainstorming, creating templates",
      "Good for: explaining concepts, rewriting text, generating checklists, creating outlines",
      "Use with caution: specific facts, dates, statistics — always verify these",
      "Not suitable for: confidential data, final decisions, or replacing expert judgment",
    ],
  },
  {
    num: 3,
    title: "How to ask AI properly",
    desc: "The secret to great AI results is how you phrase your request.",
    icon: "✍️",
    iconBg: "var(--violet-bg)",
    detail:
      "The quality of your AI output depends almost entirely on the quality of your prompt. A good prompt gives AI a role, a clear task, and a desired format.",
    tips: [
      "Use the formula: 'You are a [role]. [Task]. Output as [format].'",
      "Be specific: instead of 'write an email', say 'write a 3-sentence follow-up email to a client'",
      "Add context: tell AI who the audience is, what tone to use, and any constraints",
      "Iterate: if the first result isn't right, ask AI to adjust it — 'make it shorter', 'make it more formal'",
    ],
  },
  {
    num: 4,
    title: "How to review AI output",
    desc: "AI is a first draft machine — here's how to make it work-ready.",
    icon: "🔍",
    iconBg: "var(--coral-bg)",
    detail:
      "Never use AI output without reviewing it. AI can be confidently wrong, miss your company context, or produce something that sounds right but isn't. Your review is what makes it valuable.",
    tips: [
      "Read every word — don't just skim. AI errors are often subtle",
      "Check any facts, names, dates, or statistics it mentions",
      "Add your own voice and company-specific context",
      "Ask yourself: 'Would I be comfortable if my manager saw this came from AI?'",
    ],
  },
  {
    num: 5,
    title: "How to use AI safely at work",
    desc: "Protect yourself, your colleagues, and the company when using AI.",
    icon: "🛡️",
    iconBg: "var(--emerald-bg)",
    detail:
      "AI tools are powerful, but they come with responsibilities. The most important rule: never share confidential or sensitive information with public AI tools.",
    tips: [
      "Never paste client names, financial data, or internal strategies into public AI tools",
      "Use anonymized or fictional examples when testing prompts with sensitive topics",
      "Check your company's AI usage policy before using AI for work tasks",
      "You are responsible for everything you send or publish — AI doesn't take accountability",
    ],
  },
];

// ── State ──
let activeStep = 0;
let completedSteps = new Set();
let pmCategory = "all";
let pmDifficulty = "all";
let pmSearch = "";
let pmSort = "default";
let pmPage = 1;
const PM_PAGE_SIZE = 24;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function prefersReducedMotion() {
  return reducedMotionQuery.matches;
}

function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}

// ── Theme ──
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const html = document.documentElement;

function setTheme(dark, persist = false) {
  html.setAttribute("data-theme", dark ? "dark" : "light");
  themeIcon.textContent = dark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
  if (persist) localStorage.setItem("ai-spark-theme", dark ? "dark" : "light");
}

const themePreference = localStorage.getItem("ai-spark-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(themePreference ? themePreference === "dark" : prefersDark);

themeToggle.addEventListener("click", () => {
  setTheme(html.getAttribute("data-theme") !== "dark", true);
});

// ── Mobile menu ──
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const mobileClose = document.getElementById("mobile-close");

function openMobileMenu() {
  mobileMenu.classList.add("open");
  mobileMenuBtn.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  mobileClose.focus();
}

mobileMenuBtn.addEventListener("click", openMobileMenu);

function closeMobileMenu() {
  mobileMenu.classList.remove("open");
  mobileMenuBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

mobileClose.addEventListener("click", closeMobileMenu);
mobileMenu
  .querySelectorAll(".mobile-link")
  .forEach((a) => a.addEventListener("click", closeMobileMenu));

// ── Scroll effects ──
const nav = document.getElementById("main-nav");
const scrollTopBtn = document.getElementById("scroll-top");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 10);
    scrollTopBtn.classList.toggle("visible", y > 400);

    // Active nav link
    let current = "";
    sections.forEach((s) => {
      if (y >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach((a) => {
      const isCurrent = a.getAttribute("href") === "#" + current;
      a.classList.toggle("active", isCurrent);
      if (isCurrent) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  },
  { passive: true },
);

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll(".reveal");
if (prefersReducedMotion()) {
  revealEls.forEach((el) => el.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "50px 0px 0px 0px" },
  );
  revealEls.forEach((el) => revealObserver.observe(el));
  requestAnimationFrame(() => {
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("visible");
        revealObserver.unobserve(el);
      }
    });
  });
}

// ── Newsletter cards ──
document.querySelectorAll(".nl-card").forEach((card, index) => {
  const details = card.querySelector(".nl-card-expand");
  if (!details) return;
  details.id ||= `newsletter-card-${index + 1}`;
  details.hidden = true;
  card.setAttribute("aria-controls", details.id);
});

function toggleNlCard(card) {
  const isExpanded = card.classList.contains("expanded");
  document.querySelectorAll(".nl-card").forEach((c) => {
    c.classList.remove("expanded");
    c.setAttribute("aria-expanded", "false");
    c.querySelector(".nl-card-expand")?.setAttribute("hidden", "");
  });
  if (!isExpanded) {
    card.classList.add("expanded");
    card.setAttribute("aria-expanded", "true");
    card.querySelector(".nl-card-expand")?.removeAttribute("hidden");
  }
}

// ── Learning path ──
function renderSteps() {
  const list = document.getElementById("steps-list");
  list.innerHTML = STEPS.map(
    (s, i) => `
    <div class="step-item ${i === activeStep ? "active" : ""} ${completedSteps.has(i) ? "done" : ""}"
         id="step-tab-${i}" data-step-index="${i}" tabindex="${i === activeStep ? "0" : "-1"}" role="tab" aria-selected="${i === activeStep ? "true" : "false"}" aria-controls="step-detail" aria-label="Step ${s.num}: ${s.title}">
      <div class="step-num"><span>${s.num}</span></div>
      <div class="step-content">
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
      <div class="step-connector"></div>
    </div>
  `,
  ).join("");
}

function renderStepDetail() {
  const s = STEPS[activeStep];
  const panel = document.getElementById("step-detail");
  const progress = STEPS.map(
    (_, i) => `
    <div class="step-progress-dot ${completedSteps.has(i) ? "done" : ""} ${i === activeStep ? "active" : ""}" aria-hidden="true"></div>
  `,
  ).join("");
  panel.setAttribute("aria-labelledby", "step-detail-title");
  panel.innerHTML = `
    <div class="step-progress" aria-hidden="true">${progress}</div>
    <div class="step-detail-icon" style="background:${s.iconBg}" aria-hidden="true">${s.icon}</div>
    <h3 class="step-detail-title" id="step-detail-title">${s.title}</h3>
    <p class="step-detail-body">${s.detail}</p>
    <div class="step-detail-tips">
      ${s.tips
        .map(
          (t) => `
        <div class="step-tip">
          <div class="step-tip-icon">✓</div>
          <span>${t}</span>
        </div>
      `,
        )
        .join("")}
    </div>
    <div class="step-nav-btns">
      ${activeStep > 0 ? '<button class="btn btn-secondary btn-sm" data-step-action="prev">← Previous</button>' : ""}
      ${
        activeStep < STEPS.length - 1
          ? '<button class="btn btn-teal btn-sm" data-step-action="next">Next step →</button>'
          : '<button class="btn btn-primary btn-sm" data-step-action="complete">🎉 Complete!</button>'
      }
    </div>
  `;
}

function selectStep(i) {
  activeStep = i;
  renderSteps();
  renderStepDetail();
}

function nextStep() {
  completedSteps.add(activeStep);
  if (activeStep < STEPS.length - 1) {
    activeStep++;
    renderSteps();
    renderStepDetail();
  }
}

function prevStep() {
  if (activeStep > 0) {
    activeStep--;
    renderSteps();
    renderStepDetail();
  }
}

function completeAll() {
  completedSteps.add(activeStep);
  renderSteps();
  renderStepDetail();
  showToast("🎉 You completed the beginner path! Check out the Prompt Library next.");
  launchConfetti();
}

renderSteps();
renderStepDetail();

// ── Prompt Master ──
function getCategoryMeta(cat) {
  const map = {
    Meetings: { icon: "🗓️", cls: "cat-blue" },
    "Excel & Data": { icon: "📊", cls: "cat-green" },
    "Customer Comms": { icon: "💬", cls: "cat-orange" },
    Research: { icon: "🔍", cls: "cat-purple" },
    "Email & Writing": { icon: "✍️", cls: "cat-coral" },
    "CRM & Projects": { icon: "⚙️", cls: "cat-teal" },
    Productivity: { icon: "⚡", cls: "cat-yellow" },
    "Finance & Ops": { icon: "💰", cls: "cat-mint" },
    "HR & Leadership": { icon: "👥", cls: "cat-rose" },
    "Sales & Marketing": { icon: "📣", cls: "cat-indigo" },
  };
  return map[cat] || { icon: "💡", cls: "cat-gray" };
}

function getFilteredPrompts() {
  let result = [...PROMPTS];
  if (pmCategory !== "all") result = result.filter((p) => p.category === pmCategory);
  if (pmDifficulty !== "all") result = result.filter((p) => p.difficulty === pmDifficulty);
  if (pmSearch.trim()) {
    const q = pmSearch.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.module.toLowerCase().includes(q) ||
        p.explanation.toLowerCase().includes(q) ||
        p.prompt.toLowerCase().includes(q),
    );
  }
  if (pmSort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
  else if (pmSort === "za") result.sort((a, b) => b.title.localeCompare(a.title));
  else if (pmSort === "beginner") {
    const order = { Beginner: 0, Intermediate: 1, Advanced: 2 };
    result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  } else if (pmSort === "advanced") {
    const order = { Beginner: 2, Intermediate: 1, Advanced: 0 };
    result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
  }
  return result;
}

function renderPromptCard(p) {
  const meta = getCategoryMeta(p.category);
  const diffCls = "diff-" + p.difficulty.toLowerCase();
  return `
    <article class="pm-card ${meta.cls}" role="listitem" data-id="${p.id}">
      <div class="pm-card-header">
        <div class="pm-card-icon">${p.icon || meta.icon}</div>
        <div class="pm-card-meta">
          <div class="pm-card-cat">${p.category}</div>
          <div class="pm-card-title" title="${escHtml(p.title)}">${escHtml(p.title)}</div>
        </div>
      </div>
      <div class="pm-card-body">
        <div class="pm-card-desc">${escHtml(p.explanation)}</div>
        <div class="pm-card-tags">
          <span class="pm-card-tag ${diffCls}">${p.difficulty}</span>
          <span class="pm-card-tag">${escHtml(p.source)}</span>
        </div>
      </div>
      <div class="pm-card-footer">
        <button class="pm-expand-btn" data-prompt-action="toggle" aria-expanded="false" aria-controls="prompt-${p.id}">View Prompt</button>
        <button class="pm-copy-btn" data-prompt-action="copy" data-prompt-id="${p.id}" aria-label="Copy prompt">
          <span class="copy-icon">📋</span> Copy
        </button>
      </div>
      <div class="pm-card-prompt-wrap" id="prompt-${p.id}" hidden>
        <div class="pm-prompt-box">${escHtml(p.prompt)}</div>
      </div>
    </article>
  `;
}

function escHtml(v) {
  return String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderPmGrid() {
  const filtered = getFilteredPrompts();
  const total = filtered.length;
  const shown = filtered.slice(0, pmPage * PM_PAGE_SIZE);
  const grid = document.getElementById("pm-grid");
  const empty = document.getElementById("pm-empty");
  const countEl = document.getElementById("pm-count");
  const loadMore = document.getElementById("pm-load-more");

  countEl.textContent = total.toLocaleString();
  empty.classList.toggle("visible", total === 0);
  loadMore.style.display = shown.length < total ? "block" : "none";

  const cards = shown.map(renderPromptCard).join("");
  grid.innerHTML = cards + grid.querySelector("#pm-empty").outerHTML;
}

function loadMorePrompts() {
  if (promptLibraryStatus !== "loaded") {
    primePromptLibrary();
    return;
  }
  pmPage++;
  renderPmGrid();
}

function togglePromptCard(btn) {
  const card = btn.closest(".pm-card");
  const isExpanded = card.classList.contains("expanded");
  card.classList.toggle("expanded", !isExpanded);
  const prompt = card.querySelector(".pm-card-prompt-wrap");
  if (prompt) prompt.hidden = isExpanded;
  btn.setAttribute("aria-expanded", !isExpanded);
  btn.textContent = isExpanded ? "View Prompt" : "Hide Prompt";
}

function copyPrompt(btn, id) {
  const p = PROMPTS.find((x) => x.id === id);
  if (!p) return;
  navigator.clipboard
    .writeText(p.prompt)
    .then(() => {
      btn.classList.add("copied");
      btn.innerHTML = "<span>✅</span> Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = '<span class="copy-icon">📋</span> Copy';
      }, 2000);
      showToast("✅ Prompt copied to clipboard!");
    })
    .catch(() => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = p.prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btn.classList.add("copied");
      btn.innerHTML = "<span>✅</span> Copied!";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = '<span class="copy-icon">📋</span> Copy';
      }, 2000);
      showToast("✅ Prompt copied!");
    });
}

// Build category chips
function buildCategoryChips() {
  const cats = [
    "all",
    ...Object.keys(
      PROMPTS.reduce((acc, p) => {
        acc[p.category] = true;
        return acc;
      }, {}),
    ).sort(),
  ];
  const container = document.getElementById("pm-cats");
  container.innerHTML = cats
    .map((cat) => {
      const meta = cat === "all" ? { icon: "🌟", cls: "" } : getCategoryMeta(cat);
      const count =
        cat === "all" ? PROMPTS.length : PROMPTS.filter((p) => p.category === cat).length;
      return `
      <button class="pm-cat-chip ${meta.cls} ${cat === pmCategory ? "active" : ""}"
              data-cat="${escHtml(cat)}" aria-pressed="${cat === pmCategory}">
        ${meta.icon} ${cat === "all" ? "All Categories" : cat}
        <span style="opacity:.6;font-size:.7rem">(${count})</span>
      </button>
    `;
    })
    .join("");
}

function setCat(cat) {
  pmCategory = cat;
  pmPage = 1;
  buildCategoryChips();
  renderPmGrid();
}

async function filterByCategory(cat) {
  document.getElementById("prompt-master").scrollIntoView({ behavior: scrollBehavior() });
  await loadPromptLibrary();
  setCat(cat);
}

function clearPmFilters() {
  pmCategory = "all";
  pmDifficulty = "all";
  pmSearch = "";
  pmSort = "default";
  pmPage = 1;
  document.getElementById("pm-search").value = "";
  document.getElementById("pm-sort").value = "default";
  document.querySelectorAll(".pm-diff-chip").forEach((c) => {
    c.classList.remove("active-beginner", "active-intermediate", "active-advanced");
    c.setAttribute("aria-pressed", c.dataset.diff === "all");
    if (c.dataset.diff === "all") c.style.background = "";
  });
  if (promptLibraryStatus !== "loaded") {
    primePromptLibrary();
    return;
  }
  buildCategoryChips();
  renderPmGrid();
}

// Search
let searchDebounce;
document.getElementById("pm-search").addEventListener("input", (e) => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    pmSearch = e.target.value;
    pmPage = 1;
    if (promptLibraryStatus !== "loaded") {
      primePromptLibrary();
      return;
    }
    renderPmGrid();
  }, 250);
});

// Sort
document.getElementById("pm-sort").addEventListener("change", (e) => {
  pmSort = e.target.value;
  pmPage = 1;
  if (promptLibraryStatus !== "loaded") {
    primePromptLibrary();
    return;
  }
  renderPmGrid();
});

// Difficulty chips
document.querySelectorAll(".pm-diff-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const diff = chip.dataset.diff;
    pmDifficulty = diff;
    pmPage = 1;
    document.querySelectorAll(".pm-diff-chip").forEach((c) => {
      c.classList.remove("active-beginner", "active-intermediate", "active-advanced");
      c.setAttribute("aria-pressed", "false");
    });
    chip.setAttribute("aria-pressed", "true");
    if (diff === "Beginner") chip.classList.add("active-beginner");
    else if (diff === "Intermediate") chip.classList.add("active-intermediate");
    else if (diff === "Advanced") chip.classList.add("active-advanced");
    if (promptLibraryStatus !== "loaded") {
      primePromptLibrary();
      return;
    }
    renderPmGrid();
  });
});

function setupPromptLibraryLazyLoad() {
  const promptSection = document.getElementById("prompt-master");
  const promptTriggers = document.querySelectorAll(
    'a[href="#prompt-master"], [data-filter-category]',
  );
  promptTriggers.forEach((trigger) => {
    ["mouseenter", "focus", "touchstart"].forEach((eventName) => {
      trigger.addEventListener(eventName, primePromptLibrary, { passive: true, once: true });
    });
  });

  if (location.hash === "#prompt-master") {
    primePromptLibrary();
    return;
  }

  if ("IntersectionObserver" in window && promptSection) {
    const promptObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          promptObserver.disconnect();
          primePromptLibrary();
        }
      },
      { rootMargin: "700px 0px 700px 0px", threshold: 0 },
    );
    promptObserver.observe(promptSection);
  } else {
    const schedule =
      window.requestIdleCallback || ((callback) => window.setTimeout(callback, 1200));
    schedule(primePromptLibrary);
  }
}

setupPromptLibraryLazyLoad();

const PLAYGROUND_TASKS = {
  email: {
    role: "senior customer success partner",
    task: "write a concise client follow-up email",
    format: "subject line plus three short paragraphs",
  },
  summary: {
    role: "project coordinator",
    task: "summarize meeting notes into decisions, risks, and next steps",
    format: "three labeled bullet sections",
  },
  sop: {
    role: "operations lead",
    task: "draft a simple standard operating procedure",
    format: "numbered checklist with owner and quality check columns",
  },
};

function buildPlaygroundPrompt() {
  const taskSelect = document.getElementById("playground-task");
  const toneSelect = document.getElementById("playground-tone");
  const contextInput = document.getElementById("playground-context");
  const output = document.getElementById("playground-output");
  if (!taskSelect || !toneSelect || !contextInput || !output) return "";

  const task = PLAYGROUND_TASKS[taskSelect.value] || PLAYGROUND_TASKS.email;
  const context = contextInput.value.trim() || "[paste your notes or context here]";
  const prompt = `You are a ${task.role}.\nYour task is to ${task.task}.\nUse a ${toneSelect.value} tone.\nReturn the answer as ${task.format}.\nContext:\n${context}`;
  output.textContent = prompt;
  return prompt;
}

function copyText(text, successMessage) {
  if (!text) return;
  navigator.clipboard
    .writeText(text)
    .then(() => showToast(successMessage))
    .catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast(successMessage);
    });
}

function setupFrameworkShowcase() {
  const controls = [
    document.getElementById("playground-task"),
    document.getElementById("playground-tone"),
    document.getElementById("playground-context"),
  ];
  controls.forEach((control) => {
    control?.addEventListener("input", buildPlaygroundPrompt);
    control?.addEventListener("change", buildPlaygroundPrompt);
  });
  buildPlaygroundPrompt();
}

function setupSubscribeForm() {
  const form = document.getElementById("subscribe-form");
  const email = document.getElementById("subscribe-email");
  const message = document.getElementById("subscribe-message");
  if (!form || !email || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = email.value.trim();
    message.classList.remove("success", "error");
    email.removeAttribute("aria-invalid");

    if (!email.checkValidity() || !value.includes(".")) {
      message.textContent = "Enter a valid work email to preview the subscription flow.";
      message.classList.add("error");
      email.setAttribute("aria-invalid", "true");
      email.focus();
      return;
    }

    message.textContent = "You're on the preview list. Connect an email service to store signups.";
    message.classList.add("success");
    form.reset();
    showToast("Subscription preview complete.");
  });
}

setupFrameworkShowcase();
setupSubscribeForm();

// ── Toast ──
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Confetti (surprise & delight) ──
let confettiModulePromise;
async function launchConfetti() {
  if (prefersReducedMotion()) return;
  confettiModulePromise ||= import("./confetti.js");
  const { launchConfetti: runConfetti } = await confettiModulePromise;
  runConfetti();
}

// ── Surprise & delight: Easter egg on logo click ──
let logoClicks = 0;
document.querySelector(".nav-logo").addEventListener("click", () => {
  logoClicks++;
  if (logoClicks === 5) {
    logoClicks = 0;
    launchConfetti();
    showToast("You found the Easter egg! You are an AI Spark pro!");
  }
});

const statEl = document.getElementById("stat-prompts");
if (statEl) statEl.textContent = (875).toLocaleString();

function handleActionClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const newsletterCard = target.closest(".nl-card");
  if (newsletterCard) {
    toggleNlCard(newsletterCard);
    return;
  }

  const scrollButton = target.closest('[data-action="scroll-top"]');
  if (scrollButton) {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    return;
  }

  const clearButton = target.closest('[data-action="clear-pm-filters"]');
  if (clearButton) {
    clearPmFilters();
    return;
  }

  const loadMoreButton = target.closest('[data-action="load-more-prompts"]');
  if (loadMoreButton) {
    loadMorePrompts();
    return;
  }

  const categoryLink = target.closest("[data-filter-category]");
  if (categoryLink) {
    filterByCategory(categoryLink.dataset.filterCategory);
    return;
  }

  const categoryChip = target.closest("[data-cat]");
  if (categoryChip) {
    setCat(categoryChip.dataset.cat);
    return;
  }

  const stepItem = target.closest("[data-step-index]");
  if (stepItem) {
    selectStep(Number(stepItem.dataset.stepIndex));
    return;
  }

  const stepAction = target.closest("[data-step-action]");
  if (stepAction?.dataset.stepAction === "prev") prevStep();
  else if (stepAction?.dataset.stepAction === "next") nextStep();
  else if (stepAction?.dataset.stepAction === "complete") completeAll();

  const copyPlayground = target.closest('[data-action="copy-playground"]');
  if (copyPlayground) {
    copyText(buildPlaygroundPrompt(), "Starter prompt copied.");
    return;
  }

  const copyFrameworkSnippet = target.closest('[data-action="copy-framework-snippet"]');
  if (copyFrameworkSnippet) {
    copyText(document.getElementById("framework-snippet")?.textContent, "Prompt recipe copied.");
    return;
  }

  const promptAction = target.closest("[data-prompt-action]");
  if (promptAction?.dataset.promptAction === "toggle") togglePromptCard(promptAction);
  else if (promptAction?.dataset.promptAction === "copy") {
    copyPrompt(promptAction, Number(promptAction.dataset.promptId));
  }
}

function handleActionKeydown(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (mobileMenu.classList.contains("open")) {
    if (event.key === "Escape") {
      closeMobileMenu();
      mobileMenuBtn.focus();
      return;
    }
    if (event.key === "Tab") {
      const focusable = [...mobileMenu.querySelectorAll("a[href], button:not([disabled])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const stepTab = target.closest("[data-step-index]");
  if (
    stepTab &&
    ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)
  ) {
    const current = Number(stepTab.dataset.stepIndex);
    const lastIndex = STEPS.length - 1;
    let next = current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = Math.min(lastIndex, current + 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = Math.max(0, current - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = lastIndex;
    event.preventDefault();
    selectStep(next);
    document.querySelector(`[data-step-index="${next}"]`)?.focus();
    return;
  }

  if (event.key !== "Enter" && event.key !== " ") return;
  const interactiveCard = target.closest(".nl-card, [data-step-index]");
  if (!interactiveCard) return;
  event.preventDefault();
  if (interactiveCard.matches(".nl-card")) toggleNlCard(interactiveCard);
  else selectStep(Number(interactiveCard.dataset.stepIndex));
}

document.addEventListener("click", handleActionClick);
document.addEventListener("keydown", handleActionKeydown);
