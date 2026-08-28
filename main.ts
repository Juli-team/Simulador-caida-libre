import { Pantalla } from './pantalla';
import { Circulo } from './circulo';
import { Bucle } from './bucle';
const pantalla = new Pantalla();
const circulo = new Circulo(pantalla);
const bucle = new Bucle(pantalla, circulo);
bucle.buclear();