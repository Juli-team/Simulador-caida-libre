/**
 * Clase BrazoHorizontal
 * Representa la viga horizontal superior por la que se desplaza la garra.
 * Cumple con SRP: Gestiona la posición, dimensiones y límites del brazo transversal.
 */
export class BrazoHorizontal {
    private inicioX: number = 95;
    private finX: number = 440;
    private y: number = 90;
    private espesor: number = 24;
    private escala: number = 1;
    private readonly colorEstructura: string = '#18181b';

    public actualizar(
        inicioX: number,
        finX: number,
        y: number,
        espesor: number,
        escala: number
    ): void {
        this.inicioX = inicioX;
        this.finX = finX;
        this.y = y;
        this.espesor = espesor;
        this.escala = escala;
    }

    public getInicioX(): number {
        return this.inicioX;
    }

    public getFinX(): number {
        return this.finX;
    }

    public getY(): number {
        return this.y;
    }

    public getEspesor(): number {
        return this.espesor;
    }

    public getEscala(): number {
        return this.escala;
    }

    public getAncho(): number {
        return this.finX - this.inicioX;
    }

    public getColorEstructura(): string {
        return this.colorEstructura;
    }
}
