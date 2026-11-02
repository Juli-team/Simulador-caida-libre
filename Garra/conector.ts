/**
 * Clase Conector
 * Representa la pieza negra vertical (cadena / cable telescópico) que une
 * el brazo horizontal con el cabezal de la garra gris.
 * Cumple con SRP: Gestiona su longitud y posición según el estiramiento del mecanismo.
 */
export class Conector {
    private pinzaCentroX: number = 410;
    private pinzaCentroY: number = 155;
    private brazoY: number = 90;
    private brazoEspesor: number = 24;
    private escala: number = 1;
    private readonly colorEstructura: string = '#18181b';

    public actualizar(
        pinzaCentroX: number,
        pinzaCentroY: number,
        brazoY: number,
        brazoEspesor: number,
        escala: number
    ): void {
        this.pinzaCentroX = pinzaCentroX;
        this.pinzaCentroY = pinzaCentroY;
        this.brazoY = brazoY;
        this.brazoEspesor = brazoEspesor;
        this.escala = escala;
    }

    public getPinzaCentroX(): number {
        return this.pinzaCentroX;
    }

    public getPinzaCentroY(): number {
        return this.pinzaCentroY;
    }

    public getBrazoY(): number {
        return this.brazoY;
    }

    public getBrazoEspesor(): number {
        return this.brazoEspesor;
    }

    public getEscala(): number {
        return this.escala;
    }

    public getAncho(): number {
        return 20 * this.escala;
    }

    public getAlto(): number {
        return Math.max(0, this.pinzaCentroY - (this.brazoY + this.brazoEspesor));
    }

    public getX(): number {
        return this.pinzaCentroX - this.getAncho() / 2;
    }

    public getY(): number {
        return this.brazoY + this.brazoEspesor;
    }

    public getColorEstructura(): string {
        return this.colorEstructura;
    }
}
