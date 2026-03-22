import { physicsSimTool } from '../../src/tools/physics-sim.js';

describe('physics_simulation tool', () => {
  describe('抛体运动', () => {
    test('应该生成抛体运动模拟', async () => {
      const result = await physicsSimTool.handler({
        type: 'projectile',
      });

      expect(result.isError).toBeFalsy();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content.some((c) => c.type === 'text')).toBe(true);
    });

    test('结果应该包含抛体运动标识', async () => {
      const result = await physicsSimTool.handler({
        type: 'projectile',
      });

      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('抛体运动');
    });
  });

  describe('参数验证', () => {
    test('应该接受有效的模拟类型', async () => {
      const types = ['projectile', 'incline', 'pendulum', 'wave'] as const;

      for (const type of types) {
        const result = await physicsSimTool.handler({ type });
        expect(result).toBeDefined();
      }
    });
  });

  describe('输出格式', () => {
    test('应该返回HTML资源', async () => {
      const result = await physicsSimTool.handler({
        type: 'projectile',
      });

      const resourceContent = result.content.find((c) => c.type === 'resource');
      if (resourceContent) {
        expect(resourceContent.mimeType).toBe('text/html');
      }
    });
  });
});
