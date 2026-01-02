#!/usr/bin/env node

/**
 * Dictionary Builder for Offline Scrabble Game
 * 
 * This script converts the word list text file into a JavaScript object
 * for use in the offline game.
 * 
 * Usage:
 *   node build-dictionary.js [input-file] [output-file]
 * 
 * Example:
 *   node build-dictionary.js word_list.txt dictionary.js
 */

const fs = require('fs');
const path = require('path');

function buildDictionary(inputFile, outputFile) {
    console.log(`📖 Building dictionary from: ${inputFile}`);
    
    if (!fs.existsSync(inputFile)) {
        console.error(`❌ Error: File not found: ${inputFile}`);
        process.exit(1);
    }

    // Read word list
    const content = fs.readFileSync(inputFile, 'utf-8');
    const words = content
        .split('\n')
        .map(w => w.trim().toLowerCase())
        .filter(w => w.length > 0 && /^[a-z]+$/.test(w)); // Only valid words

    console.log(`✓ Loaded ${words.length} words`);

    // Create JavaScript object
    const dictionaryObject = {};
    words.forEach(word => {
        dictionaryObject[word] = true;
    });

    // Create JS file content
    const jsContent = `
// Offline Scrabble Dictionary
// Generated from: word_list_very_common_en_us_spelling_no_diacritic.txt
// Total words: ${words.length}
// Build date: ${new Date().toISOString()}
// 
// Usage in game:
//   OFFLINE_DICTIONARY_HASH[word.toLowerCase()] === true

const OFFLINE_DICTIONARY_HASH = ${JSON.stringify(dictionaryObject)};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OFFLINE_DICTIONARY_HASH;
}

// Quick validation function
function isValidWord(word) {
    return OFFLINE_DICTIONARY_HASH[word.toLowerCase()] === true;
}

// Stats
const DICTIONARY_STATS = {
    totalWords: ${words.length},
    buildDate: '${new Date().toISOString()}',
    language: 'en-US',
    diacriticals: false,
    rareWords: false,
    minLength: ${Math.min(...words.map(w => w.length))},
    maxLength: ${Math.max(...words.map(w => w.length))}
};

console.log(\`✓ Offline dictionary loaded: \${DICTIONARY_STATS.totalWords} words\`);
`;

    // Write output file
    fs.writeFileSync(outputFile, jsContent, 'utf-8');
    
    const fileSizeMB = fs.statSync(outputFile).size / (1024 * 1024);
    console.log(`✓ Dictionary saved to: ${outputFile}`);
    console.log(`  File size: ${fileSizeMB.toFixed(2)} MB`);
    console.log(`\n📊 Dictionary Statistics:`);
    console.log(`  Total words: ${words.length.toLocaleString()}`);
    console.log(`  Min word length: ${Math.min(...words.map(w => w.length))} chars`);
    console.log(`  Max word length: ${Math.max(...words.map(w => w.length))} chars`);
    console.log(`  Avg word length: ${(words.reduce((a, b) => a + b.length, 0) / words.length).toFixed(2)} chars`);
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
        console.log(`
Dictionary Builder for Offline Scrabble

Usage:
  node build-dictionary.js <input-file> <output-file>

Example:
  node build-dictionary.js word_list.txt dictionary.js

This tool:
1. Reads a word list text file (one word per line)
2. Validates words (a-z only, no diacriticals)
3. Creates a JavaScript module with O(1) lookup
4. Generates output as ES6 module

Output file will contain:
- OFFLINE_DICTIONARY_HASH: Object with all words
- isValidWord(): Helper function for validation
- DICTIONARY_STATS: Metadata about the dictionary
        `);
        process.exit(1);
    }

    const [inputFile, outputFile] = args;
    buildDictionary(inputFile, outputFile);
}

module.exports = { buildDictionary };
