import { Pantalla } from './pantalla';
import { Mapa } from './mapa';
import { PuntoSujecion } from './puntoSujecion';
import { ControlesNavegacion } from './controlesNavegacion';
import { Formulas } from '../física/formulas';
import { HUD } from './hud';
import { Bucle } from './bucle';
import { ControladorSimulacion } from './controladorSimulacion';
import { dibujarmenu } from './dibujarMenu';
import { menu } from './menu';
import { ConfiguracionMenu } from './configuracionMenu';
import { GestorBola } from './gestorBola';

// 1. Instanciación e Inyección de Dependencias (DIP / Composition Root)
const pantalla = new Pantalla('app');
const mapa = new Mapa(pantalla.getAncho(), pantalla.getAlto(), 300000);
const puntoSujecion = new PuntoSujecion();
const controles = new ControlesNavegacion(pantalla, mapa, puntoSujecion);
const formulas = new Formulas();
const hud = new HUD(formulas);

const bucle = new Bucle(pantalla, mapa, puntoSujecion, controles, hud);
const gestorBola = new GestorBola(puntoSujecion, mapa, formulas, bucle);

// 2. Creación del menú de configuraciones y su dibujador
const menuInstancia = new menu();
const configuracionMenu = new ConfiguracionMenu(bucle.getDibujadorPOC(), gestorBola);
const dibujadorMenuInstancia = new dibujarmenu(configuracionMenu);

// Inyección del menú en controles de navegación y ciclo de renderizado
controles.setMenu(menuInstancia, dibujadorMenuInstancia);
bucle.setMenu(menuInstancia, dibujadorMenuInstancia);

// 3. Controlador de eventos e interacción del usuario
const controlador = new ControladorSimulacion(pantalla, bucle, gestorBola);
controlador.setMenu(menuInstancia, dibujadorMenuInstancia);
controlador.iniciar();

// 4. Inicio del ciclo de renderizado continuo
bucle.iniciar();
