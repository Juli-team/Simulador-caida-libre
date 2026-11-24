# Graph Report - Simulador-caida-libre  (2026-11-23)

## Corpus Check
- 28 files · ~18,722 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ttf 1, .jpg~ 1)

## Summary
- 394 nodes · 908 edges · 18 communities (8 shown, 10 thin omitted)
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 159 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `249957ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Evaluación — Juli-team/Simulador-caida-libre
- IPOC
- Bucle
- bucle.ts
- IDibujarMenu
- IMenu
- POC
- Mapa
- main.ts
- ICalculos
- compilerOptions
- package.json
- EstadoBola
- Menu
- Graphify Instructions
- IEstadoBola
- DeltaTiempo
- Simulador de Caída Libre Entry Point

## God Nodes (most connected - your core abstractions)
1. `POC` - 40 edges
2. `Bucle` - 39 edges
3. `IPOC` - 38 edges
4. `Mapa` - 38 edges
5. `EstadoBola` - 35 edges
6. `IMenu` - 31 edges
7. `Calculos` - 30 edges
8. `PuntoSujecion` - 29 edges
9. `DibujarMenu` - 28 edges
10. `IFormulas` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Calidad POO/SOLID Badge Summary` --references--> `Evaluación — Juli-team/Simulador-caida-libre`  [EXTRACTED]
  README.md → docs/EVALUACION.md
- `Calculos` --implements--> `ICalculos`  [EXTRACTED]
  código/física/calculos.ts → código/simulación/interfaces.ts
- `Calculos` --references--> `IEstadoBola`  [EXTRACTED]
  código/física/calculos.ts → código/simulación/interfaces.ts
- `Bucle` --references--> `Calculos`  [EXTRACTED]
  código/simulación/bucle.ts → código/física/calculos.ts
- `DibujarMenu` --references--> `IOpcionGravedad`  [EXTRACTED]
  código/simulación/dibujarMenu.ts → código/física/constantes.ts

## Import Cycles
- 2-file cycle: `código/física/calculos.ts -> código/simulación/estadoBola.ts -> código/física/calculos.ts`
- 2-file cycle: `código/simulación/dibujarMapa.ts -> código/simulación/mapa.ts -> código/simulación/dibujarMapa.ts`
- 3-file cycle: `código/física/calculos.ts -> código/simulación/estadoBola.ts -> código/simulación/bucle.ts -> código/física/calculos.ts`
- 4-file cycle: `código/física/calculos.ts -> código/simulación/estadoBola.ts -> código/simulación/bucle.ts -> código/simulación/mano.ts -> código/física/calculos.ts`

## Communities (18 total, 10 thin omitted)

### Community 1 - "IPOC"
Cohesion: 0.06
Nodes (3): Calculos, IFormulas, IPOC

### Community 2 - "Bucle"
Cohesion: 0.10
Nodes (5): Bucle, Impacto, IPantalla, Mano, PuntoSujecion

### Community 3 - "bucle.ts"
Cohesion: 0.13
Nodes (15): Constantes, DENSIDAD_AIRE_NIVEL_MAR, ESCALA_ALTURA_ATMOSFERICA, GRAVEDAD_DEFECTO, IOpcionGravedad, PIXELES_POR_METRO, URLS_IMAGENES, TipoInput (+7 more)

### Community 4 - "IDibujarMenu"
Cohesion: 0.10
Nodes (6): ControladorSimulacion, ControlesNavegacion, IActualizable, IControlSujecion, IDibujarMenu, INavegable

### Community 8 - "main.ts"
Cohesion: 0.08
Nodes (12): Formulas, bucle, controlador, controles, dibujadorMenuInstancia, formulas, hud, mapa (+4 more)

### Community 10 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noUnusedLocals (+6 more)

### Community 11 - "package.json"
Cohesion: 0.20
Nodes (11): devDependencies, typescript@^5.6.3, vite@^5.4.14, name, private, scripts, build, dev (+3 more)

### Community 13 - "Menu"
Cohesion: 0.17
Nodes (3): IDibujarPOC, IValoresConfiguracion, Menu

## Knowledge Gaps
- **4 isolated node(s):** `Evaluación — Juli-team/Simulador-caida-libre`, `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary`, `Graphify Instructions`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POC` connect `POC` to `IPOC`, `Bucle`, `bucle.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **What connects `Evaluación — Juli-team/Simulador-caida-libre`, `Simulador de Caída Libre Entry Point`, `Calidad POO/SOLID Badge Summary` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `IPOC` be split into smaller, more focused modules?**
  _Cohesion score 0.06334841628959276 - nodes in this community are weakly interconnected._
- **Why does `IPOC` connect `IPOC` to `bucle.ts`, `POC`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Should `Bucle` be split into smaller, more focused modules?**
  _Cohesion score 0.09639953542392567 - nodes in this community are weakly interconnected._
- **Why does `Bucle` connect `Bucle` to `IPOC`, `bucle.ts`, `IDibujarMenu`, `IMenu`, `Mapa`, `main.ts`, `EstadoBola`, `Menu`, `DeltaTiempo`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `bucle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12955465587044535 - nodes in this community are weakly interconnected._