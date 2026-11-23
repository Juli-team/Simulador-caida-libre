/**
 * Constantes físicas y de renderizado para el Simulador de Caída Libre.
 * Todas las constantes del simulador se definen una sola vez aquí (DRY / Single Source of Truth).
 */

/**
 * Escala del simulador: cantidad de píxeles en pantalla que representan 1 metro en el mundo físico.
 */
export const PIXELES_POR_METRO: number = 500;

/**
 * Aceleración de la gravedad estándar en la superficie terrestre (m/s²).
 */
export const GRAVEDAD_DEFECTO: number = 9.8;

/**
 * Densidad del aire sobre el nivel del mar (d0 = 1.225 kg/m³).
 */
export const DENSIDAD_AIRE_NIVEL_MAR: number = 1.225;

/**
 * Escala de altura atmosférica (H = 8500 m).
 */
export const ESCALA_ALTURA_ATMOSFERICA: number = 8500;

export interface IOpcionGravedad {
    nombre: string;
    valor: number;
}

/**
 * Clase Constantes
 * Gestiona y centraliza las constantes dinámicas y gravedades planetarias del simulador.
 */
export class Constantes {
    public static readonly GRAVEDADES: Record<string, number> = {
        Tierra: 9.8,
        Luna: 1.62,
        Marte: 3.71,
        Venus: 8.87,
        Jupiter: 24.79,
        Sol: 274.0
    };

    private static gravedadActual: number = GRAVEDAD_DEFECTO;

    public static getGravedad(): number {
        return Constantes.gravedadActual;
    }

    public static setGravedad(g: number): void {
        Constantes.gravedadActual = Math.max(0, g);
    }

    public static getGravedadesDisponibles(): IOpcionGravedad[] {
        return [
            { nombre: 'Tierra', valor: 9.8 },
            { nombre: 'Luna', valor: 1.62 },
            { nombre: 'Marte', valor: 3.71 },
            { nombre: 'Venus', valor: 8.87 },
            { nombre: 'Jupiter', valor: 24.79 },
            { nombre: 'Sol', valor: 274.0 }
        ];
    }
}

export { Constantes as constantes };


