# Graph Report - Simulador-caida-libre  (2026-11-05)

## Corpus Check
- 32 files · ~14,605 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .jpg~ 1)

## Summary
- 407 nodes · 877 edges · 17 communities (6 shown, 11 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 161 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f4d7cc7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- IPOC
- EstadoBola
- POC
- .iterar
- ControladorSimulacion
- ICalculos
- Garra
- ControlesNavegacion
- Pinzas
- compilerOptions
- package.json
- IEstadoBola
- Formulas
- Graphify Instructions
- Calculos
- Conector

## God Nodes (most connected - your core abstractions)
1. `Garra` - 53 edges
2. `POC` - 38 edges
3. `IPOC` - 36 edges
4. `EstadoBola` - 33 edges
5. `Mapa` - 31 edges
6. `Bucle` - 27 edges
7. `Calculos` - 23 edges
8. `IEstadoBola` - 21 edges
9. `ICalculos` - 20 edges
10. `Pinzas` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Bucle` --references--> `Garra`  [EXTRACTED]
  bucle.ts → Garra/garra.ts
- `ControladorSimulacion` --references--> `Garra`  [EXTRACTED]
  controladorSimulacion.ts → Garra/garra.ts
- `EstadoBola` --references--> `Garra`  [EXTRACTED]
  estadoBola.ts → Garra/garra.ts
- `Garra` --implements--> `IActualizable`  [EXTRACTED]
  Garra/garra.ts → interfaces.ts
- `Garra` --implements--> `IControlGarra`  [EXTRACTED]
  Garra/garra.ts → interfaces.ts

## Import Cycles
- 3-file cycle: `bucle.ts -> calculos.ts -> estadoBola.ts -> bucle.ts`

## Hyperedges (group relationships)
- **God Classes (SRP Violations)** — bucle, calculos, controladorsimulacion, controlesnavegacion, garra, mapa, poc [EXTRACTED 1.00]
- **High Coupling (CBO) Cluster** — bucle, calculos, controladorsimulacion, controlesnavegacion, formulas, garra, hud, mapa [EXTRACTED 1.00]

## Communities (17 total, 11 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.09
Nodes (26): Bucle, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, PIXELES_POR_METRO, DeltaTiempo, DibujarMapa, URLS_IMAGENES (+18 more)

### Community 4 - ".iterar"
Cohesion: 0.08
Nodes (3): IPantalla, Mapa, Pantalla

### Community 7 - "Garra"
Cohesion: 0.07
Nodes (5): BaseSuelo, BrazoHorizontal, DibujarGarra, Garra, Pieza1

### Community 8 - "ControlesNavegacion"
Cohesion: 0.18
Nodes (4): ControlesNavegacion, IActualizable, IControlGarra, INavegable

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

## Knowledge Gaps
- **3 isolated node(s):** `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 139 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Garra` connect `Garra` to `main.ts`, `IPOC`, `EstadoBola`, `.iterar`, `ControladorSimulacion`, `ControlesNavegacion`, `Pinzas`, `Conector`?**
  _High betweenness centrality (0.297) - this node is a cross-community bridge._
- **What connects `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08735150244584207 - nodes in this community are weakly interconnected._
- **Why does `POC` connect `POC` to `main.ts`, `IPOC`, `Calculos`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.07560975609756097 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `main.ts`, `POC`, `Calculos`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **Should `EstadoBola` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._