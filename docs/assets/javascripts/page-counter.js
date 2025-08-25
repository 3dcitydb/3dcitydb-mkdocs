/**
 * Privacy-friendly page counter for 3DCityDB documentation
 * 
 * This script tracks page visits without using cookies or collecting
 * personal information, making it GDPR compliant without requiring
 * cookie notices.
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        // Default to local storage counter, can be overridden for external service
        useLocalCounter: true,
        // API endpoint for external counter service (if used)
        apiEndpoint: null,
        // Display counter on page
        showCounter: true,
        // Debounce time to prevent rapid increments (in milliseconds)
        debounceTime: 3000
    };

    // Get current page path (normalize for consistent counting)
    function getCurrentPagePath() {
        const path = window.location.pathname;
        // Remove trailing slash for consistency
        return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
    }

    // Local storage counter implementation
    function incrementLocalCounter(pagePath) {
        const key = `pageCounter_${pagePath}`;
        const lastVisit = localStorage.getItem(`${key}_lastVisit`);
        const now = Date.now();
        
        // Debounce: only count if last visit was more than debounceTime ago
        if (!lastVisit || (now - parseInt(lastVisit)) > CONFIG.debounceTime) {
            const currentCount = parseInt(localStorage.getItem(key) || '0');
            const newCount = currentCount + 1;
            localStorage.setItem(key, newCount.toString());
            localStorage.setItem(`${key}_lastVisit`, now.toString());
            return newCount;
        }
        
        return parseInt(localStorage.getItem(key) || '0');
    }

    // Get local counter value
    function getLocalCounter(pagePath) {
        const key = `pageCounter_${pagePath}`;
        return parseInt(localStorage.getItem(key) || '0');
    }

    // External API counter implementation
    async function incrementExternalCounter(pagePath) {
        if (!CONFIG.apiEndpoint) return 0;
        
        try {
            const response = await fetch(`${CONFIG.apiEndpoint}/count`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: pagePath,
                    site: window.location.hostname
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.count || 0;
            }
        } catch (error) {
            console.debug('Counter API not available, falling back to local counter');
        }
        
        return incrementLocalCounter(pagePath);
    }

    // Get external counter value
    async function getExternalCounter(pagePath) {
        if (!CONFIG.apiEndpoint) return getLocalCounter(pagePath);
        
        try {
            const response = await fetch(`${CONFIG.apiEndpoint}/count/${encodeURIComponent(pagePath)}?site=${window.location.hostname}`);
            if (response.ok) {
                const data = await response.json();
                return data.count || 0;
            }
        } catch (error) {
            console.debug('Counter API not available, using local counter');
        }
        
        return getLocalCounter(pagePath);
    }

    // Display counter on page
    function displayCounter(count, pagePath) {
        if (!CONFIG.showCounter) return;
        
        // Create counter element
        const counterElement = document.createElement('div');
        counterElement.id = 'page-counter';
        counterElement.innerHTML = `
            <div class="page-counter-container">
                <span class="page-counter-icon">👁️</span>
                <span class="page-counter-text">${count.toLocaleString()} ${count === 1 ? 'view' : 'views'}</span>
            </div>
        `;
        
        // Add CSS styles
        const style = document.createElement('style');
        style.textContent = `
            .page-counter-container {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: var(--md-default-fg-color--light);
                margin-top: 1rem;
                padding: 0.5rem 0.75rem;
                background: var(--md-default-bg-color);
                border: 1px solid var(--md-default-fg-color--lightest);
                border-radius: 0.25rem;
                transition: all 0.2s ease;
            }
            
            .page-counter-container:hover {
                color: var(--md-default-fg-color);
                border-color: var(--md-default-fg-color--light);
            }
            
            .page-counter-icon {
                opacity: 0.7;
            }
            
            .page-counter-text {
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .page-counter-container {
                    font-size: 0.8rem;
                    padding: 0.4rem 0.6rem;
                }
            }
        `;
        
        document.head.appendChild(style);
        
        // Find a good place to insert the counter
        const insertCounter = () => {
            // Try to insert after the main content title
            const title = document.querySelector('h1');
            if (title) {
                title.parentNode.insertBefore(counterElement, title.nextSibling);
                return;
            }
            
            // Fallback: insert at the beginning of main content
            const content = document.querySelector('.md-content__inner') || 
                           document.querySelector('main') || 
                           document.querySelector('article');
            if (content) {
                content.insertBefore(counterElement, content.firstChild);
            }
        };
        
        insertCounter();
    }

    // Initialize counter
    async function initCounter() {
        const pagePath = getCurrentPagePath();
        
        try {
            let count;
            
            if (CONFIG.useLocalCounter) {
                count = incrementLocalCounter(pagePath);
            } else {
                count = await incrementExternalCounter(pagePath);
            }
            
            displayCounter(count, pagePath);
            
            // Emit custom event for other scripts that might want to use the count
            window.dispatchEvent(new CustomEvent('pageCounterUpdated', {
                detail: { count, pagePath }
            }));
            
        } catch (error) {
            console.debug('Failed to initialize page counter:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCounter);
    } else {
        initCounter();
    }

    // Handle navigation in single-page applications (like Material for MkDocs)
    let currentPath = getCurrentPagePath();
    
    // Check for path changes (for instant navigation)
    const checkPathChange = () => {
        const newPath = getCurrentPagePath();
        if (newPath !== currentPath) {
            currentPath = newPath;
            // Remove old counter
            const oldCounter = document.getElementById('page-counter');
            if (oldCounter) {
                oldCounter.remove();
            }
            // Initialize new counter after a brief delay to ensure content is loaded
            setTimeout(initCounter, 100);
        }
    };
    
    // Listen for navigation events
    window.addEventListener('popstate', checkPathChange);
    
    // For Material for MkDocs instant navigation
    document.addEventListener('location-changed', checkPathChange);
    
    // Fallback: periodically check for path changes
    setInterval(checkPathChange, 1000);

    // Expose API for external configuration
    window.PageCounter = {
        config: CONFIG,
        getCurrentCount: async function(pagePath) {
            pagePath = pagePath || getCurrentPagePath();
            if (CONFIG.useLocalCounter) {
                return getLocalCounter(pagePath);
            } else {
                return await getExternalCounter(pagePath);
            }
        },
        refreshCounter: initCounter
    };

})();
