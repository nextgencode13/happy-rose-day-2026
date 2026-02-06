import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- NAVBAR LOGIC ---
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navClose = document.getElementById('navClose');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Toggle Mobile Menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close Mobile Menu
    navClose.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });

    // Close Menu on Click
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            navToggle.classList.remove('active');
            navLinks.classList.remove('active');

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const modal = document.getElementById('roseModal');
    const canvas = document.getElementById('petalsCanvas');
    modal.style.display = 'none'; // Initial hide to prevent 'gray bar'
    const ctx = canvas.getContext('2d');
    let petals = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Petal {
        constructor(type = 'petal') {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 15 + 10;
            this.speed = Math.random() * 1 + 0.5;
            this.angle = Math.random() * 360;
            this.spin = Math.random() * 2 - 1;
            this.type = type;
            this.color = type === 'heart'
                ? `hsla(350, 100%, 60%, ${Math.random() * 0.5 + 0.5})`
                : `hsla(${Math.random() * 20 + 340}, 100%, 70%, ${Math.random() * 0.5 + 0.3})`;
        }

        update() {
            this.y += this.speed;
            this.x += Math.sin(this.y / 50) * 1;
            this.angle += this.spin;
            if (this.y > canvas.height) {
                // Remove if it's a one-time thing, otherwise recycle
                if (this.isSuper) {
                    petals.splice(petals.indexOf(this), 1);
                } else {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            if (this.type === 'heart') {
                const s = this.size / 2;
                ctx.moveTo(0, s);
                ctx.bezierCurveTo(-s, -s, -s * 2, s, 0, s * 2);
                ctx.bezierCurveTo(s * 2, s, s, -s, 0, s);
            } else {
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(this.size, this.size, 0, this.size * 2);
                ctx.quadraticCurveTo(-this.size, this.size, 0, 0);
            }
            ctx.fill();
            ctx.restore();
        }
    }

    function initPetals() {
        petals = [];
        for (let i = 0; i < 50; i++) {
            petals.push(new Petal());
        }
    }
    initPetals();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    // --- CURSOR ROSE TRAIL ---
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.15) {
            const leaf = document.createElement('img');
            leaf.src = 'cursor_rose.png';
            leaf.className = 'cursor-heart';
            leaf.style.left = e.clientX + 'px';
            leaf.style.top = e.clientY + 'px';
            leaf.style.width = '16px';
            leaf.style.height = '16px';
            leaf.style.opacity = '1';
            leaf.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
            document.body.appendChild(leaf);

            setTimeout(() => {
                leaf.style.transition = 'all 1s ease';
                leaf.style.transform += ` translateY(40px) rotate(180deg) scale(0)`;
                leaf.style.opacity = '0';
                setTimeout(() => leaf.remove(), 1000);
            }, 50);
        }
    });

    // --- TYPEWRITER EFFECT (Kimi Style) ---
    const quotes = [
        "Every time I think of you, I realize how lucky I am to have you in my life. Happy Rose Day! 🌹",
        "A rose is not just a flower, it's a symbol of my love for you. May our love bloom forever.",
        "You are the red rose of my garden, the most beautiful and precious part of my life. ❤️",
        "Just like a rose spreads its fragrance, you fill my world with happiness and love.",
        "In a garden of roses, you are the most beautiful bloom."
    ];
    let quoteIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    const typeElement = document.getElementById('typewriterText');

    function typeWriterMain() {
        if (charIndex < quotes[quoteIndex].length) {
            typeElement.innerHTML += quotes[quoteIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeWriterMain, 50);
        } else {
            isTyping = false;
        }
    }

    window.toggleLetter = () => {
        if (isTyping) return;
        typeElement.innerHTML = '';
        charIndex = 0;
        quoteIndex = (quoteIndex + 1) % quotes.length;
        isTyping = true;
        typeWriterMain();
        createLetterHearts();
    };

    function createLetterHearts() {
        const container = document.getElementById('letterHearts');
        for (let i = 0; i < 10; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = ['❤️', '💖', '✨', '🌹'][Math.floor(Math.random() * 4)];
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.opacity = '1';
            heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
            heart.style.transition = 'all 2s ease-out';
            heart.style.pointerEvents = 'none';
            container.appendChild(heart);

            setTimeout(() => {
                heart.style.opacity = '0';
                heart.style.transform = `translateY(-100px) rotate(${Math.random() * 360}deg)`;
                setTimeout(() => heart.remove(), 2000);
            }, 50);
        }
    }

    // Initial Start
    setTimeout(() => {
        isTyping = true;
        typeWriterMain();
    }, 1500);

    // --- HERO INTERACTION (Petal Burst) ---
    document.getElementById('sendRoseBtn').addEventListener('click', () => {
        for (let i = 0; i < 100; i++) {
            const p = new Petal();
            p.y = window.innerHeight / 2;
            p.x = window.innerWidth / 2;
            p.speed = Math.random() * 10 - 5;
            p.spin = Math.random() * 10 - 5;
            petals.push(p);
            setTimeout(() => petals.splice(petals.indexOf(p), 1), 3000);
        }
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    });

    // --- MUSIC TOGGLE ---
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.remove('active');
            musicBtn.querySelector('span').innerText = '🎵';
        } else {
            bgMusic.play().catch(e => console.log("Music play blocked by browser."));
            musicBtn.classList.add('active');
            musicBtn.querySelector('span').innerText = '⏸';
        }
        isPlaying = !isPlaying;
    });

    // --- SHOWER ROSES ---
    document.getElementById('showerRosesBtn').addEventListener('click', () => {
        const originalCount = petals.length;
        for (let i = 0; i < 200; i++) {
            petals.push(new Petal());
        }
        setTimeout(() => {
            petals.splice(originalCount);
        }, 5000);
    });

    // --- SURPRISE GIFT BOX (Kimi Style) ---
    window.openGift = (el) => {
        const isOpen = el.classList.toggle('open');
        const hint = el.nextElementSibling;

        if (isOpen) {
            // Trigger a petal burst when the box opens
            for (let i = 0; i < 50; i++) {
                const p = new Petal();
                p.y = el.getBoundingClientRect().top;
                p.x = el.getBoundingClientRect().left + el.clientWidth / 2;
                p.speed = Math.random() * 8 + 2;
                p.spin = Math.random() * 10 - 5;
                petals.push(p);
                setTimeout(() => petals.splice(petals.indexOf(p), 1), 3000);
            }
            if (hint) hint.innerHTML = "Click again to close the surprise... ❤️";
        } else {
            if (hint) hint.innerHTML = "Click the box for a surprise...";
        }
    };

    // --- LANTERN WISH LOGIC ---
    const lightBtn = document.getElementById('lightLanternBtn');
    const launchBtn = document.getElementById('launchWishBtn');
    const resetBtn = document.getElementById('resetWishBtn');
    const lantern = document.getElementById('wishLantern');
    const successMsg = document.getElementById('launchSuccess');
    const lanternInput = document.getElementById('lanternInput');

    // Light the lamp
    lightBtn.addEventListener('click', () => {
        lantern.classList.remove('unlit');
        lantern.classList.add('lit');
        lightBtn.classList.add('hidden');
        launchBtn.classList.remove('hidden');
    });

    // Launch the wish
    launchBtn.addEventListener('click', () => {
        if (lanternInput.value.trim()) {
            lantern.classList.add('lantern-launching');
            launchBtn.classList.add('hidden');

            setTimeout(() => {
                successMsg.classList.remove('hidden');
                resetBtn.classList.remove('hidden');
            }, 1000);

            // Add a permanent special lantern to the background
            const specialLantern = document.createElement('div');
            specialLantern.className = 'lantern';
            specialLantern.style.left = '50%';
            specialLantern.style.background = 'rgba(255, 183, 3, 1)';
            specialLantern.style.boxShadow = '0 0 30px #ffb703';
            specialLantern.innerHTML = `<span style="position:absolute; top: -20px; color: gold; font-size: 0.8rem; width: 100px; text-align: center; left: -35px;">${lanternInput.value}</span>`;
            document.getElementById('lanterns').appendChild(specialLantern);
        }
    });

    // Reset/Start Again
    resetBtn.addEventListener('click', () => {
        // Reset Lantern state
        lantern.classList.remove('lantern-launching', 'lit');
        lantern.classList.add('unlit');
        lanternInput.value = '';

        // Reset Buttons
        resetBtn.classList.add('hidden');
        successMsg.classList.add('hidden');
        lightBtn.classList.remove('hidden');
        launchBtn.classList.add('hidden');
    });

    // --- 3D ROSE (THREE.JS) ---
    const roseContainer = document.getElementById('rose3d-container');
    let threeCamera, threeScene, threeRenderer, threeControls, roseObject;

    function init3DRose() {
        threeCamera = new THREE.PerspectiveCamera(33, roseContainer.clientWidth / roseContainer.clientHeight, 1, 2000);
        updateThreeCameraPosition();

        threeScene = new THREE.Scene();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        threeScene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1.2);
        pointLight.position.set(100, 100, 100);
        threeCamera.add(pointLight);
        threeScene.add(threeCamera);

        const material = new THREE.MeshStandardMaterial({
            metalness: 0,
            roughness: 0.8,
            side: THREE.DoubleSide
        });

        const loader = new OBJLoader();
        loader.load(
            "https://happy358.github.io/Images/Model/red_rose3.obj",
            (obj) => {
                roseObject = obj;
                roseObject.traverse((child) => {
                    if (child.isMesh) {
                        const m = material.clone();
                        if (child.name === "rose") m.color.set("crimson");
                        else if (child.name === "calyx") m.color.set("#001a14");
                        else if (child.name === "leaf1" || child.name === "leaf2") m.color.set("#00331b");
                        child.material = m;
                    }
                });
                roseObject.rotation.set(0, Math.PI / 1.7, 0);
                threeScene.add(roseObject);
            },
            undefined,
            (err) => console.error("Error loading rose model:", err)
        );

        threeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        threeRenderer.setPixelRatio(window.devicePixelRatio);
        threeRenderer.setSize(roseContainer.clientWidth, roseContainer.clientHeight);
        threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
        roseContainer.appendChild(threeRenderer.domElement);

        threeControls = new OrbitControls(threeCamera, threeRenderer.domElement);
        threeControls.autoRotate = true;
        threeControls.autoRotateSpeed = 4;
        threeControls.enableDamping = true;
        threeControls.enablePan = false;
        threeControls.enableZoom = false; // Keep it focused
    }

    function updateThreeCameraPosition() {
        if (window.innerWidth < 768) {
            threeCamera.position.set(0, 120, 500);
        } else {
            threeCamera.position.set(0, 150, 300);
        }
    }

    function animate3DRose() {
        requestAnimationFrame(animate3DRose);
        if (threeControls) threeControls.update();
        if (threeRenderer) threeRenderer.render(threeScene, threeCamera);
    }

    init3DRose();
    animate3DRose();

    // --- LANTERNS ---
    const lanternsContainer = document.getElementById('lanterns');
    function createLantern() {
        const lantern = document.createElement('div');
        lantern.className = 'lantern';
        lantern.style.left = Math.random() * 100 + '%';
        lantern.style.animationDuration = (Math.random() * 5 + 8) + 's';
        lanternsContainer.appendChild(lantern);
        setTimeout(() => lantern.remove(), 10000);
    }
    setInterval(createLantern, 2000);

    // --- MODAL GALLERY ---
    const roseCards = document.querySelectorAll('.rose-card');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');

    roseCards.forEach(card => {
        card.addEventListener('click', () => {
            const color = card.getAttribute('data-color');
            const h3 = card.querySelector('h3').innerText;
            const p = card.querySelector('p').innerText;
            const img = card.querySelector('img').src;

            modalBody.innerHTML = `
                <img src="${img}" style="width: 100%; border-radius: 15px; margin-bottom: 1rem;">
                <h2 class="cursive-text">${h3}</h2>
                <p style="font-size: 1.2rem;">${p}</p>
                <div style="margin-top: 1rem; color: var(--rose-pink);">
                    "In the language of flowers, ${h3.toLowerCase()}s represent deep sentiment and beauty."
                </div>
            `;
            modal.style.display = 'flex'; // Show modal
            modal.classList.remove('hidden');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.style.display = 'none'; // Forced cut
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none'; // Forced cut
        }
    });

    // --- FINALE INTERACTION ---
    const finaleBtn = document.getElementById('finaleBtn');
    if (finaleBtn) {
        finaleBtn.addEventListener('click', () => {
            // Massive rose/heart/gold shower
            for (let i = 0; i < 400; i++) {
                setTimeout(() => {
                    const type = i % 3 === 0 ? 'heart' : (i % 5 === 0 ? 'gold' : 'petal');
                    const p = new Petal(type);
                    if (type === 'gold') p.color = `hsla(45, 100%, 50%, ${Math.random() * 0.5 + 0.5})`;
                    p.x = Math.random() * window.innerWidth;
                    p.y = -50;
                    p.speed = Math.random() * 6 + 4;
                    p.spin = Math.random() * 10 - 5;
                    p.isSuper = true; // Flag to remove after one fall
                    petals.push(p);
                }, i * 15);
            }
            // Flash effect for the moon
            const moon = document.querySelector('.moon');
            if (moon) {
                moon.style.boxShadow = '0 0 150px 75px #fff';
                setTimeout(() => {
                    moon.style.boxShadow = '0 0 40px #fff';
                }, 3000);
            }
            // Add a special message
            finaleBtn.innerText = "Forever & Always 💖";
            finaleBtn.classList.remove('pulse');
            finaleBtn.style.transform = 'scale(1.2)';
        });
    }

    // --- STAR PARALLAX ---
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) * 0.05;
        const y = (e.clientY - window.innerHeight / 2) * 0.05;
        const stars = document.querySelector('.stars');
        if (stars) {
            stars.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    // --- SMOOTH FADE N IN ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});
