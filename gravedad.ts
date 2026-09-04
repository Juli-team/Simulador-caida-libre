export interface IGravedad {
    getValor(): number;
}

/**
 * Clase Gravedad
 * Responsabilidad única (SRP): Proveer el valor constante de la aceleración de la gravedad.
 */
export class Gravedad implements IGravedad {
    public static readonly VALOR: number = 9.8;
    public readonly valor: number = Gravedad.VALOR;

    public getValor(): number {
        return this.valor;
    }
}
