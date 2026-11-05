import { Pieza1 } from './pieza1';
import { BaseSuelo } from './baseSuelo';
import { BrazoHorizontal } from './brazoHorizontal';
import { Conector } from './conector';
import { Cabezal } from './cabezal';
import { Pinzas } from './pinzas';
import type { Garra } from './garra';

/**
 * Clase DibujarGarra
 * Responsabilidad única (SRP):
 * Renderizar en el contexto 2D del Canvas la garra mecánica entera y cada una de sus piezas.
 */
export class DibujarGarra {
    public dibujar(ctx: CanvasRenderingContext2D, garra: Garra): void {
        ctx.save();

        // 1. Base del suelo
        this.dibujarBaseSuelo(ctx, garra.getBaseSuelo());

        // 2. Columna extensible (Pieza 1)
        this.dibujarPieza1(ctx, garra.getPieza1());

        // 3. Brazo horizontal
        this.dibujarBrazoHorizontal(ctx, garra.getBrazoHorizontal());

        // 4. Pieza negra vertical (conector) que sostiene la garra gris
        this.dibujarConector(ctx, garra.getConector());

        // 5. Garra mecánica completa (cabezal + pinzas)
        this.dibujarGarraGris(ctx, garra.getCabezal(), garra.getPinzas());

        ctx.restore();
    }

    public dibujarSoporteYCabezal(ctx: CanvasRenderingContext2D, garra: Garra): void {
        ctx.save();
        this.dibujarBaseSuelo(ctx, garra.getBaseSuelo());
        this.dibujarPieza1(ctx, garra.getPieza1());
        this.dibujarBrazoHorizontal(ctx, garra.getBrazoHorizontal());
        this.dibujarConector(ctx, garra.getConector());
        this.dibujarCabezal(ctx, garra.getCabezal());
        ctx.restore();
    }

    public dibujarDedosPinzas(ctx: CanvasRenderingContext2D, garra: Garra): void {
        ctx.save();
        this.dibujarPinzasSolas(ctx, garra.getPinzas());
        ctx.restore();
    }

    public dibujarBaseSuelo(ctx: CanvasRenderingContext2D, base: BaseSuelo): void {
        if (!base.isVisible()) return;

        const yBasePantalla = base.getYBasePantalla();
        const escala = base.getEscala();
        const columnaPosX = base.getColumnaPosX();
        const columnaAncho = base.getColumnaAncho();
        const altoPantalla = base.getAltoPantalla();

        ctx.save();
        ctx.fillStyle = base.getColorEstructura();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * escala);

        const centroColumna = columnaPosX + columnaAncho / 2;
        const mitadAnchoInferior = 80 * escala;
        const mitadAnchoSuperior = 40 * escala;

        const xInfIzq = centroColumna - mitadAnchoInferior;
        const xInfDer = centroColumna + mitadAnchoInferior;
        const xSupDer = centroColumna + mitadAnchoSuperior;
        const xSupIzq = centroColumna - mitadAnchoSuperior;

        ctx.beginPath();
        ctx.moveTo(xInfIzq, altoPantalla);
        ctx.lineTo(xInfDer, altoPantalla);
        ctx.lineTo(xSupDer, yBasePantalla);
        ctx.lineTo(xSupIzq, yBasePantalla);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(xSupIzq, yBasePantalla, mitadAnchoSuperior * 2, 8 * escala);

        ctx.restore();
    }

    public dibujarPieza1(ctx: CanvasRenderingContext2D, pieza1: Pieza1): void {
        ctx.save();

        const altoVisible = pieza1.getAltoVisible();
        if (altoVisible <= 0) {
            ctx.restore();
            return;
        }

        const posX = pieza1.getPosX();
        const ySuperior = pieza1.getYSuperior();
        const ancho = pieza1.getAncho();
        const escala = pieza1.getEscala();

        // Columna negra principal
        ctx.fillStyle = pieza1.getColor();
        ctx.fillRect(posX, ySuperior, ancho, altoVisible);

        // Borde oscuro
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * escala);
        ctx.strokeRect(posX, ySuperior, ancho, altoVisible);

        // Detalles telescópicos
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fillRect(posX + 3 * escala, ySuperior, Math.max(1, 3 * escala), altoVisible);

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = Math.max(1, 2 * escala);
        const pasoSegmento = 80 * escala;
        for (let y = ySuperior + pasoSegmento; y < ySuperior + altoVisible; y += pasoSegmento) {
            if (y >= -10 && y <= pieza1.getAltoPantalla() + 10) {
                ctx.beginPath();
                ctx.moveTo(posX, y);
                ctx.lineTo(posX + ancho, y);
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    public dibujarBrazoHorizontal(ctx: CanvasRenderingContext2D, brazo: BrazoHorizontal): void {
        ctx.save();
        const escala = brazo.getEscala();
        const inicioX = brazo.getInicioX();
        const y = brazo.getY();
        const espesor = brazo.getEspesor();
        const anchoBrazo = brazo.getAncho();

        ctx.fillStyle = brazo.getColorEstructura();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * escala);

        ctx.fillRect(inicioX, y, anchoBrazo, espesor);
        ctx.strokeRect(inicioX, y, anchoBrazo, espesor);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(inicioX, y + 3 * escala, anchoBrazo, 4 * escala);

        ctx.restore();
    }

    public dibujarConector(ctx: CanvasRenderingContext2D, conector: Conector): void {
        ctx.save();
        const escala = conector.getEscala();
        const anchoConector = conector.getAncho();
        const altoConector = conector.getAlto();
        const xConector = conector.getX();
        const yConector = conector.getY();

        ctx.fillStyle = conector.getColorEstructura();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, 2 * escala);

        ctx.fillRect(xConector, yConector, anchoConector, altoConector);
        ctx.strokeRect(xConector, yConector, anchoConector, altoConector);

        // Eslabones de cadena para reforzar el aspecto de pieza extensible
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = Math.max(1, 1.5 * escala);
        const eslabon = 18 * escala;
        for (let y = yConector + eslabon; y < yConector + altoConector; y += eslabon) {
            ctx.beginPath();
            ctx.moveTo(xConector, y);
            ctx.lineTo(xConector + anchoConector, y);
            ctx.stroke();
        }

        ctx.restore();
    }

    public dibujarCabezal(ctx: CanvasRenderingContext2D, cabezal: Cabezal): void {
        const s = cabezal.getEscala();
        const anchoCabezal = cabezal.getAncho();
        const altoCabezal = cabezal.getAlto();
        const xCabezal = cabezal.getX();
        const yCabezal = cabezal.getY();

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 8 * s;
        ctx.shadowOffsetY = 4 * s;

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(xCabezal, yCabezal, anchoCabezal, altoCabezal, [8 * s, 8 * s, 4 * s, 4 * s]);
        } else {
            ctx.rect(xCabezal, yCabezal, anchoCabezal, altoCabezal);
        }
        ctx.fillStyle = cabezal.getColorGarra();
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.strokeStyle = cabezal.getColorGarraOscuro();
        ctx.stroke();

        ctx.fillStyle = cabezal.getColorGarraClaro();
        ctx.fillRect(xCabezal + 10 * s, yCabezal + 4 * s, anchoCabezal - 20 * s, 4 * s);

        ctx.restore();
    }

    public dibujarPinzasSolas(ctx: CanvasRenderingContext2D, pinzas: Pinzas): void {
        const s = pinzas.getEscala();
        const altoCabezal = pinzas.getAltoCabezal();
        const xCabezal = pinzas.getXCabezal();
        const yCabezal = pinzas.getYCabezal();
        const xDer = pinzas.getXDer();

        ctx.save();

        // Pinza Izquierda
        ctx.beginPath();
        ctx.moveTo(xCabezal, yCabezal + altoCabezal);
        ctx.lineTo(xCabezal, yCabezal + altoCabezal + 55 * s);
        ctx.lineTo(xCabezal + 25 * s, yCabezal + altoCabezal + 68 * s);
        ctx.lineTo(xCabezal + 25 * s, yCabezal + altoCabezal + 50 * s);
        ctx.lineTo(xCabezal + 20 * s, yCabezal + altoCabezal);
        ctx.closePath();

        ctx.fillStyle = pinzas.getColorGarra();
        ctx.fill();
        ctx.strokeStyle = pinzas.getColorGarraOscuro();
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.stroke();

        ctx.fillStyle = pinzas.getColorGarraOscuro();
        ctx.fillRect(xCabezal + 3 * s, yCabezal + altoCabezal + 4 * s, 3 * s, 46 * s);

        // Pinza Derecha
        ctx.beginPath();
        ctx.moveTo(xDer, yCabezal + altoCabezal);
        ctx.lineTo(xDer, yCabezal + altoCabezal + 55 * s);
        ctx.lineTo(xDer - 25 * s, yCabezal + altoCabezal + 68 * s);
        ctx.lineTo(xDer - 25 * s, yCabezal + altoCabezal + 50 * s);
        ctx.lineTo(xDer - 20 * s, yCabezal + altoCabezal);
        ctx.closePath();

        ctx.fillStyle = pinzas.getColorGarra();
        ctx.fill();
        ctx.strokeStyle = pinzas.getColorGarraOscuro();
        ctx.lineWidth = Math.max(1, 2.5 * s);
        ctx.stroke();

        ctx.fillStyle = pinzas.getColorGarraOscuro();
        ctx.fillRect(xDer - 6 * s, yCabezal + altoCabezal + 4 * s, 3 * s, 46 * s);

        // Pernos / remaches mecánicos
        ctx.fillStyle = pinzas.getColorPernos();
        ctx.beginPath();
        ctx.arc(xCabezal + 14 * s, yCabezal + 15 * s, 4 * s, 0, Math.PI * 2);
        ctx.arc(xDer - 14 * s, yCabezal + 15 * s, 4 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    public dibujarGarraGris(ctx: CanvasRenderingContext2D, cabezal: Cabezal, pinzas: Pinzas): void {
        this.dibujarCabezal(ctx, cabezal);
        this.dibujarPinzasSolas(ctx, pinzas);
    }
}
