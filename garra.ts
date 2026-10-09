import { IDibujable, IActualizable, IControlGarra } from './interfaces';

/**
 * Representa la Pieza 1 de la estructura (columna vertical de soporte / base).
 * Cumple con SRP: Gestiona la altura, estiramiento y contracción de la columna negra.
 * Su longitud visible cambia cuando las teclas W/S desplazan la cámara por el mapa.
 */
class Pieza1 implements IDibujable {
    private posX: number = 110;
    private ancho: number = 26;
    private readonly color: string = '#18181b'; // Color negro estructura
    private ySuperior: number = 90;
    private yInferior: number = 688;
    private altoPantalla: number = 768;
    private escala: number = 1;

    public actualizarDimensionesYLongitud(
        posX: number,
        ySuperior: number,
        ancho: number,
        escala: number,
        camaraY: number,
        altoPantalla: number,
        altoMundo: number,
        altoBase: number
    ): void {
        this.posX = posX;
        this.ySuperior = ySuperior;
        this.ancho = ancho;
        this.escala = escala;
        this.altoPantalla = altoPantalla;

        const yBaseMundo = altoMundo - altoBase;
        const yBasePantalla = yBaseMundo - camaraY;

        this.yInferior = Math.max(this.ySuperior, yBasePantalla);
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const altoVisible = Math.min(this.yInferior, this.altoPantalla) - this.ySuperior;
        if (altoVisible <= 0) {
            ctx.restore();
            return;
        }

        // Columna negra principal
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.ySuperior, this.ancho, altoVisible);

        // Borde oscuro
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * this.escala);
        ctx.strokeRect(this.posX, this.ySuperior, this.ancho, altoVisible);

        // Detalles telescópicos
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(this.posX + 3 * this.escala, this.ySuperior, Math.max(1, 3 * this.escala), altoVisible);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = Math.max(1, 2 * this.escala);
        const pasoSegmento = 80 * this.escala;
        for (let y = this.ySuperior + pasoSegmento; y < this.ySuperior + altoVisible; y += pasoSegmento) {
            if (y >= -10 && y <= this.altoPantalla + 10) {
                ctx.beginPath();
                ctx.moveTo(this.posX, y);
                ctx.lineTo(this.posX + this.ancho, y);
                ctx.stroke();
            }
        }

        ctx.restore();
    }
}

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

    // Colores mecánicos
    private readonly colorGarra: string = '#64748b';        // Gris pizarra metálico
    private readonly colorGarraOscuro: string = '#475569';  // Gris sombra
    private readonly colorGarraClaro: string = '#94a3b8';   // Gris reflejo
    private readonly colorEstructura: string = '#18181b';   // Negro estructura

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

    constructor() {
        this.pieza1 = new Pieza1();
    }

    public actualizar(): void {
        // Estado dinámico si se requiere en el futuro
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

    public dibujar(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // 1. Base del suelo
        this.dibujarBaseSuelo(ctx);

        // 2. Columna extensible (Pieza 1)
        this.pieza1.dibujar(ctx);

        // 3. Brazo horizontal
        this.dibujarBrazoHorizontal(ctx);

        // 4. Pieza negra vertical (conector) que sostiene la garra gris
        this.dibujarConector(ctx);

        // 5. Garra mecánica completa
        this.dibujarGarraGris(ctx);

        ctx.restore();
    }

    /**
     * Dibuja la estructura y el cabezal de la garra, permitiendo intercalar
     * la esfera para que las pinzas la envuelvan por delante.
     */
    public dibujarSoporteYCabezal(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.dibujarBaseSuelo(ctx);
        this.pieza1.dibujar(ctx);
        this.dibujarBrazoHorizontal(ctx);
        this.dibujarConector(ctx);
        this.dibujarCabezal(ctx);
        ctx.restore();
    }

    /**
     * Dibuja los dedos/pinzas por delante del objeto sujeto
     */
    public dibujarDedosPinzas(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        this.dibujarPinzasSolas(ctx);
        ctx.restore();
    }

    private dibujarBaseSuelo(ctx: CanvasRenderingContext2D): void {
        const altoBase = this.altoBase;
        const yBaseMundo = this.altoMundo - altoBase;
        const yBasePantalla = yBaseMundo - this.camaraY;

        if (yBasePantalla <= this.altoPantalla) {
            ctx.save();
            ctx.fillStyle = this.colorEstructura;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = Math.max(1, 2 * this.escala);

            const centroColumna = this.columnaPosX + this.columnaAncho / 2;
            const mitadAnchoInferior = 80 * this.escala;
            const mitadAnchoSuperior = 40 * this.escala;

            const xInfIzq = centroColumna - mitadAnchoInferior;
            const xInfDer = centroColumna + mitadAnchoInferior;
            const xSupDer = centroColumna + mitadAnchoSuperior;
            const xSupIzq = centroColumna - mitadAnchoSuperior;

            ctx.beginPath();
            ctx.moveTo(xInfIzq, this.altoPantalla);
            ctx.lineTo(xInfDer, this.altoPantalla);
            ctx.lineTo(xSupDer, yBasePantalla);
            ctx.lineTo(xSupIzq, yBasePantalla);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(xSupIzq, yBasePantalla, mitadAnchoSuperior * 2, 8 * this.escala);

            ctx.restore();
        }
    }

    private dibujarBrazoHorizontal(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = this.colorEstructura;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * this.escala);

        const anchoBrazo = this.brazoFinX - this.brazoInicioX;
        ctx.fillRect(this.brazoInicioX, this.brazoY, anchoBrazo, this.brazoEspesor);
        ctx.strokeRect(this.brazoInicioX, this.brazoY, anchoBrazo, this.brazoEspesor);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(this.brazoInicioX, this.brazoY + 3 * this.escala, anchoBrazo, 4 * this.escala);

        ctx.restore();
    }

    private dibujarConector(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.fillStyle = this.colorEstructura;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * this.escala);

        const anchoConector = 20 * this.escala;
        const altoConector = Math.max(0, this.pinzaCentroY - (this.brazoY + this.brazoEspesor));
        const xConector = this.pinzaCentroX - anchoConector / 2;
        const yConector = this.brazoY + this.brazoEspesor;

        ctx.fillRect(xConector, yConector, anchoConector, altoConector);
        ctx.strokeRect(xConector, yConector, anchoConector, altoConector);

        // Eslabones de cadena para reforzar el aspecto de pieza extensible
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = Math.max(1, 1.5 * this.escala);
        const eslabon = 18 * this.escala;
        for (let y = yConector + eslabon; y < yConector + altoConector; y += eslabon) {
            ctx.beginPath();
            ctx.moveTo(xConector, y);
            ctx.lineTo(xConector + anchoConector, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    private dibujarCabezal(ctx: CanvasRenderingContext2D): void {
        const cx = this.pinzaCentroX;
        const cy = this.pinzaCentroY;
        const s = this.escala;

        const anchoCabezal = 130 * s;
        const altoCabezal = 30 * s;
        const xCabezal = cx - anchoCabezal / 2;
        const yCabezal = cy;

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8 * s;
        ctx.shadowOffsetY = 4 * s;

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(xCabezal, yCabezal, anchoCabezal, altoCabezal, [8 * s, 8 * s, 4 * s, 4 * s]);
        } else {
            ctx.rect(xCabezal, yCabezal, anchoCabezal, altoCabezal);
        }
        ctx.fillStyle = this.colorGarra;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.strokeStyle = this.colorGarraOscuro;
        ctx.stroke();

        ctx.fillStyle = this.colorGarraClaro;
        ctx.fillRect(xCabezal + 10 * s, yCabezal + 4 * s, anchoCabezal - 20 * s, 4 * s);

        ctx.restore();
    }

    private dibujarPinzasSolas(ctx: CanvasRenderingContext2D): void {
        const cx = this.pinzaCentroX;
        const cy = this.pinzaCentroY;
        const s = this.escala;

        const anchoCabezal = 130 * s;
        const altoCabezal = 30 * s;
        const xCabezal = cx - anchoCabezal / 2;
        const yCabezal = cy;
        const xDer = xCabezal + anchoCabezal;

        ctx.save();

        // Pinza Izquierda
        ctx.beginPath();
        ctx.moveTo(xCabezal, yCabezal + altoCabezal);
        ctx.lineTo(xCabezal, yCabezal + altoCabezal + 55 * s);
        ctx.lineTo(xCabezal + 25 * s, yCabezal + altoCabezal + 68 * s);
        ctx.lineTo(xCabezal + 25 * s, yCabezal + altoCabezal + 50 * s);
        ctx.lineTo(xCabezal + 20 * s, yCabezal + altoCabezal);
        ctx.closePath();

        ctx.fillStyle = this.colorGarra;
        ctx.fill();
        ctx.strokeStyle = this.colorGarraOscuro;
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.stroke();

        ctx.fillStyle = this.colorGarraOscuro;
        ctx.fillRect(xCabezal + 3 * s, yCabezal + altoCabezal + 4 * s, 3 * s, 46 * s);

        // Pinza Derecha
        ctx.beginPath();
        ctx.moveTo(xDer, yCabezal + altoCabezal);
        ctx.lineTo(xDer, yCabezal + altoCabezal + 55 * s);
        ctx.lineTo(xDer - 25 * s, yCabezal + altoCabezal + 68 * s);
        ctx.lineTo(xDer - 25 * s, yCabezal + altoCabezal + 50 * s);
        ctx.lineTo(xDer - 20 * s, yCabezal + altoCabezal);
        ctx.closePath();

        ctx.fillStyle = this.colorGarra;
        ctx.fill();
        ctx.strokeStyle = this.colorGarraOscuro;
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.stroke();

        ctx.fillStyle = this.colorGarraOscuro;
        ctx.fillRect(xDer - 6 * s, yCabezal + altoCabezal + 4 * s, 3 * s, 46 * s);

        // Pernos / remaches mecánicos
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(xCabezal + 14 * s, yCabezal + 15 * s, 4 * s, 0, Math.PI * 2);
        ctx.arc(xDer - 14 * s, yCabezal + 15 * s, 4 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    private dibujarGarraGris(ctx: CanvasRenderingContext2D): void {
        this.dibujarCabezal(ctx);
        this.dibujarPinzasSolas(ctx);
    }
}
