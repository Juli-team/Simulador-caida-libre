# Graph Report - Simulador-caida-libre  (2026-11-20)

## Corpus Check
- 25 files · ~11,688 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .jpg~ 1)

## Summary
- 307 nodes · 628 edges · 16 communities (7 shown, 9 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 94 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ae2cf61`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- bucle.ts
- IPOC
- EstadoBola
- POC
- Mapa
- ICalculos
- Pantalla
- EstadoBola
- .iterar
- DeltaTiempo
- compilerOptions
- package.json
- IEstadoBola
- Formulas
- Graphify Instructions
- ControlesNavegacion

## God Nodes (most connected - your core abstractions)
1. `POC` - 38 edges
2. `IPOC` - 36 edges
3. `EstadoBola` - 32 edges
4. `Mapa` - 31 edges
5. `Bucle` - 28 edges
6. `Calculos` - 27 edges
7. `PuntoSujecion` - 24 edges
8. `IEstadoBola` - 21 edges
9. `ICalculos` - 20 edges
10. `IFormulas` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `Bucle` --references--> `ControlesNavegacion`  [EXTRACTED]
  bucle.ts → controlesNavegacion.ts
- `Bucle` --references--> `DeltaTiempo`  [EXTRACTED]
  bucle.ts → deltaTiempo.ts
- `Bucle` --references--> `DibujarMapa`  [EXTRACTED]
  bucle.ts → dibujarMapa.ts
- `Bucle` --references--> `HUD`  [EXTRACTED]
  bucle.ts → hud.ts

## Import Cycles
- 3-file cycle: `bucle.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`
- 4-file cycle: `bucle.ts -> mano.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`

## Communities (16 total, 9 thin omitted)

### Community 0 - "bucle.ts"
Cohesion: 0.10
Nodes (22): DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, PIXELES_POR_METRO, URLS_IMAGENES, Evaluación — Juli-team/Simulador-caida-libre, Simulador de Caída Libre Entry Point, IActualizable (+14 more)

### Community 2 - "EstadoBola"
Cohesion: 0.15
Nodes (3): Bucle, Calculos, ControladorSimulacion

### Community 5 - "ICalculos"
Cohesion: 0.17
Nodes (3): DibujarPOC, ICalculos, IDibujarPOC

### Community 8 - ".iterar"
Cohesion: 0.12
Nodes (4): HUD, IPantalla, Mano, PuntoSujecion

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

### Community 15 - "ControlesNavegacion"
Cohesion: 0.18
Nodes (3): ControlesNavegacion, IControlSujecion, INavegable

## Knowledge Gaps
- **3 isolated node(s):** `Calidad POO/SOLID Badge Summary`, `Simulador de Caída Libre Entry Point`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 128 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POC` connect `POC` to `bucle.ts`, `IPOC`, `EstadoBola`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **What connects `Calidad POO/SOLID Badge Summary`, `Simulador de Caída Libre Entry Point`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bucle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10359408033826638 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `bucle.ts`, `EstadoBola`, `POC`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.07087486157253599 - nodes in this community are weakly interconnected._
- **Why does `EstadoBola` connect `EstadoBola` to `bucle.ts`, `IPOC`, `EstadoBola`, `Mapa`, `.iterar`, `IEstadoBola`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `POC` be split into smaller, more focused modules?**
  _Cohesion score 0.07311827956989247 - nodes in this community are weakly interconnected._