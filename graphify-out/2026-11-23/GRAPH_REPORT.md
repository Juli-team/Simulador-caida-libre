# Graph Report - Simulador-caida-libre  (2026-11-23)

## Corpus Check
- 28 files · ~18,722 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ttf 1, .jpg~ 1)

## Summary
- 394 nodes · 909 edges · 16 communities (6 shown, 10 thin omitted)
- Extraction: 83% EXTRACTED · 17% INFERRED · 0% AMBIGUOUS · INFERRED: 159 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b5b7fc14`
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
4. `Mapa` - 36 edges
5. `EstadoBola` - 35 edges
6. `IMenu` - 31 edges
7. `Calculos` - 29 edges
8. `DibujarMenu` - 28 edges
9. `PuntoSujecion` - 27 edges
10. `Menu` - 23 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `DibujarMenu` --references--> `IOpcionGravedad`  [EXTRACTED]
  dibujarMenu.ts → constantes.ts
- `DibujarMenu` --implements--> `IDibujarMenu`  [EXTRACTED]
  dibujarMenu.ts → interfaces.ts
- `DibujarMenu` --references--> `IValoresConfiguracion`  [EXTRACTED]
  dibujarMenu.ts → interfaces.ts
- `DibujarPOC` --implements--> `IDibujarPOC`  [EXTRACTED]
  dibujarPOC.ts → interfaces.ts

## Import Cycles
- 2-file cycle: `dibujarMapa.ts -> mapa.ts -> dibujarMapa.ts`
- 3-file cycle: `bucle.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`
- 4-file cycle: `bucle.ts -> mano.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`

## Communities (16 total, 10 thin omitted)

### Community 0 - "bucle.ts"
Cohesion: 0.09
Nodes (29): Constantes, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, IOpcionGravedad, PIXELES_POR_METRO, URLS_IMAGENES, TipoInput (+21 more)

### Community 1 - "IPOC"
Cohesion: 0.07
Nodes (3): Calculos, IFormulas, IPOC

### Community 8 - "Bucle"
Cohesion: 0.07
Nodes (8): Bucle, DeltaTiempo, HUD, Impacto, IDibujarPOC, IPantalla, Mano, PuntoSujecion

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

### Community 15 - "IDibujarMenu"
Cohesion: 0.12
Nodes (4): ControladorSimulacion, ControlesNavegacion, IDibujarMenu, INavegable

## Knowledge Gaps
- **3 isolated node(s):** `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 139 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POC` connect `POC` to `bucle.ts`, `Bucle`, `IPOC`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `bucle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09084556254367575 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `bucle.ts`, `Bucle`, `POC`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.06612244897959184 - nodes in this community are weakly interconnected._
- **Why does `Bucle` connect `Bucle` to `bucle.ts`, `IPOC`, `IMenu`, `Mapa`, `Menu`, `EstadoBola`, `IDibujarMenu`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Should `IMenu` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._