    // App State
    let currentCategory = null;
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = { correct: 0, wrong: 0 };
    let timerInterval = null;
    let secondsElapsed = 0;
    let totalUserXP = 1250; // Mock initial XP

    // DOM Elements
    const views = {
    home: document.getElementById("home-view"),
    quiz: document.getElementById("quiz-view"),
    result: document.getElementById("result-view"),
    };

    const elements = {
    categoriesContainer: document.getElementById("categories-container"),
    totalQuestionsStat: document.getElementById("total-questions-stat"),
    overallProgressText: document.getElementById("overall-progress-text"),
    mainProgressRing: document.getElementById("main-progress-ring"),
    totalXpDisplay: document.getElementById("total-xp"),

    // Quiz View
    quizTitle: document.getElementById("quiz-title"),
    timerText: document.getElementById("timer-text"),
    quizProgressBar: document.getElementById("quiz-progress-bar"),
    statRemaining: document.getElementById("stat-remaining"),
    statCorrect: document.getElementById("stat-correct"),
    statWrong: document.getElementById("stat-wrong"),
    qNumber: document.getElementById("q-number"),
    qText: document.getElementById("q-text"),
    optionsContainer: document.getElementById("options-container"),
    correctionBox: document.getElementById("correction-box"),
    correctionText: document.getElementById("correction-text"),
    btnNext: document.getElementById("btn-next"),
    btnBack: document.getElementById("btn-back"),

    // Result View
    finalScore: document.getElementById("final-score"),
    finalTotal: document.getElementById("final-total"),
    finalTime: document.getElementById("final-time"),
    finalAccuracy: document.getElementById("final-accuracy"),
    finalXp: document.getElementById("final-xp"),
    btnHome: document.getElementById("btn-home"),
    };

    const CATEGORY_ICONS = [
    "🌐", // Intro
    "📄", // HTML
    "🎨", // CSS
    "⚡", // JS
    "🐘", // PHP
    ];

    // Initialize App
    function init() {
    renderCategories();
    setupEventListeners();
    updateMainProgressRing(15); // Mock 15% overall progress

    // Mouse tracking for category card glow effect
    document.getElementById("categories-container").onmousemove = (e) => {
        for (const card of document.getElementsByClassName("category-card")) {
        const rect = card.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
        }
    };
    }

    function switchView(viewName) {
    Object.values(views).forEach((v) => {
        v.classList.remove("active");
        v.style.display = "none";
    });

    // Force reflow for animation
    void views[viewName].offsetWidth;

    views[viewName].style.display = "flex";
    setTimeout(() => {
        views[viewName].classList.add("active");
    }, 10);

    // Show/hide nav based on view
    document.getElementById("main-nav").style.display =
        viewName === "home" ? "flex" : "none";
    }

    function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
    }

    function updateMainProgressRing(percent) {
    const circumference = 213; // 2 * pi * 34
    const offset = circumference - (percent / 100) * circumference;
    elements.mainProgressRing.style.strokeDashoffset = offset;
    elements.overallProgressText.textContent = `${percent}%`;
    }

    // Home View Logic
    function renderCategories() {
    elements.categoriesContainer.innerHTML = "";
    let totalQ = 0;

    quizData.forEach((category, index) => {
        totalQ += category.questions.length;
        const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];

        const card = document.createElement("div");
        card.className = "category-card";
        card.innerHTML = `
                <div class="cat-icon-wrapper">${icon}</div>
                <h3>${category.title}</h3>
                <div class="card-meta">
                    <span>${category.questions.length} Questions</span>
                    <div class="start-btn-mock">
                        Start <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                </div>
            `;
        card.addEventListener("click", () => startQuiz(index));
        elements.categoriesContainer.appendChild(card);
    });

    elements.totalQuestionsStat.textContent = `${totalQ} Questions Total`;
    }

    // Quiz Logic
    function startQuiz(categoryIndex) {
    currentCategory = quizData[categoryIndex];
    currentQuestions = [...currentCategory.questions].sort(
        () => Math.random() - 0.5,
    );
    currentQuestionIndex = 0;
    score = { correct: 0, wrong: 0 };
    secondsElapsed = 0;

    elements.quizTitle.textContent = currentCategory.title;
    elements.timerText.textContent = "00:00";

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        elements.timerText.textContent = formatTime(secondsElapsed);
    }, 1000);

    switchView("quiz");
    loadQuestion();
    }

    function loadQuestion() {
    const q = currentQuestions[currentQuestionIndex];

    // Update Progress Bar
    const progressPercent =
        (currentQuestionIndex / currentQuestions.length) * 100;
    elements.quizProgressBar.style.width = `${progressPercent}%`;

    elements.qNumber.textContent = `Q${currentQuestionIndex + 1} OF ${currentQuestions.length}`;

    // Animate question text
    elements.qText.style.opacity = 0;
    setTimeout(() => {
        elements.qText.textContent = q.question;
        elements.qText.style.transition = "opacity 0.3s";
        elements.qText.style.opacity = 1;
    }, 150);

    // Reset UI
    elements.optionsContainer.innerHTML = "";
    elements.correctionBox.classList.add("hidden");
    elements.btnNext.classList.add("disabled");

    updateStats();

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";

        // Stagger animation
        btn.style.opacity = "0";
        btn.style.transform = "translateY(10px)";
        btn.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";

        setTimeout(
        () => {
            btn.style.opacity = "1";
            btn.style.transform = "translateY(0)";
        },
        100 + idx * 50,
        );

        const label = String.fromCharCode(65 + idx);
        btn.innerHTML = `
                <div class="opt-letter">${label}</div>
                <span class="opt-text">${opt}</span>
            `;

        btn.addEventListener("click", () => handleAnswer(btn, opt, q));
        elements.optionsContainer.appendChild(btn);
    });
    }

    function handleAnswer(selectedBtn, selectedOption, q) {
    const buttons = elements.optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((b) => (b.disabled = true));

    // تعديل ذكي: استخدام .trim() لمسح المسافات العشوائية وحل مشكلة اللون الأحمر نهائياً
    const cleanSelected = String(selectedOption).trim();
    const cleanAnswer = String(q.answer).trim();
    const isCorrect = cleanSelected === cleanAnswer;

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score.correct++;
    } else {
        selectedBtn.classList.add("wrong");
        score.wrong++;

        buttons.forEach((b) => {
        const textSpan = b.querySelector(".opt-text");
        if (textSpan && textSpan.innerText.trim() === cleanAnswer) {
            b.classList.add("correct");
        }
        });

        const isTF =
        q.options.length === 2 &&
        q.options.some(
            (o) => typeof o === "string" && o.toLowerCase().includes("true"),
        ) &&
        q.options.some(
            (o) => typeof o === "string" && o.toLowerCase().includes("false"),
        );

        const isAnswerFalse =
        typeof q.answer === "string" && q.answer.toLowerCase().includes("false");

        if (q.correction && isTF && isAnswerFalse) {
        elements.correctionText.textContent = q.correction;
        elements.correctionBox.classList.remove("hidden");
        }
    }

    updateStats();
    elements.btnNext.classList.remove("disabled");
    }

    function updateStats() {
    elements.statRemaining.textContent =
        currentQuestions.length -
        currentQuestionIndex -
        (elements.btnNext.classList.contains("disabled") ? 0 : 1);
    elements.statCorrect.textContent = score.correct;
    elements.statWrong.textContent = score.wrong;
    }

    function navigateToNext() {
    if (!elements.btnNext.classList.contains("disabled")) {
        nextQuestion();
    }
    }

    function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= currentQuestions.length) {
        elements.quizProgressBar.style.width = `100%`;
        setTimeout(finishQuiz, 300);
    } else {
        loadQuestion();
    }
    }

    function finishQuiz() {
    clearInterval(timerInterval);

    elements.finalScore.textContent = score.correct;
    elements.finalTotal.textContent = currentQuestions.length;
    elements.finalTime.textContent = formatTime(secondsElapsed);

    const acc = Math.round((score.correct / currentQuestions.length) * 100) || 0;

    // Animate accuracy counter
    elements.finalAccuracy.textContent = `0%`;
    let count = 0;
    const accInterval = setInterval(() => {
        if (count >= acc) {
        elements.finalAccuracy.textContent = `${acc}%`;
        clearInterval(accInterval);
        } else {
        count += Math.ceil(acc / 20) || 1;
        elements.finalAccuracy.textContent = `${Math.min(count, acc)}%`;
        }
    }, 40);

    // Calculate and award XP
    const xpEarned = score.correct * 10 + (acc === 100 ? 50 : 0);
    elements.finalXp.textContent = xpEarned;
    totalUserXP += xpEarned;
    elements.totalXpDisplay.textContent = totalUserXP;

    switchView("result");
    }

    // Event Listeners
    function setupEventListeners() {
    elements.btnNext.addEventListener("click", navigateToNext);

    elements.btnBack.addEventListener("click", () => {
        if (confirm("Exit quiz? Progress will be lost.")) {
        clearInterval(timerInterval);
        switchView("home");
        }
    });

    elements.btnHome.addEventListener("click", () => {
        switchView("home");
    });
    }

    document.addEventListener("DOMContentLoaded", () => {
    if (typeof quizData !== "undefined") {
        init();
    } else {
        console.error("quizData is not defined.");
    }
    });
