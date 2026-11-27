import { IActualizable, INavegable, IControlSujecion, IPantalla, IMenu, IDibujarMenu } from './interfaces';

/**
 * Clase ControlesNavegacion
 * Responsabilidad única (SRP): Traducir la intención de navegación del usuario:
 *  - Teclas W/S: desplazan la cámara por el mapa.
 *  - Mouse: mueve el punto de sujeción (el POC lo sigue si está sujeto).
 *  - Interacción con la rueda de configuración (botón config.webp) y controles del menú.
 * Cumple con DIP al depender de abstracciones.
 */
export class ControlesNavegacion implements IActualizable {
    private navegable: INavegable;
    private puntoSujecion: IControlSujecion;
    private canvas: HTMLCanvasElement;
    private menu?: IMenu;
    private dibujadorMenu?: IDibujarMenu;

    private teclaArriba: boolean = false;
    private teclaAbajo: boolean = false;
    private bloqueado: boolean = false;

    private readonly velocidadTeclado: number = 80;

    constructor(
        pantalla: IPantalla,
        navegable: INavegable,
        puntoSujecion: IControlSujecion,
        menu?: IMenu,
        dibujadorMenu?: IDibujarMenu
    ) {
        this.navegable = navegable;
        this.puntoSujecion = puntoSujecion;
        this.canvas = pantalla.getCanvas();
        this.menu = menu;
        this.dibujadorMenu = dibujadorMenu;
        this.configurarEventos();
    }

    public setMenu(menu: IMenu, dibujadorMenu: IDibujarMenu): void {
        this.menu = menu;
        this.dibujadorMenu = dibujadorMenu;
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
        this.canvas.addEventListener('click', (e: MouseEvent) => this.manejarClick(e));
        this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.manejarMouseMove(e));
        window.addEventListener('keydown', (e: KeyboardEvent) => this.manejarKeyDown(e));
        window.addEventListener('keyup', (e: KeyboardEvent) => this.actualizarTeclaNavegacion(e.key, false));
        window.addEventListener('blur', () => this.limpiarTeclas());
    }

    private manejarClick(e: MouseEvent): void {
        const { x, y } = this.obtenerCoordenadas(e);
        if (this.dibujadorMenu?.estaSobreBotonConfig(x, y, this.canvas.width, this.canvas.height)) {
            this.menu?.alternar();
            return;
        }
        if (!this.menu?.estaAbierto() || !this.dibujadorMenu) return;
        (this.dibujadorMenu as any).manejarClick(x, y, this.menu);
    }

    private manejarMouseMove(e: MouseEvent): void {
        if (this.bloqueado) return;
        const { x, y } = this.obtenerCoordenadas(e);
        if (this.menu?.estaAbierto() && this.dibujadorMenu?.estaSobrePanel(x, y, this.canvas.width, this.canvas.height)) {
            return;
        }
        this.puntoSujecion.seguirMouse(x, y);
    }

    private manejarKeyDown(e: KeyboardEvent): void {
        if (this.intentarTeclaMenu(e)) return;
        if (this.bloqueado) return;
        this.actualizarTeclaNavegacion(e.key, true);
    }

    private intentarTeclaMenu(e: KeyboardEvent): boolean {
        if (!this.menu?.estaAbierto() || !this.dibujadorMenu?.tieneInputActivo()) return false;
        const consumido = (this.dibujadorMenu as any).manejarKeyDown(e, this.menu);
        if (!consumido) return false;
        e.preventDefault();
        e.stopPropagation();
        return true;
    }

    private actualizarTeclaNavegacion(tecla: string, presionada: boolean): void {
        const k = tecla.toLowerCase();
        if (k === 'w') this.teclaArriba = presionada;
        else if (k === 's') this.teclaAbajo = presionada;
    }

    private limpiarTeclas(): void {
        this.teclaArriba = false;
        this.teclaAbajo = false;
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

        // No navegar con W/S si se está tipeando texto en un input activo
        if (this.menu?.estaAbierto() && this.dibujadorMenu?.tieneInputActivo()) {
            return;
        }

        if (this.teclaArriba && this.navegable.puedeSubir()) {
            this.navegable.subir(this.velocidadTeclado);
        }
        if (this.teclaAbajo && this.navegable.puedeBajar()) {
            this.navegable.bajar(this.velocidadTeclado);
        }
    }
}
