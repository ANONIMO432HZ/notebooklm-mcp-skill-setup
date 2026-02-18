
# Skill Conector NotebookLM MCP

Este repositorio contiene el **Skill Conector para NotebookLM MCP**, una guía completa y herramienta para instalar, configurar y autenticar el servidor MCP de NotebookLM en tus agentes de IA (como Claude, Cursor, o Antigravity).

## ¿Qué es esto?

Este es un paquete `npm` que instala un archivo de "Skill" (`SKILL.md`) en tu entorno de agente. Este archivo proporciona al agente el conocimiento necesario para configurar el servidor [NotebookLM MCP Server](https://pypi.org/project/notebooklm-mcp-server/).

## Instalación

### Opción 1: Instalación con npm/npx (Recomendado)

**Instalación Global:**

```bash
npm install -g notebooklm-mcp-skill-setup
```

Luego ejecuta el instalador interactivo:

```bash
notebooklm
```

**O sin instalar globalmente (usando npx):**

```bash
npx notebooklm-mcp-skill-setup
```

El asistente te guiará a través del proceso y te preguntará si deseas instalar el skill a nivel de **Proyecto** o **Global**.

### Opción 2: Instalación con curl (Sin npm)

Para usuarios que no tienen Node.js/npm instalado.

**En Linux/macOS (bash):**

```bash
mkdir -p ~/.agent/skills/notebooklm-mcp
curl -o ~/.agent/skills/notebooklm-mcp/SKILL.md \
  https://raw.githubusercontent.com/tu-usuario/notebooklm-mcp-skill-setup/main/SKILL.md
```

**En Windows (PowerShell):**

```powershell
$path = "$($env:USERPROFILE)\.agent\skills\notebooklm-mcp"
New-Item -ItemType Directory -Force -Path $path
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/ANONIMO432HZ/notebooklm-mcp-skill-setup/main/SKILL.md" `
  -OutFile "$path\SKILL.md"
```

**Nota:** Reemplaza `tu-usuario` con el usuario de GitHub donde está alojado el repositorio.

### Opción 3: Instalación Manual

1. Descarga el archivo `SKILL.md` desde este repositorio.
2. Colócalo en: `~/.agent/skills/notebooklm-mcp/SKILL.md` (global) o `./.agent/skills/notebooklm-mcp/SKILL.md` (proyecto)
3. Recarga tu agente.

## Desinstalación

### Desinstalar el paquete npm

Si deseas desinstalar completamente el paquete:

```bash
npm uninstall -g notebooklm-mcp-skill-setup
```

O si lo instalaste con `npx` (no requiere desinstalación adicional).

### Desinstalar el skill del agente

Puedes desinstalar el skill de tu entorno ejecutando:

```bash
notebooklm
```

Y selecciona la opción **2. Desinstalar Skill** en el menú interactivo. Elige si deseas eliminarlo del nivel de **Proyecto** o **Global**.

## Uso

Una vez instalado, tu agente sabrá cómo:
1.  Instalar el paquete Python `notebooklm-mcp-server`.
2.  Configurar tu archivo `mcp_config.json`.
3.  Autenticarse con Google NotebookLM (incluyendo solución de problemas comunes).

## Requisitos

- **Node.js**: Para ejecutar el instalador `npx`.
- **Python 3.10+**: Para el servidor MCP que el agente instalará.
- Un Agente de IA o Cliente MCP compatible.

## Metadatos para GitHub

Si estás alojando esto en GitHub, puedes usar los siguientes detalles:

**Descripción:**
> Integra NotebookLM con tu agente de IA usando el protocolo MCP. Incluye instalación interactiva y guías de configuración en español.

**Topics:**
`mcp-server`, `notebooklm`, `ai-agent`, `mcp-skill`, `python`, `rag`, `llm-tools`, `google-notebooklm`, `spanish`

## Licencia

MIT
