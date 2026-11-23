import { IMenu, IValoresConfiguracion, IPantalla, IFormulas, IDibujarPOC } from './interfaces';
import { Constantes, PIXELES_POR_METRO, GRAVEDAD_DEFECTO } from './constantes';
import { POC } from './poc';
import { Calculos } from './calculos';
import { Mapa } from './mapa';
import { PuntoSujecion } from './puntoSujecion';
import { Bucle } from './bucle';
import { EstadoBola } from './estadoBola';

/**
 * Clase Menu
 * Responsabilidad única (SRP):
 * Recibir los valores tipeados/seleccionados en DibujarMenu y actualizarlos en sus
 * respectivas clases (POC, Constantes, DibujarPOC, Mapa, Bucle).
 */
export class Menu implements IMenu {
    private bucle: Bucle;
    private mapa: Mapa;
    private puntoSujecion: PuntoSujecion;
    private formulas: IFormulas;
    private dibujadorPOC: IDibujarPOC;
    private pantalla: IPantalla;
    private estadoBola: EstadoBola;

    private abierto: boolean = false;

    // Valores por defecto basados en el estado inicial de las clases
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
        bucle: Bucle,
        mapa: Mapa,
        puntoSujecion: PuntoSujecion,
        formulas: IFormulas,
        dibujadorPOC: IDibujarPOC,
        pantalla: IPantalla,
        estadoBola?: EstadoBola
    ) {
        this.bucle = bucle;
        this.mapa = mapa;
        this.puntoSujecion = puntoSujecion;
        this.formulas = formulas;
        this.dibujadorPOC = dibujadorPOC;
        this.pantalla = pantalla;
        this.estadoBola = estadoBola ?? new EstadoBola('sujeto', puntoSujecion, mapa, formulas, pantalla.getCanvas(), bucle);

        this.sincronizarValoresIniciales();
    }

    private sincronizarValoresIniciales(): void {
        const pocActual = this.bucle.getPOC();
        if (pocActual) {
            this.valores.alturaInicial = Math.round(pocActual.getAltura());
            this.valores.masa = pocActual.getMasa();
            this.valores.radio = Math.min(100, pocActual.getRadio());
            this.valores.coeficienteArrastre = pocActual.getCoeficienteArrastre();
        }
        this.valores.gravedad = Constantes.getGravedad();
        this.valores.imagenSeleccionada = this.dibujadorPOC.getIndiceImagen ? this.dibujadorPOC.getIndiceImagen() : 1;
    }

    public abrir(): void {
        this.abierto = true;
    }

    public cerrar(): void {
        this.abierto = false;
    }

    public alternar(): void {
        this.abierto = !this.abierto;
    }

    public estaAbierto(): boolean {
        return this.abierto;
    }

    public getValores(): IValoresConfiguracion {
        return { ...this.valores };
    }

    public setValores(nuevos: Partial<IValoresConfiguracion>): void {
        this.valores = { ...this.valores, ...nuevos };
    }

    /**
     * Al cambiar la altura inicial, el mapa sube o baja indicando el límite de altura del mismo.
     * @param altura Altura deseada en metros
     */
    public actualizarAlturaInicial(altura: number): void {
        const alturaNum = Math.max(0, isNaN(altura) ? 0 : altura);
        this.valores.alturaInicial = alturaNum;

        const altoTotal = this.mapa.getAltoTotal();
        const altoBase = this.puntoSujecion.getAltoBase();
        const sueloY = altoTotal - altoBase;
        const maxAlturaMetros = sueloY / PIXELES_POR_METRO;

        const alturaEfectiva = Math.min(alturaNum, maxAlturaMetros);
        const yObjetivo = sueloY - (alturaEfectiva * PIXELES_POR_METRO);

        const targetCamaraY = Math.max(
            0,
            Math.min(this.mapa.getMaxCamaraY(), yObjetivo - this.mapa.getAltoVisible() / 2)
        );
        this.mapa.setCamaraY(targetCamaraY);
    }

    public getLimiteAlturaMapa(): number {
        const altoTotal = this.mapa.getAltoTotal();
        const altoBase = this.puntoSujecion.getAltoBase();
        const sueloY = altoTotal - altoBase;
        return Number((sueloY / PIXELES_POR_METRO).toFixed(1));
    }

    /**
     * Recibe los valores tipeados/seleccionados en DibujarMenu y los actualiza en su respectiva clase:
     * 1. altura inicial -> poc
     * 2. masa -> poc
     * 3. radio -> poc (máximo de 100)
     * 4. coeficiente de arrastre -> poc
     * 5. gravedad -> constantes
     * 6. imagen que se dibuja -> dibujarpoc
     * Reinicia la simulación y cierra el menú.
     */
    public aplicarCambios(nuevosValores: IValoresConfiguracion): void {
        this.valores = { ...nuevosValores };

        // 1 a 4. Actualizar en POC mediante la creación / reinicio de la entidad
        const radio = Math.min(100, Math.max(1, Math.round(nuevosValores.radio)));
        const masa = Math.max(0.001, nuevosValores.masa);
        const cd = Math.max(0, nuevosValores.coeficienteArrastre);
        const alturaInicial = Math.max(0, nuevosValores.alturaInicial);

        // 5. Actualizar gravedad en Constantes
        Constantes.setGravedad(nuevosValores.gravedad);

        // 6. Actualizar imagen en DibujarPOC
        this.dibujadorPOC.cambiarImagen(nuevosValores.imagenSeleccionada);

        // Reiniciar la simulación con los nuevos parámetros
        this.reiniciarSimulacion(alturaInicial, masa, radio, cd);

        // Cerrar el menú
        this.cerrar();
    }

    private reiniciarSimulacion(
        alturaInicial: number,
        masa: number,
        radio: number,
        coeficienteArrastre: number
    ): void {
        // Limpiar el estado previo
        this.bucle.setCalculos(null);

        const poc = new POC(alturaInicial, 0, radio, masa, coeficienteArrastre);
        poc.setRadio(radio);
        poc.setMasa(masa);
        poc.setCoeficienteArrastre(coeficienteArrastre);
        poc.setAltura(alturaInicial);

        const altoTotal = this.mapa.getAltoTotal();
        const altoBase = this.puntoSujecion.getAltoBase();
        const sueloY = altoTotal - altoBase;
        const anchoPantalla = this.pantalla.getAncho();
        const escala = this.puntoSujecion.getEscala();
        const xMundo = anchoPantalla / 2;

        if (alturaInicial > 0) {
            const yMundo = sueloY - radio - (alturaInicial * PIXELES_POR_METRO);
            const nuevaBola = new Calculos(
                this.formulas,
                poc,
                xMundo,
                yMundo,
                alturaInicial,
                escala
            );
            nuevaBola.getEstadoBola().sujetar();
            this.puntoSujecion.fijarPosicionMundo();
            this.bucle.setCalculos(nuevaBola);

            const targetCamaraY = Math.max(
                0,
                Math.min(this.mapa.getMaxCamaraY(), yMundo - (this.pantalla.getAlto() * 0.45))
            );
            this.mapa.setCamaraY(targetCamaraY);
        } else {
            const bola = this.estadoBola.crearBolaEnSuelo(
                this.puntoSujecion,
                this.mapa,
                this.formulas,
                this.pantalla.getCanvas(),
                this.bucle
            );
            if (bola) {
                const p = bola.getPOC();
                p.setMasa(masa);
                p.setRadio(radio);
                p.setCoeficienteArrastre(coeficienteArrastre);
            }
            this.mapa.setCamaraY(this.mapa.getMaxCamaraY());
        }
    }
}

export { Menu as menu };
