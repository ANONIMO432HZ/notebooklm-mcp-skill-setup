---
name: "NotebookLM MCP Connector"
description: "Guía completa para instalar, configurar y autenticar el servidor MCP de NotebookLM, incluyendo métodos automáticos y manuales."
---

# NotebookLM MCP Connector Skill

Este Skill detalla el procedimiento para integrar **NotebookLM** como un servidor MCP en tu asistente de IA. Permite acceder a tus libretas, fuentes y realizar consultas RAG directamente desde el entorno de desarrollo.

## 1. Instalación

El servidor se distribuye como un paquete de Python. Asegúrate de tener Python 3.10+ instalado.

```bash
pip install notebooklm-mcp-server
```

Esto instalará dos ejecutables principales:
- `notebooklm-mcp`: El servidor MCP.
- `notebooklm-mcp-auth`: La herramienta de autenticación.

## 2. Configuración en `mcp_config.json`

Añade la siguiente configuración a tu archivo `mcp_config.json` (usualmente en `~/.gemini/antigravity/` o similar, dependiendo de tu cliente MCP).

```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "notebooklm-mcp",
      "args": []
    }
  }
}
```

> **Nota:** Si usas un entorno virtual (venv), asegúrate de que el `command` apunte a la ruta absoluta del ejecutable dentro del venv, o activa el entorno antes de lanzar el cliente.

## 3. Autenticación (Paso Crucial)

La autenticación es necesaria para acceder a tus datos privados. Existen dos métodos.

### Método A: Automático (Recomendado si funciona)

Intenta ejecutar el comando de autenticación automática. Esto abrirá un navegador Chrome controlado para extraer las cookies.

```bash
notebooklm-mcp-auth
```

**Si ves un error `Handshake status 403 Forbidden`**, significa que el navegador está bloqueando la conexión de depuración remota. En ese caso, usa el **Método B**.

---

### Método B: Manual (Infalible)

Este método implica extraer manualmente las cookies de tu sesión de navegador y pasarlas a la herramienta de autenticación.

**Pasos:**

1.  Abre [NotebookLM](https://notebooklm.google.com/) en tu navegador (Chrome/Edge).
2.  Abre las **Herramientas de Desarrollador** (`F12` o `Ctrl+Shift+I`).
3.  Ve a la pestaña **Network** (Red).
4.  En el filtro, escribe: `batchexecute`.
5.  Interactúa con la página (ej. refresca o abre una libreta) para generar tráfico.
6.  Haz clic en una de las peticiones `batchexecute` que aparezcan.
7.  En el panel de detalles (derecha), ve a **Request Headers** (Cabeceras de solicitud).
8.  Busca el campo `cookie:`.
9.  Haz clic derecho sobre el valor de la cookie y selecciona **Copy value** (Copiar valor).
10. Crea un archivo local en la raiz de tu proyecto llamado `cookies.txt` y pega el contenido.
11. Ejecuta el siguiente comando en tu terminal:

```bash
notebooklm-mcp-auth --file cookies.txt
```

Si todo es correcto, verás:
`Auth tokens cached to C:\Users\TU_USUARIO\.notebooklm-mcp\auth.json`

> **Seguridad:** Una vez finalizado, puedes borrar el archivo `cookies.txt`.

## 4. Verificación

Para confirmar que la conexión funciona antes de usarla en el chat, puedes usar este script de Python:

```python
from notebooklm_mcp.api_client import NotebookLMClient
from notebooklm_mcp.auth import load_cached_tokens
import sys

def main():
    try:
        tokens = load_cached_tokens()
        if not tokens:
            print("Error: No cached tokens found.")
            sys.exit(1)
            
        client = NotebookLMClient(cookies=tokens.cookies)
        notebooks = client.list_notebooks()
        print(f"--- SUCCESS: Found {len(notebooks)} notebooks ---")
        for nb in notebooks:
            # Encoding handling for Windows consoles
            title = nb.title.encode('utf-8', errors='replace').decode('utf-8', errors='replace')
            print(f"- {title} (ID: {nb.id})")
        client.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```

## 5. Solución de Problemas Comunes

*   **UnicodeEncodeError en Windows:**
    *   *Síntoma:* Error al imprimir títulos con emojis o caracteres especiales en la consola.
    *   *Solución:* Configurar la variable de entorno `PYTHONIOENCODING=utf-8` o manejar la codificación explícitamente en los scripts de prueba.
*   **Error 403 en `notebooklm-mcp-auth`:**
    *   *Causa:* Restricciones de seguridad de Chrome para conexiones WebSocket locales.
    *   *Solución:* Usar el Método B (Manual) descrito arriba.
*   **Tokens Expirados:**
    *   Si después de un tiempo (días/semanas) deja de funcionar, repite el proceso de autenticación (Paso 3).

## 6. Uso

Una vez configurado, puedes pedirle a tu asistente:
*   "Lista mis libretas de NotebookLM"
*   "Busca información sobre [tema] en mi libreta de [nombre]"
*   "Añade este recurso a la libreta X"
