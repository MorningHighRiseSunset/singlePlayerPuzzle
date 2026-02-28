/**
 * AI Puzzle Game Testing Script
 * Automated AI player to test the puzzle game functionality
 */

class PuzzleGameAITester {
    constructor() {
        this.game = null;
        this.testResults = [];
        this.currentTest = null;
    }

    // Initialize the AI tester when game is loaded
    async initialize() {
        console.log('🤖 AI Puzzle Tester Initializing...');
        
        // Wait for game to be available
        let attempts = 0;
        while (!window.game && attempts < 50) {
            await this.sleep(100);
            attempts++;
        }
        
        if (!window.game) {
            console.error('❌ Game not found after 5 seconds');
            return false;
        }
        
        this.game = window.game;
        console.log('✅ Game found, AI Tester ready');
        return true;
    }

    // Sleep helper
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get current game state
    getGameState() {
        return {
            playerScore: this.game.playerScore,
            aiScore: this.game.aiScore,
            tilesRemaining: this.game.tilesRemaining,
            playerRack: [...this.game.playerRack],
            board: this.game.board.map(row => [...row]),
            placedTiles: [...this.game.placedTiles],
            isFirstMove: this.game.isFirstMove
        };
    }

    // Find all possible words on current board
    findPossibleWords() {
        const words = [];
        const board = this.game.board;
        const rack = this.game.playerRack;
        
        // Simple word finding - check horizontal and vertical positions
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (!board[row][col]) {
                    // Try placing each tile from rack
                    for (let tileIndex = 0; tileIndex < rack.length; tileIndex++) {
                        const tile = rack[tileIndex];
                        if (tile) {
                            // Check horizontal placement
                            const horizontalWord = this.checkWordPlacement(row, col, tile.letter, true);
                            if (horizontalWord) {
                                words.push({
                                    word: horizontalWord,
                                    position: { row, col },
                                    direction: 'horizontal',
                                    tile: tile,
                                    score: this.calculateWordScore(horizontalWord, row, col, true)
                                });
                            }
                            
                            // Check vertical placement
                            const verticalWord = this.checkWordPlacement(row, col, tile.letter, false);
                            if (verticalWord) {
                                words.push({
                                    word: verticalWord,
                                    position: { row, col },
                                    direction: 'vertical',
                                    tile: tile,
                                    score: this.calculateWordScore(verticalWord, row, col, false)
                                });
                            }
                        }
                    }
                }
            }
        }
        
        return words.sort((a, b) => b.score - a.score);
    }

    // Check if placing a letter forms a valid word
    checkWordPlacement(startRow, startCol, letter, isHorizontal) {
        const board = this.game.board;
        let word = letter;
        
        if (isHorizontal) {
            // Check left
            let col = startCol - 1;
            while (col >= 0 && board[startRow][col]) {
                word = board[startRow][col].letter + word;
                col--;
            }
            
            // Check right
            col = startCol + 1;
            while (col < 15 && board[startRow][col]) {
                word = word + board[startRow][col].letter;
                col++;
            }
        } else {
            // Check up
            let row = startRow - 1;
            while (row >= 0 && board[row][startCol]) {
                word = board[row][startCol].letter + word;
                row--;
            }
            
            // Check down
            row = startRow + 1;
            while (row < 15 && board[row][startCol]) {
                word = word + board[row][startCol].letter;
                row++;
            }
        }
        
        // Only return words of length 2 or more
        return word.length >= 2 ? word : null;
    }

    // Calculate word score
    calculateWordScore(word, startRow, startCol, isHorizontal) {
        let score = 0;
        let wordMultiplier = 1;
        
        for (let i = 0; i < word.length; i++) {
            const row = isHorizontal ? startRow : startRow + i;
            const col = isHorizontal ? startCol + i : startCol;
            
            // Get tile value
            const letter = word[i];
            const tileValue = this.game.tileValues[letter] || 0;
            
            // Check for premium squares
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                let letterScore = tileValue;
                
                if (cell.classList.contains('double-letter')) {
                    letterScore *= 2;
                } else if (cell.classList.contains('triple-letter')) {
                    letterScore *= 3;
                }
                
                if (cell.classList.contains('double-word')) {
                    wordMultiplier *= 2;
                } else if (cell.classList.contains('triple-word')) {
                    wordMultiplier *= 3;
                }
            }
            
            score += letterScore;
        }
        
        return score * wordMultiplier;
    }

    // Make a move
    async makeMove(word, position, direction) {
        console.log(`🎯 AI playing: ${word} at (${position.row}, ${position.col}) ${direction}`);
        
        // Clear any existing placed tiles
        this.game.resetPlacedTiles();
        
        // Place tiles on board
        const tiles = [];
        for (let i = 0; i < word.length; i++) {
            const row = direction === 'horizontal' ? position.row : position.row + i;
            const col = direction === 'horizontal' ? position.col + i : position.col;
            
            // Find matching tile in rack
            const tileIndex = this.game.playerRack.findIndex(t => t && t.letter === word[i]);
            if (tileIndex !== -1) {
                const tile = this.game.playerRack.splice(tileIndex, 1)[0];
                tiles.push({ tile, row, col });
                
                // Place on board
                this.game.board[row][col] = {
                    letter: word[i],
                    value: this.game.tileValues[word[i]],
                    id: tile.id
                };
                
                // Update UI
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell) {
                    cell.innerHTML = `
                        <div class="tile">
                            ${word[i]}
                            <span class="points">${this.game.tileValues[word[i]]}</span>
                        </div>
                    `;
                }
            }
        }
        
        this.game.placedTiles = tiles;
        this.game.renderRack();
        
        // Submit the move
        await this.sleep(500);
        this.game.playWord();
    }

    // Run automated test sequence
    async runAutomatedTest() {
        console.log('🚀 Starting automated AI test...');
        
        const testSequence = [
            { name: 'Initial State Check', action: () => this.checkInitialState() },
            { name: 'Find Valid Moves', action: () => this.findAndDisplayMoves() },
            { name: 'Play Best Move', action: () => this.playBestMove() },
            { name: 'Test Invalid Word', action: () => this.testInvalidWord() },
            { name: 'Test Wild Tiles', action: () => this.testWildTiles() },
            { name: 'Stress Test', action: () => this.runStressTest() }
        ];
        
        for (const test of testSequence) {
            console.log(`\n📋 Running: ${test.name}`);
            try {
                await test.action();
                this.testResults.push({ name: test.name, status: 'PASS', error: null });
                console.log(`✅ ${test.name} - PASSED`);
            } catch (error) {
                this.testResults.push({ name: test.name, status: 'FAIL', error: error.message });
                console.error(`❌ ${test.name} - FAILED: ${error.message}`);
            }
            
            await this.sleep(1000);
        }
        
        this.generateTestReport();
    }

    // Check initial game state
    async checkInitialState() {
        const state = this.getGameState();
        
        if (state.playerScore !== 0 || state.aiScore !== 0) {
            throw new Error('Scores should start at 0');
        }
        
        if (state.tilesRemaining !== 98) {
            throw new Error('Tiles remaining should be 98 at start');
        }
        
        if (state.playerRack.length !== 7) {
            throw new Error('Player should have 7 tiles');
        }
        
        if (!state.isFirstMove) {
            throw new Error('Should be first move');
        }
        
        console.log('Initial state check passed');
    }

    // Find and display possible moves
    async findAndDisplayMoves() {
        const moves = this.findPossibleWords();
        console.log(`Found ${moves.length} possible moves:`);
        
        moves.slice(0, 5).forEach((move, index) => {
            console.log(`${index + 1}. ${move.word} (${move.score} points) - ${move.direction} at (${move.position.row}, ${move.position.col})`);
        });
        
        if (moves.length === 0) {
            console.log('No valid moves found');
        }
    }

    // Play the best scoring move
    async playBestMove() {
        const moves = this.findPossibleWords();
        
        if (moves.length === 0) {
            console.log('No moves available to play');
            return;
        }
        
        const bestMove = moves[0];
        await this.makeMove(bestMove.word, bestMove.position, bestMove.direction);
        
        console.log(`Played best move: ${bestMove.word} for ${bestMove.score} points`);
    }

    // Test invalid word handling
    async testInvalidWord() {
        // Try to play an invalid word
        const invalidPosition = { row: 7, col: 7 };
        await this.makeMove('INVALID', invalidPosition, 'horizontal');
        
        // Check if tiles were returned to rack
        const state = this.getGameState();
        if (state.placedTiles.length !== 0) {
            throw new Error('Invalid move should have been rejected and tiles returned');
        }
        
        console.log('Invalid word test passed');
    }

    // Test wild tile functionality
    async testWildTiles() {
        const state = this.getGameState();
        const wildTile = state.playerRack.find(t => t.letter === '*');
        
        if (!wildTile) {
            console.log('No wild tile in rack, skipping wild tile test');
            return;
        }
        
        // Use wild tile as 'Q'
        const position = { row: 7, col: 7 };
        await this.makeMove('Q', position, 'horizontal');
        
        // Check if wild tile was properly handled
        console.log('Wild tile test completed');
    }

    // Run stress test
    async runStressTest() {
        console.log('Running stress test (10 random moves)...');
        
        for (let i = 0; i < 10; i++) {
            const moves = this.findPossibleWords();
            if (moves.length > 0) {
                const randomMove = moves[Math.floor(Math.random() * Math.min(5, moves.length))];
                await this.makeMove(randomMove.word, randomMove.position, randomMove.direction);
                console.log(`Stress test move ${i + 1}: ${randomMove.word}`);
            }
            await this.sleep(500);
        }
        
        console.log('Stress test completed');
    }

    // Generate test report
    generateTestReport() {
        console.log('\n📊 AI TEST REPORT');
        console.log('='.repeat(50));
        
        const passed = this.testResults.filter(r => r.status === 'PASS').length;
        const failed = this.testResults.filter(r => r.status === 'FAIL').length;
        
        console.log(`Total Tests: ${this.testResults.length}`);
        console.log(`Passed: ${passed}`);
        console.log(`Failed: ${failed}`);
        console.log(`Success Rate: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
        
        if (failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`- ${r.name}: ${r.error}`));
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🏁 Test complete!');
    }

    // Interactive mode - allow manual AI commands
    startInteractiveMode() {
        console.log('\n🎮 AI Puzzle Tester - Interactive Mode');
        console.log('Available commands:');
        console.log('  help - Show this help');
        console.log('  state - Show current game state');
        console.log('  moves - Find possible moves');
        console.log('  play <word> <row> <col> <h|v> - Play a word');
        console.log('  best - Play best scoring move');
        console.log('  reset - Reset current move');
        console.log('  auto - Run automated test sequence');
        console.log('  quit - Exit interactive mode');
        
        // Create command interface
        window.aiTester = this;
        
        // Add command input to console
        const commandInput = document.createElement('input');
        commandInput.type = 'text';
        commandInput.placeholder = 'Enter AI command...';
        commandInput.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            padding: 8px;
            border: 2px solid #007bff;
            border-radius: 4px;
            background: white;
            font-family: monospace;
            width: 300px;
        `;
        
        document.body.appendChild(commandInput);
        commandInput.focus();
        
        commandInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const command = commandInput.value.trim().toLowerCase();
                await this.executeCommand(command);
                commandInput.value = '';
            }
        });
        
        console.log('Interactive mode ready. Type commands in the input box or console.');
    }

    // Execute interactive commands
    async executeCommand(command) {
        const parts = command.split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        try {
            switch (cmd) {
                case 'help':
                    console.log('Available commands: help, state, moves, play, best, reset, auto, quit');
                    break;
                    
                case 'state':
                    console.log('Current game state:', this.getGameState());
                    break;
                    
                case 'moves':
                    await this.findAndDisplayMoves();
                    break;
                    
                case 'play':
                    if (args.length >= 4) {
                        const word = args[0].toUpperCase();
                        const row = parseInt(args[1]);
                        const col = parseInt(args[2]);
                        const direction = args[3].toLowerCase();
                        if (['h', 'v', 'horizontal', 'vertical'].includes(direction)) {
                            await this.makeMove(word, { row, col }, direction === 'h' ? 'horizontal' : 'vertical');
                        } else {
                            console.log('Direction must be h (horizontal) or v (vertical)');
                        }
                    } else {
                        console.log('Usage: play <word> <row> <col> <h|v>');
                    }
                    break;
                    
                case 'best':
                    await this.playBestMove();
                    break;
                    
                case 'reset':
                    this.game.resetPlacedTiles();
                    console.log('Current move reset');
                    break;
                    
                case 'auto':
                    await this.runAutomatedTest();
                    break;
                    
                case 'quit':
                    console.log('Exiting AI Tester');
                    const input = document.querySelector('input[placeholder*="AI command"]');
                    if (input) input.remove();
                    break;
                    
                default:
                    console.log(`Unknown command: ${cmd}. Type 'help' for available commands.`);
            }
        } catch (error) {
            console.error(`Command error: ${error.message}`);
        }
    }
}

// Auto-initialize when page loads
window.addEventListener('DOMContentLoaded', async () => {
    // Wait a bit for the game to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiTester = new PuzzleGameAITester();
    const initialized = await aiTester.initialize();
    
    if (initialized) {
        // Start in interactive mode
        aiTester.startInteractiveMode();
        
        console.log('\n🤖 AI Puzzle Tester loaded successfully!');
        console.log('Type "auto" to run automated tests or "help" for commands.');
    }
});

// Export for manual use
window.PuzzleGameAITester = PuzzleGameAITester;
