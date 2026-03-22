import { geogebraPlotTool } from '../../src/tools/geogebra-plot.js';

describe('geogebra_plot tool', () => {
  describe('基本功能', () => {
    test('应该为单个函数生成HTML结果', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = x^2'],
      });

      expect(result.isError).toBeFalsy();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content.some((c) => c.type === 'resource')).toBe(true);
      expect(result.content.some((c) => c.mimeType === 'text/html')).toBe(true);
    });

    test('应该支持多个表达式', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = x^2', 'y = 2x + 1'],
      });

      expect(result.isError).toBeFalsy();
      expect(result.content.some((c) => c.type === 'text')).toBe(true);
    });
  });

  describe('参数验证', () => {
    test('应该拒绝空表达式数组', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: [],
      });

      expect(result.isError).toBe(true);
    });

    test('应该支持自定义坐标范围', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = sin(x)'],
        xmin: -6.28,
        xmax: 6.28,
        ymin: -1.5,
        ymax: 1.5,
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持自定义图像尺寸', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = cos(x)'],
        width: 1024,
        height: 768,
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('几何图形', () => {
    test('应该支持绘制圆', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['Circle((0,0), 3)'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持绘制点', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['A = (1, 2)', 'B = (-3, 4)'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持绘制线段', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['Segment((0,0), (3,4))'],
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('高中数学常见函数', () => {
    test('应该支持三角函数', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = sin(x)', 'y = cos(x)'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持指数函数', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = 2^x'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持对数函数', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = ln(x)'],
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('输出格式', () => {
    test('结果应该包含文本描述', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = x'],
      });

      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent).toBeDefined();
      expect(textContent?.text).toContain('y = x');
    });

    test('HTML应该包含GeoGebra脚本', async () => {
      const result = await geogebraPlotTool.handler({
        expressions: ['y = x^2'],
      });

      const resourceContent = result.content.find((c) => c.type === 'resource');
      expect(resourceContent).toBeDefined();
      expect(resourceContent?.uri).toContain('data:text/html;base64,');
    });
  });
});
