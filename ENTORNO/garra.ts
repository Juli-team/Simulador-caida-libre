import { IDibujable, IActualizable } from './interfaces';

/**
 * Representa la Pieza 1 de la estructura (columna vertical de soporte).
 * Cumple con el Principio de Responsabilidad Única (SRP):
 * Se encarga de gestionar la altura, estiramiento y contracción de la columna negra.
 */
export class Pieza1 implements IDibujable {
    private posX: number = 110;
    private ancho: number = 26;
    private readonly color: string = '#18181b';         // Color negro según especificación
    private ySuperior: number = 90; // Conexión con el brazo horizontal
    private yInferior: number = 688; // Altura actual en pantalla (cambia al subir/bajar)
    private alturaMundo: number = 574; // Longitud real en el mundo de 5000px
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

        // La parte inferior de la pieza 1 se ancla a la base del suelo
        this.yInferior = Math.max(this.ySuperior, yBasePantalla);
        // Altura real estirada en coordenadas de mundo
        this.alturaMundo = Math.max(50, yBaseMundo - (camaraY + this.ySuperior));
    }

    public getAlturaMundo(): number {
        return this.alturaMundo;
    }

    public getPosX(): number {
        return this.posX;
    }

    public getAncho(): number {
        return this.ancho;
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const altoVisible = Math.min(this.yInferior, this.altoPantalla) - this.ySuperior;
        if (altoVisible <= 0) {
            ctx.restore();
            return;
        }

        // Columna negra principal (Pieza 1)
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posX, this.ySuperior, this.ancho, altoVisible);

        // Borde oscuro marcado para estilo mecánico industrial
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * this.escala);
        ctx.strokeRect(this.posX, this.ySuperior, this.ancho, altoVisible);

        // Detalles estructurales / juntas telescópicas que evidencian el estiramiento
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(this.posX + 3 * this.escala, this.ySuperior, Math.max(1, 3 * this.escala), altoVisible);

        // Líneas de segmentos que acompañan el estiramiento
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = Math.max(1, 2 * this.escala);
        const pasoSegmento = 80 * this.escala;
        for (let y = this.ySuperior + pasoSegmento; y < this.ySuperior + altoVisible; y += pasoSegmento) {
            ctx.beginPath();
            ctx.moveTo(this.posX, y);
            ctx.lineTo(this.posX + this.ancho, y);
            ctx.stroke();
        }

        ctx.restore();
    }
}

/**
 * Representa el Objeto Garra y su estructura de soporte.
 * Cumple con el Principio de Responsabilidad Única (SRP) y Composición (POO).
 * La garra es de color gris, no realiza acciones por el momento,
 * y la pieza 1 (negra) se estira o contrae al subir o bajar la pantalla.
 * Todas sus dimensiones y posiciones son relativas al tamaño de pantalla.
 */
export class Garra implements IDibujable, IActualizable {
    private pieza1: Pieza1;

    // Colores de la garra (Gris según especificación)
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

    // Estado del mapa actual
    private camaraY: number = 0;
    private altoPantalla: number = 768;
    private altoMundo: number = 5000;

    constructor() {
        this.pieza1 = new Pieza1();
    }

    public actualizar(): void {
        // La garra por el momento no realiza acciones activas (física/soltado en el futuro)
    }

    public sincronizarConMapa(
        camaraY: number,
        anchoPantalla: number,
        altoPantalla: number,
        altoMundo: number
    ): void {
        this.camaraY = camaraY;
        this.altoPantalla = altoPantalla;
        this.altoMundo = altoMundo;

        // Escala proporcional basada en la resolución de referencia 1024x768
        this.escala = Math.min(anchoPantalla / 1024, altoPantalla / 768);

        // Posiciones y dimensiones en relación con la pantalla
        this.columnaPosX = anchoPantalla * (110 / 1024);
        this.columnaAncho = 26 * this.escala;
        this.altoBase = 80 * this.escala;

        this.brazoY = altoPantalla * (90 / 768);
        this.brazoEspesor = 24 * this.escala;
        this.brazoInicioX = this.columnaPosX - 15 * this.escala;

        this.pinzaCentroX = anchoPantalla * (410 / 1024);
        this.pinzaCentroY = altoPantalla * (155 / 768);
        this.brazoFinX = this.pinzaCentroX + 30 * this.escala;

        // Actualizar la extensión y geometría de la Pieza 1
        this.pieza1.actualizarDimensionesYLongitud(
            this.columnaPosX,
            this.brazoY,
            this.columnaAncho,
            this.escala,
            camaraY,
            altoPantalla,
            altoMundo,
            this.altoBase
        );
    }

    public getPieza1(): Pieza1 {
        return this.pieza1;
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        // 1. Dibujar la base del suelo (si está visible en pantalla)
        this.dibujarBaseSuelo(ctx);

        // 2. Dibujar la Pieza 1 (columna negra estirable)
        this.pieza1.dibujar(ctx);

        // 3. Dibujar el brazo horizontal superior (negro)
        this.dibujarBrazoHorizontal(ctx);

        // 4. Dibujar el vástago/conector vertical que sostiene la garra (negro)
        this.dibujarConector(ctx);

        // 5. Dibujar la Garra mecánica (objeto gris según especificación)
        this.dibujarGarraGris(ctx);

        ctx.restore();
    }

    private dibujarBaseSuelo(ctx: CanvasRenderingContext2D): void {
        const altoBase = this.altoBase;
        const yBaseMundo = this.altoMundo - altoBase;
        const yBasePantalla = yBaseMundo - this.camaraY;

        // Solo se dibuja si entra en el campo de visión de la pantalla
        if (yBasePantalla <= this.altoPantalla) {
            ctx.save();
            ctx.fillStyle = this.colorEstructura; // Negro base
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
            // Trapecio industrial de la base perfectamente centrado con la columna
            ctx.moveTo(xInfIzq, this.altoPantalla);
            ctx.lineTo(xInfDer, this.altoPantalla);
            ctx.lineTo(xSupDer, yBasePantalla);
            ctx.lineTo(xSupIzq, yBasePantalla);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Refuerzos mecánicos de la base
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

        // Reflejo metálico en el brazo
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
        const altoConector = this.pinzaCentroY - (this.brazoY + this.brazoEspesor);
        const xConector = this.pinzaCentroX - anchoConector / 2;
        const yConector = this.brazoY + this.brazoEspesor;

        ctx.fillRect(xConector, yConector, anchoConector, altoConector);
        ctx.strokeRect(xConector, yConector, anchoConector, altoConector);

        ctx.restore();
    }

    private dibujarGarraGris(ctx: CanvasRenderingContext2D): void {
        ctx.save();

        const cx = this.pinzaCentroX;
        const cy = this.pinzaCentroY;
        const s = this.escala;

        // Sombra de la garra para realce tridimensional
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8 * s;
        ctx.shadowOffsetY = 4 * s;

        // --- A. Cabezal horizontal de la garra (Gris) ---
        const anchoCabezal = 130 * s;
        const altoCabezal = 30 * s;
        const xCabezal = cx - anchoCabezal / 2;
        const yCabezal = cy;

        ctx.beginPath();
        ctx.roundRect(xCabezal, yCabezal, anchoCabezal, altoCabezal, [8 * s, 8 * s, 4 * s, 4 * s]);
        ctx.fillStyle = this.colorGarra;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.strokeStyle = this.colorGarraOscuro;
        ctx.stroke();

        // Brillo superior del cabezal gris
        ctx.fillStyle = this.colorGarraClaro;
        ctx.fillRect(xCabezal + 10 * s, yCabezal + 4 * s, anchoCabezal - 20 * s, 4 * s);

        // --- B. Dedo / Pinza izquierda (Gris) ---
        ctx.beginPath();
        ctx.moveTo(xCabezal, yCabezal + altoCabezal);
        // Descenso y curvatura hacia adentro
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

        // Bisel de sombra en la pinza izquierda
        ctx.fillStyle = this.colorGarraOscuro;
        ctx.fillRect(xCabezal + 3 * s, yCabezal + altoCabezal + 4 * s, 3 * s, 46 * s);

        // --- C. Dedo / Pinza derecha (Gris) ---
        const xDer = xCabezal + anchoCabezal;
        ctx.beginPath();
        ctx.moveTo(xDer, yCabezal + altoCabezal);
        // Descenso y curvatura hacia adentro
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

        // Bisel de sombra en la pinza derecha
        ctx.fillStyle = this.colorGarraOscuro;
        ctx.fillRect(xDer - 6 * s, yCabezal + altoCabezal + 4 * s, 3 * s, 46 * s);

        // Pernos / remaches de unión mecánicos
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(xCabezal + 14 * s, yCabezal + 15 * s, 4 * s, 0, Math.PI * 2);
        ctx.arc(xDer - 14 * s, yCabezal + 15 * s, 4 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
