# Graph Report - Simulador-caida-libre  (2026-11-26)

## Corpus Check
- 30 files · ~19,472 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ttf 1, .jpg~ 1)

## Summary
- 416 nodes · 953 edges · 17 communities (10 shown, 7 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ad9d4f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Evaluación — Juli-team/Simulador-caida-libre
- IPantalla
- Impacto
- bucle.ts
- Bucle
- DibujarMenu
- POC
- Mapa
- main.ts
- dibujarMenu.ts
- compilerOptions
- package.json
- EstadoBola
- DibujarMapa
- Graphify Instructions
- ControladorSimulacion
- Simulador de Caída Libre Entry Point

## God Nodes (most connected - your core abstractions)
1. `Bucle` - 44 edges
2. `POC` - 37 edges
3. `Mapa` - 36 edges
4. `Calculos` - 35 edges
5. `EstadoBola` - 31 edges
6. `PuntoSujecion` - 26 edges
7. `ControlesNavegacion` - 23 edges
8. `GestorBola` - 22 edges
9. `IMenu` - 22 edges
10. `ControladorSimulacion` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `DibujarMenu` --implements--> `IDibujarMenu`  [EXTRACTED]
  código/simulación/dibujarMenu.ts → código/simulación/interfaces.ts
- `DibujarMenu` --references--> `IValoresConfiguracion`  [EXTRACTED]
  código/simulación/dibujarMenu.ts → código/simulación/interfaces.ts
- `Bucle` --references--> `Impacto`  [EXTRACTED]
  código/simulación/bucle.ts → código/simulación/impacto.ts
- `ControladorSimulacion` --references--> `Bucle`  [EXTRACTED]
  código/simulación/controladorSimulacion.ts → código/simulación/bucle.ts

## Import Cycles
- 2-file cycle: `código/física/calculos.ts -> código/simulación/estadoBola.ts -> código/física/calculos.ts`
- 2-file cycle: `código/simulación/dibujarMapa.ts -> código/simulación/mapa.ts -> código/simulación/dibujarMapa.ts`
- 3-file cycle: `código/física/calculos.ts -> código/simulación/estadoBola.ts -> código/simulación/bucle.ts -> código/física/calculos.ts`
- 4-file cycle: `código/física/calculos.ts -> código/simulación/estadoBola.ts -> código/simulación/bucle.ts -> código/simulación/mano.ts -> código/física/calculos.ts`

## Communities (17 total, 7 thin omitted)

### Community 1 - "IPantalla"
Cohesion: 0.10
Nodes (3): DeltaTiempo, Impacto, IPantalla

### Community 3 - "bucle.ts"
Cohesion: 0.09
Nodes (17): Constantes, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, PIXELES_POR_METRO, URLS_IMAGENES, HUD, ICalculos (+9 more)

### Community 4 - "Bucle"
Cohesion: 0.12
Nodes (6): ControlesNavegacion, IActualizable, IControlSujecion, IDibujarMenu, IMenu, INavegable

### Community 6 - "POC"
Cohesion: 0.05
Nodes (4): POC, ICondicionesInicialesPOC, IDinamicaAire, IPropiedadesCuerpo

### Community 7 - "Mapa"
Cohesion: 0.07
Nodes (7): Calculos, Bucle, GestorBola, IFormulas, IPOCFisico, Mapa, PuntoSujecion

### Community 8 - "main.ts"
Cohesion: 0.06
Nodes (15): Formulas, bucle, configuracionMenu, controlador, controles, dibujadorMenuInstancia, formulas, gestorBola (+7 more)

### Community 9 - "dibujarMenu.ts"
Cohesion: 0.11
Nodes (9): IOpcionGravedad, ConfiguracionMenu, Rect, TipoInput, DibujarPOC, URLS_BOLAS, ICuerpoEspacial, IDibujarPOC (+1 more)

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

### Community 12 - "EstadoBola"
Cohesion: 0.06
Nodes (5): EstadoBola, EstadoPOC, IConsultaEstadoBola, IControlEstadoBola, IEstadoBola

## Knowledge Gaps
- **4 isolated node(s):** `Evaluación — Juli-team/Simulador-caida-libre`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`, `Simulador de Caída Libre Entry Point`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 152 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Bucle` connect `Mapa` to `IPantalla`, `bucle.ts`, `Bucle`, `POC`, `main.ts`, `dibujarMenu.ts`, `EstadoBola`, `DibujarMapa`, `ControladorSimulacion`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **What connects `Evaluación — Juli-team/Simulador-caida-libre`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `IPantalla` be split into smaller, more focused modules?**
  _Cohesion score 0.09686609686609686 - nodes in this community are weakly interconnected._
- **Why does `POC` connect `POC` to `Impacto`, `bucle.ts`, `Mapa`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `bucle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08521870286576169 - nodes in this community are weakly interconnected._
- **Why does `Mapa` connect `Mapa` to `IPantalla`, `bucle.ts`, `Bucle`, `main.ts`, `EstadoBola`, `DibujarMapa`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Should `Bucle` be split into smaller, more focused modules?**
  _Cohesion score 0.1226890756302521 - nodes in this community are weakly interconnected._