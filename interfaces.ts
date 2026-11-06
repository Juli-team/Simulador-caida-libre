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
 * Abstracción del punto de sujeción controlado por el mouse (DIP).
 */
export interface IControlSujecion {
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

/**
 * Contrato para el control del ciclo de vida y estado de la bola (ISP/DIP).
 */
export interface IEstadoBola {
    get(): EstadoPOC;
    set(nuevoEstado: EstadoPOC): void;
    es(estado: EstadoPOC): boolean;
    colocarEnSuelo(): void;
    sujetar(): void;
    soltar(): void;
    pausar(): void;
    reanudar(): void;
    alternarPausa(): void;
    detener(): void;
    esEnSuelo(): boolean;
    esSujeto(): boolean;
    esCayendo(): boolean;
    esPausado(): boolean;
    esDetenido(): boolean;
}

/**
 * Contrato de la clase POC (Plain Object / Estado físico del objeto) (ISP/DIP).
 * Encapsula los datos del objeto físico.
 */
export interface IPOC {
    getAltura(): number;
    setAltura(altura: number): void;
    getVelocidadInicial(): number;
    setVelocidadInicial(v0: number): void;
    getTiempoCaida(): number;
    setTiempoCaida(t: number): void;
    getMasa(): number;
    setMasa(m: number): void;
    getRadio(): number;
    setRadio(r: number): void;
    getCoeficienteArrastre(): number;
    setCoeficienteArrastre(cd: number): void;
    getVelocidad(): number;
    setVelocidad(v: number): void;
    getAceleracion(): number;
    setAceleracion(a: number): void;
    getFuerzaArrastre(): number;
    setFuerzaArrastre(fd: number): void;
    getDensidadAire(): number;
    setDensidadAire(d: number): void;

    // Métodos de compatibilidad y alias
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
 * Contrato de las fórmulas físicas del simulador (SRP / DIP).
 */
export interface IFormulas {
    calcularArea(radio: number): number;
    calcularDensidadAire(altura: number): number;
    calcularFuerzaArrastre(densidad: number, velocidad: number, cd: number, area: number): number;
    calcularAceleracionNeta(fuerzaArrastre: number, masa: number, gravedad?: number): number;
    calcularVelocidad(velocidadActual: number, aceleracion: number, dt: number): number;
    calcularTiempo(h0: number, gravedad?: number): number;
}

/**
 * Resultado devuelto por la clase Calculos para ser guardado en POC.
 */
export interface IResultadoCalculo {
    area: number;
    densidadAire: number;
    fuerzaArrastre: number;
    aceleracionNeta: number;
    velocidad: number;
    tiempoCaida: number;
    altura: number;
}

/**
 * Contrato para la orquestación de cálculos físicos y entidad espacial en la simulación.
 */
export interface ICalculos {
    getPOC(): IPOC;
    setPOC(poc: IPOC): void;
    getEstadoBola(): IEstadoBola;
    getXMundo(): number;
    getYMundo(): number;
    setPosicion(x: number, y: number): void;
    getRadio(): number;
    setRadioVisual(radio: number): void;
    resetearFisica(): void;
    actualizar(dt: number, ySueloMundo: number): void;
}

/**
 * Contrato para la sincronización del POC con el punto de sujeción (DIP).
 */
export interface ISincronizadorPOC {
    sincronizar(
        calculos: ICalculos,
        xSujecionPantalla: number,
        ySujecionPantalla: number,
        camaraY: number,
        ySueloMundo: number,
        escala: number
    ): void;
}

/**
 * Contrato para el dibujador de la bola POC que cae (DIP).
 */
export interface IDibujarPOC {
    dibujar(ctx: CanvasRenderingContext2D, calculos: ICalculos, camaraY?: number): void;
}

export interface IControlador {
    iniciar(): void;
    detener(): void;
}
