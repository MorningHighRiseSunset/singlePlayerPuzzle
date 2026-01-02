#!/usr/bin/env node
/**
 * Build Dictionary from wamerican-large
 * 
 * This tool reads the Linux /usr/share/dict/american-english-large file
 * and converts it to a JavaScript dictionary module.
 * 
 * Usage:
 *   node build-wamerican-large.js /usr/share/dict/american-english-large output.js
 * 
 * Or copy from Linux system:
 *   scp user@linux-machine:/usr/share/dict/american-english-large ./american-english-large.txt
 *   node build-wamerican-large.js american-english-large.txt dictionary-wamerican.js
 */

const fs = require('fs');
const path = require('path');

function buildDictionary(inputFile, outputFile) {
	try {
		console.log(`📖 Building wamerican-large dictionary...`);
		console.log(`📂 Input file: ${inputFile}`);
		
		if (!fs.existsSync(inputFile)) {
			throw new Error(`Input file not found: ${inputFile}`);
		}

		// Read the file
		const fileContent = fs.readFileSync(inputFile, 'utf-8');
		const lines = fileContent.split('\n');

		console.log(`📝 Processing ${lines.length} lines...`);

		// Parse words
		const words = new Set();
		const stats = {
			total: 0,
			valid: 0,
			invalid: 0,
			minLength: Infinity,
			maxLength: 0,
			avgLength: 0
		};

		for (const line of lines) {
			const word = line.trim().toLowerCase();
			stats.total++;

			// Valid word: letters only (a-z), length 1-30
			if (/^[a-z]+$/.test(word) && word.length >= 1 && word.length <= 30) {
				words.add(word);
				stats.valid++;
				
				if (word.length < stats.minLength) stats.minLength = word.length;
				if (word.length > stats.maxLength) stats.maxLength = word.length;
			} else {
				stats.invalid++;
			}
		}

		stats.avgLength = stats.valid > 0 ? 
			Math.round((Array.from(words).reduce((sum, w) => sum + w.length, 0)) / stats.valid * 100) / 100 : 0;

		console.log(`✓ Parsed: ${stats.valid} valid words (${stats.invalid} invalid)`);
		console.log(`  Min length: ${stats.minLength}, Max length: ${stats.maxLength}, Avg length: ${stats.avgLength}`);

		// Build JavaScript dictionary object
		const dictObj = {};
		for (const word of words) {
			dictObj[word] = true;
		}

		// Generate JavaScript file
		const jsContent = `/**
 * wamerican-large Dictionary
 * 
 * Source: /usr/share/dict/american-english-large (Linux wamerican-large package)
 * Generated: ${new Date().toISOString()}
 * 
 * Total words: ${stats.valid}
 * Word lengths: ${stats.minLength}-${stats.maxLength} (avg: ${stats.avgLength})
 * 
 * Usage:
 *   // Dictionary available as global object WAMERICAN_LARGE_DICTIONARY
 *   const isValid = WAMERICAN_LARGE_DICTIONARY['word'] === true;
 * 
 * File size: ~${Math.round(JSON.stringify(dictObj).length / 1024 / 1024)}MB
 */

const WAMERICAN_LARGE_DICTIONARY = ${JSON.stringify(dictObj)};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { WAMERICAN_LARGE_DICTIONARY };
}

// Make available globally for browser
if (typeof window !== 'undefined') {
	window.WAMERICAN_LARGE_DICTIONARY = WAMERICAN_LARGE_DICTIONARY;
}
`;

		// Write output file
		fs.writeFileSync(outputFile, jsContent, 'utf-8');
		const outputSize = fs.statSync(outputFile).size;

		console.log(`\n✅ Dictionary built successfully!`);
		console.log(`📁 Output file: ${outputFile}`);
		console.log(`📊 File size: ${Math.round(outputSize / 1024 / 1024 * 100) / 100}MB`);
		console.log(`\n📖 Dictionary Statistics:`);
		console.log(`   Total words: ${stats.valid}`);
		console.log(`   Min length: ${stats.minLength}`);
		console.log(`   Max length: ${stats.maxLength}`);
		console.log(`   Avg length: ${stats.avgLength}`);

		// Estimate memory usage
		const memUsage = Math.round(stats.valid * 50 / 1024 / 1024 * 100) / 100; // ~50 bytes per word overhead
		console.log(`   Est. memory: ~${memUsage}MB`);

		console.log(`\n📝 Next steps:`);
		console.log(`   1. Include in HTML: <script src="${path.basename(outputFile)}"></script>`);
		console.log(`   2. Dictionary will be available as: WAMERICAN_LARGE_DICTIONARY`);
		console.log(`   3. Validate words: WAMERICAN_LARGE_DICTIONARY['word'] === true`);

	} catch (error) {
		console.error(`❌ Error: ${error.message}`);
		process.exit(1);
	}
}

// CLI argument handling
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
	console.log(`
Usage: node build-wamerican-large.js <input-file> [output-file]

Arguments:
  <input-file>   Path to american-english-large word list (required)
  [output-file]  Output JavaScript file (default: dictionary-wamerican.js)

Examples:
  # Using Linux system file directly
  node build-wamerican-large.js /usr/share/dict/american-english-large

  # Using copied file
  node build-wamerican-large.js american-english-large.txt dictionary-wamerican.js

  # Help
  node build-wamerican-large.js --help

Notes:
  - Input file should be plain text, one word per line
  - Words are filtered to a-z only, length 1-30
  - Output is a JavaScript object with words as keys
  - Dictionary size is typically ~200KB-500KB (2-3MB when processed)
	`);
	process.exit(0);
}

const inputFile = args[0];
const outputFile = args[1] || 'dictionary-wamerican.js';

buildDictionary(inputFile, outputFile);
