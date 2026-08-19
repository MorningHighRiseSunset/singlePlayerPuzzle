const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// CORS configuration - allow Vercel frontend and local development
const allowedOrigins = [
    'https://single-player-puzzle.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
];

// Add from environment variable if configured
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Game state storage
const games = {};
const GAMES_FILE = path.join(__dirname, 'games.json');
const socketToPlayer = {}; // Map socket.id to playerId

// Tile bag management
function createTileBag() {
    const tiles = [];
    const distribution = {
        'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2, 'I': 9,
        'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2, 'Q': 1, 'R': 6,
        'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1, 'Y': 2, 'Z': 1, '*': 2
    };
    
    for (const [letter, count] of Object.entries(distribution)) {
        for (let i = 0; i < count; i++) {
            tiles.push({ letter, isBlank: letter === '*' });
        }
    }
    
    // Shuffle the bag
    for (let i = tiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    
    return tiles;
}

// Load games from disk on startup
function loadGames() {
    try {
        if (fs.existsSync(GAMES_FILE)) {
            const data = fs.readFileSync(GAMES_FILE, 'utf8');
            const loadedGames = JSON.parse(data);
            Object.assign(games, loadedGames);
            console.log('Loaded games from disk:', Object.keys(games).length);
        }
    } catch (e) {
        console.log('Error loading games from disk:', e);
    }
}

// Save games to disk
function saveGames() {
    try {
        fs.writeFileSync(GAMES_FILE, JSON.stringify(games, null, 2));
    } catch (e) {
        console.log('Error saving games to disk:', e);
    }
}

// Load games on startup
loadGames();

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Create a new game
    socket.on('create-game', (data) => {
        const playerId = data.playerId;
        socketToPlayer[socket.id] = playerId;
        
        const gameId = generateGameId();
        const game = {
            id: gameId,
            name: 'Puzzle Game',
            players: 1,
            maxPlayers: 2,
            status: 'waiting',
            language: data.language || 'english',
            createdAt: new Date(),
            hostId: playerId,
            playerIds: [playerId],
            hostSocketId: socket.id,
            tileBag: createTileBag(),
            playerTiles: {}, // Map playerId to their tiles
            currentPlayerId: playerId,
            board: {} // Board state: {row_col: {letter, playerId}}
        };
        
        // Give host their initial tiles
        game.playerTiles[playerId] = game.tileBag.splice(0, 7);
        
        games[gameId] = game;
        socket.join(gameId);
        
        console.log('Game created:', gameId, 'by:', playerId);
        console.log('Host tiles:', game.playerTiles[playerId].map(t => t.letter).join(','));
        
        // Save to disk
        saveGames();
        
        // Send game to client with their tiles
        socket.emit('game-created', {
            ...game,
            myTiles: game.playerTiles[playerId]
        });
        
        // Broadcast to lobby
        io.emit('game-list-updated', Object.values(games));
    });

    // Join an existing game
    socket.on('join-game', (data) => {
        const { gameId, playerId } = data;
        const game = games[gameId];
        
        if (!game) {
            socket.emit('error', { message: 'Game not found' });
            return;
        }
        
        if (game.players >= game.maxPlayers) {
            socket.emit('error', { message: 'Game is full' });
            return;
        }
        
        // Map socket to player
        socketToPlayer[socket.id] = playerId;
        
        // Add player to game
        game.players += 1;
        game.playerIds.push(playerId);
        
        // Give joining player their tiles from the server's bag
        game.playerTiles[playerId] = game.tileBag.splice(0, 7);
        
        socket.join(gameId);
        
        console.log('Player joined:', playerId, 'to game:', gameId);
        console.log('Player tiles:', game.playerTiles[playerId].map(t => t.letter).join(','));
        
        // Save to disk
        saveGames();
        
        // Send current game state to the joining player with their tiles
        socket.emit('game-joined', {
            game: game,
            myTiles: game.playerTiles[playerId]
        });
        
        // Notify all players in the game (including the joiner)
        io.to(gameId).emit('player-joined', {
            playerId: playerId,
            players: game.players,
            playerIds: game.playerIds,
            hostId: game.hostId
        });
        
        // Update game list
        io.emit('game-list-updated', Object.values(games));
    });

    // Start the game
    socket.on('start-game', (data) => {
        const { gameId } = data;
        const game = games[gameId];
        const playerId = socketToPlayer[socket.id];
        
        if (!game) return;
        
        if (game.hostId !== playerId) {
            socket.emit('error', { message: 'Only host can start the game' });
            return;
        }
        
        game.status = 'playing';
        
        console.log('Game started:', gameId);
        
        // Save to disk
        saveGames();
        
        // Notify all players
        io.to(gameId).emit('game-started', { language: game.language });
    });

    // Player leaves
    socket.on('leave-game', (data) => {
        const { gameId } = data;
        const game = games[gameId];
        const playerId = socketToPlayer[socket.id];
        
        if (game) {
            socket.leave(gameId);
            
            // Notify others if host left
            if (game.hostId === playerId) {
                io.to(gameId).emit('host-left');
                delete games[gameId];
            } else {
                // Remove player
                game.players -= 1;
                game.playerIds = game.playerIds.filter(id => id !== playerId);
                io.to(gameId).emit('player-left', { players: game.players, playerIds: game.playerIds });
            }
            
            // Save to disk
            saveGames();
            
            io.emit('game-list-updated', Object.values(games));
        }
    });

    // Get game list
    socket.on('get-games', () => {
        socket.emit('game-list', Object.values(games));
    });

    // Join game room for gameplay
    socket.on('join-game-room', (data) => {
        const { gameId, playerId } = data;
        const game = games[gameId];
        
        if (game) {
            socketToPlayer[socket.id] = playerId;
            socket.join(gameId);
            
            // Send initial game state with turn info, player's tiles, and current board
            socket.emit('game-state', {
                gameId: game.id,
                players: game.players,
                hostId: game.hostId,
                status: game.status,
                currentPlayerId: game.hostId, // Host goes first
                myTiles: game.playerTiles[playerId] || [],
                remainingTiles: game.tileBag.length,
                board: game.board // Current board state
            });
            
            // Notify other player
            socket.to(gameId).emit('player-reconnected', { playerId });
            
            console.log('Player joined game room:', gameId, 'as:', playerId, 'host is:', game.hostId);
            console.log('Sending tiles:', game.playerTiles[playerId]?.map(t => t.letter).join(',') || 'none');
            console.log('Sending board state with', Object.keys(game.board).length, 'tiles');
        }
    });

    // Player makes a move
    socket.on('player-move', (data) => {
        const { gameId, move } = data;
        const playerId = socketToPlayer[socket.id];
        const game = games[gameId];
        
        if (game) {
            console.log('Player move:', playerId, 'in game:', gameId);
            
            // Update board state
            if (move.placements) {
                move.placements.forEach(placement => {
                    const { row, col, letter, isBlank } = placement;
                    const cellKey = `${row}_${col}`;
                    game.board[cellKey] = {
                        letter: letter,
                        isBlank: isBlank,
                        playerId: playerId,
                        timestamp: Date.now()
                    };
                });
            }
            
            // Broadcast move to opponent with board state
            socket.to(gameId).emit('opponent-move', {
                playerId: playerId,
                move: move,
                board: game.board
            });
            
            // Toggle turn
            const playerIds = game.playerIds;
            const currentPlayerIndex = playerIds.indexOf(playerId);
            const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
            const nextPlayerId = playerIds[nextPlayerIndex];
            game.currentPlayerId = nextPlayerId;
            
            io.to(gameId).emit('turn-change', {
                currentPlayerId: nextPlayerId
            });
            
            // Broadcast updated board state to all players
            io.to(gameId).emit('board-state', {
                board: game.board
            });
            
            saveGames();
        }
    });

    // Player updates tile count
    socket.on('update-tiles', (data) => {
        const { gameId, tileCount } = data;
        const playerId = socketToPlayer[socket.id];
        const game = games[gameId];
        
        if (game) {
            // Broadcast tile count to opponent
            socket.to(gameId).emit('opponent-tiles', {
                playerId: playerId,
                tileCount: tileCount
            });
        }
    });

    // Player draws new tiles from the bag
    socket.on('draw-tiles', (data) => {
        const { gameId, count } = data;
        const playerId = socketToPlayer[socket.id];
        const game = games[gameId];
        
        if (game) {
            // Draw tiles from server's bag
            const newTiles = game.tileBag.splice(0, count);
            game.playerTiles[playerId] = newTiles;
            
            console.log('Player drew', count, 'tiles:', newTiles.map(t => t.letter).join(','));
            
            socket.emit('tiles-drawn', {
                tiles: newTiles,
                remaining: game.tileBag.length
            });
            
            saveGames();
        }
    });

    socket.on('disconnect', () => {
        const playerId = socketToPlayer[socket.id];
        console.log('Client disconnected:', socket.id, 'player:', playerId);
        
        // Clean up socket mapping
        delete socketToPlayer[socket.id];
        
        // Clean up games where this player was host
        for (const [gameId, game] of Object.entries(games)) {
            if (game.hostId === playerId) {
                io.to(gameId).emit('host-left');
                delete games[gameId];
                saveGames();
                io.emit('game-list-updated', Object.values(games));
            }
        }
    });
});

function generateGameId() {
    return 'GAME-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
