import { IMenu } from './interfaces';

/**
 * Clase Menu
 * Responsabilidad única (SRP):
 * Gestionar únicamente el estado de visibilidad (abierto/cerrado) del panel de menú.
 */
export class Menu implements IMenu {
    private abierto: boolean = false;

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
}

export { Menu as menu };
