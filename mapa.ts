import { IDibujable, INavegable } from './interfaces';
import { PIXELES_POR_METRO, pixelesAMetros } from './constantes';

export class Mapa implements IDibujable, INavegable {
    private ancho: number = 1024;
    private readonly altoTotal: number = 5000;
    private altoVisible: number = 768;

    // Posición Y de la cámara en el mapa (0 = arriba, maxCamaraY = base)
    private camaraY: number;
    private readonly velocidadDefecto: number = 14;

    constructor(ancho: number = 1024, altoVisible: number = 768, altoTotal: number = 5000) {
        this.ancho = ancho;
        this.altoVisible = altoVisible;
        this.altoTotal = altoTotal;
        // Iniciar en la base para ver la base y la garra al inicio
        this.camaraY = this.getMaxCamaraY();
    }

    public sincronizarConPantalla(ancho: number, altoVisible: number): void {
        this.ancho = ancho;
        this.altoVisible = altoVisible;
        this.camaraY = Math.min(this.getMaxCamaraY(), this.camaraY);
    }

    public getMaxCamaraY(): number {
        return Math.max(0, this.altoTotal - this.altoVisible);
    }

    public subir(distancia: number = this.velocidadDefecto): void {
        this.camaraY = Math.max(0, this.camaraY - distancia);
    }

    public bajar(distancia: number = this.velocidadDefecto): void {
        this.camaraY = Math.min(this.getMaxCamaraY(), this.camaraY + distancia);
    }

    public getCamaraY(): number {
        return this.camaraY;
    }

    public setCamaraY(y: number): void {
        this.camaraY = Math.max(0, Math.min(this.getMaxCamaraY(), y));
    }

    public getAltoTotal(): number {
        return this.altoTotal;
    }

    public puedeSubir(): boolean {
        return this.camaraY > 0;
    }

    public puedeBajar(): boolean {
        return this.camaraY < this.getMaxCamaraY();
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        // Degradado lineal de 5000px: morado en el cielo hacia azul profundo en la base
        const gradiente = ctx.createLinearGradient(0, -this.camaraY, 0, this.altoTotal - this.camaraY);
        gradiente.addColorStop(0.0, '#180642');
        gradiente.addColorStop(0.25, '#3b0764');
        gradiente.addColorStop(0.55, '#4f46e5');
        gradiente.addColorStop(0.80, '#2563eb');
        gradiente.addColorStop(1.0, '#1e3a8a');

        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, this.ancho, this.altoVisible);

        this.dibujarLineasReferencia(ctx);
    }

    private dibujarLineasReferencia(ctx: CanvasRenderingContext2D): void {
        const escala = Math.min(this.ancho / 1024, this.altoVisible / 768);
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = Math.max(1, Math.round(1 * escala));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = `${Math.max(10, Math.round(12 * escala))}px monospace`;

        // Paso métrico: marcas cada 2 metros
        const pasoMetros = 2;
        const paso = Math.max(50, pasoMetros * PIXELES_POR_METRO);
        for (let yMundo = 0; yMundo <= this.altoTotal; yMundo += paso) {
            const yPantalla = yMundo - this.camaraY;
            if (yPantalla >= -20 && yPantalla <= this.altoVisible + 20) {
                ctx.beginPath();
                ctx.moveTo(20 * escala, yPantalla);
                ctx.lineTo(this.ancho - 20 * escala, yPantalla);
                ctx.stroke();

                // Altura medida desde el suelo
                const alturaDesdeBasePx = this.altoTotal - yMundo;
                const alturaMetros = pixelesAMetros(alturaDesdeBasePx);
                const textoMetros = alturaMetros % 1 === 0 ? `${alturaMetros}` : alturaMetros.toFixed(1);
                ctx.fillText(`${textoMetros} m (${alturaDesdeBasePx} px)`, 30 * escala, yPantalla - 6 * escala);
            }
        }
        ctx.restore();
    }
}
