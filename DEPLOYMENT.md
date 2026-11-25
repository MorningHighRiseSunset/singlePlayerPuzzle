# Multiplayer Deployment Guide

## Architecture
- **Frontend**: Vercel (static files)
- **Backend**: Node.js + Socket.io server (Render/Railway/etc)
- **Communication**: Socket.io via runtime-config.js

## Deployment Steps

### 1. Deploy Backend Server

#### Option A: Render
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment Variables (optional):
     - `FRONTEND_URL`: `https://single-player-puzzle.vercel.app`
4. Deploy and note the URL (e.g., `https://your-game.onrender.com`)

#### Option B: Railway
1. Create a new project on Railway
2. Deploy from GitHub
3. Set start command to `node server.js`
4. Deploy and note the URL

#### Option C: Your own VPS
1. SSH into your server
2. Clone the repository
3. Run `npm install`
4. Use PM2 to keep it running: `pm2 start server.js --name puzzle-game`
5. Configure nginx reverse proxy if needed

### 2. Update Runtime Config

Edit `runtime-config.js` and change:
```javascript
SOCKET_SERVER_URL: 'https://your-backend-url.com'
```
Replace with your actual backend URL from step 1.

### 3. Deploy Frontend to Vercel

1. Push changes to GitHub
2. Vercel will auto-deploy
3. Or manually: `vercel --prod`

### 4. Test Multiplayer

1. Open https://single-player-puzzle.vercel.app in two different browsers/devices
2. Tab 1: Create a game
3. Tab 2: Join the same game
4. Real-time sync should work across devices

## Environment Variables (Optional)

Add to your backend deployment:
- `FRONTEND_URL`: Your Vercel frontend URL for CORS
- `PORT`: Server port (defaults to 3000)

## Troubleshooting

- **CORS errors**: Ensure FRONTEND_URL is set correctly in backend
- **Connection fails**: Check backend URL in runtime-config.js
- **Games not persisting**: Ensure backend has write permissions for games.json
