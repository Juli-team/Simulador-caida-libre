import { ICalculos, IDibujarPOC } from './interfaces';

/**
 * Clase DibujarPOC
 * Responsabilidad única (SRP):
 * Renderizar la bola física (POC) que cae en el canvas con efectos de sombreado,
 * iluminación 3D y gradiente.
 */
export class DibujarPOC implements IDibujarPOC {
    private color : string = "#f59e0b"
    public dibujar(ctx: CanvasRenderingContext2D, calculos: ICalculos, camaraY: number = 0): void {
        const x = calculos.getXMundo();
        const y = calculos.getYMundo() - camaraY;
        const r = calculos.getRadio();
        const color = this.color

        ctx.save();

        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = r * 0.5;
        ctx.shadowOffsetY = r * 0.2;

        const gradiente = ctx.createRadialGradient(
            x - r * 0.35,
            y - r * 0.35,
            r * 0.1,
            x,
            y,
            r
        );
        gradiente.addColorStop(0, '#fef08a');
        gradiente.addColorStop(0.3, color);
        gradiente.addColorStop(0.85, '#d97706');
        gradiente.addColorStop(1, '#78350f');

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = gradiente;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1, r * 0.08);
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        ctx.restore();
    }
}
