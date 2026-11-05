import { Mapa } from './mapa';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Clase DibujarMapa
 * Responsabilidad única (SRP):
 * Renderizar visualmente el fondo del mapa (degradado vertical)
 * y las marcas de referencia métricas según la cámara y escala actuales.
 */
export class DibujarMapa {
    public dibujar(ctx: CanvasRenderingContext2D, mapa: Mapa): void {
        const camaraY = mapa.getCamaraY();
        const altoTotal = mapa.getAltoTotal();
        const ancho = mapa.getAncho();
        const altoVisible = mapa.getAltoVisible();

        // Degradado lineal de altoTotal: morado en el cielo hacia azul profundo en la base
        const gradiente = ctx.createLinearGradient(0, -camaraY, 0, altoTotal - camaraY);
        gradiente.addColorStop(0.0, '#180642');
        gradiente.addColorStop(0.25, '#3b0764');
        gradiente.addColorStop(0.55, '#4f46e5');
        gradiente.addColorStop(0.80, '#2563eb');
        gradiente.addColorStop(1.0, '#1e3a8a');

        ctx.fillStyle = gradiente;
        ctx.fillRect(0, 0, ancho, altoVisible);

        this.dibujarLineasReferencia(ctx, mapa);
    }

    private dibujarLineasReferencia(ctx: CanvasRenderingContext2D, mapa: Mapa): void {
        const ancho = mapa.getAncho();
        const altoVisible = mapa.getAltoVisible();
        const camaraY = mapa.getCamaraY();
        const altoTotal = mapa.getAltoTotal();

        const escala = Math.min(ancho / 1024, altoVisible / 768);
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = Math.max(1, Math.round(1 * escala));
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
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
