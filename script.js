// script.js - Updated with premium features
class VisitorCounter {
    constructor() {
        this.counterElement = document.getElementById('counter');
        this.localCount = parseInt(localStorage.getItem('visitorCount')) || 100;
        this.init();
    }

    init() {
        this.setupCounterStyles();
        this.updateCounter();
        this.bindEvents();
        this.addPremiumEffects();
    }

    async updateCounter() {
        // Check if API might exist first
        const apiProbablyExists = await this.checkApiExists();
        
        if (!apiProbablyExists) {
            // Skip API call entirely if it likely doesn't exist
            this.useLocalCounter('API not deployed yet');
            return;
        }
        
        // Try to call the live API
        try {
            // Show loading state
            this.counterElement.classList.add('loading');
            
            const response = await fetch('https://hamza-resume-function-c8fwfvgjf2a5cphv.eastasia-01.azurewebsites.net/api/visitor_counter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`API returned status: ${response.status}`);
            }
            
            const data = await response.json();
            localStorage.setItem('apiStatus', 'deployed'); // Mark API as live
            this.animateValue(data.count, false);
            
        } catch (error) {
            console.warn('⚠️ API call failed, using local counter:', error.message);
            localStorage.setItem('apiStatus', 'not-deployed'); // Mark API as not available
            this.useLocalCounter('API call failed');
        } finally {
            this.counterElement.classList.remove('loading');
        }
    }

    async checkApiExists() {
        // Simple check - if we've never seen the API work, assume it doesn't exist
        const apiStatus = localStorage.getItem('apiStatus') || 'not-deployed';
        console.log('🔍 Debug: apiStatus from localStorage is:', apiStatus);
        return apiStatus === 'deployed';
    }

    useLocalCounter(reason) {
        console.log('ℹ️ ' + reason);
        
        // Increment local counter
        this.localCount += 1;
        localStorage.setItem('visitorCount', this.localCount);
        this.displayLocalCount();
    }

    animateValue(targetValue, isLocal = true) {
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        const element = this.counterElement;
        
        const update = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
            
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = targetValue.toLocaleString();
                if (isLocal) {
                    element.classList.add('local-mode');
                } else {
                    element.classList.remove('local-mode');
                }
            }
        };
        
        requestAnimationFrame(update);
    }

    displayLocalCount() {
        this.animateValue(this.localCount, true);
    }

    setupCounterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #counter {
                font-weight: 700;
                background: linear-gradient(135deg, #7c4dff 0%, #00bcd4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                transition: all 0.3s ease;
                display: inline-block;
                min-width: 60px;
                text-align: center;
                cursor: pointer;
                font-size: 1.2em;
                position: relative;
                padding: 0.2em 0.5em;
                border-radius: 8px;
            }
            #counter:hover {
                transform: scale(1.05);
                text-shadow: 0 0 15px rgba(124, 77, 255, 0.5);
            }
            #counter.local-mode {
                background: linear-gradient(135deg, #707080 0%, #a0a0b0 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-style: italic;
            }
            #counter:active {
                transform: scale(0.95);
            }
            #counter.loading {
                opacity: 0.6;
                background: #a0a0b0;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            #counter::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                width: 0;
                height: 2px;
                background: linear-gradient(135deg, #7c4dff 0%, #00bcd4 100%);
                transition: all 0.3s ease;
                transform: translateX(-50%);
            }
            #counter:hover::after {
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        if (this.counterElement) {
            this.counterElement.title = 'Click to refresh counter';
            this.counterElement.addEventListener('click', () => {
                this.updateCounter();
                this.createRippleEffect(event);
            });
            
            // Add keyboard support for accessibility
            this.counterElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.updateCounter();
                    this.createRippleEffect(e);
                }
            });
        }
    }
    
    createRippleEffect(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
    }
    
    addPremiumEffects() {
        // Add ripple effect styles
        const rippleStyles = document.createElement('style');
        rippleStyles.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyles);
        
        // Add subtle parallax effect to background elements
        this.addParallaxEffect();
        
        // Add intersection observer for fade-in animations
        this.addScrollAnimations();
    }
    
    addParallaxEffect() {
        const bgCircles = document.querySelectorAll('.bg-circle');
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 10;
            const y = (e.clientY / window.innerHeight) * 10;
            
            bgCircles.forEach((circle, index) => {
                const speed = index === 0 ? 0.03 : 0.02;
                circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    }
    
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('come-in');
                }
            });
        }, observerOptions);
        
        // Observe all content cards
        document.querySelectorAll('.content-card, .skills-card').forEach(card => {
            observer.observe(card);
        });
        
        // Add animation styles
        const animationStyles = document.createElement('style');
        animationStyles.textContent = `
            .content-card, .skills-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .content-card.come-in, .skills-card.come-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .content-card:nth-child(2) { transition-delay: 0.1s; }
            .content-card:nth-child(3) { transition-delay: 0.2s; }
            .content-card:nth-child(4) { transition-delay: 0.3s; }
            .skills-card { transition-delay: 0.4s; }
        `;
        document.head.appendChild(animationStyles);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Premium Resume website loaded');
    new VisitorCounter();
    
    // Make counter focusable for accessibility
    const counter = document.getElementById('counter');
    if (counter) {
        counter.setAttribute('tabindex', '0');
        counter.setAttribute('role', 'button');
        counter.setAttribute('aria-label', 'Visitor counter. Click to refresh');
    }
});
