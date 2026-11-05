import { EstadoPOC, IEstadoBola, IFormulas } from './interfaces';
import { PIXELES_POR_METRO } from './constantes';
import { POC } from './poc';
import { Calculos } from './calculos';
import { Garra } from './garra';
import { Mapa } from './mapa';
import { Bucle } from './bucle';

/**
 * Clase EstadoBola
 * Responsabilidad única (SRP):
 * Controlar el ciclo de vida y estado de la bola en la simulación,
 * así como la creación física en suelo y la detección de proximidad con la garra.
 */
export class EstadoBola implements IEstadoBola {
    private estado: EstadoPOC;
    private garra?: Garra;
    private mapa?: Mapa;
    private formulas?: IFormulas;
    private canvas?: HTMLCanvasElement;
    private bucle?: Bucle;
    private readonly distanciaAgarreBase: number = 48;

    constructor(
        estadoInicial: EstadoPOC = 'sujeto',
        garra?: Garra,
        mapa?: Mapa,
        formulas?: IFormulas,
        canvas?: HTMLCanvasElement,
        bucle?: Bucle
    ) {
        this.estado = estadoInicial;
        this.garra = garra;
        this.mapa = mapa;
        this.formulas = formulas;
        this.canvas = canvas;
        this.bucle = bucle;
    }

    public setContexto(
        garra: Garra,
        mapa: Mapa,
        formulas: IFormulas,
        canvas: HTMLCanvasElement,
        bucle: Bucle
    ): void {
        this.garra = garra;
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
    // Creación y detección de proximidad de la bola
    // ---------------------------------------------------------------------

    public crearBolaEnSuelo(
        garra?: Garra,
        mapa?: Mapa,
        formulas?: IFormulas,
        canvas?: HTMLCanvasElement,
        bucle?: Bucle
    ): Calculos | null {
        const g = garra ?? this.garra;
        const m = mapa ?? this.mapa;
        const f = formulas ?? this.formulas;
        const c = canvas ?? this.canvas;
        const b = bucle ?? this.bucle;

        if (!g || !m || !f || !c) return null;

        const escala = g.getEscala();
        const radioPx = Math.max(16, Math.round(32 * escala));
        const radioMetros = radioPx / PIXELES_POR_METRO;
        const sueloY = m.getAltoTotal() - g.getAltoBase();

        // 1. Instanciar la clase de datos físicos POC (usa sus valores por defecto internos)
        const poc = new POC(0, 0, radioMetros);

        // 2. Instanciar la clase Calculos pasando formulas y poc
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
        garra?: Garra,
        mapa?: Mapa,
        formulas?: IFormulas,
        canvas?: HTMLCanvasElement,
        bucle?: Bucle
    ): Calculos | null {
        return this.crearBolaEnSuelo(garra, mapa, formulas, canvas, bucle);
    }

    /**
     * Comprueba si el punto de agarre de la garra está a corta distancia de la bola.
     * La distancia se compara en coordenadas de pantalla.
     */
    public cercaDeBola(
        bola: Calculos,
        garra?: Garra,
        mapa?: Mapa,
        distanciaAgarreBase?: number
    ): boolean {
        const g = garra ?? this.garra;
        const m = mapa ?? this.mapa;
        const distBase = distanciaAgarreBase ?? this.distanciaAgarreBase;

        if (!g || !m) return false;

        const xPantalla = bola.getXMundo();
        const yPantalla = bola.getYMundo() - m.getCamaraY();
        const tolerancia = Math.max(distBase, bola.getRadio() * 2);
        return g.distanciaAlPunto(xPantalla, yPantalla) <= tolerancia;
    }

    public CercaDeBola(
        bola: Calculos,
        garra?: Garra,
        mapa?: Mapa,
        distanciaAgarreBase?: number
    ): boolean {
        return this.cercaDeBola(bola, garra, mapa, distanciaAgarreBase);
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
