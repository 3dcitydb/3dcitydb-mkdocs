# Page Counter Setup Guide

This documentation site includes a privacy-friendly page counter that tracks page visits without using cookies or collecting personal information. This makes it GDPR compliant without requiring cookie notices.

## How It Works

The page counter uses one of two methods:

1. **Local Storage Counter** (Default): Stores visit counts in the browser's local storage. Privacy-friendly but counts are per-browser/device.

2. **External Counter Service**: Connects to an external analytics service that respects privacy.

## Configuration

The counter is configured in `docs/assets/javascripts/counter-config.js`. You can customize:

- Whether to show the counter on pages
- Debounce time to prevent rapid increments
- External service configuration

## Supported External Services

### 1. GoatCounter (Recommended)

[GoatCounter](https://www.goatcounter.com/) is a privacy-friendly, open-source analytics service.

```javascript
config.useLocalCounter = false;
config.apiEndpoint = 'https://yourdomain.goatcounter.com/api/v0';
```

### 2. Umami Analytics

[Umami](https://umami.is/) is an open-source, privacy-focused analytics platform.

```javascript
config.useLocalCounter = false;
config.apiEndpoint = 'https://your-umami-instance.com/api';
```

### 3. Self-Hosted Counter

You can implement your own simple counter API using the provided `counter-api.py`:

```javascript
config.useLocalCounter = false;
config.apiEndpoint = 'https://your-domain.com/counter-api';
```

#### Quick Setup with Docker

1. Build and run the counter API:

   ```bash
   docker-compose -f docker-compose.counter.yml up -d
   ```

2. Configure the counter to use your API:

   ```javascript
   config.useLocalCounter = false;
   config.apiEndpoint = 'http://localhost:5000';
   ```

#### Manual Setup

1. Install dependencies:

   ```bash
   pip install -r counter-api-requirements.txt
   ```

2. Run the API:

   ```bash
   python counter-api.py
   ```

3. The API will be available at `http://localhost:5000`

### Expected API Format

If using an external service, the API should support:

- `POST /count` - Increment counter

  ```json
  {
    "page": "/path/to/page",
    "site": "docs.3dcitydb.org"
  }
  ```

- `GET /count/{page}?site={hostname}` - Get current count

  ```json
  {
    "count": 42
  }
  ```

## Privacy Features

- **No Cookies**: Uses localStorage or server-side storage only
- **No Personal Data**: Only tracks page paths and visit counts
- **No Tracking**: Doesn't track users across pages or sessions
- **Debounced**: Prevents rapid increments from the same visitor
- **Optional**: Can be completely disabled

## Implementation Details

The counter automatically:

- Detects page navigation (including instant navigation)
- Debounces rapid page views
- Falls back gracefully if external services are unavailable
- Integrates with Material for MkDocs styling
- Emits events for custom integrations

## Disabling the Counter

To disable the counter entirely, set:

```javascript
config.showCounter = false;
```

Or remove the JavaScript files from `mkdocs.yml`:

```yaml
extra_javascript:
  # Remove these lines:
  # - assets/javascripts/page-counter.js
  # - assets/javascripts/counter-config.js
```
