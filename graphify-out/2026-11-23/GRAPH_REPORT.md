# Graph Report - Simulador-caida-libre  (2026-11-23)

## Corpus Check
- 28 files · ~17,985 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ttf 1, .jpg~ 1)

## Summary
- 387 nodes · 891 edges · 16 communities (7 shown, 9 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 156 edges (avg confidence: 0.85)
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
- Menu
- EstadoBola
- Bucle
- Pantalla
- compilerOptions
- package.json
- IEstadoBola
- Formulas
- Graphify Instructions
- IDibujarMenu

## God Nodes (most connected - your core abstractions)
1. `POC` - 40 edges
2. `IPOC` - 38 edges
3. `Bucle` - 37 edges
4. `EstadoBola` - 35 edges
5. `Mapa` - 34 edges
6. `IMenu` - 31 edges
7. `Calculos` - 29 edges
8. `DibujarMenu` - 28 edges
9. `PuntoSujecion` - 27 edges
10. `Menu` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `Bucle` --references--> `Calculos`  [EXTRACTED]
  bucle.ts → calculos.ts
- `Bucle` --references--> `ControlesNavegacion`  [EXTRACTED]
  bucle.ts → controlesNavegacion.ts
- `Bucle` --references--> `DibujarMapa`  [EXTRACTED]
  bucle.ts → dibujarMapa.ts
- `Bucle` --references--> `IDibujarMenu`  [EXTRACTED]
  bucle.ts → interfaces.ts

## Import Cycles
- 3-file cycle: `bucle.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`
- 4-file cycle: `bucle.ts -> mano.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`

## Communities (16 total, 9 thin omitted)

### Community 0 - "bucle.ts"
Cohesion: 0.10
Nodes (26): Constantes, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, PIXELES_POR_METRO, URLS_IMAGENES, Evaluación — Juli-team/Simulador-caida-libre, Simulador de Caída Libre Entry Point (+18 more)

### Community 1 - "IPOC"
Cohesion: 0.06
Nodes (3): Calculos, IFormulas, IPOC

### Community 6 - "Menu"
Cohesion: 0.12
Nodes (7): IOpcionGravedad, TipoInput, DibujarPOC, URLS_BOLAS, IDibujarPOC, IValoresConfiguracion, Menu

### Community 8 - "Bucle"
Cohesion: 0.08
Nodes (7): Bucle, DeltaTiempo, HUD, Impacto, IPantalla, Mano, PuntoSujecion

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

### Community 15 - "IDibujarMenu"
Cohesion: 0.10
Nodes (4): ControladorSimulacion, ControlesNavegacion, IDibujarMenu, INavegable

## Knowledge Gaps
- **3 isolated node(s):** `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 139 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POC` connect `POC` to `bucle.ts`, `IPOC`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **What connects `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bucle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09714285714285714 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `bucle.ts`, `POC`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.06334841628959276 - nodes in this community are weakly interconnected._
- **Why does `EstadoBola` connect `EstadoBola` to `bucle.ts`, `IPOC`, `POC`, `Mapa`, `Menu`, `Bucle`, `IEstadoBola`, `IDibujarMenu`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `IMenu` be split into smaller, more focused modules?**
  _Cohesion score 0.11491935483870967 - nodes in this community are weakly interconnected._