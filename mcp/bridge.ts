import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

async function run() {
    const apiKey = process.env.MCP_API_KEY;
    const remoteUrl = process.env.PORTFOLIO_URL ? `${process.env.PORTFOLIO_URL}/api/mcp` : "http://localhost:3000/api/mcp";

    if (!apiKey) {
        console.error("Error: MCP_API_KEY environment variable is required.");
        process.exit(1);
    }

    // Configure the remote connection to the Next.js server
    const httpTransport = new StreamableHTTPClientTransport(new URL(remoteUrl), {
        requestInit: {
            headers: {
                "Authorization": `Bearer ${apiKey}`
            }
        }
    });

    const stdio = new StdioServerTransport();

    // Map the messages back and forth
    stdio.onmessage = async (msg) => {
        try {
            await httpTransport.send(msg);
        } catch (e: any) {
            console.error("Failed to forward to remote:", e.message);
        }
    };

    httpTransport.onmessage = async (msg) => {
        try {
            await stdio.send(msg);
        } catch (e: any) {
            console.error("Failed to forward to stdio:", e.message);
        }
    };

    httpTransport.onerror = (err) => {
        console.error("Remote transport error:", err);
    };

    stdio.onerror = (err) => {
        console.error("Stdio transport error:", err);
    };

    httpTransport.onclose = () => { process.exit(0); };
    stdio.onclose = () => { httpTransport.close(); process.exit(0); };

    // Connect both transports
    await httpTransport.start();
    console.error(`Connected to remote MCP server at ${remoteUrl}`);
}

run().catch(e => {
    console.error("Proxy error:", e.message);
    process.exit(1);
});
