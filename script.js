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
                        const tile = this.aiRack[tileIndex];
                        
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
                                    this.board[row][col] = this.aiRack.splice(tileIndex, 1)[0];
                                    targetCell.innerHTML = `
                                        ${tile.letter}
                                        <span class="points">${tile.value}</span>
                                    `;
                                    
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
                this.aiScore += score;
                this.isFirstMove = false;
                this.consecutiveSkips = 0;
                this.currentTurn = 'player';
                this.addToMoveHistory('Computer', word, score);
                this.fillRacks();
                this.updateGameState();
                resolve();
            }, 500);
        });
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
        // Keep track of words already on the board
        const existingWords = this.getExistingWords();
        if (existingWords.includes(word)) {
            console.log(`Word ${word} already exists on the board`);
            return false;
        }
    
        // 1. Check basic boundary conditions
        if (horizontal) {
            if (startCol < 0 || startCol + word.length > 15 || startRow < 0 || startRow > 14) {
                return false;
            }
        } else {
            if (startRow < 0 || startRow + word.length > 15 || startCol < 0 || startCol > 14) {
                return false;
            }
        }
    
        // 2. Handle first move of the game
        if (this.isFirstMove) {
            const centerRow = 7, centerCol = 7;
            if (horizontal) {
                // Word must pass through center square
                if (startRow !== centerRow) return false;
                if (startCol > centerCol || startCol + word.length <= centerCol) return false;
            } else {
                // Word must pass through center square
                if (startCol !== centerCol) return false;
                if (startRow > centerRow || startRow + word.length <= centerRow) return false;
            }
            return true;
        }
    
        // 3. For subsequent moves, verify connection to existing words
        let hasAdjacentTile = false;
        let touchesExistingTile = false;
    
        // 4. Check each position where we want to place a letter
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            
            // 5. Check if current cell is occupied
            if (this.board[row][col]) {
                // If occupied, letter must match
                if (this.board[row][col].letter !== word[i]) {
                    return false;
                }
                touchesExistingTile = true;
            } else {
                // 6. Check adjacent cells (up, down, left, right) for existing tiles
                const adjacentPositions = [
                    [row - 1, col], // up
                    [row + 1, col], // down
                    [row, col - 1], // left
                    [row, col + 1]  // right
                ];
    
                for (const [adjRow, adjCol] of adjacentPositions) {
                    if (adjRow >= 0 && adjRow < 15 && adjCol >= 0 && adjCol < 15) {
                        if (this.board[adjRow][adjCol]) {
                            hasAdjacentTile = true;
                            
                            // 7. Validate any perpendicular words that would be formed
                            let crossWord = '';
                            let tempBoard = JSON.parse(JSON.stringify(this.board)); // Create temporary board
                            tempBoard[row][col] = { letter: word[i] }; // Place current letter temporarily
                            
                            if (horizontal) {
                                // Check vertical word formation
                                let r = row;
                                // Get letters above
                                while (r > 0 && (tempBoard[r - 1][col] || this.board[r - 1][col])) {
                                    crossWord = (tempBoard[r - 1][col] || this.board[r - 1][col]).letter + crossWord;
                                    r--;
                                }
                                // Add current letter
                                crossWord += word[i];
                                r = row;
                                // Get letters below
                                while (r < 14 && (tempBoard[r + 1][col] || this.board[r + 1][col])) {
                                    crossWord += (tempBoard[r + 1][col] || this.board[r + 1][col]).letter;
                                    r++;
                                }
                            } else {
                                // Check horizontal word formation
                                let c = col;
                                // Get letters to the left
                                while (c > 0 && (tempBoard[row][c - 1] || this.board[row][c - 1])) {
                                    crossWord = (tempBoard[row][c - 1] || this.board[row][c - 1]).letter + crossWord;
                                    c--;
                                }
                                // Add current letter
                                crossWord += word[i];
                                c = col;
                                // Get letters to the right
                                while (c < 14 && (tempBoard[row][c + 1] || this.board[row][c + 1])) {
                                    crossWord += (tempBoard[row][c + 1] || this.board[row][c + 1]).letter;
                                    c++;
                                }
                            }
                            
                            // 8. If a cross word is formed, validate it
                            if (crossWord.length > 1) {
                                if (!this.dictionary.has(crossWord.toLowerCase())) {
                                    console.log(`Invalid cross word would be formed: ${crossWord}`);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
    
        // 9. Check if the main word being formed is valid
        let mainWord = word;
        let tempBoard = JSON.parse(JSON.stringify(this.board));
        // Place the entire word temporarily
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            if (!tempBoard[row][col]) {
                tempBoard[row][col] = { letter: word[i] };
            }
        }
    
        if (horizontal) {
            // Check for letters before
            let c = startCol - 1;
            while (c >= 0 && tempBoard[startRow][c]) {
                mainWord = tempBoard[startRow][c].letter + mainWord;
                c--;
            }
            // Check for letters after
            c = startCol + word.length;
            while (c < 15 && tempBoard[startRow][c]) {
                mainWord += tempBoard[startRow][c].letter;
                c++;
            }
        } else {
            // Check for letters before
            let r = startRow - 1;
            while (r >= 0 && tempBoard[r][startCol]) {
                mainWord = tempBoard[r][startCol].letter + mainWord;
                r--;
            }
            // Check for letters after
            r = startRow + word.length;
            while (r < 15 && tempBoard[r][startCol]) {
                mainWord += tempBoard[r][startCol].letter;
                r++;
            }
        }
    
        // 10. Validate the main word
        if (!this.dictionary.has(mainWord.toLowerCase())) {
            console.log(`Invalid main word would be formed: ${mainWord}`);
            return false;
        }
    
        // 11. Final validation: must connect to existing tiles (except first move)
        return hasAdjacentTile || touchesExistingTile;
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
        let wordMultiplier = 1;
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
    
        // Score the main word
        let mainWordScore = 0;
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            const letter = word[i];
            let letterScore = this.tileValues[letter];
    
            // Only apply premium squares for empty positions on the real board
            if (!this.board[row][col]) {
                const premium = this.getPremiumSquareType(row, col);
                if (premium === 'dl') letterScore *= 2;
                if (premium === 'tl') letterScore *= 3;
                if (premium === 'dw') wordMultiplier *= 2;
                if (premium === 'tw') wordMultiplier *= 3;
            }
    
            mainWordScore += letterScore;
        }
        totalScore += mainWordScore * wordMultiplier;
    
        // Now check for cross words at each position
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            
            // Skip if this position already had a tile
            if (this.board[row][col]) continue;
    
            // Check for cross words
            let crossWord = '';
            let crossWordScore = 0;
            let crossWordMultiplier = 1;
    
            if (horizontal) {
                // Check vertical cross word
                let r = row;
                let hasAdjacentTile = false;
                
                // Get letters above
                while (r > 0 && (tempBoard[r - 1][col] || this.board[r - 1][col])) {
                    hasAdjacentTile = true;
                    crossWord = (tempBoard[r - 1][col] || this.board[r - 1][col]).letter + crossWord;
                    crossWordScore += (tempBoard[r - 1][col] || this.board[r - 1][col]).value;
                    r--;
                }
                
                // Add current letter
                if (hasAdjacentTile || r < 14 && (tempBoard[r + 1][col] || this.board[r + 1][col])) {
                    crossWord += word[i];
                    let letterScore = this.tileValues[word[i]];
                    const premium = this.getPremiumSquareType(row, col);
                    if (premium === 'dl') letterScore *= 2;
                    if (premium === 'tl') letterScore *= 3;
                    if (premium === 'dw') crossWordMultiplier *= 2;
                    if (premium === 'tw') crossWordMultiplier *= 3;
                    crossWordScore += letterScore;
                }
                
                // Get letters below
                r = row;
                while (r < 14 && (tempBoard[r + 1][col] || this.board[r + 1][col])) {
                    hasAdjacentTile = true;
                    crossWord += (tempBoard[r + 1][col] || this.board[r + 1][col]).letter;
                    crossWordScore += (tempBoard[r + 1][col] || this.board[r + 1][col]).value;
                    r++;
                }
    
                // If we formed a cross word of length > 1, add its score
                if (crossWord.length > 1) {
                    console.log(`Cross word formed: ${crossWord} for ${crossWordScore * crossWordMultiplier} points`);
                    totalScore += crossWordScore * crossWordMultiplier;
                }
            } else {
                // Check horizontal cross word
                let c = col;
                let hasAdjacentTile = false;
                
                // Get letters to the left
                while (c > 0 && (tempBoard[row][c - 1] || this.board[row][c - 1])) {
                    hasAdjacentTile = true;
                    crossWord = (tempBoard[row][c - 1] || this.board[row][c - 1]).letter + crossWord;
                    crossWordScore += (tempBoard[row][c - 1] || this.board[row][c - 1]).value;
                    c--;
                }
                
                // Add current letter
                if (hasAdjacentTile || c < 14 && (tempBoard[row][c + 1] || this.board[row][c + 1])) {
                    crossWord += word[i];
                    let letterScore = this.tileValues[word[i]];
                    const premium = this.getPremiumSquareType(row, col);
                    if (premium === 'dl') letterScore *= 2;
                    if (premium === 'tl') letterScore *= 3;
                    if (premium === 'dw') crossWordMultiplier *= 2;
                    if (premium === 'tw') crossWordMultiplier *= 3;
                    crossWordScore += letterScore;
                }
                
                // Get letters to the right
                c = col;
                while (c < 14 && (tempBoard[row][c + 1] || this.board[row][c + 1])) {
                    hasAdjacentTile = true;
                    crossWord += (tempBoard[row][c + 1] || this.board[row][c + 1]).letter;
                    crossWordScore += (tempBoard[row][c + 1] || this.board[row][c + 1]).value;
                    c++;
                }
    
                // If we formed a cross word of length > 1, add its score
                if (crossWord.length > 1) {
                    console.log(`Cross word formed: ${crossWord} for ${crossWordScore * crossWordMultiplier} points`);
                    totalScore += crossWordScore * crossWordMultiplier;
                }
            }
        }
    
        // Add bonus for using all 7 tiles
        if (word.length === 7) {
            totalScore += 50;
            console.log("Added 50 point bonus for using all 7 tiles");
        }
    
        console.log(`Total score for ${word}: ${totalScore}`);
        return totalScore;
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
    }

    setupDragListeners() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('tile') && this.currentTurn === 'player') {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.index);
                
                // Create a clone of just the dragged tile for the drag image
                const dragImage = e.target.cloneNode(true);
                dragImage.style.opacity = '0.8';
                dragImage.style.position = 'absolute';
                dragImage.style.top = '-1000px';
                document.body.appendChild(dragImage);
                
                // Set the custom drag image
                e.dataTransfer.setDragImage(dragImage, dragImage.offsetWidth / 2, dragImage.offsetHeight / 2);
                
                // Remove the clone after the drag starts
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
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (this.currentTurn === 'player') {
                    cell.classList.add('droppable-hover');
                }
            });

            cell.addEventListener('dragleave', (e) => {
                cell.classList.remove('droppable-hover');
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                cell.classList.remove('droppable-hover');

                if (this.currentTurn !== 'player') {
                    alert("It's not your turn!");
                    return;
                }

                const tileIndex = e.dataTransfer.getData('text/plain');
                const tile = this.playerRack[tileIndex];
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);

                if (this.isValidPlacement(row, col, tile)) {
                    this.placeTile(tile, row, col);
                } else {
                    alert('Invalid placement! Check placement rules.');
                }
            });
        });
    }

    isValidPlacement(row, col, tile) {
        // Check if cell is already occupied
        if (this.board[row][col]) {
            return false;
        }
    
        // Handle first move - must be at center (7,7)
        if (this.isFirstMove && this.placedTiles.length === 0) {
            return row === 7 && col === 7;
        }
    
        // If it's the second tile of the first move
        if (this.isFirstMove && this.placedTiles.length === 1) {
            const firstTile = this.placedTiles[0];
            // Allow placement next to the first tile
            return (
                (Math.abs(row - firstTile.row) === 1 && col === firstTile.col) || // vertical
                (Math.abs(col - firstTile.col) === 1 && row === firstTile.row)    // horizontal
            );
        }
    
        // If there are already placed tiles in this turn
        if (this.placedTiles.length > 0) {
            const firstPlaced = this.placedTiles[0];
            const isHorizontal = row === firstPlaced.row;
            const isVertical = col === firstPlaced.col;
    
            // Must continue in the same line (horizontal or vertical)
            return isHorizontal || isVertical;
        }
    
        // For subsequent moves, check if the placement connects to existing board tiles
        // This includes both adjacent tiles and tiles that would form part of the word
        const hasAdjacentTile = this.checkAdjacentTiles(row, col);
        const isConnectedToExisting = this.checkExistingWordConnection(row, col);
        
        return hasAdjacentTile || isConnectedToExisting;
    }

    // Add this new method to check if the placement would connect to an existing word
checkExistingWordConnection(row, col) {
    // Check horizontal line
    let isPartOfHorizontalWord = false;
    let leftCol = col - 1;
    let rightCol = col + 1;
    
    // Check left side
    while (leftCol >= 0 && this.board[row][leftCol]) {
        isPartOfHorizontalWord = true;
        leftCol--;
    }
    
    // Check right side
    while (rightCol < 15 && this.board[row][rightCol]) {
        isPartOfHorizontalWord = true;
        rightCol++;
    }

    // Check vertical line
    let isPartOfVerticalWord = false;
    let topRow = row - 1;
    let bottomRow = row + 1;
    
    // Check above
    while (topRow >= 0 && this.board[topRow][col]) {
        isPartOfVerticalWord = true;
        topRow--;
    }
    
    // Check below
    while (bottomRow < 15 && this.board[bottomRow][col]) {
        isPartOfVerticalWord = true;
        bottomRow++;
    }

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

    placeTile(tile, row, col) {
        if (this.board[row][col]) {
            alert("This cell is already occupied!");
            return;
        }
    
        // If it's a blank tile (asterisk), show letter selection dialog
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
                        originalLetter: '*', // Keep track that this was originally a blank
                        value: 0 // Ensure blank tiles remain worth 0 points
                    };
    
                    // Place the tile with the selected letter
                    this.board[row][col] = blankTile;
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cell.innerHTML = `
                        ${selectedLetter}
                        <span class="points">0</span>
                        <span class="blank-indicator">★</span>
                    `;
    
                    // Add special styling for blank tiles
                    const blankStyle = document.createElement('style');
                    blankStyle.textContent = `
                        .blank-indicator {
                            position: absolute;
                            top: 2px;
                            right: 2px;
                            font-size: 10px;
                            color: #666;
                        }
                    `;
                    document.head.appendChild(blankStyle);
    
                    // Remove tile from rack
                    const tileIndex = this.playerRack.indexOf(tile);
                    if (tileIndex > -1) {
                        this.playerRack.splice(tileIndex, 1);
                    }
    
                    // Add to placed tiles
                    this.placedTiles.push({ tile: blankTile, row, col });
    
                    // Update rack display
                    this.renderRack();
    
                    // Remove the dialog
                    letterSelectionDialog.remove();
                });
            });
    
        } else {
            // Normal tile placement (non-blank tile)
            this.board[row][col] = tile;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.innerHTML = `
                ${tile.letter}
                <span class="points">${tile.value}</span>
            `;
            
            // Remove tile from rack
            const tileIndex = this.playerRack.indexOf(tile);
            if (tileIndex > -1) {
                this.playerRack.splice(tileIndex, 1);
            }
            
            // Add to placed tiles
            this.placedTiles.push({ tile, row, col });
            
            // Update rack display
            this.renderRack();
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
    
        // Check for gaps
        for (let i = 1; i < sortedTiles.length; i++) {
            if (isHorizontal) {
                if (sortedTiles[i].col !== sortedTiles[i-1].col + 1) return false;
            } else { // isVertical
                if (sortedTiles[i].row !== sortedTiles[i-1].row + 1) return false;
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
    
        // Get all formed words (main word and crossing words)
        const words = new Set(); // Using Set to avoid duplicates
        
        // Get the main word based on tile placement direction
        const mainWord = this.getMainWord();
        if (mainWord.length > 1) {
            words.add(mainWord);
        }
    
        // Check each placed tile for crossing words
        this.placedTiles.forEach(({row, col}) => {
            const crossWords = this.getCrossWords(row, col);
            crossWords.forEach(word => {
                if (word.length > 1) {
                    words.add(word);
                }
            });
        });
    
        // Validate each word
        return Array.from(words).every(word => {
            const isValid = this.dictionary.has(word.toLowerCase());
            if (!isValid) {
                console.log(`Invalid word: ${word}`);
            }
            return isValid;
        });
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
        let start = isHorizontal ? col : row;
        
        // Find start of word
        while (start > 0 && this.board[isHorizontal ? row : start - 1][isHorizontal ? start - 1 : col]) {
            start--;
        }
        
        // Build word
        let current = start;
        while (current < 15 && this.board[isHorizontal ? row : current][isHorizontal ? current : col]) {
            word += this.board[isHorizontal ? row : current][isHorizontal ? current : col].letter;
            current++;
        }
        
        return word.length > 1 ? word : null;
    }
    

    getFormedWords() {
        const words = [];
        const mainWord = this.getMainWord();
        if (mainWord && mainWord.length > 1) {
            words.push(mainWord);
        }
    
        // Get crossing words
        this.placedTiles.forEach(({row, col}) => {
            const crossWord = this.getCrossWord(row, col);
            if (crossWord && crossWord.length > 1) {
                words.push(crossWord);
            }
        });
    
        return words;
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
        const processedPositions = new Set(); // Track positions we've already scored
        
        // Get all words formed by this play
        const words = this.getFormedWords();
        
        words.forEach(word => {
            let wordScore = 0;
            let wordMultiplier = 1;
            const wordPos = this.findWordPosition(word);
            
            if (!wordPos) return;
            
            const {startRow, startCol, isHorizontal} = wordPos;
            
            // Calculate score for each letter in the word
            for (let i = 0; i < word.length; i++) {
                const currentRow = isHorizontal ? startRow : startRow + i;
                const currentCol = isHorizontal ? startCol + i : startCol;
                const currentTile = this.board[currentRow][currentCol];
                
                // Base letter score
                let letterScore = currentTile.value;  // Use the tile's value, not tileValues lookup
                
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
        });
        
        // Bonus for using all 7 tiles
        if (this.placedTiles.length === 7) {
            totalScore += 50;
        }
        
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
    
        // Create win overlay if it doesn't exist
        let winOverlay = document.querySelector('.win-overlay');
        if (!winOverlay) {
            winOverlay = document.createElement('div');
            winOverlay.className = 'win-overlay';
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
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        const confettiCount = 150;
    
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                left: ${Math.random() * 100}vw;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                animation: confetti-fall ${3 + Math.random() * 2}s linear forwards;
            `;
            document.body.appendChild(confetti);
    
            // Remove confetti after animation
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
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
        while (this.playerRack.length < 7 && this.tiles.length > 0) {
            this.playerRack.push(this.tiles.pop());
        }
        while (this.aiRack.length < 7 && this.tiles.length > 0) {
            this.aiRack.push(this.tiles.pop());
        }
        this.renderRack();
        this.renderAIRack(); // Add this line
        this.updateTilesCount();
    }
    
    

    setupEventListeners() {
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
            if (!this.checkGameEnd()) {
                this.aiTurn();
            }
        });

        // Add this to the setupEventListeners method
document.getElementById('print-history').addEventListener('click', () => {
    const printWindow = window.open('', '_blank');
    const gameDate = new Date().toLocaleString();
    
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
                        margin: 10px 0;
                        padding: 5px;
                        border-bottom: 1px solid #eee;
                    }
                    .scores {
                        margin: 20px 0;
                        padding: 10px;
                        background: #f5f5f5;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Scrabble Game History</h1>
                    <p>Game played on: ${gameDate}</p>
                </div>
                <div class="scores">
                    <h3>Final Scores:</h3>
                    <p>Player: ${this.playerScore}</p>
                    <p>Computer: ${this.aiScore}</p>
                </div>
                <h3>Move History:</h3>
                ${this.moveHistory.map((move, index) => `
                    <div class="move">
                        ${index + 1}. ${move.player}: "${move.word}" for ${move.score} points
                    </div>
                `).join('')}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
});


        // Add this event listener
        document.getElementById('recall-tiles').addEventListener('click', () => {
            if (this.currentTurn === 'player') {
                this.resetPlacedTiles();
            } else {
                alert("You can only recall tiles during your turn!");
            }
        });
    }
}


// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrabbleGame();
});
