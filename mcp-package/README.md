# Portfolio MCP Server

![Version](https://img.shields.io/npm/v/@raquibiabderrahmane/portfolio-mcp.svg)
![License](https://img.shields.io/npm/l/@raquibiabderrahmane/portfolio-mcp.svg)

This package contains the [Model Context Protocol (MCP)](https://modelcontextprotocol.github.io/sdk/) server for the personal portfolio. It acts as an integration point to connect AI Assistants (like Claude) directly to your portfolio's data, allowing them to retrieve analytics, messages, and edit content on your behalf using an API Key.

## Installation

You can run this package globally without installing it permanently via `npx`:

```bash
npx @raquibiabderrahmane/portfolio-mcp
```

Or install it globally:

```bash
npm install -g @raquibiabderrahmane/portfolio-mcp
```

## Configuration for Claude Desktop

To connect this local MCP Server Proxy to your deployed Portfolio, you must add it to the Claude Desktop JSON configuration.

1. Generate an API Key via your Portfolio's Admin Dashboard.
2. Edit Claude's configuration file:
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

3. Set up the `mcpServers` section:

```json
{
  "mcpServers": {
    "my-portfolio": {
      "command": "npx",
      "args": [
        "-y",
        "@raquibiabderrahmane/portfolio-mcp"
      ],
      "env": {
        "MCP_API_KEY": "YOUR_GENERATED_API_KEY",
        "PORTFOLIO_URL": "https://votre-domaine.com"
      }
    }
  }
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MCP_API_KEY` | Secure key granted from your user dashboard. | Yes |
| `PORTFOLIO_URL` | The base URL of your deployed Next.js portfolio. Defaults to `http://localhost:3000` if not specified. | Optional for local dev / Required for Prod |


## Author

[Raquibi Abderrahmane](https://github.com/RAQUIBIABDERRAHMANE)

## License

MIT
