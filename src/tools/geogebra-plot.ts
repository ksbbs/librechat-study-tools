import { z } from 'zod';
import { generateGeoGebra2DHTML, geoGebraToToolResult } from '../utils/geogebra-api.js';
import type { ToolResult } from '../types/index.js';

export const geogebraPlotSchema = z.object({
  expressions: z
    .array(z.string())
    .min(1, { message: '至少需要一个数学表达式' })
    .describe('数学表达式列表，如 ["y = x^2", "y = 2x + 1", "Circle((0,0), 3)"]'),
  xmin: z.number().optional().default(-10).describe('X轴最小值'),
  xmax: z.number().optional().default(10).describe('X轴最大值'),
  ymin: z.number().optional().default(-10).describe('Y轴最小值'),
  ymax: z.number().optional().default(10).describe('Y轴最大值'),
  width: z.number().optional().default(800).describe('图像宽度（像素）'),
  height: z.number().optional().default(600).describe('图像高度（像素）'),
});

export const geogebraPlotTool = {
  name: 'geogebra_plot',
  description:
    '绘制2D数学函数图像或几何图形。支持函数（如 y=x^2）、方程、点、线、圆、多边形等。适用于高中数学可视化教学，包括函数图像、解析几何、三角函数等。',
  inputSchema: geogebraPlotSchema.shape,

  async handler(params: z.infer<typeof geogebraPlotSchema>): Promise<ToolResult> {
    try {
      // 验证参数
      const validated = geogebraPlotSchema.parse(params);

      const html = generateGeoGebra2DHTML(validated);
      const title = validated.expressions.join(', ');
      return geoGebraToToolResult(html, title);
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
