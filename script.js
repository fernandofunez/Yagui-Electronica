document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. NAVBAR: scroll effect
       ========================================== */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });


    /* ==========================================
       2. MENÚ HAMBURGUESA + SIDEBAR + OVERLAY
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar    = document.getElementById('sidebar');
    const overlay    = document.getElementById('overlay');

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        sidebar.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
        sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });


    /* ==========================================
       3. SIDEBAR: acordeón de submenús
       ========================================== */
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');

    sidebarToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const dropdown = btn.nextElementSibling;
            const isOpen   = dropdown.classList.contains('open');

            document.querySelectorAll('.sidebar-dropdown.open').forEach(d => {
                d.classList.remove('open');
                d.previousElementSibling.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                dropdown.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* ==========================================
       4. SCROLL SUAVE + CIERRE SIDEBAR
       ========================================== */
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                closeSidebar();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar.offsetHeight + 12;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });


    /* ==========================================
       5. CARRUSEL HERO
       ========================================== */
    const slides      = document.querySelectorAll('.slide');
    const dots        = document.querySelectorAll('.dot');
    const btnPrev     = document.getElementById('slider-prev');
    const btnNext     = document.getElementById('slider-next');
    let currentSlide  = 0;
    let autoplayTimer = null;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    btnNext.addEventListener('click', () => { nextSlide(); startAutoplay(); });
    btnPrev.addEventListener('click', () => { prevSlide(); startAutoplay(); });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); startAutoplay(); });
    });

    const heroEl = document.getElementById('hero');
    heroEl.addEventListener('mouseenter', stopAutoplay);
    heroEl.addEventListener('mouseleave', startAutoplay);

    // Swipe en móvil
    let touchStartX = 0;
    heroEl.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    heroEl.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? nextSlide() : prevSlide();
            startAutoplay();
        }
    }, { passive: true });

    startAutoplay();


    /* ==========================================
       6. TABS DE PRODUCTOS
       ========================================== */
    const tabBtns     = document.querySelectorAll('.tab-btn');
    const tabSections = document.querySelectorAll('.tab-section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;

            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabSections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const section = document.getElementById(target);
            if (section) section.classList.add('active');
        });
    });


    /* ==========================================
       7. REVEAL AL HACER SCROLL
       ========================================== */
    const revealEls = document.querySelectorAll('.section-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ==========================================
       8. CARRITO: feedback visual
       ========================================== */
    document.querySelectorAll('.btn-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const original = this.textContent;
            this.textContent = '✔ Añadido';
            this.style.backgroundColor = '#28a745';
            this.disabled = true;

            setTimeout(() => {
                this.textContent = original;
                this.style.backgroundColor = '';
                this.disabled = false;
            }, 2000);
        });
    });


    /* ==========================================
       9. FORMULARIO: validación básica
       ========================================== */
    const form = document.querySelector('.contact-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre  = form.querySelector('#nombre').value.trim();
            const email   = form.querySelector('#email').value.trim();
            const mensaje = form.querySelector('#mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                alert('Por favor completá todos los campos.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor ingresá un email válido.');
                return;
            }

            const btn = form.querySelector('.btn-submit');
            const original = btn.textContent;
            btn.textContent = '✔ Mensaje enviado';
            btn.style.backgroundColor = '#28a745';
            btn.disabled = true;
            form.reset();

            setTimeout(() => {
                btn.textContent = original;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3500);
        });
    }


    /* ==========================================
       10. NAVBAR: link activo según sección visible
       ========================================== */
    const sections = document.querySelectorAll('section[id], main[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s));

});