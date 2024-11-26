var casillasparejascant;
var parejascant;
var modojuego;
const containerparejas = document.getElementById('container_game_pairs');
const numerosUsados = [];
var contparejasdiv = document.getElementById("contadorespairs");
var contparejastries = document.getElementById("pairstriescontador");
var contparejas = document.getElementById("contpairs");
var contfails = document.getElementById("contfails");
var playpairs = document.getElementById("playpairs");

var cartasparejas = [];
var cartasparejaselegidas = [];
var randomNumero=0;
var contadorclicks=0;
var parejas = 0;
var fallos = 0;

const face = "face";
const back = "back";



botones();

function botones () {
    
    playpairs.addEventListener("click", function(){
        resetGame();
        
        containerparejas.style.display="flex";
        casillasparejascant=20;
        parejascant=10;
        contparejasdiv.style.display="block";
        
        playpairs.style.display="none";
        cartarandomparejas();
    });

}




function resetGame() {
    console.log("Reseteando juego...");
    containerparejas.style.pointerEvents = "none";

    setTimeout(() => {
        containerparejas.innerHTML = "";
        cartasparejas = [];
        cartasparejaselegidas = [];
        contadorclicks = 0;
        parejas = 0;
        fallos = 0;
        numerosUsados.length = 0;
        contparejas.innerText = parejas;
        contfails.innerText = fallos;

        cartarandomparejas();
        containerparejas.style.pointerEvents = "auto";
    }, 500);
}



function cartarandomparejas() {
    containerparejas.innerHTML = "";
    cartasparejas = [];
    
    for (let i = 0; i < casillasparejascant/2; i++) {
        let num = numerorandom();
        cartasparejas.push(num);
        cartasparejas.push(num);
    }

    /*MEZCLAR*/ 
    cartasparejas = cartasparejas.sort(() => Math.random() - 0.5);

    console.log(cartasparejas);

    cartasparejas.forEach(card => {
        const cartapareja = document.createElement("span");
        cartapareja.className="cartapareja";
        cartapareja.setAttribute('data-card',back);
        cartapareja.innerText='?';

        cartapareja.addEventListener('click', function(){
            if (cartapareja.getAttribute('data-card') === face) {
                return; 
            }
  
            if (cartapareja.getAttribute('data-card') === back) {
                cartapareja.setAttribute('data-card', face);
                cartapareja.innerText = card;
                cartasparejaselegidas.push(cartapareja);
                contadorclicks++;
            }

            if (contadorclicks === 2) {
            console.log("2 cartas seleccionadas");
            setTimeout(comprobarPareja, 500);
            }
            else if(contadorclicks>2){
                cartapareja.innerText='?';
                cartapareja.setAttribute('data-card', back);
            }
        });

        
        containerparejas.appendChild(cartapareja);
    });
    return randomNumero;
}


function numerorandom() {
    do {
        randomNumero = Math.floor(Math.random() * parejascant);
    } while (numerosUsados.includes(randomNumero));
    
    numerosUsados.push(randomNumero);
    return randomNumero;
}


function comprobarPareja() {
    const [carta1, carta2] = cartasparejaselegidas;

    if (carta1.innerText === carta2.innerText) {
        parejas++;
    } else {
        carta1.setAttribute('data-card', back);
        carta1.innerText = '?';
        carta2.setAttribute('data-card', back);
        carta2.innerText = '?';
        fallos++;
    }

    if (parejas==parejascant){
        console.log("Todas las parejas encontradas. Reiniciando juego...");
        setTimeout(resetGame,500);
    }

    contparejas.innerText=parejas;
    contfails.innerText=fallos;

    cartasparejaselegidas = [];
    contadorclicks = 0;
}


