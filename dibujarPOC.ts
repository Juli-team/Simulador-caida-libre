import { ICalculos, IDibujarPOC } from './interfaces';

/**
 * Clase DibujarPOC
 * Responsabilidad única (SRP):
 * Renderizar la bola física (POC) en el canvas utilizando la imagen bola1.webp.
 */
export class DibujarPOC implements IDibujarPOC {
    private imagen: HTMLImageElement;
    private imagenCargada: boolean = false;

    constructor(rutaImagen: string = new URL('./bola1.webp', import.meta.url).href) {
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        this.imagen.onload = () => {
            this.imagenCargada = true;
        };
    }

    public dibujar(ctx: CanvasRenderingContext2D, calculos: ICalculos, camaraY: number = 0): void {
        const x = calculos.getXMundo();
        const y = calculos.getYMundo() - camaraY;
        const r = calculos.getRadio();
        const diametro = r * 2;

        if (this.imagenCargada) {
            ctx.drawImage(
                this.imagen,
                x - r,
                y - r,
                diametro,
                diametro
            );
        } else {
            // Respaldo mientras se completa la carga de la imagen
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.restore();
        }
    }
}

