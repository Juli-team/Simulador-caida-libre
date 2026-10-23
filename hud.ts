import { IDibujable, ICalculos } from './interfaces';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Clase HUD
 * Responsabilidad única (SRP): Mostrar en la esquina superior derecha los resultados
 * en pantalla mostrando la altura, velocidad y el tiempo transcurrido en texto legible,
 * refrescándose cada 0.5 segundos durante la caída.
 */
export class HUD implements IDibujable {
    // Frecuencia de actualización de telemetría (cada 0.5 s)
    private readonly intervaloActualizacion: number = 0.5;
    private acumuladorTiempo: number = 0;

    // Valores congelados para el refresco legible cada 0.5s
    private tiempoMostrado: number = 0;
    private velocidadMostrada: number = 0;
    private alturaMostrada: number = 0;

    constructor(_formulas?: any) {}

    /**
     * Actualiza el temporizador de muestreo de telemetría
     * @param dt Delta time en segundos
     * @param calculos Instancia de ICalculos (o null si no hay objeto)
     */
    public actualizar(dt: number, calculos: ICalculos | null): void {
        if (!calculos) {
            this.tiempoMostrado = 0;
            this.velocidadMostrada = 0;
            this.acumuladorTiempo = 0;
            return;
        }

        const poc = calculos.getPOC();

        // En reposo (sujeto a la garra o en suelo), el tiempo y velocidad inician en cero
        if (calculos.esSujeto() || calculos.esEnSuelo()) {
            this.tiempoMostrado = 0;
            this.velocidadMostrada = 0;
            this.alturaMostrada = 0;
            this.acumuladorTiempo = 0;
            return;
        }

        // Al detenerse por impacto, mostrar los valores finales exactos
        if (calculos.esDetenido()) {
            this.tiempoMostrado = poc.getTiempoCaida();
            this.velocidadMostrada = poc.getVelocidad();
            this.alturaMostrada = poc.getAltura();
            return;
        }

        // Durante la caída, refrescar los valores cada 0.5 segundos para facilitar la lectura
        if (calculos.esCayendo()) {
            this.acumuladorTiempo += dt;
            if (this.acumuladorTiempo >= this.intervaloActualizacion) {
                this.tiempoMostrado = poc.getTiempoCaida();
                this.velocidadMostrada = poc.getVelocidad();
                this.alturaMostrada = poc.getAltura();
                this.acumuladorTiempo = 0;
            }
        }
    }

    public dibujar(ctx: CanvasRenderingContext2D, anchoPantalla: number, calculos: ICalculos | null): void {
        ctx.save();

        const margenDerecho = 25;
        const inicioY = 30;
        const interlineado = 22;
        const xTexto = anchoPantalla - margenDerecho;

        // Configuración de texto blanco de alta legibilidad
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        let y = inicioY;

        // Encabezado
        ctx.font = 'bold 16px monospace';
        ctx.fillText('--- SIMULADOR CAÍDA LIBRE ---', xTexto, y);
        y += interlineado;

        ctx.font = '12px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Escala: 1 m = ${PIXELES_POR_METRO} px`, xTexto, y);
        y += interlineado + 2;
        ctx.fillStyle = '#FFFFFF';

        if (!calculos) {
            ctx.font = '14px monospace';
            ctx.fillText('Estado: Esperando objeto', xTexto, y);
            y += interlineado;
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText('Haz click para colocar la bola en el suelo', xTexto, y);
            y += interlineado + 6;
            ctx.fillStyle = '#94a3b8';
            ctx.fillText('Mouse: mover garra   |   W/S: subir/bajar base', xTexto, y);
            ctx.restore();
            return;
        }

        // Estado del objeto
        let textoEstado = '';
        if (calculos.esEnSuelo()) {
            textoEstado = 'En el suelo (acerca la garra)';
        } else if (calculos.esSujeto()) {
            textoEstado = 'Sujeto en la garra (Listo)';
        } else if (calculos.esCayendo()) {
            textoEstado = 'Cayendo...';
        } else if (calculos.esPausado()) {
            textoEstado = 'PAUSADO';
        } else if (calculos.esDetenido()) {
            textoEstado = 'IMPACTO EN EL SUELO';
        }

        ctx.font = '14px monospace';
        ctx.fillText(`Estado: ${textoEstado}`, xTexto, y);
        y += interlineado + 4;

        // Solo se muestra en pantalla la velocidad y el tiempo
        ctx.font = 'bold 16px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`Tiempo: ${this.tiempoMostrado.toFixed(2)} s`, xTexto, y);
        y += interlineado;

        ctx.fillText(`Velocidad: ${this.velocidadMostrada.toFixed(2)} m/s`, xTexto, y);
        y += interlineado;

        ctx.fillStyle = '#4ade80';
        ctx.fillText(`Altura: ${this.alturaMostrada.toFixed(2)} m`, xTexto, y);
        y += interlineado + 8;

        // Guía de controles
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'italic 12px monospace';
        ctx.fillText('[MOUSE]: Mover garra', xTexto, y);
        y += 18;
        ctx.fillText('[W]/[S]: Subir/Bajar base', xTexto, y);
        y += 18;
        ctx.fillText('[ESPACIO]: Soltar / Pausar', xTexto, y);
        y += 18;
        ctx.fillText('[R]: Reiniciar simulación', xTexto, y);

        ctx.restore();
    }
}
