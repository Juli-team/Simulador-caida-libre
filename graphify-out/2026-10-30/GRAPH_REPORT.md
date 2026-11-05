# Graph Report - Simulador-caida-libre  (2026-10-30)

## Corpus Check
- 22 files · ~9,916 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 2)

## Summary
- 308 nodes · 618 edges · 14 communities (5 shown, 9 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 97 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `38a05910`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.ts
- IPOC
- .iterar
- POC
- Garra
- ICalculos
- EstadoBola
- ControlesNavegacion
- IEstadoBola
- compilerOptions
- package.json
- Pantalla
- Formulas
- Graphify Instructions

## God Nodes (most connected - your core abstractions)
1. `POC` - 38 edges
2. `Garra` - 37 edges
3. `IPOC` - 36 edges
4. `Calculos` - 25 edges
5. `Mapa` - 22 edges
6. `Bucle` - 21 edges
7. `EstadoBola` - 21 edges
8. `IEstadoBola` - 21 edges
9. `ICalculos` - 21 edges
10. `ControladorSimulacion` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `Bucle` --references--> `ControlesNavegacion`  [EXTRACTED]
  bucle.ts → controlesNavegacion.ts
- `Bucle` --references--> `Garra`  [EXTRACTED]
  bucle.ts → garra.ts
- `Bucle` --references--> `HUD`  [EXTRACTED]
  bucle.ts → hud.ts
- `Bucle` --references--> `IDibujarPOC`  [EXTRACTED]
  bucle.ts → interfaces.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **God Classes (SRP Violations)** — bucle, calculos, controladorsimulacion, controlesnavegacion, garra, mapa, poc [EXTRACTED 1.00]
- **High Coupling (CBO) Cluster** — bucle, calculos, controladorsimulacion, controlesnavegacion, formulas, garra, hud, mapa [EXTRACTED 1.00]

## Communities (14 total, 9 thin omitted)

### Community 0 - "main.ts"
Cohesion: 0.10
Nodes (25): DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, PIXELES_POR_METRO, DibujarPOC, Evaluación — Juli-team/Simulador-caida-libre, HUD, Simulador de Caída Libre Entry Point (+17 more)

### Community 2 - ".iterar"
Cohesion: 0.07
Nodes (5): Bucle, Calculos, ControladorSimulacion, IPantalla, Mapa

### Community 8 - "ControlesNavegacion"
Cohesion: 0.16
Nodes (4): ControlesNavegacion, IActualizable, IControlGarra, INavegable

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

## Knowledge Gaps
- **3 isolated node(s):** `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 126 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POC` connect `POC` to `main.ts`, `IPOC`, `.iterar`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **What connects `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions` to the rest of the system?**
  _3 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10434782608695652 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `main.ts`, `.iterar`, `POC`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.07560975609756097 - nodes in this community are weakly interconnected._
- **Why does `Garra` connect `Garra` to `main.ts`, `ControlesNavegacion`, `.iterar`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `.iterar` be split into smaller, more focused modules?**
  _Cohesion score 0.07205387205387205 - nodes in this community are weakly interconnected._