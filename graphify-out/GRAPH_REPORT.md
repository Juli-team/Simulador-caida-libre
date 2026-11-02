# Graph Report - Simulador-caida-libre  (2026-11-02)

## Corpus Check
- 32 files · ~14,001 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 404 nodes · 872 edges · 16 communities (7 shown, 9 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 161 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38a05910`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- IPOC
- EstadoBola
- POC
- .iterar
- Garra/garra.ts
- ICalculos
- Garra
- ControlesNavegacion
- Pinzas
- compilerOptions
- package.json
- Pantalla
- Formulas
- Graphify Instructions
- BaseSuelo

## God Nodes (most connected - your core abstractions)
1. `Garra` - 53 edges
2. `POC` - 38 edges
3. `IPOC` - 36 edges
4. `EstadoBola` - 33 edges
5. `Mapa` - 31 edges
6. `Bucle` - 27 edges
7. `Calculos` - 23 edges
8. `IEstadoBola` - 21 edges
9. `Pinzas` - 20 edges
10. `ICalculos` - 20 edges

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

## Communities (16 total, 9 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.11
Nodes (23): DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, PIXELES_POR_METRO, DibujarMapa, DibujarPOC, Evaluación — Juli-team/Simulador-caida-libre, Simulador de Caída Libre Entry Point (+15 more)

### Community 2 - "EstadoBola"
Cohesion: 0.05
Nodes (6): Bucle, Calculos, ControladorSimulacion, EstadoBola, EstadoPOC, IEstadoBola

### Community 4 - ".iterar"
Cohesion: 0.07
Nodes (4): DeltaTiempo, HUD, IPantalla, Mapa

### Community 7 - "Garra"
Cohesion: 0.08
Nodes (4): Conector, DibujarGarra, Garra, Pieza1

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 138 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Garra` connect `Garra` to `main.ts`, `IPOC`, `EstadoBola`, `.iterar`, `Garra/garra.ts`, `ControlesNavegacion`, `Pinzas`, `BaseSuelo`?**
  _High betweenness centrality (0.298) - this node is a cross-community bridge._
- **What connects `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11033681765389082 - nodes in this community are weakly interconnected._
- **Why does `POC` connect `POC` to `main.ts`, `IPOC`, `EstadoBola`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.07317073170731707 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `main.ts`, `EstadoBola`, `POC`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `EstadoBola` be split into smaller, more focused modules?**
  _Cohesion score 0.05084745762711865 - nodes in this community are weakly interconnected._