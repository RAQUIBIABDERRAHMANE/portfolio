import { createServer } from '../../../../mcp/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import db from '@/lib/sqlite';

// Vercel Serverless requires force-dynamic to keep the connection streaming
export const dynamic = 'force-dynamic';

const sessionTransports = new Map<string, WebStandardStreamableHTTPServerTransport>();

async function authenticate(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);

  // 1. Check regular users table
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE api_key = ?',
    args: [token]
  });

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  // 2. Check admin_settings (admin user has no row in users table)
  try {
    const adminResult = await db.execute({
      sql: "SELECT value FROM admin_settings WHERE key = 'api_key'",
      args: []
    });
    if (adminResult.rows.length > 0 && adminResult.rows[0].value === token) {
      // Return a synthetic admin user object
      return { id: 0, email: process.env.ADMIN_EMAIL ?? 'admin', role: 'admin', api_key: token };
    }
  } catch {
    // admin_settings table might not exist yet — that's fine
  }

  return null;
}

export async function GET(req: Request) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const sessionId = req.headers.get('mcp-session-id');
    if (!sessionId) {
      return new Response('Bad Request: Missing mcp-session-id header for GET stream', { status: 400 });
    }

    const t = sessionTransports.get(sessionId);
    if (!t) {
      return new Response('Session not found', { status: 404 });
    }

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

    let t: WebStandardStreamableHTTPServerTransport;
    const sessionId = req.headers.get('mcp-session-id');

    if (sessionId) {
      // Existing session
      const existing = sessionTransports.get(sessionId);
      if (!existing) {
        console.error(`Session lookup failed for: ${sessionId}. Available sessions:`, Array.from(sessionTransports.keys()));
        return new Response('Session not found', { status: 404 });
      }
      t = existing;
    } else {
      // New session initialization
      t = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: () => crypto.randomUUID(),
        onsessionclosed: (id: string) => {
          console.log(`Session closed: ${id}`);
          sessionTransports.delete(id);
        }
      });
      const s = createServer(user);
      s.connect(t).catch((err) => {
        console.error('Failed to connect transport to MCP server:', err);
      });
    }

    const response = await t.handleRequest(req);

    // If a session was just initialized, store it in the map
    if (!sessionId && t.sessionId) {
      console.log(`Stored new session: ${t.sessionId}`);
      sessionTransports.set(t.sessionId, t);
    }

    return response;
  } catch (error: any) {
    return new Response(`Error in MCP POST: ${error.message}`, { status: 500 });
  }
}
