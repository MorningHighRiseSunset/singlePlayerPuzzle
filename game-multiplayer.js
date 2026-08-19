// Multiplayer Game Logic
// This file handles Player vs Player gameplay with Socket.io

let socket = null;
let myPlayerId = null;
let opponentPlayerId = null;
let isMyTurn = false;
let isHost = false;

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
            socket.emit('join-game-room', { gameId, playerId: myPlayerId });
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Multiplayer socket disconnected');
    });
    
    socket.on('opponent-move', (data) => {
        // Handle opponent's move
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
    // Place opponent's tiles on the board
    // This will be implemented based on the game logic
    console.log('Opponent made a move:', data);
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
    }
});

// Update UI elements for multiplayer
function updateGameUIForMultiplayer() {
    // Update game title
    const title = document.querySelector('title');
    if (title) {
        title.textContent = 'Multiplayer Puzzle Game';
    }
    
    // Rename ai-rack to opponent-rack for multiplayer
    const aiRack = document.getElementById('ai-rack');
    if (aiRack) {
        aiRack.id = 'opponent-rack';
        aiRack.classList.remove('ai-rack');
        aiRack.classList.add('opponent-rack');
    }
    
    // Rename computer-score to opponent-score
    const computerScores = document.querySelectorAll('[id^="computer-score"]');
    computerScores.forEach(el => {
        el.id = el.id.replace('computer-score', 'opponent-score');
    });
    
    // Update labels
    const computerLabels = document.querySelectorAll('[data-i18n="computer"]');
    computerLabels.forEach(el => {
        el.setAttribute('data-i18n', 'opponent');
        el.textContent = 'Opponent';
    });
    
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
