// script.js
// Typed.js initialization only on home page
if (document.querySelector('.multiple-text')) {
    var typed = new Typed(".multiple-text", {
        strings: ["Tech Enthusiast", "Web Developer", "Cyber Security Enthusiast", "Problem Solver"],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
}

// Header hide/show on scroll - Fixed version
let lastScrollTop = 0;
const header = document.querySelector('.header');

if (header) {
    window.addEventListener("scroll", function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.style.transform = "translateY(-100%)";
        } else {
            // Scrolling up
            header.style.transform = "translateY(0)";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Form submission handling for contact page
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simple form validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
                
                // Remove error style after 2 seconds
                setTimeout(() => {
                    input.style.boxShadow = '';
                }, 2000);
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        }
    });
}