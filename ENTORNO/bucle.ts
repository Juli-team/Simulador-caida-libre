import { IPantalla } from './interfaces';
import { Mapa } from './mapa';
import { Garra } from './garra';
import { ControlesNavegacion } from './controlesNavegacion';

export class Bucle {
    private pantalla: IPantalla;
    private mapa: Mapa;
    private garra: Garra;
    private controles: ControlesNavegacion;
    private ejecutando: boolean = false;

    constructor(
        pantalla: IPantalla,
        mapa: Mapa,
        garra: Garra,
        controles: ControlesNavegacion
    ) {
        this.pantalla = pantalla;
        this.mapa = mapa;
        this.garra = garra;
        this.controles = controles;
    }

    public iniciar(): void {
        if (this.ejecutando) return;
        this.ejecutando = true;
        this.iterar();
    }

    public detener(): void {
        this.ejecutando = false;
    }

    public iterar = (): void => {
        if (!this.ejecutando) return;

        const ctx = this.pantalla.getContext();
        const anchoPantalla = this.pantalla.getAncho();
        const altoPantalla = this.pantalla.getAlto();

        // 1. Sincronizar dimensiones con la pantalla
        this.mapa.sincronizarConPantalla(anchoPantalla, altoPantalla);
        this.controles.sincronizarConPantalla(anchoPantalla, altoPantalla);

        // 2. Limpiar pantalla
        this.pantalla.limpiar();

        // 3. Actualizar controles interactivos
        this.controles.actualizar();

        // 4. Sincronizar y actualizar estado de la garra con la posición del mapa y dimensiones de pantalla
        this.garra.sincronizarConMapa(
            this.mapa.getCamaraY(),
            anchoPantalla,
            altoPantalla,
            this.mapa.getAltoTotal()
        );
        this.garra.actualizar();

        // 5. Dibujar capas en orden:
        // A) Mapa de fondo
        this.mapa.dibujar(ctx);

        // B) Garra y estructura con pieza 1
        this.garra.dibujar(ctx);

        // C) Controles de navegación en pantalla
        this.controles.dibujar(ctx);

        requestAnimationFrame(this.iterar);
    };
}
