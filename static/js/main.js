// ============================================
// 8BIT LAB - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER - FADE IN
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .portfolio-item, .team-card, .contact-link'
    );

    elementsToAnimate.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Simulate form submission
            console.log('Form submitted:', formData);
            
            // Show success message
            alert('✓ MENSAGEM ENVIADA COM SUCESSO!\n\nEntraremos em contato em breve. 🚀');
            
            // Reset form
            contactForm.reset();
            
            // In production, replace with actual API call:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                alert('Mensagem enviada com sucesso!');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            });
            */
        });
    }

    // ============================================
    // PORTFOLIO ITEM CLICK
    // ============================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.portfolio-title').textContent;
            console.log('Portfolio item clicked:', title);
            
            // In production, open modal or navigate to project page
            alert(`🎨 PROJETO: ${title}\n\nModal ou página de detalhes seria aberta aqui.`);
        });
    });

    // ============================================
    // GLITCH EFFECT ON LOGO
    // ============================================
    const logoElements = document.querySelectorAll('.logo-glitch');
    
    logoElements.forEach(logo => {
        setInterval(() => {
            if (Math.random() > 0.95) {
                logo.style.animation = 'glitch 0.5s';
                setTimeout(() => {
                    logo.style.animation = '';
                }, 300);
            }
        }, 3000);
    });

    // ============================================
    // CONSOLE EASTER EGG
    // ============================================
    console.log('%c8BIT LAB', 'font-size: 48px; color: #ea532e; font-weight: bold; text-shadow: 2px 2px #0096FF;');
    console.log('%cOlá, Developer! 👋', 'font-size: 16px; color: #0096FF;');
    console.log('%cGostou do código? Vamos trabalhar juntos!', 'font-size: 14px; color: #D0D0D0;');
    console.log('%ccontato@8bitlab.com', 'font-size: 12px; color: #ea532e; text-decoration: underline;');

    // ============================================
    // INIT MESSAGE
    // ============================================
    console.log('8Bit Lab initialized successfully ✓');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}