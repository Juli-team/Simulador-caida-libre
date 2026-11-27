import { IDibujable } from './interfaces';
import { PuntoSujecion } from './puntoSujecion';
import { Calculos } from '../física/calculos';

/**
 * Clase Mano
 * Responsabilidad única (SRP):
 * Cargar y dibujar el sprite de la mano (`mano.png`).
 * - Se ubica en el límite visible superior de la pantalla extendiéndose hacia abajo.
 * - Sigue los movimientos de la bola únicamente en el eje X, manteniéndose a una altura fija
 *   en pantalla en el eje Y sin tocar la bola mientras esta se mueve libremente con el cursor.
 * - Al soltarse la bola (dejar caer con Espacio), permanece visible durante 5 segundos
 *   con un desvanecimiento suave antes de dejar de dibujarse.
 */
export class Mano implements IDibujable {
    private imagen: HTMLImageElement;
    private imagenCargada: boolean = false;

    // Duración de visibilidad tras soltar la bola (en segundos)
    private readonly duracionDesvanecimiento: number = 5.0;
    private tiempoRestanteSoltado: number = 0;
    private estadoPrevioSujeto: boolean = false;

    // Coordenadas del punto de sujeción (dedos) dentro de la imagen original (415 x 483)
    private readonly ANCHO_ORIGINAL: number = 415;
    private readonly ALTO_ORIGINAL: number = 483;
    private readonly DEDOS_ORIGINAL_X: number = 176.5;
    private readonly DEDOS_ORIGINAL_Y: number = 415;

    // Última posición conocida del agarre
    private ultimoX: number = 512;
    private ultimoY: number = 160;
    private ultimaEscala: number = 1;

    // Altura relativa fija de la mano respecto a la pantalla visible (eje Y bloqueado en pantalla)
    private readonly Y_PANTALLA_RELATIVO: number = 0.3;

    constructor(rutaImagen: string = new URL('../../assets/mano.webp', import.meta.url).href) {
        this.imagen = new Image();
        this.imagen.src = rutaImagen;
        this.imagen.onload = () => {
            this.imagenCargada = true;
        };
    }

    /**
     * Actualiza la posición y temporizador de visibilidad de la mano.
     * Sigue a la bola únicamente en el eje X según la posición del cursor / punto de sujeción.
     * El eje Y de la mano permanece bloqueado a una altura fija en la pantalla visible,
     * sin tocar ni forzar la posición vertical de la bola para permitir el movimiento libre del cursor.
     *
     * @param dt Delta time en segundos
     * @param calculos Instancia actual de Calculos (o null)
     * @param puntoSujecion Instancia del punto de sujeción
     * @param camaraY Posición vertical actual de la cámara en el mapa (opcional)
     * @param altoPantalla Altura del canvas / pantalla visible (opcional)
     */
    public actualizar(
        dt: number,
        calculos: Calculos | null,
        puntoSujecion: PuntoSujecion,
        _camaraY?: number,
        altoPantalla?: number
    ): void {
        const pos = puntoSujecion.getPosicionSujecion();
        this.ultimoX = pos.x;

        const escala = puntoSujecion.getEscala();
        this.ultimaEscala = escala;

        // Si se provee la altura de la pantalla, bloqueamos Y de la mano en la pantalla visible
        // en una posición fija (ej. 30% del alto visible). Si no, se calcula según la escala.
        const yFijoPantalla = altoPantalla !== undefined
            ? altoPantalla * this.Y_PANTALLA_RELATIVO
            : 160 * escala;

        this.ultimoY = yFijoPantalla;

        const esSujeto = calculos !== null && calculos.getEstadoBola().esSujeto();

        // Detección del momento en que se suelta la bola
        if (this.estadoPrevioSujeto && !esSujeto) {
            this.tiempoRestanteSoltado = this.duracionDesvanecimiento;
        }

        if (!esSujeto && this.tiempoRestanteSoltado > 0) {
            this.tiempoRestanteSoltado = Math.max(0, this.tiempoRestanteSoltado - dt);
        }

        this.estadoPrevioSujeto = esSujeto;
    }

    /**
     * Dibuja la mano en pantalla si corresponde.
     */
    public dibujar(ctx: CanvasRenderingContext2D, calculos: Calculos | null): void {
        if (!this.imagenCargada) return;

        const opacidad = this.calcularOpacidad(calculos);
        if (opacidad <= 0) return;

        const escalaVisual = this.ultimaEscala * 0.75;
        const anchoDibujo = this.ANCHO_ORIGINAL * escalaVisual;
        const altoDibujo = this.ALTO_ORIGINAL * escalaVisual;
        const xDedosDibujo = this.DEDOS_ORIGINAL_X * escalaVisual;
        const yDedosDibujo = this.DEDOS_ORIGINAL_Y * escalaVisual;
        const posX = this.ultimoX - xDedosDibujo;
        const posY = this.ultimoY - yDedosDibujo;

        ctx.save();
        ctx.globalAlpha = opacidad;
        this.dibujarExtensionBrazo(ctx, posX, posY, escalaVisual);
        ctx.drawImage(
            this.imagen,
            0, 0, this.ANCHO_ORIGINAL, this.ALTO_ORIGINAL,
            posX, posY, anchoDibujo, altoDibujo
        );
        ctx.restore();
    }

    private calcularOpacidad(calculos: Calculos | null): number {
        const esSujeto = calculos !== null && calculos.getEstadoBola().esSujeto();
        if (esSujeto) return 1;
        if (this.tiempoRestanteSoltado > 0) {
            return this.tiempoRestanteSoltado / this.duracionDesvanecimiento;
        }
        return 0;
    }

    private dibujarExtensionBrazo(
        ctx: CanvasRenderingContext2D,
        posX: number,
        posY: number,
        escalaVisual: number
    ): void {
        if (posY <= 0) return;

        // Recortar la parte superior de la manga/brazo y extenderla verticalmente hasta y = 0
        const anchoMangaOriginal = 100;
        const xMangaOriginal = 138;
        const altoMangaOriginal = 20;
        const anchoManga = anchoMangaOriginal * escalaVisual;
        const xManga = posX + (xMangaOriginal * escalaVisual);

        ctx.drawImage(
            this.imagen,
            xMangaOriginal, 0, anchoMangaOriginal, altoMangaOriginal,
            xManga, 0, anchoManga, posY + 2
        );
    }
}
