import { IDibujable, IActualizable, IControlGarra } from '../interfaces';
import { Pieza1 } from './pieza1';
import { BaseSuelo } from './baseSuelo';
import { BrazoHorizontal } from './brazoHorizontal';
import { Conector } from './conector';
import { Cabezal } from './cabezal';
import { Pinzas } from './pinzas';
import { DibujarGarra } from './dibujarGarra';

/**
 * Representa la Garra mecánica y su estructura de soporte.
 * Cumple con SRP y Composición en POO.
 *
 * Control:
 *  - Mouse X: mueve horizontalmente la garra a lo largo del brazo.
 *  - Mouse Y: estira o contrae la pieza negra (conector) que sostiene la garra gris.
 *  - Teclas W/S: desplazan la cámara por el mapa, estirando la base (columna),
 *    de modo que la altura de la garra en el mundo crece sin límite de pantalla.
 */
export class Garra implements IDibujable, IActualizable, IControlGarra {
    private pieza1: Pieza1;
    private baseSuelo: BaseSuelo;
    private brazoHorizontal: BrazoHorizontal;
    private conector: Conector;
    private cabezal: Cabezal;
    private pinzas: Pinzas;
    private dibujador: DibujarGarra;

    // Dimensiones y coordenadas relativas a la pantalla
    private escala: number = 1;
    private columnaPosX: number = 110;
    private columnaAncho: number = 26;
    private altoBase: number = 80;

    private brazoY: number = 90;
    private brazoInicioX: number = 95;
    private brazoFinX: number = 440;
    private brazoEspesor: number = 24;

    private pinzaCentroX: number = 410;
    private pinzaCentroY: number = 155;

    // Objetivo de agarre marcado por el mouse (coordenadas de pantalla)
    private objetivoGripX: number = 512;
    private objetivoGripY: number = 160;
    private objetivoInicializado: boolean = false;

    // Longitud de la pieza negra que sostiene la garra gris (en píxeles de pantalla)
    private longitudCable: number = 0;

    // Separaciones verticales de la estructura (en unidades base, se escalan)
    private readonly sepGripCabezal: number = 62; // Punto de agarre -> cabezal de pinzas
    private readonly sepCabezalBrazo: number = 65; // Cabezal de pinzas -> barra horizontal

    // Límites de estiramiento de la pieza negra
    private readonly longitudCableMin: number = 0;
    private readonly longitudCableMax: number = 520;

    // Posición congelada en coordenadas de mundo cuando la bola es soltada
    private yMundoFijado: number | null = null;

    // Estado del mapa actual
    private camaraY: number = 0;
    private altoPantalla: number = 768;
    private altoMundo: number = 5000;
    private anchoPantalla: number = 1024;

    constructor(dibujador: DibujarGarra = new DibujarGarra()) {
        this.dibujador = dibujador;
        this.pieza1 = new Pieza1();
        this.baseSuelo = new BaseSuelo();
        this.brazoHorizontal = new BrazoHorizontal();
        this.conector = new Conector();
        this.cabezal = new Cabezal();
        this.pinzas = new Pinzas();
    }

    public actualizar(): void {
        // Estado dinámico si se requiere en el futuro
    }

    // ---------------------------------------------------------------------
    // Getters de componentes
    // ---------------------------------------------------------------------
    public getPieza1(): Pieza1 {
        return this.pieza1;
    }

    public getBaseSuelo(): BaseSuelo {
        return this.baseSuelo;
    }

    public getBrazoHorizontal(): BrazoHorizontal {
        return this.brazoHorizontal;
    }

    public getConector(): Conector {
        return this.conector;
    }

    public getCabezal(): Cabezal {
        return this.cabezal;
    }

    public getPinzas(): Pinzas {
        return this.pinzas;
    }

    public getDibujador(): DibujarGarra {
        return this.dibujador;
    }

    // ---------------------------------------------------------------------
    // IControlGarra: la garra sigue al mouse (X horizontal y Y del cable)
    // ---------------------------------------------------------------------

    /**
     * Establece el objetivo de agarre a partir del mouse.
     * La X desplaza la garra; la Y estira/contrae la pieza negra.
     * Si la garra está congelada (bola en caída) ignora la entrada.
     */
    public seguirMouse(x: number, y: number): void {
        if (this.yMundoFijado !== null) return;
        this.objetivoGripX = x;
        this.objetivoGripY = y;
        this.recalcularDesdeObjetivo();
    }

    // ---------------------------------------------------------------------
    // Posición congelada (al soltar la bola)
    // ---------------------------------------------------------------------

    public fijarPosicionMundo(yMundo?: number): void {
        if (yMundo !== undefined) {
            this.yMundoFijado = yMundo;
        } else {
            this.yMundoFijado = this.camaraY + this.brazoY;
        }
    }

    public reiniciar(): void {
        this.yMundoFijado = null;
        this.longitudCable = 0;
        this.objetivoGripX = this.anchoPantalla * 0.5;
        this.objetivoGripY = this.brazoY + (this.sepCabezalBrazo + this.sepGripCabezal) * this.escala;
        this.recalcularDesdeObjetivo();
    }

    public isPosicionFijada(): boolean {
        return this.yMundoFijado !== null;
    }

    // ---------------------------------------------------------------------
    // Sincronización con el mapa / pantalla
    // ---------------------------------------------------------------------

    public sincronizarConMapa(
        camaraY: number,
        anchoPantalla: number,
        altoPantalla: number,
        altoMundo: number
    ): void {
        this.camaraY = camaraY;
        this.altoPantalla = altoPantalla;
        this.altoMundo = altoMundo;
        this.anchoPantalla = anchoPantalla;

        // Escala proporcional basada en 1024x768
        this.escala = Math.min(anchoPantalla / 1024, altoPantalla / 768);

        this.columnaPosX = anchoPantalla * (110 / 1024);
        this.columnaAncho = 26 * this.escala;
        this.altoBase = 80 * this.escala;
        this.brazoEspesor = 24 * this.escala;

        // La barra horizontal permanece sujeta a una cota fija de pantalla
        this.brazoY = altoPantalla * (90 / 768);

        // Posición inicial centrada en el ancho para coincidir con la bola en el suelo
        if (!this.objetivoInicializado) {
            this.objetivoGripX = anchoPantalla * 0.5;
            this.objetivoGripY = this.brazoY + (this.sepCabezalBrazo + this.sepGripCabezal) * this.escala;
            this.objetivoInicializado = true;
        }

        if (this.yMundoFijado !== null) {
            // La cota del mundo permanece absoluta y no acompaña la cámara
            this.brazoY = this.yMundoFijado - camaraY;
            this.pinzaCentroX = this.clamp(this.objetivoGripX, this.getLimiteXMin(), this.getLimiteXMax());
            this.pinzaCentroY = this.brazoY + this.sepCabezalBrazo * this.escala + this.longitudCable;
        } else {
            this.recalcularDesdeObjetivo();
        }

        this.actualizarDerivados();
    }

    /**
     * Aplica el objetivo del mouse: limita la X al área alcanzable y deriva
     * la longitud de la pieza negra (cable) a partir de la Y objetivo.
     */
    private recalcularDesdeObjetivo(): void {
        this.pinzaCentroX = this.clamp(this.objetivoGripX, this.getLimiteXMin(), this.getLimiteXMax());

        const offsetBase = (this.sepCabezalBrazo + this.sepGripCabezal) * this.escala;
        let cable = this.objetivoGripY - this.brazoY - offsetBase;
        cable = this.clamp(cable, this.longitudCableMin * this.escala, this.longitudCableMax * this.escala);

        // El punto de agarre nunca desciende por debajo del suelo
        const sueloPantalla = (this.altoMundo - this.altoBase) - this.camaraY;
        const gripY = this.brazoY + offsetBase + cable;
        if (gripY > sueloPantalla) {
            cable = Math.max(this.longitudCableMin * this.escala, sueloPantalla - this.brazoY - offsetBase);
        }

        this.longitudCable = cable;
        this.pinzaCentroY = this.brazoY + this.sepCabezalBrazo * this.escala + this.longitudCable;
    }

    private actualizarDerivados(): void {
        this.brazoInicioX = this.columnaPosX - 15 * this.escala;
        this.brazoFinX = this.pinzaCentroX + 30 * this.escala;

        // Actualizar datos de cada pieza
        this.pieza1.actualizarDimensionesYLongitud(
            this.columnaPosX,
            this.brazoY,
            this.columnaAncho,
            this.escala,
            this.camaraY,
            this.altoPantalla,
            this.altoMundo,
            this.altoBase
        );

        this.baseSuelo.actualizar(
            this.columnaPosX,
            this.columnaAncho,
            this.altoBase,
            this.altoMundo,
            this.camaraY,
            this.altoPantalla,
            this.escala
        );

        this.brazoHorizontal.actualizar(
            this.brazoInicioX,
            this.brazoFinX,
            this.brazoY,
            this.brazoEspesor,
            this.escala
        );

        this.conector.actualizar(
            this.pinzaCentroX,
            this.pinzaCentroY,
            this.brazoY,
            this.brazoEspesor,
            this.escala
        );

        this.cabezal.actualizar(
            this.pinzaCentroX,
            this.pinzaCentroY,
            this.escala
        );

        this.pinzas.actualizar(
            this.pinzaCentroX,
            this.pinzaCentroY,
            this.escala
        );
    }

    private getLimiteXMin(): number {
        // No puede invadir la columna vertical de soporte
        return this.columnaPosX + this.columnaAncho + 70 * this.escala;
    }

    private getLimiteXMax(): number {
        return this.anchoPantalla - 75 * this.escala;
    }

    private clamp(valor: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, valor));
    }

    // ---------------------------------------------------------------------
    // Consultas geométricas
    // ---------------------------------------------------------------------

    public getEscala(): number {
        return this.escala;
    }

    public getAltoBase(): number {
        return this.altoBase;
    }

    /**
     * Retorna las coordenadas de pantalla donde debe sujetarse la esfera física
     * (centrada entre las pinzas).
     */
    public getPosicionSujecion(): { x: number; y: number } {
        return {
            x: this.pinzaCentroX,
            y: this.pinzaCentroY + this.sepGripCabezal * this.escala
        };
    }

    /**
     * Distancia euclidiana de pantalla entre el punto de agarre y un punto dado.
     * La usa el controlador para decidir si la garra está lo bastante cerca de la bola.
     */
    public distanciaAlPunto(x: number, y: number): number {
        const p = this.getPosicionSujecion();
        return Math.hypot(p.x - x, p.y - y);
    }

    /**
     * Comprueba si unas coordenadas de click en pantalla intersectan la garra o sus pinzas
     */
    public contienePunto(x: number, y: number): boolean {
        const s = this.escala;
        const anchoCabezal = 140 * s;
        const xMinPinzas = this.pinzaCentroX - anchoCabezal / 2;
        const xMaxPinzas = this.pinzaCentroX + anchoCabezal / 2;
        const yMinPinzas = this.pinzaCentroY - (10 * s);
        const yMaxPinzas = this.pinzaCentroY + (110 * s);

        const enPinzas = x >= xMinPinzas && x <= xMaxPinzas && y >= yMinPinzas && y <= yMaxPinzas;

        const enBrazo = x >= this.brazoInicioX && x <= this.brazoFinX &&
                        y >= this.brazoY && y <= this.brazoY + this.brazoEspesor + (30 * s);

        return enPinzas || enBrazo;
    }

    // ---------------------------------------------------------------------
    // Delegación de Renderizado al Dibujador
    // ---------------------------------------------------------------------

    public dibujar(ctx: CanvasRenderingContext2D): void {
        this.dibujador.dibujar(ctx, this);
    }

    public dibujarSoporteYCabezal(ctx: CanvasRenderingContext2D): void {
        this.dibujador.dibujarSoporteYCabezal(ctx, this);
    }

    public dibujarDedosPinzas(ctx: CanvasRenderingContext2D): void {
        this.dibujador.dibujarDedosPinzas(ctx, this);
    }
}
