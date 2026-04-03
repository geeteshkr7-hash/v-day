/* ═══════════════════════════════════════════
   COFFEE DATE — INTERACTIVE SCRIPT
   ═══════════════════════════════════════════ */

// ── PARTICLES ──────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        // warm golden/rose tones
        const colors = [
            [212, 165, 116],
            [201, 160, 160],
            [200, 168, 130],
            [245, 230, 211]
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        this.currentOpacity = this.opacity * (0.6 + Math.sin(this.pulse) * 0.4);

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.currentOpacity})`;
        ctx.fill();
    }
}

// Create particles
for (let i = 0; i < 60; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();


// ── SCENE MANAGEMENT ───────────────────────
let currentScene = 1;

function goToScene(num) {
    const current = document.getElementById(`scene-${currentScene}`);
    const next = document.getElementById(`scene-${num}`);

    current.classList.remove('active');

    setTimeout(() => {
        next.classList.add('active');
        currentScene = num;

        if (num === 2) startTypewriter();
        if (num === 4) launchCoffeeConfetti();

        // Re-trigger fade-up animations
        next.querySelectorAll('.fade-up').forEach((el, i) => {
            el.style.animation = 'none';
            el.offsetHeight; // reflow
            el.style.animation = '';
        });
    }, 600);
}


// ── TYPEWRITER ─────────────────────────────
const typewriterMessage = "Ri, don't be sad... You deserve all the warmth in the world. And I'm here to remind you — you're never alone. 💛";
let typewriterIndex = 0;
const typewriterEl = document.getElementById('typewriter');

function startTypewriter() {
    typewriterIndex = 0;
    typewriterEl.textContent = '';
    typeNextChar();
}

function typeNextChar() {
    if (typewriterIndex < typewriterMessage.length) {
        typewriterEl.textContent += typewriterMessage[typewriterIndex];
        typewriterIndex++;
        const delay = typewriterMessage[typewriterIndex - 1] === '.' ? 300 :
                      typewriterMessage[typewriterIndex - 1] === ',' ? 150 :
                      typewriterMessage[typewriterIndex - 1] === '—' ? 200 : 45;
        setTimeout(typeNextChar, delay);
    } else {
        // Hide cursor after done, show button
        setTimeout(() => {
            document.getElementById('cursor').style.display = 'none';
            const btn = document.getElementById('scene2-btn');
            btn.classList.remove('hidden');
            btn.classList.add('visible');
        }, 800);
    }
}


// ── COFFEE NO BUTTON ───────────────────────
let noCount = 0;
const noMessages = [
    "Ri plsss 🥺",
    "You can't say no to coffee...",
    "One tiny little coffee? ☕",
    "I'll get you your favorite 💛",
    "Okay now you're being mean 😢",
    "I WILL keep asking 😤",
    "The coffee is getting cold...",
    "Last chance, Ri! ☕💕"
];

function handleCoffeeNo() {
    noCount++;

    // Show tease message
    const toast = document.getElementById('no-toast');
    const msgIndex = Math.min(noCount - 1, noMessages.length - 1);
    toast.textContent = noMessages[msgIndex];
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);

    // Grow yes button, shrink no button
    const yesBtn = document.getElementById('yes-coffee');
    const noBtn = document.getElementById('no-coffee');

    const yesFontSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = `${yesFontSize * 1.2}px`;

    const yesPad = Math.min(14 + noCount * 4, 38);
    const yesPadX = Math.min(32 + noCount * 8, 80);
    yesBtn.style.padding = `${yesPad}px ${yesPadX}px`;

    if (noCount >= 2) {
        const noFontSize = parseFloat(window.getComputedStyle(noBtn).fontSize);
        noBtn.style.fontSize = `${Math.max(noFontSize * 0.8, 9)}px`;
    }

    // Make no button run away after 4 clicks
    if (noCount >= 4) {
        noBtn.addEventListener('mouseover', runCoffeeNoAway);
        noBtn.addEventListener('touchstart', runCoffeeNoAway, { passive: true });
    }
}

function runCoffeeNoAway() {
    const noBtn = document.getElementById('no-coffee');
    const margin = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - margin;
    const maxY = window.innerHeight - noBtn.offsetHeight - margin;
    const rx = Math.random() * maxX + margin / 2;
    const ry = Math.random() * maxY + margin / 2;
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${rx}px`;
    noBtn.style.top = `${ry}px`;
    noBtn.style.zIndex = '50';
}


// ── COFFEE YES ─────────────────────────────
function handleCoffeeYes() {
    goToScene(4);
}


// ── COFFEE CONFETTI ────────────────────────
function launchCoffeeConfetti() {
    const warmColors = ['#d4a574', '#c8a882', '#f5e6d3', '#c9a0a0', '#e8c4c4', '#fff8f0', '#a67c52'];
    const duration = 5000;
    const end = Date.now() + duration;

    // Big initial burst
    confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.5, y: 0.35 },
        colors: warmColors,
        shapes: ['circle', 'square']
    });

    // Continuous side cannons
    const interval = setInterval(() => {
        if (Date.now() > end) {
            clearInterval(interval);
            return;
        }

        confetti({
            particleCount: 30,
            angle: 60,
            spread: 50,
            origin: { x: 0, y: 0.6 },
            colors: warmColors
        });

        confetti({
            particleCount: 30,
            angle: 120,
            spread: 50,
            origin: { x: 1, y: 0.6 },
            colors: warmColors
        });
    }, 350);
}


// ── BACKGROUND MUSIC ──────────────────────
const music = document.getElementById('bg-music');
let musicPlaying = false;

// Browsers block autoplay unless muted; start muted then unmute on first click
music.volume = 0.3;
music.muted = true;
music.play().then(() => {
    music.muted = false;
    musicPlaying = true;
}).catch(() => {
    // Unmute & play on first user interaction
    document.addEventListener('click', function startMusic() {
        music.muted = false;
        music.play().then(() => { musicPlaying = true; }).catch(() => {});
        document.getElementById('music-toggle').textContent = '🔊';
        document.removeEventListener('click', startMusic);
    });
});

function toggleMusic() {
    if (musicPlaying) {
        music.pause();
        musicPlaying = false;
        document.getElementById('music-toggle').textContent = '🔇';
    } else {
        music.muted = false;
        music.play();
        musicPlaying = true;
        document.getElementById('music-toggle').textContent = '🔊';
    }
}
