let board = document.getElementById("board");
let boton = document.getElementById("playfrock")

boton.addEventListener("click",function(){
    board.style.display="block";
    boton.style.display="none";
});

let context = board.getContext("2d");

let imgrock;

let boardheight = 600;
let boardwidth = 480;


board.height = boardheight;
board.width = boardwidth;


let rock = {
    x : boardwidth/8,
    y : boardheight/2,
    width : 50,
    height : 55,
}

let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let toppipeimg;
let bottompipeimg;


let velocityX = -2; //pipes
let velocityY = 0;  //rock
let gravity = 0.4 //gravity
let gameover = false;
let startgame = false;
let score = 0;

imgrock = new Image();
imgrock.src = "../IMGFlappyRock/Dwayne_Johnson.png";
imgrock.onload = function(){
    context.drawImage(imgrock,rock.x,rock.y,rock.width,rock.height);
}

toppipeimg = new Image();
toppipeimg.src = "../IMGFlappyRock/toppipe.png";

bottompipeimg = new Image();
bottompipeimg.src = "../IMGFlappyRock/bottompipe.png";

if(!startgame){
    context.fillStyle = "white";
    context.font ="45px sans-serif";
    context.fillText("Press SPACE to start",5 , 90);
    
}

requestAnimationFrame(update);


/*if (score<5){
    setInterval(placepipes, 2000);
}
if(score>=5){
    setInterval(placepipes, 500);
}*/

document.addEventListener("keydown", moveRock);

function update() {
    requestAnimationFrame(update);
    if(gameover){
        return;
    }

    if(!startgame){
        return
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    rock.y = Math.max(rock.y + velocityY, 0);


    if (rock.y>board.height){
        gameover=true;
    }

    context.drawImage(imgrock,rock.x,rock.y,rock.width,rock.height);


    for (i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && rock.x > pipe.x + pipe.width){
            score+= 0.5;
            pipe.passed=true;
        }
        if (detectCollision(rock,pipe)){
            gameover = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font ="45px sans-serif";
    context.fillText(score,5,45);

    if (gameover){
        context.fillText("GAME OVER",5 , 90);
    }

    
}

function placepipes() {
    if (gameover){
        return;
    }
    if(!startgame){
        return;
    }
    let openspace = boardheight/4;

    let randompipeY = pipeY - pipeheight/4 - Math.random()*(pipeheight/2);

    let toppipe = {
        img : toppipeimg,
        x : pipeX,
        y : randompipeY,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(toppipe);

    let bottompipe = {
        img : bottompipeimg,
        x : pipeX,
        y : randompipeY + pipeheight + openspace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipeArray.push(bottompipe);
}

function moveRock(e){
    let kontspace = 0;
    if (e.code == "Space"){
        velocityY = -6;
        kontspace++
    }

    if(kontspace==1){
        startgame=true;
    }

    if(gameover) {
        rock.y = boardheight/2;
        pipeArray = [];
        score = 0;
        gameover = false;
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y; 
}