/**
 * Rehman Beauty Salon - Animation Controller
 * Handles GSAP, ScrollTrigger, and subtle WebGL visual background effects.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    initGSAPAnimations();
    initWebGLBackground();
  }
});

/**
 * Initializes GSAP Reveals and ScrollTrigger Animations
 */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero Entrance Animation
  const heroTitle = document.querySelector('.hero__title');
  const heroText = document.querySelector('.hero__text');
  const heroButtons = document.querySelector('.hero__buttons');
  const heroImage = document.querySelector('.hero__image-wrapper');

  if (heroTitle) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    tl.from(heroTitle, { y: 30, opacity: 0 })
      .from(heroText, { y: 20, opacity: 0 }, '-=0.6')
      .from(heroButtons, { y: 20, opacity: 0 }, '-=0.6');

    if (heroImage) {
      tl.from(heroImage, { scale: 0.95, opacity: 0, duration: 1.2 }, '-=0.8');
    }
  }

  // Scroll Trigger Reveals for Cards & Sections
  const cards = document.querySelectorAll('.card, .feature-box, .gallery-item, .service-category');
  cards.forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 25,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}

/**
 * Optional Lightweight WebGL Ambient Background Visual
 * Degrades gracefully if WebGL is unavailable or hardware limited.
 */
function initWebGLBackground() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  let renderer, scene, camera, particles;

  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 400;

    // Create subtle particles representing champagne/gold light
    const particleCount = 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 800;
      positions[i + 1] = (Math.random() - 0.5) * 800;
      positions[i + 2] = (Math.random() - 0.5) * 400;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xD4AF37,
      size: 3,
      transparent: true,
      opacity: 0.3
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;
      renderer.render(scene, camera);
    }

    // Pause animation when page tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  } catch (e) {
    // Fail silently if WebGL is disabled
    if (canvas) canvas.style.display = 'none';
  }
}
