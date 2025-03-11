class ScrabbleGame {
  constructor() {
    this.board = Array(15)
      .fill()
      .map(() => Array(15).fill(null));
    this.tileValues = {
      A: 1,
      B: 3,
      C: 3,
      D: 2,
      E: 1,
      F: 4,
      G: 2,
      H: 4,
      I: 1,
      J: 8,
      K: 5,
      L: 1,
      M: 3,
      N: 1,
      O: 1,
      P: 3,
      Q: 10,
      R: 1,
      S: 1,
      T: 1,
      U: 1,
      V: 4,
      W: 4,
      X: 8,
      Y: 4,
      Z: 10,
      "*": 0,
    };
    this.tileDistribution = {
      A: 9,
      B: 2,
      C: 2,
      D: 4,
      E: 12,
      F: 2,
      G: 3,
      H: 2,
      I: 9,
      J: 1,
      K: 1,
      L: 4,
      M: 2,
      N: 6,
      O: 8,
      P: 2,
      Q: 1,
      R: 6,
      S: 4,
      T: 6,
      U: 4,
      V: 2,
      W: 2,
      X: 1,
      Y: 2,
      Z: 1,
      "*": 2,
    };
    this.setupHintSystem();
    this.previousBoard = null;
    this.tiles = [];
    this.playerRack = [];
    this.aiRack = [];
    this.playerScore = 0;
    this.aiScore = 0;
    this.dictionary = new Set();
    this.currentTurn = "player";
    this.placedTiles = [];
    this.gameEnded = false;
    this.consecutiveSkips = 0;
    this.moveHistory = [];
    this.isFirstMove = true;
    this.exchangeMode = false;
    this.exchangePortal = null;
    this.exchangingTiles = [];
    this.generateTileBag();
    this.init();
  }

  async aiTurn() {
    console.log("AI thinking...");

    // Show "AI is thinking..." message
    const thinkingMessage = document.createElement("div");
    thinkingMessage.className = "ai-thinking-message";
    thinkingMessage.textContent = "AI is thinking...";
    thinkingMessage.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #f0f0f0;
            padding: 10px 20px;
            border-radius: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
    document.body.appendChild(thinkingMessage);
    setTimeout(() => (thinkingMessage.style.opacity = "1"), 100);

    console.log(
      "AI rack:",
      this.aiRack.map((t) => t.letter),
    );

    // First, try to find valid moves
    if (!this.canAIMakeValidMove()) {
      console.log("AI has no valid moves available");

      // Check if exchange is possible (there are tiles in the bag)
      if (this.tiles.length >= 3) {
        console.log("AI choosing to exchange tiles");
        setTimeout(() => {
          thinkingMessage.style.opacity = "0";
          setTimeout(() => {
            thinkingMessage.remove();
            this.handleAIExchange();
          }, 300);
        }, 1000);
      } else {
        console.log("No tiles to exchange - skipping turn");
        setTimeout(() => {
          thinkingMessage.style.opacity = "0";
          setTimeout(() => {
            thinkingMessage.remove();
            this.skipAITurn();
          }, 300);
        }, 1000);
      }
      return;
    }

    // If we can make a move, proceed with finding the best play
    const possiblePlays = this.findAIPossiblePlays();
    console.log("Possible plays found:", possiblePlays.length);

    if (possiblePlays.length > 0) {
      console.log("Available plays:", possiblePlays);
      const bestPlay = possiblePlays.sort((a, b) => b.score - a.score)[0];
      console.log("Choosing play:", bestPlay);

      setTimeout(() => {
        thinkingMessage.style.opacity = "0";
        setTimeout(() => {
          thinkingMessage.remove();
          this.executeAIPlay(bestPlay);
        }, 300);
      }, 1000);
    } else {
      // This is a fallback - should rarely happen since we checked canAIMakeValidMove
      console.log("No valid plays found - skipping turn");
      setTimeout(() => {
        thinkingMessage.style.opacity = "0";
        setTimeout(() => {
          thinkingMessage.remove();
          this.skipAITurn();
        }, 300);
      }, 1000);
    }
  }

  setupHintSystem() {
    const hints = [
      "Triple Word Score (TW) squares multiply the entire word score by 3!",
      "Triple Letter Score (TL) squares multiply just that letter's score by 3!",
      "Using all 7 tiles in one move gives you a 50-point bonus!",
      "Blank tiles can be any letter, but are worth 0 points.",
      "Q and Z are worth 10 points each - try to use them on multiplier squares!",
      "Words must connect to existing tiles on the board (except for the first move).",
      "The center square (marked with ⚜) must be used in the first move.",
      "Try to save S tiles - they're great for making parallel words!",
      "High-scoring letters on TL squares can lead to massive points!",
      "Plan ahead - save valuable tiles for premium squares.",
      "Remember: all new words formed must be valid dictionary words.",
      "Cross-words count too! Check both directions when placing tiles.",
      "You can exchange tiles instead of playing a word - but you'll lose your turn.",
      "The letter 'S' can often be added to existing words to form new ones!",
      "Look for opportunities to play parallel words along existing ones.",
      "Short two-letter words can be valuable for creating multiple scoring opportunities.",
      "Common prefixes like 'RE-', 'UN-', and 'IN-' can help extend words.",
      "Common suffixes like '-ING', '-ED', and '-S' can help extend words.",
      "Keep a balance of vowels and consonants in your rack.",
      "Try to use high-scoring letters (J, X, Q, Z) on premium squares.",
      "Playing through existing words can create multiple scoring opportunities.",
      "Look for hook letters that can change existing words (e.g., HEAT to CHEAT).",
      "Save some good letters for later when better opportunities arise.",
      "Consider exchanging tiles if you have too many consonants or vowels.",
      "The letter 'Q' is usually followed by 'U' - save a 'U' if you have a 'Q'.",
      "Think defensively - avoid setting up TW squares for your opponent.",
      "The letters A, E, I, O, U are most common - use them wisely to connect words.",
      "Playing across multiple premium squares multiplies your score significantly!",
      "Look for opportunities to form two or more words in a single play.",
      "The more letters you play, the higher your potential score.",
      "Remember common two-letter words like AA, AB, AD, AE, AG, AH, AI, AL, AM, AN, AR, AS, AT, AW, AX, AY.",
      "Challenge yourself to use all seven tiles for the 50-point bonus!",
      "Position high-value letters strategically to maximize points.",
      "Watch out for blocked positions where no more words can be played.",
      "Try to keep at least two vowels in your rack for flexibility.",
      "The board edges can be valuable for high-scoring plays.",
      "Look for opportunities to create multiple small words simultaneously.",
      "Some letters (like S, E, R, T) can be saved for extending existing words.",
      "Consider blocking premium squares if your opponent is leading.",
      "Use blank tiles strategically - they're most valuable for high-scoring plays.",
      "Remember that longer words aren't always better - sometimes short words score more.",
      "Keep track of which high-value letters have been played.",
      "Look for opportunities to play 'bingos' (using all 7 tiles) for the bonus.",
      "Consider the remaining tiles when planning your strategy.",
      "Some premium squares are more valuable than others based on playable words.",
      "Contact Maurice's Email @ Maurice13stu@gmail.com if you have any suggestions!",
    ];

    let currentHintIndex = 0;
    const hintBox = document.getElementById("hint-box");
    const hintText = document.getElementById("hint-text");

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Create a shuffled copy of hints
    let shuffledHints = shuffleArray([...hints]);

    const showNextHint = () => {
      // If we've shown all hints, reshuffle and start over
      if (currentHintIndex >= shuffledHints.length) {
        shuffledHints = shuffleArray([...hints]);
        currentHintIndex = 0;
      }

      hintText.textContent = shuffledHints[currentHintIndex];
      hintBox.classList.add("show");

      setTimeout(() => {
        hintBox.classList.remove("show");
      }, 5000); // Hide after 5 seconds

      currentHintIndex++;
    };

    // Show first hint after 5 seconds
    setTimeout(() => {
      showNextHint();
      // Then show new hints every 30 seconds
      setInterval(showNextHint, 30000);
    }, 5000);

    // Show random hint on hover
    hintBox.addEventListener("mouseenter", () => {
      // Show a random hint from the shuffled array
      hintText.textContent =
        shuffledHints[Math.floor(Math.random() * shuffledHints.length)];
      hintBox.classList.add("show");
    });

    hintBox.addEventListener("mouseleave", () => {
      hintBox.classList.remove("show");
    });
  }

  findAIPossiblePlays() {
    const possiblePlays = [];
    const anchors = this.findAnchors();
    const availableLetters = this.aiRack.map((tile) => tile.letter);
    const existingWords = this.getExistingWords();

    console.log("Available letters:", availableLetters);
    console.log("Anchors found:", anchors);
    console.log("Existing words:", existingWords);

    // If not enough tiles for minimum word length, check for shorter words
    if (availableLetters.length < 4) {
      const shortWords = Array.from(this.dictionary).filter(
        (word) =>
          word.length >= 2 &&
          word.length <= availableLetters.length &&
          this.canFormWord(word, "", "", availableLetters),
      );

      if (shortWords.length > 0) {
        for (const word of shortWords) {
          const upperWord = word.toUpperCase();
          if (this.isValidAIPlacement(upperWord, 7, 7, true)) {
            possiblePlays.push({
              word: upperWord,
              startPos: { row: 7, col: 7 },
              isHorizontal: true,
              score: this.calculatePotentialScore(upperWord, 7, 7, true),
            });
          }
        }
      }
    }

    // Handle first move or empty board
    if (
      this.isFirstMove ||
      this.board.every((row) => row.every((cell) => cell === null))
    ) {
      const words = Array.from(this.dictionary);
      for (const word of words) {
        if (word.length < 3) continue;
        if (!this.dictionary.has(word.toLowerCase())) continue;

        if (
          word.length <= availableLetters.length &&
          this.canFormWord(word, "", "", availableLetters)
        ) {
          const upperWord = word.toUpperCase();
          if (existingWords.includes(upperWord)) continue;

          const centerPos = { row: 7, col: 7 - Math.floor(word.length / 2) };
          if (
            this.isValidAIPlacement(
              upperWord,
              centerPos.row,
              centerPos.col,
              true,
            )
          ) {
            possiblePlays.push({
              word: upperWord,
              startPos: centerPos,
              isHorizontal: true,
              score: this.calculatePotentialScore(
                upperWord,
                centerPos.row,
                centerPos.col,
                true,
              ),
            });
          }
        }
      }
    } else {
      // For subsequent moves
      anchors.forEach((anchor) => {
        const hPrefix = this.getPrefix(anchor, true);
        const hSuffix = this.getSuffix(anchor, true);
        const vPrefix = this.getPrefix(anchor, false);
        const vSuffix = this.getSuffix(anchor, false);

        for (const word of this.dictionary) {
          if (word.length < 3) continue;
          if (!this.dictionary.has(word.toLowerCase())) continue;

          const upperWord = word.toUpperCase();
          if (existingWords.includes(upperWord)) continue;

          // Try horizontal placement
          if (this.canFormWord(upperWord, hPrefix, hSuffix, availableLetters)) {
            const startCol = anchor.col - hPrefix.length;
            if (
              this.isValidAIPlacement(upperWord, anchor.row, startCol, true)
            ) {
              possiblePlays.push({
                word: upperWord,
                startPos: { row: anchor.row, col: startCol },
                isHorizontal: true,
                score: this.calculatePotentialScore(
                  upperWord,
                  anchor.row,
                  startCol,
                  true,
                ),
              });
            }
          }

          // Try vertical placement
          if (this.canFormWord(upperWord, vPrefix, vSuffix, availableLetters)) {
            const startRow = anchor.row - vPrefix.length;
            if (
              this.isValidAIPlacement(upperWord, startRow, anchor.col, false)
            ) {
              possiblePlays.push({
                word: upperWord,
                startPos: { row: startRow, col: anchor.col },
                isHorizontal: false,
                score: this.calculatePotentialScore(
                  upperWord,
                  startRow,
                  anchor.col,
                  false,
                ),
              });
            }
          }
        }
      });
    }

    // Filter plays based on new criteria
    return possiblePlays
      .filter((play) => {
        // Reject plays that create too many short words
        if (
          this.wouldCreateStackedShortWords(
            play.word,
            play.startPos.row,
            play.startPos.col,
            play.isHorizontal,
          )
        ) {
          return false;
        }

        // Reject plays that stack words too closely
        if (
          this.hasNearbyParallelWords(
            play.startPos.row,
            play.startPos.col,
            play.isHorizontal,
          )
        ) {
          return false;
        }

        // Prefer longer words
        if (play.word.length <= 3) {
          // Only allow short words if they create no parallel words
          return !this.hasParallelWord(
            play.startPos.row,
            play.startPos.col,
            play.isHorizontal,
          );
        }

        return true;
      })
      .sort((a, b) => b.score - a.score);

    // Handle first move or empty board
    if (
      this.isFirstMove ||
      this.board.every((row) => row.every((cell) => cell === null))
    ) {
      const words = Array.from(this.dictionary);
      for (const word of words) {
        // Skip words shorter than 5 letters
        if (word.length < 3) continue;

        if (!this.dictionary.has(word.toLowerCase())) {
          continue;
        }

        if (word.length <= availableLetters.length) {
          const upperWord = word.toUpperCase();
          if (existingWords.includes(upperWord)) {
            console.log(`Skipping ${upperWord} - already exists on board`);
            continue;
          }
          if (this.canFormWord(word, "", "", availableLetters)) {
            const centerPos = { row: 7, col: 7 - Math.floor(word.length / 2) };
            if (
              this.isValidAIPlacement(
                upperWord,
                centerPos.row,
                centerPos.col,
                true,
              )
            ) {
              possiblePlays.push({
                word: upperWord,
                startPos: centerPos,
                isHorizontal: true,
                score: this.calculatePotentialScore(
                  upperWord,
                  centerPos.row,
                  centerPos.col,
                  true,
                ),
              });
            }
          }
        }
      }
    } else {
      // For subsequent moves
      anchors.forEach((anchor) => {
        const hPrefix = this.getPrefix(anchor, true);
        const hSuffix = this.getSuffix(anchor, true);
        const vPrefix = this.getPrefix(anchor, false);
        const vSuffix = this.getSuffix(anchor, false);

        for (const word of this.dictionary) {
          // Skip words shorter than 5 letters
          if (word.length < 3) continue;

          if (!this.dictionary.has(word.toLowerCase())) {
            continue;
          }

          const upperWord = word.toUpperCase();

          if (existingWords.includes(upperWord)) {
            console.log(`Skipping ${upperWord} - already exists on board`);
            continue;
          }

          // Try horizontal placement
          if (this.canFormWord(upperWord, hPrefix, hSuffix, availableLetters)) {
            const startCol = anchor.col - hPrefix.length;
            if (
              this.isValidAIPlacement(upperWord, anchor.row, startCol, true)
            ) {
              const score = this.calculatePotentialScore(
                upperWord,
                anchor.row,
                startCol,
                true,
              );
              possiblePlays.push({
                word: upperWord,
                startPos: { row: anchor.row, col: startCol },
                isHorizontal: true,
                score,
              });
            }
          }

          // Try vertical placement
          if (this.canFormWord(upperWord, vPrefix, vSuffix, availableLetters)) {
            const startRow = anchor.row - vPrefix.length;
            if (
              this.isValidAIPlacement(upperWord, startRow, anchor.col, false)
            ) {
              const score = this.calculatePotentialScore(
                upperWord,
                startRow,
                anchor.col,
                false,
              );
              possiblePlays.push({
                word: upperWord,
                startPos: { row: startRow, col: anchor.col },
                isHorizontal: false,
                score,
              });
            }
          }
        }
      });
    }

    // Filter out duplicates
    const uniquePlays = possiblePlays.filter(
      (play, index, self) =>
        index ===
        self.findIndex(
          (p) =>
            p.word === play.word &&
            p.startPos.row === play.startPos.row &&
            p.startPos.col === play.startPos.col &&
            p.isHorizontal === play.isHorizontal,
        ),
    );

    console.log(`Found ${uniquePlays.length} possible plays after filtering`);

    // Sort by score (highest first)
    return uniquePlays.sort((a, b) => b.score - a.score);
  }

  findSimpleWords(letters) {
    const words = new Set();
    const letterCount = {};

    // Count available letters
    letters.forEach((letter) => {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    });

    // Check each word in dictionary
    for (const word of this.dictionary) {
      if (word.length >= 2 && word.length <= letters.length) {
        const upperWord = word.toUpperCase();
        const tempCount = { ...letterCount };
        let canForm = true;

        // Check if we have all needed letters
        for (const letter of upperWord) {
          if (!tempCount[letter] || tempCount[letter] === 0) {
            canForm = false;
            break;
          }
          tempCount[letter]--;
        }

        if (canForm) {
          words.add(upperWord);
        }
      }
    }

    return Array.from(words);
  }

  findAnchors() {
    const anchors = [];

    // If it's the first move, return center square
    if (this.isFirstMove) {
      return [{ row: 7, col: 7 }];
    }

    // Find all positions adjacent to existing tiles
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (!this.board[row][col] && this.hasAdjacentTile(row, col)) {
          anchors.push({ row, col });
        }
      }
    }
    return anchors;
  }

  hasAdjacentTile(row, col) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    return directions.some(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      return (
        newRow >= 0 &&
        newRow < 15 &&
        newCol >= 0 &&
        newCol < 15 &&
        this.board[newRow][newCol] !== null
      );
    });
  }

  // Function to find possible words at an anchor point
  findPossibleWordsAtAnchor(anchor, isHorizontal, availableLetters) {
    const plays = [];
    const prefix = this.getPrefix(anchor, isHorizontal);
    const suffix = this.getSuffix(anchor, isHorizontal);

    // Get all possible words from dictionary that can be formed
    // with available letters and must connect with existing tiles
    for (const word of this.dictionary) {
      if (this.canFormWord(word, prefix, suffix, availableLetters)) {
        const play = this.createPlay(
          word,
          anchor,
          isHorizontal,
          prefix,
          suffix,
        );
        if (play) {
          plays.push(play);
        }
      }
    }

    return plays;
  }

  async getWordDefinition(word) {
    // Skip special moves and compound words
    if (word === "SKIP" || word === "EXCHANGE" || word === "QUIT" || word.includes("&")) {
        return null;
    }

    // Clean up the word - remove scores and parentheses
    const cleanWord = word.split('(')[0].trim();

    try {
        // Fetch from the dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord.toLowerCase()}`);
        
        // Handle API errors
        if (!response.ok) {
            console.log(`No definition found for: ${cleanWord}`);
            return null;
        }

        const data = await response.json();
        
        // Extract and format the definitions
        if (data && data[0] && data[0].meanings) {
            return data[0].meanings.map(meaning => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions
                    .slice(0, 2) // Limit to first 2 definitions per part of speech
                    .map(def => def.definition)
            }));
        }
        
        return null;
    } catch (error) {
        console.error(`Error fetching definition for ${word}:`, error);
        return null;
    }
}

generatePrintContent(gameDate, wordDefinitions) {
    // Generate header with game information
    const header = `
        <div class="header">
            <h1>Scrabble Game History</h1>
            <p>Game played on: ${gameDate}</p>
            <div class="scores">
                <h2>Final Scores</h2>
                <p>Player: ${this.playerScore} points</p>
                <p>Computer: ${this.aiScore} points</p>
                <p>Winner: ${this.playerScore > this.aiScore ? 'Player' : 'Computer'}</p>
            </div>
        </div>
    `;

    // Generate content for each move
    const moves = this.moveHistory.map((move, index) => {
        // Handle special moves (SKIP, EXCHANGE, QUIT)
        if (move.word === "SKIP" || move.word === "EXCHANGE" || move.word === "QUIT") {
            return `
                <div class="move">
                    <div class="move-header">
                        <h3>Move ${index + 1}</h3>
                        <p><strong>Player:</strong> ${move.player}</p>
                        <p><strong>Action:</strong> ${move.word}</p>
                        <p><strong>Score:</strong> ${move.score}</p>
                    </div>
                </div>
            `;
        }

        // Handle regular word moves
        let wordContent = '';
        let words;

        // Handle multiple words (separated by &)
        if (move.word.includes('&')) {
            words = move.word.split('&').map(w => {
                // Extract word and score from format "WORD (score)"
                const match = w.trim().match(/([A-Z]+)\s*\((\d+)\)/);
                return match ? match[1] : w.trim();
            });
        } else {
            // Handle single word
            const match = move.word.match(/([A-Z]+)\s*(?:\((\d+)\))?/);
            words = match ? [match[1]] : [move.word];
        }

        // Generate definition sections for each word
        const definitions = words.map(word => {
            const def = wordDefinitions.get(word);
            if (!def) return '';

            return `
                <div class="word-section">
                    <div class="word-header">
                        <h4>${word}</h4>
                    </div>
                    <div class="definitions">
                        ${def.map(meaning => `
                            <div class="meaning">
                                <span class="part-of-speech">${meaning.partOfSpeech}</span>
                                <ul>
                                    ${meaning.definitions.map(d => `
                                        <li>${d}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        // Combine all elements for this move
        return `
            <div class="move">
                <div class="move-header">
                    <h3>Move ${index + 1}</h3>
                    <p><strong>Player:</strong> ${move.player}</p>
                    <p><strong>Word(s):</strong> ${move.word}</p>
                    <p><strong>Score:</strong> ${move.score}</p>
                </div>
                <div class="definitions-container">
                    ${definitions}
                </div>
            </div>
        `;
    }).join('');

    // Add additional styling
    const styles = `
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                line-height: 1.6;
                color: #333;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #333;
            }
            .scores {
                margin: 20px 0;
                padding: 15px;
                background: #f5f5f5;
                border-radius: 5px;
            }
            .move {
                margin: 20px 0;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #f9f9f9;
            }
            .move-header {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ddd;
            }
            .word-section {
                margin: 15px 0;
                padding-left: 20px;
                border-left: 3px solid #3498db;
            }
            .word-header {
                font-size: 1.2em;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            .part-of-speech {
                color: #e67e22;
                font-style: italic;
                font-weight: bold;
            }
            .definitions {
                margin-left: 20px;
            }
            .meaning {
                margin: 10px 0;
            }
            ul {
                margin: 5px 0;
                padding-left: 20px;
            }
            li {
                margin: 5px 0;
            }
            @media print {
                .move {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
            }
        </style>
    `;

    // Return complete HTML content
    return `
        ${styles}
        ${header}
        <div class="moves-container">
            ${moves}
        </div>
    `;
}

  getPrefix(anchor, isHorizontal) {
    let prefix = "";
    let { row, col } = anchor;

    if (isHorizontal) {
      col--;
      while (col >= 0 && this.board[row][col]) {
        prefix = this.board[row][col].letter + prefix;
        col--;
      }
    } else {
      row--;
      while (row >= 0 && this.board[row][col]) {
        prefix = this.board[row][col].letter + prefix;
        row--;
      }
    }
    return prefix;
  }

  getSuffix(anchor, isHorizontal) {
    let suffix = "";
    let { row, col } = anchor;

    if (isHorizontal) {
      col++;
      while (col < 15 && this.board[row][col]) {
        suffix += this.board[row][col].letter;
        col++;
      }
    } else {
      row++;
      while (row < 15 && this.board[row][col]) {
        suffix += this.board[row][col].letter;
        row++;
      }
    }
    return suffix;
  }

  canAIMakeValidMove() {
    if (this.aiRack.length < 3) {
      console.log("Not enough tiles for minimum word length - will skip turn");
      return false;
    }

    const availableLetters = this.aiRack.map((tile) => tile.letter);
    console.log("Checking possible moves with letters:", availableLetters);

    // Count vowels and consonants
    const vowels = ["A", "E", "I", "O", "U"];
    const vowelCount = availableLetters.filter((l) =>
      vowels.includes(l),
    ).length;
    const consonantCount = availableLetters.length - vowelCount;

    // Consider exchanging if rack is very unbalanced
    if (
      vowelCount === 0 ||
      consonantCount === 0 ||
      vowelCount > 5 ||
      consonantCount > 5
    ) {
      console.log("Rack is unbalanced - considering exchange");
      return false;
    }

    // Check if we can form any words
    for (const word of this.dictionary) {
      if (
        word.length >= 3 &&
        this.canFormWord(word, "", "", availableLetters)
      ) {
        console.log("Found possible move:", word);
        return true;
      }
    }

    console.log("No valid moves found with current rack");
    return false;
  }

  // Update inside findAIPossiblePlays method
  canFormWord(word, prefix, suffix, availableLetters) {
    word = word.toUpperCase();
    prefix = prefix.toUpperCase();
    suffix = suffix.toUpperCase();

    // Create a copy of available letters for counting
    const letterCount = {};
    let blankCount = availableLetters.filter((l) => l === "*").length;

    availableLetters.forEach((letter) => {
      if (letter !== "*") {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
      }
    });

    // For first move or starting fresh
    if (!prefix && !suffix) {
      for (const letter of word) {
        if (letterCount[letter]) {
          letterCount[letter]--;
        } else if (blankCount > 0) {
          blankCount--; // Use blank tile
        } else {
          return false;
        }
      }
      return true;
    }

    // For subsequent moves
    if (!word.includes(prefix) || !word.includes(suffix)) {
      return false;
    }

    const neededPart = word.replace(prefix, "").replace(suffix, "").split("");

    for (const letter of neededPart) {
      if (letterCount[letter]) {
        letterCount[letter]--;
      } else if (blankCount > 0) {
        blankCount--; // Use blank tile
      } else {
        return false;
      }
    }

    return true;
  }

  createPlay(word, anchor, isHorizontal, prefix, suffix) {
    const startPos = {
      row: anchor.row - (isHorizontal ? 0 : prefix.length),
      col: anchor.col - (isHorizontal ? prefix.length : 0),
    };

    // Verify the play is valid and calculate score
    const score = this.calculatePlayScore(word, startPos, isHorizontal);

    return {
      word,
      startPos,
      isHorizontal,
      score,
    };
  }

  async executeAIPlay(play) {
    const { word, startPos, isHorizontal, score } = play;
    console.log("AI executing play:", { word, startPos, isHorizontal, score });

    // Double check word validity
    if (!this.dictionary.has(word.toLowerCase())) {
      console.log(`Invalid word ${word} - skipping AI turn`);
      this.skipAITurn();
      return;
    }

    // Store the previous board state
    this.previousBoard = JSON.parse(JSON.stringify(this.board));

    // Create the placedTiles array for the AI's move
    this.placedTiles = Array.from(word).map((letter, i) => ({
      row: isHorizontal ? startPos.row : startPos.row + i,
      col: isHorizontal ? startPos.col + i : startPos.col,
      tile: {
        letter: letter,
        value: this.tileValues[letter],
        id: `ai_${letter}_${Date.now()}_${i}`,
      },
    }));

    return new Promise(async (resolve) => {
      // Start placing tiles with animation
      for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        const row = isHorizontal ? startPos.row : startPos.row + i;
        const col = isHorizontal ? startPos.col + i : startPos.col;

        if (!this.board[row][col]) {
          // Find matching tile or blank tile
          let tileIndex = this.aiRack.findIndex((t) => t.letter === letter);
          if (tileIndex === -1) {
            // Try to use blank tile
            tileIndex = this.aiRack.findIndex((t) => t.letter === "*");
            if (tileIndex !== -1) {
              // Convert blank tile to needed letter
              this.aiRack[tileIndex] = {
                letter: letter,
                value: 0, // Blank tiles are worth 0 points
                id: `blank_${Date.now()}_${i}`,
                isBlank: true,
              };
            }
          }

          if (tileIndex !== -1) {
            const tile = {
              letter: letter,
              value: this.aiRack[tileIndex].isBlank
                ? 0
                : this.tileValues[letter],
              id: this.aiRack[tileIndex].isBlank
                ? `blank_${letter}_${Date.now()}_${i}`
                : `ai_${letter}_${Date.now()}_${i}`,
              isBlank: this.aiRack[tileIndex].isBlank,
            };

            // Create animated tile element
            const animatedTile = document.createElement("div");
            animatedTile.className = "tile animated-tile";
            animatedTile.innerHTML = `
                            ${tile.letter}
                            <span class="points">${tile.value}</span>
                            ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
                        `;

            // Get target cell position
            const targetCell = document.querySelector(
              `[data-row="${row}"][data-col="${col}"]`,
            );
            const targetRect = targetCell.getBoundingClientRect();

            // Animation setup
            animatedTile.style.cssText = `
                            position: fixed;
                            top: -50px;
                            left: ${targetRect.left}px;
                            transform: rotate(-180deg);
                            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                            z-index: 1000;
                        `;

            document.body.appendChild(animatedTile);

            // Animate tile placement
            await new Promise((resolve) => {
              setTimeout(() => {
                animatedTile.style.top = `${targetRect.top}px`;
                animatedTile.style.transform = "rotate(0deg)";

                setTimeout(() => {
                  // Add bounce effect
                  animatedTile.style.transform = "rotate(0deg) scale(1.2)";
                  setTimeout(() => {
                    animatedTile.style.transform = "rotate(0deg) scale(1)";
                  }, 100);
                }, 800);

                // Place tile on board
                setTimeout(() => {
                  targetCell.classList.add("tile-placed");
                  animatedTile.remove();

                  // Remove tile from AI rack and place on board
                  this.aiRack.splice(tileIndex, 1);
                  this.board[row][col] = tile;
                  this.renderAIRack();

                  // Create permanent tile element
                  const permanentTile = document.createElement("div");
                  permanentTile.className = "tile";
                  if (tile.isBlank) {
                    permanentTile.classList.add("blank-tile");
                  }
                  permanentTile.style.cssText = `
                                        background: linear-gradient(145deg, #ffffff, #f0f0f0);
                                        color: #000;
                                    `;
                  permanentTile.innerHTML = `
                                        ${tile.letter}
                                        <span class="points" style="color: #000;">${tile.value}</span>
                                        ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
                                    `;

                  // Clear cell and add permanent tile
                  targetCell.innerHTML = "";
                  targetCell.appendChild(permanentTile);

                  setTimeout(() => {
                    targetCell.classList.remove("tile-placed");
                  }, 500);

                  resolve();
                }, 1000);
              }, 200);
            });

            // Delay between letters
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }

      // Update game state after all animations complete
      setTimeout(() => {
        // Get all formed words and calculate total score
        const formedWords = this.getFormedWords();
        let totalScore = 0;
        let wordsList = [];

        formedWords.forEach((wordInfo) => {
          const { word, startPos, direction } = wordInfo;
          const wordScore = this.calculateWordScore(
            word,
            startPos.row,
            startPos.col,
            direction === "horizontal",
          );
          totalScore += wordScore;
          wordsList.push({ word, score: wordScore });
          console.log(`Word formed: ${word} for ${wordScore} points`);
        });

        // Add bonus for using all 7 tiles
        if (word.length === 7) {
          totalScore += 50;
          console.log("Added 50 point bonus for using all 7 tiles");
        }

        // Format move description for multiple words
        let moveDescription;
        if (wordsList.length > 1) {
          moveDescription = wordsList
            .map((w) => `${w.word} (${w.score})`)
            .join(" & ");
        } else {
          moveDescription = wordsList[0].word;
        }

        console.log(`Total score for move: ${totalScore}`);

        this.aiScore += totalScore;
        this.isFirstMove = false;
        this.consecutiveSkips = 0;
        this.currentTurn = "player";
        this.addToMoveHistory("Computer", moveDescription, totalScore);

        // Clear the placed tiles array after scoring
        this.placedTiles = [];

        // Refill racks and update display
        this.fillRacks();
        this.updateGameState();
        resolve();
      }, 500);
    });
  }

  calculateWordScore(word, startRow, startCol, isHorizontal) {
    let wordScore = 0;
    let wordMultiplier = 1;

    for (let i = 0; i < word.length; i++) {
      const row = isHorizontal ? startRow : startRow + i;
      const col = isHorizontal ? startCol + i : startCol;
      const tile = this.board[row][col];
      let letterScore = tile.value;

      // Only apply premium squares if this tile was just placed
      if (!this.previousBoard || !this.previousBoard[row][col]) {
        const premium = this.getPremiumSquareType(row, col);
        if (premium === "dl") letterScore *= 2;
        if (premium === "tl") letterScore *= 3;
        if (premium === "dw") wordMultiplier *= 2;
        if (premium === "tw") wordMultiplier *= 3;
      }

      wordScore += letterScore;
    }

    return wordScore * wordMultiplier;
  }

  findBestMove() {
    const possibleMoves = this.findPossibleMoves();
    if (possibleMoves.length === 0) return null;

    // Sort moves by:
    // 1. Score (highest first)
    // 2. Word length (longer words preferred)
    // 3. Position (prefer center positions)
    return possibleMoves.sort((a, b) => {
      // First compare scores
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      // If scores are equal, prefer longer words
      if (b.word.length !== a.word.length) {
        return b.word.length - a.word.length;
      }

      // If lengths are equal, prefer positions closer to center
      const centerDistance = (pos) => {
        const centerRow = 7,
          centerCol = 7;
        return Math.abs(pos.row - centerRow) + Math.abs(pos.col - centerCol);
      };

      return centerDistance(a) - centerDistance(b);
    })[0];
  }

  findPossibleMoves() {
    const moves = [];
    const letters = this.aiRack.map((tile) => tile.letter);

    // Get all possible words that can be formed with the rack
    const possibleWords = this.findPossibleWords(letters);

    // Find valid placements for each word
    for (const word of possibleWords) {
      // Try horizontal placements
      for (let row = 0; row < 15; row++) {
        for (let col = 0; col <= 15 - word.length; col++) {
          if (this.isValidAIPlacement(word, row, col, true)) {
            const score = this.calculatePotentialScore(word, row, col, true);
            moves.push({ word, row, col, horizontal: true, score });
          }
        }
      }

      // Try vertical placements
      for (let row = 0; row <= 15 - word.length; row++) {
        for (let col = 0; col < 15; col++) {
          if (this.isValidAIPlacement(word, row, col, false)) {
            const score = this.calculatePotentialScore(word, row, col, false);
            moves.push({ word, row, col, horizontal: false, score });
          }
        }
      }
    }

    return moves;
  }

  findPossibleWords(letters) {
    const possibleWords = new Set();
    const maxLength = Math.min(15, letters.length);

    // Convert letters to lowercase for dictionary matching
    const lowerLetters = letters.map((l) => l.toLowerCase());

    // Try each word in the dictionary
    for (const word of this.dictionary) {
      if (word.length >= 2 && word.length <= maxLength) {
        // Check if we can make this word with our letters
        const letterCount = {};
        let canForm = true;

        // Count available letters
        lowerLetters.forEach((letter) => {
          letterCount[letter] = (letterCount[letter] || 0) + 1;
        });

        // Check if we have enough letters for the word
        for (const letter of word) {
          if (!letterCount[letter] || letterCount[letter] === 0) {
            canForm = false;
            break;
          }
          letterCount[letter]--;
        }

        if (canForm) {
          possibleWords.add(word.toUpperCase());
        }
      }
    }

    return Array.from(possibleWords);
  }

  isValidAIPlacement(word, startRow, startCol, horizontal) {
    // Enforce minimum 3-letter word length
    if (word.length < 3) {
      console.log(`Rejecting ${word} - words must be at least 3 letters long`);
      return false;
    }

    if (!this.dictionary.has(word.toLowerCase())) {
      console.log(`${word} is not a valid word in the dictionary`);
      return false;
    }

    // Check basic boundary conditions
    if (horizontal) {
      if (
        startCol < 0 ||
        startCol + word.length > 15 ||
        startRow < 0 ||
        startRow > 14
      ) {
        return false;
      }
    } else {
      if (
        startRow < 0 ||
        startRow + word.length > 15 ||
        startCol < 0 ||
        startCol > 14
      ) {
        return false;
      }
    }

    let tempBoard = JSON.parse(JSON.stringify(this.board));
    let hasValidConnection = false;

    // Place the word temporarily on the board
    for (let i = 0; i < word.length; i++) {
      const row = horizontal ? startRow : startRow + i;
      const col = horizontal ? startCol + i : startCol;

      if (tempBoard[row][col]) {
        if (tempBoard[row][col].letter !== word[i]) {
          return false;
        }
        hasValidConnection = true;
      } else {
        tempBoard[row][col] = { letter: word[i] };
      }

      if (this.hasAdjacentTile(row, col)) {
        hasValidConnection = true;
      }

      // Check formed words at this position
      const formedWords = this.getAllFormedWords(row, col, tempBoard);
      for (const formedWord of formedWords) {
        if (!this.dictionary.has(formedWord.toLowerCase())) {
          console.log(`Invalid word formed: ${formedWord}`);
          return false;
        }
      }
    }

    return this.isFirstMove || hasValidConnection;
  }

  getAllFormedWords(row, col, board) {
    const words = new Set();

    // Check horizontal word
    let horizontalWord = "";
    let startCol = col;
    // Find start of horizontal word
    while (startCol > 0 && board[row][startCol - 1]) startCol--;

    // Build horizontal word
    let currentCol = startCol;
    while (currentCol < 15 && board[row][currentCol]) {
      if (!board[row][currentCol].letter) {
        console.log("Invalid board state at:", row, currentCol);
        return [];
      }
      horizontalWord += board[row][currentCol].letter;
      currentCol++;
    }

    // Check vertical word
    let verticalWord = "";
    let startRow = row;
    // Find start of vertical word
    while (startRow > 0 && board[startRow - 1][col]) startRow--;

    // Build vertical word
    let currentRow = startRow;
    while (currentRow < 15 && board[currentRow][col]) {
      if (!board[currentRow][col].letter) {
        console.log("Invalid board state at:", currentRow, col);
        return [];
      }
      verticalWord += board[currentRow][col].letter;
      currentRow++;
    }

    // Only add words that are longer than 2 letter
    if (horizontalWord.length > 2) {
      words.add(horizontalWord);
      console.log("Found horizontal word:", horizontalWord);
    }
    if (verticalWord.length > 2) {
      words.add(verticalWord);
      console.log("Found vertical word:", verticalWord);
    }

    return Array.from(words);
  }

  // Add this check in isValidAIPlacement
  checkParallelWords(word, startRow, startCol, horizontal, tempBoard) {
    for (let i = 0; i < word.length; i++) {
      const row = horizontal ? startRow : startRow + i;
      const col = horizontal ? startCol + i : startCol;

      // Check parallel lines (the line above and below for horizontal words,
      // or left and right for vertical words)
      const positions = horizontal
        ? [
            [row - 1, col],
            [row + 1, col],
          ] // Check above and below
        : [
            [row, col - 1],
            [row, col + 1],
          ]; // Check left and right

      for (const [r, c] of positions) {
        if (r >= 0 && r < 15 && c >= 0 && c < 15 && tempBoard[r][c]) {
          // If there's a tile in parallel, this placement might create invalid words
          return false;
        }
      }
    }
    return true;
  }

  // Add this helper method to get cross words
  getCrossWordAt(row, col, isHorizontal, tempBoard) {
    let word = "";
    let start = isHorizontal ? col : row;

    // Find start of word
    while (
      start > 0 &&
      tempBoard[isHorizontal ? row : start - 1][isHorizontal ? start - 1 : col]
    ) {
      start--;
    }

    // Build word
    let current = start;
    while (
      current < 15 &&
      tempBoard[isHorizontal ? row : current][isHorizontal ? current : col]
    ) {
      word +=
        tempBoard[isHorizontal ? row : current][isHorizontal ? current : col]
          .letter;
      current++;
    }

    return word.length > 1 ? word : null;
  }

  isAbbreviation(word) {
    // Common abbreviations to explicitly exclude
    const commonAbbreviations = new Set([
      "USA",
      "UK",
      "TV",
      "FBI",
      "CIA",
      "NASA",
      "DNA",
      "PhD",
      "Mr",
      "Mrs",
      "Ms",
      "Dr",
      "Prof",
      "Sr",
      "Jr",
      "Corp",
      "Inc",
      "Ltd",
      "ATM",
      "PC",
      "USB",
      "RAM",
      "ROM",
      "CEO",
      "CFO",
      "CTO",
      "HR",
      "VP",
    ]);

    // Convert to uppercase for checking
    const upperWord = word.toUpperCase();

    // Check if word is in our abbreviations list
    if (commonAbbreviations.has(upperWord)) {
      console.log(`${word} is a known abbreviation - skipping`);
      return true;
    }

    // Remove the all-caps check for short words since many are valid
    // Check for mixed case with periods (e.g., "Ph.D.")
    if (word.includes(".")) {
      console.log(`${word} contains periods - likely an abbreviation`);
      return true;
    }

    return false;
  }

  getExistingWords() {
    const words = new Set();

    // Check horizontal words
    for (let row = 0; row < 15; row++) {
      let word = "";
      for (let col = 0; col < 15; col++) {
        if (this.board[row][col]) {
          word += this.board[row][col].letter;
        } else if (word.length > 1) {
          words.add(word);
          word = "";
        } else {
          word = "";
        }
      }
      if (word.length > 1) {
        words.add(word);
      }
    }

    // Check vertical words
    for (let col = 0; col < 15; col++) {
      let word = "";
      for (let row = 0; row < 15; row++) {
        if (this.board[row][col]) {
          word += this.board[row][col].letter;
        } else if (word.length > 1) {
          words.add(word);
          word = "";
        } else {
          word = "";
        }
      }
      if (word.length > 1) {
        words.add(word);
      }
    }

    const existingWords = Array.from(words);
    console.log("Existing words on board:", existingWords);
    return existingWords;
  }

  calculatePotentialScore(word, startRow, startCol, horizontal) {
    // Reject two-letter words immediately
    if (word.length <= 2) {
      return -999999;
    }

    let totalScore = 0;
    let tempBoard = JSON.parse(JSON.stringify(this.board));
    let parallelWordCount = 0;

    // First, place the word temporarily
    for (let i = 0; i < word.length; i++) {
      const row = horizontal ? startRow : startRow + i;
      const col = horizontal ? startCol + i : startCol;
      if (!tempBoard[row][col]) {
        tempBoard[row][col] = {
          letter: word[i],
          value: this.tileValues[word[i]],
        };
      }
    }

    // Get all formed words and calculate base score
    const formedWords = this.getFormedWords();
    formedWords.forEach((wordInfo) => {
      let wordScore = 0;
      let wordMultiplier = 1;

      // Calculate score for each letter
      for (let i = 0; i < wordInfo.word.length; i++) {
        const row =
          wordInfo.direction === "horizontal"
            ? wordInfo.startPos.row
            : wordInfo.startPos.row + i;
        const col =
          wordInfo.direction === "horizontal"
            ? wordInfo.startPos.col + i
            : wordInfo.startPos.col;

        let letterScore = tempBoard[row][col].value;

        // Apply premium squares only for newly placed tiles
        if (!this.previousBoard || !this.previousBoard[row][col]) {
          const premium = this.getPremiumSquareType(row, col);
          if (premium === "dl") letterScore *= 2;
          if (premium === "tl") letterScore *= 3;
          if (premium === "dw") wordMultiplier *= 2;
          if (premium === "tw") wordMultiplier *= 3;
        }

        wordScore += letterScore;
      }

      totalScore += wordScore * wordMultiplier;

      // Count parallel words
      if (
        this.hasParallelWord(
          wordInfo.startPos.row,
          wordInfo.startPos.col,
          wordInfo.direction === "horizontal",
        )
      ) {
        parallelWordCount++;
      }
    });

    // Apply penalties and adjustments
    let adjustedScore = totalScore;

    // Enhanced penalties for parallel words and short words
    if (parallelWordCount > 0) {
      // Base penalty for parallel words
      adjustedScore -= parallelWordCount * 150;

      // Extra penalty for short words
      if (word.length <= 3) {
        adjustedScore -= 300;
      }

      // Additional penalty for stacking
      if (this.hasParallelWord(startRow, startCol, horizontal)) {
        adjustedScore -= 250;
      }

      // Severe penalty for multiple parallel words
      if (parallelWordCount > 1) {
        adjustedScore -= 400;
      }
    }

    // Bonuses for preferred play patterns
    if (word.length >= 5) {
      // Bonus for longer words
      adjustedScore += word.length * 20;

      // Extra bonus for long words that don't create parallel words
      if (parallelWordCount === 0) {
        adjustedScore += 100;
      }
    }

    // Bingo bonus (using all 7 tiles)
    if (word.length === 7) {
      adjustedScore += 50;
    }

    // Check for problematic patterns
    if (
      this.wouldCreateStackedShortWords(word, startRow, startCol, horizontal)
    ) {
      adjustedScore = 1; // Effectively reject these plays
    }

    // Penalty for plays too close to the board edges
    if (
      startRow === 0 ||
      startRow === 14 ||
      startCol === 0 ||
      startCol === 14
    ) {
      adjustedScore -= 50;
    }

    // Ensure minimum score and cap extremely high scores
    adjustedScore = Math.max(adjustedScore, 1);
    adjustedScore = Math.min(adjustedScore, 1000); // Cap maximum score

    console.log(
      `Score calculation for ${word}: Base score ${totalScore}, Adjusted score ${adjustedScore}`,
    );
    return adjustedScore;
  }

  wouldCreateStackedShortWords(word, row, col, horizontal) {
    const checkRadius = 2; // Check 2 cells above/below or left/right
    let shortWordCount = 0;

    // Check for existing short words nearby
    for (let i = -checkRadius; i <= checkRadius; i++) {
      if (i === 0) continue; // Skip current position

      const checkRow = horizontal ? row + i : row;
      const checkCol = horizontal ? col : col + i;

      if (checkRow >= 0 && checkRow < 15 && checkCol >= 0 && checkCol < 15) {
        const existingWord = this.getWordAtPosition(
          checkRow,
          checkCol,
          !horizontal,
        );
        if (existingWord && existingWord.length <= 3) {
          shortWordCount++;
        }
      }
    }

    // Check if the current word would create new short cross-words
    for (let i = 0; i < word.length; i++) {
      const currentRow = horizontal ? row : row + i;
      const currentCol = horizontal ? col + i : col;

      const crossWord = this.getPotentialCrossWord(
        word[i],
        currentRow,
        currentCol,
        !horizontal,
      );
      if (crossWord && crossWord.length <= 3) {
        shortWordCount++;
      }
    }

    // Return true if there are too many short words
    return shortWordCount > 1 || (shortWordCount > 0 && word.length <= 3);
  }

  getWordAtPosition(row, col, horizontal) {
    let word = "";
    let start = horizontal ? col : row;

    // Find start of word
    while (
      start > 0 &&
      this.board[horizontal ? row : start - 1][horizontal ? start - 1 : col]
    ) {
      start--;
    }

    // Build word
    let current = start;
    while (
      current < 15 &&
      this.board[horizontal ? row : current][horizontal ? current : col]
    ) {
      word +=
        this.board[horizontal ? row : current][horizontal ? current : col]
          .letter;
      current++;
    }

    return word.length > 1 ? word : null;
  }

  getPotentialCrossWord(letter, row, col, horizontal) {
    let word = "";
    let tempBoard = JSON.parse(JSON.stringify(this.board));
    tempBoard[row][col] = { letter: letter };

    // Find start of potential word
    let start = horizontal ? col : row;
    while (
      start > 0 &&
      tempBoard[horizontal ? row : start - 1][horizontal ? start - 1 : col]
    ) {
      start--;
    }

    // Build potential word
    let current = start;
    while (
      current < 15 &&
      tempBoard[horizontal ? row : current][horizontal ? current : col]
    ) {
      word +=
        tempBoard[horizontal ? row : current][horizontal ? current : col]
          .letter;
      current++;
    }

    return word.length > 1 ? word : null;
  }

  hasNearbyParallelWords(row, col, isHorizontal) {
    const checkRange = 2; // Check 2 cells above/below or left/right

    for (let i = -checkRange; i <= checkRange; i++) {
      if (i === 0) continue; // Skip current position

      const checkRow = isHorizontal ? row + i : row;
      const checkCol = isHorizontal ? col : col + i;

      if (checkRow >= 0 && checkRow < 15 && checkCol >= 0 && checkCol < 15) {
        // Check if there's a word at this position
        const existingWord = this.getWordAtPosition(
          checkRow,
          checkCol,
          isHorizontal,
        );
        if (existingWord) {
          return true;
        }
      }
    }
    return false;
  }

  hasAdjacentParallelWords(row, col, horizontal, word) {
    // Track details about parallel words
    const parallelWords = {
      above: null,
      below: null,
      left: null,
      right: null,
    };

    if (horizontal) {
      // Check words above
      if (row > 0) {
        parallelWords.above = this.getParallelWordDetails(
          row - 1,
          col,
          horizontal,
        );
      }
      // Check words below
      if (row < 14) {
        parallelWords.below = this.getParallelWordDetails(
          row + 1,
          col,
          horizontal,
        );
      }
    } else {
      // Check words to the left
      if (col > 0) {
        parallelWords.left = this.getParallelWordDetails(
          row,
          col - 1,
          horizontal,
        );
      }
      // Check words to the right
      if (col < 14) {
        parallelWords.right = this.getParallelWordDetails(
          row,
          col + 1,
          horizontal,
        );
      }
    }

    // Calculate penalty based on parallel word patterns
    let penalty = 0;

    // Severe penalty for stacking on top of longer words
    const stackedOnLong = Object.values(parallelWords).some(
      (details) => details && details.length > 3,
    );
    if (stackedOnLong) {
      penalty += 200;
    }

    // Extra penalty for short words stacked on each other
    const hasShortStacks = Object.values(parallelWords).filter(
      (details) => details && details.length <= 3,
    ).length;
    penalty += hasShortStacks * 150;

    // Additional penalty for creating multiple short parallel words
    if (word.length <= 3) {
      penalty += 250;
    }

    return penalty;
  }

  getParallelWordDetails(row, col, horizontal) {
    let start = horizontal ? col : row;
    let word = "";

    // Find start of word
    while (
      start > 0 &&
      this.board[horizontal ? row : start - 1][horizontal ? start - 1 : col]
    ) {
      start--;
    }

    // Build word
    let current = start;
    while (
      current < 15 &&
      this.board[horizontal ? row : current][horizontal ? current : col]
    ) {
      word +=
        this.board[horizontal ? row : current][horizontal ? current : col]
          .letter;
      current++;
    }

    return word.length > 1
      ? {
          word,
          length: word.length,
          start: start,
        }
      : null;
  }

  getParallelWordLength(row, col, horizontal) {
    let length = 0;
    let currentPos = horizontal ? col : row;

    // Find start of word
    while (
      currentPos > 0 &&
      this.board[horizontal ? row : currentPos - 1][
        horizontal ? currentPos - 1 : col
      ]
    ) {
      currentPos--;
    }

    // Count length
    while (
      currentPos < 15 &&
      this.board[horizontal ? row : currentPos][horizontal ? currentPos : col]
    ) {
      length++;
      currentPos++;
    }

    return length;
  }

  findCrossWordOpportunities(availableLetters) {
    const plays = [];
    // Check each existing word on the board
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (this.board[row][col]) {
          // Check if we can form perpendicular words
          const letter = this.board[row][col].letter;
          for (const direction of ["horizontal", "vertical"]) {
            const crossWords = this.findPossibleCrossWords(
              row,
              col,
              letter,
              availableLetters,
              direction,
            );
            plays.push(...crossWords);
          }
        }
      }
    }
    return plays;
  }

  findParallelWords(existingWord, startRow, startCol, isHorizontal) {
    const availableLetters = this.aiRack.map((tile) => tile.letter);
    const parallelPlays = [];

    // Check one row/column above and below
    const offsets = [-1, 1];
    for (const offset of offsets) {
      const newRow = isHorizontal ? startRow + offset : startRow;
      const newCol = isHorizontal ? startCol : startCol + offset;

      if (this.isValidPosition(newRow, newCol)) {
        const possibleWords = this.findWordsUsingLetters(
          availableLetters,
          existingWord,
        );
        parallelPlays.push(...possibleWords);
      }
    }
    return parallelPlays;
  }

  hasParallelWord(row, col, isHorizontal) {
    const checkPositions = isHorizontal
      ? [
          [row - 1, col],
          [row + 1, col],
        ] // Check above and below for horizontal words
      : [
          [row, col - 1],
          [row, col + 1],
        ]; // Check left and right for vertical words

    // Count how many adjacent parallel words we find
    let parallelWordCount = 0;

    checkPositions.forEach(([r, c]) => {
      if (r >= 0 && r < 15 && c >= 0 && c < 15) {
        // If we find a tile, verify it's part of a word
        if (this.board[r][c] !== null) {
          const wordLength =
            this.getParallelWordDetails(r, c, isHorizontal)?.length || 0;
          if (wordLength > 2) {
            // Only count as parallel if it's a real word (3+ letters)
            parallelWordCount++;
          }
        }
      }
    });

    return parallelWordCount > 0;
  }

  playAIMove(move) {
    console.log("AI playing move:", move);
    const { word, row, col, horizontal, score } = move;

    // Place tiles on board
    for (let i = 0; i < word.length; i++) {
      const currentRow = horizontal ? row : row + i;
      const currentCol = horizontal ? col + i : col;
      const letter = word[i];

      // Find matching tile in AI's rack
      const tileIndex = this.aiRack.findIndex((t) => t.letter === letter);
      if (tileIndex !== -1) {
        const tile = this.aiRack.splice(tileIndex, 1)[0];
        this.board[currentRow][currentCol] = tile;

        // Update visual board
        const cell = document.querySelector(
          `[data-row="${currentRow}"][data-col="${currentCol}"]`,
        );
        cell.innerHTML = `
                          ${tile.letter}
                          <span class="points">${tile.value}</span>
                      `;
      }
    }

    // Update game state
    this.aiScore += score;
    this.isFirstMove = false;
    this.currentTurn = "player";
    this.addToMoveHistory("Computer", word, score);
    this.fillRacks();
    this.updateGameState();
  }

  skipAITurn() {
    console.log("AI skipping turn");
    this.consecutiveSkips++;
    this.currentTurn = "player";

    if (this.consecutiveSkips >= 4) {
      this.checkGameEnd();
    } else {
      // Optionally record skip in move history
      this.addToMoveHistory("Computer", "SKIP", 0);
      this.updateGameState();
    }
  }

  generateTileBag() {
    this.tiles = [];
    for (const [letter, count] of Object.entries(this.tileDistribution)) {
      for (let i = 0; i < count; i++) {
        this.tiles.push({
          letter,
          value: this.tileValues[letter],
          id: `${letter}_${i}`,
        });
      }
    }
    this.shuffleTiles();
  }

  shuffleTiles() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  async init() {
    await this.loadDictionary();
    this.createBoard();
    this.fillRacks();
    this.setupDragAndDrop();
    this.setupEventListeners();
    this.updateGameState();
  }

  createBoard() {
    const board = document.getElementById("scrabble-board");
    const premiumSquares = this.getPremiumSquares();

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        const cell = document.createElement("div");
        cell.className = "board-cell";
        cell.dataset.row = i;
        cell.dataset.col = j;

        // Add this to verify cell creation
        console.log(`Creating cell at [${i}, ${j}]`);

        // Test click events on each cell
        cell.addEventListener("click", () => {
          console.log(`Clicked cell [${i}, ${j}]`);
        });

        const key = `${i},${j}`;
        if (premiumSquares[key]) {
          cell.classList.add(premiumSquares[key]);
        }

        board.appendChild(cell);
      }
    }
  }

  getPremiumSquares() {
    const premium = {};

    // Triple Word Scores (red squares)
    [
      [0, 0],
      [0, 7],
      [0, 14],
      [7, 0],
      [7, 14],
      [14, 0],
      [14, 7],
      [14, 14],
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "tw"));

    // Double Word Scores (pink squares)
    [
      [1, 1],
      [1, 13],
      [2, 2],
      [2, 12],
      [3, 3],
      [3, 11],
      [4, 4],
      [4, 10],
      [10, 4],
      [10, 10],
      [11, 3],
      [11, 11],
      [12, 2],
      [12, 12],
      [13, 1],
      [13, 13],
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "dw"));

    // Triple Letter Scores (dark blue squares)
    [
      [1, 5],
      [1, 9],
      [5, 1],
      [5, 5],
      [5, 9],
      [5, 13],
      [9, 1],
      [9, 5],
      [9, 9],
      [9, 13],
      [13, 5],
      [13, 9],
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "tl"));

    // Double Letter Scores (light blue squares)
    [
      [0, 3],
      [0, 11],
      [2, 6],
      [2, 8],
      [3, 0],
      [3, 7],
      [3, 14],
      [6, 2],
      [6, 6],
      [6, 8],
      [6, 12],
      [7, 3],
      [7, 11],
      [8, 2],
      [8, 6],
      [8, 8],
      [8, 12],
      [11, 0],
      [11, 7],
      [11, 14],
      [12, 6],
      [12, 8],
      [14, 3],
      [14, 11],
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "dl"));

    return premium;
  }

  async loadDictionary() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt",
      );
      const text = await response.text();
      this.dictionary = new Set(text.toLowerCase().split("\n"));
      console.log("Dictionary loaded successfully");
    } catch (error) {
      console.error("Error loading dictionary:", error);
      this.dictionary = new Set(["scrabble", "game", "play", "word"]);
    }
  }

  fillRacks() {
    while (this.playerRack.length < 7 && this.tiles.length > 0) {
      this.playerRack.push(this.tiles.pop());
    }
    while (this.aiRack.length < 7 && this.tiles.length > 0) {
      this.aiRack.push(this.tiles.pop());
    }
    this.renderRack();
    this.updateTilesCount();
  }

  renderRack() {
    const rack = document.getElementById("tile-rack");
    rack.innerHTML = "";
    this.playerRack.forEach((tile, index) => {
      const tileElement = this.createTileElement(tile, index);
      rack.appendChild(tileElement);
    });
  }

  createTileElement(tile, index) {
    const tileElement = document.createElement("div");
    tileElement.className = "tile";
    tileElement.draggable = true;
    tileElement.dataset.index = index;
    tileElement.dataset.id = tile.id;
    tileElement.innerHTML = `
                  ${tile.letter}
                  <span class="points">${tile.value}</span>
              `;
    return tileElement;
  }

  setupDragAndDrop() {
    this.setupDragListeners();
    this.setupDropListeners();
    this.setupRackDropZone();
  }

  setupRackDropZone() {
    const rack = document.getElementById("tile-rack");

    rack.addEventListener("dragover", (e) => {
      e.preventDefault();
      if (this.currentTurn === "player") {
        e.currentTarget.classList.add("rack-droppable");
      }
    });

    rack.addEventListener("dragleave", (e) => {
      e.currentTarget.classList.remove("rack-droppable");
    });

    rack.addEventListener("drop", (e) => {
      e.preventDefault();
      e.currentTarget.classList.remove("rack-droppable");

      if (this.currentTurn !== "player") return;

      // Find the dragged tile element
      const draggedTile = document.querySelector(".tile.dragging");
      if (!draggedTile) return;

      // Find the placed tile by looking through all board cells
      const boardCell = draggedTile.closest(".board-cell");
      if (!boardCell) return;

      const row = parseInt(boardCell.dataset.row);
      const col = parseInt(boardCell.dataset.col);

      // Find the corresponding placed tile
      const placedTileIndex = this.placedTiles.findIndex(
        (t) => t.row === row && t.col === col,
      );

      if (placedTileIndex !== -1) {
        const placedTile = this.placedTiles[placedTileIndex];

        // Return the tile to the rack
        this.playerRack.push(placedTile.tile);

        // Clear the board cell
        this.board[row][col] = null;
        boardCell.innerHTML = "";

        // Remove from placed tiles array
        this.placedTiles.splice(placedTileIndex, 1);

        // Update the rack display
        this.renderRack();

        // Update valid placement highlights
        this.highlightValidPlacements();
      }
    });
  }

  setupDragListeners() {
    document.addEventListener("dragstart", (e) => {
      if (
        e.target.classList.contains("tile") &&
        this.currentTurn === "player"
      ) {
        e.target.classList.add("dragging");
        const tileData = {
          index: e.target.dataset.index,
          id: e.target.dataset.id,
        };
        e.dataTransfer.setData("text/plain", e.target.dataset.index);

        console.log("Drag started:", tileData);

        e.dataTransfer.effectAllowed = "move";

        const dragImage = e.target.cloneNode(true);
        dragImage.style.opacity = "0.8";
        dragImage.style.position = "absolute";
        dragImage.style.top = "-1000px";
        document.body.appendChild(dragImage);

        e.dataTransfer.setDragImage(
          dragImage,
          dragImage.offsetWidth / 2,
          dragImage.offsetHeight / 2,
        );

        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      }
    });

    document.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("tile")) {
        e.target.classList.remove("dragging");
      }
    });
  }

  setupDropListeners() {
    document.querySelectorAll(".board-cell").forEach((cell) => {
      // Add this to ensure the cell is droppable
      cell.setAttribute("droppable", "true");

      cell.addEventListener("dragenter", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Drag entered cell");
      });

      cell.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        console.log(`Dragover cell [${row}, ${col}]`);

        // Explicitly show this is a valid drop target
        e.dataTransfer.dropEffect = "move";

        if (this.currentTurn === "player") {
          cell.classList.add("droppable-hover");
        }
      });

      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Drop attempted");

        cell.classList.remove("droppable-hover");

        if (this.currentTurn !== "player") {
          console.log("Not player turn");
          return;
        }

        const tileIndex = e.dataTransfer.getData("text/plain");
        console.log("Tile index from drop:", tileIndex);

        const tile = this.playerRack[tileIndex];
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        console.log("Drop details:", {
          tileIndex,
          tile,
          row,
          col,
          isFirstMove: this.isFirstMove,
          currentTurn: this.currentTurn,
        });

        if (this.isValidPlacement(row, col, tile)) {
          this.placeTile(tile, row, col);
        } else {
          const validationDetails = {
            isOccupied: this.board[row][col] !== null,
            distanceToWords: this.getMinDistanceToWords(row, col),
            isFirstMove: this.isFirstMove,
            placedTilesLength: this.placedTiles.length,
          };
          console.log("Placement validation failed:", validationDetails);
          alert("Invalid placement! Check placement rules.");
        }
      });

      cell.addEventListener("dragleave", (e) => {
        e.preventDefault();
        cell.classList.remove("droppable-hover");
      });
    });
  }

  isValidPlacement(row, col, tile) {
    console.log("Checking placement validity:", { row, col, tile });

    // Check if cell is already occupied
    if (this.board[row][col]) {
      console.log("Cell is occupied");
      return false;
    }

    // If it's first move and no tiles placed yet
    if (this.isFirstMove && this.placedTiles.length === 0) {
      console.log("First move check:", row === 7 && col === 7);
      return row === 7 && col === 7;
    }

    // After first tile, check distance to existing tiles
    const distance = this.getMinDistanceToWords(row, col);
    console.log("Distance to existing words:", distance);

    // More permissive distance check for tiles near the center
    if (Math.abs(row - 7) <= 1 && Math.abs(col - 7) <= 1) {
      return true;
    }

    return distance <= 5;
  }

  highlightValidPlacements() {
    // Remove existing highlights
    document.querySelectorAll(".board-cell").forEach((cell) => {
      cell.classList.remove(
        "valid-placement",
        "placement-close",
        "placement-medium",
        "placement-far",
      );
    });

    // Only highlight if it's player's turn
    if (this.currentTurn !== "player") return;

    // Check each empty cell
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        if (!this.board[row][col]) {
          const distance = this.getMinDistanceToWords(row, col);
          const cell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`,
          );

          if (distance <= 5) {
            cell.classList.add("valid-placement");
          }
        }
      }
    }
  }

  getMinDistanceToWords(row, col) {
    let minDistance = Infinity;

    // Check distance to all occupied cells
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (this.board[i][j]) {
          const distance = Math.abs(row - i) + Math.abs(col - j);
          minDistance = Math.min(minDistance, distance);
        }
      }
    }

    return minDistance;
  }

  checkValidStartingPosition(row, col) {
    // On first move, any position is valid as long as it forms valid words
    if (this.isFirstMove) {
      return true;
    }

    // Check if this position is adjacent to or part of any existing word
    return (
      this.checkAdjacentTiles(row, col) ||
      this.checkExistingWordConnection(row, col)
    );
  }

  checkExistingWordConnection(row, col) {
    // Check if this position would be part of an existing word
    // Check horizontal
    const leftTile = col > 0 && this.board[row][col - 1];
    const rightTile = col < 14 && this.board[row][col + 1];
    const isPartOfHorizontalWord = leftTile || rightTile;

    // Check vertical
    const aboveTile = row > 0 && this.board[row - 1][col];
    const belowTile = row < 14 && this.board[row + 1][col];
    const isPartOfVerticalWord = aboveTile || belowTile;

    return isPartOfHorizontalWord || isPartOfVerticalWord;
  }

  checkAdjacentTiles(row, col) {
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    return directions.some(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      return (
        newRow >= 0 &&
        newRow < 15 &&
        newCol >= 0 &&
        newCol < 15 &&
        this.board[newRow][newCol] !== null
      );
    });
  }

  checkAdjacentTiles(row, col) {
    const directions = [
      [-1, 0], // up
      [1, 0], // down
      [0, -1], // left
      [0, 1], // right
    ];

    return directions.some(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      return (
        newRow >= 0 &&
        newRow < 15 &&
        newCol >= 0 &&
        newCol < 15 &&
        this.board[newRow][newCol] !== null
      );
    });
  }

  placeTile(tile, row, col) {
    if (this.board[row][col]) {
      alert("This cell is already occupied!");
      return;
    }

    if (tile.letter === "*") {
      const letterSelectionDialog = document.createElement("div");
      letterSelectionDialog.className = "letter-selection-dialog";
      letterSelectionDialog.innerHTML = `
                  <div class="dialog-content">
                      <h3>Choose a letter for the blank tile</h3>
                      <div class="letter-grid">
                          ${Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
                            .map(
                              (letter) => `
                              <button class="letter-choice">${letter}</button>
                          `,
                            )
                            .join("")}
                      </div>
                  </div>
              `;

      // Add styles for the dialog
      const style = document.createElement("style");
      style.textContent = `
                  .letter-selection-dialog {
                      position: fixed;
                      top: 0;
                      left: 0;
                      right: 0;
                      bottom: 0;
                      background: rgba(0, 0, 0, 0.7);
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      z-index: 1000;
                  }
                  .dialog-content {
                      background: white;
                      padding: 20px;
                      border-radius: 10px;
                      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                      max-width: 400px;
                      width: 90%;
                  }
                  .letter-grid {
                      display: grid;
                      grid-template-columns: repeat(6, 1fr);
                      gap: 5px;
                      margin-top: 15px;
                  }
                  .letter-choice {
                      padding: 10px;
                      border: 1px solid #ccc;
                      background: #0047AB;
                      cursor: pointer;
                      border-radius: 5px;
                      transition: all 0.2s;
                  }
                  .letter-choice:hover {
                      background: #e0e0e0;
                      transform: scale(1.1);
                  }
                  h3 {
                      text-align: center;
                      margin-top: 0;
                      color: #333;
                  }
              `;
      document.head.appendChild(style);
      document.body.appendChild(letterSelectionDialog);

      // Handle letter selection
      const buttons = letterSelectionDialog.querySelectorAll(".letter-choice");
      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const selectedLetter = button.textContent;

          // Create a new tile object with the selected letter but keep point value as 0
          const blankTile = {
            ...tile,
            letter: selectedLetter,
            originalLetter: "*",
            value: 0,
          };

          // Create proper tile object for the board
          const placedTile = {
            letter: selectedLetter,
            value: 0,
            id: tile.id,
            isBlank: true,
          };

          this.board[row][col] = placedTile;
          const cell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`,
          );
          const tileIndex = this.playerRack.indexOf(tile);

          // Create and add the tile element
          const tileElement = document.createElement("div");
          tileElement.className = "tile";
          tileElement.draggable = true;
          tileElement.dataset.index = tileIndex;
          tileElement.dataset.id = tile.id;
          tileElement.innerHTML = `
                          ${selectedLetter}
                          <span class="points">0</span>
                          <span class="blank-indicator">★</span>
                      `;

          // Add drag events to the tile
          tileElement.addEventListener("dragstart", (e) => {
            if (this.currentTurn === "player") {
              e.target.classList.add("dragging");
              const cell = e.target.closest(".board-cell");
              const row = cell.dataset.row;
              const col = cell.dataset.col;
              e.dataTransfer.setData("text/plain", `${row},${col}`);
            }
          });

          tileElement.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
          });

          // Clear the cell and add the new tile
          cell.innerHTML = "";
          cell.appendChild(tileElement);

          // Remove tile from rack
          if (tileIndex > -1) {
            this.playerRack.splice(tileIndex, 1);
          }

          // Add to placed tiles
          this.placedTiles.push({
            tile: placedTile,
            row: row,
            col: col,
          });

          // Update rack display
          this.renderRack();

          // Remove the dialog
          letterSelectionDialog.remove();

          // Update valid placement highlights
          this.highlightValidPlacements();
        });
      });
    } else {
      // Normal tile placement (non-blank tile)
      // Create proper tile object for the board
      const placedTile = {
        letter: tile.letter,
        value: tile.value || this.tileValues[tile.letter],
        id: tile.id,
      };

      this.board[row][col] = placedTile;
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );
      const tileIndex = this.playerRack.indexOf(tile);

      const tileElement = document.createElement("div");
      tileElement.className = "tile";
      tileElement.draggable = true;
      tileElement.dataset.index = tileIndex;
      tileElement.dataset.id = tile.id;
      tileElement.innerHTML = `
                  ${tile.letter}
                  <span class="points">${placedTile.value}</span>
              `;

      // Add drag functionality to the placed tile
      tileElement.addEventListener("dragstart", (e) => {
        if (this.currentTurn === "player") {
          e.target.classList.add("dragging");
          e.dataTransfer.setData("text/plain", e.target.dataset.index);
        }
      });

      tileElement.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
      });

      // Clear the cell and add the new tile
      cell.innerHTML = "";
      cell.appendChild(tileElement);

      // Remove tile from rack
      if (tileIndex > -1) {
        this.playerRack.splice(tileIndex, 1);
      }

      // Add to placed tiles
      this.placedTiles.push({
        tile: placedTile,
        row: row,
        col: col,
      });

      // Update rack display
      this.renderRack();

      // Update valid placement highlights
      this.highlightValidPlacements();
    }
  }

  areTilesConnected() {
    if (this.placedTiles.length <= 1) return true;

    const sortedTiles = [...this.placedTiles].sort((a, b) => {
      if (a.row === b.row) {
        return a.col - b.col;
      }
      return a.row - b.row;
    });

    // Check if tiles are in same row or column
    const isHorizontal = sortedTiles.every((t) => t.row === sortedTiles[0].row);
    const isVertical = sortedTiles.every((t) => t.col === sortedTiles[0].col);

    if (!isHorizontal && !isVertical) return false;

    // Check for gaps between placed tiles
    for (let i = 1; i < sortedTiles.length; i++) {
      if (isHorizontal) {
        // Allow gaps if there are existing tiles in between
        const prevCol = sortedTiles[i - 1].col;
        const currCol = sortedTiles[i].col;
        for (let col = prevCol + 1; col < currCol; col++) {
          if (!this.board[sortedTiles[0].row][col]) {
            return false;
          }
        }
      } else {
        // isVertical
        // Allow gaps if there are existing tiles in between
        const prevRow = sortedTiles[i - 1].row;
        const currRow = sortedTiles[i].row;
        for (let row = prevRow + 1; row < currRow; row++) {
          if (!this.board[row][sortedTiles[0].col]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  resetPlacedTiles() {
    this.placedTiles.forEach(({ tile, row, col }) => {
      this.board[row][col] = null;
      const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );
      cell.innerHTML = "";
      this.playerRack.push(tile);
    });

    this.placedTiles = [];
    this.renderRack();
  }

  validateWord() {
    if (this.placedTiles.length === 0) return false;

    // Check if tiles are properly connected
    if (!this.areTilesConnected()) return false;

    // Get all formed words (including connected words)
    const formedWords = this.getFormedWords();
    console.log(
      "Formed words:",
      formedWords.map((w) => w.word),
    );

    // If no valid words are formed, return false
    if (formedWords.length === 0) {
      console.log("No valid words formed");
      return false;
    }

    // Validate each word
    let allWordsValid = true;
    formedWords.forEach((wordInfo) => {
      const word = wordInfo.word.toLowerCase();
      if (!this.dictionary.has(word)) {
        console.log(`Invalid word: ${word}`);
        allWordsValid = false;
      } else {
        console.log(`Valid word found: ${word}`);
      }
    });

    // First move must use center square
    if (this.isFirstMove) {
      const centerUsed = this.placedTiles.some(
        (tile) => tile.row === 7 && tile.col === 7,
      );
      if (!centerUsed) {
        console.log("First move must use center square");
        return false;
      }
    }

    return allWordsValid;
  }

  getCrossWords(row, col) {
    const words = [];
    const horizontal = this.getWordAt(row, col, true);
    const vertical = this.getWordAt(row, col, false);

    if (horizontal) words.push(horizontal);
    if (vertical) words.push(vertical);

    return words;
  }

  getWordAt(row, col, isHorizontal) {
    let word = "";
    let startPos = isHorizontal ? col : row;

    // Find start of word
    while (
      startPos > 0 &&
      this.board[isHorizontal ? row : startPos - 1][
        isHorizontal ? startPos - 1 : col
      ]
    ) {
      startPos--;
    }

    // Build complete word
    let currentPos = startPos;
    while (
      currentPos < 15 &&
      this.board[isHorizontal ? row : currentPos][
        isHorizontal ? currentPos : col
      ]
    ) {
      const tile =
        this.board[isHorizontal ? row : currentPos][
          isHorizontal ? currentPos : col
        ];
      word += tile.letter;
      currentPos++;
    }

    return word.length > 1 ? word : null;
  }

  getFormedWords() {
    const words = new Set();
    const existingWords = new Set(); // Track words that existed before this move

    // First, get words that existed before this move
    // Store the words from the previous board state
    if (this.previousBoard) {
      for (let row = 0; row < 15; row++) {
        let word = "";
        for (let col = 0; col < 15; col++) {
          if (this.previousBoard[row][col]) {
            word += this.previousBoard[row][col].letter;
          } else if (word.length > 1) {
            existingWords.add(word);
            word = "";
          } else {
            word = "";
          }
        }
        if (word.length > 1) {
          existingWords.add(word);
        }
      }

      // Check vertical existing words
      for (let col = 0; col < 15; col++) {
        let word = "";
        for (let row = 0; row < 15; row++) {
          if (this.previousBoard[row][col]) {
            word += this.previousBoard[row][col].letter;
          } else if (word.length > 1) {
            existingWords.add(word);
            word = "";
          } else {
            word = "";
          }
        }
        if (word.length > 1) {
          existingWords.add(word);
        }
      }
    }

    // Now find new words
    // Check horizontal words
    for (let row = 0; row < 15; row++) {
      let word = "";
      let startCol = 0;
      let containsNewTile = false;

      for (let col = 0; col < 15; col++) {
        if (this.board[row][col]) {
          word += this.board[row][col].letter;
          // Check if this position contains a newly placed tile
          if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
            containsNewTile = true;
          }
        } else {
          if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
            words.add({
              word,
              startPos: { row, col: startCol },
              direction: "horizontal",
            });
          }
          word = "";
          startCol = col + 1;
          containsNewTile = false;
        }
      }
      if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
        words.add({
          word,
          startPos: { row, col: startCol },
          direction: "horizontal",
        });
      }
    }

    // Check vertical words
    for (let col = 0; col < 15; col++) {
      let word = "";
      let startRow = 0;
      let containsNewTile = false;

      for (let row = 0; row < 15; row++) {
        if (this.board[row][col]) {
          word += this.board[row][col].letter;
          // Check if this position contains a newly placed tile
          if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
            containsNewTile = true;
          }
        } else {
          if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
            words.add({
              word,
              startPos: { row: startRow, col },
              direction: "vertical",
            });
          }
          word = "";
          startRow = row + 1;
          containsNewTile = false;
        }
      }
      if (word.length > 1 && containsNewTile && !existingWords.has(word)) {
        words.add({
          word,
          startPos: { row: startRow, col },
          direction: "vertical",
        });
      }
    }

    console.log("Existing words:", Array.from(existingWords));
    console.log(
      "New words formed:",
      Array.from(words).map((w) => w.word),
    );
    return Array.from(words);
  }

  getCrossWord(row, col) {
    let verticalWord = "";
    let horizontalWord = "";

    // Get vertical word
    let currentRow = row;
    while (currentRow > 0 && this.board[currentRow - 1][col]) currentRow--;
    while (currentRow < 15 && this.board[currentRow][col]) {
      verticalWord += this.board[currentRow][col].letter;
      currentRow++;
    }

    // Get horizontal word
    let currentCol = col;
    while (currentCol > 0 && this.board[row][currentCol - 1]) currentCol--;
    while (currentCol < 15 && this.board[row][currentCol]) {
      horizontalWord += this.board[row][currentCol].letter;
      currentCol++;
    }

    // Return the longer word if both exist, or the one that exists
    if (verticalWord.length > 1 && horizontalWord.length > 1) {
      return verticalWord.length > horizontalWord.length
        ? verticalWord
        : horizontalWord;
    }
    if (verticalWord.length > 1) return verticalWord;
    if (horizontalWord.length > 1) return horizontalWord;
    return "";
  }

  getLetterPosition(letter, index) {
    const tiles = [...this.placedTiles].sort((a, b) => {
      if (a.row === b.row) {
        return a.col - b.col;
      }
      return a.row - b.row;
    });

    if (index < tiles.length) {
      return {
        row: tiles[index].row,
        col: tiles[index].col,
      };
    }
    return null;
  }

  getMainWord() {
    if (this.placedTiles.length === 0) return "";

    const sortedTiles = [...this.placedTiles].sort((a, b) => {
      if (a.row === b.row) {
        return a.col - b.col;
      }
      return a.row - b.row;
    });

    // Determine if word is horizontal or vertical based on placed tiles
    const isHorizontal = sortedTiles.every((t) => t.row === sortedTiles[0].row);
    let row = sortedTiles[0].row;
    let col = sortedTiles[0].col;

    // Find the start of the word
    if (isHorizontal) {
      while (col > 0 && this.board[row][col - 1]) {
        col--;
      }
    } else {
      while (row > 0 && this.board[row - 1][col]) {
        row--;
      }
    }

    // Build the complete word including existing tiles
    let word = "";
    let currentRow = row;
    let currentCol = col;

    if (isHorizontal) {
      while (currentCol < 15 && this.board[row][currentCol]) {
        word += this.board[row][currentCol].letter;
        currentCol++;
      }
    } else {
      while (currentRow < 15 && this.board[currentRow][col]) {
        word += this.board[currentRow][col].letter;
        currentRow++;
      }
    }

    return word;
  }

  calculateScore() {
    let totalScore = 0;
    const words = new Set();

    console.log("=== Starting Score Calculation ===");

    // Get all formed words (main word + perpendicular words + modified words)
    const formedWords = this.getFormedWords();
    console.log("Words formed:", formedWords);

    // Calculate score for each formed word
    formedWords.forEach((wordInfo) => {
      let wordScore = 0;
      let wordMultiplier = 1;
      const { word, startPos, direction } = wordInfo;

      console.log(`\nCalculating score for word: ${word}`);

      // Calculate score for each letter in the word
      for (let i = 0; i < word.length; i++) {
        const row =
          direction === "horizontal" ? startPos.row : startPos.row + i;
        const col =
          direction === "horizontal" ? startPos.col + i : startPos.col;
        const tile = this.board[row][col];

        let letterScore = tile.value;

        // Apply premium squares only for newly placed tiles
        if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
          const premium = this.getPremiumSquareType(row, col);
          if (premium === "dl") {
            letterScore *= 2;
            console.log(`Double letter score applied to ${tile.letter}`);
          }
          if (premium === "tl") {
            letterScore *= 3;
            console.log(`Triple letter score applied to ${tile.letter}`);
          }
          if (premium === "dw") {
            wordMultiplier *= 2;
            console.log("Double word score will be applied");
          }
          if (premium === "tw") {
            wordMultiplier *= 3;
            console.log("Triple word score will be applied");
          }
        }

        wordScore += letterScore;
        console.log(`Letter ${tile.letter} adds ${letterScore} points`);
      }

      // Apply word multiplier
      wordScore *= wordMultiplier;
      console.log(`Final score for "${word}": ${wordScore} points`);

      // Add to total score
      totalScore += wordScore;

      // Store word and its score for display
      words.add(
        JSON.stringify({
          word: word,
          score: wordScore,
        }),
      );
    });

    // Add bonus for using all 7 tiles
    if (this.placedTiles.length === 7) {
      console.log("\nBINGO! Adding 50 point bonus for using all 7 tiles");
      totalScore += 50;
    }

    console.log(`\n=== Final Score Calculation ===`);
    console.log(
      `Words formed: ${Array.from(words)
        .map((w) => JSON.parse(w).word)
        .join(" & ")}`,
    );
    console.log(`Total score for this move: ${totalScore}`);

    return totalScore;
  }

  findWordPosition(word) {
    // Search the board for the starting position of the word
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        // Check horizontal
        if (col <= 15 - word.length) {
          let matches = true;
          for (let i = 0; i < word.length; i++) {
            if (
              !this.board[row][col + i] ||
              this.board[row][col + i].letter !== word[i]
            ) {
              matches = false;
              break;
            }
          }
          if (matches) {
            return { startRow: row, startCol: col, isHorizontal: true };
          }
        }

        // Check vertical
        if (row <= 15 - word.length) {
          let matches = true;
          for (let i = 0; i < word.length; i++) {
            if (
              !this.board[row + i][col] ||
              this.board[row + i][col].letter !== word[i]
            ) {
              matches = false;
              break;
            }
          }
          if (matches) {
            return { startRow: row, startCol: col, isHorizontal: false };
          }
        }
      }
    }
    return null;
  }

  getPremiumSquareType(row, col) {
    const cell = document.querySelector(
      `[data-row="${row}"][data-col="${col}"]`,
    );
    if (cell.classList.contains("tw")) return "tw";
    if (cell.classList.contains("dw")) return "dw";
    if (cell.classList.contains("tl")) return "tl";
    if (cell.classList.contains("dl")) return "dl";
    return null;
  }

  async playWord() {
    if (this.placedTiles.length === 0) {
      alert("Please place some tiles first!");
      return;
    }

    if (!this.areTilesConnected()) {
      alert("Tiles must be connected and in a straight line!");
      this.resetPlacedTiles();
      return;
    }

    if (this.validateWord()) {
      // Get all formed words and their individual scores
      const formedWords = this.getFormedWords();
      let totalScore = 0;
      let wordDescriptions = [];

      formedWords.forEach((wordInfo) => {
        const { word, startPos, direction } = wordInfo;
        // Calculate score for this specific word
        let wordScore = 0;
        let wordMultiplier = 1;

        // Calculate each letter's contribution
        for (let i = 0; i < word.length; i++) {
          const row =
            direction === "horizontal" ? startPos.row : startPos.row + i;
          const col =
            direction === "horizontal" ? startPos.col + i : startPos.col;
          const tile = this.board[row][col];

          let letterScore = tile.value;

          // Apply premium squares only for newly placed tiles
          if (this.placedTiles.some((t) => t.row === row && t.col === col)) {
            const premium = this.getPremiumSquareType(row, col);
            if (premium === "dl") letterScore *= 2;
            if (premium === "tl") letterScore *= 3;
            if (premium === "dw") wordMultiplier *= 2;
            if (premium === "tw") wordMultiplier *= 3;
          }

          wordScore += letterScore;
        }

        // Apply word multiplier
        wordScore *= wordMultiplier;
        totalScore += wordScore;

        // Store word and its individual score
        wordDescriptions.push({
          word: word,
          score: wordScore,
        });
      });

      // Add bonus for using all 7 tiles
      if (this.placedTiles.length === 7) {
        totalScore += 50;
        wordDescriptions.push({ word: "BINGO BONUS", score: 50 });
      }

      // Format the move description
      let moveDescription;
      if (wordDescriptions.length > 1) {
        // Multiple words formed
        moveDescription = wordDescriptions
          .map((w) => `${w.word} (${w.score})`)
          .join(" & ");
      } else {
        // Single word
        moveDescription = wordDescriptions[0].word;
      }

      // Update game state
      this.playerScore += totalScore;
      this.isFirstMove = false;
      this.placedTiles = [];
      this.fillRacks();
      this.consecutiveSkips = 0;
      this.currentTurn = "ai";

      // Add to move history with all formed words
      this.addToMoveHistory("Player", moveDescription, totalScore);
      this.updateGameState();

      if (!this.checkGameEnd()) {
        await this.aiTurn();
      }
    } else {
      alert("Invalid word! Please try again.");
      this.resetPlacedTiles();
    }
  }

  addToMoveHistory(player, words, score) {
    this.moveHistory.push({
      player,
      word: words, // This now contains all formed words with their individual scores
      score,
      timestamp: new Date(),
    });
    this.updateMoveHistory();
  }

  updateMoveHistory() {
    const historyDisplay =
      document.getElementById("move-history") ||
      this.createMoveHistoryDisplay();
    historyDisplay.innerHTML =
      "<h3>Move History</h3>" +
      this.moveHistory
        .map((move) => {
          if (
            move.word === "SKIP" ||
            move.word === "EXCHANGE" ||
            move.word === "QUIT"
          ) {
            return `<div class="move">
                        ${move.player}: "${move.word}" for ${move.score} points
                    </div>`;
          }

          // Handle multiple words (contains &)
          if (move.word.includes("&")) {
            const words = move.word.split("&").map((w) => w.trim());
            const wordScores = words.map((word) => {
              // Extract score from format "WORD (score)"
              const match = word.match(/(.+)\s*\((\d+)\)/);
              if (match) {
                return {
                  word: match[1].trim(),
                  score: parseInt(match[2]),
                };
              }
              return { word: word.trim(), score: 0 };
            });

            const formattedWords = wordScores
              .map((w) => `${w.word} (${w.score})`)
              .join(" & ");

            return `<div class="move">
                        ${move.player}: ${formattedWords} for total of ${move.score} points
                    </div>`;
          }

          // Single word
          return `<div class="move">
                    ${move.player}: "${move.word}" for ${move.score} points
                </div>`;
        })
        .join("");
  }

  updateGameState() {
    this.updateScores();
    this.updateTilesCount();
    this.updateTurnIndicator();
  }

  updateScores() {
    document.getElementById("player-score").textContent = this.playerScore;
    document.getElementById("computer-score").textContent = this.aiScore;
  }

  updateTilesCount() {
    document.getElementById("tiles-count").textContent = this.tiles.length;
  }

  updateTurnIndicator() {
    const turnDisplay =
      document.getElementById("current-turn") || this.createTurnIndicator();
    turnDisplay.textContent = `Current Turn: ${this.currentTurn === "player" ? "Your" : "Computer's"} Turn`;
    turnDisplay.className =
      this.currentTurn === "player" ? "player-turn" : "ai-turn";
  }

  createTurnIndicator() {
    const turnDisplay = document.createElement("div");
    turnDisplay.id = "current-turn";
    document.querySelector(".info-panel").prepend(turnDisplay);
    return turnDisplay;
  }

  checkGameEnd() {
    if (
      this.tiles.length === 0 &&
      (this.playerRack.length === 0 || this.aiRack.length === 0)
    ) {
      this.gameEnded = true;
      this.announceWinner();
      return true;
    }

    if (this.consecutiveSkips >= 4) {
      this.gameEnded = true;
      this.announceWinner();
      return true;
    }

    return false;
  }

  announceWinner() {
    const winner = this.playerScore > this.aiScore ? "Player" : "Computer";
    const finalScore = Math.max(this.playerScore, this.aiScore);

    let winOverlay = document.querySelector(".win-overlay");
    if (!winOverlay) {
      winOverlay = document.createElement("div");
      winOverlay.className = "win-overlay";
      // Add 'lose' class only if player lost
      if (winner === "Computer") {
        winOverlay.classList.add("lose");
      }
      document.body.appendChild(winOverlay);

      const messageBox = document.createElement("div");
      messageBox.className = "win-message";
      winOverlay.appendChild(messageBox);
    }

    // Get the message box
    const messageBox = winOverlay.querySelector(".win-message");
    messageBox.innerHTML = `
                  <h2>Game Over!</h2>
                  <p>${winner} wins with ${finalScore} points!</p>
                  <p>Final Scores:</p>
                  <p>Player: ${this.playerScore}</p>
                  <p>Computer: ${this.aiScore}</p>
                  <button onclick="location.reload()">Play Again</button>
              `;

    // Show the overlay with animation
    requestAnimationFrame(() => {
      winOverlay.classList.add("active");
      messageBox.classList.add("celebrate");
    });

    // Add confetti effect
    this.createConfettiEffect();
  }

  createConfettiEffect() {
    // Different effects for win vs lose
    const isWinner = this.playerScore > this.aiScore;

    if (isWinner) {
      // Happy emojis and colorful confetti for winning
      const emojis = ["🎉", "🎊", "🏆", "⭐", "🌟", "💫", "✨"];
      const colors = ["#FFD700", "#FFA500", "#FF69B4", "#00FF00", "#87CEEB"];
      const particleCount = 150;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");

        // Randomly choose between emoji or confetti
        const isEmoji = Math.random() > 0.7; // 30% chance of emoji

        if (isEmoji) {
          particle.textContent =
            emojis[Math.floor(Math.random() * emojis.length)];
          particle.style.fontSize = `${20 + Math.random() * 20}px`;
        } else {
          particle.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];
          particle.style.width = "10px";
          particle.style.height = "10px";
        }

        particle.style.cssText += `
                          position: fixed;
                          pointer-events: none;
                          left: ${Math.random() * 100}vw;
                          top: -20px;
                          opacity: 1;
                          transform: rotate(${Math.random() * 360}deg);
                          animation: win-particle-fall ${3 + Math.random() * 2}s linear forwards;
                      `;
        document.body.appendChild(particle);

        particle.addEventListener("animationend", () => {
          particle.remove();
        });
      }
    } else {
      // Taunting emojis for losing
      const emojis = [
        "😂",
        "🤣",
        "😝",
        "😜",
        "😋",
        "😏",
        "🤪",
        "😎",
        "🤭",
        "😈",
      ];
      const emojiCount = 50;

      for (let i = 0; i < emojiCount; i++) {
        const emoji = document.createElement("div");
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
                          position: fixed;
                          font-size: ${20 + Math.random() * 20}px;
                          pointer-events: none;
                          left: ${Math.random() * 100}vw;
                          top: -40px;
                          opacity: 1;
                          transform: rotate(${Math.random() * 360}deg);
                          animation: lose-particle-fall ${3 + Math.random() * 2}s linear forwards;
                      `;
        document.body.appendChild(emoji);

        emoji.addEventListener("animationend", () => {
          emoji.remove();
        });
      }
    }
  }

  addToMoveHistory(player, word, score) {
    this.moveHistory.push({
      player,
      word,
      score,
      timestamp: new Date(),
    });
    this.updateMoveHistory();
  }

  createMoveHistoryDisplay() {
    const historyDisplay = document.createElement("div");
    historyDisplay.id = "move-history";
    document.querySelector(".info-panel").appendChild(historyDisplay);
    return historyDisplay;
  }

  renderAIRack() {
    const rack = document.getElementById("ai-rack");
    rack.innerHTML = "";
    this.aiRack.forEach((tile) => {
      const tileElement = document.createElement("div");
      tileElement.className = "tile";
      tileElement.innerHTML = `
                      ${tile.letter}
                      <span class="points">${tile.value}</span>
                  `;
      rack.appendChild(tileElement);
    });
  }

  fillRacks() {
    const balanceRack = (rack) => {
      const vowels = ["A", "E", "I", "O", "U"];
      const vowelCount = rack.filter((tile) =>
        vowels.includes(tile.letter),
      ).length;

      // Aim for 2-3 vowels in a rack of 7 tiles
      if (vowelCount < 2 && this.tiles.length > 0) {
        // Find positions of consonants that could be swapped
        const consonantIndices = rack
          .map((tile, index) => (!vowels.includes(tile.letter) ? index : -1))
          .filter((index) => index !== -1);

        // Find vowels in the remaining tiles
        const vowelIndices = this.tiles
          .map((tile, index) => (vowels.includes(tile.letter) ? index : -1))
          .filter((index) => index !== -1);

        // Perform swap if possible
        if (consonantIndices.length > 0 && vowelIndices.length > 0) {
          const consonantIdx =
            consonantIndices[
              Math.floor(Math.random() * consonantIndices.length)
            ];
          const vowelIdx =
            vowelIndices[Math.floor(Math.random() * vowelIndices.length)];

          // Swap a consonant with a vowel
          const consonant = rack[consonantIdx];
          rack[consonantIdx] = this.tiles[vowelIdx];
          this.tiles[vowelIdx] = consonant;
        }
      }
      return rack;
    };

    // Fill player's rack
    while (this.playerRack.length < 7 && this.tiles.length > 0) {
      this.playerRack.push(this.tiles.pop());
    }

    // Balance player's rack if needed
    if (this.playerRack.length === 7) {
      this.playerRack = balanceRack(this.playerRack);
    }

    // Fill AI's rack
    while (this.aiRack.length < 7 && this.tiles.length > 0) {
      this.aiRack.push(this.tiles.pop());
    }

    // Update displays
    this.renderRack();
    this.renderAIRack();
    this.updateTilesCount();
  }

  setupExchangeSystem() {
    this.exchangePortal = document.getElementById("exchange-portal");
    const activateButton = document.getElementById("activate-exchange");

    activateButton.addEventListener("click", () => {
      this.toggleExchangeMode();
    });

    // Setup portal drop zone
    this.exchangePortal.addEventListener("dragover", (e) => {
      if (!this.exchangeMode) return;
      e.preventDefault();
      this.exchangePortal.classList.add("portal-dragover");
    });

    this.exchangePortal.addEventListener("dragleave", () => {
      this.exchangePortal.classList.remove("portal-dragover");
    });

    this.exchangePortal.addEventListener("drop", async (e) => {
      e.preventDefault();
      if (!this.exchangeMode) return;

      const tileIndex = e.dataTransfer.getData("text/plain");
      if (tileIndex) {
        await this.handleTileExchange(parseInt(tileIndex));
      }

      this.exchangePortal.classList.remove("portal-dragover");
    });
  }

  toggleExchangeMode() {
    if (this.currentTurn !== "player") {
      alert("Wait for your turn!");
      return;
    }

    this.exchangeMode = !this.exchangeMode;
    const activateButton = document.getElementById("activate-exchange");

    if (this.exchangeMode) {
      this.exchangePortal.classList.add("active");
      activateButton.textContent = "Deactivate Exchange Portal";
      activateButton.style.background =
        "linear-gradient(145deg, #ff4081, #f50057)";

      // Show exchange instructions
      const instructions = document.createElement("div");
      instructions.className = "exchange-instructions animated";
      this.exchangePortal.parentElement.appendChild(instructions);
    } else {
      this.exchangePortal.classList.remove("active");
      activateButton.textContent = "Activate Exchange Portal";
      activateButton.style.background =
        "linear-gradient(145deg, #42a5f5, #1976d2)";

      // Remove instructions
      const instructions = document.querySelector(
        ".exchange-instructions.animated",
      );
      if (instructions) {
        instructions.remove();
      }

      // Process any remaining exchanges
      if (this.exchangingTiles.length > 0) {
        this.completeExchange();
      }
    }
  }

  async handleTileExchange(tileIndex) {
    if (!this.exchangeMode || this.tiles.length === 0) return;

    const tile = this.playerRack[tileIndex];
    if (!tile) return;

    // Get the original tile element and its position
    const tileElement = document.querySelector(`[data-index="${tileIndex}"]`);
    const tileRect = tileElement.getBoundingClientRect();
    const portalRect = this.exchangePortal.getBoundingClientRect();

    // Create clone for animation
    const clone = tileElement.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = `${tileRect.left}px`;
    clone.style.top = `${tileRect.top}px`;
    clone.style.width = `${tileRect.width}px`;
    clone.style.height = `${tileRect.height}px`;
    clone.style.transition = "none";
    clone.style.zIndex = "1000";
    document.body.appendChild(clone);

    // Calculate the center of the portal
    const portalCenterX = portalRect.left + portalRect.width / 2;
    const portalCenterY = portalRect.top + portalRect.height / 2;

    // Create keyframes for the spiral animation
    const spiralKeyframes = [];
    const totalSteps = 50;
    const totalRotations = 3;
    const scaleFactor = 0.1;

    for (let i = 0; i <= totalSteps; i++) {
      const progress = i / totalSteps;
      const angle = progress * totalRotations * 2 * Math.PI;
      const radius = (1 - progress) * 100; // Spiral radius decreases as progress increases

      // Calculate position along spiral
      const x =
        tileRect.left +
        (portalCenterX - tileRect.left) * progress +
        Math.cos(angle) * radius;
      const y =
        tileRect.top +
        (portalCenterY - tileRect.top) * progress +
        Math.sin(angle) * radius;

      // Calculate scale and rotation
      const scale = 1 - progress * (1 - scaleFactor);
      const rotation = progress * 720; // Two full rotations

      spiralKeyframes.push({
        transform: `translate(${x - tileRect.left}px, ${y - tileRect.top}px) 
                             rotate(${rotation}deg) 
                             scale(${scale})`,
        opacity: 1 - progress * 0.8,
      });
    }

    // Add final keyframe for disappearing into portal
    spiralKeyframes.push({
      transform: `translate(${portalCenterX - tileRect.left}px, ${portalCenterY - tileRect.top}px) 
                         rotate(720deg) 
                         scale(${scaleFactor})`,
      opacity: 0,
    });

    // Create and play the animation
    const animation = clone.animate(spiralKeyframes, {
      duration: 1500,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    });

    // Create swirling particle effect
    const particles = [];
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "exchange-particle";
      particle.style.cssText = `
                  position: fixed;
                  width: 4px;
                  height: 4px;
                  background: ${["#64b5f6", "#2196f3", "#1976d2"][Math.floor(Math.random() * 3)]};
                  border-radius: 50%;
                  pointer-events: none;
                  z-index: 999;
              `;
      document.body.appendChild(particle);
      particles.push(particle);

      const delay = i * (1500 / particleCount);
      const particleAnimation = particle.animate(spiralKeyframes, {
        duration: 1500,
        delay: delay,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards",
      });

      particleAnimation.onfinish = () => particle.remove();
    }

    // Wait for animation to complete
    await animation.finished;
    clone.remove();

    // Add to exchanging tiles
    this.exchangingTiles.push({
      tile: tile,
      index: tileIndex,
    });

    // Remove from rack visually
    this.playerRack.splice(tileIndex, 1);
    this.renderRack();

    // Add portal pulse effect
    this.exchangePortal.classList.add("portal-pulse");
    setTimeout(() => {
      this.exchangePortal.classList.remove("portal-pulse");
    }, 500);

    // If player has exchanged enough tiles or rack is empty
    if (this.exchangingTiles.length >= 7 || this.playerRack.length === 0) {
      await this.completeExchange();
    }
  }

  async completeExchange() {
    if (this.exchangingTiles.length === 0) return;

    // Disable exchange mode
    this.exchangeMode = false;
    this.exchangePortal.classList.remove("active");
    document.getElementById("activate-exchange").textContent =
      "Activate Exchange Portal";

    // Create portal closing animation
    const portalClose = this.exchangePortal.animate(
      [
        { transform: "scale(1) rotate(0deg)", opacity: 1 },
        { transform: "scale(0) rotate(360deg)", opacity: 0 },
      ],
      {
        duration: 1000,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    );

    // Create new tiles animation
    const newTilesContainer = document.createElement("div");
    newTilesContainer.className = "new-tiles-container";
    document.body.appendChild(newTilesContainer);

    // Return exchanged tiles to bag and get new ones
    const newTiles = [];
    for (const exchangedTile of this.exchangingTiles) {
      this.tiles.push(exchangedTile.tile);
      this.shuffleTiles();
      const newTile = this.tiles.pop();
      if (newTile) {
        newTiles.push(newTile);
      }
    }

    // Animate new tiles appearing
    for (let i = 0; i < newTiles.length; i++) {
      const tile = newTiles[i];
      const tileElement = document.createElement("div");
      tileElement.className = "tile new-tile";
      tileElement.innerHTML = `
                  ${tile.letter}
                  <span class="points">${tile.value}</span>
              `;
      newTilesContainer.appendChild(tileElement);

      const portalRect = this.exchangePortal.getBoundingClientRect();
      const rackRect = document
        .getElementById("tile-rack")
        .getBoundingClientRect();
      const finalX = rackRect.left + i * 50; // Adjust spacing as needed
      const finalY = rackRect.top;

      await new Promise((resolve) => {
        tileElement.animate(
          [
            {
              left: `${portalRect.left + portalRect.width / 2}px`,
              top: `${portalRect.top + portalRect.height / 2}px`,
              transform: "scale(0) rotate(-360deg)",
              opacity: 0,
            },
            {
              left: `${finalX}px`,
              top: `${finalY}px`,
              transform: "scale(1) rotate(0deg)",
              opacity: 1,
            },
          ],
          {
            duration: 1000,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            fill: "forwards",
          },
        ).onfinish = resolve;
      });
    }

    // Update player's rack with new tiles
    this.playerRack.push(...newTiles);
    this.renderRack();

    // Cleanup
    newTilesContainer.remove();
    this.exchangingTiles = [];

    // Add to move history
    this.addToMoveHistory("Player", "EXCHANGE", 0);

    // Switch turn to AI
    this.currentTurn = "ai";
    this.consecutiveSkips++;
    this.updateGameState();

    // Check for game end or continue with AI turn
    if (!this.checkGameEnd()) {
      await this.aiTurn();
    }
  }

  handleAIExchange() {
    console.log("AI attempting to exchange tiles...");

    // Create visual effect for AI exchange
    this.showAIExchangeAnimation().then(() => {
      // Get current AI rack
      const oldTiles = [...this.aiRack];
      const exchangeCount = Math.min(this.aiRack.length, this.tiles.length);

      if (exchangeCount === 0) {
        console.log("No tiles left to exchange");
        this.skipAITurn();
        return;
      }

      // Return tiles to bag
      for (let i = 0; i < exchangeCount; i++) {
        this.tiles.push(this.aiRack.pop());
      }
      this.shuffleTiles();

      // Draw new tiles
      for (let i = 0; i < exchangeCount; i++) {
        if (this.tiles.length > 0) {
          this.aiRack.push(this.tiles.pop());
        }
      }

      // Update displays
      this.renderAIRack();
      this.updateTilesCount();

      // Add to move history
      this.addToMoveHistory("Computer", "EXCHANGE", 0);

      // Switch turn
      this.currentTurn = "player";
      this.consecutiveSkips++;
      this.updateGameState();

      console.log("AI exchange complete:", {
        oldTiles: oldTiles.map((t) => t.letter),
        newTiles: this.aiRack.map((t) => t.letter),
      });

      // Check for game end
      this.checkGameEnd();
    });
  }

  async showAIExchangeAnimation() {
    const portal = document.getElementById("exchange-portal");
    portal.classList.add("active");

    // Animate AI tiles going into portal
    const aiRackElement = document.getElementById("ai-rack");
    const tileElements = Array.from(
      aiRackElement.getElementsByClassName("tile"),
    );
    const portalRect = portal.getBoundingClientRect();

    // Animate each tile one by one
    for (const tile of tileElements) {
      const tileRect = tile.getBoundingClientRect();

      // Create clone for animation
      const clone = tile.cloneNode(true);
      clone.style.position = "fixed";
      clone.style.left = `${tileRect.left}px`;
      clone.style.top = `${tileRect.top}px`;
      clone.style.width = `${tileRect.width}px`;
      clone.style.height = `${tileRect.height}px`;
      clone.style.transition = "none";
      clone.style.zIndex = "1000";
      document.body.appendChild(clone);

      // Calculate portal center
      const portalCenterX = portalRect.left + portalRect.width / 2;
      const portalCenterY = portalRect.top + portalRect.height / 2;

      // Create spiral keyframes
      const spiralKeyframes = [];
      const totalSteps = 50;
      const totalRotations = 3;
      const scaleFactor = 0.1;

      for (let i = 0; i <= totalSteps; i++) {
        const progress = i / totalSteps;
        const angle = progress * totalRotations * 2 * Math.PI;
        const radius = (1 - progress) * 100;

        const x =
          tileRect.left +
          (portalCenterX - tileRect.left) * progress +
          Math.cos(angle) * radius;
        const y =
          tileRect.top +
          (portalCenterY - tileRect.top) * progress +
          Math.sin(angle) * radius;

        const scale = 1 - progress * (1 - scaleFactor);
        const rotation = progress * 720;

        spiralKeyframes.push({
          transform: `translate(${x - tileRect.left}px, ${y - tileRect.top}px) 
                               rotate(${rotation}deg) 
                               scale(${scale})`,
          opacity: 1 - progress * 0.8,
        });
      }

      // Add final keyframe
      spiralKeyframes.push({
        transform: `translate(${portalCenterX - tileRect.left}px, ${portalCenterY - tileRect.top}px) 
                           rotate(720deg) 
                           scale(${scaleFactor})`,
        opacity: 0,
      });

      // Create particles
      const particles = [];
      const particleCount = 10;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "exchange-particle";
        particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: ${["#64b5f6", "#2196f3", "#1976d2"][Math.floor(Math.random() * 3)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 999;
                `;
        document.body.appendChild(particle);
        particles.push(particle);

        const delay = i * (1000 / particleCount);
        const particleAnimation = particle.animate(spiralKeyframes, {
          duration: 1000,
          delay: delay,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        });

        particleAnimation.onfinish = () => particle.remove();
      }

      // Animate the tile
      await new Promise((resolve) => {
        const animation = clone.animate(spiralKeyframes, {
          duration: 1000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        });

        animation.onfinish = () => {
          clone.remove();
          resolve();
        };
      });

      // Add portal pulse effect
      portal.classList.add("portal-pulse");
      setTimeout(() => {
        portal.classList.remove("portal-pulse");
      }, 500);

      // Small delay between tiles
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Short delay before showing new tiles
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Animate new tiles coming out
    for (let i = 0; i < this.aiRack.length; i++) {
      const newTile = document.createElement("div");
      newTile.className = "tile ai-tile";
      document.body.appendChild(newTile);

      const startX = portalRect.left + portalRect.width / 2;
      const startY = portalRect.top + portalRect.height / 2;
      const finalX = aiRackElement.offsetLeft + i * 50;
      const finalY = aiRackElement.offsetTop;

      const reverseSpiral = [
        {
          transform: `translate(${startX}px, ${startY}px) scale(0) rotate(360deg)`,
          opacity: 0,
        },
        {
          transform: `translate(${finalX}px, ${finalY}px) scale(1) rotate(0deg)`,
          opacity: 1,
        },
      ];

      await new Promise((resolve) => {
        const animation = newTile.animate(reverseSpiral, {
          duration: 1000,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        });

        // Create emergence particles
        const particleCount = 5;
        for (let j = 0; j < particleCount; j++) {
          const particle = document.createElement("div");
          particle.className = "exchange-particle";
          particle.style.cssText = `
                        position: fixed;
                        width: 4px;
                        height: 4px;
                        background: ${["#64b5f6", "#2196f3", "#1976d2"][Math.floor(Math.random() * 3)]};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 999;
                    `;
          document.body.appendChild(particle);

          const angle = (j / particleCount) * Math.PI * 2;
          const radius = 30;
          const particleAnim = particle.animate(
            [
              {
                transform: `translate(${startX + Math.cos(angle) * radius}px, 
                                       ${startY + Math.sin(angle) * radius}px) scale(0)`,
                opacity: 1,
              },
              {
                transform: `translate(${startX + Math.cos(angle) * radius * 2}px, 
                                       ${startY + Math.sin(angle) * radius * 2}px) scale(1)`,
                opacity: 0,
              },
            ],
            {
              duration: 1000,
              easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
          );

          particleAnim.onfinish = () => particle.remove();
        }

        animation.onfinish = () => {
          newTile.remove();
          resolve();
        };
      });

      // Small delay between new tiles
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    portal.classList.remove("active");
  }

  setupEventListeners() {
    // Initial highlight of valid placements
    this.highlightValidPlacements();

    // Update highlights when game state changes
    document.addEventListener("click", () => {
      this.highlightValidPlacements();
    });

    // Add exchange system setup
    this.setupExchangeSystem();

    document
      .getElementById("play-word")
      .addEventListener("click", () => this.playWord());

    document
      .getElementById("shuffle-rack")
      .addEventListener("click", async () => {
        const rack = document.getElementById("tile-rack");
        const tiles = [...rack.children];

        // Disable tile dragging during animation
        tiles.forEach((tile) => (tile.draggable = false));

        // Visual shuffle animation
        for (let i = 0; i < 5; i++) {
          // 5 visual shuffles
          await new Promise((resolve) => {
            tiles.forEach((tile) => {
              tile.style.transition = "transform 0.2s ease";
              tile.style.transform = `translateX(${Math.random() * 20 - 10}px) rotate(${Math.random() * 10 - 5}deg)`;
            });
            setTimeout(resolve, 200);
          });
        }

        // Reset positions with transition
        tiles.forEach((tile) => {
          tile.style.transform = "none";
        });

        // Actual shuffle logic
        for (let i = this.playerRack.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.playerRack[i], this.playerRack[j]] = [
            this.playerRack[j],
            this.playerRack[i],
          ];
        }

        // Wait for position reset animation to complete
        setTimeout(() => {
          this.renderRack();
        }, 200);

        // Re-enable dragging
        setTimeout(() => {
          const newTiles = document.querySelectorAll("#tile-rack .tile");
          newTiles.forEach((tile) => (tile.draggable = true));
        }, 400);
      });

    document.getElementById("skip-turn").addEventListener("click", () => {
      this.consecutiveSkips++;
      this.currentTurn = "ai";
      this.updateGameState();
      this.highlightValidPlacements();
      if (!this.checkGameEnd()) {
        this.aiTurn();
      }
    });

    const quitButton = document.getElementById("quit-game");
    if (quitButton) {
      quitButton.addEventListener("click", () => {
        if (this.gameEnded) return; // Prevent multiple triggers

        // Set the computer as winner since player quit
        this.aiScore = Math.max(this.aiScore, this.playerScore + 1);
        this.playerScore = Math.min(this.playerScore, this.aiScore - 1);
        this.gameEnded = true;

        // Update scores before animation
        this.updateScores();

        // Add the quit move to history
        if (this.moveHistory) {
          this.moveHistory.push({
            player: "Player",
            word: "QUIT",
            score: 0,
            timestamp: new Date(),
          });
          this.updateMoveHistory();
        }

        // Trigger game over animation
        this.announceWinner();
      });
    }

    document
      .getElementById("print-history")
      .addEventListener("click", async () => {
        const printWindow = window.open("", "_blank");
        const gameDate = new Date().toLocaleString();

        // Show loading message
        printWindow.document.write(`
                      <html>
                          <head>
                              <title>Puzzle Game History - ${gameDate}</title>
                              <style>
                                  body {
                                      font-family: Arial, sans-serif;
                                      margin: 20px;
                                      line-height: 1.6;
                                  }
                                  .header {
                                      text-align: center;
                                      margin-bottom: 20px;
                                      padding-bottom: 10px;
                                      border-bottom: 2px solid #333;
                                  }
                                  .move {
                                      margin: 20px 0;
                                      padding: 15px;
                                      border: 1px solid #ddd;
                                      border-radius: 5px;
                                      background: #f9f9f9;
                                  }
                                  .word-header {
                                      font-size: 1.2em;
                                      color: #2c3e50;
                                      margin-bottom: 10px;
                                  }
                                  .definitions {
                                      margin-left: 20px;
                                      padding: 10px;
                                      border-left: 3px solid #3498db;
                                  }
                                  .part-of-speech {
                                      color: #e67e22;
                                      font-style: italic;
                                  }
                                  .scores {
                                      margin: 20px 0;
                                      padding: 15px;
                                      background: #f5f5f5;
                                      border-radius: 5px;
                                  }
                                  .loading {
                                      text-align: center;
                                      padding: 20px;
                                      font-style: italic;
                                      color: #666;
                                  }
                              </style>
                          </head>
                          <body>
                              <div class="loading">Loading definitions...</div>
                          </body>
                      </html>
                  `);

        // Gather all unique words from move history
        const uniqueWords = [
          ...new Set(
            this.moveHistory
              .map((move) => move.word)
              .filter((word) => word !== "SKIP" && word !== "EXCHANGE"),
          ),
        ];

        // Fetch definitions for all words
        const wordDefinitions = new Map();
        for (const word of uniqueWords) {
          const definitions = await this.getWordDefinition(word);
          if (definitions) {
            wordDefinitions.set(word, definitions);
          }
        }

        // Generate and set the content
        const content = this.generatePrintContent(gameDate, wordDefinitions);
        printWindow.document.body.innerHTML = content;
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      });
  }
}

// Initialize game when document is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ScrabbleGame();
});
