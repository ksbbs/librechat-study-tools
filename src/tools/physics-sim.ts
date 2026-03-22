import { z } from 'zod';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { ToolResult } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const physicsSimSchema = z.object({
  type: z.enum(['projectile', 'incline', 'pendulum', 'wave']).describe('模拟类型'),
  params: z.record(z.number()).optional().describe('模拟参数'),
  width: z.number().optional().default(800),
  height: z.number().optional().default(600),
});

const typeNames: Record<string, string> = {
  projectile: '抛体运动',
  incline: '斜面运动',
  pendulum: '单摆',
  wave: '波动',
};

export const physicsSimTool = {
  name: 'physics_simulation',
  description: '创建物理模拟实验。支持抛体运动、斜面运动、单摆、波动等高中物理常见模拟。',
  inputSchema: physicsSimSchema.shape,

  async handler(params: z.infer<typeof physicsSimSchema>): Promise<ToolResult> {
    try {
      // 验证参数
      const validated = physicsSimSchema.parse(params);

      const templatePath = join(__dirname, '../../templates', `${validated.type}.html`);
      let html: string;

      try {
        html = readFileSync(templatePath, 'utf-8');
      } catch {
        // 如果模板不存在，返回提示
        return {
          content: [
            {
              type: 'text',
              text: `物理模拟 "${typeNames[validated.type] || validated.type}" 的模板正在开发中。目前支持: projectile (抛体运动)`,
            },
          ],
        };
      }

      const base64Html = Buffer.from(html).toString('base64');
      const dataUri = `data:text/html;base64,${base64Html}`;

      return {
        content: [
          {
            type: 'text',
            text: `已生成${typeNames[validated.type] || validated.type}模拟实验。请在浏览器中打开查看：`,
          },
          {
            type: 'resource',
            uri: dataUri,
            mimeType: 'text/html',
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `生成模拟时出错: ${error instanceof Error ? error.message : '未知错误'}`,
          },
        ],
        isError: true,
      };
    }
  },
};
