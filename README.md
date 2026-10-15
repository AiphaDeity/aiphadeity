<div align="center">

# AiphaDeity 的博客 · 云升

> 记录嵌入式开发、Web 全栈与生活随笔

![Node.js >= 22](https://img.shields.io/badge/node.js-%3E%3D22-brightgreen)
![pnpm >= 11](https://img.shields.io/badge/pnpm-%3E%3D11-blue)
![Astro](https://img.shields.io/badge/Astro-7.2-orange)
![License](https://img.shields.io/badge/license-MIT-green)

🌐 **在线访问：[aiphadeity.cn](https://aiphadeity.cn)**

</div>

## ✍️ 关于本站

这里是 **AiphaDeity**（云升）的个人技术博客，记录嵌入式开发与 Web 全栈路上的所学所得，偶尔也写一些生活随笔。

> 路漫漫其修远兮，吾将上下而求索。

## ✨ 站点特性

- ⚡ 基于 Astro 7 的静态站点，加载迅速、对 SEO 友好
- 📱 响应式设计，桌面端与移动端均有良好体验
- 🌙 亮色 / 暗色 / 跟随系统三种主题模式
- 🎨 多种背景壁纸模式，支持自定义主题色
- 🔍 基于 Pagefind 的全站文章搜索
- 💬 文章评论、动态、相册、音乐播放器等模块

## 🚀 本地运行

### 环境要求

- Node.js ≥ 22
- pnpm ≥ 11

### 启动步骤

```bash
# 克隆仓库
git clone https://github.com/AiphaDeity/aiphadeity.git
cd aiphadeity

# 安装依赖
pnpm install

# 启动开发服务器，访问 http://localhost:4321
pnpm dev
```

### 构建与部署

```bash
pnpm build    # 构建静态文件到 dist/
pnpm preview  # 本地预览构建产物
```

构建产物位于 `dist/`，可部署到 Cloudflare Pages、Vercel、Netlify 等任意静态托管平台，框架预设选择 `Astro` 即可。

### 常用命令

| 命令 | 说明 |
| :--- | :--- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建网站到 `./dist/` |
| `pnpm preview` | 本地预览已构建的网站 |
| `pnpm check` | Astro 代码诊断 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm new-post <name>` | 创建一篇新文章 |
| `pnpm new-d <内容>` | 创建一条动态 |

## 📝 撰写内容

站点配置集中在 `src/config/` 目录，可在各配置文件中修改站点信息、导航栏、背景壁纸、评论系统等模块；个人资料与社交链接在 `src/config/profileConfig.ts` 中配置。

新建文章：

```bash
pnpm new-post my-post-title
```

文章保存在 `src/content/posts/`，常用 Frontmatter：

```yaml
---
title: 文章标题
published: 2026-10-12
description: 文章摘要
tags: [嵌入式, 前端]
category: 技术
draft: false
pinned: false
---
```

发布动态：

```bash
pnpm new-d 今天的随想
```

动态文件位于 `src/content/dynamic/`，每个 Markdown 文件对应一条动态，正文支持 Markdown 语法。

## 🛠️ 技术栈

- [Astro 7](https://astro.build) + [Svelte](https://svelte.dev) 岛屿架构
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/)
- [Pagefind](https://pagefind.app/) 静态全文搜索

## 🙏 致谢

本博客基于开源主题 [Firefly](https://github.com/CuteLeaf/Firefly) 搭建，Firefly 最初 Fork 自 [saicaca/fuwari](https://github.com/saicaca/fuwari)，感谢原作者们的优秀工作。

## � 开源协议

本项目遵循 [MIT License](https://opensource.org/licenses/MIT) 开源协议，详见 [LICENSE](./LICENSE)。根据协议要求，保留以下版权声明：

- Copyright (c) 2024 [saicaca](https://github.com/saicaca)
- Copyright (c) 2025 [CuteLeaf](https://github.com/CuteLeaf)

你可以自由使用、修改和分发代码，但需保留上述版权声明。
