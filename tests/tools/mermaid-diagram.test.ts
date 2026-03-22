import { mermaidDiagramTool } from '../../src/tools/mermaid-diagram.js';

describe('mermaid_diagram tool', () => {
  describe('思维导图', () => {
    test('应该生成思维导图代码', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'mindmap',
        content: '根节点\n  子节点1\n  子节点2',
      });

      expect(result.isError).toBeFalsy();
      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('mindmap');
      expect(textContent?.text).toContain('```mermaid');
    });

    test('应该支持标题', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'mindmap',
        content: '光合作用\n  光反应\n  暗反应',
        title: '生物知识点',
      });

      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('生物知识点');
    });
  });

  describe('流程图', () => {
    test('应该生成流程图代码', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'flowchart',
        content: 'A[开始] --> B[结束]',
      });

      expect(result.isError).toBeFalsy();
      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('flowchart TD');
    });
  });

  describe('时序图', () => {
    test('应该生成时序图代码', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'sequence',
        content: 'Alice->>Bob: 你好\nBob-->>Alice: 你好',
      });

      expect(result.isError).toBeFalsy();
      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('sequenceDiagram');
    });
  });

  describe('ER图', () => {
    test('应该生成ER图代码', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'er',
        content: 'STUDENT ||--o{ SCORE : has',
      });

      expect(result.isError).toBeFalsy();
      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('erDiagram');
    });
  });

  describe('饼图', () => {
    test('应该生成饼图代码', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'pie',
        content: '"语文" : 30\n"数学" : 40\n"英语" : 30',
      });

      expect(result.isError).toBeFalsy();
      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('pie');
    });
  });

  describe('参数验证', () => {
    test('应该接受所有有效图表类型', async () => {
      const types = ['mindmap', 'flowchart', 'sequence', 'er', 'gantt', 'pie'] as const;

      for (const type of types) {
        const result = await mermaidDiagramTool.handler({
          type,
          content: 'test content',
        });
        expect(result.isError).toBeFalsy();
      }
    });
  });

  describe('高中应用场景', () => {
    test('应该支持知识图谱梳理', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'mindmap',
        content: '高中物理\n  力学\n    运动学\n    动力学\n  电学\n    静电场\n    恒定电流',
        title: '高中物理知识体系',
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持解题步骤流程图', async () => {
      const result = await mermaidDiagramTool.handler({
        type: 'flowchart',
        content: 'A[读题] --> B[画受力图]\nB --> C[列方程]\nC --> D[求解]\nD --> E[检验]',
        title: '物理大题解题步骤',
      });

      expect(result.isError).toBeFalsy();
    });
  });
});
