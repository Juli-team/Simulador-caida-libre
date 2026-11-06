import { ICalculos, ISincronizadorGarra } from './interfaces';
import { PIXELES_POR_METRO } from './constantes';

/**
 * Clase SincronizadorGarra
 * Responsabilidad única (SRP):
 * Sincronizar la posición, radio y altura del objeto POC con la garra
 * mientras se encuentra sujeto.
 */
export class SincronizadorGarra implements ISincronizadorGarra {
    public sincronizarConGarra(
        calculos: ICalculos,
        xSujecionPantalla: number,
        ySujecionPantalla: number,
        camaraY: number,
        ySueloMundo: number,
        escala: number
    ): void {
        if (!calculos.getEstadoBola().esSujeto()) return;

        const radioVisual = Math.max(16, Math.round(26 * escala));
        const radioFisicoMetros = radioVisual / PIXELES_POR_METRO;
        const xMundo = xSujecionPantalla;
        const yMundo = camaraY + ySujecionPantalla;

        calculos.setRadioVisual(radioVisual);
        calculos.setPosicion(xMundo, yMundo);

        const yDetencion = ySueloMundo - radioVisual;
        const distanciaPx = Math.max(0, yDetencion - yMundo);
        const alturaMetros = distanciaPx / PIXELES_POR_METRO;

        const poc = calculos.getPOC();
        poc.setRadio(radioFisicoMetros);
        poc.setAltura(alturaMetros);
        poc.setVelocidad(0);
        poc.setTiempoCaida(0);
    }
}
