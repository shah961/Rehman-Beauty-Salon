/**
 * Rehman Beauty Salon - Main Interactive Logic
 * Handles Header Sticky State, Mobile Menu, Form Validation, & Lightbox.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initContactForm();
  initLightbox();
});

/**
 * Sticky Header Scroll State
 */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
}

/**
 * Mobile Navigation Toggle & Accessibility
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('main-nav');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Close menu on navigation link click
  const navLinks = navMenu.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Contact Form Front-End Validation
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !message) {
      feedback.className = 'form-feedback form-feedback--error';
      feedback.textContent = 'Please complete all required fields (*).';
      return;
    }

    // Success State
    feedback.className = 'form-feedback form-feedback--success';
    feedback.textContent = 'Thank you for your message. Please note: for immediate appointments or urgent inquiries, please call the salon directly at (042) 35876975.';
    form.reset();
  });
}

/**
 * Gallery Lightbox Functionality
 */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (!galleryItems.length || !lightbox) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const imgSrc = item.getAttribute('href');
      const caption = item.getAttribute('data-caption') || '';

      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', caption);
      lightboxCaption.textContent = caption;

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
