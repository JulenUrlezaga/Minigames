let board = document.getElementById("board");
let botonesflappyrock = document.getElementById("botonesflappyrock");

let boton = document.getElementById("playfrock20");
let boton2 = document.getElementById("playfrock30");
let boton3 = document.getElementById("playfrock50");
let pipesneeded = 10;

boton.addEventListener("click",function(){
    board.style.display="block";
    botonesflappyrock.style.display="none";
});

boton2.addEventListener("click",function(){
    board.style.display="block";
    botonesflappyrock.style.display="none";
});

boton2.addEventListener("click",function(){
    board.style.display="block";
    botonesflappyrock.style.display="none";
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

let bullethart = {
    x : (boardwidth/8) * 6,
    y : boardheight/2,
    width : 80,
    height : 50,
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
let velocityHartBullet = 3;//Hart Bullet
let gravity = 0.4 //gravity
let gameover = false;
let startgame = false;
let finishgame = false;
let intervalChanged = false;
let hartbulletStarted = false;
let score = 0;
let kontPipes = 0;
let hartDirection = 1;
let livesHart = 5;
let phasesHart = 1;
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

imghartbullet = new Image();
imghartbullet.src = "../IMGFlappyRock/balabill.png";


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
    console.log(`Llamando a startInterval con kontPipes: ${kontPipes} y pipesneeded / 2: ${pipesneeded / 2}`);
    if (pipeInterval) {
        clearInterval(pipeInterval);  
    }
    if (Math.floor(kontPipes) < (pipesneeded / 2)-2) {
        pipeInterval = setInterval(placepipes, 2000);
        console.log("primer interval");
    }else if (!intervalChanged) { 
        pipeInterval = setInterval(placepipes, 1500); 
        console.log("segundo interval");
        intervalChanged = true;
    }
}

startInterval();

document.addEventListener("keydown", moveRock);


function update() {
    requestAnimationFrame(update);
    if(gameover || !startgame || finishgame){
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
        fist.y = rock.y + (rock.height / 2) - (fist.height / 2); // Centrar el puño (respecto a Rock)
    }else {
        fist.x += velocityFist;

        if (detectImpact(fist, hart)) {
            console.log("BOOM");
            fistboolean = false; 
            livesHart--;
            fist.x = rock.x + rock.width;
        }

        if(fist.x>board.width){
            fistboolean=false;
            fist.x = rock.x + rock.width;
        }
    }

    if(livesHart<=0 && !finishgame){
        livesHart = 10;
        imghart.src = "../IMGFlappyRock/KevinHartHeadTilted.png";
        velocityYHart += 3;
        hart.width -= hart.width * 0.1;
        hart.height -= hart.height * 0.1;
        score += 5;
        phasesHart++;
    }


    if (phasesHart>=3){
        imgrock.src = "../IMGFlappyRock/Dwayne_JohnsonTrunkSaiyan.png";

        rock.width = 70;
        rock.height = 85;

        imgfist.src = "../IMGFlappyRock/bolatrunks.png";
        fist.width = 20;

        velocityFist = 20;

        bullethart.width = 40;
        bullethart.height = 25;
        velocityHartBullet = 6;
    }

    if (score===(pipesneeded*3)){
        imghart.src = "../IMGFlappyRock/KevinHartHeadTiltedLost.png";
        finishgame=true;
    }

    if (phasesHart >= 2 && !hartbulletStarted) {
        hartbulletStarted = true;  // Marcar como activado
        bullethart.x = hart.x - hart.width;
        bullethart.y = hart.y + (hart.height / 2) - (bullethart.height / 2);
    }

    if (detectImpactBullet(bullethart, rock)) {
        console.log("BOOM");
        gameover=true;
        //resetGame();
    }

    if (hartbulletStarted) {
        shoothartbullet();
        showhartbullet();
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

    if (Math.floor(kontPipes) >= (pipesneeded / 2) - 2 && !newlevel) {
        console.log(`NEWLEVEL-> Iniciando nuevo nivel con kontPipes: ${kontPipes}`);
        newlevel=true;

        toppipeimg = new Image();
        toppipeimg.src = "../IMGFlappyRock/toppipeRed.png";

        bottompipeimg = new Image();
        bottompipeimg.src = "../IMGFlappyRock/bottompipeRed.png";

        startInterval();
    }

    if (Math.floor(kontPipes) === pipesneeded / 2) {
        board.style.backgroundImage='url(../IMGFlappyRock/backgroundRed.png)';
        board.style.transition = 'background-image 0.5s ease-in-out';
    }

    if (kontPipes==(pipesneeded-2)){
        stopPipes=true;
    }

    if (stopPipes && kontPipes==pipesneeded && !gameover){
        if(ctrlmessageboolean){
            context.fillText("Shoot FIST: CTRL",5 , 90);
        }else {
            context.fillText("Phase: "+phasesHart,5 , 90);
        }

        if (finishgame){
            context.clearRect(5, 50, 300, 50);
        }
        showfist();
        showhart();

        let text = "/";
        let barras = text.repeat(livesHart);

        context.fillText(barras,(boardwidth/2), 45);

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

    if(finishgame){
        context.fillText("YOU WIN",5 ,90); 
    }
}

function resetGame() {
    rock.y = boardheight / 2;
    pipeArray = [];  
    score = 0;
    kontPipes = 0;
    startgame = true;
    livesHart = 5;
    velocityYHart = 5;
    velocityFist = 12;
    velocityHartBullet = 3;
    phasesHart = 1;
    newlevel = false; 
    gameover = false;
    finishgame = false;
    stopPipes = false;
    intervalChanged = false;
    fistboolean = false;
    ctrlmessageboolean=true;
    hartbulletStarted = false;


    rock.width = 40;
    rock.height = 45;
    fist.width = 40;
    hart.width = 100;
    hart.height = 120;
    bullethart.height = 50;
    bullethart.width = 80;
 

    document.removeEventListener("keydown", shootfist);

    bullethart.x = hart.x - hart.width;
    bullethart.y = hart.y + (hart.height / 2) - (bullethart.height / 2);


    toppipeimg.src = "../IMGFlappyRock/toppipe.png";
    bottompipeimg.src = "../IMGFlappyRock/bottompipe.png";  
    board.style.backgroundImage='url(../IMGFlappyRock/background.png)';
    imghart.src = "../IMGFlappyRock/KevinHartHead.png";
    imgrock.src = "../IMGFlappyRock/Dwayne_Johnson.png";
    imgfist.src="../IMGFlappyRock/fist.png";
    imghartbullet.src="../IMGFlappyRock/balabill.png"
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
        if (gameover || finishgame) {
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

// C-> FIST D-> HART
function detectImpact(c,d){
    return  c.x < d.x + d.width &&  // El puño está a la izquierda del borde derecho de Hart
            c.x + c.width > d.x &&  // El puño está a la derecha del borde izquierdo de Hart
            c.y < d.y + d.height && // El puño está por encima del borde inferior de Hart
            c.y + c.height > d.y;
}

// C-> FIST D-> HART
function detectImpactBullet(e,f){
    return  e.x < f.x + f.width &&  // La bala está a la derecha del borde derecho de Rock
            e.x + e.width > f.x &&  // La bala está a la izuqierda del borde izquierdo de Rock
            e.y < f.y + f.height && // La bala está por encima del borde inferior de Hart
            e.y + e.height > f.y;
}

function showfist(){
    context.drawImage(imgfist,fist.x,fist.y,fist.width,fist.height);
}

function showhart(){
    context.drawImage(imghart,hart.x,hart.y,hart.width,hart.height);
}

function showhartbullet(){
    context.drawImage(imghartbullet,bullethart.x,bullethart.y,bullethart.width,bullethart.height);
}

function shoothartbullet(){
    bullethart.x -= velocityHartBullet;

    if (bullethart.x + bullethart.width < 0) {
        bullethart.x = hart.x - hart.width; // Reiniciar la posición x de la bala
        bullethart.y = hart.y + (hart.height / 2) - (bullethart.height / 2); // Ajuste de posición y
    }
}

function shootfist(e){
    
    if (e.code === "ControlLeft" || e.code === "ControlRight"){
        fistboolean = true;
        if(fistboolean){ 
            console.log("ctrl");
            context.clearRect(0, 60, boardwidth, 40);
            ctrlmessageboolean=false;

            if(gameover || finishgame){
                resetGame();
            }
        }

        
    }
}