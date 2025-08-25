# Privacy-Friendly Page Counter

This implementation provides a simple, open-source page counter that doesn't require cookie notices because it:

- **No Cookies**: Uses localStorage (client-side) or server-side storage only
- **No Personal Data**: Only tracks page paths and visit counts
- **No Cross-Site Tracking**: Doesn't track users across different sites
- **Debounced**: Prevents rapid increments from the same visitor
- **GDPR Compliant**: No personal information is collected or stored

## Features

- 👁️ **Visual Counter**: Shows view count on each page
- 🔒 **Privacy-First**: No personal data collection
- 🚀 **Fast & Lightweight**: Minimal performance impact
- 🎨 **Integrated Styling**: Matches Material for MkDocs theme
- 🔧 **Configurable**: Easy to customize or disable
- 📱 **Responsive**: Works on all device sizes
- 🔄 **SPA Support**: Handles single-page app navigation

## Quick Start

The counter is pre-configured to use local storage and will work immediately. Each visitor's browser will track page views locally.

## External Services

For centralized counting across all visitors, you can configure external services:

1. **GoatCounter** (Recommended) - Privacy-focused analytics
2. **Umami Analytics** - Open-source analytics platform
3. **Self-Hosted API** - Complete control with provided Python API

## Files

- `docs/assets/javascripts/page-counter.js` - Main counter implementation
- `docs/assets/javascripts/counter-config.js` - Configuration file
- `counter-api.py` - Optional self-hosted API server
- `docs/page-counter-setup.md` - Detailed setup documentation

## Configuration

Edit `docs/assets/javascripts/counter-config.js` to customize:

```javascript
// Use local storage (default)
config.useLocalCounter = true;
config.showCounter = true;
config.debounceTime = 3000; // 3 seconds

// Or use external service
config.useLocalCounter = false;
config.apiEndpoint = 'https://your-service.com/api';
```

## Privacy Compliance

This implementation is designed to be GDPR compliant without requiring cookie notices because:

1. **Local Storage**: When using local storage, data stays on user's device
2. **No Personal Identifiers**: Only page paths and counts are stored
3. **No Tracking**: Doesn't create user profiles or track behavior
4. **Minimal Data**: Only essential information for counting
5. **User Control**: Users can clear local storage anytime

## Browser Support

Works in all modern browsers that support:

- localStorage (IE8+)
- fetch API (or gracefully degrades)
- ES6 features (with fallbacks)

## Performance

- **Initial Load**: ~2KB JavaScript (minified)
- **Runtime**: Minimal CPU usage
- **Storage**: <1KB per 100 pages (local storage)
- **Network**: Only for external services (optional)

## Styling

The counter automatically adapts to your Material for MkDocs theme:

- Light/dark mode support
- Responsive design
- Consistent typography
- Hover effects
- Mobile-friendly sizing
