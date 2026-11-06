import { EstadoPOC, IEstadoBola, IFormulas } from './interfaces';
import { PIXELES_POR_METRO } from './constantes';
import { POC } from './poc';
import { Calculos } from './calculos';
import { PuntoSujecion } from './puntoSujecion';
import { Mapa } from './mapa';
import { Bucle } from './bucle';

/**
 * Clase EstadoBola
 * Responsabilidad única (SRP):
 * Controlar el ciclo de vida y estado de la bola en la simulación,
 * así como la creación física en suelo y la detección de click sobre el POC.
 */
export class EstadoBola implements IEstadoBola {
    private estado: EstadoPOC;
    private puntoSujecion?: PuntoSujecion;
    private mapa?: Mapa;
    private formulas?: IFormulas;
    private canvas?: HTMLCanvasElement;
    private bucle?: Bucle;

    constructor(
        estadoInicial: EstadoPOC = 'sujeto',
        puntoSujecion?: PuntoSujecion,
        mapa?: Mapa,
        formulas?: IFormulas,
        canvas?: HTMLCanvasElement,
        bucle?: Bucle
    ) {
        this.estado = estadoInicial;
        this.puntoSujecion = puntoSujecion;
        this.mapa = mapa;
        this.formulas = formulas;
        this.canvas = canvas;
        this.bucle = bucle;
    }

    public setContexto(
        puntoSujecion: PuntoSujecion,
        mapa: Mapa,
        formulas: IFormulas,
        canvas: HTMLCanvasElement,
        bucle: Bucle
    ): void {
        this.puntoSujecion = puntoSujecion;
        this.mapa = mapa;
        this.formulas = formulas;
        this.canvas = canvas;
        this.bucle = bucle;
    }

    public get(): EstadoPOC {
        return this.estado;
    }

    public set(nuevoEstado: EstadoPOC): void {
        this.estado = nuevoEstado;
    }

    public es(estado: EstadoPOC): boolean {
        return this.estado === estado;
    }

    // ---------------------------------------------------------------------
    // Creación y detección de click sobre la bola
    // ---------------------------------------------------------------------

    public crearBolaEnSuelo(
        puntoSujecion?: PuntoSujecion,
        mapa?: Mapa,
        formulas?: IFormulas,
        canvas?: HTMLCanvasElement,
        bucle?: Bucle
    ): Calculos | null {
        const p = puntoSujecion ?? this.puntoSujecion;
        const m = mapa ?? this.mapa;
        const f = formulas ?? this.formulas;
        const c = canvas ?? this.canvas;
        const b = bucle ?? this.bucle;

        if (!p || !m || !f || !c) return null;

        const escala = p.getEscala();
        const radioPx = Math.max(16, Math.round(32 * escala));
        const radioMetros = radioPx / PIXELES_POR_METRO;
        const sueloY = m.getAltoTotal() - p.getAltoBase();

        const poc = new POC(0, 0, radioMetros);

        const nuevaBola = new Calculos(
            f,
            poc,
            c.width / 2,
            sueloY - radioPx,
            0,
            escala
        );
        nuevaBola.getEstadoBola().colocarEnSuelo();
        nuevaBola.resetearFisica();
        if (b) {
            b.setCalculos(nuevaBola);
        }
        return nuevaBola;
    }

    public CrearBolaEnSuelo(
        puntoSujecion?: PuntoSujecion,
        mapa?: Mapa,
        formulas?: IFormulas,
        canvas?: HTMLCanvasElement,
        bucle?: Bucle
    ): Calculos | null {
        return this.crearBolaEnSuelo(puntoSujecion, mapa, formulas, canvas, bucle);
    }

    /**
     * Comprueba si un punto de pantalla (p. ej. el mouse) está sobre la bola.
     */
    public puntoSobreBola(
        bola: Calculos,
        x: number,
        y: number,
        mapa?: Mapa
    ): boolean {
        const m = mapa ?? this.mapa;
        if (!m) return false;

        const xPantalla = bola.getXMundo();
        const yPantalla = bola.getYMundo() - m.getCamaraY();
        const radio = bola.getRadio();
        return Math.hypot(x - xPantalla, y - yPantalla) <= radio;
    }

    // ---------------------------------------------------------------------
    // Funciones de estado
    // ---------------------------------------------------------------------

    public colocarEnSuelo(): void {
        this.estado = 'enSuelo';
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

    public alternarPausa(): void {
        if (this.estado === 'cayendo') {
            this.estado = 'pausado';
        } else if (this.estado === 'pausado') {
            this.estado = 'cayendo';
        }
    }

    public detener(): void {
        this.estado = 'detenido';
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
}
