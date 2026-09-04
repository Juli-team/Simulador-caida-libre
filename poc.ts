export interface IPOC {
    getH0(): number;
    setH0(h0: number): void;
    getV0(): number;
    setV0(v0: number): void;
    getT(): number;
    setT(t: number): void;
    getV(): number;
    setV(v: number): void;
}

/**
 * Clase POC
 * Responsabilidad única (SRP): Almacenar y encapsular el estado físico del objeto
 * (altura inicial h0, velocidad inicial v0, tiempo t y velocidad calculada v).
 */
export class POC implements IPOC {
    public h0: number;
    public v0: number;
    public t: number;
    public v: number;

    constructor(h0: number = 0, v0: number = 0) {
        this.h0 = h0;
        this.v0 = v0;
        this.t = 0;
        this.v = 0;
    }

    public getH0(): number {
        return this.h0;
    }

    public setH0(h0: number): void {
        this.h0 = h0;
    }

    public getV0(): number {
        return this.v0;
    }

    public setV0(v0: number): void {
        this.v0 = v0;
    }

    public getT(): number {
        return this.t;
    }

    public setT(t: number): void {
        this.t = t;
    }

    public getV(): number {
        return this.v;
    }

    public setV(v: number): void {
        this.v = v;
    }
}
