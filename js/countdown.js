/* ==========================================================
   MICAELA XV — COUNTDOWN.JS
   Elegant flip countdown to 19/02/2027 21:00 (UTC-3)
   ========================================================== */

(function () {

    'use strict';

    /* ─── Target Date ──────────────────────────────────── */

    const TARGET = new Date('2027-02-19T21:00:00-03:00').getTime();

    /* ─── DOM Elements ─────────────────────────────────── */

    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    /* ─── Previous Values (for flip detection) ─────────── */

    let prevValues = {
        days:    null,
        hours:   null,
        minutes: null,
        seconds: null
    };

    /* ─── Update Function ──────────────────────────────── */

    function updateCountdown() {
        const now  = Date.now();
        const diff = TARGET - now;

        if (diff <= 0) {
            setDigit(daysEl,    '0',  'days');
            setDigit(hoursEl,   '0',  'hours');
            setDigit(minutesEl, '0',  'minutes');
            setDigit(secondsEl, '0',  'seconds');
            return;
        }

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setDigit(daysEl,    String(days),              'days');
        setDigit(hoursEl,   String(hours).padStart(2, '0'),   'hours');
        setDigit(minutesEl, String(minutes).padStart(2, '0'), 'minutes');
        setDigit(secondsEl, String(seconds).padStart(2, '0'), 'seconds');
    }

    /* ─── Flip Digit Animation ─────────────────────────── */

    function setDigit(el, value, key) {
        if (!el) return;

        // Skip if value hasn't changed
        if (prevValues[key] === value) return;
        prevValues[key] = value;

        const currentSpan = el.querySelector('.current');
        const nextSpan    = el.querySelector('.next');

        if (!currentSpan || !nextSpan) return;

        // Set the new value in the "next" span
        nextSpan.textContent = value;

        // Trigger flip animation
        el.classList.add('flipping');

        // After animation completes, swap values and reset
        setTimeout(() => {
            // Disable transition temporarily to prevent backward jump
            currentSpan.style.transition = 'none';
            nextSpan.style.transition = 'none';

            currentSpan.textContent = value;
            el.classList.remove('flipping');
            nextSpan.textContent = '';

            // Force browser reflow to apply 'none' transition immediately
            void el.offsetWidth;

            // Re-enable transition
            currentSpan.style.transition = '';
            nextSpan.style.transition = '';
        }, 500);
    }

    /* ─── Initialize ───────────────────────────────────── */

    // Run immediately
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);

})();
