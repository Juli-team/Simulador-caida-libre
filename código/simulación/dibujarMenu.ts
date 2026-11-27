import { IDibujarMenu, IMenu, IConfiguracionMenu, IValoresConfiguracion } from './interfaces';
import { Constantes, IOpcionGravedad } from '../física/constantes';
import { URLS_BOLAS } from './dibujarPOC';

type TipoInput = 'altura' | 'masa' | 'radio' | 'coeficiente' | null;
type Rect = { x: number; y: number; w: number; h: number };

export class DibujarMenu implements IDibujarMenu {
    private configuracion: IConfiguracionMenu;
    private readonly naranja = '#f97316';
    private layout = { btnTam: 72, rectCerrar: { x: 0, y: 0, w: 0, h: 0 }, rectAplicar: { x: 0, y: 0, w: 0, h: 0 } };
    private formulario: { abiertoPrevio: boolean; inputActivo: TipoInput; buffers: Record<string, string>; valores: IValoresConfiguracion };
    private recursos = { imgConfig: new Image(), imgCargada: false, bolas: [] as HTMLImageElement[], bolasCargadas: new Array(URLS_BOLAS.length).fill(false) as boolean[] };
    private zonas = { inputs: new Map<TipoInput, Rect>(), gravedades: [] as Array<Rect & { opcion: IOpcionGravedad }>, miniaturas: [] as Array<Rect & { indice: number }> };

    constructor(configuracion: IConfiguracionMenu) {
        this.configuracion = configuracion;
        this.formulario = {
            abiertoPrevio: false, inputActivo: null,
            buffers: { altura: '0', masa: '10', radio: '64', coeficiente: '0.47' },
            valores: configuracion.getValores()
        };
        this.recursos.imgConfig.src = new URL('../../assets/config.webp', import.meta.url).href;
        this.recursos.imgConfig.onload = () => { this.recursos.imgCargada = true; };
        URLS_BOLAS.forEach((url, i) => {
            const img = new Image();
            img.src = url;
            img.onload = () => { this.recursos.bolasCargadas[i] = true; };
            this.recursos.bolas.push(img);
        });
    }

    public tieneInputActivo(): boolean {
        return this.formulario.inputActivo !== null;
    }

    public estaSobreBotonConfig(x: number, y: number, ancho: number, alto: number): boolean {
        const t = this.layout.btnTam;
        return this.puntoEnRect(x, y, { x: ancho - t - 20, y: alto - t - 20, w: t, h: t });
    }

    public estaSobrePanel(x: number, y: number, ancho: number, alto: number): boolean {
        const w = Math.min(520, ancho - 30), h = Math.min(560, alto - 30);
        return this.puntoEnRect(x, y, { x: (ancho - w) / 2, y: (alto - h) / 2, w, h });
    }

    public dibujar(ctx: CanvasRenderingContext2D, ancho: number, alto: number, menu: IMenu): void {
        const abierto = menu.estaAbierto(), t = this.layout.btnTam, bx = ancho - t - 20, by = alto - t - 20;
        ctx.save();
        if (abierto) {
            ctx.beginPath();
            ctx.arc(bx + t / 2, by + t / 2, t / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
            ctx.fill();
        }
        if (this.recursos.imgCargada) ctx.drawImage(this.recursos.imgConfig, bx, by, t, t);
        else { ctx.fillStyle = this.naranja; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('⚙', bx + t / 2, by + t / 2); }
        ctx.restore();

        if (!abierto) { this.formulario.abiertoPrevio = false; this.formulario.inputActivo = null; return; }
        if (!this.formulario.abiertoPrevio) {
            this.formulario.abiertoPrevio = true;
            const v = this.configuracion.getValores();
            this.formulario.valores = { ...v };
            this.formulario.buffers = { altura: `${v.alturaInicial}`, masa: `${v.masa}`, radio: `${v.radio}`, coeficiente: `${v.coeficienteArrastre}` };
        }
        this.dibujarPanelMenu(ctx, ancho, alto);
    }

    private dibujarPanelMenu(ctx: CanvasRenderingContext2D, ancho: number, alto: number): void {
        const w = Math.min(520, ancho - 30), h = Math.min(560, alto - 30);
        const px = Math.round((ancho - w) / 2), py = Math.round((alto - h) / 2), cx = px + w / 2;
        ctx.save();
        ctx.fillStyle = 'rgba(213, 218, 228, 0.88)';
        ctx.fillRect(px, py, w, h);
        ctx.lineWidth = 2; ctx.strokeStyle = this.naranja; ctx.strokeRect(px, py, w, h);
        ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = this.naranja;
        ctx.fillText('MENÚ DE CONFIGURACIÓN', cx, py + 24);
        this.layout.rectCerrar = { x: px + w - 36, y: py + 10, w: 26, h: 26 };
        ctx.fillStyle = '#94a3b8'; ctx.fillText('✕', px + w - 23, py + 23);
        ctx.beginPath(); ctx.moveTo(px + 15, py + 44); ctx.lineTo(px + w - 15, py + 44); ctx.stroke();

        this.zonas = { inputs: new Map(), gravedades: [], miniaturas: [] };
        let curY = this.dibujarCamposNumericos(ctx, cx, py + 62);
        curY = this.dibujarCasillasGravedad(ctx, cx, curY);
        this.dibujarMiniaturasBolas(ctx, cx, curY + 12);

        const btn = { x: cx - 130, y: py + h - 46, w: 260, h: 34 };
        this.layout.rectAplicar = btn;
        ctx.fillStyle = this.naranja; ctx.fillRect(btn.x, btn.y, btn.w, btn.h);
        ctx.strokeStyle = '#ffffff'; ctx.strokeRect(btn.x, btn.y, btn.w, btn.h);
        ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#ffffff'; ctx.fillText('APLICAR Y REINICIAR', cx, btn.y + 17);
        ctx.restore();
    }

    private dibujarCamposNumericos(ctx: CanvasRenderingContext2D, cx: number, startY: number): number {
        const campos: Array<[Exclude<TipoInput, null>, string, string, string?]> = [
            ['altura', '1. ALTURA INICIAL', 'm', `(El mapa se ajusta al valor. Límite: ${this.configuracion.getLimiteAlturaMapa()} m)`],
            ['masa', '2. MASA', 'kg'],
            ['radio', '3. RADIO', 'px', '(Máximo permitido: 100 px)'],
            ['coeficiente', '4. COEFICIENTE DE ARRASTRE', 'Cd']
        ];
        let y = startY;
        const parpadeo = Math.floor(Date.now() / 400) % 2 === 0;
        for (const [tipo, titulo, unidad, nota] of campos) {
            ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = this.naranja; ctx.fillText(titulo, cx, y);
            const rect = { x: cx - 100, y: y + 6, w: 200, h: 28 };
            this.zonas.inputs.set(tipo, rect);
            const activo = this.formulario.inputActivo === tipo;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
            ctx.strokeStyle = activo ? this.naranja : 'rgba(213, 218, 228, 0.88)'; ctx.lineWidth = activo ? 2 : 1; ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
            ctx.font = 'bold 15px monospace'; ctx.fillStyle = '#f8fafc';
            ctx.fillText(`${this.formulario.buffers[tipo]}${activo && parpadeo ? '|' : ''} ${unidad}`, cx, rect.y + 14);
            if (nota) { ctx.font = 'italic 11px sans-serif'; ctx.fillStyle = '#94a3b8'; ctx.fillText(nota, cx, rect.y + 38); }
            y += nota ? 64 : 56;
        }
        return y;
    }

    private dibujarCasillasGravedad(ctx: CanvasRenderingContext2D, cx: number, startY: number): number {
        ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = this.naranja; ctx.fillText('5. GRAVEDAD', cx, startY);
        const yBase = startY + 14, startX = cx - 217.5;
        let maxY = yBase;
        Constantes.getGravedadesDisponibles().forEach((op, i) => {
            const x = startX + (i % 3) * 145, y = yBase + Math.floor(i / 3) * 24;
            maxY = Math.max(maxY, y + 24);
            const sel = Math.abs(this.formulario.valores.gravedad - op.valor) < 0.05 || this.formulario.valores.cuerpoCeleste === op.nombre;
            this.zonas.gravedades.push({ x, y, w: 139, h: 24, opcion: op });
            ctx.strokeStyle = this.naranja; ctx.lineWidth = 1.5;
            ctx.fillStyle = sel ? 'rgba(249, 115, 22, 0.35)' : 'rgba(15, 23, 42, 0.7)';
            ctx.fillRect(x + 4, y + 4, 14, 14); ctx.strokeRect(x + 4, y + 4, 14, 14);
            if (sel) { ctx.fillStyle = this.naranja; ctx.fillRect(x + 7, y + 7, 8, 8); }
            ctx.font = sel ? 'bold 12px sans-serif' : '12px sans-serif'; ctx.fillStyle = sel ? this.naranja : '#cbd5e1'; ctx.textAlign = 'left';
            ctx.fillText(`${op.nombre} (${op.valor})`, x + 23, y + 12);
        });
        ctx.textAlign = 'center';
        return maxY;
    }

    private dibujarMiniaturasBolas(ctx: CanvasRenderingContext2D, cx: number, startY: number): void {
        ctx.font = 'bold 13px sans-serif'; ctx.fillStyle = this.naranja; ctx.fillText('6. IMAGEN DE LA BOLA', cx, startY);
        const y = startY + 14, tam = 46, startX = cx - (URLS_BOLAS.length * tam + (URLS_BOLAS.length - 1) * 16) / 2;
        URLS_BOLAS.forEach((_, i) => {
            const x = startX + i * 62, indice = i + 1, sel = this.formulario.valores.imagenSeleccionada === indice;
            this.zonas.miniaturas.push({ x, y, w: tam, h: tam, indice });
            ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'; ctx.fillRect(x, y, tam, tam);
            const img = this.recursos.bolas[i];
            if (img && (img.complete || this.recursos.bolasCargadas[i]) && img.naturalWidth > 0) ctx.drawImage(img, x + 3, y + 3, tam - 6, tam - 6);
            else { ctx.font = '11px monospace'; ctx.fillStyle = '#94a3b8'; ctx.fillText(`Bola ${indice}`, x + 23, y + 23); }
            ctx.lineWidth = sel ? 3 : 1; ctx.strokeStyle = sel ? this.naranja : '#475569'; ctx.strokeRect(x, y, tam, tam);
        });
    }

    public manejarClick(x: number, y: number, menu: IMenu): boolean {
        if (!menu.estaAbierto()) return false;
        if (this.puntoEnRect(x, y, this.layout.rectCerrar)) { menu.cerrar(); this.formulario.inputActivo = null; return true; }
        if (this.puntoEnRect(x, y, this.layout.rectAplicar)) {
            this.confirmarValores(); this.configuracion.aplicarCambios(this.formulario.valores);
            menu.cerrar(); this.formulario.inputActivo = null; return true;
        }
        this.manejarClickContenido(x, y);
        return true;
    }

    private manejarClickContenido(x: number, y: number): void {
        const grav = this.zonas.gravedades.find((r) => this.puntoEnRect(x, y, r));
        if (grav) {
            if (this.formulario.inputActivo) this.confirmarValores();
            this.formulario.inputActivo = null;
            this.formulario.valores.gravedad = grav.opcion.valor; this.formulario.valores.cuerpoCeleste = grav.opcion.nombre;
            this.configuracion.setValores({ gravedad: grav.opcion.valor, cuerpoCeleste: grav.opcion.nombre });
            return;
        }
        const bola = this.zonas.miniaturas.find((r) => this.puntoEnRect(x, y, r));
        if (bola) {
            if (this.formulario.inputActivo) this.confirmarValores();
            this.formulario.inputActivo = null; this.formulario.valores.imagenSeleccionada = bola.indice;
            this.configuracion.setValores({ imagenSeleccionada: bola.indice });
            return;
        }
        for (const [tipo, rect] of this.zonas.inputs.entries()) {
            if (this.puntoEnRect(x, y, rect)) { this.formulario.inputActivo = tipo; return; }
        }
        this.confirmarValores(); this.formulario.inputActivo = null;
    }

    public manejarKeyDown(e: KeyboardEvent, _menu?: IMenu): boolean {
        if (!this.formulario.inputActivo) return false;
        if (e.key === 'Enter' || e.key === 'Escape') {
            if (e.key === 'Enter') this.confirmarValores();
            this.formulario.inputActivo = null; return true;
        }
        return this.procesarEntradaTecla(e.key);
    }

    private procesarEntradaTecla(tecla: string): boolean {
        const activo = this.formulario.inputActivo;
        if (!activo) return false;
        let buf = this.formulario.buffers[activo] || '';
        if (tecla === 'Backspace') buf = buf.slice(0, -1) || '0';
        else if (/^[0-9.,]$/.test(tecla)) {
            const c = tecla === ',' ? '.' : tecla;
            if (c === '.' && buf.includes('.')) return true;
            buf = buf === '0' && c !== '.' ? c : buf + c;
        } else return false;

        this.formulario.buffers[activo] = buf;
        if (activo === 'altura' && !isNaN(parseFloat(buf))) {
            const num = parseFloat(buf);
            this.configuracion.actualizarAlturaInicial(num);
            this.formulario.valores.alturaInicial = Math.max(0, num);
        }
        return true;
    }

    private confirmarValores(): void {
        const b = this.formulario.buffers, v = this.formulario.valores;
        const num = (s: string, def: number) => (isNaN(parseFloat(s)) ? def : parseFloat(s));
        v.alturaInicial = Math.max(0, num(b.altura, 0));
        v.masa = Math.max(0.001, num(b.masa, 10));
        v.radio = Math.max(1, Math.min(100, Math.round(num(b.radio, 64))));
        v.coeficienteArrastre = Math.max(0, num(b.coeficiente, 0.47));
        this.formulario.buffers = { altura: `${v.alturaInicial}`, masa: `${v.masa}`, radio: `${v.radio}`, coeficiente: `${v.coeficienteArrastre}` };
        this.configuracion.actualizarAlturaInicial(v.alturaInicial);
    }

    private puntoEnRect(x: number, y: number, rect: Rect): boolean {
        return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    }
}

export { DibujarMenu as dibujarmenu };
