import { IActualizable, INavegable, IControlGarra, IPantalla } from './interfaces';

/**
 * Clase ControlesNavegacion
 * Responsabilidad única (SRP): Traducir la intención de navegación del usuario:
 *  - Teclas W/S: extienden/contraen la base desplazando la cámara por el mapa,
 *    de modo que la grúa puede elevarse más allá del alto de la pantalla.
 *  - Mouse: mueve la garra (X horizontal y estirado de la pieza negra en Y).
 * Reemplaza a los antiguos botones en pantalla.
 * Cumple con DIP al depender de las abstracciones INavegable e IControlGarra.
 */
export class ControlesNavegacion implements IActualizable {
    private navegable: INavegable;
    private garra: IControlGarra;
    private canvas: HTMLCanvasElement;

    private teclaArriba: boolean = false;
    private teclaAbajo: boolean = false;
    private bloqueado: boolean = false;

    // Velocidad (en píxeles por frame) del desplazamiento vertical de la cámara
    private readonly velocidadTeclado: number = 14;

    constructor(pantalla: IPantalla, navegable: INavegable, garra: IControlGarra) {
        this.navegable = navegable;
        this.garra = garra;
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
            this.garra.seguirMouse(x, y);
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

        // Evita que una tecla quede "pegada" si la ventana pierde el foco
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
