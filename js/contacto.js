'use strict';
(function() {
/* ============================================
   REFERENCIAS A ELEMENTOS DEL DOM
   ============================================ */
var formularioContacto = document.getElementById('formularioContacto');
var inputNombre = document.getElementById('nombreContacto');
var inputEmail = document.getElementById('emailContacto');
var inputMensaje = document.getElementById('mensajeContacto');
var errorNombre = document.getElementById('errorNombre');
var errorEmail = document.getElementById('errorEmail');
var errorMensaje = document.getElementById('errorMensaje');
/* ============================================
   FUNCIONES DE GESTION DE ERRORES
   ============================================ */
function limpiarError(input, elementoError) {
    input.classList.remove('error');
    elementoError.textContent = '';
}
function limpiarTodosLosErrores() {
    limpiarError(inputNombre, errorNombre);
    limpiarError(inputEmail, errorEmail);
    limpiarError(inputMensaje, errorMensaje);
}
function mostrarError(input, elementoError, mensaje) {
    input.classList.add('error');
    elementoError.textContent = mensaje;
}
/* ============================================
   FUNCIONES DE VALIDACION
   ============================================ */
function validarNombre(nombre) {
    var patronAlfanumerico = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;
    if (nombre.length === 0) {
        mostrarError(inputNombre, errorNombre, 'El nombre es obligatorio');
        return false;
    }
    if (!patronAlfanumerico.test(nombre)) {
        mostrarError(inputNombre, errorNombre, 'El nombre solo puede contener letras y números');
        return false;
    }
    return true;
}
function validarEmail(email) {
    var patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var posicionArroba;
    var posicionPunto;
    if (email.length === 0) {
        mostrarError(inputEmail, errorEmail, 'El email es obligatorio');
        return false;
    }
    if (!patronEmail.test(email)) {
        mostrarError(inputEmail, errorEmail, 'Ingresa un email válido');
        return false;
    }
    posicionArroba = email.indexOf('@');
    posicionPunto = email.lastIndexOf('.');
    if (posicionArroba < 1 || posicionPunto < posicionArroba + 2 || posicionPunto + 2 >= email.length) {
        mostrarError(inputEmail, errorEmail, 'Ingresa un email válido');
        return false;
    }
    return true;
}
function validarMensaje(mensaje) {
    if (mensaje.length === 0) {
        mostrarError(inputMensaje, errorMensaje, 'El mensaje es obligatorio');
        return false;
    }
    if (mensaje.length <= 5) {
        mostrarError(inputMensaje, errorMensaje, 'El mensaje debe tener más de 5 caracteres');
        return false;
    }
    return true;
}
/* ============================================
   ENVIO DE EMAIL
   ============================================ */
function enviarEmail(nombre, email, mensaje) {
    var asunto = encodeURIComponent('Contacto desde Minesweeper - ' + nombre);
    var cuerpo = encodeURIComponent(
        'Nombre: ' + nombre + '\n' +
        'Email: ' + email + '\n\n' +
        'Mensaje:\n' + mensaje
    );
    var enlaceMailto = 'mailto:?subject=' + asunto + '&body=' + cuerpo;
    window.location.href = enlaceMailto;
    setTimeout(function() {
        formularioContacto.reset();
        limpiarTodosLosErrores();
    }, 100);
}
/* ============================================
   MANEJADORES DE EVENTOS
   ============================================ */
function manejarEnvio(evento) {
    var nombre;
    var email;
    var mensaje;
    var esNombreValido;
    var esEmailValido;
    var esMensajeValido;
    evento.preventDefault();
    limpiarTodosLosErrores();
    nombre = inputNombre.value.trim();
    email = inputEmail.value.trim();
    mensaje = inputMensaje.value.trim();
    esNombreValido = validarNombre(nombre);
    esEmailValido = validarEmail(email);
    esMensajeValido = validarMensaje(mensaje);
    if (esNombreValido && esEmailValido && esMensajeValido) {
        enviarEmail(nombre, email, mensaje);
    }
}
function manejarInputNombre() {
    limpiarError(inputNombre, errorNombre);
}
function manejarInputEmail() {
    limpiarError(inputEmail, errorEmail);
}
function manejarInputMensaje() {
    limpiarError(inputMensaje, errorMensaje);
}
/* ============================================
   CONFIGURACION DE EVENTOS
   ============================================ */
function configurarEventos() {
    formularioContacto.addEventListener('submit', manejarEnvio);
    inputNombre.addEventListener('input', manejarInputNombre);
    inputEmail.addEventListener('input', manejarInputEmail);
    inputMensaje.addEventListener('input', manejarInputMensaje);
}
/* ============================================
   INICIALIZACION DE LA APLICACION
   ============================================ */
function inicializar() {
    configurarEventos();
}
document.addEventListener('DOMContentLoaded', inicializar);
})();
