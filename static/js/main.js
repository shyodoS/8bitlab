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
        this.speed = 30;
        this.lineDelay = 400;
        this.isTyping = false;
        
        this.init();
    }
    
    extractLines() {
        // Busca dentro de .terminal-text se existir, senão busca direto
        const container = this.terminal.querySelector('.terminal-text') || this.terminal;
        const codeLines = container.querySelectorAll('.code-line');
        const lines = [];
        
        codeLines.forEach(line => {
            // Salva o HTML completo da linha (com tags)
            const fullHTML = line.innerHTML;
            
            // Extrai apenas o texto para digitar (sem as tags)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = fullHTML;
            const textOnly = tempDiv.textContent || tempDiv.innerText;
            
            lines.push({
                element: line,
                html: fullHTML,
                text: textOnly,
                hasPrompt: fullHTML.includes('class="prompt"')
            });
            
            // Limpa a linha (mantém o prompt se existir)
            if (lines[lines.length - 1].hasPrompt) {
                line.innerHTML = '<span class="prompt">></span> ';
            } else {
                line.innerHTML = '';
            }
        });
        
        console.log('Linhas extraídas para typewriter:', lines.length);
        return lines;
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isTyping) {
                    this.isTyping = true;
                    setTimeout(() => this.startTyping(), 300);
                }
            });
        }, { threshold: 0.3 });
        
        this.observer.observe(this.terminal);
    }
    
    startTyping() {
        this.typeLine(0);
    }
    
    typeLine(lineIndex) {
        if (lineIndex >= this.lines.length) {
            this.addBlinkingCursor();
            return;
        }
        
        this.currentLine = lineIndex;
        this.currentChar = 0;
        
        const lineData = this.lines[lineIndex];
        this.typeNextChar(lineData, lineIndex);
    }
    
    typeNextChar(lineData, lineIndex) {
        const { element, html, text, hasPrompt } = lineData;
        
        if (this.currentChar < text.length) {
            // Reconstrói o HTML até o caractere atual
            const currentText = text.substring(0, this.currentChar + 1);
            
            // Se tem prompt, mantém ele
            if (hasPrompt) {
                element.innerHTML = '<span class="prompt">></span> ' + this.applyHTMLFormatting(html, currentText);
            } else {
                element.innerHTML = this.applyHTMLFormatting(html, currentText);
            }
            
            this.currentChar++;
            
            setTimeout(() => {
                this.typeNextChar(lineData, lineIndex);
            }, this.getRandomSpeed());
            
        } else {
            // Restaura o HTML completo no final
            element.innerHTML = html;
            
            setTimeout(() => {
                this.typeLine(lineIndex + 1);
            }, this.lineDelay);
        }
    }
    
    applyHTMLFormatting(originalHTML, currentText) {
        // Cria um elemento temporário com o HTML original
        const temp = document.createElement('div');
        temp.innerHTML = originalHTML;
        
        // Remove o prompt se existir
        const prompt = temp.querySelector('.prompt');
        if (prompt) prompt.remove();
        
        // Pega todo o conteúdo
        let content = temp.innerHTML;
        
        // Extrai o texto puro
        temp.innerHTML = content;
        const fullText = temp.textContent || temp.innerText;
        
        // Se o texto atual é menor que o total, trunca mantendo as tags
        if (currentText.length < fullText.length) {
            const ratio = currentText.length / fullText.length;
            return this.truncateHTML(content, currentText);
        }
        
        return content;
    }
    
    truncateHTML(html, targetText) {
        // Método simples: reconstrói o HTML caractere por caractere
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        let result = '';
        let charCount = 0;
        
        const traverse = (node) => {
            if (charCount >= targetText.length) return;
            
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                const remaining = targetText.length - charCount;
                const slice = text.substring(0, remaining);
                result += slice;
                charCount += slice.length;
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (charCount >= targetText.length) return;
                
                const tagName = node.tagName.toLowerCase();
                const attrs = Array.from(node.attributes)
                    .map(attr => `${attr.name}="${attr.value}"`)
                    .join(' ');
                
                result += `<${tagName}${attrs ? ' ' + attrs : ''}>`;
                
                for (let child of node.childNodes) {
                    traverse(child);
                    if (charCount >= targetText.length) break;
                }
                
                result += `</${tagName}>`;
            }
        };
        
        for (let child of temp.childNodes) {
            traverse(child);
            if (charCount >= targetText.length) break;
        }
        
        return result;
    }
    
    getRandomSpeed() {
        return this.speed + Math.random() * 20 - 10;
    }
    
    addBlinkingCursor() {
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '▋';
        cursor.style.marginLeft = '4px';
        
        const lastLine = this.lines[this.lines.length - 1];
        if (lastLine && lastLine.element) {
            lastLine.element.appendChild(cursor);
        }
        
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 530);
    }
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function initTerminalTypewriter() {
    const terminal = document.querySelector('.terminal-content');
    if (terminal) {
        console.log('Terminal encontrado, iniciando typewriter...');
        new TerminalTypewriter(terminal);
    } else {
        console.warn('Terminal não encontrado!');
    }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminalTypewriter);
} else {
    initTerminalTypewriter();
}

class ForceScrollSnap {
  constructor(options = {}) {
    this.snapDelay = options.snapDelay ?? 100;
    this.duration = options.duration ?? 600;
    this.easing = options.easing ?? this.easeInOutCubic;

    this.navbar = document.querySelector('.navbar');
    this.navbarHeight = this.navbar ? this.navbar.offsetHeight : 0;
    
    // CONFIGURAÇÕES POR SEÇÃO - AGORA FUNCIONAL
    this.sectionConfigs = options.sectionConfigs ?? {
      'hero': { threshold: 150, offset: 0 },
      'sobre': { threshold: 200, offset: 20 },
      'servicos': { threshold: 200, offset: 20 },
      'packs': { threshold: 100, offset: -100 },
      'projetos': { threshold: 200, offset: 20 },
      'contato': { threshold: 150, offset: 0 }
    };
    
    this.sections = [];
    this.isAnimating = false;
    this.scrollTimer = null;
    this.lastTouchTime = 0;

    this.init();
  }

  init() {
    this.collectSections();
    this.bindEvents();
    window.addEventListener('resize', () => this.collectSections());
  }

  collectSections() {
    this.sections = Object.keys(this.sectionConfigs)
      .map(id => {
        const el = document.getElementById(id);
        if (!el) {
          console.warn(`Seção não encontrada: ${id}`);
          return null;
        }
        
        const config = this.sectionConfigs[id];
        const top = el.getBoundingClientRect().top + window.pageYOffset - this.navbarHeight + (config.offset || 0);
        
        return { 
          id, 
          el, 
          top,
          threshold: config.threshold || 150, // USA THRESHOLD INDIVIDUAL
          offset: config.offset || 0
        };
      })
      .filter(Boolean)
      .sort((a,b) => a.top - b.top);
      
    console.log('Seções carregadas:', this.sections);
  }

  bindEvents() {
    window.addEventListener('wheel', () => this.onUserScroll(), { passive: true });
    window.addEventListener('touchstart', () => this.onTouchStart(), { passive: true });
    window.addEventListener('touchend', () => this.onTouchEnd(), { passive: true });
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  }

  onTouchStart() {
    this.lastTouchTime = Date.now();
  }

  onTouchEnd() {
    setTimeout(() => this.scheduleSnap(), 120);
  }

  onUserScroll() {
    if (this.isAnimating) this.cancelAnimation();
    this.scheduleSnap();
  }

  onScroll() {
    this.scheduleSnap();
  }

  scheduleSnap() {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if (this.isAnimating) return;
      if (Date.now() - this.lastTouchTime < 200) return;
      this.snapToClosest();
    }, this.snapDelay);
  }

  snapToClosest() {
    const current = window.scrollY || window.pageYOffset;
    let closest = null;
    let minDist = Infinity;

    for (const s of this.sections) {
      const dist = Math.abs(current - s.top);
      if (dist < minDist) {
        minDist = dist;
        closest = s;
      }
    }

    if (!closest) return;

    // USA O THRESHOLD ESPECÍFICO DA SEÇÃO ENCONTRADA
    if (minDist <= closest.threshold) {
      console.log(`Snapping para ${closest.id} (threshold: ${closest.threshold}px)`);
      this.animateScrollTo(closest.top, this.duration, this.easing);
    }
  }

  // ... (mantenha os métodos animateScrollTo, easeInOutCubic, etc iguais)
  animateScrollTo(targetY, duration = 600, easingFn = this.easeInOutCubic) {
    this.isAnimating = true;
    const startY = window.pageYOffset;
    const diff = targetY - startY;
    const startTime = performance.now();
    let rafId = null;

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = easingFn(t);
      window.scrollTo(0, Math.round(startY + diff * eased));

      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        this.isAnimating = false;
        window.scrollTo(0, targetY);
      }
    };

    rafId = requestAnimationFrame(step);

    this.cancelAnimation = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      this.isAnimating = false;
    };
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  snapTo(id) {
    const s = this.sections.find(x => x.id === id);
    if (!s) return;
    this.animateScrollTo(s.top, this.duration, this.easing);
  }
}

// INICIALIZAÇÃO CORRETA
document.addEventListener('DOMContentLoaded', () => {
  const snap = new ForceScrollSnap({
    snapDelay: 100,
    duration: 400,
    sectionConfigs: {
      'hero': { threshold: 150, offset: 0 },
      'sobre': { threshold: 200, offset: 270 },
      'servicos': { threshold: 200, offset: 0 },
      'packs': { threshold: 100, offset: 100 }, 
      'projetos': { threshold: 200, offset: 100 },
      'contato': { threshold: 100, offset: 220}
    }
  });
});

// ============================================
// PORTFOLIO CAROUSEL - CARROSSEL INTERATIVO
// ============================================

class PortfolioCarousel {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 6000; // 6 segundos (mais tempo)
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isDragging = false;
        
        // Otimização: usar requestAnimationFrame
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        if (!this.track || this.slides.length === 0) {
            console.warn('Carrossel não encontrado ou sem slides');
            return;
        }
        
        this.bindEvents();
        this.updateCarousel();
        this.startAutoPlay();
        this.initHoverEffects();
        
        console.log('Portfolio Carousel inicializado ✓');
    }
    
    bindEvents() {
        // Botões de navegação
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/Swipe
        this.initTouchEvents();
        
        // Pausar autoplay no hover
        this.track.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.track.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    initTouchEvents() {
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.isDragging = true;
            this.stopAutoPlay();
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = this.touchStartX - currentX;
            const diffY = this.touchStartY - currentY;
            
            // Só considera swipe horizontal
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                e.preventDefault();
            }
        });
        
        this.track.addEventListener('touchend', (e) => {
            if (!this.isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = this.touchStartX - endX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            this.isDragging = false;
            this.startAutoPlay();
        }, { passive: true });
    }
    
    initHoverEffects() {
        this.slides.forEach((slide, index) => {
            const image = slide.querySelector('.slide-image');
            const infoPanel = slide.querySelector('.slide-info-panel');
            
            if (image && infoPanel) {
                slide.addEventListener('mouseenter', () => {
                    this.stopAutoPlay();
                });
                
                slide.addEventListener('mouseleave', () => {
                    this.startAutoPlay();
                });
            }
        });
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    previousSlide() {
        if (this.isAnimating) return;
        
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.currentSlide = index;
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        // Otimização: usar requestAnimationFrame
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.animationFrame = requestAnimationFrame(() => {
            // Atualiza posição do track
            const translateX = -this.currentSlide * 25; // 25% por slide
            this.track.style.transform = `translateX(${translateX}%)`;
            
            // Atualiza slides ativos
            this.slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === this.currentSlide);
            });
            
            // Atualiza indicadores
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
            
            // Reset da animação mais rápido
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    destroy() {
        this.stopAutoPlay();
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        // Remove event listeners se necessário
    }
}

// ============================================
// INICIALIZAÇÃO DO CARROSSEL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o carrossel
    const carousel = new PortfolioCarousel();
    
    // Adiciona ao window para acesso global se necessário
    window.portfolioCarousel = carousel;
    
    console.log('Portfolio Carousel carregado ✓');
});