export interface IDibujable {
    dibujar(ctx: CanvasRenderingContext2D, ...args: any[]): void;
}

export interface IActualizable {
    actualizar(...args: any[]): void;
}

export interface INavegable {
    subir(distancia?: number): void;
    bajar(distancia?: number): void;
    puedeSubir(): boolean;
    puedeBajar(): boolean;
}

export interface ICamaraMapa {
    getCamaraY(): number;
    setCamaraY(y: number): void;
    getAltoTotal(): number;
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
 * Contrato de transiciones principales del ciclo de vida de la bola (ISP).
 */
export interface IEstadoBola {
    es(estado: EstadoPOC): boolean;
    colocarEnSuelo(): void;
    sujetar(): void;
    soltar(): void;
    alternarPausa(): void;
    detener(): void;
}

/**
 * Contrato de consultas de estado de la bola (ISP).
 */
export interface IConsultaEstadoBola {
    esEnSuelo(): boolean;
    esSujeto(): boolean;
    esCayendo(): boolean;
    esPausado(): boolean;
    esDetenido(): boolean;
}

/**
 * Contrato de control directo de estado de la bola (ISP).
 */
export interface IControlEstadoBola {
    get(): EstadoPOC;
    set(nuevoEstado: EstadoPOC): void;
    pausar(): void;
    reanudar(): void;
}

export type IEstadoBolaCompleto = IEstadoBola & IConsultaEstadoBola;

/**
 * Contrato de la clase POC para cinemática básica (ISP/DIP).
 */
export interface IPOC {
    getAltura(): number;
    setAltura(altura: number): void;
    getVelocidad(): number;
    setVelocidad(v: number): void;
    getTiempoCaida(): number;
    setTiempoCaida(t: number): void;
}

/**
 * Propiedades físicas intrínsecas del cuerpo que cae (ISP).
 */
export interface IPropiedadesCuerpo {
    getMasa(): number;
    setMasa(m: number): void;
    getRadio(): number;
    setRadio(r: number): void;
    getCoeficienteArrastre(): number;
    setCoeficienteArrastre(cd: number): void;
}

/**
 * Magnitudes aerodinámicas y dinámicas instantáneas (ISP).
 */
export interface IDinamicaAire {
    getAceleracion(): number;
    setAceleracion(a: number): void;
    getFuerzaArrastre(): number;
    setFuerzaArrastre(fd: number): void;
    getDensidadAire(): number;
    setDensidadAire(d: number): void;
}

/**
 * Condiciones iniciales y persistencia agregada del POC (ISP).
 */
export interface ICondicionesInicialesPOC {
    getVelocidadInicial(): number;
    setVelocidadInicial(v0: number): void;
    guardarResultados(resultado: IResultadoCalculo): void;
}

export type IPOCFisico = IPOC & IPropiedadesCuerpo & IDinamicaAire;

export interface IOpcionGravedad {
    nombre: string;
    valor: number;
}

/**
 * Contrato de las constantes dinámicas del simulador (DIP).
 */
export interface IConstantes {
    getGravedad(): number;
    setGravedad(g: number): void;
    getGravedadesDisponibles(): IOpcionGravedad[];
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
 * Contrato espacial y visual de la entidad física en el mundo (ISP).
 */
export interface ICuerpoEspacial {
    getXMundo(): number;
    getYMundo(): number;
    setPosicion(x: number, y: number): void;
    getRadio(): number;
    setRadioVisual(radio: number): void;
}

/**
 * Contrato para la orquestación de cálculos físicos de la simulación (ISP).
 */
export interface ICalculos {
    getPOC(): IPOCFisico;
    setPOC(poc: IPOCFisico): void;
    getEstadoBola(): IEstadoBolaCompleto;
    resetearFisica(): void;
    actualizar(dt: number, ySueloMundo: number): void;
}

export type ICalculosEspacial = ICalculos & ICuerpoEspacial;

/**
 * Contrato para la sincronización del POC con el punto de sujeción (DIP).
 */
export interface ISincronizadorPOC {
    sincronizar(
        calculos: ICalculosEspacial,
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
    dibujar(ctx: CanvasRenderingContext2D, calculos: ICuerpoEspacial, camaraY?: number): void;
    cambiarImagen(indice: number): void;
    getIndiceImagen(): number;
}

export interface IValoresConfiguracion {
    alturaInicial: number;
    masa: number;
    radio: number;
    coeficienteArrastre: number;
    gravedad: number;
    cuerpoCeleste: string;
    imagenSeleccionada: number;
}

/**
 * Contrato de visibilidad del menú (ISP).
 */
export interface IMenu {
    abrir(): void;
    cerrar(): void;
    alternar(): void;
    estaAbierto(): boolean;
    getUrlEnlace(): string;
}

/**
 * Contrato de gestión de parámetros y configuración del menú (ISP).
 */
export interface IConfiguracionMenu {
    getValores(): IValoresConfiguracion;
    setValores(valores: Partial<IValoresConfiguracion>): void;
    actualizarAlturaInicial(altura: number): void;
    aplicarCambios(valores: IValoresConfiguracion): void;
    getLimiteAlturaMapa(): number;
    getGravedadesDisponibles(): IOpcionGravedad[];
}

export interface IDibujarMenu {
    dibujar(ctx: CanvasRenderingContext2D, anchoPantalla: number, altoPantalla: number, menu: IMenu): void;
    estaSobreBotonConfig(x: number, y: number, anchoPantalla: number, altoPantalla: number): boolean;
    estaSobrePanel(x: number, y: number, anchoPantalla: number, altoPantalla: number): boolean;
    tieneInputActivo(): boolean;
}

export interface IControlador {
    iniciar(): void;
    detener(): void;
}
