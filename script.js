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
                
                try {
                    const functionUrl = 'https://hamzamir-resume-app-gzgwc0d9f2csexgt.eastasia-01.azurewebsites.net/api/visitor_counter';
                    
                    const response = await fetch(functionUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    // Display the count with nice formatting
                    this.animateValue(data.total_unique_visitors);
                    
                    // Add tooltip with more info
                    this.counterElement.title = 
                        `Total Visits: ${data.total_visits.toLocaleString()}\n` +
                        `Your Visits: ${data.current_visitor_count}\n` +
                        `New Visitor: ${data.is_new_visitor ? 'Yes' : 'No'}`;
                    
                    this.counterElement.classList.remove('loading');
                    
                } catch (error) {
                    console.error('Error fetching visitor count:', error);
                    // Fallback to local storage
                    this.useLocalCounter('Using local storage due to API error');
                    this.counterElement.classList.remove('loading');
                }
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
                    }
                };
                
                requestAnimationFrame(update);
            }

            displayLocalCount() {
                this.animateValue(this.localCount);
                this.counterElement.classList.add('local-mode');
                this.counterElement.title = 'Local storage mode (API unavailable)';
            }

            setupCounterStyles() {
                // Styles are already included in the HTML head
            }

            bindEvents() {
                if (this.counterElement) {
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
            const counter = new VisitorCounter();
        }, 2 * 60 * 1000);