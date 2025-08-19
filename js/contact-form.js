// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        initContactForm();
    }
});

function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Form validation
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            message: 'Nome deve conter apenas letras e ter pelo menos 2 caracteres'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Por favor, insira um e-mail válido'
        },
        phone: {
            required: true,
            pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
            message: 'Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX'
        },
        subject: {
            required: true,
            message: 'Por favor, selecione um assunto'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Mensagem deve ter pelo menos 10 caracteres'
        }
    };
    
    // Real-time validation
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    function validateField(field) {
        const fieldName = field.name;
        const validator = validators[fieldName];
        const value = field.value.trim();
        
        if (!validator) return true;
        
        // Required validation
        if (validator.required && !value) {
            showFieldError(field, 'Este campo é obrigatório');
            return false;
        }
        
        // Skip other validations if field is empty and not required
        if (!value && !validator.required) {
            clearFieldError(field);
            return true;
        }
        
        // Pattern validation
        if (validator.pattern && !validator.pattern.test(value)) {
            showFieldError(field, validator.message);
            return false;
        }
        
        // Min length validation
        if (validator.minLength && value.length < validator.minLength) {
            showFieldError(field, validator.message);
            return false;
        }
        
        clearFieldError(field);
        return true;
    }
    
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.classList.add('error');
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        `;
        
        field.parentElement.appendChild(errorDiv);
        
        // Shake animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorDiv = field.parentElement.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function submitForm() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Success simulation
            showSuccessMessage();
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            
            // Clear all field states
            inputs.forEach(input => {
                clearFieldError(input);
                input.parentElement.classList.remove('focused');
            });
            
            // Send to WhatsApp as fallback
            sendToWhatsApp(data);
            
        }, 2000);
        
        // In a real implementation, you would send the data to your server:
        /*
        fetch('/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                showSuccessMessage();
                form.reset();
            } else {
                showErrorMessage(result.message);
            }
        })
        .catch(error => {
            showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        });
        */
    }
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div style="
                background: #d4edda;
                color: #155724;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #c3e6cb;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: fadeIn 0.5s ease;
            ">
                <i class="fas fa-check-circle"></i>
                <span>Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
            </div>
        `;
        
        form.insertBefore(successDiv, form.firstChild);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div style="
                background: #f8d7da;
                color: #721c24;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #f5c6cb;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: fadeIn 0.5s ease;
            ">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        
        form.insertBefore(errorDiv, form.firstChild);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
        
        // Scroll to error message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function sendToWhatsApp(data) {
        const message = `
*Nova mensagem do site Madeiraço*

*Nome:* ${data.name}
*E-mail:* ${data.email}
*Telefone:* ${data.phone}
*Assunto:* ${data.subject}

*Mensagem:*
${data.message}
        `.trim();
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/5562932901188?text=${encodedMessage}`;
        
        // Show option to open WhatsApp
        const whatsappDiv = document.createElement('div');
        whatsappDiv.innerHTML = `
            <div style="
                background: #e8f5e8;
                color: #2d5a2d;
                padding: 1rem;
                border-radius: 8px;
                border: 1px solid #c3e6cb;
                margin-top: 1rem;
                text-align: center;
                animation: fadeIn 0.5s ease;
            ">
                <p style="margin-bottom: 1rem;">
                    <i class="fab fa-whatsapp"></i>
                    Sua mensagem também foi preparada para o WhatsApp
                </p>
                <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="fab fa-whatsapp"></i>
                    Abrir no WhatsApp
                </a>
            </div>
        `;
        
        form.appendChild(whatsappDiv);
        
        // Remove WhatsApp message after 10 seconds
        setTimeout(() => {
            whatsappDiv.remove();
        }, 10000);
    }
}

// Auto-resize textarea
document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
});

// Character counter for textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    const maxLength = 500;
    
    // Create counter element
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #666;
        margin-top: 0.25rem;
    `;
    
    messageTextarea.parentElement.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - messageTextarea.value.length;
        counter.textContent = `${messageTextarea.value.length}/${maxLength}`;
        
        if (remaining < 50) {
            counter.style.color = '#e74c3c';
        } else if (remaining < 100) {
            counter.style.color = '#f39c12';
        } else {
            counter.style.color = '#666';
        }
    }
    
    messageTextarea.addEventListener('input', updateCounter);
    messageTextarea.setAttribute('maxlength', maxLength);
    
    // Initial counter update
    updateCounter();
}

// Form analytics (optional)
function trackFormEvent(eventName, data = {}) {
    // Google Analytics 4 example
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'Contact Form',
            ...data
        });
    }
    
    // Console log for development
    console.log('Form Event:', eventName, data);
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Track form start
    const inputs = form.querySelectorAll('input, select, textarea');
    let formStarted = false;
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (!formStarted) {
                trackFormEvent('form_start');
                formStarted = true;
            }
        });
    });
    
    // Track form submission
    form.addEventListener('submit', function() {
        trackFormEvent('form_submit');
    });
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels to form fields
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label && !field.getAttribute('aria-label')) {
            field.setAttribute('aria-label', label.textContent);
        }
    });
    
    // Add role and aria-live to error containers
    const errorContainers = document.querySelectorAll('.field-error');
    errorContainers.forEach(container => {
        container.setAttribute('role', 'alert');
        container.setAttribute('aria-live', 'polite');
    });
});

