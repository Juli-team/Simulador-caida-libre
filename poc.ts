import { IPOC, IDibujable, EstadoPOC, IFormulas } from './interfaces';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Clase POC (Fusión de Círculo y POC)
 * Cumple con SRP al encapsular tanto el estado físico del objeto
 * (altura inicial h0, velocidad inicial v0, tiempo t, velocidad v)
 * como sus propiedades visuales y cinemáticas (radio, color, posición de mundo, dibujo).
 */
export class POC implements IPOC, IDibujable {
    // Fuente única de las fórmulas físicas (DIP)
    private formulas: IFormulas;

    // Parámetros físicos (en unidades estándar: metros, segundos, m/s)
    private h0: number = 0;
    private v0: number = 0;
    private t: number = 0;
    private v: number = 0;

    // Propiedades visuales y espaciales (en píxeles)
    private radio: number = 24;
    private color: string = '#f59e0b'; // Ámbar metálico llamativo
    private xMundo: number = 0;
    private yMundo: number = 0;

    // Estado del ciclo de vida de la bola
    private estado: EstadoPOC = 'sujeto';

    constructor(
        formulas: IFormulas,
        xMundo: number = 0,
        yMundo: number = 0,
        h0: number = 0,
        escala: number = 1,
        color: string = '#f59e0b'
    ) {
        this.formulas = formulas;
        this.xMundo = xMundo;
        this.yMundo = yMundo;
        this.h0 = Math.max(0, h0);
        this.v0 = 0;
        this.t = 0;
        this.v = 0;
        this.color = color;
        this.radio = Math.max(16, Math.round(32 * escala));
        this.estado = 'sujeto';
    }

    // Getters y Setters de IPOC
    public getH0(): number {
        return this.h0;
    }

    public getV0(): number {
        return this.v0;
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

    // Métodos de control del estado
    /**
     * Coloca la esfera reposando sobre el suelo, sin estar sujeta a la garra.
     * Es el estado inicial del ciclo tipo grúa: el usuario debe acercar la garra.
     */
    public colocarEnSuelo(): void {
        this.estado = 'enSuelo';
        this.t = 0;
        this.v = 0;
        this.h0 = 0;
    }

    /**
     * Sujeta la esfera a la garra cuando el usuario hace click dentro del rango.
     */
    public sujetar(): void {
        if (this.estado === 'enSuelo') {
            this.estado = 'sujeto';
        }
    }

    public soltar(): void {
        if (this.estado === 'sujeto') {
            this.estado = 'cayendo';
        }
    }

    public pausar(): void {
        if (this.estado === 'cayendo') {
            this.estado = 'pausado';
        }
    }

    public reanudar(): void {
        if (this.estado === 'pausado') {
            this.estado = 'cayendo';
        }
    }

    public esEnSuelo(): boolean {
        return this.estado === 'enSuelo';
    }

    public esSujeto(): boolean {
        return this.estado === 'sujeto';
    }

    public esCayendo(): boolean {
        return this.estado === 'cayendo';
    }

    public esPausado(): boolean {
        return this.estado === 'pausado';
    }

    public esDetenido(): boolean {
        return this.estado === 'detenido';
    }

    // Dimensiones y posición
    public getRadio(): number {
        return this.radio;
    }

    public getXMundo(): number {
        return this.xMundo;
    }

    public getYMundo(): number {
        return this.yMundo;
    }

    /**
     * Sincroniza la esfera con la garra cuando está sujeta,
     * actualizando su posición en el mundo, radio relativo a la pantalla y la altura h0 calculada.
     */
    public sincronizarConGarra(
        xSujecionPantalla: number,
        ySujecionPantalla: number,
        camaraY: number,
        ySueloMundo: number,
        escala: number
    ): void {
        if (this.estado !== 'sujeto') return;

        this.radio = Math.max(16, Math.round(32 * escala));
        this.xMundo = xSujecionPantalla;
        this.yMundo = camaraY + ySujecionPantalla;

        // Distancia en píxeles desde el centro de la bola hasta el suelo donde se detendrá
        const yDetencion = ySueloMundo - this.radio;
        const distanciaPx = Math.max(0, yDetencion - this.yMundo);

        // 1 metro = 10 píxeles
        this.h0 = distanciaPx / PIXELES_POR_METRO;
    }

    /**
     * Actualiza la cinemática de caída libre con MRUV frame a frame:
     * v(t) = v0 + g · t
     * y(t) = y0 + v(t) · dt
     * La velocidad y el tiempo final los resuelve la clase Formulas (fuente única).
     * @param dt Delta time en segundos
     * @param ySueloMundo Coordenada Y del suelo en píxeles del mundo
     */
    public actualizar(dt: number, ySueloMundo: number): void {
        if (this.estado !== 'cayendo') return;

        // Incrementar tiempo transcurrido
        this.t += dt;

        // Actualizar velocidad en m/s (MRUV con v0 = 0)
        this.v = this.formulas.calcularVelocidad(this.v0, this.t);

        // Convertir velocidad a píxeles/segundo y actualizar posición Y en el mundo
        const velocidadPxPorSegundo = this.v * PIXELES_POR_METRO;
        this.yMundo += velocidadPxPorSegundo * dt;

        // Detección de impacto con el suelo
        const yDetencion = ySueloMundo - this.radio;
        if (this.yMundo >= yDetencion) {
            this.yMundo = yDetencion;
            // Al detenerse en el suelo, fijar la velocidad final exacta y tiempo final
            this.t = this.formulas.calcularTiempo(this.h0);
            this.v = this.formulas.calcularVelocidad(this.v0, this.t);
            this.estado = 'detenido';
        }
    }

    /**
     * Dibuja la esfera física con iluminación 3D, reflejo y borde
     */
    public dibujar(ctx: CanvasRenderingContext2D, camaraY: number = 0): void {
        const x = this.xMundo;
        const y = this.yMundo - camaraY;
        const r = this.radio;

        ctx.save();

        // Sombra de la esfera
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = r * 0.5;
        ctx.shadowOffsetY = r * 0.2;

        // Gradiente radial para efecto 3D esférico
        const gradiente = ctx.createRadialGradient(
            x - r * 0.35,
            y - r * 0.35,
            r * 0.1,
            x,
            y,
            r
        );
        gradiente.addColorStop(0, '#fef08a'); // Punto de brillo blanco-amarillo
        gradiente.addColorStop(0.3, this.color); // Color principal
        gradiente.addColorStop(0.85, '#d97706'); // Sombra intermedia
        gradiente.addColorStop(1, '#78350f');   // Borde oscuro sombreado

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradiente;
        ctx.fill();

        // Borde nítido para resaltar
        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1, r * 0.08);
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        ctx.restore();
    }
}
