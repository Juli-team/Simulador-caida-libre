/**
 * Clase Cabezal
 * Representa el bloque superior metálico (cabezal) de las pinzas mecánicas.
 * Cumple con SRP: Gestiona su posición y dimensiones espaciales.
 */
export class Cabezal {
    private pinzaCentroX: number = 410;
    private pinzaCentroY: number = 155;
    private escala: number = 1;

    private readonly colorGarra: string = '#64748b';
    private readonly colorGarraOscuro: string = '#475569';
    private readonly colorGarraClaro: string = '#94a3b8';

    public actualizar(pinzaCentroX: number, pinzaCentroY: number, escala: number): void {
        this.pinzaCentroX = pinzaCentroX;
        this.pinzaCentroY = pinzaCentroY;
        this.escala = escala;
    }

    public getPinzaCentroX(): number {
        return this.pinzaCentroX;
    }

    public getPinzaCentroY(): number {
        return this.pinzaCentroY;
    }

    public getEscala(): number {
        return this.escala;
    }

    public getAncho(): number {
        return 130 * this.escala;
    }

    public getAlto(): number {
        return 30 * this.escala;
    }

    public getX(): number {
        return this.pinzaCentroX - this.getAncho() / 2;
    }

    public getY(): number {
        return this.pinzaCentroY;
    }

    public getColorGarra(): string {
        return this.colorGarra;
    }

    public getColorGarraOscuro(): string {
        return this.colorGarraOscuro;
    }

    public getColorGarraClaro(): string {
        return this.colorGarraClaro;
    }
}
