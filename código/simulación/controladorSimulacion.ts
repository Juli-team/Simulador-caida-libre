import { IControlador, IPantalla, IMenu, IDibujarMenu } from './interfaces';
import { Bucle } from './bucle';
import { GestorBola } from './gestorBola';

/**
 * Clase ControladorSimulacion
 * Responsabilidad única (SRP): Gestionar los eventos de entrada del usuario
 * (click y teclado) y coordinar las acciones sobre la simulación a través de Bucle y GestorBola.
 * Cumple con DIP al implementar la abstracción IControlador.
 */
export class ControladorSimulacion implements IControlador {
    private bucle: Bucle;
    private gestorBola: GestorBola;
    private canvas: HTMLCanvasElement;
    private menu?: IMenu;
    private dibujadorMenu?: IDibujarMenu;

    constructor(
        pantalla: IPantalla,
        bucle: Bucle,
        gestorBola: GestorBola
    ) {
        this.canvas = pantalla.getCanvas();
        this.bucle = bucle;
        this.gestorBola = gestorBola;
    }

    public setMenu(menu: IMenu, dibujadorMenu: IDibujarMenu): void {
        this.menu = menu;
        this.dibujadorMenu = dibujadorMenu;
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
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    private estaSobreBotonConfig(x: number, y: number): boolean {
        return Boolean(this.dibujadorMenu?.estaSobreBotonConfig(x, y, this.canvas.width, this.canvas.height));
    }

    private estaSobrePanelAbierto(x: number, y: number): boolean {
        if (!this.menu?.estaAbierto()) return false;
        return Boolean(this.dibujadorMenu?.estaSobrePanel(x, y, this.canvas.width, this.canvas.height));
    }

    private manejarClick = (e: MouseEvent): void => {
        if (this.bucle.getImpacto().estaActivo()) return;

        const { x, y } = this.obtenerCoordenadas(e);
        if (this.estaSobreBotonConfig(x, y) || this.estaSobrePanelAbierto(x, y)) return;

        this.procesarClickEscena(x, y);
    };

    private procesarClickEscena(x: number, y: number): void {
        const bola = this.bucle.getCalculos();
        if (!bola || bola.getEstadoBola().esDetenido()) {
            if (bola) this.bucle.setCalculos(null);
            this.gestorBola.crearEnSuelo();
            return;
        }

        if (bola.getEstadoBola().esEnSuelo() && this.gestorBola.puntoSobreBola(bola, x, y)) {
            this.gestorBola.sujetarBola(bola, x, y);
        }
    }

    private manejarMouseMove = (e: MouseEvent): void => {
        if (this.bucle.getImpacto().estaActivo()) {
            this.canvas.style.cursor = 'default';
            return;
        }

        const { x, y } = this.obtenerCoordenadas(e);
        this.canvas.style.cursor = this.obtenerCursor(x, y);
    };

    private obtenerCursor(x: number, y: number): string {
        if (this.estaSobreBotonConfig(x, y)) return 'pointer';
        if (this.estaSobrePanelAbierto(x, y)) return 'default';
        return this.esEscenaInteractuable(x, y) ? 'pointer' : 'default';
    }

    private esEscenaInteractuable(x: number, y: number): boolean {
        const bola = this.bucle.getCalculos();
        if (!bola) return true;

        const estado = bola.getEstadoBola();
        if (estado.esDetenido() || estado.esSujeto()) return true;
        return estado.esEnSuelo() && this.gestorBola.puntoSobreBola(bola, x, y);
    }

    private manejarKeyDown = (e: KeyboardEvent): void => {
        if (this.menu?.estaAbierto() && this.dibujadorMenu?.tieneInputActivo()) return;

        if (e.code === 'Space') {
            e.preventDefault();
            this.manejarTeclaEspacio();
            return;
        }

        if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            this.bucle.setCalculos(null);
        }
    };

    private manejarTeclaEspacio(): void {
        if (this.bucle.getImpacto().estaActivo()) {
            this.bucle.getImpacto().desactivar();
            return;
        }

        const bola = this.bucle.getCalculos();
        if (!bola) return;

        const estado = bola.getEstadoBola();
        if (estado.esSujeto()) {
            this.gestorBola.soltarBola(bola);
            return;
        }
        estado.alternarPausa();
    }
}
