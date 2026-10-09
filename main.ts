import { Pantalla } from './pantalla';
import { Mapa } from './mapa';
import { Garra } from './garra';
import { ControlesNavegacion } from './controlesNavegacion';
import { Formulas } from './formulas';
import { HUD } from './hud';
import { Bucle } from './bucle';
import { ControladorSimulacion } from './controladorSimulacion';

// 1. Instanciación e Inyección de Dependencias (DIP / Composition Root)
const pantalla = new Pantalla('app');
const mapa = new Mapa(pantalla.getAncho(), pantalla.getAlto(), 5000);
const garra = new Garra();
const controles = new ControlesNavegacion(pantalla, mapa, garra);
const formulas = new Formulas();
const hud = new HUD(formulas);

const bucle = new Bucle(pantalla, mapa, garra, controles, hud);

// 2. Controlador de eventos e interacción del usuario
const controlador = new ControladorSimulacion(pantalla, garra, mapa, bucle, formulas);
controlador.iniciar();

// 3. Inicio del ciclo de renderizado continuo
bucle.iniciar();