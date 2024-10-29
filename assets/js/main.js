/**
 * Template Name: Elite Investor Circle Landing
 * Template URL: https://timothyivaikin.com/elite-investor-circle-landing
 * Updated: Oct 28, 2024 with Bootstrap v5.3.3
 * Author: Timothy Ivaikin
 * License: Proprietary License – © 2024 Timothy Ivaikin, All Rights Reserved
 */

(function() {
  "use strict";

  // Adds .scrolled class to the body on page scroll
  function applyScrolledClass() {
    const body = document.body;
    const header = document.querySelector('#header');
    if (header.classList.contains('scroll-up-sticky') || header.classList.contains('sticky-top') || header.classList.contains('fixed-top')) {
      window.scrollY > 100 ? body.classList.add('scrolled') : body.classList.remove('scrolled');
    }
  }

  document.addEventListener('scroll', applyScrolledClass);
  window.addEventListener('load', applyScrolledClass);

  // Toggles mobile navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  function toggleMobileNav() {
    document.body.classList.toggle('mobile-nav-active');
    mobileNavToggle.classList.toggle('bi-list');
    mobileNavToggle.classList.toggle('bi-x');
  }
  if (mobileNavToggle) mobileNavToggle.addEventListener('click', toggleMobileNav);

  // Closes mobile nav on same-page hash link click
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) toggleMobileNav();
    });
  });

  // Toggles dropdowns in mobile nav
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(dropdownToggle => {
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.nextElementSibling.classList.toggle('dropdown-active');
    });
  });

  // Scroll-to-top button functionality
  const scrollTopButton = document.querySelector('.scroll-top');
  function toggleScrollTopButton() {
    window.scrollY > 100 ? scrollTopButton.classList.add('active') : scrollTopButton.classList.remove('active');
  }
  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('load', toggleScrollTopButton);
    document.addEventListener('scroll', toggleScrollTopButton);
  }

  // Initiates animations on scroll
  function initializeAOS() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', initializeAOS);

  // Initializes GLightbox
  GLightbox({ selector: '.glightbox' });

  // Initializes Swiper sliders with configuration
  function initializeSwipers() {
    document.querySelectorAll(".init-swiper").forEach(swiperElement => {
      let config = JSON.parse(swiperElement.querySelector(".swiper-config").textContent.trim());
      new Swiper(swiperElement, config);
    });
    // Testimonial slider setup
    new Swiper('.testimonial-slider', {
      loop: true,
      autoplay: { delay: 5000 },
      speed: 600,
      pagination: { el: '.swiper-pagination', clickable: true },
      slidesPerView: 1
    });
  }
  window.addEventListener("load", initializeSwipers);

  // Initializes Pure Counter
  new PureCounter();

  // Toggles FAQ items
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => toggle.parentNode.classList.toggle('faq-active'));
  });

  // Smooth scroll to sections for URLs with hash links
  window.addEventListener('load', () => {
    if (window.location.hash) {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        setTimeout(() => {
          const scrollMargin = parseInt(getComputedStyle(targetSection).scrollMarginTop);
          window.scrollTo({
            top: targetSection.offsetTop - scrollMargin,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  // Navigation menu scrollspy to highlight active sections
  const navLinks = document.querySelectorAll('.navmenu a');
  function updateScrollspy() {
    const currentScroll = window.scrollY + 200;
    navLinks.forEach(link => {
      if (!link.hash) return;
      const section = document.querySelector(link.hash);
      if (section && currentScroll >= section.offsetTop && currentScroll <= (section.offsetTop + section.offsetHeight)) {
        document.querySelector('.navmenu a.active')?.classList.remove('active');
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', updateScrollspy);
  document.addEventListener('scroll', updateScrollspy);

  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    const form = event.target;
    const loading = document.querySelector('.loading');
    const sentMessage = document.querySelector('.sent-message');
    const errorMessage = document.querySelector('.error-message');

    loading.style.display = 'block';
    sentMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    })
        .then(async response => {
          loading.style.display = 'none';
          if (response.ok) {
            const data = await response.json();
            if (data.next) {
              // Option 1: Redirect to thank you page
              window.location.href = data.next;
            } else {
              // Option 2: Show success message without redirection
              sentMessage.style.display = 'block';
              form.reset();
            }
          } else {
            const errorData = await response.json();
            errorMessage.textContent = errorData.error || 'There was an error. Please try again.';
            errorMessage.style.display = 'block';
          }
        })
        .catch(() => {
          loading.style.display = 'none';
          errorMessage.textContent = 'There was an error. Please try again.';
          errorMessage.style.display = 'block';
        });
  });

})();
