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
   - `script.js` (English) - around line 10457
   - `french.js`
   - `hindi.js`
   - `mandarin.js`
   - `spanish.js`

4. **Find the `musicPlaylist` array** and uncomment/add your songs:

```javascript
const musicPlaylist = [
    // 'backgroundMusic/Background Audio.m4a' // Commented out - replacing with pensive music tracks

    // Pensive/Thinking Music Tracks:
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
- Songs play in random order (shuffled playlist)
- When a song ends, the next random song automatically plays
- Volume is set to 30% (adjustable in the code at line 10455)

## Current Setup

- The original "Background Audio.m4a" has been commented out
- Ready for you to add pensive music tracks to the playlist

## Tips

- Use royalty-free or licensed music to avoid copyright issues
- Instrumental music without lyrics works best for concentration
- Ambient, calm, and meditative tracks are ideal for puzzle games
- Test songs for good loop points if using looped tracks
- Keep file sizes reasonable for web loading
