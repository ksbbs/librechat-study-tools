import { z } from 'zod';
import { generateGeoGebra3DHTML, geoGebraToToolResult } from '../utils/geogebra-api.js';
import type { ToolResult } from '../types/index.js';

export const geogebra3DSchema = z.object({
  expressions: z
    .array(z.string())
    .min(1, { message: '至少需要一个3D数学表达式' })
    .describe('3D数学表达式，如 ["Sphere((0,0,0),2)", "x+y+z=1", "Plane((0,0,0),(1,1,1))"]'),
  xmin: z.number().optional().default(-5).describe('X轴最小值'),
  xmax: z.number().optional().default(5).describe('X轴最大值'),
  ymin: z.number().optional().default(-5).describe('Y轴最小值'),
  ymax: z.number().optional().default(5).describe('Y轴最大值'),
  zmin: z.number().optional().default(-5).describe('Z轴最小值'),
  zmax: z.number().optional().default(5).describe('Z轴最大值'),
  width: z.number().optional().default(800).describe('图像宽度（像素）'),
  height: z.number().optional().default(600).describe('图像高度（像素）'),
});

export const geogebra3DTool = {
  name: 'geogebra_3d',
  description:
    '创建3D数学可视化。支持空间几何体（球、锥、柱）、3D函数曲面、空间平面、空间向量等。适用于高中立体几何和空间解析几何教学。',
  inputSchema: geogebra3DSchema.shape,

  async handler(params: z.infer<typeof geogebra3DSchema>): Promise<ToolResult> {
    try {
      // 验证参数
      const validated = geogebra3DSchema.parse(params);

      const html = generateGeoGebra3DHTML(validated);
      const title = '3D图形: ' + validated.expressions.join(', ');
      return geoGebraToToolResult(html, title);
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `生成3D图表时出错: ${error instanceof Error ? error.message : '未知错误'}`,
          },
        ],
        isError: true,
      };
    }
  },
};
