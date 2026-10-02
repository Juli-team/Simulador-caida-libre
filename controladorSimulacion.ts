import { IControlador, IPantalla } from './interfaces';
import { Garra } from './garra';
import { Mapa } from './mapa';
import { ControlesNavegacion } from './controlesNavegacion';
import { Bucle } from './bucle';
import { POC } from './poc';

/**
 * Clase ControladorSimulacion
 * Responsabilidad única (SRP): Gestionar los eventos de entrada del usuario
 * (click del mouse, movimiento del cursor y teclado) y coordinar las acciones
 * de la garra y la simulación física sin contaminar el archivo principal.
 * Cumple con DIP al implementar la abstracción IControlador.
 */
export class ControladorSimulacion implements IControlador {
    private garra: Garra;
    private mapa: Mapa;
    private controles: ControlesNavegacion;
    private bucle: Bucle;
    private canvas: HTMLCanvasElement;

    constructor(
        pantalla: IPantalla,
        garra: Garra,
        mapa: Mapa,
        controles: ControlesNavegacion,
        bucle: Bucle
    ) {
        this.garra = garra;
        this.mapa = mapa;
        this.controles = controles;
        this.bucle = bucle;
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

    private manejarClick = (e: MouseEvent): void => {
        // Si ya hay una bola presente, ignorar clicks en la garra
        if (this.bucle.getPOC() !== null) {
            return;
        }

        const { x, y } = this.obtenerCoordenadas(e);

        // Si el usuario hace click en la estructura de la garra, crear y sujetar la esfera
        if (this.garra.contienePunto(x, y)) {
            const posSujecion = this.garra.getPosicionSujecion();
            const sueloY = this.mapa.getAltoTotal() - this.garra.getAltoBase();
            const escala = this.garra.getEscala();

            const nuevaBola = new POC(
                posSujecion.x,
                this.mapa.getCamaraY() + posSujecion.y,
                0,
                escala
            );

            nuevaBola.sincronizarConGarra(
                posSujecion.x,
                posSujecion.y,
                this.mapa.getCamaraY(),
                sueloY,
                escala
            );

            this.bucle.setPOC(nuevaBola);
        }
    };

    private manejarMouseMove = (e: MouseEvent): void => {
        const { x, y } = this.obtenerCoordenadas(e);
        const sobreBotones = this.controles.contienePunto(x, y);
        const sobreGarraSinBola = this.bucle.getPOC() === null && this.garra.contienePunto(x, y);

        if (sobreBotones || sobreGarraSinBola) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    };

    private manejarKeyDown = (e: KeyboardEvent): void => {
        const bola = this.bucle.getPOC();

        if (e.code === 'Space') {
            e.preventDefault();
            if (bola) {
                if (bola.esSujeto()) {
                    // La garra fija su cota en el mundo y la bola inicia caída libre
                    this.garra.fijarPosicionMundo();
                    bola.soltar();
                } else if (bola.esCayendo()) {
                    bola.pausar();
                } else if (bola.esPausado()) {
                    bola.reanudar();
                }
            }
        } else if (e.key === 'r' || e.key === 'R') {
            e.preventDefault();
            // Reiniciar simulación: vaciar la garra y restaurar cámara
            this.bucle.setPOC(null);
        }
    };
}
