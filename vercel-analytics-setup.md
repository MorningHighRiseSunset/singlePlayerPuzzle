# Vercel Analytics Setup Guide

## Setup Process

### 1. Install the Package
```bash
npm install @vercel/analytics
```

### 2. Add the Analytics Script to HTML
For vanilla JavaScript/HTML projects, add this script before the closing `</body>` tag:

```html
<!-- Vercel Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
```

### 3. Track Custom Events in JavaScript
```javascript
// Check if analytics is available, then track events
if (typeof va !== 'undefined') {
  va('track', 'event_name', { property: 'value' });
}
```

## Key Points

**Automatic Setup:**
- The `/_vercel/insights/script.js` path is automatically served by Vercel when you deploy
- No API keys or configuration needed
- Works immediately upon deployment to Vercel

## For Different Project Types

**Next.js:**
```javascript
import { Analytics } from '@vercel/analytics/react';
// Add to your app layout
<Analytics />
```

**React:**
```javascript
import { Analytics } from '@vercel/analytics/react';
// Add to your root component
<Analytics />
```

**Vanilla JS (like your puzzle project):**
- Use the script tag method shown above

## Deployment Requirement
- Analytics only works when deployed on Vercel
- Local development won't show data in dashboard
- No additional configuration needed in Vercel dashboard

## Event Tracking
- Page views are tracked automatically
- Custom events use `va('track', 'event_name', properties)`
- Properties are optional key-value pairs for additional context

## Example Usage from Your Project

```javascript
// Language selection tracking
if (typeof va !== 'undefined') {
    va('track', 'language_selected', { language: lang });
}

// Play button tracking
if (typeof va !== 'undefined') {
    va('track', 'play_button_clicked');
}
```

This setup is the same for any website deployed on Vercel - just install the package, add the script, and deploy.
