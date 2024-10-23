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
let kontPipes = 0;
let newlevel = false;
let pipeInterval;
let stopPipes = false;

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




function startInterval() {
    if (pipeInterval) {
        clearInterval(pipeInterval);  
    }
    if (kontPipes < 5) {
        pipeInterval = setInterval(placepipes, 2000);
    } else {
        pipeInterval = setInterval(placepipes, 1500);  
    }
}

startInterval();

document.addEventListener("keydown", moveRock);



function update() {
    requestAnimationFrame(update);
    if(gameover || !startgame){
        return;
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
            kontPipes+= 0.5;
        }
        if (detectCollision(rock,pipe)){
            gameover = true;
        }
    }

    

    if (kontPipes >= 5 && !newlevel) {  
        console.log("5");
        newlevel=true;

        toppipeimg = new Image();
        toppipeimg.src = "../IMGFlappyRock/toppipeRed.png";

        bottompipeimg = new Image();
        bottompipeimg.src = "../IMGFlappyRock/bottompipeRed.png";
        
        

        board.style.backgroundImage='url(../IMGFlappyRock/backgroundRed.png)';

        board.style.transition = 'background-image 2s ease-in-out';


        startInterval();
    }

    if (kontPipes>=13){
        stopPipes=true;
    }
    if (stopPipes){
        document.addEventListener("keydown", shootfist);
    }

    if(score>=15 && !gameover){
        context.fillText("Disparar: CTRL",5 , 90);
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font ="45px sans-serif";
    context.fillText(score,5,45);

    if (gameover){
        context.fillText("GAME OVER",5 ,90);
    }
}

function resetGame() {
    rock.y = boardheight / 2;
    pipeArray = [];  
    score = 0;
    kontPipes = 0;  
    newlevel = false; 
    gameover = false;  
    startgame = true;
    toppipeimg.src = "../IMGFlappyRock/toppipe.png";
    bottompipeimg.src = "../IMGFlappyRock/bottompipe.png";  
    board.style.backgroundImage='url(../IMGFlappyRock/background.png)';
    board.style.transition = 'none'; 
    startInterval();   
}

function placepipes() {
    if (gameover || !startgame || stopPipes){
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
        if (gameover) {
            resetGame();
        }
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


function shootfist(e){
    if (e.code === "ControlLeft" || e.code === "ControlRight"){
        console.log("ctrl");
    }
}