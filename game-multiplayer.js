// Multiplayer Game Logic
// This file handles Player vs Player gameplay with Socket.io

let socket = null;
let myPlayerId = null;
let opponentPlayerId = null;
let isMyTurn = false;
let isHost = false;
let gameInstance = null;

// Initialize Socket.io for multiplayer
function initMultiplayerSocket() {
    const socketUrl = window.RUNTIME_CONFIG?.SOCKET_SERVER_URL || window.location.origin;
    socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    
    socket.on('connect', () => {
        console.log('Multiplayer socket connected');
        myPlayerId = sessionStorage.getItem('playerId');
        
        // Join the game room
        const gameId = new URLSearchParams(window.location.search).get('gameId');
        if (gameId) {
            console.log('Joining game room:', gameId, 'as player:', myPlayerId);
            socket.emit('join-game-room', { gameId, playerId: myPlayerId });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Multiplayer socket disconnected');
    });
    
    socket.on('opponent-move', (data) => {
        // Handle opponent's move - place tiles on board
        handleOpponentMove(data);
    });
    
    socket.on('turn-change', (data) => {
        isMyTurn = data.currentPlayerId === myPlayerId;
        updateTurnIndicator();
    });
    
    socket.on('opponent-tiles', (data) => {
        // Update opponent's tile count (not the actual tiles for security)
        updateOpponentTileCount(data.tileCount);
    });
    
    socket.on('board-state', (data) => {
        console.log('Received board state update:', data);
        syncBoardState(data.board);
    });
    
    socket.on('game-state', (data) => {
        console.log('Received game state:', data);
        // Handle initial game state
        if (data.players) {
            console.log('Game has', data.players, 'players');
            // Set initial turn - host goes first
            isMyTurn = data.hostId === myPlayerId;
            updateTurnIndicator();
        }
        
        // Use server-provided tiles
        if (data.myTiles && gameInstance) {
            console.log('=== RECEIVED TILES FROM SERVER ===');
            console.log('My player ID:', myPlayerId);
            console.log('Tiles received:', data.myTiles.map(t => t.letter).join(','));
            console.log('Tiles raw:', JSON.stringify(data.myTiles, null, 2));
            console.log('Setting player rack to server tiles');
            gameInstance.playerRack = data.myTiles;
            gameInstance.tiles = []; // Empty local bag since server manages it
            gameInstance.renderRack();
        }
        
        // Sync board state
        if (data.board && gameInstance) {
            console.log('Syncing initial board state with', Object.keys(data.board).length, 'tiles');
            syncBoardState(data.board);
        }
    });
    
    socket.on('tiles-drawn', (data) => {
        console.log('Received tiles from server:', data.tiles.map(t => t.letter).join(','));
        if (gameInstance) {
            gameInstance.playerRack = data.tiles;
            gameInstance.renderRack();
            
            // Send tile count to opponent
            socket.emit('update-tiles', {
                gameId: new URLSearchParams(window.location.search).get('gameId'),
                tileCount: gameInstance.playerRack.length
            });
        }
    });
    
    socket.on('player-reconnected', (data) => {
        console.log('Opponent reconnected:', data);
    });
    
    socket.on('game-ended', (data) => {
        handleGameEnd(data);
    });
}

// Send move to opponent
function sendMoveToOpponent(moveData) {
    if (socket) {
        socket.emit('player-move', moveData);
    }
}

// Handle opponent's move
function handleOpponentMove(data) {
    console.log('Opponent made a move:', data);
    
    if (gameInstance && data.move) {
        // Place opponent's tiles on the board
        data.move.placements.forEach(placement => {
            const { row, col, letter, isBlank } = placement;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                // Create tile element
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.innerHTML = `
                    ${letter}
                    <span class="points">${gameInstance.getTileDisplayValue({ letter, isBlank })}</span>
                `;
                cell.appendChild(tile);
            }
        });
        
        // Sync the full board state if provided
        if (data.board) {
            syncBoardState(data.board);
        }
        
        // Update opponent score
        if (data.score) {
            gameInstance.opponentScore += data.score;
            gameInstance.updateGameState();
        }
    }
}

// Sync board state from server
function syncBoardState(board) {
    console.log('Syncing board state:', board);
    
    if (!gameInstance) return;
    
    // Clear existing tiles from board and redraw from server state
    const cells = document.querySelectorAll('.grid-item');
    cells.forEach(cell => {
        cell.innerHTML = ''; // Clear all tiles
    });
    
    // Place tiles from server board state
    for (const [cellKey, tileData] of Object.entries(board)) {
        const [row, col] = cellKey.split('_');
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (cell) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.innerHTML = `
                ${tileData.letter}
                <span class="points">${gameInstance.getTileDisplayValue({ letter: tileData.letter, isBlank: tileData.isBlank })}</span>
            `;
            cell.appendChild(tile);
        }
    }
    
    console.log('Board synced with', Object.keys(board).length, 'tiles');
}

// Update turn indicator
function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turn-indicator');
    if (turnIndicator) {
        turnIndicator.textContent = isMyTurn ? 'Your Turn' : "Opponent's Turn";
        turnIndicator.className = isMyTurn ? 'your-turn' : 'opponent-turn';
    }
}

// Update opponent tile count
function updateOpponentTileCount(count) {
    const opponentRack = document.getElementById('opponent-rack');
    if (opponentRack) {
        // Show tile count without revealing actual tiles
        opponentRack.innerHTML = `<div class="tile-count">Opponent has ${count} tiles</div>`;
    }
}

// Handle game end
function handleGameEnd(data) {
    alert(`Game Over! ${data.winner} wins!`);
    // Redirect to lobby
    window.location.href = 'index.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if this is a multiplayer game
    const isMultiplayer = new URLSearchParams(window.location.search).get('multiplayer') === 'true';
    
    if (isMultiplayer) {
        // Update UI for multiplayer
        updateGameUIForMultiplayer();
        
        // Initialize socket
        initMultiplayerSocket();
        
        // Hook into game instance after it's created
        setTimeout(() => {
            if (window.game) {
                gameInstance = window.game;
                console.log('Game instance found:', gameInstance);
                console.log('Player rack:', gameInstance.playerRack);
                console.log('Opponent rack:', gameInstance.opponentRack);
                
                // Use tiles from sessionStorage (provided by server)
                const storedTiles = sessionStorage.getItem('myTiles');
                if (storedTiles) {
                    const myTiles = JSON.parse(storedTiles);
                    console.log('=== MY TILES ===');
                    console.log('My player ID:', myPlayerId);
                    console.log('My tiles from server:', myTiles.map(t => t.letter).join(','));
                    console.log('My tiles raw:', JSON.stringify(myTiles, null, 2));
                    gameInstance.playerRack = myTiles;
                    gameInstance.tiles = []; // Empty local bag since server manages it
                    gameInstance.renderRack();
                }
                
                // Determine if I'm the host
                const urlParams = new URLSearchParams(window.location.search);
                const gameId = urlParams.get('gameId');
                isHost = urlParams.get('isHost') === 'true';
                
                // Set initial turn based on host status
                isMyTurn = isHost;
                updateTurnIndicator();
                console.log('Initial turn set - isHost:', isHost, 'isMyTurn:', isMyTurn);
                
                // Override the AI turn to prevent it from running
                const originalAITurn = gameInstance.aiTurn;
                gameInstance.aiTurn = function() {
                    console.log('AI turn disabled in multiplayer');
                    return Promise.resolve();
                };
                
                // Override fillRacks to use server tiles
                const originalFillRacks = gameInstance.fillRacks;
                gameInstance.fillRacks = function(playerFirst = false) {
                    console.log('fillRacks called in multiplayer mode - skipping, using server tiles');
                    // Don't do anything - tiles come from server
                    this.renderRack();
                };
                
                // Hook into submit move to send to opponent
                const originalSubmitMove = gameInstance.submitMove;
                gameInstance.submitMove = function() {
                    const score = this.calculateTotalScore();
                    const moveData = {
                        gameId: new URLSearchParams(window.location.search).get('gameId'),
                        move: {
                            placements: this.placedTiles.map(t => ({
                                row: t.row,
                                col: t.col,
                                letter: t.letter,
                                isBlank: t.isBlank
                            })),
                            score: score
                        }
                    };
                    
                    sendMoveToOpponent(moveData);
                    
                    // Send tile count update
                    socket.emit('update-tiles', {
                        gameId: moveData.gameId,
                        tileCount: this.playerRack.length
                    });
                    
                    // Call original submit
                    return originalSubmitMove.call(this);
                };
            }
        }, 1000);
    }
});

// Update UI elements for multiplayer
function updateGameUIForMultiplayer() {
    // Update game title
    const title = document.querySelector('title');
    if (title) {
        title.textContent = 'Multiplayer Puzzle Game';
    }
    
    // Add turn indicator
    const boardContainer = document.querySelector('.board-container');
    if (boardContainer) {
        const turnIndicator = document.createElement('div');
        turnIndicator.id = 'turn-indicator';
        turnIndicator.className = 'turn-indicator';
        turnIndicator.textContent = 'Waiting for turn...';
        boardContainer.insertBefore(turnIndicator, boardContainer.firstChild);
    }
}
