import { ICalculos, ISincronizadorPOC } from './interfaces';
import { PIXELES_POR_METRO } from '../física/constantes';

/**
 * Sincroniza la posición, radio y altura del POC con el punto de sujeción
 * mientras está sujeto al mouse.
 */
export class SincronizadorPOC implements ISincronizadorPOC {
    public sincronizar(
        calculos: ICalculos,
        xSujecionPantalla: number,
        ySujecionPantalla: number,
        camaraY: number,
        ySueloMundo: number,
        _escala: number
    ): void {
        if (!calculos.getEstadoBola().esSujeto()) return;

        const radio = calculos.getRadio();
        const xMundo = xSujecionPantalla;
        const yMundo = camaraY + ySujecionPantalla;

        calculos.setPosicion(xMundo, yMundo);

        const yDetencion = ySueloMundo - radio;
        const distanciaPx = Math.max(0, yDetencion - yMundo);
        const alturaMetros = distanciaPx / PIXELES_POR_METRO;

        const poc = calculos.getPOC();
        poc.setAltura(alturaMetros);
        poc.setVelocidad(0);
        poc.setTiempoCaida(0);
    }
}
