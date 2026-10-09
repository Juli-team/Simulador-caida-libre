/**
 * Constantes físicas y de renderizado para el Simulador de Caída Libre.
 */

/**
 * Escala del simulador: cantidad de píxeles en pantalla que representan 1 metro en el mundo físico.
 * Configurado a 100 px/m para lograr una caída ágil, realista y dinámica.
 */
export const PIXELES_POR_METRO: number = 100;

/**
 * Aceleración de la gravedad estándar por defecto en la superficie terrestre (m/s²).
 */
export const GRAVEDAD_DEFECTO: number = 9.8;

/**
 * Convierte una distancia en píxeles de pantalla a su equivalente físico en metros.
 */
export function pixelesAMetros(pixeles: number): number {
    return pixeles / PIXELES_POR_METRO;
}
