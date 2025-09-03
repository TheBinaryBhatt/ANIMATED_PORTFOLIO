// contact.js - Missing contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    if (contactForm) {
        // Add loading state functionality
        function showLoading(button) {
            button.innerHTML = '<i class="ri-loader-4-line"></i> Sending...';
            button.disabled = true;
            button.classList.add('loading');
        }
        
        function hideLoading(button, originalText = 'Send Message') {
            button.innerHTML = originalText;
            button.disabled = false;
            button.classList.remove('loading');
        }
        
        // Enhanced form validation
        function validateForm() {
            let isValid = true;
            const errors = [];
            
            formInputs.forEach(input => {
                const value = input.value.trim();
                const fieldName = input.placeholder;
                
                // Remove previous error styling
                input.classList.remove('error');
                
                if (!value) {
                    isValid = false;
                    input.classList.add('error');
                    errors.push(`${fieldName} is required`);
                }
                
                // Email validation
                if (input.type === 'email' && value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        input.classList.add('error');
                        errors.push('Please enter a valid email address');
                    }
                }
                
                // Minimum length validation for message
                if (input.tagName.toLowerCase() === 'textarea' && value && value.length < 10) {
                    isValid = false;
                    input.classList.add('error');
                    errors.push('Message should be at least 10 characters long');
                }
            });
            
            return { isValid, errors };
        }
        
        // Show notification
        function showNotification(message, type = 'success') {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(n => n.remove());
            
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="ri-${type === 'success' ? 'check' : 'error-warning'}-line"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close" aria-label="Close notification">
                    <i class="ri-close-line"></i>
                </button>
            `;
            
            document.body.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
            
            // Manual close
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            });
        }
        
        // Form submission handler
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.btn[type="submit"]');
            const validation = validateForm();
            
            if (!validation.isValid) {
                showNotification('Please fix the errors and try again.', 'error');
                
                // Remove error styling after 3 seconds
                setTimeout(() => {
                    formInputs.forEach(input => input.classList.remove('error'));
                }, 3000);
                return;
            }
            
            // Show loading state
            showLoading(submitButton);
            
            // Collect form data
            const formData = new FormData(contactForm);
            const formDataObj = {};
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            try {
                // Simulate API call (replace with actual endpoint)
                await simulateFormSubmission(formDataObj);
                
                // Success
                hideLoading(submitButton);
                showNotification('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
                
                // Optional: Send to email service (like EmailJS, Formspree, etc.)
                // await sendToEmailService(formDataObj);
                
            } catch (error) {
                hideLoading(submitButton);
                showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
                console.error('Form submission error:', error);
            }
        });
        
        // Real-time validation feedback
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.classList.remove('error');
                    this.classList.add('valid');
                } else {
                    this.classList.remove('valid');
                }
            });
            
            input.addEventListener('focus', function() {
                this.classList.remove('error');
            });
        });
    }
    
    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% of the time)
                if (Math.random() > 0.1) {
                    resolve(data);
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000); // 2 second delay to simulate network request
        });
    }
});

// Email service integration example (using EmailJS)

async function sendToEmailService(formData) {
    // Initialize EmailJS with your service details
    const SERVICE_ID = 'your_service_id';
    const TEMPLATE_ID = 'your_template_id';
    const USER_ID = 'your_user_id';
    
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Ritunjay Bhatt'
    };
    
    try {
        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
        console.log('Email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}
