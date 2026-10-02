import { IDibujable, IActualizable, INavegable, IPantalla } from './interfaces';
import { Boton } from './boton';

export class ControlesNavegacion implements IDibujable, IActualizable {
    private botonSubir: Boton;
    private botonBajar: Boton;
    private navegable: INavegable;
    private canvas: HTMLCanvasElement;
    private bloqueado: boolean = false;

    private readonly velocidadScrollContinuo: number = 12;
    private readonly saltoPorClick: number = 40;

    constructor(pantalla: IPantalla, navegable: INavegable) {
        this.navegable = navegable;
        this.canvas = pantalla.getCanvas();

        this.botonSubir = new Boton(
            0,
            0,
            62,
            62,
            'arriba',
            () => {
                if (!this.bloqueado) {
                    this.navegable.subir(this.saltoPorClick);
                }
            }
        );

        this.botonBajar = new Boton(
            0,
            0,
            62,
            62,
            'abajo',
            () => {
                if (!this.bloqueado) {
                    this.navegable.bajar(this.saltoPorClick);
                }
            }
        );

        this.sincronizarConPantalla(pantalla.getAncho(), pantalla.getAlto());
        this.configurarEventos();
    }

    public setBloqueado(bloqueado: boolean): void {
        this.bloqueado = bloqueado;
    }

    public isBloqueado(): boolean {
        return this.bloqueado;
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
            if (this.bloqueado) return;
            const { x, y } = obtenerCoordenadas(e);
            const sobreSubir = this.botonSubir.contienePunto(x, y);
            const sobreBajar = this.botonBajar.contienePunto(x, y);

            this.botonSubir.setHover(sobreSubir);
            this.botonBajar.setHover(sobreBajar);
        });

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            if (this.bloqueado) return;
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

        this.canvas.addEventListener('wheel', (e: WheelEvent) => {
            if (this.bloqueado) return;
            e.preventDefault();
            if (e.deltaY < 0) {
                this.navegable.subir(25);
            } else {
                this.navegable.bajar(25);
            }
        }, { passive: false });
    }

    public contienePunto(x: number, y: number): boolean {
        return this.botonSubir.contienePunto(x, y) || this.botonBajar.contienePunto(x, y);
    }

    public actualizar(): void {
        const puedeSubir = !this.bloqueado && this.navegable.puedeSubir();
        const puedeBajar = !this.bloqueado && this.navegable.puedeBajar();

        this.botonSubir.setHabilitado(puedeSubir);
        this.botonBajar.setHabilitado(puedeBajar);

        if (!this.bloqueado) {
            if (this.botonSubir.isPresionado()) {
                this.navegable.subir(this.velocidadScrollContinuo);
            }
            if (this.botonBajar.isPresionado()) {
                this.navegable.bajar(this.velocidadScrollContinuo);
            }
        }
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        this.botonSubir.dibujar(ctx);
        this.botonBajar.dibujar(ctx);
    }
}
