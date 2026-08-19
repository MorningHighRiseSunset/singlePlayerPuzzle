# Background Music

## Adding More Songs

To add more instrumental songs to the background music playlist:

1. **Add your audio files** to the `backgroundMusic/` folder
   - Supported formats: `.mp3`, `.m4a`, `.wav`, `.ogg`
   - Recommended: Instrumental/ambient music that loops well

2. **Update the playlist** in each game's JavaScript file:
   - `script.js` (English)
   - `french.js`
   - `hindi.js`
   - `mandarin.js`
   - `spanish.js`

3. **Find the `musicPlaylist` array** (around line 10345 in script.js) and add your songs:

```javascript
const musicPlaylist = [
    'backgroundMusic/Background Audio.m4a',
    'backgroundMusic/your-song-1.mp3',
    'backgroundMusic/your-song-2.mp3',
    'backgroundMusic/your-song-3.mp3',
    // Add more songs as needed
];
```

## How It Works

- Music starts **OFF** by default
- Click "🎵 Music Off" in the burger menu to turn it ON
- Songs play in random order (shuffled playlist)
- When a song ends, the next random song automatically plays
- Volume is set to 30% (adjustable in the code)

## Current Songs

- Background Audio.m4a

## Tips

- Use royalty-free or licensed music
- Keep file sizes reasonable for web loading
- Test songs for good loop points if using looped tracks
- Instrumental music works best for gameplay
