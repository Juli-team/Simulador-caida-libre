import { ICuerpoEspacial, IDibujarPOC } from './interfaces';

/**
 * URLs de las imágenes disponibles para el POC (bola1.webp, bola3.webp, bola4.webp).
 */
export const URLS_BOLAS: string[] = [
    new URL('../../assets/bola1.webp', import.meta.url).href,
    new URL('../../assets/bola3.webp', import.meta.url).href,
    new URL('../../assets/bola4.webp', import.meta.url).href,
];

/**
 * Clase DibujarPOC
 * Responsabilidad única (SRP):
 * Renderizar la bola física (POC) en el canvas utilizando la imagen bola seleccionada.
 */
export class DibujarPOC implements IDibujarPOC {
    private imagenes: HTMLImageElement[] = [];
    private imagenesCargadas: boolean[] = [];
    private indiceImagenActual: number = 1;

    constructor(rutaOIndice: string | number = 1) {
        this.imagenesCargadas = new Array(URLS_BOLAS.length).fill(false);
        URLS_BOLAS.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.imagenesCargadas[i] = true;
            };
            this.imagenes.push(img);
        });
        this.cambiarImagen(rutaOIndice);
    }

    public cambiarImagen(rutaOIndice: string | number): void {
        if (typeof rutaOIndice === 'number') {
            const idx = Math.max(1, Math.min(URLS_BOLAS.length, Math.round(rutaOIndice)));
            this.indiceImagenActual = idx;
        } else {
            const indexEncontrado = URLS_BOLAS.indexOf(rutaOIndice);
            if (indexEncontrado !== -1) {
                this.indiceImagenActual = indexEncontrado + 1;
            }
        }
    }

    public getIndiceImagen(): number {
        return this.indiceImagenActual;
    }

    public dibujar(ctx: CanvasRenderingContext2D, calculos: ICuerpoEspacial, camaraY: number = 0): void {
        const x = calculos.getXMundo();
        const y = calculos.getYMundo() - camaraY;
        const r = calculos.getRadio();
        const diametro = r * 2;
        const idx = this.indiceImagenActual - 1;
        const img = this.imagenes[idx];

        if (img && (img.complete || this.imagenesCargadas[idx]) && img.naturalWidth > 0) {
            ctx.drawImage(
                img,
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

export { DibujarPOC as dibujarpoc };


