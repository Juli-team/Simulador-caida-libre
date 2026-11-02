/**
 * Clase Pinzas
 * Representa los dedos/pinzas articulados que sujetan o liberan la bola.
 * Cumple con SRP: Gestiona su geometría y dimensiones relativas.
 */
export class Pinzas {
    private pinzaCentroX: number = 410;
    private pinzaCentroY: number = 155;
    private escala: number = 1;

    private readonly colorGarra: string = '#64748b';
    private readonly colorGarraOscuro: string = '#475569';
    private readonly colorPernos: string = '#cbd5e1';

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

    public getAnchoCabezal(): number {
        return 130 * this.escala;
    }

    public getAltoCabezal(): number {
        return 30 * this.escala;
    }

    public getXCabezal(): number {
        return this.pinzaCentroX - this.getAnchoCabezal() / 2;
    }

    public getYCabezal(): number {
        return this.pinzaCentroY;
    }

    public getXDer(): number {
        return this.getXCabezal() + this.getAnchoCabezal();
    }

    public getColorGarra(): string {
        return this.colorGarra;
    }

    public getColorGarraOscuro(): string {
        return this.colorGarraOscuro;
    }

    public getColorPernos(): string {
        return this.colorPernos;
    }
}
