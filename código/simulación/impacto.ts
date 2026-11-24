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

        // 1. Pantalla en negro total
        ctx.save();
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, anchoPantalla, altoPantalla);

        // 2. Dimensiones de la foto polaroid
        // Un cuadrado blanco con una proporción agradable (más borde abajo)
        const anchoPolaroid = Math.min(anchoPantalla * 0.45, 420);
        const margenLateral = anchoPolaroid * 0.07; // bordes más finos a los costados y arriba
        const margenSuperior = margenLateral;
        const margenInferior = anchoPolaroid * 0.22; // borde más grueso abajo para el texto

        const anchoFoto = anchoPolaroid - (margenLateral * 2);
        const altoFoto = anchoFoto; // Cuadrada para la imagen del objeto
        const altoPolaroid = margenSuperior + altoFoto + margenInferior;

        // Posición centrada
        const cx = anchoPantalla / 2;
        const cy = altoPantalla / 2;

        ctx.translate(cx, cy);
        // Leve inclinación hacia la derecha (aprox 4 a 5 grados)
        const anguloInclinacion = (4.5 * Math.PI) / 180;
        ctx.rotate(anguloInclinacion);

        // Cuadrado blanco de la foto impresa (sin sombras)
        const xPolaroid = -anchoPolaroid / 2;
        const yPolaroid = -altoPolaroid / 2;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(xPolaroid, yPolaroid, anchoPolaroid, altoPolaroid);

        // Dibujar en el centro del cuadro la captura de pantalla del último instante
        const xFoto = xPolaroid + margenLateral;
        const yFoto = yPolaroid + margenSuperior;

        if (this.canvasCaptura.width > 0 && this.canvasCaptura.height > 0) {
            // Hacemos un clip para encajar bien la captura en el recuadro fotográfico
            ctx.save();
            ctx.beginPath();
            ctx.rect(xFoto, yFoto, anchoFoto, altoFoto);
            ctx.clip();

            // Escalamos proporcionalmente la captura para que cubra el recuadro (estilo "cover")
            const escala = Math.max(anchoFoto / this.canvasCaptura.width, altoFoto / this.canvasCaptura.height);
            const wDibujo = this.canvasCaptura.width * escala;
            const hDibujo = this.canvasCaptura.height * escala;
            const ox = xFoto + (anchoFoto - wDibujo) / 2;
            const oy = yFoto + (altoFoto - hDibujo) / 2;

            ctx.drawImage(this.canvasCaptura, ox, oy, wDibujo, hDibujo);
            ctx.restore();

            // Fino contorno interior para delimitar la foto en el papel blanco
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.strokeRect(xFoto, yFoto, anchoFoto, altoFoto);
        }

        // Escribir la velocidad final del objeto: vfinal=x m/s
        const textoVelocidad = `vfinal=${this.velocidadFinal.toFixed(2)} m/s`;
        const tamanoFuente = Math.max(16, Math.round(anchoPolaroid * 0.075));
        ctx.font = `${tamanoFuente}px 'Internet Friends', sans-serif`;
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Un poquito más abajo del frame (en el espacio inferior más grueso)
        const yTexto = yFoto + altoFoto + (margenInferior / 2);
        ctx.fillText(textoVelocidad, 0, yTexto);

        ctx.restore();
    }
}
