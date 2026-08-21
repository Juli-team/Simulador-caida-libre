function setup() {
    // Creamos un lienzo (canvas) de 600 píxeles de ancho por 600 de alto
    createCanvas(600, 600);
}

function draw() {
    // Pintamos el fondo de color gris oscuro (escala de 0 a 255)
    background(50);

    // Elegimos el color blanco para rellenar lo que dibujemos a partir de ahora
    fill(255);

    // Dibujamos un círculo de prueba en el medio del lienzo
    // Parámetros: (Posición X, Posición Y, Diámetro)
    circle(300, 300, 50);
}
