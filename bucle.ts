import { IPantalla } from './interfaces';
import { Mapa } from './mapa';
import { Garra } from './garra';
import { ControlesNavegacion } from './controlesNavegacion';
import { Calculos } from './calculos';
import { POC } from './poc';
import { HUD } from './hud';

export class Bucle {
    private pantalla: IPantalla;
    private mapa: Mapa;
    private garra: Garra;
    private controles: ControlesNavegacion;
    private hud: HUD;

    private calculos: Calculos | null = null;
    private ejecutando: boolean = false;
    private ultimoTimestamp: number = 0;

    constructor(
        pantalla: IPantalla,
        mapa: Mapa,
        garra: Garra,
        controles: ControlesNavegacion,
        hud: HUD
    ) {
        this.pantalla = pantalla;
        this.mapa = mapa;
        this.garra = garra;
        this.controles = controles;
        this.hud = hud;
    }

    public setCalculos(calculos: Calculos | null): void {
        this.calculos = calculos;
        if (calculos === null) {
            // Reinicio: baja la base/cámara al suelo y devuelve la garra a su estado inicial
            this.garra.reiniciar();
            this.mapa.setCamaraY(this.mapa.getMaxCamaraY());
        }
    }

    public getCalculos(): Calculos | null {
        return this.calculos;
    }

    // Compatibilidad con el getter y setter del objeto físico POC
    public setPOC(objeto: Calculos | null): void {
        this.setCalculos(objeto);
    }

    public getPOC(): POC | null {
        return (this.calculos?.getPOC() as POC) ?? null;
    }

    public iniciar(): void {
        if (this.ejecutando) return;
        this.ejecutando = true;
        this.ultimoTimestamp = performance.now();
        requestAnimationFrame(this.iterar);
    }

    public detener(): void {
        this.ejecutando = false;
    }

    private iterar = (timestamp: number): void => {
        if (!this.ejecutando) return;

        // Cálculo de delta time seguro en segundos
        const dt = Math.min((timestamp - this.ultimoTimestamp) / 1000, 0.1);
        this.ultimoTimestamp = timestamp;

        const ctx = this.pantalla.getContext();
        const anchoPantalla = this.pantalla.getAncho();
        const altoPantalla = this.pantalla.getAlto();

        // 1. Sincronizar dimensiones con la pantalla
        this.mapa.sincronizarConPantalla(anchoPantalla, altoPantalla);

        // 2. Entrada de navegación (W/S desplaza la cámara antes de dibujar)
        this.controles.actualizar();

        // 3. Sincronizar la garra con la cámara ya actualizada
        this.garra.sincronizarConMapa(
            this.mapa.getCamaraY(),
            anchoPantalla,
            altoPantalla,
            this.mapa.getAltoTotal()
        );
        this.garra.actualizar();

        const sueloY = this.mapa.getAltoTotal() - this.garra.getAltoBase();

        // 4. Gestionar cinemática y cámara según estado del objeto en Calculos
        if (this.calculos) {
            if (this.calculos.esSujeto()) {
                this.controles.setBloqueado(false);
                const posSujecion = this.garra.getPosicionSujecion();
                this.calculos.sincronizarConGarra(
                    posSujecion.x,
                    posSujecion.y,
                    this.mapa.getCamaraY(),
                    sueloY,
                    this.garra.getEscala()
                );
            } else if (this.calculos.esCayendo()) {
                // Al caer la pelota, la garra queda fija en el mundo y no sigue la caída
                if (!this.garra.isPosicionFijada()) {
                    this.garra.fijarPosicionMundo();
                }

                this.controles.setBloqueado(true);
                this.calculos.actualizar(dt, sueloY);

                // Seguimiento fluido de la cámara mientras cae la bola
                const targetCamaraY = this.calculos.getYMundo() - (altoPantalla * 0.45);
                if (targetCamaraY > this.mapa.getCamaraY()) {
                    this.mapa.setCamaraY(targetCamaraY);
                }
            } else if (this.calculos.esDetenido() || this.calculos.esEnSuelo()) {
                this.controles.setBloqueado(false);
            }
        } else {
            this.controles.setBloqueado(false);
        }

        // 5. Actualizar HUD
        this.hud.actualizar(dt, this.calculos);

        // 6. Limpiar pantalla
        this.pantalla.limpiar();

        // 7. Dibujar en capas ordenadas:
        // Capa A: Mapa de fondo con degradado y cotas de altura
        this.mapa.dibujar(ctx);

        // Capa B: Garra y Bola sujeta / cayendo
        if (this.calculos && this.calculos.esSujeto()) {
            // Dibujar estructura y cabezal de la garra
            this.garra.dibujarSoporteYCabezal(ctx);
            // Dibujar esfera
            this.calculos.dibujar(ctx, this.mapa.getCamaraY());
            // Dibujar pinzas por delante de la esfera (efecto de sujeción real)
            this.garra.dibujarDedosPinzas(ctx);
        } else {
            // Garra completa
            this.garra.dibujar(ctx);
            // Esfera cayendo o detenida en el suelo
            if (this.calculos) {
                this.calculos.dibujar(ctx, this.mapa.getCamaraY());
            }
        }

        // Capa D: Telemetría arriba a la derecha (HUD)
        this.hud.dibujar(ctx, anchoPantalla, this.calculos);

        requestAnimationFrame(this.iterar);
    };
}
