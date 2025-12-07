'use strict';
(function() {
/* ============================================
   CONSTANTES Y CONFIGURACION DEL JUEGO
   ============================================ */
var NIVELES = {
    facil: { tamano: 8, minas: 10 },
    medio: { tamano: 12, minas: 25 },
    dificil: { tamano: 16, minas: 40 }
};
var nivelActual = 'facil';
var TAMANO_TABLERO = NIVELES[nivelActual].tamano;
var TOTAL_MINAS = NIVELES[nivelActual].minas;
var TOTAL_CELDAS = TAMANO_TABLERO * TAMANO_TABLERO;
/* ============================================
   VARIABLES DE ESTADO DEL JUEGO
   ============================================ */
var tablero = [];
var ubicacionesMinas = [];
var celdasReveladas = 0;
var banderasColocadas = 0;
var juegoIniciado = false;
var juegoTerminado = false;
var intervaloTemporizador = null;
var tiempoTranscurrido = 0;
var nombreJugador = '';
/* ============================================
   REFERENCIAS A ELEMENTOS DEL DOM
   ============================================ */
var tableroJuego = document.getElementById('tableroJuego');
var contadorMinas = document.getElementById('contadorMinas');
var contadorTiempo = document.getElementById('contadorTiempo');
var botonReiniciar = document.getElementById('botonReiniciar');
var nombreJugadorSpan = document.getElementById('nombreJugador');
var modalInicio = document.getElementById('modalInicio');
var formularioInicio = document.getElementById('formularioInicio');
var inputNombreJugador = document.getElementById('inputNombreJugador');
var errorNombre = document.getElementById('errorNombre');
var modalFin = document.getElementById('modalFin');
var tituloFin = document.getElementById('tituloFin');
var mensajeFin = document.getElementById('mensajeFin');
var tiempoFinal = document.getElementById('tiempoFinal');
var minasFinal = document.getElementById('minasFinal');
var botonJugarDeNuevo = document.getElementById('botonJugarDeNuevo');
var selectorNivel = document.getElementById('selectorNivel');
/* ============================================
   FUNCIONES DE VALIDACION
   ============================================ */
function esLetra(caracter) {
    var codigo = caracter.charCodeAt(0);
    return (codigo >= 65 && codigo <= 90) || (codigo >= 97 && codigo <= 122) || (codigo >= 192 && codigo <= 255);
}
function validarNombreJugador(nombre) {
    var contadorLetras;
    var i;
    errorNombre.textContent = '';
    inputNombreJugador.classList.remove('error');
    if (nombre.length < 3) {
        errorNombre.textContent = 'El nombre debe tener al menos 3 letras';
        inputNombreJugador.classList.add('error');
        return false;
    }
    contadorLetras = 0;
    for (i = 0; i < nombre.length; i++) {
        if (esLetra(nombre[i])) {
            contadorLetras++;
        }
    }
    if (contadorLetras < 3) {
        errorNombre.textContent = 'El nombre debe contener al menos 3 letras';
        inputNombreJugador.classList.add('error');
        return false;
    }
    return true;
}
/* ============================================
   GESTION DE NIVELES DE DIFICULTAD
   ============================================ */
function cambiarNivel() {
    nivelActual = selectorNivel.value;
    TAMANO_TABLERO = NIVELES[nivelActual].tamano;
    TOTAL_MINAS = NIVELES[nivelActual].minas;
    TOTAL_CELDAS = TAMANO_TABLERO * TAMANO_TABLERO;
    inicializarJuego();
}
/* ============================================
   GESTION DE MODALES
   ============================================ */
function mostrarModalInicio() {
    modalInicio.classList.remove('oculto');
    inputNombreJugador.focus();
}
function ocultarModalInicio() {
    modalInicio.classList.add('oculto');
}
function manejarInicioJuego(evento) {
    var nombre;
    evento.preventDefault();
    nombre = inputNombreJugador.value.trim();
    if (!validarNombreJugador(nombre)) {
        return;
    }
    nombreJugador = nombre;
    nombreJugadorSpan.textContent = nombreJugador;
    ocultarModalInicio();
    inicializarJuego();
}
/* ============================================
   FUNCIONES DE GEOMETRIA DEL TABLERO
   ============================================ */
function esVecinoValido(fila, columna) {
    return fila >= 0 && fila < TAMANO_TABLERO && columna >= 0 && columna < TAMANO_TABLERO;
}
function obtenerVecinos(fila, columna) {
    var vecinos = [];
    var direcciones = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];
    var i;
    var nuevaFila;
    var nuevaColumna;
    for (i = 0; i < direcciones.length; i++) {
        nuevaFila = fila + direcciones[i][0];
        nuevaColumna = columna + direcciones[i][1];
        if (esVecinoValido(nuevaFila, nuevaColumna)) {
            vecinos.push({fila: nuevaFila, columna: nuevaColumna});
        }
    }
    return vecinos;
}
function contarMinasAdyacentes(fila, columna) {
    var conteo = 0;
    var vecinos = obtenerVecinos(fila, columna);
    var i;
    for (i = 0; i < vecinos.length; i++) {
        if (tablero[vecinos[i].fila][vecinos[i].columna].esMina) {
            conteo++;
        }
    }
    return conteo;
}
/* ============================================
   INICIALIZACION DEL TABLERO
   ============================================ */
function calcularNumeros() {
    var i;
    var j;
    for (i = 0; i < TAMANO_TABLERO; i++) {
        for (j = 0; j < TAMANO_TABLERO; j++) {
            if (!tablero[i][j].esMina) {
                tablero[i][j].conteo = contarMinasAdyacentes(i, j);
            }
        }
    }
}
function colocarMinas() {
    var minasColocadas = 0;
    var fila;
    var columna;
    while (minasColocadas < TOTAL_MINAS) {
        fila = Math.floor(Math.random() * TAMANO_TABLERO);
        columna = Math.floor(Math.random() * TAMANO_TABLERO);
        if (!tablero[fila][columna].esMina) {
            tablero[fila][columna].esMina = true;
            ubicacionesMinas.push({fila: fila, columna: columna});
            minasColocadas++;
        }
    }
}
function crearTablero() {
    var i;
    var j;
    for (i = 0; i < TAMANO_TABLERO; i++) {
        tablero[i] = [];
        for (j = 0; j < TAMANO_TABLERO; j++) {
            tablero[i][j] = {
                esMina: false,
                conteo: 0,
                estaRevelada: false,
                tieneBandera: false,
                fila: i,
                columna: j
            };
        }
    }
}
/* ============================================
   ACTUALIZACION DE INTERFAZ
   ============================================ */
function formatearContador(valor) {
    var signo = valor < 0 ? '-' : '';
    var valorAbsoluto = Math.abs(valor);
    var cadena;
    if (valorAbsoluto > 999) {
        return signo + '999';
    }
    cadena = valorAbsoluto.toString();
    while (cadena.length < 3) {
        cadena = '0' + cadena;
    }
    return signo + cadena;
}
function actualizarContadorMinas() {
    var restantes = TOTAL_MINAS - banderasColocadas;
    var formateado = formatearContador(restantes);
    contadorMinas.textContent = formateado;
}
function actualizarContadorTiempo() {
    var formateado = formatearContador(tiempoTranscurrido);
    contadorTiempo.textContent = formateado;
}
function actualizarBotonReiniciar(emocion) {
    var emoticon = '🙂';
    if (emocion === 'muerto') {
        emoticon = '😵';
    } else if (emocion === 'genial') {
        emoticon = '😎';
    }
    botonReiniciar.querySelector('.emoticon').textContent = emoticon;
}
/* ============================================
   TEMPORIZADOR
   ============================================ */
function iniciarTemporizador() {
    tiempoTranscurrido = 0;
    intervaloTemporizador = setInterval(function() {
        tiempoTranscurrido++;
        actualizarContadorTiempo();
    }, 1000);
}
function detenerTemporizador() {
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
}
/* ============================================
   FUNCIONES DE FIN DE JUEGO
   ============================================ */
function obtenerElementoCelda(fila, columna) {
    return document.querySelector('.celda[data-fila="' + fila + '"][data-columna="' + columna + '"]');
}
function revelarTodasLasMinas() {
    var i;
    var mina;
    var datosCelda;
    var elementoCelda;
    for (i = 0; i < ubicacionesMinas.length; i++) {
        mina = ubicacionesMinas[i];
        datosCelda = tablero[mina.fila][mina.columna];
        elementoCelda = obtenerElementoCelda(mina.fila, mina.columna);
        if (!datosCelda.estaRevelada) {
            elementoCelda.classList.add('revelada', 'mina');
            elementoCelda.textContent = '*';
        }
    }
}
function mostrarModalFin(gano) {
    modalFin.classList.remove('oculto');
    if (gano) {
        tituloFin.textContent = '¡Felicitaciones!';
        tituloFin.style.color = '#27ae60';
        mensajeFin.textContent = '¡Has ganado la partida, ' + nombreJugador + '!';
    } else {
        tituloFin.textContent = 'Game Over';
        tituloFin.style.color = '#e74c3c';
        mensajeFin.textContent = 'Has perdido, ' + nombreJugador + '. ¡Inténtalo de nuevo!';
    }
    tiempoFinal.textContent = tiempoTranscurrido;
    minasFinal.textContent = TOTAL_MINAS;
}
function ocultarModalFin() {
    modalFin.classList.add('oculto');
}
function verificarCondicionVictoria() {
    var celdasPorRevelar = TOTAL_CELDAS - TOTAL_MINAS;
    if (celdasReveladas === celdasPorRevelar) {
        juegoTerminado = true;
        detenerTemporizador();
        actualizarBotonReiniciar('genial');
        setTimeout(function() {
            mostrarModalFin(true);
        }, 300);
    }
}
/* ============================================
   LOGICA DE JUEGO - REVELADO DE CELDAS
   ============================================ */
function expandirCeldasVacias(fila, columna) {
    var vecinos = obtenerVecinos(fila, columna);
    var i;
    var vecino;
    var datosVecino;
    for (i = 0; i < vecinos.length; i++) {
        vecino = vecinos[i];
        datosVecino = tablero[vecino.fila][vecino.columna];
        if (!datosVecino.estaRevelada && !datosVecino.tieneBandera && !datosVecino.esMina) {
            revelarCelda(vecino.fila, vecino.columna);
        }
    }
}
function manejarClickMina(fila, columna) {
    var elementoCelda;
    juegoTerminado = true;
    detenerTemporizador();
    actualizarBotonReiniciar('muerto');
    elementoCelda = obtenerElementoCelda(fila, columna);
    elementoCelda.classList.add('mina-activada');
    elementoCelda.textContent = '*';
    revelarTodasLasMinas();
    setTimeout(function() {
        mostrarModalFin(false);
    }, 500);
}
function revelarCelda(fila, columna) {
    var datosCelda = tablero[fila][columna];
    var elementoCelda;
    if (datosCelda.estaRevelada || datosCelda.tieneBandera) {
        return;
    }
    datosCelda.estaRevelada = true;
    celdasReveladas++;
    elementoCelda = obtenerElementoCelda(fila, columna);
    elementoCelda.classList.add('revelada');
    if (datosCelda.esMina) {
        manejarClickMina(fila, columna);
        return;
    }
    if (datosCelda.conteo > 0) {
        elementoCelda.textContent = datosCelda.conteo;
        elementoCelda.dataset.conteo = datosCelda.conteo;
    } else {
        expandirCeldasVacias(fila, columna);
    }
    verificarCondicionVictoria();
}
/* ============================================
   LOGICA DE JUEGO - BANDERAS
   ============================================ */
function alternarBandera(fila, columna, elementoCelda) {
    var datosCelda = tablero[fila][columna];
    if (datosCelda.tieneBandera) {
        datosCelda.tieneBandera = false;
        elementoCelda.classList.remove('con-bandera');
        elementoCelda.textContent = '';
        banderasColocadas--;
    } else {
        if (banderasColocadas >= TOTAL_MINAS) {
            return;
        }
        datosCelda.tieneBandera = true;
        elementoCelda.classList.add('con-bandera');
        elementoCelda.textContent = 'F';
        banderasColocadas++;
    }
    actualizarContadorMinas();
}
/* ============================================
   MANEJADORES DE EVENTOS
   ============================================ */
function manejarClickDerecho(evento) {
    var fila;
    var columna;
    var datosCelda;
    evento.preventDefault();
    if (juegoTerminado || !juegoIniciado) {
        return;
    }
    fila = parseInt(evento.target.dataset.fila);
    columna = parseInt(evento.target.dataset.columna);
    datosCelda = tablero[fila][columna];
    if (datosCelda.estaRevelada) {
        return;
    }
    alternarBandera(fila, columna, evento.target);
}
function manejarClickCelda(evento) {
    var fila;
    var columna;
    var datosCelda;
    if (juegoTerminado) {
        return;
    }
    fila = parseInt(evento.target.dataset.fila);
    columna = parseInt(evento.target.dataset.columna);
    datosCelda = tablero[fila][columna];
    if (datosCelda.estaRevelada || datosCelda.tieneBandera) {
        return;
    }
    if (!juegoIniciado) {
        iniciarTemporizador();
        juegoIniciado = true;
    }
    revelarCelda(fila, columna);
}
function manejarTeclaEspacio(evento) {
    if (evento.key === ' ' || evento.code === 'Space') {
        evento.preventDefault();
        reiniciarJuego();
    }
}
/* ============================================
   RENDERIZADO DEL TABLERO
   ============================================ */
function crearElementoCelda(fila, columna) {
    var celda = document.createElement('div');
    celda.className = 'celda';
    celda.dataset.fila = fila;
    celda.dataset.columna = columna;
    celda.addEventListener('click', manejarClickCelda);
    celda.addEventListener('contextmenu', manejarClickDerecho);
    return celda;
}
function renderizarTablero() {
    var i;
    var j;
    var celda;
    tableroJuego.innerHTML = '';
    tableroJuego.style.gridTemplateColumns = 'repeat(' + TAMANO_TABLERO + ', var(--tamano-celda))';
    for (i = 0; i < TAMANO_TABLERO; i++) {
        for (j = 0; j < TAMANO_TABLERO; j++) {
            celda = crearElementoCelda(i, j);
            tableroJuego.appendChild(celda);
        }
    }
}
/* ============================================
   INICIALIZACION Y REINICIO
   ============================================ */
function inicializarJuego() {
    tablero = [];
    ubicacionesMinas = [];
    celdasReveladas = 0;
    banderasColocadas = 0;
    juegoIniciado = false;
    juegoTerminado = false;
    tiempoTranscurrido = 0;
    clearInterval(intervaloTemporizador);
    intervaloTemporizador = null;
    actualizarContadorMinas();
    actualizarContadorTiempo();
    actualizarBotonReiniciar('feliz');
    crearTablero();
    colocarMinas();
    calcularNumeros();
    renderizarTablero();
}
function reiniciarJuego() {
    ocultarModalFin();
    inicializarJuego();
}
/* ============================================
   CONFIGURACION DE EVENTOS GLOBALES
   ============================================ */
function configurarEventos() {
    formularioInicio.addEventListener('submit', manejarInicioJuego);
    botonReiniciar.addEventListener('click', reiniciarJuego);
    botonJugarDeNuevo.addEventListener('click', reiniciarJuego);
    document.addEventListener('keydown', manejarTeclaEspacio);
    selectorNivel.addEventListener('change', cambiarNivel);
}
/* ============================================
   INICIALIZACION DE LA APLICACION
   ============================================ */
function inicializar() {
    mostrarModalInicio();
    configurarEventos();
    actualizarContadorMinas();
}
document.addEventListener('DOMContentLoaded', inicializar);
})();

