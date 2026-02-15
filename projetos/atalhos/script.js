const allShortcuts = [
    { id: "1", action: "Copiar Texto", key: "CTRL + C" },
    { id: "2", action: "Colar Texto", key: "CTRL + V" },
    { id: "3", action: "Desfazer Erro", key: "CTRL + Z" },
    { id: "4", action: "Salvar no Word (PT)", key: "CTRL + B" },
    { id: "5", action: "Negrito no Word", key: "CTRL + N" },
    { id: "6", action: "Imprimir", key: "CTRL + P" },
    { id: "7", action: "Selecionar Tudo", key: "CTRL + T" },
    { id: "8", action: "Localizar na Net", key: "CTRL + F" },
    { id: "9", action: "Mostrar Área de Trab.", key: "WIN + D" },
    { id: "10", action: "Bloquear PC", key: "WIN + L" },
    { id: "11", action: "Itálico no Word", key: "CTRL + I" },
    { id: "12", action: "Sublinhado", key: "CTRL + S" }
];

const gameBoard = document.getElementById('game-board');
const endScreen = document.getElementById('end-screen');
const mistakesDisplay = document.getElementById('mistakes');
const matchesDisplay = document.getElementById('matches');

let hasFlippedCard = false, lockBoard = false;
let firstCard, secondCard;
let matches = 0, mistakes = 0;
const totalPairs = 8; 

function shuffleArray(array) {
    return array.slice().sort(() => Math.random() - 0.5);
}

function initGame() {
    matches = 0; mistakes = 0;
    hasFlippedCard = false; lockBoard = false;
    firstCard = null; secondCard = null;
    
    updateStats();
    endScreen.style.display = 'none';
    gameBoard.innerHTML = '';
    gameBoard.style.pointerEvents = 'auto'; 
    gameBoard.style.opacity = '1';

    let selectedPairs = shuffleArray(allShortcuts).slice(0, totalPairs);
    let cardsData = [];
    
    selectedPairs.forEach(pair => {
        cardsData.push({ id: pair.id, type: 'action', text: pair.action });
        cardsData.push({ id: pair.id, type: 'key', text: pair.key });
    });

    cardsData = shuffleArray(cardsData);

    cardsData.forEach((data, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('memory-card');
        cardElement.dataset.id = data.id;
        
        cardElement.style.animationDelay = `${index * 0.04}s`;

        cardElement.innerHTML = `
            <div class="front-face type-${data.type}">${data.text}</div>
            <div class="back-face">?</div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    let currentCard = this;

    currentCard.classList.add('is-shrinking');

    setTimeout(() => {
        currentCard.classList.add('flip'); 
        currentCard.classList.remove('is-shrinking'); 

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = currentCard;
            return;
        }

        secondCard = currentCard;
        checkForMatch();
    }, 150);
}

function checkForMatch() {
    let isMatch = firstCard.dataset.id === secondCard.dataset.id;
    
    setTimeout(() => {
        isMatch ? disableCards() : unflipCards();
    }, 150);
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    matches++;
    updateStats();
    resetBoard();

    if (matches === totalPairs) {
        setTimeout(showEndScreen, 1000);
    }
}

function unflipCards() {
    lockBoard = true;
    mistakes++;
    updateStats();

    firstCard.classList.add('shake');
    secondCard.classList.add('shake');

    setTimeout(() => {
        firstCard.classList.remove('shake');
        secondCard.classList.remove('shake');

        firstCard.classList.add('is-shrinking');
        secondCard.classList.add('is-shrinking');

        setTimeout(() => {
            firstCard.classList.remove('flip', 'is-shrinking');
            secondCard.classList.remove('flip', 'is-shrinking');
            resetBoard();
        }, 150);

    }, 500); 
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function updateStats() {
    mistakesDisplay.textContent = mistakes;
    matchesDisplay.textContent = matches;
}

function showEndScreen() {
    gameBoard.style.pointerEvents = 'none';
    gameBoard.style.opacity = '0.3';
    gameBoard.style.transition = 'opacity 0.5s';
    
    endScreen.style.display = 'block';
    
    const mistakesText = document.getElementById('final-mistakes');
    if (mistakes === 0) {
        mistakesText.textContent = "🏆 Perfeito! Memória fotográfica, nenhum erro!";
        mistakesText.style.color = "var(--success-green)";
    } else {
        mistakesText.textContent = `Vocês cometeram ${mistakes} erro(s) nessa rodada.`;
        mistakesText.style.color = "var(--text-dark)";
    }
}

initGame();