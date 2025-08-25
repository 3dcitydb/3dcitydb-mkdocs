/**
 * Page Counter Configuration
 * 
 * This file allows you to configure the page counter behavior.
 * You can switch between local storage counters and external services.
 */

// Configure the page counter before it initializes
document.addEventListener('DOMContentLoaded', function() {
    if (window.PageCounter && window.PageCounter.config) {
        // Basic configuration options
        const config = window.PageCounter.config;
        
        // Use local storage counter (no external dependencies)
        config.useLocalCounter = true;
        
        // Show counter on pages
        config.showCounter = true;
        
        // Debounce time to prevent rapid increments (3 seconds)
        config.debounceTime = 3000;
        
        // Optional: Configure external counter service
        // Uncomment and configure if you want to use an external service
        /*
        config.useLocalCounter = false;
        config.apiEndpoint = 'https://your-counter-service.com/api';
        */
        
        // Optional: Configure for specific counter services
        
        // Example: GoatCounter (privacy-friendly analytics)
        /*
        config.useLocalCounter = false;
        config.apiEndpoint = 'https://yourdomain.goatcounter.com/api/v0';
        */
        
        // Example: Umami Analytics
        /*
        config.useLocalCounter = false;
        config.apiEndpoint = 'https://your-umami-instance.com/api';
        */
        
        // Example: Simple Counter API (self-hosted)
        /*
        config.useLocalCounter = false;
        config.apiEndpoint = 'https://your-domain.com/counter-api';
        */
    }
});

// Optional: Add custom styling or behavior
document.addEventListener('pageCounterUpdated', function(event) {
    const { count, pagePath } = event.detail;
    
    // Log for debugging (remove in production)
    console.debug(`Page ${pagePath} has ${count} views`);
    
    // Optional: Send to external analytics (without cookies)
    // This is just page view tracking, no personal data
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            custom_map: {
                'dimension1': count
            }
        });
    }
    */
});
