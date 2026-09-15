import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// 书签导航页面配置
export const booknavPageConfig: BooknavPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "",

	// favicon 自动获取配置
	favicon: {
		// 书签未填写 icon 时，是否自动获取目标站点的 favicon 图标
		enabled: true,

		// favicon 接口地址，{domain} 为占位符，会被替换成目标站点域名
		// 更换接口只需保证地址里含有 {domain}，例如：
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// 书签导航配置
// 每个数组项是一个分类组，分类组内的 items 是该分类下的书签
export const booknavConfig: BooknavGroup[] = [
	{
		id: "dev",
		name: "开发",
		icon: "material-symbols:code-rounded",
		desc: "写代码时离不开的站点",
		weight: 100,
		items: [
			{
				title: "GitHub",
				url: "https://github.com",
				desc: "全球最大的代码托管平台",
				// icon 字段可以使用 astro-icon 图标库的图标名称
				// 也可以使用图片 URL 和本地图片路径
				// 不填则会通过接口自动获取目标站点的 favicon 图标（需要在上面配置）
				icon: "fa7-brands:github",
				weight: 10,
			},
			{
				title: "Gitee",
				url: "https://gitee.com",
				desc: "国内代码托管与协作平台",
				icon: "simple-icons:gitee",
				weight: 9,
			},
			{
				title: "Python",
				url: "https://www.python.org",
				desc: "Python 编程语言官网",
				icon: "fa7-brands:python",
				weight: 8,
			},
			{
				title: "Astro",
				url: "https://astro.build",
				desc: "内容驱动型网站的 Web 框架",
				icon: "simple-icons:astro",
				weight: 7,
			},
			{
				title: "Svelte",
				url: "https://svelte.dev",
				desc: "把组件编译成高效原生 JS 的框架",
				icon: "fa7-brands:svelte",
				weight: 6,
			},
			{
				title: "Tailwind CSS",
				url: "https://tailwindcss.com",
				desc: "一个功能强大且灵活的 CSS 框架",
				icon: "simple-icons:tailwindcss",
				weight: 5,
			},
			{
				title: "Qt",
				url: "https://www.qt.io",
				desc: "跨平台 C++ / QML 应用开发框架",
				icon: "simple-icons:qt",
				weight: 4,
			},
			{
				title: "MSYS2",
				url: "https://www.msys2.org",
				desc: "Windows 上的 Unix 风格开发环境与包管理",
				weight: 3,
			},
			{
				title: "腾讯云",
				url: "https://cloud.tencent.com",
				desc: "腾讯云服务器、数据库与 CDN 等云服务",
				weight: 2,
			},
		],
	},
	{
		id: "ai",
		name: "AI",
		icon: "material-symbols:auto-awesome-outline-rounded",
		desc: "AI 模型与工具导航",
		weight: 95,
		items: [
			{
				title: "DeepSeek",
				url: "https://www.deepseek.com",
				desc: "深度求索的 AI 对话与推理模型",
				icon: "simple-icons:deepseek",
				weight: 10,
			},
			{
				title: "AI 工具集",
				url: "https://ai-bot.cn",
				desc: "国内外 AI 工具与产品导航",
				weight: 9,
			},
		],
	},
	{
		id: "hardware",
		name: "硬件",
		icon: "material-symbols:developer-board-rounded",
		desc: "嵌入式、电子与开源硬件",
		weight: 90,
		items: [
			{
				title: "嘉立创开源社区",
				url: "https://oshwhub.com",
				desc: "开源硬件项目分享平台 OSHWHub",
				weight: 10,
			},
			{
				title: "野火电子论坛",
				url: "https://www.firebbs.cn",
				desc: "野火嵌入式开发资料与技术论坛",
				weight: 9,
			},
			{
				title: "意法半导体",
				url: "https://www.st.com",
				desc: "ST 官网 STM32 等芯片资料",
				icon: "simple-icons:stmicroelectronics",
				weight: 8,
			},
		],
	},
	{
		id: "tools",
		name: "工具",
		icon: "material-symbols:build-outline-rounded",
		desc: "顺手的在线小工具",
		weight: 80,
		items: [
			{
				title: "TinyPNG",
				url: "https://tinypng.com",
				desc: "在线压缩 PNG / JPEG 图片",
				weight: 10,
			},
			{
				title: "Squoosh",
				url: "https://squoosh.app",
				desc: "Google 出品的图片压缩与格式转换",
				weight: 9,
			},
			{
				title: "Carbon",
				url: "https://carbon.now.sh",
				desc: "把代码片段生成漂亮的图片",
				weight: 8,
			},
			{
				title: "Geek 卸载器",
				url: "https://geekuninstaller.com",
				desc: "轻量彻底的 Windows 软件卸载工具",
				weight: 7,
			},
			{
				title: "傲梅分区助手",
				url: "https://www.disktool.cn",
				desc: "磁盘分区管理与系统迁移工具",
				weight: 6,
			},
			{
				title: "菜鸟工具",
				url: "https://www.jyshare.com",
				desc: "常用在线工具合集",
				weight: 5,
			},
		],
	},
	{
		id: "resources",
		name: "资源",
		icon: "material-symbols:auto-stories-outline-rounded",
		desc: "文档、图标与各类资料",
		weight: 70,
		items: [
			{
				title: "MDN Web Docs",
				url: "https://developer.mozilla.org",
				desc: "最权威的 Web 技术文档",
				weight: 12,
			},
			{
				title: "Cppreference",
				url: "https://zh.cppreference.com",
				desc: "C / C++ 标准库与语言参考手册",
				weight: 11,
			},
			{
				title: "Firefly Docs",
				url: "https://docs-firefly.cuteleaf.cn",
				desc: "Firefly 主题模板文档",
				icon: "https://docs-firefly.cuteleaf.cn/logo.png",
				weight: 10,
			},
			{
				title: "GNU",
				url: "https://www.gnu.org",
				desc: "GNU 项目与自由软件基金会",
				icon: "simple-icons:gnu",
				weight: 9,
			},
			{
				title: "夏夜流萤",
				url: "https://blog.cuteleaf.cn",
				desc: "飞萤之火自无梦的长夜亮起",
				weight: 8,
			},
			{
				title: "MS Learn",
				url: "https://learn.microsoft.com",
				desc: "微软官方技术文档与学习路径",
				weight: 7,
			},
			{
				title: "ISO",
				url: "https://www.iso.org",
				desc: "国际标准化组织官网",
				weight: 6,
			},
			{
				title: "Iconify",
				url: "https://icon-sets.iconify.design",
				desc: "海量开源图标集合搜索",
				weight: 5,
			},
			{
				title: "iconfont",
				url: "https://www.iconfont.cn",
				desc: "阿里巴巴矢量图标库",
				weight: 4,
			},
			{
				title: "模之屋",
				url: "https://www.aplaybox.com",
				desc: "3D 模型分享与下载社区",
				weight: 3,
			},
		],
	},
	{
		id: "office",
		name: "办公",
		icon: "material-symbols:work-outline-rounded",
		desc: "邮箱与协作办公",
		weight: 60,
		items: [
			{
				title: "飞书",
				url: "https://www.feishu.cn",
				desc: "字节跳动的企业协作与办公平台",
				weight: 10,
			},
			{
				title: "QQ 邮箱",
				url: "https://mail.qq.com",
				desc: "腾讯 QQ 邮箱",
				icon: "simple-icons:tencentqq",
				weight: 9,
			},
			{
				title: "网易邮箱",
				url: "https://mail.163.com",
				desc: "网易 163 邮箱",
				weight: 8,
			},
		],
	},
];
