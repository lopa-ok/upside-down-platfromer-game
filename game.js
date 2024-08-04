const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let level = 0;

const gravity = -0.5;
const player = {
    x: 50,
    y: 100,
    width: 50,
    height: 50,
    color: '#00FF00', // Retro green color
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: 10,
    isJumping: false,
    isGrounded: false
};

const platforms = [
    { x: 0, y: 0, width: canvas.width, height: 50, color: '#444' }, // Top platform
    { x: 100, y: 150, width: 150, height: 20, color: '#666' }, // Middle platform
    { x: 300, y: 250, width: 200, height: 20, color: '#888' }  // Bottom platform
];

// Create level display element
const levelDisplay = document.createElement('div');
levelDisplay.id = 'levelDisplay';
levelDisplay.textContent = `Level: ${level}`;
document.body.appendChild(levelDisplay);

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function handlePlayerMovement() {
    if (player.isJumping && player.isGrounded) {
        player.dy = player.jumpPower; // Jump downwards
        player.isGrounded = false;
        level--; // Decrease level on jump
        levelDisplay.textContent = `Level: ${level}`;
    }

    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;

    let wasGrounded = player.isGrounded;
    player.isGrounded = false; // Reset grounded status

    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height
        ) {
            player.y = platform.y + platform.height;
            player.dy = 0;
            player.isGrounded = true;
        }
    });

    // Increase level if the player falls below the top platform
    if (player.y > platforms[0].y + platforms[0].height && !wasGrounded) {
        level++; // Increase level when falling down
        levelDisplay.textContent = `Level: ${level}`;
    }

    // Ensure player does not fall below the screen
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.isGrounded = true;
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    handlePlayerMovement();
    drawPlayer();

    requestAnimationFrame(update);
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        player.isJumping = true;
    }
    if (e.code === 'ArrowLeft') {
        player.dx = -player.speed;
    }
    if (e.code === 'ArrowRight') {
        player.dx = player.speed;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        player.isJumping = false;
    }
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.dx = 0;
    }
});

update();
