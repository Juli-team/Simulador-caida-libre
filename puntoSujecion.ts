import { IControlSujecion } from './interfaces';

/**
 * Punto de sujeción invisible que sigue al mouse.
 * Reemplaza a la garra mecánica: misma función de posicionar el POC sujeto,
 * sin estructura ni dibujo.
 */
export class PuntoSujecion implements IControlSujecion {
    private x: number = 512;
    private y: number = 160;
    private escala: number = 1;
    private altoBase: number = 80;
    private congelado: boolean = false;
    private inicializado: boolean = false;

    private camaraY: number = 0;
    private anchoPantalla: number = 1024;
    private altoPantalla: number = 768;
    private altoMundo: number = 5000;

    private readonly margenX: number = 40;
    private readonly altoBaseBase: number = 80;

    public seguirMouse(x: number, y: number): void {
        if (this.congelado) return;
        this.x = this.clamp(x, this.margenX * this.escala, this.anchoPantalla - this.margenX * this.escala);

        const sueloPantalla = (this.altoMundo - this.altoBase) - this.camaraY;
        this.y = this.clamp(y, 0, sueloPantalla);
    }

    public sincronizarConMapa(
        camaraY: number,
        anchoPantalla: number,
        altoPantalla: number,
        altoMundo: number
    ): void {
        this.camaraY = camaraY;
        this.anchoPantalla = anchoPantalla;
        this.altoPantalla = altoPantalla;
        this.altoMundo = altoMundo;
        this.escala = Math.min(anchoPantalla / 1024, altoPantalla / 768);
        this.altoBase = this.altoBaseBase * this.escala;

        if (!this.inicializado) {
            this.x = anchoPantalla * 0.5;
            this.y = altoPantalla * 0.35;
            this.inicializado = true;
        }

        if (!this.congelado) {
            this.seguirMouse(this.x, this.y);
        }
    }

    public getPosicionSujecion(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public getEscala(): number {
        return this.escala;
    }

    public getAltoBase(): number {
        return this.altoBase;
    }

    public fijarPosicionMundo(): void {
        this.congelado = true;
    }

    public isPosicionFijada(): boolean {
        return this.congelado;
    }

    public reiniciar(): void {
        this.congelado = false;
        this.x = this.anchoPantalla * 0.5;
        this.y = this.altoPantalla * 0.35;
    }

    private clamp(valor: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, valor));
    }
}
