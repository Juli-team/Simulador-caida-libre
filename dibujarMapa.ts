import { Mapa } from './mapa';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Mapeo de rutas de imágenes resueltas para Vite / navegador.
 * Las imágenes van desde cielo1.jpg (base/suelo) hasta cielo30.jpg (cúspide/espacio).
 */
const URLS_IMAGENES: string[] = Array.from({ length: 30 }, (_, i) => {
    return new URL(`./imagenes del cielo/cielo${i + 1}.jpg`, import.meta.url).href;
});

/**
 * Clase DibujarMapa
 * Responsabilidad única (SRP):
 * Carga progresiva y bajo demanda (lazy/preload) del fondo compuesto por 30 imágenes
 * de 10.000 píxeles de alto cada una (300.000 píxeles en total), además de renderizar
 * las marcas de referencia métricas según la cámara y escala actuales.
 *
 * Pre-carga y Gestión de Memoria:
 * - Cuando el usuario está a 500 px o menos del final (tope) de la imagen actual mientras sube,
 *   se precarga anticipadamente la imagen siguiente.
 * - Ventana activa: se liberan de memoria (RAM/VRAM) las imágenes que quedan fuera del rango
 *   inmediato de la cámara, evitando el consumo excesivo de memoria acumulada.
 */
export class DibujarMapa {
    public static readonly ALTO_IMAGEN: number = 10000;
    public static readonly TOTAL_IMAGENES: number = 30;
    public static readonly DISTANCIA_PRECARGA: number = 3000;

    private readonly cacheImagenes: Map<number, HTMLImageElement> = new Map();
    private readonly imagenesCargando: Set<number> = new Set();

    constructor() {
        // Precargar la primera imagen (base del mapa: cielo1.jpg)
        this.cargarImagen(0);
    }

    /**
     * Carga de forma asíncrona una imagen por su índice (0 a 29).
     */
    public cargarImagen(indice: number): void {
        if (indice < 0 || indice >= DibujarMapa.TOTAL_IMAGENES) {
            return;
        }

        if (this.cacheImagenes.has(indice) || this.imagenesCargando.has(indice)) {
            return;
        }

        this.imagenesCargando.add(indice);
        const img = new Image();
        img.src = URLS_IMAGENES[indice];
        img.onload = () => {
            this.cacheImagenes.set(indice, img);
            this.imagenesCargando.delete(indice);
        };
        img.onerror = () => {
            this.imagenesCargando.delete(indice);
            console.error(`Error al cargar la imagen de cielo índice ${indice + 1}`);
        };
    }

    /**
     * Dibuja las imágenes visibles del mapa, gestiona la carga/precarga
     * y libera las imágenes que quedan atrás para proteger la memoria RAM/GPU.
     */
    public dibujar(ctx: CanvasRenderingContext2D, mapa: Mapa): void {
        const camaraY = mapa.getCamaraY();
        const altoTotal = mapa.getAltoTotal();
        const ancho = mapa.getAncho();
        const altoVisible = mapa.getAltoVisible();

        const yTopVisible = camaraY;
        const yBottomVisible = camaraY + altoVisible;

        // Conjunto de índices que deben permanecer en memoria durante este fotograma
        const indicesRequeridos = new Set<number>();

        for (let i = 0; i < DibujarMapa.TOTAL_IMAGENES; i++) {
            const yFin = altoTotal - i * DibujarMapa.ALTO_IMAGEN;
            const yInicio = yFin - DibujarMapa.ALTO_IMAGEN;

            // Verificar si esta imagen intersecta con la ventana visible
            if (yBottomVisible >= yInicio && yTopVisible <= yFin) {
                indicesRequeridos.add(i);
                this.cargarImagen(i);

                const img = this.cacheImagenes.get(i);
                const yPantalla = yInicio - camaraY;

                if (img && img.complete && img.naturalWidth > 0) {
                    ctx.drawImage(img, 0, yPantalla, ancho, DibujarMapa.ALTO_IMAGEN);
                } else {
                    // Respaldo visual mientras termina la carga
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, yPantalla, ancho, DibujarMapa.ALTO_IMAGEN);
                }

                // Si la cámara está a 500 px o menos del final (tope) de la imagen actual al subir
                if (camaraY <= yInicio + DibujarMapa.DISTANCIA_PRECARGA) {
                    const indiceSiguiente = i + 1;
                    if (indiceSiguiente < DibujarMapa.TOTAL_IMAGENES) {
                        indicesRequeridos.add(indiceSiguiente);
                        this.cargarImagen(indiceSiguiente);
                    }
                }

                // También conservamos en la ventana activa la imagen adyacente anterior inmediata (hacia abajo)
                // por si el usuario desciende rápidamente
                if (i > 0) {
                    indicesRequeridos.add(i - 1);
                }
            }
        }

        // Liberar de la memoria RAM/VRAM las imágenes que quedaron atrás
        this.liberarImagenesFueraDeRango(indicesRequeridos);

        // Dibujar marcas de referencia métricas sobre el fondo
        this.dibujarLineasReferencia(ctx, mapa);
    }

    /**
     * Desaloja de la memoria interna aquellas imágenes que ya no forman parte de la ventana activa.
     */
    private liberarImagenesFueraDeRango(indicesRequeridos: Set<number>): void {
        for (const [indice, img] of this.cacheImagenes.entries()) {
            if (!indicesRequeridos.has(indice)) {
                img.onload = null;
                img.onerror = null;
                img.src = ''; // Limpia el buffer de decodificación en navegadores
                this.cacheImagenes.delete(indice);
            }
        }
    }

    private dibujarLineasReferencia(ctx: CanvasRenderingContext2D, mapa: Mapa): void {
        const ancho = mapa.getAncho();
        const altoVisible = mapa.getAltoVisible();
        const camaraY = mapa.getCamaraY();
        const altoTotal = mapa.getAltoTotal();

        const escala = Math.min(ancho / 1024, altoVisible / 768);
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
        ctx.lineWidth = Math.max(1, Math.round(1 * escala));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.font = `${Math.max(10, Math.round(12 * escala))}px monospace`;

        // Paso métrico: marcas cada 2 metros
        const pasoMetros = 2;
        const paso = Math.max(50, pasoMetros * PIXELES_POR_METRO);
        for (let yMundo = 0; yMundo <= altoTotal; yMundo += paso) {
            const yPantalla = yMundo - camaraY;
            if (yPantalla >= -20 && yPantalla <= altoVisible + 20) {
                ctx.beginPath();
                ctx.moveTo(20 * escala, yPantalla);
                ctx.lineTo(ancho - 20 * escala, yPantalla);
                ctx.stroke();

                // Altura medida desde el suelo
                const alturaDesdeBasePx = altoTotal - yMundo;
                const alturaMetros = alturaDesdeBasePx / PIXELES_POR_METRO;
                const textoMetros = alturaMetros % 1 === 0 ? `${alturaMetros}` : alturaMetros.toFixed(1);
                ctx.fillText(`${textoMetros} m (${alturaDesdeBasePx} px)`, 30 * escala, yPantalla - 6 * escala);
            }
        }
        ctx.restore();
    }
}
