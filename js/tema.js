'use strict';
(function() {
var botonTema = document.getElementById('botonTema');
function cambiarTema() {
    var htmlElement = document.documentElement;
    var temaActual = htmlElement.getAttribute('data-tema');
    var nuevoTema = temaActual === 'oscuro' ? 'claro' : 'oscuro';
    if (nuevoTema === 'oscuro') {
        htmlElement.setAttribute('data-tema', 'oscuro');
        botonTema.textContent = '☽';
    } else {
        htmlElement.removeAttribute('data-tema');
        botonTema.textContent = '☀';
    }
    localStorage.setItem('tema', nuevoTema);
}
function cargarTemaGuardado() {
    var temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
        document.documentElement.setAttribute('data-tema', 'oscuro');
        botonTema.textContent = '☽';
    }
}
function inicializar() {
    cargarTemaGuardado();
    botonTema.addEventListener('click', cambiarTema);
}
document.addEventListener('DOMContentLoaded', inicializar);
})();
