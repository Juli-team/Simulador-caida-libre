import { IActualizable, INavegable, IControlSujecion, IPantalla } from './interfaces';

/**
 * Clase ControlesNavegacion
 * Responsabilidad única (SRP): Traducir la intención de navegación del usuario:
 *  - Teclas W/S: desplazan la cámara por el mapa.
 *  - Mouse: mueve el punto de sujeción (el POC lo sigue si está sujeto).
 * Cumple con DIP al depender de las abstracciones INavegable e IControlSujecion.
 */
export class ControlesNavegacion implements IActualizable {
    private navegable: INavegable;
    private puntoSujecion: IControlSujecion;
    private canvas: HTMLCanvasElement;

    private teclaArriba: boolean = false;
    private teclaAbajo: boolean = false;
    private bloqueado: boolean = false;

    private readonly velocidadTeclado: number = 80;

    constructor(pantalla: IPantalla, navegable: INavegable, puntoSujecion: IControlSujecion) {
        this.navegable = navegable;
        this.puntoSujecion = puntoSujecion;
        this.canvas = pantalla.getCanvas();
        this.configurarEventos();
    }

    public setBloqueado(bloqueado: boolean): void {
        this.bloqueado = bloqueado;
        if (bloqueado) {
            this.teclaArriba = false;
            this.teclaAbajo = false;
        }
    }

    public isBloqueado(): boolean {
        return this.bloqueado;
    }

    private configurarEventos(): void {
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            if (this.bloqueado) return;
            const { x, y } = this.obtenerCoordenadas(e);
            this.puntoSujecion.seguirMouse(x, y);
        });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (this.bloqueado) return;
            if (e.key === 'w' || e.key === 'W') {
                this.teclaArriba = true;
            } else if (e.key === 's' || e.key === 'S') {
                this.teclaAbajo = true;
            }
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            if (e.key === 'w' || e.key === 'W') {
                this.teclaArriba = false;
            } else if (e.key === 's' || e.key === 'S') {
                this.teclaAbajo = false;
            }
        });

        window.addEventListener('blur', () => {
            this.teclaArriba = false;
            this.teclaAbajo = false;
        });
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

    public actualizar(): void {
        if (this.bloqueado) return;

        if (this.teclaArriba && this.navegable.puedeSubir()) {
            this.navegable.subir(this.velocidadTeclado);
        }
        if (this.teclaAbajo && this.navegable.puedeBajar()) {
            this.navegable.bajar(this.velocidadTeclado);
        }
    }
}
