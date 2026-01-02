/**
 * wamerican-large Dictionary - FULL VERSION
 * 
 * Source: /usr/share/dict/american-english-large (Linux wamerican-large package)
 * Loads full 657K word dictionary from nlile repository
 * 
 * NO FALLBACK - Dictionary must be loaded from nlile or game cannot proceed
 */

// Global dictionary object
let WAMERICAN_LARGE_DICTIONARY = {};

// Load full dictionary from nlile
async function loadFullDictionary() {
    try {
        const NLILE_URL = 'https://raw.githubusercontent.com/nlile/dictionary-word-list/refs/heads/master/word_list_very_common_en_us_spelling_no_diacritic.txt';
        console.log('📖 Loading wamerican-large dictionary from nlile...');
        
        const response = await fetch(NLILE_URL, { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        
        const text = await response.text();
        const words = text.split('\n');
        
        WAMERICAN_LARGE_DICTIONARY = {};
        for (const word of words) {
            const w = word.trim().toLowerCase();
            if (w) WAMERICAN_LARGE_DICTIONARY[w] = true;
        }
        
        console.log(`✓ Dictionary loaded: ${Object.keys(WAMERICAN_LARGE_DICTIONARY).length} words`);
        return true;
    } catch (error) {
        console.error('❌ Error loading dictionary:', error);
        console.error('CRITICAL: Cannot proceed without nlile dictionary');
        // NO FALLBACK - Game cannot proceed without proper dictionary
        WAMERICAN_LARGE_DICTIONARY = {};
        return false;
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFullDictionary);
} else {
    loadFullDictionary();
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WAMERICAN_LARGE_DICTIONARY };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.WAMERICAN_LARGE_DICTIONARY = WAMERICAN_LARGE_DICTIONARY;
}
