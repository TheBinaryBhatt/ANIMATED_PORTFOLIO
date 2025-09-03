// Enhanced main.js - Unified functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollEffects();
    initializeLoadingScreen();
    initializeLazyLoading();
    initializeAccessibility();
    initializePerformanceOptimizations();
    initializeEasterEggs();
}

// Navigation Management
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
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
}

// Enhanced Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

    // Apply initial theme
    applyTheme(shouldUseDark ? 'dark' : 'light');

    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        
        // Add click animation
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (theme === 'dark') {
        document.body.removeAttribute('data-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="ri-sun-fill"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        }
    } else {
        document.body.setAttribute('data-theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="ri-moon-fill"></i>';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
    
    localStorage.setItem('portfolio-theme', theme);
}

// Enhanced Scroll Effects
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let scrollTimeout;

    // Header hide/show on scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (Math.abs(scrollTop - lastScrollTop) > 5) { // Add threshold to prevent jitter
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                header?.classList.add('header-hidden');
            } else {
                // Scrolling up
                header?.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }

        // Show scroll to top button
        updateScrollToTopButton(scrollTop);
    }

    // Throttle scroll events for better performance
    function throttledScroll() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 10);
        }
    }

    window.addEventListener('scroll', throttledScroll);

    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function updateScrollToTopButton(scrollTop) {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        if (scrollTop > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
}

// Loading Screen Management
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Simulate loading time
    const minLoadingTime = 1500; // Minimum 1.5 seconds for professional feel
    const startTime = Date.now();

    function hideLoadingScreen() {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, remainingTime);
    }

    // Hide loading screen when everything is loaded
    if (document.readyState === 'complete') {
        hideLoadingScreen();
    } else {
        window.addEventListener('load', hideLoadingScreen);
    }
}

// Enhanced Lazy Loading
function initializeLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('img[data-src], img.lazy');
    if (lazyImages.length === 0) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.dataset.src || img.src;
                
                if (src && img.dataset.src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Keyboard navigation for custom elements
    const interactiveElements = document.querySelectorAll('.btn, .social-links a, .project-card, .skill-item');
    
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex') && !element.href && !element.type) {
            element.setAttribute('tabindex', '0');
        }

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Announce page changes for screen readers
    announcePageChange();

    // Enhanced focus management
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

function announcePageChange() {
    const currentPage = getCurrentPageName();
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only');
    announcement.textContent = `${currentPage} page loaded`;
    document.body.appendChild(announcement);

    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

function getCurrentPageName() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageNames = {
        'index.html': 'Home',
        'about.html': 'About',
        'skills.html': 'Skills', 
        'projects.html': 'Projects',
        'contact.html': 'Contact'
    };
    return pageNames[currentPage] || 'Portfolio';
}

// Performance Optimizations
function initializePerformanceOptimizations() {
    // Reduce animations for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--animation-delay', '0.01ms');
        
        // Remove floating animations
        const floatingElements = document.querySelectorAll('.home-img img, .about-img img, .page-img img');
        floatingElements.forEach(el => {
            el.style.animation = el.style.animation.replace(/floatImage[^,]*,?\s?/g, '');
        });
    }

    // Optimize scroll performance
    let ticking = false;
    function optimizedScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scroll-dependent operations
                updateScrollProgress();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
}

function updateScrollProgress() {
    const scrollProgress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
}

// Easter Eggs and Fun Interactions
function initializeEasterEggs() {
    // Konami code implementation
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // Click counter easter egg
    let clickCount = 0;
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            clickCount++;
            if (clickCount === 10) {
                showClickEasterEgg();
                clickCount = 0;
            }
        });
    }
}

function activateEasterEgg() {
    document.body.classList.add('easter-egg');
    
    showNotification('🎉 Konami Code Activated! You found the secret!', 'success');
    
    setTimeout(() => {
        document.body.classList.remove('easter-egg');
    }, 5000);
}

function showClickEasterEgg() {
    const originalTitle = document.title;
    document.title = '🎊 You found a secret! 🎊';
    
    setTimeout(() => {
        document.title = originalTitle;
    }, 3000);
    
    showNotification('🔟 clicks! You\'re persistent! 😄', 'success');
}

// Utility Functions
function showNotification(message, type = 'info', duration = 4000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'ri-check-line',
        error: 'ri-error-warning-line',
        info: 'ri-information-line',
        warning: 'ri-alert-line'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i class="ri-close-line"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove
    const autoRemoveTimeout = setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemoveTimeout);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.classList.add('fade-out');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Add CSS for header hiding
const style = document.createElement('style');
style.textContent = `
    .header {
        transform: translateY(0);
        transition: transform 0.3s ease;
    }
    .header-hidden {
        transform: translateY(-100%);
    }
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    .keyboard-navigation *:focus {
        outline: 2px solid var(--main-color);
        outline-offset: 2px;
    }
`;
document.head.appendChild(style);