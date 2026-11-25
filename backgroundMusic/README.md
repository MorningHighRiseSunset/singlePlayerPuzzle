# Background Music

## Current Tracks

The game includes 4 pensive/ambient music tracks (all CC0/Public Domain, no attribution required):

1. **Background Audio.m4a** - Original track
2. **Contemplation.mp3** - Ambient track by Joth (OpenGameArt)
3. **CathedralForest.ogg** - Seamless ambient loop by congusbongus (OpenGameArt)
4. **DeepDive.mp3** - Ambient chillout track by iamoneabe (OpenGameArt)

## Adding More Tracks

To add more pensive/thinking music tracks:

1. **Download royalty-free pensive music** from these sources:
   - **Open Game Art**: https://opengameart.org/ (Free, CC0/Public Domain available)
   - **Pixabay Music**: https://pixabay.com/music/search/pensive/ (Free, no attribution required)
   - **Freesound**: https://freesound.org/ (Free, requires account)
   - **Incompetech**: https://incompetech.com/music/royalty-free/ (Free with attribution)

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
    'backgroundMusic/Contemplation.mp3',
    'backgroundMusic/CathedralForest.ogg',
    'backgroundMusic/DeepDive.mp3',
    'backgroundMusic/your-new-track.mp3',
];
```

## How It Works

- Music starts **OFF** by default
- Click "🎵 Music Off" in the burger menu to turn it ON
- **Two playback modes**:
  - **🔀 Shuffle All**: Plays all tracks in random order, advancing to the next track when one ends
  - **Single Track**: Select a specific track to loop continuously
- Track selector dropdown appears in the menu (both mobile and desktop drawers)
- Volume is set to 30% (adjustable in the code)
- Track selector automatically populates with all tracks in the playlist

## Tips

- Use royalty-free or licensed music to avoid copyright issues
- Instrumental music without lyrics works best for concentration
- Ambient, calm, and meditative tracks are ideal for puzzle games
- Test songs for good loop points if using looped tracks
- Keep file sizes reasonable for web loading
- Use the shuffle mode for variety, or select a single track if you have a favorite
