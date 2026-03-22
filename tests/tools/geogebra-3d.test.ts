import { geogebra3DTool } from '../../src/tools/geogebra-3d.js';

describe('geogebra_3d tool', () => {
  describe('基本功能', () => {
    test('应该为3D图形生成HTML结果', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Sphere((0,0,0), 2)'],
      });

      expect(result.isError).toBeFalsy();
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content.some((c) => c.type === 'resource')).toBe(true);
    });

    test('应该支持多个3D对象', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Sphere((0,0,0), 1)', 'Cone((0,0,0), (0,0,3), 1)'],
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('参数验证', () => {
    test('应该拒绝空表达式数组', async () => {
      const result = await geogebra3DTool.handler({
        expressions: [],
      });

      expect(result.isError).toBe(true);
    });

    test('应该支持自定义3D坐标范围', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['x + y + z = 1'],
        xmin: -10,
        xmax: 10,
        ymin: -10,
        ymax: 10,
        zmin: -10,
        zmax: 10,
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('立体几何', () => {
    test('应该支持球体', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Sphere((0,0,0), 3)'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持圆锥', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Cone((0,0,0), (0,0,4), 2)'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持圆柱', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Cylinder(ZAxis, 2)'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持平面', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Plane((0,0,0), (1,0,0), (0,1,0))'],
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('空间解析几何', () => {
    test('应该支持空间直线', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Line((0,0,0), (1,1,1))'],
      });

      expect(result.isError).toBeFalsy();
    });

    test('应该支持空间向量', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Vector((0,0,0), (3,2,1))'],
      });

      expect(result.isError).toBeFalsy();
    });
  });

  describe('输出格式', () => {
    test('结果应该包含3D标识', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['Sphere((0,0,0), 1)'],
      });

      const textContent = result.content.find((c) => c.type === 'text');
      expect(textContent?.text).toContain('3D');
    });

    test('HTML应该使用3D应用', async () => {
      const result = await geogebra3DTool.handler({
        expressions: ['x + y + z = 0'],
      });

      const resourceContent = result.content.find((c) => c.type === 'resource');
      expect(resourceContent?.uri).toContain('data:text/html;base64,');
    });
  });
});
