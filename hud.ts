import { IDibujable } from './interfaces';
import { POC } from './poc';
import { IFormulas } from './formulas';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Clase HUD
 * Responsabilidad única (SRP): Mostrar en la esquina superior derecha los resultados
 * de las fórmulas físicas y los datos de la simulación en texto blanco,
 * actualizando el tiempo transcurrido y la velocidad cada 0.5 segundos para máxima legibilidad.
 */
export class HUD implements IDibujable {
    private formulas: IFormulas;

    // Frecuencia de actualización de telemetría (cada 0.5 s)
    private readonly intervaloActualizacion: number = 0.5;
    private acumuladorTiempo: number = 0;

    // Valores congelados para el refresco legible cada 0.5s
    private tiempoMostrado: number = 0;
    private velocidadMostrada: number = 0;

    // Fórmulas teóricas calculadas
    private tTeorico: number = 0;
    private vTeorico: number = 0;

    constructor(formulas: IFormulas) {
        this.formulas = formulas;
    }

    /**
     * Actualiza el temporizador de muestreo de 0.5 segundos
     * @param dt Delta time en segundos
     * @param poc Instancia de POC (o null si no hay bola)
     */
    public actualizar(dt: number, poc: POC | null): void {
        if (!poc) {
            this.tiempoMostrado = 0;
            this.velocidadMostrada = 0;
            this.tTeorico = 0;
            this.vTeorico = 0;
            this.acumuladorTiempo = 0;
            return;
        }

        // Si la bola está en la garra (sujeta), calcular fórmulas teóricas de inmediato
        if (poc.esSujeto()) {
            this.tTeorico = this.formulas.calcularTiempo(poc.getH0());
            this.vTeorico = this.formulas.calcularVelocidad(poc.getV0(), this.tTeorico);
            this.tiempoMostrado = 0;
            this.velocidadMostrada = 0;
            this.acumuladorTiempo = 0;
            return;
        }

        // Si la bola impactó el suelo, mostrar valores finales exactos
        if (poc.esDetenido()) {
            this.tiempoMostrado = poc.getT();
            this.velocidadMostrada = poc.getV();
            return;
        }

        // Si está cayendo o pausado, actualizar cada 0.5 segundos
        if (poc.esCayendo()) {
            this.acumuladorTiempo += dt;
            if (this.acumuladorTiempo >= this.intervaloActualizacion) {
                this.tiempoMostrado = poc.getT();
                this.velocidadMostrada = poc.getV();
                this.acumuladorTiempo = 0;
            }
        }
    }

    public dibujar(ctx: CanvasRenderingContext2D, anchoPantalla: number, poc: POC | null): void {
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

        if (!poc) {
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
        if (poc.esEnSuelo()) {
            textoEstado = 'En el suelo (acerca la garra)';
        } else if (poc.esSujeto()) {
            textoEstado = 'Sujeto en la garra (Listo)';
        } else if (poc.esCayendo()) {
            textoEstado = 'Cayendo (MRUV)...';
        } else if (poc.esPausado()) {
            textoEstado = 'PAUSADO';
        } else if (poc.esDetenido()) {
            textoEstado = 'IMPACTO EN EL SUELO';
        }

        ctx.font = '14px monospace';
        ctx.fillText(`Estado: ${textoEstado}`, xTexto, y);
        y += interlineado;

        // Altura inicial
        ctx.fillText(`Altura inicial (h₀): ${poc.getH0().toFixed(2)} m`, xTexto, y);
        y += interlineado;

        // Velocidad inicial
        ctx.fillText(`Velocidad inicial (v₀): ${poc.getV0().toFixed(2)} m/s`, xTexto, y);
        y += interlineado;

        // Telemetría en tiempo real (refrescada cada 0.5s)
        ctx.font = 'bold 15px monospace';
        ctx.fillText(`Tiempo actual (t): ${this.tiempoMostrado.toFixed(2)} s`, xTexto, y);
        y += interlineado;

        ctx.fillText(`Velocidad actual (v): ${this.velocidadMostrada.toFixed(2)} m/s`, xTexto, y);
        y += interlineado + 4;

        // Resultados teóricos de las fórmulas
        ctx.font = '13px monospace';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText('--- FÓRMULAS TEÓRICAS ---', xTexto, y);
        y += interlineado;

        ctx.fillText(`t = √(h₀ / 0.5g) : ${this.tTeorico.toFixed(2)} s`, xTexto, y);
        y += interlineado;

        ctx.fillText(`v = v₀ + g·t     : ${this.vTeorico.toFixed(2)} m/s`, xTexto, y);
        y += interlineado + 6;

        // Ayuda de teclas
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
