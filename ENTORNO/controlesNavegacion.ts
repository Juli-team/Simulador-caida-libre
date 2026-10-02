import { IDibujable, IActualizable, INavegable, IPantalla } from './interfaces';
import { Boton } from './boton';

export class ControlesNavegacion implements IDibujable, IActualizable {
    private botonSubir: Boton;
    private botonBajar: Boton;
    private navegable: INavegable;
    private canvas: HTMLCanvasElement;

    // Velocidad de desplazamiento continuo cuando el botón se mantiene presionado
    private readonly velocidadScrollContinuo: number = 10;
    // Salto inmediato al dar un click
    private readonly saltoPorClick: number = 35;

    constructor(pantalla: IPantalla, navegable: INavegable) {
        this.navegable = navegable;
        this.canvas = pantalla.getCanvas();

        this.botonSubir = new Boton(
            0,
            0,
            62,
            62,
            'arriba',
            () => this.navegable.subir(this.saltoPorClick)
        );

        this.botonBajar = new Boton(
            0,
            0,
            62,
            62,
            'abajo',
            () => this.navegable.bajar(this.saltoPorClick)
        );

        this.sincronizarConPantalla(pantalla.getAncho(), pantalla.getAlto());
        this.configurarEventos();
    }

    public sincronizarConPantalla(anchoPantalla: number, altoPantalla: number): void {
        const escala = Math.min(anchoPantalla / 1024, altoPantalla / 768);
        const anchoBoton = Math.round(62 * escala);
        const altoBoton = Math.round(62 * escala);
        const espacio = Math.round(14 * escala);
        const margenDerecho = Math.round(32 * escala);
        const margenInferior = Math.round(30 * escala);

        const posX = anchoPantalla - margenDerecho - anchoBoton;
        const posYBajar = altoPantalla - margenInferior - altoBoton;
        const posYSubir = posYBajar - espacio - altoBoton;

        this.botonSubir.redimensionar(posX, posYSubir, anchoBoton, altoBoton);
        this.botonBajar.redimensionar(posX, posYBajar, anchoBoton, altoBoton);
    }

    private configurarEventos(): void {
        const obtenerCoordenadas = (e: MouseEvent) => {
            const rect = this.canvas.getBoundingClientRect();
            const escalaX = this.canvas.width / rect.width;
            const escalaY = this.canvas.height / rect.height;
            return {
                x: (e.clientX - rect.left) * escalaX,
                y: (e.clientY - rect.top) * escalaY
            };
        };

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const { x, y } = obtenerCoordenadas(e);
            const sobreSubir = this.botonSubir.contienePunto(x, y);
            const sobreBajar = this.botonBajar.contienePunto(x, y);

            this.botonSubir.setHover(sobreSubir);
            this.botonBajar.setHover(sobreBajar);

            if (sobreSubir || sobreBajar) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        });

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            const { x, y } = obtenerCoordenadas(e);
            if (this.botonSubir.contienePunto(x, y)) {
                this.botonSubir.setPresionado(true);
                this.botonSubir.accionar();
            } else if (this.botonBajar.contienePunto(x, y)) {
                this.botonBajar.setPresionado(true);
                this.botonBajar.accionar();
            }
        });

        window.addEventListener('mouseup', () => {
            this.botonSubir.setPresionado(false);
            this.botonBajar.setPresionado(false);
        });

        // Soporte adicional para rueda del mouse para comodidad del usuario
        this.canvas.addEventListener('wheel', (e: WheelEvent) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.navegable.subir(25);
            } else {
                this.navegable.bajar(25);
            }
        }, { passive: false });
    }

    public actualizar(): void {
        // Habilitar / Deshabilitar según límites del mapa
        this.botonSubir.setHabilitado(this.navegable.puedeSubir());
        this.botonBajar.setHabilitado(this.navegable.puedeBajar());

        // Si se mantiene presionado, realiza desplazamiento fluido continuo
        if (this.botonSubir.isPresionado()) {
            this.navegable.subir(this.velocidadScrollContinuo);
        }
        if (this.botonBajar.isPresionado()) {
            this.navegable.bajar(this.velocidadScrollContinuo);
        }
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        this.botonSubir.dibujar(ctx);
        this.botonBajar.dibujar(ctx);
    }
}
