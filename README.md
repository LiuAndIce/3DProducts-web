# Mango Delight Cinematic Landing Page

一个为罐装饮料品牌设计的高级单页视差滚动网站，核心是滚动驱动的 WebP 序列动画英雄区、风味切换和电影感暗黑叙事。

## 项目简介

这个项目为“芒果美味”构建了一套高质感品牌官网体验：

- 全屏英雄区使用 WebP 序列作为背景，并将页面滚动位置映射为动画帧索引
- 右侧提供 `PREV / NEXT` 风味切换，支持同步更新文案、序列和编号
- 首屏包含加载遮罩与进度条，避免序列资源未就绪时闪烁
- 下方补齐产品介绍、成分与益处、营养事实、评论、FAQ、CTA 和页脚
- 整体视觉仅支持暗黑模式，强调黑白高反差、金属感和电影氛围

## 特性

- Scroll-driven WebP parallax hero
- Canvas 渲染序列帧，滚动时更平滑
- 变体切换与文本淡入淡出过渡
- 首屏资源预加载与加载进度显示
- 吸顶导航与章节高亮
- 响应式布局，兼容桌面与移动端
- 纯静态实现，无框架依赖

## 技术栈

- HTML5
- CSS3
- Vanilla JavaScript
- `canvas` 序列帧绘制
- 本地静态资源 `webp/*.webp`

## 目录结构

```text
.
├─ index.html
├─ styles.css
├─ script.js
├─ webp/
│  ├─ frame_000_delay-0.041s.webp
│  ├─ frame_001_delay-0.041s.webp
│  └─ ...
└─ webp.zip
```

## 本地运行

使用任意静态服务器即可。

### Python

```bash
python -m http.server 4173
```

然后访问：

```text
http://localhost:4173/
```

## 自定义内容

主要内容和变体配置位于 [script.js](./script.js)：

- `variants[].name`：饮料名称
- `variants[].subtitle`：副标题
- `variants[].description`：描述文案
- `variants[].accent`：强调色
- `variants[].frames`：当前风味对应的 WebP 帧列表

如果你有多套不同口味的序列资源，只需要为每个风味准备独立的帧路径数组，并替换 `variants[].frames`。

## 当前说明

当前仓库内只提供了一组芒果 WebP 序列，因此页面中三个风味变体暂时共用同一套动画资源。页面逻辑已经支持为每个变体接入独立序列，后续只需替换数据即可扩展。

## 适用场景

- 饮料品牌官网
- 新品发布页
- 高级单品营销页
- 需要滚动叙事与视觉冲击的单页展示项目

## License

如需开源发布，请根据你的实际需求补充许可证文件。
