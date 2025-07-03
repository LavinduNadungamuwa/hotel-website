// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Navbar background on scroll (theme-aware)
  function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    const isDark = document.body.classList.contains('dark-mode');
    if (window.scrollY > 50) {
      navbar.style.background = isDark
        ? 'rgba(35, 39, 47, 0.98)' // var(--background-light) in dark mode
        : 'rgba(255, 255, 255, 0.98)';
    } else {
      navbar.style.background = isDark
        ? 'rgba(35, 39, 47, 0.95)'
        : 'rgba(255, 255, 255, 0.95)';
    }
  }
  window.addEventListener('scroll', updateNavbarBackground);

  // Also update navbar background when theme changes
  const themeObserver = new MutationObserver(updateNavbarBackground);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Set minimum dates for booking form
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkin').setAttribute('min', today);
  document.getElementById('checkout').setAttribute('min', today);

  // Update checkout min date when checkin changes
  document.getElementById('checkin').addEventListener('change', function() {
    const checkinDate = new Date(this.value);
    checkinDate.setDate(checkinDate.getDate() + 1);
    const nextDay = checkinDate.toISOString().split('T')[0];
    document.getElementById('checkout').setAttribute('min', nextDay);
  });

  // Form submissions
  document.getElementById('reservationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Thank you for your reservation request! We will contact you shortly to confirm your booking.', 'success');
    this.reset();
  });

  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
    this.reset();
  });

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  document.querySelectorAll('.room-card, .amenity-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
});

// --- Scrollspy for nav link highlighting ---
document.addEventListener('DOMContentLoaded', function() {
  // Scrollspy logic
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]:not(.cta-btn)'));
  const sectionIds = navLinks.map(link => link.getAttribute('href').replace('#', ''));
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  function highlightNavLink() {
    let scrollPos = window.scrollY + 90; // Offset for fixed navbar
    let activeIndex = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= scrollPos) {
        activeIndex = i;
      }
    }
    navLinks.forEach((link, idx) => {
      if (idx === activeIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);
  highlightNavLink();
});

// Testimonials carousel
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
  testimonials.forEach(testimonial => {
    testimonial.classList.remove('active');
  });
  testimonials[index].classList.add('active');
}

function changeTestimonial(direction) {
  currentTestimonial += direction;
  
  if (currentTestimonial >= totalTestimonials) {
    currentTestimonial = 0;
  } else if (currentTestimonial < 0) {
    currentTestimonial = totalTestimonials - 1;
  }
  
  showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials
setInterval(() => {
  changeTestimonial(1);
}, 5000);

// Auto-advance testimonials every 6 seconds
let testimonialInterval;
function startTestimonialAutoAdvance() {
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(() => {
    changeTestimonial(1);
  }, 6000);
}

// Modified changeTestimonial to restart auto-advance on manual switch
function changeTestimonial(direction) {
  const testimonials = document.querySelectorAll('.testimonials-carousel .testimonial');
  let current = Array.from(testimonials).findIndex(t => t.classList.contains('active'));
  testimonials[current].classList.remove('active');
  testimonials[current].style.display = 'none';
  let next = (current + direction + testimonials.length) % testimonials.length;
  testimonials[next].classList.add('active');
  testimonials[next].style.display = 'flex';
  startTestimonialAutoAdvance();
}

// On page load, show only the first testimonial and start auto-advance
window.addEventListener('DOMContentLoaded', () => {
  const testimonials = document.querySelectorAll('.testimonials-carousel .testimonial');
  testimonials.forEach((t, i) => {
    t.classList.toggle('active', i === 0);
    t.style.display = i === 0 ? 'flex' : 'none';
  });
  startTestimonialAutoAdvance();
});

// Smooth scroll functions
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

function scrollToBooking() {
  scrollToSection('booking');
}

// Room card interactions
document.querySelectorAll('.room-card').forEach(card => {
  card.addEventListener('click', function() {
    const roomType = this.dataset.room;
    const roomSelect = document.getElementById('room-type');
    
    // Update the room selection in booking form
    for (let option of roomSelect.options) {
      if (option.value === roomType) {
        option.selected = true;
        break;
      }
    }
    
    // Scroll to booking section
    scrollToBooking();
    
    // Add visual feedback
    this.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});

// Gallery lightbox effect
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', function() {
    const img = this.querySelector('img');
    createLightbox(img.src, img.alt);
  });
});

function createLightbox(src, alt) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${src}" alt="${alt}">
      <button class="lightbox-close">&times;</button>
    </div>
  `;
  
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  const content = lightbox.querySelector('.lightbox-content');
  content.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
  `;
  
  const img = lightbox.querySelector('img');
  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  `;
  
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    padding: 5px;
  `;
  
  document.body.appendChild(lightbox);
  
  // Fade in
  setTimeout(() => {
    lightbox.style.opacity = '1';
  }, 10);
  
  // Close functionality
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  function closeLightbox() {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(lightbox);
    }, 300);
  }
  
  // ESC key to close
  const escHandler = function(e) {
    if (e.key === 'Escape') {
      closeLightbox();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Slide in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Add loading animation
window.addEventListener('load', function() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// Theme toggle logic for both desktop and mobile
function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    // Update both theme toggle icons
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"/></svg>';
    });
  } else {
    document.body.classList.remove('dark-mode');
    // Update both theme toggle icons
    document.querySelectorAll('.theme-icon').forEach(icon => {
      icon.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>';
    });
  }
}

function getPreferredTheme() {
  return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  setTheme(isDark ? 'dark' : 'light');
}

// Add event listeners for both theme toggle buttons
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
  }
  
  // Set initial theme
  setTheme(getPreferredTheme());
});