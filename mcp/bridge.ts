#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

async function run() {
    const apiKey = process.env.MCP_API_KEY;
    const remoteUrl = process.env.PORTFOLIO_URL ? `${process.env.PORTFOLIO_URL}/api/mcp` : "http://localhost:3000/api/mcp";

    if (!apiKey) {
        console.error("Error: MCP_API_KEY environment variable is required.");
        process.exit(1);
    }

    // Configure the remote connection to the Next.js server
    // Note: The SSEClientTransport opens a GET request expecting SSE events
    // and sends messages via POST back to the same endpoint (or standard endpoint).
    // The exact endpoint can be controlled by passing URL and init options.
    const sse = new SSEClientTransport(new URL(remoteUrl), {
        requestInit: {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        },
        eventSourceInit: {
            // Note: Use standard object for custom headers based on EventSource implementations 
            // though some fetch-based EventSources don't use headers property directly.
            // But since the current Node.js EventSource or sdk polyfill might:
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        } as any
    });

    const stdio = new StdioServerTransport();

    // Map the messages back and forth
    stdio.onmessage = async (msg) => {
        try {
            await sse.send(msg);
        } catch (e: any) {
            console.error("Failed to forward to remote:", e.message);
        }
    };

    sse.onmessage = async (msg) => {
        try {
            await stdio.send(msg);
        } catch (e: any) {
            console.error("Failed to forward to stdio:", e.message);
        }
    };

    sse.onerror = (err) => {
        console.error("Remote transport error:", err);
    };

    stdio.onerror = (err) => {
        console.error("Stdio transport error:", err);
    };

    sse.onclose = () => { process.exit(0); };
    stdio.onclose = () => { sse.close(); process.exit(0); };

    // Connect both transports
    await sse.start();
    console.error(`Connected to remote MCP server at ${remoteUrl}`);
}

run().catch(e => {
    console.error("Proxy error:", e.message);
    process.exit(1);
});
