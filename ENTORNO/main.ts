import { Pantalla } from './pantalla';
import { Mapa } from './mapa';
import { Garra } from './garra';
import { ControlesNavegacion } from './controlesNavegacion';
import { Bucle } from './bucle';

// Instanciación siguiendo el principio de Inversión de Dependencias (DIP) y POO
const pantalla = new Pantalla('app');
const mapa = new Mapa(pantalla.getAncho(), pantalla.getAlto(), 5000);
const garra = new Garra();
const controles = new ControlesNavegacion(pantalla, mapa);

const bucle = new Bucle(pantalla, mapa, garra, controles);

// Iniciar el ciclo de renderizado e interacción
bucle.iniciar();
