// Multiplayer Game Logic
// This file handles Player vs Player gameplay with Socket.io

let socket = null;
let myPlayerId = null;
let opponentPlayerId = null;
let isMyTurn = false;
let isHost = false;
let gameInstance = null;
let pendingGameState = null;

function formatTileLetters(tiles) {
    if (!tiles || !tiles.length) return '(empty)';
    return tiles.map(t => t.letter).join(',');
}

function getGameId() {
    return new URLSearchParams(window.location.search).get('gameId');
}

function broadcastTilePreview(placement) {
    if (!socket || !socket.connected) return;
    socket.emit('tile-preview', { gameId: getGameId(), placement });
}

function broadcastTilePreviewClear() {
    if (!socket || !socket.connected) return;
    socket.emit('tile-preview-clear', { gameId: getGameId() });
}

function showOpponentPreviewTile(placement) {
    if (!placement) return;
    const { row, col, letter, isBlank } = placement;
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    const existing = cell.querySelector('.tile');
    if (existing && !existing.classList.contains('opponent-preview')) return;
    if (existing) existing.remove();
    const value = gameInstance
        ? gameInstance.getTileDisplayValue({ letter, isBlank })
        : 0;
    const tile = document.createElement('div');
    tile.className = 'tile opponent-preview';
    tile.innerHTML = `${letter}<span class="points">${value}</span>`;
    cell.appendChild(tile);
}

function clearOpponentPreviewTiles() {
    document.querySelectorAll('.tile.opponent-preview').forEach(el => el.remove());
}
    if (!allPlayerTiles || !playerId) return null;
    for (const [id, tiles] of Object.entries(allPlayerTiles)) {
        if (id !== playerId) {
            return { opponentId: id, tiles };
        }
    }
    return null;
}

function logTileInfo(myTiles, allPlayerTiles) {
    console.log('=== MY TILES ===');
    console.log('My player ID:', myPlayerId);
    console.log('My tiles:', formatTileLetters(myTiles));

    const opponent = getOpponentEntry(allPlayerTiles, myPlayerId);
    console.log('Opponent tiles:', opponent ? formatTileLetters(opponent.tiles) : '(waiting for opponent)');

    if (gameInstance && typeof gameInstance.appendConsoleMessage === 'function') {
        gameInstance.appendConsoleMessage('My tiles: ' + formatTileLetters(myTiles));
        gameInstance.appendConsoleMessage('Opponent tiles: ' + (opponent ? formatTileLetters(opponent.tiles) : '(waiting for opponent)'));
    }
}

function applyServerTileState(data) {
    if (!data) return;

    if (data.myTiles) {
        sessionStorage.setItem('myTiles', JSON.stringify(data.myTiles));
    }
    if (data.allPlayerTiles) {
        sessionStorage.setItem('allPlayerTiles', JSON.stringify(data.allPlayerTiles));
    }

    const myTiles = data.myTiles || JSON.parse(sessionStorage.getItem('myTiles') || '[]');
    const allPlayerTiles = data.allPlayerTiles || JSON.parse(sessionStorage.getItem('allPlayerTiles') || '{}');

    logTileInfo(myTiles, allPlayerTiles);

    if (!gameInstance || !data.myTiles) return;

    gameInstance.playerRack = data.myTiles;
    gameInstance.tiles = [];

    const opponent = getOpponentEntry(allPlayerTiles, myPlayerId);
    if (opponent) {
        opponentPlayerId = opponent.opponentId;
        gameInstance.opponentRack = opponent.tiles;
        if (typeof gameInstance.renderAIRack === 'function') {
            gameInstance.renderAIRack();
        }
    }

    gameInstance.renderRack();
}

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
        if (gameInstance) {
            gameInstance.currentTurn = isMyTurn ? 'player' : 'ai';
        }
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
            const currentId = data.currentPlayerId || data.hostId;
            isMyTurn = currentId === myPlayerId;
            if (gameInstance) {
                gameInstance.currentTurn = isMyTurn ? 'player' : 'ai';
            }
            updateTurnIndicator();
        }
        
        pendingGameState = data;
        applyServerTileState(data);

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
    
    socket.on('tile-preview', (data) => {
        showOpponentPreviewTile(data.placement);
    });

    socket.on('tile-preview-clear', () => {
        clearOpponentPreviewTiles();
    });
    
    socket.on('game-ended', (data) => {
        handleGameEnd(data);
    });
}

// Send move to opponent
function sendMoveToOpponent(moveData) {
    if (!socket || !socket.connected) {
        console.warn('Cannot send move; socket not connected');
        return;
    }
    console.log('Sending move to opponent:', moveData);
    socket.emit('player-move', moveData, (ack) => {
        console.log('Move ack from server:', ack);
        if (!ack || !ack.ok) {
            console.warn('Server did not accept the move', ack);
        }
    });
}

function commitMultiplayerMove({ placements, score }) {
    if (!placements || !placements.length) return;

    const gameId = new URLSearchParams(window.location.search).get('gameId');
    sendMoveToOpponent({
        gameId,
        move: { placements, score: score || 0 }
    });

    if (gameInstance) {
        socket.emit('update-tiles', {
            gameId,
            tileCount: gameInstance.playerRack.length
        });
        gameInstance.currentTurn = 'ai';
    }

    isMyTurn = false;
    updateTurnIndicator();
}

window.commitMultiplayerMove = commitMultiplayerMove;

// Handle opponent's move
function handleOpponentMove(data) {
    console.log('Opponent made a move:', data);

    if (!gameInstance || !data.move) return;

    if (data.board) {
        syncBoardState(data.board);
    } else if (data.move.placements) {
        data.move.placements.forEach(placement => {
            placeTileOnBoard(placement.row, placement.col, placement.letter, placement.isBlank);
        });
        gameInstance.isFirstMove = false;
    }

    if (data.move.score) {
        gameInstance.opponentScore += data.move.score;
        gameInstance.updateGameState();
    }
}

function placeTileOnBoard(row, col, letter, isBlank) {
    if (!gameInstance) return;

    const value = gameInstance.getTileDisplayValue({ letter, isBlank });
    gameInstance.board[row][col] = { letter, isBlank, value };

    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;

    const existingTile = cell.querySelector('.tile');
    if (existingTile) existingTile.remove();
    const star = cell.querySelector('.center-star');
    if (star) star.remove();

    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `
        ${letter}
        <span class="points">${value}</span>
    `;
    cell.appendChild(tile);
}

// Sync board state from server
function syncBoardState(board) {
    console.log('Syncing board state:', board);

    if (!gameInstance || !board) return;

    gameInstance.board = Array(15).fill(null).map(() => Array(15).fill(null));
    document.querySelectorAll('.board-cell .tile').forEach(el => el.remove());

    for (const [cellKey, tileData] of Object.entries(board)) {
        const [row, col] = cellKey.split('_').map(Number);
        placeTileOnBoard(row, col, tileData.letter, tileData.isBlank);
    }

    gameInstance.isFirstMove = Object.keys(board).length === 0;
    console.log('Board synced with', Object.keys(board).length, 'tiles');
}

// Update turn indicator
function updateTurnIndicator() {
    document.querySelectorAll('.turn-indicator').forEach(el => {
        el.textContent = isMyTurn ? 'Your Turn' : "Opponent's Turn";
        el.classList.toggle('your-turn', isMyTurn);
        el.classList.toggle('opponent-turn', !isMyTurn);
        el.style.display = 'flex';
    });
}

// Update opponent tile count
function updateOpponentTileCount(count) {
    console.log('Opponent tile count:', count);
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
                console.log('Local tiles bag:', gameInstance.tiles.length);
                
                // Apply tiles from pending game-state (preferred) or sessionStorage
                if (pendingGameState) {
                    applyServerTileState(pendingGameState);
                    if (pendingGameState.board) {
                        syncBoardState(pendingGameState.board);
                    }
                } else {
                    const storedTiles = sessionStorage.getItem('myTiles');
                    const storedAllTiles = sessionStorage.getItem('allPlayerTiles');
                    if (storedTiles) {
                        applyServerTileState({
                            myTiles: JSON.parse(storedTiles),
                            allPlayerTiles: storedAllTiles ? JSON.parse(storedAllTiles) : {}
                        });
                    }
                }
                
                // Determine if I'm the host
                const urlParams = new URLSearchParams(window.location.search);
                const gameId = urlParams.get('gameId');
                isHost = urlParams.get('isHost') === 'true';
                
                // Set initial turn based on host status
                if (pendingGameState) {
                    const currentId = pendingGameState.currentPlayerId || pendingGameState.hostId;
                    isMyTurn = currentId === myPlayerId;
                } else {
                    isMyTurn = isHost;
                }
                gameInstance.currentTurn = isMyTurn ? 'player' : 'ai';
                updateTurnIndicator();
                console.log('Initial turn set - isHost:', isHost, 'isMyTurn:', isMyTurn);
                
                // Override the AI turn to prevent it from running
                const originalAITurn = gameInstance.aiTurn;
                gameInstance.aiTurn = function() {
                    console.log('AI turn disabled in multiplayer');
                    return Promise.resolve();
                };
                
                // Override fillRacks to skip local bag in multiplayer
                const originalFillRacks = gameInstance.fillRacks;
                gameInstance.fillRacks = function(playerFirst = false) {
                    console.log('fillRacks called in multiplayer mode - skipping local bag');
                    // Don't do anything - tiles come from server
                    this.renderRack();
                };
                
                gameInstance.onValidMultiplayerMove = commitMultiplayerMove;

                const originalPlayWord = gameInstance.playWord.bind(gameInstance);
                gameInstance.playWord = async function() {
                    if (!isMyTurn) {
                        console.log('Submit ignored — not your turn');
                        return;
                    }
                    return originalPlayWord();
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
    
    // Show turn indicator
    document.querySelectorAll('.turn-indicator').forEach(el => {
        el.style.display = 'flex';
    });
}
