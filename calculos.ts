import { ICalculos, IPOC, IFormulas, IEstadoBola } from './interfaces';
import { PIXELES_POR_METRO } from './constantes';
import { POC } from './poc';
import { EstadoBola } from './estadoBola';

export class Calculos implements ICalculos {
    private formulas: IFormulas;
    private poc: IPOC;
    private estadoBola: IEstadoBola;

    // Propiedades visuales y espaciales en coordenadas del canvas (píxeles)
    private radioVisual: number = 24;
    private xMundo: number = 0;
    private yMundo: number = 0;

    constructor(
        formulas: IFormulas,
        poc?: IPOC,
        xMundo: number = 0,
        yMundo: number = 0,
        h0: number = 0,
        escala: number = 1,

    ) {
        this.formulas = formulas;
        this.xMundo = xMundo;
        this.yMundo = yMundo;
        this.radioVisual = Math.max(16, Math.round(32 * escala));
        this.estadoBola = new EstadoBola('sujeto');

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

    public getEstadoBola(): IEstadoBola {
        return this.estadoBola;
    }

    public getRadio(): number {
        return this.radioVisual;
    }

    public setRadioVisual(radio: number): void {
        this.radioVisual = radio;
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
            this.estadoBola.detener();
        }
    }
}
