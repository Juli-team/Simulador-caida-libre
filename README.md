SIMULADOR DE CAIDA LIBRE WEB
Como dice el título, es un simulador de física, de MRUV, que involucra, además de la gravedad, masa, coeficiente de arrastre, densidad del aire y fuerza de arrastre.
Consiste en recoger un objeto y tirarlo a una cierta altura en un mapa de aporximadamente 1,2km de alto.
La caída consiste en simplemente el objeto cambiando su posicion en y a lo largo del mapa con una cierta velocidad, la velocidad es calculada y cambia mediante cada frame utilizando:
La formula de la densidad del aire según la altura(que trabaja con la altura del objeto en ese frame)
El área del objeto(siempre esférico) segun el radio que se le defina
la Fuerza de arrastre del objeto, y la aceleración neta resultante que resta la gravedad con la fuerza de arrastre sobre la masa del objeto
Finalmente, con la nueva aceleración se calcula la velocidad utilizando también el tiempo medido a lo largo de la caída. Para mover el objeto por el mapa realmente, se utiliza una variable de escala que indica que 1 metro equivalen a 250 píxeles en el mapa.

El simulador cuenta con un menú de configuración que permite al usuario cambiar la masa del objeto, su radio, su coeficiente de arrastre, su altura inicial, y permite elegir las gravedades de distintos planetas. Además, permite cambiar la imagen del objeto, por si al usuario no le gusta usar la pelota de quico.
Como bonus, el simulador debería funcionar a cualquier resolución, escalando el tamaño del mapa y los objetos según la respolución del dispositivo en el que se use

<!-- calidad:inicio -->
![Calidad](https://img.shields.io/badge/Calidad-78%2F100-green) ![Aprobar](https://img.shields.io/badge/Aprobar-no-red) ![Destacar](https://img.shields.io/badge/Destacar-no-lightgrey) ![Duplicación lógica](https://img.shields.io/badge/Duplicaci%C3%B3n%20l%C3%B3gica-0.0%25-green) ![%POO](https://img.shields.io/badge/%25POO-97%25-green) ![Sueltas](https://img.shields.io/badge/Sueltas-0-green) ![Clases OK](https://img.shields.io/badge/Clases%20OK-12%2F47-green) ![S](https://img.shields.io/badge/S-2-orange) ![O](https://img.shields.io/badge/O-1-orange) ![L](https://img.shields.io/badge/L-0-green) ![I](https://img.shields.io/badge/I-0-green) ![D](https://img.shields.io/badge/D-3-orange)

**Calidad POO/SOLID (heurístico):** índice **78/100** · %POO **97%** · funciones sueltas **0** · clases OK **12** · aprobar **no (3/4)** · destacar **no**
Detalle completo en [`docs/EVALUACION.md`](docs/EVALUACION.md).
<!-- calidad:fin -->
