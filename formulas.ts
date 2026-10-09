import { IFormulas } from './interfaces';
import { GRAVEDAD_DEFECTO } from './constantes';

export type { IFormulas };

/**
 * Clase Formulas
 * Responsabilidad única (SRP): Calcular las fórmulas físicas de caída libre
 * (tiempo de caída y velocidad final). Es la fuente única de la física del simulador.
 */
export class Formulas implements IFormulas {
    /**
     * Fórmula: t = √(h0 / (1/2·g)) = √(2·h0 / g)
     * Donde:
     * - h0: altura inicial en metros
     * - g: gravedad (constante = 9.8 m/s²)
     */
    public calcularTiempo(h0: number): number {
        const mitadG = 0.5 * GRAVEDAD_DEFECTO;

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
     * - t: tiempo transcurrido (s)
     */
    public calcularVelocidad(v0: number, t: number): number {
        return v0 + (GRAVEDAD_DEFECTO * t);
    }
}
