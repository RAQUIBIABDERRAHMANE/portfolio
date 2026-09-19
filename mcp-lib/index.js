#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');
const fetch = require('node-fetch');

// On récupère la clé API de l'environnement
const apiKey = process.env.MCP_API_KEY;
const API_URL = process.env.PORTFOLIO_API_URL || 'https://votre-domaine.com/api/mcp';

if (!apiKey) {
  console.error("Erreur fatale : Variable d'environnement MCP_API_KEY manquante.");
  process.exit(1);
}

const server = new Server(
  {
    name: "portfolio-mcp-client",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

/**
 * Fonction helper pour appeler l'API centrale avec la clé de l'utilisateur
 */
async function callPortfolioApi(endpoint, dataBody = null) {
  const payload = dataBody ? { ...dataBody, action: endpoint } : { action: endpoint };
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MCP-API-KEY': apiKey
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Erreur API : ${response.statusText}`);
  }
  return data;
}

// 1. Lister les ressources disponibles
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  try {
    const data = await callPortfolioApi('resources');
    return { resources: data.resources };
  } catch (error) {
    return { resources: [] };
  }
});

// 2. Lire une ressource précise
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  try {
    const data = await callPortfolioApi('read-resource', { uri: request.params.uri });
    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "application/json",
        text: JSON.stringify(data.content, null, 2)
      }]
    };
  } catch (error) {
    throw new McpError(ErrorCode.InternalError, error.message);
  }
});

// 3. Lister les outils
server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    const data = await callPortfolioApi('tools');
    return { tools: data.tools };
  } catch (error) {
    return { tools: [] };
  }
});

// 4. Exécuter un outil
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const data = await callPortfolioApi('call-tool', { name, arguments: args });
    return { content: [{ type: 'text', text: JSON.stringify(data.result, null, 2) }] };
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Erreur: ${error.message}` }],
      isError: true
    };
  }
});

const run = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Portfolio MCP Client Bridge running on stdio");
};

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
