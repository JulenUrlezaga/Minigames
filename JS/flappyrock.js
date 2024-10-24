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
    width : 40,
    height : 45,
}

let fist = {
    x : rock.x,
    y : rock.y,
    width : 40,
    height : 20,
}

let hart = {
    x : (boardwidth/8) * 6,
    y : boardheight/2,
    width : 100,
    height : 120,
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
let velocityFist = 12; //fist
let velocityYHart = 5;//Hart head
let velocityHartBullet = 10;//Hart Bullet
let gravity = 0.4 //gravity
let gameover = false;
let startgame = false;
let score = 0;
let kontPipes = 0;
let pipesneeded = 20;
let hartDirection = 1;
let livesHart = 15;
let newlevel = false;
let pipeInterval;
let stopPipes = false;
let hartappeared = false;
let fistboolean = false;
let ctrlmessageboolean = true;

imgrock = new Image();
imgrock.src = "../IMGFlappyRock/Dwayne_Johnson.png";
imgrock.onload = function(){
    context.drawImage(imgrock,rock.x,rock.y,rock.width,rock.height);
}

imgfist = new Image();
imgfist.src = "../IMGFlappyRock/fist.png";

imghart = new Image();
imghart.src = "../IMGFlappyRock/KevinHartHead.png";


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
    }else{
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


    hart.y += velocityYHart * hartDirection;

    if (hart.y <= 0) {  //Pa arriba
        hartDirection = 1; 
    }
    if (hart.y + hart.height >= boardheight) {  //Pa abajo
        hartDirection = -1;  
    }

    if (rock.y>board.height){
        gameover=true;
    }

    context.drawImage(imgrock,rock.x,rock.y,rock.width,rock.height);

 
    if(!fistboolean){
        fist.x = rock.x + rock.width;  // Para que el puño esté pegado a Rock
        fist.y = rock.y + (rock.height / 2); - (fist.height / 2); // Centrar el puño (respecto a Rock)
    }else {
        fist.x += velocityFist;

        if (detectImpact(fist, hart)) {
            console.log("BOOM");
            fistboolean = false; 
            fist.x = rock.x + rock.width;
        }

        if(fist.x>board.width){
            fistboolean=false;
            fist.x = rock.x + rock.width;
        }
    }

    //FOR para dibujar las tuberias
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

    if (kontPipes >= 8 && !newlevel) {  
        console.log("newlevel");
        newlevel=true;

        toppipeimg = new Image();
        toppipeimg.src = "../IMGFlappyRock/toppipeRed.png";

        bottompipeimg = new Image();
        bottompipeimg.src = "../IMGFlappyRock/bottompipeRed.png";

        startInterval();
    }

    if (kontPipes==10){
        board.style.backgroundImage='url(../IMGFlappyRock/backgroundRed.png)';
        board.style.transition = 'background-image 0.5s ease-in-out';
    }

    if (kontPipes==18){
        stopPipes=true;
    }

    if (stopPipes && kontPipes==pipesneeded && !gameover){
        if(ctrlmessageboolean){
            context.fillText("Disparar: CTRL",5 , 90);
        }
        showfist();
        showhart();
        //moveHart();
        document.addEventListener("keydown", shootfist);
        if(gameover){
            resetGame();
        }
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
    startgame = true; 
    newlevel = false; 
    gameover = false; 
    stopPipes = false;
    fistboolean = false;
    ctrlmessageboolean=true;

    document.removeEventListener("keydown", shootfist);


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
}

// A-> ROCK B-> TUBERIA
function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y; 
}

// A-> FIST B-> HART
function detectImpact(c,d){
    return  c.x < d.x + d.width &&  // El puño está a la izquierda del borde derecho de Hart
            c.x + c.width > d.x &&  // El puño está a la derecha del borde izquierdo de Hart
            c.y < d.y + d.height && // El puño está por encima del borde inferior de Hart
            c.y + c.height > d.y;
}

function showfist(){
    context.drawImage(imgfist,fist.x,fist.y,fist.width,fist.height);
}

function showhart(){
    context.drawImage(imghart,hart.x,hart.y,hart.width,hart.height);
}

function shootfist(e){
    
    if (e.code === "ControlLeft" || e.code === "ControlRight"){
        fistboolean = true;
        if(fistboolean){ 
            console.log("ctrl");
            context.clearRect(5, 60, 300, 40);
            ctrlmessageboolean=false;
        }
    }
}