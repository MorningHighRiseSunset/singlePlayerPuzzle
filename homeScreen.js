document.addEventListener("DOMContentLoaded", () => {
    // Language configuration with flags and labels
    const languages = [
        { code: 'en', flag: '🇺🇸', name: 'English', label: 'Puzzle' },
        { code: 'es', flag: '🇪🇸', name: 'Spanish', label: 'Rompecabezas' },
        { code: 'zh', flag: '🇨🇳', name: 'Chinese', label: '拼图' },
        { code: 'fr', flag: '🇫🇷', name: 'French', label: 'Puzzle' }
    ];

    // Create language buttons
    const languageButtonsContainer = document.getElementById('language-buttons');
    let selectedLanguage = null;

    languages.forEach(lang => {
        const button = document.createElement('button');
        button.className = 'language-btn';
        button.dataset.lang = lang.code;
        button.dataset.label = lang.label;
        button.innerHTML = `
            <span class="flag-emoji">${lang.flag}</span>
            <span class="lang-text">Play in ${lang.name}</span>
        `;
        button.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 12px;
            border: 2px solid #1976d2;
            border-radius: 12px;
            background: linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%);
            color: #1976d2;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            min-height: 80px;
        `;

        // Hover effects
        button.addEventListener('mouseenter', () => {
            if (!button.classList.contains('selected')) {
                button.style.background = 'linear-gradient(145deg, #e3f2fd 0%, #bbdefb 100%)';
                button.style.transform = 'translateY(-2px)';
                button.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)';
            }
        });

        button.addEventListener('mouseleave', () => {
            if (!button.classList.contains('selected')) {
                button.style.background = 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)';
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            }
        });

        // Click handler
        button.addEventListener('click', () => {
            // Remove selection from all buttons
            document.querySelectorAll('.language-btn').forEach(btn => {
                btn.classList.remove('selected');
                btn.style.background = 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)';
                btn.style.borderColor = '#1976d2';
                btn.style.color = '#1976d2';
            });

            // Select this button
            button.classList.add('selected');
            button.style.background = 'linear-gradient(145deg, #1976d2 0%, #1565c0 100%)';
            button.style.borderColor = '#0d47a1';
            button.style.color = '#ffffff';
            button.style.boxShadow = '0 4px 16px rgba(25, 118, 210, 0.4)';

            selectedLanguage = lang;
            
            // Auto-start game after selection
            setTimeout(() => {
                startGame(lang);
            }, 300);
        });

        languageButtonsContainer.appendChild(button);
    });

    // Flag emoji styling
    const style = document.createElement('style');
    style.textContent = `
        .flag-emoji {
            font-size: 32px;
            line-height: 1;
            display: block;
        }
        .lang-text {
            font-size: 13px;
            text-align: center;
            line-height: 1.2;
        }
        @media (max-width: 600px) {
            .flag-emoji {
                font-size: 28px;
            }
            .lang-text {
                font-size: 12px;
            }
            #language-buttons {
                grid-template-columns: repeat(2, 1fr) !important;
            }
        }
    `;
    document.head.appendChild(style);

    function startGame(lang) {
        const board = document.querySelector(".mini-scrabble-board");
        const homeContainer = document.querySelector(".home-container");
        const selectedButton = document.querySelector(`.language-btn[data-lang="${lang.code}"]`);

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

        // --- SPEECH: Enthusiastic "Puzzle!" in selected language ---
        window.speechSynthesis.cancel();
        const label = lang.label || 'Puzzle';
        const voices = window.speechSynthesis.getVoices();
        // Try to find a voice matching the selected language
        let chosenVoice = voices.find(v => v.lang.startsWith(lang.code));
        // Prefer female voice if available
        if (chosenVoice && voices.filter(v => v.lang.startsWith(lang.code)).length > 1) {
            const female = voices.filter(v => v.lang.startsWith(lang.code)).find(v => v.name.toLowerCase().includes('female') || v.gender === 'female');
            if (female) chosenVoice = female;
        }
        const utter = new SpeechSynthesisUtterance(label + '!');
        utter.lang = lang.code;
        utter.rate = 1.25;
        utter.pitch = 1.3;
        utter.volume = 1.0;
        if (chosenVoice) utter.voice = chosenVoice;
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
                // Use selected language and pass as query param
                try {
                    const langCode = lang ? encodeURIComponent(lang.code) : 'en';
                    window.location.href = "game.html?lang=" + langCode;
                } catch (e) {
                    window.location.href = "game.html";
                }
            }, 800);
        }, 4000);
    }
});
