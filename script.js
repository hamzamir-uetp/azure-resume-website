// script.js - Visitor Counter with Zero Console Errors
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
        this.animatePageLoad();
    }

    async updateCounter() {
        this.counterElement.classList.add('loading');
        this.counterElement.textContent = '...';
        
        // SIMPLIFIED: Skip API check entirely to avoid console errors
        // We'll use local storage only since API isn't deployed yet
        setTimeout(() => {
            this.useLocalCounter('Using local storage counter');
            this.counterElement.classList.remove('loading');
        }, 800); // Simulate network delay for better UX
    }

    useLocalCounter(reason) {
        console.log('ℹ️ ' + reason);
        
        this.localCount += 1;
        localStorage.setItem('visitorCount', this.localCount);
        this.displayLocalCount();
    }

    animateValue(targetValue) {
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
                element.classList.add('local-mode');
            }
        };
        
        requestAnimationFrame(update);
    }

    displayLocalCount() {
        this.animateValue(this.localCount);
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
                font-family: 'Plus Jakarta Sans', sans-serif;
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
                font-style: normal;
            }
            #counter.loading::after {
                content: '...';
                animation: loadingDots 1.5s infinite;
            }
            @keyframes loadingDots {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
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

    animatePageLoad() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌐 Resume website loaded - initializing visitor counter');
    new VisitorCounter();
});

// Optional: Auto-refresh every 2 minutes
setInterval(() => {
    console.log('🔄 Auto-refreshing visitor counter');
    new VisitorCounter();
}, 2 * 60 * 1000);