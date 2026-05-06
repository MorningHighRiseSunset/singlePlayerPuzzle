# Single Player Puzzle Game

A multilingual Scrabble-style puzzle game built with vanilla JavaScript and HTML.

## Features

- **Multiple Languages**: English, Spanish, French, Hindi, Mandarin
- **Responsive Design**: Works on desktop and mobile devices
- **AI Opponent**: Play against computer with intelligent word placement
- **Analytics**: Integrated Vercel Analytics for usage tracking
- **Modern UI**: Clean, intuitive interface with smooth animations

## Deployment

This project is configured for Vercel deployment:

### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect and deploy the project

### Manual Deployment
```bash
# Install dependencies
npm install

# Deploy to Vercel
npm run deploy
```

## Development

### Local Development
```bash
# Start local server
npm run dev

# Or use Python directly
python -m http.server 3000
```

### Testing
```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

## Project Structure

```
├── index.html          # Main landing page
├── game.html           # Game interface
├── [language].html     # Language-specific game pages
├── script.js           # Main game logic
├── homeScreen.js       # Landing page interactions
├── [language].js       # Language-specific dictionaries
├── translations.js     # Internationalization
├── styles.css          # Global styles
├── homeScreen.css      # Landing page styles
├── vercel.json         # Vercel configuration
└── package.json        # Dependencies and scripts
```

## Configuration

### Vercel Analytics
The project includes Vercel Analytics for tracking:
- Page views
- User interactions
- Language preferences
- Game events

Analytics are automatically configured in:
- `index.html` (landing page)
- `game.html` (game interface)

### Environment Variables
No environment variables required for basic functionality.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License
