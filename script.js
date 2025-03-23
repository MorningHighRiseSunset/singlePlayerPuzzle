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

class ScrabbleGame {
    constructor() {
        this.board = Array(15)
            .fill()
            .map(() => Array(15).fill(null));
        this.tileValues = {
            A: 1,
            B: 3,
            C: 3,
            D: 2,
            E: 1,
            F: 4,
            G: 2,
            H: 4,
            I: 1,
            J: 8,
            K: 5,
            L: 1,
            M: 3,
            N: 1,
            O: 1,
            P: 3,
            Q: 10,
            R: 1,
            S: 1,
            T: 1,
            U: 1,
            V: 4,
            W: 4,
            X: 8,
            Y: 4,
            Z: 10,
            "*": 0,
        };
        this.tileDistribution = {
            A: 9,
            B: 2,
            C: 2,
            D: 4,
            E: 12,
            F: 2,
            G: 3,
            H: 2,
            I: 9,
            J: 1,
            K: 1,
            L: 4,
            M: 2,
            N: 6,
            O: 8,
            P: 2,
            Q: 1,
            R: 6,
            S: 4,
            T: 6,
            U: 4,
            V: 2,
            W: 2,
            X: 1,
            Y: 2,
            Z: 1,
            "*": 2,
        };
        this.setupHintSystem();
        this.previousBoard = null;
        this.tiles = [];
        this.playerRack = [];
        this.aiRack = [];
        this.playerScore = 0;
        this.aiScore = 0;
        this.dictionary = new Set();
        this.currentTurn = "player";
        this.placedTiles = [];
        this.gameEnded = false;
        this.consecutiveSkips = 0;
        this.moveHistory = [];
        this.isFirstMove = true;
        this.exchangeMode = false;
        this.exchangePortal = null;
        this.exchangingTiles = [];
        this.generateTileBag();
        this.selectedTile = null;
        this.isMobile = isMobileDevice();

        document.body.style.overscrollBehavior = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
        this.init();
    }

    setupEventListeners() {
        // Initial highlight of valid placements
        this.highlightValidPlacements();
    
        // Update highlights when game state changes
        document.addEventListener("click", () => {
            this.highlightValidPlacements();
        });
    
        // Add exchange system setup
        this.setupExchangeSystem();
    
        // Play word button
        document.getElementById("play-word").addEventListener("click", () => this.playWord());
    
        // Shuffle rack button
        document.getElementById("shuffle-rack").addEventListener("click", async () => {
            const rack = document.getElementById("tile-rack");
            const tiles = [...rack.children];
    
            // Disable tile dragging during animation
            tiles.forEach((tile) => (tile.draggable = false));
    
            // Visual shuffle animation
            for (let i = 0; i < 5; i++) { // 5 visual shuffles
                await new Promise((resolve) => {
                    tiles.forEach((tile) => {
                        tile.style.transition = "transform 0.2s ease";
                        tile.style.transform = `translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 10 - 5}deg)`;
                    });
                    setTimeout(resolve, 200);
                });
            }
    
            // Reset positions with transition
            tiles.forEach((tile) => {
                tile.style.transform = "none";
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
                const newTiles = document.querySelectorAll("#tile-rack .tile");
                newTiles.forEach((tile) => (tile.draggable = true));
            }, 400);
        });
    
        // Skip turn button
        document.getElementById("skip-turn").addEventListener("click", () => {
            if (this.currentTurn === "player") {
                this.consecutiveSkips++;
                this.currentTurn = "ai";
                this.addToMoveHistory("Player", "SKIP", 0);
                this.updateGameState();
                this.highlightValidPlacements();
                if (!this.checkGameEnd()) {
                    this.aiTurn();
                }
            }
        });
    
        // Mobile-specific tile selection and placement
        if (this.isMobile) {
            // Handle tile selection from rack
            document.getElementById("tile-rack").addEventListener("click", (e) => {
                if (this.currentTurn !== "player") return;
                
                const tileElement = e.target.closest(".tile");
                if (!tileElement) return;
        
                // Toggle selection
                if (this.selectedTile === tileElement) {
                    this.deselectTile();
                } else {
                    this.selectTile(tileElement);
                }
            });
        
            // Handle board cell clicks for placement
            document.querySelectorAll(".board-cell").forEach(cell => {
                cell.addEventListener("click", (e) => {
                    if (this.currentTurn !== "player") return;
                    
                    if (this.selectedTile) {
                        const row = parseInt(cell.dataset.row);
                        const col = parseInt(cell.dataset.col);
                        const tileIndex = this.selectedTile.dataset.index;
                        
                        if (this.isValidPlacement(row, col, this.playerRack[tileIndex])) {
                            // Create a nice flying animation
                            const startRect = this.selectedTile.getBoundingClientRect();
                            const endRect = cell.getBoundingClientRect();
                            
                            const clone = this.selectedTile.cloneNode(true);
                            clone.style.position = "fixed";
                            clone.style.left = `${startRect.left}px`;
                            clone.style.top = `${startRect.top}px`;
                            clone.style.width = `${startRect.width}px`;
                            clone.style.height = `${startRect.height}px`;
                            clone.style.transition = "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)";
                            clone.style.zIndex = "1000";
                            document.body.appendChild(clone);
        
                            requestAnimationFrame(() => {
                                clone.style.left = `${endRect.left}px`;
                                clone.style.top = `${endRect.top}px`;
                                clone.style.transform = "scale(1.1) rotate(360deg)";
                            });
        
                            setTimeout(() => {
                                clone.remove();
                                this.placeTile(this.playerRack[tileIndex], row, col);
                                this.deselectTile();
                            }, 500);
                        } else {
                            alert("Invalid placement! Check placement rules.");
                        }
                    }
                });
            });
        
            // Handle placed tile clicks for returning to rack
            document.addEventListener("click", (e) => {
                if (this.currentTurn !== "player") return;
                
                const tileElement = e.target.closest(".tile");
                if (!tileElement || !tileElement.closest(".board-cell")) return;
        
                const cell = tileElement.closest(".board-cell");
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
        
                // Find the placed tile
                const placedTileIndex = this.placedTiles.findIndex(t => 
                    t.row === row && t.col === col);
        
                if (placedTileIndex !== -1) {
                    // Return tile to rack
                    const placedTile = this.placedTiles[placedTileIndex];
                    this.playerRack.push(placedTile.tile);
                    this.board[row][col] = null;
                    cell.innerHTML = "";
                    this.placedTiles.splice(placedTileIndex, 1);
                    this.renderRack();
                    this.highlightValidPlacements();
                }
            });
        }
    
        // Quit game button
        const quitButton = document.getElementById("quit-game");
        if (quitButton) {
            quitButton.addEventListener("click", () => {
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
                        player: "Player",
                        word: "QUIT",
                        score: 0,
                        timestamp: new Date(),
                    });
                    this.updateMoveHistory();
                }
    
                // Trigger game over animation
                this.announceWinner();
            });
        }
    
        // Print history button
        document.getElementById("print-history").addEventListener("click", async () => {
            const printWindow = window.open("", "_blank");
            const gameDate = new Date().toLocaleString();
    
            // Show loading message
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Puzzle Game History - ${gameDate}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #333; }
                            .move { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
                            .word-header { font-size: 1.2em; color: #2c3e50; margin-bottom: 10px; }
                            .definitions { margin-left: 20px; padding: 10px; border-left: 3px solid #3498db; }
                            .part-of-speech { color: #e67e22; font-style: italic; }
                            .scores { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                            .loading { text-align: center; padding: 20px; font-style: italic; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="loading">Loading definitions...</div>
                    </body>
                </html>
            `);
    
            // Gather all unique words from move history
            const uniqueWords = [...new Set(
                this.moveHistory
                    .map((move) => move.word)
                    .filter((word) => word !== "SKIP" && word !== "EXCHANGE" && word !== "QUIT")
            )];
    
            // Fetch definitions for all words
            const wordDefinitions = new Map();
            for (const word of uniqueWords) {
                const definitions = await this.getWordDefinition(word);
                if (definitions) {
                    wordDefinitions.set(word, definitions);
                }
            }
    
            // Generate and set the content
            const content = this.generatePrintContent(gameDate, wordDefinitions);
            printWindow.document.body.innerHTML = content;
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
    }    

    selectTile(tileElement) {
        // Deselect previously selected tile
        if (this.selectedTile) {
            this.selectedTile.classList.remove("selected");
        }
        
        // Select new tile
        this.selectedTile = tileElement;
        tileElement.classList.add("selected");
    
        // Highlight valid placements
        this.highlightValidPlacements();
    }
    
    deselectTile() {
        if (this.selectedTile) {
            this.selectedTile.classList.remove("selected");
            this.selectedTile = null;
        }
    }

    async aiTurn() {
        console.log("AI thinking...");
    
        // Show "AI is thinking..." message
        const thinkingMessage = document.createElement("div");
        thinkingMessage.className = "ai-thinking-message";
        thinkingMessage.textContent = "AI is thinking...";
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
        setTimeout(() => thinkingMessage.style.opacity = "1", 100);
    
        console.log("AI rack:", this.aiRack.map(t => t.letter));
    
        try {
            // Only exchange if rack is severely unbalanced
            const shouldExchange = this.shouldExchangeTiles();
            if (shouldExchange && this.tiles.length >= 5) {
                console.log("AI choosing to exchange severely unbalanced rack");
                setTimeout(() => {
                    thinkingMessage.style.opacity = "0";
                    setTimeout(() => {
                        thinkingMessage.remove();
                        this.handleAIExchange();
                    }, 300);
                }, 1000);
                return;
            }
    
            // Try to find valid moves with increased persistence
            const possiblePlays = this.findAIPossiblePlays();
            console.log("Possible plays found:", possiblePlays?.length || 0);
    
            if (possiblePlays && possiblePlays.length > 0) {
                const bestPlay = this.selectBestPlay(possiblePlays);
                if (bestPlay) {
                    console.log("Choosing play:", bestPlay);
                    setTimeout(() => {
                        thinkingMessage.style.opacity = "0";
                        setTimeout(() => {
                            thinkingMessage.remove();
                            this.executeAIPlay(bestPlay);
                        }, 300);
                    }, 1000);
                    return;
                }
            }
    
            // If no plays found, try harder to find simple plays
            const simplePlays = this.findSimplePlays();
            if (simplePlays && simplePlays.length > 0) {
                const bestSimplePlay = this.selectBestPlay(simplePlays);
                if (bestSimplePlay) {
                    setTimeout(() => {
                        thinkingMessage.style.opacity = "0";
                        setTimeout(() => {
                            thinkingMessage.remove();
                            this.executeAIPlay(bestSimplePlay);
                        }, 300);
                    }, 1000);
                    return;
                }
            }
    
            // Last resort: try to form two-letter words
            const twoLetterPlay = this.findTwoLetterPlay();
            if (twoLetterPlay) {
                setTimeout(() => {
                    thinkingMessage.style.opacity = "0";
                    setTimeout(() => {
                        thinkingMessage.remove();
                        this.executeAIPlay(twoLetterPlay);
                    }, 300);
                }, 1000);
                return;
            }
    
            // Only exchange as absolute last resort
            console.log("No valid plays found - forced to exchange");
            setTimeout(() => {
                thinkingMessage.style.opacity = "0";
                setTimeout(() => {
                    thinkingMessage.remove();
                    this.handleAIExchange();
                }, 300);
            }, 1000);
    
        } catch (error) {
            console.error("Error in AI turn:", error);
            // Clean up UI in case of error
            thinkingMessage.remove();
            // Fall back to exchanging tiles
            this.handleAIExchange();
        }
    }    

    shouldExchangeTiles() {
        const rack = this.aiRack.map((t) => t.letter);
        const vowels = "AEIOU";
        const vowelCount = rack.filter((l) => vowels.includes(l)).length;
        const consonantCount = rack.length - vowelCount;

        // Only exchange if rack is severely unbalanced
        if (vowelCount === 0 || consonantCount === 0) return true;
        if (vowelCount > 5 || consonantCount > 6) return true;

        // Check for difficult letters
        const difficultLetters = "QJXZ";
        const difficultCount = rack.filter((l) =>
            difficultLetters.includes(l),
        ).length;
        if (difficultCount > 2 && this.tiles.length >= 10) return true;

        return false;
    }    

    evaluatePositionStrategy(play) {
        let value = 0;

        // Bonus for using premium squares
        value +=
            this.countPremiumSquaresUsed(
                play.startPos.row,
                play.startPos.col,
                play.isHorizontal,
                play.word,
            ) * 10;

        // Bonus for forming multiple words
        const crossWords = this.countIntersections(
            play.startPos.row,
            play.startPos.col,
            play.isHorizontal,
            play.word,
        );
        value += crossWords * 15;

        // Bonus for using high-point letters effectively
        value += this.evaluateLetterUsage(play.word) * 5;

        return value;
    }

    evaluateLetterUsage(word) {
        let value = 0;
        const highValueLetters = "JQXZ";
        const mediumValueLetters = "BFHMPVWY";

        for (const letter of word) {
            if (highValueLetters.includes(letter)) {
                value += 3;
            } else if (mediumValueLetters.includes(letter)) {
                value += 2;
            }
        }

        // Bonus for good vowel-consonant ratio
        const vowels = "AEIOU";
        const vowelCount = [...word].filter((l) => vowels.includes(l)).length;
        const ratio = vowelCount / word.length;
        if (ratio >= 0.3 && ratio <= 0.6) {
            value += 2;
        }

        return value;
    }

    findSimplePlays() {
        const plays = [];
        const rack = this.aiRack.map((t) => t.letter);

        // Get all possible 2-4 letter combinations
        const combinations = this.getLetterCombinations(rack, 4);

        for (const letters of combinations) {
            // Get all possible words from these letters
            const words = this.findPossibleWordsFromLetters(letters);

            for (const word of words) {
                // Find all valid positions for this word
                for (let row = 0; row < 15; row++) {
                    for (let col = 0; col < 15; col++) {
                        // Try horizontal placement
                        if (this.isValidAIPlacement(word, row, col, true)) {
                            const score = this.calculatePotentialScore(word, row, col, true);
                            plays.push({
                                word,
                                startPos: {
                                    row,
                                    col
                                },
                                isHorizontal: true,
                                score,
                            });
                        }

                        // Try vertical placement
                        if (this.isValidAIPlacement(word, row, col, false)) {
                            const score = this.calculatePotentialScore(word, row, col, false);
                            plays.push({
                                word,
                                startPos: {
                                    row,
                                    col
                                },
                                isHorizontal: false,
                                score,
                            });
                        }
                    }
                }
            }
        }

        return plays;
    }

    findPossibleWordsFromLetters(letters) {
        const words = new Set();

        // Convert letters to lowercase for dictionary matching
        const lowerLetters = letters.map((l) => l.toLowerCase());
        const letterCounts = {};
        let blankCount = 0;

        // Count available letters including blanks
        lowerLetters.forEach((letter) => {
            if (letter === "*") {
                blankCount++;
            } else {
                letterCounts[letter] = (letterCounts[letter] || 0) + 1;
            }
        });

        // Check each word in dictionary
        for (const dictWord of this.dictionary) {
            if (dictWord.length >= 2 && dictWord.length <= letters.length) {
                const wordCounts = {};
                let canForm = true;
                let blanksNeeded = 0;

                // Count letters needed for this word
                for (const letter of dictWord) {
                    wordCounts[letter] = (wordCounts[letter] || 0) + 1;
                }

                // Check if we have enough of each letter
                for (const [letter, count] of Object.entries(wordCounts)) {
                    const available = letterCounts[letter] || 0;
                    if (available < count) {
                        blanksNeeded += count - available;
                        if (blanksNeeded > blankCount) {
                            canForm = false;
                            break;
                        }
                    }
                }

                if (canForm) {
                    words.add(dictWord.toUpperCase());
                }
            }
        }

        return Array.from(words);
    }

    getLetterCombinations(letters, maxLength) {
        const combinations = [];

        // Helper function to generate combinations
        function generateCombination(current, remaining, minLength = 2) {
            if (current.length >= minLength && current.length <= maxLength) {
                combinations.push([...current]);
            }

            if (current.length >= maxLength) {
                return;
            }

            for (let i = 0; i < remaining.length; i++) {
                current.push(remaining[i]);
                generateCombination(current, remaining.slice(i + 1));
                current.pop();
            }
        }

        generateCombination([], letters);
        return combinations;
    }

    evaluateSimplePlay(word, row, col, isHorizontal) {
        let value = 0;

        // Base score
        value += this.calculatePotentialScore(word, row, col, isHorizontal);

        // Bonus for creating multiple words
        if (this.createsMultipleWords(word, row, col, isHorizontal)) {
            value += 15;
        }

        // Bonus for using premium squares
        value += this.countPremiumSquaresUsed(row, col, isHorizontal, word) * 5;

        // Bonus for good positioning
        if (this.isGoodPosition(row, col, isHorizontal, word)) {
            value += 10;
        }

        return value;
    }

    isGoodPosition(row, col, isHorizontal, word) {
        // Check if position uses board features effectively

        // Near center bonus
        const distanceFromCenter = Math.abs(7 - row) + Math.abs(7 - col);
        if (distanceFromCenter <= 3) return true;

        // Creates opportunities for future plays
        const futureOpportunities = this.countFutureOpportunities(
            row,
            col,
            isHorizontal,
            word,
        );
        if (futureOpportunities >= 2) return true;

        // Uses premium squares effectively
        const premiumSquares = this.countPremiumSquaresUsed(
            row,
            col,
            isHorizontal,
            word,
        );
        if (premiumSquares > 0) return true;

        return false;
    }

    findTwoLetterPlay() {
        const validTwoLetterWords = new Set([
            "AA",
            "AB",
            "AD",
            "AE",
            "AG",
            "AH",
            "AI",
            "AL",
            "AM",
            "AN",
            "AR",
            "AS",
            "AT",
            "AW",
            "AX",
            "AY",
            "BA",
            "BE",
            "BI",
            "BO",
            "BY",
            "DE",
            "DO",
            "ED",
            "EF",
            "EH",
            "EL",
            "EM",
            "EN",
            "ER",
            "ES",
            "ET",
            "EX",
            "FA",
            "FE",
            "GO",
            "HA",
            "HE",
            "HI",
            "HM",
            "HO",
            "ID",
            "IF",
            "IN",
            "IS",
            "IT",
            "JO",
            "KA",
            "LA",
            "LI",
            "LO",
            "MA",
            "ME",
            "MI",
            "MM",
            "MO",
            "MU",
            "MY",
            "NA",
            "NE",
            "NO",
            "NU",
            "OD",
            "OE",
            "OF",
            "OH",
            "OI",
            "OK",
            "OM",
            "ON",
            "OP",
            "OR",
            "OS",
            "OW",
            "OX",
            "OY",
            "PA",
            "PE",
            "PI",
            "PO",
            "QI",
            "RE",
            "SH",
            "SI",
            "SO",
            "TA",
            "TE",
            "TI",
            "TO",
            "UH",
            "UM",
            "UN",
            "UP",
            "US",
            "UT",
            "WE",
            "WO",
            "XI",
            "XU",
            "YA",
            "YE",
            "YO",
            "ZA",
        ]);

        const rack = this.aiRack.map((t) => t.letter);

        // Try all two-letter combinations
        for (let i = 0; i < rack.length; i++) {
            for (let j = i + 1; j < rack.length; j++) {
                const word = rack[i] + rack[j];
                if (validTwoLetterWords.has(word)) {
                    const positions = this.findValidPositionsForWord(word);
                    if (positions.length > 0) {
                        const bestPosition = positions.sort(
                            (a, b) =>
                            this.calculatePotentialScore(
                                word,
                                b.position.row,
                                b.position.col,
                                b.horizontal,
                            ) -
                            this.calculatePotentialScore(
                                word,
                                a.position.row,
                                a.position.col,
                                a.horizontal,
                            ),
                        )[0];

                        return {
                            word,
                            startPos: bestPosition.position,
                            isHorizontal: bestPosition.horizontal,
                            score: this.calculatePotentialScore(
                                word,
                                bestPosition.position.row,
                                bestPosition.position.col,
                                bestPosition.horizontal,
                            ),
                        };
                    }
                }
            }
        }

        return null;
    }

    findValidPositionsForWord(word) {
        const positions = [];

        // For first move, only allow placements through center
        if (this.isFirstMove) {
            // Try horizontal center placement
            if (this.isValidAIPlacement(word, 7, 7, true)) {
                positions.push({
                    position: {
                        row: 7,
                        col: 7
                    },
                    horizontal: true,
                });
            }
            // Try vertical center placement
            if (this.isValidAIPlacement(word, 7, 7, false)) {
                positions.push({
                    position: {
                        row: 7,
                        col: 7
                    },
                    horizontal: false,
                });
            }
            return positions;
        }

        // For subsequent moves, try all possible positions
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                // Only check positions near existing tiles
                if (this.hasAdjacentTile(row, col)) {
                    // Try horizontal placement
                    if (col <= 15 - word.length) {
                        if (this.isValidAIPlacement(word, row, col, true)) {
                            positions.push({
                                position: {
                                    row,
                                    col
                                },
                                horizontal: true,
                            });
                        }
                    }

                    // Try vertical placement
                    if (row <= 15 - word.length) {
                        if (this.isValidAIPlacement(word, row, col, false)) {
                            positions.push({
                                position: {
                                    row,
                                    col
                                },
                                horizontal: false,
                            });
                        }
                    }
                }
            }
        }

        return positions;
    }

    // Add new helper method for forming minimal valid words
    formMinimalValidWord() {
        const vowels = "AEIOU".split("");
        const consonants = "BCDFGHJKLMNPQRSTVWXYZ".split("");
        const availableLetters = this.aiRack.map((tile) => tile.letter);

        // Try to form simple CV or CVC patterns
        const hasVowel = availableLetters.some((l) => vowels.includes(l));
        const hasConsonant = availableLetters.some((l) => consonants.includes(l));

        if (hasVowel && hasConsonant) {
            // Form simple word patterns
            for (const letter1 of availableLetters) {
                for (const letter2 of availableLetters) {
                    if (letter1 === letter2) continue;
                    const word = letter1 + letter2;
                    if (this.dictionary.has(word.toLowerCase())) {
                        const startPos = this.findValidPositionForWord(word);
                        if (startPos) {
                            const play = {
                                word,
                                startPos,
                                isHorizontal: true,
                                score: this.calculatePotentialScore(
                                    word,
                                    startPos.row,
                                    startPos.col,
                                    true,
                                ),
                            };
                            this.executeAIPlay(play);
                            return;
                        }
                    }
                }
            }
        }
    }

    // Add helper method for finding valid position for a word
    findValidPositionForWord(word) {
        // Check center position for first move
        if (this.isFirstMove) {
            if (this.isValidAIPlacement(word, 7, 7, true)) {
                return {
                    row: 7,
                    col: 7
                };
            }
            return null;
        }

        // Try to find position near existing words
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (this.hasAdjacentTile(row, col)) {
                    if (this.isValidAIPlacement(word, row, col, true)) {
                        return {
                            row,
                            col
                        };
                    }
                    if (this.isValidAIPlacement(word, row, col, false)) {
                        return {
                            row,
                            col
                        };
                    }
                }
            }
        }
        return null;
    }

    setupHintSystem() {
        const hints = [
            "Triple Word Score (TW) squares multiply the entire word score by 3!",
            "Triple Letter Score (TL) squares multiply just that letter's score by 3!",
            "Using all 7 tiles in one move gives you a 50-point bonus!",
            "Blank tiles can be any letter, but are worth 0 points.",
            "Q and Z are worth 10 points each - try to use them on multiplier squares!",
            "Words must connect to existing tiles on the board (except for the first move).",
            "The center square (marked with ⚜) must be used in the first move.",
            "Try to save S tiles - they're great for making parallel words!",
            "High-scoring letters on TL squares can lead to massive points!",
            "Plan ahead - save valuable tiles for premium squares.",
            "Remember: all new words formed must be valid dictionary words.",
            "Cross-words count too! Check both directions when placing tiles.",
            "You can exchange tiles instead of playing a word - but you'll lose your turn.",
            "The letter 'S' can often be added to existing words to form new ones!",
            "Look for opportunities to play parallel words along existing ones.",
            "Short two-letter words can be valuable for creating multiple scoring opportunities.",
            "Common prefixes like 'RE-', 'UN-', and 'IN-' can help extend words.",
            "Common suffixes like '-ING', '-ED', and '-S' can help extend words.",
            "Keep a balance of vowels and consonants in your rack.",
            "Try to use high-scoring letters (J, X, Q, Z) on premium squares.",
            "Playing through existing words can create multiple scoring opportunities.",
            "Look for hook letters that can change existing words (e.g., HEAT to CHEAT).",
            "Save some good letters for later when better opportunities arise.",
            "Consider exchanging tiles if you have too many consonants or vowels.",
            "The letter 'Q' is usually followed by 'U' - save a 'U' if you have a 'Q'.",
            "Think defensively - avoid setting up TW squares for your opponent.",
            "The letters A, E, I, O, U are most common - use them wisely to connect words.",
            "Playing across multiple premium squares multiplies your score significantly!",
            "Look for opportunities to form two or more words in a single play.",
            "The more letters you play, the higher your potential score.",
            "Remember common two-letter words like AA, AB, AD, AE, AG, AH, AI, AL, AM, AN, AR, AS, AT, AW, AX, AY.",
            "Challenge yourself to use all seven tiles for the 50-point bonus!",
            "Position high-value letters strategically to maximize points.",
            "Watch out for blocked positions where no more words can be played.",
            "Try to keep at least two vowels in your rack for flexibility.",
            "The board edges can be valuable for high-scoring plays.",
            "Look for opportunities to create multiple small words simultaneously.",
            "Some letters (like S, E, R, T) can be saved for extending existing words.",
            "Consider blocking premium squares if your opponent is leading.",
            "Use blank tiles strategically - they're most valuable for high-scoring plays.",
            "Remember that longer words aren't always better - sometimes short words score more.",
            "Keep track of which high-value letters have been played.",
            "Look for opportunities to play 'bingos' (using all 7 tiles) for the bonus.",
            "Consider the remaining tiles when planning your strategy.",
            "Some premium squares are more valuable than others based on playable words.",
            "Contact Maurice's Email @ Maurice13stu@gmail.com if you have any suggestions!",
            "Blank tiles (★) can represent any letter - choose wisely for maximum impact!",
            "The center star (⚜) in the middle of the board must be covered on the first turn.",
            "Premium squares with multiple effects compound - plan combinations carefully!",
            "Letters like J, X, Q, and Z are rare - save them for special squares if possible.",
            "Special colored squares only apply their bonus when first covered.",
            "Premium square bonuses stack with the 50-point bonus for using all tiles!",
            "Once a premium square is used, it no longer provides its bonus in future turns.",
            "Blank tiles keep their assigned letter for the entire game.",
            "Some squares multiply your entire word score - aim for these with long words!",
            "Premium squares near the edges can be reached with shorter words.",
            "Special squares work best with high-value letters - plan your rack accordingly.",
            "The rarest letters (J, X, Q, Z) paired with premium squares can score big points!",
            "Center star (⚜) starts the game - build outward from there strategically.",
            "Premium square effects apply only to newly placed tiles, not existing ones.",
            "Multiple word bonuses can apply when forming several words in one turn!",
        ];

        let currentHintIndex = 0;
        const hintBox = document.getElementById("hint-box");
        const hintText = document.getElementById("hint-text");

        // Fisher-Yates shuffle algorithm
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        // Create a shuffled copy of hints
        let shuffledHints = shuffleArray([...hints]);

        const showNextHint = () => {
            // If we've shown all hints, reshuffle and start over
            if (currentHintIndex >= shuffledHints.length) {
                shuffledHints = shuffleArray([...hints]);
                currentHintIndex = 0;
            }

            hintText.textContent = shuffledHints[currentHintIndex];
            hintBox.classList.add("show");

            setTimeout(() => {
                hintBox.classList.remove("show");
            }, 5000); // Hide after 5 seconds

            currentHintIndex++;
        };

        // Show first hint after 5 seconds
        setTimeout(() => {
            showNextHint();
            // Then show new hints every 30 seconds
            setInterval(showNextHint, 30000);
        }, 5000);

        // Show random hint on hover
        hintBox.addEventListener("mouseenter", () => {
            // Show a random hint from the shuffled array
            hintText.textContent =
                shuffledHints[Math.floor(Math.random() * shuffledHints.length)];
            hintBox.classList.add("show");
        });

        hintBox.addEventListener("mouseleave", () => {
            hintBox.classList.remove("show");
        });
    }

    async findAIPossiblePlays() {
        try {
            const possiblePlays = [];
            const anchors = this.findAnchors();
            const availableLetters = this.aiRack.map(tile => tile.letter);
    
            console.log("=== Starting Enhanced AI Word Search ===");
            console.log("Available letters:", availableLetters);
            
            // Cache for MW API responses during this turn
            this.currentTurnMWCache = new Map();
    
            // If it's first move or empty board, use MW API to find longer words
            if (this.isFirstMove || this.board.every(row => row.every(cell => cell === null))) {
                const mwWords = await this.findMWWords(availableLetters);
                console.log("MW API suggested words:", mwWords);
    
                // Sort by length and quality, preferring longer words
                const candidates = mwWords
                    .sort((a, b) => {
                        const lengthDiff = b.length - a.length;
                        if (lengthDiff !== 0) return lengthDiff;
                        return this.evaluateWordQuality(b) - this.evaluateWordQuality(a);
                    })
                    .slice(0, 15); // Take top 15 candidates
    
                for (const word of candidates) {
                    const centerPos = {
                        row: 7,
                        col: 7 - Math.floor(word.length / 2)
                    };
                    
                    if (this.isValidAIPlacement(word, centerPos.row, centerPos.col, true)) {
                        possiblePlays.push({
                            word,
                            startPos: centerPos,
                            isHorizontal: true,
                            score: this.calculateStrategicScore(word, centerPos.row, centerPos.col, true)
                        });
                    }
                }
            } else {
                // For subsequent moves, combine MW suggestions with anchor-based plays
                for (const anchor of anchors) {
                    try {
                        const hPrefix = this.getPrefix(anchor, true);
                        const hSuffix = this.getSuffix(anchor, true);
                        const vPrefix = this.getPrefix(anchor, false);
                        const vSuffix = this.getSuffix(anchor, false);
    
                        // Get words from MW API based on available letters and patterns
                        const mwSuggestions = await this.getMWSuggestions(
                            availableLetters,
                            [hPrefix, hSuffix, vPrefix, vSuffix]
                        );
    
                        for (const word of mwSuggestions) {
                            // Try horizontal placement
                            if (this.canFormWord(word, hPrefix, hSuffix, availableLetters)) {
                                const startCol = anchor.col - hPrefix.length;
                                if (this.isValidAIPlacement(word, anchor.row, startCol, true)) {
                                    possiblePlays.push({
                                        word,
                                        startPos: { row: anchor.row, col: startCol },
                                        isHorizontal: true,
                                        score: this.calculateStrategicScore(word, anchor.row, startCol, true)
                                    });
                                }
                            }
    
                            // Try vertical placement
                            if (this.canFormWord(word, vPrefix, vSuffix, availableLetters)) {
                                const startRow = anchor.row - vPrefix.length;
                                if (this.isValidAIPlacement(word, startRow, anchor.col, false)) {
                                    possiblePlays.push({
                                        word,
                                        startPos: { row: startRow, col: anchor.col },
                                        isHorizontal: false,
                                        score: this.calculateStrategicScore(word, startRow, anchor.col, false)
                                    });
                                }
                            }
                        }
                    } catch (anchorError) {
                        console.error("Error processing anchor:", anchorError);
                        continue;
                    }
                }
            }
    
            // Filter and sort plays
            return this.filterAndSortPlays(possiblePlays);
    
        } catch (error) {
            console.error("Error in findAIPossiblePlays:", error);
            return [];
        }
    }

    async findMWWords(letters) {
        const words = new Set();
        const letterString = letters.join('').toLowerCase();
        
        try {
            // Use stem search to find potential words
            const response = await fetch(
                `https://www.dictionaryapi.com/api/v3/references/collegiate/json/stem:${letterString}?key=${this.mwDictionaryKey}`
            );
            const data = await response.json();
            
            // Process results, prioritizing longer words
            for (const entry of data) {
                if (typeof entry === 'object' && entry.meta && entry.meta.stems) {
                    for (const stem of entry.meta.stems) {
                        // Only consider words 4 letters or longer
                        if (stem.length >= 4 && this.canFormWord(stem.toUpperCase(), "", "", letters)) {
                            words.add(stem.toUpperCase());
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching from MW API:", error);
        }
        
        // Sort by length and return longer words first
        return Array.from(words).sort((a, b) => b.length - a.length);
    }

    async getMWSuggestions(letters, patterns) {
        const suggestions = new Set();
        const [hPrefix, hSuffix, vPrefix, vSuffix] = patterns;
        const maxLength = 15;
    
        try {
            // Try to find words that match our patterns
            const searchPatterns = [
                hPrefix && `${hPrefix}*`,
                hSuffix && `*${hSuffix}`,
                vPrefix && `${vPrefix}*`,
                vSuffix && `*${vSuffix}`
            ].filter(Boolean);
    
            for (const pattern of searchPatterns) {
                const response = await fetch(
                    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${pattern}?key=${this.mwDictionaryKey}`
                );
                const data = await response.json();
    
                // Process results
                for (const entry of data) {
                    if (typeof entry === 'object' && entry.meta && entry.meta.stems) {
                        for (const stem of entry.meta.stems) {
                            if (stem.length <= maxLength && 
                                this.canFormWord(stem.toUpperCase(), "", "", letters)) {
                                suggestions.add(stem.toUpperCase());
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error getting MW suggestions:", error);
        }
    
        return Array.from(suggestions);
    }

    evaluateWordQuality(word) {
        let quality = 0;
    
        // Base points for word length with cubic scaling
        quality += Math.pow(word.length, 3) * 10;
    
        // Letter value quality
        for (const letter of word) {
            const letterValue = this.tileValues[letter];
            quality += letterValue * 5;
            // Extra points for high-value letters
            if (letterValue >= 8) quality += 30;  // J, X, Q, Z
            else if (letterValue >= 4) quality += 15;  // F, H, V, W, Y
        }
    
        // Vowel-consonant balance
        const vowels = "AEIOU";
        const vowelCount = [...word].filter(l => vowels.includes(l)).length;
        const vowelRatio = vowelCount / word.length;
        if (vowelRatio >= 0.3 && vowelRatio <= 0.6) {
            quality += 25; // Ideal vowel-consonant ratio
        }
    
        // Common prefixes and suffixes bonus
        const commonPrefixes = ['RE', 'UN', 'IN', 'DIS'];
        const commonSuffixes = ['ING', 'ED', 'ER', 'EST', 'TION'];
        
        for (const prefix of commonPrefixes) {
            if (word.startsWith(prefix)) quality += 15;
        }
        for (const suffix of commonSuffixes) {
            if (word.endsWith(suffix)) quality += 20;
        }
    
        // Length bonus for longer words
        if (word.length >= 7) quality += 100;
        else if (word.length >= 5) quality += 40;
    
        return quality;
    }    
    
    // Add throttling for API calls
    async throttledMWRequest(url, cacheKey) {
        if (this.currentTurnMWCache.has(cacheKey)) {
            return this.currentTurnMWCache.get(cacheKey);
        }
    
        // Add delay between requests to respect rate limits
        if (this.lastMWRequest) {
            const timeSinceLastRequest = Date.now() - this.lastMWRequest;
            if (timeSinceLastRequest < 100) { // Minimum 100ms between requests
                await new Promise(resolve => setTimeout(resolve, 100 - timeSinceLastRequest));
            }
        }
    
        this.lastMWRequest = Date.now();
        const response = await fetch(url);
        const data = await response.json();
        
        this.currentTurnMWCache.set(cacheKey, data);
        return data;
    }

    generatePotentialWords(availableLetters, [hPrefix, hSuffix, vPrefix, vSuffix]) {
        const potentialWords = new Set();
        const letterCounts = {};
        let blankCount = 0;
    
        // Count available letters including blanks
        availableLetters.forEach(letter => {
            if (letter === '*') {
                blankCount++;
            } else {
                letterCounts[letter] = (letterCounts[letter] || 0) + 1;
            }
        });
    
        // Check dictionary for potential words
        for (const word of this.dictionary) {
            // Skip words that are too short
            if (word.length < 4) continue;
    
            const upperWord = word.toUpperCase();
            
            // Check if word can be formed with available letters and patterns
            if (this.canFormComplexWord(upperWord, letterCounts, blankCount, [hPrefix, hSuffix, vPrefix, vSuffix])) {
                potentialWords.add(upperWord);
            }
        }
    
        return Array.from(potentialWords);
    }

    canFormComplexWord(word, letterCounts, blankCount, patterns) {
        const tempCounts = { ...letterCounts };
        let tempBlankCount = blankCount;
    
        // Check if word matches any pattern
        const [hPrefix, hSuffix, vPrefix, vSuffix] = patterns;
        const matchesPattern = !hPrefix || word.startsWith(hPrefix) || 
                              !hSuffix || word.endsWith(hSuffix) ||
                              !vPrefix || word.startsWith(vPrefix) ||
                              !vSuffix || word.endsWith(vSuffix);
    
        if (!matchesPattern) return false;
    
        // Check if we have the letters to form the word
        for (const letter of word) {
            if (tempCounts[letter] && tempCounts[letter] > 0) {
                tempCounts[letter]--;
            } else if (tempBlankCount > 0) {
                tempBlankCount--;
            } else {
                return false;
            }
        }
    
        return true;
    }
    
    calculateStrategicScore(word, row, col, isHorizontal) {
        let score = this.calculatePotentialScore(word, row, col, isHorizontal);
        
        // Exponential bonus for word length
        score += Math.pow(word.length, 3) * 15;
        
        // Additional bonuses
        if (word.length >= 7) score += 100; // Big bonus for 7+ letters
        if (word.length >= 5) score += 50;  // Medium bonus for 5+ letters
        
        // Rest of strategic scoring...
        const premiumSquares = this.countPremiumSquaresUsed(row, col, isHorizontal, word);
        score += premiumSquares * 25;
        
        const crossWords = this.countIntersections(row, col, isHorizontal, word);
        score += crossWords * 30;
        
        return score;
    }

    findAdvancedWordCombinations(availableLetters) {
        const combinations = new Set();
        const lettersWithBlanks = [...availableLetters];
        const blankIndices = lettersWithBlanks
            .map((letter, index) => letter === '*' ? index : -1)
            .filter(index => index !== -1);
    
        // Generate all possible letter combinations with blanks
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const maxCombinations = Math.pow(26, blankIndices.length);
        
        for (let i = 0; i < maxCombinations && combinations.size < 100; i++) {
            const tempLetters = [...lettersWithBlanks];
            
            // Replace blanks with actual letters
            blankIndices.forEach((blankIndex, position) => {
                const letterIndex = Math.floor(i / Math.pow(26, position)) % 26;
                tempLetters[blankIndex] = alphabet[letterIndex];
            });
    
            // Find all possible words using these letters
            this.findPossibleWordsFromLetters(tempLetters).forEach(word => {
                if (this.isAdvancedWord(word)) {
                    combinations.add(word);
                }
            });
        }
    
        return Array.from(combinations).sort((a, b) => b.length - a.length);
    }

    isAdvancedWord(word) {
        // Minimum length requirement
        if (word.length < 4) return false;
    
        // Check for complexity using letter patterns
        const complexPatterns = [
            /[JQXZ]/, // Uncommon letters
            /[BCDFGHJKLMNPQRSTVWXZ]{3,}/, // Three or more consonants
            /[AEIOU]{2,}/, // Two or more vowels
            /.{5,}/ // Words of length 5 or more
        ];
    
        return complexPatterns.some(pattern => pattern.test(word));
    }

    calculateWordComplexity(word) {
        const letterValues = {
            'J': 8, 'K': 7, 'Q': 10, 'X': 9, 'Z': 10,
            'W': 6, 'V': 6, 'H': 5, 'Y': 5, 'F': 5,
            'B': 4, 'C': 4, 'M': 4, 'P': 4
        };
    
        return word.split('').reduce((score, letter) => {
            return score + (letterValues[letter] || 1);
        }, 0);
    }

    selectBestPlay(plays) {
        const validPlays = plays.filter(play => {
            if (!play || !play.word) return false;
            
            // Minimum word length of 4
            if (play.word.length < 4) return false;
            
            // Validate with MW API
            return this.validateWordWithMW(play.word.toLowerCase());
        });
        
        if (validPlays.length === 0) return null;
        
        return validPlays.sort((a, b) => {
            // Heavily prioritize word length
            const lengthDiff = (Math.pow(b.word.length, 3) - Math.pow(a.word.length, 3)) * 10;
            if (Math.abs(lengthDiff) > 0) return lengthDiff;
            
            // Consider score as secondary factor
            return b.score - a.score;
        })[0];
    }

    findCenterPlays(wordCombinations) {
        const centerPlays = [];
        
        for (const word of wordCombinations) {
            // Try horizontal center placement
            const colStart = Math.max(0, 7 - Math.floor(word.length / 2));
            if (this.isValidAIPlacement(word, 7, colStart, true)) {
                const score = this.calculateStrategicScore(word, 7, colStart, true);
                centerPlays.push({
                    word,
                    startPos: { row: 7, col: colStart },
                    isHorizontal: true,
                    score
                });
            }
    
            // Try vertical center placement
            const rowStart = Math.max(0, 7 - Math.floor(word.length / 2));
            if (this.isValidAIPlacement(word, rowStart, 7, false)) {
                const score = this.calculateStrategicScore(word, rowStart, 7, false);
                centerPlays.push({
                    word,
                    startPos: { row: rowStart, col: 7 },
                    isHorizontal: false,
                    score
                });
            }
        }
    
        return centerPlays.sort((a, b) => b.score - a.score);
    }

    isSimpleExtension(word, existingWords) {
        for (const existingWord of existingWords) {
            // Check for simple prefix/suffix additions
            if (word.startsWith(existingWord) || word.endsWith(existingWord)) {
                return true;
            }
            // Check for common modifications
            if (
                word === existingWord + "S" ||
                word === existingWord + "ED" ||
                word === existingWord + "ING" ||
                word === existingWord + "ES"
            ) {
                return true;
            }
        }
        return false;
    }

    createsMultipleWords(word, row, col, isHorizontal) {
        if (!word || !this.isValidPosition(row, col)) return false;

        let crossWordCount = 0;

        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;

            // Check if position is valid before proceeding
            if (!this.isValidPosition(currentRow, currentCol)) continue;

            // Check perpendicular direction for potential words
            const crossWord = this.getPerpendicularWord(
                currentRow,
                currentCol,
                isHorizontal,
            );
            if (crossWord && crossWord.length > 2) {
                crossWordCount++;
            }
        }

        return crossWordCount > 1;
    }

    getPerpendicularWord(row, col, isHorizontal) {
        if (!this.isValidPosition(row, col)) return null;

        // Get the word formed in the perpendicular direction
        return isHorizontal ?
            this.getVerticalWordAt(row, col) :
            this.getHorizontalWordAt(row, col);
    }

    getVerticalWordAt(row, col) {
        if (!this.isValidPosition(row, col)) return null;

        let word = "";
        let startRow = row;

        // Find start of word
        while (
            startRow > 0 &&
            this.board[startRow - 1] &&
            this.board[startRow - 1][col]
        ) {
            startRow--;
        }

        // Build word from start position
        let currentRow = startRow;
        while (
            currentRow < 15 &&
            this.board[currentRow] &&
            this.board[currentRow][col]
        ) {
            word += this.board[currentRow][col].letter;
            currentRow++;
        }

        return word.length > 1 ? word : null;
    }

    getHorizontalWordAt(row, col) {
        if (!this.isValidPosition(row, col)) return null;

        let word = "";
        let startCol = col;

        // Find start of word
        while (startCol > 0 && this.board[row][startCol - 1]) {
            startCol--;
        }

        // Build word from start position
        let currentCol = startCol;
        while (currentCol < 15 && this.board[row] && this.board[row][currentCol]) {
            word += this.board[row][currentCol].letter;
            currentCol++;
        }

        return word.length > 1 ? word : null;
    }

    hasPerpendicularWord(row, col, isHorizontal) {
        if (isHorizontal) {
            return this.getVerticalWordAt(row, col) !== null;
        } else {
            return this.getHorizontalWordAt(row, col) !== null;
        }
    }

    getWordAt(row, col, isHorizontal) {
        if (!this.isValidPosition(row, col)) return null;

        let word = "";
        let startPos = isHorizontal ? col : row;

        // Find start of word
        while (
            this.isValidPosition(
                isHorizontal ? row : startPos - 1,
                isHorizontal ? startPos - 1 : col,
            ) &&
            this.board[isHorizontal ? row : startPos - 1][
                isHorizontal ? startPos - 1 : col
            ]
        ) {
            startPos--;
        }

        // Build word
        let currentPos = startPos;
        while (
            this.isValidPosition(
                isHorizontal ? row : currentPos,
                isHorizontal ? currentPos : col,
            ) &&
            this.board[isHorizontal ? row : currentPos][
                isHorizontal ? currentPos : col
            ]
        ) {
            word +=
                this.board[isHorizontal ? row : currentPos][
                    isHorizontal ? currentPos : col
                ].letter;
            currentPos++;
        }

        return word.length > 1 ? word : null;
    }

    isValidPosition(row, col) {
        return row >= 0 && row < 15 && col >= 0 && col < 15;
    }

    getMinDistanceToLastMove(row, col) {
        if (this.placedTiles.length === 0) return Infinity;

        const lastMove = this.placedTiles[0];
        return Math.abs(row - lastMove.row) + Math.abs(col - lastMove.col);
    }

    getWordInDirection(row, col, direction) {
        const [dx, dy] = direction;
        let word = "";
        let currentRow = row;
        let currentCol = col;

        // Find start of word
        while (
            currentRow >= 0 &&
            currentRow < 15 &&
            currentCol >= 0 &&
            currentCol < 15 &&
            this.board[currentRow][currentCol]
        ) {
            currentRow -= dx;
            currentCol -= dy;
        }

        // Move back to last valid position
        currentRow += dx;
        currentCol += dy;

        // Build word
        while (
            currentRow >= 0 &&
            currentRow < 15 &&
            currentCol >= 0 &&
            currentCol < 15 &&
            this.board[currentRow][currentCol]
        ) {
            word += this.board[currentRow][currentCol].letter;
            currentRow += dx;
            currentCol += dy;
        }

        return word.length > 1 ? word : null;
    }

    getConnectedWords(row, col) {
        const words = new Set();
        const directions = [
            [0, 1], // horizontal
            [1, 0], // vertical
        ];

        for (const direction of directions) {
            const word = this.getWordInDirection(row, col, direction);
            if (word) {
                words.add(word);
            }
        }

        return Array.from(words);
    }

    getPotentialCrossWords(row, col, letter, direction) {
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[row][col] = {
            letter: letter
        };

        return direction === "horizontal" ?
            this.getVerticalWordAt(row, col) :
            this.getHorizontalWordAt(row, col);
    }

    getAllWordsFromPosition(row, col, isHorizontal) {
        const words = new Set();

        // Get main word
        const mainWord = this.getWordAt(row, col, isHorizontal);
        if (mainWord) words.add(mainWord);

        // Get perpendicular words
        const perpWord = this.getWordAt(row, col, !isHorizontal);
        if (perpWord) words.add(perpWord);

        return Array.from(words);
    }

    findPotentialWords(availableLetters) {
        const words = new Set();
        const letterCount = {};
        let blankCount = availableLetters.filter((l) => l === "*").length;

        // Count available letters
        availableLetters.forEach((letter) => {
            if (letter !== "*") {
                letterCount[letter] = (letterCount[letter] || 0) + 1;
            }
        });

        // Check dictionary for words that can be formed
        for (const word of this.dictionary) {
            if (word.length >= 2) {
                const upperWord = word.toUpperCase();
                const tempCount = {
                    ...letterCount
                };
                let tempBlankCount = blankCount;
                let canForm = true;

                // Check if word can be formed with available letters
                for (const letter of upperWord) {
                    if (tempCount[letter] && tempCount[letter] > 0) {
                        tempCount[letter]--;
                    } else if (tempBlankCount > 0) {
                        tempBlankCount--;
                    } else {
                        canForm = false;
                        break;
                    }
                }

                if (canForm) {
                    words.add(upperWord);
                }
            }
        }

        return Array.from(words);
    }

    findWordsWithPrefixSuffix(prefix, suffix, availableLetters) {
        const words = new Set();
        const pattern = new RegExp(`^${prefix}.*${suffix}$`);

        // Get all possible combinations of available letters
        const letterCombinations = this.getCombinations(availableLetters);

        for (const combination of letterCombinations) {
            const word = prefix + combination + suffix;
            if (
                word.length >= 2 &&
                this.dictionary.has(word.toLowerCase()) &&
                pattern.test(word)
            ) {
                words.add(word);
            }
        }

        return Array.from(words);
    }

    getCombinations(letters, maxLength = 7) {
        const results = new Set();

        function combine(current, remaining) {
            if (current.length > 0) {
                results.add(current);
            }
            if (current.length >= maxLength) return;

            for (let i = 0; i < remaining.length; i++) {
                combine(current + remaining[i], remaining.slice(i + 1));
            }
        }

        combine("", letters.join(""));
        return Array.from(results);
    }

    isSimpleModification(word, existingWords) {
        const commonSuffixes = ["S", "ES", "ED", "ING"];

        for (const existingWord of existingWords) {
            // Check for simple plurals or common suffixes
            if (
                commonSuffixes.some(
                    (suffix) =>
                    word === existingWord + suffix || existingWord === word + suffix,
                )
            ) {
                return true;
            }

            // Check for simple prefixes
            if (word.endsWith(existingWord) || existingWord.endsWith(word)) {
                return true;
            }
        }

        return false;
    }

    canFormLongerWord(currentWord, availableLetters) {
        const minLength = currentWord.length + 1;
        const maxLength = Math.min(
            15,
            availableLetters.length + currentWord.length,
        );
        const letterPool = [...availableLetters.map((t) => t.letter)];

        // Count available letters including blanks
        const letterCount = {};
        let blankCount = letterPool.filter((l) => l === "*").length;
        letterPool.forEach((letter) => {
            if (letter !== "*") {
                letterCount[letter] = (letterCount[letter] || 0) + 1;
            }
        });

        // Search dictionary for longer words
        for (const word of this.dictionary) {
            if (word.length >= minLength && word.length <= maxLength) {
                const upperWord = word.toUpperCase();
                const tempCount = {
                    ...letterCount
                };
                let tempBlankCount = blankCount;
                let canForm = true;

                // Check if we can form this word
                for (const letter of upperWord) {
                    if (tempCount[letter] && tempCount[letter] > 0) {
                        tempCount[letter]--;
                    } else if (tempBlankCount > 0) {
                        tempBlankCount--;
                    } else {
                        canForm = false;
                        break;
                    }
                }

                if (canForm) {
                    return true;
                }
            }
        }
        return false;
    }

    evaluateWordQuality(word, row, col, horizontal) {
        let quality = 0;
    
        // Give massive bonus for longer words
        quality += Math.pow(word.length, 3) * 10; // Cubic scaling for length
    
        // Bonus for using premium squares
        const premiumSquares = this.countPremiumSquaresUsed(row, col, horizontal, word);
        quality += premiumSquares * 15;
    
        // Small bonus for cross-words (but less important than length)
        const crossWords = this.countIntersections(row, col, horizontal, word);
        quality += crossWords * 10;
    
        // Minor bonus for balanced letter usage
        const letterBalance = this.evaluateLetterBalance(word);
        quality += letterBalance * 5;
    
        return quality;
    }

    evaluateCrossWordPotential(word, row, col, horizontal) {
        let potential = 0;
        const commonLetters = "AEIOURST";

        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Bonus for common letters in good positions
            if (commonLetters.includes(letter)) {
                // Check if position allows for cross-word formation
                if (this.hasAdjacentSpace(currentRow, currentCol, !horizontal)) {
                    potential++;
                }
            }

            // Extra bonus for S in good positions
            if (
                letter === "S" &&
                this.isGoodPositionForS(currentRow, currentCol, horizontal)
            ) {
                potential += 2;
            }
        }

        return potential;
    }

    evaluatePositionalValue(row, col, horizontal, word) {
        let value = 0;
        const centerRow = 7,
            centerCol = 7;

        // Distance from center
        const distanceFromCenter =
            Math.abs(row - centerRow) + Math.abs(col - centerCol);
        value -= distanceFromCenter * 2; // Slight penalty for distance from center

        // Check if move creates a balanced board
        const boardBalance = this.evaluateBoardBalance(row, col, horizontal, word);
        value += boardBalance;

        // Bonus for moves that don't crowd the board
        if (!this.isBoardCrowded(row, col, horizontal, word)) {
            value += 15;
        }

        // Consider edge proximity
        if (this.isNearEdge(row, col, horizontal, word)) {
            value -= 10; // Penalty for being too close to edge
        }

        return value;
    }

    hasAdjacentSpace(row, col, vertical) {
        if (vertical) {
            // Check spaces above and below
            const aboveEmpty = row > 0 && !this.board[row - 1][col];
            const belowEmpty = row < 14 && !this.board[row + 1][col];
            return aboveEmpty || belowEmpty;
        } else {
            // Check spaces left and right
            const leftEmpty = col > 0 && !this.board[row][col - 1];
            const rightEmpty = col < 14 && !this.board[row][col + 1];
            return leftEmpty || rightEmpty;
        }
    }

    isGoodPositionForS(row, col, horizontal) {
        // Check if S can be used to extend existing words
        if (horizontal) {
            // Check if there's a word to the left that could be pluralized
            return (
                col > 0 &&
                this.board[row][col - 1] &&
                !this.board[row][col] &&
                this.isValidWordEnd(row, col - 1)
            );
        } else {
            // Check if there's a word above that could be pluralized
            return (
                row > 0 &&
                this.board[row - 1][col] &&
                !this.board[row][col] &&
                this.isValidWordEnd(row - 1, col)
            );
        }
    }

    evaluateBoardBalance(row, col, horizontal, word) {
        let balance = 0;
        const boardQuadrants = this.getBoardQuadrantDensities();
        const wordQuadrant = this.getQuadrant(row, col);

        // Prefer plays in less dense quadrants
        const currentDensity = boardQuadrants[wordQuadrant];
        balance += (1 - currentDensity) * 20;

        // Bonus for connecting different areas of the board
        if (this.connectsDifferentAreas(row, col, horizontal, word)) {
            balance += 25;
        }

        return balance;
    }

    connectsDifferentAreas(row, col, horizontal, word) {
        const connectedAreas = new Set();

        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Check all adjacent positions
            const directions = [
                [-1, 0],
                [1, 0],
                [0, -1],
                [0, 1],
            ];
            for (const [dx, dy] of directions) {
                const newRow = currentRow + dx;
                const newCol = currentCol + dy;

                if (
                    this.isValidPosition(newRow, newCol) &&
                    this.board[newRow][newCol]
                ) {
                    connectedAreas.add(this.getAreaIdentifier(newRow, newCol));
                }
            }
        }

        return connectedAreas.size > 1;
    }

    getAreaIdentifier(row, col) {
        // Divide board into regions and return identifier for given position
        if (row < 5) {
            return col < 5 ? "TL" : col < 10 ? "TC" : "TR";
        } else if (row < 10) {
            return col < 5 ? "ML" : col < 10 ? "MC" : "MR";
        } else {
            return col < 5 ? "BL" : col < 10 ? "BC" : "BR";
        }
    }

    getBoardQuadrantDensities() {
        const quadrants = {
            TL: 0,
            TC: 0,
            TR: 0,
            ML: 0,
            MC: 0,
            MR: 0,
            BL: 0,
            BC: 0,
            BR: 0,
        };

        let counts = {};
        let totals = {};

        // Initialize counters
        for (const quad in quadrants) {
            counts[quad] = 0;
            totals[quad] = 0;
        }

        // Count occupied spaces in each quadrant
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                const quad = this.getAreaIdentifier(row, col);
                totals[quad]++;
                if (this.board[row][col]) {
                    counts[quad]++;
                }
            }
        }

        // Calculate densities
        for (const quad in quadrants) {
            quadrants[quad] = counts[quad] / totals[quad];
        }

        return quadrants;
    }

    evaluateDefensivePosition(row, col, horizontal, word) {
        let value = 0;

        // Check for potential high-scoring opportunities created for opponent
        const vulnerabilities = this.assessVulnerabilities(
            row,
            col,
            horizontal,
            word,
        );
        value -= vulnerabilities * 30;

        // Bonus for blocking opponent's access to premium squares
        const blockedPremiums = this.countBlockedPremiumSquares(
            row,
            col,
            horizontal,
            word,
        );
        value += blockedPremiums * 25;

        // Consider distance from edges (avoid creating edge opportunities)
        const edgeRisk = this.assessEdgeRisk(row, col, horizontal, word);
        value -= edgeRisk;

        return value;
    }

    assessVulnerabilities(row, col, horizontal, word) {
        let vulnerabilityCount = 0;

        // Check positions adjacent to the word
        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Check perpendicular positions
            const checkPositions = horizontal ? [
                [currentRow - 1, currentCol],
                [currentRow + 1, currentCol],
            ] : [
                [currentRow, currentCol - 1],
                [currentRow, currentCol + 1],
            ];

            for (const [checkRow, checkCol] of checkPositions) {
                if (
                    this.isValidPosition(checkRow, checkCol) &&
                    !this.board[checkRow][checkCol]
                ) {
                    // Check if position could be used for high-scoring play
                    if (this.isPotentialHighScorePosition(checkRow, checkCol)) {
                        vulnerabilityCount++;
                    }
                }
            }
        }

        return vulnerabilityCount;
    }

    isPotentialHighScorePosition(row, col) {
        // Check if position is adjacent to premium squares
        const adjacentPremiums = this.getAdjacentPremiumSquares(row, col);
        if (adjacentPremiums.length > 0) return true;

        // Check if position could be used for long word placement
        const maxWordLength = this.getMaxPossibleWordLength(row, col);
        if (maxWordLength >= 7) return true;

        return false;
    }

    getMaxPossibleWordLength(row, col) {
        // Check horizontal
        let horizontalSpace = 0;
        let currentCol = col;
        while (currentCol >= 0 && !this.board[row][currentCol]) {
            horizontalSpace++;
            currentCol--;
        }
        currentCol = col + 1;
        while (currentCol < 15 && !this.board[row][currentCol]) {
            horizontalSpace++;
            currentCol++;
        }

        // Check vertical
        let verticalSpace = 0;
        let currentRow = row;
        while (currentRow >= 0 && !this.board[currentRow][col]) {
            verticalSpace++;
            currentRow--;
        }
        currentRow = row + 1;
        while (currentRow < 15 && !this.board[currentRow][col]) {
            verticalSpace++;
            currentRow++;
        }

        return Math.max(horizontalSpace, verticalSpace);
    }

    countBlockedPremiumSquares(row, col, horizontal, word) {
        let blocked = 0;
        const premiumTypes = ["tw", "dw", "tl", "dl"];

        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Check adjacent positions
            const adjacentPositions = [
                [currentRow - 1, currentCol],
                [currentRow + 1, currentCol],
                [currentRow, currentCol - 1],
                [currentRow, currentCol + 1],
            ];

            for (const [checkRow, checkCol] of adjacentPositions) {
                if (this.isValidPosition(checkRow, checkCol)) {
                    const premium = this.getPremiumSquareType(checkRow, checkCol);
                    if (premiumTypes.includes(premium)) {
                        blocked++;
                    }
                }
            }
        }

        return blocked;
    }

    assessEdgeRisk(row, col, horizontal, word) {
        let risk = 0;

        // Check if word is placed near edges
        const isNearEdge = (pos) => pos <= 1 || pos >= 13;

        if (horizontal) {
            if (isNearEdge(row)) {
                risk += 15;
                // Extra penalty if word creates opportunities along the edge
                if (this.createsEdgeOpportunities(row, col, horizontal, word)) {
                    risk += 20;
                }
            }
        } else {
            if (isNearEdge(col)) {
                risk += 15;
                if (this.createsEdgeOpportunities(row, col, horizontal, word)) {
                    risk += 20;
                }
            }
        }

        return risk;
    }

    createsEdgeOpportunities(row, col, horizontal, word) {
        // Check if placement creates easy extension opportunities along edges
        const checkPositions = horizontal ? [
            [row - 1, col + word.length],
            [row + 1, col + word.length],
        ] : [
            [row + word.length, col - 1],
            [row + word.length, col + 1],
        ];

        for (const [checkRow, checkCol] of checkPositions) {
            if (
                this.isValidPosition(checkRow, checkCol) &&
                !this.board[checkRow][checkCol]
            ) {
                if (this.isPotentialHighScorePosition(checkRow, checkCol)) {
                    return true;
                }
            }
        }

        return false;
    }

    isValidPosition(row, col) {
        return (
            row >= 0 &&
            row < 15 &&
            col >= 0 &&
            col < 15 &&
            this.board[row] !== undefined &&
            this.board[row][col] !== undefined
        );
    }

    findSimpleWords(letters) {
        const words = new Set();
        const letterCount = {};

        // Count available letters
        letters.forEach((letter) => {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        });

        // Check each word in dictionary
        for (const word of this.dictionary) {
            if (word.length >= 2 && word.length <= letters.length) {
                const upperWord = word.toUpperCase();
                const tempCount = {
                    ...letterCount
                };
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
            return [{
                row: 7,
                col: 7
            }];
        }

        // Find all positions adjacent to existing tiles
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (!this.board[row][col] && this.hasAdjacentTile(row, col)) {
                    anchors.push({
                        row,
                        col
                    });
                }
            }
        }
        return anchors;
    }

    hasAdjacentTile(row, col) {
        const directions = [
            [-1, 0], // up
            [1, 0], // down
            [0, -1], // left
            [0, 1], // right
        ];

        return directions.some(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            return (
                this.isValidPosition(newRow, newCol) &&
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
                const play = this.createPlay(
                    word,
                    anchor,
                    isHorizontal,
                    prefix,
                    suffix,
                );
                if (play) {
                    plays.push(play);
                }
            }
        }

        return plays;
    }

    async getWordDefinition(word) {
        // Skip special moves and compound words
        if (
            word === "SKIP" ||
            word === "EXCHANGE" ||
            word === "QUIT" ||
            word.includes("&")
        ) {
            return null;
        }

        // Clean up the word - remove scores and parentheses
        const cleanWord = word.split("(")[0].trim();

        try {
            // Fetch from the dictionary API
            const response = await fetch(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord.toLowerCase()}`,
            );

            // Handle API errors
            if (!response.ok) {
                console.log(`No definition found for: ${cleanWord}`);
                return null;
            }

            const data = await response.json();

            // Extract and format the definitions
            if (data && data[0] && data[0].meanings) {
                return data[0].meanings.map((meaning) => ({
                    partOfSpeech: meaning.partOfSpeech,
                    definitions: meaning.definitions
                        .slice(0, 2) // Limit to first 2 definitions per part of speech
                        .map((def) => def.definition),
                }));
            }

            return null;
        } catch (error) {
            console.error(`Error fetching definition for ${word}:`, error);
            return null;
        }
    }

    generatePrintContent(gameDate, wordDefinitions) {
        // Generate header with game information
        const header = `
          <div class="header">
              <h1>Scrabble Game History</h1>
              <p>Game played on: ${gameDate}</p>
              <div class="scores">
                  <h2>Final Scores</h2>
                  <p>Player: ${this.playerScore} points</p>
                  <p>Computer: ${this.aiScore} points</p>
                  <p>Winner: ${this.playerScore > this.aiScore ? "Player" : "Computer"}</p>
              </div>
          </div>
      `;

        // Generate content for each move
        const moves = this.moveHistory
            .map((move, index) => {
                // Handle special moves (SKIP, EXCHANGE, QUIT)
                if (
                    move.word === "SKIP" ||
                    move.word === "EXCHANGE" ||
                    move.word === "QUIT"
                ) {
                    return `
                  <div class="move">
                      <div class="move-header">
                          <h3>Move ${index + 1}</h3>
                          <p><strong>Player:</strong> ${move.player}</p>
                          <p><strong>Action:</strong> ${move.word}</p>
                          <p><strong>Score:</strong> ${move.score}</p>
                      </div>
                  </div>
              `;
                }

                // Handle regular word moves
                let wordContent = "";
                let words;

                // Handle multiple words (separated by &)
                if (move.word.includes("&")) {
                    words = move.word.split("&").map((w) => {
                        // Extract word and score from format "WORD (score)"
                        const match = w.trim().match(/([A-Z]+)\s*\((\d+)\)/);
                        return match ? match[1] : w.trim();
                    });
                } else {
                    // Handle single word
                    const match = move.word.match(/([A-Z]+)\s*(?:\((\d+)\))?/);
                    words = match ? [match[1]] : [move.word];
                }

                // Generate definition sections for each word
                const definitions = words
                    .map((word) => {
                        const def = wordDefinitions.get(word);
                        if (!def) return "";

                        return `
                  <div class="word-section">
                      <div class="word-header">
                          <h4>${word}</h4>
                      </div>
                      <div class="definitions">
                          ${def
                            .map(
                              (meaning) => `
                              <div class="meaning">
                                  <span class="part-of-speech">${meaning.partOfSpeech}</span>
                                  <ul>
                                      ${meaning.definitions
                                        .map(
                                          (d) => `
                                          <li>${d}</li>
                                      `,
                                        )
                                        .join("")}
                                  </ul>
                              </div>
                          `,
                            )
                            .join("")}
                      </div>
                  </div>
              `;
                    })
                    .join("");

                // Combine all elements for this move
                return `
              <div class="move">
                  <div class="move-header">
                      <h3>Move ${index + 1}</h3>
                      <p><strong>Player:</strong> ${move.player}</p>
                      <p><strong>Word(s):</strong> ${move.word}</p>
                      <p><strong>Score:</strong> ${move.score}</p>
                  </div>
                  <div class="definitions-container">
                      ${definitions}
                  </div>
              </div>
          `;
            })
            .join("");

        // Add additional styling
        const styles = `
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  line-height: 1.6;
                  color: #333;
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
                  padding-bottom: 20px;
                  border-bottom: 2px solid #333;
              }
              .scores {
                  margin: 20px 0;
                  padding: 15px;
                  background: #f5f5f5;
                  border-radius: 5px;
              }
              .move {
                  margin: 20px 0;
                  padding: 20px;
                  border: 1px solid #ddd;
                  border-radius: 5px;
                  background: #f9f9f9;
              }
              .move-header {
                  margin-bottom: 15px;
                  padding-bottom: 10px;
                  border-bottom: 1px solid #ddd;
              }
              .word-section {
                  margin: 15px 0;
                  padding-left: 20px;
                  border-left: 3px solid #3498db;
              }
              .word-header {
                  font-size: 1.2em;
                  color: #2c3e50;
                  margin-bottom: 10px;
              }
              .part-of-speech {
                  color: #e67e22;
                  font-style: italic;
                  font-weight: bold;
              }
              .definitions {
                  margin-left: 20px;
              }
              .meaning {
                  margin: 10px 0;
              }
              ul {
                  margin: 5px 0;
                  padding-left: 20px;
              }
              li {
                  margin: 5px 0;
              }
              @media print {
                  .move {
                      break-inside: avoid;
                      page-break-inside: avoid;
                  }
              }
          </style>
      `;

        // Return complete HTML content
        return `
          ${styles}
          ${header}
          <div class="moves-container">
              ${moves}
          </div>
      `;
    }

    getPrefix(anchor, isHorizontal) {
        let prefix = "";
        let {
            row,
            col
        } = anchor;

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
        let suffix = "";
        let {
            row,
            col
        } = anchor;

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
        const availableLetters = this.aiRack.map((tile) => tile.letter);

        // Count vowels and consonants
        const vowels = ["A", "E", "I", "O", "U"];
        const vowelCount = availableLetters.filter((l) =>
            vowels.includes(l),
        ).length;
        const consonantCount = availableLetters.length - vowelCount;

        // Try finding simple 2-3 letter words first
        const simpleWords = this.findSimpleWords(availableLetters);
        if (simpleWords.length > 0) {
            console.log("Found simple words:", simpleWords);
            return true;
        }

        // If rack is very unbalanced, prefer exchange
        if (
            vowelCount === 0 ||
            consonantCount === 0 ||
            vowelCount > 5 ||
            consonantCount > 5
        ) {
            console.log("Rack is unbalanced - exchanging tiles");
            return false;
        }

        // Check each word in dictionary
        for (const word of this.dictionary) {
            // Allow shorter words (2-3 letters) for more possibilities
            if (
                word.length >= 2 &&
                this.canFormWord(word, "", "", availableLetters)
            ) {
                console.log("Found possible word:", word);
                return true;
            }
        }

        return false;
    }

    findSimpleWords(letters) {
        const words = new Set();
        const letterCount = {};

        // Count available letters
        letters.forEach((letter) => {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        });

        // Check each word in dictionary
        for (const word of this.dictionary) {
            if (word.length >= 2 && word.length <= letters.length) {
                const upperWord = word.toUpperCase();
                const tempCount = {
                    ...letterCount
                };
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

    // Update inside findAIPossiblePlays method
    canFormWord(word, prefix, suffix, availableLetters) {
    word = word.toUpperCase();
    prefix = prefix.toUpperCase();
    suffix = suffix.toUpperCase();

    const letterCount = {};
    let blankCount = availableLetters.filter(l => l === "*").length;
    
    availableLetters.forEach(letter => {
        if (letter !== "*") {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
    });

    // For first move or starting fresh
    if (!prefix && !suffix) {
        for (const letter of word) {
            if (letterCount[letter] && letterCount[letter] > 0) {
                letterCount[letter]--;
            } else if (blankCount > 0) {
                blankCount--; // Use blank tile optimally
            } else {
                return false;
            }
        }
        return true;
    }

    // For subsequent moves
    if (!word.includes(prefix) || !word.includes(suffix)) {
        return false;
    }

    const neededPart = word.replace(prefix, "").replace(suffix, "").split("");

    // Track which letters we'll use blanks for (prefer high-value letters)
    const letterValues = neededPart.map(letter => ({
        letter,
        value: this.tileValues[letter]
    })).sort((a, b) => b.value - a.value);

    for (const {letter} of letterValues) {
        if (letterCount[letter] && letterCount[letter] > 0) {
            letterCount[letter]--;
        } else if (blankCount > 0) {
            blankCount--; // Use blank for high-value letters first
        } else {
            return false;
        }
    }

    return true;
}

    createPlay(word, anchor, isHorizontal, prefix, suffix) {
        const startPos = {
            row: anchor.row - (isHorizontal ? 0 : prefix.length),
            col: anchor.col - (isHorizontal ? prefix.length : 0),
        };

        // Verify the play is valid and calculate score
        const score = this.calculatePlayScore(word, startPos, isHorizontal);

        return {
            word,
            startPos,
            isHorizontal,
            score,
        };
    }

    async executeAIPlay(play) {
        const {
            word,
            startPos,
            isHorizontal,
            score
        } = play;
        console.log("AI executing play:", {
            word,
            startPos,
            isHorizontal,
            score
        });

        // Double check word validity
        if (!this.dictionary.has(word.toLowerCase())) {
            console.log(`Invalid word ${word} - skipping AI turn`);
            this.skipAITurn();
            return;
        }

        // Store the previous board state
        this.previousBoard = JSON.parse(JSON.stringify(this.board));

        // Create the placedTiles array for the AI's move
        this.placedTiles = Array.from(word).map((letter, i) => ({
            row: isHorizontal ? startPos.row : startPos.row + i,
            col: isHorizontal ? startPos.col + i : startPos.col,
            tile: {
                letter: letter,
                value: this.tileValues[letter],
                id: `ai_${letter}_${Date.now()}_${i}`,
            },
        }));

        return new Promise(async (resolve) => {
            // Start placing tiles with animation
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                const row = isHorizontal ? startPos.row : startPos.row + i;
                const col = isHorizontal ? startPos.col + i : startPos.col;

                if (!this.board[row][col]) {
                    // Find matching tile or blank tile
                    let tileIndex = this.aiRack.findIndex((t) => t.letter === letter);
                    if (tileIndex === -1) {
                        // Try to use blank tile
                        tileIndex = this.aiRack.findIndex((t) => t.letter === "*");
                        if (tileIndex !== -1) {
                            // Convert blank tile to needed letter
                            this.aiRack[tileIndex] = {
                                letter: letter,
                                value: 0, // Blank tiles are worth 0 points
                                id: `blank_${Date.now()}_${i}`,
                                isBlank: true,
                            };
                        }
                    }

                    if (tileIndex !== -1) {
                        const tile = {
                            letter: letter,
                            value: this.aiRack[tileIndex].isBlank ?
                                0 : this.tileValues[letter],
                            id: this.aiRack[tileIndex].isBlank ?
                                `blank_${letter}_${Date.now()}_${i}` : `ai_${letter}_${Date.now()}_${i}`,
                            isBlank: this.aiRack[tileIndex].isBlank,
                        };

                        // Create animated tile element
                        const animatedTile = document.createElement("div");
                        animatedTile.className = "tile animated-tile";
                        animatedTile.innerHTML = `
                              ${tile.letter}
                              <span class="points">${tile.value}</span>
                              ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
                          `;

                        // Get target cell position
                        const targetCell = document.querySelector(
                            `[data-row="${row}"][data-col="${col}"]`,
                        );
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
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                animatedTile.style.top = `${targetRect.top}px`;
                                animatedTile.style.transform = "rotate(0deg)";

                                setTimeout(() => {
                                    // Add bounce effect
                                    animatedTile.style.transform = "rotate(0deg) scale(1.2)";
                                    setTimeout(() => {
                                        animatedTile.style.transform = "rotate(0deg) scale(1)";
                                    }, 100);
                                }, 800);

                                // Place tile on board
                                setTimeout(() => {
                                    targetCell.classList.add("tile-placed");
                                    animatedTile.remove();

                                    // Remove tile from AI rack and place on board
                                    this.aiRack.splice(tileIndex, 1);
                                    this.board[row][col] = tile;
                                    this.renderAIRack();

                                    // Create permanent tile element
                                    const permanentTile = document.createElement("div");
                                    permanentTile.className = "tile";
                                    if (tile.isBlank) {
                                        permanentTile.classList.add("blank-tile");
                                    }
                                    permanentTile.style.cssText = `
                                          background: linear-gradient(145deg, #ffffff, #f0f0f0);
                                          color: #000;
                                      `;
                                    permanentTile.innerHTML = `
                                          ${tile.letter}
                                          <span class="points" style="color: #000;">${tile.value}</span>
                                          ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
                                      `;

                                    // Clear cell and add permanent tile
                                    targetCell.innerHTML = "";
                                    targetCell.appendChild(permanentTile);

                                    setTimeout(() => {
                                        targetCell.classList.remove("tile-placed");
                                    }, 500);

                                    resolve();
                                }, 1000);
                            }, 200);
                        });

                        // Delay between letters
                        await new Promise((resolve) => setTimeout(resolve, 500));
                    }
                }
            }

            // Update game state after all animations complete
            setTimeout(() => {
                // Get all formed words and calculate total score
                const formedWords = this.getFormedWords();
                let totalScore = 0;
                let wordsList = [];

                formedWords.forEach((wordInfo) => {
                    const {
                        word,
                        startPos,
                        direction
                    } = wordInfo;
                    const wordScore = this.calculateWordScore(
                        word,
                        startPos.row,
                        startPos.col,
                        direction === "horizontal",
                    );
                    totalScore += wordScore;
                    wordsList.push({
                        word,
                        score: wordScore
                    });
                    console.log(`Word formed: ${word} for ${wordScore} points`);
                });

                // Add bonus for using all 7 tiles
                if (word.length === 7) {
                    totalScore += 50;
                    console.log("Added 50 point bonus for using all 7 tiles");
                }

                // Format move description for multiple words
                let moveDescription;
                if (wordsList.length > 1) {
                    moveDescription = wordsList
                        .map((w) => `${w.word} (${w.score})`)
                        .join(" & ");
                } else {
                    moveDescription = wordsList[0].word;
                }

                console.log(`Total score for move: ${totalScore}`);

                this.aiScore += totalScore;
                this.isFirstMove = false;
                this.consecutiveSkips = 0;
                this.currentTurn = "player";
                this.addToMoveHistory("Computer", moveDescription, totalScore);

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
                if (premium === "dl") letterScore *= 2;
                if (premium === "tl") letterScore *= 3;
                if (premium === "dw") wordMultiplier *= 2;
                if (premium === "tw") wordMultiplier *= 3;
            }

            wordScore += letterScore;
        }

        return wordScore * wordMultiplier;
    }

    findBestMove() {
        const possibleMoves = this.findPossibleMoves();

        // Apply strategic evaluation to each move
        const evaluatedMoves = possibleMoves.map((move) => ({
            ...move,
            strategicValue: this.evaluateStrategicValue(move),
        }));

        // Sort moves based on multiple criteria
        return evaluatedMoves.sort((a, b) => {
            // First compare adjusted scores with strategic value
            const aTotal = a.score + a.strategicValue;
            const bTotal = b.score + b.strategicValue;
            if (bTotal !== aTotal) {
                return bTotal - aTotal;
            }

            // Then prefer longer words
            if (b.word.length !== a.word.length) {
                return b.word.length - a.word.length;
            }

            // Finally, consider board position
            const aCenterDist = Math.abs(7 - a.row) + Math.abs(7 - a.col);
            const bCenterDist = Math.abs(7 - b.row) + Math.abs(7 - b.col);
            return aCenterDist - bCenterDist;
        })[0];
    }

    evaluateStrategicValue(move) {
        let value = 0;
        const {
            word,
            row,
            col,
            horizontal
        } = move;

        // Evaluate board control
        value += this.evaluateBoardControl(row, col, horizontal, word);

        // Evaluate premium square strategy
        value += this.evaluatePremiumSquareStrategy(row, col, horizontal, word);

        // Evaluate future opportunities
        value += this.evaluateFutureOpportunities(row, col, horizontal, word);

        // Evaluate defensive play
        value += this.evaluateDefensivePlay(row, col, horizontal, word);

        return value;
    }

    evaluateBoardControl(row, col, horizontal, word) {
        let value = 0;

        // Bonus for controlling central area
        const centerControl = this.evaluateCenterControl(
            row,
            col,
            horizontal,
            word,
        );
        value += centerControl * 30;

        // Bonus for balanced board coverage
        const coverage = this.evaluateBoardCoverage(row, col, horizontal, word);
        value += coverage * 25;

        // Penalty for overcrowding areas
        const crowding = this.evaluateAreaCrowding(row, col, horizontal, word);
        value -= crowding * 20;

        return value;
    }

    evaluatePremiumSquareStrategy(row, col, horizontal, word) {
        let value = 0;

        // Check if move blocks opponent's access to premium squares
        if (this.blocksOpponentPremiumSquares(row, col, horizontal, word)) {
            value += 50;
        }

        // Penalty for opening up premium squares to opponent
        if (this.opensTripleWordScore(row, col, horizontal, word)) {
            value -= 60;
        }

        // Bonus for efficient use of premium squares
        value += this.evaluatePremiumSquareEfficiency(row, col, horizontal, word);

        return value;
    }

    evaluateFutureOpportunities(row, col, horizontal, word) {
        let value = 0;

        // Evaluate potential hook opportunities created
        const hookOpportunities = this.countHookOpportunities(
            row,
            col,
            horizontal,
            word,
        );
        value += hookOpportunities * 15;

        // Evaluate potential extension opportunities
        const extensionOpportunities = this.countExtensionOpportunities(
            row,
            col,
            horizontal,
            word,
        );
        value += extensionOpportunities * 20;

        // Consider remaining tiles in bag
        value += this.evaluateRemainingTilesOpportunities(word);

        return value;
    }

    evaluateDefensivePlay(row, col, horizontal, word) {
        let value = 0;

        // Prevent opponent from accessing high-scoring opportunities
        if (this.blocksHighScoringOpportunity(row, col, horizontal, word)) {
            value += 40;
        }

        // Avoid setting up opponent for premium squares
        if (this.createsVulnerability(row, col, horizontal, word)) {
            value -= 35;
        }

        // Consider board balance and control
        const defensivePosition = this.evaluateDefensivePosition(
            row,
            col,
            horizontal,
            word,
        );
        value += defensivePosition;

        return value;
    }

    blocksOpponentPremiumSquares(row, col, horizontal, word) {
        const premiumSquares = this.getNearbyPremiumSquares(
            row,
            col,
            horizontal,
            word,
        );
        return premiumSquares.some((square) =>
            this.wouldBlockPremiumSquare(square.row, square.col, word),
        );
    }

    opensTripleWordScore(row, col, horizontal, word) {
        // Check if this move creates easy access to triple word scores
        const twSquares = this.getNearbyTripleWordSquares(row, col);
        return twSquares.some((square) =>
            this.createsEasyAccess(square.row, square.col, word),
        );
    }

    createsPlayOpportunities(row, col, horizontal, word) {
        // Count potential future play opportunities created
        let opportunities = 0;

        // Check for extension possibilities
        opportunities += this.countExtensionOpportunities(
            row,
            col,
            horizontal,
            word,
        );

        // Check for cross-word possibilities
        opportunities += this.countCrossWordOpportunities(
            row,
            col,
            horizontal,
            word,
        );

        return opportunities > 2; // Return true if creates multiple opportunities
    }

    findPossibleMoves() {
        const moves = [];
        const letters = this.aiRack.map((tile) => tile.letter);

        // Get all possible words that can be formed with the rack
        const possibleWords = this.findPossibleWords(letters);

        // Find valid placements for each word
        for (const word of possibleWords) {
            // Try horizontal placements
            for (let row = 0; row < 15; row++) {
                for (let col = 0; col <= 15 - word.length; col++) {
                    if (this.isValidAIPlacement(word, row, col, true)) {
                        const score = this.calculatePotentialScore(word, row, col, true);
                        moves.push({
                            word,
                            row,
                            col,
                            horizontal: true,
                            score
                        });
                    }
                }
            }

            // Try vertical placements
            for (let row = 0; row <= 15 - word.length; row++) {
                for (let col = 0; col < 15; col++) {
                    if (this.isValidAIPlacement(word, row, col, false)) {
                        const score = this.calculatePotentialScore(word, row, col, false);
                        moves.push({
                            word,
                            row,
                            col,
                            horizontal: false,
                            score
                        });
                    }
                }
            }
        }

        return moves;
    }

    findPossibleWords(letters) {
        const words = new Set();
        const letterCount = {};
        const blankCount = letters.filter(l => l === "*").length;
        
        // Count available letters
        letters.forEach(letter => {
            if (letter !== "*") {
                letterCount[letter] = (letterCount[letter] || 0) + 1;
            }
        });
    
        // Enhanced blank tile usage - prioritize high-value opportunities
        const priorityLetters = new Set(['S', 'R', 'E', 'D', 'L', 'Y']); // Common useful letters
        
        for (const word of this.dictionary) {
            if (word.length >= 3) { // Minimum word length of 3
                const upperWord = word.toUpperCase();
                const tempCount = { ...letterCount };
                let tempBlankCount = blankCount;
                let canForm = true;
                let blanksUsed = [];
    
                // Try to form word
                for (const letter of upperWord) {
                    if (tempCount[letter] && tempCount[letter] > 0) {
                        tempCount[letter]--;
                    } else if (tempBlankCount > 0) {
                        // Prioritize using blanks for useful letters
                        if (priorityLetters.has(letter) || this.tileValues[letter] >= 4) {
                            tempBlankCount--;
                            blanksUsed.push(letter);
                        } else if (tempBlankCount > 1) { // Save one blank for priority letters if possible
                            tempBlankCount--;
                            blanksUsed.push(letter);
                        } else {
                            canForm = false;
                            break;
                        }
                    } else {
                        canForm = false;
                        break;
                    }
                }
    
                if (canForm) {
                    words.add({
                        word: upperWord,
                        blanksUsed: blanksUsed
                    });
                }
            }
        }
    
        return Array.from(words);
    }

    // New helper function to evaluate words using blank tiles
evaluateWordWithBlanks(word, blanksUsed) {
    let score = 0;
    
    // Base score for word length
    score += word.length * 10;

    // Premium for longer words
    if (word.length >= 7) score += 50;
    
    // Score for valuable letters
    for (const letter of word) {
        score += this.tileValues[letter] || 0;
    }

    // Adjust score based on blank tile usage efficiency
    // Prefer using blanks for high-value letters
    const lettersUsingBlanks = word.split('')
        .sort((a, b) => this.tileValues[b] - this.tileValues[a])
        .slice(0, blanksUsed);
    
    const blankEfficiency = lettersUsingBlanks.reduce((sum, letter) => 
        sum + this.tileValues[letter], 0) / blanksUsed;

    score += blankEfficiency * 5;

    return score;
}


    isValidAIPlacement(word, startRow, startCol, horizontal) {
        // Enforce minimum 3-letter word length
        if (word.length < 3) {
            console.log(`Rejecting ${word} - words must be at least 3 letters long`);
            return false;
        }

        if (!this.dictionary.has(word.toLowerCase())) {
            console.log(`${word} is not a valid word in the dictionary`);
            return false;
        }

        // Check basic boundary conditions
        if (horizontal) {
            if (
                startCol < 0 ||
                startCol + word.length > 15 ||
                startRow < 0 ||
                startRow > 14
            ) {
                return false;
            }
        } else {
            if (
                startRow < 0 ||
                startRow + word.length > 15 ||
                startCol < 0 ||
                startCol > 14
            ) {
                return false;
            }
        }

        // Check for parallel words
        if (this.hasParallelWord(startRow, startCol, horizontal)) {
            console.log(`Rejecting ${word} - would create parallel word`);
            return false;
        }

        // Check distance from player's last move
        if (this.placedTiles.length > 0) {
            const lastPlayerMove = this.placedTiles[0];
            const distance =
                Math.abs(startRow - lastPlayerMove.row) +
                Math.abs(startCol - lastPlayerMove.col);
            if (distance < 3) {
                console.log(`Rejecting ${word} - too close to player's last move`);
                return false;
            }
        }

        let tempBoard = JSON.parse(JSON.stringify(this.board));
        let hasValidConnection = false;

        // Place the word temporarily on the board
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;

            if (tempBoard[row][col]) {
                if (tempBoard[row][col].letter !== word[i]) {
                    return false;
                }
                hasValidConnection = true;
            } else {
                tempBoard[row][col] = {
                    letter: word[i]
                };
            }

            if (this.hasAdjacentTile(row, col)) {
                hasValidConnection = true;
            }

            // Check formed words at this position
            const formedWords = this.getAllFormedWords(row, col, tempBoard);
            for (const formedWord of formedWords) {
                if (!this.dictionary.has(formedWord.toLowerCase())) {
                    console.log(`Invalid word formed: ${formedWord}`);
                    return false;
                }
            }
        }

        // First move must use center square
        if (this.isFirstMove) {
            const usesCenterSquare = horizontal ?
                startRow === 7 && startCol <= 7 && startCol + word.length > 7 :
                startCol === 7 && startRow <= 7 && startRow + word.length > 7;

            if (!usesCenterSquare) {
                console.log("First move must use center square");
                return false;
            }
            return true;
        }

        return hasValidConnection;
    }

    getAllCrossWords(row, col, isHorizontal, word) {
        const crossWords = [];
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        
        // Place the word temporarily
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;
            
            if (!tempBoard[currentRow][currentCol]) {
                tempBoard[currentRow][currentCol] = { letter: word[i] };
                
                // Check for cross-word at this position
                const crossWord = isHorizontal ? 
                    this.getVerticalWordAt(currentRow, currentCol, tempBoard) :
                    this.getHorizontalWordAt(currentRow, currentCol, tempBoard);
                    
                if (crossWord && crossWord.length > 1) {
                    crossWords.push(crossWord);
                }
            }
        }
        
        return crossWords;
    }    

    getWordInDirection(row, col, [dx, dy], board) {
        let word = "";
        let startRow = row;
        let startCol = col;

        // Find start of word
        while (
            this.isValidPosition(startRow - dx, startCol - dy) &&
            board[startRow - dx][startCol - dy]
        ) {
            startRow -= dx;
            startCol -= dy;
        }

        // Build word
        let currentRow = startRow;
        let currentCol = startCol;
        while (
            this.isValidPosition(currentRow, currentCol) &&
            board[currentRow][currentCol]
        ) {
            word += board[currentRow][currentCol].letter;
            currentRow += dx;
            currentCol += dy;
        }

        return word;
    }

    getAllFormedWords(row, col, board) {
        const words = new Set();

        // Check horizontal word
        let horizontalWord = "";
        let startCol = col;
        // Find start of horizontal word
        while (startCol > 0 && board[row][startCol - 1]) startCol--;

        // Build horizontal word
        let currentCol = startCol;
        while (currentCol < 15 && board[row][currentCol]) {
            if (!board[row][currentCol].letter) {
                console.log("Invalid board state at:", row, currentCol);
                return [];
            }
            horizontalWord += board[row][currentCol].letter;
            currentCol++;
        }

        // Check vertical word
        let verticalWord = "";
        let startRow = row;
        // Find start of vertical word
        while (startRow > 0 && board[startRow - 1][col]) startRow--;

        // Build vertical word
        let currentRow = startRow;
        while (currentRow < 15 && board[currentRow][col]) {
            if (!board[currentRow][col].letter) {
                console.log("Invalid board state at:", currentRow, col);
                return [];
            }
            verticalWord += board[currentRow][col].letter;
            currentRow++;
        }

        // Only add words that are longer than 2 letter
        if (horizontalWord.length > 2) {
            words.add(horizontalWord);
            console.log("Found horizontal word:", horizontalWord);
        }
        if (verticalWord.length > 2) {
            words.add(verticalWord);
            console.log("Found vertical word:", verticalWord);
        }

        return Array.from(words);
    }

    // Add this check in isValidAIPlacement
    checkParallelWords(word, startRow, startCol, horizontal, tempBoard) {
        for (let i = 0; i < word.length; i++) {
            const row = horizontal ? startRow : startRow + i;
            const col = horizontal ? startCol + i : startCol;

            // Check parallel lines (the line above and below for horizontal words,
            // or left and right for vertical words)
            const positions = horizontal ? [
                    [row - 1, col],
                    [row + 1, col],
                ] // Check above and below
                :
                [
                    [row, col - 1],
                    [row, col + 1],
                ]; // Check left and right

            for (const [r, c] of positions) {
                if (r >= 0 && r < 15 && c >= 0 && c < 15 && tempBoard[r][c]) {
                    // If there's a tile in parallel, this placement might create invalid words
                    return false;
                }
            }
        }
        return true;
    }

    // Add this helper method to get cross words
    getCrossWordAt(row, col, isHorizontal, tempBoard) {
        let word = "";
        let start = isHorizontal ? col : row;

        // Find start of word
        while (
            start > 0 &&
            tempBoard[isHorizontal ? row : start - 1][isHorizontal ? start - 1 : col]
        ) {
            start--;
        }

        // Build word
        let current = start;
        while (
            current < 15 &&
            tempBoard[isHorizontal ? row : current][isHorizontal ? current : col]
        ) {
            word +=
                tempBoard[isHorizontal ? row : current][isHorizontal ? current : col]
                .letter;
            current++;
        }

        return word.length > 1 ? word : null;
    }

    isAbbreviation(word) {
        // Official two-letter words allowed in Scrabble/Word games
        const validTwoLetterWords = new Set([
            "AA",
            "AB",
            "AD",
            "AE",
            "AG",
            "AH",
            "AI",
            "AL",
            "AM",
            "AN",
            "AR",
            "AS",
            "AT",
            "AW",
            "AX",
            "AY",
            "BA",
            "BE",
            "BI",
            "BO",
            "BY",
            "DA",
            "DE",
            "DI",
            "DO",
            "EA",
            "ED",
            "EE",
            "EF",
            "EH",
            "EL",
            "EM",
            "EN",
            "ER",
            "ES",
            "ET",
            "EW",
            "EX",
            "FA",
            "FE",
            "FY",
            "GI",
            "GU",
            "HA",
            "HE",
            "HI",
            "HM",
            "HO",
            "ID",
            "IF",
            "IN",
            "IO",
            "IS",
            "IT",
            "JA",
            "JO",
            "KA",
            "KI",
            "KO",
            "KY",
            "LA",
            "LI",
            "LO",
            "MA",
            "ME",
            "MI",
            "MM",
            "MO",
            "MU",
            "MY",
            "NA",
            "NE",
            "NO",
            "NU",
            "NY",
            "OB",
            "OD",
            "OE",
            "OM",
            "OP",
            "OS",
            "OX",
            "OY",
            "PA",
            "PE",
            "PI",
            "PO",
            "QI",
            "RA",
            "RE",
            "RO",
            "SH",
            "SI",
            "SO",
            "TA",
            "TE",
            "TI",
            "TO",
            "UG",
            "UH",
            "UM",
            "UN",
            "UP",
            "UR",
            "US",
            "UT",
            "WE",
            "WO",
            "XI",
            "XU",
            "YA",
            "YE",
            "YO",
            "YU",
            "ZA",
            "ZE",
            "ZO",
            "AO",
            "AP",
            "BA",
            "BE",
            "BI",
            "BU",
            "CU",
            "DA",
            "DU",
            "EO",
            "EU",
            "FO",
            "FU",
            "GA",
            "GE",
            "HU",
            "IQ",
            "JE",
            "KE",
            "KU",
            "LE",
            "LU",
            "ME",
            "MU",
            "NI",
            "NU",
            "OC",
            "OO",
            "OU",
            "PU",
            "QA",
            "RI",
            "RU",
            "SA",
            "SE",
            "SI",
            "SU",
            "TU",
            "UI",
            "VA",
            "WA",
            "WU",
            "YI",
            "ZI",
            "ZO",
            "PI",
            "NP",
            "ET",
            "ZO",
        ]);

        // Common three-letter abbreviations to reject
        const commonAbbreviations = new Set([
            // Corporate & Business
            "CEO",
            "CFO",
            "CTO",
            "COO",
            "CAO",
            "CDO",
            "CHRO",
            "CMO",
            "CRO",
            "CSO",
            "B2B",
            "B2C",
            "C2C",
            "ROI",
            "KPI",
            "CRM",
            "ERP",
            "SWOT",
            "PESTEL",
            "ROE",
            "CAGR",
            "EBIT",
            "GAAP",
            "IPO",
            "M&A",
            "P&L",
            "Q1",
            "Q2",
            "Q3",
            "Q4",

            // Technology & Computing
            "CPU",
            "GPU",
            "RAM",
            "ROM",
            "SSD",
            "HDD",
            "USB",
            "HDMI",
            "VGA",
            "DVI",
            "API",
            "SDK",
            "SQL",
            "NoSQL",
            "CSS",
            "HTML",
            "PHP",
            "XML",
            "JSON",
            "YAML",
            "IDE",
            "CLI",
            "GUI",
            "HTTP",
            "HTTPS",
            "FTP",
            "SSH",
            "VPN",
            "LAN",
            "WAN",
            "DNS",
            "URL",
            "URI",
            "TCP",
            "IP",
            "IoT",
            "AI",
            "ML",
            "VR",
            "AR",
            "DIF",

            // Government & Military
            "CIA",
            "FBI",
            "NSA",
            "DOD",
            "EPA",
            "FDA",
            "DHS",
            "DOJ",
            "IRS",
            "ICE",
            "NATO",
            "SEAL",
            "POTUS",
            "SCOTUS",
            "DOE",
            "HUD",
            "FEMA",
            "DEA",
            "ATF",
            "SSA",

            // Educational
            "PhD",
            "MBA",
            "BSc",
            "BA",
            "MSc",
            "MA",
            "JD",
            "MD",
            "EdD",
            "GPA",
            "SAT",
            "ACT",
            "GRE",
            "GMAT",
            "MCAT",
            "LSAT",
            "TOEFL",
            "IELTS",
            "ESL",
            "STEM",

            // Medical
            "ICU",
            "ER",
            "ECG",
            "EKG",
            "MRI",
            "CT",
            "BP",
            "HIV",
            "DNA",
            "RNA",
            "ADHD",
            "OCD",
            "PTSD",
            "ADD",
            "CDC",
            "WHO",
            "RBC",
            "WBC",
            "BMI",
            "ICU",

            // Media & Entertainment
            "BBC",
            "CNN",
            "PBS",
            "ABC",
            "NBC",
            "CBS",
            "HBO",
            "MTV",
            "ESPN",
            "FIFA",
            "NBA",
            "NFL",
            "NHL",
            "MLB",
            "UFC",
            "WWE",
            "IMDb",
            "AMPAS",
            "BAFTA",
            "Grammy",

            // Countries & Organizations
            "USA",
            "UK",
            "UAE",
            "UN",
            "EU",
            "NATO",
            "ASEAN",
            "NAFTA",
            "WHO",
            "UNICEF",
            "UNESCO",
            "OPEC",
            "IMF",
            "WTO",
            "ICC",
            "IAEA",
            "APEC",
            "BRICS",
            "G7",
            "G20",

            // Common Communication
            "ASAP",
            "FYI",
            "TBA",
            "TBD",
            "FAQ",
            "AKA",
            "PS",
            "NB",
            "RE",
            "CC",
            "BCC",
            "IMO",
            "IMHO",
            "BTW",
            "TBH",
            "IDK",
            "IRL",
            "AFAIK",
            "DIY",
            "FOMO",

            // Technology Companies
            "IBM",
            "AMD",
            "HP",
            "AWS",
            "MS",
            "FAANG",
            "GAFA",
            "SAP",
            "VMware",
            "TSMC",

            // File Formats & Standards
            "PDF",
            "PNG",
            "JPG",
            "JPEG",
            "GIF",
            "MP3",
            "MP4",
            "WAV",
            "AVI",
            "MPEG",
            "DOC",
            "DOCX",
            "XLS",
            "XLSX",
            "PPT",
            "PPTX",
            "TXT",
            "CSV",
            "ZIP",
            "RAR",

            // Telecommunications
            "SMS",
            "MMS",
            "GSM",
            "SIM",
            "ISP",
            "5G",
            "4G",
            "LTE",
            "CDMA",
            "VOIP",

            // Time Zones & Measurements
            "GMT",
            "EST",
            "PST",
            "UTC",
            "CST",
            "MST",
            "IST",
            "JST",
            "BST",
            "CET",

            // Transportation
            "BMW",
            "SUV",
            "MPV",
            "EV",
            "GPS",
            "MPG",
            "MPH",
            "KPH",
            "ABS",
            "ESP",

            // Financial
            "ATM",
            "PIN",
            "APR",
            "APY",
            "ETF",
            "IRA",
            "HSA",
            "FSA",
            "CD",
            "ARM",

            // Miscellaneous
            "UFO",
            "VIP",
            "RIP",
            "POV",
            "DOB",
            "SSN",
            "PTO",
            "EOD",
            "COB",
            "ETA",
            "RSVP",
            "BYOB",
            "MVP",
            "SOS",
            "MIA",
            "ETC",
            "VS",
            "AKA",
            "NYC",
            "LA",
        ]);

        // If it's a two-letter word, check against valid list
        if (word.length === 2) {
            if (!validTwoLetterWords.has(word.toUpperCase())) {
                console.log(`${word} is not a valid two-letter word - rejecting`);
                return true;
            }
            return false; // It's a valid two-letter word
        }

        // Check for three-letter abbreviations
        if (word.length === 3) {
            // Check if it's in our common abbreviations list
            if (commonAbbreviations.has(word.toUpperCase())) {
                console.log(`${word} is a known abbreviation - rejecting`);
                return true;
            }

            // Check if it's all caps and contains no vowels (likely an abbreviation)
            if (word === word.toUpperCase() && !/[AEIOU]/.test(word)) {
                console.log(
                    `${word} appears to be a three-letter abbreviation - rejecting`,
                );
                return true;
            }
        }

        // Check for roman numerals
        const romanNumeralPattern =
            /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
        if (romanNumeralPattern.test(word.toUpperCase())) {
            console.log(`${word} appears to be a roman numeral - rejecting`);
            return true;
        }

        // Check for repeated letters that aren't in validTwoLetterWords
        if (
            word.length === 2 &&
            word[0] === word[1] &&
            !validTwoLetterWords.has(word.toUpperCase())
        ) {
            console.log(
                `${word} appears to be a repeated letter abbreviation - rejecting`,
            );
            return true;
        }

        return false;
    }

    isDirectlyAdjacentToWord(word, row, col, isHorizontal) {
        const checkRow = isHorizontal ? [row - 1, row + 1] // Check rows above and below for horizontal words
            :
            [row, row + word.length - 1]; // Check start and end rows for vertical words

        const checkCol = isHorizontal ? [col, col + word.length - 1] // Check start and end cols for horizontal words
            :
            [col - 1, col + 1]; // Check columns left and right for vertical words

        for (let r of checkRow) {
            for (let c of checkCol) {
                // Check if position is valid and contains a tile
                if (r >= 0 && r < 15 && c >= 0 && c < 15 && this.board[r][c]) {
                    // Make sure we're not checking crossing points
                    if (isHorizontal && c >= col && c < col + word.length) continue;
                    if (!isHorizontal && r >= row && r < row + word.length) continue;

                    return true;
                }
            }
        }
        return false;
    }

    getExistingWords() {
        const words = new Set();

        // Check horizontal words
        for (let row = 0; row < 15; row++) {
            let word = "";
            for (let col = 0; col < 15; col++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                } else if (word.length > 1) {
                    words.add(word);
                    word = "";
                } else {
                    word = "";
                }
            }
            if (word.length > 1) {
                words.add(word);
            }
        }

        // Check vertical words
        for (let col = 0; col < 15; col++) {
            let word = "";
            for (let row = 0; row < 15; row++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                } else if (word.length > 1) {
                    words.add(word);
                    word = "";
                } else {
                    word = "";
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

        // Heavy penalty for simple extensions of existing words
        const existingWords = this.getExistingWords();
        for (const existingWord of existingWords) {
            if (word.startsWith(existingWord) || word.endsWith(existingWord)) {
                totalScore -= 50; // Significant penalty for simple extensions
            }
            if (
                word === existingWord + "S" ||
                word === existingWord + "ED" ||
                word === existingWord + "ING"
            ) {
                totalScore -= 75; // Even larger penalty for common suffixes
            }
        }

        // Get all formed words and calculate base score
        const formedWords = this.getFormedWords();
        formedWords.forEach((wordInfo) => {
            let wordScore = 0;
            let wordMultiplier = 1;

            // Calculate score for each letter
            for (let i = 0; i < wordInfo.word.length; i++) {
                const row =
                    wordInfo.direction === "horizontal" ?
                    wordInfo.startPos.row :
                    wordInfo.startPos.row + i;
                const col =
                    wordInfo.direction === "horizontal" ?
                    wordInfo.startPos.col + i :
                    wordInfo.startPos.col;

                let letterScore = tempBoard[row][col].value;

                // Apply premium squares only for newly placed tiles
                if (!this.previousBoard || !this.previousBoard[row][col]) {
                    const premium = this.getPremiumSquareType(row, col);
                    if (premium === "dl") letterScore *= 2;
                    if (premium === "tl") letterScore *= 3;
                    if (premium === "dw") wordMultiplier *= 2;
                    if (premium === "tw") wordMultiplier *= 3;
                }

                wordScore += letterScore;
            }

            totalScore += wordScore * wordMultiplier;
        });

        // Strategic scoring adjustments
        let adjustedScore = totalScore;

        // Strongly encourage longer words
        if (word.length >= 5) {
            adjustedScore += word.length * 30;
        }

        // Bonus for creating multiple words
        if (formedWords.length > 1) {
            adjustedScore += 40 * formedWords.length;
        }

        // Bonus for using high-value letters effectively
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            if (this.tileValues[letter] >= 4) {
                // High-value letters
                const row = horizontal ? startRow : startRow + i;
                const col = horizontal ? startCol + i : startCol;
                const premium = this.getPremiumSquareType(row, col);
                if (premium) {
                    adjustedScore += 35; // Bonus for strategic use of high-value letters
                }
            }
        }

        // Encourage parallel word formation
        const parallelWords = this.getParallelWords(
            startRow,
            startCol,
            horizontal,
            word,
        );
        if (parallelWords.length > 0) {
            adjustedScore += 45 * parallelWords.length;
        }

        // Bonus for creative word placement
        if (this.isCreativePlacement(startRow, startCol, horizontal, word)) {
            adjustedScore += 40;
        }

        return adjustedScore;
    }

    isCreativePlacement(row, col, horizontal, word) {
        // Consider a placement creative if it:
        // 1. Creates multiple intersections
        const intersections = this.countIntersections(row, col, horizontal, word);
        if (intersections >= 2) return true;

        // 2. Uses premium squares effectively
        const premiumSquaresUsed = this.countPremiumSquaresUsed(
            row,
            col,
            horizontal,
            word,
        );
        if (premiumSquaresUsed >= 2) return true;

        // 3. Creates opportunities for future plays
        const futureOpportunities = this.countFutureOpportunities(
            row,
            col,
            horizontal,
            word,
        );
        if (futureOpportunities >= 3) return true;

        return false;
    }

    getParallelWords(row, col, horizontal, word) {
        const parallelWords = [];

        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Check perpendicular direction for potential words
            const perpWord = horizontal ?
                this.getVerticalWordAt(currentRow, currentCol) :
                this.getHorizontalWordAt(currentRow, currentCol);

            if (perpWord && perpWord.length > 2) {
                parallelWords.push(perpWord);
            }
        }

        return parallelWords;
    }

    countIntersections(row, col, horizontal, word) {
        let intersections = 0;
        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Check if this position intersects with existing words
            if (this.hasPerpendicularWord(currentRow, currentCol, horizontal)) {
                intersections++;
            }
        }
        return intersections;
    }

    countFutureOpportunities(row, col, horizontal, word) {
        let opportunities = 0;
        const directions = horizontal ? [
            [-1, 0],
            [1, 0],
        ] : [
            [0, -1],
            [0, 1],
        ];

        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            for (const [dx, dy] of directions) {
                const newRow = currentRow + dx;
                const newCol = currentCol + dy;

                if (
                    this.isValidPosition(newRow, newCol) &&
                    !this.board[newRow][newCol]
                ) {
                    // Check if this position could be used for future words
                    if (this.hasAdjacentTile(newRow, newCol)) {
                        opportunities++;
                    }
                }
            }
        }
        return opportunities;
    }

    wouldCreateStackedShortWords(word, row, col, horizontal) {
        const checkRadius = 2; // Check 2 cells above/below or left/right
        let shortWordCount = 0;

        // Check for existing short words nearby
        for (let i = -checkRadius; i <= checkRadius; i++) {
            if (i === 0) continue; // Skip current position

            const checkRow = horizontal ? row + i : row;
            const checkCol = horizontal ? col : col + i;

            if (checkRow >= 0 && checkRow < 15 && checkCol >= 0 && checkCol < 15) {
                const existingWord = this.getWordAtPosition(
                    checkRow,
                    checkCol,
                    !horizontal,
                );
                if (existingWord && existingWord.length <= 3) {
                    shortWordCount++;
                }
            }
        }

        // Check if the current word would create new short cross-words
        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            const crossWord = this.getPotentialCrossWord(
                word[i],
                currentRow,
                currentCol,
                !horizontal,
            );
            if (crossWord && crossWord.length <= 3) {
                shortWordCount++;
            }
        }

        // Return true if there are too many short words
        return shortWordCount > 1 || (shortWordCount > 0 && word.length <= 3);
    }

    getWordAtPosition(row, col, horizontal) {
        let word = "";
        let start = horizontal ? col : row;

        // Find start of word
        while (
            start > 0 &&
            this.board[horizontal ? row : start - 1][horizontal ? start - 1 : col]
        ) {
            start--;
        }

        // Build word
        let current = start;
        while (
            current < 15 &&
            this.board[horizontal ? row : current][horizontal ? current : col]
        ) {
            word +=
                this.board[horizontal ? row : current][horizontal ? current : col]
                .letter;
            current++;
        }

        return word.length > 1 ? word : null;
    }

    getPotentialCrossWord(letter, row, col, horizontal) {
        let word = "";
        let tempBoard = JSON.parse(JSON.stringify(this.board));
        tempBoard[row][col] = {
            letter: letter
        };

        // Find start of potential word
        let start = horizontal ? col : row;
        while (
            start > 0 &&
            tempBoard[horizontal ? row : start - 1][horizontal ? start - 1 : col]
        ) {
            start--;
        }

        // Build potential word
        let current = start;
        while (
            current < 15 &&
            tempBoard[horizontal ? row : current][horizontal ? current : col]
        ) {
            word +=
                tempBoard[horizontal ? row : current][horizontal ? current : col]
                .letter;
            current++;
        }

        return word.length > 1 ? word : null;
    }

    hasNearbyParallelWords(row, col, isHorizontal) {
        const checkRange = 2; // Check 2 cells above/below or left/right

        for (let i = -checkRange; i <= checkRange; i++) {
            if (i === 0) continue; // Skip current position

            const checkRow = isHorizontal ? row + i : row;
            const checkCol = isHorizontal ? col : col + i;

            if (checkRow >= 0 && checkRow < 15 && checkCol >= 0 && checkCol < 15) {
                // Check if there's a word at this position
                const existingWord = this.getWordAtPosition(
                    checkRow,
                    checkCol,
                    isHorizontal,
                );
                if (existingWord) {
                    return true;
                }
            }
        }
        return false;
    }

    hasAdjacentParallelWords(row, col, horizontal, word) {
        // Track details about parallel words
        const parallelWords = {
            above: null,
            below: null,
            left: null,
            right: null,
        };

        if (horizontal) {
            // Check words above
            if (row > 0) {
                parallelWords.above = this.getParallelWordDetails(
                    row - 1,
                    col,
                    horizontal,
                );
            }
            // Check words below
            if (row < 14) {
                parallelWords.below = this.getParallelWordDetails(
                    row + 1,
                    col,
                    horizontal,
                );
            }
        } else {
            // Check words to the left
            if (col > 0) {
                parallelWords.left = this.getParallelWordDetails(
                    row,
                    col - 1,
                    horizontal,
                );
            }
            // Check words to the right
            if (col < 14) {
                parallelWords.right = this.getParallelWordDetails(
                    row,
                    col + 1,
                    horizontal,
                );
            }
        }

        // Calculate penalty based on parallel word patterns
        let penalty = 0;

        // Severe penalty for stacking on top of longer words
        const stackedOnLong = Object.values(parallelWords).some(
            (details) => details && details.length > 3,
        );
        if (stackedOnLong) {
            penalty += 200;
        }

        // Extra penalty for short words stacked on each other
        const hasShortStacks = Object.values(parallelWords).filter(
            (details) => details && details.length <= 3,
        ).length;
        penalty += hasShortStacks * 150;

        // Additional penalty for creating multiple short parallel words
        if (word.length <= 3) {
            penalty += 250;
        }

        return penalty;
    }

    getParallelWordDetails(row, col, horizontal) {
        let start = horizontal ? col : row;
        let word = "";

        // Find start of word
        while (
            start > 0 &&
            this.board[horizontal ? row : start - 1][horizontal ? start - 1 : col]
        ) {
            start--;
        }

        // Build word
        let current = start;
        while (
            current < 15 &&
            this.board[horizontal ? row : current][horizontal ? current : col]
        ) {
            word +=
                this.board[horizontal ? row : current][horizontal ? current : col]
                .letter;
            current++;
        }

        return word.length > 1 ? {
                word,
                length: word.length,
                start: start,
            } :
            null;
    }

    getParallelWordLength(row, col, horizontal) {
        let length = 0;
        let currentPos = horizontal ? col : row;

        // Find start of word
        while (
            currentPos > 0 &&
            this.board[horizontal ? row : currentPos - 1][
                horizontal ? currentPos - 1 : col
            ]
        ) {
            currentPos--;
        }

        // Count length
        while (
            currentPos < 15 &&
            this.board[horizontal ? row : currentPos][horizontal ? currentPos : col]
        ) {
            length++;
            currentPos++;
        }

        return length;
    }

    findCrossWordOpportunities(availableLetters) {
        const plays = [];
        // Check each existing word on the board
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (this.board[row][col]) {
                    // Check if we can form perpendicular words
                    const letter = this.board[row][col].letter;
                    for (const direction of ["horizontal", "vertical"]) {
                        const crossWords = this.findPossibleCrossWords(
                            row,
                            col,
                            letter,
                            availableLetters,
                            direction,
                        );
                        plays.push(...crossWords);
                    }
                }
            }
        }
        return plays;
    }

    findParallelWords(existingWord, startRow, startCol, isHorizontal) {
        const availableLetters = this.aiRack.map((tile) => tile.letter);
        const parallelPlays = [];

        // Check one row/column above and below
        const offsets = [-1, 1];
        for (const offset of offsets) {
            const newRow = isHorizontal ? startRow + offset : startRow;
            const newCol = isHorizontal ? startCol : startCol + offset;

            if (this.isValidPosition(newRow, newCol)) {
                const possibleWords = this.findWordsUsingLetters(
                    availableLetters,
                    existingWord,
                );
                parallelPlays.push(...possibleWords);
            }
        }
        return parallelPlays;
    }

    hasParallelWord(row, col, isHorizontal) {
        // Only check immediate adjacent positions
        const positions = isHorizontal ? [
                [row - 1, col],
                [row + 1, col],
            ] // Check only directly above and below
            :
            [
                [row, col - 1],
                [row, col + 1],
            ]; // Check only directly left and right

        // Filter out the current position
        const adjacentPositions = positions.filter(
            ([r, c]) => r !== row || c !== col,
        );

        for (const [checkRow, checkCol] of adjacentPositions) {
            if (
                this.isValidPosition(checkRow, checkCol) &&
                this.board[checkRow][checkCol]
            ) {
                // Check if there's an actual parallel word
                const existingWord = this.getWordAt(checkRow, checkCol, isHorizontal);
                if (existingWord && existingWord.length >= 2) {
                    // Only consider it parallel if it's an actual word
                    console.log(
                        `Found parallel word: ${existingWord} at [${checkRow}, ${checkCol}]`,
                    );
                    return true;
                }
            }
        }
        return false;
    }

    playAIMove(move) {
        console.log("AI playing move:", move);
        const {
            word,
            row,
            col,
            horizontal,
            score
        } = move;

        // Place tiles on board
        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;
            const letter = word[i];

            // Find matching tile in AI's rack
            const tileIndex = this.aiRack.findIndex((t) => t.letter === letter);
            if (tileIndex !== -1) {
                const tile = this.aiRack.splice(tileIndex, 1)[0];
                this.board[currentRow][currentCol] = tile;

                // Update visual board
                const cell = document.querySelector(
                    `[data-row="${currentRow}"][data-col="${currentCol}"]`,
                );
                cell.innerHTML = `
                            ${tile.letter}
                            <span class="points">${tile.value}</span>
                        `;
            }
        }

        // Update game state
        this.aiScore += score;
        this.isFirstMove = false;
        this.currentTurn = "player";
        this.addToMoveHistory("Computer", word, score);
        this.fillRacks();
        this.updateGameState();
    }

    skipAITurn() {
        console.log("AI skipping turn");
        this.consecutiveSkips++;
        this.currentTurn = "player";

        if (this.consecutiveSkips >= 4) {
            this.checkGameEnd();
        } else {
            // Optionally record skip in move history
            this.addToMoveHistory("Computer", "SKIP", 0);
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
                    id: `${letter}_${i}`,
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
        const board = document.getElementById("scrabble-board");
        const premiumSquares = this.getPremiumSquares();

        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cell = document.createElement("div");
                cell.className = "board-cell";
                cell.dataset.row = i;
                cell.dataset.col = j;

                // Add center star symbol
                if (i === 7 && j === 7) {
                    const centerStar = document.createElement("span");
                    centerStar.textContent = "⚜";
                    centerStar.className = "center-star";
                    cell.appendChild(centerStar);
                }

                cell.addEventListener("click", () => {
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
            [0, 0],
            [0, 7],
            [0, 14],
            [7, 0],
            [7, 14],
            [14, 0],
            [14, 7],
            [14, 14],
        ].forEach(([row, col]) => (premium[`${row},${col}`] = "tw"));

        // Double Word Scores (pink squares)
        [
            [1, 1],
            [1, 13],
            [2, 2],
            [2, 12],
            [3, 3],
            [3, 11],
            [4, 4],
            [4, 10],
            [10, 4],
            [10, 10],
            [11, 3],
            [11, 11],
            [12, 2],
            [12, 12],
            [13, 1],
            [13, 13],
        ].forEach(([row, col]) => (premium[`${row},${col}`] = "dw"));

        // Triple Letter Scores (dark blue squares)
        [
            [1, 5],
            [1, 9],
            [5, 1],
            [5, 5],
            [5, 9],
            [5, 13],
            [9, 1],
            [9, 5],
            [9, 9],
            [9, 13],
            [13, 5],
            [13, 9],
        ].forEach(([row, col]) => (premium[`${row},${col}`] = "tl"));

        // Double Letter Scores (light blue squares)
        [
            [0, 3],
            [0, 11],
            [2, 6],
            [2, 8],
            [3, 0],
            [3, 7],
            [3, 14],
            [6, 2],
            [6, 6],
            [6, 8],
            [6, 12],
            [7, 3],
            [7, 11],
            [8, 2],
            [8, 6],
            [8, 8],
            [8, 12],
            [11, 0],
            [11, 7],
            [11, 14],
            [12, 6],
            [12, 8],
            [14, 3],
            [14, 11],
        ].forEach(([row, col]) => (premium[`${row},${col}`] = "dl"));

        return premium;
    }

    async loadDictionary() {
        // Initialize MW Dictionary
        this.mwDictionaryKey = "98eb66b0-62de-46c3-82e0-85618fc9d0b7";
        this.mwDictionaryCache = new Map();
        console.log("Merriam-Webster dictionary initialized");
    }

    async validateWordWithMW(word) {
        // Check cache first
        if (this.mwDictionaryCache.has(word)) {
            return this.mwDictionaryCache.get(word);
        }
    
        try {
            const response = await fetch(
                `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${this.mwDictionaryKey}`
            );
            const data = await response.json();
    
            // Check if we got a valid word definition
            const isValid = Array.isArray(data) && data.length > 0 && typeof data[0] === 'object';
            
            // Cache the result
            this.mwDictionaryCache.set(word, isValid);
            
            return isValid;
        } catch (error) {
            console.error("Error validating word with Merriam-Webster:", error);
            // Fallback to basic dictionary if API fails
            return this.dictionary.has(word.toLowerCase());
        }
    }   
    
    async validateWord() {
        if (this.placedTiles.length === 0) return false;
    
        if (!this.areTilesConnected()) return false;
    
        // Get all formed words
        const formedWords = this.getFormedWords();
        if (formedWords.length === 0) {
            console.log("No valid words formed");
            return false;
        }
    
        // Validate each word
        for (const wordInfo of formedWords) {
            const word = wordInfo.word.toLowerCase();
            
            // Check basic dictionary first (faster)
            if (!this.dictionary.has(word)) {
                console.log(`Invalid word: ${word}`);
                return false;
            }
    
            // Double check with Merriam-Webster (more authoritative)
            const isValidMW = await this.validateWordWithMW(word);
            if (!isValidMW) {
                console.log(`Word not found in Merriam-Webster: ${word}`);
                return false;
            }
        }
    
        // First move must use center square
        if (this.isFirstMove) {
            const centerUsed = this.placedTiles.some(
                (tile) => tile.row === 7 && tile.col === 7
            );
            if (!centerUsed) {
                console.log("First move must use center square");
                return false;
            }
        }
    
        return true;
    }

    async loadAdditionalWords() {
        const additionalWords = new Set();
        
        // List of common word lengths to query
        const lengths = [4, 5, 6, 7, 8];
        
        for (const length of lengths) {
            try {
                const response = await fetch(`https://api.datamuse.com/words?ml=common&max=1000&md=d&len=${length}`);
                const words = await response.json();
                
                words.forEach(word => {
                    if (word.word && /^[a-zA-Z]+$/.test(word.word)) {
                        additionalWords.add(word.word.toUpperCase());
                    }
                });
                
                // Add a small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`Error fetching words of length ${length}:`, error);
            }
        }
        
        return Array.from(additionalWords);
    }

    fillRacks() {
        // Define letter frequency based on word formation potential
        const commonLetters = {
            'E': 25,  // Increased frequency for common letters
            'A': 20,
            'R': 18,
            'I': 18,
            'O': 18,
            'T': 15,
            'N': 15,
            'S': 15,
            'L': 12,
            'U': 10,
            // Less common letters have reduced frequency
            'D': 8,
            'G': 6,
            'B': 4,
            'C': 4,
            'M': 4,
            'P': 4,
            'F': 4,
            'H': 4,
            'V': 3,
            'W': 3,
            'Y': 3,
            'K': 2,
            'J': 1,
            'X': 1,
            'Q': 1,
            'Z': 1,
            '*': 4  // Increased wild tile frequency for AI
        };
    
        // Helper function to get weighted random letter
        const getWeightedLetter = () => {
            const totalWeight = Object.values(commonLetters).reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            
            for (const [letter, weight] of Object.entries(commonLetters)) {
                random -= weight;
                if (random <= 0) return letter;
            }
            return 'E'; // Fallback to most common letter
        };
    
        // Fill player's rack normally
        while (this.playerRack.length < 7 && this.tiles.length > 0) {
            this.playerRack.push(this.tiles.pop());
        }
    
        // Fill AI's rack with weighted distribution
        while (this.aiRack.length < 7 && this.tiles.length > 0) {
            // 70% chance to get a weighted letter, 30% chance for random tile
            if (Math.random() < 0.7) {
                const letter = getWeightedLetter();
                // Find a tile with this letter in the bag
                const tileIndex = this.tiles.findIndex(t => t.letter === letter);
                if (tileIndex !== -1) {
                    this.aiRack.push(this.tiles.splice(tileIndex, 1)[0]);
                } else {
                    // If letter not found, take random tile
                    this.aiRack.push(this.tiles.pop());
                }
            } else {
                this.aiRack.push(this.tiles.pop());
            }
        }
    
        // Ensure AI has at least one wild tile if available
        if (!this.aiRack.some(tile => tile.letter === '*')) {
            const wildTileIndex = this.tiles.findIndex(t => t.letter === '*');
            if (wildTileIndex !== -1) {
                const randomIndex = Math.floor(Math.random() * this.aiRack.length);
                // Swap a random tile with the wild tile
                this.tiles.push(this.aiRack[randomIndex]);
                this.aiRack[randomIndex] = this.tiles.splice(wildTileIndex, 1)[0];
            }
        }
    
        // Balance vowels and consonants for better word formation
        this.balanceAIRack();
    
        // Update displays
        this.renderRack();
        this.renderAIRack();
        this.updateTilesCount();
    }

    balanceAIRack() {
        const vowels = ['A', 'E', 'I', 'O', 'U'];
        const vowelCount = this.aiRack.filter(tile => vowels.includes(tile.letter)).length;
    
        // Aim for 2-3 vowels in the rack
        if (vowelCount < 2 || vowelCount > 4) {
            const desiredVowelCount = 3;
            while (this.tiles.length > 0 && 
                   this.aiRack.filter(tile => vowels.includes(tile.letter)).length !== desiredVowelCount) {
                
                // Remove excess vowels or consonants
                const indexToRemove = this.aiRack.findIndex(tile => 
                    vowelCount > 3 ? vowels.includes(tile.letter) : !vowels.includes(tile.letter)
                );
    
                if (indexToRemove !== -1) {
                    this.tiles.push(this.aiRack.splice(indexToRemove, 1)[0]);
                    
                    // Add needed vowel or consonant
                    const neededType = vowelCount < 2 ? vowels : 
                        ['R', 'S', 'T', 'L', 'N']; // Common consonants
                    
                    const tileIndex = this.tiles.findIndex(t => neededType.includes(t.letter));
                    if (tileIndex !== -1) {
                        this.aiRack.push(this.tiles.splice(tileIndex, 1)[0]);
                    } else {
                        this.aiRack.push(this.tiles.pop());
                    }
                }
            }
        }
    }

    renderRack() {
        const rack = document.getElementById("tile-rack");
        rack.innerHTML = "";
        
        this.playerRack.forEach((tile, index) => {
            const tileElement = document.createElement("div");
            tileElement.className = "tile";
            tileElement.dataset.index = index;
            tileElement.dataset.id = tile.id;
            tileElement.innerHTML = `
                ${tile.letter}
                <span class="points">${tile.value}</span>
                ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
            `;
    
            if (this.isMobile) {
                // For mobile: only add click handling
                tileElement.addEventListener("click", (e) => {
                    if (this.currentTurn !== "player") return;
                    
                    // Toggle selection
                    if (this.selectedTile === tileElement) {
                        this.deselectTile();
                    } else {
                        this.selectTile(tileElement);
                    }
                });
            } else {
                // For desktop: only add drag functionality
                tileElement.draggable = true;
                tileElement.addEventListener("dragstart", (e) => {
                    if (this.currentTurn === "player") {
                        e.dataTransfer.setData("text/plain", index.toString());
                        e.target.classList.add("dragging");
                    }
                });
    
                tileElement.addEventListener("dragend", (e) => {
                    e.target.classList.remove("dragging");
                });
            }
    
            rack.appendChild(tileElement);
        });
    }

    createTileElement(tile, index) {
        const tileElement = document.createElement("div");
        tileElement.className = "tile";
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
        const rack = document.getElementById("tile-rack");
    
        rack.addEventListener("dragover", (e) => {
            e.preventDefault();
            if (this.currentTurn === "player") {
                e.currentTarget.classList.add("rack-droppable");
            }
        });
    
        rack.addEventListener("dragleave", (e) => {
            e.currentTarget.classList.remove("rack-droppable");
        });
    
        rack.addEventListener("drop", (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("rack-droppable");
    
            if (this.currentTurn !== "player") return;
    
            // Find the dragged tile element
            const draggedTile = document.querySelector(".tile.dragging");
            if (!draggedTile) return;
    
            // Find the placed tile by looking through all board cells
            const boardCell = draggedTile.closest(".board-cell");
            if (!boardCell) return;
    
            const row = parseInt(boardCell.dataset.row);
            const col = parseInt(boardCell.dataset.col);
    
            // Find the corresponding placed tile
            const placedTileIndex = this.placedTiles.findIndex(
                (t) => t.row === row && t.col === col
            );
    
            if (placedTileIndex !== -1) {
                const placedTile = this.placedTiles[placedTileIndex];
    
                // Check if this was originally a wild tile
                if (placedTile.tile.isBlank || placedTile.tile.originalLetter === "*") {
                    // Reset to original wild tile
                    placedTile.tile.letter = "*";
                    placedTile.tile.value = 0;
                    delete placedTile.tile.isBlank;
                }
    
                // Return the tile to the rack
                this.playerRack.push(placedTile.tile);
    
                // Clear the board cell
                this.board[row][col] = null;
                boardCell.innerHTML = "";
    
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
        document.addEventListener("dragstart", (e) => {
            if (
                e.target.classList.contains("tile") &&
                this.currentTurn === "player"
            ) {
                e.target.classList.add("dragging");
                const tileData = {
                    index: e.target.dataset.index,
                    id: e.target.dataset.id,
                };
                e.dataTransfer.setData("text/plain", e.target.dataset.index);

                console.log("Drag started:", tileData);

                e.dataTransfer.effectAllowed = "move";

                const dragImage = e.target.cloneNode(true);
                dragImage.style.opacity = "0.8";
                dragImage.style.position = "absolute";
                dragImage.style.top = "-1000px";
                document.body.appendChild(dragImage);

                e.dataTransfer.setDragImage(
                    dragImage,
                    dragImage.offsetWidth / 2,
                    dragImage.offsetHeight / 2,
                );

                setTimeout(() => {
                    document.body.removeChild(dragImage);
                }, 0);
            }
        });

        document.addEventListener("dragend", (e) => {
            if (e.target.classList.contains("tile")) {
                e.target.classList.remove("dragging");
            }
        });
    }

    setupDropListeners() {
        document.querySelectorAll(".board-cell").forEach((cell) => {
            if (this.isMobile) {
                // Mobile: click to place
                cell.addEventListener("click", (e) => {
                    if (this.currentTurn !== "player" || !this.selectedTile) return;
                    
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);
                    const tileIndex = parseInt(this.selectedTile.dataset.index);
                    
                    if (this.isValidPlacement(row, col, this.playerRack[tileIndex])) {
                        const tile = this.playerRack[tileIndex];
                        
                        // Create flying animation
                        const startRect = this.selectedTile.getBoundingClientRect();
                        const endRect = cell.getBoundingClientRect();
                        
                        const clone = this.selectedTile.cloneNode(true);
                        clone.style.position = "fixed";
                        clone.style.left = `${startRect.left}px`;
                        clone.style.top = `${startRect.top}px`;
                        clone.style.width = `${startRect.width}px`;
                        clone.style.height = `${startRect.height}px`;
                        clone.style.transition = "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.2)";
                        clone.style.zIndex = "1000";
                        document.body.appendChild(clone);
    
                        requestAnimationFrame(() => {
                            clone.style.left = `${endRect.left}px`;
                            clone.style.top = `${endRect.top}px`;
                            clone.style.transform = "scale(1.1) rotate(360deg)";
                        });
    
                        setTimeout(() => {
                            clone.remove();
                            this.placeTile(tile, row, col);
                            this.deselectTile();
                        }, 500);
                    } else {
                        alert("Invalid placement! Check placement rules.");
                    }
                });
            } else {
                // Desktop: drag and drop
                cell.setAttribute("droppable", "true");
                
                cell.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    if (this.currentTurn === "player") {
                        cell.classList.add("droppable-hover");
                    }
                });
    
                cell.addEventListener("drop", (e) => {
                    e.preventDefault();
                    cell.classList.remove("droppable-hover");
                    
                    if (this.currentTurn !== "player") return;
                    
                    const tileIndex = e.dataTransfer.getData("text/plain");
                    const tile = this.playerRack[tileIndex];
                    const row = parseInt(cell.dataset.row);
                    const col = parseInt(cell.dataset.col);
                    
                    if (this.isValidPlacement(row, col, tile)) {
                        this.placeTile(tile, row, col);
                    } else {
                        alert("Invalid placement! Check placement rules.");
                    }
                });
    
                cell.addEventListener("dragleave", (e) => {
                    e.preventDefault();
                    cell.classList.remove("droppable-hover");
                });
            }
        });
    }

    isValidPlacement(row, col, tile) {
        console.log("Checking placement validity:", {
            row,
            col,
            tile
        });

        // Check if cell is already occupied
        if (this.board[row][col]) {
            console.log("Cell is occupied");
            return false;
        }

        // If it's first move and no tiles placed yet
        if (this.isFirstMove && this.placedTiles.length === 0) {
            console.log("First move check:", row === 7 && col === 7);
            return row === 7 && col === 7;
        }

        // After first tile, check distance to existing tiles
        const distance = this.getMinDistanceToWords(row, col);
        console.log("Distance to existing words:", distance);

        // More permissive distance check for tiles near the center
        if (Math.abs(row - 7) <= 1 && Math.abs(col - 7) <= 1) {
            return true;
        }

        return distance <= 5;
    }

    highlightValidPlacements() {
        // Remove existing highlights
        document.querySelectorAll(".board-cell").forEach((cell) => {
            cell.classList.remove(
                "valid-placement",
                "placement-close",
                "placement-medium",
                "placement-far",
            );
        });

        // Only highlight if it's player's turn
        if (this.currentTurn !== "player") return;

        // Check each empty cell
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (!this.board[row][col]) {
                    const distance = this.getMinDistanceToWords(row, col);
                    const cell = document.querySelector(
                        `[data-row="${row}"][data-col="${col}"]`,
                    );

                    if (distance <= 5) {
                        cell.classList.add("valid-placement");
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
        return (
            this.checkAdjacentTiles(row, col) ||
            this.checkExistingWordConnection(row, col)
        );
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
            [-1, 0], // up
            [1, 0], // down
            [0, -1], // left
            [0, 1], // right
        ];

        return directions.some(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            return (
                newRow >= 0 &&
                newRow < 15 &&
                newCol >= 0 &&
                newCol < 15 &&
                this.board[newRow][newCol] !== null
            );
        });
    }

    checkAdjacentTiles(row, col) {
        const directions = [
            [-1, 0], // up
            [1, 0], // down
            [0, -1], // left
            [0, 1], // right
        ];

        return directions.some(([dx, dy]) => {
            const newRow = row + dx;
            const newCol = col + dy;
            return (
                newRow >= 0 &&
                newRow < 15 &&
                newCol >= 0 &&
                newCol < 15 &&
                this.board[newRow][newCol] !== null
            );
        });
    }

    placeTile(tile, row, col) {
        if (this.board[row][col]) {
            alert("This cell is already occupied!");
            return;
        }

        if (tile.letter === "*") {
            const letterSelectionDialog = document.createElement("div");
            letterSelectionDialog.className = "letter-selection-dialog";
            letterSelectionDialog.innerHTML = `
                    <div class="dialog-content">
                        <h3>Choose a letter for the blank tile</h3>
                        <div class="letter-grid">
                            ${Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                              .map(
                                (letter) => `
                                <button class="letter-choice">${letter}</button>
                            `,
                              )
                              .join("")}
                        </div>
                    </div>
                `;

            // Add styles for the dialog
            const style = document.createElement("style");
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
                        background: #0047AB;
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
            const buttons = letterSelectionDialog.querySelectorAll(".letter-choice");
            buttons.forEach((button) => {
                button.addEventListener("click", () => {
                    const selectedLetter = button.textContent;

                    // Create a new tile object with the selected letter but keep point value as 0
                    const blankTile = {
                        ...tile,
                        letter: selectedLetter,
                        originalLetter: "*",
                        value: 0,
                    };

                    // Create proper tile object for the board
                    const placedTile = {
                        letter: selectedLetter,
                        value: 0,
                        id: tile.id,
                        isBlank: true,
                    };

                    this.board[row][col] = placedTile;
                    const cell = document.querySelector(
                        `[data-row="${row}"][data-col="${col}"]`,
                    );
                    const tileIndex = this.playerRack.indexOf(tile);

                    // Create and add the tile element
                    const tileElement = document.createElement("div");
                    tileElement.className = "tile";
                    tileElement.draggable = true;
                    tileElement.dataset.index = tileIndex;
                    tileElement.dataset.id = tile.id;
                    tileElement.innerHTML = `
                            ${selectedLetter}
                            <span class="points">0</span>
                            <span class="blank-indicator">★</span>
                        `;

                    // Add drag events to the tile
                    tileElement.addEventListener("dragstart", (e) => {
                        if (this.currentTurn === "player") {
                            e.target.classList.add("dragging");
                            const cell = e.target.closest(".board-cell");
                            const row = cell.dataset.row;
                            const col = cell.dataset.col;
                            e.dataTransfer.setData("text/plain", `${row},${col}`);
                        }
                    });

                    tileElement.addEventListener("dragend", (e) => {
                        e.target.classList.remove("dragging");
                    });

                    // Clear the cell and add the new tile
                    cell.innerHTML = "";
                    cell.appendChild(tileElement);

                    // Remove tile from rack
                    if (tileIndex > -1) {
                        this.playerRack.splice(tileIndex, 1);
                    }

                    // Add to placed tiles
                    this.placedTiles.push({
                        tile: placedTile,
                        row: row,
                        col: col,
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
                id: tile.id,
            };

            this.board[row][col] = placedTile;
            const cell = document.querySelector(
                `[data-row="${row}"][data-col="${col}"]`,
            );
            const tileIndex = this.playerRack.indexOf(tile);

            const tileElement = document.createElement("div");
            tileElement.className = "tile";
            tileElement.draggable = true;
            tileElement.dataset.index = tileIndex;
            tileElement.dataset.id = tile.id;
            tileElement.innerHTML = `
                    ${tile.letter}
                    <span class="points">${placedTile.value}</span>
                `;

            // Add drag functionality to the placed tile
            tileElement.addEventListener("dragstart", (e) => {
                if (this.currentTurn === "player") {
                    e.target.classList.add("dragging");
                    e.dataTransfer.setData("text/plain", e.target.dataset.index);
                }
            });

            tileElement.addEventListener("dragend", (e) => {
                e.target.classList.remove("dragging");
            });

            // Clear the cell and add the new tile
            cell.innerHTML = "";
            cell.appendChild(tileElement);

            // Remove tile from rack
            if (tileIndex > -1) {
                this.playerRack.splice(tileIndex, 1);
            }

            // Add to placed tiles
            this.placedTiles.push({
                tile: placedTile,
                row: row,
                col: col,
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
        const isHorizontal = sortedTiles.every((t) => t.row === sortedTiles[0].row);
        const isVertical = sortedTiles.every((t) => t.col === sortedTiles[0].col);

        if (!isHorizontal && !isVertical) return false;

        // Check for gaps between placed tiles
        for (let i = 1; i < sortedTiles.length; i++) {
            if (isHorizontal) {
                // Allow gaps if there are existing tiles in between
                const prevCol = sortedTiles[i - 1].col;
                const currCol = sortedTiles[i].col;
                for (let col = prevCol + 1; col < currCol; col++) {
                    if (!this.board[sortedTiles[0].row][col]) {
                        return false;
                    }
                }
            } else {
                // isVertical
                // Allow gaps if there are existing tiles in between
                const prevRow = sortedTiles[i - 1].row;
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
        this.placedTiles.forEach(({
            tile,
            row,
            col
        }) => {
            this.board[row][col] = null;
            const cell = document.querySelector(
                `[data-row="${row}"][data-col="${col}"]`,
            );
            cell.innerHTML = "";
            this.playerRack.push(tile);
        });

        this.placedTiles = [];
        this.renderRack();
    }

    validateWord() {
        if (this.placedTiles.length === 0) return false;

        // Check if tiles are properly connected
        if (!this.areTilesConnected()) return false;

        // Get all formed words (including connected words)
        const formedWords = this.getFormedWords();
        console.log(
            "Formed words:",
            formedWords.map((w) => w.word),
        );

        // If no valid words are formed, return false
        if (formedWords.length === 0) {
            console.log("No valid words formed");
            return false;
        }

        // Validate each word
        let allWordsValid = true;
        formedWords.forEach((wordInfo) => {
            const word = wordInfo.word.toLowerCase();
            if (!this.dictionary.has(word)) {
                console.log(`Invalid word: ${word}`);
                allWordsValid = false;
            } else {
                console.log(`Valid word found: ${word}`);
            }
        });

        // First move must use center square
        if (this.isFirstMove) {
            const centerUsed = this.placedTiles.some(
                (tile) => tile.row === 7 && tile.col === 7,
            );
            if (!centerUsed) {
                console.log("First move must use center square");
                return false;
            }
        }

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

    getFormedWords() {
        const words = new Set();
        const existingWords = new Set(); // Track words that existed before this move

        // First, get words that existed before this move
        // Store the words from the previous board state
        if (this.previousBoard) {
            for (let row = 0; row < 15; row++) {
                let word = "";
                for (let col = 0; col < 15; col++) {
                    if (this.previousBoard[row][col]) {
                        word += this.previousBoard[row][col].letter;
                    } else if (word.length > 1) {
                        existingWords.add(word);
                        word = "";
                    } else {
                        word = "";
                    }
                }
                if (word.length > 1) {
                    existingWords.add(word);
                }
            }

            // Check vertical existing words
            for (let col = 0; col < 15; col++) {
                let word = "";
                for (let row = 0; row < 15; row++) {
                    if (this.previousBoard[row][col]) {
                        word += this.previousBoard[row][col].letter;
                    } else if (word.length > 1) {
                        existingWords.add(word);
                        word = "";
                    } else {
                        word = "";
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
            let word = "";
            let startCol = 0;
            let containsNewTile = false;

            for (let col = 0; col < 15; col++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                    // Check if this position contains a newly placed tile
                    if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
                        containsNewTile = true;
                    }
                } else {
                    if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                        words.add({
                            word,
                            startPos: {
                                row,
                                col: startCol
                            },
                            direction: "horizontal",
                        });
                    }
                    word = "";
                    startCol = col + 1;
                    containsNewTile = false;
                }
            }
            if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                words.add({
                    word,
                    startPos: {
                        row,
                        col: startCol
                    },
                    direction: "horizontal",
                });
            }
        }

        // Check vertical words
        for (let col = 0; col < 15; col++) {
            let word = "";
            let startRow = 0;
            let containsNewTile = false;

            for (let row = 0; row < 15; row++) {
                if (this.board[row][col]) {
                    word += this.board[row][col].letter;
                    // Check if this position contains a newly placed tile
                    if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
                        containsNewTile = true;
                    }
                } else {
                    if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                        words.add({
                            word,
                            startPos: {
                                row: startRow,
                                col
                            },
                            direction: "vertical",
                        });
                    }
                    word = "";
                    startRow = row + 1;
                    containsNewTile = false;
                }
            }
            if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
                words.add({
                    word,
                    startPos: {
                        row: startRow,
                        col
                    },
                    direction: "vertical",
                });
            }
        }

        console.log("Existing words:", Array.from(existingWords));
        console.log(
            "New words formed:",
            Array.from(words).map((w) => w.word),
        );
        return Array.from(words);
    }

    getCrossWord(row, col) {
        let verticalWord = "";
        let horizontalWord = "";

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
            return verticalWord.length > horizontalWord.length ?
                verticalWord :
                horizontalWord;
        }
        if (verticalWord.length > 1) return verticalWord;
        if (horizontalWord.length > 1) return horizontalWord;
        return "";
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
                col: tiles[index].col,
            };
        }
        return null;
    }

    getMainWord() {
        if (this.placedTiles.length === 0) return "";

        const sortedTiles = [...this.placedTiles].sort((a, b) => {
            if (a.row === b.row) {
                return a.col - b.col;
            }
            return a.row - b.row;
        });

        // Determine if word is horizontal or vertical based on placed tiles
        const isHorizontal = sortedTiles.every((t) => t.row === sortedTiles[0].row);
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
        let word = "";
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
        const words = new Set();

        console.log("=== Starting Score Calculation ===");

        // Get all formed words (main word + perpendicular words + modified words)
        const formedWords = this.getFormedWords();
        console.log("Words formed:", formedWords);

        // Calculate score for each formed word
        formedWords.forEach((wordInfo) => {
            let wordScore = 0;
            let wordMultiplier = 1;
            const {
                word,
                startPos,
                direction
            } = wordInfo;

            console.log(`\nCalculating score for word: ${word}`);

            // Calculate score for each letter in the word
            for (let i = 0; i < word.length; i++) {
                const row =
                    direction === "horizontal" ? startPos.row : startPos.row + i;
                const col =
                    direction === "horizontal" ? startPos.col + i : startPos.col;
                const tile = this.board[row][col];

                let letterScore = tile.value;

                // Apply premium squares only for newly placed tiles
                if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
                    const premium = this.getPremiumSquareType(row, col);
                    if (premium === "dl") {
                        letterScore *= 2;
                        console.log(`Double letter score applied to ${tile.letter}`);
                    }
                    if (premium === "tl") {
                        letterScore *= 3;
                        console.log(`Triple letter score applied to ${tile.letter}`);
                    }
                    if (premium === "dw") {
                        wordMultiplier *= 2;
                        console.log("Double word score will be applied");
                    }
                    if (premium === "tw") {
                        wordMultiplier *= 3;
                        console.log("Triple word score will be applied");
                    }
                }

                wordScore += letterScore;
                console.log(`Letter ${tile.letter} adds ${letterScore} points`);
            }

            // Apply word multiplier
            wordScore *= wordMultiplier;
            console.log(`Final score for "${word}": ${wordScore} points`);

            // Add to total score
            totalScore += wordScore;

            // Store word and its score for display
            words.add(
                JSON.stringify({
                    word: word,
                    score: wordScore,
                }),
            );
        });

        // Add bonus for using all 7 tiles
        if (this.placedTiles.length === 7) {
            console.log("\nBINGO! Adding 50 point bonus for using all 7 tiles");
            totalScore += 50;
        }

        console.log(`\n=== Final Score Calculation ===`);
        console.log(
            `Words formed: ${Array.from(words)
          .map((w) => JSON.parse(w).word)
          .join(" & ")}`,
        );
        console.log(`Total score for this move: ${totalScore}`);

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
                        if (
                            !this.board[row][col + i] ||
                            this.board[row][col + i].letter !== word[i]
                        ) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        return {
                            startRow: row,
                            startCol: col,
                            isHorizontal: true
                        };
                    }
                }

                // Check vertical
                if (row <= 15 - word.length) {
                    let matches = true;
                    for (let i = 0; i < word.length; i++) {
                        if (
                            !this.board[row + i][col] ||
                            this.board[row + i][col].letter !== word[i]
                        ) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        return {
                            startRow: row,
                            startCol: col,
                            isHorizontal: false
                        };
                    }
                }
            }
        }
        return null;
    }

    createsVulnerablePosition(word, row, col, isHorizontal) {
        // Check for vulnerable premium square exposure
        const vulnerabilityScore = this.calculateVulnerabilityScore(
            word,
            row,
            col,
            isHorizontal,
        );

        // Consider a position vulnerable if it exceeds threshold
        const VULNERABILITY_THRESHOLD = 30;

        return vulnerabilityScore > VULNERABILITY_THRESHOLD;
    }

    calculateVulnerabilityScore(word, row, col, isHorizontal) {
        let vulnerabilityScore = 0;

        // Check each position adjacent to the word
        for (let i = 0; i < word.length; i++) {
            const currentRow = isHorizontal ? row : row + i;
            const currentCol = isHorizontal ? col + i : col;

            // Check perpendicular adjacent positions
            const adjacentPositions = isHorizontal ? [
                [currentRow - 1, currentCol],
                [currentRow + 1, currentCol],
            ] : [
                [currentRow, currentCol - 1],
                [currentRow, currentCol + 1],
            ];

            for (const [adjRow, adjCol] of adjacentPositions) {
                if (!this.isValidPosition(adjRow, adjCol)) continue;

                // Higher vulnerability near premium squares
                const premium = this.getPremiumSquareType(adjRow, adjCol);
                if (premium === "tw") vulnerabilityScore += 15;
                if (premium === "dw") vulnerabilityScore += 10;
                if (premium === "tl") vulnerabilityScore += 8;
                if (premium === "dl") vulnerabilityScore += 5;

                // Check if position enables easy high-scoring plays
                if (this.enablesHighScoringPlay(adjRow, adjCol)) {
                    vulnerabilityScore += 12;
                }

                // Penalty for exposing edges that enable long word placement
                if (this.createsEdgeVulnerability(adjRow, adjCol)) {
                    vulnerabilityScore += 8;
                }
            }
        }

        return vulnerabilityScore;
    }

    enablesHighScoringPlay(row, col) {
        // Check if position could enable opponent to make high-scoring play

        // Check for adjacent premium squares
        const hasNearbyPremium = this.hasAdjacentPremiumSquares(row, col);

        // Check for potential long word placement
        const potentialLength = this.getMaxPossibleWordLength(row, col);

        // Check for cross-word opportunities
        const crossWordPotential =
            this.evaluateCrossWordPotential("", row, col, true) > 1;

        return hasNearbyPremium || potentialLength >= 6 || crossWordPotential;
    }

    hasAdjacentPremiumSquares(row, col) {
        const directions = [
            [-1, 0],
            [1, 0],
            [0, -1],
            [0, 1],
        ];

        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (this.isValidPosition(newRow, newCol)) {
                const premium = this.getPremiumSquareType(newRow, newCol);
                if (premium) return true;
            }
        }

        return false;
    }

    createsEdgeVulnerability(row, col) {
        // Check if position is near edge and creates opportunity for opponent
        const isEdge = row <= 1 || row >= 13 || col <= 1 || col >= 13;

        if (!isEdge) return false;

        // Check if there's enough space for a long word
        const horizontalSpace = this.getHorizontalSpace(row, col);
        const verticalSpace = this.getVerticalSpace(row, col);

        return horizontalSpace >= 5 || verticalSpace >= 5;
    }

    getHorizontalSpace(row, col) {
        let space = 1;
        let currentCol = col - 1;

        // Check left
        while (currentCol >= 0 && !this.board[row][currentCol]) {
            space++;
            currentCol--;
        }

        // Check right
        currentCol = col + 1;
        while (currentCol < 15 && !this.board[row][currentCol]) {
            space++;
            currentCol++;
        }

        return space;
    }

    getVerticalSpace(row, col) {
        let space = 1;
        let currentRow = row - 1;

        // Check up
        while (currentRow >= 0 && !this.board[currentRow][col]) {
            space++;
            currentRow--;
        }

        // Check down
        currentRow = row + 1;
        while (currentRow < 15 && !this.board[currentRow][col]) {
            space++;
            currentRow++;
        }

        return space;
    }

    getPremiumSquareType(row, col) {
        const cell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`,
        );
        if (cell.classList.contains("tw")) return "tw";
        if (cell.classList.contains("dw")) return "dw";
        if (cell.classList.contains("tl")) return "tl";
        if (cell.classList.contains("dl")) return "dl";
        return null;
    }

    countPremiumSquaresUsed(row, col, horizontal, word) {
        let count = 0;
        const premiumTypes = ["tw", "dw", "tl", "dl"];

        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Only count premium squares that aren't already used
            if (!this.board[currentRow][currentCol]) {
                const premium = this.getPremiumSquareType(currentRow, currentCol);
                if (premiumTypes.includes(premium)) {
                    count++;
                }
            }
        }

        return count;
    }

    isCreativePlacement(row, col, horizontal, word) {
        let creativityScore = 0;

        // Check for multiple intersections with existing words
        const intersections = this.countIntersections(row, col, horizontal, word);
        creativityScore += intersections * 2;

        // Check premium square usage
        const premiumSquares = this.countPremiumSquaresUsed(
            row,
            col,
            horizontal,
            word,
        );
        creativityScore += premiumSquares * 2;

        // Check for parallel word formation
        const parallelWords = this.countParallelWords(row, col, horizontal, word);
        creativityScore += parallelWords * 3;

        // Check for future play opportunities created
        const opportunities = this.countFutureOpportunities(
            row,
            col,
            horizontal,
            word,
        );
        creativityScore += opportunities;

        // Check for balanced board coverage
        if (this.improvesBoardBalance(row, col, horizontal, word)) {
            creativityScore += 2;
        }

        // Consider a placement creative if it scores above threshold
        return creativityScore >= 5;
    }

    countParallelWords(row, col, horizontal, word) {
        let count = 0;
        const minParallelLength = 3; // Minimum length for parallel words

        for (let i = 0; i < word.length; i++) {
            const currentRow = horizontal ? row : row + i;
            const currentCol = horizontal ? col + i : col;

            // Check positions parallel to the word
            const checkPositions = horizontal ? [
                [currentRow - 1, currentCol],
                [currentRow + 1, currentCol],
            ] : [
                [currentRow, currentCol - 1],
                [currentRow, currentCol + 1],
            ];

            for (const [checkRow, checkCol] of checkPositions) {
                if (this.isValidPosition(checkRow, checkCol)) {
                    const parallelWord = horizontal ?
                        this.getHorizontalWordAt(checkRow, checkCol) :
                        this.getVerticalWordAt(checkRow, checkCol);

                    if (parallelWord && parallelWord.length >= minParallelLength) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    improvesBoardBalance(row, col, horizontal, word) {
        const boardQuadrants = this.getBoardQuadrantDensities();
        const playQuadrant = this.getQuadrant(row, col);

        // Check if this play helps balance the board
        const avgDensity =
            Object.values(boardQuadrants).reduce((sum, density) => sum + density, 0) /
            9;

        // Play improves balance if it's in a less dense quadrant
        return boardQuadrants[playQuadrant] < avgDensity;
    }

    getQuadrant(row, col) {
        // Divide board into 9 quadrants
        if (row < 5) {
            return col < 5 ? "TL" : col < 10 ? "TC" : "TR";
        } else if (row < 10) {
            return col < 5 ? "ML" : col < 10 ? "MC" : "MR";
        } else {
            return col < 5 ? "BL" : col < 10 ? "BC" : "BR";
        }
    }

    getBoardQuadrantDensities() {
        const quadrants = {
            TL: 0,
            TC: 0,
            TR: 0,
            ML: 0,
            MC: 0,
            MR: 0,
            BL: 0,
            BC: 0,
            BR: 0,
        };

        // Count tiles in each quadrant
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (this.board[row][col]) {
                    const quadrant = this.getQuadrant(row, col);
                    quadrants[quadrant]++;
                }
            }
        }

        // Convert counts to densities
        const quadrantSize = 25; // 5x5 squares
        for (const quadrant in quadrants) {
            quadrants[quadrant] = quadrants[quadrant] / quadrantSize;
        }

        return quadrants;
    }

    evaluateWordQuality(word, row, col, horizontal) {
        let quality = 0;

        // Base points for word length
        quality += word.length * 10;

        // Check premium square utilization
        const premiumSquares = this.countPremiumSquaresUsed(
            row,
            col,
            horizontal,
            word,
        );
        quality += premiumSquares * 15;

        // Check for cross-words
        const crossWords = this.countIntersections(row, col, horizontal, word);
        quality += crossWords * 20;

        // Check for balanced letter usage
        const letterBalance = this.evaluateLetterBalance(word);
        quality += letterBalance * 10;

        return quality;
    }

    evaluateLetterBalance(word) {
        const vowels = "AEIOU";
        const vowelCount = word.split("").filter((c) => vowels.includes(c)).length;
        const consonantCount = word.length - vowelCount;

        // Ideal ratio is around 40% vowels
        const vowelRatio = vowelCount / word.length;
        return vowelRatio >= 0.3 && vowelRatio <= 0.5 ? 2 : 0;
    }

    async playWord() {
        if (this.placedTiles.length === 0) {
            alert("Please place some tiles first!");
            return;
        }

        if (!this.areTilesConnected()) {
            alert("Tiles must be connected and in a straight line!");
            this.resetPlacedTiles();
            return;
        }

        if (this.validateWord()) {
            // Get all formed words and their individual scores
            const formedWords = this.getFormedWords();
            let totalScore = 0;
            let wordDescriptions = [];

            formedWords.forEach((wordInfo) => {
                const {
                    word,
                    startPos,
                    direction
                } = wordInfo;
                // Calculate score for this specific word
                let wordScore = 0;
                let wordMultiplier = 1;

                // Calculate each letter's contribution
                for (let i = 0; i < word.length; i++) {
                    const row =
                        direction === "horizontal" ? startPos.row : startPos.row + i;
                    const col =
                        direction === "horizontal" ? startPos.col + i : startPos.col;
                    const tile = this.board[row][col];

                    let letterScore = tile.value;

                    // Apply premium squares only for newly placed tiles
                    if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
                        const premium = this.getPremiumSquareType(row, col);
                        if (premium === "dl") letterScore *= 2;
                        if (premium === "tl") letterScore *= 3;
                        if (premium === "dw") wordMultiplier *= 2;
                        if (premium === "tw") wordMultiplier *= 3;
                    }

                    wordScore += letterScore;
                }

                // Apply word multiplier
                wordScore *= wordMultiplier;
                totalScore += wordScore;

                // Store word and its individual score
                wordDescriptions.push({
                    word: word,
                    score: wordScore,
                });
            });

            // Add bonus for using all 7 tiles
            if (this.placedTiles.length === 7) {
                totalScore += 50;
                wordDescriptions.push({
                    word: "BINGO BONUS",
                    score: 50
                });
            }

            // Format the move description
            let moveDescription;
            if (wordDescriptions.length > 1) {
                // Multiple words formed
                moveDescription = wordDescriptions
                    .map((w) => `${w.word} (${w.score})`)
                    .join(" & ");
            } else {
                // Single word
                moveDescription = wordDescriptions[0].word;
            }

            // Update game state
            this.playerScore += totalScore;
            this.isFirstMove = false;
            this.placedTiles = [];
            this.fillRacks();
            this.consecutiveSkips = 0;
            this.currentTurn = "ai";

            // Add to move history with all formed words
            this.addToMoveHistory("Player", moveDescription, totalScore);
            this.updateGameState();

            if (!this.checkGameEnd()) {
                await this.aiTurn();
            }
        } else {
            alert("Invalid word! Please try again.");
            this.resetPlacedTiles();
        }
    }

    addToMoveHistory(player, words, score) {
        this.moveHistory.push({
            player,
            word: words, // This now contains all formed words with their individual scores
            score,
            timestamp: new Date(),
        });
        this.updateMoveHistory();
    }

    updateMoveHistory() {
        const historyDisplay =
            document.getElementById("move-history") ||
            this.createMoveHistoryDisplay();
        historyDisplay.innerHTML =
            "<h3>Move History</h3>" +
            this.moveHistory
            .map((move) => {
                if (
                    move.word === "SKIP" ||
                    move.word === "EXCHANGE" ||
                    move.word === "QUIT"
                ) {
                    return `<div class="move">
                          ${move.player}: "${move.word}" for ${move.score} points
                      </div>`;
                }

                // Handle multiple words (contains &)
                if (move.word.includes("&")) {
                    const words = move.word.split("&").map((w) => w.trim());
                    const wordScores = words.map((word) => {
                        // Extract score from format "WORD (score)"
                        const match = word.match(/(.+)\s*\((\d+)\)/);
                        if (match) {
                            return {
                                word: match[1].trim(),
                                score: parseInt(match[2]),
                            };
                        }
                        return {
                            word: word.trim(),
                            score: 0
                        };
                    });

                    const formattedWords = wordScores
                        .map((w) => `${w.word} (${w.score})`)
                        .join(" & ");

                    return `<div class="move">
                          ${move.player}: ${formattedWords} for total of ${move.score} points
                      </div>`;
                }

                // Single word
                return `<div class="move">
                      ${move.player}: "${move.word}" for ${move.score} points
                  </div>`;
            })
            .join("");
    }

    updateGameState() {
        this.updateScores();
        this.updateTilesCount();
        this.updateTurnIndicator();
    }

    updateScores() {
        document.getElementById("player-score").textContent = this.playerScore;
        document.getElementById("computer-score").textContent = this.aiScore;
    }

    updateTilesCount() {
        document.getElementById("tiles-count").textContent = this.tiles.length;
    }

    updateTurnIndicator() {
        const turnDisplay =
            document.getElementById("current-turn") || this.createTurnIndicator();
        turnDisplay.textContent = `Current Turn: ${this.currentTurn === "player" ? "Your" : "Computer's"} Turn`;
        turnDisplay.className =
            this.currentTurn === "player" ? "player-turn" : "ai-turn";
    }

    createTurnIndicator() {
        const turnDisplay = document.createElement("div");
        turnDisplay.id = "current-turn";
        document.querySelector(".info-panel").prepend(turnDisplay);
        return turnDisplay;
    }

    checkGameEnd() {
        if (
            this.tiles.length === 0 &&
            (this.playerRack.length === 0 || this.aiRack.length === 0)
        ) {
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
        const winner = this.playerScore > this.aiScore ? "Player" : "Computer";
        const finalScore = Math.max(this.playerScore, this.aiScore);

        let winOverlay = document.querySelector(".win-overlay");
        if (!winOverlay) {
            winOverlay = document.createElement("div");
            winOverlay.className = "win-overlay";

            const messageBox = document.createElement("div");
            messageBox.className = "win-message";
            winOverlay.appendChild(messageBox);

            document.body.appendChild(winOverlay);
        }

        // Get the message box
        const messageBox = winOverlay.querySelector(".win-message");
        messageBox.innerHTML = `
          <h2 style="color: ${winner === "Computer" ? "#ff3333" : "#33cc33"}; margin-bottom: 20px;">Game Over!</h2>
          <p style="font-size: 1.2em; margin-bottom: 15px;">${winner} wins with ${finalScore} points!</p>
          <p style="font-weight: bold; margin-bottom: 10px;">Final Scores:</p>
          <p>Player: ${this.playerScore}</p>
          <p>Computer: ${this.aiScore}</p>
          <button onclick="location.reload()" 
                  style="padding: 10px 20px; 
                         margin-top: 20px; 
                         background-color: #4CAF50; 
                         color: white; 
                         border: none; 
                         border-radius: 5px; 
                         cursor: pointer;
                         font-size: 1.1em;">
              Play Again
          </button>
      `;

        // Clear any existing classes
        winOverlay.classList.remove("active", "lose");
        messageBox.classList.remove("celebrate");

        // Add appropriate classes
        if (winner === "Computer") {
            winOverlay.classList.add("lose");
        }

        // Small delay to ensure transitions work properly
        requestAnimationFrame(() => {
            winOverlay.classList.add("active");
            messageBox.classList.add("celebrate");

            // Create the confetti/emoji effect
            this.createConfettiEffect();
        });
    }

    createConfettiEffect() {
        // Different effects for win vs lose
        const isWinner = this.playerScore > this.aiScore;
        console.log("Creating effect for:", isWinner ? "winner" : "loser");

        if (isWinner) {
            // Happy emojis and colorful confetti for winning
            const emojis = ["🎉", "🎊", "🏆", "⭐", "🌟", "💫", "✨"];
            const colors = ["#FFD700", "#FFA500", "#FF69B4", "#00FF00", "#87CEEB"];
            const particleCount = 150;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");

                // Randomly choose between emoji or confetti
                const isEmoji = Math.random() > 0.7; // 30% chance of emoji

                if (isEmoji) {
                    particle.textContent =
                        emojis[Math.floor(Math.random() * emojis.length)];
                    particle.style.fontSize = `${20 + Math.random() * 20}px`;
                } else {
                    particle.style.backgroundColor =
                        colors[Math.floor(Math.random() * colors.length)];
                    particle.style.width = "10px";
                    particle.style.height = "10px";
                }

                particle.style.cssText = `
      position: fixed;
      pointer-events: none;
      left: ${Math.random() * 100}vw;
      top: -20px;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
      animation: win-particle-fall ${3 + Math.random() * 2}s linear forwards;
      z-index: 1500;
  `;
                document.body.appendChild(particle);

                particle.addEventListener("animationend", () => {
                    particle.remove();
                });
            }
        } else {
            // Taunting emojis for losing
            const emojis = [
                "😂",
                "🤣",
                "😝",
                "😜",
                "😋",
                "😏",
                "🤪",
                "😎",
                "🤭",
                "😈",
            ];
            const emojiCount = 50;

            for (let i = 0; i < emojiCount; i++) {
                const emoji = document.createElement("div");
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
      z-index: 1500;
  `;
                document.body.appendChild(emoji);

                emoji.addEventListener("animationend", () => {
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
            timestamp: new Date(),
        });
        this.updateMoveHistory();
    }

    createMoveHistoryDisplay() {
        const historyDisplay = document.createElement("div");
        historyDisplay.id = "move-history";
        document.querySelector(".info-panel").appendChild(historyDisplay);
        return historyDisplay;
    }

    renderAIRack() {
        const rack = document.getElementById("ai-rack");
        rack.innerHTML = "";
        this.aiRack.forEach((tile) => {
            const tileElement = document.createElement("div");
            tileElement.className = "tile";
            tileElement.innerHTML = `
                        ${tile.letter}
                        <span class="points">${tile.value}</span>
                    `;
            rack.appendChild(tileElement);
        });
    }

    fillRacks() {
        // Define optimal letter distributions
        const optimalDistribution = {
            vowels: ['A', 'E', 'I', 'O', 'U'],
            commonConsonants: ['R', 'S', 'T', 'L', 'N'],
            mediumConsonants: ['D', 'G', 'B', 'C', 'M', 'P'],
            rareLetters: ['J', 'K', 'Q', 'V', 'W', 'X', 'Y', 'Z']
        };
    
        // AI gets better distribution and higher chance of blank tiles
        while (this.aiRack.length < 7 && this.tiles.length > 0) {
            // 40% chance to get exactly what AI needs
            if (Math.random() < 0.4) {
                const currentVowels = this.aiRack.filter(tile => 
                    optimalDistribution.vowels.includes(tile.letter)).length;
                
                // Decide what type of tile AI needs
                let desiredTile;
                if (currentVowels < 2) {
                    // Need vowels
                    desiredTile = this.findTileInBag(optimalDistribution.vowels);
                } else if (currentVowels > 3) {
                    // Need consonants
                    desiredTile = this.findTileInBag(optimalDistribution.commonConsonants);
                } else {
                    // Get blank tile or common letter
                    desiredTile = this.findTileInBag(['*'].concat(optimalDistribution.commonConsonants));
                }
    
                if (desiredTile) {
                    this.aiRack.push(desiredTile);
                    continue;
                }
            }
    
            // Regular draw with weighted probability
            const tile = this.drawWeightedTile(true); // true for AI
            if (tile) this.aiRack.push(tile);
        }
    
        // Player gets decent but not as optimal distribution
        while (this.playerRack.length < 7 && this.tiles.length > 0) {
            const currentVowels = this.playerRack.filter(tile => 
                optimalDistribution.vowels.includes(tile.letter)).length;
    
            // 25% chance to get needed letter type
            if (Math.random() < 0.25) {
                let desiredTile;
                if (currentVowels < 2) {
                    desiredTile = this.findTileInBag(optimalDistribution.vowels);
                } else if (currentVowels > 3) {
                    desiredTile = this.findTileInBag(optimalDistribution.commonConsonants);
                }
    
                if (desiredTile) {
                    this.playerRack.push(desiredTile);
                    continue;
                }
            }
    
            // Regular draw with weighted probability
            const tile = this.drawWeightedTile(false); // false for player
            if (tile) this.playerRack.push(tile);
        }
    
        // Update displays
        this.renderRack();
        this.renderAIRack();
        this.updateTilesCount();
    }

    findTileInBag(desiredLetters) {
        const index = this.tiles.findIndex(tile => desiredLetters.includes(tile.letter));
        return index !== -1 ? this.tiles.splice(index, 1)[0] : null;
    }

    drawWeightedTile(isAI) {
        if (this.tiles.length === 0) return null;
    
        const weights = {
            '*': isAI ? 50 : 10,  // AI gets 5x chance for blank tiles
            'AEIOU': isAI ? 35 : 30,
            'RSTLN': isAI ? 30 : 25,
            'DGBCMP': 20,
            'FHVWY': 15,
            'JKQXZ': 10
        };
    
        // Calculate total weight
        let totalWeight = 0;
        this.tiles.forEach(tile => {
            if (tile.letter === '*') totalWeight += weights['*'];
            else if ('AEIOU'.includes(tile.letter)) totalWeight += weights['AEIOU'];
            else if ('RSTLN'.includes(tile.letter)) totalWeight += weights['RSTLN'];
            else if ('DGBCMP'.includes(tile.letter)) totalWeight += weights['DGBCMP'];
            else if ('FHVWY'.includes(tile.letter)) totalWeight += weights['FHVWY'];
            else totalWeight += weights['JKQXZ'];
        });
    
        // Random weighted selection
        let random = Math.random() * totalWeight;
        for (let i = 0; i < this.tiles.length; i++) {
            let weight;
            if (this.tiles[i].letter === '*') weight = weights['*'];
            else if ('AEIOU'.includes(this.tiles[i].letter)) weight = weights['AEIOU'];
            else if ('RSTLN'.includes(this.tiles[i].letter)) weight = weights['RSTLN'];
            else if ('DGBCMP'.includes(this.tiles[i].letter)) weight = weights['DGBCMP'];
            else if ('FHVWY'.includes(this.tiles[i].letter)) weight = weights['FHVWY'];
            else weight = weights['JKQXZ'];
    
            random -= weight;
            if (random <= 0) return this.tiles.splice(i, 1)[0];
        }
    
        return this.tiles.pop();
    }

    setupExchangeSystem() {
        this.exchangePortal = document.getElementById("exchange-portal");
        const activateButton = document.getElementById("activate-exchange");

        activateButton.addEventListener("click", () => {
            if (this.currentTurn !== "player") {
                alert("Wait for your turn!");
                return;
            }
            this.toggleExchangeMode();
        });

        // Modify portal drop zone event listeners
        this.exchangePortal.addEventListener("dragover", (e) => {
            if (!this.exchangeMode) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move"; // Add this line
            this.exchangePortal.classList.add("portal-dragover");
        });

        this.exchangePortal.addEventListener("drop", async (e) => {
            e.preventDefault();
            e.stopPropagation(); // Add this line
            if (!this.exchangeMode) return;

            const tileIndex = e.dataTransfer.getData("text/plain");
            if (tileIndex !== "") {
                await this.handleTileExchange(parseInt(tileIndex));
            }

            this.exchangePortal.classList.remove("portal-dragover");
        });
    }

    toggleExchangeMode() {
        if (this.currentTurn !== "player") {
            alert("Wait for your turn!");
            return;
        }

        this.exchangeMode = !this.exchangeMode;
        const activateButton = document.getElementById("activate-exchange");

        if (this.exchangeMode) {
            this.exchangePortal.classList.add("active");
            activateButton.textContent = "Deactivate Exchange Portal";
            activateButton.style.background =
                "linear-gradient(145deg, #ff4081, #f50057)";

            // Show exchange instructions
            const instructions = document.createElement("div");
            instructions.className = "exchange-instructions animated";
            this.exchangePortal.parentElement.appendChild(instructions);
        } else {
            this.exchangePortal.classList.remove("active");
            activateButton.textContent = "Activate Exchange Portal";
            activateButton.style.background =
                "linear-gradient(145deg, #42a5f5, #1976d2)";

            // Remove instructions
            const instructions = document.querySelector(
                ".exchange-instructions.animated",
            );
            if (instructions) {
                instructions.remove();
            }

            // Process any remaining exchanges
            if (this.exchangingTiles.length > 0) {
                this.completeExchange();
            }
        }
    }

    async handleTileExchange(tileIndex) {
        if (!this.exchangeMode || this.tiles.length === 0 || isNaN(tileIndex))
            return;

        const tile = this.playerRack[tileIndex];
        if (!tile) {
            console.error("Invalid tile index:", tileIndex);
            return;
        }

        try {
            // Get the original tile element and its position
            const tileElement = document.querySelector(`[data-index="${tileIndex}"]`);
            if (!tileElement) {
                console.error("Tile element not found");
                return;
            }

            const tileRect = tileElement.getBoundingClientRect();
            const portalRect = this.exchangePortal.getBoundingClientRect();

            // Create clone for animation
            const clone = tileElement.cloneNode(true);
            clone.style.position = "fixed";
            clone.style.left = `${tileRect.left}px`;
            clone.style.top = `${tileRect.top}px`;
            clone.style.width = `${tileRect.width}px`;
            clone.style.height = `${tileRect.height}px`;
            clone.style.transition = "none";
            clone.style.zIndex = "1000";
            document.body.appendChild(clone);

            // Calculate the center of the portal
            const portalCenterX = portalRect.left + portalRect.width / 2;
            const portalCenterY = portalRect.top + portalRect.height / 2;

            // Create keyframes for the spiral animation
            const spiralKeyframes = [];
            const totalSteps = 50;
            const totalRotations = 3;
            const scaleFactor = 0.1;

            for (let i = 0; i <= totalSteps; i++) {
                const progress = i / totalSteps;
                const angle = progress * totalRotations * 2 * Math.PI;
                const radius = (1 - progress) * 100; // Spiral radius decreases as progress increases

                // Calculate position along spiral
                const x =
                    tileRect.left +
                    (portalCenterX - tileRect.left) * progress +
                    Math.cos(angle) * radius;
                const y =
                    tileRect.top +
                    (portalCenterY - tileRect.top) * progress +
                    Math.sin(angle) * radius;

                // Calculate scale and rotation
                const scale = 1 - progress * (1 - scaleFactor);
                const rotation = progress * 720; // Two full rotations

                spiralKeyframes.push({
                    transform: `translate(${x - tileRect.left}px, ${y - tileRect.top}px) 
                            rotate(${rotation}deg) 
                            scale(${scale})`,
                    opacity: 1 - progress * 0.8,
                });
            }

            // Add final keyframe for disappearing into portal
            spiralKeyframes.push({
                transform: `translate(${portalCenterX - tileRect.left}px, ${portalCenterY - tileRect.top}px) 
                        rotate(720deg) 
                        scale(${scaleFactor})`,
                opacity: 0,
            });

            // Create and play the animation
            const animation = clone.animate(spiralKeyframes, {
                duration: 1500,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                fill: "forwards",
            });

            // Create swirling particle effect
            const particles = [];
            const particleCount = 10;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");
                particle.className = "exchange-particle";
                particle.style.cssText = `
                  position: fixed;
                  width: 4px;
                  height: 4px;
                  background: ${["#64b5f6", "#2196f3", "#1976d2"][Math.floor(Math.random() * 3)]};
                  border-radius: 50%;
                  pointer-events: none;
                  z-index: 999;
              `;
                document.body.appendChild(particle);
                particles.push(particle);

                const delay = i * (1500 / particleCount);
                const particleAnimation = particle.animate(spiralKeyframes, {
                    duration: 1500,
                    delay: delay,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "forwards",
                });

                particleAnimation.onfinish = () => particle.remove();
            }

            // Wait for animation to complete
            await animation.finished;
            clone.remove();

            // Add to exchanging tiles
            this.exchangingTiles.push({
                tile: tile,
                index: tileIndex,
            });

            // Remove from rack visually
            this.playerRack.splice(tileIndex, 1);
            this.renderRack();

            // Add portal pulse effect
            this.exchangePortal.classList.add("portal-pulse");
            setTimeout(() => {
                this.exchangePortal.classList.remove("portal-pulse");
            }, 500);

            // If player has exchanged enough tiles or rack is empty
            if (this.exchangingTiles.length >= 7 || this.playerRack.length === 0) {
                await this.completeExchange();
            }
        } catch (error) {
            console.error("Error during tile exchange:", error);
        }
    }

    async completeExchange() {
        if (this.exchangingTiles.length === 0) return;

        // Disable exchange mode
        this.exchangeMode = false;
        this.exchangePortal.classList.remove("active");
        document.getElementById("activate-exchange").textContent =
            "Activate Exchange Portal";

        // Create portal closing animation
        const portalClose = this.exchangePortal.animate(
            [{
                    transform: "scale(1) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform: "scale(0) rotate(360deg)",
                    opacity: 0
                },
            ], {
                duration: 1000,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
        );

        // Create new tiles animation
        const newTilesContainer = document.createElement("div");
        newTilesContainer.className = "new-tiles-container";
        document.body.appendChild(newTilesContainer);

        // Return exchanged tiles to bag and get new ones
        const newTiles = [];
        for (const exchangedTile of this.exchangingTiles) {
            this.tiles.push(exchangedTile.tile);
            this.shuffleTiles();
            const newTile = this.tiles.pop();
            if (newTile) {
                newTiles.push(newTile);
            }
        }

        // Animate new tiles appearing
        for (let i = 0; i < newTiles.length; i++) {
            const tile = newTiles[i];
            const tileElement = document.createElement("div");
            tileElement.className = "tile new-tile";
            tileElement.innerHTML = `
                    ${tile.letter}
                    <span class="points">${tile.value}</span>
                `;
            newTilesContainer.appendChild(tileElement);

            const portalRect = this.exchangePortal.getBoundingClientRect();
            const rackRect = document
                .getElementById("tile-rack")
                .getBoundingClientRect();
            const finalX = rackRect.left + i * 50; // Adjust spacing as needed
            const finalY = rackRect.top;

            await new Promise((resolve) => {
                tileElement.animate(
                    [{
                            left: `${portalRect.left + portalRect.width / 2}px`,
                            top: `${portalRect.top + portalRect.height / 2}px`,
                            transform: "scale(0) rotate(-360deg)",
                            opacity: 0,
                        },
                        {
                            left: `${finalX}px`,
                            top: `${finalY}px`,
                            transform: "scale(1) rotate(0deg)",
                            opacity: 1,
                        },
                    ], {
                        duration: 1000,
                        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        fill: "forwards",
                    },
                ).onfinish = resolve;
            });
        }

        // Update player's rack with new tiles
        this.playerRack.push(...newTiles);
        this.renderRack();

        // Cleanup
        newTilesContainer.remove();
        this.exchangingTiles = [];

        // Add to move history
        this.addToMoveHistory("Player", "EXCHANGE", 0);

        // Switch turn to AI
        this.currentTurn = "ai";
        this.consecutiveSkips++;
        this.updateGameState();

        // Check for game end or continue with AI turn
        if (!this.checkGameEnd()) {
            await this.aiTurn();
        }
    }

    handleAIExchange() {
        console.log("AI attempting to exchange tiles...");

        // Create visual effect for AI exchange
        this.showAIExchangeAnimation().then(() => {
            // Get current AI rack
            const oldTiles = [...this.aiRack];
            const exchangeCount = Math.min(this.aiRack.length, this.tiles.length);

            if (exchangeCount === 0) {
                console.log("No tiles left to exchange");
                this.skipAITurn();
                return;
            }

            // Return tiles to bag
            for (let i = 0; i < exchangeCount; i++) {
                this.tiles.push(this.aiRack.pop());
            }
            this.shuffleTiles();

            // Draw new tiles
            for (let i = 0; i < exchangeCount; i++) {
                if (this.tiles.length > 0) {
                    this.aiRack.push(this.tiles.pop());
                }
            }

            // Update displays
            this.renderAIRack();
            this.updateTilesCount();

            // Add to move history
            this.addToMoveHistory("Computer", "Computer exchanged tiles. Player's turn", 0);

            // Switch turn
            this.currentTurn = "player";
            this.consecutiveSkips++;
            this.updateGameState();

            console.log("AI exchange complete:", {
                oldTiles: oldTiles.map((t) => t.letter),
                newTiles: this.aiRack.map((t) => t.letter),
            });

            // Check for game end
            this.checkGameEnd();
        });
    }

    async showAIExchangeAnimation() {
        const portal = document.getElementById("exchange-portal");
        portal.classList.add("active");

        // Animate AI tiles going into portal
        const aiRackElement = document.getElementById("ai-rack");
        const tileElements = Array.from(
            aiRackElement.getElementsByClassName("tile"),
        );
        const portalRect = portal.getBoundingClientRect();

        // Animate each tile one by one
        for (const tile of tileElements) {
            const tileRect = tile.getBoundingClientRect();

            // Create clone for animation
            const clone = tile.cloneNode(true);
            clone.style.position = "fixed";
            clone.style.left = `${tileRect.left}px`;
            clone.style.top = `${tileRect.top}px`;
            clone.style.width = `${tileRect.width}px`;
            clone.style.height = `${tileRect.height}px`;
            clone.style.transition = "none";
            clone.style.zIndex = "1000";
            document.body.appendChild(clone);

            // Calculate portal center
            const portalCenterX = portalRect.left + portalRect.width / 2;
            const portalCenterY = portalRect.top + portalRect.height / 2;

            // Create spiral keyframes
            const spiralKeyframes = [];
            const totalSteps = 50;
            const totalRotations = 3;
            const scaleFactor = 0.1;

            for (let i = 0; i <= totalSteps; i++) {
                const progress = i / totalSteps;
                const angle = progress * totalRotations * 2 * Math.PI;
                const radius = (1 - progress) * 100;

                const x =
                    tileRect.left +
                    (portalCenterX - tileRect.left) * progress +
                    Math.cos(angle) * radius;
                const y =
                    tileRect.top +
                    (portalCenterY - tileRect.top) * progress +
                    Math.sin(angle) * radius;

                const scale = 1 - progress * (1 - scaleFactor);
                const rotation = progress * 720;

                spiralKeyframes.push({
                    transform: `translate(${x - tileRect.left}px, ${y - tileRect.top}px) 
                                 rotate(${rotation}deg) 
                                 scale(${scale})`,
                    opacity: 1 - progress * 0.8,
                });
            }

            // Add final keyframe
            spiralKeyframes.push({
                transform: `translate(${portalCenterX - tileRect.left}px, ${portalCenterY - tileRect.top}px) 
                             rotate(720deg) 
                             scale(${scaleFactor})`,
                opacity: 0,
            });

            // Create particles
            const particles = [];
            const particleCount = 10;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");
                particle.className = "exchange-particle";
                particle.style.cssText = `
                      position: fixed;
                      width: 4px;
                      height: 4px;
                      background: ${["#64b5f6", "#2196f3", "#1976d2"][Math.floor(Math.random() * 3)]};
                      border-radius: 50%;
                      pointer-events: none;
                      z-index: 999;
                  `;
                document.body.appendChild(particle);
                particles.push(particle);

                const delay = i * (1000 / particleCount);
                const particleAnimation = particle.animate(spiralKeyframes, {
                    duration: 1000,
                    delay: delay,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "forwards",
                });

                particleAnimation.onfinish = () => particle.remove();
            }

            // Animate the tile
            await new Promise((resolve) => {
                const animation = clone.animate(spiralKeyframes, {
                    duration: 1000,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "forwards",
                });

                animation.onfinish = () => {
                    clone.remove();
                    resolve();
                };
            });

            // Add portal pulse effect
            portal.classList.add("portal-pulse");
            setTimeout(() => {
                portal.classList.remove("portal-pulse");
            }, 500);

            // Small delay between tiles
            await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Short delay before showing new tiles
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Animate new tiles coming out
        for (let i = 0; i < this.aiRack.length; i++) {
            const newTile = document.createElement("div");
            newTile.className = "tile ai-tile";
            document.body.appendChild(newTile);

            const startX = portalRect.left + portalRect.width / 2;
            const startY = portalRect.top + portalRect.height / 2;
            const finalX = aiRackElement.offsetLeft + i * 50;
            const finalY = aiRackElement.offsetTop;

            const reverseSpiral = [{
                    transform: `translate(${startX}px, ${startY}px) scale(0) rotate(360deg)`,
                    opacity: 0,
                },
                {
                    transform: `translate(${finalX}px, ${finalY}px) scale(1) rotate(0deg)`,
                    opacity: 1,
                },
            ];

            await new Promise((resolve) => {
                const animation = newTile.animate(reverseSpiral, {
                    duration: 1000,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "forwards",
                });

                // Create emergence particles
                const particleCount = 5;
                for (let j = 0; j < particleCount; j++) {
                    const particle = document.createElement("div");
                    particle.className = "exchange-particle";
                    particle.style.cssText = `
                          position: fixed;
                          width: 4px;
                          height: 4px;
                          background: ${["#64b5f6", "#2196f3", "#1976d2"][Math.floor(Math.random() * 3)]};
                          border-radius: 50%;
                          pointer-events: none;
                          z-index: 999;
                      `;
                    document.body.appendChild(particle);

                    const angle = (j / particleCount) * Math.PI * 2;
                    const radius = 30;
                    const particleAnim = particle.animate(
                        [{
                                transform: `translate(${startX + Math.cos(angle) * radius}px, 
                                         ${startY + Math.sin(angle) * radius}px) scale(0)`,
                                opacity: 1,
                            },
                            {
                                transform: `translate(${startX + Math.cos(angle) * radius * 2}px, 
                                         ${startY + Math.sin(angle) * radius * 2}px) scale(1)`,
                                opacity: 0,
                            },
                        ], {
                            duration: 1000,
                            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                    );

                    particleAnim.onfinish = () => particle.remove();
                }

                animation.onfinish = () => {
                    newTile.remove();
                    resolve();
                };
            });

            // Small delay between new tiles
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        portal.classList.remove("active");
    }

    setupEventListeners() {
        // Initial highlight of valid placements
        this.highlightValidPlacements();
    
        // Update highlights when game state changes
        document.addEventListener("click", () => {
            this.highlightValidPlacements();
        });
    
        // Add exchange system setup
        this.setupExchangeSystem();
    
        // Play word button
        document.getElementById("play-word").addEventListener("click", () => this.playWord());
    
        // Shuffle rack button
        document.getElementById("shuffle-rack").addEventListener("click", async () => {
            const rack = document.getElementById("tile-rack");
            const tiles = [...rack.children];
    
            // Disable tile dragging during animation
            tiles.forEach((tile) => (tile.draggable = false));
    
            // Visual shuffle animation
            for (let i = 0; i < 5; i++) { // 5 visual shuffles
                await new Promise((resolve) => {
                    tiles.forEach((tile) => {
                        tile.style.transition = "transform 0.2s ease";
                        tile.style.transform = `translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 10 - 5}deg)`;
                    });
                    setTimeout(resolve, 200);
                });
            }
    
            // Reset positions with transition
            tiles.forEach((tile) => {
                tile.style.transform = "none";
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
                const newTiles = document.querySelectorAll("#tile-rack .tile");
                newTiles.forEach((tile) => (tile.draggable = true));
            }, 400);
        });
    
        // Skip turn button
        document.getElementById("skip-turn").addEventListener("click", () => {
            if (this.currentTurn === "player") {
                this.consecutiveSkips++;
                this.currentTurn = "ai";
                this.addToMoveHistory("Player", "SKIP", 0);
                this.updateGameState();
                this.highlightValidPlacements();
                if (!this.checkGameEnd()) {
                    this.aiTurn();
                }
            }
        });
    
        // Quit game button
        const quitButton = document.getElementById("quit-game");
        if (quitButton) {
            quitButton.addEventListener("click", () => {
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
                        player: "Player",
                        word: "QUIT",
                        score: 0,
                        timestamp: new Date(),
                    });
                    this.updateMoveHistory();
                }
    
                // Trigger game over animation
                this.announceWinner();
            });
        }
    
        // Print history button
        document.getElementById("print-history").addEventListener("click", async () => {
            const printWindow = window.open("", "_blank");
            const gameDate = new Date().toLocaleString();
    
            // Show loading message
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Puzzle Game History - ${gameDate}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #333; }
                            .move { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
                            .word-header { font-size: 1.2em; color: #2c3e50; margin-bottom: 10px; }
                            .definitions { margin-left: 20px; padding: 10px; border-left: 3px solid #3498db; }
                            .part-of-speech { color: #e67e22; font-style: italic; }
                            .scores { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                            .loading { text-align: center; padding: 20px; font-style: italic; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="loading">Loading definitions...</div>
                    </body>
                </html>
            `);
    
            // Gather all unique words from move history
            const uniqueWords = [...new Set(
                this.moveHistory
                    .map((move) => move.word)
                    .filter((word) => word !== "SKIP" && word !== "EXCHANGE" && word !== "QUIT")
            )];
    
            // Fetch definitions for all words
            const wordDefinitions = new Map();
            for (const word of uniqueWords) {
                const definitions = await this.getWordDefinition(word);
                if (definitions) {
                    wordDefinitions.set(word, definitions);
                }
            }
    
            // Generate and set the content
            const content = this.generatePrintContent(gameDate, wordDefinitions);
            printWindow.document.body.innerHTML = content;
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
    
        // Mobile notifications handling
        if (isMobileDevice()) {
            const notifications = document.querySelectorAll('.mobile-notice');
            notifications.forEach(notice => {
                let startX;
                let currentX;
                let isDragging = false;
    
                // Touch start handler
                notice.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                    currentX = startX;
                    isDragging = true;
                    notice.classList.add('swiping');
                }, { passive: true });
    
                // Touch move handler
                notice.addEventListener('touchmove', (e) => {
                    if (!isDragging) return;
                    currentX = e.touches[0].clientX;
                    const diff = currentX - startX;
                    if (diff > 0) { // Only allow right swipe
                        notice.style.transform = `translateX(${diff}px)`;
                    }
                }, { passive: true });
    
                // Touch end handler
                notice.addEventListener('touchend', () => {
                    if (!isDragging) return;
                    isDragging = false;
                    notice.classList.remove('swiping');
                    
                    if (currentX - startX > 100) { // Swipe threshold
                        notice.classList.add('removing');
                        setTimeout(() => notice.remove(), 300);
                    } else {
                        notice.style.transform = '';
                    }
                });
    
                // Double-tap to close
                let lastTap = 0;
                notice.addEventListener('touchend', (e) => {
                    const currentTime = new Date().getTime();
                    const tapLength = currentTime - lastTap;
                    if (tapLength < 500 && tapLength > 0) {
                        notice.classList.add('removing');
                        setTimeout(() => notice.remove(), 300);
                        e.preventDefault();
                    }
                    lastTap = currentTime;
                });
    
                // Make close button more reliable
                const closeButton = notice.querySelector('.notice-close');
                if (closeButton) {
                    closeButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        notice.classList.add('removing');
                        setTimeout(() => notice.remove(), 300);
                    });
    
                    closeButton.addEventListener('touchend', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        notice.classList.add('removing');
                        setTimeout(() => notice.remove(), 300);
                    });
                }
            });
        }
    }    
}

function preventScrolling(e) {
    e.preventDefault();
}

// Initialize game when document is loaded
document.addEventListener("DOMContentLoaded", () => {
    new ScrabbleGame();
});
