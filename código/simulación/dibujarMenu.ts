import { IDibujarMenu, IMenu, IValoresConfiguracion } from './interfaces';
import { Constantes, IOpcionGravedad } from '../física/constantes';
import { URLS_BOLAS } from './dibujarPOC';

const URL_CONFIG: string = new URL('../../assets/config.webp', import.meta.url).href;

type TipoInput = 'altura' | 'masa' | 'radio' | 'coeficiente' | null;

/**
 * Clase DibujarMenu
 * Responsabilidad única (SRP):
 * Renderizar en el canvas:
 * 1. El botón de configuración en la esquina inferior derecha (con config.webp).
 * 2. El menú de configuraciones: un rectángulo gris con poca opacidad y líneas naranjas,
 *    con títulos en naranja y valores centrados.
 * 3. Barra deslizante (scrollbar) para navegación vertical fluida.
 * 4. Gestionar la captura de tipeo y clics en casillas, miniaturas y botón de aplicación.
 */
export class DibujarMenu implements IDibujarMenu {
    private readonly COLOR_NARANJA: string = '#f97316';
    private readonly COLOR_FONDO_PANEL: string = 'rgba(213, 218, 228, 0.88)';
    private readonly COLOR_BORDE_INPUT: string = 'rgba(213, 218, 228, 0.88)';
    private readonly COLOR_INPUT_ACTIVO: string = '#f97316';

    // Imagen del botón de configuración
    private imgConfig: HTMLImageElement;
    private imgConfigCargada: boolean = false;

    // Miniaturas de las bolas disponibles
    private imagenesBolas: HTMLImageElement[] = [];
    private imagenesBolasCargadas: boolean[] = [];

    // Dimensiones y estado del botón de configuración
    private btnConfigX: number = 0;
    private btnConfigY: number = 0;
    private readonly btnConfigTam: number = 72;

    // Dimensiones del panel del menú
    private panelX: number = 0;
    private panelY: number = 0;
    private panelAncho: number = 520;
    private panelAlto: number = 600;

    // Scrollbar y desplazamiento
    private scrollY: number = 0;
    private maxScroll: number = 0;
    private alturaContenido: number = 540;
    private arrastrandoScrollbar: boolean = false;
    private dragStartY: number = 0;
    private dragStartScrollY: number = 0;
    private menuEstabaAbierto: boolean = false;

    // Estado de tipeo en inputs
    private inputActivo: TipoInput = null;
    private buffersTexto: Record<string, string> = {
        altura: '0',
        masa: '10',
        radio: '64',
        coeficiente: '0.47'
    };

    // Estado local sincronizado con el menú
    private valoresLocales: IValoresConfiguracion = {
        alturaInicial: 0,
        masa: 10,
        radio: 64,
        coeficienteArrastre: 0.47,
        gravedad: 9.8,
        cuerpoCeleste: 'Tierra',
        imagenSeleccionada: 1
    };

    // Zonas interactivas para clic
    private rectCerrar: { x: number; y: number; w: number; h: number } = { x: 0, y: 0, w: 0, h: 0 };
    private rectBotonAplicar: { x: number; y: number; w: number; h: number } = { x: 0, y: 0, w: 0, h: 0 };
    private rectScrollbarThumb: { x: number; y: number; w: number; h: number } = { x: 0, y: 0, w: 0, h: 0 };
    private rectInputs: Map<TipoInput, { x: number; y: number; w: number; h: number }> = new Map();
    private rectCasillasGravedad: Array<{ x: number; y: number; w: number; h: number; opcion: IOpcionGravedad }> = [];
    private rectMiniaturasBolas: Array<{ x: number; y: number; w: number; h: number; indice: number }> = [];

    constructor() {
        // Carga de config.webp
        this.imgConfig = new Image();
        this.imgConfig.src = URL_CONFIG;
        this.imgConfig.onload = () => {
            this.imgConfigCargada = true;
        };

        // Carga de miniaturas de bolas disponibles
        this.imagenesBolasCargadas = new Array(URLS_BOLAS.length).fill(false);
        URLS_BOLAS.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => {
                this.imagenesBolasCargadas[i] = true;
            };
            this.imagenesBolas.push(img);
        });
    }

    public tieneInputActivo(): boolean {
        return this.inputActivo !== null;
    }

    public estaSobreBotonConfig(x: number, y: number, anchoPantalla: number, altoPantalla: number): boolean {
        const btnX = anchoPantalla - this.btnConfigTam - 20;
        const btnY = altoPantalla - this.btnConfigTam - 20;
        return x >= btnX && x <= btnX + this.btnConfigTam && y >= btnY && y <= btnY + this.btnConfigTam;
    }

    public estaSobrePanel(x: number, y: number, anchoPantalla: number, altoPantalla: number): boolean {
        const ancho = Math.min(520, anchoPantalla - 30);
        const alto = Math.min(600, altoPantalla - 40);
        const px = (anchoPantalla - ancho) / 2;
        const py = (altoPantalla - alto) / 2;
        return x >= px && x <= px + ancho && y >= py && y <= py + alto;
    }

    public dibujar(ctx: CanvasRenderingContext2D, anchoPantalla: number, altoPantalla: number, menu: IMenu): void {
        const menuAbierto = menu.estaAbierto();
        this.dibujarBotonConfiguracion(ctx, anchoPantalla, altoPantalla, menuAbierto);

        if (!menuAbierto) {
            this.menuEstabaAbierto = false;
            this.inputActivo = null;
            return;
        }

        // Si el menú recién se abrió, sincronizar valores iniciales desde el menú
        if (!this.menuEstabaAbierto) {
            this.menuEstabaAbierto = true;
            this.sincronizarDesdeMenu(menu);
        }

        this.dibujarPanelMenu(ctx, anchoPantalla, altoPantalla, menu);
    }

    private sincronizarDesdeMenu(menu: IMenu): void {
        const v = menu.getValores();
        this.valoresLocales = { ...v };
        this.buffersTexto.altura = v.alturaInicial.toString();
        this.buffersTexto.masa = v.masa.toString();
        this.buffersTexto.radio = v.radio.toString();
        this.buffersTexto.coeficiente = v.coeficienteArrastre.toString();
    }

    private dibujarBotonConfiguracion(
        ctx: CanvasRenderingContext2D,
        anchoPantalla: number,
        altoPantalla: number,
        menuAbierto: boolean
    ): void {
        this.btnConfigX = anchoPantalla - this.btnConfigTam - 20;
        this.btnConfigY = altoPantalla - this.btnConfigTam - 20;

        ctx.save();

        // Si el menú está abierto, se puede dar un suave toque traslúcido opcional al estar activo o ninguno
        if (menuAbierto) {
            ctx.beginPath();
            ctx.arc(
                this.btnConfigX + this.btnConfigTam / 2,
                this.btnConfigY + this.btnConfigTam / 2,
                this.btnConfigTam / 2,
                0,
                Math.PI * 2
            );
            ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
            ctx.fill();
        }

        // Ícono config.webp sin fondo opaco ni bordes
        if (this.imgConfigCargada) {
            ctx.drawImage(
                this.imgConfig,
                this.btnConfigX,
                this.btnConfigY,
                this.btnConfigTam,
                this.btnConfigTam
            );
        } else {
            // Respaldo visual mientras carga
            ctx.fillStyle = this.COLOR_NARANJA;
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                '⚙',
                this.btnConfigX + this.btnConfigTam / 2,
                this.btnConfigY + this.btnConfigTam / 2
            );
        }

        ctx.restore();
    }

    private dibujarPanelMenu(
        ctx: CanvasRenderingContext2D,
        anchoPantalla: number,
        altoPantalla: number,
        menu: IMenu
    ): void {
        this.panelAncho = Math.min(520, anchoPantalla - 30);
        this.panelAlto = Math.min(600, altoPantalla - 40);
        this.panelX = Math.round((anchoPantalla - this.panelAncho) / 2);
        this.panelY = Math.round((altoPantalla - this.panelAlto) / 2);

        const limiteAlturaMapa = (menu as any).getLimiteAlturaMapa ? (menu as any).getLimiteAlturaMapa() : 2999.2;

        ctx.save();

        // 1. Rectángulo de color gris y poca opacidad con líneas naranjas
        ctx.fillStyle = this.COLOR_FONDO_PANEL;
        ctx.fillRect(this.panelX, this.panelY, this.panelAncho, this.panelAlto);

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.COLOR_NARANJA;
        ctx.strokeRect(this.panelX, this.panelY, this.panelAncho, this.panelAlto);

        // 2. Encabezado del menú
        ctx.fillStyle = this.COLOR_NARANJA;
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MENÚ DE CONFIGURACIÓN', this.panelX + this.panelAncho / 2, this.panelY + 24);

        // Botón de cerrar [✕]
        this.rectCerrar = {
            x: this.panelX + this.panelAncho - 36,
            y: this.panelY + 10,
            w: 26,
            h: 26
        };
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('✕', this.rectCerrar.x + 13, this.rectCerrar.y + 13);

        // Línea divisoria naranja
        ctx.beginPath();
        ctx.moveTo(this.panelX + 15, this.panelY + 46);
        ctx.lineTo(this.panelX + this.panelAncho - 15, this.panelY + 46);
        ctx.strokeStyle = this.COLOR_NARANJA;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 3. Viewport con scroll para el contenido
        const viewportY = this.panelY + 52;
        const viewportAlto = this.panelAlto - 110; // Espacio libre para el botón Aplicar
        const centroX = this.panelX + this.panelAncho / 2;

        this.alturaContenido = 540;
        this.maxScroll = Math.max(0, this.alturaContenido - viewportAlto);
        this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY));

        ctx.save();
        ctx.beginPath();
        ctx.rect(this.panelX + 2, viewportY, this.panelAncho - 4, viewportAlto);
        ctx.clip();

        let curY = viewportY + 15 - this.scrollY;
        this.rectInputs.clear();
        this.rectCasillasGravedad = [];
        this.rectMiniaturasBolas = [];

        // -------------------------------------------------------------
        // OPCIÓN 1: ALTURA INICIAL (poc - tipeo - en metros)
        // -------------------------------------------------------------
        this.dibujarTituloOpcion(ctx, '1. ALTURA INICIAL', centroX, curY);
        curY += 20;
        this.dibujarInput(
            ctx,
            'altura',
            this.buffersTexto.altura,
            'm',
            centroX - 100,
            curY,
            200,
            30
        );
        curY += 34;
        ctx.font = 'italic 11px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText(`(El mapa se ajusta al valor. Límite: ${limiteAlturaMapa} m)`, centroX, curY);
        curY += 24;

        // -------------------------------------------------------------
        // OPCIÓN 2: MASA (poc - tipeo)
        // -------------------------------------------------------------
        this.dibujarTituloOpcion(ctx, '2. MASA', centroX, curY);
        curY += 20;
        this.dibujarInput(
            ctx,
            'masa',
            this.buffersTexto.masa,
            'kg',
            centroX - 100,
            curY,
            200,
            30
        );
        curY += 46;

        // -------------------------------------------------------------
        // OPCIÓN 3: RADIO (poc - tipeo - máximo de 100)
        // -------------------------------------------------------------
        this.dibujarTituloOpcion(ctx, '3. RADIO', centroX, curY);
        curY += 20;
        this.dibujarInput(
            ctx,
            'radio',
            this.buffersTexto.radio,
            'px',
            centroX - 100,
            curY,
            200,
            30
        );
        curY += 34;
        ctx.font = 'italic 11px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('(Máximo permitido: 100 px)', centroX, curY);
        curY += 24;

        // -------------------------------------------------------------
        // OPCIÓN 4: COEFICIENTE DE ARRASTRE (poc - tipeo)
        // -------------------------------------------------------------
        this.dibujarTituloOpcion(ctx, '4. COEFICIENTE DE ARRASTRE', centroX, curY);
        curY += 20;
        this.dibujarInput(
            ctx,
            'coeficiente',
            this.buffersTexto.coeficiente,
            'Cd',
            centroX - 100,
            curY,
            200,
            30
        );
        curY += 46;

        // -------------------------------------------------------------
        // OPCIÓN 5: GRAVEDAD (constantes - selección de casilla)
        // -------------------------------------------------------------
        this.dibujarTituloOpcion(ctx, '5. GRAVEDAD', centroX, curY);
        curY += 22;
        curY = this.dibujarCasillasGravedad(ctx, centroX, curY);
        curY += 16;

        // -------------------------------------------------------------
        // OPCIÓN 6: IMAGEN QUE SE DIBUJA (dibujarpoc - miniaturas)
        // -------------------------------------------------------------
        this.dibujarTituloOpcion(ctx, '6. IMAGEN DE LA BOLA', centroX, curY);
        curY += 22;
        curY = this.dibujarMiniaturasBolas(ctx, centroX, curY);
        curY += 20;

        ctx.restore();

        // 4. Barra deslizante (Scrollbar)
        if (this.maxScroll > 0) {
            this.dibujarScrollbar(ctx, viewportY, viewportAlto);
        }

        // 5. Botón "Aplicar cambios y reiniciar" (fijo al pie del panel)
        this.dibujarBotonAplicar(ctx, centroX, this.panelY + this.panelAlto - 46);

        ctx.restore();
    }

    private dibujarTituloOpcion(ctx: CanvasRenderingContext2D, texto: string, x: number, y: number): void {
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = this.COLOR_NARANJA;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(texto, x, y);
    }

    private dibujarInput(
        ctx: CanvasRenderingContext2D,
        tipo: TipoInput,
        valor: string,
        unidad: string,
        x: number,
        y: number,
        w: number,
        h: number
    ): void {
        this.rectInputs.set(tipo, { x, y, w, h });
        const activo = this.inputActivo === tipo;

        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(x, y, w, h);

        ctx.strokeStyle = activo ? this.COLOR_INPUT_ACTIVO : this.COLOR_BORDE_INPUT;
        ctx.lineWidth = activo ? 2 : 1;
        ctx.strokeRect(x, y, w, h);

        // Texto centrado
        ctx.font = 'bold 15px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const cursor = activo && Math.floor(Date.now() / 400) % 2 === 0 ? '|' : '';
        const textoMostrar = `${valor}${cursor} ${unidad}`;
        ctx.fillText(textoMostrar, x + w / 2, y + h / 2);

        ctx.restore();
    }

    private dibujarCasillasGravedad(ctx: CanvasRenderingContext2D, centroX: number, startY: number): number {
        const gravedades = Constantes.getGravedadesDisponibles();
        const anchoCol = 145;
        const altoFila = 26;
        const numCols = 3;
        const totalW = numCols * anchoCol;
        const startX = centroX - totalW / 2;

        let maxY = startY;

        gravedades.forEach((op, index) => {
            const col = index % numCols;
            const fila = Math.floor(index / numCols);
            const x = startX + col * anchoCol;
            const y = startY + fila * altoFila;
            maxY = Math.max(maxY, y + altoFila);

            const casillaTam = 15;
            const seleccionada = Math.abs(this.valoresLocales.gravedad - op.valor) < 0.05 || this.valoresLocales.cuerpoCeleste === op.nombre;

            this.rectCasillasGravedad.push({
                x,
                y,
                w: anchoCol - 6,
                h: altoFila,
                opcion: op
            });

            // Dibujar casilla (cuadrado)
            ctx.save();
            ctx.strokeStyle = this.COLOR_NARANJA;
            ctx.lineWidth = 1.5;
            ctx.fillStyle = seleccionada ? 'rgba(249, 115, 22, 0.35)' : 'rgba(15, 23, 42, 0.7)';
            ctx.fillRect(x + 4, y + 5, casillaTam, casillaTam);
            ctx.strokeRect(x + 4, y + 5, casillaTam, casillaTam);

            if (seleccionada) {
                ctx.fillStyle = this.COLOR_NARANJA;
                ctx.fillRect(x + 7, y + 8, casillaTam - 6, casillaTam - 6);
            }

            // Etiqueta del cuerpo celeste y valor
            ctx.font = seleccionada ? 'bold 12px sans-serif' : '12px sans-serif';
            ctx.fillStyle = seleccionada ? '#f97316' : '#cbd5e1';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${op.nombre} (${op.valor})`, x + casillaTam + 9, y + 13);
            ctx.restore();
        });

        return maxY;
    }

    private dibujarMiniaturasBolas(ctx: CanvasRenderingContext2D, centroX: number, startY: number): number {
        const tam = 50;
        const gap = 16;
        const cantidadBolas = URLS_BOLAS.length;
        const totalW = cantidadBolas * tam + (cantidadBolas - 1) * gap;
        const startX = centroX - totalW / 2;

        for (let i = 0; i < cantidadBolas; i++) {
            const x = startX + i * (tam + gap);
            const y = startY;
            const indiceBola = i + 1;
            const seleccionada = this.valoresLocales.imagenSeleccionada === indiceBola;

            this.rectMiniaturasBolas.push({ x, y, w: tam, h: tam, indice: indiceBola });

            ctx.save();
            ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
            ctx.fillRect(x, y, tam, tam);

            const img = this.imagenesBolas[i];
            if (img && (img.complete || this.imagenesBolasCargadas[i]) && img.naturalWidth > 0) {
                ctx.drawImage(img, x + 3, y + 3, tam - 6, tam - 6);
            } else {
                ctx.font = '12px monospace';
                ctx.fillStyle = '#94a3b8';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`Bola ${indiceBola}`, x + tam / 2, y + tam / 2);
            }

            // Borde resaltado para la opción seleccionada
            if (seleccionada) {
                ctx.lineWidth = 3;
                ctx.strokeStyle = this.COLOR_NARANJA;
                ctx.shadowColor = this.COLOR_NARANJA;
                ctx.shadowBlur = 8;
                ctx.strokeRect(x, y, tam, tam);
                ctx.shadowBlur = 0;

                // Indicador visual de selección en esquina
                ctx.fillStyle = this.COLOR_NARANJA;
                ctx.fillRect(x + tam - 14, y, 14, 14);
                ctx.font = 'bold 10px monospace';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('✓', x + tam - 7, y + 7);
            } else {
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#475569';
                ctx.strokeRect(x, y, tam, tam);
            }

            ctx.restore();
        }

        return startY + tam;
    }

    private dibujarScrollbar(ctx: CanvasRenderingContext2D, viewportY: number, viewportAlto: number): void {
        const trackX = this.panelX + this.panelAncho - 12;
        const trackW = 6;

        ctx.save();
        // Track
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
        ctx.fillRect(trackX, viewportY, trackW, viewportAlto);

        // Thumb
        const ratio = viewportAlto / this.alturaContenido;
        const thumbH = Math.max(30, viewportAlto * ratio);
        const maxThumbY = viewportAlto - thumbH;
        const thumbY = viewportY + (this.scrollY / this.maxScroll) * maxThumbY;

        this.rectScrollbarThumb = {
            x: trackX - 2,
            y: thumbY,
            w: trackW + 4,
            h: thumbH
        };

        ctx.fillStyle = this.arrastrandoScrollbar ? '#fb923c' : this.COLOR_NARANJA;
        ctx.fillRect(trackX, thumbY, trackW, thumbH);
        ctx.restore();
    }

    private dibujarBotonAplicar(ctx: CanvasRenderingContext2D, centroX: number, y: number): void {
        const w = 260;
        const h = 36;
        const x = centroX - w / 2;

        this.rectBotonAplicar = { x, y, w, h };

        ctx.save();
        ctx.fillStyle = this.COLOR_NARANJA;
        ctx.fillRect(x, y, w, h);

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(x, y, w, h);

        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('APLICAR Y REINICIAR', centroX, y + h / 2);
        ctx.restore();
    }

    // -------------------------------------------------------------
    // GESTIÓN DE EVENTOS DE ENTRADA
    // -------------------------------------------------------------

    public manejarClick(x: number, y: number, menu: IMenu): boolean {
        if (!menu.estaAbierto()) return false;

        // Clic en botón de cerrar [✕]
        if (this.puntoEnRect(x, y, this.rectCerrar)) {
            menu.cerrar();
            this.inputActivo = null;
            return true;
        }

        // Clic en botón "Aplicar cambios y reiniciar"
        if (this.puntoEnRect(x, y, this.rectBotonAplicar)) {
            this.confirmarValores(menu);
            menu.aplicarCambios(this.valoresLocales);
            this.inputActivo = null;
            return true;
        }

        const viewportY = this.panelY + 52;
        const viewportAlto = this.panelAlto - 110;
        const dentroDeViewport = y >= viewportY && y <= viewportY + viewportAlto;

        if (dentroDeViewport) {
            // Clic en Casillas de gravedad
            for (const item of this.rectCasillasGravedad) {
                if (this.puntoEnRect(x, y, item)) {
                    if (this.inputActivo) {
                        this.confirmarValores(menu);
                        this.inputActivo = null;
                    }
                    this.valoresLocales.gravedad = item.opcion.valor;
                    this.valoresLocales.cuerpoCeleste = item.opcion.nombre;
                    menu.setValores({
                        gravedad: item.opcion.valor,
                        cuerpoCeleste: item.opcion.nombre
                    });
                    return true;
                }
            }

            // Clic en Miniaturas de bola
            for (const item of this.rectMiniaturasBolas) {
                if (this.puntoEnRect(x, y, item)) {
                    if (this.inputActivo) {
                        this.confirmarValores(menu);
                        this.inputActivo = null;
                    }
                    this.valoresLocales.imagenSeleccionada = item.indice;
                    menu.setValores({
                        imagenSeleccionada: item.indice
                    });
                    return true;
                }
            }

            // Clic en alguno de los inputs de tipeo
            let clickEnInput = false;
            for (const [tipo, rect] of this.rectInputs.entries()) {
                if (this.puntoEnRect(x, y, rect)) {
                    this.inputActivo = tipo;
                    clickEnInput = true;
                    break;
                }
            }

            if (!clickEnInput) {
                this.confirmarValores(menu);
                this.inputActivo = null;
            }
        } else {
            this.confirmarValores(menu);
            this.inputActivo = null;
        }

        return true;
    }

    public manejarMouseDown(x: number, y: number): boolean {
        if (this.puntoEnRect(x, y, this.rectScrollbarThumb)) {
            this.arrastrandoScrollbar = true;
            this.dragStartY = y;
            this.dragStartScrollY = this.scrollY;
            return true;
        }
        return false;
    }

    public manejarMouseUp(): void {
        this.arrastrandoScrollbar = false;
    }

    public manejarMouseMove(_x: number, y: number): void {
        if (this.arrastrandoScrollbar && this.maxScroll > 0) {
            const dy = y - this.dragStartY;
            const viewportAlto = this.panelAlto - 110;
            const thumbH = this.rectScrollbarThumb.h;
            const maxThumbY = viewportAlto - thumbH;
            if (maxThumbY > 0) {
                const scrollDelta = (dy / maxThumbY) * this.maxScroll;
                this.scrollY = Math.max(0, Math.min(this.maxScroll, this.dragStartScrollY + scrollDelta));
            }
        }
    }

    public manejarWheel(deltaY: number): void {
        if (this.maxScroll > 0) {
            this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY + deltaY * 0.6));
        }
    }

    public manejarKeyDown(e: KeyboardEvent, menu: IMenu): boolean {
        if (!this.inputActivo) return false;

        const key = e.key;
        let buf = this.buffersTexto[this.inputActivo] || '';

        if (key === 'Backspace') {
            buf = buf.slice(0, -1);
            if (buf === '') buf = '0';
            this.buffersTexto[this.inputActivo] = buf;
            this.notificarCambioEnVivo(menu);
            return true;
        }

        if (key === 'Enter') {
            this.confirmarValores(menu);
            this.inputActivo = null;
            return true;
        }

        if (key === 'Escape') {
            this.inputActivo = null;
            return true;
        }

        // Permitir dígitos y punto decimal
        if (/^[0-9]$/.test(key) || key === '.' || key === ',') {
            const char = key === ',' ? '.' : key;
            if (char === '.' && buf.includes('.')) {
                return true;
            }
            if (buf === '0' && char !== '.') {
                buf = char;
            } else {
                buf += char;
            }
            this.buffersTexto[this.inputActivo] = buf;
            this.notificarCambioEnVivo(menu);
            return true;
        }

        return false;
    }

    private notificarCambioEnVivo(menu: IMenu): void {
        if (this.inputActivo === 'altura') {
            const num = parseFloat(this.buffersTexto.altura);
            if (!isNaN(num)) {
                menu.actualizarAlturaInicial(num);
                this.valoresLocales.alturaInicial = Math.max(0, num);
            }
        }
    }

    private confirmarValores(menu: IMenu): void {
        const altura = parseFloat(this.buffersTexto.altura);
        const masa = parseFloat(this.buffersTexto.masa);
        const radio = parseFloat(this.buffersTexto.radio);
        const cd = parseFloat(this.buffersTexto.coeficiente);

        this.valoresLocales.alturaInicial = Math.max(0, isNaN(altura) ? 0 : altura);
        this.valoresLocales.masa = Math.max(0.001, isNaN(masa) ? 10 : masa);
        // Radio limitado a un máximo de 100
        this.valoresLocales.radio = Math.max(1, Math.min(100, isNaN(radio) ? 64 : Math.round(radio)));
        this.valoresLocales.coeficienteArrastre = Math.max(0, isNaN(cd) ? 0.47 : cd);

        this.buffersTexto.altura = this.valoresLocales.alturaInicial.toString();
        this.buffersTexto.masa = this.valoresLocales.masa.toString();
        this.buffersTexto.radio = this.valoresLocales.radio.toString();
        this.buffersTexto.coeficiente = this.valoresLocales.coeficienteArrastre.toString();

        menu.actualizarAlturaInicial(this.valoresLocales.alturaInicial);
    }

    private puntoEnRect(
        x: number,
        y: number,
        rect: { x: number; y: number; w: number; h: number }
    ): boolean {
        return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    }
}

export { DibujarMenu as dibujarmenu };
