// ============================================
// PORTFOLIO PAGE - FILTROS E INTERAÇÕES (OTIMIZADA)
// ============================================

// Otimização: usar requestAnimationFrame para animações
let animationFrameId;

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // PORTFOLIO FILTER FUNCTIONALITY
    // ============================================
    
    const filterTabs = document.querySelectorAll('.filter-tab');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    if (filterTabs.length > 0 && portfolioCards.length > 0) {
        
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Atualiza tab ativo
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filtra cards
                filterPortfolioCards(filter);
            });
        });
        
        function filterPortfolioCards(filter) {
            portfolioCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('show');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('show');
                }
            });
        }
    }
    
    // ============================================
    // PORTFOLIO CARD INTERACTIONS
    // ============================================
    
    portfolioCards.forEach(card => {
        const cardImage = card.querySelector('.card-image img');
        const cardOverlay = card.querySelector('.card-overlay');
        
        // Hover effects otimizados
        card.addEventListener('mouseenter', function() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(() => {
                if (cardImage) {
                    cardImage.style.transform = 'scale(1.05)';
                }
                if (cardOverlay) {
                    cardOverlay.style.opacity = '1';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animationFrameId = requestAnimationFrame(() => {
                if (cardImage) {
                    cardImage.style.transform = 'scale(1)';
                }
                if (cardOverlay) {
                    cardOverlay.style.opacity = '0';
                }
            });
        });
        
        // Click para ver detalhes (placeholder)
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('.project-title');
            const title = projectTitle ? projectTitle.textContent.trim() : 'Projeto';
            
            console.log('Projeto clicado:', title);
            alert(`🎨 PROJETO: ${title}\n\nDetalhes do projeto seriam exibidos aqui.`);
        });
    });
    
    // ============================================
    // SCROLL ANIMATIONS (SIMPLIFICADO)
    // ============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll(
        '.portfolio-card, .stat-item, .filter-tabs, .hero-content'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            const suffix = stat.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });
    };
    
    // Anima stats quando visível
    const statsSection = document.querySelector('.portfolio-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    console.log('Portfolio Page inicializada ✓');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce para otimizar performance
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

// Throttle para scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}