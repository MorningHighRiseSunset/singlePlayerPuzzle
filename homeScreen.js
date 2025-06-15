document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.querySelector(".start-btn");
    const board = document.querySelector(".mini-scrabble-board");
    const homeContainer = document.querySelector(".home-container");

    playBtn.addEventListener("click", function (e) {
        e.preventDefault();

    // Say "Puzzle!" aloud
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Puzzle!");
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);

        // Remove any previous animation
        document.querySelectorAll(".puzzle-tile").forEach(el => el.remove());

        // Responsive tile size for mobile/desktop
        const isMobile = window.innerWidth <= 600;
        const tileSize = isMobile ? 32 : 48;
        const fontSize = isMobile ? "1.2rem" : "2rem";

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

            // Start at play button
            const btnRect = playBtn.getBoundingClientRect();
            tile.style.position = "fixed";
            tile.style.left = `${btnRect.left + btnRect.width / 2 - tileSize / 2}px`;
            tile.style.top = `${btnRect.top + btnRect.height / 2 - tileSize / 2}px`;
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
                tile.style.transform = `translate(${cellRect.left - (btnRect.left + btnRect.width / 2 - tileSize / 2)}px, ${cellRect.top - (btnRect.top + btnRect.height / 2 - tileSize / 2)}px) scale(1.1)`;
            }, 100 + i * 120);

            // Add a little bounce
            setTimeout(() => {
                tile.style.transform += " scale(1.25)";
            }, 700 + i * 120);

            // Settle back to normal scale (but stay on board)
            setTimeout(() => {
                const cellRect = l.cell.getBoundingClientRect();
                tile.style.transform = `translate(${cellRect.left - (btnRect.left + btnRect.width / 2 - tileSize / 2)}px, ${cellRect.top - (btnRect.top + btnRect.height / 2 - tileSize / 2)}px) scale(1)`;
            }, 1000 + i * 120);
        });

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
    });
});
