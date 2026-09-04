import { Pantalla } from './pantalla';
import { Circulo } from './circulo';
import { Bucle } from './bucle';
import { POC } from './poc';
import { Gravedad } from './gravedad';
import { Formulas } from './formulas';
import { Calculadora } from './calculadora';

const pantalla = new Pantalla();
const circulo = new Circulo(pantalla);
const bucle = new Bucle(pantalla, circulo);

// Inicialización de las nuevas clases siguiendo SOLID
const poc = new POC();
const gravedad = new Gravedad();
const formulas = new Formulas(gravedad);
const calculadora = new Calculadora(pantalla, poc, formulas);

// Sin modificar las clases anteriores, integramos el dibujado de la calculadora en el ciclo
const dibujarCirculoOriginal = circulo.dibujar.bind(circulo);
circulo.dibujar = () => {
    dibujarCirculoOriginal();
    calculadora.dibujar();
};

bucle.buclear();