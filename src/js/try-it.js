// Try-It-in-30-Seconds widget.
//
// Standalone init function that wires the 3-step micro-interaction inside
// `#try-it-now`. The DOM markup lives in index.html (and is kept in sync as
// the inline script). This module exists so the widget logic also has a
// proper source-of-truth file that can be unit-tested or rehydrated later.
//
// Public API: `initTryIt()` — idempotent. Safe to call before/after the DOM
// is ready; bails out if the root element isn't on the page.

const TRYIT_DATA = {
  reply: {
    emoji: "✉️",
    label: "Write a polite reply",
    stepLabel: "Step 2 of 3 — Polite reply",
    prompt: [
      "You are a thoughtful, professional colleague helping me draft an email reply.",
      "",
      "Context:",
      "[Paste the email I received here, or briefly describe the situation. Example: a client is asking for an update on a project that is two days late.]",
      "",
      "My goals for the reply:",
      "- Acknowledge what they said and any frustration without being defensive",
      "- Be honest about the current status without overpromising",
      "- Offer a clear next step with a date or owner",
      "- Keep it warm but professional, around 4–6 short sentences",
      "",
      "Format your answer as:",
      "1. Suggested subject line",
      "2. The full email reply",
      "3. One alternative shorter version (2–3 sentences) for chat or SMS",
      "",
      "If anything is unclear, ask me up to 2 short questions before drafting. Do not invent names, dates, or numbers — use [placeholders] for anything I have not given you.",
    ].join("\n"),
    output: [
      "Subject: Quick update on [project name]",
      "",
      "Hi [Name],",
      "",
      "Thanks for the nudge — and apologies for the delay. You're right that I owed you an update on Tuesday, and I should have flagged sooner that we needed two extra days.",
      "",
      "Here's where we are: the [draft / report / build] is now in final review with [team]. I'll have the completed version in your inbox by [Friday 4pm SGT], along with a short note on what changed and why.",
      "",
      "If there's anything you'd like me to prioritise in the meantime, just reply and I'll move it up.",
      "",
      "Thanks again for the patience,",
      "[Your name]",
      "",
      "— Shorter chat version —",
      "Apologies for the delay on [project] — final review now, you'll have it by Fri 4pm. Anything you'd like prioritised first?",
    ].join("\n"),
  },
  summary: {
    emoji: "📊",
    label: "Summarize a report",
    stepLabel: "Step 2 of 3 — Report summary",
    prompt: [
      "You are an experienced business analyst who is excellent at turning long, dense documents into clear briefings for busy leaders.",
      "",
      "I will paste the contents of a report below. Your job is to summarise it for someone who has 90 seconds to read.",
      "",
      "Report content:",
      "[Paste the report text here. Replace any client names, customer data, or financial figures with placeholders before sharing.]",
      "",
      "Return the summary in this exact structure:",
      "1. The headline — one sentence, what a leader would want to know first",
      "2. Three key findings — bullet points, each one fact + why it matters",
      "3. Numbers worth noting — only if they appear in the report, never invented",
      "4. Risks or open questions — what is unclear, missing, or worth pushing back on",
      "5. Suggested next step — one specific action, with an owner placeholder if needed",
      "",
      'Keep the tone neutral and concrete. Do not add opinions that are not supported by the text. If the report does not contain enough information for a section, write "Not in source" rather than guessing.',
    ].join("\n"),
    output: [
      "Headline: Q1 churn rose 18% in the SMB segment, driven mostly by onboarding friction in the first 14 days.",
      "",
      "Key findings:",
      "• 62% of churned SMB accounts dropped off before their first successful workflow run — onboarding, not product fit, looks like the bigger problem.",
      "• Enterprise retention held at 96%, suggesting the issue is segment-specific rather than systemic.",
      '• Support ticket volume from SMB doubled in March, with "set-up" and "integration" tags accounting for 71% of cases.',
      "",
      "Numbers worth noting:",
      "• 18% Q-over-Q SMB churn increase",
      "• 14-day median time-to-first-value",
      "• 71% of new tickets tagged onboarding-related",
      "",
      "Risks / open questions:",
      "• The report doesn't break churn down by acquisition channel — paid vs organic could behave very differently.",
      "• No mention of whether the new onboarding flow (shipped Feb) was A/B tested.",
      "",
      "Suggested next step:",
      "Ask [Product] to share the onboarding funnel data for the last 60 days so we can see exactly where SMB users drop off.",
    ].join("\n"),
  },
  brainstorm: {
    emoji: "💡",
    label: "Brainstorm ideas",
    stepLabel: "Step 2 of 3 — Brainstorm",
    prompt: [
      "You are a creative strategist who is great at generating wide, varied options before narrowing in.",
      "",
      "The topic I need ideas on:",
      "[Describe the problem or opportunity in one or two sentences. Example: ways to make our weekly team stand-ups more useful for a hybrid team of 12.]",
      "",
      "What I have already tried (so don't repeat these):",
      '[List anything you\'ve tried, or write "nothing yet".]',
      "",
      "Constraints I care about:",
      "- Audience or users: [who]",
      "- Time / budget: [any limits]",
      "- Tone or style: [serious, playful, etc.]",
      "",
      "Please give me 10 ideas in this format:",
      "- Idea name (4–6 words, memorable)",
      "- One-sentence description of how it works",
      "- Effort to try: Low / Medium / High",
      "- Why it might work",
      "",
      "Mix safe and bold ideas. Include at least 2 unusual or counter-intuitive ones. Do not pre-rank them — just generate. After the list, suggest the 3 you'd start with and why.",
    ].join("\n"),
    output: [
      '1. Two-Question Standup — Each person answers only "What\'s blocking you?" and "Where do you need a second pair of eyes?". Effort: Low. Why: cuts status theatre, surfaces help fast.',
      "",
      "2. Async-First, Live-On-Demand — Everyone posts a 3-line update by 9am; the live call only happens if someone flags a topic. Effort: Low. Why: respects time zones, makes the meeting opt-in.",
      "",
      "3. Rotating Host — A different teammate runs each standup, choosing the format. Effort: Low. Why: builds ownership, keeps things fresh.",
      "",
      "4. The Demo Slot — Replace one standup a week with a 5-min screen-share of something someone shipped. Effort: Medium. Why: turns status into learning.",
      "",
      "5. Customer of the Week — Open with a 60-second snippet from a real customer call or ticket. Effort: Medium. Why: keeps the team grounded in user reality.",
      "",
      '6. Standup Bingo — Light card with phrases like "circle back" or "low-hanging fruit"; first to fill it wins coffee. Effort: Low. Why: makes meta-language visible and funny.',
      "",
      "7. Silent Standup — First 4 minutes everyone reads each other's written updates; remaining 6 minutes is questions only. Effort: Low. Why: introverts actually contribute.",
      "",
      "8. Risk Radar — Each person names one thing they're worried about, even small. Effort: Low. Why: catches issues before they're crises.",
      "",
      "9. The Robot Co-Host — An AI summary bot posts a digest to the channel after every meeting. Effort: Medium. Why: anyone who missed it stays caught up.",
      "",
      "10. Walking Standup — On-site folks walk while remote folks join from headphones. Effort: Low. Why: shorter, more honest, less screen fatigue.",
      "",
      "Where I'd start: #2 (lowest cost change with biggest time-saving), #4 (turns the meeting into something people actually want to attend), and #8 (cheap insurance against blind spots).",
    ].join("\n"),
  },
  meeting: {
    emoji: "🗓",
    label: "Plan a meeting",
    stepLabel: "Step 2 of 3 — Meeting plan",
    prompt: [
      "You are a calm, organised chief of staff who plans meetings that actually accomplish something.",
      "",
      "Meeting context:",
      "- Purpose: [Why this meeting exists in one sentence. Example: align on the launch date for Project Spark.]",
      "- Attendees: [Roles or names — e.g., Product lead, Eng manager, Marketing lead]",
      "- Total time available: [e.g., 30 minutes]",
      "- Decision needed by end: [yes/no — if yes, what is the decision?]",
      '- Any pre-reads or context: [link or paste here, or write "none"]',
      "",
      "Please produce:",
      '1. A meeting title that is clear and outcome-focused (no "sync" or "catchup")',
      "2. A 3-bullet objective so attendees know why they're there",
      "3. A timed agenda that adds up exactly to the available time, with each block labelled by purpose (Inform / Discuss / Decide)",
      "4. A pre-read prompt — what attendees should review or think about before showing up",
      '5. A short "how we\'ll capture decisions" line',
      "6. Two questions you'd recommend asking partway through to keep things on track",
      "",
      "Keep it human and direct. If something I gave you is too vague to plan around, ask me one specific clarifying question first.",
    ].join("\n"),
    output: [
      "Title: Decide the Project Spark launch date — go / no-go",
      "",
      "Objective:",
      "• Confirm whether engineering, marketing, and support are ready to commit to a public launch on [target date]",
      "• Surface any blockers we cannot resolve in this meeting and assign owners",
      "• Leave with one decision and a clear next-step list",
      "",
      "Agenda (30 minutes):",
      '• 0:00–0:03  Frame the decision (Inform) — host restates the question and what "yes" requires',
      "• 0:03–0:12  Readiness round (Discuss) — Product, Eng, Marketing each give a 3-min status: green / yellow / red and why",
      "• 0:12–0:22  Open issues (Discuss) — work through any reds or yellows; capture anything we can't solve here",
      "• 0:22–0:27  Decide (Decide) — go / no-go vote, and if no-go, the new target date",
      "• 0:27–0:30  Wrap (Inform) — owner reads back decisions and assigned next steps",
      "",
      "Pre-read prompt:",
      'Before the meeting, please skim the [readiness doc] and come ready to answer: "Is your area green, yellow, or red — and what would it take to move to green?" Two minutes of prep is enough.',
      "",
      "How we'll capture decisions:",
      'The host will type decisions live in the [shared doc] under "Decisions made [date]"; anything unresolved goes under "Open follow-ups" with an owner and date.',
      "",
      "Mid-meeting check-in questions:",
      "• \"We're 15 minutes in — is anyone leaning toward a no-go that we haven't heard from yet?\"",
      '• "Of the open issues we\'ve raised, which one is the actual blocker for the launch date, and which are nice-to-fix?"',
    ].join("\n"),
  },
};

function writeClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function initTryIt(rootSelector = "[data-tryit-root]") {
  const root = document.querySelector(rootSelector);
  if (!root) return null;

  const state = { goal: null, step: 1 };

  function showStep(stepNum) {
    state.step = stepNum;
    root.querySelectorAll("[data-tryit-step]").forEach((stepEl) => {
      const isActive = Number(stepEl.dataset.tryitStep) === stepNum;
      stepEl.classList.toggle("is-active", isActive);
      stepEl.hidden = !isActive;
    });
    root.querySelectorAll("[data-tryit-progress]").forEach((dot) => {
      const idx = Number(dot.dataset.tryitProgress);
      dot.classList.toggle("is-active", idx === stepNum - 1);
      dot.classList.toggle("is-done", idx < stepNum - 1);
    });
  }

  function selectGoal(goal) {
    const data = TRYIT_DATA[goal];
    if (!data) return;
    state.goal = goal;
    root.querySelectorAll("[data-tryit-goal]").forEach((chip) => {
      const isMatch = chip.dataset.tryitGoal === goal;
      chip.setAttribute("aria-checked", String(isMatch));
      chip.setAttribute("aria-pressed", String(isMatch));
    });
    const goalLabel = root.querySelector("[data-tryit-goal-label]");
    if (goalLabel) goalLabel.textContent = data.stepLabel;
    root.querySelectorAll("[data-tryit-prompt], [data-tryit-prompt-echo]").forEach((el) => {
      el.value = data.prompt;
    });
    const outputEl = root.querySelector("[data-tryit-output]");
    if (outputEl) outputEl.textContent = data.output;
    showStep(2);
  }

  function copyPrompt(btn) {
    const data = TRYIT_DATA[state.goal];
    if (!data) return Promise.resolve();
    const labelEl = btn.querySelector("[data-tryit-copy-label]");
    const statusEl = btn.closest(".tryit-prompt-card")?.querySelector(".tryit-status");
    return writeClipboard(data.prompt)
      .then(() => {
        btn.classList.add("is-copied");
        if (labelEl) labelEl.textContent = "✓ Copied";
        if (statusEl) {
          statusEl.textContent =
            "Prompt copied — paste it into ChatGPT, Copilot, or Claude. Review the answer before sending it on.";
        }
        setTimeout(() => {
          btn.classList.remove("is-copied");
          if (labelEl) labelEl.textContent = "Copy prompt";
        }, 2200);
      })
      .catch(() => {
        if (statusEl) statusEl.textContent = "Copy failed — select the text and copy manually.";
      });
  }

  function reset() {
    state.goal = null;
    root.querySelectorAll("[data-tryit-goal]").forEach((chip) => {
      chip.setAttribute("aria-checked", "false");
      chip.setAttribute("aria-pressed", "false");
    });
    root
      .querySelectorAll("[data-tryit-prompt], [data-tryit-prompt-echo]")
      .forEach((el) => (el.value = ""));
    const outputEl = root.querySelector("[data-tryit-output]");
    if (outputEl) outputEl.textContent = "";
    root.querySelectorAll(".tryit-status").forEach((el) => (el.textContent = ""));
    showStep(1);
    const firstChip = root.querySelector("[data-tryit-goal]");
    if (firstChip) firstChip.focus();
  }

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const chip = target.closest("[data-tryit-goal]");
    if (chip) {
      selectGoal(chip.dataset.tryitGoal);
      return;
    }
    const action = target.closest("[data-tryit-action]");
    if (!action) return;
    const kind = action.dataset.tryitAction;
    if (kind === "copy") void copyPrompt(action);
    else if (kind === "show-output") showStep(3);
    else if (kind === "reset") reset();
  });

  root.addEventListener("keydown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const chip = target.closest("[data-tryit-goal]");
    if (!chip) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectGoal(chip.dataset.tryitGoal);
      return;
    }
    if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) {
      const chips = Array.from(root.querySelectorAll("[data-tryit-goal]"));
      const currentIdx = chips.indexOf(chip);
      const last = chips.length - 1;
      let nextIdx = currentIdx;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextIdx = currentIdx === last ? 0 : currentIdx + 1;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextIdx = currentIdx === 0 ? last : currentIdx - 1;
      } else if (event.key === "Home") {
        nextIdx = 0;
      } else if (event.key === "End") {
        nextIdx = last;
      }
      event.preventDefault();
      chips[nextIdx]?.focus();
    }
  });

  return { selectGoal, reset, showStep, copyPrompt, getState: () => ({ ...state }) };
}

export const TRY_IT_GOALS = TRYIT_DATA;
