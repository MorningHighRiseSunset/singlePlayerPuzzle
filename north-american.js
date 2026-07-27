let shownBlunders = new Set();

function isMobileDevice() {
	return (
		window.innerWidth <= 768 ||
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	);
}

// Add this function to handle mobile-specific adjustments
function setupMobileLayout() {
	if (isMobileDevice()) {
		// Adjust touch areas for better mobile interaction
		document.querySelectorAll(".grid-item").forEach((item) => {
			item.style.touchAction = "manipulation";

			// Remove hover effects on mobile
			item.style.transition = "transform 0.1s";

			// Prevent double-tap zoom
			item.addEventListener("touchend", function(e) {
				e.preventDefault();
			});
		});
	}
}

// North American English translations for all user-facing text
const TRANSLATIONS = {
	invalidWord: 'Invalid word! Please try again.',
	errorInAITurn: 'Error in AI turn:',
	errorInAIPossiblePlays: 'Error finding AI possible plays:',
	aiTripleCheckFailed: '❌ AI triple-check failed: would have formed invalid word(s): ',
	aiMadeBlunder: '🤦 Oops! AI made a mistake: would have formed invalid word(s): ',
	notValidWordInDictionary: 'is not a valid word in the dictionary',
	notValidTwoLetterWord: 'is not a valid two-letter word',
	invalidWord: 'Invalid word',
	errorProcessingMove: 'Error processing move:',
	errorFetchingDefinition: 'Error fetching definition for',
	aiGhostPossiblePlays: 'AI ghost possible plays:',
	aiThinking: 'AI is thinking...',
	aiUsingGhostMove: 'AI using ghost move:',
	errorLoading: 'Error loading',
	dictionary: 'dictionary:',
	fallbackDictionary: 'Using fallback North American dictionary with limited words',
	bingoBonus: 'Bingo Bonus!',
	invalidMove: 'Invalid move found:',
	noDefinitionFound: 'No definition found for:',
	tryAllSeven: 'Try using all 7 tiles in one turn for a 50-point BINGO bonus!',
	parallelPlays: 'Parallel plays can score big by forming multiple words at once.'
};

class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.isWord = true;
    }

    // Generate all words from rack (with blanks)
    findWordsFromRack(rack, minLen = 2, maxLen = 7) {
        const results = new Set();
        const recurse = (node, path, letters, usedBlanks) => {
            if (node.isWord && path.length >= minLen && path.length <= maxLen) {
                results.add(path);
            }
            if (path.length >= maxLen) return;
            const used = new Set();
            for (let i = 0; i < letters.length; i++) {
                const letter = letters[i];
                if (used.has(letter)) continue; // Avoid duplicate branches
                used.add(letter);
                if (letter === "*") {
                    // Try all possible letters for blank
                    for (const c in node.children) {
                        recurse(node.children[c], path + c, letters.slice(0, i).concat(letters.slice(i + 1)), usedBlanks + 1);
                    }
                } else if (node.children[letter]) {
                    recurse(node.children[letter], path + letter, letters.slice(0, i).concat(letters.slice(i + 1)), usedBlanks);
                }
            }
        };
        recurse(this.root, "", rack, 0);
        return Array.from(results);
    }

    // Check if a word exists in the trie
    hasWord(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return node.isWord;
    }

    // Get all words starting with a prefix
    getWordsWithPrefix(prefix) {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) return [];
            node = node.children[char];
        }
        const results = [];
        const collect = (n, path) => {
            if (n.isWord) results.push(path);
            for (const char in n.children) {
                collect(n.children[char], path + char);
            }
        };
        collect(node, prefix);
        return results;
    }
}

class ScrabbleGame {
	constructor() {
		// Game state
		this.board = [];
		this.tiles = [];
		this.playerRack = [];
		this.computerRack = [];
		this.playerScore = 0;
		this.computerScore = 0;
		this.isPlayerTurn = true;
		this.gameOver = false;
		this.tilesRemaining = 100;

		// Dictionary
		this.dictionary = new Set();
		this.trie = null;

		// AI settings
		this.aiAggressiveness = 0.7; // 0-1 scale
		this.lastAIMessages = {
			blunder: null,
			ghost: null,
			normal: null
		};
		this.aiValidationLogSet = new Set();
		this.showAIDebug = false;

		// When the player clicks Submit/Play, we may start speech inside that gesture
		this._submitStartedSpeak = false;
		this._inlineSpeakPromise = null;
		this.wordsPlayed = new Set();

		document.body.style.overscrollBehavior = 'none';
		document.documentElement.style.overscrollBehavior = 'none';
		this.init();
	}

	pickNonRepeating(arr, type) {
		let msg;
		let tries = 0;
		do {
			msg = arr[Math.floor(Math.random() * arr.length)];
			tries++;
		} while (arr.length > 1 && msg === this.lastAIMessages[type] && tries < 10);
		this.lastAIMessages[type] = msg;
		return msg;
	}

	logAIValidation(msg) {
		if (!this.aiValidationLogSet.has(msg)) {
			if (this.showAIDebug) console.log(msg);
			this.aiValidationLogSet.add(msg);
		}
	}

	showAIGhostMove(play) {
		document.querySelectorAll('.ghost-tile').forEach(e => e.remove());

		const { word, startPos, isHorizontal } = play;
		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;
			const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
			if (cell && !cell.querySelector('.tile')) {
				const star = cell.querySelector('.center-star');
				if (star) star.style.opacity = '0.2';

				const ghost = document.createElement('div');
				ghost.className = 'tile ghost-tile';
				ghost.textContent = word[i];
				ghost.style.backgroundColor = 'rgba(100, 100, 100, 0.3)';
				ghost.style.color = '#333';
				cell.appendChild(ghost);
			}
		}
	}

	clearAIGhostMove() {
		document.querySelectorAll('.ghost-tile').forEach(e => e.remove());
		document.querySelectorAll('.center-star').forEach(star => star.style.opacity = '1');
	}

	getTileDistribution() {
		return {
			'?': 2,
			'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3,
			'H': 2, 'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6,
			'O': 8, 'P': 2, 'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4,
			'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1
		};
	}

	getLetterScores() {
		return {
			'?': 0,
			'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2,
			'H': 4, 'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1,
			'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1,
			'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
		};
	}

	initializeTiles() {
		const distribution = this.getTileDistribution();
		this.tiles = [];
		for (const [letter, count] of Object.entries(distribution)) {
			for (let i = 0; i < count; i++) {
				this.tiles.push({ letter, score: this.getLetterScores()[letter] });
			}
		}
		this.shuffleTiles();
	}

	shuffleTiles() {
		for (let i = this.tiles.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
		}
	}

	async init() {
		await this.loadDictionary();
		this.createBoard();
		this.fillRacks();
		this.setupTapPlacement();
		this.setupEventListeners();
		this.updateGameState();

		// Build the Trie for AI word generation
		this.trie = new Trie();
		for (const word of this.dictionary) {
			this.trie.insert(word.toUpperCase());
		}
	}

	createBoard() {
		const board = document.getElementById("scrabble-board");
		const premiumSquares = this.getPremiumSquares();

		for (let i = 0; i < 15; i++) {
			for (let j = 0; j < 15; j++) {
				const cell = document.createElement("div");
				cell.className = "board-cell";
				cell.dataset.row = i;
				cell.dataset.col = j;

				const premium = premiumSquares[`${i},${j}`];
				if (premium) {
					cell.classList.add(premium);
					const label = document.createElement("span");
					label.className = "premium-label";
					label.textContent = premium === "tw" ? "TW" : premium === "dw" ? "DW" : premium === "tl" ? "TL" : "DL";
					cell.appendChild(label);
				}

				if (i === 7 && j === 7) {
					const star = document.createElement("div");
					star.className = "center-star";
					star.textContent = "★";
					cell.appendChild(star);
				}

				board.appendChild(cell);
			}
		}
	}

	getPremiumSquares() {
		const premium = {};

		// Triple Word Scores (red squares)
		[
			[0, 0], [0, 7], [0, 14],
			[7, 0], [7, 14],
			[14, 0], [14, 7], [14, 14],
		].forEach(([row, col]) => (premium[`${row},${col}`] = "tw"));

		// Double Word Scores (pink squares)
		[
			[1, 1], [1, 13],
			[2, 2], [2, 12],
			[3, 3], [3, 11],
			[4, 4], [4, 10],
			[10, 4], [10, 10],
			[11, 3], [11, 11],
			[12, 2], [12, 12],
			[13, 1], [13, 13],
		].forEach(([row, col]) => (premium[`${row},${col}`] = "dw"));

		// Triple Letter Scores (dark blue squares)
		[
			[1, 5], [1, 9],
			[5, 1], [5, 5], [5, 9], [5, 13],
			[9, 1], [9, 5], [9, 9], [9, 13],
			[13, 5], [13, 9],
		].forEach(([row, col]) => (premium[`${row},${col}`] = "tl"));

		// Double Letter Scores (light blue squares)
		[
			[0, 3], [0, 11],
			[2, 6], [2, 8],
			[3, 0], [3, 7], [3, 14],
			[6, 2], [6, 6], [6, 8], [6, 12],
			[7, 3], [7, 11],
			[8, 2], [8, 6], [8, 8], [8, 12],
			[11, 0], [11, 7], [11, 14],
			[12, 6], [12, 8],
			[14, 3], [14, 11],
		].forEach(([row, col]) => (premium[`${row},${col}`] = "dl"));

		// Triple Letter Scores (closest to center - replacing DL)
		[
			[6, 6], [6, 8],
			[8, 6], [8, 8],
		].forEach(([row, col]) => (premium[`${row},${col}`] = "tl"));

		return premium;
	}

	async loadDictionary() {
		console.log("Loading North American English dictionary...");
		try {
			// Use NWL2023 - Official North American tournament dictionary (latest)
			const response = await fetch('https://raw.githubusercontent.com/scrabblewords/scrabblewords/main/words/North-American/NWL2023.txt');
			const text = await response.text();
			// NWL2023 format: one word per line, mixed case
			this.dictionary = new Set(text.split("\n").map(w => w.trim().toLowerCase()).filter(Boolean));

			console.log("North American dictionary loaded from NWL2023. Word count:", this.dictionary.size);
		} catch (error) {
			console.warn("Failed to load NWL2023 dictionary:", error);
			// Fallback: minimal dictionary
			this.dictionary = new Set([
				"the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
				"it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
				"this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
				"or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
				"so", "up", "out", "if", "about", "who", "get", "which", "go", "me"
			]);
			console.log(TRANSLATIONS.fallbackDictionary);
		}
	}

	fillRacks() {
		while (this.playerRack.length < 7 && this.tiles.length > 0) {
			this.playerRack.push(this.tiles.pop());
		}
		while (this.computerRack.length < 7 && this.tiles.length > 0) {
			this.computerRack.push(this.tiles.pop());
		}
		this.tilesRemaining = this.tiles.length;
	}

	setupTapPlacement() {
		let selectedTile = null;
		let selectedCell = null;

		document.querySelectorAll('.rack-tile').forEach(tile => {
			tile.addEventListener('click', () => {
				if (selectedTile) selectedTile.classList.remove('selected');
				selectedTile = tile;
				tile.classList.add('selected');
			});
		});

		document.querySelectorAll('.board-cell').forEach(cell => {
			cell.addEventListener('click', () => {
				if (selectedTile && !cell.querySelector('.tile')) {
					if (selectedCell) selectedCell.classList.remove('selected');
					selectedCell = cell;
					cell.classList.add('selected');
				}
			});
		});
	}

	setupEventListeners() {
		document.getElementById('submit-btn').addEventListener('click', () => this.submitMove());
		document.getElementById('shuffle-btn').addEventListener('click', () => this.shuffleRack());
		document.getElementById('skip-btn').addEventListener('click', () => this.skipTurn());
		document.getElementById('return-btn').addEventListener('click', () => this.returnTiles());
	}

	submitMove() {
		// Implementation for submitting a move
		console.log("Submit move clicked");
	}

	shuffleRack() {
		for (let i = this.playerRack.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.playerRack[i], this.playerRack[j]] = [this.playerRack[j], this.playerRack[i]];
		}
		this.renderRack();
	}

	skipTurn() {
		this.isPlayerTurn = false;
		this.updateGameState();
		setTimeout(() => this.makeAIMove(), 1000);
	}

	returnTiles() {
		// Return tiles from board to rack
		this.renderRack();
	}

	renderRack() {
		const rackElement = document.getElementById('player-rack');
		rackElement.innerHTML = '';
		this.playerRack.forEach(tile => {
			const tileElement = document.createElement('div');
			tileElement.className = 'tile rack-tile';
			tileElement.textContent = tile.letter;
			tileElement.dataset.letter = tile.letter;
			rackElement.appendChild(tileElement);
		});
	}

	updateGameState() {
		document.getElementById('player-score').textContent = this.playerScore;
		document.getElementById('computer-score').textContent = this.computerScore;
		document.getElementById('tiles-remaining').textContent = this.tilesRemaining;
		this.renderRack();
	}

	async makeAIMove() {
		if (this.gameOver) return;

		console.log(TRANSLATIONS.aiThinking);
		const plays = this.findAIPossiblePlays(this.computerRack);

		if (plays.length === 0) {
			console.log("No valid plays found, skipping turn");
			this.isPlayerTurn = true;
			this.updateGameState();
			return;
		}

		// Sort plays by score and quality
		plays.sort((a, b) => {
			const scoreDiff = b.score - a.score;
			if (scoreDiff !== 0) return scoreDiff;
			return b.quality - a.quality;
		});

		// Select best play
		const bestPlay = plays[0];
		console.log(TRANSLATIONS.aiUsingGhostMove, bestPlay.word, "at", bestPlay.startPos, bestPlay.isHorizontal ? "horizontal" : "vertical", "score:", bestPlay.score);

		// Show ghost move briefly
		this.showAIGhostMove(bestPlay);
		await new Promise(resolve => setTimeout(resolve, 1500));
		this.clearAIGhostMove();

		// Execute the play
		this.executePlay(bestPlay);
		this.computerScore += bestPlay.score;
		this.fillRacks();
		this.isPlayerTurn = true;
		this.updateGameState();
	}

	findAIPossiblePlays(rack) {
		const plays = [];
		const seen = new Set();

		// Find anchor points (cells adjacent to existing tiles)
		const anchors = this.findAnchors();

		// Generate plays from anchors
		for (const anchor of anchors) {
			const anchorPlays = this.generatePlaysFromAnchor(rack, anchor, seen);
			plays.push(...anchorPlays);
		}

		// If no anchor plays, try open space plays
		if (plays.length === 0) {
			const openSpacePlays = this.findOpenSpacePlays(rack, seen);
			plays.push(...openSpacePlays);
		}

		// If still no plays, try desperation plays
		if (plays.length === 0) {
			const desperationPlays = this.findDesperationPlays(rack, seen);
			plays.push(...desperationPlays);
		}

		return plays;
	}

	findAnchors() {
		const anchors = [];
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				if (this.board[row][col]) {
					// Add adjacent empty cells as anchors
					const adjacent = [
						[row - 1, col], [row + 1, col],
						[row, col - 1], [row, col + 1]
					];
					for (const [r, c] of adjacent) {
						if (r >= 0 && r < 15 && c >= 0 && c < 15 && !this.board[r][c]) {
							anchors.push({ row: r, col: c });
						}
					}
				}
			}
		}
		return anchors;
	}

	generatePlaysFromAnchor(rack, anchor, seen) {
		const plays = [];
		// Simplified implementation - in full version would generate all valid plays
		return plays;
	}

	findOpenSpacePlays(rack, seen) {
		const plays = [];
		// Simplified implementation
		return plays;
	}

	findDesperationPlays(rack, seen) {
		const plays = [];
		// Simplified implementation
		return plays;
	}

	executePlay(play) {
		const { word, startPos, isHorizontal } = play;
		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;
			if (!this.board[row][col]) {
				this.board[row][col] = { letter: word[i] };
			}
		}
	}

	isValidAIPlacement(word, row, col, isHorizontal) {
		// Check if word fits on board
		if (isHorizontal) {
			if (col + word.length > 15) return false;
		} else {
			if (row + word.length > 15) return false;
		}

		// Check if word is in dictionary
		if (!this.dictionary.has(word.toLowerCase())) {
			return false;
		}

		return true;
	}

	calculatePotentialScore(word, row, col, isHorizontal) {
		// Simplified score calculation
		let score = 0;
		for (const letter of word) {
			score += this.getLetterScores()[letter] || 0;
		}
		return score;
	}

	evaluateWordQuality(word, row, col, isHorizontal) {
		// Simplified quality evaluation
		return word.length * 10;
	}

	checkAIMoveValidity(word, startPos, isHorizontal) {
		const excludedVariants = new Set([
			"atropin",
			"gooneys",
		]);

		let tempBoard = JSON.parse(JSON.stringify(this.board));
		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;
			if (!tempBoard[row][col]) {
				tempBoard[row][col] = { letter: word[i] };
			}
		}

		let invalidWords = [];
		let checkedWords = new Set();

		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;

			if (i === 0) {
				const mainWord = isHorizontal ?
					this.getHorizontalWordAt(row, col, tempBoard) :
					this.getVerticalWordAt(row, col, tempBoard);
				if (mainWord && mainWord.length > 1 &&
					(!this.dictionary.has(mainWord.toLowerCase()) || excludedVariants.has(mainWord.toLowerCase()))) {
					invalidWords.push(mainWord);
				} else if (mainWord && mainWord.length > 1) {
					checkedWords.add(mainWord);
				}
			}

			const crossWord = isHorizontal ?
				this.getVerticalWordAt(row, col, tempBoard) :
				this.getHorizontalWordAt(row, col, tempBoard);
			if (crossWord && crossWord.length > 1 && !checkedWords.has(crossWord)) {
				if (!this.dictionary.has(crossWord.toLowerCase()) || excludedVariants.has(crossWord.toLowerCase())) {
					invalidWords.push(crossWord);
				} else {
					checkedWords.add(crossWord);
				}
			}
		}

		return invalidWords.length === 0 ? { valid: true } : { valid: false, invalidWords };
	}

	getHorizontalWordAt(row, col, board) {
		let word = "";
		let startCol = col;
		while (startCol > 0 && board[row][startCol - 1]) {
			startCol--;
		}
		let currentCol = startCol;
		while (currentCol < 15 && board[row][currentCol]) {
			word += board[row][currentCol].letter;
			currentCol++;
		}
		return word;
	}

	getVerticalWordAt(row, col, board) {
		let word = "";
		let startRow = row;
		while (startRow > 0 && board[startRow - 1][col]) {
			startRow--;
		}
		let currentRow = startRow;
		while (currentRow < 15 && board[currentRow][col]) {
			word += board[currentRow][col].letter;
			currentRow++;
		}
		return word;
	}
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
	window.game = new ScrabbleGame();
});
