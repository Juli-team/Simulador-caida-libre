import { IPOC } from './interfaces';

export class Impacto {
    private activo: boolean = false;
    private audio: HTMLAudioElement;
    private canvasCaptura: HTMLCanvasElement;
    private ctxCaptura: CanvasRenderingContext2D;
    private velocidadFinal: number = 0;

    constructor() {
        // Cargar audio de flash de cámara
        const audioUrl = new URL('../../assets/kauasilbershlachparodes-camera-flash-494027.mp3', import.meta.url).href;
        this.audio = new Audio(audioUrl);

        // Crear canvas secundario en memoria para la captura optimizada del frame
        this.canvasCaptura = document.createElement('canvas');
        this.ctxCaptura = this.canvasCaptura.getContext('2d')!;

        // Cargar tipografía Internet Friends
        this.cargarFuente();
    }

    private cargarFuente(): void {
        const fontUrl = new URL('../../assets/Internet Friends.ttf', import.meta.url).href;
        const fontFace = new FontFace('Internet Friends', `url(${fontUrl})`);
        fontFace.load().then((loadedFace) => {
            (document.fonts as any).add(loadedFace);
        }).catch((err) => {
            console.warn('No se pudo cargar la fuente Internet Friends:', err);
        });
    }

    /**
     * Activa el impacto, congela la vista actual en memoria sin guardarla en disco,
     * reproduce el sonido y guarda la velocidad final.
     */
    public activar(canvasOrigen: HTMLCanvasElement, poc: IPOC): void {
        this.activo = true;
        this.velocidadFinal = poc.getVelocidad();

        // Captura en memoria: transferimos los píxeles del canvas actual al canvas interno
        this.canvasCaptura.width = canvasOrigen.width;
        this.canvasCaptura.height = canvasOrigen.height;
        this.ctxCaptura.clearRect(0, 0, canvasOrigen.width, canvasOrigen.height);
        this.ctxCaptura.drawImage(canvasOrigen, 0, 0);

        // Reproducir sonido
        this.audio.currentTime = 0;
        this.audio.play().catch((err) => {
            console.warn('Error al reproducir audio de impacto:', err);
        });
    }

    public desactivar(): void {
        this.activo = false;
    }

    public estaActivo(): boolean {
        return this.activo;
    }

    /**
     * Dibuja la pantalla negra y la foto física estilo polaroid en el centro.
     */
    public dibujar(ctx: CanvasRenderingContext2D, anchoPantalla: number, altoPantalla: number): void {
        if (!this.activo) return;
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, anchoPantalla, altoPantalla);
        const anchoPolaroid = Math.min(anchoPantalla * 0.45, 420);
        const margenLateral = anchoPolaroid * 0.07;
        const margenSuperior = margenLateral;
        const margenInferior = anchoPolaroid * 0.22;
        const anchoFoto = anchoPolaroid - (margenLateral * 2);
        const altoFoto = anchoFoto;
        const altoPolaroid = margenSuperior + altoFoto + margenInferior;
        ctx.translate(anchoPantalla / 2, altoPantalla / 2);
        ctx.rotate((4.5 * Math.PI) / 180);
        const xPolaroid = -anchoPolaroid / 2;
        const yPolaroid = -altoPolaroid / 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(xPolaroid, yPolaroid, anchoPolaroid, altoPolaroid);
        const xFoto = xPolaroid + margenLateral;
        const yFoto = yPolaroid + margenSuperior;
        this.dibujarFotoPolaroid(ctx, xFoto, yFoto, anchoFoto);
        this.dibujarEtiquetaVelocidad(ctx, anchoPolaroid, yFoto + altoFoto + margenInferior / 2);
        ctx.restore();
    }

    private dibujarFotoPolaroid(
        ctx: CanvasRenderingContext2D,
        xFoto: number,
        yFoto: number,
        ladoFoto: number
    ): void {
        if (this.canvasCaptura.width <= 0 || this.canvasCaptura.height <= 0) return;

        ctx.save();
        ctx.beginPath();
        ctx.rect(xFoto, yFoto, ladoFoto, ladoFoto);
        ctx.clip();

        const escala = Math.max(
            ladoFoto / this.canvasCaptura.width,
            ladoFoto / this.canvasCaptura.height
        );
        const wDibujo = this.canvasCaptura.width * escala;
        const hDibujo = this.canvasCaptura.height * escala;
        const ox = xFoto + (ladoFoto - wDibujo) / 2;
        const oy = yFoto + (ladoFoto - hDibujo) / 2;
        ctx.drawImage(this.canvasCaptura, ox, oy, wDibujo, hDibujo);
        ctx.restore();

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.strokeRect(xFoto, yFoto, ladoFoto, ladoFoto);
    }

    private dibujarEtiquetaVelocidad(
        ctx: CanvasRenderingContext2D,
        anchoPolaroid: number,
        yTexto: number
    ): void {
        const textoVelocidad = `vfinal=${this.velocidadFinal.toFixed(2)} m/s`;
        const tamanoFuente = Math.max(16, Math.round(anchoPolaroid * 0.075));
        ctx.font = `${tamanoFuente}px 'Internet Friends', sans-serif`;
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textoVelocidad, 0, yTexto);
    }
}
