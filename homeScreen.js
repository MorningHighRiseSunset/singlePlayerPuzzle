document.addEventListener("DOMContentLoaded", () => {
    // Set chess theme for white background
    document.documentElement.setAttribute('data-theme', 'chess');
    
    // Play puzzle tile animation on mini board
    playPuzzleAnimation('PUZZLE');
    
    // Store selected language for multiplayer
    let selectedMultiplayerLanguage = 'english';
    
    // Screen navigation elements
    const mainMenu = document.getElementById('mainMenu');
    const languageScreen = document.getElementById('languageScreen');
    const lobbyScreen = document.getElementById('lobbyScreen');
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const multiplayerBtn = document.getElementById('multiplayerBtn');
    const backToMenuBtn = document.getElementById('backToMenuBtn');
    const backToMenuFromLobbyBtn = document.getElementById('backToMenuFromLobbyBtn');
    const createGameBtn = document.getElementById('createGameBtn');
    
    // Hide main menu initially, show after animation
    if (mainMenu) mainMenu.style.display = 'none';
    if (languageScreen) languageScreen.style.display = 'none';
    if (lobbyScreen) lobbyScreen.style.display = 'none';
    
    // Show main menu after animation completes (6 letters * 150ms each + 600ms animation + buffer)
    setTimeout(() => {
        if (mainMenu) mainMenu.style.display = 'flex';
    }, 1600); // Wait for animation to complete
    
    // Single Player button handler
    if (singlePlayerBtn) {
        singlePlayerBtn.addEventListener('click', function handleSinglePlayer() {
            // Track single player button click
            if (window.va) {
                window.va('event', { name: 'single_player_click', data: { type: 'mode_selection' } });
            }
            
            // Play puzzle animation
            playPuzzleAnimation('PUZZLE');
            
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'none';
                if (languageScreen) languageScreen.style.display = 'flex';
                if (lobbyScreen) lobbyScreen.style.display = 'none';
            }, 1600); // Wait for animation to complete (6 letters * 150ms + 600ms animation + buffer)
        });
    }
    
    // Multiplayer button handler
    if (multiplayerBtn) {
        multiplayerBtn.addEventListener('click', function handleMultiplayer() {
            // Track multiplayer button click
            if (window.va) {
                window.va('event', { name: 'multiplayer_click', data: { type: 'mode_selection' } });
            }
            
            // Play multiplayer animation
            playPuzzleAnimation('PLAYER VERSUS PLAYER');
            
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'none';
                if (languageScreen) languageScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'flex';
                // Add side-by-side layout class
                document.querySelector('.home-container').classList.add('lobby-layout');
                // Load active games (placeholder for now)
                loadActiveGames();
            }, 2800); // Wait for animation to complete (12 letters * 150ms + 600ms animation + buffer)
        });
    }
    
    // Back to menu from language screen
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function handleBackToMenu() {
            // Play puzzle animation when returning to menu
            playPuzzleAnimation('PUZZLE');
            
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'flex';
                if (languageScreen) languageScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'none';
            }, 1600); // Wait for animation to complete (6 letters * 150ms + 600ms animation + buffer)
        });
    }
    
    // Back to menu from lobby screen
    if (backToMenuFromLobbyBtn) {
        backToMenuFromLobbyBtn.addEventListener('click', function handleBackToMenuFromLobby() {
            // Play puzzle animation when returning to menu
            playPuzzleAnimation('PUZZLE');
            
            setTimeout(() => {
                // Remove side-by-side layout class
                document.querySelector('.home-container').classList.remove('lobby-layout');
                if (mainMenu) mainMenu.style.display = 'flex';
                if (languageScreen) languageScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'none';
            }, 1600); // Wait for animation to complete (6 letters * 150ms + 600ms animation + buffer)
        });
    }
    
    // Create game button handler
    if (createGameBtn) {
        createGameBtn.addEventListener('click', () => {
            // Track create game click
            if (window.va) {
                window.va('event', { name: 'create_game', data: { type: 'lobby_action', language: selectedMultiplayerLanguage } });
            }
            createNewGame(selectedMultiplayerLanguage);
        });
    }
    
    // Store active games locally (in a real app, this would be server-side)
    let activeGames = [];
    
    // Function to create a new game
    function createNewGame(language = 'english') {
        // Generate a unique game ID
        const gameId = 'GAME-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Generate a random game name
        const gameNames = ['Puzzle Masters', 'Word Warriors', 'Scrabble Stars', 'Tile Titans', 'Board Bosses'];
        const randomName = gameNames[Math.floor(Math.random() * gameNames.length)];
        
        // Create game object
        const newGame = {
            id: gameId,
            name: randomName + ' ' + Math.floor(Math.random() * 1000),
            players: 1, // Creator is the first player
            maxPlayers: 2,
            status: 'waiting',
            language: language,
            createdAt: new Date()
        };
        
        // Add to active games
        activeGames.push(newGame);
        
        // Navigate to the specific game lobby
        showGameLobby(newGame);
    }
    
    // Function to show specific game lobby
    function showGameLobby(game) {
        // Hide lobby screen and show game lobby
        if (lobbyScreen) lobbyScreen.style.display = 'none';
        
        // Remove side-by-side layout for game lobby
        document.querySelector('.home-container').classList.remove('lobby-layout');
        
        // Create or update game lobby screen
        let gameLobbyScreen = document.getElementById('gameLobbyScreen');
        if (!gameLobbyScreen) {
            gameLobbyScreen = document.createElement('div');
            gameLobbyScreen.id = 'gameLobbyScreen';
            gameLobbyScreen.className = 'game-lobby-container';
            document.querySelector('.home-container').appendChild(gameLobbyScreen);
        }
        
        gameLobbyScreen.innerHTML = `
            <button class="back-btn" id="backToLobbyBtn">← Back to Lobby</button>
            <h2>Game Lobby</h2>
            <div class="game-lobby-info">
                <div class="lobby-game-name">${game.name}</div>
                <div class="lobby-game-id">Game ID: ${game.id}</div>
                <div class="lobby-players">
                    <div class="player-slot">
                        <span class="player-avatar">👤</span>
                        <span class="player-name">You (Host)</span>
                    </div>
                    <div class="player-slot empty">
                        <span class="player-avatar">➕</span>
                        <span class="player-name">Waiting for player...</span>
                    </div>
                </div>
                <div class="lobby-status">Status: ${game.status}</div>
                <button class="start-game-btn" id="startGameBtn" ${game.players < game.maxPlayers ? 'disabled' : ''}>
                    ${game.players < game.maxPlayers ? 'Waiting for players...' : 'Start Game'}
                </button>
            </div>
        `;
        
        gameLobbyScreen.style.display = 'flex';
        
        // Add event listeners with setTimeout to ensure DOM is updated
        setTimeout(() => {
            const backToLobbyBtn = document.getElementById('backToLobbyBtn');
            const startGameBtn = document.getElementById('startGameBtn');
            
            if (backToLobbyBtn) {
                backToLobbyBtn.onclick = () => {
                    gameLobbyScreen.style.display = 'none';
                    // Play player versus player animation when returning to lobby
                    playPuzzleAnimation('PLAYER VERSUS PLAYER');
                    setTimeout(() => {
                        // Restore side-by-side layout
                        document.querySelector('.home-container').classList.add('lobby-layout');
                        if (lobbyScreen) lobbyScreen.style.display = 'flex';
                        updateGamesList();
                    }, 2800); // Wait for animation to complete (12 letters * 150ms + 600ms animation + buffer)
                };
            }
            
            if (startGameBtn && !startGameBtn.disabled) {
                startGameBtn.onclick = () => {
                    // Track start game click
                    if (window.va) {
                        window.va('event', { name: 'start_game', data: { type: 'game_action', gameId: game.id, language: game.language } });
                    }
                    alert('Starting game! (This would navigate to the actual game page)');
                };
            }
        }, 0);
    }
    
    // Function to update the games list display
    function updateGamesList() {
        const gamesList = document.getElementById('gamesList');
        if (!gamesList) return;
        
        if (activeGames.length === 0) {
            gamesList.innerHTML = '<p class="no-games-message">No active games available</p>';
            return;
        }
        
        // Clear current list
        gamesList.innerHTML = '';
        
        // Add each game to the list
        activeGames.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.className = 'game-item';
            
            const gameInfo = document.createElement('div');
            gameInfo.className = 'game-info';
            
            const gameName = document.createElement('div');
            gameName.className = 'game-name';
            gameName.textContent = game.name;
            
            const gameDetails = document.createElement('div');
            gameDetails.className = 'game-details';
            gameDetails.textContent = `${game.players}/${game.maxPlayers} players • ${game.language} • ${game.status}`;
            
            gameInfo.appendChild(gameName);
            gameInfo.appendChild(gameDetails);
            
            const joinBtn = document.createElement('button');
            joinBtn.className = 'join-game-btn';
            joinBtn.textContent = 'Join';
            joinBtn.addEventListener('click', () => {
                // Track join game click
                if (window.va) {
                    window.va('event', { name: 'join_game', data: { type: 'lobby_action', gameId: game.id, language: game.language } });
                }
                joinGame(game.id);
            });
            
            gameItem.appendChild(gameInfo);
            gameItem.appendChild(joinBtn);
            
            gamesList.appendChild(gameItem);
        });
    }
    
    // Function to join a game (placeholder)
    function joinGame(gameId) {
        const game = activeGames.find(g => g.id === gameId);
        if (game) {
            if (game.players < game.maxPlayers) {
                game.players++;
                game.status = 'in progress';
                updateGamesList();
                alert(`Joined game "${game.name}"!`);
                // In a real app, this would navigate to the game page
            } else {
                alert('This game is full!');
            }
        }
    }
    
    // Function to load active games (placeholder)
    function loadActiveGames() {
        // In a real app, this would fetch from a server
        // For now, we'll use the local activeGames array
        updateGamesList();
    }
    
    // Language button tracking with Vercel Analytics
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const language = button.getAttribute('data-language');
            const href = button.getAttribute('data-href');
            const isMultiplayer = button.classList.contains('multiplayer-lang-btn');
            
            console.log('Language button clicked:', language);
            console.log('Language value:', language);
            console.log('window.va available:', typeof window.va);
            
            // Track language button click event using Vercel Analytics
            if (window.va) {
                const eventName = isMultiplayer ? `multiplayer_${language}` : `single_player_${language}`;
                console.log('Sending event to Vercel Analytics:', eventName);
                window.va('event', { name: eventName, data: { type: 'language_selection' } });
                
                if (isMultiplayer) {
                    selectedMultiplayerLanguage = language;
                }
            } else {
                console.log('window.va not available');
            }
            
            // Only navigate for single player language buttons
            if (!isMultiplayer && href) {
                window.location.href = href;
            }
        });
    });
    
    // Start Game button handler
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            window.location.href = 'game.html';
        });
    }
    
    // Add sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page === 'how-to-play') {
                window.location.href = 'how-to-play.html';
            } else if (page === 'how-to-play-friend') {
                window.location.href = 'how-to-play-friend.html';
            }
        });
    });
    
    // Create 15x15 board using exact game logic
    const board = document.getElementById('scrabble-board');
    if (board) {
        const premiumSquares = getPremiumSquares();

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

                const key = `${i},${j}`;
                if (premiumSquares[key]) {
                    cell.classList.add(premiumSquares[key]);
                }

                board.appendChild(cell);
            }
        }

        // Add "join now" tiles to the board
        // Place "join" at row 6, cols 5-8 (J at 6,5; O at 6,6; I at 6,7; N at 6,8)
        // Place "now" at row 7, cols 7-9 (N at 7,7; O at 7,8; W at 7,9)
        const tiles = [
            { letter: 'J', row: 6, col: 5 },
            { letter: 'O', row: 6, col: 6 },
            { letter: 'I', row: 6, col: 7 },
            { letter: 'N', row: 6, col: 8 },
            { letter: 'N', row: 7, col: 7 },
            { letter: 'O', row: 7, col: 8 },
            { letter: 'W', row: 7, col: 9 }
        ];

        tiles.forEach(tile => {
            const cellIndex = tile.row * 15 + tile.col;
            const cell = board.children[cellIndex];
            if (cell) {
                const tileDiv = document.createElement('div');
                tileDiv.className = 'tile';
                tileDiv.textContent = tile.letter;
                cell.appendChild(tileDiv);
            }
        });
    }
});

function getPremiumSquares() {
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

    // Triple Word Scores (pink squares)
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
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "tw"));

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

    // Triple Letter Scores (light blue squares)
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
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "tl"));

    return premium;
}

// Function to play puzzle tile animation on mini board
function playPuzzleAnimation(word = 'PUZZLE') {
    const miniBoard = document.querySelector('.mini-scrabble-board');
    if (!miniBoard) return;
    
    const miniRows = miniBoard.querySelectorAll('.mini-row');
    if (miniRows.length === 0) return;
    
    // Clear any existing tiles on the mini board
    miniBoard.querySelectorAll('.mini-tile').forEach(tile => tile.remove());
    
    // Define word positions on the 9x9 mini board (center row is row 4)
    const wordLayouts = {
        'PUZZLE': [
            { letter: 'P', row: 4, col: 2 },
            { letter: 'U', row: 4, col: 3 },
            { letter: 'Z', row: 4, col: 4 },
            { letter: 'Z', row: 4, col: 5 },
            { letter: 'L', row: 4, col: 6 },
            { letter: 'E', row: 4, col: 7 }
        ],
        'PLAYER VERSUS PLAYER': [
            // VERSUS (vertical)
            { letter: 'V', row: 0, col: 4 },
            { letter: 'E', row: 1, col: 4 },
            { letter: 'R', row: 2, col: 4 },
            { letter: 'S', row: 3, col: 4 },
            { letter: 'U', row: 4, col: 4 },
            { letter: 'S', row: 5, col: 4 },
            // PLAYER (intersects with VERSUS at R)
            { letter: 'P', row: 2, col: 2 },
            { letter: 'L', row: 2, col: 3 },
            { letter: 'A', row: 2, col: 4 },
            { letter: 'Y', row: 2, col: 5 },
            { letter: 'E', row: 2, col: 6 },
            { letter: 'R', row: 2, col: 7 }
        ],
        'BATTLE': [
            { letter: 'B', row: 4, col: 1 },
            { letter: 'A', row: 4, col: 2 },
            { letter: 'T', row: 4, col: 3 },
            { letter: 'T', row: 4, col: 4 },
            { letter: 'L', row: 4, col: 5 },
            { letter: 'E', row: 4, col: 6 }
        ],
        'DUEL': [
            { letter: 'D', row: 4, col: 3 },
            { letter: 'U', row: 4, col: 4 },
            { letter: 'E', row: 4, col: 5 },
            { letter: 'L', row: 4, col: 6 }
        ]
    };
    
    const puzzleLetters = wordLayouts[word] || wordLayouts['PUZZLE'];
    
    // Get cell size from the first cell to match responsive sizing
    const firstCell = miniBoard.querySelector('.mini-cell');
    const cellSize = firstCell ? firstCell.offsetWidth : 32;
    // Make tiles even smaller for larger crossword layout
    const tileSize = Math.max(cellSize - 14, 18); // Even smaller for larger crossword
    
    // Calculate delays based on word length for consistent timing
    const baseDelay = 150; // Adjusted delay for 12 letters
    const lettersToAnimate = puzzleLetters.filter(letter => letter.letter !== ' ');
    const animationDelays = lettersToAnimate.map((_, index) => index * baseDelay);
    
    // Add delays to each letter (skip spaces)
    let delayIndex = 0;
    const lettersWithDelays = puzzleLetters.map((letter) => {
        if (letter.letter === ' ') {
            return { ...letter, delay: 0 };
        }
        return { ...letter, delay: animationDelays[delayIndex++] };
    });
    
    // Shuffle the animation order for more interesting effect
    const shuffledLetters = [...lettersWithDelays].sort(() => Math.random() - 0.5);
    
    // Animate each letter appearing with staggered timing
    shuffledLetters.forEach((tile) => {
        setTimeout(() => {
            const row = miniRows[tile.row];
            if (row) {
                const cells = row.querySelectorAll('.mini-cell');
                const cell = cells[tile.col];
                if (cell) {
                    // Skip if letter is a space
                    if (tile.letter === ' ') return;
                    
                    const tileDiv = document.createElement('div');
                    tileDiv.className = 'mini-tile animating';
                    tileDiv.textContent = tile.letter;
                    tileDiv.style.cssText = `
                        position: absolute;
                        background: linear-gradient(145deg, #42a5f5, #1976d2);
                        color: white;
                        width: ${tileSize}px;
                        height: ${tileSize}px;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: ${tileSize * 0.5}px;
                        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.5), 0 0 20px rgba(66, 165, 245, 0.3);
                        z-index: 10;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%) scale(0) rotate(-180deg);
                        opacity: 0;
                    `;
                    cell.style.position = 'relative';
                    cell.appendChild(tileDiv);
                    
                    // Trigger animation after a small delay
                    requestAnimationFrame(() => {
                        setTimeout(() => {
                            tileDiv.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
                            tileDiv.style.opacity = '1';
                            
                            // Remove animating class after animation completes to enable hover effects
                            setTimeout(() => {
                                tileDiv.classList.remove('animating');
                            }, 600);
                        }, 50);
                    });
                }
            }
        }, tile.delay);
    });
}
