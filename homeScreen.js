document.addEventListener("DOMContentLoaded", () => {
    // Set chess theme for white background
    document.documentElement.setAttribute('data-theme', 'chess');
    
    // Add sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page === 'how-to-play') {
                window.location.href = 'how-to-play.html';
            } else if (page === 'how-to-play-friend') {
                window.location.href = 'how-to-play-friend.html';
            }
        });
    });
    
    // Create 15x15 board using exact game logic
    const board = document.getElementById('scrabble-board');
    if (board) {
        const premiumSquares = getPremiumSquares();

        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cell = document.createElement("div");
                cell.className = "board-cell";
                cell.dataset.row = i;
                cell.dataset.col = j;

                // Add center star symbol
                if (i === 7 && j === 7) {
                    const centerStar = document.createElement("span");
                    centerStar.textContent = "⚜";
                    centerStar.className = "center-star";
                    cell.appendChild(centerStar);
                }

                const key = `${i},${j}`;
                if (premiumSquares[key]) {
                    cell.classList.add(premiumSquares[key]);
                }

                board.appendChild(cell);
            }
        }

        // Add "join now" tiles to the board
        // Place "join" at row 6, cols 5-8 (J at 6,5; O at 6,6; I at 6,7; N at 6,8)
        // Place "now" at row 7, cols 7-9 (N at 7,7; O at 7,8; W at 7,9)
        const tiles = [
            { letter: 'J', row: 6, col: 5 },
            { letter: 'O', row: 6, col: 6 },
            { letter: 'I', row: 6, col: 7 },
            { letter: 'N', row: 6, col: 8 },
            { letter: 'N', row: 7, col: 7 },
            { letter: 'O', row: 7, col: 8 },
            { letter: 'W', row: 7, col: 9 }
        ];

        tiles.forEach(tile => {
            const cellIndex = tile.row * 15 + tile.col;
            const cell = board.children[cellIndex];
            if (cell) {
                const tileDiv = document.createElement('div');
                tileDiv.className = 'tile';
                tileDiv.textContent = tile.letter;
                cell.appendChild(tileDiv);
            }
        });
    }
});

function getPremiumSquares() {
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

    // Triple Word Scores (pink squares)
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
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "tw"));

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

    // Triple Letter Scores (light blue squares)
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
    ].forEach(([row, col]) => (premium[`${row},${col}`] = "tl"));

    return premium;
}
