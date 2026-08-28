export class Pantalla {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(containerId: string = 'app') {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1440;
        this.canvas.height = 800;
        
        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('No se pudo obtener el contexto 2D');
        }
        this.ctx = context;

        const container = document.getElementById(containerId) || document.body;
        container.appendChild(this.canvas);

        this.dibujarFondo();
    }

    private dibujarFondo(): void {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public limpiar(): void {
        this.dibujarFondo();
    }

    public getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }

    public getAlto(): number {
        return this.canvas.height;
    }

    public getAncho(): number {
        return this.canvas.width;
    }
}