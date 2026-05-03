import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

async function run() {
  const apiKey = process.env.MCP_API_KEY;
  const remoteUrl = process.env.PORTFOLIO_URL
    ? `${process.env.PORTFOLIO_URL}/api/mcp`
    : "http://localhost:3000/api/mcp";

  if (!apiKey) {
    console.error("Error: MCP_API_KEY environment variable is required.");
    process.exit(1);
  }

  // --- Remote client (talks to the Next.js HTTP endpoint) ---
  const httpTransport = new StreamableHTTPClientTransport(new URL(remoteUrl), {
    requestInit: {
      headers: { Authorization: `Bearer ${apiKey}` },
    },
  });

  const remoteClient = new Client(
    { name: "portfolio-bridge-client", version: "1.0.2" },
    { capabilities: {} }
  );

  await remoteClient.connect(httpTransport);
  console.error(`Connected to remote MCP server at ${remoteUrl}`);

  // --- Local server (exposes tools/resources to Claude over stdio) ---
  const localServer = new Server(
    { name: "portfolio-mcp-raquibi", version: "1.0.2" },
    { capabilities: { tools: {}, resources: {} } }
  );

  // Proxy: list tools
  localServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return await remoteClient.listTools();
  });

  // Proxy: call tool
  localServer.setRequestHandler(CallToolRequestSchema, async (req) => {
    return await remoteClient.callTool({
      name: req.params.name,
      arguments: req.params.arguments ?? {},
    });
  });

  // Proxy: list resources
  localServer.setRequestHandler(ListResourcesRequestSchema, async () => {
    return await remoteClient.listResources();
  });

  // Proxy: read resource
  localServer.setRequestHandler(ReadResourceRequestSchema, async (req) => {
    return await remoteClient.readResource({ uri: req.params.uri });
  });

  // Start the stdio transport (this keeps the process alive)
  const stdioTransport = new StdioServerTransport();
  await localServer.connect(stdioTransport);

  // Exit cleanly when Claude closes the connection
  stdioTransport.onclose = async () => {
    await remoteClient.close();
    process.exit(0);
  };
}

run().catch((e) => {
  console.error("Bridge error:", e.message);
  process.exit(1);
});
