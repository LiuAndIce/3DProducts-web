# Mango Delight Cinematic Landing Page

> A cinematic single-page beverage landing page with scroll-driven WebP parallax animation, flavor switching, and premium dark-mode storytelling.

一个为罐装饮料品牌打造的高级单页官网。项目以电影化滚动叙事为核心，用 WebP 序列驱动全屏英雄动画，并结合风味切换、加载过渡与高反差暗黑视觉，构建适合新品发布和品牌营销的沉浸式体验。

---

##在线演示地址
https://3dproducts-web.netlify.app/

<img width="1838" height="866" alt="image" src="https://github.com/user-attachments/assets/d30f2c32-b51e-49e9-96ad-20f4f69dcf1b" />

## Preview Highlights

- 全屏 `canvas` 英雄区，滚动直接驱动 WebP 序列播放
- `PREV / NEXT` 风味切换，同步更新文案、编号和强调色
- 首屏加载遮罩、进度条与平滑过渡，减少大资源闪烁
- 吸顶导航 + 当前章节高亮，适合长单页浏览
- 产品、成分、营养、评论、FAQ、CTA、页脚完整齐备
- 纯静态实现，部署简单，适合快速改造成品牌官网模板

## Design Direction

这个页面不是通用 SaaS 落地页风格，而是刻意往“电影感饮料广告”方向推进：

- 近黑背景与白色高光形成强对比
- 版式保留大量负空间，让中间动画成为视觉主角
- 字体、分隔线、圆角按钮和玻璃化卡片共同强化高级感
- 动画不依赖自动播放，而是和用户滚动行为直接绑定

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- `canvas` frame rendering
- WebP image sequence assets

## Project Structure

```text
.
├─ index.html        # 页面结构与内容区块
├─ styles.css        # 整体视觉、布局、响应式与动画样式
├─ script.js         # 序列预加载、滚动映射、变体切换、章节高亮
├─ webp/             # WebP 帧序列资源
└─ README.md
```

## Run Locally

使用任意静态服务器即可。

### Python

```bash
python -m http.server 4173
```

打开：

```text
http://localhost:4173/
```

## Configuration

主要可配置内容位于 [script.js](./script.js) 的 `variants` 数组中。

每个变体支持：

- `name`：饮料名称
- `subtitle`：副标题
- `eyebrow`：上方小标题
- `description`：描述文案
- `accent`：强调色
- `frames`：该口味对应的 WebP 帧路径数组

示例结构：

```js
{
  name: "黑芒气泡",
  subtitle: "NOCTURNE FIZZ",
  eyebrow: "MANGO DELIGHT",
  description: "电影感风格描述文案...",
  accent: "#f6f2e8",
  frames: sequencePaths,
}
```

## Replacing the Image Sequence

如果你要接入新的饮料口味序列：

1. 将新的 `.webp` 帧放入新的资源目录。
2. 在 `script.js` 中为该序列生成路径数组。
3. 将对应风味的 `frames` 指向新的数组。
4. 如有需要，调整 `accent`、文案和卡片描述。

当前仓库里只有一组芒果序列，因此现有三个变体共用同一套动画资源。逻辑上已经支持每个变体绑定独立序列，替换数据即可扩展。

## Use Cases

- 饮料品牌官网
- 新品发布页
- 单品叙事型营销页
- 需要滚动动画展示的视觉型 landing page

## Why This Repo Exists

这个项目适合作为两个方向的基础模板：

- 品牌展示模板：快速替换文案、颜色和图片资源，变成新的产品官网
- 动画交互参考：学习如何用 `canvas + image sequence + scroll progress` 做高性能滚动动画

## Notes

- 当前实现为纯前端静态页面，无后端依赖。
- 由于首屏需要预加载序列资源，首次加载时间取决于图片体积和网络环境。
- 如果后续帧数明显增加，建议引入更细的分批加载与资源管理策略。

## License

本项目采用 MIT License 开源，任何人都可以自由使用、修改、分发和用于商业用途。

