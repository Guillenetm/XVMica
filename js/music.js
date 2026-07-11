/* ==========================================================
   MICAELA XV — MUSIC.JS
   Audio controller with floating button, play/pause,
   volume slider, and visual bars animation
   ========================================================== */

(function () {

    'use strict';

    /* ─── DOM Elements ─────────────────────────────────── */

    const audio        = document.getElementById('music');
    const musicBtn     = document.getElementById('music-btn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeRange  = document.getElementById('volumeRange');

    if (!audio || !musicBtn) return;

    /* ─── State ────────────────────────────────────────── */

    let isPlaying      = false;
    let volumeOpen     = false;
    let volumeTimeout  = null;

    /* ─── Set initial volume ───────────────────────────── */

    audio.volume = 0.7;

    /* ─── Start Music (called from app.js on envelope open) */

    window.startMusic = function () {
        if (isPlaying) return;

        audio.play().then(() => {
            isPlaying = true;
            musicBtn.classList.remove('paused');
            musicBtn.classList.add('playing', 'visible');
        }).catch((err) => {
            console.warn('Autoplay blocked:', err);
            // Show button anyway so user can tap
            musicBtn.classList.add('visible');
        });
    };

    /* ─── Toggle Play/Pause ────────────────────────────── */

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            musicBtn.classList.remove('playing');
            musicBtn.classList.add('paused');
        } else {
            audio.play().then(() => {
                isPlaying = true;
                musicBtn.classList.remove('paused');
                musicBtn.classList.add('playing');
            }).catch(console.warn);
        }
    });

    /* ─── Long press for volume ────────────────────────── */

    let longPressTimer = null;

    musicBtn.addEventListener('pointerdown', () => {
        longPressTimer = setTimeout(() => {
            toggleVolume();
        }, 500);
    });

    musicBtn.addEventListener('pointerup', () => {
        clearTimeout(longPressTimer);
    });

    musicBtn.addEventListener('pointerleave', () => {
        clearTimeout(longPressTimer);
    });

    /* ─── Volume Control ───────────────────────────────── */

    function toggleVolume() {
        volumeOpen = !volumeOpen;

        if (volumeOpen) {
            volumeSlider.classList.add('open');
            // Auto-close after 5 seconds
            clearTimeout(volumeTimeout);
            volumeTimeout = setTimeout(() => {
                volumeSlider.classList.remove('open');
                volumeOpen = false;
            }, 5000);
        } else {
            volumeSlider.classList.remove('open');
        }
    }

    if (volumeRange) {
        volumeRange.addEventListener('input', (e) => {
            const vol = parseInt(e.target.value, 10) / 100;
            audio.volume = vol;

            // Reset auto-close timer
            clearTimeout(volumeTimeout);
            volumeTimeout = setTimeout(() => {
                volumeSlider.classList.remove('open');
                volumeOpen = false;
            }, 5000);
        });
    }

    /* ─── Close volume on outside click ────────────────── */

    document.addEventListener('click', (e) => {
        if (volumeOpen &&
            !volumeSlider.contains(e.target) &&
            !musicBtn.contains(e.target)) {
            volumeSlider.classList.remove('open');
            volumeOpen = false;
        }
    });

    /* ─── Handle audio end (safety for loop) ───────────── */

    audio.addEventListener('ended', () => {
        // Loop attribute should handle this, but just in case
        audio.currentTime = 0;
        audio.play().catch(() => {});
    });

})();
