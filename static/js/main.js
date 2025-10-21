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

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Fecha menu ao clicar em link
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
    if (navbar) {
        window.addEventListener('scroll', throttle(() => {
            const currentScroll = window.scrollY || window.pageYOffset;
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 100));
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !document.querySelector(href)) return;
            e.preventDefault();
            const target = document.querySelector(href);
            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // ============================================
    // INTERSECTION OBSERVER - FADE IN
    // ============================================
    const elementsToAnimate = document.querySelectorAll(
        '.service-card, .portfolio-item, .team-card, .contact-link'
    );

    if (elementsToAnimate.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

        elementsToAnimate.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            if (!name || !email || !message) return;

            const formData = {
                name: name.value.trim(),
                email: email.value.trim(),
                message: message.value.trim()
            };

            console.log('Form submitted:', formData);
            alert('✓ MENSAGEM ENVIADA COM SUCESSO!\n\nEntraremos em contato em breve. 🚀');
            contactForm.reset();
        });
    }

    // ============================================
    // PORTFOLIO ITEM CLICK
    // ============================================
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const titleEl = this.querySelector('.portfolio-title');
            const title = titleEl ? titleEl.textContent.trim() : 'Projeto';
            console.log('Portfolio item clicked:', title);
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
    // INIT SERVICE ARROWS + INTERACTIONS
    // ============================================
    initServiceArrows();
    initServiceInteractions();

    // ============================================
    // INIT MESSAGE
    // ============================================
    console.log('8Bit Lab initialized successfully ✓');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle = false;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ============================================
// SERVICES ANIMATED ARROWS - Canvas Version
// ============================================

class ServiceArrow {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.direction = canvas.dataset.direction || 'left-to-right';
        this.isVisible = false;
        this.animationProgress = 1;
        this.dotProgress = 0;
        this.reachedEnd = false;
        this.explosionParticles = [];
        this.setup();
    }

    setup() {
        this.resize();
        this.animate();
        this.checkVisibility();
        window.addEventListener('scroll', () => this.checkVisibility());
        window.addEventListener('resize', debounce(() => this.resize(), 300));
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.width = rect.width;
        this.height = rect.height;
    }

    checkVisibility() {
        const rect = this.canvas.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        this.isVisible = isInView;
    }

drawCurve() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.beginPath();

    let curve;

    if (this.direction === 'left-to-right') {
        // Curva original (boa)
        curve = {
            startX: 0,
            startY: h * 0.3,
            cp1X: w * 0.35,
            cp1Y: h * 0.3,
            cp2X: w * 0.7,
            cp2Y: h * 0.55,
            endX: w * 0.7,
            endY: h * 0.8
        };
    } else {
        // ✅ Curva invertida simétrica (corrigida)
        curve = {
            startX: w,
            startY: h * 0.3,
            cp1X: w * 0.65,
            cp1Y: h * 0.3,
            cp2X: w * 0.3,
            cp2Y: h * 0.55,
            endX: w * 0.3,
            endY: h * 0.8
        };
    }

    // Desenho visual da linha pontilhada
    ctx.moveTo(curve.startX, curve.startY);
    ctx.bezierCurveTo(curve.cp1X, curve.cp1Y, curve.cp2X, curve.cp2Y, curve.endX, curve.endY);

    const dashLength = 6;
    const gapLength = 3;
    const offset = (this.dotProgress * 15) % (dashLength + gapLength);
    ctx.setLineDash([dashLength, gapLength]);
    ctx.lineDashOffset = -offset;

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, 'rgba(234, 83, 46, 0.8)');
    gradient.addColorStop(0.5, '#EA532E');
    gradient.addColorStop(0.6, '#0EA5E9');
    gradient.addColorStop(1, 'rgba(14, 165, 233, 0.8)');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(234, 83, 46, 0.4)';
    ctx.stroke();
    ctx.setLineDash([]);

    return curve;
}


    drawDot(curveData) {
        const ctx = this.ctx;
        const { startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY } = curveData;
        this.dotProgress += 0.01;
        if (this.dotProgress > 1.2) this.dotProgress = 0;

        const t = this.dotProgress % 1;
        const x = Math.pow(1 - t, 3) * startX +
                  3 * Math.pow(1 - t, 2) * t * cp1X +
                  3 * (1 - t) * Math.pow(t, 2) * cp2X +
                  Math.pow(t, 3) * endX;
        const y = Math.pow(1 - t, 3) * startY +
                  3 * Math.pow(1 - t, 2) * t * cp1Y +
                  3 * (1 - t) * Math.pow(t, 2) * cp2Y +
                  Math.pow(t, 3) * endY;

        const dotColor = t < 0.5 ? '#EA532E' : '#0EA5E9';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = dotColor;
        ctx.fill();
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        if (this.isVisible) {
            const curve = this.drawCurve();
            this.drawDot(curve);
        }
        requestAnimationFrame(() => this.animate());
    }
}

function initServiceArrows() {
    document.querySelectorAll('.arrow-canvas').forEach(canvas => {
        new ServiceArrow(canvas);
    });
}

function initServiceInteractions() {
    const serviceNodes = document.querySelectorAll('.service-node');
    serviceNodes.forEach(node => {
        const icon = node.querySelector('.service-icon-circle');
        const title = node.querySelector('.service-title');
        if (!icon || !title) return;

        node.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) rotate(8deg)';
            title.style.color = '#EA532E';
        });
        node.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
            title.style.color = '#FFFFFF';
        });
    });
}

// Add pulse animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulseIcon {
        0% { transform: scale(1); }
        50% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); }
    }
`;
document.head.appendChild(style);



// ============================================
// TERMINAL TYPEWRITER EFFECT
// ============================================

class TerminalTypewriter {
    constructor(terminalElement) {
        this.terminal = terminalElement;
        this.lines = this.extractLines();
        this.currentLine = 0;
        this.currentChar = 0;
        this.speed = 30; // Velocidade da digitação (ms)
        this.lineDelay = 800; // Delay entre linhas (ms)
        this.isTyping = false;
        
        this.init();
    }
    
    extractLines() {
        // Extrai o texto das linhas do terminal
        const codeLines = this.terminal.querySelectorAll('.code-line');
        const lines = [];
        
        codeLines.forEach(line => {
            // Remove o prompt e mantém só o texto
            const text = line.textContent.replace('>', '').trim();
            lines.push(text);
            
            // Limpa o conteúdo original
            line.textContent = '> ';
        });
        
        return lines;
    }
    
    init() {
        // Inicia o efeito quando o terminal estiver visível
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isTyping) {
                    this.isTyping = true;
                    this.startTyping();
                }
            });
        }, { threshold: 0.5 });
        
        this.observer.observe(this.terminal);
    }
    
    startTyping() {
        this.typeLine(0);
    }
    
    typeLine(lineIndex) {
        if (lineIndex >= this.lines.length) {
            // Efeito final - cursor piscando
            this.addBlinkingCursor();
            return;
        }
        
        this.currentLine = lineIndex;
        this.currentChar = 0;
        
        const lineElement = this.terminal.querySelectorAll('.code-line')[lineIndex];
        
        this.typeNextChar(lineElement, lineIndex);
    }
    
    typeNextChar(lineElement, lineIndex) {
        if (this.currentChar < this.lines[lineIndex].length) {
            // Adiciona próximo caractere
            const char = this.lines[lineIndex][this.currentChar];
            lineElement.textContent += char;
            this.currentChar++;
            
            // Efeito sonoro opcional (pode remover se não quiser)
            this.playTypeSound();
            
            // Continua digitando
            setTimeout(() => {
                this.typeNextChar(lineElement, lineIndex);
            }, this.getRandomSpeed());
            
        } else {
            // Próxima linha
            setTimeout(() => {
                this.typeLine(lineIndex + 1);
            }, this.lineDelay);
        }
    }
    
    getRandomSpeed() {
        // Variação de velocidade para parecer mais natural
        return this.speed + Math.random() * 20 - 10;
    }
    
    playTypeSound() {
        // Efeito sonoro sutil (opcional)
        if (Math.random() > 0.7) { // Apenas alguns caracteres fazem som
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800 + Math.random() * 400;
            oscillator.type = 'sine';
            
            gainNode.gain.value = 0.02; // Volume bem baixo
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
    
    addBlinkingCursor() {
        // Adiciona cursor piscando no final
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '▋';
        
        const lastLine = this.terminal.querySelector('.code-line:last-child');
        if (lastLine) {
            lastLine.appendChild(cursor);
        }
        
        // Animação do cursor
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
    
    // Método para reiniciar a animação
    restart() {
        this.currentLine = 0;
        this.currentChar = 0;
        this.isTyping = false;
        
        // Limpa o conteúdo
        const codeLines = this.terminal.querySelectorAll('.code-line');
        codeLines.forEach(line => {
            line.textContent = '> ';
        });
        
        // Remove cursor
        const cursor = this.terminal.querySelector('.terminal-cursor');
        if (cursor) cursor.remove();
        
        // Reinicia
        this.init();
    }
}

// ============================================
// INICIALIZAÇÃO DO TERMINAL
// ============================================

function initTerminalTypewriter() {
    const terminal = document.querySelector('.terminal-content');
    if (terminal) {
        new TerminalTypewriter(terminal);
    }
}

// Adicione isso ao seu DOMContentLoaded principal
document.addEventListener('DOMContentLoaded', function() {
    // ... seu código existente ...
    
    initTerminalTypewriter();
    
    // ... resto do código ...
});