var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Set circle properties
var x = canvas.width / 2; // Center X coordinate (half of canvas width)
var y = canvas.height / 2; // Center Y coordinate (half of canvas height)
var radius = 50; // Circle radius
var startAngle = 0; // Starting angle (0 for 3 o'clock position)
var endAngle = Math.PI * 2; // Ending angle for full circle (2 * PI)

// Set stroke style (outline)
ctx.strokeStyle = "blue";
ctx.lineWidth = 5; // Line width (optional)

// Draw the circle
ctx.beginPath(); // Begin a new path
ctx.arc(x, y, radius, startAngle, endAngle);

// Choose how to display the circle (stroke or fill)
ctx.stroke(); // Draws the outline of the circle

// (Optional) Fill the circle with a color
ctx.fillStyle = "red";
ctx.fill();
