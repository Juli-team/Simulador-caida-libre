export interface IDibujable {
    dibujar(ctx: CanvasRenderingContext2D): void;
}

export interface IActualizable {
    actualizar(): void;
}

export interface INavegable {
    subir(distancia?: number): void;
    bajar(distancia?: number): void;
    getCamaraY(): number;
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
}
