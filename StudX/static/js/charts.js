(() => {
    const daily = document.getElementById("dailyChart");
    if (!daily) return;

    function mins(v) {
        return Math.round((v || 0) / 60);
    }

    function drawFallbackBar(canvas, labels, values) {
        const ctx = canvas.getContext("2d");
        const w = canvas.width = canvas.clientWidth;
        const h = canvas.height = 260;
        ctx.clearRect(0, 0, w, h);
        const max = Math.max(...values, 1);
        const bw = Math.max(10, (w - 40) / values.length - 8);
        values.forEach((v, i) => {
            const x = 20 + i * (bw + 8);
            const bh = (v / max) * (h - 40);
            ctx.fillStyle = "#8b5cf6";
            ctx.fillRect(x, h - 20 - bh, bw, bh);
        });
    }

    fetch("/api/analytics/")
        .then((r) => r.json())
        .then((data) => {
            const subjectLabels = data.subjects.map((s) => s.name);
            const subjectValues = data.subjects.map((s) => mins(s.total_seconds));
            const subjectColors = data.subjects.map((s) => s.color);
            const dLabels = data.daily_30.map((d) => d.day.slice(5));
            const dValues = data.daily_30.map((d) => mins(d.total_seconds));
            const wLabels = data.weekly_12.map((d) => d.day);
            const wValues = data.weekly_12.map((d) => mins(d.total_seconds));
            const mLabels = data.monthly_12.map((d) => d.day.slice(0, 7));
            const mValues = data.monthly_12.map((d) => mins(d.total_seconds));

            if (window.Chart) {
                new Chart(document.getElementById("dailyChart"), {
                    type: "line",
                    data: { labels: dLabels, datasets: [{ label: "Daily minutes", data: dValues, borderColor: "#8b5cf6", tension: 0.3 }] },
                    options: { responsive: true, animation: true }
                });
                new Chart(document.getElementById("pieChart"), {
                    type: "pie",
                    data: { labels: subjectLabels, datasets: [{ data: subjectValues, backgroundColor: subjectColors }] },
                    options: { responsive: true, animation: true }
                });
                new Chart(document.getElementById("weeklyChart"), {
                    type: "bar",
                    data: { labels: wLabels, datasets: [{ label: "Weekly minutes", data: wValues, backgroundColor: "#22c55e" }] },
                    options: { responsive: true, animation: true }
                });
                new Chart(document.getElementById("monthlyChart"), {
                    type: "line",
                    data: { labels: mLabels, datasets: [{ label: "Monthly minutes", data: mValues, borderColor: "#06b6d4", tension: 0.3 }] },
                    options: { responsive: true, animation: true }
                });
            } else {
                drawFallbackBar(document.getElementById("dailyChart"), dLabels, dValues);
                drawFallbackBar(document.getElementById("pieChart"), subjectLabels, subjectValues);
                drawFallbackBar(document.getElementById("weeklyChart"), wLabels, wValues);
                drawFallbackBar(document.getElementById("monthlyChart"), mLabels, mValues);
            }
        });
})();
