import { IGravedad } from './interfaces';

export type { IGravedad };

export class Gravedad implements IGravedad {
    private valor: number = 9.8;

    constructor(valor: number = 9.8) {
        this.valor = valor;
    }

    public getValor(): number {
        return this.valor;
    }

    public setValor(valor: number): void {
        this.valor = valor;
    }
}
