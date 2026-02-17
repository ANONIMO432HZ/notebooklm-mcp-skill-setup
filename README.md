
# NotebookLM MCP Connector Skill

This repository contains the **NotebookLM MCP Connector Skill**, a comprehensive guide to installing, configuring, and authenticating the NotebookLM MCP server for use with AI agents.

## What is this?

This is a "Skill" file (`SKILL.md`) designed for AI agents (like Claude, Gemini, etc.) that support skill/tool loading. It provides the agent with the knowledge to set up the [NotebookLM MCP Server](https://pypi.org/project/notebooklm-mcp-server/).

## Installation

### Method 1: Curl (Direct Download)

To install this skill into your agent's `.agent/skills` directory, run:

```bash
curl -fsSL https://raw.githubusercontent.com/ANONIMO432HZ/notebooklm-mcp-skill-setup/main/SKILL.md --create-dirs -o .agent/skills/notebooklm-mcp/SKILL.md
```

### Method 2: Manual Check

1. Copy the `SKILL.md` file.
2. Place it in your agent's skill directory (e.g., `.agent/skills/notebooklm-mcp/SKILL.md`).
3. Reload your agent.

## Usage

Once installed, your agent will know how to:
1.  Install the `notebooklm-mcp-server` Python package.
2.  Configure `mcp_config.json`.
3.  Authenticate with NotebookLM (including troubleshooting auth issues).

## Requirements

- Python 3.10+
- An AI Agent or MCP Client (e.g., Cursor, Claude Desktop, Antigravity)

## License

MIT
