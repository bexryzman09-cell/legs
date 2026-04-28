/* ═══════════════════════════════════════
   MAIN.JS — LuxNails
   Full animations + mobile support
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    const isMobile = () => window.innerWidth <= 900;
    const isTouchDevice = () => ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    /* ══════════════════════════════
       LOADER
    ══════════════════════════════ */
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => loader.classList.add('hidden'), 1000);
        });
        // Fallback
        setTimeout(() => loader.classList.add('hidden'), 3500);
    }

    /* ══════════════════════════════
       CUSTOM CURSOR (desktop only)
    ══════════════════════════════ */
    const cursor = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursor-ring');

    if (cursor && cursorRing && !isTouchDevice()) {
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });

        (function animateRing() {
            rx += (mx - rx) * 0.11;
            ry += (my - ry) * 0.11;
            cursorRing.style.left = rx + 'px';
            cursorRing.style.top = ry + 'px';
            requestAnimationFrame(animateRing);
        })();

        document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
        document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

        document.querySelectorAll('a, button, .card, .service-card, .faq-question, input, select, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorRing.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorRing.style.opacity = '1'; });
    }

    /* ══════════════════════════════
       PAGE TRANSITIONS
    ══════════════════════════════ */
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-transition';
    document.body.appendChild(overlay);

    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;

        link.addEventListener('click', e => {
            e.preventDefault();
            overlay.classList.add('active');
            setTimeout(() => { window.location.href = href; }, 480);
        });
    });

    // Slide out on arrival
    overlay.style.transform = 'translateY(0)';
    overlay.style.transition = 'none';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.style.transition = 'transform 0.5s cubic-bezier(0.77,0,0.175,1)';
            overlay.style.transform = 'translateY(-100%)';
        });
    });

    /* ══════════════════════════════
       NAVBAR SCROLL
    ══════════════════════════════ */
    const nav = document.querySelector('nav');
    if (nav) {
        const handleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    /* ══════════════════════════════
       ACTIVE NAV LINK
    ══════════════════════════════ */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });

    /* ══════════════════════════════
       MOBILE MENU (BURGER)
    ══════════════════════════════ */
    const burger = document.querySelector('.nav-burger');
    let mobileMenu = document.querySelector('.mobile-menu');

    // Build mobile menu if not in HTML
    if (!mobileMenu && burger) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
      <ul class="mobile-menu-links">
        <li><a href="index.html">Главная</a></li>
        <li><a href="about.html">О мастере</a></li>
        <li><a href="services.html">Услуги</a></li>
        <li><a href="booking.html">Запись</a></li>
      </ul>
      <a href="booking.html" class="mobile-menu-book">Записаться</a>
      <p class="mobile-menu-tagline">LuxNails · Ташкент · 2025</p>
    `;
        document.body.appendChild(mobileMenu);
    }

    if (burger && mobileMenu) {
        let menuOpen = false;

        function openMenu() {
            menuOpen = true;
            burger.classList.add('open');
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
            // Change burger color to white when menu open
            burger.querySelectorAll('span').forEach(s => s.style.background = '#fff');
        }

        function closeMenu() {
            menuOpen = false;
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
            burger.querySelectorAll('span').forEach(s => s.style.background = '');
        }

        burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

        // Close on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => closeMenu());
        });

        // Close on Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && menuOpen) closeMenu();
        });
    }

    /* ══════════════════════════════
       SCROLL REVEAL (all variants)
    ══════════════════════════════ */
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stat-block, .section-line';
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll(revealSelectors).forEach(el => revealObs.observe(el));

    /* ══════════════════════════════
       FAQ ACCORDION
    ══════════════════════════════ */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });

    /* ══════════════════════════════
       PROGRESS BARS
    ══════════════════════════════ */
    const progressObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.progress-fill').forEach(fill => {
                    setTimeout(() => { fill.style.width = fill.getAttribute('data-width'); }, 100);
                });
                progressObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.progress-section').forEach(el => progressObs.observe(el));

    /* ══════════════════════════════
       COUNTER ANIMATION
    ══════════════════════════════ */
    function animateCounter(el, target, dur = 2000) {
        let start = null;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.floor(ease * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
    }

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const t = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, t);
                counterObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObs.observe(el));

    /* ══════════════════════════════
       SMOOTH ANCHOR SCROLL
    ══════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    /* ══════════════════════════════
       FLOATING PARTICLES (hero)
    ══════════════════════════════ */
    const hero = document.querySelector('.hero');
    if (hero) {
        const count = isMobile() ? 5 : 10;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const size = Math.random() * 5 + 2;
            p.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        background:rgba(201,169,110,${Math.random() * 0.4 + 0.1});
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        pointer-events:none;
        animation: floatP ${Math.random() * 7 + 6}s ease-in-out infinite;
        animation-delay:${Math.random() * 5}s;
        z-index:1;
      `;
            hero.appendChild(p);
        }
        // Inject keyframe
        if (!document.getElementById('floatPStyle')) {
            const s = document.createElement('style');
            s.id = 'floatPStyle';
            s.textContent = `@keyframes floatP {
        0%,100%{transform:translateY(0) scale(1);opacity:0.5}
        33%{transform:translateY(-32px) scale(1.25);opacity:1}
        66%{transform:translateY(16px) scale(0.75);opacity:0.28}
      }`;
            document.head.appendChild(s);
        }
    }

    /* ══════════════════════════════
       PARALLAX (desktop only)
    ══════════════════════════════ */
    if (!isMobile() && !isTouchDevice()) {
        const ornament = document.querySelector('.hero-ornament');
        const heroBgBefore = document.querySelector('.hero-bg');

        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (ornament) {
                ornament.style.transform = `translateY(calc(-50% + ${sy * 0.18}px))`;
            }
        }, { passive: true });

        // Mouse parallax on hero
        if (hero) {
            hero.addEventListener('mousemove', e => {
                const { left, top, width, height } = hero.getBoundingClientRect();
                const dx = (e.clientX - left - width / 2) / width;
                const dy = (e.clientY - top - height / 2) / height;
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
                }
                if (ornament) {
                    ornament.style.transform = `translateY(-50%) translate(${dx * -20}px, ${dy * -12}px)`;
                }
            });
            hero.addEventListener('mouseleave', () => {
                const heroContent = hero.querySelector('.hero-content');
                if (heroContent) heroContent.style.transform = '';
                if (ornament) ornament.style.transform = 'translateY(-50%)';
            });
        }
    }

    /* ══════════════════════════════
       BUTTON RIPPLE EFFECT
    ══════════════════════════════ */
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const r = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            r.className = 'ripple-effect';
            r.style.cssText = `
        position:absolute;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        border-radius:50%;
        background:rgba(255,255,255,0.28);
        transform:scale(0);
        animation:ripple 0.65s linear;
        pointer-events:none; z-index:2;
      `;
            btn.appendChild(r);
            setTimeout(() => r.remove(), 700);
        });
    });

    if (!document.getElementById('rippleStyle')) {
        const s = document.createElement('style');
        s.id = 'rippleStyle';
        s.textContent = '@keyframes ripple { to { transform:scale(4); opacity:0; } }';
        document.head.appendChild(s);
    }

    /* ══════════════════════════════
       MAGNETIC HOVER (desktop only)
    ══════════════════════════════ */
    if (!isTouchDevice()) {
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', e => {
                const rect = el.getBoundingClientRect();
                const dx = (e.clientX - rect.left - rect.width / 2) * 0.28;
                const dy = (e.clientY - rect.top - rect.height / 2) * 0.28;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
                el.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
                setTimeout(() => el.style.transition = '', 500);
            });
        });
    }

    /* ══════════════════════════════
       CARD TILT (desktop only)
    ══════════════════════════════ */
    if (!isTouchDevice()) {
        document.querySelectorAll('.service-card, .card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
                const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
                card.style.transform = `translateY(-8px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease, box-shadow 0.4s ease';
                setTimeout(() => card.style.transition = '', 500);
            });
        });
    }

    /* ══════════════════════════════
       SCROLL PROGRESS BAR
    ══════════════════════════════ */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9997;
    height: 2px; width: 0%; pointer-events: none;
    background: linear-gradient(90deg, var(--rose), var(--gold));
    transition: width 0.1s linear;
  `;
    document.body.appendChild(progressBar);
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        progressBar.style.width = (scrolled * 100) + '%';
    }, { passive: true });

    /* ══════════════════════════════
       TOUCH SWIPE on service grid
    ══════════════════════════════ */
    if (isTouchDevice()) {
        document.querySelectorAll('.grid-3').forEach(grid => {
            let startX = 0;
            grid.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
            grid.addEventListener('touchend', e => {
                const dx = e.changedTouches[0].clientX - startX;
                // Just for future carousel extension — currently grids stack on mobile
            }, { passive: true });
        });
    }

    /* ══════════════════════════════
       NUMBER TICKER (big stats)
    ══════════════════════════════ */
    const statObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.stat-block').forEach(el => statObs.observe(el));

    /* ══════════════════════════════
       STICKY SECTION LABELS
    ══════════════════════════════ */
    // On mobile, reduce reveal threshold
    if (isMobile()) {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            el.style.transitionDuration = '0.65s';
        });
    }

    /* ══════════════════════════════
       FORM: booking.html specific
    ══════════════════════════════ */
    // Input float label animation
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = input.value ? 'rgba(201,169,110,0.5)' : '';
        });
    });

    // Form validation highlight removal
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(el => {
        el.addEventListener('input', () => { el.style.borderColor = ''; });
        el.addEventListener('focus', () => { el.style.borderColor = ''; });
    });

    /* ══════════════════════════════
       STAGGERED CARD ENTRANCE
    ══════════════════════════════ */
    document.querySelectorAll('.grid-3 .card, .grid-3 .service-card').forEach((card, i) => {
        if (!card.classList.contains('reveal')) {
            card.classList.add('reveal');
            card.style.transitionDelay = `${i * 0.08}s`;
            revealObs.observe(card);
        }
    });

});

/* ══════════════════════════════
   RESIZE HANDLER
══════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 900) {
            const menu = document.querySelector('.mobile-menu');
            const burger = document.querySelector('.nav-burger');
            if (menu && menu.classList.contains('open')) {
                menu.classList.remove('open');
                burger?.classList.remove('open');
                document.body.style.overflow = '';
            }
        }
    }, 200);
}, { passive: true });          