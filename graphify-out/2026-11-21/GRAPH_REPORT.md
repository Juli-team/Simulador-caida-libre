# Graph Report - Simulador-caida-libre  (2026-11-21)

## Corpus Check
- 27 files · ~16,980 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .jpg~ 1)

## Summary
- 375 nodes · 854 edges · 16 communities (8 shown, 8 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 145 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `365b59d8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- bucle.ts
- IPOC
- IMenu
- POC
- Mapa
- ICalculos
- main.ts
- EstadoBola
- Bucle
- DeltaTiempo
- compilerOptions
- package.json
- IEstadoBola
- dibujarMenu.ts
- Graphify Instructions
- IDibujarMenu

## God Nodes (most connected - your core abstractions)
1. `POC` - 40 edges
2. `IPOC` - 36 edges
3. `Bucle` - 35 edges
4. `EstadoBola` - 35 edges
5. `Mapa` - 34 edges
6. `Calculos` - 29 edges
7. `IMenu` - 29 edges
8. `DibujarMenu` - 27 edges
9. `PuntoSujecion` - 27 edges
10. `IFormulas` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `Bucle` --references--> `Calculos`  [EXTRACTED]
  bucle.ts → calculos.ts
- `Bucle` --references--> `ControlesNavegacion`  [EXTRACTED]
  bucle.ts → controlesNavegacion.ts
- `Bucle` --references--> `DeltaTiempo`  [EXTRACTED]
  bucle.ts → deltaTiempo.ts
- `Bucle` --references--> `DibujarMapa`  [EXTRACTED]
  bucle.ts → dibujarMapa.ts

## Import Cycles
- 3-file cycle: `bucle.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`
- 4-file cycle: `bucle.ts -> mano.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`

## Communities (16 total, 8 thin omitted)

### Community 0 - "bucle.ts"
Cohesion: 0.15
Nodes (11): PIXELES_POR_METRO, URLS_IMAGENES, Evaluación — Juli-team/Simulador-caida-libre, HUD, IControlador, IDibujable, IResultadoCalculo, ISincronizadorPOC (+3 more)

### Community 1 - "IPOC"
Cohesion: 0.07
Nodes (3): Calculos, IFormulas, IPOC

### Community 6 - "main.ts"
Cohesion: 0.10
Nodes (12): Simulador de Caída Libre Entry Point, bucle, controlador, controles, dibujadorMenuInstancia, formulas, hud, mapa (+4 more)

### Community 8 - "Bucle"
Cohesion: 0.09
Nodes (6): Bucle, IDibujarPOC, IPantalla, IValoresConfiguracion, Menu, PuntoSujecion

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

### Community 13 - "dibujarMenu.ts"
Cohesion: 0.13
Nodes (8): Constantes, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, IOpcionGravedad, TipoInput, URLS_BOLAS, Formulas

### Community 15 - "IDibujarMenu"
Cohesion: 0.11
Nodes (6): ControladorSimulacion, ControlesNavegacion, IActualizable, IControlSujecion, IDibujarMenu, INavegable

## Knowledge Gaps
- **3 isolated node(s):** `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 138 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POC` connect `POC` to `bucle.ts`, `Bucle`, `IPOC`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **What connects `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bucle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14772727272727273 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `bucle.ts`, `Bucle`, `POC`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.06717687074829932 - nodes in this community are weakly interconnected._
- **Why does `EstadoBola` connect `EstadoBola` to `bucle.ts`, `IPOC`, `POC`, `Mapa`, `Bucle`, `IEstadoBola`, `IDibujarMenu`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `IMenu` be split into smaller, more focused modules?**
  _Cohesion score 0.12561576354679804 - nodes in this community are weakly interconnected._