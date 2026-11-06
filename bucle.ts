import { IPantalla, ISincronizadorPOC, IDibujarPOC } from './interfaces';
import { Mapa } from './mapa';
import { PuntoSujecion } from './puntoSujecion';
import { ControlesNavegacion } from './controlesNavegacion';
import { Calculos } from './calculos';
import { POC } from './poc';
import { HUD } from './hud';
import { SincronizadorPOC } from './sincronizadorPOC';
import { DibujarPOC } from './dibujarPOC';
import { DeltaTiempo } from './deltaTiempo';
import { DibujarMapa } from './dibujarMapa';

export class Bucle {
    private pantalla: IPantalla;
    private mapa: Mapa;
    private puntoSujecion: PuntoSujecion;
    private controles: ControlesNavegacion;
    private hud: HUD;
    private sincronizadorPOC: ISincronizadorPOC;
    private dibujadorPOC: IDibujarPOC;
    private deltaTiempo: DeltaTiempo;
    private dibujadorMapa: DibujarMapa;

    private calculos: Calculos | null = null;
    private ejecutando: boolean = false;

    constructor(
        pantalla: IPantalla,
        mapa: Mapa,
        puntoSujecion: PuntoSujecion,
        controles: ControlesNavegacion,
        hud: HUD,
        sincronizadorPOC: ISincronizadorPOC = new SincronizadorPOC(),
        dibujadorPOC: IDibujarPOC = new DibujarPOC(),
        deltaTiempo: DeltaTiempo = new DeltaTiempo(),
        dibujadorMapa: DibujarMapa = new DibujarMapa()
    ) {
        this.pantalla = pantalla;
        this.mapa = mapa;
        this.puntoSujecion = puntoSujecion;
        this.controles = controles;
        this.hud = hud;
        this.sincronizadorPOC = sincronizadorPOC;
        this.dibujadorPOC = dibujadorPOC;
        this.deltaTiempo = deltaTiempo;
        this.dibujadorMapa = dibujadorMapa;
    }

    public setCalculos(calculos: Calculos | null): void {
        this.calculos = calculos;
        if (calculos === null) {
            this.puntoSujecion.reiniciar();
            this.mapa.setCamaraY(this.mapa.getMaxCamaraY());
        }
    }

    public getCalculos(): Calculos | null {
        return this.calculos;
    }

    public setPOC(objeto: Calculos | null): void {
        this.setCalculos(objeto);
    }

    public getPOC(): POC | null {
        return (this.calculos?.getPOC() as POC) ?? null;
    }

    public iniciar(): void {
        if (this.ejecutando) return;
        this.ejecutando = true;
        this.deltaTiempo.iniciar(performance.now());
        requestAnimationFrame(this.iterar);
    }

    public detener(): void {
        this.ejecutando = false;
    }

    private iterar = (timestamp: number): void => {
        if (!this.ejecutando) return;

        const dt = this.deltaTiempo.calcular(timestamp);

        const ctx = this.pantalla.getContext();
        const anchoPantalla = this.pantalla.getAncho();
        const altoPantalla = this.pantalla.getAlto();

        this.mapa.sincronizarConPantalla(anchoPantalla, altoPantalla);
        this.controles.actualizar();

        this.puntoSujecion.sincronizarConMapa(
            this.mapa.getCamaraY(),
            anchoPantalla,
            altoPantalla,
            this.mapa.getAltoTotal()
        );

        const sueloY = this.mapa.getAltoTotal() - this.puntoSujecion.getAltoBase();

        if (this.calculos) {
            const estado = this.calculos.getEstadoBola();
            if (estado.esSujeto()) {
                this.controles.setBloqueado(false);
                const pos = this.puntoSujecion.getPosicionSujecion();
                this.sincronizadorPOC.sincronizar(
                    this.calculos,
                    pos.x,
                    pos.y,
                    this.mapa.getCamaraY(),
                    sueloY,
                    this.puntoSujecion.getEscala()
                );
            } else if (estado.esCayendo()) {
                if (!this.puntoSujecion.isPosicionFijada()) {
                    this.puntoSujecion.fijarPosicionMundo();
                }

                this.controles.setBloqueado(true);
                this.calculos.actualizar(dt, sueloY);

                const targetCamaraY = this.calculos.getYMundo() - (altoPantalla * 0.45);
                if (targetCamaraY > this.mapa.getCamaraY()) {
                    this.mapa.setCamaraY(targetCamaraY);
                }
            } else if (estado.esDetenido() || estado.esEnSuelo()) {
                this.controles.setBloqueado(false);
            }
        } else {
            this.controles.setBloqueado(false);
        }

        this.hud.actualizar(dt, this.calculos);
        this.pantalla.limpiar();
        this.dibujadorMapa.dibujar(ctx, this.mapa);

        if (this.calculos) {
            this.dibujadorPOC.dibujar(ctx, this.calculos, this.mapa.getCamaraY());
        }

        this.hud.dibujar(ctx, anchoPantalla, this.calculos);

        requestAnimationFrame(this.iterar);
    };
}
