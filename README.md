# History Text Portraits

一个把历史人物做成“文字雕像”的交互网页原型。

## 概念

这个项目不是普通的人物百科页，而是把“描述人物的文字”直接变成人物的上半身形象：

- 人物由词语、评价、史料意象组成
- 文字在轮廓里缓慢漂浮、呼吸、聚合
- 点击人物后，形象展开成一本历史书
- 书里继续阅读人物导读、章节和时间线

当前版本先做了 3 位演示人物：

- 苏轼
- 武则天
- 曹操

## 适合继续扩展的方向

- 接入更多人物与结构化历史数据
- 用 SVG / Canvas / WebGL 做更细的文字成像动画
- 加入真正的翻书转场
- 做人物关系网、事件地图、史料来源切换
- 把“不同史书对同一人物的不同叙述”可视化

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 Cloudflare Pages

```bash
npm run cf:deploy:prod
```

首次部署会创建 / 复用 Cloudflare Pages 项目 `history-text-portraits`，并把 `dist/` 发布到生产环境。
