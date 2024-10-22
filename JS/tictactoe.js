var casillas = document.querySelectorAll('[data-cell]');
const boton1vs1 = document.getElementById('1vs1');
const botonvsBOT = document.getElementById('vsBot');
const tresenraya = document.getElementById('tresenraya');
const tablero = document.getElementById('container_tictactoe');
const contadorcontainer = document.getElementById('contadores3raya');
const mensajefinal = document.getElementById('mensajefinal');
var wincontadorX_1vs1 = 0;
var wincontadorO_1vs1 = 0;
var wincontadorX_vsBOT = 0;
var wincontadorO_vsBOT = 0;
var drawcontador_1vs1 = 0;
var drawcontador_vsBOT = 0;

var modojuego;
const x = "x";
const o = "o";

const combVictorias = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
]
let turnoparax;
var currentclass;


botonesclick();
comienzotresenraya();


function comienzotresenraya(){
    var casillas = document.querySelectorAll('[data-cell]');
    
    mensajefinal.innerText="";

    if (tablero.classList.contains(x)) {
        tablero.classList.remove(x);
    }else if (tablero.classList.contains(o)) {
        tablero.classList.remove(o);
    }
    
    turnoparax = false;


    casillas.forEach(cell => {
        cell.addEventListener('click', handleclick,{once:true});
            if (cell.classList.contains(x)) {
                cell.classList.remove(x);
            }
            else if (cell.classList.contains(o)) {
                cell.classList.remove(o);
            }
        })

    aplicarhoverMark();
}

function desactivarClickCasillas() {
    casillas.forEach(cell => {
        cell.removeEventListener('click', handleclick); 
    });
}

function handleclick(e){
    console.log("click");
    const cell = e.target;

    if (cell.classList.contains(x) || cell.classList.contains(o)) { return }
        
    if (turnoparax) { currentclass = x} else { currentclass = o};
    

    if(modojuego=="1vs1"){
        colocarMark(cell,currentclass);
        if (determinarVict(currentclass)){
            console.log("win");
            if(currentclass === x){
                wincontadorX_1vs1++;
                document.getElementById("contador-victoriasX-1vs1-3raya").innerText = wincontadorX_1vs1;
                mensajefinal.innerText="X wins";
            }else if (currentclass === o){
                wincontadorO_1vs1++;
                document.getElementById("contador-victoriasO-1vs1-3raya").innerText = wincontadorO_1vs1;
                mensajefinal.innerText="O wins";
                
            }
            desactivarClickCasillas();
            setTimeout(comienzotresenraya, 1000);

        }else if(determinarEmp()){
            console.log("draw");
            drawcontador_1vs1++;
            desactivarClickCasillas();
            setTimeout(comienzotresenraya, 1000);
            document.getElementById("contador-empates-1vs1-3raya").innerText = drawcontador_1vs1;
            mensajefinal.innerText="EMPATE";
        }
    }else if(modojuego=="vsBOT"){
        colocarMark(cell, currentclass);
        
        if (determinarVict(currentclass)) {
            console.log("win");
            wincontadorO_vsBOT++;
            document.getElementById("contador-victoriasO-vsBOT-3raya").innerText = wincontadorO_vsBOT;
            mensajefinal.innerText = "O wins";
            desactivarClickCasillas();
            setTimeout(comienzotresenraya, 1000);
            return;
        } else if (determinarEmp()) {
            console.log("draw");
            drawcontador_vsBOT++;
            document.getElementById("contador-empates-vsBOT-3raya").innerText = drawcontador_vsBOT;
            mensajefinal.innerText = "EMPATE";
            desactivarClickCasillas();
            setTimeout(comienzotresenraya, 1000);
            return;
        }

        bot();
    
    }
    
    determinarTurno();
    aplicarhoverMark();
   
}

function colocarMark(cell,currentclass){
    cell.classList.add(currentclass);
}

function determinarTurno(){
    turnoparax= !turnoparax;
}

function aplicarhoverMark(){
    tablero.classList.remove(x);
    tablero.classList.remove(o);

    if(turnoparax) {
        tablero.classList.add(x);
    }else {
        tablero.classList.add(o);
    }
}

function determinarVict(currentclass) {
    if (!casillas || casillas.length === 0) return false;
    return combVictorias.some(combination => {
      return combination.every(index => {
        return casillas[index].classList.contains(currentclass); 
      })  
    })
}

function determinarEmp(){
    return [...casillas].every(casilla => {
        return casilla.classList.contains("x") || casilla.classList.contains("o")
    })
}

function botonesclick(){
    
    boton1vs1.addEventListener("click", function(){
        console.log("1vs1");
        printtablero();
        tresenraya.style.border='var(--border-size) solid rgba(var(--bs-success-rgb))';
        comienzotresenraya();
        modojuego="1vs1";
    });
    botonvsBOT.addEventListener("click", function(){
        console.log("vsBOT");
        printtablero();
        tresenraya.style.border='var(--border-size) solid rgba(var(--bs-warning-rgb))';
        comienzotresenraya();
        modojuego="vsBOT";
    });
}

function bot(){
    const casillasVacias = [...casillas].filter(casilla => 
        !casilla.classList.contains(x) && !casilla.classList.contains(o)
    );

    if (casillasVacias.length > 0) {
        const randomIndex = Math.floor(Math.random() * casillasVacias.length);
        const casillaSeleccionada = casillasVacias[randomIndex];

        colocarMark(casillaSeleccionada, x);

        if (determinarVict(x)) {
            console.log("win");
            wincontadorX_vsBOT++;
            document.getElementById("contador-victoriasX-vsBOT-3raya").innerText = wincontadorX_vsBOT;
            mensajefinal.innerText = "X wins";
            desactivarClickCasillas();
            setTimeout(comienzotresenraya, 1000);
            return;
        } 

        determinarTurno();
        aplicarhoverMark();
    }

}

function printtablero(){
    tablero.innerHTML=
    `<div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
     <div class="cell" data-cell></div>
    `;

    printcontadores();
    casillas = document.querySelectorAll('[data-cell]');
}

function printcontadores() {
    contadorcontainer.style.display='flex';
}