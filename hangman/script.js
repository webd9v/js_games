const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");
var result;

async function fetchNewWord() {
    const apiUrl = "https://random-word-api.herokuapp.com/word?lang=en";
    const response = await fetch(apiUrl);
    const data = await response.json();
    result = data[0]; // assuming data is an array and you want the first word
}

function drawHangingGallow() {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.lineWidth = 10;
    // Base
    ctx.rect(100, 220, 80, 10);
    // Main pole
    ctx.rect(135, 10, 10, 210);
    // Top pole
    ctx.rect(135, 10, 80, 10);
    // Knot
    ctx.rect(215, 10, 10, 30);
    ctx.fill();
    ctx.closePath();
}

function drawLetterPlaceholder() {
    const startX = 200; // You'll want to adjust this based on canvas size and word length
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    const startY = 300;
    const letterSpacing = 20;
    for (let i = 0; i < result.length; i++) {
        ctx.beginPath();
        ctx.fillRect(startX + i * letterSpacing, startY, 15, 5); // Draws a small rectangle as placeholder
        ctx.closePath();
    }
}

async function draw() {
    await fetchNewWord();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHangingGallow();
    drawLetterPlaceholder();
}

draw();
