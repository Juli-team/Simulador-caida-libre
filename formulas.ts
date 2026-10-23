import { IFormulas } from './interfaces';
import { GRAVEDAD_DEFECTO, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA } from './constantes';

export type { IFormulas };

/**
 * Clase Formulas
 * Responsabilidad única (SRP): Implementar puramente las ecuaciones físicas y matemáticas
 * de la caída libre y la aerodinámica (área, densidad atmosférica, arrastre, aceleración y velocidad).
 * Es la fuente única de la verdad matemática del simulador.
 */
export class Formulas implements IFormulas {
    /**
     * Fórmula: A = π · r²
     * Área de la sección transversal del objeto.
     * @param radio Radio del objeto en metros (r)
     */
    public calcularArea(radio: number): number {
        if (radio <= 0) return 0;
        return Math.PI * radio * radio;
    }

    /**
     * Fórmula: d(y) = d0 · e^(-y / H)
     * Densidad del aire en función de la altura del objeto respecto al nivel del suelo / mar.
     * @param altura Altura del objeto en metros (y)
     */
    public calcularDensidadAire(altura: number): number {
        const ySegura = Math.max(0, altura);
        return DENSIDAD_AIRE_NIVEL_MAR * Math.exp(-ySegura / ESCALA_ALTURA_ATMOSFERICA);
    }

    /**
     * Fórmula: Fd = 0.5 · d(y) · (v²) · Cd · A
     * Fuerza de resistencia o arrastre aerodinámico.
     * @param densidad Densidad del aire en kg/m³ [d(y)]
     * @param velocidad Velocidad actual del objeto en m/s (v)
     * @param cd Coeficiente de arrastre aerodinámico (Cd)
     * @param area Área de la sección transversal en m² (A)
     */
    public calcularFuerzaArrastre(
        densidad: number,
        velocidad: number,
        cd: number,
        area: number
    ): number {
        if (densidad <= 0 || area <= 0 || cd <= 0) return 0;
        return 0.5 * densidad * (velocidad * velocidad) * cd * area;
    }

    /**
     * Fórmula: a = g - (Fd / m)
     * Aceleración neta resultante en cada frame.
     * @param fuerzaArrastre Fuerza de arrastre en Newtons (Fd)
     * @param masa Masa del objeto en kg (m)
     * @param gravedad Aceleración de la gravedad estándar (g = 9.8 m/s²)
     */
    public calcularAceleracionNeta(
        fuerzaArrastre: number,
        masa: number,
        gravedad: number = GRAVEDAD_DEFECTO
    ): number {
        if (masa <= 0) return gravedad;
        return gravedad - (fuerzaArrastre / masa);
    }

    /**
     * Ecuación de velocidad con aceleración neta:
     * v(t + dt) = v(t) + a · dt
     * Cambia la gravedad constante g por la aceleración neta a que se actualiza a cada frame.
     * @param velocidadActual Velocidad previa en m/s
     * @param aceleracion Aceleración neta calculada en el frame actual en m/s² (a)
     * @param dt Variación de tiempo en segundos (dt)
     */
    public calcularVelocidad(
        velocidadActual: number,
        aceleracion: number,
        dt: number
    ): number {
        return Math.max(0, velocidadActual + (aceleracion * dt));
    }

    /**
     * Fórmula teórica básica sin rozamiento: t = √(2 · h0 / g)
     * @param h0 Altura inicial en metros
     * @param gravedad Gravedad en m/s²
     */
    public calcularTiempo(h0: number, gravedad: number = GRAVEDAD_DEFECTO): number {
        const mitadG = 0.5 * gravedad;
        if (mitadG <= 0 || h0 <= 0) {
            return 0;
        }
        return Math.sqrt(h0 / mitadG);
    }
}
