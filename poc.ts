import { IPOC, IResultadoCalculo } from './interfaces';


/**
 * Clase POC (Plain Object / Contenedor de Estado Físico)
 * Responsabilidad única (SRP): Almacenar y encapsular los datos y parámetros físicos del objeto:
 * - altura (y)
 * - velocidad inicial (v0)
 * - tiempo de caída (t)
 * - masa (m = 10 kg por defecto)
 * - radio del objeto en metros (r)
 * - coeficiente de arrastre (Cd = 0.47 por defecto)
 * - velocidad (v)
 * - aceleración neta (a), fuerza de arrastre (Fd) y densidad del aire (d).
 * Cumple con OCP, LSP e ISP a través de la interfaz IPOC.
 */
export class POC implements IPOC {
    private altura: number = 0;
    private velocidadInicial: number = 0;
    private tiempoCaida: number = 0;
    private masa: number = 10;
    private radio: number = 0.32;
    private coeficienteArrastre: number = 0.47;
    private velocidad: number = 0;
    private aceleracion: number = 0;
    private fuerzaArrastre: number = 0;
    private densidadAire: number = 0;

    constructor(
        altura: number = 0,
        velocidadInicial: number = 0,
        radio: number = 0.32,
        masa: number = this.masa,
        coeficienteArrastre: number = this.coeficienteArrastre
    ) {
        this.altura = Math.max(0, altura);
        this.velocidadInicial = velocidadInicial;
        this.radio = Math.max(0.001, radio);
        this.masa = Math.max(0.001, masa);
        this.coeficienteArrastre = Math.max(0, coeficienteArrastre);
        this.velocidad = velocidadInicial;
        this.tiempoCaida = 0;
        this.aceleracion = 0;
        this.fuerzaArrastre = 0;
        this.densidadAire = 0;
    }

    public getAltura(): number {
        return this.altura;
    }

    public setAltura(altura: number): void {
        this.altura = Math.max(0, altura);
    }

    public getVelocidadInicial(): number {
        return this.velocidadInicial;
    }

    public setVelocidadInicial(v0: number): void {
        this.velocidadInicial = v0;
    }

    public getTiempoCaida(): number {
        return this.tiempoCaida;
    }

    public setTiempoCaida(t: number): void {
        this.tiempoCaida = Math.max(0, t);
    }

    public getMasa(): number {
        return this.masa;
    }

    public setMasa(m: number): void {
        this.masa = Math.max(0.001, m);
    }

    public getRadio(): number {
        return this.radio;
    }

    public setRadio(r: number): void {
        this.radio = Math.max(0.001, r);
    }

    public getCoeficienteArrastre(): number {
        return this.coeficienteArrastre;
    }

    public setCoeficienteArrastre(cd: number): void {
        this.coeficienteArrastre = Math.max(0, cd);
    }

    public getVelocidad(): number {
        return this.velocidad;
    }

    public setVelocidad(v: number): void {
        this.velocidad = v;
    }

    public getAceleracion(): number {
        return this.aceleracion;
    }

    public setAceleracion(a: number): void {
        this.aceleracion = a;
    }

    public getFuerzaArrastre(): number {
        return this.fuerzaArrastre;
    }

    public setFuerzaArrastre(fd: number): void {
        this.fuerzaArrastre = fd;
    }

    public getDensidadAire(): number {
        return this.densidadAire;
    }

    public setDensidadAire(d: number): void {
        this.densidadAire = d;
    }

    /**
     * Guarda en el objeto POC los resultados devueltos por la clase Cálculos.
     * @param resultado Resultados calculados en el frame actual
     */
    public guardarResultados(resultado: IResultadoCalculo): void {
        this.altura = resultado.altura;
        this.velocidad = resultado.velocidad;
        this.tiempoCaida = resultado.tiempoCaida;
        this.aceleracion = resultado.aceleracionNeta;
        this.fuerzaArrastre = resultado.fuerzaArrastre;
        this.densidadAire = resultado.densidadAire;
    }

    // Métodos de compatibilidad y alias con el contrato IPOC
    public getH0(): number {
        return this.altura;
    }

    public setH0(h0: number): void {
        this.setAltura(h0);
    }

    public getV0(): number {
        return this.velocidadInicial;
    }

    public setV0(v0: number): void {
        this.setVelocidadInicial(v0);
    }

    public getT(): number {
        return this.tiempoCaida;
    }

    public setT(t: number): void {
        this.setTiempoCaida(t);
    }

    public getV(): number {
        return this.velocidad;
    }

    public setV(v: number): void {
        this.setVelocidad(v);
    }
}
