/* ==========================================================
   MICAELA XV — APP.JS
   Main initialization: Loader, Constellation Background,
   Envelope interaction, Particles, Scroll Animations
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── CONSTANTS ────────────────────────────────────── */

    const NAVY_COLOR = '#102A43';
    const SILVER_COLOR = '#C0C0C0';

    /* ─── DOM ELEMENTS ─────────────────────────────────── */

    const loader         = document.getElementById('loader');
    const intro          = document.getElementById('intro');
    const mainContent    = document.getElementById('mainContent');
    const envelope       = document.getElementById('envelope');
    const seal           = document.getElementById('seal');
    const sealGlow       = document.getElementById('sealGlow');
    const envelopeFlap   = document.getElementById('envelopeFlap');
    const envelopeLetter = document.getElementById('envelopeLetter');
    const tapMessage     = document.getElementById('tapMessage');
    const canvas         = document.getElementById('constellation-canvas');
    const particles      = document.getElementById('particles');
    const musicEl        = document.getElementById('music');

    let envelopeOpened = false;

    /* ═══════════════════════════════════════════════════════
       1. LOADER
       ═══════════════════════════════════════════════════════ */

    function hideLoader() {
        setTimeout(() => {
            loader.classList.add('hidden');
            // Remove from DOM after transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 700);
        }, 2200);
    }

    hideLoader();

    /* ═══════════════════════════════════════════════════════
       2. CONSTELLATION BACKGROUND
       ═══════════════════════════════════════════════════════ */

    const ctx = canvas.getContext('2d');
    let stars = [];
    let mouseX = 0;
    let mouseY = 0;
    let animFrameId;

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createStars() {
        stars = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            stars.push({
                x:       Math.random() * canvas.width,
                y:       Math.random() * canvas.height,
                radius:  Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.4 + 0.1,
                pulse:   Math.random() * Math.PI * 2,
                speed:   Math.random() * 0.005 + 0.002
            });
        }
    }

    function drawConstellations() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Parallax offset based on mouse/device
        const parallaxX = (mouseX - canvas.width  / 2) * 0.01;
        const parallaxY = (mouseY - canvas.height / 2) * 0.01;

        stars.forEach(star => {
            star.pulse += star.speed;
            const currentOpacity = star.opacity * (0.5 + 0.5 * Math.sin(star.pulse));

            const sx = star.x + parallaxX;
            const sy = star.y + parallaxY;

            ctx.beginPath();
            ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 42, 67, ${currentOpacity * 0.3})`;
            ctx.fill();
        });

        // Draw subtle constellation lines between nearby stars
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = (stars[i].x + parallaxX) - (stars[j].x + parallaxX);
                const dy = (stars[i].y + parallaxY) - (stars[j].y + parallaxY);
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 80) {
                    const lineOpacity = (1 - dist / 80) * 0.04;
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x + parallaxX, stars[i].y + parallaxY);
                    ctx.lineTo(stars[j].x + parallaxX, stars[j].y + parallaxY);
                    ctx.strokeStyle = `rgba(16, 42, 67, ${lineOpacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animFrameId = requestAnimationFrame(drawConstellations);
    }

    function initConstellations() {
        resizeCanvas();
        createStars();
        drawConstellations();
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        createStars();
    });

    // Mouse parallax for constellations
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Device orientation parallax (mobile)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            if (e.gamma !== null && e.beta !== null) {
                mouseX = (canvas.width  / 2) + (e.gamma * 5);
                mouseY = (canvas.height / 2) + ((e.beta - 45) * 5);
            }
        });
    }

    initConstellations();

    /* ═══════════════════════════════════════════════════════
       3. SUBTLE PARTICLES
       ═══════════════════════════════════════════════════════ */

    function createParticle() {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + 'vw';

        const size = Math.random() * 3 + 1;
        p.style.width  = size + 'px';
        p.style.height = size + 'px';
        p.style.animationDuration = (Math.random() * 15 + 12) + 's';
        p.style.animationDelay    = (Math.random() * 5) + 's';

        particles.appendChild(p);

        setTimeout(() => p.remove(), 28000);
    }

    // Initial batch
    for (let i = 0; i < 15; i++) {
        createParticle();
    }

    // Continuously create particles
    setInterval(createParticle, 1500);

    /* ═══════════════════════════════════════════════════════
       4. ENVELOPE INTERACTION
       ═══════════════════════════════════════════════════════ */

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        const tl = gsap.timeline();

        // 1. Seal illuminates and glows
        tl.to(sealGlow, {
            opacity: 1,
            scale: 1.3,
            duration: 0.4,
            ease: 'power2.out'
        });

        // 2. Seal breaks (scale up + fade)
        tl.to(seal, {
            scale: 1.5,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '+=0.1');

        // 3. Hide tap message
        tl.to(tapMessage, {
            opacity: 0,
            duration: 0.3
        }, '<');

        // 4. Flap opens
        tl.add(() => {
            envelopeFlap.classList.add('open');
        });

        tl.to({}, { duration: 0.6 }); // Wait for flap CSS transition

        // 5. Letter rises out
        tl.add(() => {
            envelopeLetter.classList.add('rise');
        });

        // 6. Create silver rain particles
        tl.add(() => {
            createSilverRain();
        }, '-=0.3');

        // 7. Start music
        tl.add(() => {
            if (typeof window.startMusic === 'function') {
                window.startMusic();
            }
        }, '-=0.2');

        // 8. Fade out intro, reveal main content
        tl.to(intro, {
            opacity: 0,
            filter: 'blur(10px)',
            duration: 0.8,
            ease: 'power2.inOut',
            delay: 0.5,
            onComplete: () => {
                intro.classList.add('hidden');
                intro.style.display = 'none';
                mainContent.classList.add('visible');

                // Animate main content in
                gsap.to(mainContent, {
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    onComplete: () => {
                        initScrollAnimations();
                    }
                });
            }
        });
    }

    // Click/Tap handler
    seal.addEventListener('click', openEnvelope);
    envelope.addEventListener('click', openEnvelope);

    // Keyboard accessibility
    envelope.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEnvelope();
        }
    });

    /* ═══════════════════════════════════════════════════════
       5. SILVER RAIN (on envelope open)
       ═══════════════════════════════════════════════════════ */

    function createSilverRain() {
        const count = 40;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('silver-particle');

            const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
            const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;

            particle.style.left = startX + 'px';
            particle.style.top  = startY + 'px';

            const size = Math.random() * 4 + 2;
            particle.style.width  = size + 'px';
            particle.style.height = size + 'px';

            document.body.appendChild(particle);

            gsap.to(particle, {
                y: window.innerHeight * 0.6 + Math.random() * 200,
                x: (Math.random() - 0.5) * 300,
                rotation: Math.random() * 720,
                opacity: 0,
                duration: 2 + Math.random() * 1.5,
                delay: Math.random() * 0.5,
                ease: 'power1.out',
                onComplete: () => particle.remove()
            });
        }
    }

    /* ═══════════════════════════════════════════════════════
       6. SCROLL ANIMATIONS (GSAP + IntersectionObserver)
       ═══════════════════════════════════════════════════════ */

    function initScrollAnimations() {
        const sections = document.querySelectorAll('.reveal-section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate section in with GSAP
                    gsap.to(entry.target, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power2.out'
                    });

                    // Animate children with stagger
                    const children = entry.target.querySelectorAll(
                        '.section-header, .event-card, .form-card, .quiz-container, ' +
                        '.countdown-grid, .colors-grid, .forbidden-card, .dresscode-subtitle, ' +
                        '.hero-card, .footer-message, .footer-name'
                    );

                    gsap.fromTo(children, {
                        opacity: 0,
                        y: 25
                    }, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power2.out',
                        delay: 0.2
                    });

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            // Set initial state
            gsap.set(section, { opacity: 0, y: 40 });
            observer.observe(section);
        });
    }

    /* ═══════════════════════════════════════════════════════
       7. FOOTER STARS
       ═══════════════════════════════════════════════════════ */

    function createFooterStars() {
        const container = document.getElementById('footerStars');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const star = document.createElement('div');
            star.classList.add('footer-star');
            star.style.left = Math.random() * 100 + '%';
            star.style.top  = Math.random() * 100 + '%';
            star.style.animationDelay    = (Math.random() * 5) + 's';
            star.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(star);
        }
    }

    createFooterStars();

    /* ═══════════════════════════════════════════════════════
       8. CALENDAR .ICS DOWNLOAD
       ═══════════════════════════════════════════════════════ */

    const calendarBtn = document.getElementById('calendarBtn');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadICS();
        });
    }

    function downloadICS() {
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//XV Micaela//ES',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VEVENT',
            'DTSTART:20270220T000000Z',
            'DTEND:20270220T060000Z',
            'SUMMARY:XV Años de Micaela',
            'DESCRIPTION:¡Estás invitado/a a los XV años de Micaela!',
            'LOCATION:Colony Eventos\\, Ramón L. Falcón 2935\\, CABA',
            'STATUS:CONFIRMED',
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], {
            type: 'text/calendar;charset=utf-8'
        });

        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = 'XV-Micaela.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /* ═══════════════════════════════════════════════════════
       9. SMOOTH SCROLL LINKS
       ═══════════════════════════════════════════════════════ */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
