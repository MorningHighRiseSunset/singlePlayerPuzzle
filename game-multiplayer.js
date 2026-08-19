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
    
    socket.on('board-sync', (data) => {
        // Sync board state from opponent
        syncBoardState(data);
    });
    
    socket.on('game-state', (data) => {
        console.log('Received game state:', data);
        // Handle initial game state
        if (data.players) {
            console.log('Game has', data.players, 'players');
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
        
        // Update opponent score
        if (data.score) {
            gameInstance.opponentScore += data.score;
            gameInstance.updateGameState();
        }
    }
}

// Sync board state from opponent
function syncBoardState(data) {
    console.log('Syncing board state:', data);
    // Implement board synchronization
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
                
                // Override the AI turn to prevent it from running
                const originalAITurn = gameInstance.aiTurn;
                gameInstance.aiTurn = function() {
                    console.log('AI turn disabled in multiplayer');
                    return Promise.resolve();
                };
                
                // Override fillRacks to not fill opponent rack
                const originalFillRacks = gameInstance.fillRacks;
                gameInstance.fillRacks = function(playerFirst = false) {
                    console.log('fillRacks called in multiplayer mode');
                    console.log('Player rack before:', this.playerRack.length);
                    console.log('Tiles remaining:', this.tiles.length);
                    
                    // Only fill player rack in multiplayer
                    while (this.playerRack.length < 7 && this.tiles.length > 0) {
                        const tile = this.tiles.pop();
                        this.playerRack.push(tile);
                    }
                    
                    console.log('Player rack after:', this.playerRack.length);
                    this.renderRack();
                };
                
                // Hook into submit move to send to opponent
                const originalSubmitMove = gameInstance.submitMove;
                gameInstance.submitMove = function() {
                    const moveData = {
                        gameId: new URLSearchParams(window.location.search).get('gameId'),
                        move: {
                            placements: this.placedTiles.map(t => ({
                                row: t.row,
                                col: t.col,
                                letter: t.letter,
                                isBlank: t.isBlank
                            })),
                            score: this.calculateTotalScore()
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
