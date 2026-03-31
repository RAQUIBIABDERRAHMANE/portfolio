import { server } from '../../../../mcp/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

// Vercel Serverless requires force-dynamic to keep the connection streaming
export const dynamic = 'force-dynamic';

let transport: WebStandardStreamableHTTPServerTransport;

function getTransport() {
  if (!transport) {
    // Initialiser le transport avec les options par défaut
    transport = new WebStandardStreamableHTTPServerTransport();
    // Connecter le serveur MCP existant à ce transport Web
    server.connect(transport).catch((err) => {
      console.error('Failed to connect transport to MCP server:', err);
    });
  }
  return transport;
}

export async function GET(req: Request) {
  try {
    const t = getTransport();
    return await t.handleRequest(req);
  } catch (error: any) {
    return new Response(`Error in MCP GET: ${error.message}`, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const t = getTransport();
    return await t.handleRequest(req);
  } catch (error: any) {
    return new Response(`Error in MCP POST: ${error.message}`, { status: 500 });
  }
}
