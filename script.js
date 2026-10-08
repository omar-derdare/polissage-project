/* ============================================================ */
/* POLISSAGE MARBRE PRO — RABAT & TANGER — JAVASCRIPT           */
/* ============================================================ */

$(document).ready(function () {

    // ============================================================ //
    // 1. LENIS SMOOTH SCROLL
    // ============================================================ //
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ============================================================ //
    // 2. AOS ANIMATIONS
    // ============================================================ //
    const isMobileDevice = window.innerWidth < 768;
    const isLowEndDevice = window.navigator.hardwareConcurrency <= 4;

    const animDuration = isMobileDevice ? 700 : 900;
    const animOffset = isMobileDevice ? 30 : 50;
    const animEasing = (isMobileDevice || isLowEndDevice) ? 'ease' : 'ease-out-cubic';

    AOS.init({
        once: true,
        offset: animOffset,
        duration: animDuration,
        easing: animEasing,
        disable: false,
        mirror: false,
        startEvent: 'DOMContentLoaded',
        throttleDelay: isMobileDevice ? 100 : 50,
    });

    setTimeout(function() { AOS.refresh(); }, 100);

    window.addEventListener('orientationchange', function() {
        setTimeout(function() { AOS.refresh(); }, 400);
    });

    let aosResizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(aosResizeTimer);
        aosResizeTimer = setTimeout(function() { AOS.refresh(); }, 300);
    });

    // ============================================================ //
    // 3. NAVBAR LOGIC
    // ============================================================ //
    const $navbar = $('#navbar');
    const $hamburger = $('#hamburger-btn');
    const $mobileMenu = $('#mobile-menu');
    const $mobileLinks = $('.mobile-link');

    function updateNavbar() {
        const isMenuOpen = $mobileMenu.hasClass('is-open');
        const scrollTop = $(window).scrollTop();

        if (isMenuOpen) {
            $navbar.removeClass('scrolled');
        } else if (scrollTop > 50) {
            $navbar.addClass('scrolled');
        } else {
            $navbar.removeClass('scrolled');
        }
    }

    $(window).on('resize', function () {
        if ($(window).width() >= 1024) {
            $mobileMenu.removeClass('is-open');
            $hamburger.removeClass('is-active');
            $('body').removeClass('overflow-hidden');
            updateNavbar();
        }
    });

    $(window).on('scroll', updateNavbar);

    $hamburger.on('click', function () {
        $(this).toggleClass('is-active');

        if ($mobileMenu.hasClass('is-open')) {
            $mobileMenu.removeClass('is-open');
            setTimeout(() => $mobileMenu.css('pointer-events', 'none'), 400);
            $('body').removeClass('overflow-hidden');
        } else {
            $mobileMenu.css('pointer-events', 'auto');
            setTimeout(() => $mobileMenu.addClass('is-open'), 10);
            $('body').addClass('overflow-hidden');
        }

        setTimeout(updateNavbar, 50);
    });

    $mobileLinks.on('click', function () {
        $hamburger.removeClass('is-active');
        $mobileMenu.removeClass('is-open');
        setTimeout(() => $mobileMenu.css('pointer-events', 'none'), 400);
        $('body').removeClass('overflow-hidden');
        setTimeout(updateNavbar, 50);
    });

    $mobileMenu.css('pointer-events', 'none');
    updateNavbar();

    // ============================================================ //
    // 4. SWIPER - SERVICES
    // ============================================================ //
    const serviceSwiper = new Swiper('.serviceSwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        initialSlide: 1,
        coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        breakpoints: {
            320: { slidesPerView: 1 },
            768: { slidesPerView: 'auto' }
        }
    });

    // ============================================================ //
    // 5. SWIPER - TESTIMONIALS
    // ============================================================ //
    const testimonialSwiper = new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        effect: 'slide',
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        loop: true,
        keyboard: { enabled: true },
        breakpoints: {
            0: { slidesPerView: 1, spaceBetween: 15 },
            768: { slidesPerView: 1, spaceBetween: 25 },
            1024: { slidesPerView: 1, spaceBetween: 30 }
        }
    });

    // ============================================================ //
    // 6. FANCYBOX
    // ============================================================ //
    Fancybox.bind('[data-fancybox]', {
        Thumbs: { type: 'modern' },
        Toolbar: {
            display: {
                left: ['infobar'],
                middle: [],
                right: ['slideshow', 'thumbs', 'close'],
            },
        },
        closeButton: true,
        hideScrollbar: true,
        on: {
            close: () => {
                document.body.classList.remove('overflow-hidden');
            }
        }
    });

    $(document).on('click', '.fancybox__backdrop', function (e) {
        if (e.target === this) Fancybox.close();
    });

    $(document).on('click', '.fancybox__close', function (e) {
        e.preventDefault();
        Fancybox.close();
    });

    // ============================================================ //
    // 7. COUNTER
    // ============================================================ //
    let counterStarted = false;

    function runCounter() {
        $('.counter').each(function () {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            if (isNaN(target)) return;

            $this.prop('Counter', 0).animate(
                { Counter: target },
                {
                    duration: 2000,
                    easing: 'swing',
                    step: function (now) { $this.text(Math.ceil(now)); },
                    complete: function() { $this.text(target); }
                }
            );
        });
    }

    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !counterStarted) {
                    runCounter();
                    counterStarted = true;
                    counterObserver.disconnect();
                }
            });
        }, { threshold: 0.3 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) counterObserver.observe(statsSection);
    } else {
        $(window).on('scroll', function () {
            if ($('.counter').length) {
                const top = $('.counter').first().offset().top;
                const winH = $(window).height();
                const scroll = $(this).scrollTop();

                if (scroll > top - winH + 100 && !counterStarted) {
                    runCounter();
                    counterStarted = true;
                }
            }
        });
    }

    // ============================================================ //
    // 8. CONTACT FORM
    // ============================================================ //
    $('#contactForm').on('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Devis envoyé !',
            text: 'Nous vous recontacterons bientôt pour votre projet à Rabat ou Tanger.',
            icon: 'success',
            background: '#1a1a1a',
            color: '#fff',
            confirmButtonColor: '#D4AF37',
            timer: 3000,
            timerProgressBar: true
        });

        this.reset();
    });

    // ============================================================ //
    // 9. VIDEO MODAL
    // ============================================================ //
    $('#play-reel').on('click', function () {
        Swal.fire({
            html: `
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;">
                <iframe
                    style="position:absolute;top:0;left:0;width:100%;height:100%;"
                    src="https://www.youtube.com/embed/xcjC6eTPSrE?autoplay=1&rel=0&playsinline=1&modestbranding=1"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>`,
            showConfirmButton: false,
            background: 'transparent',
            width: '90%',
            maxWidth: '800px',
            showCloseButton: true,
            backdrop: 'rgba(0,0,0,0.9)',
            customClass: {
                popup: 'video-modal-popup',
                closeButton: 'video-modal-close'
            }
        });
    });

    // ============================================================ //
    // 10. COOKIES
    // ============================================================ //
    const cookiePopup = document.getElementById('cookie-popup');

    if (cookiePopup && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookiePopup.classList.add('show'), 3000);
    }

    window.acceptCookies = function () {
        localStorage.setItem('cookiesAccepted', 'true');
        if (cookiePopup) cookiePopup.classList.remove('show');
    };

    window.closeCookies = function () {
        if (cookiePopup) cookiePopup.classList.remove('show');
    };

    // ============================================================ //
    // 11. SCROLL TO TOP
    // ============================================================ //
    const scrollTopBtn = $('#scroll-top');
    const progressCircle = document.getElementById('scroll-progress-circle');
    const radius = 28;
    const circumference = 2 * Math.PI * radius;

    if (progressCircle) {
        progressCircle.style.strokeDasharray = circumference;
    }

    lenis.on('scroll', ({ scroll, progress }) => {
        if (scroll > 500) {
            scrollTopBtn.addClass('visible');
        } else {
            scrollTopBtn.removeClass('visible');
        }

        if (progressCircle) {
            const offset = circumference - progress * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
    });

    scrollTopBtn.on('click', () => lenis.scrollTo(0));

    // ============================================================ //
    // 12. PARALLAX HERO
    // ============================================================ //
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg) {
        lenis.on('scroll', ({ scroll }) => {
            heroBg.style.transform = `translateY(${-(scroll * 0.5)}px)`;
        });
    }

    // ============================================================ //
    // 13. MOBILE AOS FIX
    // ============================================================ //
    if (window.innerWidth < 768) {
        setTimeout(function() { AOS.refresh(); }, 500);
    }

    console.log('Polissage Marbre Pro — Rabat & Tanger 🚀');
});