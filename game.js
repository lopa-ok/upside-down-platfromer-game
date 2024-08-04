const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    { x: 0, y: 0, width: canvas.width, height: 50, color: '#444' } // Darker color for platforms
];

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
    }

    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;

    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y
        ) {
            player.y = platform.y + platform.height;
            player.dy = 0;
            player.isGrounded = true;
        }
    });

    if (player.y > platforms[0].y + platforms[0].height) {
        player.isGrounded = false;
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
