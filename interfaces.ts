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
    puedeSubir(): boolean;
    puedeBajar(): boolean;
}

/**
 * Abstracción de control de la garra (DIP).
 * Permite que los controles de navegación muevan la garra con el mouse
 * sin depender de su implementación concreta.
 */
export interface IControlGarra {
    seguirMouse(x: number, y: number): void;
}

export interface IPantalla {
    limpiar(): void;
    getContext(): CanvasRenderingContext2D;
    getAncho(): number;
    getAlto(): number;
    getCanvas(): HTMLCanvasElement;
    actualizarDimensiones(): void;
}

export type EstadoPOC = 'enSuelo' | 'sujeto' | 'cayendo' | 'pausado' | 'detenido';

export interface IPOC {
    getH0(): number;
    getV0(): number;
    getT(): number;
    setT(t: number): void;
    getV(): number;
    setV(v: number): void;
}

export interface IFormulas {
    calcularTiempo(h0: number): number;
    calcularVelocidad(v0: number, t: number): number;
}

export interface IControlador {
    iniciar(): void;
    detener(): void;
}

