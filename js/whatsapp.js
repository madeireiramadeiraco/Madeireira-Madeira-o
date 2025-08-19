// WhatsApp Integration JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initWhatsAppFeatures();
});

function initWhatsAppFeatures() {
    setupWhatsAppFloat();
    setupProductWhatsApp();
    setupQuickMessages();
    trackWhatsAppClicks();
}

// WhatsApp floating button functionality
function setupWhatsAppFloat() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (!whatsappFloat) return;
    
    const whatsappLink = whatsappFloat.querySelector('a');
    
    // Enhanced hover effects
    whatsappFloat.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.6)';
    });
    
    whatsappFloat.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
    });
    
    // Click tracking
    whatsappLink.addEventListener('click', function() {
        trackWhatsAppClick('floating_button');
        
        // Add click animation
        whatsappFloat.style.transform = 'scale(0.9)';
        setTimeout(() => {
            whatsappFloat.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Show/hide based on scroll position
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide when scrolling down fast, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            whatsappFloat.style.transform = 'translateY(100px)';
            whatsappFloat.style.opacity = '0.7';
        } else {
            whatsappFloat.style.transform = 'translateY(0)';
            whatsappFloat.style.opacity = '1';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Pulse animation every 10 seconds
    setInterval(() => {
        whatsappFloat.style.animation = 'none';
        setTimeout(() => {
            whatsappFloat.style.animation = 'pulse 2s infinite';
        }, 100);
    }, 10000);
}

// Product-specific WhatsApp integration
function setupProductWhatsApp() {
    const productBtns = document.querySelectorAll('.product-btn');
    
    productBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productDescription = productCard.querySelector('.product-description').textContent;
            
            const message = `
Olá! Gostaria de solicitar um orçamento para:

*${productTitle}*
${productDescription}

Poderia me fornecer mais informações sobre preços e disponibilidade?
            `.trim();
            
            openWhatsApp(message, 'product_inquiry');
        });
    });
}

// Quick message templates
function setupQuickMessages() {
    const quickMessages = {
        orcamento: `
Olá! Gostaria de solicitar um orçamento para materiais de construção.

Poderia me ajudar com informações sobre:
- Preços
- Disponibilidade
- Condições de entrega

Aguardo seu contato!
        `.trim(),
        
        produtos: `
Olá! Gostaria de saber mais sobre os produtos da Madeiraço.

Estou interessado em:
- Madeiras para construção
- Ripas e caibros
- Tábuas e pranchas

Poderia me fornecer mais detalhes?
        `.trim(),
        
        entrega: `
Olá! Gostaria de saber sobre as condições de entrega da Madeiraço.

Preciso de informações sobre:
- Área de entrega
- Prazos
- Custos de frete

Obrigado!
        `.trim(),
        
        visita: `
Olá! Gostaria de agendar uma visita à Madeiraço.

Preciso ver os produtos pessoalmente e conversar sobre:
- Qualidade dos materiais
- Preços para compra em quantidade
- Condições de pagamento

Qual o melhor horário para uma visita?
        `.trim()
    };
    
    // Add quick message buttons to contact section
    const contactSection = document.getElementById('contato');
    if (contactSection) {
        const quickMessageDiv = document.createElement('div');
        quickMessageDiv.className = 'quick-messages';
        quickMessageDiv.innerHTML = `
            <div class="quick-messages-container" style="
                background: #f8f9fa;
                padding: 2rem;
                border-radius: 15px;
                margin-top: 2rem;
                text-align: center;
            ">
                <h3 style="color: #8B4513; margin-bottom: 1rem;">
                    <i class="fab fa-whatsapp"></i>
                    Mensagens Rápidas
                </h3>
                <p style="color: #666; margin-bottom: 1.5rem;">
                    Clique em uma das opções abaixo para enviar uma mensagem pré-definida
                </p>
                <div class="quick-buttons" style="
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                ">
                    <button class="quick-btn" data-message="orcamento">
                        <i class="fas fa-calculator"></i>
                        Solicitar Orçamento
                    </button>
                    <button class="quick-btn" data-message="produtos">
                        <i class="fas fa-box"></i>
                        Informações sobre Produtos
                    </button>
                    <button class="quick-btn" data-message="entrega">
                        <i class="fas fa-truck"></i>
                        Condições de Entrega
                    </button>
                    <button class="quick-btn" data-message="visita">
                        <i class="fas fa-store"></i>
                        Agendar Visita
                    </button>
                </div>
            </div>
        `;
        
        // Add CSS for quick buttons
        const style = document.createElement('style');
        style.textContent = `
            .quick-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem;
                background: white;
                border: 2px solid #25D366;
                border-radius: 10px;
                color: #25D366;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 120px;
            }
            
            .quick-btn:hover {
                background: #25D366;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
            }
            
            .quick-btn i {
                font-size: 1.2rem;
            }
            
            @media (max-width: 768px) {
                .quick-buttons {
                    flex-direction: column;
                    align-items: center;
                }
                
                .quick-btn {
                    width: 100%;
                    max-width: 250px;
                }
            }
        `;
        document.head.appendChild(style);
        
        contactSection.appendChild(quickMessageDiv);
        
        // Add event listeners to quick buttons
        const quickBtns = quickMessageDiv.querySelectorAll('.quick-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const messageType = this.dataset.message;
                const message = quickMessages[messageType];
                
                if (message) {
                    openWhatsApp(message, `quick_${messageType}`);
                }
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
}

// Open WhatsApp with custom message
function openWhatsApp(message, source = 'general') {
    const phoneNumber = '556232901188';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Track the click
    trackWhatsAppClick(source);
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

// Track WhatsApp clicks for analytics
function trackWhatsAppClick(source) {
    // Google Analytics 4 example
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            event_category: 'WhatsApp',
            event_label: source,
            value: 1
        });
    }
    
    // Facebook Pixel example
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
            content_name: 'WhatsApp Click',
            content_category: source
        });
    }
    
    // Console log for development
    console.log('WhatsApp click tracked:', source);
}

// WhatsApp business hours check
function checkBusinessHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Business hours: Monday to Friday 7-18, Saturday 7-12
    const isBusinessDay = day >= 1 && day <= 6;
    const isBusinessHour = (day >= 1 && day <= 5 && hour >= 7 && hour < 18) || 
                          (day === 6 && hour >= 7 && hour < 12);
    
    return isBusinessDay && isBusinessHour;
}

// Show business hours message
function showBusinessHoursMessage() {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (!whatsappFloat) return;
    
    const isBusinessHours = checkBusinessHours();
    
    if (!isBusinessHours) {
        // Create tooltip for after hours
        const tooltip = document.createElement('div');
        tooltip.className = 'business-hours-tooltip';
        tooltip.innerHTML = `
            <div style="
                position: absolute;
                bottom: 70px;
                right: 0;
                background: #333;
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 0.8rem;
                white-space: nowrap;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                animation: fadeIn 0.3s ease;
            ">
                <div>Fora do horário comercial</div>
                <div style="font-size: 0.7rem; opacity: 0.8;">
                    Seg-Sex: 7h-18h | Sáb: 7h-12h
                </div>
                <div style="
                    position: absolute;
                    bottom: -5px;
                    right: 20px;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid #333;
                "></div>
            </div>
        `;
        
        whatsappFloat.appendChild(tooltip);
        
        // Remove tooltip after 5 seconds
        setTimeout(() => {
            tooltip.remove();
        }, 5000);
    }
}

// Initialize business hours check
setTimeout(showBusinessHoursMessage, 3000);

// WhatsApp status indicator
function addWhatsAppStatus() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    
    whatsappLinks.forEach(link => {
        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'whatsapp-status';
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i>';
        statusIndicator.style.cssText = `
            color: #25D366;
            font-size: 0.6rem;
            margin-left: 0.25rem;
            animation: pulse 2s infinite;
        `;
        
        link.appendChild(statusIndicator);
    });
}

// Initialize status indicators
addWhatsAppStatus();

// Auto-suggest messages based on page section
function autoSuggestMessage() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 'home';
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update WhatsApp message based on current section
        updateWhatsAppMessage(currentSection);
    });
}

function updateWhatsAppMessage(section) {
    const whatsappFloat = document.getElementById('whatsapp-float');
    if (!whatsappFloat) return;
    
    const whatsappLink = whatsappFloat.querySelector('a');
    const baseUrl = 'https://wa.me/556232901188?text=';
    
    const messages = {
        home: 'Olá! Visitei o site da Madeiraço e gostaria de saber mais sobre os produtos.',
        produtos: 'Olá! Estou interessado nos produtos da Madeiraço. Poderia me fornecer mais informações?',
        sobre: 'Olá! Gostaria de conhecer melhor a Madeiraço e seus serviços.',
        projetos: 'Olá! Vi os projetos da Madeiraço e gostaria de conversar sobre minha necessidade.',
        contato: 'Olá! Gostaria de entrar em contato para solicitar um orçamento.'
    };
    
    const message = messages[section] || messages.home;
    whatsappLink.href = baseUrl + encodeURIComponent(message);
}

// Initialize auto-suggest
autoSuggestMessage();

// WhatsApp Web detection
function detectWhatsAppWeb() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    
    whatsappLinks.forEach(link => {
        if (!isMobile) {
            // For desktop, add option to use WhatsApp Web
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const originalHref = this.href;
                const webHref = originalHref.replace('wa.me', 'web.whatsapp.com/send?phone=');
                
                // Show modal with options
                showWhatsAppModal(originalHref, webHref);
            });
        }
    });
}

function showWhatsAppModal(mobileUrl, webUrl) {
    const modal = document.createElement('div');
    modal.className = 'whatsapp-modal';
    modal.innerHTML = `
        <div class="modal-overlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        ">
            <div class="modal-content" style="
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                animation: scaleIn 0.3s ease;
            ">
                <h3 style="color: #8B4513; margin-bottom: 1rem;">
                    <i class="fab fa-whatsapp" style="color: #25D366;"></i>
                    Abrir WhatsApp
                </h3>
                <p style="color: #666; margin-bottom: 2rem;">
                    Como você gostaria de abrir o WhatsApp?
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <a href="${mobileUrl}" target="_blank" class="btn btn-primary" style="text-decoration: none;">
                        <i class="fas fa-mobile-alt"></i>
                        App Mobile
                    </a>
                    <a href="${webUrl}" target="_blank" class="btn btn-secondary" style="text-decoration: none;">
                        <i class="fas fa-desktop"></i>
                        WhatsApp Web
                    </a>
                </div>
                <button class="close-modal" style="
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #999;
                    cursor: pointer;
                ">&times;</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal events
    const closeBtn = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) modal.remove();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') modal.remove();
    });
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 10000);
}

// Initialize WhatsApp Web detection
detectWhatsAppWeb();

