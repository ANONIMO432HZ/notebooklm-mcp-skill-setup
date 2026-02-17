---
name: "NotebookLM MCP Connector"
description: "Comprehensive guide to install, configure, and authenticate the NotebookLM MCP server, including automatic and manual methods."
---

# NotebookLM MCP Connector Skill

This Skill details the procedure to integrate **NotebookLM** as an MCP server into your AI assistant. It allows access to your notebooks, sources, and perform RAG queries directly from your development environment.

## 1. Installation

The server is distributed as a Python package. Ensure you have Python 3.10+ installed.

```bash
pip install notebooklm-mcp-server
```

This will install two main executables:
- `notebooklm-mcp`: The MCP server.
- `notebooklm-mcp-auth`: The authentication tool.

## 2. Configuration in `mcp_config.json`

Add the following configuration to your `mcp_config.json` file (usually in `~/.gemini/antigravity/` or similar, depending on your MCP client).

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

> **Note:** If using a virtual environment (venv), ensure the `command` points to the absolute path of the executable within the venv, or activate the environment before launching the client.

## 3. Authentication (Crucial Step)

Authentication is necessary to access your private data. There are two methods.

### Method A: Automatic (Recommended if it works)

Try running the automatic authentication command. This will open a controlled Chrome browser to extract cookies.

```bash
notebooklm-mcp-auth
```

**If you see a `Handshake status 403 Forbidden` error**, it means the browser is blocking the remote debugging connection. in that case, use **Method B**.

---

### Method B: Manual (Foolproof)

This method involves manually extracting cookies from your browser session and passing them to the authentication tool.

**Steps:**

1.  Open [NotebookLM](https://notebooklm.google.com/) in your browser (Chrome/Edge).
2.  Open **Developer Tools** (`F12` or `Ctrl+Shift+I`).
3.  Go to the **Network** tab.
4.  In the filter, type: `batchexecute`.
5.  Interact with the page (e.g., refresh or open a notebook) to generate traffic.
6.  Click on one of the `batchexecute` requests that appear.
7.  In the details panel (right), go to **Request Headers**.
8.  Find the `cookie:` field.
9.  Right-click on the cookie value and select **Copy value**.
10. Create a local file in your project root named `cookies.txt` and paste usage content.
11. Run the following command in your terminal:

```bash
notebooklm-mcp-auth --file cookies.txt
```

If everything is correct, you will see:
`Auth tokens cached to C:\Users\YOUR_USER\.notebooklm-mcp\auth.json`

> **Security:** Once finished, you can delete the `cookies.txt` file.

## 4. Verification

To confirm the connection works before using it in chat, use this Python script:

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

## 5. Troubleshooting Common Issues

*   **UnicodeEncodeError on Windows:**
    *   *Symptom:* Error printing titles with emojis or special characters to the console.
    *   *Solution:* Set environment variable `PYTHONIOENCODING=utf-8` or handle encoding explicitly in test scripts.
*   **Error 403 in `notebooklm-mcp-auth`:**
    *   *Cause:* Chrome security restrictions for local WebSocket connections.
    *   *Solution:* Use Method B (Manual) described above.
*   **Expired Tokens:**
    *   If after some time (days/weeks) it stops working, repeat the authentication process (Step 3).

## 6. Installation via Curl (Skill Only)

To quickly install this skill into your agent's skills directory:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/notebooklm-mcp-skill/main/SKILL.md -o .agent/skills/notebooklm-mcp/SKILL.md --create-dirs
```

## 7. Package Info

This skill relies on the Python package:
`notebooklm-mcp-server`
[PyPI Link](https://pypi.org/project/notebooklm-mcp-server/)
