# LibreChat Study Tools

面向高中生的理科学习插件，为LibreChat提供GeoGebra图形绘制和Mermaid图表生成功能。

## 功能

| 工具 | 功能 | 学科 |
|------|------|------|
| `geogebra_plot` | 2D函数图像、几何图形 | 数学 |
| `geogebra_3d` | 3D几何可视化 | 数学 |
| `physics_simulation` | 物理模拟实验 | 物理 |
| `mermaid_diagram` | 思维导图、流程图等 | 全科 |

## 安装

```bash
# 克隆项目
cd librechat-study-tools

# 安装依赖
npm install

# 构建
npm run build
```

## 配置 LibreChat

在 LibreChat 的配置文件 `librechat.yaml` 中添加：

```yaml
mcpServers:
  study-tools:
    command: node
    args: ["/path/to/librechat-study-tools/dist/index.js"]
```

然后重启 LibreChat。

## 使用示例

### 数学函数图像

```
用户: 帮我画出 y = x^2 和 y = 2x + 1 的图像
AI: [调用 geogebra_plot 工具，生成交互式图像]
```

### 3D立体几何

```
用户: 展示一个球心在原点、半径为2的球体
AI: [调用 geogebra_3d 工具，生成3D球体]
```

### 抛体运动模拟

```
用户: 模拟一个45度角、初速度30m/s的抛体运动
AI: [调用 physics_simulation 工具，生成模拟]
```

### 知识图谱

```
用户: 用思维导图梳理光合作用的过程
AI: [调用 mermaid_diagram 工具，生成思维导图]
```

## 开发

```bash
# 开发模式
npm run dev

# 运行测试
npm test

# 构建
npm run build
```

## 许可证

MIT
