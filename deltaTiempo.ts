/**
 * Clase DeltaTiempo
 * Responsabilidad única (SRP):
 * Calcular y controlar el intervalo de tiempo transcurrido (delta time)
 * entre fotogramas consecutivos de forma segura y acotada.
 */
export class DeltaTiempo {
    private ultimoTimestamp: number = 0;
    private readonly maxDelta: number;

    constructor(maxDelta: number = 0.1) {
        this.maxDelta = maxDelta;
    }

    /**
     * Inicia o reinicia la marca de tiempo base.
     */
    public iniciar(timestamp: number = performance.now()): void {
        this.ultimoTimestamp = timestamp;
    }

    /**
     * Calcula el delta time en segundos acotado por maxDelta.
     */
    public calcular(timestamp: number): number {
        if (this.ultimoTimestamp === 0) {
            this.ultimoTimestamp = timestamp;
            return 0;
        }

        const dt = Math.min((timestamp - this.ultimoTimestamp) / 1000, this.maxDelta);
        this.ultimoTimestamp = timestamp;
        return dt;
    }

    public getUltimoTimestamp(): number {
        return this.ultimoTimestamp;
    }

    public reiniciar(timestamp: number = performance.now()): void {
        this.ultimoTimestamp = timestamp;
    }
}
