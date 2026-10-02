import { IDibujable } from './interfaces';

export type DireccionBoton = 'arriba' | 'abajo';

export class Boton implements IDibujable {
    private x: number;
    private y: number;
    private ancho: number;
    private alto: number;
    private direccion: DireccionBoton;
    private alPresionar: () => void;

    // Colores naranjas según especificación
    private readonly colorFondo: string = '#f97316';       // Naranja vibrante
    private readonly colorHover: string = '#fb923c';       // Naranja claro al pasar cursor
    private readonly colorPresionado: string = '#ea580c';  // Naranja oscuro al presionar
    private readonly colorBorde: string = '#18181b';       // Borde oscuro marcado
    private readonly colorIcono: string = '#18181b';       // Flecha oscura

    private estaPresionado: boolean = false;
    private estaHover: boolean = false;
    private habilitado: boolean = true;

    constructor(
        x: number,
        y: number,
        ancho: number,
        alto: number,
        direccion: DireccionBoton,
        alPresionar: () => void
    ) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.direccion = direccion;
        this.alPresionar = alPresionar;
    }

    public contienePunto(px: number, py: number): boolean {
        return (
            px >= this.x &&
            px <= this.x + this.ancho &&
            py >= this.y &&
            py <= this.y + this.alto
        );
    }

    public setHover(hover: boolean): void {
        this.estaHover = hover;
    }

    public setPresionado(presionado: boolean): void {
        this.estaPresionado = presionado;
    }

    public isPresionado(): boolean {
        return this.estaPresionado;
    }

    public setHabilitado(habilitado: boolean): void {
        this.habilitado = habilitado;
    }

    public isHabilitado(): boolean {
        return this.habilitado;
    }

    public accionar(): void {
        if (this.habilitado) {
            this.alPresionar();
        }
    }

    public redimensionar(x: number, y: number, ancho: number, alto: number): void {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const escala = this.ancho / 62;
        const offsetY = this.estaPresionado ? 2 * escala : 0;
        const x = this.x;
        const y = this.y + offsetY;
        const radioBorde = Math.max(4, Math.round(12 * escala));

        // Selección de color de fondo según estado
        let colorActual = this.colorFondo;
        if (!this.habilitado) {
            colorActual = '#fdba74'; // Naranja desaturado/atenuado
        } else if (this.estaPresionado) {
            colorActual = this.colorPresionado;
        } else if (this.estaHover) {
            colorActual = this.colorHover;
        }

        // Sombra cuando no está presionado
        if (!this.estaPresionado && this.habilitado) {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
            ctx.shadowBlur = 6 * escala;
            ctx.shadowOffsetY = 4 * escala;
        }

        // Fondo redondeado del botón
        ctx.beginPath();
        ctx.roundRect(x, y, this.ancho, this.alto, radioBorde);
        ctx.fillStyle = colorActual;
        ctx.fill();

        // Borde
        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1.5, 3 * escala);
        ctx.strokeStyle = this.habilitado ? this.colorBorde : 'rgba(24, 24, 27, 0.4)';
        ctx.stroke();

        // Flecha / Triángulo interior
        this.dibujarTriangulo(ctx, x, y, escala);

        ctx.restore();
    }

    private dibujarTriangulo(ctx: CanvasRenderingContext2D, x: number, y: number, escala: number = 1): void {
        const centroX = x + this.ancho / 2;
        const centroY = y + this.alto / 2;
        const tamano = 16 * escala;

        ctx.beginPath();
        if (this.direccion === 'arriba') {
            // Triángulo apuntando hacia arriba △
            ctx.moveTo(centroX, centroY - tamano);
            ctx.lineTo(centroX + tamano, centroY + tamano * 0.8);
            ctx.lineTo(centroX - tamano, centroY + tamano * 0.8);
        } else {
            // Triángulo apuntando hacia abajo ▽
            ctx.moveTo(centroX, centroY + tamano);
            ctx.lineTo(centroX + tamano, centroY - tamano * 0.8);
            ctx.lineTo(centroX - tamano, centroY - tamano * 0.8);
        }
        ctx.closePath();

        ctx.fillStyle = this.habilitado ? this.colorIcono : 'rgba(24, 24, 27, 0.4)';
        ctx.fill();
        ctx.lineWidth = Math.max(1, 2 * escala);
        ctx.strokeStyle = this.habilitado ? '#000000' : 'rgba(0, 0, 0, 0.3)';
        ctx.stroke();
    }
}
