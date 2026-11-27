import { IFormulas } from './interfaces';
import { PIXELES_POR_METRO } from '../física/constantes';
import { POC } from '../física/poc';
import { Calculos } from '../física/calculos';
import { Mapa } from './mapa';
import { PuntoSujecion } from './puntoSujecion';
import { Bucle } from './bucle';

/**
 * Clase GestorBola
 * Responsabilidad única (SRP):
 * Coordinar la creación, reinicio, posicionamiento y sujeción de la bola (POC/Calculos)
 * dentro de la escena (Mapa, PuntoSujecion y Bucle), desacoplando a Menu y ControladorSimulacion.
 */
export class GestorBola {
    private puntoSujecion: PuntoSujecion;
    private mapa: Mapa;
    private formulas: IFormulas;
    private bucle: Bucle;

    constructor(
        puntoSujecion: PuntoSujecion,
        mapa: Mapa,
        formulas: IFormulas,
        bucle: Bucle
    ) {
        this.puntoSujecion = puntoSujecion;
        this.mapa = mapa;
        this.formulas = formulas;
        this.bucle = bucle;
    }

    public getPOCActual(): POC | null {
        return this.bucle.getPOC();
    }

    public getLimiteAlturaMapa(): number {
        const sueloY = this.mapa.getAltoTotal() - this.puntoSujecion.getAltoBase();
        return Number((sueloY / PIXELES_POR_METRO).toFixed(1));
    }

    public enfocarAltura(altura: number): void {
        const alturaNum = Math.max(0, isNaN(altura) ? 0 : altura);
        const sueloY = this.mapa.getAltoTotal() - this.puntoSujecion.getAltoBase();
        const maxAlturaMetros = sueloY / PIXELES_POR_METRO;
        const alturaEfectiva = Math.min(alturaNum, maxAlturaMetros);
        const yObjetivo = sueloY - (alturaEfectiva * PIXELES_POR_METRO);

        const targetCamaraY = Math.max(
            0,
            Math.min(this.mapa.getMaxCamaraY(), yObjetivo - this.mapa.getAltoVisible() / 2)
        );
        this.mapa.setCamaraY(targetCamaraY);
        this.mapa.precargarCercaDe(targetCamaraY);
    }

    public crearEnSuelo(
        masa: number = 10,
        radio?: number,
        coeficienteArrastre: number = 0.47
    ): Calculos {
        const escala = this.puntoSujecion.getEscala();
        const radioFinal = radio ?? Math.round(64 * escala);
        const sueloY = this.mapa.getAltoTotal() - this.puntoSujecion.getAltoBase();
        const xMundo = this.mapa.getAncho() / 2;

        const poc = new POC(0, 0, radioFinal, masa, coeficienteArrastre);
        const nuevaBola = new Calculos(this.formulas, poc, xMundo, sueloY - radioFinal, 0, escala);

        nuevaBola.getEstadoBola().colocarEnSuelo();
        nuevaBola.resetearFisica();
        this.bucle.setCalculos(nuevaBola);
        return nuevaBola;
    }

    public reiniciarConParametros(
        alturaInicial: number,
        masa: number,
        radio: number,
        coeficienteArrastre: number
    ): void {
        this.bucle.setCalculos(null);

        if (alturaInicial > 0) {
            this.crearEnAltura(alturaInicial, masa, radio, coeficienteArrastre);
            return;
        }

        this.crearEnSuelo(masa, radio, coeficienteArrastre);
        this.mapa.setCamaraY(this.mapa.getMaxCamaraY());
    }

    private crearEnAltura(
        alturaInicial: number,
        masa: number,
        radio: number,
        coeficienteArrastre: number
    ): void {
        const sueloY = this.mapa.getAltoTotal() - this.puntoSujecion.getAltoBase();
        const xMundo = this.mapa.getAncho() / 2;
        const yMundo = sueloY - radio - (alturaInicial * PIXELES_POR_METRO);
        const escala = this.puntoSujecion.getEscala();

        const poc = new POC(alturaInicial, 0, radio, masa, coeficienteArrastre);
        const nuevaBola = new Calculos(this.formulas, poc, xMundo, yMundo, alturaInicial, escala);

        nuevaBola.getEstadoBola().sujetar();
        this.puntoSujecion.fijarPosicionMundo();
        this.bucle.setCalculos(nuevaBola);

        const targetCamaraY = Math.max(
            0,
            Math.min(this.mapa.getMaxCamaraY(), yMundo - (this.mapa.getAltoVisible() * 0.45))
        );
        this.mapa.setCamaraY(targetCamaraY);
    }

    public puntoSobreBola(bola: Calculos, x: number, y: number): boolean {
        const xPantalla = bola.getXMundo();
        const yPantalla = bola.getYMundo() - this.mapa.getCamaraY();
        return Math.hypot(x - xPantalla, y - yPantalla) <= bola.getRadio();
    }

    public sujetarBola(bola: Calculos, x: number, y: number): void {
        this.puntoSujecion.seguirMouse(x, y);
        bola.getEstadoBola().sujetar();
    }

    public soltarBola(bola: Calculos): void {
        this.puntoSujecion.fijarPosicionMundo();
        bola.getEstadoBola().soltar();
    }
}
