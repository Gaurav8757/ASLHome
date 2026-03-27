// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Destinations Carousel
    initDestinationsCarousel();

    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize smooth scroll behavior
    initSmoothScroll();

    // Initialize scroll animations
    initScrollAnimations();


    // Initialize navbar active state
    initNavbarActiveState();

    // Initialize adaptive navbar (transparent ↔ white)
    initAdaptiveNavbar();

    // Initialize Testimonials Auto Slider (marquee style)
    initTestimonialSlider();

    // Initialize Water Drop Ripple on Testimonial Cards
    initWaterDropRipple();

    // Initialize Water Drop Ripple on Stat Cards
    initStatCardRipple();
});

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Navbar height

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== DESTINATIONS CAROUSEL ==================== 
function initDestinationsCarousel() {
    let slide = document.querySelector(".slide");

    function moveNext() {
        let items = document.querySelectorAll(".item");
        slide.appendChild(items[0]);
    }

    // Click any item to go to next
    slide.addEventListener("click", function () {
        moveNext();
        resetTimer();
    });

    // Auto slide feature
    let slideTimer = setInterval(moveNext, 4000);

    function resetTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(moveNext, 4000);
    }

    // Pause on hover
    const container = document.querySelector('.container-slider');
    container.addEventListener('mouseenter', () => clearInterval(slideTimer));
    container.addEventListener('mouseleave', () => resetTimer());
}

// ==================== SCROLL ANIMATIONS ==================== 
function initScrollAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const animateElements = document.querySelectorAll('.service-card, .pricing-card, .ranking-card, .stat-card');

        animateElements.forEach((el, index) => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Add a subtle parallax/speed effect to the new carousel section using GSAP scrubber
        const carouselSection = document.querySelector('.destinations-carousel-section');
        if (carouselSection) {
            gsap.to(carouselSection, {
                backgroundPosition: "50% 100%",
                ease: "none",
                scrollTrigger: {
                    trigger: carouselSection,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            });
        }
    } else {
        // Fallback
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        const animateElements = document.querySelectorAll(
            '.service-card, .pricing-card, .ranking-card, .stat-card'
        );

        animateElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// ==================== ADAPTIVE NAVBAR ==================== 
function initAdaptiveNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const heroSection = document.getElementById('home');

    function updateNavbar() {
        const scrollY = window.scrollY;
        // Switch state when scrolled past 80% of hero height (or 100px if no hero)
        const threshold = heroSection ? heroSection.offsetHeight * 0.75 : 100;

        if (scrollY > threshold) {
            navbar.classList.add('navbar-scrolled');
            navbar.classList.remove('navbar-transparent');
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.classList.add('navbar-transparent');
        }
    }

    // Run immediately
    updateNavbar();
    // Update on scroll (passive for performance)
    window.addEventListener('scroll', updateNavbar, { passive: true });
    // Update on resize (threshold may change)
    window.addEventListener('resize', updateNavbar, { passive: true });
}
function initTestimonialSlider() {
    const carousel = document.querySelector('.testimonials-section .carousel');
    if (!carousel) return;

    let isPaused = false;
    let animFrame;
    const speed = 0.8; // pixels per frame

    function autoScroll() {
        if (!isPaused) {
            carousel.scrollLeft += speed;
            // When scrolled to end, smoothly jump back to start
            if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 2) {
                carousel.scrollLeft = 0;
            }
        }
        animFrame = requestAnimationFrame(autoScroll);
    }

    animFrame = requestAnimationFrame(autoScroll);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => { isPaused = true; });
    carousel.addEventListener('mouseleave', () => { isPaused = false; });
    // Also pause on touch
    carousel.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    carousel.addEventListener('touchend', () => {
        setTimeout(() => { isPaused = false; }, 2000);
    }, { passive: true });
}

// ==================== WATER DROP RIPPLE EFFECT ==================== 
function initWaterDropRipple() {
    const cards = document.querySelectorAll('.testimonials-section .card');
    cards.forEach(card => {
        card.addEventListener('mousedown', function (e) {
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            card.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// ==================== STAT CARD WATER DROP RIPPLE ==================== 
function initStatCardRipple() {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mousedown', function (e) {
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            card.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
}

// ==================== NAVBAR ACTIVE STATE ==================== 
function initNavbarActiveState() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== COUNTER ANIMATION ==================== 
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };

        updateCounter();
    });
}

// ==================== SCROLL TO TOP BUTTON ==================== 
const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== FORM HANDLING ==================== 
// If you add a contact form, add submission handling here

// ==================== BOOTSTRAP TOOLTIP & POPOVER ==================== 
// Initialize Bootstrap tooltips if needed
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// ==================== NAVBAR COLLAPSE ON LINK CLICK ==================== 
document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        const navbar = document.querySelector('.navbar-collapse');
        if (navbar.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});

// ==================== LAZY LOAD IMAGES (Optional) ==================== 
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
