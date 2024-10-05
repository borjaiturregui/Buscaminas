const filas = 10;
const columnas = 10;
const minas = 15;
let tablero = [];
let minasColocadas = [];
let juegoTerminado = false;

function iniciarJuego() {
    const buscaminasDiv = document.getElementById('buscaminas');
    buscaminasDiv.innerHTML = '';
    tablero = [];
    minasColocadas = [];
    juegoTerminado = false;

    buscaminasDiv.style.gridTemplateColumns = `repeat(${columnas}, 50px)`; // Ajustar tamaño de las celdas

    // Crear el tablero y los botones
    for (let fila = 0; fila < filas; fila++) {
        tablero[fila] = [];
        for (let columna = 0; columna < columnas; columna++) {
            const boton = document.createElement('button');
            boton.classList.add('boton');
            boton.onclick = () => revelarCelda(fila, columna);
            boton.oncontextmenu = (e) => {
                e.preventDefault();
                marcarBandera(fila, columna);
            };
            buscaminasDiv.appendChild(boton);
            tablero[fila][columna] = { revelado: false, mina: false, bandera: false, boton };
        }
    }

    // Colocar las minas
    let contadorMinas = 0;
    while (contadorMinas < minas) {
        const filaAleatoria = Math.floor(Math.random() * filas);
        const columnaAleatoria = Math.floor(Math.random() * columnas);
        if (!tablero[filaAleatoria][columnaAleatoria].mina) {
            tablero[filaAleatoria][columnaAleatoria].mina = true;
            minasColocadas.push({ fila: filaAleatoria, columna: columnaAleatoria });
            contadorMinas++;
        }
    }
}

function revelarCelda(fila, columna) {
    if (juegoTerminado || tablero[fila][columna].revelado || tablero[fila][columna].bandera) return;

    tablero[fila][columna].revelado = true;
    tablero[fila][columna].boton.classList.add('revelado');

    if (tablero[fila][columna].mina) {
        tablero[fila][columna].boton.classList.add('mina');
        tablero[fila][columna].boton.innerText = '💣';
        terminarJuego(false);
    } else {
        const minasCercanas = contarMinasAlrededor(fila, columna);
        tablero[fila][columna].boton.innerText = minasCercanas > 0 ? minasCercanas : '';
        if (minasCercanas === 0) {
            revelarCeldasVecinas(fila, columna);
        }
        verificarVictoria();
    }
}

function marcarBandera(fila, columna) {
    if (juegoTerminado || tablero[fila][columna].revelado) return;

    tablero[fila][columna].bandera = !tablero[fila][columna].bandera;
    tablero[fila][columna].boton.classList.toggle('bandera');
    tablero[fila][columna].boton.innerText = tablero[fila][columna].bandera ? '🚩' : '';
}

function contarMinasAlrededor(fila, columna) {
    let minasCercanas = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;
            if (nuevaFila >= 0 && nuevaFila < filas && nuevaColumna >= 0 && nuevaColumna < columnas) {
                if (tablero[nuevaFila][nuevaColumna].mina) {
                    minasCercanas++;
                }
            }
        }
    }
    return minasCercanas;
}

function revelarCeldasVecinas(fila, columna) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nuevaFila = fila + i;
            const nuevaColumna = columna + j;
            if (nuevaFila >= 0 && nuevaFila < filas && nuevaColumna >= 0 && nuevaColumna < columnas) {
                revelarCelda(nuevaFila, nuevaColumna);
            }
        }
    }
}

function terminarJuego(ganaste) {
    juegoTerminado = true;
    if (!ganaste) {
        minasColocadas.forEach(({ fila, columna }) => {
            tablero[fila][columna].boton.classList.add('mina');
            tablero[fila][columna].boton.innerText = '💣';
        });
        alert('¡Perdiste! Hiciste clic en una mina.');
    } else {
        alert('¡Felicidades! Ganaste el juego.');
    }
}

function verificarVictoria() {
    let celdasReveladas = 0;
    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            if (tablero[fila][columna].revelado) {
                celdasReveladas++;
            }
        }
    }
    if (celdasReveladas === filas * columnas - minas) {
        terminarJuego(true);
    }
}

iniciarJuego();