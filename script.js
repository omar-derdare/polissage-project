document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Smooth scroll (Lenis)
  const lenis = new Lenis({ duration: 1.1, smoothTouch: false });
  if (!reduce) { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }

  // Navbar
  const nav = document.getElementById('navbar');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Mobile menu
  const burger = document.getElementById('hamburger-btn');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    menu.classList.toggle('is-open', open);
    burger.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    open ? lenis.stop() : lenis.start();
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('resize', () => { if (innerWidth >= 1024) setMenu(false); });

  // Before / after slider
  const ba = document.getElementById('ba');
  ba.querySelector('input').addEventListener('input', e => ba.style.setProperty('--pos', e.target.value + '%'));

  // Services (coverflow) and gallery sliders
  new Swiper('.serviceSwiper', {
    effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', initialSlide: 1,
    coverflowEffect: { rotate: 28, stretch: 0, depth: 120, modifier: 1, slideShadows: true },
    pagination: { el: '.serviceSwiper .swiper-pagination', clickable: true },
    autoplay: reduce ? false : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
  });
  new Swiper('.gallerySwiper', {
    slidesPerView: 'auto', spaceBetween: 20, grabCursor: true,
    pagination: { el: '.gallery-pagination', clickable: true },
  });

  // Video: load the iframe only when asked (replace the video ID with your own)
  document.getElementById('play-reel').addEventListener('click', () => {
    document.getElementById('video-box').innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&rel=0" title="Polissage de marbre en vidéo" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
  });

  // Testimonials
  new Swiper('.testimonialSwiper', {
    effect: 'fade', fadeEffect: { crossFade: true },
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.testimonial-pagination', clickable: true },
  });

  // Counters (run once when visible)
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.target, t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1800, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      reduce ? el.textContent = end : requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('.counter').forEach(c => io.observe(c));

  // Send the form content through WhatsApp
  document.getElementById('wa-form').addEventListener('click', () => {
    const f = document.getElementById('contactForm');
    const v = n => f.elements[n].value.trim();
    const msg = 'Bonjour, je souhaite un devis.\nNom : ' + v('nom') + '\nContact : ' + v('contact') +
      '\nService : ' + v('service') + '\nSurface : ' + v('details');
    window.open('https://wa.me/212600000000?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });

  // Contact form
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    Swal.fire({
      title: 'Demande envoyée',
      text: 'Nous vous recontactons rapidement pour organiser une visite.',
      icon: 'success', background: '#f8f5ef', color: '#1f1e1c', confirmButtonColor: '#1f1e1c',
    });
    this.reset();
  });

  // Cookies
  const cookie = document.getElementById('cookie-popup');
  const hideCookie = () => { cookie.classList.remove('show'); setTimeout(() => cookie.hidden = true, 500); };
  if (!localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => { cookie.hidden = false; requestAnimationFrame(() => cookie.classList.add('show')); }, 3000);
  }
  window.acceptCookies = () => { localStorage.setItem('cookiesAccepted', 'true'); hideCookie(); };
  window.closeCookies = hideCookie;

  // Scroll to top with progress ring
  const top = document.getElementById('scroll-top');
  const ring = document.getElementById('scroll-progress-circle');
  lenis.on('scroll', ({ scroll, progress }) => {
    top.classList.toggle('visible', scroll > 500);
    ring.style.strokeDashoffset = 175.9 * (1 - progress);
  });
  top.addEventListener('click', () => lenis.scrollTo(0));
});
