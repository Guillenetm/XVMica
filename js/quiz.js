/* ==========================================================
   MICAELA XV — QUIZ.JS
   Interactive quiz with one question at a time,
   LocalStorage persistence, and silver confetti celebration
   ========================================================== */

(function () {

    'use strict';

    /* ─── Configuration ────────────────────────────────── */

    const STORAGE_KEY = 'mica-quiz-score';
    const STORAGE_DONE = 'mica-quiz-done';

    const questions = [
        {
            question: '¿Cuál es la ciudad que me gustaría conocer?',
            options: ['París', 'Roma', 'Nueva York', 'Madrid'],
            answer: 1
        },
        {
            question: '¿Cuál es mi color favorito?',
            options: ['Rosa', 'Celeste', 'Azul Marino', 'Lila'],
            answer: 2
        },
        {
            question: '¿Cuál es mi cantante favorita?',
            options: ['Tini', 'Nicki Nicole', 'María Becerra', 'Lali'],
            answer: 2
        },
        {
            question: '¿Qué estación del año prefiero?',
            options: ['Primavera', 'Verano', 'Otoño', 'Invierno'],
            answer: 1
        },
        {
            question: '¿Qué deporte practico?',
            options: ['Gimnasia', 'Fútbol', 'Baile', 'Natación'],
            answer: 2
        }
    ];

    /* ─── DOM ──────────────────────────────────────────── */

    const container = document.getElementById('quizContainer');
    if (!container) return;

    /* ─── Check if already completed ──────────────────── */

    const savedScore = localStorage.getItem(STORAGE_KEY);
    const quizDone   = localStorage.getItem(STORAGE_DONE);

    if (quizDone === 'true' && savedScore !== null) {
        showResult(parseInt(savedScore, 10), false);
        return;
    }

    /* ─── State ────────────────────────────────────────── */

    let currentIndex = 0;
    let score = 0;

    /* ─── Build Quiz ───────────────────────────────────── */

    function buildQuiz() {
        questions.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'quiz-card';
            card.id = `quiz-q${index}`;
            if (index === 0) card.classList.add('active');

            card.innerHTML = `
                <p class="quiz-progress">Pregunta ${index + 1} de ${questions.length}</p>
                <h3 class="quiz-question">${q.question}</h3>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <button class="quiz-option"
                                data-question="${index}"
                                data-option="${i}"
                                type="button"
                                aria-label="${opt}">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            `;

            container.appendChild(card);
        });

        // Attach event listeners to all options
        container.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', handleAnswer);
        });
    }

    /* ─── Handle Answer ────────────────────────────────── */

    function handleAnswer(e) {
        const btn        = e.currentTarget;
        const qIndex     = parseInt(btn.dataset.question, 10);
        const optIndex   = parseInt(btn.dataset.option, 10);
        const question   = questions[qIndex];
        const isCorrect  = optIndex === question.answer;
        const card       = document.getElementById(`quiz-q${qIndex}`);

        // Disable all options in this card
        card.querySelectorAll('.quiz-option').forEach(b => {
            b.disabled = true;
        });

        // Mark correct/wrong
        if (isCorrect) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('wrong');
            // Highlight the correct answer
            card.querySelectorAll('.quiz-option')[question.answer].classList.add('correct');
        }

        // Advance to next question after a delay
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                // Transition out current card
                card.classList.remove('active');
                card.classList.add('exiting');

                currentIndex++;

                // Transition in next card
                const nextCard = document.getElementById(`quiz-q${currentIndex}`);
                nextCard.classList.add('active');
            } else {
                // Quiz complete
                card.classList.remove('active');
                card.classList.add('exiting');

                // Save to localStorage
                localStorage.setItem(STORAGE_KEY, score.toString());
                localStorage.setItem(STORAGE_DONE, 'true');

                // Show result with celebration
                setTimeout(() => {
                    showResult(score, true);
                }, 400);
            }
        }, 1200);
    }

    /* ─── Show Result ──────────────────────────────────── */

    function showResult(finalScore, celebrate) {
        // Clear quiz cards
        container.innerHTML = '';

        const result = document.createElement('div');
        result.className = 'quiz-result';
        result.innerHTML = `
            <div class="quiz-result-glow"></div>
            <div class="quiz-result-content">
                <p class="quiz-result-label">Obtuviste</p>
                <p class="quiz-result-score">${finalScore} de ${questions.length}</p>
                <p class="quiz-result-total">respuestas correctas</p>
            </div>
        `;

        container.appendChild(result);

        // Animate in
        gsap.fromTo(result, {
            opacity: 0,
            scale: 0.9
        }, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
        });

        // Silver confetti celebration
        if (celebrate) {
            setTimeout(() => createConfetti(), 300);
        }
    }

    /* ─── Confetti Celebration ──────────────────────────── */

    function createConfetti() {
        const colors = ['#C0C0C0', '#E8E8E8', '#A8A8A8', '#D4D4D4'];
        const count  = 30;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.classList.add('confetti-piece');

            const startX = window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.6;

            piece.style.left = startX + 'px';
            piece.style.top  = '-20px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];

            const size = Math.random() * 6 + 3;
            piece.style.width  = size + 'px';
            piece.style.height = size + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';

            document.body.appendChild(piece);

            gsap.to(piece, {
                y: window.innerHeight + 100,
                x: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 720,
                opacity: 0,
                duration: 2.5 + Math.random() * 1.5,
                delay: Math.random() * 0.8,
                ease: 'power1.out',
                onComplete: () => piece.remove()
            });
        }
    }

    /* ─── Initialize ───────────────────────────────────── */

    buildQuiz();

})();
