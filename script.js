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
        console.log("AI rack:", this.aiRack.map(t => t.letter));
        const possiblePlays = this.findAIPossiblePlays();
        console.log("Possible plays found:", possiblePlays.length);
        
        if (possiblePlays.length > 0) {
            console.log("Available plays:", possiblePlays);
            // Sort plays by score and take the best one
            const bestPlay = possiblePlays.sort((a, b) => b.score - a.score)[0];
            console.log("Choosing play:", bestPlay);
            this.executeAIPlay(bestPlay);
        } else {
            console.log("AI skips turn - no valid plays found");
            this.consecutiveSkips++;
            this.currentTurn = 'player';
            this.updateGameState();
        }
    }
    

    findAIPossiblePlays() {
        const possiblePlays = [];
        const anchors = this.findAnchors();
        const availableLetters = this.aiRack.map(tile => tile.letter);
        
        console.log("Available letters:", availableLetters);
        console.log("Anchors found:", anchors);
    
        // If it's the first move or no tiles on board
        if (this.isFirstMove || this.board.every(row => row.every(cell => cell === null))) {
            // Try all possible words from the rack
            const words = Array.from(this.dictionary);
            for (const word of words) {
                if (word.length >= 2 && word.length <= availableLetters.length) {
                    if (this.canFormWord(word, '', '', availableLetters)) {
                        // For first move, try to place through center
                        const centerPos = { row: 7, col: 7 - Math.floor(word.length / 2) };
                        if (this.isValidAIPlacement(word.toUpperCase(), centerPos.row, centerPos.col, true)) {
                            possiblePlays.push({
                                word: word.toUpperCase(),
                                startPos: centerPos,
                                isHorizontal: true,
                                score: this.calculatePotentialScore(word.toUpperCase(), centerPos.row, centerPos.col, true)
                            });
                        }
                    }
                }
            }
        } else {
            // For subsequent moves
            anchors.forEach(anchor => {
                // Try horizontal placements
                const hPrefix = this.getPrefix(anchor, true);
                const hSuffix = this.getSuffix(anchor, true);
                
                // Try vertical placements
                const vPrefix = this.getPrefix(anchor, false);
                const vSuffix = this.getSuffix(anchor, false);
                
                // Try all possible words from dictionary
                for (const word of this.dictionary) {
                    const upperWord = word.toUpperCase();
                    
                    // Check horizontal placement
                    if (this.canFormWord(upperWord, hPrefix, hSuffix, availableLetters)) {
                        const startCol = anchor.col - hPrefix.length;
                        if (this.isValidAIPlacement(upperWord, anchor.row, startCol, true)) {
                            possiblePlays.push({
                                word: upperWord,
                                startPos: { row: anchor.row, col: startCol },
                                isHorizontal: true,
                                score: this.calculatePotentialScore(upperWord, anchor.row, startCol, true)
                            });
                        }
                    }
                    
                    // Check vertical placement
                    if (this.canFormWord(upperWord, vPrefix, vSuffix, availableLetters)) {
                        const startRow = anchor.row - vPrefix.length;
                        if (this.isValidAIPlacement(upperWord, startRow, anchor.col, false)) {
                            possiblePlays.push({
                                word: upperWord,
                                startPos: { row: startRow, col: anchor.col },
                                isHorizontal: false,
                                score: this.calculatePotentialScore(upperWord, startRow, anchor.col, false)
                            });
                        }
                    }
                }
            });
        }
    
        console.log("Found possible plays:", possiblePlays);
        return possiblePlays;
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
        const {word, startPos, isHorizontal} = play;
        console.log("AI playing:", word, "at", startPos, isHorizontal ? "horizontally" : "vertically");
        
        // Show "AI is thinking..." message
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
        
        // Fade in thinking message
        setTimeout(() => thinkingMessage.style.opacity = '1', 100);
    
        // Add artificial thinking delay
        setTimeout(async () => {
            // Fade out and remove thinking message
            thinkingMessage.style.opacity = '0';
            setTimeout(() => thinkingMessage.remove(), 300);
    
            // Start placing tiles with animation
            await animateLetterPlacements();
        }, 2000); // AI "thinking" time
    
        const animateLetterPlacements = async () => {
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
                        
                        // Start position (from top of screen)
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
                            // Short delay before starting animation
                            setTimeout(() => {
                                // Move tile to target position
                                animatedTile.style.top = `${targetRect.top}px`;
                                animatedTile.style.transform = 'rotate(0deg)';
                                
                                // Add bounce effect at the end
                                setTimeout(() => {
                                    animatedTile.style.transform = 'rotate(0deg) scale(1.2)';
                                    setTimeout(() => {
                                        animatedTile.style.transform = 'rotate(0deg) scale(1)';
                                    }, 100);
                                }, 800);
    
                                // Add tile to board after animation
                                setTimeout(() => {
                                    // Add flash effect to cell
                                    targetCell.classList.add('tile-placed');
                                    
                                    // Remove animated tile and update board
                                    animatedTile.remove();
                                    this.board[row][col] = this.aiRack.splice(tileIndex, 1)[0];
                                    targetCell.innerHTML = `
                                        ${tile.letter}
                                        <span class="points">${tile.value}</span>
                                    `;
                                    
                                    // Remove flash effect
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
                this.aiScore += play.score;
                this.isFirstMove = false;
                this.consecutiveSkips = 0;
                this.currentTurn = 'player';
                this.addToMoveHistory('Computer', word, play.score);
                this.fillRacks();
                this.updateGameState();
            }, 500);
        };
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
                            if (horizontal) {
                                // Check vertical word formation
                                let r = row;
                                // Get letters above
                                while (r > 0 && this.board[r - 1][col]) {
                                    crossWord = this.board[r - 1][col].letter + crossWord;
                                    r--;
                                }
                                // Add current letter
                                crossWord += word[i];
                                r = row;
                                // Get letters below
                                while (r < 14 && this.board[r + 1][col]) {
                                    crossWord += this.board[r + 1][col].letter;
                                    r++;
                                }
                            } else {
                                // Check horizontal word formation
                                let c = col;
                                // Get letters to the left
                                while (c > 0 && this.board[row][c - 1]) {
                                    crossWord = this.board[row][c - 1].letter + crossWord;
                                    c--;
                                }
                                // Add current letter
                                crossWord += word[i];
                                c = col;
                                // Get letters to the right
                                while (c < 14 && this.board[row][c + 1]) {
                                    crossWord += this.board[row][c + 1].letter;
                                    c++;
                                }
                            }
                            
                            // 8. If a cross word is formed, validate it
                            if (crossWord.length > 1) {
                                if (!this.dictionary.has(crossWord.toLowerCase())) {
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
        if (horizontal) {
            // Check for letters before
            let c = startCol - 1;
            while (c >= 0 && this.board[startRow][c]) {
                mainWord = this.board[startRow][c].letter + mainWord;
                c--;
            }
            // Check for letters after
            c = startCol + word.length;
            while (c < 15 && this.board[startRow][c]) {
                mainWord += this.board[startRow][c].letter;
                c++;
            }
        } else {
            // Check for letters before
            let r = startRow - 1;
            while (r >= 0 && this.board[r][startCol]) {
                mainWord = this.board[r][startCol].letter + mainWord;
                r--;
            }
            // Check for letters after
            r = startRow + word.length;
            while (r < 15 && this.board[r][startCol]) {
                mainWord += this.board[r][startCol].letter;
                r++;
            }
        }
    
        // 10. Validate the main word
        if (!this.dictionary.has(mainWord.toLowerCase())) {
            return false;
        }
    
        // 11. Final validation: must connect to existing tiles (except first move)
        return hasAdjacentTile || touchesExistingTile;
    }
    

    calculatePotentialScore(word, startRow, startCol, horizontal) {
        let score = 0;
        let wordMultiplier = 1;
    
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;
            const letter = word[i];
            let letterScore = this.tileValues[letter];
    
            // Apply premium square multipliers
            const premium = this.getPremiumSquareType(row, col);
            if (premium === 'dl') letterScore *= 2;
            if (premium === 'tl') letterScore *= 3;
            if (premium === 'dw') wordMultiplier *= 2;
            if (premium === 'tw') wordMultiplier *= 3;
    
            score += letterScore;
        }
    
        return score * wordMultiplier;
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
        this.updateGameState();
        
        if (this.consecutiveSkips >= 4) {
            this.checkGameEnd();
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
    
        // For subsequent moves, must be adjacent to existing tiles
        return this.checkAdjacentTiles(row, col);
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
        // Check if the cell is already occupied
        if (this.board[row][col]) {
            alert("This cell is already occupied!");
            return;
        }
    
        // Place the tile
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
        const words = [];
        
        // Get the main word
        const mainWord = this.getMainWord();
        if (mainWord.length > 1) {
            words.push(mainWord);
        }
    
        // Get crossing words for each placed tile
        this.placedTiles.forEach(({row, col}) => {
            // Check vertical crossing word if main word is horizontal
            let verticalWord = '';
            let r = row;
            while (r > 0 && this.board[r-1][col]) r--;
            while (r < 15 && this.board[r][col]) {
                verticalWord += this.board[r][col].letter;
                r++;
            }
            if (verticalWord.length > 1) {
                words.push(verticalWord);
            }
    
            // Check horizontal crossing word if main word is vertical
            let horizontalWord = '';
            let c = col;
            while (c > 0 && this.board[row][c-1]) c--;
            while (c < 15 && this.board[row][c]) {
                horizontalWord += this.board[row][c].letter;
                c++;
            }
            if (horizontalWord.length > 1) {
                words.push(horizontalWord);
            }
        });
    
        // Remove duplicates
        const uniqueWords = [...new Set(words)];
    
        // Validate all words
        return uniqueWords.every(word => {
            const isValid = this.dictionary.has(word.toLowerCase());
            if (!isValid) {
                console.log(`Invalid word: ${word}`);
            }
            return isValid;
        });
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
    
        const isHorizontal = sortedTiles.every(t => t.row === sortedTiles[0].row);
        let word = '';
        let row = sortedTiles[0].row;
        let col = sortedTiles[0].col;
    
        // Find start of word
        while (col > 0 && this.board[row][col - 1]) col--;
        while (row > 0 && this.board[row - 1][col]) row--;
    
        // Build word
        if (isHorizontal) {
            while (col < 15 && this.board[row][col]) {
                word += this.board[row][col].letter;
                col++;
            }
        } else {
            while (row < 15 && this.board[row][col]) {
                word += this.board[row][col].letter;
                row++;
            }
        }
    
        return word;
    }
    

    calculateScore() {
        let totalScore = 0;
        const words = this.getFormedWords();
    
        words.forEach(word => {
            let wordScore = 0;
            let wordMultiplier = 1;
            let startPos = null;
            let isHorizontal = true;
    
            // Find the starting position and orientation of the word on the board
            for (let row = 0; row < 15; row++) {
                for (let col = 0; col < 15; col++) {
                    if (this.board[row][col] && 
                        this.board[row][col].letter === word[0]) {
                        // Check if this is the start of our word horizontally
                        if (col + word.length <= 15) {
                            let matches = true;
                            for (let i = 0; i < word.length; i++) {
                                if (!this.board[row][col + i] || 
                                    this.board[row][col + i].letter !== word[i]) {
                                    matches = false;
                                    break;
                                }
                            }
                            if (matches) {
                                startPos = { row, col };
                                isHorizontal = true;
                                break;
                            }
                        }
                        
                        // Check if this is the start of our word vertically
                        if (row + word.length <= 15) {
                            let matches = true;
                            for (let i = 0; i < word.length; i++) {
                                if (!this.board[row + i][col] || 
                                    this.board[row + i][col].letter !== word[i]) {
                                    matches = false;
                                    break;
                                }
                            }
                            if (matches) {
                                startPos = { row, col };
                                isHorizontal = false;
                                break;
                            }
                        }
                    }
                }
                if (startPos) break;
            }
    
            if (startPos) {
                // Calculate score for the word
                [...word].forEach((letter, i) => {
                    const currentRow = isHorizontal ? startPos.row : startPos.row + i;
                    const currentCol = isHorizontal ? startPos.col + i : startPos.col;
                    let letterScore = this.tileValues[letter];
                    
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
                });
    
                totalScore += wordScore * wordMultiplier;
            }
        });
    
        return totalScore;
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
