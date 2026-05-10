/* =========================
   STUDYX GLOBAL SCRIPT
========================= */

const StudyX = {
    init() {
        this.setupTheme();
        this.bindThemeToggle();
    },

    /* ---------- THEME SYSTEM ---------- */
    setupTheme() {
        const saved = localStorage.getItem("studyx-theme");
        if (saved) {
            document.documentElement.setAttribute("data-theme", saved);
        }
    },

    bindThemeToggle() {
        const btn = document.getElementById("themeToggle");
        if (!btn) return;

        btn.addEventListener("click", () => {
            const html = document.documentElement;
            const current = html.getAttribute("data-theme");

            const next = current === "dark" ? "light" : "dark";
            html.setAttribute("data-theme", next);
            localStorage.setItem("studyx-theme", next);
        });
    }
};

/* INIT */
document.addEventListener("DOMContentLoaded", () => StudyX.init());