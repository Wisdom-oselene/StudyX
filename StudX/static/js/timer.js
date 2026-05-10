/* =========================
   STUDYX TIMER ENGINE
========================= */

class StudyXTimer {
    constructor() {
        this.duration = 25 * 60;
        this.remaining = this.duration;
        this.interval = null;
        this.isRunning = false;

        this.elements = {
            display: document.getElementById("timerDisplay"),
            start: document.getElementById("startBtn"),
            pause: document.getElementById("pauseBtn"),
            reset: document.getElementById("resetBtn"),
            mode: document.getElementById("modeSelect"),
            custom: document.getElementById("customMinutes"),
            subject: document.getElementById("subjectSelect"),
            status: document.getElementById("timerStatus")
        };

        this.init();
    }

    /* ---------- INIT ---------- */
    init() {
        if (!this.elements.display) return;

        this.bindEvents();
        this.updateDisplay();
        this.setMode("pomodoro");
    }

    /* ---------- EVENTS ---------- */
    bindEvents() {
        this.elements.start?.addEventListener("click", () => this.start());
        this.elements.pause?.addEventListener("click", () => this.pause());
        this.elements.reset?.addEventListener("click", () => this.reset());

        this.elements.mode?.addEventListener("change", (e) => {
            this.setMode(e.target.value);
        });
    }

    /* ---------- MODES ---------- */
    setMode(mode) {
        if (mode === "pomodoro") {
            this.setDuration(25 * 60);
        }

        if (mode === "deep") {
            this.setDuration(50 * 60);
        }

        if (mode === "custom") {
            const mins = parseInt(this.elements.custom?.value || 30);
            this.setDuration(mins * 60);
        }

        this.reset();
    }

    setDuration(seconds) {
        this.duration = seconds;
        this.remaining = seconds;
        this.updateDisplay();
    }

    /* ---------- TIMER CORE ---------- */
    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.setStatus("Focused...");

        this.interval = setInterval(() => {
            this.remaining--;

            this.updateDisplay();
            this.animateTick();

            if (this.remaining <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
        this.setStatus("Paused");
    }

    reset() {
        this.pause();
        this.remaining = this.duration;
        this.updateDisplay();
        this.setStatus("Ready");
    }

    complete() {
        this.pause();
        this.setStatus("Session Complete 🎉");

        this.playSound();
        this.flashScreen();
    }

    /* ---------- UI ---------- */
    updateDisplay() {
        const mins = Math.floor(this.remaining / 60);
        const secs = this.remaining % 60;

        this.elements.display.textContent =
            `${this.pad(mins)}:${this.pad(secs)}`;
    }

    setStatus(text) {
        if (this.elements.status) {
            this.elements.status.textContent = text;
        }
    }

    pad(n) {
        return n < 10 ? "0" + n : n;
    }

    /* ---------- ANIMATIONS ---------- */
    animateTick() {
        this.elements.display.classList.add("tick");
        setTimeout(() => {
            this.elements.display.classList.remove("tick");
        }, 150);
    }

    flashScreen() {
        document.body.classList.add("flash");
        setTimeout(() => {
            document.body.classList.remove("flash");
        }, 800);
    }

    /* ---------- SOUND ---------- */
    playSound() {
        const audio = new Audio(
            "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        );
        audio.play();
    }
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    new StudyXTimer();
});