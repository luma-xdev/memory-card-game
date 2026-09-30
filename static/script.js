const gameBoard = document.getElementById("game-board");

const movesDisplay = document.getElementById("moves");

const timerDisplay = document.getElementById("timer");

const pairsDisplay = document.getElementById("pairs");

const restartButton = document.getElementById("restart-btn");

const winModal = document.getElementById("win-modal");

const finalMoves = document.getElementById("final-moves");

const finalTime = document.getElementById("final-time");

const playAgainButton = document.getElementById("play-again");


// Card emojis

const emojis = [
    "🍎",
    "🍕",
    "🚀",
    "🐱",
    "🌈",
    "⚽",
    "🎮",
    "🦄"
];


// Game variables

let cards = [];

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;

let matchedPairs = 0;

let seconds = 0;

let timerInterval = null;

let gameStarted = false;


// Shuffle function

function shuffle(array) {

    return array.sort(() => Math.random() - 0.5);

}


// Start game

function startGame() {

    clearInterval(timerInterval);

    cards = [];

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    moves = 0;

    matchedPairs = 0;

    seconds = 0;

    gameStarted = false;

    movesDisplay.textContent = "0";

    timerDisplay.textContent = "00:00";

    pairsDisplay.textContent = "0 / 8";

    winModal.classList.remove("show");

    gameBoard.innerHTML = "";


    // Create pairs

    const cardValues = shuffle([...emojis, ...emojis]);


    cardValues.forEach((emoji, index) => {

        const card = document.createElement("div");

        card.classList.add("card");

        card.dataset.value = emoji;

        card.innerHTML = `
            <div class="card-inner">

                <div class="card-front"></div>

                <div class="card-back">
                    ${emoji}
                </div>

            </div>
        `;


        card.addEventListener("click", () => flipCard(card));


        gameBoard.appendChild(card);

        cards.push(card);

    });

}


// Start timer

function startTimer() {

    if (gameStarted) {
        return;
    }

    gameStarted = true;

    timerInterval = setInterval(() => {

        seconds++;

        timerDisplay.textContent = formatTime(seconds);

    }, 1000);

}


// Format timer

function formatTime(totalSeconds) {

    const minutes = Math.floor(totalSeconds / 60);

    const secs = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}


// Flip card

function flipCard(card) {

    if (lockBoard) {
        return;
    }

    if (card === firstCard) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }


    startTimer();


    card.classList.add("flipped");


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    moves++;

    movesDisplay.textContent = moves;


    checkMatch();

}


// Check matching cards

function checkMatch() {

    const isMatch =
        firstCard.dataset.value === secondCard.dataset.value;


    if (isMatch) {

        disableCards();

    } else {

        unflipCards();

    }

}


// Matching pair

function disableCards() {

    firstCard.classList.add("matched");

    secondCard.classList.add("matched");

    matchedPairs++;

    pairsDisplay.textContent = `${matchedPairs} / 8`;

    resetBoard();


    if (matchedPairs === 8) {

        finishGame();

    }

}


// Wrong pair

function unflipCards() {

    lockBoard = true;

    setTimeout(() => {

        firstCard.classList.remove("flipped");

        secondCard.classList.remove("flipped");

        resetBoard();

    }, 900);

}


// Reset selected cards

function resetBoard() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


// Game finished

function finishGame() {

    clearInterval(timerInterval);

    finalMoves.textContent = moves;

    finalTime.textContent = formatTime(seconds);

    setTimeout(() => {

        winModal.classList.add("show");

    }, 500);

}


// Restart button

restartButton.addEventListener("click", startGame);


// Play again

playAgainButton.addEventListener("click", startGame);


// Start first game

startGame();
