document.addEventListener("DOMContentLoaded", () => {
    // Create start game button
    const startButton = document.createElement('button');
    startButton.className = 'start-game-btn';
    startButton.textContent = 'Play Puzzle';
    startButton.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        padding: 12px 24px;
        border: 2px solid #1976d2;
        border-radius: 8px;
        background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
        color: #1976d2;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 16px;
        font-weight: bold;
        min-height: 50px;
        width: 200px;
    `;

    // Add button to the page
    const container = document.querySelector('.home-container');
    if (container) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            margin-top: 20px;
        `;
        buttonContainer.appendChild(startButton);
        container.appendChild(buttonContainer);
    }

    // Hover effects
    startButton.addEventListener('mouseenter', () => {
        startButton.style.background = 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)';
        startButton.style.transform = 'translateY(-2px)';
        startButton.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
    });

    startButton.addEventListener('mouseleave', () => {
        startButton.style.background = 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)';
        startButton.style.transform = 'translateY(0)';
        startButton.style.boxShadow = 'none';
    });

    // Click handler
    startButton.addEventListener('click', () => {
        startGame();
    });

    function startGame() {
        const board = document.querySelector(".mini-scrabble-board");
        const homeContainer = document.querySelector(".home-container");
        const selectedButton = startButton;

        // Remove any previous animation
        document.querySelectorAll(".puzzle-tile").forEach(el => el.remove());

        // Responsive tile size for mobile/desktop - made smaller
        const isMobile = window.innerWidth <= 600;
        const tileSize = isMobile ? 24 : 36;
        const fontSize = isMobile ? "0.9rem" : "1.4rem";

        // Get all cells in the true center row (row 4, 0-based, the 5th row)
        const centerRow = board.querySelectorAll(".mini-row")[4];
        const cells = centerRow.querySelectorAll(".mini-cell");

        // Letters and their target cells (PUZZLE, 6 letters, centered)
        // Use cells 2,3,4,5,6,7 (indices) so "Z" and "Z" straddle the center fleur-de-lis
        const letters = [
            { letter: "P", cell: cells[2] },
            { letter: "U", cell: cells[3] },
            { letter: "Z", cell: cells[4] },
            { letter: "Z", cell: cells[5] },
            { letter: "L", cell: cells[6] },
            { letter: "E", cell: cells[7] }
        ];

        letters.forEach((l, i) => {
            const tile = document.createElement("div");
            tile.className = "puzzle-tile";
            tile.textContent = l.letter;
            document.body.appendChild(tile);

            // Start at selected language button (or center if button not found)
            const startRect = selectedButton ? selectedButton.getBoundingClientRect() : {
                left: window.innerWidth / 2,
                top: window.innerHeight / 2,
                width: 0,
                height: 0
            };
            tile.style.position = "fixed";
            tile.style.left = `${startRect.left + startRect.width / 2 - tileSize / 2}px`;
            tile.style.top = `${startRect.top + startRect.height / 2 - tileSize / 2}px`;
            tile.style.width = `${tileSize}px`;
            tile.style.height = `${tileSize}px`;
            tile.style.background = "linear-gradient(145deg, #e3eafc 70%, #b6c7e6 100%)";
            tile.style.border = "3px solid #1976d2";
            tile.style.borderRadius = "8px";
            tile.style.boxShadow = "0 8px 24px #00338077, 0 2px 0 #fff8";
            tile.style.color = "#003380";
            tile.style.fontWeight = "bold";
            tile.style.fontSize = fontSize;
            tile.style.display = "flex";
            tile.style.alignItems = "center";
            tile.style.justifyContent = "center";
            tile.style.zIndex = 9999;
            tile.style.opacity = "0";
            tile.style.transition = "all 0.7s cubic-bezier(.68,-0.55,.27,1.55)";

            // Animate to the center row cell
            setTimeout(() => {
                const cellRect = l.cell.getBoundingClientRect();
                tile.style.opacity = "1";
                tile.style.transform = `translate(${cellRect.left - (startRect.left + startRect.width / 2 - tileSize / 2)}px, ${cellRect.top - (startRect.top + startRect.height / 2 - tileSize / 2)}px) scale(1.1)`;
            }, 100 + i * 120);

            // Add a little bounce
            setTimeout(() => {
                tile.style.transform += " scale(1.25)";
            }, 700 + i * 120);

            // Settle back to normal scale (but stay on board)
            setTimeout(() => {
                const cellRect = l.cell.getBoundingClientRect();
                tile.style.transform = `translate(${cellRect.left - (startRect.left + startRect.width / 2 - tileSize / 2)}px, ${cellRect.top - (startRect.top + startRect.height / 2 - tileSize / 2)}px) scale(1)`;
            }, 1000 + i * 120);
        });

        // --- SPEECH: Enthusiastic "Puzzle!" ---
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance('Puzzle!');
        utter.rate = 1.25;
        utter.pitch = 1.3;
        utter.volume = 1.0;
        window.speechSynthesis.speak(utter);

        // Fade to white after 4 seconds, then redirect
        setTimeout(() => {
            const fadeDiv = document.createElement("div");
            fadeDiv.style.position = "fixed";
            fadeDiv.style.left = 0;
            fadeDiv.style.top = 0;
            fadeDiv.style.width = "100vw";
            fadeDiv.style.height = "100vh";
            fadeDiv.style.background = "#fff";
            fadeDiv.style.opacity = "0";
            fadeDiv.style.zIndex = 10000;
            fadeDiv.style.transition = "opacity 0.7s";
            document.body.appendChild(fadeDiv);
            setTimeout(() => {
                fadeDiv.style.opacity = "1";
            }, 10);
            setTimeout(() => {
                window.location.href = "game.html";
            }, 800);
        }, 4000);
    }
});
