
# Skill Conector NotebookLM MCP

Este repositorio contiene el **Skill Conector para NotebookLM MCP**, una guía completa y herramienta para instalar, configurar y autenticar el servidor MCP de NotebookLM en tus agentes de IA (como Claude, Cursor, o Antigravity).

## ¿Qué es esto?

Este es un paquete `npm` que instala un archivo de "Skill" (`SKILL.md`) en tu entorno de agente. Este archivo proporciona al agente el conocimiento necesario para configurar el servidor [NotebookLM MCP Server](https://pypi.org/project/notebooklm-mcp-server/).

## Instalación

Puedes instalar este skill de dos formas:

### Método 1: Vía `npx` (Interactivo - Recomendado)

Simplemente ejecuta este comando en tu terminal y sigue las instrucciones en pantalla (en español):

```bash
npx notebooklm-mcp-skill
```

El asistente te preguntará si deseas instalar el skill a nivel de **Proyecto** (en la carpeta actual) o a nivel **Global** (en tu directorio de usuario).

### Método 2: Manual

1. Descarga el archivo `SKILL.md` de este repositorio.
2. Colócalo en la carpeta de skills de tu agente (ej. `.agent/skills/notebooklm-mcp/SKILL.md`).
3. Recarga tu agente.

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
