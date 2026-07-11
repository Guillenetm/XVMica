/* ==========================================================
   MICAELA XV — FORMS.JS
   Song suggestion (Google Apps Script) & RSVP (WhatsApp)
   ========================================================== */

(function () {

    'use strict';

    /* ─── Configuration ────────────────────────────────── */

    // Replace this URL with your Google Apps Script Web App URL
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhq0kedQM2svjKXLD168qvl8mweA8OsDJVGts-x1uZwaBV6iE4aIkPLz9Wakg_R2IH/exec';

    const WHATSAPP_NUMBER = '5491166468943';

    /* ═══════════════════════════════════════════════════════
       1. SONG SUGGESTION FORM
       ═══════════════════════════════════════════════════════ */

    const songForm = document.getElementById('songForm');
    const songSuccess = document.getElementById('songSuccess');
    const songCard = document.getElementById('songFormCard');

    if (songForm) {
        songForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre  = document.getElementById('songRecommenderName').value.trim();
            const cancion = document.getElementById('songName').value.trim();
            const artista = document.getElementById('songArtist').value.trim();

            // Validation
            if (!nombre || !cancion || !artista) {
                shakeForm(songForm);
                return;
            }

            // Disable form
            const submitBtn = songForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            // Send to Google Apps Script (if URL configured)
            if (APPS_SCRIPT_URL) {
                try {
                    await fetch(APPS_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre:    nombre,
                            cancion:   cancion,
                            artista:   artista,
                            timestamp: new Date().toISOString()
                        })
                    });
                } catch (err) {
                    console.warn('Error sending song suggestion:', err);
                }
            }

            // Show success message
            gsap.to(songForm, {
                opacity: 0,
                height: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    songForm.style.display = 'none';
                    songSuccess.style.display = 'block';

                    gsap.fromTo(songSuccess, {
                        opacity: 0,
                        scale: 0.9
                    }, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            });
        });
    }

    /* ═══════════════════════════════════════════════════════
       2. RSVP / CONFIRMATION FORM
       ═══════════════════════════════════════════════════════ */

    const rsvpForm = document.getElementById('rsvpForm');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('rsvpName').value.trim();
            const cantidad = document.getElementById('rsvpCount').value;
            const observaciones = document.getElementById('rsvpNotes').value.trim();
            const restricciones = document.getElementById('rsvpDiet').value.trim();

            // Validation
            if (!nombre) {
                shakeForm(rsvpForm);
                const nameInput = document.getElementById('rsvpName');
                nameInput.focus();
                nameInput.style.borderColor = 'rgba(155, 34, 38, 0.5)';
                setTimeout(() => {
                    nameInput.style.borderColor = '';
                }, 2000);
                return;
            }

            // Build WhatsApp message
            const mensaje = [
                'Hola.',
                '',
                `Soy ${nombre}.`,
                '',
                'Confirmo asistencia al cumpleaños de Micaela.',
                '',
                `Seremos ${cantidad} persona${cantidad > 1 ? 's' : ''}.`,
                '',
                observaciones ? `Observaciones:\n${observaciones}` : '',
                '',
                restricciones ? `Restricciones alimenticias:\n${restricciones}` : ''
            ].filter(line => line !== '' || true).join('\n').trim();

            // Open WhatsApp
            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    }

    /* ═══════════════════════════════════════════════════════
       3. FORM HELPERS
       ═══════════════════════════════════════════════════════ */

    /**
     * Subtle shake animation for form validation feedback
     */
    function shakeForm(form) {
        if (typeof gsap !== 'undefined') {
            gsap.to(form, {
                x: -8,
                duration: 0.08,
                repeat: 5,
                yoyo: true,
                ease: 'power2.inOut',
                onComplete: () => {
                    gsap.set(form, { x: 0 });
                }
            });
        }
    }

})();
