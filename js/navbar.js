/* ===================================================
   StudySwap — Shared Navbar Logic
   Handles hamburger toggle, scroll styling, and
   active-page highlighting.
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.navbar-hamburger');
  const navLinks = document.querySelector('.navbar-links');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const navbar = document.querySelector('.navbar');

  // --- Hamburger toggle ---
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
  }

  // Close mobile nav on overlay click
  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      overlay.classList.remove('show');
    });
  }

  // Close mobile nav on link click
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
      });
    });
  }

  // --- Scroll effect on navbar ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Active page highlighting ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.navbar-links a:not(.navbar-cta)');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
