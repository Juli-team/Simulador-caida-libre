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
        // Clic para la rueda de configuración y elementos del menú
        this.canvas.addEventListener('click', (e: MouseEvent) => {
            const { x, y } = this.obtenerCoordenadas(e);

            // Interacción con la rueda de configuración
            if (this.dibujadorMenu?.estaSobreBotonConfig(x, y, this.canvas.width, this.canvas.height)) {
                this.menu?.alternar();
                return;
            }

            // Si el menú está abierto, delegar clic en el menú
            if (this.menu?.estaAbierto() && this.dibujadorMenu) {
                (this.dibujadorMenu as any).manejarClick(x, y, this.menu);
            }
        });

        this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
            if (this.menu?.estaAbierto() && this.dibujadorMenu) {
                const { x, y } = this.obtenerCoordenadas(e);
                (this.dibujadorMenu as any).manejarMouseDown(x, y);
            }
        });

        window.addEventListener('mouseup', () => {
            if (this.menu?.estaAbierto() && this.dibujadorMenu) {
                (this.dibujadorMenu as any).manejarMouseUp();
            }
        });

        this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
            const { x, y } = this.obtenerCoordenadas(e);

            if (this.menu?.estaAbierto() && this.dibujadorMenu) {
                (this.dibujadorMenu as any).manejarMouseMove(x, y);
            }

            if (this.bloqueado) return;

            // Si el mouse no está manipulando el interior del menú abierto, actualizar sujeción
            if (!(this.menu?.estaAbierto() && this.dibujadorMenu?.estaSobrePanel(x, y, this.canvas.width, this.canvas.height))) {
                this.puntoSujecion.seguirMouse(x, y);
            }
        });

        // Soporte de rueda de ratón para la barra deslizante del menú
        this.canvas.addEventListener('wheel', (e: WheelEvent) => {
            if (this.menu?.estaAbierto() && this.dibujadorMenu) {
                const { x, y } = this.obtenerCoordenadas(e);
                if (this.dibujadorMenu.estaSobrePanel(x, y, this.canvas.width, this.canvas.height)) {
                    (this.dibujadorMenu as any).manejarWheel(e.deltaY);
                    e.preventDefault();
                }
            }
        }, { passive: false });

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            // Si el usuario está tipeando en algún campo del menú, enviar tecla al menú
            if (this.menu?.estaAbierto() && this.dibujadorMenu?.tieneInputActivo()) {
                const consumido = (this.dibujadorMenu as any).manejarKeyDown(e, this.menu);
                if (consumido) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            }

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
