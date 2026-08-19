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
        const gameId = generateGameId();
        const game = {
            id: gameId,
            name: 'Puzzle Game',
            players: 1,
            maxPlayers: 2,
            status: 'waiting',
            language: data.language || 'english',
            createdAt: new Date(),
            hostId: socket.id,
            playerIds: [socket.id],
            hostPlayerId: data.playerId
        };
        
        games[gameId] = game;
        socket.join(gameId);
        
        console.log('Game created:', gameId, 'by:', socket.id);
        
        // Save to disk
        saveGames();
        
        // Send game to client
        socket.emit('game-created', game);
        
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
        
        // Add player to game
        game.players += 1;
        game.playerIds.push(socket.id);
        
        socket.join(gameId);
        
        console.log('Player joined:', socket.id, 'to game:', gameId);
        
        // Save to disk
        saveGames();
        
        // Notify all players in the game
        io.to(gameId).emit('player-joined', {
            playerId: playerId,
            players: game.players,
            playerIds: game.playerIds,
            hostId: game.hostPlayerId
        });
        
        // Update game list
        io.emit('game-list-updated', Object.values(games));
    });

    // Start the game
    socket.on('start-game', (data) => {
        const { gameId } = data;
        const game = games[gameId];
        
        if (!game) return;
        
        if (game.hostId !== socket.id) {
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
        
        if (game) {
            socket.leave(gameId);
            
            // Notify others if host left
            if (game.hostId === socket.id) {
                io.to(gameId).emit('host-left');
                delete games[gameId];
            } else {
                // Remove player
                game.players -= 1;
                game.playerIds = game.playerIds.filter(id => id !== socket.id);
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

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Clean up games where this player was host
        for (const [gameId, game] of Object.entries(games)) {
            if (game.hostId === socket.id) {
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
