import { IFormulas, IPOC, IGravedad } from './interfaces';
import { Gravedad } from './gravedad';

export type { IFormulas };

/**
 * Clase Formulas
 * Responsabilidad única (SRP): Calcular las fórmulas físicas de caída libre
 * (tiempo de caída y velocidad final) e inyectar los resultados en el POC.
 * Cumple con DIP al depender de la abstracción IGravedad.
 */
export class Formulas implements IFormulas {
    private gravedad: IGravedad;

    constructor(gravedad: IGravedad = new Gravedad()) {
        this.gravedad = gravedad;
    }

    /**
     * Fórmula: t = √(h0 / (1/2·g)) = √(2·h0 / g)
     * Donde:
     * - h0: altura inicial en metros
     * - g: gravedad (constante = 9.8 m/s²)
     */
    public calcularTiempo(h0: number): number {
        const g = this.gravedad.getValor();
        const mitadG = 0.5 * g;

        if (mitadG <= 0 || h0 <= 0) {
            return 0;
        }

        return Math.sqrt(h0 / mitadG);
    }

    /**
     * Fórmula: v = v0 + g · t
     * Donde:
     * - v0: velocidad inicial (m/s)
     * - g: gravedad (constante = 9.8 m/s²)
     * - t: tiempo calculado (s)
     */
    public calcularVelocidad(v0: number, t: number): number {
        const g = this.gravedad.getValor();
        return v0 + (g * t);
    }

    /**
     * Resuelve las fórmulas usando los valores h0 y v0 provenientes de POC,
     * y guarda los valores resultantes de v y t dentro del mismo POC.
     */
    public resolver(poc: IPOC): void {
        const h0 = poc.getH0();
        const v0 = poc.getV0();

        const t = this.calcularTiempo(h0);
        const v = this.calcularVelocidad(v0, t);

        poc.setT(t);
        poc.setV(v);
    }
}
