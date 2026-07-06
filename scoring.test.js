import { readFileSync } from 'fs';
import { beforeAll, describe, expect, test } from 'vitest';

let game;

beforeAll(() => {
  const script = readFileSync('./script.js', 'utf8');
  eval(script);
  game = new ScrabbleGame();
});

function placeTile(row, col, letter, opts = {}) {
  const tile = {
    letter,
    value: opts.isBlank ? 0 : game.tileValues[letter],
    isBlank: opts.isBlank || false,
    id: `test_${letter}_${row}_${col}`,
  };
  game.board[row][col] = tile;
  return tile;
}

describe('calculateWordScore', () => {
  test('WRINGER with G on DL scores 13', () => {
    game.board = Array(15).fill(null).map(() => Array(15).fill(null));
    game.placedTiles = [];

    const row = 8;
    const startCol = 4;
    const word = 'WRINGER';

    for (let i = 0; i < word.length; i++) {
      const col = startCol + i;
      placeTile(row, col, word[i]);
      game.placedTiles.push({ row, col, tile: game.board[row][col] });
    }

    // G is index 4 -> row 8, col 7 which is a DL square
    expect(game.getPremiumSquareType(row, startCol + 4)).toBe('dl');

    game._letterPremiumInfo = [];
    game._scoringNewlyPlacedSet = game.buildNewlyPlacedSet();
    const score = game.calculateWordScore(word, row, startCol, true);
    game._scoringNewlyPlacedSet = null;

    expect(score).toBe(13);
    expect(game._letterPremiumInfo).toEqual([
      { index: 4, letter: 'G', premium: 'dl' },
    ]);
  });

  test('only newly placed tiles receive premium bonuses', () => {
    game.board = Array(15).fill(null).map(() => Array(15).fill(null));
    game.placedTiles = [];

    const row = 8;
    const startCol = 4;
    const word = 'WRINGER';

    for (let i = 0; i < word.length; i++) {
      placeTile(row, startCol + i, word[i]);
    }

    // Only place G freshly on this turn
    game.placedTiles.push({ row, col: startCol + 4, tile: game.board[row][startCol + 4] });

    game._letterPremiumInfo = [];
    game._scoringNewlyPlacedSet = game.buildNewlyPlacedSet();
    const score = game.calculateWordScore(word, row, startCol, true);
    game._scoringNewlyPlacedSet = null;

    expect(score).toBe(13);
  });

  test('double word multiplier applies to newly placed DW square', () => {
    game.board = Array(15).fill(null).map(() => Array(15).fill(null));
    game.placedTiles = [];

    const row = 1;
    const col = 1; // DW square
    placeTile(row, col, 'A');
    game.placedTiles.push({ row, col, tile: game.board[row][col] });

    game._scoringNewlyPlacedSet = game.buildNewlyPlacedSet();
    const score = game.calculateWordScore('A', row, col, true);
    game._scoringNewlyPlacedSet = null;

    expect(score).toBe(2);
  });
});
