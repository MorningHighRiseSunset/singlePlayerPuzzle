# Scrabble Game - Word Validation & AI Word Pulling Diagnostics

## Executive Summary
This document provides a comprehensive analysis of how the game validates words for both players and the AI, including word pulling mechanisms and dictionary lookups.

---

## 1. DICTIONARY & WORD STORAGE

### Dictionary Loading
- **Location**: `loadDictionary()` method
- **Source**: Loads from `dictionary-wamerican.js` 
- **Format**: JavaScript Set for O(1) lookup performance
- **Size**: English American dictionary (WAmerican)
- **Build**: Trie structure created during `init()` for AI word generation

### Trie Structure
```javascript
this.trie = new Trie();
for (const word of this.dictionary) {
    this.trie.insert(word.toUpperCase());
}
```
- Used for advanced AI word generation
- Enables prefix/suffix matching
- Supports pattern-based searches

---

## 2. PLAYER WORD VALIDATION FLOW

### Entry Point: `validateWord()`

**Validation Steps:**

1. **Get Formed Words**
   - Calls `getFormedWords()` to identify all words created by tile placement
   - Includes main word and all cross-words

2. **First Move Check**
   - First move must use center square (7, 7)
   - Check: `this.placedTiles.some(tile => tile.row === 7 && tile.col === 7)`

3. **Tile Connection (Non-First Moves)**
   - Placed tiles must touch existing tiles
   - Ensures board connectivity

4. **Dictionary Validation**
   ```javascript
   formedWords.forEach((wordInfo) => {
       const word = wordInfo.word.toLowerCase();
       if (!this.dictionary.has(word)) {
           allWordsValid = false;
       }
   });
   ```

5. **Duplicate Prevention**
   - Checks `wordsPlayed` Set to prevent replaying same word
   - Maintains game history

**Return Value**: Boolean - true if all validations pass

---

## 3. AI WORD VALIDATION FLOW

### Three-Layer Validation System

#### Layer 1: Initial Word Finding
**Function**: `findPossibleWordsFromLetters(letters)`
- Iterates through entire dictionary
- Checks if word can be formed with available tiles (accounting for blanks)
- Returns Set of formable words

**Key Logic**:
```javascript
for (const dictWord of this.dictionary) {
    if (dictWord.length >= 2 && dictWord.length <= letters.length) {
        // Count available letters vs required letters
        // Account for blank tiles (*) as wildcards
    }
}
```

#### Layer 2: Position Validation
**Function**: `isValidAIPlacement(word, startRow, startCol, horizontal)`

**Checks Performed**:
1. Word length >= 2
2. Word exists in dictionary
3. Board boundaries respected
4. Cross-words are valid (length > 1)
5. First move uses center square if applicable
6. Valid intersection with existing tiles

**Cross-Word Validation**:
```javascript
const crossWord = horizontal ?
    this.getVerticalWordAt(row, col, tempBoard) :
    this.getHorizontalWordAt(row, col, tempBoard);

if (crossWord && crossWord.length > 1) {
    if (!this.dictionary.has(crossWord.toLowerCase())) {
        return false; // Invalid cross-word
    }
}
```

#### Layer 3: Final Triple-Check
**Function**: `checkAIMoveValidity(word, startPos, isHorizontal)`

**Exclusions**:
```javascript
const excludedVariants = new Set([
    "atropin", // German spelling
    // Add more known variants as needed
]);
```

**Validation**:
- Simulates move on temporary board
- Collects ALL words formed (main + cross)
- Verifies each word is in dictionary
- Checks for excluded variants
- Returns: `{ valid: true/false, invalidWords: [] }`

**Debug Output** (when `showAIDebug = true`):
```
[AI Ghost Check] Invalid main word: XXX
[AI Ghost Check] Main word valid: XXX
[AI Ghost Check] Invalid cross word: XXX
[AI Ghost Check] Cross word valid: XXX
```

---

## 4. WORD PULLING & CANDIDATE GENERATION

### AI Word Candidate Generation

#### Method 1: Simple Word Finding
**Function**: `findSimpleWords(letters)`
- Basic iteration through dictionary
- Checks letter availability
- Returns array of formable words
- **Speed**: Fast
- **Accuracy**: Good for common words

#### Method 2: Complex Pattern-Based
**Function**: `generatePotentialWords(availableLetters, [hPrefix, hSuffix, vPrefix, vSuffix])`
- Uses prefix/suffix patterns from board
- Generates words matching patterns
- Only checks words >= 4 letters
- **Speed**: Slower but more strategic
- **Accuracy**: Excellent for board optimization

#### Method 3: Best Play Selection
**Function**: `selectBestPlay(plays)`
- Filters plays by validity
- Ranks plays by score
- **Strict Mode**: Enforced when < 10 tiles remaining
- **Normal Mode**: Allows some invalid cross-words if majority valid

```javascript
const strictMode = this.tiles.length < 10 || this.aiRack.length <= 3;

if (strictMode) {
    return crossWords.every(word =>
        this.dictionary.has(word.toLowerCase()) && word.length > 1
    );
} else {
    // Allow if most cross-words are valid
    const validCount = crossWords.filter(word =>
        this.dictionary.has(word.toLowerCase()) && word.length > 1
    ).length;
}
```

---

## 5. TWO-LETTER WORDS HANDLING

### Special Case: Two-Letter Words
- **Why Special**: Not all two-letter combinations are valid in Scrabble
- **Storage**: Hardcoded in `validTwoLetterWords` Set (~100+ entries)
- **Includes**: AA, AB, AD, AE, AG, ... ZA, ZO, etc.
- **Lookup**: Direct Set check for fast validation

### Risk Assessment ⚠️
- Hardcoded list may become outdated if dictionary updates
- Should be generated from dictionary instead of hardcoded

---

## 6. ABBREVIATION FILTERING

### Abbreviation Rejection
**Function**: `isAbbreviation(word)`
- Large Set of ~400+ known abbreviations
- Categories covered:
  - Government & Military (CIA, FBI, NASA, NATO)
  - Medical (ICU, ER, MRI, CT)
  - Technology (IBM, CPU, GPU, SSD)
  - Business & Finance (CEO, CPA, ETF, IRA)
  - Miscellaneous (UFO, VIP, POV, MVP)

### Two-Letter Abbreviations
```javascript
if (word.length === 2) {
    if (!validTwoLetterWords.has(word)) {
        return true; // Is an abbreviation (invalid)
    }
}
```

---

## 7. WORD HISTORY & DUPLICATES

### Duplicate Prevention
**Data Structure**: `wordsPlayed` Set
- Maintains uppercase version of all words played
- Prevents replaying same word in game session

**Check Logic**:
```javascript
if (this.wordsPlayed && this.wordsPlayed.has(wordUpper) || existedBefore) {
    // Skip - word already played
}
```

### Move History
**Data Structure**: `moveHistory` Array
- Records all moves (player and AI)
- Includes words and scores
- Displayed in move history UI (last 50 moves)

---

## 8. CROSS-WORD VALIDATION

### Getting Cross-Words
**Functions**:
- `getHorizontalWordAt(row, col, board)` - Gets word containing position
- `getVerticalWordAt(row, col, board)` - Gets word at position

### Validation Requirements
1. Cross-word length must be > 1
2. Cross-word must be in dictionary
3. Cross-word cannot be a previously played word (in AI moves)
4. All cross-words must be valid for the overall move to be valid

### Example Flow
```
Player places: C-A-T horizontally at (7, 7)
Vertical cross-words checked:
  - Above C
  - Above A
  - Above T
All must be valid words or single letters
```

---

## 9. DEBUG & DIAGNOSTICS

### Enable Debug Mode
```javascript
// In browser console:
window.game.showAIDebug = true;

// Watch console for output like:
[AI] Word found: PUZZLE
[AI Ghost Check] Main word valid: PUZZLE
[AI Ghost Check] Cross word valid: AND
```

### Debug Functions
```javascript
// Dump last scored words and recent moves
window.game.debugDumpLastScore(10);

// Output shows:
DEBUG: Last Scored Words & Recent Moves
Last scored words: [...]
Recent moveHistory: [...]
```

### Logging Methods
- `logAIValidation(msg)` - Deduplicates messages
- `showAINotification(msg)` - Shows AI thoughts
- `console.log()` - Direct logging when showAIDebug = true

---

## 10. PERFORMANCE CHARACTERISTICS

### Dictionary Lookup: O(1)
- Uses JavaScript Set for constant-time lookup
- `dictionary.has(word.toLowerCase())`

### Word Finding: O(n)
- `n` = dictionary size (~60,000+ words)
- Iterates through all dictionary words
- Checks letter availability for each

### Board Scanning: O(1) - O(225)
- Board is 15x15 = 225 cells
- Position checking is O(1)
- Full board scan is O(225)

### AI Move Selection: O(n + m*225)
- `n` = dictionary size
- `m` = candidate words found
- Position validation scales with board

### Bottleneck: Word Finding & Pattern Matching
- **Optimization**: Trie structure enables prefix matching
- **Alternative**: Could use compressed dictionary

---

## 11. POTENTIAL ISSUES FOUND

### ✅ Strengths
1. Triple-layer validation ensures AI doesn't make invalid moves
2. Consistent case-insensitive lookups
3. Cross-word validation prevents board inconsistencies
4. First move validation works correctly
5. Duplicate word prevention working

### ⚠️ Potential Risks

**Risk 1: Hardcoded Two-Letter List**
- Location: `validTwoLetterWords` Set in `findTwoLetterPlay()`
- Issue: Must match dictionary exactly
- Mitigation: Should be generated from dictionary

**Risk 2: Abbreviation List Incomplete**
- Location: `isAbbreviation()` method
- Issue: Manual list may miss new abbreviations
- Mitigation: Could check word format (all caps, etc.)

**Risk 3: Variant Spelling Exclusions**
- Location: `excludedVariants` Set in `checkAIMoveValidity()`
- Issue: Only one entry ("atropin")
- Mitigation: Should be comprehensive or fetched from source

**Risk 4: Pattern Matching Performance**
- Issue: `generatePotentialWords()` skips words < 4 letters
- Impact: May miss valid 2-3 letter plays in some situations
- Status: By design, trades completeness for speed

---

## 12. TESTING RECOMMENDATIONS

### Test Cases to Verify

**Player Validation**:
1. ✓ First move must use center
2. ✓ Can't play unconnected tiles (non-first move)
3. ✓ Can't form invalid words
4. ✓ Can't replay same word twice
5. ✓ Cross-words must be valid

**AI Validation**:
1. ✓ AI doesn't place invalid main words
2. ✓ AI doesn't create invalid cross-words
3. ✓ AI respects first move center requirement
4. ✓ AI avoids already-played words
5. ✓ AI's triple-check catches errors

**Edge Cases**:
1. Using blank tiles
2. Two-letter words at board edges
3. Creating multiple cross-words
4. Adjacent letters from previous moves
5. Endgame with limited tiles

---

## 13. SUMMARY TABLE

| Aspect | Player | AI | Status |
|--------|--------|-----|--------|
| Dictionary Lookup | ✓ | ✓ | Consistent |
| Two-Letter Words | Manual check | Manual check | ⚠️ Hardcoded |
| Cross-Word Validation | Automatic | Automatic | ✓ Works |
| First Move Center | Checked | Checked | ✓ Works |
| Duplicate Prevention | ✓ | ✓ | ✓ Works |
| Abbreviation Filter | Limited | Limited | ⚠️ Incomplete |
| Debug Mode | Basic | Extensive | ✓ Good |
| Performance | Good | Acceptable | ✓ OK |

---

## 14. RECOMMENDATIONS

### High Priority
1. Generate two-letter word list from dictionary instead of hardcoding
2. Expand abbreviation exclusion list
3. Add comprehensive variant spelling exclusions

### Medium Priority
1. Add validation logging to player moves (when debug enabled)
2. Create automated test suite for validation functions
3. Performance optimization for word finding (use Trie more extensively)

### Low Priority
1. UI improvement for showing why a word was rejected
2. Educational mode explaining validation rules
3. Custom dictionary support

---

**Generated**: 2026-01-05
**Game Version**: Current
**Dictionary**: WAmerican (American English)

