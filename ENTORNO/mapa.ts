import { IDibujable, INavegable } from './interfaces';

export class Mapa implements IDibujable, INavegable {
    private ancho: number = 1024;
    private readonly altoTotal: number = 5000;
    private altoVisible: number = 768;

    // Posición Y de la cámara dentro del mapa (0 = arriba del todo, maxCamaraY = base)
    private camaraY: number;
    private readonly velocidadDefecto: number = 12;

    constructor(ancho: number = 1024, altoVisible: number = 768, altoTotal: number = 5000) {
        this.ancho = ancho;
        this.altoVisible = altoVisible;
        this.altoTotal = altoTotal;
        // Iniciar en la base para ver la base del suelo y la garra al inicio
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

    public getAltoVisible(): number {
        return this.altoVisible;
    }

    public puedeSubir(): boolean {
        return this.camaraY > 0;
    }

    public puedeBajar(): boolean {
        return this.camaraY < this.getMaxCamaraY();
    }

    public dibujar(ctx: CanvasRenderingContext2D): void {
        // Degradado lineal a lo largo de los 5000px:
        // En y = 0 (cielo) es morado y en y = 5000 (base) degrada a azul
        const gradiente = ctx.createLinearGradient(0, -this.camaraY, 0, this.altoTotal - this.camaraY);
        
        // Morado en la parte superior (cielo) hacia azul en la base
        gradiente.addColorStop(0.0, '#180642');   // Morado oscuro en el cielo
        gradiente.addColorStop(0.25, '#3b0764');  // Morado
        gradiente.addColorStop(0.55, '#4f46e5');  // Azul índigo
        gradiente.addColorStop(0.80, '#2563eb');  // Azul vibrante
        gradiente.addColorStop(1.0, '#1e3a8a');   // Azul profundo en la base   

        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, this.ancho, this.altoVisible);

        // Líneas sutiles de referencia de altura para apreciar el desplazamiento del mapa
        this.dibujarLineasReferencia(ctx);
    }

    private dibujarLineasReferencia(ctx: CanvasRenderingContext2D): void {
        const escala = Math.min(this.ancho / 1024, this.altoVisible / 768);
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = Math.max(1, Math.round(1 * escala));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.font = `${Math.max(10, Math.round(12 * escala))}px monospace`;

        const paso = 250;
        for (let yMundo = 0; yMundo <= this.altoTotal; yMundo += paso) {
            const yPantalla = yMundo - this.camaraY;
            if (yPantalla >= -20 && yPantalla <= this.altoVisible + 20) {
                ctx.beginPath();
                ctx.moveTo(20 * escala, yPantalla);
                ctx.lineTo(this.ancho - 20 * escala, yPantalla);
                ctx.stroke();

                // Altura medida desde la base (0 px en la base hasta 5000 px arriba)
                const alturaDesdeBase = this.altoTotal - yMundo;
                ctx.fillText(`${alturaDesdeBase} px`, 30 * escala, yPantalla - 5 * escala);
            }
        }
        ctx.restore();
    }
}
