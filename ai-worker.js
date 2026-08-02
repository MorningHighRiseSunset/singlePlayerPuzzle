// AI Worker for parallel word search
self.onmessage = function(e) {
    const { 
        type, 
        workerId, 
        dictionarySubset, 
        rack, 
        anchors, 
        boardState,
        premiumSquares 
    } = e.data;

    if (type === 'search') {
        const possiblePlays = findPlaysInSubset(
            dictionarySubset, 
            rack, 
            anchors, 
            boardState,
            premiumSquares
        );
        
        self.postMessage({
            type: 'result',
            workerId,
            plays: possiblePlays
        });
    }
};

function findPlaysInSubset(dictionary, rack, anchors, boardState, premiumSquares) {
    const possiblePlays = [];
    const seen = new Set();
    
    // For each anchor, try both directions
    for (const anchor of anchors) {
        for (const isHorizontal of [true, false]) {
            const prefix = getPrefix(anchor, isHorizontal, boardState);
            const suffix = getSuffix(anchor, isHorizontal, boardState);
            
            // Only consider word lengths that fit the available space
            let maxLen = 1 + prefix.length + suffix.length + rack.length;
            let minLen = Math.max(2, prefix.length + suffix.length + 1);
            maxLen = Math.min(maxLen, 15);
            
            // Search through dictionary subset for matching words
            for (const word of dictionary) {
                const upperWord = word.toUpperCase();
                
                // Skip if word doesn't match length constraints
                if (upperWord.length < minLen || upperWord.length > maxLen) continue;
                
                // Skip if word doesn't match prefix/suffix
                if (prefix && !upperWord.startsWith(prefix)) continue;
                if (suffix && !upperWord.endsWith(suffix)) continue;
                
                // Check if word can be formed with rack letters
                if (!canFormWord(upperWord, prefix, suffix, rack)) continue;
                
                // Calculate position and score
                const play = calculatePlay(upperWord, anchor, isHorizontal, prefix, suffix, rack, boardState, premiumSquares);
                if (play) {
                    const playKey = `${play.word}-${play.row}-${play.col}-${play.horizontal}`;
                    if (!seen.has(playKey)) {
                        seen.add(playKey);
                        possiblePlays.push(play);
                    }
                }
            }
        }
    }
    
    // Sort by score (descending)
    return possiblePlays.sort((a, b) => b.score - a.score);
}

function getPrefix(anchor, isHorizontal, boardState) {
    let prefix = "";
    let row = anchor.row;
    let col = anchor.col;
    
    if (isHorizontal) {
        col--;
        while (col >= 0 && boardState[row] && boardState[row][col]) {
            prefix = boardState[row][col].letter + prefix;
            col--;
        }
    } else {
        row--;
        while (row >= 0 && boardState[row] && boardState[row][col]) {
            prefix = boardState[row][col].letter + prefix;
            row--;
        }
    }
    
    return prefix;
}

function getSuffix(anchor, isHorizontal, boardState) {
    let suffix = "";
    let row = anchor.row;
    let col = anchor.col;
    
    if (isHorizontal) {
        col++;
        while (col < 15 && boardState[row] && boardState[row][col]) {
            suffix += boardState[row][col].letter;
            col++;
        }
    } else {
        row++;
        while (row < 15 && boardState[row] && boardState[row][col]) {
            suffix += boardState[row][col].letter;
            row++;
        }
    }
    
    return suffix;
}

function canFormWord(word, prefix, suffix, rack) {
    const letterCount = {};
    let blankCount = rack.filter(l => l === "*").length;
    
    rack.forEach(letter => {
        if (letter !== "*") {
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }
    });
    
    // Add prefix and suffix letters to available letters
    for (const letter of prefix) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    for (const letter of suffix) {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
    
    // Check if word can be formed
    for (const letter of word) {
        if (letterCount[letter] > 0) {
            letterCount[letter]--;
        } else if (blankCount > 0) {
            blankCount--;
        } else {
            return false;
        }
    }
    
    return true;
}

function calculatePlay(word, anchor, isHorizontal, prefix, suffix, rack, boardState, premiumSquares) {
    // Calculate the actual starting position based on prefix length
    const startPos = {
        row: anchor.row,
        col: anchor.col
    };
    
    if (isHorizontal) {
        startPos.col -= prefix.length;
    } else {
        startPos.row -= prefix.length;
    }
    
    // Validate position is within board bounds
    if (startPos.row < 0 || startPos.row >= 15 || startPos.col < 0 || startPos.col >= 15) {
        return null; // Invalid position
    }
    
    // Check if word fits on board
    if (isHorizontal) {
        if (startPos.col + word.length > 15) return null;
    } else {
        if (startPos.row + word.length > 15) return null;
    }
    
    const play = {
        word: word,
        startPos: startPos,
        isHorizontal: isHorizontal,
        score: calculateScore(word, anchor, isHorizontal, boardState, premiumSquares),
        quality: calculateQuality(word)
    };
    
    return play;
}

function calculateScore(word, anchor, isHorizontal, boardState, premiumSquares) {
    // Simplified scoring - should be enhanced with proper board position calculation
    const letterScores = {
        'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4,
        'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3,
        'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8,
        'Y': 4, 'Z': 10
    };
    
    let score = 0;
    for (const letter of word) {
        score += letterScores[letter] || 0;
    }
    
    // Add length bonus
    if (word.length >= 5) score += 5;
    if (word.length >= 6) score += 10;
    if (word.length >= 7) score += 20;
    
    return score;
}

function calculateQuality(word) {
    // Simple quality metric based on word length and common letters
    const commonLetters = ['E', 'A', 'R', 'I', 'O', 'T', 'N', 'S', 'L', 'U'];
    let commonCount = 0;
    
    for (const letter of word) {
        if (commonLetters.includes(letter)) {
            commonCount++;
        }
    }
    
    return word.length * 10 + commonCount;
}