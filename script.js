// script.js - Updated with better error handling
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
            
            const response = await fetch('https://hamza-resume-function-c8fwfvgjf2a5cphv.eastasia-01.azurewebsites.net/api/visitor_counter?', {
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
                color: #d4af37;
                transition: all 0.3s ease;
                display: inline-block;
                min-width: 60px;
                text-align: center;
                cursor: pointer;
                font-size: 1.1em;
            }
            #counter:hover {
                transform: scale(1.1);
                text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
            }
            #counter.local-mode {
                color: #636e72;
                font-style: italic;
                font-size: 0.95em;
            }
            #counter:active {
                transform: scale(0.95);
            }
            #counter.loading {
                opacity: 0.6;
                color: #a0a0a0;
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        if (this.counterElement) {
            this.counterElement.title = 'Click to refresh counter';
            this.counterElement.addEventListener('click', () => {
                this.updateCounter();
            });
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Resume website loaded');
    new VisitorCounter();
});