import { IControlador, IPantalla, IFormulas } from './interfaces';
import { PuntoSujecion } from './puntoSujecion';
import { Mapa } from './mapa';
import { Bucle } from './bucle';
import { EstadoBola } from './estadoBola';

/**
 * Clase ControladorSimulacion
 * Responsabilidad única (SRP): Gestionar los eventos de entrada del usuario
 * (click y teclado) y coordinar el ciclo de juego:
 *   1. Click inicial: la bola aparece reposando en el suelo, en el centro del mapa.
 *   2. Click sobre el POC: lo sujeta al punto de seguimiento del mouse.
 *   3. Al mover el mouse, el POC sigue la posición de agarre.
 *   4. [ESPACIO]: suelta la bola en caída libre aerodinámica.
 * Cumple con DIP al implementar la abstracción IControlador.
 */
export class ControladorSimulacion implements IControlador {
    private puntoSujecion: PuntoSujecion;
    private mapa: Mapa;
    private bucle: Bucle;
    private formulas: IFormulas;
    private canvas: HTMLCanvasElement;
    private estadoBola: EstadoBola;

    constructor(
        pantalla: IPantalla,
        puntoSujecion: PuntoSujecion,
        mapa: Mapa,
        bucle: Bucle,
        formulas: IFormulas,
        estadoBola?: EstadoBola
    ) {
        this.puntoSujecion = puntoSujecion;
        this.mapa = mapa;
        this.bucle = bucle;
        this.formulas = formulas;
        this.canvas = pantalla.getCanvas();
        this.estadoBola = estadoBola ?? new EstadoBola(
            'sujeto',
            puntoSujecion,
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

    private manejarClick = (e: MouseEvent): void => {
        const bola = this.bucle.getCalculos();

        if (bola === null || bola.getEstadoBola().esDetenido()) {
            if (bola !== null) {
                this.bucle.setCalculos(null);
            }
            this.estadoBola.crearBolaEnSuelo(
                this.puntoSujecion,
                this.mapa,
                this.formulas,
                this.canvas,
                this.bucle
            );
            return;
        }

        const { x, y } = this.obtenerCoordenadas(e);
        if (bola.getEstadoBola().esEnSuelo() && this.estadoBola.puntoSobreBola(bola, x, y, this.mapa)) {
            this.puntoSujecion.seguirMouse(x, y);
            bola.getEstadoBola().sujetar();
        }
    };

    private manejarMouseMove = (e: MouseEvent): void => {
        const { x, y } = this.obtenerCoordenadas(e);
        const bola = this.bucle.getCalculos();

        let pointer = false;
        if (bola === null || bola.getEstadoBola().esDetenido()) {
            pointer = true;
        } else if (bola.getEstadoBola().esEnSuelo()) {
            pointer = this.estadoBola.puntoSobreBola(bola, x, y, this.mapa);
        } else if (bola.getEstadoBola().esSujeto()) {
            pointer = true;
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
                this.puntoSujecion.fijarPosicionMundo();
                estado.soltar();
            } else if (estado.esCayendo()) {
                estado.pausar();
            } else if (estado.esPausado()) {
                estado.reanudar();
            }
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            this.bucle.setCalculos(null);
        }
    };
}
