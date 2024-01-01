
var $canvas = document.getElementById("myCanvas");
var ctx = $canvas.getContext("2d");

//----------------------------------------------------------------------------

var gameDraw = null;
var bulletList = [];
var targetList = [];
var bulletGap = 25;
var keyStay = { "right" : false , "left" : false, "up" : false , "down" : false };
var keyOnce = {"fire" : "up"}; // up , true , down
var player = {
    "x": 400,
    "y": 400,
    "radius": 15,
    "speed": 3,
    "power": 1,
    "color": "lightblue",
};

// draw Arc
function draw(){
    ctx.clearRect(0, 0, $canvas.width, $canvas.height);
    drawArc(player);
    moveArc(player);
    setTarget();
    drawTarget();
    moveTarget();
    drawBullet();
    moveBullet();
    collisionTargetBulletCheck(bulletList, targetList);
    let collisionUserCheck = collisionTargetPlayerCheck(targetList);
    if (collisionUserCheck) {
        clearInterval(gameDraw);
        gameStart.style.display = "inline-block";
        gameDraw = null;
        targetList = [];
    }
}

function drawArc(arc) {
    ctx.beginPath();
    ctx.arc(arc.x, arc.y, arc.radius, 0 , Math.PI * 2);
    ctx.fillStyle = arc.color;
    ctx.fill();
    ctx.closePath();
}


// draw Target
function setTarget() {
    if (targetList.length <= 0) {
        for (let i = 0; i < 30; i++) {
            let target = {
                "x" : 0,
                "y" : 0,
                "r" : 20,
                "speed" : 3,
            }
            let width = $canvas.width - target.r;
            let height = $canvas.height / 2;
            let rX = Math.floor(Math.random() * width - 1);
            let rY = Math.floor(Math.random() * height - 1);

            target.x = rX;
            target.y = -rY;
            targetList.push(target);
        }
    }
}

function drawTarget() {
    for (let i = 0; i < targetList.length; i++) {
        let target = targetList[i];
        ctx.beginPath()

        ctx.arc(target.x, target.y, target.r, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        ctx.closePath();
    }
}

function moveTarget() {
    for (let i = 0; i < targetList.length; i++) {
        let target = targetList[i];
        target.y += target.speed;

        if (target.y > $canvas.height + 50) {
            targetList.splice(i, 1);
        }
    }
}

// draw bullet
// when player press space construct bullet
function setBullet() {
    let bullet = {
        "x": player.x,
        "y": player.y - bulletGap,
        "r": 5,
        "color": "orange",
        "speed": 3,
    }
    bulletList.push(bullet);
}

function drawBullet() {
    for (let i = 0; i < bulletList.length; i++) {
        let bullet = bulletList[i];

        ctx.beginPath();

        ctx.arc(bullet.x, bullet.y, bullet.r, 0, 2 * Math.PI);
        ctx.fillStyle = bullet.color;
        ctx.fill();

        ctx.closePath();
    }
}

function moveBullet() {
    for (let i = 0; i < bulletList.length; i++) {
        let bullet = bulletList[i];
        bullet.y -= bullet.speed;

        if (bullet.y < -10) {
            bulletList.splice(i, 1);
        }
    }
}

// collision target player
function collisionTargetPlayerCheck(targetList) {
    for (let i = 0; i < targetList.length; i++) {
        let target = targetList[i];
        let a = target.x - player.x;
        let b = target.y - player.y;
        let totalRadius = target.r + player.radius;
        let hypotenusePow = Math.abs((a * a) + (b * b));
        let hypotenuse = Math.sqrt(hypotenusePow);

        if (hypotenuse <= totalRadius) {
            return true;
        }
    }
}

// collision target bullet
function collisionTargetBulletCheck(bulletList, targetList) {
    for (let i = 0; i < bulletList.length; i++) {
        let bullet = bulletList[i];
        for (let j = 0; j < targetList.length; j++) {
            if (targetList.length > 0) {
                let target = targetList[j];
                let a = target.x - bullet.x;
                let b = target.y - bullet.y;
                let totalRadius = target.r + bullet.r;
                let hypotenusePow = Math.abs((a * a) + (b * b));
                let hypotenuse = Math.sqrt(hypotenusePow);

                if (hypotenuse <= totalRadius) {
                    targetList.splice(j, 1);
                }
            }
        }
    }
}

// move
function moveArc(arc) {
    if (getKeyStay("left")) {
        arc.x -= arc.speed;
    }
    if (getKeyStay("right")) {
        arc.x += arc.speed;
    }
    if (getKeyStay("up")) {
        arc.y -= arc.speed;
    }
    if (getKeyStay("down")) {
        arc.y += arc.speed;
    }
    if (getKeyOnce("fire")) {
        setBullet();
    }
}

function getKeyOnce(key){
    if(keyOnce[key] == "true"){
        keyOnce[key] = "down";
        return true;
    } else if (keyOnce[key] == "down") {
        return false;
    }
}

function getKeyStay(key){
    return keyStay[key];
}

window.addEventListener("keydown", (e) => {
    if(e.code == 'ArrowLeft') {
        keyStay.left = true;
    }
    if(e.code == 'ArrowRight') {
        keyStay.right = true;
    }
    if(e.code == 'ArrowUp') {
        keyStay.up = true;
    }
    if(e.code == 'ArrowDown') {
        keyStay.down = true;
    }
    if(e.code == 'Space'
    ){
        if(keyOnce.fire == "up"){
            keyOnce.fire = "true";
        }
    }
});

window.addEventListener("keyup", (e) => {
    if(e.code == 'ArrowLeft') {
        keyStay.left = false;
    }
    if(e.code == 'ArrowRight') {
        keyStay.right = false;
    }
    if(e.code == 'ArrowUp') {
        keyStay.up = false;
    }
    if(e.code == 'ArrowDown') {
        keyStay.down = false;
    }
    if(e.code == 'Space'){
        keyOnce.fire = "up";
    }
});

var gameStart = document.getElementById("gameStart");
gameStart.addEventListener('click' , (e) => {
    if (gameDraw == null) {
        clearInterval(gameDraw);
        gameDraw = setInterval(draw, 10);
        gameStart.style.display = "none";
    }
});