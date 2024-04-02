const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");
var result;
const asciiLowercase = "abcdefghijklmnopqrstuvwxyz";
let alreadyUsedLetters = "";
let alreadyUsedWrongLetters = "";
const wrongLettersLimit = 6;

const lettersCoordinates = {
    startX: 150,
    startY: 350,
    letterSpacing: 25,
    placeholderWidth: 20,
    placeholderHeight: 5,
    lettersPadding: 10, // Centers the letters in the middle of the placeholder
};

const gallowsBase = {
    x: 100,
    y: 220,
    width: 80,
    height: 10,
};

const gallowsMainPole = {
    x: 135,
    y: 10,
    width: 10,
    height: 210,
};

const gallowsTopPole = {
    x: 135,
    y: 10,
    width: 80,
    height: 10,
};

const gallowsKnot = {
    x: 215,
    y: 10,
    width: 10,
    height: 30,
};

const wrongLetters = {
    titleX: canvas.width - 150,
    titleY: 20,
    letterSpacing: 20,
    lettersY: 40, // titleY + 20
};

async function fetchWordFromServer() {
    try {
        const response = await axios.get("/fetchWord"); // Update with your server's address
        return response.data.word;
    } catch (error) {
        console.error("Error fetching word from API:", error);
        // Handle the error appropriately
        return null;
    }
}

function drawHangingGallow() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.lineWidth = 10;
    // Base
    ctx.rect(
        gallowsBase.x,
        gallowsBase.y,
        gallowsBase.width,
        gallowsBase.height
    );
    // Main pole
    ctx.rect(
        gallowsMainPole.x,
        gallowsMainPole.y,
        gallowsMainPole.width,
        gallowsMainPole.height
    );
    // Top pole
    ctx.rect(135, 10, 80, 10);
    // Knot
    ctx.rect(215, 10, 10, 30);
    ctx.fill();
    ctx.closePath();
}

function drawWrongLettersLabel() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "start";
    ctx.fillText("Wrong Letters:", wrongLetters.titleX, wrongLetters.titleY);
}

function drawWrongLetter(letter, index) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(
        letter,
        wrongLetters.titleX + index * wrongLetters.letterSpacing,
        wrongLetters.lettersY
    );
}

function drawLetterPlaceholder(word) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    console.log(word);
    for (let i = 0; i < word.length; i++) {
        ctx.beginPath();
        ctx.fillRect(
            lettersCoordinates.startX + i * lettersCoordinates.letterSpacing,
            lettersCoordinates.startY,
            lettersCoordinates.placeholderWidth,
            lettersCoordinates.placeholderHeight
        ); // Draws a small rectangle as placeholder
        ctx.closePath();
    }
}

function isWordGuessed() {
    // Check if every letter in result is included in alreadyUsedLetters
    return result
        .split("")
        .every((letter) => alreadyUsedLetters.includes(letter));
}

function checkAndDrawLetter(letter) {
    // Loop through the word and check if the user's input matches any letter
    if (alreadyUsedLetters.includes(letter)) {
        displayModal(`The letter ${letter} was already used!`);
        return;
    } else if (result.includes(letter)) {
        // loop over the letters in the fetched word to draw all matches
        for (let i = 0; i < result.length; i++) {
            if (result[i] === letter) {
                // If the letter is correct, draw it on the canvas
                drawLetter(letter, i);
            }
        }
    } else {
        // handle wrong letters
        displayModal("Wrong letter!");
        alreadyUsedWrongLetters += letter;
        drawWrongLetter(letter, alreadyUsedWrongLetters.length - 1);
        if (alreadyUsedWrongLetters.length >= wrongLettersLimit) {
            displayGameOverModal();
        }
    }
    alreadyUsedLetters += letter;
    // Check if the user has won
    if (isWordGuessed()) {
        displayGameOverModal(true); // Display the winning modal
    }
}

function displayModal(message) {
    const modal = document.getElementById("game-modal");
    modal.textContent = message;
    modal.classList.add("show");

    setTimeout(() => {
        modal.classList.remove("show");
    }, 5000); // Hide after 5 seconds
}

function drawLetter(letter, index) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(
        letter,
        lettersCoordinates.startX +
            index * lettersCoordinates.letterSpacing +
            lettersCoordinates.lettersPadding,
        lettersCoordinates.startY - lettersCoordinates.placeholderHeight,
        lettersCoordinates.placeholderWidth
    ); // Draw the letter on the canvas
}

async function draw() {
    result = await fetchWordFromServer();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHangingGallow();
    drawLetterPlaceholder(result);
    drawWrongLettersLabel();
}

function displayGameOverModal(isUserWin = false) {
    const modal = document.createElement("div");
    modal.id = "game-over-modal";
    modal.innerHTML = `
        <h2>${
            isUserWin
                ? "Congratulations! You guessed correctly!"
                : "You lost! Better luck next time!"
        }</h2>
        <button id="restart-btn-modal">Play Again</button>
    `;
    document.body.appendChild(modal);

    // Add styling (see CSS modifications below)

    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.id = "modal-backdrop";
    document.body.appendChild(backdrop);

    // Add styling for backdrop (see CSS modifications below)

    // Event listener for the restart button inside the modal
    const restartBtnModal = document.getElementById("restart-btn-modal");
    restartBtnModal.addEventListener("click", () => {
        document.body.removeChild(modal);
        document.body.removeChild(backdrop);
        resetGame();
    });
}

document.addEventListener("keyup", function (event) {
    const letter = event.key.toLowerCase();

    // Check if the pressed key is a letter (a-z)
    if (asciiLowercase.includes(letter)) {
        checkAndDrawLetter(letter);
    }
});

function resetGame() {
    alreadyUsedLetters = "";
    alreadyUsedWrongLetters = "";
    draw(); // Redraw the canvas to start fresh
}

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", resetGame);

draw();
