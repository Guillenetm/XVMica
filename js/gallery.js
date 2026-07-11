/* ==========================================================
   MICAELA XV — GALLERY.JS
   SwiperJS carousel initialization with coverflow effect,
   autoplay, pagination, and navigation
   ========================================================== */

(function () {

    'use strict';

    /* ─── Wait for Swiper to be available ──────────────── */

    function initGallery() {
        if (typeof Swiper === 'undefined') {
            setTimeout(initGallery, 100);
            return;
        }

        const swiperEl = document.querySelector('.gallery-swiper');
        if (!swiperEl) return;

        /* ─── Swiper Initialization ─────────────────────── */

        const gallerySwiper = new Swiper('.gallery-swiper', {

            /* Effect */
            effect: 'coverflow',
            coverflowEffect: {
                rotate:       5,
                stretch:      0,
                depth:        100,
                modifier:     1,
                slideShadows: false
            },

            /* Layout */
            centeredSlides: true,
            slidesPerView:  1.3,
            spaceBetween:   16,
            grabCursor:     true,

            /* Loop */
            loop: true,

            /* Autoplay */
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter:   true
            },

            /* Speed */
            speed: 600,

            /* Pagination */
            pagination: {
                el:        '.swiper-pagination',
                clickable: true
            },

            /* Navigation */
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },

            /* Lazy loading */
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 2
            },

            /* Breakpoints */
            breakpoints: {
                768: {
                    slidesPerView: 1.8,
                    spaceBetween:  24
                },
                1024: {
                    slidesPerView: 2.2,
                    spaceBetween:  32
                }
            },

            /* Accessibility */
            a11y: {
                prevSlideMessage: 'Foto anterior',
                nextSlideMessage: 'Foto siguiente',
                firstSlideMessage: 'Primera foto',
                lastSlideMessage:  'Última foto',
                paginationBulletMessage: 'Ir a la foto {{index}}'
            }

        });
    }

    /* ─── Initialize on DOM ready ──────────────────────── */

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

})();
