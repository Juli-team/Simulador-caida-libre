/**
 * Clase BaseSuelo
 * Representa la pieza base de apoyo en el suelo para la estructura de la garra.
 * Cumple con SRP: Gestiona las coordenadas y cotas geométricas de la base trapezoidal.
 */
export class BaseSuelo {
    private columnaPosX: number = 110;
    private columnaAncho: number = 26;
    private altoBase: number = 80;
    private altoMundo: number = 5000;
    private camaraY: number = 0;
    private altoPantalla: number = 768;
    private escala: number = 1;
    private readonly colorEstructura: string = '#18181b';

    public actualizar(
        columnaPosX: number,
        columnaAncho: number,
        altoBase: number,
        altoMundo: number,
        camaraY: number,
        altoPantalla: number,
        escala: number
    ): void {
        this.columnaPosX = columnaPosX;
        this.columnaAncho = columnaAncho;
        this.altoBase = altoBase;
        this.altoMundo = altoMundo;
        this.camaraY = camaraY;
        this.altoPantalla = altoPantalla;
        this.escala = escala;
    }

    public getColumnaPosX(): number {
        return this.columnaPosX;
    }

    public getColumnaAncho(): number {
        return this.columnaAncho;
    }

    public getAltoBase(): number {
        return this.altoBase;
    }

    public getAltoMundo(): number {
        return this.altoMundo;
    }

    public getCamaraY(): number {
        return this.camaraY;
    }

    public getAltoPantalla(): number {
        return this.altoPantalla;
    }

    public getEscala(): number {
        return this.escala;
    }

    public getColorEstructura(): string {
        return this.colorEstructura;
    }

    public getYBasePantalla(): number {
        return (this.altoMundo - this.altoBase) - this.camaraY;
    }

    public isVisible(): boolean {
        return this.getYBasePantalla() <= this.altoPantalla;
    }
}
