import { IDibujable, INavegable } from './interfaces';
import { DibujarMapa } from './dibujarMapa';

export class Mapa implements IDibujable, INavegable {
    private ancho: number = 1024;
    private readonly altoTotal: number = 300000;
    private altoVisible: number = 768;

    // Posición Y de la cámara en el mapa (0 = arriba, maxCamaraY = base)
    private camaraY: number;
    private readonly velocidadDefecto: number = 14;
    private dibujadorMapa: DibujarMapa;

    constructor(
        ancho: number = 1024,
        altoVisible: number = 768,
        altoTotal: number = 5000,
        dibujadorMapa: DibujarMapa = new DibujarMapa()
    ) {
        this.ancho = ancho;
        this.altoVisible = altoVisible;
        this.altoTotal = altoTotal;
        this.dibujadorMapa = dibujadorMapa;
        // Iniciar en la base del mapa
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

    public getAncho(): number {
        return this.ancho;
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
        this.dibujadorMapa.dibujar(ctx, this);
    }
}
