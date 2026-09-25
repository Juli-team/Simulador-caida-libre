import { IPantalla } from './interfaces';

export class Pantalla implements IPantalla {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ancho: number = window.innerWidth;
    private alto: number = window.innerHeight;

    constructor(containerId: string = 'app') {
        this.canvas = document.createElement('canvas');
        this.actualizarDimensiones();

        this.canvas.style.display = 'block';
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('No se pudo obtener el contexto 2D del Canvas');
        }
        this.ctx = context;

        const container = document.getElementById(containerId) || document.body;
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.margin = '0';
        container.style.padding = '0';
        container.style.overflow = 'hidden';

        container.appendChild(this.canvas);

        window.addEventListener('resize', () => {
            this.actualizarDimensiones();
        });
    }

    public actualizarDimensiones(): void {
        this.ancho = window.innerWidth;
        this.alto = window.innerHeight;
        this.canvas.width = this.ancho;
        this.canvas.height = this.alto;
    }

    public limpiar(): void {
        this.ctx.clearRect(0, 0, this.ancho, this.alto);
    }

    public getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    public getAncho(): number {
        return this.ancho;
    }

    public getAlto(): number {
        return this.alto;
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }
}
