class ScrabbleGame {
    constructor() {
        this.board = Array(15).fill().map(() => Array(15).fill(null));
        this.tileValues = {
            'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1,
            'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3, 'Q': 10, 'R': 1,
            'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10, '*': 0
        };
        this.tileDistribution = {
            'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2, 'I': 9,
            'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2, 'Q': 1, 'R': 6,
            'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1, '*': 2
        };
        this.previousBoard = null;
        this.tiles = [];
        this.playerRack = [];
        this.aiRack = [];
        this.playerScore = 0;
        this.aiScore = 0;
        this.dictionary = new Set();
        this.currentTurn = 'player';
        this.placedTiles = [];
        this.gameEnded = false;
        this.consecutiveSkips = 0;
        this.moveHistory = [];
        this.isFirstMove = true;
        this.generateTileBag();
        this.init();
    }
    

    async aiTurn() {
        console.log("AI thinking...");
        
        // Show "AI is thinking..." message before checking moves
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'ai-thinking-message';
        thinkingMessage.textContent = 'AI is thinking...';
        thinkingMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #f0f0f0;
            padding: 10px 20px;
            border-radius: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(thinkingMessage);
        setTimeout(() => thinkingMessage.style.opacity = '1', 100);
    
        console.log("AI rack:", this.aiRack.map(t => t.letter));
        
        // Check if AI can make any valid moves
        if (!this.canAIMakeValidMove()) {
            console.log("AI has no valid moves available");
            setTimeout(() => {
                thinkingMessage.style.opacity = '0';
                setTimeout(() => {
                    thinkingMessage.remove();
                    this.skipAITurn();
                }, 300);
            }, 1000);
            return;
        }
    
        const possiblePlays = this.findAIPossiblePlays();
        console.log("Possible plays found:", possiblePlays.length);
        
        if (possiblePlays.length > 0) {
            console.log("Available plays:", possiblePlays);
            // Sort plays by score and take the best one
            const bestPlay = possiblePlays.sort((a, b) => b.score - a.score)[0];
            console.log("Choosing play:", bestPlay);
            
            // Remove thinking message before executing play
            setTimeout(() => {
                thinkingMessage.style.opacity = '0';
                setTimeout(() => {
                    thinkingMessage.remove();
                    this.executeAIPlay(bestPlay);
                }, 300);
            }, 1000);
        } else {
            console.log("AI skips turn - no valid plays found");
            setTimeout(() => {
                thinkingMessage.style.opacity = '0';
                setTimeout(() => {
                    thinkingMessage.remove();
                    this.skipAITurn();
                }, 300);
            }, 1000);
        }
    }
    
    findAIPossiblePlays() {
        const possiblePlays = [];
        const anchors = this.findAnchors();
        const availableLetters = this.aiRack.map(tile => tile.letter);
        const existingWords = this.getExistingWords();
        
        console.log("Available letters:", availableLetters);
        console.log("Anchors found:", anchors);
        console.log("Existing words:", existingWords);
    
        // If it's the first move or no tiles on board
        if (this.isFirstMove || this.board.every(row => row.every(cell => cell === null))) {
            const words = Array.from(this.dictionary);
            for (const word of words) {
                if (word.length >= 2 && word.length <= availableLetters.length) {
                    const upperWord = word.toUpperCase();
                    // Skip if word already exists on board
                    if (existingWords.includes(upperWord)) {
                        console.log(`Skipping ${upperWord} - already exists on board`);
                        continue;
                    }
                    if (this.canFormWord(word, '', '', availableLetters)) {
                        const centerPos = { row: 7, col: 7 - Math.floor(word.length / 2) };
                        if (this.isValidAIPlacement(upperWord, centerPos.row, centerPos.col, true)) {
                            possiblePlays.push({
                                word: upperWord,
                                startPos: centerPos,
                                isHorizontal: true,
                                score: this.calculatePotentialScore(upperWord, centerPos.row, centerPos.col, true)
                            });
                        }
                    }
                }
            }
        } else {
            // For subsequent moves
            anchors.forEach(anchor => {
                const hPrefix = this.getPrefix(anchor, true);
                const hSuffix = this.getSuffix(anchor, true);
                const vPrefix = this.getPrefix(anchor, false);
                const vSuffix = this.getSuffix(anchor, false);
                
                // Try all possible words from dictionary
                for (const word of this.dictionary) {
                    const upperWord = word.toUpperCase();
                    
                    // Skip if word already exists on board
                    if (existingWords.includes(upperWord)) {
                        console.log(`Skipping ${upperWord} - already exists on board`);
                        continue;
                    }
                    
                    // Check horizontal placement
                    if (this.canFormWord(upperWord, hPrefix, hSuffix, availableLetters)) {
                        const startCol = anchor.col - hPrefix.length;
                        if (this.isValidAIPlacement(upperWord, anchor.row, startCol, true)) {
                            const score = this.calculatePotentialScore(upperWord, anchor.row, startCol, true);
                            possiblePlays.push({
                                word: upperWord,
                                startPos: { row: anchor.row, col: startCol },
                                isHorizontal: true,
                                score
                            });
                            console.log(`Found valid horizontal play: ${upperWord} for ${score} points`);
                        }
                    }
                    
                    // Check vertical placement
                    if (this.canFormWord(upperWord, vPrefix, vSuffix, availableLetters)) {
                        const startRow = anchor.row - vPrefix.length;
                        if (this.isValidAIPlacement(upperWord, startRow, anchor.col, false)) {
                            const score = this.calculatePotentialScore(upperWord, startRow, anchor.col, false);
                            possiblePlays.push({
                                word: upperWord,
                                startPos: { row: startRow, col: anchor.col },
                                isHorizontal: false,
                                score
                            });
                            console.log(`Found valid vertical play: ${upperWord} for ${score} points`);
                        }
                    }
                }
            });
        }
    
        // Filter out any duplicate plays or plays with existing words
        const uniquePlays = possiblePlays.filter((play, index, self) =>
            index === self.findIndex((p) => (
                p.word === play.word &&
                p.startPos.row === play.startPos.row &&
                p.startPos.col === play.startPos.col &&
                p.isHorizontal === play.isHorizontal
            ))
        );
    
        console.log(`Found ${uniquePlays.length} possible plays after filtering`);
        return uniquePlays;
    }

    findSimpleWords(letters) {
        const words = new Set();
        const letterCount = {};
        
        // Count available letters
        letters.forEach(letter => {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        });
    
        // Check each word in dictionary
        for (const word of this.dictionary) {
            if (word.length >= 2 && word.length <= letters.length) {
                const upperWord = word.toUpperCase();
                const tempCount = {...letterCount};
                let canForm = true;
                
                // Check if we have all needed letters
                for (const letter of upperWord) {
                    if (!tempCount[letter] || tempCount[letter] === 0) {
                        canForm = false;
                        break;
                    }
                    tempCount[letter]--;
                }
                
                if (canForm) {
                    words.add(upperWord);
                }
            }
        }
        
        return Array.from(words);
    }
    

    findAnchors() {
        const anchors = [];
        
        // If it's the first move, return center square
        if (this.isFirstMove) {
            return [{row: 7, col: 7}];
        }
    
        // Find all positions adjacent to existing tiles
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (!this.board[row][col] && this.hasAdjacentTile(row, col)) {
                    anchors.push({row, col});
                }
            }
        }
        return anchors;
    }

    hasAdjacentTile(row, col) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        return directions.some(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            return (
                newRow >= 0 && newRow < 15 &&
                newCol >= 0 && newCol < 15 &&
                this.board[newRow][newCol] !== null
            );
        });
    }
    
    // Function to find possible words at an anchor point
    findPossibleWordsAtAnchor(anchor, isHorizontal, availableLetters) {
        const plays = [];
        const prefix = this.getPrefix(anchor, isHorizontal);
        const suffix = this.getSuffix(anchor, isHorizontal);
        
        // Get all possible words from dictionary that can be formed
        // with available letters and must connect with existing tiles
        for (const word of this.dictionary) {
            if (this.canFormWord(word, prefix, suffix, availableLetters)) {
                const play = this.createPlay(word, anchor, isHorizontal, prefix, suffix);
                if (play) {
                    plays.push(play);
                }
            }
        }
    
        return plays;
    }

    getPrefix(anchor, isHorizontal) {
        let prefix = '';
        let {row, col} = anchor;
        
        if (isHorizontal) {
            col--;
            while (col >= 0 && this.board[row][col]) {
                prefix = this.board[row][col].letter + prefix;
                col--;
            }
        } else {
            row--;
            while (row >= 0 && this.board[row][col]) {
                prefix = this.board[row][col].letter + prefix;
                row--;
            }
        }
        return prefix;
    }

    getSuffix(anchor, isHorizontal) {
        let suffix = '';
        let {row, col} = anchor;
        
        if (isHorizontal) {
            col++;
            while (col < 15 && this.board[row][col]) {
                suffix += this.board[row][col].letter;
                col++;
            }
        } else {
            row++;
            while (row < 15 && this.board[row][col]) {
                suffix += this.board[row][col].letter;
                row++;
            }
        }
        return suffix;
    }

    canAIMakeValidMove() {
        if (this.aiRack.length === 0) return false;
        
        const availableLetters = this.aiRack.map(tile => tile.letter);
        console.log("Checking possible moves with letters:", availableLetters);
        
        // If it's the first move, check if we can form any valid word
        if (this.isFirstMove) {
            for (const word of this.dictionary) {
                if (word.length >= 2 && word.length <= availableLetters.length) {
                    if (this.canFormWord(word, '', '', availableLetters)) {
                        console.log("Found possible first move:", word);
                        return true;
                    }
                }
            }
            return false;
        }
    
        // Find anchor points for subsequent moves
        const anchors = this.findAnchors();
        if (anchors.length === 0) return false;
    
        // Check each anchor point for possible plays
        for (const anchor of anchors) {
            // Try horizontal placements
            const hPrefix = this.getPrefix(anchor, true);
            const hSuffix = this.getSuffix(anchor, true);
            
            // Try vertical placements
            const vPrefix = this.getPrefix(anchor, false);
            const vSuffix = this.getSuffix(anchor, false);
            
            // Check if we can form any valid words at this anchor
            for (const word of this.dictionary) {
                if (this.canFormWord(word, hPrefix, hSuffix, availableLetters) ||
                    this.canFormWord(word, vPrefix, vSuffix, availableLetters)) {
                    console.log("Found possible play:", word);
                    return true;
                }
            }
        }
        
        console.log("No valid moves found");
        return false;
    }
    

    canFormWord(word, prefix, suffix, availableLetters) {
        // Convert everything to uppercase for comparison
        word = word.toUpperCase();
        prefix = prefix.toUpperCase();
        suffix = suffix.toUpperCase();
        
        // For first move or when starting fresh, we don't need prefix/suffix check
        if (prefix === '' && suffix === '') {
            const letterCount = {};
            // Count available letters
            availableLetters.forEach(letter => {
                letterCount[letter] = (letterCount[letter] || 0) + 1;
            });
            
            // Check if we have enough letters for the word
            for (const letter of word) {
                if (!letterCount[letter] || letterCount[letter] === 0) {
                    return false;
                }
                letterCount[letter]--;
            }
            return true;
        }
    
        // For subsequent moves, check if word contains prefix and suffix
        if (!word.includes(prefix) || !word.includes(suffix)) {
            return false;
        }
    
        // Get the part of the word we need to form (excluding prefix and suffix)
        const neededPart = word
            .replace(prefix, '')
            .replace(suffix, '')
            .split('');
    
        const availableLettersCopy = [...availableLetters];
        
        return neededPart.every(letter => {
            const index = availableLettersCopy.indexOf(letter);
            if (index === -1) return false;
            availableLettersCopy.splice(index, 1);
            return true;
        });
    }
    

    createPlay(word, anchor, isHorizontal, prefix, suffix) {
        const startPos = {
            row: anchor.row - (isHorizontal ? 0 : prefix.length),
            col: anchor.col - (isHorizontal ? prefix.length : 0)
        };
    
        // Verify the play is valid and calculate score
        const score = this.calculatePlayScore(word, startPos, isHorizontal);
        
        return {
            word,
            startPos,
            isHorizontal,
            score
        };
    }

    executeAIPlay(play) {
        const {word, startPos, isHorizontal, score} = play;
        console.log("AI playing:", word, "at", startPos, isHorizontal ? "horizontally" : "vertically");
    
        // Store the previous board state
        this.previousBoard = JSON.parse(JSON.stringify(this.board));
    
        // Create the placedTiles array for the AI's move
        this.placedTiles = Array.from(word).map((letter, i) => ({
            row: isHorizontal ? startPos.row : startPos.row + i,
            col: isHorizontal ? startPos.col + i : startPos.col,
            tile: {
                letter: letter,
                value: this.tileValues[letter],
                id: `ai_${letter}_${Date.now()}_${i}`
            }
        }));
    
        // Double-check all cross words before placing
        if (!this.isValidAIPlacement(word, startPos.row, startPos.col, isHorizontal)) {
            console.log("Invalid placement detected during execution, skipping turn");
            this.skipAITurn();
            return;
        }
    
        return new Promise(async (resolve) => {
            // Start placing tiles with animation
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                const row = isHorizontal ? startPos.row : startPos.row + i;
                const col = isHorizontal ? startPos.col + i : startPos.col;
                
                if (!this.board[row][col]) {
                    const tileIndex = this.aiRack.findIndex(t => t.letter === letter);
                    if (tileIndex !== -1) {
                        const tile = {
                            letter: this.aiRack[tileIndex].letter,
                            value: this.aiRack[tileIndex].value || this.tileValues[this.aiRack[tileIndex].letter],
                            id: `ai_${letter}_${Date.now()}_${i}`
                        };
                        
                        // Create animated tile element
                        const animatedTile = document.createElement('div');
                        animatedTile.className = 'tile animated-tile';
                        animatedTile.innerHTML = `
                            ${tile.letter}
                            <span class="points">${tile.value}</span>
                        `;
                        
                        // Get target cell position
                        const targetCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                        const targetRect = targetCell.getBoundingClientRect();
                        
                        // Animation setup
                        animatedTile.style.cssText = `
                            position: fixed;
                            top: -50px;
                            left: ${targetRect.left}px;
                            transform: rotate(-180deg);
                            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                            z-index: 1000;
                        `;
                        
                        document.body.appendChild(animatedTile);
                        
                        // Animate tile placement
                        await new Promise(resolve => {
                            setTimeout(() => {
                                animatedTile.style.top = `${targetRect.top}px`;
                                animatedTile.style.transform = 'rotate(0deg)';
                                
                                setTimeout(() => {
                                    // Add bounce effect
                                    animatedTile.style.transform = 'rotate(0deg) scale(1.2)';
                                    setTimeout(() => {
                                        animatedTile.style.transform = 'rotate(0deg) scale(1)';
                                    }, 100);
                                }, 800);
    
                                // Place tile on board
                                setTimeout(() => {
                                    targetCell.classList.add('tile-placed');
                                    animatedTile.remove();
                                    
                                    // Remove tile from AI rack and place on board
                                    this.aiRack.splice(tileIndex, 1);
                                    this.board[row][col] = tile;
                                    this.renderAIRack();
    
                                    // Create permanent tile element
                                    const permanentTile = document.createElement('div');
                                    permanentTile.className = 'tile';
                                    permanentTile.style.cssText = `
                                        background: linear-gradient(145deg, #ffffff, #f0f0f0);
                                        color: #000; /* Ensure text is black */
                                    `;
                                    permanentTile.innerHTML = `
                                        ${tile.letter}
                                        <span class="points" style="color: #000;">${tile.value}</span>
                                    `;
                                    
                                    // Clear cell and add permanent tile
                                    targetCell.innerHTML = '';
                                    targetCell.appendChild(permanentTile);
                                    
                                    setTimeout(() => {
                                        targetCell.classList.remove('tile-placed');
                                    }, 500);
                                    
                                    resolve();
                                }, 1000);
                            }, 200);
                        });
                        
                        // Delay between letters
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
    
            // Update game state after all animations complete
            setTimeout(() => {
                // Get all formed words and calculate total score
                const formedWords = this.getFormedWords();
                let totalScore = 0;
                let wordsList = [];
    
                formedWords.forEach(wordInfo => {
                    const { word, startPos, direction } = wordInfo;
                    const wordScore = this.calculateWordScore(
                        word,
                        startPos.row,
                        startPos.col,
                        direction === 'horizontal'
                    );
                    totalScore += wordScore;
                    wordsList.push(word);
                    console.log(`Word formed: ${word} for ${wordScore} points`);
                });
    
                // Add bonus for using all 7 tiles
                if (word.length === 7) {
                    totalScore += 50;
                    console.log("Added 50 point bonus for using all 7 tiles");
                }
    
                const wordsDisplay = wordsList.join(' & ');
                console.log(`Total score for move: ${totalScore}`);
    
                this.aiScore += totalScore;
                this.isFirstMove = false;
                this.consecutiveSkips = 0;
                this.currentTurn = 'player';
                this.addToMoveHistory('Computer', wordsDisplay, totalScore);
                
                // Clear the placed tiles array after scoring
                this.placedTiles = [];
                
                // Refill racks and update display
                this.fillRacks();
                this.updateGameState();
                resolve();
            }, 500);
        });
    }
    
    
    calculateWordScore(word, startRow, startCol, isHorizontal) {
        let wordScore = 0;
        let wordMultiplier = 1;
    
        for (let i = 0; i < word.length; i++) {
            const row = isHorizontal ? startRow : startRow + i;
            const col = isHorizontal ? startCol + i : startCol;
            const tile = this.board[row][col];
            let letterScore = tile.value;
    
            // Only apply premium squares if this tile was just placed
            if (!this.previousBoard || !this.previousBoard[row][col]) {
                const premium = this.getPremiumSquareType(row, col);
                if (premium === 'dl') letterScore *= 2;
                if (premium === 'tl') letterScore *= 3;
                if (premium === 'dw') wordMultiplier *= 2;
                if (premium === 'tw') wordMultiplier *= 3;
            }
    
            wordScore += letterScore;
        }
    
        return wordScore * wordMultiplier;
    }
    
    

    findBestMove() {
        const possibleMoves = this.findPossibleMoves();
        if (possibleMoves.length === 0) return null;
    
        // Sort moves by:
        // 1. Score (highest first)
        // 2. Word length (longer words preferred)
        // 3. Position (prefer center positions)
        return possibleMoves.sort((a, b) => {
            // First compare scores
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            
            // If scores are equal, prefer longer words
            if (b.word.length !== a.word.length) {
                return b.word.length - a.word.length;
            }
            
            // If lengths are equal, prefer positions closer to center
            const centerDistance = (pos) => {
                const centerRow = 7, centerCol = 7;
                return Math.abs(pos.row - centerRow) + Math.abs(pos.col - centerCol);
            };
            
            return centerDistance(a) - centerDistance(b);
        })[0];
    }

    findPossibleMoves() {
        const moves = [];
        const letters = this.aiRack.map(tile => tile.letter);
        
        // Get all possible words that can be formed with the rack
        const possibleWords = this.findPossibleWords(letters);
    
        // Find valid placements for each word
        for (const word of possibleWords) {
            // Try horizontal placements
            for (let row = 0; row < 15; row++) {
                for (let col = 0; col <= 15 - word.length; col++) {
                    if (this.isValidAIPlacement(word, row, col, true)) {
                        const score = this.calculatePotentialScore(word, row, col, true);
                        moves.push({ word, row, col, horizontal: true, score });
                    }
                }
            }
    
            // Try vertical placements
            for (let row = 0; row <= 15 - word.length; row++) {
                for (let col = 0; col < 15; col++) {
                    if (this.isValidAIPlacement(word, row, col, false)) {
                        const score = this.calculatePotentialScore(word, row, col, false);
                        moves.push({ word, row, col, horizontal: false, score });
                    }
                }
            }
        }
    
        return moves;
    }

    findPossibleWords(letters) {
        const possibleWords = new Set();
        const maxLength = Math.min(15, letters.length);
    
        // Convert letters to lowercase for dictionary matching
        const lowerLetters = letters.map(l => l.toLowerCase());
        
        // Try each word in the dictionary
        for (const word of this.dictionary) {
            if (word.length >= 2 && word.length <= maxLength) {
                // Check if we can make this word with our letters
                const letterCount = {};
                let canForm = true;
                
                // Count available letters
                lowerLetters.forEach(letter => {
                    letterCount[letter] = (letterCount[letter] || 0) + 1;
                });
                
                // Check if we have enough letters for the word
                for (const letter of word) {
                    if (!letterCount[letter] || letterCount[letter] === 0) {
                        canForm = false;
                        break;
                    }
                    letterCount[letter]--;
                }
                
                if (canForm) {
                    possibleWords.add(word.toUpperCase());
                }
            }
        }
    
        return Array.from(possibleWords);
    }

    isValidAIPlacement(word, startRow, startCol, horizontal) {
        // First check for abbreviations and minimum length
        if (word.length < 2 || this.isAbbreviation(word)) {
            console.log(`Skipping ${word} - too short or is an abbreviation`);
            return false;
        }
    
        // Keep track of words already on the board
        const existingWords = this.getExistingWords();
        if (existingWords.includes(word)) {
            console.log(`Word ${word} already exists on the board`);
            return false;
        }
    
        // Check basic boundary conditions
        if (horizontal) {
            if (startCol < 0 || startCol + word.length > 15 || startRow < 0 || startRow > 14) {
                return false;
            }
        } else {
            if (startRow < 0 || startRow + word.length > 15 || startCol < 0 || startCol > 14) {
                return false;
            }
        }
    
        // Handle first move
        if (this.isFirstMove) {
            const centerRow = 7, centerCol = 7;
            if (horizontal) {
                if (startRow !== centerRow) return false;
                if (startCol > centerCol || startCol + word.length <= centerCol) return false;
            } else {
                if (startCol !== centerCol) return false;
                if (startRow > centerRow || startRow + word.length <= centerRow) return false;
            }
            return true;
        }
    
        let hasAdjacentTile = false;
        let touchesExistingTile = false;
        let tempBoard = JSON.parse(JSON.stringify(this.board));
    
        // Collect all words that would be formed by this placement
        let formedWords = new Set();
        formedWords.add(word.toLowerCase());
    
        // Place the word temporarily and check all formed words
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
    
            // Check if current cell is occupied
            if (tempBoard[row][col]) {
                if (tempBoard[row][col].letter !== word[i]) {
                    return false;
                }
                touchesExistingTile = true;
                continue;
            }
    
            tempBoard[row][col] = { letter: word[i] };
    
            // Check each direction for formed words
            let crossWord = '';
            if (horizontal) {
                // Check vertical word formed at this position
                let upWord = '';
                let downWord = '';
                
                // Check upward
                let r = row - 1;
                while (r >= 0 && (tempBoard[r][col] || this.board[r][col])) {
                    upWord = (tempBoard[r][col] || this.board[r][col]).letter + upWord;
                    r--;
                }
                
                // Check downward
                r = row + 1;
                while (r < 15 && (tempBoard[r][col] || this.board[r][col])) {
                    downWord += (tempBoard[r][col] || this.board[r][col]).letter;
                    r++;
                }
                
                crossWord = upWord + word[i] + downWord;
            } else {
                // Check horizontal word formed at this position
                let leftWord = '';
                let rightWord = '';
                
                // Check leftward
                let c = col - 1;
                while (c >= 0 && (tempBoard[row][c] || this.board[row][c])) {
                    leftWord = (tempBoard[row][c] || this.board[row][c]).letter + leftWord;
                    c--;
                }
                
                // Check rightward
                c = col + 1;
                while (c < 15 && (tempBoard[row][c] || this.board[row][c])) {
                    rightWord += (tempBoard[row][c] || this.board[row][c]).letter;
                    c++;
                }
                
                crossWord = leftWord + word[i] + rightWord;
            }
    
            if (crossWord.length > 1) {
                formedWords.add(crossWord.toLowerCase());
            }
    
            // Check for adjacent tiles
            const adjacentPositions = [
                [row - 1, col],
                [row + 1, col],
                [row, col - 1],
                [row, col + 1]
            ];
    
            for (const [adjRow, adjCol] of adjacentPositions) {
                if (adjRow >= 0 && adjRow < 15 && adjCol >= 0 && adjCol < 15) {
                    if (this.board[adjRow][adjCol]) {
                        hasAdjacentTile = true;
                    }
                }
            }
        }
    
        // Verify all formed words are valid
        for (const formedWord of formedWords) {
            if (!this.dictionary.has(formedWord)) {
                console.log(`Invalid word would be formed: ${formedWord}`);
                return false;
            }
        }
    
        // Must connect to existing tiles (except first move)
        return hasAdjacentTile || touchesExistingTile;
    }
    
    
    
    
    isAbbreviation(word) {
        // Common abbreviations to explicitly exclude
        const commonAbbreviations = new Set([
            'USA', 'UK', 'TV', 'FBI', 'CIA', 'NASA', 'DNA', 'PhD',
            'Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Sr', 'Jr', 'Corp', 'Inc', 'Ltd',
            'ATM', 'PC', 'USB', 'RAM', 'ROM', 'CEO', 'CFO', 'CTO', 'HR', 'VP'
        ]);
    
        // Convert to uppercase for checking
        const upperWord = word.toUpperCase();
    
        // Check if word is in our abbreviations list
        if (commonAbbreviations.has(upperWord)) {
            console.log(`${word} is a known abbreviation - skipping`);
            return true;
        }
    
        // Remove the all-caps check for short words since many are valid
        // Check for mixed case with periods (e.g., "Ph.D.")
        if (word.includes('.')) {
            console.log(`${word} contains periods - likely an abbreviation`);
            return true;
        }
    
        return false;
    }
    
    getExistingWords() {
        const words = new Set();
        
        // Check horizontal words
        for (let row = 0; row < 15; row++) {
            let word = '';
            for (let col = 0; col < 15; col++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                } else if (word.length > 1) {
                    words.add(word);
                    word = '';
                } else {
                    word = '';
                }
            }
            if (word.length > 1) {
                words.add(word);
            }
        }
    
        // Check vertical words
        for (let col = 0; col < 15; col++) {
            let word = '';
            for (let row = 0; row < 15; row++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                } else if (word.length > 1) {
                    words.add(word);
                    word = '';
                } else {
                    word = '';
                }
            }
            if (word.length > 1) {
                words.add(word);
            }
        }
    
        const existingWords = Array.from(words);
        console.log("Existing words on board:", existingWords);
        return existingWords;
    }
    
    calculatePotentialScore(word, startRow, startCol, horizontal) {
        let totalScore = 0;
        let tempBoard = JSON.parse(JSON.stringify(this.board));
        
        // First, place the word temporarily on our temp board
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            if (!tempBoard[row][col]) {
                tempBoard[row][col] = {
                    letter: word[i],
                    value: this.tileValues[word[i]]
                };
            }
        }
    
        // Get all words formed by this placement
        const formedWords = [];
        
        // Check main word (including any extensions)
        let mainWord = '';
        let mainWordScore = 0;
        let mainWordMultiplier = 1;
        
        // Find start of main word
        let startPos = horizontal ? startCol : startRow;
        let currentPos = horizontal ? startCol : startRow;
        
        while (currentPos > 0 && tempBoard[horizontal ? startRow : currentPos - 1][horizontal ? currentPos - 1 : startCol]) {
            currentPos--;
        }
        startPos = currentPos;
        
        // Build main word and calculate score
        while (currentPos < 15 && tempBoard[horizontal ? startRow : currentPos][horizontal ? currentPos : startCol]) {
            const letter = tempBoard[horizontal ? startRow : currentPos][horizontal ? currentPos : startCol].letter;
            mainWord += letter;
            
            // Calculate score for this letter
            let letterScore = this.tileValues[letter];
            const isNewTile = currentPos >= startPos && currentPos < startPos + word.length;
            
            if (isNewTile) {
                const premium = this.getPremiumSquareType(
                    horizontal ? startRow : currentPos,
                    horizontal ? currentPos : startCol
                );
                if (premium === 'dl') letterScore *= 2;
                if (premium === 'tl') letterScore *= 3;
                if (premium === 'dw') mainWordMultiplier *= 2;
                if (premium === 'tw') mainWordMultiplier *= 3;
            }
            
            mainWordScore += letterScore;
            currentPos++;
        }
        
        if (mainWord.length > 1) {
            formedWords.push({
                word: mainWord,
                score: mainWordScore * mainWordMultiplier
            });
        }
    
        // Check for cross words at each position of the new word
        let parallelWordCount = 0; // Count words formed parallel to existing words
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            
            if (!this.board[row][col]) { // Only check for cross words at new tile positions
                let crossWord = '';
                let crossWordScore = 0;
                let crossWordMultiplier = 1;
                let currentCrossPos = horizontal ? row : col;
                
                // Find start of cross word
                while (currentCrossPos > 0 && tempBoard[horizontal ? currentCrossPos - 1 : row][horizontal ? col : currentCrossPos - 1]) {
                    currentCrossPos--;
                }
                
                // Build cross word and calculate score
                while (currentCrossPos < 15 && tempBoard[horizontal ? currentCrossPos : row][horizontal ? col : currentCrossPos]) {
                    const letter = tempBoard[horizontal ? currentCrossPos : row][horizontal ? col : currentCrossPos].letter;
                    crossWord += letter;
                    
                    let letterScore = this.tileValues[letter];
                    if (currentCrossPos === (horizontal ? row : col)) {
                        const premium = this.getPremiumSquareType(row, col);
                        if (premium === 'dl') letterScore *= 2;
                        if (premium === 'tl') letterScore *= 3;
                        if (premium === 'dw') crossWordMultiplier *= 2;
                        if (premium === 'tw') crossWordMultiplier *= 3;
                    }
                    
                    crossWordScore += letterScore;
                    currentCrossPos++;
                }
                
                if (crossWord.length > 1) {
                    // Check if this word is formed parallel to existing words
                    if (this.hasParallelWord(row, col, horizontal)) {
                        parallelWordCount++;
                    }
                    
                    formedWords.push({
                        word: crossWord,
                        score: crossWordScore * crossWordMultiplier
                    });
                }
            }
        }
    
        // Sum up all word scores
        totalScore = formedWords.reduce((sum, wordObj) => sum + wordObj.score, 0);
        
        // Add bonus for using all 7 tiles
        if (word.length === 7) {
            totalScore += 50;
            console.log("Added 50 point bonus for using all 7 tiles");
        }
    
        // Apply scoring adjustments for better word placement
        let adjustedScore = totalScore;
    
        // Penalize multiple short words and parallel placements
        formedWords.forEach(wordObj => {
            // Penalty for very short words (2-3 letters)
            if (wordObj.word.length <= 3) {
                adjustedScore -= Math.floor(wordObj.score * 0.5);
                
                // Extra penalty for creating multiple short words
                if (formedWords.length > 2) {
                    adjustedScore -= 10;
                }
            }
        });
    
        // Penalty for excessive parallel word formation
        if (parallelWordCount > 1) {
            adjustedScore -= parallelWordCount * 15;
        }
    
        // Bonus for longer words
        if (word.length > 5) {
            adjustedScore += word.length * 2;
        }
    
        // Bonus for intersecting words rather than parallel words
        if (formedWords.length > 1 && parallelWordCount === 0) {
            adjustedScore += 20;
        }
    
        // Ensure score doesn't go negative
        adjustedScore = Math.max(adjustedScore, 1);
    
        console.log("Words formed:", formedWords.map(w => `${w.word} (${w.score})`).join(', '));
        console.log(`Original score: ${totalScore}, Adjusted score: ${adjustedScore}`);
        return adjustedScore;
    }
    
    // Add this helper method to the ScrabbleGame class
    hasParallelWord(row, col, isHorizontal) {
        // Check if there are words parallel to the current placement
        if (isHorizontal) {
            // Check above and below for vertical words
            return (row > 0 && this.board[row - 1][col] !== null) ||
                   (row < 14 && this.board[row + 1][col] !== null);
        } else {
            // Check left and right for horizontal words
            return (col > 0 && this.board[row][col - 1] !== null) ||
                   (col < 14 && this.board[row][col + 1] !== null);
        }
    }
    
    
    

    playAIMove(move) {
        console.log("AI playing move:", move);
        const { word, row, col, horizontal, score } = move;
    
        // Place tiles on board
        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;
            const letter = word[i];
    
            // Find matching tile in AI's rack
            const tileIndex = this.aiRack.findIndex(t => t.letter === letter);
            if (tileIndex !== -1) {
                const tile = this.aiRack.splice(tileIndex, 1)[0];
                this.board[currentRow][currentCol] = tile;
    
                // Update visual board
                const cell = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
                cell.innerHTML = `
                    ${tile.letter}
                    <span class="points">${tile.value}</span>
                `;
            }
        }
    
        // Update game state
        this.aiScore += score;
        this.isFirstMove = false;
        this.currentTurn = 'player';
        this.addToMoveHistory('Computer', word, score);
        this.fillRacks();
        this.updateGameState();
    }

    skipAITurn() {
        console.log("AI skipping turn");
        this.consecutiveSkips++;
        this.currentTurn = 'player';
        
        if (this.consecutiveSkips >= 4) {
            this.checkGameEnd();
        } else {
            // Optionally record skip in move history
            this.addToMoveHistory('Computer', 'SKIP', 0);
            this.updateGameState();
        }
    }

    generateTileBag() {
        this.tiles = [];
        for (const [letter, count] of Object.entries(this.tileDistribution)) {
            for (let i = 0; i < count; i++) {
                this.tiles.push({
                    letter,
                    value: this.tileValues[letter],
                    id: `${letter}_${i}`
                });
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
        this.setupDragAndDrop();
        this.setupEventListeners();
        this.updateGameState();
    }

    createBoard() {
        const board = document.getElementById('scrabble-board');
        const premiumSquares = this.getPremiumSquares();
    
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
    
                // Add this to verify cell creation
                console.log(`Creating cell at [${i}, ${j}]`);
    
                // Test click events on each cell
                cell.addEventListener('click', () => {
                    console.log(`Clicked cell [${i}, ${j}]`);
                });
    
                const key = `${i},${j}`;
                if (premiumSquares[key]) {
                    cell.classList.add(premiumSquares[key]);
                }
    
                board.appendChild(cell);
            }
        }
    }
    

    getPremiumSquares() {
        const premium = {};
        
        // Triple Word Scores (red squares)
        [
            [0,0], [0,7], [0,14],
            [7,0], [7,14],
            [14,0], [14,7], [14,14]
        ].forEach(([row, col]) => premium[`${row},${col}`] = 'tw');
        
        // Double Word Scores (pink squares)
        [
            [1,1], [1,13],
            [2,2], [2,12],
            [3,3], [3,11],
            [4,4], [4,10],
            [10,4], [10,10],
            [11,3], [11,11],
            [12,2], [12,12],
            [13,1], [13,13]
        ].forEach(([row, col]) => premium[`${row},${col}`] = 'dw');
    
        // Triple Letter Scores (dark blue squares)
        [
            [1,5], [1,9],
            [5,1], [5,5], [5,9], [5,13],
            [9,1], [9,5], [9,9], [9,13],
            [13,5], [13,9]
        ].forEach(([row, col]) => premium[`${row},${col}`] = 'tl');
    
        // Double Letter Scores (light blue squares)
        [
            [0,3], [0,11],
            [2,6], [2,8],
            [3,0], [3,7], [3,14],
            [6,2], [6,6], [6,8], [6,12],
            [7,3], [7,11],
            [8,2], [8,6], [8,8], [8,12],
            [11,0], [11,7], [11,14],
            [12,6], [12,8],
            [14,3], [14,11]
        ].forEach(([row, col]) => premium[`${row},${col}`] = 'dl');
    
        return premium;
    }
    

    async loadDictionary() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt');
            const text = await response.text();
            this.dictionary = new Set(text.toLowerCase().split('\n'));
            console.log('Dictionary loaded successfully');
        } catch (error) {
            console.error('Error loading dictionary:', error);
            this.dictionary = new Set(['scrabble', 'game', 'play', 'word']);
        }
    }

    fillRacks() {
        while (this.playerRack.length < 7 && this.tiles.length > 0) {
            this.playerRack.push(this.tiles.pop());
        }
        while (this.aiRack.length < 7 && this.tiles.length > 0) {
            this.aiRack.push(this.tiles.pop());
        }
        this.renderRack();
        this.updateTilesCount();
    }

    renderRack() {
        const rack = document.getElementById('tile-rack');
        rack.innerHTML = '';
        this.playerRack.forEach((tile, index) => {
            const tileElement = this.createTileElement(tile, index);
            rack.appendChild(tileElement);
        });
    }

    createTileElement(tile, index) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.draggable = true;
        tileElement.dataset.index = index;
        tileElement.dataset.id = tile.id;
        tileElement.innerHTML = `
            ${tile.letter}
            <span class="points">${tile.value}</span>
        `;
        return tileElement;
    }

    setupDragAndDrop() {
        this.setupDragListeners();
        this.setupDropListeners();
        this.setupRackDropZone();
    }

    setupRackDropZone() {
        const rack = document.getElementById('tile-rack');
        
        rack.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.currentTurn === 'player') {
                e.currentTarget.classList.add('rack-droppable');
            }
        });
    
        rack.addEventListener('dragleave', (e) => {
            e.currentTarget.classList.remove('rack-droppable');
        });
    
        rack.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('rack-droppable');
    
            if (this.currentTurn !== 'player') return;
    
            // Find the dragged tile element
            const draggedTile = document.querySelector('.tile.dragging');
            if (!draggedTile) return;
    
            // Find the placed tile by looking through all board cells
            const boardCell = draggedTile.closest('.board-cell');
            if (!boardCell) return;
    
            const row = parseInt(boardCell.dataset.row);
            const col = parseInt(boardCell.dataset.col);
    
            // Find the corresponding placed tile
            const placedTileIndex = this.placedTiles.findIndex(t => 
                t.row === row && t.col === col
            );
    
            if (placedTileIndex !== -1) {
                const placedTile = this.placedTiles[placedTileIndex];
                
                // Return the tile to the rack
                this.playerRack.push(placedTile.tile);
                
                // Clear the board cell
                this.board[row][col] = null;
                boardCell.innerHTML = '';
                
                // Remove from placed tiles array
                this.placedTiles.splice(placedTileIndex, 1);
                
                // Update the rack display
                this.renderRack();
                
                // Update valid placement highlights
                this.highlightValidPlacements();
            }
        });
    }
    
    
    

    setupDragListeners() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('tile') && this.currentTurn === 'player') {
                e.target.classList.add('dragging');
                const tileData = {
                    index: e.target.dataset.index,
                    id: e.target.dataset.id
                };
                e.dataTransfer.setData('text/plain', e.target.dataset.index);

                console.log('Drag started:', tileData);
                
                e.dataTransfer.effectAllowed = 'move';

                const dragImage = e.target.cloneNode(true);
                dragImage.style.opacity = '0.8';
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                document.body.appendChild(dragImage);
                
                e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
                
                setTimeout(() => {
                    document.body.removeChild(dragImage);
                }, 0);
            }
        });
    
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('tile')) {
                e.target.classList.remove('dragging');
            }
        });
    }
    
    setupDropListeners() {
        document.querySelectorAll('.board-cell').forEach(cell => {
            // Add this to ensure the cell is droppable
            cell.setAttribute('droppable', 'true');
            
            cell.addEventListener('dragenter', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Drag entered cell');
            });
    
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                console.log(`Dragover cell [${row}, ${col}]`);
                
                // Explicitly show this is a valid drop target
                e.dataTransfer.dropEffect = 'move';
                
                if (this.currentTurn === 'player') {
                    cell.classList.add('droppable-hover');
                }
            });
    
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Drop attempted');
                
                cell.classList.remove('droppable-hover');
    
                if (this.currentTurn !== 'player') {
                    console.log('Not player turn');
                    return;
                }
    
                const tileIndex = e.dataTransfer.getData('text/plain');
                console.log('Tile index from drop:', tileIndex);
                
                const tile = this.playerRack[tileIndex];
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
    
                console.log('Drop details:', {
                    tileIndex,
                    tile,
                    row,
                    col,
                    isFirstMove: this.isFirstMove,
                    currentTurn: this.currentTurn
                });
    
                if (this.isValidPlacement(row, col, tile)) {
                    this.placeTile(tile, row, col);
                } else {
                    const validationDetails = {
                        isOccupied: this.board[row][col] !== null,
                        distanceToWords: this.getMinDistanceToWords(row, col),
                        isFirstMove: this.isFirstMove,
                        placedTilesLength: this.placedTiles.length
                    };
                    console.log('Placement validation failed:', validationDetails);
                    alert('Invalid placement! Check placement rules.');
                }
            });
    
            cell.addEventListener('dragleave', (e) => {
                e.preventDefault();
                cell.classList.remove('droppable-hover');
            });
        });
    }
    
    isValidPlacement(row, col, tile) {
        console.log('Checking placement validity:', {row, col, tile});
        
        // Check if cell is already occupied
        if (this.board[row][col]) {
            console.log('Cell is occupied');
            return false;
        }
    
        // If it's first move and no tiles placed yet
        if (this.isFirstMove && this.placedTiles.length === 0) {
            console.log('First move check:', row === 7 && col === 7);
            return row === 7 && col === 7;
        }
    
        // After first tile, check distance to existing tiles
        const distance = this.getMinDistanceToWords(row, col);
        console.log('Distance to existing words:', distance);
        
        // More permissive distance check for tiles near the center
        if (Math.abs(row - 7) <= 1 && Math.abs(col - 7) <= 1) {
            return true;
        }
        
        return distance <= 5;
    }
    

highlightValidPlacements() {
    // Remove existing highlights
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.classList.remove('valid-placement', 'placement-close', 'placement-medium', 'placement-far');
    });

    // Only highlight if it's player's turn
    if (this.currentTurn !== 'player') return;

    // Check each empty cell
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 15; col++) {
            if (!this.board[row][col]) {
                const distance = this.getMinDistanceToWords(row, col);
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                
                if (distance <= 5) {
                    cell.classList.add('valid-placement');
                }
            }
        }
    }
}

    
    getMinDistanceToWords(row, col) {
        let minDistance = Infinity;
        
        // Check distance to all occupied cells
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.board[i][j]) {
                    const distance = Math.abs(row - i) + Math.abs(col - j);
                    minDistance = Math.min(minDistance, distance);
                }
            }
        }
        
        return minDistance;
    }

    checkValidStartingPosition(row, col) {
        // On first move, any position is valid as long as it forms valid words
        if (this.isFirstMove) {
            return true;
        }
    
        // Check if this position is adjacent to or part of any existing word
        return this.checkAdjacentTiles(row, col) || 
               this.checkExistingWordConnection(row, col);
    }
    

    checkExistingWordConnection(row, col) {
        // Check if this position would be part of an existing word
        // Check horizontal
        const leftTile = col > 0 && this.board[row][col - 1];
        const rightTile = col < 14 && this.board[row][col + 1];
        const isPartOfHorizontalWord = leftTile || rightTile;
    
        // Check vertical
        const aboveTile = row > 0 && this.board[row - 1][col];
        const belowTile = row < 14 && this.board[row + 1][col];
        const isPartOfVerticalWord = aboveTile || belowTile;
    
        return isPartOfHorizontalWord || isPartOfVerticalWord;
    }
    
    checkAdjacentTiles(row, col) {
        const directions = [
            [-1, 0],  // up
            [1, 0],   // down
            [0, -1],  // left
            [0, 1]    // right
        ];
    
        return directions.some(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            return (
                newRow >= 0 && newRow < 15 &&
                newCol >= 0 && newCol < 15 &&
                this.board[newRow][newCol] !== null
            );
        });
    }

checkAdjacentTiles(row, col) {
    const directions = [
        [-1, 0],  // up
        [1, 0],   // down
        [0, -1],  // left
        [0, 1]    // right
    ];

    return directions.some(([dx, dy]) => {
        const newRow = row + dx;
        const newCol = col + dy;
        return (
            newRow >= 0 && newRow < 15 &&
            newCol >= 0 && newCol < 15 &&
            this.board[newRow][newCol] !== null
        );
    });
}

placeTile(tile, row, col) {
    if (this.board[row][col]) {
        alert("This cell is already occupied!");
        return;
    }

    if (tile.letter === '*') {
        const letterSelectionDialog = document.createElement('div');
        letterSelectionDialog.className = 'letter-selection-dialog';
        letterSelectionDialog.innerHTML = `
            <div class="dialog-content">
                <h3>Choose a letter for the blank tile</h3>
                <div class="letter-grid">
                    ${Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map(letter => `
                        <button class="letter-choice">${letter}</button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles for the dialog
        const style = document.createElement('style');
        style.textContent = `
            .letter-selection-dialog {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .dialog-content {
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
            }
            .letter-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 5px;
                margin-top: 15px;
            }
            .letter-choice {
                padding: 10px;
                border: 1px solid #ccc;
                background: #f0f0f0;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.2s;
            }
            .letter-choice:hover {
                background: #e0e0e0;
                transform: scale(1.1);
            }
            h3 {
                text-align: center;
                margin-top: 0;
                color: #333;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(letterSelectionDialog);

        // Handle letter selection
        const buttons = letterSelectionDialog.querySelectorAll('.letter-choice');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const selectedLetter = button.textContent;
                
                // Create a new tile object with the selected letter but keep point value as 0
                const blankTile = {
                    ...tile,
                    letter: selectedLetter,
                    originalLetter: '*',
                    value: 0
                };

                // Create proper tile object for the board
                const placedTile = {
                    letter: selectedLetter,
                    value: 0,
                    id: tile.id,
                    isBlank: true
                };

                this.board[row][col] = placedTile;
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const tileIndex = this.playerRack.indexOf(tile);

                // Create and add the tile element
                const tileElement = document.createElement('div');
                tileElement.className = 'tile';
                tileElement.draggable = true;
                tileElement.dataset.index = tileIndex;
                tileElement.dataset.id = tile.id;
                tileElement.innerHTML = `
                    ${selectedLetter}
                    <span class="points">0</span>
                    <span class="blank-indicator">★</span>
                `;

                // Add drag events to the tile
                tileElement.addEventListener('dragstart', (e) => {
                    if (this.currentTurn === 'player') {
                        e.target.classList.add('dragging');
                        const cell = e.target.closest('.board-cell');
                        const row = cell.dataset.row;
                        const col = cell.dataset.col;
                        e.dataTransfer.setData('text/plain', `${row},${col}`);
                    }
                });
                
                tileElement.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                });

                // Clear the cell and add the new tile
                cell.innerHTML = '';
                cell.appendChild(tileElement);

                // Remove tile from rack
                if (tileIndex > -1) {
                    this.playerRack.splice(tileIndex, 1);
                }

                // Add to placed tiles
                this.placedTiles.push({ 
                    tile: placedTile,
                    row: row,
                    col: col 
                });

                // Update rack display
                this.renderRack();

                // Remove the dialog
                letterSelectionDialog.remove();
                
                // Update valid placement highlights
                this.highlightValidPlacements();
            });
        });
    } else {
        // Normal tile placement (non-blank tile)
        // Create proper tile object for the board
        const placedTile = {
            letter: tile.letter,
            value: tile.value || this.tileValues[tile.letter],
            id: tile.id
        };

        this.board[row][col] = placedTile;
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const tileIndex = this.playerRack.indexOf(tile);

        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.draggable = true;
        tileElement.dataset.index = tileIndex;
        tileElement.dataset.id = tile.id;
        tileElement.innerHTML = `
            ${tile.letter}
            <span class="points">${placedTile.value}</span>
        `;

        // Add drag functionality to the placed tile
        tileElement.addEventListener('dragstart', (e) => {
            if (this.currentTurn === 'player') {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.index);
            }
        });

        tileElement.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });

        // Clear the cell and add the new tile
        cell.innerHTML = '';
        cell.appendChild(tileElement);
        
        // Remove tile from rack
        if (tileIndex > -1) {
            this.playerRack.splice(tileIndex, 1);
        }
        
        // Add to placed tiles
        this.placedTiles.push({ 
            tile: placedTile,
            row: row,
            col: col 
        });
        
        // Update rack display
        this.renderRack();
        
        // Update valid placement highlights
        this.highlightValidPlacements();
    }
}



    
    areTilesConnected() {
        if (this.placedTiles.length <= 1) return true;
    
        const sortedTiles = [...this.placedTiles].sort((a, b) => {
            if (a.row === b.row) {
                return a.col - b.col;
            }
            return a.row - b.row;
        });
    
        // Check if tiles are in same row or column
        const isHorizontal = sortedTiles.every(t => t.row === sortedTiles[0].row);
        const isVertical = sortedTiles.every(t => t.col === sortedTiles[0].col);
    
        if (!isHorizontal && !isVertical) return false;
    
        // Check for gaps between placed tiles
        for (let i = 1; i < sortedTiles.length; i++) {
            if (isHorizontal) {
                // Allow gaps if there are existing tiles in between
                const prevCol = sortedTiles[i-1].col;
                const currCol = sortedTiles[i].col;
                for (let col = prevCol + 1; col < currCol; col++) {
                    if (!this.board[sortedTiles[0].row][col]) {
                        return false;
                    }
                }
            } else { // isVertical
                // Allow gaps if there are existing tiles in between
                const prevRow = sortedTiles[i-1].row;
                const currRow = sortedTiles[i].row;
                for (let row = prevRow + 1; row < currRow; row++) {
                    if (!this.board[row][sortedTiles[0].col]) {
                        return false;
                    }
                }
            }
        }
    
        return true;
    }

    resetPlacedTiles() {
        this.placedTiles.forEach(({tile, row, col}) => {
            this.board[row][col] = null;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.innerHTML = '';
            this.playerRack.push(tile);
        });
        
        this.placedTiles = [];
        this.renderRack();
    }

    validateWord() {
        if (this.placedTiles.length === 0) return false;
        
        // Check if tiles are properly connected
        if (!this.areTilesConnected()) return false;
    
        // Get all formed words
        const words = new Set();
        
        // Get main word
        const mainWord = this.getMainWord();
        if (mainWord.length > 1) {
            words.add(mainWord.toLowerCase());
        }
    
        // Check each placed tile for cross words
        for (const {row, col} of this.placedTiles) {
            // Get both horizontal and vertical words at this position
            const horizontalWord = this.getWordAt(row, col, true);
            const verticalWord = this.getWordAt(row, col, false);
            
            if (horizontalWord && horizontalWord.length > 1) {
                words.add(horizontalWord.toLowerCase());
            }
            if (verticalWord && verticalWord.length > 1) {
                words.add(verticalWord.toLowerCase());
            }
        }
    
        // If no valid words are formed, return false
        if (words.size === 0) {
            console.log('No valid words formed');
            return false;
        }
    
        // Validate each word
        let allWordsValid = true;
        words.forEach(word => {
            if (!this.dictionary.has(word.toLowerCase())) {
                console.log(`Invalid word: ${word}`);
                allWordsValid = false;
            }
        });
    
        return allWordsValid;
    }
    
    

    getCrossWords(row, col) {
        const words = [];
        const horizontal = this.getWordAt(row, col, true);
        const vertical = this.getWordAt(row, col, false);
        
        if (horizontal) words.push(horizontal);
        if (vertical) words.push(vertical);
        
        return words;
    }

    getWordAt(row, col, isHorizontal) {
        let word = '';
        let startPos = isHorizontal ? col : row;
        
        // Find start of word
        while (startPos > 0 && this.board[isHorizontal ? row : startPos - 1][isHorizontal ? startPos - 1 : col]) {
            startPos--;
        }
        
        // Build complete word
        let currentPos = startPos;
        while (currentPos < 15 && this.board[isHorizontal ? row : currentPos][isHorizontal ? currentPos : col]) {
            const tile = this.board[isHorizontal ? row : currentPos][isHorizontal ? currentPos : col];
            word += tile.letter;
            currentPos++;
        }
        
        return word.length > 1 ? word : null;
    }
    
    
    getFormedWords() {
        const words = new Set();
        const existingWords = new Set(); // Track words that existed before this move
    
        // First, get words that existed before this move
        // Store the words from the previous board state
        if (this.previousBoard) {
            for (let row = 0; row < 15; row++) {
                let word = '';
                for (let col = 0; col < 15; col++) {
                    if (this.previousBoard[row][col]) {
                        word += this.previousBoard[row][col].letter;
                    } else if (word.length > 1) {
                        existingWords.add(word);
                        word = '';
                    } else {
                        word = '';
                    }
                }
                if (word.length > 1) {
                    existingWords.add(word);
                }
            }
    
            // Check vertical existing words
            for (let col = 0; col < 15; col++) {
                let word = '';
                for (let row = 0; row < 15; row++) {
                    if (this.previousBoard[row][col]) {
                        word += this.previousBoard[row][col].letter;
                    } else if (word.length > 1) {
                        existingWords.add(word);
                        word = '';
                    } else {
                        word = '';
                    }
                }
                if (word.length > 1) {
                    existingWords.add(word);
                }
            }
        }
    
        // Now find new words
        // Check horizontal words
        for (let row = 0; row < 15; row++) {
            let word = '';
            let startCol = 0;
            let containsNewTile = false;
    
            for (let col = 0; col < 15; col++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                    // Check if this position contains a newly placed tile
                    if (this.placedTiles.some(t => t.row === row && t.col === col)) {
                        containsNewTile = true;
                    }
                } else {
                    if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                        words.add({
                            word,
                            startPos: { row, col: startCol },
                            direction: 'horizontal'
                        });
                    }
                    word = '';
                    startCol = col + 1;
                    containsNewTile = false;
                }
            }
            if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                words.add({
                    word,
                    startPos: { row, col: startCol },
                    direction: 'horizontal'
                });
            }
        }
    
        // Check vertical words
        for (let col = 0; col < 15; col++) {
            let word = '';
            let startRow = 0;
            let containsNewTile = false;
    
            for (let row = 0; row < 15; row++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                    // Check if this position contains a newly placed tile
                    if (this.placedTiles.some(t => t.row === row && t.col === col)) {
                        containsNewTile = true;
                    }
                } else {
                    if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                        words.add({
                            word,
                            startPos: { row: startRow, col },
                            direction: 'vertical'
                        });
                    }
                    word = '';
                    startRow = row + 1;
                    containsNewTile = false;
                }
            }
            if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                words.add({
                    word,
                    startPos: { row: startRow, col },
                    direction: 'vertical'
                });
            }
        }
    
        console.log('Existing words:', Array.from(existingWords));
        console.log('New words formed:', Array.from(words).map(w => w.word));
        return Array.from(words);
    }
    
    

    getCrossWord(row, col) {
        let verticalWord = '';
        let horizontalWord = '';
    
        // Get vertical word
        let currentRow = row;
        while (currentRow > 0 && this.board[currentRow - 1][col]) currentRow--;
        while (currentRow < 15 && this.board[currentRow][col]) {
            verticalWord += this.board[currentRow][col].letter;
            currentRow++;
        }
    
        // Get horizontal word
        let currentCol = col;
        while (currentCol > 0 && this.board[row][currentCol - 1]) currentCol--;
        while (currentCol < 15 && this.board[row][currentCol]) {
            horizontalWord += this.board[row][currentCol].letter;
            currentCol++;
        }
    
        // Return the longer word if both exist, or the one that exists
        if (verticalWord.length > 1 && horizontalWord.length > 1) {
            return verticalWord.length > horizontalWord.length ? verticalWord : horizontalWord;
        }
        if (verticalWord.length > 1) return verticalWord;
        if (horizontalWord.length > 1) return horizontalWord;
        return '';
    }

    getLetterPosition(letter, index) {
        const tiles = [...this.placedTiles].sort((a, b) => {
            if (a.row === b.row) {
                return a.col - b.col;
            }
            return a.row - b.row;
        });
    
        if (index < tiles.length) {
            return {
                row: tiles[index].row,
                col: tiles[index].col
            };
        }
        return null;
    }

    getMainWord() {
        if (this.placedTiles.length === 0) return '';
    
        const sortedTiles = [...this.placedTiles].sort((a, b) => {
            if (a.row === b.row) {
                return a.col - b.col;
            }
            return a.row - b.row;
        });
    
        // Determine if word is horizontal or vertical based on placed tiles
        const isHorizontal = sortedTiles.every(t => t.row === sortedTiles[0].row);
        let row = sortedTiles[0].row;
        let col = sortedTiles[0].col;
    
        // Find the start of the word
        if (isHorizontal) {
            while (col > 0 && this.board[row][col - 1]) {
                col--;
            }
        } else {
            while (row > 0 && this.board[row - 1][col]) {
                row--;
            }
        }
    
        // Build the complete word including existing tiles
        let word = '';
        let currentRow = row;
        let currentCol = col;
    
        if (isHorizontal) {
            while (currentCol < 15 && this.board[row][currentCol]) {
                word += this.board[row][currentCol].letter;
                currentCol++;
            }
        } else {
            while (currentRow < 15 && this.board[currentRow][col]) {
                word += this.board[currentRow][col].letter;
                currentRow++;
            }
        }
    
        return word;
    }
    
    calculateScore() {
        let totalScore = 0;
        const words = this.getFormedWords();
        
        words.forEach(wordObj => {
            let wordScore = 0;
            let wordMultiplier = 1;
            const { word, startPos, direction } = wordObj;
            const isHorizontal = direction === 'horizontal';
            
            // Calculate score for each letter in the word
            for (let i = 0; i < word.length; i++) {
                const currentRow = isHorizontal ? startPos.row : startPos.row + i;
                const currentCol = isHorizontal ? startPos.col + i : startPos.col;
                const currentTile = this.board[currentRow][currentCol];
                
                // Safety check for tile existence
                if (!currentTile) {
                    console.error('Tile not found at position:', { row: currentRow, col: currentCol });
                    continue;
                }
    
                // Base letter score
                let letterScore = currentTile.value || this.tileValues[currentTile.letter];
                
                // Only apply premium squares for newly placed tiles
                const isNewTile = this.placedTiles.some(t => 
                    t.row === currentRow && t.col === currentCol
                );
                
                if (isNewTile) {
                    const premium = this.getPremiumSquareType(currentRow, currentCol);
                    if (premium === 'dl') letterScore *= 2;
                    if (premium === 'tl') letterScore *= 3;
                    if (premium === 'dw') wordMultiplier *= 2;
                    if (premium === 'tw') wordMultiplier *= 3;
                }
                
                wordScore += letterScore;
            }
            
            // Apply word multiplier after summing all letters
            wordScore *= wordMultiplier;
            totalScore += wordScore;
    
            console.log(`Scored word "${word}" for ${wordScore} points`);
        });
        
        // Bonus for using all 7 tiles
        if (this.placedTiles.length === 7) {
            totalScore += 50;
            console.log("Added 50 point bonus for using all 7 tiles");
        }
        
        console.log(`Total score for move: ${totalScore}`);
        return totalScore;
    }
    
    
    

    findWordPosition(word) {
        // Search the board for the starting position of the word
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                // Check horizontal
                if (col <= 15 - word.length) {
                    let matches = true;
                    for (let i = 0; i < word.length; i++) {
                        if (!this.board[row][col + i] || 
                            this.board[row][col + i].letter !== word[i]) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        return { startRow: row, startCol: col, isHorizontal: true };
                    }
                }
                
                // Check vertical
                if (row <= 15 - word.length) {
                    let matches = true;
                    for (let i = 0; i < word.length; i++) {
                        if (!this.board[row + i][col] || 
                            this.board[row + i][col].letter !== word[i]) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        return { startRow: row, startCol: col, isHorizontal: false };
                    }
                }
            }
        }
        return null;
    }
    

    getPremiumSquareType(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('tw')) return 'tw';
        if (cell.classList.contains('dw')) return 'dw';
        if (cell.classList.contains('tl')) return 'tl';
        if (cell.classList.contains('dl')) return 'dl';
        return null;
    }

    async playWord() {
        if (this.placedTiles.length === 0) {
            alert('Please place some tiles first!');
            return;
        }
    
        if (!this.areTilesConnected()) {
            alert('Tiles must be connected and in a straight line!');
            this.resetPlacedTiles();
            return;
        }
    
        if (this.validateWord()) {
            const score = this.calculateScore();
            this.playerScore += score;
            this.isFirstMove = false;
            const word = this.getMainWord();
            this.placedTiles = [];
            this.fillRacks();
            this.consecutiveSkips = 0;
            this.currentTurn = 'ai';
            
            this.addToMoveHistory('Player', word, score);
            this.updateGameState();
    
            if (!this.checkGameEnd()) {
                await this.aiTurn();
            }
        } else {
            alert('Invalid word! Please try again.');
            this.resetPlacedTiles();
        }
    }

    updateGameState() {
        this.updateScores();
        this.updateTilesCount();
        this.updateTurnIndicator();
    }

    updateScores() {
        document.getElementById('player-score').textContent = this.playerScore;
        document.getElementById('computer-score').textContent = this.aiScore;
    }

    updateTilesCount() {
        document.getElementById('tiles-count').textContent = this.tiles.length;
    }

    updateTurnIndicator() {
        const turnDisplay = document.getElementById('current-turn') || this.createTurnIndicator();
        turnDisplay.textContent = `Current Turn: ${this.currentTurn === 'player' ? 'Your' : 'Computer\'s'} Turn`;
        turnDisplay.className = this.currentTurn === 'player' ? 'player-turn' : 'ai-turn';
    }

    createTurnIndicator() {
        const turnDisplay = document.createElement('div');
        turnDisplay.id = 'current-turn';
        document.querySelector('.info-panel').prepend(turnDisplay);
        return turnDisplay;
    }

    checkGameEnd() {
        if (this.tiles.length === 0 && 
            (this.playerRack.length === 0 || this.aiRack.length === 0)) {
            this.gameEnded = true;
            this.announceWinner();
            return true;
        }

        if (this.consecutiveSkips >= 4) {
            this.gameEnded = true;
            this.announceWinner();
            return true;
        }

        return false;
    }

    announceWinner() {
        const winner = this.playerScore > this.aiScore ? 'Player' : 'Computer';
        const finalScore = Math.max(this.playerScore, this.aiScore);
    
        let winOverlay = document.querySelector('.win-overlay');
        if (!winOverlay) {
            winOverlay = document.createElement('div');
            winOverlay.className = 'win-overlay';
            // Add 'lose' class only if player lost
            if (winner === 'Computer') {
                winOverlay.classList.add('lose');
            }
            document.body.appendChild(winOverlay);
    
            const messageBox = document.createElement('div');
            messageBox.className = 'win-message';
            winOverlay.appendChild(messageBox);
        }
    
        // Get the message box
        const messageBox = winOverlay.querySelector('.win-message');
        messageBox.innerHTML = `
            <h2>Game Over!</h2>
            <p>${winner} wins with ${finalScore} points!</p>
            <p>Final Scores:</p>
            <p>Player: ${this.playerScore}</p>
            <p>Computer: ${this.aiScore}</p>
            <button onclick="location.reload()">Play Again</button>
        `;
    
        // Show the overlay with animation
        requestAnimationFrame(() => {
            winOverlay.classList.add('active');
            messageBox.classList.add('celebrate');
        });
    
        // Add confetti effect
        this.createConfettiEffect();
    }
    
    createConfettiEffect() {
        // Different effects for win vs lose
        const isWinner = this.playerScore > this.aiScore;
        
        if (isWinner) {
            // Happy emojis and colorful confetti for winning
            const emojis = ['🎉', '🎊', '🏆', '⭐', '🌟', '💫', '✨'];
            const colors = ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#87CEEB'];
            const particleCount = 150;
    
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                
                // Randomly choose between emoji or confetti
                const isEmoji = Math.random() > 0.7; // 30% chance of emoji
                
                if (isEmoji) {
                    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    particle.style.fontSize = `${20 + Math.random() * 20}px`;
                } else {
                    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.width = '10px';
                    particle.style.height = '10px';
                }
    
                particle.style.cssText += `
                    position: fixed;
                    pointer-events: none;
                    left: ${Math.random() * 100}vw;
                    top: -20px;
                    opacity: 1;
                    transform: rotate(${Math.random() * 360}deg);
                    animation: win-particle-fall ${3 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(particle);
    
                particle.addEventListener('animationend', () => {
                    particle.remove();
                });
            }
        } else {
            // Taunting emojis for losing
            const emojis = ['😂', '🤣', '😝', '😜', '😋', '😏', '🤪', '😎', '🤭', '😈'];
            const emojiCount = 50;
    
            for (let i = 0; i < emojiCount; i++) {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.cssText = `
                    position: fixed;
                    font-size: ${20 + Math.random() * 20}px;
                    pointer-events: none;
                    left: ${Math.random() * 100}vw;
                    top: -40px;
                    opacity: 1;
                    transform: rotate(${Math.random() * 360}deg);
                    animation: lose-particle-fall ${3 + Math.random() * 2}s linear forwards;
                `;
                document.body.appendChild(emoji);
    
                emoji.addEventListener('animationend', () => {
                    emoji.remove();
                });
            }
        }
    }
    
    

    addToMoveHistory(player, word, score) {
        this.moveHistory.push({
            player,
            word,
            score,
            timestamp: new Date()
        });
        this.updateMoveHistory();
    }

    updateMoveHistory() {
        const historyDisplay = document.getElementById('move-history') || this.createMoveHistoryDisplay();
        historyDisplay.innerHTML = '<h3>Move History</h3>' + 
            this.moveHistory.map(move => 
                `<div class="move">
                    ${move.player}: "${move.word}" for ${move.score} points
                </div>`
            ).join('');
    }

    createMoveHistoryDisplay() {
        const historyDisplay = document.createElement('div');
        historyDisplay.id = 'move-history';
        document.querySelector('.info-panel').appendChild(historyDisplay);
        return historyDisplay;
    }

    renderAIRack() {
        const rack = document.getElementById('ai-rack');
        rack.innerHTML = '';
        this.aiRack.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            tileElement.innerHTML = `
                ${tile.letter}
                <span class="points">${tile.value}</span>
            `;
            rack.appendChild(tileElement);
        });
    }

    fillRacks() {
        const balanceRack = (rack) => {
            const vowels = ['A', 'E', 'I', 'O', 'U'];
            const vowelCount = rack.filter(tile => vowels.includes(tile.letter)).length;
            
            // Aim for 2-3 vowels in a rack of 7 tiles
            if (vowelCount < 2 && this.tiles.length > 0) {
                // Find positions of consonants that could be swapped
                const consonantIndices = rack
                    .map((tile, index) => !vowels.includes(tile.letter) ? index : -1)
                    .filter(index => index !== -1);
                
                // Find vowels in the remaining tiles
                const vowelIndices = this.tiles
                    .map((tile, index) => vowels.includes(tile.letter) ? index : -1)
                    .filter(index => index !== -1);
                
                // Perform swap if possible
                if (consonantIndices.length > 0 && vowelIndices.length > 0) {
                    const consonantIdx = consonantIndices[Math.floor(Math.random() * consonantIndices.length)];
                    const vowelIdx = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
                    
                    // Swap a consonant with a vowel
                    const consonant = rack[consonantIdx];
                    rack[consonantIdx] = this.tiles[vowelIdx];
                    this.tiles[vowelIdx] = consonant;
                }
            }
            return rack;
        };
    
        // Fill player's rack
        while (this.playerRack.length < 7 && this.tiles.length > 0) {
            this.playerRack.push(this.tiles.pop());
        }
        
        // Balance player's rack if needed
        if (this.playerRack.length === 7) {
            this.playerRack = balanceRack(this.playerRack);
        }
    
        // Fill AI's rack
        while (this.aiRack.length < 7 && this.tiles.length > 0) {
            this.aiRack.push(this.tiles.pop());
        }
    
        // Update displays
        this.renderRack();
        this.renderAIRack();
        this.updateTilesCount();
    }
    
    
    setupEventListeners() {
        // Initial highlight of valid placements
        this.highlightValidPlacements();
    
        // Update highlights when game state changes
        document.addEventListener('click', () => {
            this.highlightValidPlacements();
        });
    
        document.getElementById('play-word').addEventListener('click', () => this.playWord());
        document.getElementById('shuffle-rack').addEventListener('click', async () => {
            const rack = document.getElementById('tile-rack');
            const tiles = [...rack.children];
            
            // Disable tile dragging during animation
            tiles.forEach(tile => tile.draggable = false);
            
            // Visual shuffle animation
            for (let i = 0; i < 5; i++) { // 5 visual shuffles
                await new Promise(resolve => {
                    tiles.forEach(tile => {
                        tile.style.transition = 'transform 0.2s ease';
                        tile.style.transform = `translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 10 - 5}deg)`;
                    });
                    setTimeout(resolve, 200);
                });
            }
            
            // Reset positions with transition
            tiles.forEach(tile => {
                tile.style.transform = 'none';
            });
            
            // Actual shuffle logic
            for (let i = this.playerRack.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.playerRack[i], this.playerRack[j]] = [this.playerRack[j], this.playerRack[i]];
            }
            
            // Wait for position reset animation to complete
            setTimeout(() => {
                this.renderRack();
            }, 200);
            
            // Re-enable dragging
            setTimeout(() => {
                const newTiles = document.querySelectorAll('#tile-rack .tile');
                newTiles.forEach(tile => tile.draggable = true);
            }, 400);
        });
        
        document.getElementById('skip-turn').addEventListener('click', () => {
            this.consecutiveSkips++;
            this.currentTurn = 'ai';
            this.updateGameState();
            this.highlightValidPlacements();
            if (!this.checkGameEnd()) {
                this.aiTurn();
            }
        });

        const quitButton = document.getElementById('quit-game');
        if (quitButton) {
            quitButton.addEventListener('click', () => {
                if (this.gameEnded) return; // Prevent multiple triggers
                
                // Set the computer as winner since player quit
                this.aiScore = Math.max(this.aiScore, this.playerScore + 1);
                this.playerScore = Math.min(this.playerScore, this.aiScore - 1);
                this.gameEnded = true;
                
                // Update scores before animation
                this.updateScores();
                
                // Add the quit move to history
                if (this.moveHistory) {
                    this.moveHistory.push({
                        player: 'Player',
                        word: 'QUIT',
                        score: 0,
                        timestamp: new Date()
                    });
                    this.updateMoveHistory();
                }
                
                // Trigger game over animation
                this.announceWinner();
            });
        }

        // Add this method to the ScrabbleGame class
        async function getWordDefinition(word) {
            try {
                const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
                const data = await response.json();
                
                if (data && data[0] && data[0].meanings) {
                    // Get the first 2 definitions if available
                    const definitions = data[0].meanings
                        .slice(0, 2)
                        .map(meaning => ({
                            partOfSpeech: meaning.partOfSpeech,
                            definition: meaning.definitions[0].definition
                        }));
                    return definitions;
                }
                return null;
            } catch (error) {
                console.error(`Error fetching definition for ${word}:`, error);
                return null;
            }
        }
    
        document.getElementById('print-history').addEventListener('click', async () => {
            const printWindow = window.open('', '_blank');
            const gameDate = new Date().toLocaleString();
            
            // Show loading message
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Scrabble Game History - ${gameDate}</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                margin: 20px;
                                line-height: 1.6;
                            }
                            .header {
                                text-align: center;
                                margin-bottom: 20px;
                                padding-bottom: 10px;
                                border-bottom: 2px solid #333;
                            }
                            .move {
                                margin: 20px 0;
                                padding: 15px;
                                border: 1px solid #ddd;
                                border-radius: 5px;
                                background: #f9f9f9;
                            }
                            .word-header {
                                font-size: 1.2em;
                                color: #2c3e50;
                                margin-bottom: 10px;
                            }
                            .definitions {
                                margin-left: 20px;
                                padding: 10px;
                                border-left: 3px solid #3498db;
                            }
                            .part-of-speech {
                                color: #e67e22;
                                font-style: italic;
                            }
                            .scores {
                                margin: 20px 0;
                                padding: 15px;
                                background: #f5f5f5;
                                border-radius: 5px;
                            }
                            .loading {
                                text-align: center;
                                padding: 20px;
                                font-style: italic;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="loading">Loading definitions...</div>
                    </body>
                </html>
            `);
        
            // Gather all unique words from move history
            const uniqueWords = [...new Set(this.moveHistory
                .map(move => move.word)
                .filter(word => word !== 'SKIP'))];
        
            // Fetch definitions for all words
            const wordDefinitions = new Map();
            for (const word of uniqueWords) {
                const definitions = await getWordDefinition(word);
                if (definitions) {
                    wordDefinitions.set(word, definitions);
                }
            }
        
            // Generate the final content
            const content = `
                <div class="header">
                    <h1>Scrabble Game History</h1>
                    <p>Game played on: ${gameDate}</p>
                </div>
                <div class="scores">
                    <h3>Final Scores:</h3>
                    <p>Player: ${this.playerScore}</p>
                    <p>Computer: ${this.aiScore}</p>
                </div>
                <h3>Move History with Definitions:</h3>
                ${this.moveHistory.map((move, index) => {
                    if (move.word === 'SKIP') {
                        return `
                            <div class="move">
                                ${index + 1}. ${move.player} skipped their turn
                            </div>
                        `;
                    }
                    
                    const definitions = wordDefinitions.get(move.word);
                    return `
                        <div class="move">
                            <div class="word-header">
                                ${index + 1}. ${move.player}: "${move.word}" for ${move.score} points
                            </div>
                            ${definitions ? `
                                <div class="definitions">
                                    <strong>Definitions:</strong><br>
                                    ${definitions.map(def => `
                                        <p>
                                            <span class="part-of-speech">${def.partOfSpeech}:</span>
                                            ${def.definition}
                                        </p>
                                    `).join('')}
                                </div>
                            ` : '<p>No definition available</p>'}
                        </div>
                    `;
                }).join('')}
            `;
        
            // Update the window content
            printWindow.document.body.innerHTML = content;
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
    }
    
}


// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrabbleGame();
});
