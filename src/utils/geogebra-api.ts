import type { GeoGebraPlotParams, GeoGebra3DParams, ToolResult } from '../types/index.js';

/**
 * 生成 GeoGebra 2D 绘图 HTML
 */
export function generateGeoGebra2DHTML(params: GeoGebraPlotParams): string {
  const {
    expressions,
    xmin = -10,
    xmax = 10,
    ymin = -10,
    ymax = 10,
    width = 800,
    height = 600,
  } = params;

  const commands = expressions
    .map((expr) => {
      const escaped = expr.replace(/'/g, "\\'");
      return `ggbApplet.evalCommand('${escaped}');`;
    })
    .join('\n        ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GeoGebra 2D</title>
  <script src="https://www.geogebra.org/apps/deployggb.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h2 { 
      color: #333; 
      margin-bottom: 16px;
      font-size: 18px;
    }
    #ggb-element { 
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .info {
      margin-top: 16px;
      padding: 12px 20px;
      background: #e3f2fd;
      border-radius: 8px;
      font-size: 14px;
      color: #1565c0;
    }
  </style>
</head>
<body>
  <h2>数学函数图像</h2>
  <div id="ggb-element"></div>
  <div class="info">
    提示：可以拖动图像、滚轮缩放，双击重置视图
  </div>
  <script>
    var params = {
      appName: "classic",
      width: ${width},
      height: ${height},
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      useBrowserForJS: true,
      borderColor: "#e0e0e0"
    };
    var ggbApplet = new GGBApplet(params, true);
    ggbApplet.inject('ggb-element');
    
    window.addEventListener('load', function() {
      setTimeout(function() {
        ${commands}
        ggbApplet.setCoordSystem(${xmin}, ${xmax}, ${ymin}, ${ymax});
      }, 1500);
    });
  </script>
</body>
</html>`;
}

/**
 * 生成 GeoGebra 3D 绘图 HTML
 */
export function generateGeoGebra3DHTML(params: GeoGebra3DParams): string {
  const {
    expressions,
    xmin = -5,
    xmax = 5,
    ymin = -5,
    ymax = 5,
    zmin = -5,
    zmax = 5,
    width = 800,
    height = 600,
  } = params;

  const commands = expressions
    .map((expr) => {
      const escaped = expr.replace(/'/g, "\\'");
      return `ggbApplet.evalCommand('${escaped}');`;
    })
    .join('\n        ');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>GeoGebra 3D</title>
  <script src="https://www.geogebra.org/apps/deployggb.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f7fa;
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h2 { 
      color: #333; 
      margin-bottom: 16px;
      font-size: 18px;
    }
    #ggb-element { 
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      overflow: hidden;
    }
    .info {
      margin-top: 16px;
      padding: 12px 20px;
      background: #e8f5e9;
      border-radius: 8px;
      font-size: 14px;
      color: #2e7d32;
    }
  </style>
</head>
<body>
  <h2>3D 数学可视化</h2>
  <div id="ggb-element"></div>
  <div class="info">
    提示：拖动旋转3D视图，滚轮缩放
  </div>
  <script>
    var params = {
      appName: "3d",
      width: ${width},
      height: ${height},
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      useBrowserForJS: true
    };
    var ggbApplet = new GGBApplet(params, true);
    ggbApplet.inject('ggb-element');
    
    window.addEventListener('load', function() {
      setTimeout(function() {
        ${commands}
        ggbApplet.setCoordSystem(${xmin}, ${xmax}, ${ymin}, ${ymax}, ${zmin}, ${zmax});
      }, 1500);
    });
  </script>
</body>
</html>`;
}

/**
 * 将 GeoGebra HTML 转换为 MCP Tool Result
 */
export function geoGebraToToolResult(html: string, title: string): ToolResult {
  const base64Html = Buffer.from(html).toString('base64');
  const dataUri = `data:text/html;base64,${base64Html}`;

  return {
    content: [
      {
        type: 'text',
        text: `已生成 **${title}** 的交互式图表。\n\n[点击在浏览器中打开图表](${dataUri})\n\n或者将以下代码保存为 .html 文件后用浏览器打开：`,
      },
      {
        type: 'resource',
        uri: dataUri,
        mimeType: 'text/html',
      },
    ],
  };
}
