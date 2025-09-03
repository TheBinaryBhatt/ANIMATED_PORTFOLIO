// skills.js - Animate skill bars when they come into view
document.addEventListener('DOMContentLoaded', function() {
    const skillProgresses = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillProgresses.forEach(progress => {
        observer.observe(progress);
    });
});