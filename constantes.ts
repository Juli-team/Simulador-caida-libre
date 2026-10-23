/**
 * Constantes físicas y de renderizado para el Simulador de Caída Libre.
 * Todas las constantes del simulador se definen una sola vez aquí (DRY / Single Source of Truth).
 */

/**
 * Escala del simulador: cantidad de píxeles en pantalla que representan 1 metro en el mundo físico.
 */
export const PIXELES_POR_METRO: number = 100;

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

