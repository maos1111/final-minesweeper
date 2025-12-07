# Minesweeper

Este proyecto implementa el clásico juego del buscaminas utilizando HTML5, CSS3 y JavaScript ES5. El juego presenta un tablero con diferentes dificutades y minas distribuidas aleatoriamente.

## Descripción

El objetivo del juego es revelar todas las celdas que no contienen minas. Cuando haces click en una celda, se muestra un número que indica cuántas minas hay en las celdas vecinas. Si la celda no tiene minas adyacentes, el juego revela automáticamente todas las celdas vecinas de forma recursiva hasta encontrar números.

El jugador debe ingresar su nombre al inicio de la partida. El temporizador comienza cuando se revela la primera celda. Se pueden marcar las celdas sospechosas con banderas usando el click derecho del mouse. El contador de minas muestra cuántas minas quedan por encontrar, restando las banderas colocadas.

## Estructura de archivos

El proyecto está organizado en las siguientes carpetas y archivos:

```
final-web-1/
    index.html
    contacto.html
    css/
        reset.css
        estilos.css
    js/
        juego.js
        contacto.js
        tema.js
```

## Tecnologías utilizadas

El proyecto está desarrollado con HTML5 para la estructura, CSS3 para los estilos utilizando Flexbox para el diseño responsive, y JavaScript ES5 en modo estricto para toda la lógica del juego. Se incluye un archivo reset.css para normalizar los estilos entre navegadores.

## Características principales

El tablero se genera dinámicamente con JavaScript. Las minas se ubican de forma aleatoria al iniciar cada partida. El juego detecta automáticamente las condiciones de victoria y derrota. Incluye validación del nombre del jugador que debe tener al menos 3 letras.
La página de contacto tiene un formulario con validaciones en JavaScript para el nombre, email y mensaje. Al enviar el formulario se abre el cliente de email predeterminado del sistema operativo.

## Cómo jugar

Ingresa tu nombre cuando aparezca el modal inicial. Haz click izquierdo en cualquier celda para revelarla. Usa el click derecho para colocar o quitar banderas. Presiona la tecla espacio o el botón de la cara para reiniciar la partida en cualquier momento.

Los números que aparecen en las celdas indican cuántas minas hay alrededor. El color de cada número es diferente para facilitar la identificación. El juego termina cuando revelas todas las celdas sin minas o cuando haces click en una mina.
