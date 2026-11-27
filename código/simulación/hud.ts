import { IDibujable, ICalculos, IConstantes, IPOCFisico } from './interfaces';
import { Constantes } from '../física/constantes';

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

    private readonly constantes: IConstantes;
    private readonly guiaControles: string[] = [
        '[MOUSE]: Mover bola sujeta',
        '[W]/[S]: Subir/Bajar cámara',
        '[ESPACIO]: Soltar / Pausar',
        '[R]: Reiniciar simulación'
    ];

    constructor(constantes: IConstantes = new Constantes()) {
        this.constantes = constantes;
    }

    /**
     * Actualiza el temporizador de muestreo de telemetría
     * @param dt Delta time en segundos
     * @param calculos Instancia de ICalculos (o null si no hay objeto)
     */
    public actualizar(dt: number, calculos: ICalculos | null): void {
        if (!calculos) {
            this.resetearMostrado();
            return;
        }
        const poc = calculos.getPOC();
        const estado = calculos.getEstadoBola();
        // En reposo (sujeto al mouse o en suelo), el tiempo y velocidad inician en cero
        if (estado.esSujeto() || estado.esEnSuelo()) {
            this.resetearMostrado();
            return;
        }
        // Al detenerse por impacto, mostrar los valores finales exactos
        if (estado.esDetenido()) {
            this.sincronizarDesdePOC(poc);
            return;
        }
        // Durante la caída, refrescar los valores cada 0.5 segundos para facilitar la lectura
        if (estado.esCayendo()) {
            this.acumuladorTiempo += dt;
            if (this.acumuladorTiempo >= this.intervaloActualizacion) {
                this.sincronizarDesdePOC(poc);
                this.acumuladorTiempo = 0;
            }
        }
    }

    private resetearMostrado(): void {
        this.tiempoMostrado = 0;
        this.velocidadMostrada = 0;
        this.acumuladorTiempo = 0;
    }

    private sincronizarDesdePOC(poc: IPOCFisico): void {
        this.tiempoMostrado = poc.getTiempoCaida();
        this.velocidadMostrada = poc.getVelocidad();
        this.alturaMostrada = poc.getAltura();
    }

    public dibujar(ctx: CanvasRenderingContext2D, anchoPantalla: number, calculos: ICalculos | null): void {
        ctx.save();
        const margenDerecho = 25;
        const inicioY = 30;
        const interlineado = 22;
        const xTexto = anchoPantalla - margenDerecho;
        let y = this.prepararTextoHUD(ctx, xTexto, inicioY, interlineado);

        if (!calculos) {
            this.dibujarEstadoVacio(ctx, xTexto, y, interlineado);
            ctx.restore();
            return;
        }

        y = this.dibujarTelemetria(ctx, xTexto, y, interlineado);
        ctx.fillStyle = '#f8fafc';
        ctx.font = '16px "Internet Friends", monospace';
        for (const texto of this.guiaControles) {
            ctx.fillText(texto, xTexto, y);
            y += 20;
        }
        ctx.restore();
    }

    private prepararTextoHUD(
        ctx: CanvasRenderingContext2D,
        xTexto: number,
        inicioY: number,
        interlineado: number
    ): number {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.font = '22px "Internet Friends", monospace';
        ctx.fillText('SIMULADOR DE CAIDA LIBRE', xTexto, inicioY);
        return inicioY + interlineado + 4;
    }

    private dibujarEstadoVacio(
        ctx: CanvasRenderingContext2D,
        xTexto: number,
        y: number,
        interlineado: number
    ): void {
        ctx.font = '18px "Internet Friends", monospace';
        ctx.fillText('Estado: Esperando objeto', xTexto, y);
        y += interlineado;
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('Haz click para colocar la bola en el suelo', xTexto, y);
        y += interlineado + 6;
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Click en la bola para agarrarla  |  W/S: subir/bajar', xTexto, y);
    }

    private dibujarTelemetria(
        ctx: CanvasRenderingContext2D,
        xTexto: number,
        yInicio: number,
        interlineado: number
    ): number {
        let y = yInicio;
        ctx.font = '20px "Internet Friends", monospace';
        ctx.fillStyle = '#fdfdfd';
        ctx.fillText(`Tiempo: ${this.tiempoMostrado.toFixed(2)} s`, xTexto, y);
        y += interlineado;
        ctx.fillText(`Velocidad: ${this.velocidadMostrada.toFixed(2)} m/s`, xTexto, y);
        y += interlineado;
        ctx.fillStyle = '#fdfdfd';
        ctx.fillText(`Altura: ${this.alturaMostrada.toFixed(2)} m`, xTexto, y);
        y += interlineado;
        ctx.fillStyle = '#00ff6a';
        ctx.fillText(`Gravedad: ${this.constantes.getGravedad()} m/s²`, xTexto, y);
        return y + interlineado + 8;
    }
}
