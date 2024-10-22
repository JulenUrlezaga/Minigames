document.addEventListener("DOMContentLoaded", empezarjuego);
var cartasjugador = [];
var cartasdealer = [];
var suma = 0;
var sumadealer = 0;
var wincount = 0;
var losecount = 0;
var drawcount = 0;
var mensaje = document.getElementById("mensaje");
const hit = document.getElementById("hit");
const stay = document.getElementById("stay");

let vivo = true; 

function cartarandom() {
    var randomNumero = Math.floor(Math.random() * 13) + 1;

    if (randomNumero == 11) {
        return 'J'; 
    } else if (randomNumero === 1) {
        return 'A'; 
    } else if(randomNumero == 12){
        return 'Q';
    }else if(randomNumero == 13){
        return 'K'
    }else {
        return randomNumero; 
    }
}

function empezarjuego() {
    cartasjugador = [];
    cartasdealer = [];
    suma = 0;
    sumadealer = 0;

    mensaje.innerText = "";
    vivo = true;

    document.getElementById("sumdealer").innerText = ''; 
    document.getElementById("container_cards_dealer").innerText = ''; 

    ableButtons();
 
    hit.removeEventListener('click', handleHit);
    stay.removeEventListener('click', handleStay); 

    for (let i = 0; i < 2; i++) {
        cartasjugador.push(cartarandom());
        cartasdealer.push(cartarandom());
    }

    if((calcularSuma(cartasdealer) !== calcularSuma(cartasjugador) && calcularSuma(cartasdealer)===21) || (calcularSuma(cartasjugador) !== calcularSuma(cartasdealer) && calcularSuma(cartasjugador)===21) || (calcularSuma(cartasdealer) === calcularSuma(cartasjugador) && calcularSuma(cartasjugador)===21 && calcularSuma)){
        console.log(calcularSuma(cartasdealer));
        console.log("------------");
        console.log(calcularSuma(cartasjugador));
        verificacion();
    }


    sumaplayershow();
    printcards();
    printcardsdealer();

    hit.addEventListener('click', handleHit);
    stay.addEventListener('click', handleStay);
}

function printcards() {

    document.getElementById("container_cards_player").innerHTML = '';

    cartasjugador.forEach(carta => {
        const cartaSpan = document.createElement("span");
        cartaSpan.className = "card-value";
        cartaSpan.innerText = carta;
        document.getElementById("container_cards_player").appendChild(cartaSpan);
    });
}

function printcardsdealer() {
    document.getElementById("container_cards_dealer").innerHTML = '';

    cartasdealer.forEach((carta, index) => {
        const cartaSpan = document.createElement("span");
        cartaSpan.className = "card-value"; 

        cartaSpan.innerText = (index === 0 && vivo) ? '?' : carta; 
        document.getElementById("container_cards_dealer").appendChild(cartaSpan);
    });
}

function sumadealershow() {
    sumadealer = calcularSuma(cartasdealer);
    document.getElementById("sumdealer").innerText = 'Suma: ' + sumadealer;
}

function sumaplayershow() {
    suma = calcularSuma(cartasjugador);
    document.getElementById("sum").innerText = 'Suma: ' + suma;
}

// Función para calcular la suma considerando los Ases
function calcularSuma(cartas) {

    let sumaTemporal = 0;
    let numAs = 0; 

    for (let carta of cartas) {
        if (carta === 'A') {
            sumaTemporal += 11; 
            numAs++; 
        } else if(carta === 'J' || carta === 'Q' || carta === 'K'){
            sumaTemporal+=10;
        }
        else {
            sumaTemporal += carta;
        }
    }

    while (sumaTemporal > 21 && numAs > 0) {
        sumaTemporal -= 10; 
        numAs--;
    }

    return sumaTemporal;
}

function handleStay() {
    if (!vivo) return; 
    console.log("stay");

    vivo = false; 
    printcardsdealer();
    sumadealershow();

    while (sumadealer < 17) {
        let cartanueva = cartarandom();
        cartasdealer.push(cartanueva);
        sumadealershow();
        printcardsdealer();
    }
    verificacion();
}

function handleHit() {
    if (!vivo) return; 
    console.log("hit");
    carta = cartarandom();
    cartasjugador.push(carta);
    printcards();
    sumaplayershow();
    
    if (suma > 21) {
        verificacion();
    }
}

function verificacion() {
    vivo = false; 
    printcardsdealer();

    sumadealershow();
    sumadealer = calcularSuma(cartasdealer);
    suma = calcularSuma(cartasjugador);

    
    if (suma > 21 || (sumadealer > suma && sumadealer <= 21 || sumadealer===21 && suma!== 21)) {
        consolelogs();
        mensaje.innerText = "You lose";
        losecount++;
        document.getElementById("contador-derrotas").innerText = losecount;
    }
    else if (sumadealer > 21 || suma > sumadealer || sumadealer!==21 && suma=== 21) {
        consolelogs();
        mensaje.innerText = "You win";
        wincount++;
        document.getElementById("contador-victorias").innerText = wincount;
    }
    else if (suma === sumadealer || suma===21 && sumadealer===21) {
        consolelogs();
        mensaje.innerText = "DRAW";
        drawcount++;
        document.getElementById("contador-empates").innerText = drawcount;
    }
    

    disableButtons();
    
    
    setTimeout(empezarjuego, 2000);
}

function disableButtons() {
    hit.disabled = true;
    stay.disabled = true;
}

function ableButtons() {
    hit.disabled = false;
    stay.disabled = false;
}

function consolelogs() {
    console.log('SUMA PLAYER: '+suma);
    console.log("--------------")
    console.log('SUMA DEALER: '+sumadealer);
}