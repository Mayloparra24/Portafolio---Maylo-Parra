// ========== CURSOR PERSONALIZADO ==========
const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = (mouseX - 10) + 'px';
    cursor.style.top = (mouseY - 10) + 'px';
});

const canvas = document.getElementById('canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    function resizeCanvas() {       canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ========== DESCARGAR CV ==========
function descargarCV(idioma) {
    const nombreArchivo = idioma === 'es' ? 'CV Español.pdf' : 'CV English.pdf';
    const rutaArchivo = `./CVs/${nombreArchivo}`;
    
    // Abrir en nueva pestaña para que el navegador lo maneje
    window.open(rutaArchivo, '_blank');
    
    console.log(`↓ Abriendo CV en ${idioma === 'es' ? 'español' : 'inglés'}...`);
}
document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        circle.style.transform = `translateY(${scrollY * (0.3 + index * 0.1)}px)`;
    });
});

const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

const stats = document.querySelectorAll('.stat h3');
let hasAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateNumbers();
        }
    });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.stats');
if (statsContainer) {
    statsObserver.observe(statsContainer);
}

function animateNumbers() {
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target')) || 
                      parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = Math.ceil(target / 50);
        
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            stat.textContent = current + (stat.textContent.includes('+') ? '+' : 
                                        stat.textContent.includes('%') ? '%' : '');
        }, 20);
    });
}
