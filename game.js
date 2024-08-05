const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreElement = document.createElement('div');
scoreElement.id = 'score';
document.body.appendChild(scoreElement);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gravity = -0.5;
const player = {
    x: 50,
    y: 100,
    width: 50,
    height: 50,
    color: '#00FF00',
    dx: 0,
    dy: 0,
    speed: 5,
    jumpPower: 10,
    isJumping: false,
    isGrounded: false,
    wasGrounded: false, 
    startY: 100 
};

const platformWidth = 150;
const platformHeight = 20;
const minVerticalGap = 50; 
const maxVerticalGap = 100; 
const minHorizontalGap = 10; 
const maxHorizontalGap = 50; 


const initialPlatforms = [
    { x: 0, y: 0, width: canvas.width, height: platformHeight, color: '#444' }, 
    { x: 100, y: 150, width: platformWidth, height: platformHeight, color: '#666' }, 
    { x: 300, y: 250, width: platformWidth, height: platformHeight, color: '#888' }  
];

let platforms = [...initialPlatforms]; 
let score = 0; 

function generatePlatform(x, y) {
    return {
        x,
        y,
        width: platformWidth,
        height: platformHeight,
        color: '#666' 
    };
}

function addNewPlatform() {
    const lastPlatform = platforms[platforms.length - 1];
    const newY = lastPlatform.y + (Math.random() * (maxVerticalGap - minVerticalGap) + minVerticalGap); 
    const newX = Math.random() * (canvas.width - platformWidth);

    
    if (newX + platformWidth > canvas.width) {
        newX = canvas.width - platformWidth;
    } else if (newX < 0) {
        newX = 0;
    }

    platforms.push(generatePlatform(newX, newY));
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - camera.x, player.y - camera.y, player.width, player.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x - camera.x, platform.y - camera.y, platform.width, platform.height);
    });
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`; 
}

function handlePlayerMovement() {
    if (player.isJumping && player.isGrounded) {
        player.dy = player.jumpPower; 
        player.isGrounded = false;
    }

    player.dy += gravity;
    player.y += player.dy;
    player.x += player.dx;

    player.wasGrounded = player.isGrounded; 
    player.isGrounded = false; 

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

            
            score = Math.floor((player.y - player.startY) / 10); 
        }
    });

    
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.isGrounded = true;

        
        score = Math.floor((player.y - player.startY) / 10);
    }

    
    if (platforms.length > 0 && platforms[platforms.length - 1].y < camera.y + canvas.height) {
        addNewPlatform();
    }

    
    if (platforms.length > 0 && platforms[0].y < camera.y - platformHeight) {
        platforms.shift();
    }
}

const camera = {
    x: 0,
    y: 0
};

function updateCamera() {
    
    camera.y = player.y - canvas.height / 2 + player.height / 2;
    
    camera.y = Math.max(camera.y, 0);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateCamera(); 
    drawPlatforms();
    handlePlayerMovement();
    drawPlayer();
    updateScore();

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
