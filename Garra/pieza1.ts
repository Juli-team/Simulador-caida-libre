/**
 * Clase Pieza1
 * Representa la columna vertical telescópica de soporte mecánico de la garra.
 * Cumple con SRP: Gestiona la altura, estiramiento y contracción de la columna.
 * No contiene lógica de renderizado directo.
 */
export class Pieza1 {
    private posX: number = 110;
    private ancho: number = 26;
    private readonly color: string = '#18181b'; // Color negro estructura
    private ySuperior: number = 90;
    private yInferior: number = 688;
    private altoPantalla: number = 768;
    private escala: number = 1;

    public actualizarDimensionesYLongitud(
        posX: number,
        ySuperior: number,
        ancho: number,
        escala: number,
        camaraY: number,
        altoPantalla: number,
        altoMundo: number,
        altoBase: number
    ): void {
        this.posX = posX;
        this.ySuperior = ySuperior;
        this.ancho = ancho;
        this.escala = escala;
        this.altoPantalla = altoPantalla;

        const yBaseMundo = altoMundo - altoBase;
        const yBasePantalla = yBaseMundo - camaraY;

        this.yInferior = Math.max(this.ySuperior, yBasePantalla);
    }

    public getPosX(): number {
        return this.posX;
    }

    public getAncho(): number {
        return this.ancho;
    }

    public getColor(): string {
        return this.color;
    }

    public getYSuperior(): number {
        return this.ySuperior;
    }

    public getYInferior(): number {
        return this.yInferior;
    }

    public getAltoPantalla(): number {
        return this.altoPantalla;
    }

    public getEscala(): number {
        return this.escala;
    }

    public getAltoVisible(): number {
        return Math.min(this.yInferior, this.altoPantalla) - this.ySuperior;
    }
}
