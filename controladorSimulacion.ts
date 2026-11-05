import { IControlador, IPantalla, IFormulas } from './interfaces';
import { Garra } from './garra';
import { Mapa } from './mapa';
import { Bucle } from './bucle';
import { EstadoBola } from './estadoBola';

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
    private estadoBola: EstadoBola;

    constructor(
        pantalla: IPantalla,
        garra: Garra,
        mapa: Mapa,
        bucle: Bucle,
        formulas: IFormulas,
        estadoBola?: EstadoBola
    ) {
        this.garra = garra;
        this.mapa = mapa;
        this.bucle = bucle;
        this.formulas = formulas;
        this.canvas = pantalla.getCanvas();
        this.estadoBola = estadoBola ?? new EstadoBola(
            'sujeto',
            garra,
            mapa,
            formulas,
            this.canvas,
            bucle
        );
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
        if (bola === null || bola.getEstadoBola().esDetenido()) {
            if (bola !== null) {
                this.bucle.setCalculos(null);
            }
            this.estadoBola.crearBolaEnSuelo(this.garra, this.mapa, this.formulas, this.canvas, this.bucle);
            return;
        }

        // Solo se puede agarrar una bola que está en el suelo y a corta distancia
        if (bola.getEstadoBola().esEnSuelo() && this.estadoBola.cercaDeBola(bola, this.garra, this.mapa)) {
            bola.getEstadoBola().sujetar();
        }
    };

    private manejarMouseMove = (e: MouseEvent): void => {
        const { x, y } = this.obtenerCoordenadas(e);
        const bola = this.bucle.getCalculos();

        let pointer = false;
        if (bola === null || bola.getEstadoBola().esDetenido()) {
            pointer = true; // El click colocará una nueva bola
        } else if (bola.getEstadoBola().esEnSuelo()) {
            pointer = this.estadoBola.cercaDeBola(bola, this.garra, this.mapa) || this.garra.contienePunto(x, y);
        } else if (bola.getEstadoBola().esSujeto()) {
            pointer = this.garra.contienePunto(x, y);
        }

        this.canvas.style.cursor = pointer ? 'pointer' : 'default';
    };

    private manejarKeyDown = (e: KeyboardEvent): void => {
        const bola = this.bucle.getCalculos();

        if (e.code === 'Space') {
            e.preventDefault();
            if (!bola) return;
            const estado = bola.getEstadoBola();
            if (estado.esSujeto()) {
                // La garra fija su cota en el mundo y la bola inicia caída libre
                this.garra.fijarPosicionMundo();
                estado.soltar();
            } else if (estado.esCayendo()) {
                estado.pausar();
            } else if (estado.esPausado()) {
                estado.reanudar();
            }
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            // Reiniciar simulación: vaciar la garra y restaurar cámara
            this.bucle.setCalculos(null);
        }
    };
}
