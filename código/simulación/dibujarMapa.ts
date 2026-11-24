import { Mapa } from './mapa';

/**
 * Mapeo de rutas de imágenes resueltas para Vite / navegador.
 * Las imágenes van desde cielo1.webp (base/suelo) hasta cielo30.webp (cúspide/espacio).
 */
const URLS_IMAGENES: string[] = Array.from({ length: 30 }, (_, i) => {
    return new URL(`../../assets/imagenes del cielo/cielo${i + 1}.webp`, import.meta.url).href;
});

/**
 * Clase DibujarMapa
 * Responsabilidad única (SRP):
 * Carga progresiva, precarga predictiva asíncrona (fuera del hilo principal)
 * y renderizado eficiente con recorte fuente del fondo de 30 imágenes
 * de 10.000 píxeles de alto cada una (300.000 píxeles en total).
 *
 * Optimizaciones de rendimiento:
 * 1. Decodificación asíncrona (img.decode): elimina por completo los congelamientos de 50-150ms en el main thread.
 * 2. Precarga predictiva y adaptativa: detecta dirección de la cámara (W/S) y caída libre hacia abajo.
 * 3. Ventana deslizante de caché con desalojo amortiguado: evita recargas y decodificaciones repetitivas de texturas.
 * 4. Recorte de fuente (Source Clipping) en drawImage: renderiza exclusivamente la franja visible en el canvas.
 * 5. Fondo degradado atmosférico de respaldo: previene huecos negros si se salta de golpe a una altitud distante.
 */
export class DibujarMapa {
    public static readonly ALTO_IMAGEN: number = 10000;
    public static readonly TOTAL_IMAGENES: number = 30;
    public static readonly CAPACIDAD_MAXIMA_CACHE: number = 6;

    private readonly cacheImagenes: Map<number, HTMLImageElement> = new Map();
    private readonly imagenesCargando: Set<number> = new Set();
    private ultimaCamaraY: number = -1;

    constructor() {
        // Precargar las imágenes iniciales alrededor de la base (índice 0 y 1)
        this.cargarImagen(0);
        this.cargarImagen(1);
    }

    /**
     * Carga y decodifica de forma asíncrona una imagen por su índice (0 a 29).
     * Utiliza img.decode() para que la descompresión ocurra en un hilo de trabajo
     * del navegador y nunca bloquee el hilo principal de renderizado.
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
        img.decoding = 'async';
        img.src = URLS_IMAGENES[indice];

        const procesarImagen = async () => {
            try {
                if ('decode' in img) {
                    await img.decode();
                }
            } catch {
                // Si la decodificación es interrumpida o falla, se continúa si la imagen está cargada
            }

            if (img.naturalWidth > 0) {
                this.cacheImagenes.set(indice, img);
            }
            this.imagenesCargando.delete(indice);
        };

        img.onload = () => {
            void procesarImagen();
        };

        img.onerror = () => {
            this.imagenesCargando.delete(indice);
            console.error(`Error al cargar la imagen de cielo índice ${indice + 1}`);
        };
    }

    /**
     * Precarga preventiva alrededor de una posición de cámara determinada.
     * Útil al cambiar la altura desde el menú o al iniciar navegación.
     */
    public precargarCercaDe(camaraY: number, altoTotal: number): void {
        const indiceCentro = this.calcularIndice(camaraY, altoTotal);
        for (let offset = -2; offset <= 2; offset++) {
            this.cargarImagen(indiceCentro + offset);
        }
    }

    /**
     * Notificación de caída libre: anticipa el descenso veloz hacia el suelo
     * precargando las baldosas inferiores hacia el índice 0.
     */
    public notificarCaidaLibre(camaraY: number, altoTotal: number): void {
        const indiceActual = this.calcularIndice(camaraY, altoTotal);
        // Precargar activamente hacia abajo hasta 4 baldosas por delante
        for (let i = 1; i <= 4; i++) {
            this.cargarImagen(indiceActual - i);
        }
    }

    /**
     * Dibuja las imágenes visibles del mapa, gestiona la carga/precarga predictiva
     * y libera las imágenes que quedan demasiado lejos de la ventana activa.
     */
    public dibujar(ctx: CanvasRenderingContext2D, mapa: Mapa): void {
        const camaraY = mapa.getCamaraY();
        const altoTotal = mapa.getAltoTotal();
        const ancho = mapa.getAncho();
        const altoVisible = mapa.getAltoVisible();

        const yTopVisible = camaraY;
        const yBottomVisible = camaraY + altoVisible;

        // Determinar velocidad y dirección vertical de la cámara
        const deltaY = this.ultimaCamaraY >= 0 ? camaraY - this.ultimaCamaraY : 0;
        this.ultimaCamaraY = camaraY;

        // Calcular el rango de índices que intersectan la ventana visible
        const indiceMinimo = Math.max(
            0,
            Math.floor((altoTotal - yBottomVisible) / DibujarMapa.ALTO_IMAGEN)
        );
        const indiceMaximo = Math.min(
            DibujarMapa.TOTAL_IMAGENES - 1,
            Math.floor((altoTotal - yTopVisible) / DibujarMapa.ALTO_IMAGEN)
        );

        // Conjunto de índices que deben permanecer protegidos en memoria este fotograma
        const indicesRequeridos = new Set<number>();

        // 1. Renderizar e indicar baldosas visibles con recorte fuente (source clipping)
        for (let i = indiceMinimo; i <= indiceMaximo; i++) {
            indicesRequeridos.add(i);
            this.cargarImagen(i);

            const yFin = altoTotal - i * DibujarMapa.ALTO_IMAGEN;
            const yInicio = yFin - DibujarMapa.ALTO_IMAGEN;

            // Intersección exacta entre la baldosa y el viewport de la cámara
            const yVisibleTop = Math.max(yInicio, yTopVisible);
            const yVisibleBottom = Math.min(yFin, yBottomVisible);

            if (yVisibleBottom > yVisibleTop) {
                const altoDestino = yVisibleBottom - yVisibleTop;
                const dy = yVisibleTop - yTopVisible;
                const img = this.cacheImagenes.get(i);

                if (img && img.complete && img.naturalWidth > 0) {
                    const factorEscalaY = img.naturalHeight / DibujarMapa.ALTO_IMAGEN;
                    const sy = (yVisibleTop - yInicio) * factorEscalaY;
                    const sh = altoDestino * factorEscalaY;

                    ctx.drawImage(
                        img,
                        0, sy, img.naturalWidth, sh,
                        0, dy, ancho, altoDestino
                    );
                } else {
                    // Respaldo de degradado atmosférico suave mientras finaliza la decodificación
                    this.dibujarFondoRespaldo(ctx, yVisibleTop, dy, ancho, altoDestino, altoTotal);
                }
            }
        }

        // 2. Precarga predictiva según la dirección y velocidad del movimiento
        this.gestionarPrecargaPredictiva(indicesRequeridos, indiceMinimo, indiceMaximo, deltaY);

        // 3. Gestión de caché con desalojo amortiguado (evita thrashing continuo)
        this.gestionarCache(indicesRequeridos, (indiceMinimo + indiceMaximo) / 2);
    }

    /**
     * Calcula el índice de baldosa correspondiente a una posición Y en el mundo.
     */
    private calcularIndice(yMundo: number, altoTotal: number): number {
        return Math.max(
            0,
            Math.min(
                DibujarMapa.TOTAL_IMAGENES - 1,
                Math.floor((altoTotal - 1 - yMundo) / DibujarMapa.ALTO_IMAGEN)
            )
        );
    }

    /**
     * Precarga baldosas anticipadamente en la dirección del movimiento.
     */
    private gestionarPrecargaPredictiva(
        indicesRequeridos: Set<number>,
        minIdx: number,
        maxIdx: number,
        deltaY: number
    ): void {
        // En caída o descenso rápido (deltaY > 5): el índice disminuye hacia el suelo
        if (deltaY > 5) {
            for (let offset = 1; offset <= 3; offset++) {
                const idx = minIdx - offset;
                if (idx >= 0) {
                    indicesRequeridos.add(idx);
                    this.cargarImagen(idx);
                }
            }
            if (maxIdx + 1 < DibujarMapa.TOTAL_IMAGENES) {
                indicesRequeridos.add(maxIdx + 1);
            }
        }
        // En ascenso (deltaY < -5): el índice aumenta hacia el espacio
        else if (deltaY < -5) {
            for (let offset = 1; offset <= 3; offset++) {
                const idx = maxIdx + offset;
                if (idx < DibujarMapa.TOTAL_IMAGENES) {
                    indicesRequeridos.add(idx);
                    this.cargarImagen(idx);
                }
            }
            if (minIdx - 1 >= 0) {
                indicesRequeridos.add(minIdx - 1);
            }
        }
        // Movimiento lento o reposo: búfer bidireccional estándar de ±2 baldosas
        else {
            for (let offset = -2; offset <= 2; offset++) {
                const idx = Math.floor((minIdx + maxIdx) / 2) + offset;
                if (idx >= 0 && idx < DibujarMapa.TOTAL_IMAGENES) {
                    indicesRequeridos.add(idx);
                    this.cargarImagen(idx);
                }
            }
        }
    }

    /**
     * Mantiene el tamaño de la caché bajo control desalojando las baldosas más distantes
     * solo cuando se supera la capacidad máxima estipulada.
     */
    private gestionarCache(indicesProtegidos: Set<number>, indiceCentro: number): void {
        if (this.cacheImagenes.size <= DibujarMapa.CAPACIDAD_MAXIMA_CACHE) {
            return;
        }

        // Ordenar candidatos por distancia descendente respecto al centro de la cámara
        const candidatos = Array.from(this.cacheImagenes.keys())
            .filter((idx) => !indicesProtegidos.has(idx))
            .sort((a, b) => Math.abs(b - indiceCentro) - Math.abs(a - indiceCentro));

        for (const idx of candidatos) {
            if (this.cacheImagenes.size <= DibujarMapa.CAPACIDAD_MAXIMA_CACHE) {
                break;
            }
            // Solo desalojar si está a más de 2 baldosas de distancia
            if (Math.abs(idx - indiceCentro) > 2) {
                const img = this.cacheImagenes.get(idx);
                if (img) {
                    img.onload = null;
                    img.onerror = null;
                }
                this.cacheImagenes.delete(idx);
            }
        }
    }

    /**
     * Dibuja un degradado atmosférico coherente con la altitud real en caso de que una baldosa
     * aún se encuentre en proceso de decodificación.
     */
    private dibujarFondoRespaldo(
        ctx: CanvasRenderingContext2D,
        yVisibleTop: number,
        dy: number,
        ancho: number,
        altoDestino: number,
        altoTotal: number
    ): void {
        // Fracción de altitud: 0.0 (suelo) a 1.0 (espacio)
        const fraccionAltitud = Math.max(0, Math.min(1, 1 - (yVisibleTop / altoTotal)));

        const gradient = ctx.createLinearGradient(0, dy, 0, dy + altoDestino);
        if (fraccionAltitud < 0.25) {
            // Atmósfera baja (troposfera): azul cielo brillante a celeste
            gradient.addColorStop(0, '#38bdf8');
            gradient.addColorStop(1, '#7dd3fc');
        } else if (fraccionAltitud < 0.6) {
            // Atmósfera media (estratosfera): azul profundo a azul marino
            gradient.addColorStop(0, '#1e3a8a');
            gradient.addColorStop(1, '#0284c7');
        } else if (fraccionAltitud < 0.85) {
            // Atmósfera alta (mesosfera/termosfera): azul índigo a púrpura oscuro
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#1e1b4b');
        } else {
            // Espacio exterior / cúspide: negro estrellado profundo
            gradient.addColorStop(0, '#020617');
            gradient.addColorStop(1, '#0b0f19');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, dy, ancho, altoDestino);
    }
}
