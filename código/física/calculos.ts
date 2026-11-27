import {
    ICalculos,
    ICuerpoEspacial,
    IPOCFisico,
    IFormulas,
    IEstadoBolaCompleto
} from '../simulación/interfaces';
import { PIXELES_POR_METRO } from './constantes';
import { POC } from './poc';
import { EstadoBola } from '../simulación/estadoBola';

export class Calculos implements ICalculos, ICuerpoEspacial {
    private formulas: IFormulas;
    private poc: IPOCFisico;
    private estadoBola: IEstadoBolaCompleto;

    // Propiedades visuales y espaciales en coordenadas del canvas (píxeles)
    private xMundo: number = 0;
    private yMundo: number = 0;

    constructor(
        formulas: IFormulas,
        poc?: IPOCFisico,
        xMundo: number = 0,
        yMundo: number = 0,
        h0: number = 0,
        escala: number = 1,

    ) {
        this.formulas = formulas;
        this.xMundo = xMundo;
        this.yMundo = yMundo;
        this.estadoBola = new EstadoBola('sujeto');

        if (poc) {
            this.poc = poc;
            if (h0 > 0 && this.poc.getAltura() === 0) {
                this.poc.setAltura(h0);
            }
        } else {
            this.poc = new POC(h0, 0, Math.round(64 * escala));
        }
    }

    public getPOC(): IPOCFisico {
        return this.poc;
    }

    public setPOC(poc: IPOCFisico): void {
        this.poc = poc;
    }

    public getEstadoBola(): IEstadoBolaCompleto {
        return this.estadoBola;
    }

    public getRadio(): number {
        return this.poc.getRadio();
    }

    public setRadioVisual(radio: number): void {
        this.poc.setRadio(radio);
    }

    public getXMundo(): number {
        return this.xMundo;
    }

    public getYMundo(): number {
        return this.yMundo;
    }

    public setPosicion(x: number, y: number): void {
        this.xMundo = x;
        this.yMundo = y;
    }


    public resetearFisica(): void {
        this.poc.setTiempoCaida(0);
        this.poc.setVelocidad(0);
        this.poc.setAltura(0);
        this.poc.setAceleracion(0);
        this.poc.setFuerzaArrastre(0);
    }

    /**
     * Actualiza la cinemática de caída frame a frame trabajando directamente con los valores
     * y guardando los resultados en la clase POC.
     * @param dt Delta time en segundos
     * @param ySueloMundo Coordenada Y del suelo en píxeles
     */
    public actualizar(dt: number, ySueloMundo: number): void {
        if (!this.estadoBola.esCayendo()) return;

        const radio = this.poc.getRadio();
        const yDetencion = ySueloMundo - radio;
        const distanciaAlSueloPx = Math.max(0, yDetencion - this.yMundo);
        const altura = distanciaAlSueloPx / PIXELES_POR_METRO;
        this.poc.setAltura(altura);

        const velocidad = this.actualizarMagnitudesFisicas(altura, dt);
        this.yMundo += velocidad * PIXELES_POR_METRO * dt;
        this.resolverImpactoSuelo(yDetencion);
    }

    private actualizarMagnitudesFisicas(altura: number, dt: number): number {
        const radioMetros = this.poc.getRadio() / PIXELES_POR_METRO;
        const area = this.formulas.calcularArea(radioMetros);
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

        this.poc.setDensidadAire(densidadAire);
        this.poc.setFuerzaArrastre(fuerzaArrastre);
        this.poc.setAceleracion(aceleracionNeta);
        this.poc.setVelocidad(velocidad);
        this.poc.setTiempoCaida(tiempo);
        return velocidad;
    }

    private resolverImpactoSuelo(yDetencion: number): void {
        if (this.yMundo < yDetencion) return;

        this.yMundo = yDetencion;
        this.poc.setAltura(0);
        this.poc.setAceleracion(0);
        this.poc.setFuerzaArrastre(0);
        // Conservamos la velocidad alcanzada en this.poc (la velocidad previa al choque)
        this.estadoBola.detener();
    }
}
