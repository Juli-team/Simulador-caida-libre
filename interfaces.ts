export interface IDibujable {
    dibujar(ctx: CanvasRenderingContext2D, ...args: any[]): void;
}

export interface IActualizable {
    actualizar(...args: any[]): void;
}

export interface INavegable {
    subir(distancia?: number): void;
    bajar(distancia?: number): void;
    getCamaraY(): number;
    setCamaraY(y: number): void;
    getAltoTotal(): number;
    getAltoVisible(): number;
    puedeSubir(): boolean;
    puedeBajar(): boolean;
}

export interface IPantalla {
    limpiar(): void;
    getContext(): CanvasRenderingContext2D;
    getAncho(): number;
    getAlto(): number;
    getCanvas(): HTMLCanvasElement;
    actualizarDimensiones(): void;
}

export type EstadoPOC = 'sujeto' | 'cayendo' | 'pausado' | 'detenido';

export interface IPOC {
    getH0(): number;
    setH0(h0: number): void;
    getV0(): number;
    setV0(v0: number): void;
    getT(): number;
    setT(t: number): void;
    getV(): number;
    setV(v: number): void;
    getEstado(): EstadoPOC;
}

export interface IGravedad {
    getValor(): number;
}

export interface IFormulas {
    calcularTiempo(h0: number): number;
    calcularVelocidad(v0: number, t: number): number;
    resolver(poc: IPOC): void;
}

export interface IControlador {
    iniciar(): void;
    detener(): void;
}

