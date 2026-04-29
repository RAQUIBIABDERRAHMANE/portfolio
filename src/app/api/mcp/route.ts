import { createServer } from '../../../../mcp/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import db from '@/lib/sqlite';

// Vercel Serverless requires force-dynamic to keep the connection streaming
export const dynamic = 'force-dynamic';

const userTransports = new Map<string, WebStandardStreamableHTTPServerTransport>();

async function authenticate(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE api_key = ?',
    args: [token]
  });
  
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0];
}

function getTransportForUser(user: any) {
  const userId = user.id.toString();
  if (!userTransports.has(userId)) {
    const t = new WebStandardStreamableHTTPServerTransport();
    const s = createServer(user);
    s.connect(t).catch((err) => {
      console.error('Failed to connect transport to MCP server:', err);
    });
    userTransports.set(userId, t);
  }
  return userTransports.get(userId)!;
}

export async function GET(req: Request) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const t = getTransportForUser(user);
    return await t.handleRequest(req);
  } catch (error: any) {
    return new Response(`Error in MCP GET: ${error.message}`, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const t = getTransportForUser(user);
    return await t.handleRequest(req);
  } catch (error: any) {
    return new Response(`Error in MCP POST: ${error.message}`, { status: 500 });
  }
}
