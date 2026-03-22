// GeoGebra 2D 绘图参数
export interface GeoGebraPlotParams {
  expressions: string[];
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  width?: number;
  height?: number;
}

// GeoGebra 3D 参数
export interface GeoGebra3DParams {
  expressions: string[];
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  zmin?: number;
  zmax?: number;
  width?: number;
  height?: number;
}

// 物理模拟类型
export type PhysicsSimType = 'projectile' | 'incline' | 'pendulum' | 'wave';

// 物理模拟参数
export interface PhysicsSimParams {
  type: PhysicsSimType;
  params?: Record<string, number>;
  width?: number;
  height?: number;
}

// Mermaid 图表类型
export type MermaidDiagramType = 'mindmap' | 'flowchart' | 'sequence' | 'er' | 'gantt' | 'pie';

// Mermaid 图表参数
export interface MermaidDiagramParams {
  type: MermaidDiagramType;
  content: string;
  title?: string;
}

// MCP 工具返回结果
export interface ToolResult {
  content: Array<{
    type: 'text' | 'image' | 'resource';
    text?: string;
    data?: string;
    mimeType?: string;
    uri?: string;
  }>;
  isError?: boolean;
}
