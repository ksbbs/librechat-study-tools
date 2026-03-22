import { z } from 'zod';
import type { ToolResult } from '../types/index.js';

export const mermaidDiagramSchema = z.object({
  type: z.enum(['mindmap', 'flowchart', 'sequence', 'er', 'gantt', 'pie']).describe('图表类型'),
  content: z.string().min(1, { message: '图表内容不能为空' }).describe('Mermaid图表定义内容'),
  title: z.string().optional().describe('图表标题'),
});

// 生成不同类型的 Mermaid 图表模板
function generateMermaidContent(type: string, content: string): string {
  switch (type) {
    case 'mindmap':
      return `mindmap\n  ${content}`;
    case 'flowchart':
      return `flowchart TD\n  ${content}`;
    case 'sequence':
      return `sequenceDiagram\n  ${content}`;
    case 'er':
      return `erDiagram\n  ${content}`;
    case 'gantt':
      return `gantt\n  ${content}`;
    case 'pie':
      return `pie\n  ${content}`;
    default:
      return content;
  }
}

export const mermaidDiagramTool = {
  name: 'mermaid_diagram',
  description:
    '创建Mermaid图表。支持思维导图(mindmap)、流程图(flowchart)、时序图(sequence)、ER图、甘特图、饼图等。适用于高中知识梳理和概念图制作。',
  inputSchema: mermaidDiagramSchema.shape,

  async handler(params: z.infer<typeof mermaidDiagramSchema>): Promise<ToolResult> {
    try {
      // 验证参数
      const validated = mermaidDiagramSchema.parse(params);

      const mermaidCode = generateMermaidContent(validated.type, validated.content);
      const title = validated.title || `${validated.type}图表`;

      // 返回 Mermaid 代码，LibreChat 会自动渲染
      return {
        content: [
          {
            type: 'text',
            text: `### ${title}\n\n\`\`\`mermaid\n${mermaidCode}\n\`\`\``,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `生成图表时出错: ${error instanceof Error ? error.message : '未知错误'}`,
          },
        ],
        isError: true,
      };
    }
  },
};
