import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { geogebraPlotTool } from './tools/geogebra-plot.js';
import { geogebra3DTool } from './tools/geogebra-3d.js';
import { physicsSimTool } from './tools/physics-sim.js';
import { mermaidDiagramTool } from './tools/mermaid-diagram.js';

const app = express();
app.use(express.json());

// 创建 MCP Server
function createServer() {
  const server = new McpServer({
    name: 'librechat-study-tools',
    version: '1.0.0',
  });

  // 注册所有工具
  server.tool(
    geogebraPlotTool.name,
    geogebraPlotTool.description,
    geogebraPlotTool.inputSchema,
    geogebraPlotTool.handler
  );

  server.tool(
    geogebra3DTool.name,
    geogebra3DTool.description,
    geogebra3DTool.inputSchema,
    geogebra3DTool.handler
  );

  server.tool(
    physicsSimTool.name,
    physicsSimTool.description,
    physicsSimTool.inputSchema,
    physicsSimTool.handler
  );

  server.tool(
    mermaidDiagramTool.name,
    mermaidDiagramTool.description,
    mermaidDiagramTool.inputSchema,
    mermaidDiagramTool.handler
  );

  return server;
}

// 处理 MCP 请求
app.post('/mcp', async (req, res) => {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on('close', () => {
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
});

// SSE 端点
app.get('/mcp', async (req, res) => {
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed.' },
    id: null,
  }));
});

app.delete('/mcp', async (req, res) => {
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'Method not allowed.' },
    id: null,
  }));
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', name: 'librechat-study-tools' });
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});
