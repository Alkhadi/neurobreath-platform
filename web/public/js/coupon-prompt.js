/* ------------------------------------------------------
   COUPON PROMPT PAGE JAVASCRIPT
   Reward Prompt Library - Page-specific functionality
------------------------------------------------------ */

/* ------------------------------------------------------
   THEME ENGINE — ADAPTIVE GRADIENTS
   Uses site's color palette values
------------------------------------------------------ */

function setTheme(theme) {
    let root = document.documentElement;

    if (theme === "blue") {
        // Sky to Lavender gradient (site colors from base.css)
        root.style.setProperty("--grad-1-start", "#A8C5D8"); // --color-sky
        root.style.setProperty("--grad-1-end", "#B8A9C9");   // --color-lavender
    }

    if (theme === "teal") {
        // Sky to Sky Light gradient (site colors)
        root.style.setProperty("--grad-1-start", "#A8C5D8"); // --color-sky
        root.style.setProperty("--grad-1-end", "#D4E5EE");   // --color-sky-light
    }

    if (theme === "sunset") {
        // Coral to Yellow gradient (site colors)
        root.style.setProperty("--grad-1-start", "#D4A59A"); // --color-coral
        root.style.setProperty("--grad-1-end", "#E5C76B");   // --zone-yellow
    }

    localStorage.setItem("nbTheme", theme);
}

// Load saved theme
(function(){
    let saved = localStorage.getItem("nbTheme");
    if (saved) setTheme(saved);
})();

/* ------------------------------------------------------
   NAVIGATION JUMP
------------------------------------------------------ */

function scrollToCat(n) {
    document.getElementById("category" + n).scrollIntoView({ behavior: "smooth" });
}

/* ------------------------------------------------------
   ACCORDION BEHAVIOUR — ONLY ONE OPEN AT A TIME
------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".category-header").forEach(header => {
        header.addEventListener("click", function () {
            let content = this.nextElementSibling;
            let arrow = this.querySelector(".arrow");

            // Toggle this category
            if (content.classList.contains("active")) {
                // Close this one
                content.classList.remove("active");
                content.style.display = "none";
                arrow.style.transform = "rotate(0deg)";
            } else {
                // Close all others
                document.querySelectorAll(".category-content").forEach(c => {
                    c.classList.remove("active");
                    c.style.display = "none";
                });
                document.querySelectorAll(".arrow").forEach(a => a.style.transform = "rotate(0deg)");

                // Open this one
                content.classList.add("active");
                content.style.display = "block";
                arrow.style.transform = "rotate(180deg)";
            }
        });
    });
});

/* ------------------------------------------------------
   CARD COLLAPSE/EXPAND TOGGLE — Category 1 Cards
------------------------------------------------------ */

// toggleCard is now handled by prompt-library.js
// This function is kept for backwards compatibility but delegates to the new implementation
function toggleCard(button) {
    // Delegate to the new implementation if available
    if (typeof window.toggleCard === 'function' && window.toggleCard !== toggleCard) {
        return window.toggleCard(button);
    }
    
    // Fallback implementation (kept for compatibility)
    const card = button.closest('.collapsible-card');
    if (!card) return;
    
    const toggleButton = button.tagName === 'BUTTON' ? button : button.closest('button') || button;
    const promptBox = card.querySelector('.card-prompt-box');
    
    if (!promptBox) return;
    
    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
        toggleButton.setAttribute('aria-expanded', 'false');
        promptBox.hidden = true;
        card.classList.remove('expanded', 'is-open');
        const arrow = toggleButton.querySelector('.card-arrow');
        if (arrow) arrow.textContent = '▼';
    } else {
        toggleButton.setAttribute('aria-expanded', 'true');
        promptBox.hidden = false;
        card.classList.add('expanded', 'is-open');
        const arrow = toggleButton.querySelector('.card-arrow');
        if (arrow) arrow.textContent = '▲';
    }
}

// Make toggleCard globally available
window.toggleCard = toggleCard;

// Initialize all collapsible cards as collapsed on page load
document.addEventListener("DOMContentLoaded", function() {
    // First, add collapsible-card class to all prompt cards that don't have it
    document.querySelectorAll('.prompt-card.card:not(.collapsible-card)').forEach(card => {
        card.classList.add('collapsible-card');
    });
    
    // Now initialize all collapsible cards
    document.querySelectorAll('.collapsible-card').forEach(card => {
        // Auto-fill data-card-id from prompt box if empty
        if (!card.getAttribute('data-card-id') || card.getAttribute('data-card-id') === '') {
            const promptBox = card.querySelector('.card-prompt-box');
            if (promptBox && promptBox.id) {
                card.setAttribute('data-card-id', promptBox.id);
            }
        }
        
        // Add card-arrow if missing
        const header = card.querySelector('.card-header');
        if (header) {
            if (!header.querySelector('.card-arrow')) {
                const arrow = document.createElement('span');
                arrow.className = 'card-arrow';
                arrow.setAttribute('aria-hidden', 'true');
                arrow.textContent = '▼';
                header.appendChild(arrow);
            }
            
            card.classList.remove('expanded');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('role', 'button');
            header.setAttribute('tabindex', '0');
            
            // Add keyboard support
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCard(this);
                }
            });
        }
        
        // Prevent copy button clicks from triggering card toggle
        const copyBtn = card.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });
});

/* ------------------------------------------------------
   COPY PROMPT
   Updated: Now rewards completion, not just copying
------------------------------------------------------ */
function copyText(id) {
    let textToCopy = '';
    
    // Check if it's a textarea (for custom prompts)
    const textarea = document.getElementById(id);
    if (textarea && textarea.tagName === 'TEXTAREA') {
        textToCopy = textarea.value.trim();
        if (!textToCopy) {
            alert('Please enter a prompt before copying.');
            return;
        }
    } else {
        // Check if prompt vault system is available
        if (window.PromptVault && window.PromptVault.getPrompt) {
            const prompt = window.PromptVault.getPrompt(id);
            if (prompt && !window.PromptVault.isUnlocked(id)) {
                // Prompt not unlocked - show mission modal
                if (window.PromptMissions) {
                    window.PromptMissions.showMission(id);
                } else {
                    alert('Please complete a mission to unlock this prompt.');
                }
                return;
            } else if (prompt && window.PromptVault.isUnlocked(id)) {
                // Prompt unlocked - record copy (no points, just tracking)
                window.PromptVault.recordPromptCopy(id);
                textToCopy = window.PromptVault.getPersonalizedPrompt(id);
            }
        }
        
        // Fallback: try to get text from element
        if (!textToCopy) {
            const element = document.getElementById(id);
            if (element) {
                textToCopy = element.textContent || element.innerText || '';
            }
        }
    }
    
    if (!textToCopy) {
        // If PromptVault not loaded, prevent copying
        if (!window.PromptVault) {
            alert('Please complete a mission to unlock this prompt.');
        } else {
            alert('Unable to copy: prompt not found.');
        }
        return;
    }

    let element = document.getElementById(id);
    if (!element) {
        console.error("Element not found:", id);
        return;
    }
    
    // Check if the card is expanded before allowing copy
    const card = element.closest('.collapsible-card');
    if (card && !card.classList.contains('expanded')) {
        // Auto-expand if collapsed
        const header = card.querySelector('.card-header');
        if (header) {
            toggleCard(header);
            // Small delay to ensure content is visible
            setTimeout(() => {
                performCopy(id);
            }, 100);
            return;
        }
    }
    
    performCopy(id);
}

function performCopy(id) {
    let element = document.getElementById(id);
    if (!element) {
        console.error("Element not found:", id);
        return;
    }
    
    // Handle textarea value vs textContent
    let txt = '';
    if (element.tagName === 'TEXTAREA') {
        txt = element.value.trim();
    } else {
        txt = element.innerText || element.textContent || '';
    }
    
    if (!txt) {
        alert('No text to copy.');
        return;
    }

    // Track in unified store
    if (window.NBStore) {
        window.NBStore.track('prompt_copy', {
            promptId: id,
            isCustom: element.tagName === 'TEXTAREA'
        });
        
        // Trigger HUD update
        if (window.NBHUD) {
            setTimeout(() => window.NBHUD.render(), 100);
        }
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => {
            // Visual feedback
            let btn = element.closest('.prompt-card, .add-card')?.querySelector('.copy-btn, .save-btn');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "✓ Copied!";
                btn.style.background = "var(--zone-green)";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = "";
                }, 2000);
            }
        }).catch(err => {
            console.error("Failed to copy:", err);
            alert("Failed to copy. Please try selecting and copying manually.");
        });
    } else {
        // Fallback for older browsers
        let textArea = document.createElement("textarea");
        textArea.value = txt;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            alert("Prompt copied to clipboard!");
        } catch (err) {
            alert("Please copy manually: " + txt.substring(0, 50) + "...");
        }
        document.body.removeChild(textArea);
    }
}

