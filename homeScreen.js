document.addEventListener("DOMContentLoaded", () => {
    // Set chess theme for white background
    document.documentElement.setAttribute('data-theme', 'chess');
    
    // Play puzzle animation on load
    playPuzzleAnimation('PUZZLE');
    
    // Multiplayer is English only
    const selectedMultiplayerLanguage = 'english';
    
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
    
    // Initialize Pusher for real-time multiplayer
    let pusher = null;
    let currentChannel = null;
    let currentGame = null;
    
    // Initialize Pusher when needed
    function initPusher() {
        if (pusher) return pusher;
        
        try {
            pusher = new Pusher('6d8cbaf0731b74524092', {
                cluster: 'us3',
                forceTLS: true
            });
            
            // Log connection state
            pusher.connection.bind('connected', () => {
                console.log('PUSHER: Connected successfully');
            });
            
            pusher.connection.bind('disconnected', () => {
                console.log('PUSHER: Disconnected');
            });
            
            pusher.connection.bind('error', (err) => {
                console.log('PUSHER: Connection error:', err);
            });
            
            console.log('Pusher initialized successfully');
            return pusher;
        } catch (e) {
            console.log('Pusher initialization failed:', e);
            return null;
        }
    }
    
    // Show main menu after animation completes (6 letters * 150ms each + 600ms animation + buffer)
    setTimeout(() => {
        if (mainMenu) mainMenu.style.display = 'flex';
    }, 1600); // Wait for animation to complete
    
    // Single Player button handler
    if (singlePlayerBtn) {
        singlePlayerBtn.addEventListener('click', function handleSinglePlayer() {
            // Track single player button click
            if (window.va) {
                window.va('event', { name: 'button_click', data: { action: 'single_player' } });
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
            
            // Initialize Pusher and subscribe to lobby channel
            const pusherInstance = initPusher();
            if (pusherInstance) {
                const lobbyChannel = pusherInstance.subscribe('lobby');
                
                // Listen for new games being created
                lobbyChannel.bind('client-game-created', (data) => {
                    console.log('New game created via Pusher:', data.game);
                    // Add to active games if not already present
                    if (!activeGames.find(g => g.id === data.game.id)) {
                        activeGames.push(data.game);
                        saveGamesToStorage();
                        updateGamesList();
                    }
                });
                
                console.log('Subscribed to lobby channel for real-time game updates');
            }
            
            // Play multiplayer animation
            playPuzzleAnimation('PLAYER VERSUS PLAYER');
            
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'flex';
                // Hide mini board in lobby
                const miniBoardContainer = document.querySelector('.mini-board-container');
                if (miniBoardContainer) miniBoardContainer.style.display = 'none';
                // Load active games (placeholder for now)
                loadActiveGames();
            }, 2800); // Wait for animation to complete (12 letters * 150ms + 600ms animation + buffer)
        });
    }
    
    // Back to menu from language screen
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', function handleBackToMenu() {
            // Show mini board when returning to menu
            const miniBoardContainer = document.querySelector('.mini-board-container');
            if (miniBoardContainer) miniBoardContainer.style.display = 'flex';
            
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'flex';
                if (languageScreen) languageScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'none';
            }, 200); // Quick transition without animation
        });
    }
    
    // Back to menu from lobby screen
    if (backToMenuFromLobbyBtn) {
        backToMenuFromLobbyBtn.addEventListener('click', function handleBackToMenuFromLobby() {
            // Show mini board when returning to menu
            const miniBoardContainer = document.querySelector('.mini-board-container');
            if (miniBoardContainer) miniBoardContainer.style.display = 'flex';
            
            setTimeout(() => {
                if (mainMenu) mainMenu.style.display = 'flex';
                if (languageScreen) languageScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'none';
            }, 200); // Quick transition without animation
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
    
    // Store active games in localStorage for cross-tab persistence
    let activeGames = [];
    let currentPlayerId = null;
    
    // Generate or get player ID
    function getPlayerId() {
        if (!currentPlayerId) {
            currentPlayerId = generatePlayerId();
            console.log('Generated new player ID (no storage):', currentPlayerId);
        }
        return currentPlayerId;
    }
    
    // Load games from localStorage on page load
    function loadGamesFromStorage() {
        try {
            const storedGames = localStorage.getItem('multiplayerGames');
            if (storedGames) {
                activeGames = JSON.parse(storedGames);
                // Filter out games older than 5 minutes
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                activeGames = activeGames.filter(game => new Date(game.createdAt) > fiveMinutesAgo);
                saveGamesToStorage();
            }
        } catch (e) {
            console.log('Error loading games from storage:', e);
        }
    }
    
    // Save games to localStorage
    function saveGamesToStorage() {
        try {
            localStorage.setItem('multiplayerGames', JSON.stringify(activeGames));
        } catch (e) {
            console.log('Error saving games to storage:', e);
        }
    }
    
    // Load games on page load
    loadGamesFromStorage();
    getPlayerId();
    
    // Function to create a new game
    function createNewGame(language = 'english') {
        // Generate a unique game ID
        const gameId = 'GAME-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Initialize Pusher
        const pusherInstance = initPusher();
        
        const hostPlayerId = getPlayerId();
        
        console.log('=== CREATE NEW GAME ===');
        console.log('Game ID:', gameId);
        console.log('Host Player ID:', hostPlayerId);
        console.log('Language:', language);
        
        // Create game object
        const newGame = {
            id: gameId,
            name: 'Puzzle Game',
            players: 1, // Creator is the first player
            maxPlayers: 2,
            status: 'waiting',
            language: language,
            createdAt: new Date(),
            hostId: hostPlayerId,
            playerIds: [hostPlayerId]
        };
        
        currentGame = newGame;
        
        // Always save to localStorage for local tab sync (works even without Pusher)
        activeGames.push(newGame);
        saveGamesToStorage();
        
        if (pusherInstance) {
            // Subscribe to game channel for real-time updates
            const channelName = `game-${gameId}`;
            currentChannel = pusherInstance.subscribe(channelName);
            
            // Listen for player join events
            currentChannel.bind('client-player-joined', (data) => {
                console.log('=== PUSHER EVENT: player-joined ===');
                console.log('Received data:', data);
                console.log('Current Game ID:', currentGame?.id);
                console.log('Current Player ID:', getPlayerId());
                if (currentGame) {
                    currentGame.players = data.players;
                    currentGame.playerIds = data.playerIds;
                    console.log('Updated game players:', currentGame.players);
                    console.log('Updated game player IDs:', currentGame.playerIds);
                    // Update the game in activeGames array
                    const gameIndex = activeGames.findIndex(g => g.id === currentGame.id);
                    if (gameIndex !== -1) {
                        activeGames[gameIndex] = currentGame;
                    }
                    saveGamesToStorage();
                    updateGameLobbyUI(currentGame);
                }
            });
            
            // Listen for game start events
            currentChannel.bind('client-game-started', (data) => {
                console.log('Game started by host');
                navigateToGame(currentGame.language);
            });
            
            // Announce game creation to a lobby channel
            const lobbyChannel = pusherInstance.subscribe('lobby');
            lobbyChannel.trigger('client-game-created', {
                game: newGame
            });
            
            console.log('Game created with Pusher real-time sync');
        }
        
        // Navigate to the specific game lobby
        showGameLobby(newGame);
    }
    
    // Generate a simple player ID
    function generatePlayerId() {
        return 'PLAYER-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    // Function to show specific game lobby
    function showGameLobby(game) {
        // Hide lobby screen and show game lobby
        if (lobbyScreen) lobbyScreen.style.display = 'none';
        
        // Remove side-by-side layout for game lobby
        document.querySelector('.home-container').classList.remove('lobby-layout');
        
        // Hide main menu and mini board for game lobby
        if (mainMenu) mainMenu.style.display = 'none';
        const miniBoardContainer = document.querySelector('.mini-board-container');
        if (miniBoardContainer) miniBoardContainer.style.display = 'none';
        
        // Check if current player is the host
        const currentPlayerId = getPlayerId();
        const isHost = game.hostId === currentPlayerId;
        
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
            <h2>Puzzle Game Queue</h2>
            <div class="game-lobby-info">
                <div class="lobby-game-language">Language: ${game.language.toUpperCase()}</div>
                <div class="lobby-countdown" id="lobbyCountdown">Expires in 5:00</div>
                <div class="lobby-players">
                    <div class="player-slot">
                        <span class="player-avatar">👤</span>
                        <span class="player-name">${isHost ? 'You (Host)' : 'Host'}</span>
                    </div>
                    <div class="player-slot ${game.players < 2 ? 'empty' : ''}">
                        <span class="player-avatar">${game.players < 2 ? '➕' : '👤'}</span>
                        <span class="player-name">${game.players < 2 ? 'Waiting for player...' : (isHost ? 'Player 2' : 'You')}</span>
                    </div>
                </div>
                <div class="lobby-status">Status: ${game.status}</div>
                <button class="start-game-btn" id="startGameBtn" ${!isHost || game.players < game.maxPlayers ? 'disabled' : ''}>
                    ${!isHost ? 'Waiting for host to start...' : game.players < game.maxPlayers ? 'Waiting for players...' : 'Start Puzzle Game'}
                </button>
            </div>
        `;
        
        console.log('=== GAME LOBBY (showGameLobby) ===');
        console.log('Game ID:', game.id);
        console.log('Current Player ID:', currentPlayerId);
        console.log('Host ID:', game.hostId);
        console.log('Is Host:', isHost);
        console.log('Players:', game.players);
        console.log('Player IDs:', game.playerIds);
        
        gameLobbyScreen.style.display = 'flex';
        
        // Start countdown timer
        const countdownElement = document.getElementById('lobbyCountdown');
        if (countdownElement && window.lobbyCountdownInterval) {
            clearInterval(window.lobbyCountdownInterval);
        }
        
        const gameCreatedAt = new Date(game.createdAt);
        const expiryTime = new Date(gameCreatedAt.getTime() + 5 * 60 * 1000); // 5 minutes
        
        window.lobbyCountdownInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = expiryTime - now;
            
            if (timeLeft <= 0) {
                clearInterval(window.lobbyCountdownInterval);
                countdownElement.textContent = 'Expired';
                countdownElement.style.color = '#ff6b6b';
                
                // Remove game and redirect to lobby
                activeGames = activeGames.filter(g => g.id !== game.id);
                saveGamesToStorage();
                updateGamesList();
                
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Game expired. Returning to lobby.';
                errorMsg.style.cssText = 'color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 8px; border-radius: 4px; margin-top: 8px; text-align: center;';
                document.querySelector('.home-container').appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 3000);
                
                gameLobbyScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'flex';
                
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            countdownElement.textContent = `Expires in ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft < 60000) {
                countdownElement.style.color = '#ff6b6b';
            }
        }, 1000);
        
        // Add event listeners with setTimeout to ensure DOM is updated
        setTimeout(() => {
            const backToLobbyBtn = document.getElementById('backToLobbyBtn');
            const startGameBtn = document.getElementById('startGameBtn');
            
            if (backToLobbyBtn) {
                backToLobbyBtn.onclick = () => {
                    const currentPlayerId = getPlayerId();
                    const isHost = game.hostId === currentPlayerId;
                    
                    // If host is leaving, notify other players and close the game
                    if (isHost) {
                        const pusherInstance = initPusher();
                        if (pusherInstance && currentChannel) {
                            currentChannel.trigger('client-host-left', {
                                gameId: game.id
                            });
                            console.log('Host notified other players of leaving');
                        }
                        // Remove game from active games
                        activeGames = activeGames.filter(g => g.id !== game.id);
                        saveGamesToStorage();
                        updateGamesList();
                    }
                    
                    // Clear countdown interval when leaving
                    if (window.lobbyCountdownInterval) {
                        clearInterval(window.lobbyCountdownInterval);
                        window.lobbyCountdownInterval = null;
                    }
                    
                    gameLobbyScreen.style.display = 'none';
                    // Show mini board again when returning to lobby
                    const miniBoardContainer = document.querySelector('.mini-board-container');
                    if (miniBoardContainer) miniBoardContainer.style.display = 'flex';
                    // Play player versus player animation when returning to lobby
                    playPuzzleAnimation('PLAYER VERSUS PLAYER');
                    setTimeout(() => {
                        if (lobbyScreen) lobbyScreen.style.display = 'flex';
                        // Hide mini board in lobby after animation
                        if (miniBoardContainer) miniBoardContainer.style.display = 'none';
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
                    
                    const pusherInstance = initPusher();
                    
                    if (pusherInstance && currentChannel) {
                        // Broadcast game start to all players in the channel
                        currentChannel.trigger('client-game-started', {
                            gameId: game.id,
                            language: game.language
                        });
                        console.log('Game start broadcasted via Pusher');
                    } else {
                        // Fallback for local testing
                        console.log('Starting game locally');
                    }
                    
                    // Navigate host to the game
                    navigateToGame(game.language);
                };
            }
        }, 0);
    }
    
    // Function to update game lobby UI dynamically
    function updateGameLobbyUI(game) {
        const gameLobbyScreen = document.getElementById('gameLobbyScreen');
        if (!gameLobbyScreen) return;
        
        const currentPlayerId = getPlayerId();
        const isHost = game.hostId === currentPlayerId;
        
        gameLobbyScreen.innerHTML = `
            <button class="back-btn" id="backToLobbyBtn">← Back to Lobby</button>
            <h2>Puzzle Game Queue</h2>
            <div class="game-lobby-info">
                <div class="lobby-game-language">Language: ${game.language.toUpperCase()}</div>
                <div class="lobby-countdown" id="lobbyCountdown">Expires in 5:00</div>
                <div class="lobby-players">
                    <div class="player-slot">
                        <span class="player-avatar">👤</span>
                        <span class="player-name">${isHost ? 'You (Host)' : 'Host'}</span>
                    </div>
                    <div class="player-slot ${game.players < 2 ? 'empty' : ''}">
                        <span class="player-avatar">${game.players < 2 ? '➕' : '👤'}</span>
                        <span class="player-name">${game.players < 2 ? 'Waiting for player...' : (isHost ? 'Player 2' : 'You')}</span>
                    </div>
                </div>
                <div class="lobby-status">Status: ${game.status}</div>
                <button class="start-game-btn" id="startGameBtn" ${!isHost || game.players < game.maxPlayers ? 'disabled' : ''}>
                    ${!isHost ? 'Waiting for host to start...' : game.players < game.maxPlayers ? 'Waiting for players...' : 'Start Puzzle Game'}
                </button>
            </div>
        `;
        
        console.log('=== GAME LOBBY (updateGameLobbyUI) ===');
        console.log('Game ID:', game.id);
        console.log('Current Player ID:', currentPlayerId);
        console.log('Host ID:', game.hostId);
        console.log('Is Host:', isHost);
        console.log('Players:', game.players);
        console.log('Player IDs:', game.playerIds);
        
        // Restart countdown timer
        const countdownElement = document.getElementById('lobbyCountdown');
        if (countdownElement && window.lobbyCountdownInterval) {
            clearInterval(window.lobbyCountdownInterval);
        }
        
        const gameCreatedAt = new Date(game.createdAt);
        const expiryTime = new Date(gameCreatedAt.getTime() + 5 * 60 * 1000); // 5 minutes
        
        window.lobbyCountdownInterval = setInterval(() => {
            const now = new Date();
            const timeLeft = expiryTime - now;
            
            if (timeLeft <= 0) {
                clearInterval(window.lobbyCountdownInterval);
                countdownElement.textContent = 'Expired';
                countdownElement.style.color = '#ff6b6b';
                
                // Remove game and redirect to lobby
                activeGames = activeGames.filter(g => g.id !== game.id);
                saveGamesToStorage();
                updateGamesList();
                
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Game expired. Returning to lobby.';
                errorMsg.style.cssText = 'color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 8px; border-radius: 4px; margin-top: 8px; text-align: center;';
                document.querySelector('.home-container').appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 3000);
                
                gameLobbyScreen.style.display = 'none';
                if (lobbyScreen) lobbyScreen.style.display = 'flex';
                
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            countdownElement.textContent = `Expires in ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft < 60000) {
                countdownElement.style.color = '#ff6b6b';
            }
        }, 1000);
        
        // Re-attach event listeners
        setTimeout(() => {
            const backToLobbyBtn = document.getElementById('backToLobbyBtn');
            const startGameBtn = document.getElementById('startGameBtn');
            
            if (backToLobbyBtn) {
                backToLobbyBtn.onclick = () => {
                    const currentPlayerId = getPlayerId();
                    const isHost = game.hostId === currentPlayerId;
                    
                    // If host is leaving, notify other players and close the game
                    if (isHost) {
                        const pusherInstance = initPusher();
                        if (pusherInstance && currentChannel) {
                            currentChannel.trigger('client-host-left', {
                                gameId: game.id
                            });
                            console.log('Host notified other players of leaving');
                        }
                        // Remove game from active games
                        activeGames = activeGames.filter(g => g.id !== game.id);
                        saveGamesToStorage();
                        updateGamesList();
                    }
                    
                    // Clear countdown interval when leaving
                    if (window.lobbyCountdownInterval) {
                        clearInterval(window.lobbyCountdownInterval);
                        window.lobbyCountdownInterval = null;
                    }
                    
                    gameLobbyScreen.style.display = 'none';
                    // Show mini board again when returning to lobby
                    const miniBoardContainer = document.querySelector('.mini-board-container');
                    if (miniBoardContainer) miniBoardContainer.style.display = 'flex';
                    playPuzzleAnimation('PLAYER VERSUS PLAYER');
                    setTimeout(() => {
                        if (lobbyScreen) lobbyScreen.style.display = 'flex';
                        // Hide mini board in lobby after animation
                        if (miniBoardContainer) miniBoardContainer.style.display = 'none';
                        updateGamesList();
                    }, 2800);
                };
            }
            
            if (startGameBtn && !startGameBtn.disabled) {
                startGameBtn.onclick = () => {
                    if (window.va) {
                        window.va('event', { name: 'start_game', data: { type: 'game_action', gameId: game.id, language: game.language } });
                    }
                    
                    const pusherInstance = initPusher();
                    
                    if (pusherInstance && currentChannel) {
                        currentChannel.trigger('client-game-started', {
                            gameId: game.id,
                            language: game.language
                        });
                        console.log('Game start broadcasted via Pusher');
                    }
                    
                    navigateToGame(game.language);
                };
            }
        }, 0);
    }
    
    // Function to navigate to the appropriate game page
    function navigateToGame(language) {
        const gamePages = {
            'english': 'game.html',
            'french': 'french.html',
            'hindi': 'hindi.html',
            'mandarin': 'mandarin.html',
            'spanish': 'spanish.html'
        };
        
        const gamePage = gamePages[language] || 'game.html';
        window.location.href = gamePage;
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
    
    // Function to join a game
    function joinGame(gameId) {
        const game = activeGames.find(g => g.id === gameId);
        if (game) {
            const playerId = getPlayerId();
            
            console.log('=== JOIN GAME ===');
            console.log('Game ID:', gameId);
            console.log('Joining Player ID:', playerId);
            console.log('Game Host ID:', game.hostId);
            console.log('Game Players Before:', game.players);
            console.log('Game Player IDs Before:', game.playerIds);
            
            // Check if player is already in this game
            if (game.playerIds && game.playerIds.includes(playerId)) {
                console.log('Player already in this game, showing lobby');
                showGameLobby(game);
                return;
            }
            
            if (game.players < game.maxPlayers) {
                const pusherInstance = initPusher();
                
                // Preserve the original hostId
                const originalHostId = game.hostId;
                
                // Update game object with new player BEFORE showing lobby
                game.players = game.players + 1;
                game.playerIds = [...game.playerIds, playerId];
                game.hostId = originalHostId;
                
                console.log('Game Players After:', game.players);
                console.log('Game Player IDs After:', game.playerIds);
                console.log('Preserved Host ID:', game.hostId);
                
                // Update the game in activeGames array
                const gameIndex = activeGames.findIndex(g => g.id === gameId);
                if (gameIndex !== -1) {
                    activeGames[gameIndex] = game;
                }
                
                // Save to localStorage so other tabs see the update
                saveGamesToStorage();
                updateGamesList();
                
                if (pusherInstance) {
                    // Subscribe to game channel
                    const channelName = `game-${gameId}`;
                    currentChannel = pusherInstance.subscribe(channelName);
                    
                    // Listen for game start events
                    currentChannel.bind('client-game-started', (data) => {
                        console.log('Game started by host');
                        navigateToGame(game.language);
                    });
                    
                    // Listen for host leaving
                    currentChannel.bind('client-host-left', (data) => {
                        console.log('Host left the game');
                        // If current player is not the host, redirect back to lobby
                        if (currentGame && currentGame.hostId !== playerId) {
                            const gameLobbyScreen = document.getElementById('gameLobbyScreen');
                            if (gameLobbyScreen) {
                                gameLobbyScreen.style.display = 'none';
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'error-message';
                                errorMsg.textContent = 'Host left the game. Returning to lobby.';
                                errorMsg.style.cssText = 'color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 8px; border-radius: 4px; margin-top: 8px; text-align: center;';
                                document.querySelector('.home-container').appendChild(errorMsg);
                                setTimeout(() => errorMsg.remove(), 3000);
                            }
                            // Show lobby screen
                            if (lobbyScreen) lobbyScreen.style.display = 'flex';
                            // Remove game from active games
                            activeGames = activeGames.filter(g => g.id !== gameId);
                            saveGamesToStorage();
                            updateGamesList();
                        }
                    });
                    
                    // Notify the host that a player joined
                    currentChannel.trigger('client-player-joined', {
                        playerId: playerId,
                        players: game.players,
                        playerIds: game.playerIds
                    });
                    
                    console.log('Sent player-joined event via Pusher');
                }
                
                currentGame = game;
                
                // Navigate to game lobby immediately without annoying popup
                showGameLobby(game);
            } else {
                // Use inline message instead of alert
                const gamesList = document.getElementById('gamesList');
                if (gamesList) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'This game is full!';
                    errorMsg.style.cssText = 'color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 8px; border-radius: 4px; margin-top: 8px; text-align: center;';
                    gamesList.insertBefore(errorMsg, gamesList.firstChild);
                    setTimeout(() => errorMsg.remove(), 3000);
                }
            }
        } else {
            const gamesList = document.getElementById('gamesList');
            if (gamesList) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Game not found! It may have expired.';
                errorMsg.style.cssText = 'color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 8px; border-radius: 4px; margin-top: 8px; text-align: center;';
                gamesList.insertBefore(errorMsg, gamesList.firstChild);
                setTimeout(() => errorMsg.remove(), 3000);
            }
        }
    }
    
    // Function to load active games
    function loadActiveGames() {
        // Load games from localStorage for the games list display
        loadGamesFromStorage();
        updateGamesList();
    }
    
    // Language button tracking with Vercel Analytics
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const language = button.getAttribute('data-language');
            const href = button.getAttribute('data-href');
            
            // Track language button click event using Vercel Analytics
            if (window.va) {
                window.va('event', { name: 'Singleplayer: ' + language, data: { type: 'language_selection' } });
            }
            
            // Navigate to the game page
            if (href) {
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
            // PLAYER (horizontal, centered with A in middle)
            { letter: 'P', row: 4, col: 2 },
            { letter: 'L', row: 4, col: 3 },
            { letter: 'A', row: 4, col: 4, middle: true },
            { letter: 'Y', row: 4, col: 5 },
            { letter: 'E', row: 4, col: 6 },
            { letter: 'R', row: 4, col: 7 },
            // VERSUS (vertical, intersects at A)
            { letter: 'V', row: 0, col: 4 },
            { letter: 'E', row: 1, col: 4 },
            { letter: 'R', row: 2, col: 4 },
            { letter: 'S', row: 3, col: 4 },
            { letter: 'R', row: 5, col: 4 },
            { letter: 'S', row: 6, col: 4 }
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
    
    // Shuffle the animation order for more interesting effect, but ensure middle letter goes first
    const middleLetter = lettersWithDelays.find(letter => letter.middle);
    const otherLetters = lettersWithDelays.filter(letter => !letter.middle);
    const shuffledOthers = [...otherLetters].sort(() => Math.random() - 0.5);
    const shuffledLetters = middleLetter ? [middleLetter, ...shuffledOthers] : shuffledOthers;
    
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
