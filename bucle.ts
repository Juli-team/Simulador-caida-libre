import { Pantalla } from './pantalla';
import { Circulo } from './circulo';
export class Bucle {
public constructor(
        private pantalla: Pantalla,
        private circulo: Circulo
    ) {}
public buclear=():void => {
    this.pantalla.limpiar();
    this.circulo.actualizar();
    this.circulo.dibujar();
    requestAnimationFrame(this.buclear);
}  
}