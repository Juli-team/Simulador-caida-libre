import { IPantalla } from './interfaces';
import { Mapa } from './mapa';
import { Garra } from './garra';
import { ControlesNavegacion } from './controlesNavegacion';
import { POC } from './poc';
import { Gravedad } from './gravedad';
import { HUD } from './hud';

export class Bucle {
    private pantalla: IPantalla;
    private mapa: Mapa;
    private garra: Garra;
    private controles: ControlesNavegacion;
    private gravedad: Gravedad;
    private hud: HUD;

    private poc: POC | null = null;
    private ejecutando: boolean = false;
    private ultimoTimestamp: number = 0;
    private camaraYAlSoltar: number | null = null;

    constructor(
        pantalla: IPantalla,
        mapa: Mapa,
        garra: Garra,
        controles: ControlesNavegacion,
        gravedad: Gravedad,
        hud: HUD
    ) {
        this.pantalla = pantalla;
        this.mapa = mapa;
        this.garra = garra;
        this.controles = controles;
        this.gravedad = gravedad;
        this.hud = hud;
    }

    public setPOC(poc: POC | null): void {
        this.poc = poc;
        if (poc === null) {
            this.garra.liberarPosicionMundo();
            if (this.camaraYAlSoltar !== null) {
                this.mapa.setCamaraY(this.camaraYAlSoltar);
                this.camaraYAlSoltar = null;
            }
        }
    }

    public getPOC(): POC | null {
        return this.poc;
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
        const sueloY = this.mapa.getAltoTotal() - this.garra.getAltoBase();

        // 1. Sincronizar dimensiones con la pantalla
        this.mapa.sincronizarConPantalla(anchoPantalla, altoPantalla);
        this.controles.sincronizarConPantalla(anchoPantalla, altoPantalla);
        this.garra.sincronizarConMapa(
            this.mapa.getCamaraY(),
            anchoPantalla,
            altoPantalla,
            this.mapa.getAltoTotal()
        );
        this.garra.actualizar();

        // 2. Gestionar cinemática y cámara según estado de la bola POC
        if (this.poc) {
            if (this.poc.esSujeto()) {
                this.controles.setBloqueado(false);
                const posSujecion = this.garra.getPosicionSujecion();
                this.poc.sincronizarConGarra(
                    posSujecion.x,
                    posSujecion.y,
                    this.mapa.getCamaraY(),
                    sueloY,
                    this.garra.getEscala()
                );
            } else if (this.poc.esCayendo()) {
                // Al caer la pelota, la garra queda fija en el mundo y no sigue la caída
                if (!this.garra.isPosicionFijada()) {
                    this.garra.fijarPosicionMundo();
                    this.camaraYAlSoltar = this.mapa.getCamaraY();
                }

                this.controles.setBloqueado(true);
                this.poc.actualizar(dt, sueloY, this.gravedad.getValor());

                // Seguimiento fluido de la cámara mientras cae la bola
                const targetCamaraY = this.poc.getYMundo() - (altoPantalla * 0.45);
                if (targetCamaraY > this.mapa.getCamaraY()) {
                    this.mapa.setCamaraY(targetCamaraY);
                }
            } else if (this.poc.esDetenido()) {
                this.controles.setBloqueado(false);
            }
        } else {
            this.controles.setBloqueado(false);
        }

        // 3. Actualizar controles interactivos y HUD
        this.controles.actualizar();
        this.hud.actualizar(dt, this.poc);

        // 4. Limpiar pantalla
        this.pantalla.limpiar();

        // 5. Dibujar en capas ordenadas:
        // Capa A: Mapa de fondo con degradado y cotas de altura
        this.mapa.dibujar(ctx);

        // Capa B: Garra y Bola sujeta / cayendo
        if (this.poc && this.poc.esSujeto()) {
            // Dibujar estructura y cabezal de la garra
            this.garra.dibujarSoporteYCabezal(ctx);
            // Dibujar esfera
            this.poc.dibujar(ctx, this.mapa.getCamaraY());
            // Dibujar pinzas por delante de la esfera (efecto de sujeción real)
            this.garra.dibujarDedosPinzas(ctx);
        } else {
            // Garra completa
            this.garra.dibujar(ctx);
            // Esfera cayendo o detenida en el suelo
            if (this.poc) {
                this.poc.dibujar(ctx, this.mapa.getCamaraY());
            }
        }

        // Capa C: Controles de navegación en pantalla
        this.controles.dibujar(ctx);

        // Capa D: Telemetría y fórmulas físicas arriba a la derecha (HUD)
        this.hud.dibujar(ctx, anchoPantalla, this.poc);

        requestAnimationFrame(this.iterar);
    };
}