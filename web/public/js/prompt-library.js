/* assets/js/prompt-library.js */

function copyText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) {
    console.error("Element not found:", elementId);
    return;
  }

  const isField =
    el.tagName === "TEXTAREA" || el.tagName === "INPUT";

  const text = (isField ? el.value : el.innerText)
    .replace(/\u00A0/g, " ")
    .trim();

  if (!text) {
    announce("No text to copy.");
    return;
  }

  // Track in unified store if available
  if (window.NBStore) {
    window.NBStore.track('prompt_copy', {
      promptId: elementId,
      isCustom: isField
    });
    
    // Trigger HUD update
    if (window.NBHUD) {
      setTimeout(() => window.NBHUD.render(), 100);
    }
  }

  const done = () => {
    announce("Copied to clipboard.");
    // Visual feedback on button if available
    const btn = el.closest('.prompt-card, .add-card')?.querySelector('.copy-btn, .save-btn');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = "✓ Copied!";
      btn.style.background = "var(--zone-green, #7FB285)";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
      }, 2000);
    }
  };
  
  const fail = () => announce("Copy failed. Please copy manually.");

  // Secure context (https / localhost) supports Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done, fail));
  } else {
    fallbackCopy(text, done, fail);
  }
}

// Make copyText globally available
window.copyText = copyText;

function fallbackCopy(text, done, fail) {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    ok ? done() : fail();
  } catch {
    fail();
  }
}

function toggleCard(headerEl) {
  const card = headerEl.closest(".collapsible-card");
  if (!card) return;

  const box = card.querySelector(".card-prompt-box");
  if (!box) return;

  const isOpen = card.classList.toggle("is-open");
  card.classList.toggle("expanded", isOpen); // Support both classes
  box.hidden = !isOpen;
  headerEl.setAttribute("aria-expanded", String(isOpen));
  
  // Update arrow icon if present
  const arrow = headerEl.querySelector(".card-arrow");
  if (arrow) {
    arrow.textContent = isOpen ? "▲" : "▼";
  }
}

// Make toggleCard globally available
window.toggleCard = toggleCard;

// Accessibility + initial state
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".collapsible-card .card-header").forEach((h) => {
    h.setAttribute("role", "button");
    h.tabIndex = 0;

    const card = h.closest(".collapsible-card");
    const box = card?.querySelector(".card-prompt-box");
    const open = card?.classList.contains("is-open") || false;

    h.setAttribute("aria-expanded", String(open));
    if (box) box.hidden = !open;

    h.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleCard(h);
      }
    });
  });
});

function announce(message) {
  let live = document.getElementById("nbLiveRegion");
  if (!live) {
    live = document.createElement("div");
    live.id = "nbLiveRegion";
    live.setAttribute("role", "status");
    live.setAttribute("aria-live", "polite");
    // If you have a visually-hidden utility class, use it:
    live.style.position = "absolute";
    live.style.left = "-9999px";
    document.body.appendChild(live);
  }
  live.textContent = message;
}

