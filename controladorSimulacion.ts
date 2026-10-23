import { IControlador, IPantalla, IFormulas } from './interfaces';
import { Garra } from './garra';
import { Mapa } from './mapa';
import { Bucle } from './bucle';
import { Calculos } from './calculos';
import { POC } from './poc';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Clase ControladorSimulacion
 * Responsabilidad única (SRP): Gestionar los eventos de entrada del usuario
 * (click y teclado) y coordinar el ciclo de juego:
 *   1. Click inicial: la bola aparece reposando en el suelo, en el centro del mapa.
 *   2. Acercar la garra (mouse / W-S) hasta la bola.
 *   3. Click a corta distancia: la garra sujeta la bola.
 *   4. [ESPACIO]: suelta la bola en caída libre aerodinámica.
 * Cumple con DIP al implementar la abstracción IControlador.
 */
export class ControladorSimulacion implements IControlador {
    private garra: Garra;
    private mapa: Mapa;
    private bucle: Bucle;
    private formulas: IFormulas;
    private canvas: HTMLCanvasElement;

    private readonly distanciaAgarreBase: number = 48;

    constructor(
        pantalla: IPantalla,
        garra: Garra,
        mapa: Mapa,
        bucle: Bucle,
        formulas: IFormulas
    ) {
        this.garra = garra;
        this.mapa = mapa;
        this.bucle = bucle;
        this.formulas = formulas;
        this.canvas = pantalla.getCanvas();
    }

    public iniciar(): void {
        this.canvas.addEventListener('click', this.manejarClick);
        this.canvas.addEventListener('mousemove', this.manejarMouseMove);
        window.addEventListener('keydown', this.manejarKeyDown);
    }

    public detener(): void {
        this.canvas.removeEventListener('click', this.manejarClick);
        this.canvas.removeEventListener('mousemove', this.manejarMouseMove);
        window.removeEventListener('keydown', this.manejarKeyDown);
    }

    private obtenerCoordenadas(e: MouseEvent): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect();
        const escalaX = this.canvas.width / rect.width;
        const escalaY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * escalaX,
            y: (e.clientY - rect.top) * escalaY
        };
    }

    private manejarClick = (): void => {
        const bola = this.bucle.getCalculos();

        // Sin bola (o tras el impacto): crear una nueva reposando en el suelo
        if (bola === null || bola.esDetenido()) {
            if (bola !== null) {
                this.bucle.setCalculos(null);
            }
            this.crearBolaEnSuelo();
            return;
        }

        // Solo se puede agarrar una bola que está en el suelo y a corta distancia
        if (bola.esEnSuelo() && this.garraCercaDeBola(bola)) {
            bola.sujetar();
        }
    };

    private manejarMouseMove = (e: MouseEvent): void => {
        const { x, y } = this.obtenerCoordenadas(e);
        const bola = this.bucle.getCalculos();

        let pointer = false;
        if (bola === null || bola.esDetenido()) {
            pointer = true; // El click colocará una nueva bola
        } else if (bola.esEnSuelo()) {
            pointer = this.garraCercaDeBola(bola) || this.garra.contienePunto(x, y);
        } else if (bola.esSujeto()) {
            pointer = this.garra.contienePunto(x, y);
        }

        this.canvas.style.cursor = pointer ? 'pointer' : 'default';
    };

    private manejarKeyDown = (e: KeyboardEvent): void => {
        const bola = this.bucle.getCalculos();

        if (e.code === 'Space') {
            e.preventDefault();
            if (bola?.esSujeto()) {
                // La garra fija su cota en el mundo y la bola inicia caída libre
                this.garra.fijarPosicionMundo();
                bola.soltar();
            } else if (bola?.esCayendo()) {
                bola.pausar();
            } else if (bola?.esPausado()) {
                bola.reanudar();
            }
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            // Reiniciar simulación: vaciar la garra y restaurar cámara
            this.bucle.setCalculos(null);
        }
    };

    private crearBolaEnSuelo(): void {
        const escala = this.garra.getEscala();
        const radioPx = Math.max(16, Math.round(32 * escala));
        const radioMetros = radioPx / PIXELES_POR_METRO;
        const sueloY = this.mapa.getAltoTotal() - this.garra.getAltoBase();

        // 1. Instanciar la clase de datos físicos POC (usa sus valores por defecto internos)
        const poc = new POC(0, 0, radioMetros);

        // 2. Instanciar la clase Calculos (antigua poc) pasando formulas y poc
        const nuevaBola = new Calculos(
            this.formulas,
            poc,
            this.canvas.width / 2,
            sueloY - radioPx,
            0,
            escala
        );
        nuevaBola.colocarEnSuelo();
        this.bucle.setCalculos(nuevaBola);
    }

    /**
     * Comprueba si el punto de agarre de la garra está a corta distancia de la bola.
     * La distancia se compara en coordenadas de pantalla.
     */
    private garraCercaDeBola(bola: Calculos): boolean {
        const xPantalla = bola.getXMundo();
        const yPantalla = bola.getYMundo() - this.mapa.getCamaraY();
        const tolerancia = Math.max(this.distanciaAgarreBase, bola.getRadio() * 2);
        return this.garra.distanciaAlPunto(xPantalla, yPantalla) <= tolerancia;
    }
}
