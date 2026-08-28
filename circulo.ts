import { Pantalla } from './pantalla';

export class Circulo {
    private radio: number = 80;
    private x: number;
    private y: number;
    private velocidadX: number = 15;
    private velocidadY: number = 15;

    constructor(private pantalla: Pantalla) {
        this.x = this.pantalla.getAncho() / 2;
        this.y = this.pantalla.getAlto() / 2;
    }

    public actualizar(): void {
        const anchoPantalla = this.pantalla.getAncho();
        const altoPantalla = this.pantalla.getAlto();

        this.x += this.velocidadX;
        this.y += this.velocidadY;

        if (this.x + this.radio >= anchoPantalla || this.x - this.radio <= 0) {
            this.velocidadX = -this.velocidadX;
        }

        if (this.y + this.radio >= altoPantalla || this.y - this.radio <= 0) {
            this.velocidadY = -this.velocidadY;
        }
    }

    public dibujar(): void {
        const ctx = this.pantalla.getContext();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();
    }
}
