import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import express from 'express';

const app = express();
app.use(express.json());

function createServer() {
  const server = new McpServer({ name: 'librechat-study-tools', version: '1.0.0' });

  function gen2D(p: any) {
    const cmds = p.expressions.map((e: string) => `ggbApplet.evalCommand('${e.replace(/'/g, "\\'")}')`).join(';\n        ');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://www.geogebra.org/apps/deployggb.js"></script><style>body{margin:0;padding:20px;display:flex;justify-content:center}#g{border:1px solid #ccc;border-radius:8px}</style></head><body><div id="g"></div><script>var ggbApplet=new GGBApplet({appName:"classic",width:${p.width||800},height:${p.height||600},showToolBar:false,showAlgebraInput:false},true);ggbApplet.inject('g');window.onload=function(){setTimeout(function(){${cmds};ggbApplet.setCoordSystem(${p.xmin||-10},${p.xmax||10},${p.ymin||-10},${p.ymax||10})},1000)}</script></body></html>`;
  }

  function gen3D(p: any) {
    const cmds = p.expressions.map((e: string) => `ggbApplet.evalCommand('${e.replace(/'/g, "\\'")}')`).join(';\n        ');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><script src="https://www.geogebra.org/apps/deployggb.js"></script><style>body{margin:0;padding:20px;display:flex;justify-content:center}#g{border:1px solid #ccc;border-radius:8px}</style></head><body><div id="g"></div><script>var ggbApplet=new GGBApplet({appName:"3d",width:${p.width||800},height:${p.height||600},showToolBar:false,showAlgebraInput:false},true);ggbApplet.inject('g');window.onload=function(){setTimeout(function(){${cmds};ggbApplet.setCoordSystem(${p.xmin||-5},${p.xmax||5},${p.ymin||-5},${p.ymax||5},${p.zmin||-5},${p.zmax||5})},1000)}</script></body></html>`;
  }

  function physics(t: string) {
    if (t !== 'projectile') return null;
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>抛体运动</title><style>body{margin:0;padding:20px;font-family:sans-serif;background:#f5f5f5}canvas{background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1)}.c{max-width:900px;margin:0 auto}h2{color:#333}.ctrl{margin-top:20px;padding:15px;background:#fff;border-radius:8px}label{display:inline-block;width:120px}input{width:200px}.v{display:inline-block;width:60px;text-align:right}button{padding:10px 20px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;margin:5px}.info{margin-top:10px;padding:10px;background:#e8f5e9;border-radius:4px}</style></head><body><div class="c"><h2>抛体运动模拟</h2><canvas id="cv" width="800" height="400"></canvas><div class="ctrl"><div><label>初速度(m/s):</label><input type="range" id="v" min="10" max="50" value="30"><span class="v" id="vv">30</span></div><div><label>角度(°):</label><input type="range" id="a" min="0" max="90" value="45"><span class="v" id="av">45</span></div><div><label>重力:</label><input type="range" id="g" min="1" max="20" value="10" step="0.1"><span class="v" id="gv">10</span></div><button onclick="start()">开始</button><button onclick="reset()">重置</button></div><div class="info" id="info">点击开始查看</div></div><script>const cv=document.getElementById('cv'),ctx=cv.getContext('2d');let aid=null,t=0,trail=[];function uv(id){document.getElementById(id+'v').textContent=document.getElementById(id).value}['v','a','g'].forEach(id=>document.getElementById(id).addEventListener('input',()=>uv(id)));function draw(){ctx.clearRect(0,0,800,400);ctx.strokeStyle='#ddd';ctx.beginPath();ctx.moveTo(50,350);ctx.lineTo(750,350);ctx.moveTo(50,350);ctx.lineTo(50,50);ctx.stroke();ctx.strokeStyle='#2196F3';ctx.lineWidth=2;ctx.beginPath();trail.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();if(trail.length){const l=trail[trail.length-1];ctx.fillStyle='#f44336';ctx.beginPath();ctx.arc(l.x,l.y,8,0,Math.PI*2);ctx.fill()}}function start(){if(aid)cancelAnimationFrame(aid);const v0=+document.getElementById('v').value,an=+document.getElementById('a').value*Math.PI/180,g=+document.getElementById('g').value,vx=v0*Math.cos(an),vy=v0*Math.sin(an);t=0;trail=[];function ani(){t+=.02;const x=vx*t,y=vy*t-.5*g*t*t,sx=50+x*10,sy=350-y*10;if(sy>350||sx>750){cancelAnimationFrame(aid);const mh=(vy*vy)/(2*g),tt=(2*vy)/g,r=vx*tt;document.getElementById('info').innerHTML='最大高度:'+mh.toFixed(2)+'m<br>飞行时间:'+tt.toFixed(2)+'s<br>水平射程:'+r.toFixed(2)+'m';return}trail.push({x:sx,y:sy});draw();aid=requestAnimationFrame(ani)}ani()}function reset(){if(aid)cancelAnimationFrame(aid);t=0;trail=[];ctx.clearRect(0,0,800,400);document.getElementById('info').textContent='点击开始'}</script></body></html>`;
  }

  function mermaid(type: string, content: string) {
    const p: any = { mindmap: 'mindmap\n  ', flowchart: 'flowchart TD\n  ', sequence: 'sequenceDiagram\n  ', er: 'erDiagram\n  ', gantt: 'gantt\n  ', pie: 'pie\n  ' };
    return (p[type] || '') + content;
  }

  server.tool('geogebra_plot', '绘制2D数学函数图像或几何图形', {
    expressions: z.array(z.string()).min(1),
    xmin: z.number().optional().default(-10), xmax: z.number().optional().default(10),
    ymin: z.number().optional().default(-10), ymax: z.number().optional().default(10),
    width: z.number().optional().default(800), height: z.number().optional().default(600),
  }, async (p) => ({
    content: [
      { type: 'text' as const, text: `已生成: ${p.expressions.join(', ')}` },
      { type: 'resource' as const, resource: { uri: `data:text/html;base64,${Buffer.from(gen2D(p)).toString('base64')}`, mimeType: 'text/html', text: '打开图表' } },
    ],
  }));

  server.tool('geogebra_3d', '创建3D数学可视化', {
    expressions: z.array(z.string()).min(1),
    xmin: z.number().optional().default(-5), xmax: z.number().optional().default(5),
    ymin: z.number().optional().default(-5), ymax: z.number().optional().default(5),
    zmin: z.number().optional().default(-5), zmax: z.number().optional().default(5),
    width: z.number().optional().default(800), height: z.number().optional().default(600),
  }, async (p) => ({
    content: [
      { type: 'text' as const, text: `已生成3D: ${p.expressions.join(', ')}` },
      { type: 'resource' as const, resource: { uri: `data:text/html;base64,${Buffer.from(gen3D(p)).toString('base64')}`, mimeType: 'text/html', text: '打开图表' } },
    ],
  }));

  server.tool('physics_simulation', '物理模拟实验', {
    type: z.enum(['projectile', 'incline', 'pendulum', 'wave']),
    params: z.record(z.number()).optional(),
  }, async (p) => {
    const html = physics(p.type);
    if (!html) return { content: [{ type: 'text' as const, text: `${p.type} 模拟开发中` }] };
    return {
      content: [
        { type: 'text' as const, text: `已生成${p.type}模拟` },
        { type: 'resource' as const, resource: { uri: `data:text/html;base64,${Buffer.from(html).toString('base64')}`, mimeType: 'text/html', text: '打开模拟' } },
      ],
    };
  });

  server.tool('mermaid_diagram', '创建Mermaid图表', {
    type: z.enum(['mindmap', 'flowchart', 'sequence', 'er', 'gantt', 'pie']),
    content: z.string().min(1),
    title: z.string().optional(),
  }, async (p) => ({
    content: [{ type: 'text' as const, text: `### ${p.title || p.type + '图表'}\n\n\`\`\`mermaid\n${mermaid(p.type, p.content)}\n\`\`\`` }],
  }));

  return server;
}

app.post('/mcp', async (req, res) => {
  try {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => { transport.close(); server.close(); });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
    }
  }
});

app.get('/mcp', (req, res) => res.status(405).json({ error: 'Method not allowed' }));
app.delete('/mcp', (req, res) => res.status(405).json({ error: 'Method not allowed' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = parseInt(process.env.PORT || '3100');
app.listen(PORT, () => console.log(`MCP Server on port ${PORT}`));
