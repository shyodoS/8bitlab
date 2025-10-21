// ============================================
// 8BIT LAB - CUSTOM CURSOR
// ============================================

(function() {
    // Check if device supports hover (not mobile)
    if (!window.matchMedia('(hover: hover)').matches) {
        return;
    }

    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

    if (!cursor || !cursorTrail) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let trailX = 0;
    let trailY = 0;

    // Track mouse position
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with smooth following
    function animateCursor() {
        // Main cursor (faster)
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        // Trail (slower)
        const tdx = mouseX - trailX;
        const tdy = mouseY - trailY;
        
        trailX += tdx * 0.15;
        trailY += tdy * 0.15;
        
        cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll(
        'a, button, .portfolio-item, .service-card, .team-card, input, textarea'
    );

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1.5)`;
            cursor.style.backgroundColor = 'rgba(234, 83, 46, 0.2)';
            cursor.style.borderColor = '#0096FF';
        });

        el.addEventListener('mouseleave', function() {
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = '#ea532e';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function() {
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function() {
        cursor.style.opacity = '1';
        cursorTrail.style.opacity = '1';
    });

    // Click effect
    document.addEventListener('mousedown', function() {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(0.8)`;
    });

    document.addEventListener('mouseup', function() {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) scale(1)`;
    });
})();