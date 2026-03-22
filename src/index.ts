import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { geogebraPlotTool } from './tools/geogebra-plot.js';
import { geogebra3DTool } from './tools/geogebra-3d.js';
import { physicsSimTool } from './tools/physics-sim.js';
import { mermaidDiagramTool } from './tools/mermaid-diagram.js';

// 创建 MCP Server
const server = new McpServer({
  name: 'librechat-study-tools',
  version: '1.0.0',
});

// 注册 GeoGebra 2D 绘图工具
server.tool(
  geogebraPlotTool.name,
  geogebraPlotTool.description,
  geogebraPlotTool.inputSchema,
  geogebraPlotTool.handler
);

// 注册 GeoGebra 3D 绘图工具
server.tool(
  geogebra3DTool.name,
  geogebra3DTool.description,
  geogebra3DTool.inputSchema,
  geogebra3DTool.handler
);

// 注册物理模拟工具
server.tool(
  physicsSimTool.name,
  physicsSimTool.description,
  physicsSimTool.inputSchema,
  physicsSimTool.handler
);

// 注册 Mermaid 图表工具
server.tool(
  mermaidDiagramTool.name,
  mermaidDiagramTool.description,
  mermaidDiagramTool.inputSchema,
  mermaidDiagramTool.handler
);

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LibreChat Study Tools MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
