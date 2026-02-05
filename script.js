/**
 * Portfolio - Japhet Kalume
 * Professional JavaScript implementation
 * Handles navigation, animations, form validation, and user interactions
 */

'use strict';

// ===================================
// UTILITY FUNCTIONS
// ===================================

const debounce = (func, wait = 100) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit = 100) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// ===================================
// NAVIGATION
// ===================================

class Navigation {
    constructor() {
        this.nav = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.setupActiveLinks();
        this.setupSmoothScroll();
    }
    
    setupScrollBehavior() {
        const handleScroll = throttle(() => {
            if (window.scrollY > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
            this.navToggle.setAttribute('aria-expanded', !isExpanded);
            this.navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.navMenu.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
    setupActiveLinks() {
        const handleScroll = throttle(() => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.animateSkillBars();
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);
        
        // Observe elements with data-animate attribute
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progress = entry.target.getAttribute('data-progress');
                    entry.target.style.setProperty('--progress-width', `${progress}%`);
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        skillBars.forEach(bar => observer.observe(bar));
    }
}

// ===================================
// FORM VALIDATION & SUBMISSION
// ===================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        this.messageInput = document.getElementById('message');
        
        this.nameError = document.getElementById('nameError');
        this.emailError = document.getElementById('emailError');
        this.messageError = document.getElementById('messageError');
        this.formSuccess = document.getElementById('formSuccess');
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.nameInput.addEventListener('blur', () => this.validateName());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.messageInput.addEventListener('blur', () => this.validateMessage());
        
        // Clear error on input
        [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
            input.addEventListener('input', () => {
                input.classList.remove('error');
                const errorId = `${input.id}Error`;
                const errorElement = document.getElementById(errorId);
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
            });
        });
    }
    
    validateName() {
        const name = this.nameInput.value.trim();
        
        if (name.length === 0) {
            this.showError(this.nameInput, this.nameError, 'Le nom est requis');
            return false;
        }
        
        if (name.length < 2) {
            this.showError(this.nameInput, this.nameError, 'Le nom doit contenir au moins 2 caractères');
            return false;
        }
        
        this.clearError(this.nameInput, this.nameError);
        return true;
    }
    
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length === 0) {
            this.showError(this.emailInput, this.emailError, 'L\'email est requis');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(this.emailInput, this.emailError, 'Veuillez entrer un email valide');
            return false;
        }
        
        this.clearError(this.emailInput, this.emailError);
        return true;
    }
    
    validateMessage() {
        const message = this.messageInput.value.trim();
        
        if (message.length === 0) {
            this.showError(this.messageInput, this.messageError, 'Le message est requis');
            return false;
        }
        
        if (message.length < 10) {
            this.showError(this.messageInput, this.messageError, 'Le message doit contenir au moins 10 caractères');
            return false;
        }
        
        this.clearError(this.messageInput, this.messageError);
        return true;
    }
    
    showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
    
    clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.classList.remove('visible');
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();
        const isMessageValid = this.validateMessage();
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            return;
        }
        
        // Show loading state
        const submitButton = this.form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.btn-text');
        const buttonLoader = submitButton.querySelector('.btn-loader');
        
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'block';
        
        // Simulate form submission (replace with actual API call)
        try {
            await this.simulateFormSubmission();
            
            // Show success message
            this.formSuccess.classList.add('visible');
            this.form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                this.formSuccess.classList.remove('visible');
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.display = 'block';
            buttonLoader.style.display = 'none';
        }
    }
    
    simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Here you would normally send data to your backend
                // Example: fetch('/api/contact', { method: 'POST', body: formData })
                resolve();
            }, 2000);
        });
    }
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.lazyLoadImages();
        this.prefetchLinks();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    prefetchLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const prefetchLink = document.createElement('link');
                prefetchLink.rel = 'prefetch';
                prefetchLink.href = link.href;
                document.head.appendChild(prefetchLink);
            }, { once: true });
        });
    }
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

class AccessibilityEnhancements {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const navToggle = document.getElementById('navToggle');
                
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.focus();
                }
            }
        });
    }
    
    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const navMenu = document.getElementById('navMenu');
        const focusableElements = navMenu.querySelectorAll('a, button');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }
}

// ===================================
// INITIALIZATION
// ===================================

class Portfolio {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        // Initialize all components
        new Navigation();
        new ScrollAnimations();
        new ContactForm();
        new PerformanceOptimizer();
        new AccessibilityEnhancements();
        
        // Log initialization for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('Portfolio initialized successfully');
        }
    }
}

// Start the application
new Portfolio();

// ===================================
// EXPORT FOR TESTING (if needed)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        ScrollAnimations,
        ContactForm,
        PerformanceOptimizer,
        AccessibilityEnhancements
    };
}
