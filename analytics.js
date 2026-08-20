// Vercel Web Analytics initialization
// Import and inject analytics for vanilla JavaScript application
// Using esm.sh CDN for browser-compatible ES module
import { inject } from 'https://esm.sh/@vercel/analytics@2.0.1';

// Initialize Web Analytics
inject({
    mode: 'production', // Force production mode to always track
    debug: false // Set to true for debugging
});
