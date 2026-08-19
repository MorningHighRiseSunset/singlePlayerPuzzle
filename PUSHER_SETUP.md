# Pusher Setup for Real-Time Multiplayer

This project uses Pusher for real-time multiplayer functionality across different devices.

## Setup Instructions

### 1. Create a Pusher Account

1. Go to [https://pusher.com](https://pusher.com)
2. Sign up for a free account
3. Create a new app (choose "Vanilla JS" as the frontend framework)

### 2. Get Your Credentials

From your Pusher dashboard, you'll need:
- **App ID** (e.g., `123456`)
- **Key** (e.g., `abcdef123456`)
- **Secret** (e.g., `secret123456`)
- **Cluster** (e.g., `us2`, `mt1`, `eu`)

### 3. Update Configuration Files

#### Update `.env.local`:

```env
PUSHER_APP_ID=your_actual_app_id
PUSHER_KEY=your_actual_pusher_key
PUSHER_SECRET=your_actual_pusher_secret
PUSHER_CLUSTER=your_cluster
PUSHER_USE_TLS=true
```

#### Update `homeScreen.js`:

Find the `initPusher()` function and replace the placeholder:

```javascript
function initPusher() {
    if (pusher) return pusher;
    
    try {
        pusher = new Pusher('YOUR_ACTUAL_KEY', {
            cluster: 'YOUR_CLUSTER',
            forceTLS: true
        });
        return pusher;
    } catch (e) {
        console.log('Pusher not configured, falling back to localStorage');
        return null;
    }
}
```

Replace:
- `YOUR_ACTUAL_KEY` with your Pusher key
- `YOUR_CLUSTER` with your cluster (e.g., `us2`)

### 4. Enable Client Events

In your Pusher dashboard:
1. Go to your app settings
2. Enable "Client events"
3. This allows clients to trigger events directly (needed for game-start events)

### 5. Test Local Multiplayer (Fallback)

Without Pusher configured, the game falls back to localStorage:
- Works across browser tabs in the same browser
- Does NOT work across different devices
- Good for local testing

### 6. Test Online Multiplayer (With Pusher)

Once Pusher is configured:
- Works across different devices
- Players can join from anywhere
- Real-time game state synchronization

## How It Works

### Game Creation
1. Host creates a game
2. Game is announced on the `lobby` channel
3. Other players see it in their Active Games list

### Joining a Game
1. Player clicks "Join" on a game
2. Player subscribes to the game-specific channel (`game-{gameId}`)
3. Player join event is broadcast to the host

### Starting the Game
1. Host clicks "Start Puzzle Game"
2. Game start event is broadcast to all players in the channel
3. Both players navigate to the game page simultaneously

## Channels Used

- **`lobby`** - Channel for announcing new games
- **`game-{gameId}`** - Channel for game-specific events (join, start, etc.)

## Events

- **`client-game-created`** - Announces a new game to the lobby
- **`client-player-joined`** - Notifies host when a player joins
- **`client-game-started`** - Broadcasts game start to all players

## Troubleshooting

### "Pusher not configured" in console
- Check that you replaced the placeholder key in `homeScreen.js`
- Verify your Pusher app is active

### Games not appearing for other players
- Ensure client events are enabled in Pusher dashboard
- Check that both players are using the same Pusher app credentials

### Game start not syncing
- Verify both players are subscribed to the same game channel
- Check browser console for any Pusher errors

## Cost

Pusher's free tier includes:
- 100 connections per day
- 200,000 messages per day
- SSL encryption

This is sufficient for testing and small-scale usage.
