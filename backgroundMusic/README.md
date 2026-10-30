# Background Music

## Adding Pensive Music Tracks

To add pensive/thinking music tracks to help players concentrate:

1. **Download royalty-free pensive music** from these sources:
   - **Pixabay Music**: https://pixabay.com/music/search/pensive/ (Free, no attribution required)
   - **Freesound**: https://freesound.org/ (Free, requires account)
   - **Incompetech**: https://incompetech.com/music/royalty-free/ (Free with attribution)
   - **Zapsplat**: https://www.zapsplat.com/ (Free with account)
   - **Open Game Art**: https://opengameart.org/ (Free, game-focused)

   Search for: "ambient", "pensive", "thinking", "calm", "concentration", "puzzle", "meditative"

2. **Add your audio files** to the `backgroundMusic/` folder
   - Supported formats: `.mp3`, `.m4a`, `.wav`, `.ogg`
   - Recommended: Instrumental/ambient music that loops well
   - Keep file sizes under 5MB for faster loading

3. **Update the playlist** in the game's JavaScript file:
   - `script.js` (English) - around line 10458
   - `french.js`
   - `hindi.js`
   - `mandarin.js`
   - `spanish.js`
   - `game-multiplayer-logic.js`

4. **Find the `musicPlaylist` array** and add your songs:

```javascript
const musicPlaylist = [
    'backgroundMusic/Background Audio.m4a',
    // Add more pensive/thinking music tracks here:
    'backgroundMusic/pensive-track-1.mp3',
    'backgroundMusic/pensive-track-2.mp3',
    'backgroundMusic/pensive-track-3.mp3',
    'backgroundMusic/pensive-track-4.mp3',
    'backgroundMusic/pensive-track-5.mp3',
];
```

## How It Works

- Music starts **OFF** by default
- Click "🎵 Music Off" in the burger menu to turn it ON
- **Two playback modes**:
  - **Shuffle All (🔀)**: Plays all tracks in random order, advancing to the next track when one ends
  - **Single Track**: Select a specific track to loop continuously
- Track selector dropdown appears in the menu (both mobile and desktop drawers)
- Volume is set to 30% (adjustable in the code)

## Current Setup

- "Background Audio.m4a" is currently enabled as the default track
- Ready for you to add more pensive music tracks to the playlist
- Track selector automatically populates with all tracks in the playlist

## Tips

- Use royalty-free or licensed music to avoid copyright issues
- Instrumental music without lyrics works best for concentration
- Ambient, calm, and meditative tracks are ideal for puzzle games
- Test songs for good loop points if using looped tracks
- Keep file sizes reasonable for web loading
- Use the shuffle mode for variety, or select a single track if you have a favorite
