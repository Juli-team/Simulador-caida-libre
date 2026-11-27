import {
    IConfiguracionMenu,
    IConstantes,
    IDibujarPOC,
    IOpcionGravedad,
    IValoresConfiguracion
} from './interfaces';
import { Constantes, GRAVEDAD_DEFECTO } from '../física/constantes';
import { GestorBola } from './gestorBola';

/**
 * Clase ConfiguracionMenu
 * Responsabilidad única (SRP):
 * Gestionar los valores configurables de la simulación y aplicarlos
 * sobre Constantes, DibujarPOC y GestorBola.
 */
export class ConfiguracionMenu implements IConfiguracionMenu {
    private dibujadorPOC: IDibujarPOC;
    private gestorBola: GestorBola;
    private readonly constantes: IConstantes;
    private valores: IValoresConfiguracion = {
        alturaInicial: 0,
        masa: 10,
        radio: 64,
        coeficienteArrastre: 0.47,
        gravedad: GRAVEDAD_DEFECTO,
        cuerpoCeleste: 'Tierra',
        imagenSeleccionada: 1
    };

    constructor(
        dibujadorPOC: IDibujarPOC,
        gestorBola: GestorBola,
        constantes: IConstantes = new Constantes()
    ) {
        this.dibujadorPOC = dibujadorPOC;
        this.gestorBola = gestorBola;
        this.constantes = constantes;
        this.sincronizarValoresIniciales();
    }

    private sincronizarValoresIniciales(): void {
        const pocActual = this.gestorBola.getPOCActual();
        if (pocActual) {
            this.valores.alturaInicial = Math.round(pocActual.getAltura());
            this.valores.masa = pocActual.getMasa();
            this.valores.radio = Math.min(100, pocActual.getRadio());
            this.valores.coeficienteArrastre = pocActual.getCoeficienteArrastre();
        }
        this.valores.gravedad = this.constantes.getGravedad();
        this.valores.imagenSeleccionada = this.dibujadorPOC.getIndiceImagen();
    }

    public getGravedadesDisponibles(): IOpcionGravedad[] {
        return this.constantes.getGravedadesDisponibles();
    }

    public getValores(): IValoresConfiguracion {
        return { ...this.valores };
    }

    public setValores(nuevos: Partial<IValoresConfiguracion>): void {
        this.valores = { ...this.valores, ...nuevos };
    }

    public actualizarAlturaInicial(altura: number): void {
        const alturaNum = Math.max(0, isNaN(altura) ? 0 : altura);
        this.valores.alturaInicial = alturaNum;
        this.gestorBola.enfocarAltura(alturaNum);
    }

    public getLimiteAlturaMapa(): number {
        return this.gestorBola.getLimiteAlturaMapa();
    }

    public aplicarCambios(nuevosValores: IValoresConfiguracion): void {
        this.valores = { ...nuevosValores };

        const radio = Math.min(100, Math.max(1, Math.round(nuevosValores.radio)));
        const masa = Math.max(0.001, nuevosValores.masa);
        const cd = Math.max(0, nuevosValores.coeficienteArrastre);
        const alturaInicial = Math.max(0, nuevosValores.alturaInicial);

        this.constantes.setGravedad(nuevosValores.gravedad);
        this.dibujadorPOC.cambiarImagen(nuevosValores.imagenSeleccionada);
        this.gestorBola.reiniciarConParametros(alturaInicial, masa, radio, cd);
    }
}
