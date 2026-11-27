/**
 * Constantes físicas y de renderizado para el Simulador de Caída Libre.
 * Todas las constantes del simulador se definen una sola vez aquí (DRY / Single Source of Truth).
 */

import type { IConstantes, IOpcionGravedad } from '../simulación/interfaces';

export type { IOpcionGravedad } from '../simulación/interfaces';

/**
 * Escala del simulador: cantidad de píxeles en pantalla que representan 1 metro en el mundo físico.
 */
export const PIXELES_POR_METRO: number = 250;

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

/**
 * Clase Constantes
 * Gestiona y centraliza las constantes dinámicas y gravedades planetarias del simulador.
 */
export class Constantes implements IConstantes {
    private readonly gravedades: Record<string, number> = {
        Tierra: 9.8,
        Luna: 1.62,
        Marte: 3.71,
        Venus: 8.87,
        Jupiter: 24.79,
        Sol: 274.0
    };

    private gravedadActual: number;

    constructor(gravedadInicial: number = GRAVEDAD_DEFECTO) {
        this.gravedadActual = Math.max(0, gravedadInicial);
    }

    public getGravedad(): number {
        return this.gravedadActual;
    }

    public setGravedad(g: number): void {
        this.gravedadActual = Math.max(0, g);
    }

    public getGravedadesDisponibles(): IOpcionGravedad[] {
        return Object.entries(this.gravedades).map(([nombre, valor]) => ({ nombre, valor }));
    }
}

export { Constantes as constantes };


