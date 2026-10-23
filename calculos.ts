import { ICalculos, IPOC, IDibujable, EstadoPOC, IFormulas } from './interfaces';
import { PIXELES_POR_METRO} from './constantes';
import { POC } from './poc';

/**
 * Clase Cálculos (antigua clase POC)
 * Responsabilidad única (SRP):
 * - Realizar los cálculos físicos frame a frame directamente con los valores y fórmulas,
 *   guardando los resultados en la clase POC.
 * - Coordinar la entidad del objeto en el espacio visual del mundo (posición, dibujo y estados).
 */
export class Calculos implements ICalculos, IDibujable {
    private formulas: IFormulas;
    private poc: IPOC;

    // Propiedades visuales y espaciales en coordenadas del canvas (píxeles)
    private radioVisual: number = 24;
    private color: string = '#f59e0b';
    private xMundo: number = 0;
    private yMundo: number = 0;

    // Estado del ciclo de vida del objeto en la simulación
    private estado: EstadoPOC = 'sujeto';

    constructor(
        formulas: IFormulas,
        poc?: IPOC,
        xMundo: number = 0,
        yMundo: number = 0,
        h0: number = 0,
        escala: number = 1,
        color: string = '#f59e0b'
    ) {
        this.formulas = formulas;
        this.xMundo = xMundo;
        this.yMundo = yMundo;
        this.color = color;
        this.radioVisual = Math.max(16, Math.round(32 * escala));
        this.estado = 'sujeto';

        const radioFisicoMetros = this.radioVisual / PIXELES_POR_METRO;
        if (poc) {
            this.poc = poc;
            this.poc.setRadio(radioFisicoMetros);
            if (h0 > 0 && this.poc.getAltura() === 0) {
                this.poc.setAltura(h0);
            }
        } else {
            this.poc = new POC(h0, 0, radioFisicoMetros);
        }
    }

    public getPOC(): IPOC {
        return this.poc;
    }

    public setPOC(poc: IPOC): void {
        this.poc = poc;
    }

    /**
     * Actualiza la cinemática de caída frame a frame trabajando directamente con los valores
     * y guardando los resultados en la clase POC.
     * @param dt Delta time en segundos
     * @param ySueloMundo Coordenada Y del suelo en píxeles
     */
    public actualizar(dt: number, ySueloMundo: number): void {
        if (this.estado !== 'cayendo') return;

        const yDetencion = ySueloMundo - this.radioVisual;

        // 1. Altura actual (y) respecto al suelo en metros
        const distanciaAlSueloPx = Math.max(0, yDetencion - this.yMundo);
        const altura = distanciaAlSueloPx / PIXELES_POR_METRO;
        this.poc.setAltura(altura);

        // 2. Cálculos físicos directamente con los valores
        const area = this.formulas.calcularArea(this.poc.getRadio());
        const densidadAire = this.formulas.calcularDensidadAire(altura);
        const fuerzaArrastre = this.formulas.calcularFuerzaArrastre(
            densidadAire,
            this.poc.getVelocidad(),
            this.poc.getCoeficienteArrastre(),
            area
        );
        const aceleracionNeta = this.formulas.calcularAceleracionNeta(
            fuerzaArrastre,
            this.poc.getMasa()
        );
        const velocidad = this.formulas.calcularVelocidad(
            this.poc.getVelocidad(),
            aceleracionNeta,
            dt
        );
        const tiempo = this.poc.getTiempoCaida() + dt;

        // 3. Guardar directamente los resultados en la clase POC
        this.poc.setDensidadAire(densidadAire);
        this.poc.setFuerzaArrastre(fuerzaArrastre);
        this.poc.setAceleracion(aceleracionNeta);
        this.poc.setVelocidad(velocidad);
        this.poc.setTiempoCaida(tiempo);

        // 4. Integrar desplazamiento en el mundo físico y visual
        this.yMundo += velocidad * PIXELES_POR_METRO * dt;

        // 5. Impacto en el suelo
        if (this.yMundo >= yDetencion) {
            this.yMundo = yDetencion;
            this.poc.setAltura(0);
            this.poc.setAceleracion(0);
            this.poc.setFuerzaArrastre(0);
            this.estado = 'detenido';
        }
    }

    // Métodos de control del ciclo de vida
    public colocarEnSuelo(): void {
        this.estado = 'enSuelo';
        this.poc.setTiempoCaida(0);
        this.poc.setVelocidad(0);
        this.poc.setAltura(0);
        this.poc.setAceleracion(0);
        this.poc.setFuerzaArrastre(0);
    }

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

    public getRadio(): number {
        return this.radioVisual;
    }

    public getXMundo(): number {
        return this.xMundo;
    }

    public getYMundo(): number {
        return this.yMundo;
    }

    /**
     * Sincroniza la esfera con la garra cuando está sujeta.
     */
    public sincronizarConGarra(
        xSujecionPantalla: number,
        ySujecionPantalla: number,
        camaraY: number,
        ySueloMundo: number,
        escala: number
    ): void {
        if (this.estado !== 'sujeto') return;

        this.radioVisual = Math.max(16, Math.round(32 * escala));
        this.poc.setRadio(this.radioVisual / PIXELES_POR_METRO);
        this.xMundo = xSujecionPantalla;
        this.yMundo = camaraY + ySujecionPantalla;

        const yDetencion = ySueloMundo - this.radioVisual;
        const distanciaPx = Math.max(0, yDetencion - this.yMundo);
        const alturaMetros = distanciaPx / PIXELES_POR_METRO;

        this.poc.setAltura(alturaMetros);
        this.poc.setVelocidad(0);
        this.poc.setTiempoCaida(0);
    }

    /**
     * Dibuja la esfera física con sombreado e iluminación 3D.
     */
    public dibujar(ctx: CanvasRenderingContext2D, camaraY: number = 0): void {
        const x = this.xMundo;
        const y = this.yMundo - camaraY;
        const r = this.radioVisual;

        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = r * 0.5;
        ctx.shadowOffsetY = r * 0.2;

        const gradiente = ctx.createRadialGradient(
            x - r * 0.35,
            y - r * 0.35,
            r * 0.1,
            x,
            y,
            r
        );
        gradiente.addColorStop(0, '#fef08a');
        gradiente.addColorStop(0.3, this.color);
        gradiente.addColorStop(0.85, '#d97706');
        gradiente.addColorStop(1, '#78350f');

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradiente;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1, r * 0.08);
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        ctx.restore();
    }
}
