let shownBlunders = new Set();

// Language translations
const translations = {
	en: {
		submit: 'Submit',
		shuffleRack: 'Shuffle Rack',
		skipTurn: 'Skip Turn',
		howToPlay: 'How to Play',
		quitGame: 'Quit / End Game',
		gameInfo: 'Game Info',
		scores: 'Scores',
		player: 'Player',
		computer: 'Computer',
		tilesRemaining: 'Tiles Remaining',
		moveHistory: 'Move History',
		landscape: 'For the best experience, please rotate your device to landscape mode',
		scroll: 'You can scroll up and down to access your rack, game controls, and move history',
		instructions: 'Please read "How to Play" in the menu before starting',
		bingoBonus: 'Bingo bonus!',
		skip: 'SKIP',
		quit: 'QUIT',
		exchange: 'EXCHANGE',
		aiExchanged: 'AI exchanged tiles',
		aiPlayingPreview: 'AI is playing its previewed move!',
		aiRunningOutOfTime: 'AI is running out of time, playing nearest valid move!',
		aiFoundMove: 'AI found a move!',
		aiNoMoveExchange: 'AI is dumbfounded and decides to exchange tiles...',
		noNewWords: '(No new words scored)',
		howToPlayTitle: 'How to Play',
		playingTiles: 'Playing Tiles:',
		desktopTiles: 'On desktop: Click and drag tiles from your rack to the board',
		mobileTiles: 'On mobile: Touch and hold a tile for 1 second, then drag to place it',
		removeTiles: 'To remove a tile, drag it back to your rack',
		creatingWords: 'Creating Words:',
		horizontalVertical: 'Place tiles horizontally (left to right) or vertically (top to bottom)',
		centerStar: 'First word must cross the center star',
		connectExisting: 'New words must connect to existing tiles on the board',
		validWords: 'All words formed must be valid dictionary words',
		submittingMove: 'Submitting Your Move:',
		afterPlacing: 'After placing your tiles, click the "Submit" button',
		invalidWords: 'Invalid words will be rejected and tiles returned to your rack',
		invalidTry: 'Invalid word! Please try again.',
		pointsCalculated: 'Points will be automatically calculated and added to your score',
		exchangingTiles: 'Exchanging Tiles:',
		activateExchange: 'Click "Activate Exchange Portal" to start an exchange',
		dragUnwanted: 'Drag unwanted tiles into the portal',
		receiveNewTiles: "You'll receive the same number of new tiles",
		countsAsTurn: 'This counts as your turn',
		skippingGameEnd: 'Skipping and Game End:',
		useSkipTurn: "Use \"Skip Turn\" if you can't make a valid move",
		gameEnds: 'The game ends when all tiles are used or both players skip twice in a row',
		scoreBased: 'Your score is based on the letter values and bonus squares',
		currentTurn: 'Current Turn',
		yourTurn: 'Your Turn',
		computerTurn: "Computer's Turn"
	},
	es: {
		submit: 'Enviar',
		shuffleRack: 'Mezclar Fichas',
		skipTurn: 'Pasar Turno',
		howToPlay: 'Cómo Jugar',
		quitGame: 'Salir / Terminar Juego',
		gameInfo: 'Información del Juego',
		scores: 'Puntuaciones',
		player: 'Jugador',
		computer: 'Computadora',
		tilesRemaining: 'Fichas Restantes',
		moveHistory: 'Historial de Movimientos',
		landscape: 'Para la mejor experiencia, gira tu dispositivo a modo horizontal',
		scroll: 'Puedes desplazarte hacia arriba y hacia abajo para acceder a tu estante, controles del juego e historial de movimientos',
		instructions: 'Por favor, lee "Cómo Jugar" en el menú antes de comenzar',
		bingoBonus: '¡Bonificación de Bingo!',
		skip: 'PASAR',
		quit: 'SALIR',
		exchange: 'INTERCAMBIAR',
		aiExchanged: 'La IA intercambió fichas',
		aiPlayingPreview: 'La IA está jugando su movimiento previsualizado!',
		aiRunningOutOfTime: 'La IA se está quedando sin tiempo, jugando el movimiento válido más cercano!',
		aiFoundMove: 'La IA encontró un movimiento!',
		aiNoMoveExchange: 'La IA está desconcertada y decide intercambiar fichas...',
		noNewWords: '(Sin palabras nuevas)',
		howToPlayTitle: 'Cómo Jugar',
		playingTiles: 'Colocación de Fichas:',
		desktopTiles: 'En computadora: Haz clic y arrastra fichas desde tu estante al tablero',
		mobileTiles: 'En móvil: Toca y mantén presionada una ficha durante 1 segundo, luego arrástrala para colocarla',
		removeTiles: 'Para quitar una ficha, arrástrala de vuelta a tu estante',
		creatingWords: 'Creando Palabras:',
		horizontalVertical: 'Coloca fichas horizontalmente (de izquierda a derecha) o verticalmente (de arriba a abajo)',
		centerStar: 'La primera palabra debe cruzar la estrella central',
		connectExisting: 'Las palabras nuevas deben conectar con fichas existentes en el tablero',
		validWords: 'Todas las palabras formadas deben ser palabras válidas del diccionario',
		submittingMove: 'Enviando Tu Movimiento:',
		afterPlacing: 'Después de colocar tus fichas, haz clic en el botón "Enviar"',
		invalidWords: 'Las palabras inválidas serán rechazadas y las fichas se devolverán a tu estante',
		invalidTry: '¡Palabra inválida! Por favor, inténtalo de nuevo.',
		pointsCalculated: 'Los puntos se calcularán automáticamente y se sumarán a tu puntuación',
		exchangingTiles: 'Intercambiando Fichas:',
		activateExchange: 'Haz clic en "Activar Portal de Intercambio" para iniciar un intercambio',
		dragUnwanted: 'Arrastra fichas no deseadas al portal',
		receiveNewTiles: 'Recibirás el mismo número de fichas nuevas',
		countsAsTurn: 'Esto cuenta como tu turno',
		skippingGameEnd: 'Pasando y Fin del Juego:',
		useSkipTurn: 'Usa "Pasar Turno" si no puedes hacer un movimiento válido',
		gameEnds: 'El juego termina cuando se usan todas las fichas o ambos jugadores pasan dos veces seguidas',
		scoreBased: 'Tu puntuación se basa en los valores de las letras y los cuadrados de bonificación',
		currentTurn: 'Turno Actual',
		yourTurn: 'Tu Turno',
		computerTurn: 'Turno de la Computadora'
	},
	fr: {
		submit: 'Soumettre',
		shuffleRack: 'Mélanger le Chevalet',
		skipTurn: 'Passer le Tour',
		howToPlay: 'Comment Jouer',
		quitGame: 'Quitter / Terminer le Jeu',
		gameInfo: 'Infos du Jeu',
		scores: 'Scores',
		player: 'Joueur',
		computer: 'Ordinateur',
		tilesRemaining: 'Tuiles Restantes',
		moveHistory: 'Historique des Mouvements',
		landscape: 'Pour une meilleure expérience, veuillez orienter votre appareil en mode paysage',
		scroll: 'Vous pouvez faire défiler vers le haut et vers le bas pour accéder à votre chevalet, aux commandes du jeu et à l\'historique des mouvements',
		instructions: 'Veuillez lire "Comment Jouer" dans le menu avant de commencer',
		bingoBonus: 'Bonus Bingo !',
		skip: 'PASSER',
		quit: 'QUITTER',
		exchange: 'ECHANGER',
		aiExchanged: 'L\'IA a échangé des tuiles',
		aiPlayingPreview: 'L\'IA joue son coup prévisualisé !',
		aiRunningOutOfTime: 'L\'IA manque de temps, elle joue le coup valide le plus proche !',
		aiFoundMove: 'L\'IA a trouvé un coup !',
		aiNoMoveExchange: 'L\'IA est désemparée et décide d\'échanger des tuiles...',
		noNewWords: '(Aucun mot nouveau)',
		howToPlayTitle: 'Comment Jouer',
		playingTiles: 'Placement des Tuiles:',
		desktopTiles: 'Sur ordinateur: Cliquez et faites glisser les tuiles de votre chevalet vers le plateau',
		mobileTiles: 'Sur mobile: Appuyez longuement sur une tuile pendant 1 seconde, puis faites-la glisser pour la placer',
		removeTiles: 'Pour retirer une tuile, faites-la glisser vers votre chevalet',
		creatingWords: 'Créer des Mots:',
		horizontalVertical: 'Placez les tuiles horizontalement (de gauche à droite) ou verticalement (de haut en bas)',
		centerStar: 'Le premier mot doit traverser l\'étoile centrale',
		connectExisting: 'Les nouveaux mots doivent se connecter aux tuiles existantes du plateau',
		validWords: 'Tous les mots formés doivent être des mots valides du dictionnaire',
		submittingMove: 'Soumettre Votre Coup:',
		afterPlacing: 'Après avoir placé vos tuiles, cliquez sur le bouton "Soumettre"',
		invalidWords: 'Les mots invalides seront rejetés et les tuiles retourneront à votre chevalet',
		invalidTry: 'Mot invalide ! Veuillez réessayer.',
		pointsCalculated: 'Les points seront calculés automatiquement et ajoutés à votre score',
		exchangingTiles: 'Échanger des Tuiles:',
		activateExchange: 'Cliquez sur "Activer le Portail d\'Échange" pour commencer un échange',
		dragUnwanted: 'Faites glisser les tuiles indésirables dans le portail',
		receiveNewTiles: 'Vous recevrez le même nombre de nouvelles tuiles',
		countsAsTurn: 'Cela compte comme votre tour',
		skippingGameEnd: 'Passer et Fin de Partie:',
		useSkipTurn: 'Utilisez "Passer le Tour" si vous ne pouvez pas faire un coup valide',
		gameEnds: 'Le jeu se termine quand toutes les tuiles sont utilisées ou que les deux joueurs passent deux fois de suite',
		scoreBased: 'Votre score est basé sur les valeurs des lettres et les cases bonus'
	},
	zh: {
		submit: '提交',
		shuffleRack: '打乱瓷砖',
		skipTurn: '跳过回合',
		howToPlay: '如何玩',
		quitGame: '退出/结束游戏',
		gameInfo: '游戏信息',
		scores: '分数',
		player: '玩家',
		computer: '计算机',
		tilesRemaining: '剩余瓷砖',
		moveHistory: '移动历史',
		aiExchanged: 'AI 交换了瓷砖',
		aiPlayingPreview: 'AI 正在播放其预览的移动！',
		aiRunningOutOfTime: 'AI 即将超时，正在播放最近的有效移动！',
		aiFoundMove: 'AI 找到了一步！',
		aiNoMoveExchange: 'AI 感到茫然，决定交换瓷砖...',
		landscape: '为了获得最佳体验，请将设备旋转至横向模式',
		scroll: '您可以上下滚动以访问您的架子、游戏控制和移动历史',
		instructions: '开始前请在菜单中阅读"如何玩"',
		bingoBonus: '宾果奖金！',
		skip: '跳过',
		quit: '退出',
		exchange: '交换',
		aiExchanged: 'AI 交换了瓷砖',
		noNewWords: '(没有新单词)',
		howToPlayTitle: '如何玩',
		playingTiles: '放置瓷砖:',
		desktopTiles: '在桌面上：点击并将瓷砖从您的架子拖到棋盘上',
		mobileTiles: '在手机上：长按瓷砖1秒钟，然后拖动放置它',
		removeTiles: '要移除瓷砖，请将其拖回您的架子',
		creatingWords: '创建单词:',
		horizontalVertical: '将瓷砖水平放置（从左到右）或垂直放置（从上到下）',
		centerStar: '第一个词必须穿过中心星',
		connectExisting: '新词必须连接到棋盘上的现有瓷砖',
		validWords: '形成的所有词必须是字典中的有效词',
		submittingMove: '提交您的移动:',
		afterPlacing: '放置瓷砖后，单击"提交"按钮',
		invalidWords: '无效的词将被拒绝，瓷砖将返回到您的架子',
		invalidTry: '无效的单词！请再试一次。',
		pointsCalculated: '分数将自动计算并添加到您的分数中',
		exchangingTiles: '交换瓷砖:',
		activateExchange: '单击"激活交换门户"以开始交换',
		dragUnwanted: '将不需要的瓷砖拖到门户中',
		receiveNewTiles: '您将收到相同数量的新瓷砖',
		countsAsTurn: '这算作您的回合',
		skippingGameEnd: '跳过和游戏结束:',
		useSkipTurn: '如果无法进行有效移动，请使用"跳过回合"',
		gameEnds: '当所有瓷砖都用完或两个玩家连续跳过两次时，游戏结束',
		scoreBased: '您的分数基于字母值和奖励方块'
	},
	hi: {
		submit: 'जमा करें',
		shuffleRack: 'टाइल्स मिलाएं',
		skipTurn: 'टर्न छोड़ें',
		howToPlay: 'कैसे खेलें',
		quitGame: 'बाहर निकलें / खेल समाप्त करें',
		gameInfo: 'खेल की जानकारी',
		scores: 'स्कोर',
		player: 'खिलाड़ी',
		computer: 'कंप्यूटर',
		tilesRemaining: 'शेष टाइल्स',
		moveHistory: 'चाल इतिहास',
		landscape: 'सर्वोत्तम अनुभव के लिए, कृपया अपने डिवाइस को लैंडस्केप मोड में घुमाएं',
		scroll: 'आप अपने रैक, गेम नियंत्रण और चाल इतिहास तक पहुंचने के लिए ऊपर और नीचे स्क्रॉल कर सकते हैं',
		instructions: 'कृपया शुरू करने से पहले मेनू में "कैसे खेलें" पढ़ें',
		bingoBonus: 'बिंगो बोनस!',
		skip: 'छोड़ें',
		quit: 'बाहर निकलें',
		exchange: 'अदला-बदली',
		aiExchanged: 'AI ने टाइल्स बदली',
		aiPlayingPreview: 'AI अपनी पूर्वावलोकन चाल खेल रहा है!',
		aiRunningOutOfTime: 'AI का समय खत्म हो रहा है, निकटतम वैध चाल खेल रहा है!',
		aiFoundMove: 'AI को एक चाल मिली!',
		aiNoMoveExchange: 'AI हैरान है और टाइल्स बदलने का फैसला करता है...',
		noNewWords: '(कोई नए शब्द स्कोर नहीं)',
		howToPlayTitle: 'कैसे खेलें',
		playingTiles: 'टाइल्स रखना:',
		desktopTiles: 'डेस्कटॉप पर: अपने रैक से बोर्ड पर टाइल्स पर क्लिक करें और खींचें',
		mobileTiles: 'मोबाइल पर: 1 सेकंड के लिए एक टाइल को छूएं और पकड़ें, फिर इसे रखने के लिए खींचें',
		removeTiles: 'टाइल हटाने के लिए, इसे वापस अपने रैक में खींचें',
		creatingWords: 'शब्द बनाना:',
		horizontalVertical: 'टाइल्स को क्षैतिज (बाएं से दाएं) या लंबवत (ऊपर से नीचे) रखें',
		centerStar: 'पहला शब्द केंद्र सितारे को पार करना चाहिए',
		connectExisting: 'नए शब्द बोर्ड पर मौजूदा टाइल्स से जुड़े होने चाहिए',
		validWords: 'बनाए गए सभी शब्द वैध शब्दकोश शब्द होने चाहिए',
		submittingMove: 'अपनी चाल जमा करना:',
		afterPlacing: 'अपनी टाइल्स रखने के बाद, "जमा करें" बटन पर क्लिक करें',
		invalidWords: 'अमान्य शब्द अस्वीकार कर दिए जाएंगे और टाइल्स आपके रैक में वापस आ जाएंगी',
		invalidTry: 'अमान्य शब्द! कृपया पुनः प्रयास करें।',
		pointsCalculated: 'अंक स्वचालित रूप से गणना की जाएंगी और आपके स्कोर में जोड़े जाएंगे',
		exchangingTiles: 'टाइल्स बदलना:',
		activateExchange: 'एक्सचेंज शुरू करने के लिए "एक्सचेंज पोर्टल सक्रिय करें" पर क्लिक करें',
		dragUnwanted: 'अवांछित टाइल्स को पोर्टल में खींचें',
		receiveNewTiles: 'आपको समान संख्या में नई टाइल्स मिलेंगी',
		countsAsTurn: 'यह आपके टर्न के रूप में गिना जाता है',
		skippingGameEnd: 'छोड़ना और खेल समाप्त:',
		useSkipTurn: 'यदि आप एक वैध चाल नहीं बना सकते हैं तो "टर्न छोड़ें" का उपयोग करें',
		gameEnds: 'खेल तब समाप्त होता है जब सभी टाइल्स उपयोग की जाती हैं या दोनों खिलाड़ी लगातार दो बार छोड़ देते हैं',
		scoreBased: 'आपका स्कोर अक्षर मानों और बोनस वर्गों पर आधारित है',
		currentTurn: 'वर्तमान टर्न',
		yourTurn: 'आपका टर्न',
		computerTurn: 'कंप्यूटर का टर्न'
	}
};

function getTranslation(key, lang = 'en') {
	if (!lang || !translations[lang]) lang = 'en';
	return translations[lang][key] || translations['en'][key] || key;
}

function normalizeWordForDict(word) {
	if (!word) return '';
	// Remove diacritics but preserve ñ, return uppercase
	try {
		return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-ZÑ]/gi, '').toUpperCase();
	} catch (e) {
		// Fallback: preserve ñ, remove other diacritics
		return word.replace(/[\u0300-\u036f]/g, '').replace(/[^\wÑ]/gi, '').toUpperCase();
	}
}

// English to Spanish word translations for common Scrabble words
function translateWordForDisplay(word, lang) {
	if (!word) return word;
	const up = String(word).toUpperCase();
	// If Spanish mode and we have a normalized->original map, prefer original with diacritics
	if (lang === 'es' && typeof this !== 'undefined' && this.spanishNormalizedMap) {
		const norm = normalizeWordForDict(up).toUpperCase();
		if (this.spanishNormalizedMap && this.spanishNormalizedMap[norm]) return this.spanishNormalizedMap[norm];
	}
	// No hardcoded translations - using API-based translation when needed
	return word;
}

function isMobileDevice() {
	return (
		window.innerWidth <= 768 ||
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	);
}

// Add this function to handle mobile-specific adjustments
function setupMobileLayout() {
	if (isMobileDevice()) {
		// Adjust touch areas for better mobile interaction
		document.querySelectorAll(".grid-item").forEach((item) => {
			item.style.touchAction = "manipulation";

			// Remove hover effects on mobile
			item.style.transition = "transform 0.1s";

			// Prevent double-tap zoom
			item.addEventListener("touchend", function(e) {
				e.preventDefault();
			});
		});
	}
}

class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) node.children[char] = new TrieNode();
            node = node.children[char];
        }
        node.isWord = true;
    }

    // Generate all words from rack (with blanks)
    findWordsFromRack(rack, minLen = 2, maxLen = 7) {
        const results = new Set();
        const recurse = (node, path, letters, usedBlanks) => {
            if (node.isWord && path.length >= minLen && path.length <= maxLen) {
                results.add(path);
            }
            if (path.length >= maxLen) return;
            const used = new Set();
            for (let i = 0; i < letters.length; i++) {
                const letter = letters[i];
                if (used.has(letter)) continue; // Avoid duplicate branches
                used.add(letter);
                if (letter === "*") {
                    // Try all possible letters for blank
                    for (const c in node.children) {
                        recurse(node.children[c], path + c, letters.slice(0, i).concat(letters.slice(i + 1)), usedBlanks + 1);
                    }
                } else if (node.children[letter]) {
                    recurse(node.children[letter], path + letter, letters.slice(0, i).concat(letters.slice(i + 1)), usedBlanks);
                }
            }
        };
        recurse(this.root, "", rack, 0);
        return Array.from(results);
    }
}

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
			"*": 4, // Increased from 2 to 4 wild tiles
		};

		// Spanish tile values and distribution
		this.spanishTileValues = {
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
			L: 1,
			M: 3,
			N: 1,
			Ñ: 8,
			O: 1,
			P: 3,
			Q: 5,
			R: 1,
			S: 1,
			T: 1,
			U: 1,
			V: 4,
			X: 8,
			Y: 4,
			Z: 10,
			"*": 0,
		};

		this.spanishTileDistribution = {
			A: 12,
			B: 2,
			C: 4,
			D: 5,
			E: 12,
			F: 1,
			G: 2,
			H: 2,
			I: 6,
			J: 1,
			L: 4,
			M: 2,
			N: 5,
			Ñ: 1,
			O: 9,
			P: 2,
			Q: 1,
			R: 5,
			S: 6,
			T: 4,
			U: 5,
			V: 1,
			X: 1,
			Y: 1,
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
		this.coreValidDictionary = new Set(); // Tier 1: 100% valid common words
		this.spanishDictionary = new Set();
		this.spanishDictionaryNormalized = new Set();
		this.spanishNormalizedMap = {}; // normalized -> original
		this.frenchDictionary = new Set();
		this.mandarinDictionary = new Set();
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
		this.selectedTile = null;
		this.isMobile = isMobileDevice();
		this.hintBoxBlocked = false;
		this.hintBoxTimeout = null;
		this.hintInterval = null;
		this.aiValidationLogSet = new Set();
		// Temporarily store rejected AI plays to avoid immediate retries
		this.aiRejectedPlays = new Set();
		// Set to true to enable verbose AI validation logging (off by default)
		this.showAIDebug = false;
		// preferred language short code (e.g. 'en','es','zh','fr') persisted to localStorage
		this.preferredLang = 'zh'; // Mandarin Chinese version
		// Active dictionary for validation and AI word selection
		this.activeDictionary = new Set();

		// When the player clicks Submit/Play, we may start speech inside that gesture
		this._submitStartedSpeak = false;
		this._inlineSpeakPromise = null;
		this.wordsPlayed = new Set();

		// Ghost thinking state
		this.ghostThinkingTimer = null;
		this.lastGhostBoardState = null;
		this.lastGhostRackState = null;
		// Ghost tile visibility toggle: 5 sec show, 60 sec hide
		this.ghostVisibilityTimer = null;
		this.ghostTilesVisible = true;
		this.validWordsFound = 0;
		this.lastAIGhostPlays = null;
		this.ghostDisplayMode = 0;

		document.body.style.overscrollBehavior = 'none';
		document.documentElement.style.overscrollBehavior = 'none';
		this.init();
	}

	// Centralized dictionary lookup that handles normalization (diacritics)
	dictionaryHas(word) {
		if (!word) return false;
		const lang = this.preferredLang || (typeof localStorage !== 'undefined' && localStorage.getItem('preferredLang')) || 'en';
		const wordLower = String(word).toLowerCase();

		// TIER 1: Check core valid dictionary FIRST (instant validation for common words)
		if (lang === 'en' && this.coreValidDictionary && this.coreValidDictionary.has(wordLower)) {
			return true;
		}

		// TIER 2: Check main dictionaries
		// ENHANCEMENT: Stricter validation for 2-letter words (highest false-positive rate)
		if (word.length === 2) {
			if (lang === 'es') {
				const normalized = normalizeWordForDict(wordLower).toLowerCase();
				return (this.activeDictionary && this.activeDictionary.has(normalized)) ||
					(this.dictionary && this.dictionary.has(normalized)) ||
					(this.backupDictionary && this.backupDictionary.has(normalized));
			} else {
				// English 2-letter words must be in dictionary
				return (this.activeDictionary && this.activeDictionary.has(wordLower)) ||
					(this.dictionary && this.dictionary.has(wordLower)) ||
					(this.backupDictionary && this.backupDictionary.has(wordLower));
			}
		}

		// For longer words, check all local dictionaries
		let foundInDictionary = false;
		if (lang === 'es') {
			const normalized = normalizeWordForDict(wordLower).toLowerCase();
			foundInDictionary = (this.activeDictionary && this.activeDictionary.has(normalized)) ||
				(this.dictionary && this.dictionary.has(normalized)) ||
				(this.backupDictionary && this.backupDictionary.has(normalized));
		} else {
			foundInDictionary = (this.activeDictionary && this.activeDictionary.has(wordLower)) ||
				(this.dictionary && this.dictionary.has(wordLower)) ||
				(this.backupDictionary && this.backupDictionary.has(wordLower));
		}

		if (foundInDictionary) return true;

		// TIER 3: For non-English, try API validation
		if (lang !== 'en') {
			return this.validateWordForLanguageSync(word, lang);
		}

		// For English: only accept words in local dictionaries
		return false;
	}

	// Synchronous wrapper for language validation with caching
	validateWordForLanguageSync(word, lang) {
		const cacheKey = `${lang}_validation_${word.toLowerCase()}`;

		// Check cache first
		if (this.validationCache && this.validationCache[cacheKey] !== undefined) {
			return this.validationCache[cacheKey];
		}

		// Initialize cache if needed
		if (!this.validationCache) {
			this.validationCache = {};
		}

		// For sync context, use basic validation as fallback
		const result = this.isBasicValidForLanguage(word.toUpperCase(), lang);

		// Cache result
		this.validationCache[cacheKey] = result;

		return result;
	}

	// Synchronous wrapper for Spanish validation with caching
	validateSpanishWordSync(word) {
		const cacheKey = `spanish_validation_${word.toLowerCase()}`;

		// Check cache first
		if (this.validationCache && this.validationCache[cacheKey] !== undefined) {
			return this.validationCache[cacheKey];
		}

		// Initialize cache if needed
		if (!this.validationCache) {
			this.validationCache = {};
		}

		// For sync context, use basic validation as fallback
		// Real API validation will happen in async contexts
		const upperWord = word.toUpperCase();
		const isBasicValid = this.couldBeValidSpanishWord(upperWord);

		const result = isBasicValid;

		// Cache result
		this.validationCache[cacheKey] = result;

		return result;
	}

	pickNonRepeating(arr, type) {
		let msg;
		let tries = 0;
		do {
			msg = arr[Math.floor(Math.random() * arr.length)];
			tries++;
		} while (arr.length > 1 && msg === this.lastAIMessages[type] && tries < 10);
		this.lastAIMessages[type] = msg;
		return msg;
	}

	logAIValidation(msg) {
		// Deduplicate messages so we don't flood the console repeatedly
		if (!this.aiValidationLogSet.has(msg)) {
			if (this.showAIDebug) console.log(msg);
			this.aiValidationLogSet.add(msg);
		}
	}

	showAIGhostMove(play) {
		// Remove any existing ghost overlays/tiles
		document.querySelectorAll('.ghost-tile, .ghost-move-overlay').forEach(e => e.remove());

		const { word, startPos, isHorizontal } = play;
		const boardElem = document.getElementById('scrabble-board');
		if (!boardElem) return;
		const boardRect = boardElem.getBoundingClientRect();
		const cellSample = boardElem.querySelector('.board-cell');
		const cellRect = cellSample ? cellSample.getBoundingClientRect() : { width: 36, height: 36 };

		const startCell = document.querySelector(`[data-row="${startPos.row}"][data-col="${startPos.col}"]`);
		if (!startCell) return;
		const startRect = startCell.getBoundingClientRect();

		// Create per-cell ghost tiles (append to cells) so they line up exactly with placed tiles
		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;
			const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
			if (!cell) continue;

			// If there's already a permanent tile on the board at this position, skip creating a ghost
			if (this.board[row] && this.board[row][col]) continue;
			// Also skip if cell contains a non-ghost tile element
			if (cell.querySelector('.tile') && !cell.querySelector('.tile').classList.contains('ghost-tile')) continue;

			const ghost = document.createElement('div');
			ghost.className = 'tile ghost-tile';
			ghost.style.pointerEvents = 'none';
			ghost.style.opacity = '0.72';
			ghost.style.border = '1px dashed rgba(2,136,209,0.6)';
			ghost.style.background = 'linear-gradient(145deg, #eaf6fb, #f4fbff)';
			ghost.style.color = '#111';
			ghost.style.display = 'flex';
			ghost.style.alignItems = 'center';
			ghost.style.justifyContent = 'center';
			ghost.style.fontWeight = '800';
			ghost.innerHTML = `${word[i]}<span class="points" style="opacity:0.9;">${this.tileValues[word[i]] || 0}</span>`;

			// Append into cell so it matches existing placed tile layout
			cell.appendChild(ghost);
		}

		// Prevent 'stacking bricks' placements: don't place a horizontal word directly above/below
		// another full horizontal word (and vice-versa for vertical). This often creates many
		// short crosswords (especially 2-letter) that are invalid or undesirable.
		if (horizontal) {
			const startC = startCol;
			const endC = startCol + word.length - 1;
			for (const r of [startRow - 1, startRow + 1]) {
				if (r >= 0 && r < 15) {
					let fullRowOccupied = true;
					for (let c = startC; c <= endC; c++) {
						if (!this.board[r][c]) { fullRowOccupied = false; break; }
					}
					if (fullRowOccupied) {
						this.logAIValidation('Rejecting placement: would stack on top of another horizontal word');
						return false;
					}
				}
			}
		} else {
			const startR = startRow;
			const endR = startRow + word.length - 1;
			for (const c of [startCol - 1, startCol + 1]) {
				if (c >= 0 && c < 15) {
					let fullColOccupied = true;
					for (let r = startR; r <= endR; r++) {
						if (!this.board[r][c]) { fullColOccupied = false; break; }
					}
					if (fullColOccupied) {
						this.logAIValidation('Rejecting placement: would stack on top of another vertical word');
						return false;
					}
				}
			}
		}
	}

	// Show multiple rotating ghost moves with different colors
	showRotatingGhostMoves(plays) {
		// Remove any existing ghost overlays/tiles
		document.querySelectorAll('.ghost-tile, .ghost-move-overlay').forEach(e => e.remove());

		if (!plays || plays.length === 0) return;

		const maxMoves = 5;
		// Prefer non-overlapping plays: select up to `maxMoves` plays that do not share board cells
		const topCandidates = plays.slice(0, Math.min(15, plays.length)); // look ahead a bit to find non-overlapping
		const topMoves = [];
		const usedCells = new Set();
		for (const p of topCandidates) {
			if (topMoves.length >= maxMoves) break;
			const { startPos, isHorizontal, word } = p;
			// Determine which cells this play WOULD PLACE NEW TILES into (ignore already-occupied board cells)
			const newPositions = [];
			let outOfBounds = false;
			for (let i = 0; i < word.length; i++) {
				const r = isHorizontal ? startPos.row : startPos.row + i;
				const c = isHorizontal ? startPos.col + i : startPos.col;
				if (!this.isValidPosition(r, c)) { outOfBounds = true; break; }
				if (!(this.board[r] && this.board[r][c])) {
					newPositions.push(`${r},${c}`);
				}
			}
			if (outOfBounds) continue;

			// If this play doesn't place any new tiles (unlikely), skip it
			if (newPositions.length === 0) continue;

			// Conflict only matters on newly-placed cells — allow sharing existing tiles
			let conflict = false;
			for (const key of newPositions) {
				if (usedCells.has(key)) { conflict = true; break; }
			}
			if (!conflict) {
				topMoves.push(p);
				for (const key of newPositions) usedCells.add(key);
			}
		}

		// Log which ghost tiles are active with all 5 words (log once per distinct set)
		const ghostWords = topMoves.map((p, i) => `#${i + 1}: ${p.word} (${p.score}pts)`).join(', ');
		const now = Date.now();
		if (!this._lastGhostLogString || this._lastGhostLogString !== ghostWords) {
			console.log(`🔮 Ghost tiles ACTIVE - Top 5 AI moves: ${ghostWords}`);
			this._lastGhostLogString = ghostWords;
			this._lastGhostLogTime = now;
		}

		// Render compact overlays above the board rather than per-cell tiles to avoid clutter
		const boardElem = document.getElementById('scrabble-board');
		if (!boardElem) return;
		const boardRect = boardElem.getBoundingClientRect();
		const cellSample = boardElem.querySelector('.board-cell');
		const cellRect = cellSample ? cellSample.getBoundingClientRect() : { width: 36, height: 36 };

		topMoves.forEach((play, moveIndex) => {
			const { word, startPos, isHorizontal } = play;
			const startCell = document.querySelector(`[data-row="${startPos.row}"][data-col="${startPos.col}"]`);
			if (!startCell) return;
			const startRect = startCell.getBoundingClientRect();

			// Create per-cell ghost tiles for this play so they line up exactly with placed tiles
			for (let i = 0; i < word.length; i++) {
				const row = isHorizontal ? startPos.row : startPos.row + i;
				const col = isHorizontal ? startPos.col + i : startPos.col;
				const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
				if (!cell) continue;

				// Avoid adding ghosts where permanent tiles already exist
				if (this.board[row] && this.board[row][col]) continue;
				// Avoid too many ghost tiles stacking in the same cell
				const existingGhosts = cell.querySelectorAll('.ghost-tile');
				if (existingGhosts.length >= 3) continue; // limit per-cell clutter

				const ghost = document.createElement('div');
				ghost.className = `tile ghost-tile ghost-move-${moveIndex}`;
				ghost.style.pointerEvents = 'none';
				ghost.style.border = '1px dashed rgba(0,0,0,0.12)';
				ghost.style.background = 'rgba(234,246,251,0.8)';
				ghost.style.color = '#111';
				ghost.style.display = 'flex';
				ghost.style.alignItems = 'center';
				ghost.style.justifyContent = 'center';
				ghost.style.fontWeight = '800';
				ghost.style.position = 'relative';
				ghost.style.zIndex = `${200 + moveIndex}`;
				ghost.innerHTML = `${word[i]}<span class="points" style="opacity:0.9;">${this.tileValues[word[i]] || 0}</span>`;

				// Fan-out overlapping ghosts slightly so they are visible
				const idx = existingGhosts.length + moveIndex;
				const offset = Math.min(idx, 3) * 6; // px
				if (isHorizontal) {
					// stack vertically when the play is horizontal
					ghost.style.transform = `translateY(${offset}px)`;
				} else {
					// stack horizontally when the play is vertical
					ghost.style.transform = `translateX(${offset}px)`;
				}

				// Slight opacity variation to hint ranking
				const baseOpacity = 0.7;
				ghost.style.opacity = `${Math.max(0.32, baseOpacity - moveIndex * 0.12)}`;

				cell.appendChild(ghost);
			}
		});
	}

	// Update ghost move preview - simple and clean
	async updateGhostPreview() {
		if (this._updatingGhostPreview) return; // prevent overlapping runs
		this._updatingGhostPreview = true;
		if (this.currentTurn !== "player" || this.isGameEnded) {
			this.clearGhostTiles();
			this._updatingGhostPreview = false;
			return;
		}

		try {
			const aiPlays = this.findAIPossiblePlays();
			if (!aiPlays || aiPlays.length === 0) {
				this.clearGhostTiles();
				return;
			}

			let validPlays = aiPlays.filter(p => this.dictionaryHas(p.word));
			if (!validPlays || validPlays.length === 0) {
				this.clearGhostTiles();
				return;
			}

			// Prefer Tier-1 plays (coreValidDictionary). Fill up to 5 options.
			const tier1Plays = validPlays.filter(p => this.coreValidDictionary && this.coreValidDictionary.has(String(p.word).toLowerCase()));
			let ghostPlays = [];
			for (let i = 0; i < tier1Plays.length && ghostPlays.length < 5; i++) ghostPlays.push(tier1Plays[i]);
			if (ghostPlays.length < 5) {
				validPlays.sort((a, b) => (b.score || 0) - (a.score || 0));
				for (const p of validPlays) {
					if (ghostPlays.length >= 5) break;
					if (!ghostPlays.some(g => g.word === p.word && g.startPos && p.startPos && g.startPos.row === p.startPos.row && g.startPos.col === p.startPos.col)) {
						ghostPlays.push(p);
					}
				}
			}

			if (ghostPlays.length === 0) {
				this.clearGhostTiles();
				return;
			}

			this.displayGhostMove(ghostPlays.slice(0, 5));
			this.ghostAIMove = this.ghostAIMove || { ...ghostPlays[0], rackSnapshot: (this.aiRack || []).map(t => t.letter).sort().join(''), boardSnapshot: JSON.stringify(this.board) };
		} catch (error) {
			console.debug('Ghost preview error:', error);
			this.clearGhostTiles();
		} finally {
			this._updatingGhostPreview = false;
		}
	}

	// Compatibility wrapper to display a ghost move or multiple ghost moves.
	// Ensures snapshots used by AI are set and clears previous ghosts safely.
	displayGhostMove(play) {
		try {
			this.clearGhostTiles();
			if (!play) return;

			// If an array of plays is provided, show rotating ghosts for multiple suggestions
			if (Array.isArray(play)) {
				if (play.length === 0) return;
				if (play.length === 1) play = play[0];
				else {
					this.showRotatingGhostMoves(play);
					// store snapshot based on top move
					const top = play[0];
					this.ghostAIMove = {
						...top,
						rackSnapshot: (this.aiRack || []).map(t => t.letter).sort().join(''),
						boardSnapshot: JSON.stringify(this.board)
					};
					return;
				}
			}

			// Single play: show a subtle overlay preview
			this.ghostAIMove = {
				...play,
				rackSnapshot: (this.aiRack || []).map(t => t.letter).sort().join(''),
				boardSnapshot: JSON.stringify(this.board)
			};
			this.showAIGhostMove(play);
		} catch (err) {
			console.debug('displayGhostMove error:', err);
			this.clearGhostTiles();
		}
	}

	// Schedule periodic ghost tile updates
	scheduleGhostUpdates() {
		if (this.ghostThinkingTimer) clearInterval(this.ghostThinkingTimer);
		this.ghostThinkingTimer = setInterval(() => {
			if (this.currentTurn === "player" && !this.isGameEnded) {
				this.updateGhostPreview();
			}
		}, 2000);
	}

	// Stop ghost tile updates
	stopGhostUpdates() {
		if (this.ghostThinkingTimer) {
			clearInterval(this.ghostThinkingTimer);
			this.ghostThinkingTimer = null;
		}
	}

	// Clear all ghost tiles from the board
	clearGhostTiles() {
		document.querySelectorAll('.ghost-tile, .ghost-move-overlay').forEach(e => e.remove());
	}

	// Toggle ghost tiles visibility: 5 seconds show, 60 seconds hide, repeat
	startGhostVisibilityToggle() {
		if (this.ghostVisibilityTimer) clearInterval(this.ghostVisibilityTimer);

		const toggleVisibility = () => {
			// Show for 5 seconds
			this.showGhostTiles();
			this.ghostTilesVisible = true;

			setTimeout(() => {
				// Hide for 60 seconds
				this.hideGhostTiles();
				this.ghostTilesVisible = false;

				// Schedule next cycle after 60 seconds of being hidden
				setTimeout(toggleVisibility, 60000);
			}, 5000);
		};

		// Start the cycle
		toggleVisibility();
	}

	showGhostTiles() {
		document.querySelectorAll('.ghost-tile').forEach(e => {
			e.style.display = 'flex';
		});
	}

	hideGhostTiles() {
		document.querySelectorAll('.ghost-tile').forEach(e => {
			e.style.display = 'none';
		});
	}

	stopGhostVisibilityToggle() {
		if (this.ghostVisibilityTimer) {
			clearInterval(this.ghostVisibilityTimer);
			this.ghostVisibilityTimer = null;
		}
	}

	// Simple strategic board analysis - just find premium squares next to existing tiles
	analyzeBoardForStrategicOpportunities() {
		const opportunities = [];
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				if (this.board[row][col]) continue; // Skip occupied cells
				
				// Check if adjacent to any existing tile
				if (this.isAdjacentToExistingTiles(row, col)) {
					const premium = this.getPremiumSquareType(row, col);
					if (premium) {
						opportunities.push({
							row, col, premium,
							value: premium === 'tw' ? 100 : premium === 'dw' ? 50 : 25
						});
					}
				}
			}
		}
		return opportunities;
	}

	// Check if a position is adjacent to any existing tiles
	isAdjacentToExistingTiles(row, col) {
		const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
		for (const [dr, dc] of dirs) {
			const r = row + dr, c = col + dc;
			if (this.isValidPosition(r, c) && this.board[r][c]) return true;
		}
		return false;
	}

	// Get tiles needed to place a word at a position (tiles not already on board)
	getTilesNeededForMove(word, startPos, isHorizontal) {
		const tilesNeeded = [];
		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;
			// Only include tiles that aren't already on the board
			if (!this.board[row] || !this.board[row][col]) {
				tilesNeeded.push(word[i]);
			}
		}
		return tilesNeeded;
	}

	async validatePartialWord() {
		if (this.placedTiles.length < 2) return false;
		// Only check if the tiles form a valid dictionary word (ignore adjacency, first move, etc.)
		const mainWord = this.getMainWord();
		return this.dictionaryHas(mainWord);
	}

	// Helper to block/unblock the hint box
	blockHintBox() {
		this.hintBoxBlocked = true;
		if (this.hintBox) this.hintBox.classList.remove("show");
		clearTimeout(this.hintBoxTimeout);
	}
	unblockHintBox() {
		this.hintBoxBlocked = false;
	}

	showAINotification(message, type = 'default') {
		// Don't show anything if there's no message
		if (!message) return;
		// Throttle/dedupe identical notifications for a short period to avoid spam
		try {
			// Global dedupe per exact message
			if (shownBlunders.has(message)) return; // already shown recently
			// Aggressive throttle for generic AI blunder messages
			if (message && message.includes('AI made a blunder')) {
				const last = this._lastBlunderTime || 0;
				if (Date.now() - last < 10000) return; // limit blunder notices to once per 10s
				this._lastBlunderTime = Date.now();
			}
			shownBlunders.add(message);
			setTimeout(() => shownBlunders.delete(message), 5000); // 5s cooldown for specific messages
		} catch (e) {}

		// Remove any existing notification
		let existing = document.querySelector('.ai-blunder-notification');
		if (existing) existing.remove();

		// Default emoji if no type specified
		let emoji = '🤖';

		// More expressive faces for each type
		const praiseEmojis = ['🎉', '🏆', '🌟', '💫', '✨'];
		const smugEmojis = ['😏', '🧐', '🤓', '🧠', '💡'];

		if (type === "praise") emoji = praiseEmojis[Math.floor(Math.random() * praiseEmojis.length)];
		if (type === "smug") emoji = smugEmojis[Math.floor(Math.random() * smugEmojis.length)];

		const note = document.createElement('div');
		note.className = `ai-blunder-notification ai-popup-animate ai-${type}`;
		note.innerHTML = `
			<span class="ai-notif-emoji">${emoji}</span>
			<span class="ai-notif-text">${message}</span>
		`;

		document.body.appendChild(note);

		// Animate in
		setTimeout(() => {
			note.classList.add('show');
		}, 10);

		// Start fade out after 3.2s
		setTimeout(() => {
			note.classList.remove('show');
			note.classList.add('hide');
		}, 3200);

		// Remove after fade out
		setTimeout(() => {
			note.remove();
		}, 3700);
	}

	async setupTapPlacement() {
		// Helper to clear selection
		const deselect = () => {
			if (this.selectedTile) this.selectedTile.classList.remove("selected");
			this.selectedTile = null;
			this.selectedTileSource = null;
		};

		// Single click handler for rack
		document.getElementById("tile-rack").addEventListener("click", (e) => {
    const tileElem = e.target.closest(".tile");
    if (this.currentTurn !== "player") return;

    // If a tile from the board is selected and rack is clicked, move it back to rack
	if (this.selectedTile && this.selectedTileSource === "board") {
		const fromRow = parseInt(this.selectedTile.dataset.row);
		const fromCol = parseInt(this.selectedTile.dataset.col);
		const placedIdx = this.placedTiles.findIndex(t => t.row == fromRow && t.col == fromCol);
		if (placedIdx === -1) return;
		let tile = this.placedTiles[placedIdx].tile;
		// Remove from board
		this.board[fromRow][fromCol] = null;
		const cell = document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`);
		cell.innerHTML = "";
		// Restore center star if needed
		if (fromRow === 7 && fromCol === 7) {
			const centerStar = document.createElement("span");
			centerStar.textContent = "⚜";
			centerStar.className = "center-star";
			cell.appendChild(centerStar);
		}
		// Remove from placedTiles
		this.placedTiles.splice(placedIdx, 1);

		// --- Always restore as a blank tile if it was a blank, regardless of its current letter ---
		if (tile.isBlank || tile.letter === "*") {
			this.playerRack.push({
				letter: "*",
				value: 0,
				id: tile.id
			});
		} else {
			this.playerRack.push(tile);
		}

		this.renderRack();
		this.highlightValidPlacements();
			// Restore ghost previews after returning tile
			if (typeof this.updateGhostPreview === 'function') this.updateGhostPreview();
		deselect();
		return;
	}

    // Otherwise, select/deselect a tile in the rack
    if (!tileElem) {
        deselect();
        return;
    }

    
    // Deselect if already selected
    if (this.selectedTile === tileElem) {
        deselect();
        return;
    }
    deselect();
    this.selectedTile = tileElem;
    this.selectedTileSource = "rack";
    tileElem.classList.add("selected");
});

		// Board cell logic
		document.getElementById("scrabble-board").addEventListener("click", (e) => {
			const cell = e.target.closest(".board-cell");
			if (!cell || this.currentTurn !== "player") return;

			const tileElem = cell.querySelector(".tile");
			const isGhostTile = tileElem && tileElem.classList.contains("ghost-tile");
			const row = parseInt(cell.dataset.row);
			const col = parseInt(cell.dataset.col);

			// If a tile is selected and tap on empty cell or ghost cell, place it (from rack or board)
			if (this.selectedTile && (!tileElem || isGhostTile)) {
				let tile, tileIndex, fromRow, fromCol;
				let movedFromBoard = false;
				if (this.selectedTileSource === "rack") {
					tileIndex = this.selectedTile.dataset.index;
					tile = this.playerRack[tileIndex];
				} else if (this.selectedTileSource === "board") {
					fromRow = parseInt(this.selectedTile.dataset.row);
					fromCol = parseInt(this.selectedTile.dataset.col);
					const placedIdx = this.placedTiles.findIndex(t => t.row == fromRow && t.col == fromCol);
					if (placedIdx === -1) {
						deselect();
						return;
					}
					tile = this.placedTiles[placedIdx].tile;

					// Remove from old spot
					this.board[fromRow][fromCol] = null;
					document.querySelector(`[data-row="${fromRow}"][data-col="${fromCol}"]`).innerHTML = "";
					this.placedTiles.splice(placedIdx, 1);
					movedFromBoard = true;
				}
				if (this.isValidPlacement(row, col, tile)) {
					// Remove ghost tile if present
					const ghost = cell.querySelector('.ghost-tile');
					if (ghost) ghost.remove();

					this.placeTile(tile, row, col);

					// Redo ghost preview after placement
					this.updateGhostPreview();
				} else if (movedFromBoard) {
					// If invalid placement, return tile to rack and update UI
					// --- Always restore as a blank tile if it was a blank, regardless of its current letter ---
					if (tile.isBlank || tile.letter === "*") {
						this.playerRack.push({
							letter: "*",
							value: 0,
							id: tile.id
						});
					} else {
						this.playerRack.push(tile);
					}
					this.renderRack();
					this.highlightValidPlacements();
					// Restore ghost previews after returning tile
					if (typeof this.updateGhostPreview === 'function') this.updateGhostPreview();
				}
				// Always deselect after any placement attempt
				deselect();
				return;
			}

			// If tapping a tile on the board, pick it up (only if it's a placed tile this turn)
			if (tileElem && this.placedTiles.some(t => t.row === row && t.col === col)) {
				// Toggle selection if already selected
				if (this.selectedTile === tileElem) {
					deselect();
					return;
				}
				deselect();
				this.selectedTile = tileElem;
				this.selectedTileSource = "board";
				tileElem.classList.add("selected");
				tileElem.dataset.row = row;
				tileElem.dataset.col = col;
				return;
			}

			// If clicking anywhere else on the board, deselect
			deselect();
		});

	}


	// Revert any currently placed (but unsubmitted) tiles back to the player's rack
	revertPlacedTiles() {
		if (!this.placedTiles || this.placedTiles.length === 0) return;
		// Return placed tiles back to rack and clear board cells
		for (const p of Array.from(this.placedTiles)) {
			try {
				const { row, col, tile } = p;
				if (this.board[row] && this.board[row][col]) {
					this.board[row][col] = null;
				}
				const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
				if (cell) {
					cell.innerHTML = '';
					// Restore center star if needed
					if (row === 7 && col === 7) {
						const centerStar = document.createElement('span');
						centerStar.textContent = '⚜';
						centerStar.className = 'center-star';
						cell.appendChild(centerStar);
					}
				}
				if (tile) {
					if (tile.isBlank || tile.letter === '*') {
						this.playerRack.push({ letter: '*', value: 0, id: tile.id });
					} else {
						this.playerRack.push(tile);
					}
				}
			} catch (e) { /* best-effort revert */ }
		}
		this.placedTiles = [];
		this.renderRack();
		this.highlightValidPlacements();
		if (typeof this.updateGhostPreview === 'function') this.updateGhostPreview();
		this.updateGameState();
	}

	selectTile(tileElement) {
		// Deselect previously selected tile
		if (this.selectedTile) {
			this.selectedTile.classList.remove("selected");
		}

		// Select new tile
		this.selectedTile = tileElement;
		tileElement.classList.add("selected");

		// Highlight valid placements
		this.highlightValidPlacements();
	}

	deselectTile() {
		if (this.selectedTile) {
			this.selectedTile.classList.remove("selected");
			this.selectedTile = null;
		}
	}

	async aiTurn() {
		this.aiValidationLogSet = new Set();
		// Stop ghost thinking during AI turn
		this.stopGhostUpdates();
	if (this.showAIDebug) console.log("AI thinking...");

		this.blockHintBox();

		let thinkingMessage = document.createElement("div");
		thinkingMessage.className = "ai-thinking-message";
		thinkingMessage.innerHTML = `
			<span class="ai-thinking-text">AI is thinking...</span>
			<span class="ai-thinking-indicator">
				<span class="ai-thinking-dot"></span>
				<span class="ai-thinking-dot"></span>
				<span class="ai-thinking-dot"></span>
			</span>
		`;

		if (window.innerWidth <= 768) {
			thinkingMessage.style.cssText = `
				position: fixed;
				right: 16px;
				bottom: 16px;
				left: auto;
				top: auto;
				background-color: #f0f0f0;
				padding: 8px 14px;
				border-radius: 16px;
				box-shadow: 0 2px 8px rgba(0,0,0,0.13);
				z-index: 3100;
				opacity: 0;
				transition: opacity 0.3s ease;
				font-size: 0.98em;
				width: 180px;
				min-width: 0;
				max-width: 80vw;
			`;
		} else {
			thinkingMessage.style.cssText = `
				position: fixed;
				top: 20px;
				left: 50%;
				transform: translateX(-50%);
				background-color: #f0f0f0;
				padding: 10px 24px;
				border-radius: 20px;
				box-shadow: 0 2px 5px rgba(0,0,0,0.2);
				z-index: 1000;
				opacity: 0;
				transition: opacity 0.3s ease;
				font-size: 1.1em;
			`;
		}

		document.body.appendChild(thinkingMessage);
		setTimeout(() => thinkingMessage.style.opacity = "1", 100);

		let bestPlay = null;
		let startTime = Date.now();

		function updateThinkingText(msg) {
			thinkingMessage.querySelector('.ai-thinking-text').textContent = msg;
		}

		// Preferred language for AI thinking messages
		const _aiLang = this.preferredLang || (typeof localStorage !== 'undefined' && localStorage.getItem('preferredLang')) || 'en';

		try {
			// --- Use ghost move if available and valid ---
			if (this.ghostAIMove) {
				// If this ghost move was recently rejected, skip it to avoid loops
				try {
					const { word: _gWord, startPos: _gStart, isHorizontal: _gHoriz } = this.ghostAIMove;
					const _ghostKey = `${_gWord}:${_gStart.row}:${_gStart.col}:${_gHoriz}`;
					if (this.aiRejectedPlays && this.aiRejectedPlays.has(_ghostKey)) {
						if (this.showAIDebug) console.log("Skipping previously rejected ghost move:", _ghostKey);
						this.ghostAIMove = null;
					}
				} catch (e) {
					// ignore
				}
				// Only use the ghost move if the AI's rack and board have not changed since the ghost was shown
				const { word, startPos, isHorizontal, rackSnapshot, boardSnapshot } = this.ghostAIMove;
				const currentRack = this.aiRack.map(t => t.letter).sort().join('');
				const currentBoard = JSON.stringify(this.board);

				if (rackSnapshot === currentRack && boardSnapshot === currentBoard) {
					const validity = await this.checkAIMoveValidity(word, startPos, isHorizontal);
					const canForm = this.canFormWord(
						word,
						this.getPrefix(startPos, isHorizontal),
						this.getSuffix(startPos, isHorizontal),
						this.aiRack.map(t => t.letter)
					);
					// Only accept ghost move if it's validated by dictionary and cross-word checks
					if (this.dictionaryHas(word) && validity.valid && canForm) {
						if (this.showAIDebug) console.log("AI using ghost move:", this.ghostAIMove);
						updateThinkingText(getTranslation('aiPlayingPreview', _aiLang));
						setTimeout(() => {
							thinkingMessage.style.opacity = "0";
							setTimeout(() => {
								thinkingMessage.remove();
								this.unblockHintBox();
								this.executeAIPlay(this.ghostAIMove);
								this.ghostAIMove = null; // Clear after use
							}, 300);
						}, 800);
						return;
					}
				}
			}

			// --- AI should NEVER exchange tiles or skip - keep trying until valid move found ---
			let attempts = 0;
			const maxAttempts = 10; // Try up to 10 different strategies to find a move

			// Strategy: first try an extended focused search for long words (bingo-focused)
			let savedShortCandidate = null;
			try {
				updateThinkingText(getTranslation('aiSearchingLongWords', _aiLang) || 'AI searching for long words...');
				const longPlays = this.findAIPossiblePlays(7, 15, { maxSearchTime: 8000, maxCandidates: 400 });
				if (Array.isArray(longPlays) && longPlays.length > 0) {
					// Prefer locally valid long words first
					const validLong = longPlays.filter(p => this.dictionaryHas(p.word));
					const candidateLongs = validLong.length ? validLong : longPlays;
					// Keep a short candidate in case we need it later
					savedShortCandidate = longPlays.find(p => p.word.length <= 5) || savedShortCandidate;
					// Validate sequentially but prefer highest strategic score
					for (const candidate of candidateLongs.slice(0, 40)) {
						const validity = await this.checkAIMoveValidity(candidate.word, candidate.startPos, candidate.isHorizontal);
						if (validity && validity.valid) {
							bestPlay = candidate;
							updateThinkingText(getTranslation('aiFoundLongMove', _aiLang) || 'AI found a long move');
							break;
						}
					}
				}
			} catch (e) {
				// ignore long-search errors and continue to the normal attempts
				if (this.showAIDebug) console.warn('Long-word focused search failed', e);
			}

			while (attempts < maxAttempts && !bestPlay) {
				attempts++;
				updateThinkingText(`${getTranslation('aiThinking', _aiLang)} (${attempts}/${maxAttempts})`);

				// Try different word length preferences based on attempt number
				// More aggressive long-word priority: 6+, then 5, then 4, then 3, then allow shorter
				let minWordLength = 2;
				let maxWordLength = 15;

				if (attempts === 1) {
					// First try: prefer much longer words (6+ letters)
					minWordLength = 6;
				} else if (attempts === 2) {
					// Second try: prefer 5+ letters
					minWordLength = 5;
				} else if (attempts === 3) {
					// Third try: prefer 4+ letters
					minWordLength = 4;
				} else if (attempts === 4) {
					// Fourth try: 3+ letters
					minWordLength = 3;
				} else {
					// Later attempts: allow any length (last-resort)
					minWordLength = 2;
					maxWordLength = 8; // Shorter words might be more reliable late
				}

				const possiblePlays = this.findAIPossiblePlays(minWordLength, maxWordLength);
				if (possiblePlays && possiblePlays.length > 0) {
					// Prefer plays that exist in dictionaries first to avoid relying on lenient ghost-only plays
					const locallyValid = possiblePlays.filter(p => this.dictionaryHas(p.word));
					const candidatePlays = locallyValid.length > 0 ? locallyValid : possiblePlays;
					// Sort by strategic score (includes length, premium squares, cross-words), then regular score
					possiblePlays.sort((a, b) => {
						const aStrategic = a.strategicScore || a.score;
						const bStrategic = b.strategicScore || b.score;
						if (bStrategic !== aStrategic) return bStrategic - aStrategic;
						return b.score - a.score;
					});

					for (const candidate of candidatePlays) {
						// Avoid very short plays early in attempts (prevent 'IN', 'AN', etc.)
						if (candidate.word.length < 4 && attempts <= 3) continue;
						// If over 15 seconds total, consider using a saved shorter candidate if present
						if (Date.now() - startTime > 15000 && savedShortCandidate) {
							const quickValidity = await this.checkAIMoveValidity(savedShortCandidate.word, savedShortCandidate.startPos, savedShortCandidate.isHorizontal);
							if (quickValidity && quickValidity.valid) {
								bestPlay = savedShortCandidate;
								updateThinkingText(getTranslation('aiUsingFallback', _aiLang) || 'AI falling back to shorter move');
								break;
							}
						}

						// If over 60 seconds total, just play the first valid move we can find
						if (Date.now() - startTime > 60000) {
							const quickValidity = await this.checkAIMoveValidity(candidate.word, candidate.startPos, candidate.isHorizontal);
							if (quickValidity && quickValidity.valid) {
								bestPlay = candidate;
								updateThinkingText(getTranslation('aiRunningOutOfTime', _aiLang));
								break;
							}
							continue;
						}

						const validity = await this.checkAIMoveValidity(candidate.word, candidate.startPos, candidate.isHorizontal);
						if (validity && validity.valid) {
							bestPlay = candidate;
							updateThinkingText(getTranslation('aiFoundMove', _aiLang));
							break;
						}
					}
				}

				// If we found a valid play, break out of the attempt loop
				if (bestPlay) break;

				// Wait a bit between attempts to avoid overwhelming
				if (attempts < maxAttempts) {
					await new Promise(resolve => setTimeout(resolve, 500));
				}
			}

			// If still no valid play found after all attempts, keep trying with increasingly desperate measures
			if (!bestPlay) {
				updateThinkingText("AI is desperately searching...");
				await new Promise(res => setTimeout(res, 1000));

				// Try one final comprehensive search
				const desperatePlays = this.findAIPossiblePlays(2, 15);
				for (const candidate of desperatePlays) {
					const validity = this.checkAIMoveValidity(candidate.word, candidate.startPos, candidate.isHorizontal);
					if (validity.valid) {
						bestPlay = candidate;
						updateThinkingText("AI finally found a move!");
						break;
					}
				}
			}

			// If we found a move, play it
			if (bestPlay) {
				setTimeout(() => {
					thinkingMessage.style.opacity = "0";
					setTimeout(() => {
						thinkingMessage.remove();
						this.unblockHintBox();
						this.executeAIPlay(bestPlay);
					}, 300);
				}, 800);
				return;
			}

			// LAST RESORT ATTEMPT: Try with very lenient settings
			console.warn("AI trying last resort with lenient validation");
			const lastResortPlays = this.findAIPossiblePlays(2, 15); // Try any length

			for (const candidate of lastResortPlays.slice(0, 5)) { // Just check first 5
				try {
					// Skip the full validation, just check basic placement
					if (this.isValidAIPlacement(candidate.word, candidate.startPos.row, candidate.startPos.col, candidate.isHorizontal)) {
									if (this.showAIDebug) console.log("AI using last resort move:", candidate);
						bestPlay = candidate;
						break;
					}
				} catch (error) {
					console.warn("Error in last resort validation:", error);
				}
			}

			if (bestPlay) {
				updateThinkingText(getTranslation('aiFoundMove', _aiLang));
				setTimeout(() => {
					thinkingMessage.style.opacity = "0";
					setTimeout(() => {
						thinkingMessage.remove();
						this.unblockHintBox();
						this.executeAIPlay(bestPlay);
					}, 300);
				}, 800);
				return;
			}

			// ABSOLUTE LAST RESORT: Force a pass
			console.warn("AI forced to pass - this indicates a serious issue");
			console.warn("AI rack when forced to pass:", this.aiRack.map(t => t.letter));
			console.warn("Current board state (first move):", this.isFirstMove);
			console.warn("Available anchors:", this.findAnchors().length);
			if (this.showAIDebug) this.showAINotification("🤖 AI was forced to pass - dictionary may be incomplete");
			setTimeout(() => {
				thinkingMessage.style.opacity = "0";
				setTimeout(() => {
					thinkingMessage.remove();
					this.unblockHintBox();
					this.aiPass();
				}, 300);
			}, 1000);

		} catch (error) {
			console.error("Error in AI turn:", error);
			thinkingMessage.remove();
			this.unblockHintBox();
			this.aiPass();
		}

		this.aiValidationLogSet = new Set();
	}

	shouldExchangeTiles() {
		// Only exchange if there are truly no valid moves
		const plays = this.findAIPossiblePlays();
		return plays.length === 0;
	}

	aiPass() {
		// AI is forced to pass (should theoretically never happen)
		this.consecutiveSkips++;
		this.currentTurn = "player";
		this.addToMoveHistory("computer", "SKIP", 0);
		this.updateGameState();
		this.renderRack(); // Update draggable state
		this.highlightValidPlacements();
		if (!this.checkGameEnd()) {
			// Game continues, player's turn now
		}
	}

	evaluatePositionStrategy(play) {
		let value = 0;

		// Bonus for using premium squares
		value +=
			this.countPremiumSquaresUsed(
				play.startPos.row,
				play.startPos.col,
				play.isHorizontal,
				play.word,
			) * 10;

		// Bonus for forming multiple words
		const crossWords = this.countIntersections(
			play.startPos.row,
			play.startPos.col,
			play.isHorizontal,
			play.word,
		);
		value += crossWords * 15;

		// Bonus for using high-point letters effectively
		value += this.evaluateLetterUsage(play.word) * 5;

		return value;
	}

	evaluateLetterUsage(word) {
		let value = 0;
		const highValueLetters = "JQXZ";
		const mediumValueLetters = "BFHMPVWY";

		for (const letter of word) {
			if (highValueLetters.includes(letter)) {
				value += 3;
			} else if (mediumValueLetters.includes(letter)) {
				value += 2;
			}
		}

		// Bonus for good vowel-consonant ratio
		const vowels = "AEIOU";
		const vowelCount = [...word].filter((l) => vowels.includes(l)).length;
		const ratio = vowelCount / word.length;
		if (ratio >= 0.3 && ratio <= 0.6) {
			value += 2;
		}

		return value;
	}

	findSimplePlays() {
		const plays = [];
		const rack = this.aiRack.map((t) => t.letter);

		// Get all possible 2-4 letter combinations
		const combinations = this.getLetterCombinations(rack, 4);

		for (const letters of combinations) {
			// Get all possible words from these letters
			const words = this.findPossibleWordsFromLetters(letters);

			for (const word of words) {
				// Find all valid positions for this word
				for (let row = 0; row < 15; row++) {
					for (let col = 0; col < 15; col++) {
						// Try horizontal placement
						if (this.isValidAIPlacement(word, row, col, true)) {
							const score = this.calculatePotentialScore(word, row, col, true);
							plays.push({
								word,
								startPos: {
									row,
									col
								},
								isHorizontal: true,
								score,
							});
						}

						// Try vertical placement
						if (this.isValidAIPlacement(word, row, col, false)) {
							const score = this.calculatePotentialScore(word, row, col, false);
							plays.push({
								word,
								startPos: {
									row,
									col
								},
								isHorizontal: false,
								score,
							});
						}
					}
				}
			}
		}

		return plays;
	}

	findPossibleWordsFromLetters(letters) {
		const words = new Set();

		// Convert letters to lowercase for dictionary matching
		const lowerLetters = letters.map((l) => l.toLowerCase());
		const letterCounts = {};
		let blankCount = 0;

		// Count available letters including blanks
		lowerLetters.forEach((letter) => {
			if (letter === "*") {
				blankCount++;
			} else {
				letterCounts[letter] = (letterCounts[letter] || 0) + 1;
			}
		});

		// Check each word in dictionary
		for (const dictWord of this.dictionary) {
			if (dictWord.length >= 2 && dictWord.length <= letters.length) {
				const wordCounts = {};
				let canForm = true;
				let blanksNeeded = 0;

				// Count letters needed for this word
				for (const letter of dictWord) {
					wordCounts[letter] = (wordCounts[letter] || 0) + 1;
				}

				// Check if we have enough of each letter
				for (const [letter, count] of Object.entries(wordCounts)) {
					const available = letterCounts[letter] || 0;
					if (available < count) {
						blanksNeeded += count - available;
						if (blanksNeeded > blankCount) {
							canForm = false;
							break;
						}
					}
				}

				if (canForm) {
					words.add(dictWord.toUpperCase());
				}
			}
		}

		return Array.from(words);
	}

	getLetterCombinations(letters, maxLength) {
		const combinations = [];

		// Helper function to generate combinations
		function generateCombination(current, remaining, minLength = 2) {
			if (current.length >= minLength && current.length <= maxLength) {
				combinations.push([...current]);
			}

			if (current.length >= maxLength) {
				return;
			}

			for (let i = 0; i < remaining.length; i++) {
				current.push(remaining[i]);
				generateCombination(current, remaining.slice(i + 1));
				current.pop();
			}
		}

		generateCombination([], letters);
		return combinations;
	}

	evaluateSimplePlay(word, row, col, isHorizontal) {
		let value = 0;

		// Base score
		value += this.calculatePotentialScore(word, row, col, isHorizontal);

		// Bonus for creating multiple words
		if (this.createsMultipleWords(word, row, col, isHorizontal)) {
			value += 15;
		}

		// Bonus for using premium squares
		value += this.countPremiumSquaresUsed(row, col, isHorizontal, word) * 5;

		// Bonus for good positioning
		if (this.isGoodPosition(row, col, isHorizontal, word)) {
			value += 10;
		}

		return value;
	}

	isGoodPosition(row, col, isHorizontal, word) {
		// Check if position uses board features effectively

		// Near center bonus
		const distanceFromCenter = Math.abs(7 - row) + Math.abs(7 - col);
		if (distanceFromCenter <= 3) return true;

		// Creates opportunities for future plays
		const futureOpportunities = this.countFutureOpportunities(
			row,
			col,
			isHorizontal,
			word,
		);
		if (futureOpportunities >= 2) return true;

		// Uses premium squares effectively
		const premiumSquares = this.countPremiumSquaresUsed(
			row,
			col,
			isHorizontal,
			word,
		);
		if (premiumSquares > 0) return true;

		return false;
	}

	findTwoLetterPlay() {
		// Use active dictionary for two-letter validity instead of hard-coded lists
		const validTwoLetterWords = new Set(
			Array.from(this.activeDictionary)
				.filter(w => w && w.length === 2)
				.map(w => w.toUpperCase())
		);

		const rack = this.aiRack.map((t) => t.letter);

		// Try all two-letter combinations
		for (let i = 0; i < rack.length; i++) {
			for (let j = i + 1; j < rack.length; j++) {
				const word = rack[i] + rack[j];
				if (validTwoLetterWords.has(word)) {
					const positions = this.findValidPositionsForWord(word);
					if (positions.length > 0) {
						const bestPosition = positions.sort(
							(a, b) =>
							this.calculatePotentialScore(
								word,
								b.position.row,
								b.position.col,
								b.horizontal,
							) -
							this.calculatePotentialScore(
								word,
								a.position.row,
								a.position.col,
								a.horizontal,
							),
						)[0];

						return {
							word,
							startPos: bestPosition.position,
							isHorizontal: bestPosition.horizontal,
							score: this.calculatePotentialScore(
								word,
								bestPosition.position.row,
								bestPosition.position.col,
								bestPosition.horizontal,
							),
						};
					}
				}
			}
		}

		return null;
	}

	findValidPositionsForWord(word) {
		const positions = [];

		// For first move, only allow placements through center
		if (this.isFirstMove) {
			// Try horizontal center placement
			if (this.isValidAIPlacement(word, 7, 7, true)) {
				positions.push({
					position: {
						row: 7,
						col: 7
					},
					horizontal: true,
				});
			}
			// Try vertical center placement
			if (this.isValidAIPlacement(word, 7, 7, false)) {
				positions.push({
					position: {
						row: 7,
						col: 7
					},
					horizontal: false,
				});
			}
			return positions;
		}

		// For subsequent moves, try all possible positions
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				// Only check positions near existing tiles
				if (this.hasAdjacentTile(row, col)) {
					// Try horizontal placement
					if (col <= 15 - word.length) {
						if (this.isValidAIPlacement(word, row, col, true)) {
							positions.push({
								position: {
									row,
									col
								},
								horizontal: true,
							});
						}
					}

					// Try vertical placement
					if (row <= 15 - word.length) {
						if (this.isValidAIPlacement(word, row, col, false)) {
							positions.push({
								position: {
									row,
									col
								},
								horizontal: false,
							});
						}
					}
				}
			}
		}

		return positions;
	}

	// Add new helper method for forming minimal valid words
	formMinimalValidWord() {
		const vowels = "AEIOU".split("");
		const consonants = "BCDFGHJKLMNPQRSTVWXYZ".split("");
		const availableLetters = this.aiRack.map((tile) => tile.letter);

		// Try to form simple CV or CVC patterns
		const hasVowel = availableLetters.some((l) => vowels.includes(l));
		const hasConsonant = availableLetters.some((l) => consonants.includes(l));

		if (hasVowel && hasConsonant) {
			// Form simple word patterns
			for (const letter1 of availableLetters) {
				for (const letter2 of availableLetters) {
					if (letter1 === letter2) continue;
					const word = letter1 + letter2;
					if (this.dictionaryHas(word)) {
						const startPos = this.findValidPositionForWord(word);
						if (startPos) {
							const play = {
								word,
								startPos,
								isHorizontal: true,
								score: this.calculatePotentialScore(
									word,
									startPos.row,
									startPos.col,
									true,
								),
							};
							this.executeAIPlay(play);
							return;
						}
					}
				}
			}
		}
	}

	// Add helper method for finding valid position for a word
	findValidPositionForWord(word) {
		// Check center position for first move
		if (this.isFirstMove) {
			if (this.isValidAIPlacement(word, 7, 7, true)) {
				return {
					row: 7,
					col: 7
				};
			}
			return null;
		}

		// Try to find position near existing words
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				if (this.hasAdjacentTile(row, col)) {
					if (this.isValidAIPlacement(word, row, col, true)) {
						return {
							row,
							col
						};
					}
					if (this.isValidAIPlacement(word, row, col, false)) {
						return {
							row,
							col
						};
					}
				}
			}
		}
		return null;
	}

	setupHintSystem() {
		const englishHints = [
			"Triple Word Score (TW) squares multiply the entire word score by 3!",
			"Triple Letter Score (TL) squares multiply just that letter's score by 3!",
			"Double Word Score (DW) squares double your entire word score.",
			"Double Letter Score (DL) squares double the value of a single letter.",
			"Try to use all 7 tiles in one turn for a 50-point BINGO bonus!",
			"You can exchange tiles if you don't like your rack.",
			"Short words like 'QI', 'ZA', and 'JO' are valid and useful.",
			"Parallel plays can score big by forming multiple words at once.",
			"Try to block your opponent from premium squares.",
			"Save high-value letters like Q, Z, X, and J for premium squares.",
			"Don't forget: the first word must cover the center star.",
			"You can shuffle your rack to get a new perspective.",
			"Use blank tiles (*) as any letter, but they score zero points.",
			"Keep a good balance of vowels and consonants in your rack.",
			"Adding an 'S' can pluralize and create new words for extra points.",
			"Look for hooks: adding a letter to an existing word to form a new one.",
			"Try to build off existing words for more scoring opportunities.",
			"If you're stuck, exchange some tiles or skip your turn.",
			"The game ends when all tiles are used or both players pass 2 times.",
			"You can print your move history and word definitions after the game.",
			"Hover over a tile to see its point value.",
			"You can undo your move before submitting if you make a mistake.",
			"Use the exchange portal to swap out unwanted tiles.",
			"Plan ahead: don't open up triple word squares for your opponent!",
			"Try to form two or more words in one move for extra points.",
			"The AI gets smarter as the game progresses—watch out!",
			"You can click the 'Simulate Endgame' button to test the AI.",
			"Words must be connected to existing tiles after the first move.",
			"Use the 'Skip Turn' button if you can't play.",
			"Good luck and have fun!"
		];

		const spanishHints = [
			"¡Los cuadrados de Triple Palabra (TW) multiplican toda la palabra por 3!",
			"¡Los cuadrados de Triple Letra (TL) multiplican solo esa letra por 3!",
			"Los cuadrados de Doble Palabra (DW) duplican tu puntuación total.",
			"Los cuadrados de Doble Letra (DL) duplican el valor de una sola letra.",
			"¡Usa las 7 fichas en un turno para un bono BINGO de 50 puntos!",
			"Puedes intercambiar fichas si no te gusta tu estante.",
			"Palabras cortas como 'QI', 'ZA' y 'JO' son válidas y útiles.",
			"Las jugadas paralelas pueden puntuar mucho formando múltiples palabras.",
			"Intenta bloquear a tu oponente de los cuadrados premium.",
			"Guarda letras de alto valor como Q, Z, X, y J para cuadrados premium.",
			"No olvides: la primera palabra debe cubrir la estrella central.",
			"Puedes mezclar tu estante para obtener una nueva perspectiva.",
			"Usa fichas blancas (*) como cualquier letra, pero puntúan cero.",
			"Mantén un buen equilibrio de vocales y consonantes en tu estante.",
			"Agregar una 'S' puede pluralizar y crear nuevas palabras por puntos extra.",
			"Busca ganchos: agregar una letra a una palabra existente para formar una nueva.",
			"Intenta construir sobre palabras existentes para más oportunidades de puntuación.",
			"Si estás atascado, intercambia algunas fichas o salta tu turno.",
			"El juego termina cuando se usan todas las fichas o ambos pasan 2 veces.",
			"Puedes imprimir el historial de movimientos y definiciones después del juego.",
			"Pasa el cursor sobre una ficha para ver su valor en puntos.",
			"Puedes deshacer tu movimiento antes de enviarlo si te equivocas.",
			"Usa el portal de intercambio para cambiar fichas no deseadas.",
			"¡Planifica con anticipación: no abras cuadrados de triple palabra para tu oponente!",
			"Intenta formar dos o más palabras en un movimiento por puntos extra.",
			"¡La IA se vuelve más inteligente a medida que avanza el juego—cuidado!",
			"Puedes hacer clic en 'Simular Final' para probar la IA.",
			"Las palabras deben conectarse a fichas existentes después del primer movimiento.",
			"Usa el botón 'Pasar Turno' si no puedes jugar.",
			"¡Buena suerte y diviértete!"
		];

		let currentHintIndex = 0;
		const hintBox = document.getElementById("hint-box");
		const hintText = document.getElementById("hint-text");

		// Fisher-Yates shuffle
		const shuffleArray = (array) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		};

		// Use appropriate hints based on language
		const hints = (this.preferredLang === 'es') ? spanishHints : englishHints;
		let shuffledHints = shuffleArray([...hints]);

		// Show a hint, but only if not blocked
		const showNextHint = () => {
			if (this.hintBoxBlocked) return;
			if (currentHintIndex >= shuffledHints.length) {
				shuffledHints = shuffleArray([...hints]);
				currentHintIndex = 0;
			}
			hintText.textContent = shuffledHints[currentHintIndex];
			hintBox.classList.add("show");

			clearTimeout(this.hintBoxTimeout);
			this.hintBoxTimeout = setTimeout(() => {
				hintBox.classList.remove("show");
			}, 5000);

			currentHintIndex++;
		};

		// Show first hint after 5 seconds, then every 30 seconds
		setTimeout(() => {
			showNextHint();
			this.hintInterval = setInterval(showNextHint, 30000);
		}, 5000);

		// Show random hint on hover
		hintBox.addEventListener("mouseenter", () => {
			if (this.hintBoxBlocked) return;
			hintText.textContent = shuffledHints[Math.floor(Math.random() * shuffledHints.length)];
			hintBox.classList.add("show");
		});
		hintBox.addEventListener("mouseleave", () => {
			hintBox.classList.remove("show");
		});

		// Store for later use
		this.hintBox = hintBox;
		this.showNextHint = showNextHint;
	}

	initializeHints() {
		// Clear existing hint system
		if (this.hintInterval) {
			clearInterval(this.hintInterval);
			this.hintInterval = null;
		}

		// Reinitialize with current language
		this.setupHintSystem();
	}

	// Find AI candidate plays. Accepts optional opts: { maxSearchTime, maxCandidates }
	findAIPossiblePlays(minWordLength = 2, maxWordLength = 15, opts = {}) {
		try {
			const possiblePlays = [];
			// Quick heuristic: look for single-tile additions to form 2-letter words (covers cases like adding 'H' to form 'HI')
			if (minWordLength <= 2) {
				const seenQuick = new Set();
				for (let r = 0; r < 15; r++) {
					for (let c = 0; c < 15; c++) {
						const cell = this.board[r] && this.board[r][c];
						const existingLetter = cell ? (cell.letter || String(cell).toUpperCase()) : null;
						if (!existingLetter) continue;
						// four directions where we can add one tile
						const dirs = [ [0,1,'H', r, c], [0,-1,'H', r, c], [1,0,'V', r, c], [-1,0,'V', r, c] ];
						for (const [dr, dc, dir, er, ec] of dirs) {
							const nr = er + dr;
							const nc = ec + dc;
							if (!this.isValidPosition(nr, nc) || this.board[nr][nc]) continue;
							for (const tile of this.aiRack) {
								const letter = (tile.letter || tile).toUpperCase();
								let candidate = '';
								let startRow = er;
								let startCol = ec;
								let isHorizontal = dir === 'H';
								if (dr === -1 || dc === -1) {
									// candidate letter goes before existing
									candidate = letter + existingLetter;
									startRow = nr;
									startCol = nc;
								} else {
									candidate = existingLetter + letter;
								}
								if (candidate.length >= minWordLength && this.dictionaryHas(candidate.toLowerCase())) {
									const key = `${candidate}:${startRow}:${startCol}:${isHorizontal}`;
									if (!seenQuick.has(key)) {
										seenQuick.add(key);
										possiblePlays.push({
											word: candidate,
											startPos: { row: startRow, col: startCol },
											isHorizontal,
											score: this.calculatePotentialScore ? this.calculatePotentialScore(candidate, startRow, startCol, isHorizontal) : 0,
											quality: 50
										});
									}
								}
							}
						}
					}
				}
			}
			const rack = this.aiRack.map(tile => tile.letter);
			if (this.showAIDebug) console.log("AI finding moves with rack:", rack, "minLength:", minWordLength, "maxLength:", maxWordLength);

			// Performance optimization: limit search time and candidates
			const startTime = Date.now();
			// Default to a faster search (2s) unless overridden by opts
			const maxSearchTime = typeof opts.maxSearchTime === 'number' ? opts.maxSearchTime : 2000; // ms
			let candidatesFound = 0;
			const maxCandidates = typeof opts.maxCandidates === 'number' ? opts.maxCandidates : 150; // More candidates for better evaluation
			const anchors = this.findAnchors();

			// Prune anchors: score anchors by nearby activity and premium squares, then limit
			const scoredAnchors = anchors.map(a => {
				// Simple anchor score: number of adjacent empty cells + nearby premium squares count
				let adjEmpty = 0;
				const neigh = [[-1,0],[1,0],[0,-1],[0,1]];
				for (const [dr,dc] of neigh) {
					const r = a.row + dr, c = a.col + dc;
					if (this.isValidPosition(r,c) && !this.board[r][c]) adjEmpty++;
				}
				let premiumNearby = 0;
				for (let rr = Math.max(0,a.row-2); rr <= Math.min(14,a.row+2); rr++) {
					for (let cc = Math.max(0,a.col-2); cc <= Math.min(14,a.col+2); cc++) {
						const cell = document.querySelector(`[data-row="${rr}"][data-col="${cc}"]`);
						if (cell && (cell.classList.contains('tw') || cell.classList.contains('dw') || cell.classList.contains('tl') || cell.classList.contains('dl'))) premiumNearby++;
					}
				}
				return { anchor: a, score: adjEmpty * 2 + premiumNearby };
			}).sort((x,y) => y.score - x.score);

			const maxAnchors = typeof opts.maxAnchors === 'number' ? opts.maxAnchors : 40;
			const topAnchors = scoredAnchors.slice(0, Math.max(1, Math.min(scoredAnchors.length, maxAnchors))).map(s => s.anchor);

			// Use a Set to avoid duplicate plays
			const seen = new Set();

			// For each high-potential anchor, try both directions
			for (const anchor of topAnchors) {
				for (const isHorizontal of [true, false]) {
					const prefix = this.getPrefix(anchor, isHorizontal);
					const suffix = this.getSuffix(anchor, isHorizontal);

					// Only consider word lengths that fit the available space
					let maxLen = 1 + prefix.length + suffix.length + rack.length;
					let minLen = Math.max(minWordLength, prefix.length + suffix.length + 1);
					maxLen = Math.min(maxLen, maxWordLength);

					// Use Trie to generate only words that fit prefix/suffix and rack
					let rawCandidates = this.trie.findWordsFromRack(
						rack.concat(prefix.split("")).concat(suffix.split("")),
						minLen,
						maxLen
					);

					// ENHANCEMENT: Pre-filter by dictionary to reject invalid words before scoring
					let candidateWords = rawCandidates.filter(word => {
						if (!word.startsWith(prefix) || !word.endsWith(suffix)) return false;
						if (!this.isScrabbleAppropriate(word)) return false;
						if (!this.dictionaryHas(word)) return false;
						return true;
					});

					// Quick heuristic sort: prefer longer words and those with high-value letters
					const highValue = new Set(['J','Q','X','Z']);
					const mediumValue = new Set(['B','F','H','M','P','V','W','Y']);
					candidateWords.sort((a,b) => {
						if (b.length !== a.length) return b.length - a.length; // longer first
						const aScore = Array.from(a).reduce((s,ch) => s + (highValue.has(ch)?3: mediumValue.has(ch)?1:0),0);
						const bScore = Array.from(b).reduce((s,ch) => s + (highValue.has(ch)?3: mediumValue.has(ch)?1:0),0);
						return bScore - aScore;
					});

					// Limit per-anchor candidates for performance
					const perAnchorLimit = typeof opts.maxPerAnchor === 'number' ? opts.maxPerAnchor : 120;
					if (candidateWords.length > perAnchorLimit) candidateWords = candidateWords.slice(0, perAnchorLimit);

					if (this.showAIDebug && rawCandidates.length > 0) {
						console.log(`Trie found ${rawCandidates.length} raw candidates, ${candidateWords.length} passed filters for anchor ${anchor.row},${anchor.col}`);
					}

					// Performance limit: stop if taking too long
					if (Date.now() - startTime > maxSearchTime) {
						console.warn("AI search timeout, using partial results");
						break;
					}

					for (const word of candidateWords) {
						// Performance limit: stop if we have too many candidates
						if (candidatesFound >= maxCandidates) break;

						// Calculate start position
						const startRow = isHorizontal ? anchor.row : anchor.row - prefix.length;
						const startCol = isHorizontal ? anchor.col - prefix.length : anchor.col;

						// Only try if fits on board
						if (
							this.isValidPosition(startRow, startCol) &&
							this.isValidAIPlacement(word, startRow, startCol, isHorizontal)
						) {
							const key = `${word}:${startRow}:${startCol}:${isHorizontal}`;
							if (seen.has(key)) continue;
							seen.add(key);

							const score = this.calculatePotentialScore(word, startRow, startCol, isHorizontal);

							// Only consider plays that touch at least one anchor
							if (score > 0) {
								possiblePlays.push({
									word,
									startPos: { row: startRow, col: startCol },
									isHorizontal,
									score,
									quality: this.evaluateWordQuality(word, startRow, startCol, isHorizontal)
								});
								candidatesFound++;

								// Early exit only for exceptional moves (higher threshold for deeper search)
								if (score > 80 && possiblePlays.length >= 8) {
									if (this.showAIDebug) console.log("Found exceptional moves early, continuing search for better options");
									// Don't break - continue searching for even better moves
								}
							}
						}
					}
				}
			}

			// Include strategic opportunity analysis
			if (!this.isFirstMove) {
				const strategicOpportunities = this.analyzeBoardForStrategicOpportunities();
				// This information can be used to prioritize moves that use premium squares
				// For now, just log it for debugging
				if (strategicOpportunities.length > 0) {
					console.debug("Strategic opportunities:", strategicOpportunities.slice(0, 3));
				}
			}

			// Fallback: if no anchor plays, try first move logic (center square)
			if (possiblePlays.length === 0 && this.isFirstMove) {
				const possibleWords = this.trie.findWordsFromRack(rack, 2, rack.length);
				for (const word of possibleWords) {
					for (let i = 0; i <= 15 - word.length; i++) {
						// Horizontal through center
						if (i <= 7 && i + word.length > 7) {
							if (this.isValidAIPlacement(word, 7, i, true)) {
								possiblePlays.push({
									word,
									startPos: { row: 7, col: i },
									isHorizontal: true,
									score: this.calculatePotentialScore(word, 7, i, true),
									quality: this.evaluateWordQuality(word, 7, i, true)
								});
							}
						}
						// Vertical through center
						if (i <= 7 && i + word.length > 7) {
							if (this.isValidAIPlacement(word, i, 7, false)) {
								possiblePlays.push({
									word,
									startPos: { row: i, col: 7 },
									isHorizontal: false,
									score: this.calculatePotentialScore(word, i, 7, false),
									quality: this.evaluateWordQuality(word, i, 7, false)
								});
							}
						}
					}
				}
			}

			// Use strategic scoring for much smarter AI decisions
			// Filter out recently rejected plays to avoid immediate reselection
			const filteredPlays = possiblePlays.filter(play => {
				try {
					const key = `${play.word}:${play.startPos.row}:${play.startPos.col}:${play.isHorizontal}`;
					return !(this.aiRejectedPlays && this.aiRejectedPlays.has(key));
				} catch (e) {
					return true;
				}
			});

			const sortedPlays = filteredPlays
				.map(play => ({
					...play,
					strategicScore: this.calculateStrategicScore(play.word, play.startPos.row, play.startPos.col, play.isHorizontal)
				}))
				.sort((a, b) => {
					// Prioritize strategic score (includes length, premium squares, cross-words)
					if (b.strategicScore !== a.strategicScore) return b.strategicScore - a.strategicScore;
					// Then regular score
					if (b.score !== a.score) return b.score - a.score;
					// Then word length
					return b.word.length - a.word.length;
				});

			if (this.showAIDebug) console.log(`AI found ${sortedPlays.length} possible plays, top 3:`, sortedPlays.slice(0, 3).map(p => `${p.word}(${p.score})`));
			return sortedPlays;
		} catch (error) {
			console.error("Error in findAIPossiblePlays:", error);
			return [];
		}
	}

	generatePotentialWords(availableLetters, [hPrefix, hSuffix, vPrefix, vSuffix]) {
		const potentialWords = new Set();
		const letterCounts = {};
		let blankCount = 0;

		// Count available letters including blanks
		availableLetters.forEach(letter => {
			if (letter === '*') {
				blankCount++;
			} else {
				letterCounts[letter] = (letterCounts[letter] || 0) + 1;
			}
		});

		// Check dictionary for potential words
		for (const word of this.activeDictionary) {
			// Skip words that are too short
			if (word.length < 4) continue;

			const upperWord = word.toUpperCase();

			// Check if word can be formed with available letters and patterns
			if (this.canFormComplexWord(upperWord, letterCounts, blankCount, [hPrefix, hSuffix, vPrefix, vSuffix])) {
				potentialWords.add(upperWord);
			}
		}

		return Array.from(potentialWords);
	}

	canFormComplexWord(word, letterCounts, blankCount, patterns) {
		const tempCounts = {
			...letterCounts
		};
		let tempBlankCount = blankCount;

		// Check if word matches any pattern
		const [hPrefix, hSuffix, vPrefix, vSuffix] = patterns;
		const matchesPattern = !hPrefix || word.startsWith(hPrefix) ||
			!hSuffix || word.endsWith(hSuffix) ||
			!vPrefix || word.startsWith(vPrefix) ||
			!vSuffix || word.endsWith(vSuffix);

		if (!matchesPattern) return false;

		// Check if we have the letters to form the word
		for (const letter of word) {
			if (tempCounts[letter] && tempCounts[letter] > 0) {
				tempCounts[letter]--;
			} else if (tempBlankCount > 0) {
				tempBlankCount--;
			} else {
				return false;
			}
		}

		return true;
	}

	calculateStrategicScore(word, row, col, isHorizontal) {
		let score = this.calculatePotentialScore(word, row, col, isHorizontal);

		// Enhanced strategic evaluation using comprehensive quality score
		const quality = this.evaluateWordQuality(word, row, col, isHorizontal);
		score += quality * 2; // Quality score includes all strategic factors

		// Defensive bonus - blocking opponent premium squares
		const defensiveBonus = this.evaluateDefensiveValue(word, row, col, isHorizontal);
		score += defensiveBonus;

		// Endgame consideration - be more aggressive when few tiles remain
		const tilesRemaining = (this.playerRack?.length || 0) + (this.aiRack?.length || 0) + this.tiles.length;
		if (tilesRemaining < 20) {
			// Endgame: prioritize high-scoring moves and tile efficiency
			const endgameBonus = word.length >= 6 ? 50 : word.length >= 4 ? 25 : 0;
			score += endgameBonus;
		}

		// Rack balance consideration - avoid keeping difficult letters
		const rackBalanceBonus = this.evaluateRackBalanceAfterMove(word);
		score += rackBalanceBonus;

		// Position control - prefer moves that control board areas
		const positionControl = this.evaluatePositionControl(word, row, col, isHorizontal);
		score += positionControl;

		return Math.max(0, score);
	}

	calculateWordComplexity(word) {
		const letterValues = {
			'J': 8,
			'K': 7,
			'Q': 10,
			'X': 9,
			'Z': 10,
			'W': 6,
			'V': 6,
			'H': 5,
			'Y': 5,
			'F': 5,
			'B': 4,
			'C': 4,
			'M': 4,
			'P': 4
		};

		return word.split('').reduce((score, letter) => {
			return score + (letterValues[letter] || 1);
		}, 0);
	}

	evaluateDefensiveValue(word, row, col, isHorizontal) {
		let defensiveScore = 0;

		// Check if this move blocks opponent access to premium squares
		for (let i = 0; i < word.length; i++) {
			const currentRow = isHorizontal ? row : row + i;
			const currentCol = isHorizontal ? col + i : col;

			// Check adjacent squares for premium squares that would be blocked
			const adjacentSquares = [
				[currentRow - 1, currentCol],
				[currentRow + 1, currentCol],
				[currentRow, currentCol - 1],
				[currentRow, currentCol + 1]
			];

			for (const [adjRow, adjCol] of adjacentSquares) {
				if (this.isValidPosition(adjRow, adjCol) && !this.board[adjRow][adjCol]) {
					const premium = this.getPremiumSquareType(adjRow, adjCol);
					if (premium === 'tw') {
						defensiveScore += 40; // Block triple word score
					} else if (premium === 'dw') {
						defensiveScore += 25; // Block double word score
					} else if (premium === 'tl') {
						defensiveScore += 15; // Block triple letter score
					} else if (premium === 'dl') {
						defensiveScore += 8; // Block double letter score
					}
				}
			}
		}

		return defensiveScore;
	}

	evaluateRackBalanceAfterMove(word) {
		if (!this.aiRack) return 0;

		let balanceScore = 0;

		// Simulate rack after this move
		const remainingRack = [...this.aiRack];
		const tilesUsed = [];

		// Find which tiles are used for this word
		const wordLetters = word.split('');
		for (const letter of wordLetters) {
			const tileIndex = remainingRack.findIndex(tile =>
				tile.letter === letter || tile.isBlank
			);
			if (tileIndex !== -1) {
				tilesUsed.push(remainingRack[tileIndex]);
				remainingRack.splice(tileIndex, 1);
			}
		}

		// Evaluate remaining rack quality
		const remainingLetters = remainingRack.map(tile => tile.letter);
		const difficultLetters = ['Q', 'Z', 'J', 'X', 'V', 'W', 'K'];
		const remainingDifficult = remainingLetters.filter(l => difficultLetters.includes(l)).length;

		// Bonus for getting rid of difficult letters
		const difficultUsed = tilesUsed.filter(tile => difficultLetters.includes(tile.letter)).length;
		balanceScore += difficultUsed * 20;

		// Penalty for keeping difficult letters
		balanceScore -= remainingDifficult * 15;

		// Bonus for having balanced remaining rack
		const vowels = remainingLetters.filter(l => 'AEIOU'.includes(l)).length;
		const totalRemaining = remainingLetters.length;
		if (totalRemaining > 0) {
			const vowelRatio = vowels / totalRemaining;
			if (vowelRatio >= 0.3 && vowelRatio <= 0.6) {
				balanceScore += 10;
			}
		}

		return balanceScore;
	}

	evaluatePositionControl(word, row, col, isHorizontal) {
		let controlScore = 0;

		// Prefer moves that control multiple rows/columns
		const startRow = row;
		const startCol = col;
		const endRow = isHorizontal ? row : row + word.length - 1;
		const endCol = isHorizontal ? col + word.length - 1 : col;

		// Center control
		const centerProximity = Math.max(
			0,
			7 - Math.abs(startRow - 7),
			0,
			7 - Math.abs(startCol - 7),
			0,
			7 - Math.abs(endRow - 7),
			0,
			7 - Math.abs(endCol - 7)
		);
		controlScore += centerProximity * 3;

		// Board balance - avoid over-concentration in one area
		const quadrant = (startRow < 8 ? 0 : 1) * 2 + (startCol < 8 ? 0 : 1);
		// This would benefit from tracking moves per quadrant, but for now just basic scoring

		// Long moves get position control bonus
		if (word.length >= 6) {
			controlScore += 15;
		} else if (word.length >= 4) {
			controlScore += 8;
		}

		return controlScore;
	}

	evaluateTileManagement(play) {
		if (!play || !this.aiRack) return 0;

		let managementScore = 0;
		const word = play.word;

		// Simulate remaining rack after this move
		const remainingRack = [...this.aiRack];
		const tilesNeeded = this.getTilesNeededForMove(word, play.startPos, play.isHorizontal);

		// Remove used tiles from simulated rack
		for (const neededLetter of tilesNeeded) {
			const tileIndex = remainingRack.findIndex(tile => tile.letter === neededLetter || tile.isBlank);
			if (tileIndex !== -1) {
				remainingRack.splice(tileIndex, 1);
			}
		}

		const remainingLetters = remainingRack.map(tile => tile.letter);

		// Evaluate remaining rack quality
		const difficultLetters = ['Q', 'Z', 'J', 'X', 'V', 'W', 'K'];
		const remainingDifficult = remainingLetters.filter(l => difficultLetters.includes(l)).length;

		// Heavy penalty for keeping difficult letters
		managementScore -= remainingDifficult * 25;

		// Bonus for getting rid of difficult letters
		const difficultUsed = tilesNeeded.filter(l => difficultLetters.includes(l)).length;
		managementScore += difficultUsed * 30;

		// Evaluate vowel/consonant balance of remaining rack
		const vowels = remainingLetters.filter(l => 'AEIOU'.includes(l)).length;
		const totalRemaining = remainingLetters.length;

		if (totalRemaining > 0) {
			const vowelRatio = vowels / totalRemaining;
			if (vowelRatio >= 0.25 && vowelRatio <= 0.6) {
				managementScore += 15; // Good balance
			} else if (vowelRatio < 0.2 || vowelRatio > 0.7) {
				managementScore -= 20; // Poor balance
			}
		}

		// Bonus for keeping S for plural potential
		if (remainingLetters.includes('S') && remainingRack.length > 2) {
			managementScore += 8;
		}

		// Consider endgame - if few tiles left, prioritize using them efficiently
		const totalTilesLeft = remainingRack.length + this.tiles.length;
		if (totalTilesLeft < 10) {
			// Endgame: prefer moves that use more tiles
			managementScore += tilesNeeded.length * 5;
		}

		return managementScore;
	}

	selectBestPlay(plays) {
		// Enable strict mode if near endgame
		const strictMode = this.tiles.length < 10 || this.aiRack.length <= 3;

		if (this.showAIDebug) console.log(`AI evaluating ${plays.length} potential moves...`);

		const validPlays = plays.filter(play => {
			if (!play || !play.word) return false;

			// Always check main word
			if (!this.dictionaryHas(play.word)) {
				if (this.showAIDebug) console.log(`AI rejected "${play.word}" (${play.word.length} letters) - not in dictionary`);
				return false;
			} else {
				if (this.showAIDebug) console.log(`AI accepted "${play.word}" - found in dictionary`);
			}

			// Always check cross-words
			const crossWords = this.getAllCrossWords(
				play.startPos.row,
				play.startPos.col,
				play.isHorizontal,
				play.word
			);

			// In strict mode, ALL cross-words must be valid and >1 letter
			if (strictMode) {
				return crossWords.every(word =>
					this.dictionaryHas(word) && word.length > 1
				);
			} else {
				// In normal mode, allow if most cross-words are valid
				const validCount = crossWords.filter(word =>
					this.dictionaryHas(word) && word.length > 1
				).length;
				return validCount === crossWords.length;
			}
		});

		if (this.showAIDebug) console.log(`AI found ${validPlays.length} valid moves out of ${plays.length} candidates`);

		if (validPlays.length === 0) {
			// Lenient fallback: pick the smallest valid placement if strict checks fail.
			try {
				const lenientCandidates = plays.filter(p => p && p.word && p.startPos && this.isValidAIPlacement(p.word, p.startPos.row, p.startPos.col, p.isHorizontal));
				if (lenientCandidates.length > 0) {
					// sort by shortest word first, then highest score
					lenientCandidates.sort((a, b) => a.word.length - b.word.length || (b.score - a.score));
					for (const cand of lenientCandidates) {
						// Avoid recently rejected exact placements
						const rejKey = `${cand.word}:${cand.startPos.row}:${cand.startPos.col}:${cand.isHorizontal}`;
						if (this.aiRejectedPlays && this.aiRejectedPlays.has(rejKey)) continue;

						// Ensure cross words are not blatantly invalid (allow single letters)
						const crossWords = this.getAllCrossWords(cand.startPos.row, cand.startPos.col, cand.isHorizontal, cand.word) || [];
						const badCross = crossWords.some(w => w && w.length > 1 && !this.dictionaryHas(w));
						if (!badCross) return cand;
					}
					// As a final fallback, return the absolute smallest candidate (may be risky)
					return lenientCandidates[0];
				}
			} catch (e) {
				if (this.showAIDebug) console.warn('Lenient fallback in selectBestPlay failed', e);
			}
			return null;
		}

		return validPlays.sort((a, b) => {
			// Balanced sorting that prioritizes score but considers strategy

			// 1. High score priority - if one move scores significantly more, prefer it
			const scoreDiff = b.score - a.score;
			if (scoreDiff > 25) return 1; // Strong preference for much higher scoring moves
			if (scoreDiff < -25) return -1;

			// 2. Strategic score for close scores (within 25 points)
			if (Math.abs(scoreDiff) <= 25) {
				const strategicDiff = (b.strategicScore || 0) - (a.strategicScore || 0);
				if (Math.abs(strategicDiff) > 30) return strategicDiff > 0 ? 1 : -1;
			}

			// 3. Quality score for very close matches
			const qualityDiff = (b.quality || 0) - (a.quality || 0);
			if (Math.abs(qualityDiff) > 20 && Math.abs(scoreDiff) <= 15) return qualityDiff > 0 ? 1 : -1;

			// 4. Length preference (especially for bingos) - but not at expense of score
			if (b.word.length >= 7 && a.word.length < 7 && scoreDiff >= -10) return 1;
			if (a.word.length >= 7 && b.word.length < 7 && scoreDiff <= 10) return -1;

			// 5. For equal or very close scores, prefer better tile management
			if (Math.abs(scoreDiff) <= 10) {
				const tileManagementDiff = this.evaluateTileManagement(a) - this.evaluateTileManagement(b);
				if (Math.abs(tileManagementDiff) > 15) return tileManagementDiff < 0 ? 1 : -1;
			}

			// 6. Final tiebreaker: score difference
			return scoreDiff;
		})[0];
	}

	findCenterPlays(wordCombinations) {
		const centerPlays = [];

		for (const word of wordCombinations) {
			// Try horizontal center placement
			const colStart = Math.max(0, 7 - Math.floor(word.length / 2));
			if (this.isValidAIPlacement(word, 7, colStart, true)) {
				const score = this.calculateStrategicScore(word, 7, colStart, true);
				centerPlays.push({
					word,
					startPos: {
						row: 7,
						col: colStart
					},
					isHorizontal: true,
					score
				});
			}

			// Try vertical center placement
			const rowStart = Math.max(0, 7 - Math.floor(word.length / 2));
			if (this.isValidAIPlacement(word, rowStart, 7, false)) {
				const score = this.calculateStrategicScore(word, rowStart, 7, false);
				centerPlays.push({
					word,
					startPos: {
						row: rowStart,
						col: 7
					},
					isHorizontal: false,
					score
				});
			}
		}

		return centerPlays.sort((a, b) => b.score - a.score);
	}

	isSimpleExtension(word, existingWords) {
		for (const existingWord of existingWords) {
			// Check for simple prefix/suffix additions
			if (word.startsWith(existingWord) || word.endsWith(existingWord)) {
				return true;
			}
			// Check for common modifications
			if (
				word === existingWord + "S" ||
				word === existingWord + "ED" ||
				word === existingWord + "ING" ||
				word === existingWord + "ES"
			) {
				return true;
			}
		}
		return false;
	}

	createsMultipleWords(word, row, col, isHorizontal) {
		if (!word || !this.isValidPosition(row, col)) return false;

		let crossWordCount = 0;

		for (let i = 0; i < word.length; i++) {
			const currentRow = isHorizontal ? row : row + i;
			const currentCol = isHorizontal ? col + i : col;

			// Check if position is valid before proceeding
			if (!this.isValidPosition(currentRow, currentCol)) continue;

			// Check perpendicular direction for potential words
			const crossWord = this.getPerpendicularWord(
				currentRow,
				currentCol,
				isHorizontal,
			);
			if (crossWord && crossWord.length > 2) {
				crossWordCount++;
			}
		}

		return crossWordCount > 1;
	}

	getPerpendicularWord(row, col, isHorizontal) {
		if (!this.isValidPosition(row, col)) return null;

		// Get the word formed in the perpendicular direction
		return isHorizontal ?
			this.getVerticalWordAt(row, col) :
			this.getHorizontalWordAt(row, col);
	}

	getVerticalWordAt(row, col, board = this.board) {
		if (!this.isValidPosition(row, col)) return null;

		let word = "";
		let startRow = row;

		while (startRow > 0 && board[startRow - 1][col]) {
			startRow--;
		}

		let currentRow = startRow;
		while (currentRow < 15 && board[currentRow][col]) {
			word += board[currentRow][col].letter;
			currentRow++;
		}

		return word.length > 1 ? word : null;
	}

	getHorizontalWordAt(row, col, board = this.board) {
		if (!this.isValidPosition(row, col)) return null;

		let word = "";
		let startCol = col;

		while (startCol > 0 && board[row][startCol - 1]) {
			startCol--;
		}

		let currentCol = startCol;
		while (currentCol < 15 && board[row][currentCol]) {
			word += board[row][currentCol].letter;
			currentCol++;
		}

		return word.length > 1 ? word : null;
	}

	hasPerpendicularWord(row, col, isHorizontal) {
		if (isHorizontal) {
			return this.getVerticalWordAt(row, col) !== null;
		} else {
			return this.getHorizontalWordAt(row, col) !== null;
		}
	}

	getWordAt(row, col, isHorizontal) {
		if (!this.isValidPosition(row, col)) return null;

		let word = "";
		let startPos = isHorizontal ? col : row;

		// Find start of word
		while (
			this.isValidPosition(
				isHorizontal ? row : startPos - 1,
				isHorizontal ? startPos - 1 : col,
			) &&
			this.board[isHorizontal ? row : startPos - 1][
				isHorizontal ? startPos - 1 : col
			]
		) {
			startPos--;
		}

		// Build word
		let currentPos = startPos;
		while (
			this.isValidPosition(
				isHorizontal ? row : currentPos,
				isHorizontal ? currentPos : col,
			) &&
			this.board[isHorizontal ? row : currentPos][
				isHorizontal ? currentPos : col
			]
		) {
			word +=
				this.board[isHorizontal ? row : currentPos][
					isHorizontal ? currentPos : col
				].letter;
			currentPos++;
		}

		return word.length > 1 ? word : null;
	}

	isValidPosition(row, col) {
		return row >= 0 && row < 15 && col >= 0 && col < 15;
	}

	getMinDistanceToLastMove(row, col) {
		if (this.placedTiles.length === 0) return Infinity;

		const lastMove = this.placedTiles[0];
		return Math.abs(row - lastMove.row) + Math.abs(col - lastMove.col);
	}

	getWordInDirection(row, col, direction) {
		const [dx, dy] = direction;
		let word = "";
		let currentRow = row;
		let currentCol = col;

		// Find start of word
		while (
			currentRow >= 0 &&
			currentRow < 15 &&
			currentCol >= 0 &&
			currentCol < 15 &&
			this.board[currentRow][currentCol]
		) {
			currentRow -= dx;
			currentCol -= dy;
		}

		// Move back to last valid position
		currentRow += dx;
		currentCol += dy;

		// Build word
		while (
			currentRow >= 0 &&
			currentRow < 15 &&
			currentCol >= 0 &&
			currentCol < 15 &&
			this.board[currentRow][currentCol]
		) {
			word += this.board[currentRow][currentCol].letter;
			currentRow += dx;
			currentCol += dy;
		}

		return word.length > 1 ? word : null;
	}

	getConnectedWords(row, col) {
		const words = new Set();
		const directions = [
			[0, 1], // horizontal
			[1, 0], // vertical
		];

		for (const direction of directions) {
			const word = this.getWordInDirection(row, col, direction);
			if (word) {
				words.add(word);
			}
		}

		return Array.from(words);
	}

	getPotentialCrossWords(row, col, letter, direction) {
		const tempBoard = JSON.parse(JSON.stringify(this.board));
		tempBoard[row][col] = {
			letter: letter
		};

		return direction === "horizontal" ?
			this.getVerticalWordAt(row, col) :
			this.getHorizontalWordAt(row, col);
	}

	getAllWordsFromPosition(row, col, isHorizontal) {
		const words = new Set();

		// Get main word
		const mainWord = this.getWordAt(row, col, isHorizontal);
		if (mainWord) words.add(mainWord);

		// Get perpendicular words
		const perpWord = this.getWordAt(row, col, !isHorizontal);
		if (perpWord) words.add(perpWord);

		return Array.from(words);
	}

	findPotentialWords(availableLetters) {
		const words = new Set();
		const letterCount = {};
		let blankCount = availableLetters.filter((l) => l === "*").length;

		// Count available letters
		availableLetters.forEach((letter) => {
			if (letter !== "*") {
				letterCount[letter] = (letterCount[letter] || 0) + 1;
			}
		});

		// Check dictionary for words that can be formed
		for (const word of this.activeDictionary) {
			if (word.length >= 2) {
				const upperWord = word.toUpperCase();
				const tempCount = {
					...letterCount
				};
				let tempBlankCount = blankCount;
				let canForm = true;

				// Check if word can be formed with available letters
				for (const letter of upperWord) {
					if (tempCount[letter] && tempCount[letter] > 0) {
						tempCount[letter]--;
					} else if (tempBlankCount > 0) {
						tempBlankCount--;
					} else {
						canForm = false;
						break;
					}
				}

				if (canForm) {
					words.add(upperWord);
				}
			}
		}

		return Array.from(words);
	}

	findWordsWithPrefixSuffix(prefix, suffix, availableLetters) {
		const words = new Set();
		const pattern = new RegExp(`^${prefix}.*${suffix}$`);

		// Get all possible combinations of available letters
		const letterCombinations = this.getCombinations(availableLetters);

		for (const combination of letterCombinations) {
			const word = prefix + combination + suffix;
			if (
				word.length >= 2 &&
				this.dictionaryHas(word) &&
				pattern.test(word)
			) {
				words.add(word);
			}
		}

		return Array.from(words);
	}

	getCombinations(letters, maxLength = 7) {
		const results = new Set();

		function combine(current, remaining) {
			if (current.length > 0) {
				results.add(current);
			}
			if (current.length >= maxLength) return;

			for (let i = 0; i < remaining.length; i++) {
				combine(current + remaining[i], remaining.slice(i + 1));
			}
		}

		combine("", letters.join(""));
		return Array.from(results);
	}

	isSimpleModification(word, existingWords) {
		const commonSuffixes = ["S", "ES", "ED", "ING"];

		for (const existingWord of existingWords) {
			// Check for simple plurals or common suffixes
			if (
				commonSuffixes.some(
					(suffix) =>
					word === existingWord + suffix || existingWord === word + suffix,
				)
			) {
				return true;
			}

			// Check for simple prefixes
			if (word.endsWith(existingWord) || existingWord.endsWith(word)) {
				return true;
			}
		}

		return false;
	}

	canFormLongerWord(currentWord, availableLetters) {
		const minLength = currentWord.length + 1;
		const maxLength = Math.min(
			15,
			availableLetters.length + currentWord.length,
		);
		const letterPool = [...availableLetters.map((t) => t.letter)];

		// Count available letters including blanks
		const letterCount = {};
		let blankCount = letterPool.filter((l) => l === "*").length;
		letterPool.forEach((letter) => {
			if (letter !== "*") {
				letterCount[letter] = (letterCount[letter] || 0) + 1;
			}
		});

		// Search dictionary for longer words
		for (const word of this.activeDictionary) {
			if (word.length >= minLength && word.length <= maxLength) {
				const upperWord = word.toUpperCase();
				const tempCount = {
					...letterCount
				};
				let tempBlankCount = blankCount;
				let canForm = true;

				// Check if we can form this word
				for (const letter of upperWord) {
					if (tempCount[letter] && tempCount[letter] > 0) {
						tempCount[letter]--;
					} else if (tempBlankCount > 0) {
						tempBlankCount--;
					} else {
						canForm = false;
						break;
					}
				}

				if (canForm) {
					return true;
				}
			}
		}
		return false;
	}



	hasAdjacentSpace(row, col, vertical) {
		if (vertical) {
			// Check spaces above and below
			const aboveEmpty = row > 0 && !this.board[row - 1][col];
			const belowEmpty = row < 14 && !this.board[row + 1][col];
			return aboveEmpty || belowEmpty;
		} else {
			// Check spaces left and right
			const leftEmpty = col > 0 && !this.board[row][col - 1];
			const rightEmpty = col < 14 && !this.board[row][col + 1];
			return leftEmpty || rightEmpty;
		}
	}

	isGoodPositionForS(row, col, horizontal) {
		// Check if S can be used to extend existing words
		if (horizontal) {
			// Check if there's a word to the left that could be pluralized
			return (
				col > 0 &&
				this.board[row][col - 1] &&
				!this.board[row][col] &&
				this.isValidWordEnd(row, col - 1)
			);
		} else {
			// Check if there's a word above that could be pluralized
			return (
				row > 0 &&
				this.board[row - 1][col] &&
				!this.board[row][col] &&
				this.isValidWordEnd(row - 1, col)
			);
		}
	}

	evaluateBoardBalance(row, col, horizontal, word) {
		let balance = 0;
		const boardQuadrants = this.getBoardQuadrantDensities();
		const wordQuadrant = this.getQuadrant(row, col);

		// Prefer plays in less dense quadrants
		const currentDensity = boardQuadrants[wordQuadrant];
		balance += (1 - currentDensity) * 20;

		// Bonus for connecting different areas of the board
		if (this.connectsDifferentAreas(row, col, horizontal, word)) {
			balance += 25;
		}

		return balance;
	}

	connectsDifferentAreas(row, col, horizontal, word) {
		const connectedAreas = new Set();

		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check all adjacent positions
			const directions = [
				[-1, 0],
				[1, 0],
				[0, -1],
				[0, 1],
			];
			for (const [dx, dy] of directions) {
				const newRow = currentRow + dx;
				const newCol = currentCol + dy;

				if (
					this.isValidPosition(newRow, newCol) &&
					this.board[newRow][newCol]
				) {
					connectedAreas.add(this.getAreaIdentifier(newRow, newCol));
				}
			}
		}

		return connectedAreas.size > 1;
	}

	getAreaIdentifier(row, col) {
		// Divide board into regions and return identifier for given position
		if (row < 5) {
			return col < 5 ? "TL" : col < 10 ? "TC" : "TR";
		} else if (row < 10) {
			return col < 5 ? "ML" : col < 10 ? "MC" : "MR";
		} else {
			return col < 5 ? "BL" : col < 10 ? "BC" : "BR";
		}
	}

	getBoardQuadrantDensities() {
		const quadrants = {
			TL: 0,
			TC: 0,
			TR: 0,
			ML: 0,
			MC: 0,
			MR: 0,
			BL: 0,
			BC: 0,
			BR: 0,
		};

		let counts = {};
		let totals = {};

		// Initialize counters
		for (const quad in quadrants) {
			counts[quad] = 0;
			totals[quad] = 0;
		}

		// Count occupied spaces in each quadrant
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				const quad = this.getAreaIdentifier(row, col);
				totals[quad]++;
				if (this.board[row][col]) {
					counts[quad]++;
				}
			}
		}

		// Calculate densities
		for (const quad in quadrants) {
			quadrants[quad] = counts[quad] / totals[quad];
		}

		return quadrants;
	}

	evaluateDefensivePosition(row, col, horizontal, word) {
		let value = 0;

		// Check for potential high-scoring opportunities created for opponent
		const vulnerabilities = this.assessVulnerabilities(
			row,
			col,
			horizontal,
			word,
		);
		value -= vulnerabilities * 30;

		// Bonus for blocking opponent's access to premium squares
		const blockedPremiums = this.countBlockedPremiumSquares(
			row,
			col,
			horizontal,
			word,
		);
		value += blockedPremiums * 25;

		// Consider distance from edges (avoid creating edge opportunities)
		const edgeRisk = this.assessEdgeRisk(row, col, horizontal, word);
		value -= edgeRisk;

		return value;
	}

	assessVulnerabilities(row, col, horizontal, word) {
		let vulnerabilityCount = 0;

		// Check positions adjacent to the word
		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check perpendicular positions
			const checkPositions = horizontal ? [
				[currentRow - 1, currentCol],
				[currentRow + 1, currentCol],
			] : [
				[currentRow, currentCol - 1],
				[currentRow, currentCol + 1],
			];

			for (const [checkRow, checkCol] of checkPositions) {
				if (
					this.isValidPosition(checkRow, checkCol) &&
					!this.board[checkRow][checkCol]
				) {
					// Check if position could be used for high-scoring play
					if (this.isPotentialHighScorePosition(checkRow, checkCol)) {
						vulnerabilityCount++;
					}
				}
			}
		}

		return vulnerabilityCount;
	}

	isPotentialHighScorePosition(row, col) {
		// Check if position is adjacent to premium squares
		const adjacentPremiums = this.getAdjacentPremiumSquares(row, col);
		if (adjacentPremiums.length > 0) return true;

		// Check if position could be used for long word placement
		const maxWordLength = this.getMaxPossibleWordLength(row, col);
		if (maxWordLength >= 7) return true;

		return false;
	}

	getMaxPossibleWordLength(row, col) {
		// Check horizontal
		let horizontalSpace = 0;
		let currentCol = col;
		while (currentCol >= 0 && !this.board[row][currentCol]) {
			horizontalSpace++;
			currentCol--;
		}
		currentCol = col + 1;
		while (currentCol < 15 && !this.board[row][currentCol]) {
			horizontalSpace++;
			currentCol++;
		}

		// Check vertical
		let verticalSpace = 0;
		let currentRow = row;
		while (currentRow >= 0 && !this.board[currentRow][col]) {
			verticalSpace++;
			currentRow--;
		}
		currentRow = row + 1;
		while (currentRow < 15 && !this.board[currentRow][col]) {
			verticalSpace++;
			currentRow++;
		}

		return Math.max(horizontalSpace, verticalSpace);
	}

	countBlockedPremiumSquares(row, col, horizontal, word) {
		let blocked = 0;
		const premiumTypes = ["tw", "dw", "tl", "dl"];

		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check adjacent positions
			const adjacentPositions = [
				[currentRow - 1, currentCol],
				[currentRow + 1, currentCol],
				[currentRow, currentCol - 1],
				[currentRow, currentCol + 1],
			];

			for (const [checkRow, checkCol] of adjacentPositions) {
				if (this.isValidPosition(checkRow, checkCol)) {
					const premium = this.getPremiumSquareType(checkRow, checkCol);
					if (premiumTypes.includes(premium)) {
						blocked++;
					}
				}
			}
		}

		return blocked;
	}

	assessEdgeRisk(row, col, horizontal, word) {
		let risk = 0;

		// Check if word is placed near edges
		const isNearEdge = (pos) => pos <= 1 || pos >= 13;

		if (horizontal) {
			if (isNearEdge(row)) {
				risk += 15;
				// Extra penalty if word creates opportunities along the edge
				if (this.createsEdgeOpportunities(row, col, horizontal, word)) {
					risk += 20;
				}
			}
		} else {
			if (isNearEdge(col)) {
				risk += 15;
				if (this.createsEdgeOpportunities(row, col, horizontal, word)) {
					risk += 20;
				}
			}
		}

		return risk;
	}

	createsEdgeOpportunities(row, col, horizontal, word) {
		// Check if placement creates easy extension opportunities along edges
		const checkPositions = horizontal ? [
			[row - 1, col + word.length],
			[row + 1, col + word.length],
		] : [
			[row + word.length, col - 1],
			[row + word.length, col + 1],
		];

		for (const [checkRow, checkCol] of checkPositions) {
			if (
				this.isValidPosition(checkRow, checkCol) &&
				!this.board[checkRow][checkCol]
			) {
				if (this.isPotentialHighScorePosition(checkRow, checkCol)) {
					return true;
				}
			}
		}

		return false;
	}

	// ENHANCEMENT: Implement missing method to fix undefined method calls
	// Returns array of adjacent premium squares to a given board position
	getAdjacentPremiumSquares(row, col) {
		const adjacentPositions = [
			[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
		];

		const premiums = [];
		for (const [checkRow, checkCol] of adjacentPositions) {
			if (this.isValidPosition(checkRow, checkCol)) {
				const premium = this.getPremiumSquareType(checkRow, checkCol);
				if (premium && premium !== 'none') {
					premiums.push({ row: checkRow, col: checkCol, type: premium });
				}
			}
		}
		return premiums;
	}

	findSimpleWords(letters) {
		const words = new Set();
		const letterCount = {};

		// Count available letters
		letters.forEach((letter) => {
			letterCount[letter] = (letterCount[letter] || 0) + 1;
		});

		// Check each word in dictionary
		for (const word of this.activeDictionary) {
			if (word.length >= 2 && word.length <= letters.length) {
				const upperWord = word.toUpperCase();
				const tempCount = {
					...letterCount
				};
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
			return [{
				row: 7,
				col: 7
			}];
		}

		// Find all positions adjacent to existing tiles
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				if (!this.board[row][col] && this.hasAdjacentTile(row, col)) {
					anchors.push({
						row,
						col
					});
				}
			}
		}
		return anchors;
	}

	hasAdjacentTile(row, col) {
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
				this.isValidPosition(newRow, newCol) &&
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
		for (const word of this.activeDictionary) {
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
		if (
			word === "SKIP" ||
			word === "EXCHANGE" ||
			word === "QUIT" ||
			word.includes("&")
		) {
			return null;
		}

		// Clean up the word - remove scores and parentheses
		const cleanWord = word.split("(")[0].trim();

		try {
			// Fetch from the dictionary API
			const response = await fetch(
				`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord.toLowerCase()}`,
			);

			// Handle API errors
			if (!response.ok) {
						if (this.showAIDebug) console.log(`No definition found for: ${cleanWord}`);
				return null;
			}

			const data = await response.json();

			// Extract and format the definitions
			if (data && data[0] && data[0].meanings) {
				return data[0].meanings.map((meaning) => ({
					partOfSpeech: meaning.partOfSpeech,
					definitions: meaning.definitions
						.slice(0, 2) // Limit to first 2 definitions per part of speech
						.map((def) => def.definition),
				}));
			}

			return null;
		} catch (error) {
			console.error(`Error fetching definition for ${word}:`, error);
			return null;
		}
	}

	// Modify the generatePrintContent method to handle undefined words
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
                    <p>Winner: ${this.playerScore > this.aiScore ? "Player" : "Computer"}</p>
                </div>
            </div>
        `;

		// Generate content for each move with validation
		const moves = this.moveHistory
			.map((move, index) => {
				if (!move || !move.word) {
					if (this.showAIDebug) console.log('Invalid move found:', move);
					return ''; // Skip invalid moves
				}

				// Handle special moves
				if (["SKIP", "EXCHANGE", "QUIT"].includes(move.word)) {
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
				let wordContent = "";
				let words = [];

				try {
					// Handle multiple words (separated by &)
					if (move.word.includes("&")) {
						words = move.word.split("&")
							.map(w => w.trim())
							.map(w => {
								const match = w.match(/([A-Z]+)\s*\((\d+)\)/);
								return match ? match[1] : w;
							});
					} else {
						// Handle single word
						const match = move.word.match(/([A-Z]+)\s*(?:\((\d+)\))?/);
						words = match ? [match[1]] : [move.word];
					}

					// Generate definition sections for valid words
					const definitions = words
						.filter(word => word && typeof word === 'string')
						.map(word => {
							const def = wordDefinitions.get(word);
							if (!def) return "";

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
                                                `).join("")}
                                            </ul>
                                        </div>
                                    `).join("")}
                                </div>
                            </div>
                        `;
						})
						.join("");

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
				} catch (error) {
					console.error('Error processing move:', move, error);
					return ''; // Skip problematic moves
				}
			})
			.filter(Boolean) // Remove empty strings from invalid moves
			.join("");

		// Return complete HTML content with error handling
		return `
        ${this.getPrintStyles()}
        ${header}
        <div class="moves-container">
            ${moves || '<p>No moves to display</p>'}
        </div>
    `;
	}

	// Add a helper method for print styles
	getPrintStyles() {
		return `
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
            .move {
                margin: 20px 0;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: #f9f9f9;
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
            @media print {
                .move {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
            }
        </style>
    `;
	}

	getPrefix(anchor, isHorizontal) {
		let prefix = "";
		let {
			row,
			col
		} = anchor;

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
		let {
			row,
			col
		} = anchor;

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
		const availableLetters = this.aiRack.map((tile) => tile.letter);

		// Count vowels and consonants
		const vowels = ["A", "E", "I", "O", "U"];
		const vowelCount = availableLetters.filter((l) =>
			vowels.includes(l),
		).length;
		const consonantCount = availableLetters.length - vowelCount;

		// Try finding simple 2-3 letter words first
		const simpleWords = this.findSimpleWords(availableLetters);
		if (simpleWords.length > 0) {
			if (this.showAIDebug) console.log("Found simple words:", simpleWords);
			return true;
		}

		// If rack is very unbalanced, prefer exchange
		if (
			vowelCount === 0 ||
			consonantCount === 0 ||
			vowelCount > 5 ||
			consonantCount > 5
		) {
			if (this.showAIDebug) console.log("Rack is unbalanced - exchanging tiles");
			return false;
		}

		// Check each word in dictionary
		for (const word of this.activeDictionary) {
			// Allow shorter words (2-3 letters) for more possibilities
			if (
				word.length >= 2 &&
				this.canFormWord(word, "", "", availableLetters)
			) {
				if (this.showAIDebug) console.log("Found possible word:", word);
				return true;
			}
		}

		return false;
	}

	findSimpleWords(letters) {
		const words = new Set();
		const letterCount = {};

		// Count available letters
		letters.forEach((letter) => {
			letterCount[letter] = (letterCount[letter] || 0) + 1;
		});

		// Check each word in dictionary
		for (const word of this.activeDictionary) {
			if (word.length >= 2 && word.length <= letters.length) {
				const upperWord = word.toUpperCase();
				const tempCount = {
					...letterCount
				};
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

	// Update inside findAIPossiblePlays method
	canFormWord(word, prefix, suffix, availableLetters) {
		word = word.toUpperCase();
		prefix = prefix.toUpperCase();
		suffix = suffix.toUpperCase();

		const letterCount = {};
		let blankCount = availableLetters.filter(l => l === "*").length;

		availableLetters.forEach(letter => {
			if (letter !== "*") {
				letterCount[letter] = (letterCount[letter] || 0) + 1;
			}
		});

		// For first move or starting fresh
		if (!prefix && !suffix) {
			for (const letter of word) {
				if (letterCount[letter] && letterCount[letter] > 0) {
					letterCount[letter]--;
				} else if (blankCount > 0) {
					blankCount--; // Use blank tile optimally
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

		// Track which letters we'll use blanks for (prefer high-value letters)
		const letterValues = neededPart.map(letter => ({
			letter,
			value: this.tileValues[letter]
		})).sort((a, b) => b.value - a.value);

		for (const {
				letter
			}
			of letterValues) {
			if (letterCount[letter] && letterCount[letter] > 0) {
				letterCount[letter]--;
			} else if (blankCount > 0) {
				blankCount--; // Use blank for high-value letters first
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

	// Place this inside your ScrabbleGame class

	async checkAIMoveValidity(word, startPos, isHorizontal) {
		// Enhanced AI validation with confidence scoring
		const lang = this.preferredLang || 'en';
		const excludedVariants = new Set([
			"atropin", // German spelling, not valid in English Scrabble
		]);

		// Simulate the move on a temporary board
		let tempBoard = JSON.parse(JSON.stringify(this.board));
		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;
			if (!tempBoard[row][col]) {
				tempBoard[row][col] = {
					letter: word[i]
				};
			}
		}

		// Collect all words formed with confidence scores
		let invalidWords = [];
		let validWords = [];
		let totalConfidence = 0;
		let wordCount = 0;

		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startPos.row : startPos.row + i;
			const col = isHorizontal ? startPos.col + i : startPos.col;

			// Main word validation with confidence scoring
			if (i === 0) {
				const mainWord = isHorizontal ?
					this.getHorizontalWordAt(row, col, tempBoard) :
					this.getVerticalWordAt(row, col, tempBoard);

				if (mainWord && mainWord.length > 1) {
					const validation = await this.validateWordInContext(mainWord.toLowerCase(), { word: mainWord }, true);

					if (validation.isValid && !excludedVariants.has(mainWord.toLowerCase())) {

						// Extra guard for 2-letter main words: require high-confidence or presence in loaded dictionaries
						if (mainWord.length === 2) {
							const lw = mainWord.toLowerCase();
							const inTier1 = this.coreValidDictionary && this.coreValidDictionary.has(lw);
							const inAnyDict = (this.dictionary && this.dictionary.has(lw)) || (this.backupDictionary && this.backupDictionary.has(lw));
							if (!inTier1 && !inAnyDict) {
								invalidWords.push(mainWord);
								continue;
							}
						}
						// Check if AI can provide the tiles it needs to place (not already on board)
						const tilesToPlace = this.getTilesNeededForMove(word, startPos, isHorizontal);
						const canForm = this.canFormWordWithTiles(tilesToPlace.join(''), this.aiRack || []);
						if (canForm) {
							validWords.push({ word: mainWord, confidence: validation.confidence, isMain: true });
							totalConfidence += validation.confidence;
							wordCount++;

						} else {
							invalidWords.push(`${mainWord} (insufficient tiles)`);
						}
					} else {
						invalidWords.push(mainWord);
					}
				}
			}

			// Crosswords validation with confidence scoring
			const crossWord = isHorizontal ?
				this.getVerticalWordAt(row, col, tempBoard) :
				this.getHorizontalWordAt(row, col, tempBoard);

			if (crossWord && crossWord.length > 1 && !validWords.some(v => v.word === crossWord)) {
				const validation = await this.validateWordInContext(crossWord.toLowerCase(), { word: crossWord }, false);

				if (validation.isValid && !excludedVariants.has(crossWord.toLowerCase())) {
					// Reject any 2-letter crosswords outright to avoid obscure/abbreviations
					if (crossWord.length === 2) {
						invalidWords.push(crossWord);
						continue;
					}
					// Cross words are formed by intersection - no additional tiles needed from rack
					validWords.push({ word: crossWord, confidence: validation.confidence, isMain: false });
					totalConfidence += validation.confidence;
					wordCount++;
				} else {
					invalidWords.push(crossWord);
				}
			}
		}

		// Calculate average confidence for valid moves
		const avgConfidence = wordCount > 0 ? totalConfidence / wordCount : 0;

		// AI decision logic based on confidence and validity
		if (invalidWords.length === 0) {
			return {
				valid: true,
				confidence: avgConfidence,
				validWords: validWords,
				aiRecommendation: avgConfidence >= 85 ? 'excellent' : avgConfidence >= 70 ? 'good' : 'acceptable'
			};
		} else {
			return {
				valid: false,
				invalidWords: invalidWords,
				validWords: validWords,
				confidence: avgConfidence,
				reason: `Invalid words: ${invalidWords.join(', ')}`
			};
		}
	}

async executeAIPlay(play) {
    const { word, startPos, isHorizontal, score } = play;
	if (this.showAIDebug) console.log("AI attempting to play:", { word, startPos, isHorizontal, score });


    // --- FINAL TRIPLE CHECK: Ensure all words are valid before playing ---
    const validity = await this.checkAIMoveValidity(word, startPos, isHorizontal);
    if (!validity.valid) {
		const rejKey = `${word}:${startPos.row}:${startPos.col}:${isHorizontal}`;
		// Mark this exact placement as rejected for a short time to avoid retry loops
		try {
			this.aiRejectedPlays.add(rejKey);
			// Remove rejection after short delay so AI can reconsider later
			setTimeout(() => this.aiRejectedPlays.delete(rejKey), 8000);
		} catch (e) {/* ignore */}
		// Suppress UI blunder notification to avoid spam; debug log only when enabled
		if (this.showAIDebug) console.warn("[AI Triple Check] Move rejected due to invalid words:", validity.invalidWords, "key:", rejKey);
		setTimeout(() => this.aiTurn(), 1000);
		return;
    }

    // --- GHOST CHECK: Simulate placing the word and check all words formed ---
    let tempBoard = JSON.parse(JSON.stringify(this.board));
    for (let i = 0; i < word.length; i++) {
        const row = isHorizontal ? startPos.row : startPos.row + i;
        const col = isHorizontal ? startPos.col + i : startPos.col;
        if (!tempBoard[row][col]) {
            tempBoard[row][col] = { letter: word[i] };
        }
    }

    // Gather all words formed by this move (main and crosswords)
    let allWordsValid = true;
    let invalidWords = [];
    let checkedWords = new Set();

    for (let i = 0; i < word.length; i++) {
        const row = isHorizontal ? startPos.row : startPos.row + i;
        const col = isHorizontal ? startPos.col + i : startPos.col;

        // Main word (only check once)
        if (i === 0) {
            const mainWord = isHorizontal ?
                this.getHorizontalWordAt(row, col, tempBoard) :
                this.getVerticalWordAt(row, col, tempBoard);
			if (mainWord && mainWord.length > 1 && !this.dictionaryHas(mainWord)) {
                allWordsValid = false;
                invalidWords.push(mainWord);
				if (this.showAIDebug) console.log(`[AI Ghost Check] Invalid main word: ${mainWord}`);
            } else if (mainWord && mainWord.length > 1) {
                checkedWords.add(mainWord);
				if (this.showAIDebug) console.log(`[AI Ghost Check] Main word valid: ${mainWord}`);
            }
        }

        // Crosswords for each new tile
        const crossWord = isHorizontal ?
            this.getVerticalWordAt(row, col, tempBoard) :
            this.getHorizontalWordAt(row, col, tempBoard);
        if (crossWord && crossWord.length > 1 && !checkedWords.has(crossWord)) {
			if (!this.dictionaryHas(crossWord)) {
                allWordsValid = false;
                invalidWords.push(crossWord);
				if (this.showAIDebug) console.log(`[AI Ghost Check] Invalid cross word: ${crossWord}`);
            } else {
                checkedWords.add(crossWord);
				if (this.showAIDebug) console.log(`[AI Ghost Check] Cross word valid: ${crossWord}`);
            }
        }
    }

    if (!allWordsValid) {
		const rejKey = `${word}:${startPos.row}:${startPos.col}:${isHorizontal}`;
		try {
			this.aiRejectedPlays.add(rejKey);
			setTimeout(() => this.aiRejectedPlays.delete(rejKey), 8000);
		} catch (e) {}
		// Suppress UI blunder notification to avoid spam; debug log only when enabled
		if (this.showAIDebug) console.warn(`AI would have formed invalid words: ${invalidWords.join(", ")}. Retrying...`);
		if (this.showAIDebug) console.log(`[AI Ghost Check] Move rejected due to invalid words:`, invalidWords, 'key:', rejKey);
		setTimeout(() => this.aiTurn(), 1000);
		return;
    }

    // --- If all words valid, proceed as normal ---
	if (this.showAIDebug) console.log("[AI Ghost Check] All words valid. Proceeding with move.");

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
        let totalScore = 0; // Declare at Promise scope for both setTimeout callbacks
        let aiBingo = false; // Declare for bingo detection
        let aiBingoVariant = 'standard'; // Declare for bingo variant
        let wordsList = []; // Declare for storing formed words
        let aiBingoEffectShown = false; // Prevent duplicate bingo effects

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
                            value: 0,
                            id: `blank_${Date.now()}_${i}`,
                            isBlank: true,
                        };
                    }
                }

                if (tileIndex !== -1) {
                    const tile = {
                        letter: letter,
                        value: this.aiRack[tileIndex].isBlank ? 0 : this.tileValues[letter],
                        id: this.aiRack[tileIndex].isBlank ?
                            `blank_${letter}_${Date.now()}_${i}` : `ai_${letter}_${Date.now()}_${i}`,
                        isBlank: this.aiRack[tileIndex].isBlank,
                    };

                    // Create animated tile element
                    const animatedTile = document.createElement("div");
                    animatedTile.className = "tile";
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

                    // Animation setup - much faster and simpler
                    animatedTile.style.cssText = `
                      position: fixed;
                      top: ${targetRect.top - 40}px;
                      left: ${targetRect.left}px;
                      transform: scale(0.8);
                      opacity: 0.7;
                      transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                      z-index: 1000;
                  `;

                    document.body.appendChild(animatedTile);

                    // Animate tile placement - much faster
                    await new Promise((resolve) => {
                        setTimeout(() => {
                            animatedTile.style.top = `${targetRect.top}px`;
                            animatedTile.style.transform = "scale(1.1)";
                            animatedTile.style.opacity = "1";

                            setTimeout(() => {
                                animatedTile.style.transform = "scale(1)";
                                setTimeout(() => {
                                    targetCell.classList.add("tile-placed");
                                    animatedTile.remove();

                                    this.aiRack.splice(tileIndex, 1);
                                    this.board[row][col] = tile;
                                    this.renderAIRack();

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

                                    targetCell.innerHTML = "";
                                    targetCell.appendChild(permanentTile);

                                    setTimeout(() => {
                                        targetCell.classList.remove("tile-placed");
                                    }, 500);

                                    resolve();
                                }, 250);
                            }, 200);
                        }, 200);
                    });

                    await new Promise((resolve) => setTimeout(resolve, 80)); // Much faster tile placement
                }
            }
        }

        // Update game state after all animations complete
        setTimeout(() => {
            // Get all formed words and calculate total score
            const formedWords = this.getFormedWords();
            totalScore = 0; // Already declared at Promise scope
            wordsList = []; // Already declared at Promise scope

            // --- Extra insurance: skip words that already existed on the previous board or were already played ---
            formedWords.forEach((wordInfo) => {
                const { word, startPos, direction } = wordInfo;
                const wordUpper = word.toUpperCase();

                // Check if word was already played or existed before this move
                let existedBefore = false;
                if (this.previousBoard) {
                    // Scan previous board for this word horizontally and vertically
                    for (let r = 0; r < 15; r++) {
                        let hWord = "";
                        for (let c = 0; c < 15; c++) {
                            if (this.previousBoard[r][c]) {
                                hWord += this.previousBoard[r][c].letter;
                            } else {
                                if (hWord === wordUpper) existedBefore = true;
                                hWord = "";
                            }
                        }
                        if (hWord === wordUpper) existedBefore = true;
                    }
                    for (let c = 0; c < 15; c++) {
                        let vWord = "";
                        for (let r = 0; r < 15; r++) {
                            if (this.previousBoard[r][c]) {
                                vWord += this.previousBoard[r][c].letter;
                            } else {
                                if (vWord === wordUpper) existedBefore = true;
                                vWord = "";
                            }
                        }
                        if (vWord === wordUpper) existedBefore = true;
                    }
                }
                if (this.wordsPlayed && this.wordsPlayed.has(wordUpper) || existedBefore) {
					if (this.showAIDebug) console.log(`[AI] Skipping score for already played or existing word: ${word}`);
                    return;
                }

                const wordScore = this.calculateWordScore(
                    word,
                    startPos.row,
                    startPos.col,
                    direction === "horizontal"
                );
                totalScore += wordScore;
                wordsList.push({
                    word,
                    score: wordScore
                });
				if (this.showAIDebug) console.log(`[AI] Word formed: ${word} for ${wordScore} points`);
            });

			// --- BINGO BONUS for AI ---
			wordsList.forEach(w => {
				if (w.word.length >= 7 && !this.wordsPlayed.has(w.word.toUpperCase())) {
					totalScore += 50;
					aiBingo = true; // Already declared at Promise scope
					const len = w.word.length;
					if (len >= 9) aiBingoVariant = 'gold'; // Already declared at Promise scope
					else if (len === 8 && aiBingoVariant !== 'gold') aiBingoVariant = 'silver';
					// AI should not display any celebration (no audio, no confetti) per user request.
				}
			});

			// Now add all words to wordsPlayed set
			wordsList.forEach(w => {
				this.wordsPlayed.add(w.word.toUpperCase());
			});

			// Format move description for multiple words
			let moveDescription;
			const currentLang = localStorage.getItem('preferredLang') || 'en';
			if (wordsList.length > 1) {
				moveDescription = wordsList
					.map((w) => {
						const displayWord = translateWordForDisplay(w.word, currentLang);
						return `${displayWord} (${w.score})`;
					})
					.join(" & ");
			} else if (wordsList.length === 1) {
				moveDescription = translateWordForDisplay(wordsList[0].word, currentLang);
			} else {
				moveDescription = "(No new words scored)";
			}

			// --- AI auto-speech disabled by user request ---
				if (this.showAIDebug) console.log(`Total score for move: ${totalScore}`);

				// Score will be added in final update below
				this.isFirstMove = false;
				this.consecutiveSkips = 0;

				this.currentTurn = "player";
				// Clear the placed tiles array after scoring
				this.placedTiles = [];

				// Refill racks and update display
				this.fillRacks();
				this.renderRack(); // Ensure draggable state is updated
				this.updateGhostPreview();
				this.updateGameState();

				// --- AI auto-speech disabled by user request ---
				if (this.showAIDebug) console.log(`Total score for move: ${totalScore}`);

				// Score will be added in final update below
				this.isFirstMove = false;
				this.consecutiveSkips = 0;

				this.currentTurn = "player";
				// Clear the placed tiles array after scoring
				this.placedTiles = [];

				// Refill racks and update display
				this.fillRacks();
				this.renderRack(); // Ensure draggable state is updated
				this.updateGhostPreview();
				this.updateGameState();
			});

			// --- AI auto-speech disabled by user request ---
			// Execute final game state updates after tile placement animation
			setTimeout(() => {
				if (this.showAIDebug) console.log(`Total score for move: ${totalScore}`);

				this.aiScore += totalScore;
				this.isFirstMove = false;
				this.consecutiveSkips = 0;

				this.currentTurn = "player";
				// Prefer structured words (word + score) when available
				this.addToMoveHistory("Computer", wordsList.length ? wordsList.map(w => ({ word: w.word, score: w.score })) : (this._lastScoredWords || []), totalScore);

				// Clear the placed tiles array after scoring
				this.placedTiles = [];

				// Refill racks and update display
				this.fillRacks();
				this.renderRack(); // Ensure draggable state is updated
				this.updateGhostPreview();
				this.updateGameState();

				// If AI scored a bingo, trigger the same bingo visuals and speech as the player (ONLY ONCE)
				if (aiBingo && !aiBingoEffectShown) {
					aiBingoEffectShown = true; // Mark as shown to prevent duplicates
					try {
						if (typeof this.showBingoBonusEffect === 'function') {
							this.showBingoBonusEffect(false, aiBingoVariant);
						} else if (typeof this.createConfettiEffect === 'function') {
							this.createConfettiEffect({ variant: aiBingoVariant });
						}
						// Also trigger bingo speech for AI
						if (typeof this.speakBingo === 'function') {
							this.speakBingo('computer');
						}
					} catch (e) { console.warn('AI bingo effects failed', e); }
				}
				resolve();
			}, 1000);  // Slightly longer delay for final updates
    });
}

	calculateWordScore(word, startRow, startCol, isHorizontal) {
		// Modernized: accept an optional set of newly placed positions for deterministic scoring
		const newlyPlacedSet = this._scoringNewlyPlacedSet || new Set((this.placedTiles || []).map(t => `${t.row},${t.col}`));
		let wordScore = 0;
		let wordMultiplier = 1;

		for (let i = 0; i < word.length; i++) {
			const row = isHorizontal ? startRow : startRow + i;
			const col = isHorizontal ? startCol + i : startCol;
			const boardTile = this.board[row][col];
			// If the tile is already on the permanent board use its value; otherwise check newly placed tiles
			let letterScoreBase = 0;
			let letterChar = null;
			if (boardTile) {
				letterScoreBase = boardTile.value || 0;
				letterChar = boardTile.letter;
			} else {
				// find placed tile info (temporary placedTiles array)
				const placed = (this.placedTiles || []).find(t => t.row === row && t.col === col);
				if (placed) {
					letterScoreBase = placed.value || this.tileValues[(placed.letter || '').toUpperCase()] || 0;
					letterChar = placed.letter || null;
				} else {
					// fallback: try previousBoard or tileValues by reading board letter if available
					letterChar = (boardTile && boardTile.letter) || null;
					letterScoreBase = (letterChar && this.tileValues[letterChar.toUpperCase()]) || 0;
				}
			}

			let letterScore = letterScoreBase;
			const key = `${row},${col}`;
			if (newlyPlacedSet.has(key)) {
				const premium = this.getPremiumSquareType(row, col);
				if (premium === 'dl') letterScore *= 2;
				if (premium === 'tl') letterScore *= 3;
				if (premium === 'dw') wordMultiplier *= 2;
				if (premium === 'tw') wordMultiplier *= 3;
			}

			wordScore += letterScore;
		}

		return wordScore * wordMultiplier;
	}

	findBestMove() {
		const possibleMoves = this.findPossibleMoves();

		// Apply strategic evaluation to each move
		const evaluatedMoves = possibleMoves.map((move) => ({
			...move,
			strategicValue: this.evaluateStrategicValue(move),
		}));

		// Sort moves based on multiple criteria
		return evaluatedMoves.sort((a, b) => {
			// First compare adjusted scores with strategic value
			const aTotal = a.score + a.strategicValue;
			const bTotal = b.score + b.strategicValue;
			if (bTotal !== aTotal) {
				return bTotal - aTotal;
			}

			// Then prefer longer words
			if (b.word.length !== a.word.length) {
				return b.word.length - a.word.length;
			}

			// Finally, consider board position
			const aCenterDist = Math.abs(7 - a.row) + Math.abs(7 - a.col);
			const bCenterDist = Math.abs(7 - b.row) + Math.abs(7 - b.col);
			return aCenterDist - bCenterDist;
		})[0];
	}

	evaluateStrategicValue(move) {
		let value = 0;
		const {
			word,
			row,
			col,
			horizontal
		} = move;

		// Evaluate board control
		value += this.evaluateBoardControl(row, col, horizontal, word);

		// Evaluate premium square strategy
		value += this.evaluatePremiumSquareStrategy(row, col, horizontal, word);

		// Evaluate future opportunities
		value += this.evaluateFutureOpportunities(row, col, horizontal, word);

		// Evaluate defensive play
		value += this.evaluateDefensivePlay(row, col, horizontal, word);

		return value;
	}

	evaluateBoardControl(row, col, horizontal, word) {
		let value = 0;

		// Bonus for controlling central area
		const centerControl = this.evaluateCenterControl(
			row,
			col,
			horizontal,
			word,
		);
		value += centerControl * 30;

		// Bonus for balanced board coverage
		const coverage = this.evaluateBoardCoverage(row, col, horizontal, word);
		value += coverage * 25;

		// Penalty for overcrowding areas
		const crowding = this.evaluateAreaCrowding(row, col, horizontal, word);
		value -= crowding * 20;

		return value;
	}

	evaluatePremiumSquareStrategy(row, col, horizontal, word) {
		let value = 0;

		// Check if move blocks opponent's access to premium squares
		if (this.blocksOpponentPremiumSquares(row, col, horizontal, word)) {
			value += 50;
		}

		// Penalty for opening up premium squares to opponent
		if (this.opensTripleWordScore(row, col, horizontal, word)) {
			value -= 60;
		}

		// Bonus for efficient use of premium squares
		value += this.evaluatePremiumSquareEfficiency(row, col, horizontal, word);

		return value;
	}

	evaluateFutureOpportunities(row, col, horizontal, word) {
		let value = 0;

		// Evaluate potential hook opportunities created
		const hookOpportunities = this.countHookOpportunities(
			row,
			col,
			horizontal,
			word,
		);
		value += hookOpportunities * 15;

		// Evaluate potential extension opportunities
		const extensionOpportunities = this.countExtensionOpportunities(
			row,
			col,
			horizontal,
			word,
		);
		value += extensionOpportunities * 20;

		// Consider remaining tiles in bag
		value += this.evaluateRemainingTilesOpportunities(word);

		return value;
	}

	evaluateDefensivePlay(row, col, horizontal, word) {
		let value = 0;

		// Prevent opponent from accessing high-scoring opportunities
		if (this.blocksHighScoringOpportunity(row, col, horizontal, word)) {
			value += 40;
		}

		// Avoid setting up opponent for premium squares
		if (this.createsVulnerability(row, col, horizontal, word)) {
			value -= 35;
		}

		// Consider board balance and control
		const defensivePosition = this.evaluateDefensivePosition(
			row,
			col,
			horizontal,
			word,
		);
		value += defensivePosition;

		return value;
	}

	blocksOpponentPremiumSquares(row, col, horizontal, word) {
		const premiumSquares = this.getNearbyPremiumSquares(
			row,
			col,
			horizontal,
			word,
		);
		return premiumSquares.some((square) =>
			this.wouldBlockPremiumSquare(square.row, square.col, word),
		);
	}

	opensTripleWordScore(row, col, horizontal, word) {
		// Check if this move creates easy access to triple word scores
		const twSquares = this.getNearbyTripleWordSquares(row, col);
		return twSquares.some((square) =>
			this.createsEasyAccess(square.row, square.col, word),
		);
	}

	createsPlayOpportunities(row, col, horizontal, word) {
		// Count potential future play opportunities created
		let opportunities = 0;

		// Check for extension possibilities
		opportunities += this.countExtensionOpportunities(
			row,
			col,
			horizontal,
			word,
		);

		// Check for cross-word possibilities
		opportunities += this.countCrossWordOpportunities(
			row,
			col,
			horizontal,
			word,
		);

		return opportunities > 2; // Return true if creates multiple opportunities
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
						moves.push({
							word,
							row,
							col,
							horizontal: true,
							score
						});
					}
				}
			}

			// Try vertical placements
			for (let row = 0; row <= 15 - word.length; row++) {
				for (let col = 0; col < 15; col++) {
					if (this.isValidAIPlacement(word, row, col, false)) {
						const score = this.calculatePotentialScore(word, row, col, false);
						moves.push({
							word,
							row,
							col,
							horizontal: false,
							score
						});
					}
				}
			}
		}

		return moves;
	}

	findPossibleWords(letters) {
		const words = new Set();
		const letterCount = {};
		const blankCount = letters.filter(l => l === "*").length;

		// Count available letters
		letters.forEach(letter => {
			if (letter !== "*") {
				letterCount[letter] = (letterCount[letter] || 0) + 1;
			}
		});

		// Enhanced blank tile usage - prioritize high-value opportunities
		const priorityLetters = new Set(['S', 'R', 'E', 'D', 'L', 'Y']); // Common useful letters

		for (const word of this.activeDictionary) {
			if (word.length >= 3) { // Minimum word length of 3
				const upperWord = word.toUpperCase();
				const tempCount = {
					...letterCount
				};
				let tempBlankCount = blankCount;
				let canForm = true;
				let blanksUsed = [];

				// Try to form word
				for (const letter of upperWord) {
					if (tempCount[letter] && tempCount[letter] > 0) {
						tempCount[letter]--;
					} else if (tempBlankCount > 0) {
						// Prioritize using blanks for useful letters
						if (priorityLetters.has(letter) || this.tileValues[letter] >= 4) {
							tempBlankCount--;
							blanksUsed.push(letter);
						} else if (tempBlankCount > 1) { // Save one blank for priority letters if possible
							tempBlankCount--;
							blanksUsed.push(letter);
						} else {
							canForm = false;
							break;
						}
					} else {
						canForm = false;
						break;
					}
				}

				if (canForm) {
					words.add({
						word: upperWord,
						blanksUsed: blanksUsed
					});
				}
			}
		}

		return Array.from(words);
	}

	// New helper function to evaluate words using blank tiles
	evaluateWordWithBlanks(word, blanksUsed) {
		let score = 0;

		// Base score for word length
		score += word.length * 10;

		// Premium for longer words
		if (word.length >= 7) score += 50;

		// Score for valuable letters
		for (const letter of word) {
			score += this.tileValues[letter] || 0;
		}

		// Adjust score based on blank tile usage efficiency
		// Prefer using blanks for high-value letters
		const lettersUsingBlanks = word.split('')
			.sort((a, b) => this.tileValues[b] - this.tileValues[a])
			.slice(0, blanksUsed);

		const blankEfficiency = lettersUsingBlanks.reduce((sum, letter) =>
			sum + this.tileValues[letter], 0) / blanksUsed;

		score += blankEfficiency * 5;

		return score;
	}

	isValidAIPlacement(word, startRow, startCol, horizontal) {
		if (word.length < 2) {
			this.logAIValidation(`Rejecting ${word} - words must be at least 2 letters long`);
			return false;
		}

		if (!this.dictionaryHas(word)) {
			this.logAIValidation(`${word} is not a valid word in the dictionary`);
			return false;
		}

		// Check if AI has the tiles needed for this placement
		const tilesNeeded = this.getTilesNeededForMove(word, { row: startRow, col: startCol }, horizontal);
		if (!this.canFormWordWithTiles(tilesNeeded.join(''), this.aiRack || [])) {
			this.logAIValidation(`${word} rejected - AI doesn't have tiles: ${tilesNeeded.join('')}`);
			return false;
		}

		if (horizontal) {
			if (startCol < 0 || startCol + word.length > 15 || startRow < 0 || startRow > 14) {
				return false;
			}
		} else {
			if (startRow < 0 || startRow + word.length > 15 || startCol < 0 || startCol > 14) {
				return false;
			}
		}

		let hasValidIntersection = false;
		let tempBoard = JSON.parse(JSON.stringify(this.board));

		for (let i = 0; i < word.length; i++) {
			const row = horizontal ? startRow : startRow + i;
			const col = horizontal ? startCol + i : startCol;

			if (tempBoard[row][col]) {
				if (tempBoard[row][col].letter !== word[i]) {
					this.logAIValidation(`Letter mismatch at position [${row},${col}]`);
					return false;
				}
				hasValidIntersection = true;
			} else {
				tempBoard[row][col] = {
					letter: word[i]
				};
			}

			const adjacentPositions = horizontal ? [
				[row - 1, col],
				[row + 1, col]
			] : [
				[row, col - 1],
				[row, col + 1]
			];

			for (const [adjRow, adjCol] of adjacentPositions) {
				if (this.isValidPosition(adjRow, adjCol) && tempBoard[adjRow][adjCol]) {
					const crossWord = horizontal ?
						this.getVerticalWordAt(row, col, tempBoard) :
						this.getHorizontalWordAt(row, col, tempBoard);

						if (crossWord && crossWord.length > 1) {
							// Disallow any 2-letter crosswords to avoid obscure/invalid cross words
							if (crossWord.length === 2) {
								this.logAIValidation(`Rejecting placement: would create 2-letter cross word: ${crossWord}`);
								return false;
							}
							if (!this.dictionaryHas(crossWord)) {
								this.logAIValidation(`Invalid cross word formed: ${crossWord}`);
								return false;
							}
							hasValidIntersection = true;
						}
				}
			}
		}

		if (this.isFirstMove) {
			const usesCenterSquare = horizontal ?
				startRow === 7 && startCol <= 7 && startCol + word.length > 7 :
				startCol === 7 && startRow <= 7 && startRow + word.length > 7;

			if (!usesCenterSquare) {
				this.logAIValidation("First move must use center square");
				return false;
			}
			return true;
		}

		if (!hasValidIntersection) {
			this.logAIValidation("Word must connect with existing tiles");
			return false;
		}

		return true;
	}

	getAllCrossWords(row, col, isHorizontal, word) {
		const crossWords = [];
		const tempBoard = JSON.parse(JSON.stringify(this.board));

		// Place the word temporarily
		for (let i = 0; i < word.length; i++) {
			const currentRow = isHorizontal ? row : row + i;
			const currentCol = isHorizontal ? col + i : col;

			if (!tempBoard[currentRow][currentCol]) {
				tempBoard[currentRow][currentCol] = {
					letter: word[i]
				};

				// Check for cross-word at this position
				const crossWord = isHorizontal ?
					this.getVerticalWordAt(currentRow, currentCol, tempBoard) :
					this.getHorizontalWordAt(currentRow, currentCol, tempBoard);

				if (crossWord && crossWord.length > 1) {
					crossWords.push(crossWord);
				}
			}
		}

		return crossWords;
	}

	getWordInDirection(row, col, [dx, dy], board) {
		let word = "";
		let startRow = row;
		let startCol = col;

		// Find start of word
		while (
			this.isValidPosition(startRow - dx, startCol - dy) &&
			board[startRow - dx][startCol - dy]
		) {
			startRow -= dx;
			startCol -= dy;
		}

		// Build word
		let currentRow = startRow;
		let currentCol = startCol;
		while (
			this.isValidPosition(currentRow, currentCol) &&
			board[currentRow][currentCol]
		) {
			word += board[currentRow][currentCol].letter;
			currentRow += dx;
			currentCol += dy;
		}

		return word;
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
			const positions = horizontal ? [
					[row - 1, col],
					[row + 1, col],
				] // Check above and below
				:
				[
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
		if (!word) return false;

		const up = String(word).toUpperCase();

		// If the word exists in the active dictionary, it's not an abbreviation
		if (this.dictionaryHas(up)) return false;

		// Check for roman numerals (considered abbreviations here)
		const romanNumeralPattern = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
		if (romanNumeralPattern.test(up)) {
			console.log(`${word} appears to be a roman numeral - rejecting`);
			return true;
		}

		// Short unknown tokens (<=3 letters) that are not in the dictionary are likely abbreviations
		if (up.length <= 3) {
			console.log(`${word} not found in dictionary and short - treating as abbreviation`);
			return true;
		}

		return false;
	}

	isDirectlyAdjacentToWord(word, row, col, isHorizontal) {
		const checkRow = isHorizontal ? [row - 1, row + 1] // Check rows above and below for horizontal words
			:
			[row, row + word.length - 1]; // Check start and end rows for vertical words

		const checkCol = isHorizontal ? [col, col + word.length - 1] // Check start and end cols for horizontal words
			:
			[col - 1, col + 1]; // Check columns left and right for vertical words

		for (let r of checkRow) {
			for (let c of checkCol) {
				// Check if position is valid and contains a tile
				if (r >= 0 && r < 15 && c >= 0 && c < 15 && this.board[r][c]) {
					// Make sure we're not checking crossing points
					if (isHorizontal && c >= col && c < col + word.length) continue;
					if (!isHorizontal && r >= row && r < row + word.length) continue;

					return true;
				}
			}
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
	console.debug("Existing words on board:", existingWords);
	return existingWords;
	}

	getExistingWordsWithPositions() {
		const words = [];

		// Check horizontal words
		for (let row = 0; row < 15; row++) {
			let word = "";
			let startCol = 0;
			for (let col = 0; col < 15; col++) {
				if (this.board[row][col]) {
					if (word === "") startCol = col; // Start of word
					word += this.board[row][col].letter;
				} else if (word.length > 1) {
					// End of word
					words.push({
						word: word,
						startPos: { row: row, col: startCol },
						direction: 'horizontal'
					});
					word = "";
				} else {
					word = "";
				}
			}
			if (word.length > 1) {
				// End of word at board edge
				words.push({
					word: word,
					startPos: { row: row, col: startCol },
					direction: 'horizontal'
				});
			}
		}

		// Check vertical words
		for (let col = 0; col < 15; col++) {
			let word = "";
			let startRow = 0;
			for (let row = 0; row < 15; row++) {
				if (this.board[row][col]) {
					if (word === "") startRow = row; // Start of word
					word += this.board[row][col].letter;
				} else if (word.length > 1) {
					// End of word
					words.push({
						word: word,
						startPos: { row: startRow, col: col },
						direction: 'vertical'
					});
					word = "";
				} else {
					word = "";
				}
			}
			if (word.length > 1) {
				// End of word at board edge
				words.push({
					word: word,
					startPos: { row: startRow, col: col },
					direction: 'vertical'
				});
			}
		}

		console.debug("Existing words with positions:", words);
		return words;
	}

	calculatePotentialScore(word, startRow, startCol, horizontal) {
		let totalScore = 0;
		let tempBoard = JSON.parse(JSON.stringify(this.board));

		// Heavy penalty for simple extensions of existing words
		const existingWords = this.getExistingWords();
		for (const existingWord of existingWords) {
			if (word.startsWith(existingWord) || word.endsWith(existingWord)) {
				totalScore -= 50; // Significant penalty for simple extensions
			}
			if (
				word === existingWord + "S" ||
				word === existingWord + "ED" ||
				word === existingWord + "ING"
			) {
				totalScore -= 75; // Even larger penalty for common suffixes
			}
		}

		// Get all formed words and calculate base score
		const formedWords = this.getFormedWords();
		let wordsList = [];

formedWords.forEach((wordInfo) => {
    const { word, startPos, direction } = wordInfo;
    const wordUpper = word.toUpperCase();
    let existedBefore = false;
    if (this.previousBoard) {
        // Scan previous board for this word horizontally and vertically
        for (let r = 0; r < 15; r++) {
            let hWord = "";
            for (let c = 0; c < 15; c++) {
                if (this.previousBoard[r][c]) {
                    hWord += this.previousBoard[r][c].letter;
                } else {
                    if (hWord === wordUpper) existedBefore = true;
                    hWord = "";
                }
            }
            if (hWord === wordUpper) existedBefore = true;
        }
        for (let c = 0; c < 15; c++) {
            let vWord = "";
            for (let r = 0; r < 15; r++) {
                if (this.previousBoard[r][c]) {
                    vWord += this.previousBoard[r][c].letter;
						} else {
							if (vWord === wordUpper) existedBefore = true;
							vWord = "";
						}
					}
					if (vWord === wordUpper) existedBefore = true;
				}
			}
			if (this.wordsPlayed && this.wordsPlayed.has(wordUpper) || existedBefore) {
				return;
			}

			const wordScore = this.calculateWordScore(
				word,
				startPos.row,
				startPos.col,
				direction === "horizontal"
			);
			totalScore += wordScore;
			wordsList.push({
				word,
				score: wordScore
			});
		});

		// Strategic scoring adjustments
		let adjustedScore = totalScore;

		// Strongly encourage longer words
		if (word.length >= 5) {
			adjustedScore += word.length * 30;
		}

		// Bonus for creating multiple words
		if (formedWords.length > 1) {
			adjustedScore += 40 * formedWords.length;
		}

		// Bonus for using high-value letters effectively
		for (let i = 0; i < word.length; i++) {
			const letter = word[i];
			if (this.tileValues[letter] >= 4) {
				// High-value letters
				const row = horizontal ? startRow : startRow + i;
				const col = horizontal ? startCol + i : startCol;
				const premium = this.getPremiumSquareType(row, col);
				if (premium) {
					adjustedScore += 35; // Bonus for strategic use of high-value letters
				}
			}
		}

		// Encourage parallel word formation
		const parallelWords = this.getParallelWords(
			startRow,
			startCol,
			horizontal,
			word,
		);
		if (parallelWords.length > 0) {
			adjustedScore += 45 * parallelWords.length;
		}

		// Bonus for creative word placement
		if (this.isCreativePlacement(startRow, startCol, horizontal, word)) {
			adjustedScore += 40;
		}

		return adjustedScore;
	}

	isCreativePlacement(row, col, horizontal, word) {
		// Consider a placement creative if it:
		// 1. Creates multiple intersections
		const intersections = this.countIntersections(row, col, horizontal, word);
		if (intersections >= 2) return true;

		// 2. Uses premium squares effectively
		const premiumSquaresUsed = this.countPremiumSquaresUsed(
			row,
			col,
			horizontal,
			word,
		);
		if (premiumSquaresUsed >= 2) return true;

		// 3. Creates opportunities for future plays
		const futureOpportunities = this.countFutureOpportunities(
			row,
			col,
			horizontal,
			word,
		);
		if (futureOpportunities >= 3) return true;

		return false;
	}

	getParallelWords(row, col, horizontal, word) {
		const parallelWords = [];

		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check perpendicular direction for potential words
			const perpWord = horizontal ?
				this.getVerticalWordAt(currentRow, currentCol) :
				this.getHorizontalWordAt(currentRow, currentCol);

			if (perpWord && perpWord.length > 2) {
				parallelWords.push(perpWord);
			}
		}

		return parallelWords;
	}

	countIntersections(row, col, horizontal, word) {
		let intersections = 0;
		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check if this position intersects with existing words
			if (this.hasPerpendicularWord(currentRow, currentCol, horizontal)) {
				intersections++;
			}
		}
		return intersections;
	}

	countFutureOpportunities(row, col, horizontal, word) {
		let opportunities = 0;
		const directions = horizontal ? [
			[-1, 0],
			[1, 0],
		] : [
			[0, -1],
			[0, 1],
		];

		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			for (const [dx, dy] of directions) {
				const newRow = currentRow + dx;
				const newCol = currentCol + dy;

				if (
					this.isValidPosition(newRow, newCol) &&
					!this.board[newRow][newCol]
				) {
					// Check if this position could be used for future words
					if (this.hasAdjacentTile(newRow, newCol)) {
						opportunities++;
					}
				}
			}
		}
		return opportunities;
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
		tempBoard[row][col] = {
			letter: letter
		};

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

		return word.length > 1 ? {
				word,
				length: word.length,
				start: start,
			} :
			null;
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
		// Only check immediate adjacent positions
		const positions = isHorizontal ? [
				[row - 1, col],
				[row + 1, col],
			] // Check only directly above and below
			:
			[
				[row, col - 1],
				[row, col + 1],
			]; // Check only directly left and right

		// Filter out the current position
		const adjacentPositions = positions.filter(
			([r, c]) => r !== row || c !== col,
		);

		for (const [checkRow, checkCol] of adjacentPositions) {
			if (
				this.isValidPosition(checkRow, checkCol) &&
				this.board[checkRow][checkCol]
			) {
				// Check if there's an actual parallel word
				const existingWord = this.getWordAt(checkRow, checkCol, isHorizontal);
				if (existingWord && existingWord.length >= 2) {
					// Only consider it parallel if it's an actual word
					console.log(
						`Found parallel word: ${existingWord} at [${checkRow}, ${checkCol}]`,
					);
					return true;
				}
			}
		}
		return false;
	}

	playAIMove(move) {
		console.log("AI playing move:", move);
		const {
			word,
			row,
			col,
			horizontal,
			score
		} = move;

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
	this.addToMoveHistory("Computer", [{ word, score }], score);
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
		const lang = this.preferredLang || 'en';
		const distribution = lang === 'es' ? this.spanishTileDistribution : this.tileDistribution;
		const values = lang === 'es' ? this.spanishTileValues : this.tileValues;

		for (const [letter, count] of Object.entries(distribution)) {
			for (let i = 0; i < count; i++) {
				this.tiles.push({
					letter,
					value: values[letter],
					id: `${letter}_${i}`,
					isBlank: letter === "*",
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
		// Show loading screen immediately
		this.showLoadingScreen();

		try {
			// Load French dictionary only for French version
			this.updateLoadingProgress('Loading French dictionary...');
			await this.loadFrenchDictionary();
			this.activeDictionary = new Set(this.frenchDictionary);

			// Create board and UI elements
			this.updateLoadingProgress('Creating game board...');
			this.createBoard();

			this.updateLoadingProgress('Setting up game pieces...');
			this.fillRacks();
			this.setupTapPlacement();
			this.setupEventListeners();
		} catch (error) {
			console.error('Initialization failed:', error);
			this.showErrorScreen('Failed to load game. Please refresh the page.');
			return;
		}

		// Hide loading screen and show the game
		this.hideLoadingScreen();
		// Initialize all language selector dropdowns and persist choice
		try {
			const selectors = Array.from(document.querySelectorAll('select.language-button'));
			if (selectors && selectors.length > 0) {
				// set initial value from stored preference for all selectors
				for (const s of selectors) {
					try { s.value = this.preferredLang || 'en'; } catch (e) { /* ignore */ }
					// add change listener
					s.addEventListener('change', async (ev) => {
						const val = ev.target.value || 'en';
						this.preferredLang = val;
						try { localStorage.setItem('preferredLang', this.preferredLang); } catch (e) { /* ignore */ }
						// Load the new language dictionary
						await this.loadLanguageDictionary(val);
						// sync other selectors
						for (const o of selectors) {
							if (o !== ev.target) try { o.value = val; } catch (e) {}
						}
						console.log('Preferred language set to', this.preferredLang);
					});
				}
			}
		} catch (e) { /* ignore */ }
		this.updateGameState();

		// --- Build the Trie for pro-level AI word generation ---
		this.updateLoadingProgress('Preparing AI word search...');
		this.trie = new Trie();
		for (const word of this.activeDictionary) {
			this.trie.insert(word.toUpperCase());
		}

		// Show the game container now that initialization is complete
		const gameContainer = document.querySelector('.game-container');
		if (gameContainer) {
			gameContainer.style.transition = 'opacity 0.5s ease-in';
			gameContainer.style.opacity = '1';
			gameContainer.style.visibility = 'visible';
		}

	}

	showLoadingScreen() {
		// Create loading overlay
		const loadingOverlay = document.createElement('div');
		loadingOverlay.id = 'loading-overlay';
		loadingOverlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100vw;
			height: 100vh;
			background: linear-gradient(135deg, #1a237e 0%, #151d69 100%);
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			z-index: 9999;
			color: white;
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		`;

		// Loading spinner
		const spinner = document.createElement('div');
		spinner.style.cssText = `
			width: 60px;
			height: 60px;
			border: 4px solid rgba(255, 255, 255, 0.3);
			border-top: 4px solid white;
			border-radius: 50%;
			animation: spin 1s linear infinite;
			margin-bottom: 20px;
		`;

		// Loading text
		const loadingText = document.createElement('div');
		loadingText.id = 'loading-text';
		loadingText.style.cssText = `
			font-size: 18px;
			font-weight: 300;
			text-align: center;
			margin-bottom: 10px;
		`;
		loadingText.textContent = 'Loading Puzzle Game...';

		// Progress indicator
		const progressText = document.createElement('div');
		progressText.id = 'loading-progress';
		progressText.style.cssText = `
			font-size: 14px;
			opacity: 0.8;
			text-align: center;
		`;
		progressText.textContent = 'Loading dictionaries...';

		// Floating white tiles
		const tilesContainer = document.createElement('div');
		tilesContainer.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 1;
		`;

		// Create floating tiles
		const tileLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
		for (let i = 0; i < 12; i++) {
			const tile = document.createElement('div');
			tile.textContent = tileLetters[i % tileLetters.length];
			tile.style.cssText = `
				position: absolute;
				width: 32px;
				height: 32px;
				background: linear-gradient(145deg, #ffffff 70%, #f5f5f5 100%);
				border: 2px solid #e0e0e0;
				border-radius: 4px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 14px;
				font-weight: bold;
				color: #333;
				box-shadow: 0 4px 8px rgba(0,0,0,0.1);
				animation: floatTile ${3 + Math.random() * 2}s infinite ease-in-out;
				animation-delay: ${Math.random() * 2}s;
				left: ${10 + Math.random() * 80}vw;
				top: ${10 + Math.random() * 80}vh;
			`;
			tilesContainer.appendChild(tile);
		}

		// Add CSS animation for tiles
		const style = document.createElement('style');
		style.textContent = `
			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
			@keyframes floatTile {
				0%, 100% {
					transform: translateY(0px) rotate(0deg);
				}
				25% {
					transform: translateY(-15px) rotate(5deg);
				}
				50% {
					transform: translateY(-5px) rotate(-3deg);
				}
				75% {
					transform: translateY(-20px) rotate(2deg);
				}
			}
		`;
		document.head.appendChild(style);

		loadingOverlay.appendChild(tilesContainer);
		loadingOverlay.appendChild(spinner);
		loadingOverlay.appendChild(loadingText);
		loadingOverlay.appendChild(progressText);
		document.body.appendChild(loadingOverlay);

		// Make body hidden initially to prevent flash of unstyled content
		document.body.style.visibility = 'visible';
	}

	updateLoadingProgress(message) {
		const progressElement = document.getElementById('loading-progress');
		if (progressElement) {
			progressElement.textContent = message;
		}
	}

	hideLoadingScreen() {
		const loadingOverlay = document.getElementById('loading-overlay');
		if (loadingOverlay) {
			loadingOverlay.style.transition = 'opacity 0.5s ease-out';
			loadingOverlay.style.opacity = '0';
			setTimeout(() => {
				loadingOverlay.remove();
			}, 500);
		}
	}

	showErrorScreen(message) {
		const loadingOverlay = document.getElementById('loading-overlay');
		if (loadingOverlay) {
			const spinner = loadingOverlay.querySelector('div');
			const loadingText = document.getElementById('loading-text');
			const progressText = document.getElementById('loading-progress');

			if (spinner) spinner.style.display = 'none';
			if (loadingText) loadingText.textContent = 'Error Loading Game';
			if (progressText) progressText.textContent = message;

			// Add retry button
			const retryButton = document.createElement('button');
			retryButton.textContent = 'Retry';
			retryButton.style.cssText = `
				margin-top: 20px;
				padding: 10px 20px;
				background: white;
				color: #667eea;
				border: none;
				border-radius: 5px;
				cursor: pointer;
				font-size: 16px;
				font-weight: 500;
			`;
			retryButton.onclick = () => {
				location.reload();
			};

			loadingOverlay.appendChild(retryButton);
		}
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

				// Add drag and drop handlers for tile placement
				cell.addEventListener('dragover', (e) => {
					e.preventDefault();
					if (this.currentTurn !== "player") return;

					const tileData = JSON.parse(e.dataTransfer.getData('text/plain') || '{}');
					if (!tileData.tileId) return;

					// Check if this cell can accept the tile
					const row = parseInt(cell.dataset.row);
					const col = parseInt(cell.dataset.col);
					const canPlace = this.isValidPlacement(row, col, { id: tileData.tileId });

					if (canPlace) {
						e.dataTransfer.dropEffect = 'move';
						cell.classList.add('droppable-hover');
					} else {
						e.dataTransfer.dropEffect = 'none';
					}
				});

				cell.addEventListener('dragleave', (e) => {
					cell.classList.remove('droppable-hover');
				});

				cell.addEventListener('drop', (e) => {
					e.preventDefault();
					cell.classList.remove('droppable-hover');

					if (this.currentTurn !== "player") return;

					try {
						const tileData = JSON.parse(e.dataTransfer.getData('text/plain'));
						if (!tileData.tileId) return;

						const row = parseInt(cell.dataset.row);
						const col = parseInt(cell.dataset.col);

						// Find the tile in player's rack
						const rackIndex = this.playerRack.findIndex(t => t.id === tileData.tileId);
						if (rackIndex === -1) return;

						const tile = this.playerRack[rackIndex];

						// Check if placement is valid
						if (!this.isValidPlacement(row, col, tile)) return;

						// Remove any existing ghost tile in this cell so placed tile is sole tile
						const existingGhost = cell.querySelector('.ghost-tile');
						if (existingGhost) existingGhost.remove();

						// Place the tile
						this.placeTile(tile, row, col);

						// Remove from rack
						this.playerRack.splice(rackIndex, 1);

						// Update UI
						this.renderRack();
						this.highlightValidPlacements();

					} catch (error) {
						console.error('Drop handling error:', error);
					}
				});

				// Touch drop support for mobile
				let isTouchDropping = false;
				let touchTileData = null;

				cell.addEventListener('touchstart', (e) => {
					if (this.currentTurn !== "player") return;

					// Check if there's a tile being dragged
					const touch = e.touches[0];
					const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
					const draggedTile = elementAtPoint?.closest('.tile.dragging');

					if (draggedTile) {
						isTouchDropping = true;
						const tileId = draggedTile.dataset.id;
						const rackIndex = Array.from(document.querySelectorAll('#tile-rack .tile')).indexOf(draggedTile);
						touchTileData = { tileId, source: 'rack', rackIndex };
					}
				});

				cell.addEventListener('touchend', (e) => {
					if (!isTouchDropping || !touchTileData) {
						isTouchDropping = false;
						touchTileData = null;
						return;
					}

					try {
						const row = parseInt(cell.dataset.row);
						const col = parseInt(cell.dataset.col);

						// Find the tile in player's rack
						const rackIndex = this.playerRack.findIndex(t => t.id === touchTileData.tileId);
						if (rackIndex === -1) {
							isTouchDropping = false;
							touchTileData = null;
							return;
						}

						const tile = this.playerRack[rackIndex];

						// Check if placement is valid
						if (!this.isValidPlacement(row, col, tile)) {
							isTouchDropping = false;
							touchTileData = null;
							return;
						}

						// Remove any existing ghost tile in this cell so placed tile is sole tile
						const existingGhostTouch = cell.querySelector('.ghost-tile');
						if (existingGhostTouch) existingGhostTouch.remove();

						// Place the tile
						this.placeTile(tile, row, col);

						// Remove from rack
						this.playerRack.splice(rackIndex, 1);

						// Update UI
						this.renderRack();
						this.highlightValidPlacements();

					} catch (error) {
						console.error('Touch drop handling error:', error);
					}

					isTouchDropping = false;
					touchTileData = null;
				});

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
		this.updateLoadingProgress('Loading Mandarin dictionary...');
		try {
			// Try multiple backup dictionary sources (online + local)
			// Using Mandarin/Chinese word lists for Chinese language version
			const onlineUrls = [
				"https://raw.githubusercontent.com/pwxcoo/chinese-xinhua/main/data/词语.txt",
				"https://raw.githubusercontent.com/fxsjy/jieba/master/extra_dict/words.txt",
				"https://raw.githubusercontent.com/Yixuan-Wang/chinese-word-list/main/simplified_chinese_word_list.txt"
			];

			let loaded = false;
			let allTexts = [];

			// Load all sources IN PARALLEL for speed, and track their source names in the same order
			const fetchPromises = [];
			const fetchSources = [];

			// Fetch online sources
			for (const url of onlineUrls) {
				fetchPromises.push(
					fetch(url, { cache: 'no-store' })
						.then(response => {
							if (response && response.ok) {
								return response.text().then(t => {
									if (this.showAIDebug) console.log(`✓ Online dict: ${url.split('/').pop()} loaded`);
									return t;
								});
							}
							return null;
						})
						.catch(e => {
							if (this.showAIDebug) console.warn(`✗ Failed to load ${url}:`, e.message);
							return null;
						})
				);
				fetchSources.push(url.split('/').pop());
			}


			// Wait for ALL sources to load in parallel
			const results = await Promise.all(fetchPromises);
			allTexts = results.filter(t => t && t.length > 0);

			if (allTexts.length === 0) {
				throw new Error("All dictionary sources failed to load");
			}

			this.updateLoadingProgress(`Processing ${allTexts.length} dictionary sources...`);

			// Process the concatenated dictionary texts - aggregate unique words from all sources
			// Also track which source each word comes from
			let rawWords = [];
			const seenWords = new Set();
			const allWordSources = {}; // { word: [source filenames] }
			
			for (let sourceIdx = 0; sourceIdx < allTexts.length; sourceIdx++) {
				const t = allTexts[sourceIdx];
				const file = fetchSources[sourceIdx] || 'unknown_source';
				if (!t) continue;
				for (const line of t.split('\n')) {
					const w = (line || '').trim().toLowerCase();
					if (w) {
						// Initialize array if not exists
						if (typeof allWordSources[w] === 'undefined' || !Array.isArray(allWordSources[w])) {
							allWordSources[w] = [];
						}
						// Track source (as array)
						if (allWordSources[w].indexOf(file) === -1) {
							allWordSources[w].push(file);
						}
						
						// Add to raw words only if not seen
						if (!seenWords.has(w)) {
							seenWords.add(w);
							rawWords.push(w);
						}
					}
				}
			}

			// Validate words: only letters, reasonable length (NO vowel requirement - keeps "by", "my", "gym", etc)
			let validWords = rawWords.filter(word => {
				return /^[a-z]+$/.test(word) &&
					   word.length >= 2 &&
					   word.length <= 15;
				// REMOVED vowel requirement - was eliminating valid Scrabble words like "by", "my", "gym", "fly", "sky", "cwm"
			});

			console.log(`Filtered dictionary: ${rawWords.length} raw words -> ${validWords.length} valid words`);
			this.dictionary = new Set(validWords);
			// Keep a backupDictionary set containing all source words (unfiltered raw union)
			this.backupDictionary = new Set(Array.from(seenWords || []));
			// Store word sources for Tier 1 confidence scoring
			this.wordSources = allWordSources;
			
			// BUILD TIER 1: Extract high-confidence words from actual loaded dictionary
			// Prioritizes words from SOWPODS (most authoritative) and cross-validated words
			this.coreValidDictionary = this.buildTier1Dictionary(validWords, allWordSources);
			console.log(`Tier 1 Fast-Path built: ${this.coreValidDictionary.size} high-confidence words from actual dictionary (instant validation)`);
			
			console.log("Dictionary loaded successfully. Word count:", this.dictionary.size, "(combined sources:", this.backupDictionary.size, ")");
		} catch (error) {
			console.error("Error loading dictionary:", error);
			// If primary sources fail, use empty set - better than hardcoded list
			this.dictionary = new Set();
			this.backupDictionary = new Set();
			this.coreValidDictionary = new Set();
			console.warn("Using empty fallback dictionary - primary sources unavailable");
		}

		// Spanish dictionary will be loaded only when Spanish language is selected
	}

	async loadSpanishDictionary() {
		try {
			this.updateLoadingProgress('Loading Spanish dictionary...');
			const response = await fetch('./backup_dictionaries/SpanishDictionary/ES-wordlist.txt');
			if (!response.ok) {
				throw new Error(`Failed to load Spanish dictionary: ${response.status}`);
			}
			const text = await response.text();
			const words = text.split('\n').map(line => line.trim().toLowerCase()).filter(word => word.length > 0);

			// Filter valid words (only Spanish letters, reasonable length)
			const validWords = words.filter(word => {
				return /^[a-zñáéíóúü]+$/i.test(word) &&
					   word.length >= 2 &&
					   word.length <= 15;
			});

			this.spanishDictionary = new Set(validWords);

			// Create normalized versions for matching (remove accents, keep ñ)
			this.spanishDictionaryNormalized = new Set();
			this.spanishNormalizedMap = {}; // normalized -> original

			for (const word of validWords) {
				const normalized = normalizeWordForDict(word);
				this.spanishDictionaryNormalized.add(normalized.toLowerCase());
				// Map normalized back to original with accents
				if (!this.spanishNormalizedMap[normalized.toUpperCase()]) {
					this.spanishNormalizedMap[normalized.toUpperCase()] = word.toUpperCase();
				}
			}

			console.log(`Spanish dictionary loaded: ${this.spanishDictionary.size} words (${this.spanishDictionaryNormalized.size} normalized)`);
		} catch (error) {
			console.error("Error loading Spanish dictionary:", error);
			this.spanishDictionary = new Set();
			this.spanishDictionaryNormalized = new Set();
			this.spanishNormalizedMap = {};
		}
	}

	async loadFrenchDictionary() {
		try {
			this.updateLoadingProgress('Loading French dictionary...');
			const response = await fetch('./backup_dictionaries/FrenchDictionary/FR-wordlist.txt');
			if (!response.ok) {
				throw new Error(`Failed to load French dictionary: ${response.status}`);
			}
			const text = await response.text();
			const words = text.split('\n').map(line => line.trim().toLowerCase()).filter(word => word.length > 0);

			// Filter valid words (French letters including accents, reasonable length)
			const validWords = words.filter(word => {
				return /^[a-zàâäéèêëïîôöùûüÿç]+$/i.test(word) &&
					   word.length >= 2 &&
					   word.length <= 15;
			});

			this.frenchDictionary = new Set(validWords);
			console.log(`French dictionary loaded: ${this.frenchDictionary.size} words`);
		} catch (error) {
			console.error("Error loading French dictionary:", error);
			this.frenchDictionary = new Set();
		}
	}

	async loadMandarinDictionary() {
		try {
			this.updateLoadingProgress('Loading Mandarin dictionary...');
			const response = await fetch('./backup_dictionaries/MandarinDictionary/ZH-wordlist.txt');
			if (!response.ok) {
				throw new Error(`Failed to load Mandarin dictionary: ${response.status}`);
			}
			const text = await response.text();
			const lines = text.split('\n').filter(line => line.trim() && !line.startsWith('#'));

			// Parse CC-CEDICT format: "traditional simplified [pinyin] /definition/"
			const words = [];
			for (const line of lines) {
				const match = line.match(/^([^ ]+) ([^ ]+)/);
				if (match) {
					const simplified = match[2]; // Use simplified Chinese
					// Filter for reasonable length Chinese words
					if (simplified.length >= 1 && simplified.length <= 8 && /^[\u4e00-\u9fff]+$/.test(simplified)) {
						words.push(simplified);
					}
				}
			}

			// Limit to reasonable Scrabble dictionary size for Chinese characters
			const limitedWords = words.slice(0, 30000); // Chinese Scrabble typically has fewer words

			this.mandarinDictionary = new Set(limitedWords);
			console.log(`Mandarin Scrabble dictionary loaded: ${this.mandarinDictionary.size} words from CC-CEDICT`);
		} catch (error) {
			console.error("Error loading Mandarin dictionary:", error);
			this.mandarinDictionary = new Set();
		}
	}

	buildTier1Dictionary(validWords, wordSources = {}) {
		// Build Tier 1 with confidence scoring
		// Only include HIGH-CONFIDENCE words (real, legitimate, Google-able)
		// Prioritizes SOWPODS (authoritative Scrabble dict) and cross-validated words
		
		const tier1 = new Set();
		
		// Priority 1: Words from SOWPODS (most authoritative source)
		for (const word of validWords) {
			const sources = wordSources[word];
			if (sources && Array.isArray(sources) && sources.includes('/SOWPODS.txt')) {
				tier1.add(word.toLowerCase());
			}
		}
		
		// Priority 2: Words that appear in MULTIPLE sources (cross-validated = high confidence)
		for (const word of validWords) {
			const sources = wordSources[word] || [];
			// For two-letter words we must be stricter to avoid abbreviations slipping in.
			// Require either SOWPODS (authoritative) or presence in at least 3 independent sources.
			if (word.length === 2) {
				if (Array.isArray(sources) && (sources.includes('/SOWPODS.txt') || sources.length >= 3)) {
					tier1.add(word.toLowerCase());
				}
				continue;
			}
			// For longer words, two sources is sufficient for cross-validation
			if (Array.isArray(sources) && sources.length >= 2) {
				tier1.add(word.toLowerCase());
			}
		}
		
		return tier1;
	}

	async expandDictionaryWithTranslations(existingWords) {
		// Use Google Translate API to translate common English Scrabble words to Spanish
		const translatedWords = [];

		try {
			// Get common words from the actual English dictionary instead of hardcoded list
			const englishWords = Array.from(this.dictionary || []).filter(word =>
				word.length >= 3 && word.length <= 8 && // Focus on common word lengths
				/^[a-z]+$/i.test(word) // Only basic English letters
			);

			// Filter out words we already have in Spanish
			const existingSet = new Set(existingWords.map(w => w.toLowerCase()));
			const wordsToTranslate = englishWords.slice(0, 100).filter(word => // Limit to first 100 for API efficiency
				!existingSet.has(word.toLowerCase())
			);

			// Translate in batches to avoid API limits
			const batchSize = 10;
			for (let i = 0; i < wordsToTranslate.length; i += batchSize) {
				const batch = wordsToTranslate.slice(i, i + batchSize);
				try {
					const translations = await this.translateBatchToSpanish(batch);
					for (const translated of translations) {
						if (translated &&
							translated.length >= 2 &&
							translated.length <= 15 &&
							/^[a-zñáéíóúü]+$/i.test(translated) && // Only Spanish letters
							!existingSet.has(translated.toLowerCase())) {
							translatedWords.push(translated);
							existingSet.add(translated.toLowerCase());
						}
					}
				} catch (e) {
					console.warn('Batch translation failed:', e);
					// Continue with next batch
				}

				// Small delay to respect API limits
				if (i + batchSize < wordsToTranslate.length) {
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			}

		} catch (error) {
			console.warn('Translation expansion failed:', error);
		}

		return translatedWords;
	}

	async translateBatchToSpanish(englishWords) {
		// Use Google Translate API through Netlify function
		try {
			const response = await fetch('/.netlify/functions/translate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: englishWords.join('\n'),
					source: 'en',
					target: 'es'
				})
			});

			if (!response.ok) {
				throw new Error(`Translation API returned ${response.status}`);
			}

			const data = await response.json();
			const translatedText = data.translatedText || data.translation || '';

			// Split by newlines and clean up
			return translatedText.split('\n')
				.map(word => word.trim().toLowerCase())
				.filter(word => word.length > 0);

		} catch (error) {
			console.warn('Google Translate API call failed:', error);
			// Fallback: return empty array
			return [];
		}
	}

	async loadLanguageDictionary(lang) {
		const langNames = {
			'en': 'English',
			'es': 'Spanish',
			'zh': 'Mandarin',
			'fr': 'French',
			'hi': 'Hindi'
		};
		this.updateLoadingProgress(`Setting up ${langNames[lang] || 'English'} language...`);

		// Load language-specific dictionaries only when needed
		if (lang === 'es' && (!this.spanishDictionaryNormalized || this.spanishDictionaryNormalized.size === 0)) {
			this.updateLoadingProgress('Loading Spanish dictionary...');
			await this.loadSpanishDictionary();
		} else if (lang === 'fr' && (!this.frenchDictionary || this.frenchDictionary.size === 0)) {
			this.updateLoadingProgress('Loading French dictionary...');
			await this.loadFrenchDictionary();
		} else if (lang === 'zh' && (!this.mandarinDictionary || this.mandarinDictionary.size === 0)) {
			this.updateLoadingProgress('Loading Mandarin dictionary...');
			await this.loadMandarinDictionary();
		}

		// Set activeDictionary to the appropriate language dictionary
		if (lang === 'es') {
			// For Spanish, use ONLY Spanish dictionary
			// Use normalized Spanish dictionary for matching (tiles are ASCII letters)
			this.activeDictionary = new Set(this.spanishDictionaryNormalized);
		} else if (lang === 'fr') {
			// For French, use French dictionary
			this.activeDictionary = new Set(this.frenchDictionary);
		} else if (lang === 'zh') {
			// For Mandarin, use Mandarin dictionary
			this.activeDictionary = new Set(this.mandarinDictionary);
		} else {
			// For other languages, use English dictionary (can be extended later)
			this.activeDictionary = new Set(this.dictionary);
		}

		// Rebuild the Trie with the active dictionary
		this.trie = new Trie();
		for (const word of this.activeDictionary) {
			this.trie.insert(word.toUpperCase());
		}

		console.log(`Language set to ${lang}. Dictionary size: ${this.activeDictionary.size}`);
		this.updateLoadingProgress(`Language set to ${langNames[lang] || 'English'}. Dictionary ready.`);

		// Regenerate tile bag with correct letter distribution for the language
		this.generateTileBag();

		// Return existing rack tiles to bag and redraw new ones
		const existingPlayerTiles = [...this.playerRack];
		const existingAITiles = [...this.aiRack];

		// Return tiles to bag
		this.tiles.push(...existingPlayerTiles);
		this.tiles.push(...existingAITiles);

		// Clear racks
		this.playerRack = [];
		this.aiRack = [];

		// Redraw racks with new language tiles
		this.fillRacks();
		this.renderRack();
		this.renderAIRack();

		// Update UI language
		this.updateUILanguage(lang);

		// Restart hints in new language
		if (this.hintInterval) {
			clearInterval(this.hintInterval);
		}
		this.initializeHints();
	}

	updateUILanguage(lang) {
		const t = (key) => getTranslation(key, lang);
		
		// Update button text
		const buttons = {
			'play-word': t('submit'),
			'play-word-desktop': t('submit'),
			'play-word-desktop-drawer': t('submit'),
			'play-word-mobile': t('submit'),
			'play-word-desktop-bottom': t('submit'),
			'shuffle-rack': t('shuffleRack'),
			'shuffle-rack-desktop': t('shuffleRack'),
			'shuffle-rack-desktop-drawer': t('shuffleRack'),
			'skip-turn': t('skipTurn'),
			'skip-turn-desktop': t('skipTurn'),
			'skip-turn-desktop-drawer': t('skipTurn'),
			'show-instructions': t('howToPlay'),
			'show-instructions-desktop': t('howToPlay'),
			'show-instructions-desktop-drawer': t('howToPlay'),
			'quit-game': t('quitGame'),
			'quit-game-desktop': t('quitGame'),
			'quit-game-desktop-drawer': t('quitGame')
		};
		
		for (const [id, text] of Object.entries(buttons)) {
			const btn = document.getElementById(id);
			if (btn) btn.textContent = text;
		}
		
		// Update all elements with data-translate attribute
		document.querySelectorAll('[data-translate]').forEach(el => {
			const key = el.getAttribute('data-translate');
			el.textContent = t(key);
		});
		
		// Update fixed text headers
		const gameInfoHeaders = document.querySelectorAll('[id*="info-panel"] h2');
		gameInfoHeaders.forEach(h => h.textContent = t('gameInfo'));
		
		// Update "How to Play" sections
		const drawerInstructionHeaders = document.querySelectorAll('[id*="drawer-instructions"] h3:first-of-type');
		drawerInstructionHeaders.forEach(h => {
			if (h.textContent.includes('How to Play') || h.textContent.includes('Cómo Jugar') || h.textContent.includes('Comment Jouer') || h.textContent.includes('如何玩')) {
				h.textContent = t('howToPlayTitle');
			}
		});
		
		// Update notification text
		const notices = {
			'landscape-notice': t('landscape'),
			'scroll-notice': t('scroll'),
			'instruction-notice': t('instructions')
		};
		
		for (const [className, text] of Object.entries(notices)) {
			const notice = document.querySelector(`.${className}`);
			if (notice) {
				// Find the text node and update it, preserving the emoji and close button
				const parts = notice.innerHTML.split('<button');
				const emoji = parts[0].match(/<span class="notice-icon">.*?<\/span>/)?.[0] || '';
				const button = parts[1] ? '<button' + parts[1] : '';
				notice.innerHTML = `${emoji} ${text} ${button}`;
			}
		}
		
		// Update instruction content paragraphs
		this.updateInstructionContent(lang);
	}

	updateInstructionContent(lang) {
		const t = (key) => getTranslation(key, lang);
		
		// Update all drawer instruction sections
		document.querySelectorAll('[id*="drawer-instructions"]').forEach(section => {
			const html = `
				<h3>${t('howToPlayTitle')}</h3>
				<p>1. ${t('playingTiles')}</p>
				<ul>
					<li>${t('desktopTiles')}</li>
					<li>${t('mobileTiles')}</li>
					<li>${t('removeTiles')}</li>
				</ul>
				<p>2. ${t('creatingWords')}</p>
				<ul>
					<li>${t('horizontalVertical')}</li>
					<li>${t('centerStar')}</li>
					<li>${t('connectExisting')}</li>
					<li>${t('validWords')}</li>
				</ul>
				<p>3. ${t('submittingMove')}</p>
				<ul>
					<li>${t('afterPlacing')}</li>
					<li>${t('invalidWords')}</li>
					<li>${t('pointsCalculated')}</li>
				</ul>
				<p>4. ${t('exchangingTiles')}</p>
				<ul>
					<li>${t('activateExchange')}</li>
					<li>${t('dragUnwanted')}</li>
					<li>${t('receiveNewTiles')}</li>
					<li>${t('countsAsTurn')}</li>
				</ul>
				<p>5. ${t('skippingGameEnd')}</p>
				<ul>
					<li>${t('useSkipTurn')}</li>
					<li>${t('gameEnds')}</li>
					<li>${t('scoreBased')}</li>
				</ul>
			`;
			section.innerHTML = html;
		});
	}

	balanceAIRack() {
		const vowels = ['A', 'E', 'I', 'O', 'U'];
		const vowelCount = this.aiRack.filter(tile => vowels.includes(tile.letter)).length;

		// Aim for 2-3 vowels in the rack
		if (vowelCount < 2 || vowelCount > 4) {
			const desiredVowelCount = 3;
			while (this.tiles.length > 0 &&
				this.aiRack.filter(tile => vowels.includes(tile.letter)).length !== desiredVowelCount) {

				// Remove excess vowels or consonants
				const indexToRemove = this.aiRack.findIndex(tile =>
					vowelCount > 3 ? vowels.includes(tile.letter) : !vowels.includes(tile.letter)
				);

				if (indexToRemove !== -1) {
					this.tiles.push(this.aiRack.splice(indexToRemove, 1)[0]);

					// Add needed vowel or consonant
					const neededType = vowelCount < 2 ? vowels : ['R', 'S', 'T', 'L', 'N']; // Common consonants

					const tileIndex = this.tiles.findIndex(t => neededType.includes(t.letter));
					if (tileIndex !== -1) {
						this.aiRack.push(this.tiles.splice(tileIndex, 1)[0]);
					} else {
						this.aiRack.push(this.tiles.pop());
					}
				}
			}
		}
	}

	renderRack() {
		const rack = document.getElementById("tile-rack");
		rack.innerHTML = "";

		this.playerRack.forEach((tile, index) => {
			const tileElement = this.createTileElement(tile, index);
			// Make tiles draggable only during player's turn
			tileElement.draggable = (this.currentTurn === "player");
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
                    ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
                `;

		// Add drag functionality
		tileElement.addEventListener('dragstart', (e) => {
			// Only allow dragging during player's turn
			if (this.currentTurn !== "player") {
				e.preventDefault();
				return;
			}

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', JSON.stringify({
				tileId: tile.id,
				source: 'rack',
				rackIndex: index
			}));

			tileElement.classList.add('dragging');
			this.highlightValidPlacements();
		});

		tileElement.addEventListener('dragend', (e) => {
			tileElement.classList.remove('dragging');
			this.highlightValidPlacements();
		});

		// Touch events for mobile drag support
		let touchStartX = 0;
		let touchStartY = 0;
		let isDragging = false;

		tileElement.addEventListener('touchstart', (e) => {
			if (this.currentTurn !== "player") return;

			const touch = e.touches[0];
			touchStartX = touch.clientX;
			touchStartY = touch.clientY;

			// Add visual feedback for touch
			tileElement.classList.add('touch-active');
		});

		tileElement.addEventListener('touchmove', (e) => {
			if (this.currentTurn !== "player") return;

			const touch = e.touches[0];
			const deltaX = Math.abs(touch.clientX - touchStartX);
			const deltaY = Math.abs(touch.clientY - touchStartY);

			// Start dragging if moved enough
			if (!isDragging && (deltaX > 10 || deltaY > 10)) {
				isDragging = true;
				tileElement.classList.add('dragging');
				this.highlightValidPlacements();
			}

			if (isDragging) {
				e.preventDefault(); // Prevent scrolling
			}
		});

		tileElement.addEventListener('touchend', (e) => {
			tileElement.classList.remove('touch-active');
			if (isDragging) {
				tileElement.classList.remove('dragging');
				this.highlightValidPlacements();
			}
			isDragging = false;
		});

		return tileElement;
	}



	isValidPlacement(row, col, tile) {
		console.log("Checking placement validity:", {
			row,
			col,
			tile
		});

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

	async placeTile(tile, row, col) {
		if (this.board[row][col]) {
			alert("This cell is already occupied!");
			return;
		}

		const cell = document.querySelector(
			`[data-row="${row}"][data-col="${col}"]`,
		);
		const tileIndex = this.playerRack.indexOf(tile);

		// Remove only existing tile element, not the center star or other decorations
		const existingTile = cell.querySelector('.tile');
		if (existingTile) existingTile.remove();

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
				button.addEventListener("click", async () => {
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

					// Create and add the tile element (NO draggable, NO drag events)
					const tileElement = document.createElement("div");
					tileElement.className = "tile";
					tileElement.dataset.index = tileIndex;
					tileElement.dataset.id = tile.id;
					tileElement.innerHTML = `
						${selectedLetter}
						<span class="points">0</span>
						<span class="blank-indicator">★</span>
					`;

					// Remove only the tile, not the star
					const existingTile = cell.querySelector('.tile');
					if (existingTile) existingTile.remove();
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

					// --- Show live AI ghost move if valid ---
					await this.updateGhostPreview();
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

			const tileElement = document.createElement("div");
			tileElement.className = "tile";
			tileElement.dataset.index = tileIndex;
			tileElement.dataset.id = tile.id;
			tileElement.innerHTML = `
				${tile.letter}
				<span class="points">${placedTile.value}</span>
			`;

			// Remove only the tile, not the star
			const existingTile = cell.querySelector('.tile');
			if (existingTile) existingTile.remove();
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

			// --- Show AI ghost move if player's move is valid (should remove ghost if nothing is valid) ---
		}
		await this.updateGhostPreview();
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

	async resetPlacedTiles() {
        this.placedTiles.forEach(({ tile, row, col }) => {
            this.board[row][col] = null;
            const cell = document.querySelector(
                `[data-row="${row}"][data-col="${col}"]`
            );
            cell.innerHTML = "";

            // If this was a wild tile, reset its letter back to *
            if (tile && tile.originalLetter === "*") {
                tile.letter = "*";
                tile.score = 0;
            }

            // Always restore the center star if this is the center cell and it's empty
            if (row === 7 && col === 7) {
                const existingStar = cell.querySelector('.center-star');
                if (!existingStar && !cell.querySelector('.tile')) {
                    const centerStar = document.createElement("span");
                    centerStar.textContent = "⚜";
                    centerStar.className = "center-star";
                    cell.appendChild(centerStar);
                }
            }

            // --- Always restore as a blank tile if it was a blank, regardless of its current letter ---
            if (tile.isBlank || tile.letter === "*") {
                this.playerRack.push({
                    letter: "*",
                    value: 0,
                    id: tile.id
                });
            } else {
                this.playerRack.push(tile);
            }
        });

        this.placedTiles = [];
        this.renderRack();

        // Remove ghost tiles when resetting
        await this.updateGhostPreview();
    }

    // Context-aware word validation with detailed results
    async validateWordInContext(word, wordInfo, isMainWord) {
        const upperWord = word.toUpperCase();
        const cacheKey = `validation_${this.preferredLang || 'en'}_${word.toLowerCase()}`;

        // Check cache first (fastest)
        if (this.validationCache && this.validationCache[cacheKey] !== undefined) {
            const cached = this.validationCache[cacheKey];
            return {
                isValid: cached,
                confidence: cached ? 90 : 0,
                reason: cached ? 'Cached: valid' : 'Cached: invalid',
                layer: 'cache'
            };
        }

        // Layer 1: Basic validation (fastest)
        if (!this.isBasicValidForLanguage(upperWord, this.preferredLang || 'en')) {
            const result = { isValid: false, confidence: 0, reason: 'Invalid characters or pattern', layer: 'basic' };
            // Cache negative results too
            if (!this.validationCache) this.validationCache = {};
            this.validationCache[cacheKey] = false;
            return result;
        }

        // Layer 2: Local dictionary check
        let foundInDictionary = false;
        if (this.preferredLang === 'es') {
            // For Spanish, normalize accented characters to match normalized dictionary
            const normalized = normalizeWordForDict(word).toLowerCase();
            foundInDictionary = this.activeDictionary.has(normalized);
        } else {
            foundInDictionary = this.activeDictionary.has(word);
        }

        if (foundInDictionary) {
            const result = { isValid: true, confidence: 95, reason: 'Found in local dictionary', layer: 'local' };
            // Cache positive results
            if (!this.validationCache) this.validationCache = {};
            this.validationCache[cacheKey] = true;
            return result;
        }

        // Layer 3: API validation (slowest, most accurate) - with timeout
        try {
            const lang = this.preferredLang || 'en';
            let apiValid = false;
            let apiConfidence = 0;

            if (lang === 'es') {
                // Add timeout to prevent hanging
                const validationPromise = this.validateSpanishWordWithGoogle(upperWord);
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Validation timeout')), 5000)
                );
                
                try {
                    const result = await Promise.race([validationPromise, timeoutPromise]);
                    apiValid = result;
                    apiConfidence = result ? 90 : 0;
                } catch (timeoutError) {
                    // Timeout - fallback to basic validation
                    if (this.showAIDebug) console.warn(`Validation timeout for ${word}, using fallback`);
                    const basicValid = this.couldBeValidSpanishWord(upperWord);
                    apiValid = basicValid;
                    apiConfidence = basicValid ? 60 : 0;
                }
            } else if (lang === 'en') {
                // For English, prioritize speed - check dictionary first, then API
                if (this.activeDictionary.has(word)) {
                    // Word is in dictionary - high confidence, skip slow API validation
                    apiValid = true;
                    apiConfidence = 95; // Very high confidence for dictionary match
                } else {
                    // Word not in dictionary - use API validation with shorter timeout
                    const validationPromise = this.validateEnglishWordWithGoogle(upperWord);
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Validation timeout')), 2000) // Reduced timeout
                    );

                    try {
                        const result = await Promise.race([validationPromise, timeoutPromise]);
                        apiValid = result.isValid;
                        apiConfidence = result.confidence;
                    } catch (timeoutError) {
                        // Timeout - fallback to basic validation only
                        if (this.showAIDebug) console.warn(`English validation timeout for ${word}, using basic fallback`);
                        const basicValid = this.isBasicValidForLanguage(upperWord, lang);
                        apiValid = basicValid;
                        apiConfidence = basicValid ? 40 : 0; // Lower confidence for fallback
                    }
                }
            } else {
                // For other languages, use basic validation
                apiValid = this.isBasicValidForLanguage(upperWord, lang);
                apiConfidence = apiValid ? 70 : 0;
            }

            // Context bonus: Main words get higher confidence
            if (apiValid && isMainWord) {
                apiConfidence += 5;
            }

            // Cache API results
            if (!this.validationCache) this.validationCache = {};
            this.validationCache[cacheKey] = apiValid;

            return {
                isValid: apiValid,
                confidence: Math.min(100, apiConfidence),
                reason: apiValid ? 'API validated' : 'API rejected',
                layer: 'api'
            };

        } catch (error) {
            if (this.showAIDebug) console.warn(`API validation failed for ${word}:`, error);
            // Fallback to basic validation
            const basicValid = this.couldBeValidSpanishWord(upperWord);
            const result = {
                isValid: basicValid,
                confidence: basicValid ? 60 : 0,
                reason: 'API failed, using basic validation',
                layer: 'fallback'
            };
            // Cache fallback results
            if (!this.validationCache) this.validationCache = {};
            this.validationCache[cacheKey] = basicValid;
            return result;
        }
    }

    async validateWord() {
        if (this.placedTiles.length === 0) return false;

        // Check if tiles are properly connected (same row/col, no gaps)
        if (!this.areTilesConnected()) return false;

        // --- NEW: Ensure at least one placed tile is adjacent to or touching an existing tile (except first move) ---
        if (!this.isFirstMove) {
            const touchesExisting = this.placedTiles.some(({ row, col }) => {
                // Check all 4 directions for an existing tile
                const directions = [
                    [-1, 0], [1, 0], [0, -1], [0, 1]
                ];
                return directions.some(([dx, dy]) => {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    return (
                        newRow >= 0 &&
                        newRow < 15 &&
                        newCol >= 0 &&
                        newCol < 15 &&
                        this.board[newRow][newCol] !== null &&
                        // Make sure it's not one of the newly placed tiles
                        !this.placedTiles.some(t => t.row === newRow && t.col === newCol)
                    );
                });
            });
            if (!touchesExisting) {
                console.log("Placed tiles are not connected to any existing word.");
                return false;
            }
        }

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

        // Enhanced context-aware validation for each word
        let allWordsValid = true;
        let validationResults = [];

        for (const wordInfo of formedWords) {
            const word = wordInfo.word.toLowerCase();
            const isMainWord = wordInfo.direction !== undefined; // Main words have direction

            // Multi-layer validation pipeline
            const validationResult = await this.validateWordInContext(word, wordInfo, isMainWord);

				// Enforce rule for PLAYER moves: if the validationResult came from the
				// remote API (layer === 'api'), only accept it for player submissions
				// when the word also appears in a local source (one of the loaded
				// dictionaries or tracked `wordSources`). This avoids API-only
				// false-positives while still allowing API+local corroboration.
				if (validationResult.layer === 'api') {
					const wordLower = word.toLowerCase();
					const inAnyLocal = (this.activeDictionary && this.activeDictionary.has(wordLower)) ||
									   (this.dictionary && this.dictionary.has(wordLower)) ||
									   (this.backupDictionary && this.backupDictionary.has(wordLower)) ||
									   (this.coreValidDictionary && this.coreValidDictionary.has(wordLower));
					const inWordSources = this.wordSources && this.wordSources[wordLower] && this.wordSources[wordLower].length > 0;

					if (!(inAnyLocal || inWordSources)) {
						// Downgrade API-only acceptance for player moves
						validationResult.isValid = false;
						validationResult.reason = 'Rejected: API-only result not corroborated by local sources';
					} else {
						// API validated and at least one local source references the word
						validationResult.reason = (validationResult.reason || '') + ' (API + local source)';
						validationResult.isValid = true;
					}
				}

            validationResults.push({
                word: wordInfo.word,
                ...validationResult
            });

            if (!validationResult.isValid) {
                console.log(`❌ Invalid word: ${wordInfo.word} (${validationResult.reason})`);

                // Generate suggestions for invalid words
                const suggestions = await this.getWordSuggestions(wordInfo.word, this.preferredLang || 'en');
                if (suggestions.length > 0) {
                    console.log(`💡 Suggestions for "${wordInfo.word}": ${suggestions.map(s => `${s.word}(${s.confidence}%)`).join(', ')}`);
                    validationResult.suggestions = suggestions;
                }

                allWordsValid = false;
            } else {
                console.log(`✅ Valid word: ${wordInfo.word} (confidence: ${validationResult.confidence}%)`);
            }
        }

        // Log validation summary
        console.log(`Validation summary: ${validationResults.filter(r => r.isValid).length}/${formedWords.length} words valid`);

        // First move must use center square
        if (this.isFirstMove) {
            // At least one placed tile must be on the center
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
					if (word.length > 1 && containsNewTile) {
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
			if (word.length > 1 && containsNewTile) {
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
					if (word.length > 1 && containsNewTile) {
						words.add({
							word,
							startPos: {
								row: startRow,
								col
							},
							direction: "vertical",
						});
					}
					word = "";
					startRow = row + 1;
					containsNewTile = false;
				}
			}
			if (word.length > 1 && containsNewTile) {
				words.add({
					word,
					startPos: {
						row: startRow,
						col
					},
					direction: "vertical",
				});
			}
		}

		console.debug("Existing words:", Array.from(existingWords));
		console.debug(
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
			return verticalWord.length > horizontalWord.length ?
				verticalWord :
				horizontalWord;
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

    // Get all formed words (main word + perpendicular words + modified words)
    const formedWords = this.getFormedWords();

    // Only score words that have NOT been played before
    formedWords.forEach((wordInfo) => {
        let wordScore = 0;
        let wordMultiplier = 1;
        const { word, startPos, direction } = wordInfo;

        // Prevent scoring for words already played
        const wordUpper = word.toUpperCase();
        let existedBefore = false;
        if (this.previousBoard) {
            // Scan previous board for this word horizontally and vertically
            for (let r = 0; r < 15; r++) {
                let hWord = "";
                for (let c = 0; c < 15; c++) {
                    if (this.previousBoard[r][c]) {
                        hWord += this.previousBoard[r][c].letter;
                    } else {
                        if (hWord === wordUpper) existedBefore = true;
                        hWord = "";
                    }
                }
                if (hWord === wordUpper) existedBefore = true;
            }
            for (let c = 0; c < 15; c++) {
                let vWord = "";
                for (let r = 0; r < 15; r++) {
                    if (this.previousBoard[r][c]) {
                        vWord += this.previousBoard[r][c].letter;
                    } else {
                        if (vWord === wordUpper) existedBefore = true;
                        vWord = "";
                    }
                }
                if (vWord === wordUpper) existedBefore = true;
            }
        }
        if (this.wordsPlayed && this.wordsPlayed.has(wordUpper) || existedBefore) {
            return;
        }


		// Build set of newly placed tiles for scoring rules
		this._scoringNewlyPlacedSet = new Set((this.placedTiles || []).map(t => `${t.row},${t.col}`));
		try {
			const computed = this.calculateWordScore(word, startPos.row, startPos.col, direction === 'horizontal');
			wordScore = computed;
			// Add to total score
			totalScore += wordScore;
		} finally {
			// clear temporary set
			this._scoringNewlyPlacedSet = null;
		}

        // Store word and its score for display
        words.add(
            JSON.stringify({
                word: word,
                score: wordScore,
            }),
        );
    });

    // --- BINGO BONUS: Award 50 points for each 7- or 8-letter word played ---
	// --- BINGO BONUS: Award 50 points for any word of 7 or more letters ---
	formedWords.forEach(wordInfo => {
		const len = wordInfo.word.length;
		if (len >= 7 && !(this.wordsPlayed && this.wordsPlayed.has(wordInfo.word.toUpperCase()))) {
			totalScore += 50;
		}
	});

    // After scoring, add all formed words to wordsPlayed set
    if (this.wordsPlayed) {
        formedWords.forEach(w => this.wordsPlayed.add(w.word.toUpperCase()));
    }

	// Store last scored words (array of {word, score}) for callers to use in move history
	try {
		this._lastScoredWords = Array.from(words).map(s => JSON.parse(s));
	} catch (e) {
		// If something unexpected happened, fallback to formedWords with null scores
		this._lastScoredWords = formedWords.map(f => ({ word: f.word, score: null }));
	}

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
						return {
							startRow: row,
							startCol: col,
							isHorizontal: true
						};
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
						return {
							startRow: row,
							startCol: col,
							isHorizontal: false
						};
					}
				}
			}
		}
		return null;
	}

	createsVulnerablePosition(word, row, col, isHorizontal) {
		// Check for vulnerable premium square exposure
		const vulnerabilityScore = this.calculateVulnerabilityScore(
			word,
			row,
			col,
			isHorizontal,
		);

		// Consider a position vulnerable if it exceeds threshold
		const VULNERABILITY_THRESHOLD = 30;

		return vulnerabilityScore > VULNERABILITY_THRESHOLD;
	}

	calculateVulnerabilityScore(word, row, col, isHorizontal) {
		let vulnerabilityScore = 0;

		// Check each position adjacent to the word
		for (let i = 0; i < word.length; i++) {
			const currentRow = isHorizontal ? row : row + i;
			const currentCol = isHorizontal ? col + i : col;

			// Check perpendicular adjacent positions
			const adjacentPositions = isHorizontal ? [
				[currentRow - 1, currentCol],
				[currentRow + 1, currentCol],
			] : [
				[currentRow, currentCol - 1],
				[currentRow, currentCol + 1],
			];

			for (const [adjRow, adjCol] of adjacentPositions) {
				if (!this.isValidPosition(adjRow, adjCol)) continue;

				// Higher vulnerability near premium squares
				const premium = this.getPremiumSquareType(adjRow, adjCol);
				if (premium === "tw") vulnerabilityScore += 15;
				if (premium === "dw") vulnerabilityScore += 10;
				if (premium === "tl") vulnerabilityScore += 8;
				if (premium === "dl") vulnerabilityScore += 5;

				// Check if position enables easy high-scoring plays
				if (this.enablesHighScoringPlay(adjRow, adjCol)) {
					vulnerabilityScore += 12;
				}

				// Penalty for exposing edges that enable long word placement
				if (this.createsEdgeVulnerability(adjRow, adjCol)) {
					vulnerabilityScore += 8;
				}
			}
		}

		return vulnerabilityScore;
	}

	enablesHighScoringPlay(row, col) {
		// Check if position could enable opponent to make high-scoring play

		// Check for adjacent premium squares
		const hasNearbyPremium = this.hasAdjacentPremiumSquares(row, col);

		// Check for potential long word placement
		const potentialLength = this.getMaxPossibleWordLength(row, col);

		// Check for cross-word opportunities
		const crossWordPotential =
			this.evaluateCrossWordPotential("", row, col, true) > 1;

		return hasNearbyPremium || potentialLength >= 6 || crossWordPotential;
	}

	hasAdjacentPremiumSquares(row, col) {
		const directions = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1],
		];

		for (const [dx, dy] of directions) {
			const newRow = row + dx;
			const newCol = col + dy;

			if (this.isValidPosition(newRow, newCol)) {
				const premium = this.getPremiumSquareType(newRow, newCol);
				if (premium) return true;
			}
		}

		return false;
	}

	createsEdgeVulnerability(row, col) {
		// Check if position is near edge and creates opportunity for opponent
		const isEdge = row <= 1 || row >= 13 || col <= 1 || col >= 13;

		if (!isEdge) return false;

		// Check if there's enough space for a long word
		const horizontalSpace = this.getHorizontalSpace(row, col);
		const verticalSpace = this.getVerticalSpace(row, col);

		return horizontalSpace >= 5 || verticalSpace >= 5;
	}

	getHorizontalSpace(row, col) {
		let space = 1;
		let currentCol = col - 1;

		// Check left
		while (currentCol >= 0 && !this.board[row][currentCol]) {
			space++;
			currentCol--;
		}

		// Check right
		currentCol = col + 1;
		while (currentCol < 15 && !this.board[row][currentCol]) {
			space++;
			currentCol++;
		}

		return space;
	}

	getVerticalSpace(row, col) {
		let space = 1;
		let currentRow = row - 1;

		// Check up
		while (currentRow >= 0 && !this.board[currentRow][col]) {
			space++;
			currentRow--;
		}

		// Check down
		currentRow = row + 1;
		while (currentRow < 15 && !this.board[currentRow][col]) {
			space++;
			currentRow++;
		}

		return space;
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

	countPremiumSquaresUsed(row, col, horizontal, word) {
		let count = 0;
		const premiumTypes = ["tw", "dw", "tl", "dl"];

		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Only count premium squares that aren't already used
			if (!this.board[currentRow][currentCol]) {
				const premium = this.getPremiumSquareType(currentRow, currentCol);
				if (premiumTypes.includes(premium)) {
					count++;
				}
			}
		}

		return count;
	}

	isCreativePlacement(row, col, horizontal, word) {
		let creativityScore = 0;

		// Check for multiple intersections with existing words
		const intersections = this.countIntersections(row, col, horizontal, word);
		creativityScore += intersections * 2;

		// Check premium square usage
		const premiumSquares = this.countPremiumSquaresUsed(
			row,
			col,
			horizontal,
			word,
		);
		creativityScore += premiumSquares * 2;

		// Check for parallel word formation
		const parallelWords = this.countParallelWords(row, col, horizontal, word);
		creativityScore += parallelWords * 3;

		// Check for future play opportunities created
		const opportunities = this.countFutureOpportunities(
			row,
			col,
			horizontal,
			word,
		);
		creativityScore += opportunities;

		// Check for balanced board coverage
		if (this.improvesBoardBalance(row, col, horizontal, word)) {
			creativityScore += 2;
		}

		// Consider a placement creative if it scores above threshold
		return creativityScore >= 5;
	}

	countParallelWords(row, col, horizontal, word) {
		let count = 0;
		const minParallelLength = 3; // Minimum length for parallel words

		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check positions parallel to the word
			const checkPositions = horizontal ? [
				[currentRow - 1, currentCol],
				[currentRow + 1, currentCol],
			] : [
				[currentRow, currentCol - 1],
				[currentRow, currentCol + 1],
			];

			for (const [checkRow, checkCol] of checkPositions) {
				if (this.isValidPosition(checkRow, checkCol)) {
					const parallelWord = horizontal ?
						this.getHorizontalWordAt(checkRow, checkCol) :
						this.getVerticalWordAt(checkRow, checkCol);

					if (parallelWord && parallelWord.length >= minParallelLength) {
						count++;
					}
				}
			}
		}

		return count;
	}

	improvesBoardBalance(row, col, horizontal, word) {
		const boardQuadrants = this.getBoardQuadrantDensities();
		const playQuadrant = this.getQuadrant(row, col);

		// Check if this play helps balance the board
		const avgDensity =
			Object.values(boardQuadrants).reduce((sum, density) => sum + density, 0) /
			9;

		// Play improves balance if it's in a less dense quadrant
		return boardQuadrants[playQuadrant] < avgDensity;
	}

	getQuadrant(row, col) {
		// Divide board into 9 quadrants
		if (row < 5) {
			return col < 5 ? "TL" : col < 10 ? "TC" : "TR";
		} else if (row < 10) {
			return col < 5 ? "ML" : col < 10 ? "MC" : "MR";
		} else {
			return col < 5 ? "BL" : col < 10 ? "BC" : "BR";
		}
	}

	getBoardQuadrantDensities() {
		const quadrants = {
			TL: 0,
			TC: 0,
			TR: 0,
			ML: 0,
			MC: 0,
			MR: 0,
			BL: 0,
			BC: 0,
			BR: 0,
		};

		// Count tiles in each quadrant
		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				if (this.board[row][col]) {
					const quadrant = this.getQuadrant(row, col);
					quadrants[quadrant]++;
				}
			}
		}

		// Convert counts to densities
		const quadrantSize = 25; // 5x5 squares
		for (const quadrant in quadrants) {
			quadrants[quadrant] = quadrants[quadrant] / quadrantSize;
		}

		return quadrants;
	}

	evaluateWordQuality(word, row, col, horizontal) {
		let quality = 0;

		// Base points for word length (with diminishing returns for very long words)
		const lengthBonus = word.length <= 7 ? word.length * 12 : 7 * 12 + (word.length - 7) * 6;
		quality += lengthBonus;

		// Enhanced premium square utilization with multipliers
		const premiumSquares = this.countPremiumSquaresUsed(row, col, horizontal, word);
		let premiumBonus = 0;
		if (premiumSquares >= 3) {
			premiumBonus = premiumSquares * 25; // Triple word score opportunity
		} else if (premiumSquares >= 2) {
			premiumBonus = premiumSquares * 20; // Double word score opportunity
		} else if (premiumSquares >= 1) {
			premiumBonus = premiumSquares * 15; // Single premium square
		}
		quality += premiumBonus;

		// Enhanced cross-word evaluation (more intersections = more strategic)
		const crossWords = this.countIntersections(row, col, horizontal, word);
		let crossBonus = 0;
		if (crossWords >= 4) {
			crossBonus = crossWords * 30; // Excellent cross-word potential
		} else if (crossWords >= 2) {
			crossBonus = crossWords * 25; // Good cross-word potential
		} else if (crossWords >= 1) {
			crossBonus = crossWords * 20; // Basic cross-word
		}
		quality += crossBonus;

		// Strategic position evaluation (center control, board balance)
		const positionBonus = this.evaluateBoardPosition(row, col, horizontal, word);
		quality += positionBonus;

		// Future opportunity evaluation (opens up good spots for next moves)
		const futureBonus = this.evaluateFutureOpportunities(row, col, horizontal, word);
		quality += futureBonus * 8;

		// Tile efficiency (using high-value letters effectively)
		const tileEfficiency = this.evaluateTileEfficiency(word);
		quality += tileEfficiency * 5;

		// Balanced letter usage bonus
		const letterBalance = this.evaluateLetterBalance(word);
		quality += letterBalance * 12;

		// Bingo potential (using all 7 tiles)
		if (this.aiRack && this.aiRack.length >= 7 && word.length >= 7) {
			quality += 40; // Significant bonus for bingo
		}

		return Math.max(0, quality); // Ensure non-negative quality
	}

	evaluateLetterBalance(word) {
		const vowels = "AEIOU";
		const vowelCount = word.split("").filter((c) => vowels.includes(c)).length;
		const consonantCount = word.length - vowelCount;

		// Ideal ratio is around 40% vowels
		const vowelRatio = vowelCount / word.length;
		return vowelRatio >= 0.3 && vowelRatio <= 0.5 ? 3 : vowelRatio >= 0.2 && vowelRatio <= 0.6 ? 1 : 0;
	}

	evaluateBoardPosition(row, col, horizontal, word) {
		let positionBonus = 0;

		// Center control bonus
		const centerRow = 7, centerCol = 7;
		const startDistance = Math.abs(row - centerRow) + Math.abs(col - centerCol);
		const endDistance = horizontal ?
			Math.abs(row - centerRow) + Math.abs(col + word.length - 1 - centerCol) :
			Math.abs(row + word.length - 1 - centerRow) + Math.abs(col - centerCol);

		const minDistance = Math.min(startDistance, endDistance);
		if (minDistance <= 2) positionBonus += 15; // Near center
		else if (minDistance <= 4) positionBonus += 8; // Moderately central

		// Board balance - avoid clustering in corners
		const quadrant = (row < 7 ? 0 : 1) + (col < 7 ? 0 : 2);
		// Prefer moves that balance board coverage (implementation would need board state analysis)

		return positionBonus;
	}

	evaluateFutureOpportunities(row, col, horizontal, word) {
		let opportunities = 0;

		// Check if this move opens up premium squares for future moves
		for (let i = 0; i < word.length; i++) {
			const currentRow = horizontal ? row : row + i;
			const currentCol = horizontal ? col + i : col;

			// Check adjacent squares for premium opportunities
			const adjacentSquares = [
				[currentRow - 1, currentCol],
				[currentRow + 1, currentCol],
				[currentRow, currentCol - 1],
				[currentRow, currentCol + 1]
			];

			for (const [adjRow, adjCol] of adjacentSquares) {
				if (this.isValidPosition(adjRow, adjCol) && !this.board[adjRow][adjCol]) {
					const premium = this.getPremiumSquareType(adjRow, adjCol);
					if (['tw', 'dw', 'tl'].includes(premium)) {
						opportunities += premium === 'tw' ? 3 : premium === 'dw' ? 2 : 1;
					}
				}
			}
		}

		// Bonus for moves that create multiple parallel opportunities
		if (opportunities >= 5) return 8;
		else if (opportunities >= 3) return 5;
		else if (opportunities >= 1) return 2;
		return 0;
	}

	evaluateTileEfficiency(word) {
		let efficiency = 0;

		// Bonus for using high-value letters (Q, Z, J, X) effectively
		const highValueLetters = ['Q', 'Z', 'J', 'X'];
		const usedHighValue = word.split('').filter(c => highValueLetters.includes(c)).length;
		efficiency += usedHighValue * 2;

		// Penalty for wasting blanks on common letters
		const commonLetters = ['E', 'A', 'I', 'O', 'N', 'R', 'T', 'L', 'S', 'U'];
		const wastedBlanks = word.split('').filter(c => commonLetters.includes(c) && this.tileValues[c] <= 1).length;
		efficiency -= wastedBlanks;

		// Bonus for efficient use of all rack tiles
		if (this.aiRack && word.length >= 6) {
			efficiency += Math.min(word.length, 3); // Up to 3 bonus points for using many tiles
		}

		return Math.max(0, efficiency);
	}

	speakWord(word) {
		if (!word) return;
		try {
			if (typeof this._speakWithRetry === 'function') {
				this._speakWithRetry(word, { lang: this._getPreferredLangCode() }).catch(() => {});
			} else if (typeof speechSynthesis !== 'undefined') {
				const utter = new SpeechSynthesisUtterance(word);
				utter.lang = this._getPreferredLangCode();
				speechSynthesis.speak(utter);
			}
		} catch (e) {
			console.warn('speakWord failed', e);
		}
	}

	_handleSpeechClick(word) {
		// Handle async speech for onclick
		this.speakWordInEnglish(word).catch(e => console.warn('Speech failed:', e));
	}

	async speakWordInEnglish(word) {
		if (!word) return;

		try {
			// Try to translate Spanish word to English using Google Translate API
			let englishWord = word;
			try {
				const translation = await this._translateViaAPI(word, 'es', 'en');
				if (translation && translation !== word) {
					englishWord = translation;
				}
			} catch (apiError) {
				// Fallback to dictionary if API fails
				const dictTranslation = this._translateWordToEnglish(word.toUpperCase());
				if (dictTranslation) {
					englishWord = dictTranslation;
				}
			}

			if (typeof this._speakWithRetry === 'function') {
				this._speakWithRetry(englishWord, { lang: 'en-US', forceEnglishVoice: true }).catch(() => {});
			} else if (typeof speechSynthesis !== 'undefined') {
				const utter = new SpeechSynthesisUtterance(englishWord);
				utter.lang = 'en-US'; // Force English

				// Force English voice selection
				try {
					const englishVoice = this._getEnglishVoice();
					if (englishVoice) {
						utter.voice = englishVoice;
					}
				} catch (e) {
					console.debug('Voice selection failed, using default');
				}

				speechSynthesis.speak(utter);
			}
		} catch (e) {
			console.warn('speakWordInEnglish failed', e);
		}
	}

	isScrabbleAppropriate(word) {
		if (!word) return false;

		const upperWord = word.toUpperCase();
		const lang = this.preferredLang || 'en';

		// Debug: log words being checked (only in debug mode)
		if (this.showAIDebug && (upperWord.includes('SOSEDAD') || Math.random() < 0.01)) {
			console.log(`[AI Word Check] Evaluating: ${upperWord} in ${lang}`);
		}

		// Language-specific validation
		if (lang === 'en') {
			// English Scrabble validation - more permissive
			// 1. Basic checks
			if (upperWord.length < 2 || upperWord.length > 15) {
				return false;
			}

			// 2. Must contain at least one vowel (English words requirement)
			if (!/[AEIOU]/.test(upperWord)) {
				return false;
			}

			// 3. Q must be followed by U (with rare exceptions)
			if (/Q[^U]/.test(upperWord)) {
				// Allow some exceptions like QI, but reject most
				if (!/^QI/.test(upperWord)) {
					return false;
				}
			}

			// 4. Dictionary check - primary validation for English
			const inDict = this.dictionaryHas(word);
			if (!inDict) {
				if (this.showAIDebug) console.log(`[AI Word Check] Rejected ${upperWord}: not in English dictionary`);
				return false;
			}

			return true;
		} else {
			// Spanish validation (existing logic)
			// 1. Letter repetition patterns (too many of the same letter)
			const letterCounts = {};
			for (const letter of upperWord) {
				letterCounts[letter] = (letterCounts[letter] || 0) + 1;
			}
			const maxSameLetter = Math.max(...Object.values(letterCounts));
			if (maxSameLetter > 4 && upperWord.length > 6) {
				return false; // Too many repeated letters for reasonable words
			}

			// 2. Check for words that are too obscure or unlikely to be real
			const suspiciousPatterns = [
				/(.)\1{3,}/, // Four or more identical letters in a row
				/^[AEIOU]{4,}/, // Starts with 4+ vowels (very rare in Spanish)
				/(.)(.)\1\2/, // ABAB pattern (often indicates made-up words like SAUSA)
				/^[Q][^U]/, // Q not followed by U (invalid in Spanish except some exceptions)
				/[WX]/, // W or X in Spanish words (extremely rare, mostly foreign words)
				/(.)(.)(.)\1\2\3/, // ABCABC pattern (very suspicious)
				/^[AEIOU][AEIOU][AEIOU]/, // Three vowels in a row at start
				/[AEIOU]{4}/, // Four vowels anywhere (very rare)
			];

			for (const pattern of suspiciousPatterns) {
				if (pattern.test(upperWord)) {
					return false;
				}
			}

			// 3. Length and complexity checks
			if (upperWord.length < 2 || upperWord.length > 15) {
				return false;
			}

			// 4. Vowel/consonant ratio check (Spanish words should have reasonable balance)
			const vowels = upperWord.match(/[AEIOUÁÉÍÓÚÜ]/g) || [];
			const consonants = upperWord.match(/[BCDFGHJKLMNÑPQRSTVWXYZ]/g) || [];
			const vowelRatio = vowels.length / upperWord.length;

			// Reject words with too few vowels (makes them hard to pronounce) or too many
			if (vowelRatio < 0.15 || vowelRatio > 0.7) {
				return false;
			}

			// 5. Dictionary validation - final check against known words
			const inDict = this.dictionaryHas(word);
			if (!inDict) {
				if (this.showAIDebug) console.log(`[AI Word Check] Rejected ${upperWord}: not in Spanish dictionary`);
				return false;
			}

			return true;
		}

		return true; // Allow if in dictionary and passes all intelligent checks
	}

	async validateWordWithGoogleAPI(word, targetLang = 'es') {
		// Use Google Translate API to validate if word exists in target language
		// Strategy: Translate word from target language to English, then back to target language
		// If the word comes back similar, it's likely valid in that language

		try {
			// First check basic letter validity for the target language
			if (!this.isBasicValidForLanguage(word, targetLang)) {
				return false;
			}

			// Skip API validation for very short words (they're often valid)
			if (word.length <= 2) {
				return true;
			}

			// For Spanish, use more comprehensive validation
			if (targetLang === 'es') {
				return await this.validateSpanishWordWithGoogle(word);
			}

			// For other languages, implement similar validation
			return await this.validateOtherLanguageWord(word, targetLang);

		} catch (error) {
			console.warn(`API validation failed for ${word} in ${targetLang}:`, error);
			// Fall back to basic pattern validation
			return this.isBasicValidForLanguage(word, targetLang);
		}
	}

	isBasicValidForLanguage(word, lang) {
		// Basic letter validation for different languages
		switch (lang) {
			case 'es': // Spanish
				return /^[A-ZÑ]+$/.test(word) &&
					   /[AEIOUÁÉÍÓÚÜ]/.test(word) && // Must have vowels
					   word.length >= 2;

			case 'fr': // French
				return /^[A-ZÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]+$/.test(word) &&
					   /[AEIOUYÀÂÄÉÈÊËÏÎÔÖÙÛÜŸ]/.test(word) &&
					   word.length >= 2;

			case 'zh': // Chinese (simplified for Scrabble context)
				// For Chinese, we'll rely more on API validation
				return word.length >= 1;

			default: // English and others
				return /^[A-Z]+$/.test(word) &&
					   /[AEIOU]/.test(word) &&
					   word.length >= 2;
		}
	}

	async validateSpanishWordWithGoogle(word) {
		try {
			// Check cache first to avoid duplicate API calls
			const cacheKey = `spanish_api_${word.toLowerCase()}`;
			if (this.validationCache && this.validationCache[cacheKey] !== undefined) {
				return this.validationCache[cacheKey];
			}

			// Stricter Spanish validation with multiple checks

			// TILE TRANSFORMATION SYSTEM: Players can transform tiles for Spanish characters
			// Allow words with Ñ and accented vowels since players can transform tiles:
			// N → Ñ, A → Á, E → É, I → Í, O → Ó, U → Ú/Ü
			// Validation passes through - tile transformation is handled during word formation

			// First, ensure basic Spanish word requirements
			const upperWord = word.toUpperCase();
			if (!this.couldBeValidSpanishWord(upperWord)) {
				// Cache negative result
				if (!this.validationCache) this.validationCache = {};
				this.validationCache[cacheKey] = false;
				return false;
			}

			// Use Google Translate round-trip validation
			// Translate Spanish -> English -> Spanish
			const englishTranslation = await this._translateViaAPI(word, 'es', 'en');

			// If no translation or too generic, word might not exist in Spanish
			if (!englishTranslation ||
				englishTranslation.trim() === '' ||
				englishTranslation.toLowerCase().includes('translation') ||
				englishTranslation.toLowerCase().includes('spanish')) {
				return false;
			}

			// Translate back to Spanish
			const spanishTranslation = await this._translateViaAPI(englishTranslation, 'en', 'es');

			if (!spanishTranslation || spanishTranslation.trim() === '') {
				return false;
			}

			// Compare normalized versions since Google may return accented forms
			// Input words are accent-free (tile-compatible), Google may add accents
			const inputNormalized = word.toLowerCase(); // Input has no accents (we rejected them above)
			const googleNormalized = spanishTranslation.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

			// Exact match (input matches Google's response exactly)
			const exactMatch = inputNormalized === spanishTranslation.toLowerCase();

			// Match after normalizing Google's accented response
			const normalizedMatch = inputNormalized === googleNormalized;

			// Similarity score for partial matches
			const similarity = this.calculateWordSimilarity(inputNormalized, googleNormalized);

			// Confidence scoring system
			let confidence = 0;
			if (exactMatch) confidence = 100;  // Perfect match (unlikely - Google adds accents)
			else if (normalizedMatch) confidence = 95;  // Google returned accent-free version or we normalized it
			else if (similarity >= 0.9) confidence = 85;  // Very similar
			else if (similarity >= 0.8) confidence = 70;  // Similar
			else confidence = similarity * 100;  // Raw similarity score

			// Stricter validation: Require high confidence AND word must match closely
			// Reject words where Google translates to something completely different
			// This catches cases like "BISONE" → "bison" → "bisonte" (different word)
			let isValid = false;
			
			if (normalizedMatch) {
				// Perfect normalized match - accept with 85%+ confidence
				isValid = confidence >= 85;
			} else if (similarity >= 0.95) {
				// Very high similarity (95%+) - might be valid with accents
				isValid = confidence >= 90;
			} else {
				// Too different - reject
				isValid = false;
			}

			// Enhanced logging (only in debug mode to reduce console spam)
			if (this.showAIDebug) {
				const googleHasAccents = spanishTranslation !== googleNormalized;
				console.log(`Spanish validation for "${word}": confidence ${(confidence).toFixed(1)}%, similarity ${(similarity * 100).toFixed(1)}%`);
				console.log(`  Google response: "${spanishTranslation}" (accents: ${googleHasAccents})`);
				console.log(`  Comparison: "${inputNormalized}" vs "${googleNormalized}", valid: ${isValid}`);
			}

			// Cache result
			if (!this.validationCache) this.validationCache = {};
			this.validationCache[cacheKey] = isValid;

			return isValid;

		} catch (error) {
			if (this.showAIDebug) console.warn('Spanish Google validation failed:', error);
			// Cache negative result on error
			const cacheKey = `spanish_api_${word.toLowerCase()}`;
			if (!this.validationCache) this.validationCache = {};
			this.validationCache[cacheKey] = false;
			return false;
		}
	}

	async validateEnglishWordWithGoogle(word) {
		try {
			// Check cache first to avoid duplicate API calls
			const cacheKey = `english_api_${word.toLowerCase()}`;
			if (this.validationCache && this.validationCache[cacheKey] !== undefined) {
				const cached = this.validationCache[cacheKey];
				return {
					isValid: cached.isValid,
					confidence: cached.confidence
				};
			}

			// Use Google Translate round-trip validation for English
			// Translate English -> Spanish -> English
			const spanishTranslation = await this._translateViaAPI(word, 'en', 'es');

			// If no translation or too generic, word might not exist
			if (!spanishTranslation ||
				spanishTranslation.trim() === '' ||
				spanishTranslation.toLowerCase().includes('translation') ||
				spanishTranslation.toLowerCase().includes('english')) {
				return { isValid: false, confidence: 0 };
			}

			// Translate back to English
			const englishTranslation = await this._translateViaAPI(spanishTranslation, 'es', 'en');

			if (!englishTranslation || englishTranslation.trim() === '') {
				return { isValid: false, confidence: 0 };
			}

			// Compare normalized versions
			const inputNormalized = word.toLowerCase();
			const googleNormalized = englishTranslation.toLowerCase();

			// Exact match
			const exactMatch = inputNormalized === englishTranslation.toLowerCase();

			// Similarity score
			const similarity = this.calculateWordSimilarity(inputNormalized, googleNormalized);

			// Confidence scoring for English
			let confidence = 0;
			if (exactMatch) confidence = 100;  // Perfect match
			else if (similarity >= 0.9) confidence = 90;  // Very similar
			else if (similarity >= 0.8) confidence = 75;  // Similar
			else confidence = similarity * 100;  // Raw similarity

			// For English, require higher confidence to accept API-only words
			// Raise threshold to reduce false positives (e.g., near-miss words like "AHINGED")
			const acceptanceThreshold = 85; // percent
			const isValid = confidence >= acceptanceThreshold;

			// Enhanced logging
			if (this.showAIDebug) {
				console.log(`English validation for "${word}": confidence ${(confidence).toFixed(1)}%, similarity ${(similarity * 100).toFixed(1)}% (threshold ${acceptanceThreshold}%)`);
				console.log(`  Google response: "${englishTranslation}", valid: ${isValid}`);
			}
			// If confidence is borderline but still accepted, log a warning for tuning
			if (isValid && confidence < 90 && this.showAIDebug) {
				console.warn(`Borderline API acceptance for "${word}" (confidence ${confidence.toFixed(1)}%)`);
			}

			// Cache result
			if (!this.validationCache) this.validationCache = {};
			this.validationCache[cacheKey] = { isValid, confidence };

			return { isValid, confidence };

		} catch (error) {
			if (this.showAIDebug) console.warn('English Google validation failed:', error);
			// Cache negative result on error
			const cacheKey = `english_api_${word.toLowerCase()}`;
			if (!this.validationCache) this.validationCache = {};
			this.validationCache[cacheKey] = { isValid: false, confidence: 0 };
			return { isValid: false, confidence: 0 };
		}
	}

	// TILE TRANSFORMATION SYSTEM
	// Players can transform tiles to create Spanish characters

	// Check if player has tiles to form word (considering transformations)
	canFormWordWithTiles(word, rack = this.playerRack) {
		if (!word || !rack) return false;

		const tileCounts = {};
		let blankCount = 0;

		// Count available tiles (normalize accented characters) and blanks
		rack.forEach(tile => {
			const letter = (tile && tile.letter) ? String(tile.letter) : '';
			if (letter === '*' || tile.isBlank) {
				blankCount++;
				return;
			}
			// Normalize accented characters: Á→A, É→E, Í→I, Ó→O, Ú→U, Ñ→N
			const normalized = normalizeWordForDict(letter).toUpperCase();
			if (!normalized) return;
			tileCounts[normalized] = (tileCounts[normalized] || 0) + 1;
		});

		// Normalize the word to match tiles (Café → CAFE)
		const normalizedWord = normalizeWordForDict(word).toUpperCase();

		// Check each letter in normalized word, allowing blanks to substitute
		for (let i = 0; i < normalizedWord.length; i++) {
			const neededChar = normalizedWord[i];
			if (tileCounts[neededChar] > 0) {
				tileCounts[neededChar]--;
			} else if (blankCount > 0) {
				blankCount--;
			} else {
				return false; // Cannot form this letter even with blanks
			}
		}

		return true;
	}

	// Intelligent error recovery with word suggestions
	async getWordSuggestions(invalidWord, lang = 'es') {
		try {
			const suggestions = [];
			const upperWord = invalidWord.toUpperCase();

			// Strategy 1: Try common Spanish word variations (tile-playable only)
			if (lang === 'es') {
				const accentVariations = this.generateAccentVariations(upperWord);
				for (const variation of accentVariations) {
					// Only suggest accent-free words since tiles don't have accents
					const hasAccents = variation !== variation.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
					if (!hasAccents && await this.validateSpanishWordWithGoogle(variation)) {
						suggestions.push({
							word: variation,
							type: 'accent_variation',
							confidence: 90
						});
					}
				}
			}

			// Strategy 2: Try removing/replacing suspicious characters
			const cleanedWord = upperWord.replace(/[^A-ZÑ]/g, '');
			if (cleanedWord !== upperWord && cleanedWord.length >= 3) {
				if (lang === 'es' && await this.validateSpanishWordWithGoogle(cleanedWord)) {
					suggestions.push({
						word: cleanedWord,
						type: 'character_cleaned',
						confidence: 75
					});
				}
			}

			// Strategy 3: Find similar words from local dictionary
			const similarWords = this.findSimilarWords(upperWord, lang);
			for (const similar of similarWords) {
				if (await this.validateWordWithGoogleAPI(similar, lang)) {
					suggestions.push({
						word: similar,
						type: 'similar_word',
						confidence: 60
					});
				}
			}

			// Strategy 4: Try Google Translate suggestions
			try {
				if (lang === 'es') {
					const englishGuess = await this._translateViaAPI(upperWord, 'es', 'en');
					if (englishGuess && !englishGuess.includes('translation')) {
						// Try to get Spanish suggestions from English
						const spanishSuggestions = await this._translateViaAPI(englishGuess, 'en', 'es');
						if (spanishSuggestions && spanishSuggestions !== upperWord) {
							const variations = this.generateSimilarWords(spanishSuggestions);
							for (const variation of variations) {
								if (variation.length >= 3 && await this.validateSpanishWordWithGoogle(variation)) {
									suggestions.push({
										word: variation,
										type: 'translation_suggestion',
										confidence: 50
									});
								}
							}
						}
					}
				}
			} catch (e) {
				// Translation suggestions failed, continue with other strategies
			}

			// Remove duplicates and sort by confidence
			const uniqueSuggestions = suggestions.filter((s, index, arr) =>
				arr.findIndex(x => x.word === s.word) === index
			).sort((a, b) => b.confidence - a.confidence);

			return uniqueSuggestions.slice(0, 5); // Return top 5 suggestions

		} catch (error) {
			console.warn('Error generating word suggestions:', error);
			return [];
		}
	}

	generateAccentVariations(word) {
		// Generate accent variations, but return accent-FREE versions for tile compatibility
		// This helps suggest the tile-playable version of accented words
		const variations = [word];

		// Since tiles don't have accents, we suggest the base forms
		// Google Translate will validate that these mean the same as accented versions
		const normalized = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		if (normalized !== word) {
			variations.push(normalized); // Add the accent-free version
		}

		// Also try common accent positions for suggestions
		const accentMap = {
			'A': 'Á', 'E': 'É', 'I': 'Í', 'O': 'Ó', 'U': 'Ú',
			'a': 'á', 'e': 'é', 'i': 'í', 'o': 'ó', 'u': 'ú'
		};

		// Add variations with accents on vowels (for validation purposes)
		for (let i = 0; i < word.length; i++) {
			const char = word[i];
			if (accentMap[char]) {
				const variation = word.substring(0, i) + accentMap[char] + word.substring(i + 1);
				variations.push(variation);
			}
		}

		return [...new Set(variations)]; // Remove duplicates
	}

	findSimilarWords(word, lang) {
		// Find similar words from local dictionary (simplified implementation)
		const similar = [];
		const wordLength = word.length;

		// Check local dictionary for words of similar length
		for (const dictWord of this.dictionary || []) {
			if (Math.abs(dictWord.length - wordLength) <= 1) {
				const similarity = this.calculateWordSimilarity(word.toLowerCase(), dictWord.toLowerCase());
				if (similarity >= 0.7) {
					similar.push(dictWord);
				}
			}
		}

		return similar.slice(0, 3);
	}

	generateSimilarWords(baseWord) {
		// Generate slight variations of a word
		const variations = [baseWord];
		const length = baseWord.length;

		// Remove one character variations
		for (let i = 0; i < length; i++) {
			variations.push(baseWord.substring(0, i) + baseWord.substring(i + 1));
		}

		// Add one character variations (common letters)
		const commonLetters = 'AEIOUNRLST';
		for (let i = 0; i <= length; i++) {
			for (const letter of commonLetters) {
				variations.push(baseWord.substring(0, i) + letter + baseWord.substring(i));
			}
		}

		return [...new Set(variations)].filter(w => w.length >= 3 && w.length <= 15);
	}

	async validateOtherLanguageWord(word, targetLang) {
		// Language-specific validation strategies
		switch (targetLang) {
			case 'fr':
				return await this.validateFrenchWord(word);
			case 'zh':
				return await this.validateChineseWord(word);
			case 'de':
				return await this.validateGermanWord(word);
			default:
				// Generic round-trip validation for other languages
				return await this.validateWithRoundTrip(word, targetLang);
		}
	}

	async validateFrenchWord(word) {
		try {
			// Check for obviously invalid French patterns
			if (!this.isBasicValidForLanguage(word, 'fr')) {
				return false;
			}

			// Use round-trip validation: French -> English -> French
			const englishTranslation = await this._translateViaAPI(word, 'fr', 'en');
			if (!englishTranslation) return false;

			const frenchTranslation = await this._translateViaAPI(englishTranslation, 'en', 'fr');
			if (!frenchTranslation) return false;

			// French words often have consistent translations
			const similarity = this.calculateWordSimilarity(
				word.toLowerCase(),
				frenchTranslation.toLowerCase()
			);

			console.log(`French validation for "${word}": similarity ${similarity}`);

			return similarity >= 0.6; // Slightly lower threshold for French

		} catch (error) {
			console.warn('French validation failed:', error);
			return this.isBasicValidForLanguage(word, 'fr');
		}
	}

	async validateChineseWord(word) {
		// Chinese validation is trickier since Google Translate works with characters
		// For now, use basic validation and check against common patterns
		try {
			if (!this.isBasicValidForLanguage(word, 'zh')) {
				return false;
			}

			// Check if it's in a basic Chinese dictionary (simplified for now)
			// In a full implementation, you'd want a proper Chinese dictionary API
			const commonChineseWords = [
				'一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
				'人', '大', '小', '中', '国', '天', '地', '水', '火', '山'
			];

			// For single characters, check if they're common
			if (word.length === 1) {
				return commonChineseWords.includes(word);
			}

			// For longer words, use translation validation
			const englishTranslation = await this._translateViaAPI(word, 'zh', 'en');
			return englishTranslation && englishTranslation.trim() !== '';

		} catch (error) {
			console.warn('Chinese validation failed:', error);
			return word.length >= 1; // Very basic fallback
		}
	}

	async validateGermanWord(word) {
		try {
			if (!this.isBasicValidForLanguage(word, 'de')) {
				return false;
			}

			// German round-trip validation
			const englishTranslation = await this._translateViaAPI(word, 'de', 'en');
			if (!englishTranslation) return false;

			const germanTranslation = await this._translateViaAPI(englishTranslation, 'en', 'de');
			if (!germanTranslation) return false;

			const similarity = this.calculateWordSimilarity(
				word.toLowerCase(),
				germanTranslation.toLowerCase()
			);

			return similarity >= 0.7;

		} catch (error) {
			console.warn('German validation failed:', error);
			return this.isBasicValidForLanguage(word, 'de');
		}
	}

	async validateWithRoundTrip(word, targetLang) {
		// Generic round-trip validation for any language
		try {
			const englishTranslation = await this._translateViaAPI(word, targetLang, 'en');
			if (!englishTranslation) return false;

			const backTranslation = await this._translateViaAPI(englishTranslation, 'en', targetLang);
			if (!backTranslation) return false;

			const similarity = this.calculateWordSimilarity(
				word.toLowerCase(),
				backTranslation.toLowerCase()
			);

			return similarity >= 0.7;

		} catch (error) {
			console.warn(`${targetLang} validation failed:`, error);
			return this.isBasicValidForLanguage(word, targetLang);
		}
	}

	calculateWordSimilarity(word1, word2) {
		// Simple Levenshtein distance-based similarity
		if (word1 === word2) return 1.0;

		const longer = word1.length > word2.length ? word1 : word2;
		const shorter = word1.length > word2.length ? word2 : word1;

		if (longer.length === 0) return 1.0;

		const distance = this.levenshteinDistance(longer, shorter);
		return (longer.length - distance) / longer.length;
	}

	levenshteinDistance(str1, str2) {
		const matrix = [];
		for (let i = 0; i <= str2.length; i++) {
			matrix[i] = [i];
		}
		for (let j = 0; j <= str1.length; j++) {
			matrix[0][j] = j;
		}
		for (let i = 1; i <= str2.length; i++) {
			for (let j = 1; j <= str1.length; j++) {
				if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
					matrix[i][j] = matrix[i - 1][j - 1];
				} else {
					matrix[i][j] = Math.min(
						matrix[i - 1][j - 1] + 1, // substitution
						matrix[i][j - 1] + 1,     // insertion
						matrix[i - 1][j] + 1      // deletion
					);
				}
			}
		}
		return matrix[str2.length][str1.length];
	}

	// Keep the old function for backward compatibility but make it much more targeted

	async validateSpanishWordWithAPI(word) {
		try {
			// Use the new Google API validation system
			const isValid = await this.validateWordWithGoogleAPI(word, 'es');

			// Cache the result for future sync checks
			if (!this.validationCache) {
				this.validationCache = {};
			}
			this.validationCache[`spanish_validation_${word.toLowerCase()}`] = isValid;

			return isValid;
		} catch (error) {
			console.warn('Spanish API validation failed for', word, ':', error);
			// Fall back to basic validation
			return this.couldBeValidSpanishWord(word);
		}
	}

	couldBeValidSpanishWord(word) {
		// Basic Spanish word validation heuristics
		if (!word) return false;

		// Must contain only valid Spanish letters
		if (!/^[A-ZÑ]+$/.test(word)) return false;

		// Must have at least one vowel
		if (!/[AEIOUÁÉÍÓÚÜ]/.test(word)) return false;

		// Spanish words typically don't start with certain consonants
		if (/^[JKWXY]/.test(word) && word.length < 4) return false;

		// Check for common Spanish letter patterns
		const hasCommonSpanishPattern =
			/[AEIOUÁÉÍÓÚÜ]/.test(word) && // Has vowels
			(/[NQ]/.test(word) || /[LR]/.test(word) || word.length >= 3); // Common consonants or longer words

		return hasCommonSpanishPattern;
	}

	_translateViaAPI(text, sourceLang = 'es', targetLang = 'en') {
		return new Promise((resolve, reject) => {
			fetch('/.netlify/functions/translate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					text: text,
					source: sourceLang,
					target: targetLang
				})
			})
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => {
				if (data.translatedText) {
					resolve(data.translatedText);
				} else {
					reject(new Error('No translation received'));
				}
			})
			.catch(error => {
				console.warn('Translation API failed:', error);
				reject(error);
			});
		});
	}

	_translateWordToEnglish(word) {
		// Since we removed the hardcoded translations, return null
		// The Google Translate API should handle all translation needs
		return null;
	}
	// Announce Bingo bonus after words are spoken. Kept lightweight and tolerant of missing TTS.
	speakBingo(source = 'player') {
		try {
			if (typeof window === 'undefined') return;
			// Attempt to speak via the robust helper that retries and sets a preferred voice
			try {
				// Force local browser TTS for bingo to avoid noisy remote 403 errors
				this._speakWithRetry('Bingo bonus!', { lang: 'en-US', rate: 1.15, pitch: 1.4, forceLocal: true }).catch(e => {
					// Completely silent - no logging for TTS failures
				});
				// Remove console logging to reduce noise
				try { this.appendConsoleMessage('speakBingo invoked for '+source); } catch(e){}
			} catch (e) {
				// Completely silent TTS setup failures
			}

			// Always trigger visual celebration for bingo (player only)
			try {
				if (typeof this.createBingoSplash === 'function') {
					console.log('[Visual] createBingoSplash() will be called');
					this.createBingoSplash('standard');
				}
			} catch (e) {
				console.warn('createBingoSplash failed', e);
			}
		} catch (e) {
			console.warn('speakBingo failed', e);
		}
	}

	// Ensure audio / TTS is unlocked and voices are loaded. Call this inside a user gesture.
	async ensureAudioUnlocked() {
		try {
			if (this._audioUnlocked) return;
			if (typeof window === 'undefined') return;

			// Try to load voices (may be empty until a gesture on some Android browsers)
			if ('speechSynthesis' in window) {
				try {
					const voices = window.speechSynthesis.getVoices() || [];
					console.debug('[Speech] getVoices() returned', voices.length, 'voices');
					try { this.appendConsoleMessage(`getVoices() -> ${voices.length} voices`); } catch(e){}
					// If no voices yet, attach a one-time onvoiceschanged to log when they arrive
					if (voices.length === 0) {
						const onv = () => {
							try { console.debug('[Speech] onvoiceschanged:', window.speechSynthesis.getVoices().map(v=>v.name)); this.appendConsoleMessage('voiceschanged: '+ (window.speechSynthesis.getVoices()||[]).map(v=>v.name).join(', ')); } catch(e){}
							window.speechSynthesis.removeEventListener('voiceschanged', onv);
						};
						window.speechSynthesis.addEventListener('voiceschanged', onv);
						// Trigger a tiny utterance as a fallback to coax voices to load (volume very low)
						try {
							const t = new SpeechSynthesisUtterance('');
							t.volume = 0.01;
							window.speechSynthesis.speak(t);
						} catch (e) {
							// ignore
						}
					}
				} catch (e) {
					console.warn('ensureAudioUnlocked: getVoices failed', e);
				}
			}

			// Also resume/create an AudioContext and play a silent oscillator to unlock audio on Android
			try {
				const AC = window.AudioContext || window.webkitAudioContext;
				if (AC) {
					this._audioCtx = this._audioCtx || new AC();
					if (this._audioCtx.state === 'suspended' && typeof this._audioCtx.resume === 'function') {
						await this._audioCtx.resume();
					}
					// Play an inaudible oscillator for a few ms to unlock the audio output path
					const g = this._audioCtx.createGain();
					g.gain.value = 0; // fully silent
					const o = this._audioCtx.createOscillator();
					o.connect(g);
					g.connect(this._audioCtx.destination);
					o.start();
					o.stop(this._audioCtx.currentTime + 0.03);
				}
			} catch (e) {
				// non-fatal
				console.debug('ensureAudioUnlocked: AudioContext trick failed', e);
				try { this.appendConsoleMessage('ensureAudioUnlocked audio trick failed'); } catch(e){}
			}

			this._audioUnlocked = true;
			console.debug('[Speech] ensureAudioUnlocked complete');
			try { this.appendConsoleMessage('ensureAudioUnlocked complete'); } catch(e){}
		} catch (e) {
			console.warn('ensureAudioUnlocked fatal error', e);
		}
	}

	// Pick a preferred voice matching the current preferred language (falls back to English)
	_getPreferredVoice(preferredLang) {
		try {
			if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
			const voices = window.speechSynthesis.getVoices() || [];
			if (!voices || voices.length === 0) return null;
			const target = (preferredLang && preferredLang.toLowerCase()) || (this._getPreferredLangCode && this._getPreferredLangCode().toLowerCase());
			let pick = null;
			if (target) {
				// prefer exact match first
				for (const v of voices) {
					if (!v.lang) continue;
					const lang = v.lang.toLowerCase();
					if (lang === target || lang.startsWith(target.split('-')[0])) { pick = v; break; }
				}
			}
			// fallback to any en* voice
			if (!pick) {
				for (const v of voices) {
					if (!v.lang) continue;
					if (v.lang.toLowerCase().startsWith('en')) { pick = v; break; }
				}
			}
			if (!pick) pick = voices[0];
			return pick || null;
		} catch (e) {
			console.debug('getPreferredVoice failed', e);
			return null;
		}
	}

	_getEnglishVoice() {
		try {
			if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
			const voices = window.speechSynthesis.getVoices() || [];
			if (!voices || voices.length === 0) return null;

			// Prioritize US English voices
			for (const v of voices) {
				if (!v.lang) continue;
				const lang = v.lang.toLowerCase();
				if (lang === 'en-us' || lang === 'en_us') { return v; }
			}

			// Then any English voice
			for (const v of voices) {
				if (!v.lang) continue;
				if (v.lang.toLowerCase().startsWith('en')) { return v; }
			}

			// Finally any voice (better than nothing)
			return voices[0] || null;
		} catch (e) {
			console.debug('getEnglishVoice failed', e);
			return null;
		}
	}

	// Speak a single utterance, with a single retry attempt after trying to unlock audio.
	// Returns a Promise that resolves on end or rejects on persistent failure.
	_speakWithRetry(text, opts = {}) {
		return new Promise(async (resolve, reject) => {
			if (typeof window === 'undefined') return resolve();
			const finalLang = opts.forceEnglishVoice ? 'en-US' : (opts.lang || this._getPreferredLangCode());
			const forceLocal = !!opts.forceLocal;
			// First try remote Netlify Google TTS function (server-side, uses GOOGLE_API_KEY)
			const tryRemote = async () => {
				if (!window.fetch) return false;

				// Completely suppress ALL console output during TTS API calls
				const originalConsoleError = console.error;
				const originalConsoleWarn = console.warn;
				const originalConsoleDebug = console.debug;
				const originalConsoleLog = console.log;
				console.error = () => {};
				console.warn = () => {};
				console.debug = () => {};
				console.log = () => {};

				// Override fetch globally to suppress TTS API errors
				const originalFetch = window.fetch;
				window.fetch = async function(url, ...args) {
					// Only override TTS API calls
					if (typeof url === 'string' && url.includes('/.netlify/functions/tts')) {
						try {
							const response = await originalFetch.apply(this, [url, ...args]);
							return response; // Let normal responses through
						} catch (e) {
							// Return a fake successful response to prevent errors
							return new Response(JSON.stringify({ audioContent: null }), {
								status: 200,
								statusText: 'OK',
								headers: { 'Content-Type': 'application/json' }
							});
						}
					}
					// For non-TTS requests, use normal fetch
					return originalFetch.apply(this, [url, ...args]);
				};

				try {
					const resp = await fetch('/.netlify/functions/tts', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ text, lang: finalLang, audioEncoding: 'MP3' }),
						cache: 'no-store'
					});

					// Restore console and fetch before processing response
					console.error = originalConsoleError;
					console.warn = originalConsoleWarn;
					console.debug = originalConsoleDebug;
					console.log = originalConsoleLog;
					window.fetch = originalFetch;

					if (!resp.ok) {
						// Silently skip ALL TTS API failures (403, 429, 500, etc.) - fallback to browser TTS
						// Optionally warn in debug mode
						if (this.showAIDebug) console.warn('Remote TTS failed with status', resp.status);
						return false;
					}
					const j = await resp.json();
					if (j && j.audioContent) {
						try {
							await this._playAudioBase64(j.audioContent);
							return true;
						} catch (e) {
							// Silently handle audio playback errors too
							return false;
						}
					}
				} catch (e) {
					// Restore console and fetch on error - but don't log TTS network errors
					console.error = originalConsoleError;
					console.warn = originalConsoleWarn;
					console.debug = originalConsoleDebug;
					console.log = originalConsoleLog;
					window.fetch = originalFetch;
					// Don't throw or log TTS connection errors - just return false for fallback
				}
				return false;
			};
			// If not forcing local, try remote first; else skip to local TTS
			if (!forceLocal) {
				try {
					const ok = await tryRemote();
					if (ok) return resolve();
				} catch (e) { /* ignore */ }
			}
			// Fallback to in-browser SpeechSynthesis
			if (!('speechSynthesis' in window) || !text) return resolve();
			let tried = 0;
			const u = new SpeechSynthesisUtterance(text);
			u.lang = finalLang || 'en-US';
			u.rate = typeof opts.rate === 'number' ? opts.rate : 0.75;
			u.pitch = typeof opts.pitch === 'number' ? opts.pitch : 1.0;
				try {
					let voiceToUse = null;
					if (opts.forceEnglishVoice) {
						voiceToUse = this._getEnglishVoice();
					} else {
						voiceToUse = this._getPreferredVoice && this._getPreferredVoice(this._getPreferredLangCode && this._getPreferredLangCode());
					}
					if (voiceToUse) u.voice = voiceToUse;
				} catch (e) { /* ignore */ }
			u.onend = () => resolve();
			u.onerror = async (ev) => {
				if (tried === 0) {
					tried++;
					try { await this.ensureAudioUnlocked(); } catch (e) { /* ignore */ }
					try { window.speechSynthesis.speak(u); } catch (e) { return resolve(); }
				} else {
					return resolve();
				}
			};
			try {
				window.speechSynthesis.speak(u);
			} catch (e) {
				if (tried === 0) { tried++; try { await this.ensureAudioUnlocked(); } catch(e){}; try { window.speechSynthesis.speak(u); } catch(e2){ return resolve(); } }
				else return resolve();
			}
		});
	}

	_getPreferredLangCode() {
		const short = this.preferredLang || 'en';
		const map = {
			'en': 'en-US',
			'es': 'es-ES',
			'zh': 'zh-CN',
			'fr': 'fr-FR'
		};
		if (map[short]) return map[short];
		// if already a locale-like code, return as-is
		if (short && short.indexOf('-') !== -1) return short;
		return 'en-US';
	}

	_playAudioBase64(base64Audio) {
		return new Promise((resolve, reject) => {
			try {
				const binary = atob(base64Audio);
				const len = binary.length;
				const bytes = new Uint8Array(len);
				for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
				const blob = new Blob([bytes], { type: 'audio/mpeg' });
				const url = URL.createObjectURL(blob);
				const a = new Audio(url);
				a.addEventListener('ended', () => { try { URL.revokeObjectURL(url); } catch (e) {} resolve(); });
				a.addEventListener('error', (e) => { try { URL.revokeObjectURL(url); } catch (e) {} reject(e); });
				// Attempt to play; some browsers require user gesture — handle rejection
				const p = a.play();
				if (p && p.then) p.then(() => {}).catch(() => {});
				// If play() didn't error, resolve when ended via event
			} catch (e) { reject(e); }
		});
	}

	// speakBingo removed by request: audio announcements for bingo are deleted.
	// If code elsewhere still calls `this.speakBingo(...)`, these calls should be
	// no-ops. The function was intentionally removed to eliminate bingo audio.
	// (Left as a marker comment to indicate the deletion.)

	// Speak an array of words sequentially, then optionally announce bingo
	// source: optional string 'player'|'ai' forwarded to speakBingo when called
	speakSequence(words = [], speakBingoAfter = false, source = 'ai') {
		return new Promise(async (resolve) => {
			try {
				if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
					if (speakBingoAfter && typeof this.speakBingo === 'function') this.speakBingo(source);
					return resolve();
				}
				if (!words || words.length === 0) {
					if (speakBingoAfter) {
						if (typeof this.speakBingo === 'function') this.speakBingo(source);
						setTimeout(resolve, 500);
					} else {
						return resolve();
					}
				}
				// speak each word serially using speakWithRetry
				for (let idx = 0; idx < words.length; idx++) {
					let text = words[idx];
					// If bingo should be announced, append it to the first spoken word so it's not a separate utterance
					if (speakBingoAfter && idx === 0 && text && text.length > 0) {
						text = text + ' Bingo bonus!';
					}
					try {
						await this._speakWithRetry(text, { lang: this._getPreferredLangCode() });
					} catch (e) {
						console.warn('speakSequence word failed', text, e);
						try { this.appendConsoleMessage('speakSequence word failed: '+text); } catch(e){}
					}
				}
				if (speakBingoAfter) {
					// small gap then bingo
					setTimeout(async () => {
						if (typeof this.speakBingo === 'function') {
							// speakBingo will still attempt TTS and visuals
							try { this.speakBingo(source); } catch (e) { console.warn('speakBingo call failed', e); }
						}
						setTimeout(resolve, 500);
					}, 180);
				} else {
					resolve();
				}
			} catch (e) {
				console.debug('speakSequence TTS failed, using browser fallback');
				try { this.appendConsoleMessage('speakSequence failed'); } catch(e){}
				if (speakBingoAfter && typeof this.speakBingo === 'function') this.speakBingo(source);
				resolve();
			}
		});
	}

	// confettiSplash removed by request: visual confetti has been deleted.
	// If code elsewhere still calls `this.confettiSplash()`, these calls will
	// now throw unless the references are removed; consider removing or
	// guarding calls to avoid runtime errors.

	async playWord() {
		console.log('playWord invoked', { placedTiles: this.placedTiles && this.placedTiles.map(p=>({r:p.row,c:p.col,letter:p.tile && p.tile.letter})), currentTurn: this.currentTurn });
		// Show a spinner or disable the submit button for better UX
		const playWordBtn = document.getElementById("play-word-desktop") || document.getElementById("play-word");
		if (playWordBtn) {
			playWordBtn.disabled = true;
			playWordBtn.textContent = "Checking...";
		}
		// Let UI update
		await new Promise(res => setTimeout(res, 30));

		// Ensure speech is primed on mobile right after a direct user action (playWord)
		try {
			// If player placed 7 or more tiles this move, pre-announce Bingo inside this user gesture
			try {
				// Detect bingo either by placing 7+ tiles or by forming any word of length >= 7
				let bingoCandidate = false;
				try {
					if (this.currentTurn === 'player') {
						if (this.placedTiles && this.placedTiles.length >= 7) bingoCandidate = true;
						// Also check formed words (covers extensions that create bingo using existing tiles)
						try {
							const formed = this.getFormedWords && this.getFormedWords();
							if (Array.isArray(formed)) {
								for (const wi of formed) {
									if (wi && wi.word && wi.word.length >= 7) { bingoCandidate = true; break; }
								}
							}
						} catch(e) { /* ignore formedWords check */ }
					}
				} catch (e) { /* ignore detection errors */ }
				if (bingoCandidate) {
					// prevent duplicates within the same move
					if (!this._playerBingoAnnounced) {
						this._playerBingoAnnounced = true;
						try {
							// call robust speaker directly inside gesture with retries
							// Try to create and speak an utterance synchronously inside the user gesture first.
							try {
								if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
										try {
											const pref = this._getPreferredVoice && this._getPreferredVoice(this._getPreferredLangCode && this._getPreferredLangCode());
										// Play a short audible beep to unlock audio on stubborn Android builds
										try {
											const actx = new (window.AudioContext || window.webkitAudioContext)();
											const osc = actx.createOscillator();
											const gain = actx.createGain();
											osc.type = 'sine';
											osc.frequency.setValueAtTime(880, actx.currentTime);
											// Make priming effectively silent to avoid audible beep on submit
											// Keep a tiny nonzero gain so some browsers still consider audio unlocked
											gain.gain.setValueAtTime(0.00001, actx.currentTime);
											osc.connect(gain);
											gain.connect(actx.destination);
											osc.start();
											setTimeout(() => { try { osc.stop(); actx.close(); } catch(_){} }, 70);
										} catch (e) {
											// ignore audio unlock failure
										}
										// Speak 'Bingo' and 'bonus!' as two synchronous utterances inside gesture
										try {
											const prefLang = this._getPreferredLangCode();
											const b1 = new SpeechSynthesisUtterance('Bingo');
											b1.lang = prefLang;
											if (pref) try { b1.voice = pref; } catch(_){ }
											const b2 = new SpeechSynthesisUtterance('bonus!');
											b2.lang = prefLang;
											if (pref) try { b2.voice = pref; } catch(_){ }
											window.speechSynthesis.speak(b1);
											// small gap before second utterance
											setTimeout(() => { try { window.speechSynthesis.speak(b2); } catch(_){}; }, 130);
											this.appendConsoleMessage('In-gesture utterances spoken: Bingo | bonus!');
											this._submitStartedSpeak = true;
										} catch (e) {
											console.warn('sync in-gesture speak failed', e);
										}
									} catch (e) { /* ignore */ }
								}
							} catch(e) { /* silence */ }

							(async () => {
								const maxRetries = 2; // additional attempts after the in-gesture call
								let attempt = 0;
								let success = false;
								while (attempt <= maxRetries && !success) {
									attempt++;
									try {
										this.appendConsoleMessage(`Bingo speak attempt ${attempt}`);
										// Only try speaking if nothing is currently queued/playing
										if (!(typeof window !== 'undefined' && 'speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending))) {
											await this._speakWithRetry('Bingo bonus!', { lang: 'en-US' });
										}
										// small delay to let speech start
										await new Promise(r => setTimeout(r, 220));
										if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
											if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
												success = true; break;
											}
										}
										// if not speaking, loop to retry
									} catch (e) {
										console.warn('inline bingo speak failed attempt', attempt, e);
										try { this.appendConsoleMessage('inline bingo speak failed: '+(e && e.message)); } catch(_){ }
									}
									// small backoff before next try
									await new Promise(r => setTimeout(r, 360));
								}
								if (!success) {
									// Offer a manual replay control in the drawer console so the user can tap to hear bingo.
									try { this.appendConsoleMessage('Bingo speech did not start after retries — tap "Hear Bingo" in the console to replay.'); } catch(_){}
									try { this.offerBingoReplayInConsole(); } catch(_){}
								}
							})();
						} catch (e) { console.warn('failed to start inline bingo speak', e); }
					}
				}
			} catch (e) { console.warn('bingo preannounce guard failed', e); }

			if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
				// Try a robust unlock helper that resumes AudioContext and loads voices where possible
				try { await this.ensureAudioUnlocked(); } catch(e) { console.debug('playWord priming: ensureAudioUnlocked failed', e); }
			}
		} catch (e) {
			console.warn('playWord priming failed', e);
		}

		try {
			if (this.placedTiles.length === 0) {
				alert("Please place some tiles first!");
				return;
			}

			console.log('areTilesConnected?', this.areTilesConnected());

			if (!this.areTilesConnected()) {
				alert("Tiles must be connected and in a straight line!");
				this.resetPlacedTiles();
				return;
			}

			// Validate the word(s) asynchronously
			const isValid = await (async () => this.validateWord())();
			console.log('validateWord result:', isValid);
			// If validation failed and we had started inline speech, stop it to avoid orphaned audio
			if (!isValid && this._submitStartedSpeak) {
				try { window.speechSynthesis && window.speechSynthesis.cancel && window.speechSynthesis.cancel(); } catch(e) {}
				this._submitStartedSpeak = false;
				this._inlineSpeakPromise = null;
			}
			if (isValid) {
				// Use the robust scoring logic
				const totalScore = this.calculateScore();

				// Get all formed words for move description and attach per-word scores
				const formedWords = this.getFormedWords();
				let wordDescriptions = [];

				// Prefer structured scores from the most recent calculateScore() call
				const lastScored = Array.isArray(this._lastScoredWords) ? [...this._lastScoredWords] : [];

				for (const wordInfo of formedWords) {
					let scoreForWord = null;
					// Try to find matching entry in lastScored (match by word, case-insensitive)
					if (lastScored.length > 0) {
						const idx = lastScored.findIndex(w => w.word && w.word.toUpperCase() === wordInfo.word.toUpperCase());
						if (idx !== -1) {
							scoreForWord = lastScored[idx].score;
							lastScored.splice(idx, 1);
						}
					}

					// Fallback: compute score directly (ensure newly placed set is available)
					if (scoreForWord === null) {
						try {
							this._scoringNewlyPlacedSet = new Set((this.placedTiles || []).map(t => `${t.row},${t.col}`));
							scoreForWord = this.calculateWordScore(wordInfo.word, wordInfo.startPos.row, wordInfo.startPos.col, wordInfo.direction === 'horizontal');
						} catch (e) {
							console.warn('Failed to compute per-word score fallback', e);
							scoreForWord = null;
						} finally {
							this._scoringNewlyPlacedSet = null;
						}
					}

					wordDescriptions.push({ word: wordInfo.word, score: scoreForWord });
				}

		// Add bonus when the player actually used 7 or more newly placed tiles for a word
		let bingoBonusAwarded = false;
		let playerBingoVariant = 'standard'; // 'standard' (7), 'silver' (8), 'gold' (9+)
		formedWords.forEach(wordInfo => {
			const len = wordInfo.word.length;
			let newlyPlacedCount = 0;
			for (let k = 0; k < len; k++) {
				const row = wordInfo.direction === 'horizontal' ? wordInfo.startPos.row : wordInfo.startPos.row + k;
				const col = wordInfo.direction === 'horizontal' ? wordInfo.startPos.col + k : wordInfo.startPos.col;
				if (this.placedTiles.some(t => t.row === row && t.col === col)) newlyPlacedCount++;
			}

			// Check for bingo bonus conditions: 7+ letter word OR score > 50
			if (wordInfo.word.length >= 7 || wordInfo.score > 50) {
				wordDescriptions.push({ word: "BINGO BONUS", score: 50 });
				console.log(`[Player] Added 50 point bonus for ${wordInfo.score > 50 ? 'high scoring' : wordInfo.word.length + '-letter'} word: ${wordInfo.word}`);
				bingoBonusAwarded = true;
				// choose variant based on longest bingo word encountered this move
				if (len >= 9) playerBingoVariant = 'gold';
				else if (len === 8 && playerBingoVariant !== 'gold') playerBingoVariant = 'silver';
				console.log('[Player] BINGO DETECTED', { len, playerBingoVariant });
				console.log('[Debug] wordDescriptions now:', wordDescriptions);
			}
		});

				// Format the move description
				let moveDescription;
				if (wordDescriptions.length > 1) {
					moveDescription = wordDescriptions.map((w) => w.word).join(" & ");
				} else {
					moveDescription = wordDescriptions[0].word;
				}

				// Speak each word formed sequentially. To guarantee the player hears the bingo
				// announcement, speak the bingo immediately if awarded, then speak the words
				// (we pass speakBingoAfter = false to avoid duplicate announcements).
				const playerWordsToSpeak = wordDescriptions.map(w => w.word).filter(w => w && w !== "BINGO BONUS");
				try {
					console.log('[Speech] About to handle speakSequence for player', {playerWordsToSpeak, bingoBonusAwarded, submitStarted: this._submitStartedSpeak});
					if (this._submitStartedSpeak) {
						// inline speak started during the click gesture — wait for it to finish
						if (this._inlineSpeakPromise) await this._inlineSpeakPromise;
						// ensure flags cleared
						this._submitStartedSpeak = false;
						this._inlineSpeakPromise = null;
					} else {
						// Attempt to ensure audio is unlocked for mobile platforms
						try { await this.ensureAudioUnlocked(); } catch (e) { /* continue */ }
						let spoke = false;
						try {
							await this.speakSequence(playerWordsToSpeak, bingoBonusAwarded, 'player');
							spoke = true;
						} catch (e) {
							console.warn('player speakSequence failed', e);
						}
						// If TTS didn't run (common on some Androids), fallback to a WebAudio beep for bingo
						if (bingoBonusAwarded && !spoke) {
							try {
								this.playBeep(420, 880);
							} catch (e) { console.warn('playBeep fallback failed', e); }
						}
					}
					// Player-only visual celebration (confetti/emoji)
					if (bingoBonusAwarded) {
						// Use the same reliable confetti path as computer bingo, but pass variant
						try {
							if (typeof this.showBingoBonusEffect === 'function') {
								this.showBingoBonusEffect(false, playerBingoVariant);
							} else if (typeof this.createConfettiEffect === 'function') {
								this.createConfettiEffect({ variant: playerBingoVariant });
							}
							// Add celebratory splash after a tiny delay
							setTimeout(() => {
								if (typeof this.createBingoSplash === 'function') {
									try { this.createBingoSplash(playerBingoVariant); } catch(e) { console.warn('Bingo splash skipped', e); }
								}
							}, 180);
						} catch (e) { console.error('Player bingo effect failed', e); }
					}
				} catch (e) {
					console.debug('Player TTS failed, using browser speech synthesis');
				}

				// Update game state
				this.playerScore += totalScore;
				this.isFirstMove = false;
				this.placedTiles = [];
				this.fillRacks();
				this.consecutiveSkips = 0;
				this.currentTurn = "ai";
				await this.updateGhostPreview();

				// Pass structured wordDescriptions (array of {word,score}) so move history shows per-word scores
				this.addToMoveHistory("Player", wordDescriptions, totalScore);
				this.updateGameState();

				// bingo (if any) already spoken by speakSequence; no further action needed

				// --- GHOST PREVIEW: Show AI's next move as ghost tiles ---
				if (!this.checkGameEnd()) {
					await this.aiTurn();
				}
			} else {
				// Show an animated toast for invalid words
				try { 
					const lang = this.preferredLang || (typeof localStorage !== 'undefined' && localStorage.getItem('preferredLang')) || 'en';
					const invalidMsg = getTranslation('invalidWords', lang);
					if (typeof this.showAnimatedToast === 'function') {
						this.showAnimatedToast(invalidMsg, 'error');
					} else if (this.showToast) {
						this.showToast(invalidMsg);
					}
				} catch(e) { 
					console.warn('Toast display failed:', e);
				}
				this.resetPlacedTiles();
			}
		} finally {
			// Restore button state
			if (playWordBtn) {
				playWordBtn.disabled = false;
				playWordBtn.textContent = "Submit";
			}

			// reset transient announce flag so future moves can announce again
			try { this._playerBingoAnnounced = false; } catch (e) {}
		}
	}

	// words may be:
	// - a string like "SKIP"/"EXCHANGE"/single word
	// - an array of {word, score} for multiple words scored in one move
	addToMoveHistory(player, words, score) {
		// Prevent duplicate entries by checking the last move
		const lastMove = this.moveHistory[this.moveHistory.length - 1];
		if (lastMove && lastMove.player === player && JSON.stringify(lastMove.words || lastMove.word) === JSON.stringify(words) && lastMove.score === score) {
			return; // Skip adding duplicate move
		}

		const entry = {
			player,
			timestamp: new Date(),
		};

		if (Array.isArray(words)) {
			// Structured words with individual scores
			entry.words = words.map(w => ({ word: w.word, score: typeof w.score === 'number' ? w.score : null }));
			// compute total if score not provided
			entry.score = typeof score === 'number' ? score : entry.words.reduce((s, w) => s + (w.score || 0), 0);
		} else {
			// legacy string entry
			entry.word = words;
			entry.score = typeof score === 'number' ? score : 0;
		}

		this.moveHistory.push(entry);
		this.updateMoveHistory();
	}

	updateMoveHistory() {
		// Update both mobile and desktop history displays
		const historyDisplay = document.getElementById("move-history");
		const historyDisplayDesktop = document.getElementById("move-history-desktop");
		const currentLang = localStorage.getItem('preferredLang') || 'en';
		
		// Helper function to create word display with speech button
		const createWordDisplay = (word, score, isMultiple = false) => {
			const translatedWord = translateWordForDisplay(word, currentLang);
			const speechButton = `<button class="speech-btn" onclick="game._handleSpeechClick('${word}')" title="Speak '${word}' in English" style="background:none;border:none;cursor:pointer;font-size:0.8em;margin-left:2px;display:inline-block;width:auto;padding:0 2px;">🔊</button>`;
			const scoreText = score > 0 ? `(${score}pt)` : '';
			return `"${translatedWord}"${scoreText}${speechButton}`;
		};

		// Populate history content
		const historyContent = this.moveHistory
			.map((move) => {
				const playerLabel = getTranslation(move.player && move.player.toLowerCase() === 'computer' ? 'computer' : 'player', currentLang) || move.player;
				if (Array.isArray(move.words)) {
					const wordsDisplay = move.words.map(w => createWordDisplay(w.word, w.score || 0, true)).join(", ");
					return `<div class="move" style="margin-bottom:6px; padding:4px; border-bottom:1px solid #ddd;">${playerLabel}: ${wordsDisplay} = ${move.score}pts</div>`;
				} else if (move.word) {
					const raw = String(move.word);
					const rawUpper = raw.toUpperCase();
					// Special-case SKIP: localized label, no points shown
					if (rawUpper === 'SKIP') {
						const label = getTranslation('skip', currentLang) || raw;
						return `<div class="move" style="margin-bottom:6px; padding:4px; border-bottom:1px solid #ddd;">${playerLabel}: ${label}</div>`;
					}
					// Special-case EXCHANGE / AI exchange messages: localized label, no points shown
					if (rawUpper === 'EXCHANGE' || raw.toLowerCase().includes('exchange')) {
						const isAI = /ai|computer/i.test(raw);
						const label = isAI ? getTranslation('aiExchanged', currentLang) : getTranslation('exchange', currentLang) || raw;
						return `<div class="move" style="margin-bottom:6px; padding:4px; border-bottom:1px solid #ddd;">${playerLabel}: ${label}</div>`;
					}
					// Default: show translated word with speech button; show points only if > 0
					const display = translateWordForDisplay(raw, currentLang);
					const speechButton = `<button class="speech-btn" onclick="game._handleSpeechClick('${raw}')" title="Speak '${raw}' in English" style="background:none;border:none;cursor:pointer;font-size:0.8em;margin-left:2px;display:inline-block;width:auto;padding:0 2px;">🔊</button>`;
					if (typeof move.score === 'number' && move.score > 0) {
						return `<div class="move" style="margin-bottom:6px; padding:4px; border-bottom:1px solid #ddd;">${playerLabel}: "${display}"(${move.score}pt)${speechButton} = ${move.score}pts</div>`;
					} else {
						return `<div class="move" style="margin-bottom:6px; padding:4px; border-bottom:1px solid #ddd;">${playerLabel}: "${display}"${speechButton}</div>`;
					}
				} else {
					return `<div class="move" style="margin-bottom:6px; padding:4px; border-bottom:1px solid #ddd;">${move.player}: ${move.word || 'move'} = ${move.score}pts</div>`;
				}
			})
			.join("");
		
		if (historyDisplay) historyDisplay.innerHTML = historyContent;
		if (historyDisplayDesktop) historyDisplayDesktop.innerHTML = historyContent;
	}

	updateGameState() {
		this.updateScores();
		this.updateTilesCount();
		this.updateTurnIndicator();
	}

	updateScores() {
		// Update mobile, desktop, and desktop drawer score displays
		const playerScoreMobile = document.getElementById("player-score");
		const computerScoreMobile = document.getElementById("computer-score");
		const playerScoreDesktop = document.getElementById("player-score-desktop");
		const computerScoreDesktop = document.getElementById("computer-score-desktop");
		const playerScoreDesktopDrawer = document.getElementById("player-score-desktop-drawer");
		const computerScoreDesktopDrawer = document.getElementById("computer-score-desktop-drawer");
		
		if (playerScoreMobile) playerScoreMobile.textContent = this.playerScore;
		if (computerScoreMobile) computerScoreMobile.textContent = this.aiScore;
		if (playerScoreDesktop) playerScoreDesktop.textContent = this.playerScore;
		if (computerScoreDesktop) computerScoreDesktop.textContent = this.aiScore;
		if (playerScoreDesktopDrawer) playerScoreDesktopDrawer.textContent = this.playerScore;
		if (computerScoreDesktopDrawer) computerScoreDesktopDrawer.textContent = this.aiScore;
	}

	updateTilesCount() {
		// Update mobile, desktop, and desktop drawer tile count displays
		const tilesCountMobile = document.getElementById("tiles-count");
		const tilesCountDesktop = document.getElementById("tiles-count-desktop");
		const tilesCountDesktopDrawer = document.getElementById("tiles-count-desktop-drawer");
		
		if (tilesCountMobile) tilesCountMobile.textContent = this.tiles.length;
		if (tilesCountDesktop) tilesCountDesktop.textContent = this.tiles.length;
		if (tilesCountDesktopDrawer) tilesCountDesktopDrawer.textContent = this.tiles.length;
	}

	updateTurnIndicator() {
		const turnDisplay =
			document.getElementById("current-turn") || this.createTurnIndicator();
		const lang = this.preferredLang || 'en';
		const t = (key) => getTranslation(key, lang);
		const playerText = this.currentTurn === "player" ? t('yourTurn') : t('computerTurn');
		turnDisplay.textContent = `${t('currentTurn')}: ${playerText}`;
		turnDisplay.className =
			this.currentTurn === "player" ? "player-turn" : "ai-turn";
	}

	createTurnIndicator() {
		const turnDisplay = document.createElement("div");
		turnDisplay.id = "current-turn";

		// Try mobile first, then desktop panels
		const mobilePanel = document.querySelector(".info-panel");
		const desktopPanel = document.querySelector(".desktop-info-panel");

		if (mobilePanel) {
			mobilePanel.prepend(turnDisplay);
		} else if (desktopPanel) {
			desktopPanel.prepend(turnDisplay);
		} else {
			// Fallback: add to body
			document.body.appendChild(turnDisplay);
		}

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
		// Stop ghost thinking when game ends
		this.stopGhostUpdates();

		// --- 1. Sum up points from move history for each player ---
		let playerScore = 0;
		let aiScore = 0;

		this.moveHistory.forEach(move => {
			if (move.player === "Player") playerScore += move.score;
			if (move.player === "Computer") aiScore += move.score;
		});

		// --- 2. Calculate leftover tile points for both players ---
		let playerLeftover = 0;
		let aiLeftover = 0;

		this.playerRack.forEach(tile => {
			playerLeftover += tile.value || 0;
		});
		this.aiRack.forEach(tile => {
			aiLeftover += tile.value || 0;
		});

		// --- 3. Apply official Scrabble endgame adjustment ---
		// Only apply endgame bonus/penalty if one player is out of tiles
		if (this.playerRack.length === 0 && this.aiRack.length > 0) {
			// Player used all tiles: player gets AI's leftover, AI loses their leftover
			playerScore += aiLeftover;
			aiScore -= aiLeftover;
		} else if (this.aiRack.length === 0 && this.playerRack.length > 0) {
			// AI used all tiles: AI gets player's leftover, player loses their leftover
			aiScore += playerLeftover;
			playerScore -= playerLeftover;
		} else {
			// Both have tiles left: just subtract their own leftovers
			playerScore -= playerLeftover;
			aiScore -= aiLeftover;
		}

		// Prevent negative scores
		playerScore = Math.max(0, playerScore);
		aiScore = Math.max(0, aiScore);

		// Set the scores for display
		this.playerScore = playerScore;
		this.aiScore = aiScore;

		// Update scores before animation
		this.updateScores();

		const winner = this.playerScore > this.aiScore ? "Player" : "Computer";
		const finalScore = Math.max(this.playerScore, this.aiScore);

		// Use the existing overlay from HTML
		let winOverlay = document.getElementById("win-lose-overlay");
		if (!winOverlay) {
			// Fallback: create overlay if not found (shouldn't happen)
			winOverlay = document.createElement("div");
			winOverlay.className = "win-overlay";
			winOverlay.id = "win-lose-overlay";
			const messageBox = document.createElement("div");
			messageBox.className = "win-message";
			winOverlay.appendChild(messageBox);
			document.body.appendChild(winOverlay);
		}

		// Get the message box
		const messageBox = winOverlay.querySelector(".win-message");
		// Insert the close button and content
		messageBox.innerHTML = `
			<button class="overlay-close-btn" aria-label="Close">&times;</button>
			<h2 style="color: ${winner === "Computer" ? "#ff3333" : "#33cc33"}; margin-bottom: 20px;">Game Over!</h2>
			<p style="font-size: 1.2em; margin-bottom: 15px;">${winner} wins with ${finalScore} points!</p>
			<p style="font-weight: bold; margin-bottom: 10px;">Final Scores:</p>
			<p>Player: ${this.playerScore}</p>
			<p>Computer: ${this.aiScore}</p>
			<p style="margin-top:10px;font-size:1em;">
				<strong>Leftover tiles:</strong><br>
				Player lost ${playerLeftover} point${playerLeftover === 1 ? '' : 's'} for leftover tiles.<br>
				Computer lost ${aiLeftover} point${aiLeftover === 1 ? '' : 's'} for leftover tiles.
			</p>
			<button onclick="location.reload()" 
					style="padding: 10px 20px; 
						margin-top: 20px; 
						background-color: #4CAF50; 
						color: white; 
						border: none; 
						border-radius: 5px; 
						cursor: pointer;
						font-size: 1.1em;">
				Play Again
			</button>
		`;

		// Remove any previous classes
		winOverlay.classList.remove("active", "lose");
		messageBox.classList.remove("celebrate");

		// Add appropriate classes
		if (winner === "Computer") {
			winOverlay.classList.add("lose");
		}

		// Attach close event to the button (since innerHTML replaced it)
		const overlayCloseBtn = winOverlay.querySelector('.overlay-close-btn');
		if (overlayCloseBtn) {
			overlayCloseBtn.onclick = (e) => {
				e.stopPropagation();
				winOverlay.classList.remove("active", "lose");
				winOverlay.style.display = "none";
			};
		}

		// Show the overlay with animation
		winOverlay.style.display = "";
		requestAnimationFrame(() => {
			winOverlay.classList.add("active");
			messageBox.classList.add("celebrate");
			if (typeof this.showBingoBonusEffect === 'function') {
				try { this.showBingoBonusEffect(); } catch (e) { console.warn('showBingoBonusEffect failed', e); }
			} else {
				try { this.createConfettiEffect(); } catch (e) { console.warn('createConfettiEffect failed', e); }
			}
		});
	}

	createConfettiEffect(options = {}) {
		// Simplified: only use emoji confetti for one clean splash
		options = options || {};
		const variant = options.variant || 'standard';

		try {
			// Simplified: only use emoji confetti for one clean splash
			if (typeof this.createEmojiConfetti === 'function') {
				const defaultEmojis = variant === 'gold' ? ['🏆','🎖️','🌟','🎉','🎊','✨','🥇','👑','💎','🌟'] :
									 variant === 'silver' ? ['🎉','🎊','✨','🥳','🎈','🥈','🎖️','🥈','🌙','💫'] :
									 variant === 'rainbow' ? ['🌈','🎨','🎭','🎪','🎡','🎢','🎨','🌟','💫','✨','🎨'] :
									 variant === 'party' ? ['🎉','🎊','🎈','🎂','🎁','🎀','🎶','🎵','🥳','🎈','🎊','🎂'] :
									 variant === 'celebration' ? ['🎉','🎊','🎆','🎇','✨','🌟','💫','⭐','🎆','🎇','🎊','🎉'] :
									 variant === 'winter' ? ['❄️','⛄','🎄','🎅','🔔','🎁','🕯️','🎄','❄️','🎅','⛄'] :
									 variant === 'hearts' ? ['❤️','💖','💕','💗','💓','💘','💝','💞','💟','💌'] :
									 variant === 'stars' ? ['⭐','🌟','✨','💫','🌠','🎇','🎆','🎊','🎉','✨'] :
									 variant === 'fireworks' ? ['🎆','🎇','✨','💥','🎆','🎇','🎆','🎇','✨','💫'] :
									 variant === 'nature' ? ['🌸','🌺','🌻','🌹','🌷','🌼','🌻','🌺','🌸','🌼'] :
									 variant === 'animals' ? ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯'] :
									 variant === 'food' ? ['🍕','🍔','🍟','🌭','🍿','🍩','🍪','🍰','🧁','🍭'] :
									 ['🎉','🎊','✨','🥳','🎈','😊','🎯','🎪','🌟','💫','⭐'];

				this.createEmojiConfetti({ emojis: defaultEmojis, variant });
			}
		} catch (e) { console.warn('createConfettiEffect failed', e); }
	}

	// Canvas-based confetti: lightweight particle simulation drawn into a single canvas.
	createCanvasConfetti(options = {}) {
		try {
			if (this._canvasConfettiActive) return;
			this._canvasConfettiActive = true;
			const variant = options.variant || 'standard';
			const count = options.count || (window.innerWidth > 720 ? (variant === 'gold' ? 280 : variant === 'silver' ? 220 : variant === 'rainbow' ? 300 : variant === 'party' ? 320 : variant === 'celebration' ? 340 : variant === 'winter' ? 260 : 180) : (variant === 'gold' ? 150 : variant === 'silver' ? 120 : variant === 'rainbow' ? 160 : variant === 'party' ? 170 : variant === 'celebration' ? 180 : variant === 'winter' ? 140 : 90));
			const duration = options.duration || (variant === 'gold' ? 4200 : variant === 'silver' ? 3800 : variant === 'rainbow' ? 4500 : variant === 'party' ? 4800 : variant === 'celebration' ? 5000 : variant === 'winter' ? 4600 : 3500);
			const canvas = document.createElement('canvas');
			canvas.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:100000';
			canvas.width = window.innerWidth * devicePixelRatio;
			canvas.height = window.innerHeight * devicePixelRatio;
			canvas.style.width = window.innerWidth + 'px';
			canvas.style.height = window.innerHeight + 'px';
			document.body.appendChild(canvas);
			const ctx = canvas.getContext('2d');

			const colors = options.colors || (variant === 'gold' ? ['#FFD700','#FFC107','#FFAB40','#FF4081','#FFE082'] :
											variant === 'silver' ? ['#C0C0C0','#90A4AE','#448AFF','#FFAB40','#B0BEC5'] :
											variant === 'rainbow' ? ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'] :
											variant === 'party' ? ['#FF4081','#448AFF','#00E676','#FFD700','#FFAB40','#EA80FC','#FF5722'] :
											variant === 'celebration' ? ['#FFD700','#FF4081','#00E676','#448AFF','#FFAB40','#8E44AD','#FFC107'] :
											variant === 'winter' ? ['#E3F2FD','#BBDEFB','#90CAF9','#42A5F5','#1E88E5','#1565C0','#0D47A1'] :
											['#FFD700','#FF4081','#00E676','#448AFF','#FFAB40','#8E44AD']);
			const particles = [];
			for (let i=0;i<count;i++) {
				particles.push({
					x: Math.random() * canvas.width,
					y: -Math.random() * canvas.height * 0.2,
					size: (4 + Math.random() * 10) * devicePixelRatio,
					vx: (Math.random() - 0.5) * 2 * devicePixelRatio,
					vy: (2 + Math.random() * 4) * devicePixelRatio,
					angle: Math.random() * Math.PI * 2,
					spin: (Math.random() - 0.5) * 0.2,
					color: colors[Math.floor(Math.random()*colors.length)]
				});
			}

			let start = performance.now();
			const raf = (now) => {
				const t = now - start;
				ctx.clearRect(0,0,canvas.width,canvas.height);
				for (let p of particles) {
					p.x += p.vx;
					p.y += p.vy + 0.05 * devicePixelRatio; // gentle gravity
					p.vy *= 0.998;
					p.angle += p.spin;
					ctx.save();
					ctx.translate(p.x, p.y);
					ctx.rotate(p.angle);
					ctx.fillStyle = p.color;
					ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
					ctx.restore();
				}
				if (t < duration) requestAnimationFrame(raf);
				else {
					try { canvas.remove(); } catch(e){}
					this._canvasConfettiActive = false;
				}
			};
			requestAnimationFrame(raf);
		} catch (e) { console.warn('createCanvasConfetti failed', e); this._canvasConfettiActive = false; }
	}

	// DOM-based confetti: many small elements with simple CSS transforms/transitions.
	createDOMConfetti(options = {}) {
		try {
			if (this._domConfettiActive) return;
			this._domConfettiActive = true;
			const variant = options.variant || 'standard';
			const baseCount = Math.max(60, Math.min(220, Math.floor(window.innerWidth / 6)));
			const count = options.count || (variant === 'gold' ? Math.min(480, Math.floor(baseCount * 1.8)) : variant === 'silver' ? Math.min(380, Math.floor(baseCount * 1.4)) : variant === 'rainbow' ? Math.min(520, Math.floor(baseCount * 2.0)) : variant === 'party' ? Math.min(540, Math.floor(baseCount * 2.1)) : variant === 'celebration' ? Math.min(560, Math.floor(baseCount * 2.2)) : variant === 'winter' ? Math.min(420, Math.floor(baseCount * 1.6)) : baseCount);
			const colors = options.colors || (variant === 'gold' ? ['#FFD700','#FFC107','#FFAB40','#FF4081','#FFE082'] :
											variant === 'silver' ? ['#C0C0C0','#90A4AE','#448AFF','#FFAB40','#B0BEC5'] :
											variant === 'rainbow' ? ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3'] :
											variant === 'party' ? ['#FF4081','#448AFF','#00E676','#FFD700','#FFAB40','#EA80FC','#FF5722'] :
											variant === 'celebration' ? ['#FFD700','#FF4081','#00E676','#448AFF','#FFAB40','#8E44AD','#FFC107'] :
											variant === 'winter' ? ['#E3F2FD','#BBDEFB','#90CAF9','#42A5F5','#1E88E5','#1565C0','#0D47A1'] :
											['#FFD700','#FF4081','#00E676','#448AFF','#FFAB40','#8E44AD']);
			const container = document.createElement('div');
			container.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;overflow:hidden;z-index:100000';
			document.body.appendChild(container);
			for (let i=0;i<count;i++) {
				const el = document.createElement('div');
				const size = 6 + Math.random() * 18;
				el.style.cssText = `position:absolute;left:${Math.random()*100}vw;top:-30px;width:${size}px;height:${size*0.6}px;background:${colors[Math.floor(Math.random()*colors.length)]};border-radius:2px;transform:rotate(${Math.random()*360}deg);opacity:1;transition:transform ${1.8 + Math.random()*1.2}s cubic-bezier(.2,.8,.2,1), top ${1.8 + Math.random()*1.2}s ease-out, opacity ${1.6 + Math.random()*1.2}s ease-out;`;
				container.appendChild(el);
				setTimeout(() => {
					const dx = (Math.random()*1 - 0.5) * window.innerWidth * 0.6;
					const dy = window.innerHeight * (0.45 + Math.random()*0.4);
					el.style.top = dy + 'px';
					el.style.transform = `translateX(${dx}px) rotate(${Math.random()*1080}deg) translateY(0)`;
					el.style.opacity = '0';
				}, 20 + Math.random()*160);
				setTimeout(() => el.remove(), 3200 + Math.random()*1500);
			}
			setTimeout(() => { try { container.remove(); } catch(e){} this._domConfettiActive = false; }, 3800 + Math.random()*1800);
		} catch (e) { console.warn('createDOMConfetti failed', e); this._domConfettiActive = false; }
	}

	// Lightweight bingo splash used for player-only celebrations
	// variant: 'standard' | 'silver' | 'gold'
	createBingoSplash(variant = 'standard') {
		// Subtle guard if called excessively
		try {
			this.appendConsoleMessage && this.appendConsoleMessage('createBingoSplash() called');
		} catch (e) {}
		if (this._bingoSplashActive) {
			try { this.appendConsoleMessage('createBingoSplash() skipped: _bingoSplashActive true'); } catch(e){}
			return;
		}
		this._bingoSplashActive = true;
		try {
			let emojis = ["🎉","🎊","✨","🌟","💫","🎈","🥳"];
			let colors = ["#FFD700","#FF4081","#00E676","#448AFF","#FFAB40","#EA80FC"];
			// Tune visuals based on variant
			if (variant === 'silver') {
				emojis = ["🎉","🎖️","✨","🌟","🎊","🥈","🥳"];
				colors = ["#C0C0C0","#B0BEC5","#90A4AE","#448AFF","#FFAB40","#90CAF9"];
			} else if (variant === 'gold') {
				emojis = ["🏆","🎖️","🌟","✨","🎉","🥇","🎊"];
				colors = ["#FFD700","#FFB300","#FFC107","#FFAB40","#FF4081","#FFE082"];
			} else if (variant === 'rainbow') {
				emojis = ["🌈","🎨","🎭","🎪","🎡","🎢","🌟"];
				colors = ["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082","#9400D3"];
			} else if (variant === 'party') {
				emojis = ["🎉","🎊","🎈","🎂","🎁","🎀","🎶","🎵"];
				colors = ["#FF4081","#448AFF","#00E676","#FFD700","#FFAB40","#EA80FC","#FF5722"];
			} else if (variant === 'celebration') {
				emojis = ["🎉","🎊","🎆","🎇","✨","🌟","💫","⭐"];
				colors = ["#FFD700","#FF4081","#00E676","#448AFF","#FFAB40","#8E44AD","#FFC107"];
			} else if (variant === 'winter') {
				emojis = ["❄️","⛄","🎄","🎅","🔔","🎁","🕯️"];
				colors = ["#E3F2FD","#BBDEFB","#90CAF9","#42A5F5","#1E88E5","#1565C0","#0D47A1"];
			}

			// Overlay flash
			const overlay = document.createElement('div');
			overlay.style.cssText = `
				position: fixed;
				left: 0; top: 0; width: 100vw; height: 100vh;
				background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.92), rgba(255,255,255,0.7));
				opacity: 0; pointer-events: none; z-index: 99999; transition: opacity .35s ease-out;
			`;
			document.body.appendChild(overlay);
			requestAnimationFrame(() => overlay.style.opacity = '1');
			setTimeout(() => overlay.style.opacity = '0', 320);
			setTimeout(() => overlay.remove(), 1200);

			const baseCount = Math.max(60, Math.min(200, Math.floor(window.innerWidth / 6))); // scale with screen width
			const count = variant === 'gold' ? Math.min(480, Math.floor(baseCount * 1.8)) : variant === 'silver' ? Math.min(380, Math.floor(baseCount * 1.4)) : variant === 'rainbow' ? Math.min(520, Math.floor(baseCount * 2.0)) : variant === 'party' ? Math.min(540, Math.floor(baseCount * 2.1)) : variant === 'celebration' ? Math.min(560, Math.floor(baseCount * 2.2)) : variant === 'winter' ? Math.min(420, Math.floor(baseCount * 1.6)) : baseCount;
			const cx = window.innerWidth / 2;
			const cy = Math.max(80, window.innerHeight * 0.28); // burst from upper-center, slightly higher on mobile

			for (let i = 0; i < count; i++) {
				const isEmoji = Math.random() > 0.45;
				const el = document.createElement('div');
				if (isEmoji) {
					el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
				} else {
					el.textContent = '';
					el.style.background = colors[Math.floor(Math.random() * colors.length)];
				}
				let size = 20 + Math.random() * 36;
				// make larger on mobile / small screens
				if (window.innerWidth <= 480) size *= 1.4;
				el.style.cssText = `
					position: fixed;
					left: ${cx}px;
					top: ${cy}px;
					width: ${isEmoji ? 'auto' : size + 'px'};
					height: ${isEmoji ? 'auto' : size + 'px'};
					font-size: ${isEmoji ? size + 'px' : '0'};
					line-height: 1;
					text-align: center;
					transform: translate(-50%,-50%) scale(1) rotate(${Math.random() * 360}deg);
					border-radius: ${isEmoji ? '0' : '4px'};
					pointer-events: none;
					opacity: 1;
					z-index: 100000;
					transition: transform ${1.6 + Math.random() * 1.4}s cubic-bezier(.2,.8,.2,1), opacity ${1.4 + Math.random() * 0.8}s ease-out;
				`;
				document.body.appendChild(el);

				// Random direction and distance
				const angle = Math.random() * Math.PI * 2;
				const distance = (120 + Math.random() * (window.innerWidth * 0.5)) * (window.innerWidth <= 480 ? 0.9 : 1);
				const dx = Math.cos(angle) * distance;
				const dy = Math.sin(angle) * distance + (Math.random() * 80 - 40);

				requestAnimationFrame(() => {
					el.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random() * 720}deg) scale(${1 + Math.random() * 0.6})`;
					el.style.opacity = '0';
				});

				setTimeout(() => el.remove(), 3000 + Math.random() * 1800);
			}
		} finally {
			setTimeout(() => { this._bingoSplashActive = false; }, 3200);
		}
	}

	// Enhanced emoji-only confetti designed to be extra reliable on Android/Samsung browsers
	createEmojiConfetti(options = {}) {
		try {
			if (this._emojiConfettiActive) return;
			this._emojiConfettiActive = true;
            
			const variant = options.variant || 'standard';
			// Increase particle count on mobile/Samsung for better effect
			const baseCount = Math.max(50, Math.min(250, Math.floor(window.innerWidth / 5)));
			const count = options.count || (variant === 'gold' ? Math.min(420, Math.floor(baseCount * 1.6)) : variant === 'silver' ? Math.min(320, Math.floor(baseCount * 1.25)) : baseCount);
            
			// Enhanced emoji set with more variety and Samsung-friendly emojis
			const defaultEmojis = variant === 'gold' ? ['🏆','🎖️','🌟','🎉','🎊','🥇','✨'] :
								 variant === 'silver' ? ['🎉','🎖️','✨','🎊','🥈','🥳','🎈'] :
								 variant === 'rainbow' ? ['🌈','🎨','🎭','🎪','🎡','🎢','🎨','🌟','✨'] :
								 variant === 'party' ? ['🎉','🎊','🎈','🎂','🎁','🎀','🎶','🎵','🥳','🎈'] :
								 variant === 'celebration' ? ['🎉','🎊','🎆','🎇','✨','🌟','💫','⭐','🎆','🎇'] :
								 variant === 'winter' ? ['❄️','⛄','🎄','🎅','🔔','🎁','🕯️','🎄','❄️'] :
								 ['🎉','🎊','✨','🌟','⭐','🎈','🎯','🎨','🎭','🎪','🎡','🎢'];
			const emojis = options.emojis || defaultEmojis;
			const container = document.createElement('div');
			container.className = 'emoji-confetti-container';
			// higher z-index and visible overflow to improve visibility on top of overlays
			// Enhanced container styles for better visibility on Samsung/Android
			container.style.cssText = `
				position: fixed;
				left: 0;
				top: 0;
				width: 100vw;
				height: 100vh;
				pointer-events: none;
				overflow: visible;
				z-index: 100010;
				transform: translateZ(0);
				-webkit-transform: translateZ(0);
			`;
			container.setAttribute('data-confetti-count', count);
			document.body.appendChild(container);
			try { this.appendConsoleMessage && this.appendConsoleMessage('[Confetti] emoji container appended, count=' + count); } catch(e){}

			// Enhanced particle creation with better visibility for Samsung/Android
			for (let i = 0; i < count; i++) {
				const el = document.createElement('div');
				el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
				// Increased base size for better visibility on mobile
				const size = 24 + Math.random() * 30;
				el.style.cssText = `position:absolute;left:${Math.random()*100}vw;top:-40px;font-size:${size}px;opacity:1;transform:rotate(${Math.random()*360}deg);transition:transform 2.4s ease-out, top 2.4s cubic-bezier(.2,.9,.3,1), opacity 2.4s ease-out;will-change:transform,opacity;`;
				container.appendChild(el);
				if (i % 12 === 0) try { this.appendConsoleMessage && this.appendConsoleMessage('[Confetti] emoji element created idx=' + i); } catch(e){}

				// Force layout then animate
				// Enhanced animation timing for smoother performance on Samsung/Android
				setTimeout(() => {
					el.style.top = (50 + Math.random()*80) + 'vh';
					el.style.transform = `translateY(0) rotate(${Math.random()*720}deg) scale(${1.0 + Math.random()*0.8})`;
					el.style.opacity = '0';
					
					// Log first and last particle for debugging
					if (i === 0 || i === count-1) {
						try { this.appendConsoleMessage && this.appendConsoleMessage(`[Confetti] emoji particle ${i} animated`); } catch(e){}
					}
				}, 10 + Math.random()*100);

				// Extended duration for better visibility
				setTimeout(() => {
					el.remove();
					// Log cleanup of first and last particles
					if (i === 0 || i === count-1) {
						try { this.appendConsoleMessage && this.appendConsoleMessage(`[Confetti] emoji particle ${i} removed`); } catch(e){}
					}
				}, 3800 + Math.random()*1500);
			}

			// Extended container lifetime with safety checks for Samsung/Android
			setTimeout(() => {
				this._emojiConfettiActive = false;
				try {
					container.remove();
					this.appendConsoleMessage && this.appendConsoleMessage('[Confetti] emoji container cleanup complete');
				} catch(e){
					console.warn('Emoji container cleanup failed:', e);
					try { this.appendConsoleMessage && this.appendConsoleMessage('[Confetti] emoji container cleanup failed: ' + e); } catch(e2){}
				}
			}, 5800 + Math.random()*1800);
			try { this.appendConsoleMessage && this.appendConsoleMessage('[Confetti] emoji scheduled removal'); } catch(e){}
		} catch (e) { console.warn('createEmojiConfetti failed', e); this._emojiConfettiActive = false; }
	}


	// Function removed - player bingo now uses createConfettiEffect directly like computer bingo

	// Safe wrapper used when a bingo is detected for the player or AI.
	// This function triggers player visuals and guards against rapid reentrancy.
	// variant: 'standard' | 'silver' | 'gold'
	showBingoBonusEffect(force = false, variant = 'standard') {
		try {
			// Prefer the lightweight bingo splash if available
			if (typeof this.createBingoSplash === 'function') {
				try {
					// allow forcing the splash even if a previous one was active
					if (force && this._bingoSplashActive) {
						this._bingoSplashActive = false;
					}
					this.createBingoSplash(variant);
				} catch (e) { console.warn('createBingoSplash failed', e); }
			}

			// Confetti is now handled by the calling code (createConfettiEffect)
			// to avoid duplicate confetti effects

			// Ultimate fallback: flash an overlay and small emoji burst
			try {
				const overlay = document.createElement('div');
				overlay.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:99999;background:radial-gradient(circle at 50% 40%, rgba(255,255,255,0.95), rgba(255,255,255,0.6));opacity:0;transition:opacity .28s ease-out';
				document.body.appendChild(overlay);
				requestAnimationFrame(() => overlay.style.opacity = '1');
				setTimeout(() => overlay.style.opacity = '0', 280);
				setTimeout(() => overlay.remove(), 900);

				const emoji = document.createElement('div');
				// Pick celebratory emoji based on variant
				const variantEmoji = variant === 'gold' ? '🏆' : variant === 'silver' ? '🎖️' : '🎉';
				emoji.textContent = variantEmoji;
				const fontSize = variant === 'gold' ? 64 : variant === 'silver' ? 56 : 48;
				emoji.style.cssText = 'position:fixed;left:50%;top:28%;transform:translate(-50%,-50%);font-size:' + fontSize + 'px;z-index:100000;opacity:1;transition:transform .9s ease,opacity .9s ease;pointer-events:none';
				document.body.appendChild(emoji);
				requestAnimationFrame(() => { emoji.style.transform = 'translate(-50%,-50%) scale(2)'; emoji.style.opacity = '0'; });
				setTimeout(() => emoji.remove(), 900);
			} catch (e) { console.warn('showBingoBonusEffect fallback failed', e); }
		} catch (e) { console.warn('showBingoBonusEffect failed', e); }
	}

	// WebAudio fallback beep for platforms where speechSynthesis is unreliable
	playBeep(duration = 300, frequency = 880) {
		try {
			if (typeof window === 'undefined' || !window.AudioContext && !window.webkitAudioContext) return;
			const AudioCtx = window.AudioContext || window.webkitAudioContext;
			const ctx = new AudioCtx();
			const o = ctx.createOscillator();
			const g = ctx.createGain();
			o.type = 'sine';
			o.frequency.value = frequency;
			g.gain.value = 0.0001;
			o.connect(g);
			g.connect(ctx.destination);
			const now = ctx.currentTime;
			g.gain.setValueAtTime(0.0001, now);
			g.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
			o.start(now);
			// ramp down
			g.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);
			setTimeout(() => {
				try { o.stop(); ctx.close && ctx.close(); } catch (e) {}
			}, duration + 50);
		} catch (e) { console.warn('playBeep failed', e); }
	}

    

	createMoveHistoryDisplay() {
		const historyDisplay = document.createElement("div");
		historyDisplay.id = "move-history";
		// Prefer placing history near the instructions (drawer-instructions)
		const drawerInstructions = document.querySelector('.drawer-instructions') || document.querySelector('.drawer-instructions-desktop');
		if (drawerInstructions) {
			drawerInstructions.appendChild(historyDisplay);
			return historyDisplay;
		}
		// Fallbacks: mobile drawer's moves-panel then info-panel
		const mobileDrawer = document.querySelector(".mobile-drawer .moves-panel");
		const infoPanel = document.querySelector(".info-panel");
		if (mobileDrawer) {
			mobileDrawer.appendChild(historyDisplay);
		} else if (infoPanel) {
			infoPanel.appendChild(historyDisplay);
		}
		return historyDisplay;
	}

	// Append a message to the drawer console (and to browser console). Safe to call anywhere.
	appendConsoleMessage(msg) {
		try {
			console.log('[IN-GAME-CONSOLE]', msg);
			const mobileDrawer = document.querySelector('.mobile-drawer .moves-panel');
			if (!mobileDrawer) return;
			const consoleBox = mobileDrawer.querySelector('.drawer-console-output .console-entries');
			if (!consoleBox) return;
			const el = document.createElement('div');
			el.textContent = `[${new Date().toLocaleTimeString()}] ${String(msg)}`;
			el.style.padding = '4px 2px';
			consoleBox.appendChild(el);
			// keep scroll at bottom
			consoleBox.scrollTop = consoleBox.scrollHeight;
		} catch (e) { console.warn('appendConsoleMessage failed', e); }
	}

	// Show a transient in-page toast (non-modal) to replace native alerts
	showToast(message, duration = 2600) {
		try {
			let toast = document.querySelector('.inpage-toast');
			if (!toast) {
				toast = document.createElement('div');
				toast.className = 'inpage-toast';
				document.body.appendChild(toast);
			}
			toast.textContent = message;
			toast.classList.add('show');
			clearTimeout(toast._hideTimer);
			toast._hideTimer = setTimeout(() => {
				toast.classList.remove('show');
			}, duration);
		} catch (e) { try { console.warn('showToast failed', e); } catch(_){} }
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
		// Define optimal letter distributions
		const optimalDistribution = {
			vowels: ['A', 'E', 'I', 'O', 'U'],
			commonConsonants: ['R', 'S', 'T', 'L', 'N'],
			mediumConsonants: ['D', 'G', 'B', 'C', 'M', 'P'],
			rareLetters: ['J', 'K', 'Q', 'V', 'W', 'X', 'Y', 'Z']
		};

		// AI gets significantly better distribution and higher chance of premium tiles
		while (this.aiRack.length < 7 && this.tiles.length > 0) {
			// 60% chance to get strategic tiles (increased from 40%)
			if (Math.random() < 0.6) {
				const currentVowels = this.aiRack.filter(tile =>
					optimalDistribution.vowels.includes(tile.letter)).length;

				// Decide what type of tile AI needs
				let desiredTile;
				if (currentVowels < 2) {
					// Need vowels
					desiredTile = this.findTileInBag(optimalDistribution.vowels);
				} else if (currentVowels > 3) {
					// Need consonants
					desiredTile = this.findTileInBag(optimalDistribution.commonConsonants);
				} else {
					// Get blank tile (higher chance), premium letter, or common letter
					if (Math.random() < 0.3) {
						// 30% chance for blank tile
						desiredTile = this.findTileInBag(['*']);
					} else if (Math.random() < 0.4) {
						// 28% chance for premium consonant (J, Q, X, Z)
						desiredTile = this.findTileInBag(optimalDistribution.rareLetters);
					} else {
						// 42% chance for common letter
						desiredTile = this.findTileInBag(optimalDistribution.commonConsonants);
					}
				}

				if (desiredTile) {
					this.aiRack.push(desiredTile);
					continue;
				}
			}

			// Regular draw with weighted probability
			const tile = this.drawWeightedTile(true); // true for AI
			if (tile) this.aiRack.push(tile);
		}

		// --- ENHANCED PLAYER RACK LOGIC: Better chances for wild tiles ---
		while (this.playerRack.length < 7 && this.tiles.length > 0) {
			const currentVowels = this.playerRack.filter(tile =>
				optimalDistribution.vowels.includes(tile.letter)).length;
			const currentWildTiles = this.playerRack.filter(tile => tile.letter === "*").length;

			// 15% chance to specifically get a wild tile (increased priority)
			// 25% chance if player has no wild tiles yet (bonus for empty rack)
			const wildTileChance = currentWildTiles === 0 ? 0.25 : 0.15;
			if (Math.random() < wildTileChance && currentWildTiles < 2) {
				let wildTile = this.findTileInBag(['*']);
				if (wildTile) {
					this.playerRack.push(wildTile);
					continue;
				}
			}

			// If already 3 vowels, force consonant
			if (currentVowels >= 3) {
				let desiredTile = this.findTileInBag(
					optimalDistribution.commonConsonants
					.concat(optimalDistribution.mediumConsonants)
					.concat(optimalDistribution.rareLetters)
				);
				if (desiredTile) {
					this.playerRack.push(desiredTile);
					continue;
				}
			}

			// 25% chance to get needed letter type (prefer consonant if too many vowels)
			if (Math.random() < 0.25) {
				let desiredTile;
				if (currentVowels < 2) {
					desiredTile = this.findTileInBag(optimalDistribution.vowels);
				} else {
					desiredTile = this.findTileInBag(
						optimalDistribution.commonConsonants
						.concat(optimalDistribution.mediumConsonants)
						.concat(optimalDistribution.rareLetters)
					);
				}

				if (desiredTile) {
					this.playerRack.push(desiredTile);
					continue;
				}
			}

			// Regular draw with weighted probability, but reduce vowel weight for player
			const tile = this.drawWeightedTile(false, /*playerMode=*/ true);
			if (tile) this.playerRack.push(tile);
		}

		// Update displays
		this.renderRack();
		this.renderAIRack();
		this.updateTilesCount();
	}

	// Modify drawWeightedTile to support playerMode (less vowels)
	drawWeightedTile(isAI, playerMode = false) {
		if (this.tiles.length === 0) return null;

		// Dramatically increase blank tile weight for AI and players
		const weights = playerMode ? {
			'*': 50, // Increased from 10 to 50 for players
			'AEIOU': 10,
			'RSTLN': 30,
			'DGBCMP': 20,
			'FHVWY': 15,
			'JKQXZ': 10
		} : {
			'*': isAI ? 200 : 50, // Increased player chance from 10 to 50
			'AEIOU': isAI ? 35 : 30,
			'RSTLN': isAI ? 30 : 25,
			'DGBCMP': 20,
			'FHVWY': 15,
			'JKQXZ': 10
		};

		// Calculate total weight
		let totalWeight = 0;
		this.tiles.forEach(tile => {
			if (tile.letter === '*') totalWeight += weights['*'];
			else if ('AEIOU'.includes(tile.letter)) totalWeight += weights['AEIOU'];
			else if ('RSTLN'.includes(tile.letter)) totalWeight += weights['RSTLN'];
			else if ('DGBCMP'.includes(tile.letter)) totalWeight += weights['DGBCMP'];
			else if ('FHVWY'.includes(tile.letter)) totalWeight += weights['FHVWY'];
			else totalWeight += weights['JKQXZ'];
		});

		// Random weighted selection
		let random = Math.random() * totalWeight;
		for (let i = 0; i < this.tiles.length; i++) {
			let weight;
			if (this.tiles[i].letter === '*') weight = weights['*'];
			else if ('AEIOU'.includes(this.tiles[i].letter)) weight = weights['AEIOU'];
			else if ('RSTLN'.includes(this.tiles[i].letter)) weight = weights['RSTLN'];
			else if ('DGBCMP'.includes(this.tiles[i].letter)) weight = weights['DGBCMP'];
			else if ('FHVWY'.includes(this.tiles[i].letter)) weight = weights['FHVWY'];
			else weight = weights['JKQXZ'];

			random -= weight;
			if (random <= 0) return this.tiles.splice(i, 1)[0];
		}

		return this.tiles.pop();
	}

	findTileInBag(desiredLetters) {
		const index = this.tiles.findIndex(tile => desiredLetters.includes(tile.letter));
		return index !== -1 ? this.tiles.splice(index, 1)[0] : null;
	}

	drawWeightedTile(isAI) {
		if (this.tiles.length === 0) return null;

		const weights = {
			'*': isAI ? 50 : 50, // Increased player chance from 10 to 50
			'AEIOU': isAI ? 35 : 30,
			'RSTLN': isAI ? 30 : 25,
			'DGBCMP': 20,
			'FHVWY': 15,
			'JKQXZ': 10
		};

		// Calculate total weight
		let totalWeight = 0;
		this.tiles.forEach(tile => {
			if (tile.letter === '*') totalWeight += weights['*'];
			else if ('AEIOU'.includes(tile.letter)) totalWeight += weights['AEIOU'];
			else if ('RSTLN'.includes(tile.letter)) totalWeight += weights['RSTLN'];
			else if ('DGBCMP'.includes(tile.letter)) totalWeight += weights['DGBCMP'];
			else if ('FHVWY'.includes(tile.letter)) totalWeight += weights['FHVWY'];
			else totalWeight += weights['JKQXZ'];
		});

		// Random weighted selection
		let random = Math.random() * totalWeight;
		for (let i = 0; i < this.tiles.length; i++) {
			let weight;
			if (this.tiles[i].letter === '*') weight = weights['*'];
			else if ('AEIOU'.includes(this.tiles[i].letter)) weight = weights['AEIOU'];
			else if ('RSTLN'.includes(this.tiles[i].letter)) weight = weights['RSTLN'];
			else if ('DGBCMP'.includes(this.tiles[i].letter)) weight = weights['DGBCMP'];
			else if ('FHVWY'.includes(this.tiles[i].letter)) weight = weights['FHVWY'];
			else weight = weights['JKQXZ'];

			random -= weight;
			if (random <= 0) return this.tiles.splice(i, 1)[0];
		}

		return this.tiles.pop();
	}

	setupExchangeSystem() {
		// Setup mobile exchange portal
		this.exchangePortal = document.getElementById("exchange-portal");
		const activateButton = document.getElementById("activate-exchange");

		if (activateButton) {
			activateButton.addEventListener("click", () => {
				if (this.currentTurn !== "player") {
					alert("Wait for your turn!");
					return;
				}
				this.toggleExchangeMode("mobile");
			});
		}

		if (this.exchangePortal) {
			// Modify portal drop zone event listeners
			this.exchangePortal.addEventListener("dragover", (e) => {
				if (!this.exchangeMode) return;
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
				this.exchangePortal.classList.add("portal-dragover");
			});

			this.exchangePortal.addEventListener("drop", async (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!this.exchangeMode) return;

				const tileIndex = e.dataTransfer.getData("text/plain");
				if (tileIndex !== "") {
					await this.handleTileExchange(parseInt(tileIndex));
				}

				this.exchangePortal.classList.remove("portal-dragover");
			});
		}

		// Setup desktop exchange portal
		this.exchangePortalDesktop = document.getElementById("exchange-portal-desktop");
		const activateDesktopButton = document.getElementById("activate-exchange-desktop");

		if (activateDesktopButton) {
			activateDesktopButton.addEventListener("click", () => {
				if (this.currentTurn !== "player") {
					alert("Wait for your turn!");
					return;
				}
				this.toggleExchangeMode("desktop");
			});
		}

		if (this.exchangePortalDesktop) {
			// Modify portal drop zone event listeners
			this.exchangePortalDesktop.addEventListener("dragover", (e) => {
				if (!this.exchangeMode) return;
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
				this.exchangePortalDesktop.classList.add("portal-dragover");
			});

			this.exchangePortalDesktop.addEventListener("drop", async (e) => {
				e.preventDefault();
				e.stopPropagation();
				if (!this.exchangeMode) return;

				const tileIndex = e.dataTransfer.getData("text/plain");
				if (tileIndex !== "") {
					await this.handleTileExchange(parseInt(tileIndex));
				}

				this.exchangePortalDesktop.classList.remove("portal-dragover");
			});
		}
	}

	toggleExchangeMode(mode = "mobile") {
		if (this.currentTurn !== "player") {
			alert("Wait for your turn!");
			return;
		}

		this.exchangeMode = !this.exchangeMode;
		
		if (mode === "mobile") {
			const activateButton = document.getElementById("activate-exchange");
			if (activateButton) {
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
		} else if (mode === "desktop") {
			const activateDesktopButton = document.getElementById("activate-exchange-desktop");
			if (activateDesktopButton) {
				if (this.exchangeMode) {
					this.exchangePortalDesktop.classList.add("active");
					activateDesktopButton.textContent = "Deactivate Exchange Portal";
					activateDesktopButton.style.background =
						"linear-gradient(145deg, #ff4081, #f50057)";

					// Show exchange instructions
					const instructions = document.createElement("div");
					instructions.className = "exchange-instructions animated";
					this.exchangePortalDesktop.parentElement.appendChild(instructions);
				} else {
					this.exchangePortalDesktop.classList.remove("active");
					activateDesktopButton.textContent = "Activate Exchange Portal";
					activateDesktopButton.style.background =
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
		}
	}

	async handleTileExchange(tileIndex) {
		if (!this.exchangeMode || this.tiles.length === 0 || isNaN(tileIndex))
			return;
		// If exchange portal removed from UI, do nothing
		if (!document.getElementById('exchange-portal')) return;

		const tile = this.playerRack[tileIndex];
		if (!tile) {
			console.error("Invalid tile index:", tileIndex);
			return;
		}

		try {
			// Get the original tile element and its position
			const tileElement = document.querySelector(`[data-index="${tileIndex}"]`);
			if (!tileElement) {
				console.error("Tile element not found");
				return;
			}

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
		} catch (error) {
			console.error("Error during tile exchange:", error);
		}
	}

	async completeExchange() {
		if (this.exchangingTiles.length === 0) return;

		// Disable exchange mode
		this.exchangeMode = false;
		// If portal present, remove active state; otherwise continue silently
		const portal = document.getElementById('exchange-portal');
		if (portal && portal.classList) portal.classList.remove('active');
		const actBtn = document.getElementById('activate-exchange');
		if (actBtn) actBtn.textContent = 'Activate Exchange Portal';

		// Optionally animate portal close if UI exists
		let portalClose = null;
		if (portal && portal.animate) {
			portalClose = portal.animate([
				{ transform: 'scale(1) rotate(0deg)', opacity: 1 },
				{ transform: 'scale(0) rotate(360deg)', opacity: 0 }
			], { duration: 1000, easing: 'cubic-bezier(0.4,0,0.2,1)' });
		}

		// Create new tiles animation container
		const newTilesContainer = document.createElement('div');
		newTilesContainer.className = 'new-tiles-container';
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

			const portalRect = portal ? portal.getBoundingClientRect() : null;
			const rackRect = document.getElementById("tile-rack").getBoundingClientRect();
			const finalX = rackRect.left + i * 50; // Adjust spacing as needed
			const finalY = rackRect.top;
			// starting coordinates (use portal center if available, otherwise start at final position)
			const startLeft = portalRect ? (portalRect.left + portalRect.width / 2) : finalX;
			const startTop = portalRect ? (portalRect.top + portalRect.height / 2) : finalY;

			await new Promise((resolve) => {
				tileElement.animate(
					[
						{
							left: `${startLeft}px`,
							top: `${startTop}px`,
							transform: 'scale(0) rotate(-360deg)',
							opacity: 0,
						},
						{
							left: `${finalX}px`,
							top: `${finalY}px`,
							transform: 'scale(1) rotate(0deg)',
							opacity: 1,
						},
					], {
						duration: 1000,
						easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
						fill: 'forwards',
					}
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

			// Add to move history (localized)
			{
				const lang = this.preferredLang || (typeof localStorage !== 'undefined' && localStorage.getItem('preferredLang')) || 'en';
				const label = getTranslation('aiExchanged', lang);
				this.addToMoveHistory("Computer", label, 0);
			}

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
		if (!portal) {
			// Exchange UI removed — quickly resolve without visual animation
			return;
		}
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

			const reverseSpiral = [{
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
						[{
								transform: `translate(${startX + Math.cos(angle) * radius}px, 
                                         ${startY + Math.sin(angle) * radius}px) scale(0)`,
								opacity: 1,
							},
							{
								transform: `translate(${startX + Math.cos(angle) * radius * 2}px, 
                                         ${startY + Math.sin(angle) * radius * 2}px) scale(1)`,
								opacity: 0,
							},
						], {
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

		// Add exchange system setup only if exchange UI is present
		if (document.getElementById('activate-exchange') || document.getElementById('activate-exchange-desktop')) {
			this.setupExchangeSystem();
		}

		// Play word button
		const playWordBtn = document.getElementById("play-word");
		const playWordDesktopBtn = document.getElementById("play-word-desktop");

		// Handler that runs inside the user's click gesture to start speech reliably
		const handlePlayGesture = async (e) => {
			try {
				// Try to unlock audio / TTS pipelines early inside the gesture
				try { await this.ensureAudioUnlocked(); } catch(e) { console.debug('handlePlayGesture: ensureAudioUnlocked failed', e); }
				// Reset mark
				this._submitStartedSpeak = false;
				// Play a tiny embedded audio to coax Android audio systems (silent/near-silent)
				try {
					if (!this._playGestureAudio) {
						this._playGestureAudio = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=');
						this._playGestureAudio.preload = 'auto';
					}
					this._playGestureAudio.currentTime = 0;
					this._playGestureAudio.volume = 0.01;
					this._playGestureAudio.play().catch(()=>{});
				} catch(e) { /* ignore */ }
				// Prepare formed words synchronously from current placedTiles
				const formedWords = (typeof this.getFormedWords === 'function') ? this.getFormedWords() : [];
				let bingo = false;
				for (const wi of formedWords) {
					let newlyPlacedCount = 0;
					for (let k = 0; k < wi.word.length; k++) {
						const row = wi.direction === 'horizontal' ? wi.startPos.row : wi.startPos.row + k;
						const col = wi.direction === 'horizontal' ? wi.startPos.col + k : wi.startPos.col;
						if (this.placedTiles && this.placedTiles.some(t => t.row === row && t.col === col)) newlyPlacedCount++;
					}
					if (newlyPlacedCount >= 7) bingo = true;
				}
				if (bingo) {
					// Start speakSequence within the gesture; mark that we've started speech so playWord won't duplicate
					this._submitStartedSpeak = true;
					// Some Android browsers block utterances created asynchronously; to be reliable we
					// pre-create and queue all utterances (words followed by 'Bingo bonus!') here
					// inside the user's click gesture. We return a promise that resolves when the
					// last utterance ends so playWord() can await it.
					try {
						if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
							const texts = formedWords.map(w => w.word).filter(w => w && w !== 'BINGO BONUS');
							const inlinePrefLang = this._getPreferredLangCode();
							// Ensure bingo phrase is queued last so it's heard after the spelled words
							texts.push('Bingo bonus!');
							let resolveInline;
							this._inlineSpeakPromise = new Promise((res) => { resolveInline = res; });
							texts.forEach((txt, idx) => {
								try {
									const u = new SpeechSynthesisUtterance(txt);
									u.lang = inlinePrefLang;
									u.rate = 0.75;
									u.pitch = 1.0;
									// Try to set a preferred voice synchronously inside the gesture
									try {
										const pref = this._getPreferredVoice && this._getPreferredVoice(this._getPreferredLangCode && this._getPreferredLangCode());
										if (pref) {
											u.voice = pref;
											try { this.appendConsoleMessage('inline prequeue used voice: '+pref.name); } catch(e){}
										}
									} catch (e) { /* ignore */ }
									if (idx === texts.length - 1) {
										u.onend = () => { try { resolveInline(); } catch(e){} };
										u.onerror = () => { try { resolveInline(); } catch(e){} };
									}
									window.speechSynthesis.speak(u);
								} catch (err) {
									console.warn('prequeue utterance failed', err);
									if (idx === texts.length - 1) resolveInline();
								}
							});
						} else {
							this._inlineSpeakPromise = Promise.resolve();
						}
					} catch (err) {
						console.warn('inline prequeue failed', err);
						this._inlineSpeakPromise = Promise.resolve();
					}
				}
			} catch (err) {
				console.warn('handlePlayGesture failed', err);
			}
			// Continue to original click action (playWord will run next from its listener)
		};

		if (playWordBtn) {
			playWordBtn.addEventListener("click", handlePlayGesture, true);
			playWordBtn.addEventListener("click", () => this.playWord());
		}
		if (playWordDesktopBtn) {
			playWordDesktopBtn.addEventListener("click", handlePlayGesture, true);
			playWordDesktopBtn.addEventListener("click", () => this.playWord());
		}

		// Shuffle rack button (mobile)
		const shuffleRackBtn = document.getElementById("shuffle-rack");
		if (shuffleRackBtn) shuffleRackBtn.addEventListener("click", async () => {
			const rack = document.getElementById("tile-rack");
			const tiles = [...rack.children];

			// Disable tile dragging during animation
			tiles.forEach((tile) => (tile.draggable = false));

			// Visual shuffle animation
			for (let i = 0; i < 5; i++) { // 5 visual shuffles
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
				[this.playerRack[i], this.playerRack[j]] = [this.playerRack[j], this.playerRack[i]];
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

		// Shuffle rack button (desktop)
		const shuffleRackDesktopBtn = document.getElementById("shuffle-rack-desktop");
		if (shuffleRackDesktopBtn) shuffleRackDesktopBtn.addEventListener("click", async () => {
			const rack = document.getElementById("tile-rack");
			const tiles = [...rack.children];

			// Disable tile dragging during animation
			tiles.forEach((tile) => (tile.draggable = false));

			// Visual shuffle animation
			for (let i = 0; i < 5; i++) { // 5 visual shuffles
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
				[this.playerRack[i], this.playerRack[j]] = [this.playerRack[j], this.playerRack[i]];
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

		// Skip turn button (mobile)
		const skipTurnBtn = document.getElementById("skip-turn");
		if (skipTurnBtn) skipTurnBtn.addEventListener("click", () => {
			if (this.currentTurn === "player") {
				// If player has placed tiles but hasn't submitted, revert them before skipping
				if (this.placedTiles && this.placedTiles.length > 0) {
					if (typeof this.revertPlacedTiles === 'function') this.revertPlacedTiles();
				}
				this.consecutiveSkips++;
				this.currentTurn = "ai";
				this.addToMoveHistory("Player", "SKIP", 0);
				this.updateGameState();
				this.highlightValidPlacements();
				if (!this.checkGameEnd()) {
					this.aiTurn();
				}
			}
		});

		// Skip turn button (desktop)
		const skipTurnDesktopBtn = document.getElementById("skip-turn-desktop");
		if (skipTurnDesktopBtn) skipTurnDesktopBtn.addEventListener("click", () => {
			if (this.currentTurn === "player") {
				// If player has placed tiles but hasn't submitted, revert them before skipping
				if (this.placedTiles && this.placedTiles.length > 0) {
					if (typeof this.revertPlacedTiles === 'function') this.revertPlacedTiles();
				}
				this.consecutiveSkips++;
				this.currentTurn = "ai";
				this.addToMoveHistory("Player", "SKIP", 0);
				this.updateGameState();
				this.highlightValidPlacements();
				if (!this.checkGameEnd()) {
					this.aiTurn();
				}
			}
		});

		// Quit game button (mobile)
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

		// Quit game button (desktop)
		const quitDesktopButton = document.getElementById("quit-game-desktop");
		if (quitDesktopButton) {
			quitDesktopButton.addEventListener("click", () => {
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


		// Copy move history button (mobile)
		const copyHistoryBtnMobile = document.getElementById("copy-move-history-mobile");
		if (copyHistoryBtnMobile) {
			copyHistoryBtnMobile.addEventListener("click", () => {
				const historyContent = document.getElementById("move-history").innerText;
				if (historyContent && historyContent.trim()) {
					navigator.clipboard.writeText(historyContent).then(() => {
						copyHistoryBtnMobile.textContent = "✓ Copied!";
						setTimeout(() => { copyHistoryBtnMobile.textContent = "📋 Copy"; }, 2000);
					}).catch(err => {
						console.error("Failed to copy:", err);
						alert("Failed to copy to clipboard");
					});
				} else {
					alert("No move history to copy");
				}
			});
		}

		// Copy move history button (desktop)
		const copyHistoryBtnDesktop = document.getElementById("copy-move-history-desktop");
		if (copyHistoryBtnDesktop) {
			copyHistoryBtnDesktop.addEventListener("click", () => {
				const historyContent = document.getElementById("move-history-desktop").innerText;
				if (historyContent && historyContent.trim()) {
					navigator.clipboard.writeText(historyContent).then(() => {
						copyHistoryBtnDesktop.textContent = "✓ Copied!";
						setTimeout(() => { copyHistoryBtnDesktop.textContent = "📋 Copy"; }, 2000);
					}).catch(err => {
						console.error("Failed to copy:", err);
						alert("Failed to copy to clipboard");
					});
				} else {
					alert("No move history to copy");
				}
			});
		}

		// Print history button (mobile)
		const printHistoryBtn = document.getElementById("print-history");
		if (printHistoryBtn) printHistoryBtn.addEventListener("click", async () => {
			const printWindow = window.open("", "_blank");
			const gameDate = new Date().toLocaleString();

			// Show loading message
			printWindow.document.write(`
                <html>
                    <head>
                        <title>Puzzle Game History - ${gameDate}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #333; }
                            .move { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
                            .word-header { font-size: 1.2em; color: #2c3e50; margin-bottom: 10px; }
                            .definitions { margin-left: 20px; padding: 10px; border-left: 3px solid #3498db; }
                            .part-of-speech { color: #e67e22; font-style: italic; }
                            .scores { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                            .loading { text-align: center; padding: 20px; font-style: italic; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="loading">Loading definitions...</div>
                    </body>
                </html>
            `);

			// Gather all unique words from move history
			const uniqueWords = [...new Set(
				this.moveHistory
				.map((move) => move.word)
				.filter((word) => word !== "SKIP" && word !== "EXCHANGE" && word !== "QUIT")
			)];

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

		// Print history button (desktop)
		const printHistoryDesktopBtn = document.getElementById("print-history-desktop");
		if (printHistoryDesktopBtn) printHistoryDesktopBtn.addEventListener("click", async () => {
			const printWindow = window.open("", "_blank");
			const gameDate = new Date().toLocaleString();

			// Show loading message
			printWindow.document.write(`
                <html>
                    <head>
                        <title>Puzzle Game History - ${gameDate}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                            .header { text-align: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #333; }
                            .move { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
                            .word-header { font-size: 1.2em; color: #2c3e50; margin-bottom: 10px; }
                            .definitions { margin-left: 20px; padding: 10px; border-left: 3px solid #3498db; }
                            .part-of-speech { color: #e67e22; font-style: italic; }
                            .scores { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                            .loading { text-align: center; padding: 20px; font-style: italic; color: #666; }
                        </style>
                    </head>
                    <body>
                        <div class="loading">Loading definitions...</div>
                    </body>
                </html>
            `);

			// Gather all unique words from move history
			const uniqueWords = [...new Set(
				this.moveHistory
				.map((move) => move.word)
				.filter((word) => word !== "SKIP" && word !== "EXCHANGE" && word !== "QUIT")
			)];

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

		// Mobile notifications handling
		if (isMobileDevice()) {
			const notifications = document.querySelectorAll('.mobile-notice');
			notifications.forEach(notice => {
				let startX;
				let currentX;
				let isDragging = false;

				// Touch start handler
				notice.addEventListener('touchstart', (e) => {
					startX = e.touches[0].clientX;
					currentX = startX;
					isDragging = true;
					notice.classList.add('swiping');
				}, {
					passive: true
				});

				// Touch move handler
				notice.addEventListener('touchmove', (e) => {
					if (!isDragging) return;
					currentX = e.touches[0].clientX;
					const diff = currentX - startX;
					if (diff > 0) { // Only allow right swipe
						notice.style.transform = `translateX(${diff}px)`;
					}
				}, {
					passive: true
				});

				// Touch end handler
				notice.addEventListener('touchend', () => {
					if (!isDragging) return;
					isDragging = false;
					notice.classList.remove('swiping');

					if (currentX - startX > 100) { // Swipe threshold
						notice.classList.add('removing');
						setTimeout(() => notice.remove(), 300);
					} else {
						notice.style.transform = '';
					}
				});

				// Double-tap to close
				let lastTap = 0;
				notice.addEventListener('touchend', (e) => {
					const currentTime = new Date().getTime();
					const tapLength = currentTime - lastTap;
					if (tapLength < 500 && tapLength > 0) {
						notice.classList.add('removing');
						setTimeout(() => notice.remove(), 300);
						e.preventDefault();
					}
					lastTap = currentTime;
				});

				// Make close button more reliable
				const closeButton = notice.querySelector('.notice-close');
				if (closeButton) {
					closeButton.addEventListener('click', (e) => {
						e.stopPropagation();
						e.preventDefault();
						notice.classList.add('removing');
						setTimeout(() => notice.remove(), 300);
					});

					closeButton.addEventListener('touchend', (e) => {
						e.stopPropagation();
						e.preventDefault();
						notice.classList.add('removing');
						setTimeout(() => notice.remove(), 300);
					});
				}
			});
		}

		// Desktop Drawer Button Connections
		// Play word button (desktop drawer)
		const playWordDesktopDrawerBtn = document.getElementById("play-word-desktop-drawer");
		if (playWordDesktopDrawerBtn) playWordDesktopDrawerBtn.addEventListener("click", () => this.playWord());

		// Shuffle rack button (desktop drawer)
		const shuffleRackDesktopDrawerBtn = document.getElementById("shuffle-rack-desktop-drawer");
		if (shuffleRackDesktopDrawerBtn) shuffleRackDesktopDrawerBtn.addEventListener("click", async () => {
			const rack = document.getElementById("tile-rack");
			const tiles = [...rack.children];

			// Disable tile dragging during animation
			tiles.forEach((tile) => (tile.draggable = false));

			// Visual shuffle animation
			for (let i = 0; i < 5; i++) { // 5 visual shuffles
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
				[this.playerRack[i], this.playerRack[j]] = [this.playerRack[j], this.playerRack[i]];
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

		// Skip turn button (desktop drawer)
		const skipTurnDesktopDrawerBtn = document.getElementById("skip-turn-desktop-drawer");
		if (skipTurnDesktopDrawerBtn) skipTurnDesktopDrawerBtn.addEventListener("click", () => {
			if (this.currentTurn === "player") {
				this.consecutiveSkips++;
				this.currentTurn = "ai";
				this.addToMoveHistory("Player", "SKIP", 0);
				this.updateGameState();
				this.highlightValidPlacements();
				if (!this.checkGameEnd()) {
					this.aiTurn();
				}
			}
		});

		// Quit game button (desktop drawer)
		const quitDesktopDrawerButton = document.getElementById("quit-game-desktop-drawer");
		if (quitDesktopDrawerButton) {
			quitDesktopDrawerButton.addEventListener("click", () => {
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

		// Print history button (desktop drawer)
		const printHistoryDesktopDrawerBtn = document.getElementById("print-history-desktop-drawer");
		if (printHistoryDesktopDrawerBtn) printHistoryDesktopDrawerBtn.addEventListener("click", async () => {
			const printWindow = window.open("", "_blank");
			const gameDate = new Date().toLocaleString();

			// Show loading message
			printWindow.document.write(`
                <html>
                    <head>
                        <title>Scrabble Game History - ${gameDate}</title>
                        <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .loading { text-align: center; padding: 50px; }
                            .move { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
                            .bingo { color: #4CAF50; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="loading">Loading game history...</div>
                    </body>
                </html>
            `);

			// Get word definitions for all moves
			const wordDefinitions = {};
			for (const move of this.moveHistory) {
				if (move.word && move.word !== "SKIP" && move.word !== "EXCHANGE" && move.word !== "QUIT" && !move.word.includes("BINGO BONUS")) {
					const words = move.word.split("&").map(w => w.trim());
					for (const word of words) {
						if (!wordDefinitions[word]) {
							try {
								const definition = await this.getWordDefinition(word);
								wordDefinitions[word] = definition;
							} catch (error) {
								wordDefinitions[word] = "Definition not available";
							}
						}
					}
				}
			}

			// Generate and display the print content
			const printContent = this.generatePrintContent(gameDate, wordDefinitions);
			printWindow.document.write(printContent);
			printWindow.document.close();
		});

		// Exchange button (desktop drawer)
		const activateExchangeDesktopDrawerBtn = document.getElementById("activate-exchange-desktop-drawer");
		if (activateExchangeDesktopDrawerBtn) activateExchangeDesktopDrawerBtn.addEventListener("click", () => {
			this.toggleExchangeMode("desktop-drawer");
		});

		// (Language selectors are initialized earlier during init)

		// Handle window resize to update AI rack visibility

	}

	simulateEndgameScenario() {
		// Clear board first
		this.board = Array(15).fill().map(() => Array(15).fill(null));

		// Place valid words, no illegal overlaps, and leave a few gaps
		const words = [{
				word: "START",
				row: 7,
				col: 5,
				horizontal: true
			},
			{
				word: "EARN",
				row: 6,
				col: 7,
				horizontal: false
			},
			{
				word: "TILE",
				row: 9,
				col: 7,
				horizontal: false
			},
			{
				word: "QUIZ",
				row: 4,
				col: 10,
				horizontal: true
			},
			{
				word: "DOG",
				row: 11,
				col: 8,
				horizontal: true
			},
			{
				word: "FINE",
				row: 12,
				col: 5,
				horizontal: true
			},
			{
				word: "BEE",
				row: 2,
				col: 12,
				horizontal: false
			},
			{
				word: "SUN",
				row: 13,
				col: 10,
				horizontal: true
			}
		];

		for (const {
				word,
				row,
				col,
				horizontal
			}
			of words) {
			for (let i = 0; i < word.length; i++) {
				const r = horizontal ? row : row + i;
				const c = horizontal ? col + i : col;
				this.board[r][c] = {
					letter: word[i],
					value: this.tileValues[word[i]],
					id: `pre_${word[i]}_${r}_${c}`
				};
			}
		}

		// Leave a few open spots for play
		this.board[7][10] = null;
		this.board[9][7] = null;
		this.board[12][7] = null;
		this.board[13][11] = null;

		// Give AI and player racks
		this.aiRack = [{
				letter: "A",
				value: 1,
				id: "A1"
			},
			{
				letter: "T",
				value: 1,
				id: "T1"
			},
			{
				letter: "E",
				value: 1,
				id: "E1"
			},
			{
				letter: "S",
				value: 1,
				id: "S1"
			},
			{
				letter: "R",
				value: 1,
				id: "R1"
			},
			{
				letter: "O",
				value: 1,
				id: "O1"
			},
			{
				letter: "N",
				value: 1,
				id: "N1"
			}
		];
		this.playerRack = [{
				letter: "L",
				value: 1,
				id: "L1"
			},
			{
				letter: "D",
				value: 2,
				id: "D1"
			},
			{
				letter: "E",
				value: 1,
				id: "E2"
			},
			{
				letter: "S",
				value: 1,
				id: "S2"
			}
		];
		this.tiles = [{
				letter: "U",
				value: 1,
				id: "U1"
			},
			{
				letter: "M",
				value: 3,
				id: "M1"
			},
			{
				letter: "C",
				value: 3,
				id: "C1"
			},
			{
				letter: "B",
				value: 3,
				id: "B1"
			},
			{
				letter: "I",
				value: 1,
				id: "I1"
			}
		];

		this.playerScore = 172;
		this.aiScore = 168;
		this.isFirstMove = false;

		// Update UI
		this.renderBoard();
		this.renderRack();
		this.renderAIRack();
		this.updateGameState();

		// Debug print
		console.log("Simulated close-to-endgame board:");
		for (let r = 0; r < 15; r++) {
			let rowStr = "";
			for (let c = 0; c < 15; c++) {
				rowStr += this.board[r][c] ? this.board[r][c].letter : ".";
			}
			console.log(rowStr);
		}
		console.log("AI rack:", this.aiRack.map(t => t.letter));
		console.log("Player rack:", this.playerRack.map(t => t.letter));
		console.log("Tiles left in bag:", this.tiles.length);
	}

	renderBoard() {
		const board = document.getElementById("scrabble-board");
		if (!board) return;
		board.innerHTML = "";

		const premiumSquares = this.getPremiumSquares();

		for (let row = 0; row < 15; row++) {
			for (let col = 0; col < 15; col++) {
				const cell = document.createElement("div");
				cell.className = "board-cell";
				cell.dataset.row = row;
				cell.dataset.col = col;

				// Add premium square classes
				const key = `${row},${col}`;
				if (premiumSquares[key]) {
					cell.classList.add(premiumSquares[key]);
				}

				// Add center star
				if (row === 7 && col === 7) {
					const centerStar = document.createElement("span");
					centerStar.textContent = "⚜";
					centerStar.className = "center-star";
					cell.appendChild(centerStar);
				}

				// Use the same tile HTML as rack tiles
				if (this.board[row][col]) {
					const tile = this.board[row][col];
					const tileDiv = document.createElement("div");
					tileDiv.className = "tile";
					tileDiv.innerHTML = `
                    ${tile.letter}
                    <span class="points">${tile.value}</span>
                    ${tile.isBlank ? '<span class="blank-indicator">★</span>' : ""}
                `;
					cell.appendChild(tileDiv);
				}

				board.appendChild(cell);
			}
		}

		// Re-attach drag-and-drop listeners after re-rendering
		this.setupDropListeners();
	}
}


function preventScrolling(e) {
	e.preventDefault();
}

// Initialize game when document is loaded
document.addEventListener("DOMContentLoaded", () => {
    const game = new ScrabbleGame();
    window.game = game; // <-- Add this line

	// Prime speech synthesis on first user interaction so later async announcements are allowed
	const primeSpeech = () => {
		try {
			if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
				// speak a very short silent utterance to satisfy user-gesture requirements
				const silent = new SpeechSynthesisUtterance('');
				silent.volume = 0;
				window.speechSynthesis.speak(silent);
				console.log('[Speech] primed by user interaction');
			}
		} catch (e) {
			console.warn('Speech priming failed', e);
		}
		document.removeEventListener('pointerdown', primeSpeech, true);
	};
	document.addEventListener('pointerdown', primeSpeech, true);

	// dev helper removed

    // Wire up the simulate endgame button
    const endgameBtn = document.getElementById("simulate-endgame-btn");
    if (endgameBtn) {
        endgameBtn.onclick = () => {
            game.simulateEndgameScenario();
            game.showAINotification("Endgame scenario loaded! It's time to test the AI.");
        };
    }

	// Dev helper: dumps last scored words and recent move history to console for debugging
	if (window.game) {
		window.game.debugDumpLastScore = function(limit = 10) {
			try {
				console.groupCollapsed('DEBUG: Last Scored Words & Recent Moves');
				console.log('Last scored words (this._lastScoredWords):', this._lastScoredWords || []);
				console.log('Recent moveHistory (last ' + limit + '):', (this.moveHistory || []).slice(-limit));
				console.groupEnd();
			} catch (e) { console.warn('debugDumpLastScore failed', e); }
		};
	}

	// In-game drawer console UI removed per request — no DOM console will be created or attached
});

document.addEventListener('DOMContentLoaded', function() {
	const drawer = document.getElementById('mobile-drawer');
	const toggle = document.getElementById('mobile-menu-toggle');
	const closeBtn = drawer.querySelector('.drawer-close');

	toggle.addEventListener('click', () => {
		drawer.classList.add('open');
		document.body.style.overflow = 'hidden';
	});
	closeBtn.addEventListener('click', () => {
		drawer.classList.remove('open');
		document.body.style.overflow = '';
	});
	// Optional: close drawer when clicking outside
	drawer.addEventListener('click', (e) => {
		if (e.target === drawer) {
			drawer.classList.remove('open');
			document.body.style.overflow = '';
		}
	});
});

// Console helper: populate the board and player's rack for a quick 7-letter bingo test.
// Usage in browser console:
//   window.setupBingoTest();
// Then place tiles if needed and call game.playWord(); or the helper will pre-place them and call game.playWord() if possible.
window.setupBingoTest = function setupBingoTest(word = 'PUZZLES') {
	try {
		const g = window.game;
		if (!g) { console.warn('Game instance not ready. Wait for DOMContentLoaded.'); return; }

		// Normalize word and ensure letters array
		word = ('' + word).toUpperCase();
		const rack = word.split('');

		// Reset placed tiles and optionally held tiles for a clean placement
		g.placedTiles = [];
		if (g.heldTiles !== undefined) g.heldTiles = [];

		// Set player's rack
		g.playerRack = rack.slice();
		try {
			if (typeof g.renderRack === 'function') g.renderRack();
			else if (typeof g.renderRacks === 'function') g.renderRacks();
		} catch (e) { console.warn('renderRack(s) failed', e); }

		const rows = g.board.length;
		const cols = g.board[0].length;
		const L = rack.length;

		let found = false;
		let foundRow = -1, foundCol = -1, vertical = false;

		// Search horizontal runs first
		for (let r = 0; r < rows && !found; r++) {
			for (let c = 0; c <= cols - L; c++) {
				let ok = true;
				for (let k = 0; k < L; k++) {
					if (g.board[r][c + k]) { ok = false; break; }
				}
				if (ok) { found = true; foundRow = r; foundCol = c; vertical = false; break; }
			}
		}

		// If not found, try vertical runs
		if (!found) {
			for (let c = 0; c < cols && !found; c++) {
				for (let r = 0; r <= rows - L; r++) {
					let ok = true;
					for (let k = 0; k < L; k++) {
						if (g.board[r + k][c]) { ok = false; break; }
					}
					if (ok) { found = true; foundRow = r; foundCol = c; vertical = true; break; }
				}
			}
		}

		if (!found) {
			console.warn('No contiguous', L, 'empty cells were found on the board. Clear some tiles and try again.');
			return;
		}

		// Place tiles into board and placedTiles as real tile objects expected by the game
		for (let i = 0; i < L; i++) {
			const letter = rack[i];
			const r = vertical ? (foundRow + i) : foundRow;
			const c = vertical ? foundCol : (foundCol + i);
			const placedTile = {
				letter,
				value: g.tileValues ? (g.tileValues[letter] || 1) : 1,
				id: `TEST-${Date.now()}-${i}`,
			};
			g.board[r][c] = placedTile;
			g.placedTiles.push({ tile: placedTile, row: r, col: c });
		}

	try { if (typeof g.renderBoard === 'function') g.renderBoard(); } catch (e) { console.warn('renderBoard failed', e); }
	try { if (typeof g.updateGameState === 'function') g.updateGameState(); } catch (e) { console.warn('updateGameState failed', e); }

		console.log('setupBingoTest: placed', word, (vertical ? 'vertically' : 'horizontally'), 'at row', foundRow, 'col', foundCol);
		console.log('Now call game.playWord() in the console to submit the bingo.');
	} catch (err) {
		console.error('setupBingoTest failed', err);
	}
};

// convenience aliases (case-insensitive-ish)
window.setupbingtest = window.setupBingoTest;
window.bingoTest = window.setupBingoTest;

// Simple console helper: replace player's rack with a 7-letter test word.
// Usage: window.setupBingoRack(); or setupBingoRack('EXAMPLE')
window.setupBingoRack = function setupBingoRack(word = 'PUZZLES') {
	try {
		const g = window.game;
		if (!g) return console.warn('game not ready');
		word = ('' + word).toUpperCase();
		const letters = word.split('');
		g.playerRack = letters.map((Ltr, idx) => ({
			letter: Ltr,
			value: (g.tileValues && g.tileValues[Ltr]) ? g.tileValues[Ltr] : 1,
			id: `RACK-TEST-${Date.now()}-${idx}`,
			isBlank: false
		}));
		try { if (typeof g.renderRack === 'function') g.renderRack(); else if (typeof g.renderRacks === 'function') g.renderRacks(); } catch(e) { console.warn('renderRack failed', e); }
		console.log('setupBingoRack: set rack to', word);
	} catch (err) {
		console.error('setupBingoRack failed', err);
	}
};

window.setupbingrack = window.setupBingoRack;

// sigh
