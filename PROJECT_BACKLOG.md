
#### Evolución del Lenguaje de Directivas (LDD)
Las directivas no son comandos estáticos, sino la sintaxis de un lenguaje de colaboración en evolución. Su desarrollo se proyecta en tres fases acumulativas:

- **Fase 1: El Léxico Actual (Control y Claridad):** El estado actual, donde las directivas actúan como "interruptores" para forzar la adherencia al protocolo y controlar el comportamiento inmediato del Agente (ej. `[ENFORCE: PATCH_ONLY]`).
- **Fase 2: La Sintaxis Expandida (Inyección de Conocimiento):** El siguiente paso, donde las directivas aceptan parámetros para ejecutar tareas complejas con una sola instrucción (ej. `[LOAD_CONTEXT: <file_path>]`, `[DEFINE_PHENOMENON: <ID>]`).
- **Fase 3: El Lenguaje Semántico (Orquestación):** El horizonte paradigmático, donde las directivas se convierten en bloques estructurados que describen flujos de trabajo completos, permitiendo al Director declarar una meta de alto nivel y al Agente orquestar la secuencia de tareas para alcanzarla (ej. `[START_CYCLE: <ID>] { ... }`).


### SOP: Evolución del Vyvia Dialogue Workbench (Cabina de Mando Cognitiva)
*El Workbench no es una herramienta estática, sino el hardware que co-evoluciona con nuestro Lenguaje de Directivas (software) para reducir la carga cognitiva y elevar el nivel de abstracción.*

- **Fase 1: Constructor de Directivas (Presente):** El Workbench evoluciona para incluir una "Paleta de Comandos", permitiendo al Director seleccionar directivas en lugar de escribirlas, y configurarlas si aceptan parámetros.
- **Fase 2: Constructor Personalizable (Inmediato):** Se añade la capacidad para que el Director defina, guarde y gestione sus propias directivas personalizadas directamente desde la interfaz, utilizando el `localStorage` del navegador para la persistencia.
- **Fase 3: Orquestador de Ciclos (Estratégico):** La UI se expande con "Asistentes de Tarea" (wizards) que guían al Director a través de flujos de trabajo complejos (ej. "Iniciar Ciclo de Fenómeno"), generando automáticamente Metadirectivas completas.
- **Fase 4: El IDE Local-First (Paradigmático):** El Workbench trasciende de ser una página web a una aplicación local (ej. vía Node.js o Electron) residente en la raíz del proyecto. Esto desbloquea la interacción directa con el ecosistema:
  - **Visualización del Árbol de Archivos** en tiempo real.
  - **Gestión de Contexto Automatizada** (ejecución de `pack_context.py` con un clic).
  - **Terminal Integrada** (ejecución de comandos `git`).
  - **Orquestación Directa de Agentes Externos** (IA Codificadora).

