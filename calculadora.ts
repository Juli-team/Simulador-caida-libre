import { Pantalla } from './pantalla';
import { IPOC } from './poc';
import { IFormulas } from './formulas';

export interface IDibujable {
    dibujar(): void;
}

/**
 * Clase Calculadora
 * Responsabilidad única (SRP): Dibujar en pantalla los 3 cuadros de la calculadora
 * de caída libre y gestionar la interacción del usuario para el ingreso de la altura (h0).
 * Respeta DIP al depender de las abstracciones IPOC e IFormulas.
 */
export class Calculadora implements IDibujable {
    private pantalla: Pantalla;
    private poc: IPOC;
    private formulas: IFormulas;

    // Dimensiones y posición de los cuadros
    private anchoCuadro: number = 440;
    private altoCuadro: number = 70;
    private espaciado: number = 20;

    // Estado del cuadro de entrada (Box 1)
    private textoEntrada: string = '';
    private estaActivo: boolean = false;
    private inputOculto: HTMLInputElement;

    constructor(pantalla: Pantalla, poc: IPOC, formulas: IFormulas) {
        this.pantalla = pantalla;
        this.poc = poc;
        this.formulas = formulas;

        // Si el POC ya trae un valor inicial de h0 > 0, lo cargamos
        if (this.poc.getH0() > 0) {
            this.textoEntrada = this.poc.getH0().toString();
            this.formulas.resolver(this.poc);
        }

        // Crear input HTML oculto para capturar teclado de forma robusta (incluyendo móviles y pegado)
        this.inputOculto = document.createElement('input');
        this.inputOculto.type = 'text';
        this.inputOculto.inputMode = 'decimal';
        this.inputOculto.style.position = 'fixed';
        this.inputOculto.style.opacity = '0';
        this.inputOculto.style.pointerEvents = 'none';
        this.inputOculto.style.left = '-9999px';
        this.inputOculto.style.top = '-9999px';
        document.body.appendChild(this.inputOculto);

        this.configurarEventos();
    }

    private configurarEventos(): void {
        const canvas = this.pantalla.getContext().canvas;

        // Evento de click para activar el primer cuadro
        canvas.addEventListener('click', (evento: MouseEvent) => {
            const coords = this.obtenerCoordenadasCanvas(canvas, evento);
            const cuadro1 = this.obtenerBoundsCuadro(0);

            if (this.estaDentro(coords.x, coords.y, cuadro1)) {
                this.estaActivo = true;
                this.inputOculto.value = this.textoEntrada;
                this.inputOculto.focus();
            } else {
                this.estaActivo = false;
                this.inputOculto.blur();
            }
        });

        // Evento de doble click como método alternativo por prompt
        canvas.addEventListener('dblclick', (evento: MouseEvent) => {
            const coords = this.obtenerCoordenadasCanvas(canvas, evento);
            const cuadro1 = this.obtenerBoundsCuadro(0);

            if (this.estaDentro(coords.x, coords.y, cuadro1)) {
                const valorPrompt = window.prompt(
                    'Ingrese la altura de un objeto en metros (número decimal):',
                    this.textoEntrada || '10'
                );
                if (valorPrompt !== null) {
                    this.procesarTextoIngresado(valorPrompt);
                }
            }
        });

        // Cambio de cursor según hover
        canvas.addEventListener('mousemove', (evento: MouseEvent) => {
            const coords = this.obtenerCoordenadasCanvas(canvas, evento);
            const cuadro1 = this.obtenerBoundsCuadro(0);

            if (this.estaDentro(coords.x, coords.y, cuadro1)) {
                canvas.style.cursor = 'text';
            } else {
                canvas.style.cursor = 'default';
            }
        });

        // Captura de texto mediante el input auxiliar
        this.inputOculto.addEventListener('input', () => {
            this.procesarTextoIngresado(this.inputOculto.value);
        });

        // Captura directa por teclado físico
        window.addEventListener('keydown', (evento: KeyboardEvent) => {
            if (!this.estaActivo) return;

            if (evento.key === 'Backspace') {
                this.procesarTextoIngresado(this.textoEntrada.slice(0, -1));
                evento.preventDefault();
            } else if (evento.key === 'Escape' || evento.key === 'Enter') {
                this.estaActivo = false;
                this.inputOculto.blur();
            } else if (/^[0-9]$/.test(evento.key)) {
                this.procesarTextoIngresado(this.textoEntrada + evento.key);
                evento.preventDefault();
            } else if (evento.key === '.' || evento.key === ',') {
                if (!this.textoEntrada.includes('.') && !this.textoEntrada.includes(',')) {
                    this.procesarTextoIngresado(this.textoEntrada + '.');
                }
                evento.preventDefault();
            }
        });
    }

    private procesarTextoIngresado(nuevoTexto: string): void {
        // Filtrar caracteres no numéricos excepto un punto o coma decimal
        let sanitizado = '';
        let tieneSeparador = false;

        for (const char of nuevoTexto) {
            if (/[0-9]/.test(char)) {
                sanitizado += char;
            } else if ((char === '.' || char === ',') && !tieneSeparador) {
                sanitizado += '.';
                tieneSeparador = true;
            }
        }

        this.textoEntrada = sanitizado;
        this.inputOculto.value = sanitizado;

        const alturaNumerica = parseFloat(this.textoEntrada);
        if (!isNaN(alturaNumerica) && alturaNumerica >= 0) {
            this.poc.setH0(alturaNumerica);
        } else {
            this.poc.setH0(0);
        }

        // Resolver fórmulas y actualizar el POC
        this.formulas.resolver(this.poc);
    }

    private obtenerCoordenadasCanvas(canvas: HTMLCanvasElement, evento: MouseEvent): { x: number; y: number } {
        const rect = canvas.getBoundingClientRect();
        const factorX = canvas.width / rect.width;
        const factorY = canvas.height / rect.height;
        return {
            x: (evento.clientX - rect.left) * factorX,
            y: (evento.clientY - rect.top) * factorY
        };
    }

    private obtenerBoundsCuadro(indice: number): { x: number; y: number; ancho: number; alto: number } {
        const anchoPantalla = this.pantalla.getAncho();
        const altoPantalla = this.pantalla.getAlto();
        const altoTotal = 3 * this.altoCuadro + 2 * this.espaciado;

        const x = (anchoPantalla - this.anchoCuadro) / 2;
        const inicioY = (altoPantalla - altoTotal) / 2;
        const y = inicioY + indice * (this.altoCuadro + this.espaciado);

        return { x, y, ancho: this.anchoCuadro, alto: this.altoCuadro };
    }

    private estaDentro(px: number, py: number, bounds: { x: number; y: number; ancho: number; alto: number }): boolean {
        return px >= bounds.x && px <= bounds.x + bounds.ancho &&
               py >= bounds.y && py <= bounds.y + bounds.alto;
    }

    /**
     * Dibuja los 3 cuadros en el centro de la pantalla uno encima del otro:
     * - Cuadro 1 (Blanco): Ingreso de altura inicial h0
     * - Cuadro 2 (Amarillo): Resultado de fórmula t = √(h0 : 1/2g)
     * - Cuadro 3 (Amarillo): Resultado de fórmula v = v0 - g.t
     */
    public dibujar(): void {
        const ctx = this.pantalla.getContext();

        // 1. Cuadro 1: Blanco (Entrada de altura h0)
        const bounds1 = this.obtenerBoundsCuadro(0);
        this.dibujarCuadro(ctx, bounds1, '#FFFFFF', this.estaActivo ? '#2563EB' : '#000000', this.estaActivo ? 3 : 2);

        // Texto Cuadro 1
        ctx.textAlign = 'center';
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('ALTURA INICIAL (h0 en metros)', bounds1.x + bounds1.ancho / 2, bounds1.y + 24);

        const parpadeoCursor = this.estaActivo && Math.floor(Date.now() / 500) % 2 === 0 ? '|' : '';
        ctx.fillStyle = '#111827';
        if (this.textoEntrada.length > 0) {
            ctx.font = 'bold 22px Courier New, monospace';
            ctx.fillText(`${this.textoEntrada}${parpadeoCursor} m`, bounds1.x + bounds1.ancho / 2, bounds1.y + 54);
        } else {
            if (this.estaActivo) {
                ctx.font = 'bold 22px Courier New, monospace';
                ctx.fillText(`0${parpadeoCursor} m`, bounds1.x + bounds1.ancho / 2, bounds1.y + 54);
            } else {
                ctx.font = 'italic 16px Arial, sans-serif';
                ctx.fillStyle = '#6B7280';
                ctx.fillText('[ Haz clic aquí para ingresar h0 ]', bounds1.x + bounds1.ancho / 2, bounds1.y + 52);
            }
        }

        // 2. Cuadro 2: Amarillo (Tiempo calculado)
        const bounds2 = this.obtenerBoundsCuadro(1);
        this.dibujarCuadro(ctx, bounds2, '#FFE600', '#000000', 2);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('TIEMPO DE CAÍDA:  t = √(h0 : 1/2g)', bounds2.x + bounds2.ancho / 2, bounds2.y + 24);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 22px Courier New, monospace';
        const tiempoFormateado = this.poc.getT().toFixed(3);
        ctx.fillText(`t = ${tiempoFormateado} s`, bounds2.x + bounds2.ancho / 2, bounds2.y + 54);

        // 3. Cuadro 3: Amarillo (Velocidad calculada)
        const bounds3 = this.obtenerBoundsCuadro(2);
        this.dibujarCuadro(ctx, bounds3, '#FFE600', '#000000', 2);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('VELOCIDAD FINAL:  v = v0 - g · t', bounds3.x + bounds3.ancho / 2, bounds3.y + 24);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 22px Courier New, monospace';
        const velocidadFormateada = this.poc.getV().toFixed(3);
        ctx.fillText(`v = ${velocidadFormateada} m/s`, bounds3.x + bounds3.ancho / 2, bounds3.y + 54);
    }

    private dibujarCuadro(
        ctx: CanvasRenderingContext2D,
        bounds: { x: number; y: number; ancho: number; alto: number },
        colorRelleno: string,
        colorBorde: string,
        grosorBorde: number
    ): void {
        const radio = 8;
        ctx.save();
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(bounds.x, bounds.y, bounds.ancho, bounds.alto, radio);
        } else {
            ctx.rect(bounds.x, bounds.y, bounds.ancho, bounds.alto);
        }
        ctx.fillStyle = colorRelleno;
        ctx.fill();
        ctx.lineWidth = grosorBorde;
        ctx.strokeStyle = colorBorde;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}
