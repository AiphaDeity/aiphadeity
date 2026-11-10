# Repository Guidelines

## Project Structure & Module Organization

Firefly is an Astro 7 site with Svelte islands and TypeScript configuration. Main source code lives in `src/`: routes in `src/pages`, layouts in `src/layouts`, reusable UI in `src/components`, styles in `src/styles`, content in `src/content`, helpers in `src/utils`, and Markdown/HTML plugins in `src/plugins`. Site configuration is split across `src/config` with matching type definitions in `src/types`; prefer imports from `@/config` when available. Static files served directly belong in `public`, source-managed images in `src/assets`, docs in `docs` and `Firefly-Docs`, and automation in `scripts`.

## Build, Test, and Development Commands

Use `pnpm`; the `preinstall` script enforces it.

- `pnpm dev` or `pnpm start`: run the local Astro dev server.
- `pnpm check`: run Astro diagnostics.
- `pnpm type-check`: run TypeScript with `--noEmit`.
- `pnpm format`: format `src` with Biome.
- `pnpm lint`: run Biome checks and safe fixes on `src`.
- `pnpm build`: generate icons, LQIPs, the Astro build, font subsets, and Pagefind search output in `dist`.
- `pnpm preview`: preview the production build locally.
- `pnpm new-post`: scaffold a new content post.

## Coding Style & Naming Conventions

Biome is the formatter and linter. It uses tabs for indentation and double quotes for JavaScript/TypeScript strings. Keep Astro and Svelte components in `PascalCase` (`PostCard.astro`, `Search.svelte`), config modules in `camelCase` ending with `Config.ts`, and utilities in descriptive kebab case such as `date-utils.ts`. Keep `src/types` aligned with `src/config`. Avoid unrelated formatting churn.

## Testing Guidelines

There is no dedicated unit-test framework configured. Before submitting changes, run `pnpm check`, `pnpm type-check`, and `pnpm build` for rendering, content, or generated asset work. For visual or interactive changes, verify with `pnpm dev` or `pnpm preview` and include screenshots in the PR. Name future tests near the feature they cover, using the local file name as the stem.

## Commit & Pull Request Guidelines

Use Conventional Commits, matching the current history: `feat: ...`, `fix: ...`, and `chore: ...`. Keep commits and PRs focused on one concern. PRs should include a concise summary, linked issues when relevant, validation commands run, and screenshots for UI changes. Discuss major features or design changes in an issue or discussion before implementation.

## Security & Configuration Tips

Do not commit secrets, tokens, or service keys in config files. Keep deployment-specific settings in the target platform environment, and review generated files such as `dist`, `src/constants/lqips.json`, and `src/constants/icons.ts` before committing them.

## 嵌入式文章协作规则

规划、撰写或修改嵌入式文章时，先阅读 [docs/embedded-writing-guide.md](docs/embedded-writing-guide.md)。其中记录了已讨论的分类、基础选题、写作边界、技术核查和图表阅读要求。用户当次明确要求优先；纯规划任务只交付规划，不修改文章或产品代码。

## AiphaDeity 四季 UI 协作规则

### 工作范围与设计依据

- 本节记录已讨论的第一版 UI 设计基准。执行前核对当前代码与验收记录，不把规划项自动视为已完成。
- 协作分工以用户当次任务为准：规划任务输出设计或执行说明，只有收到实现任务时才修改产品代码。用户已明确授权的常规实现与修复无需重复确认。
- UI 任务不包含文章撰写、改写、分类迁移或内容清理，除非用户同时提出这些要求。
- 参考站仅用于理解构图、气氛与交互，不自动转化为功能需求；不照搬其角色、文案、插画和整套页面。
- 概念图是视觉参考，图中生成的文字、日期、计数、封面和技术信息均不能当作真实站点数据。
- 已接受的总体方向可直接细化；新增主要功能、改变核心布局或角色身份时，先提供具体方案供用户判断。不要以主观偏好推翻已定方向。

### 保持 Firefly 架构与界面结构

- 延续 Astro + Svelte islands + TypeScript 架构，以及现有路由、内容集合、配置入口和 Swup 导航机制。
- 优先扩展现有组件、样式变量与 `src/config`，并同步 `src/types` 和必要的配置导出。新增文件名属于实施方案，不要把尚不存在的模块写成现有能力。
- 首页以独占一个视口的四季场景开场（以 `100svh` 为稳定基准），文章主体从首屏之后开始，下滑才进入内容；不再使用短横幅或让文章卡片侵入开场屏。沿用现有全屏布局能力实现，保持分组导航、分类快捷栏、文章卡片、分页和双侧栏结构。
- 遵循现有平板与手机断点，不把桌面三列直接缩小到手机屏幕。主体的背景保持干净、文字清楚，不重复铺设首屏风景，天气和花瓣不进入文章阅读区。
- 保留现有搜索、文章布局选择、主题设置、目录、沉浸阅读和页面开关的行为。页面开关关闭的入口不得被新导航或装饰重新显示。
- 手机端沿用现有单列内容与底部组件机制；底部侧栏模块仅首页显示，其他页面不再堆放。概念稿只展示部分组件，不构成删除其他已启用模块的依据。
- 样式优先接入现有主题变量，避免独立硬编码整套主题；不要通过复制四份页面实现四季，也不要为此更换框架、主题底座或增加第二套状态管理系统。
- 不批量格式化无关文件，不覆盖用户改动，不把测试生成文件或无关内容混入 UI 修改。

### 四季设计基准

整体目标是简约、清新、有意境。通过构图、光线、远近关系和少量动态表达季节，保证正文清楚、耐读。

| 季节 | 场景与小槿 | 页面底色 | 装饰主色 | 少量点缀 |
| --- | --- | --- | --- | --- |
| 春 · 风起 | 湖畔新绿、远山与天空，小槿放风筝 | `#FBFCF9` | `#88A982` 柳绿 | `#E6BFC5` 淡花粉 |
| 夏 · 听海 | 安静海湾、浅浪与树荫，小槿纳凉、扶草帽或持团扇 | `#FAFDFD` | `#5D9EA6` 海青 | `#DCCBA8` 浅沙金 |
| 秋 · 听雨 | 湖边木廊、远山雨雾，小槿在干燥檐下读书、身旁有热茶 | `#FCFAF6` | `#A58B72` 灰茶褐 | `#C7A35C` 银杏金 |
| 冬 · 候雪 | 雪岸、灰蓝远景与暖窗，小槿围围巾、捧热饮 | `#FAFCFE` | `#879DB5` 雾蓝 | `#D6AD82` 灯火杏 |

- 表中颜色是亮色设计基准；用于小字号文字、链接或按钮前，须选择满足对比度的深浅变体。不要直接把浅色装饰主色用于白底小字。
- 四季保持相同的组件位置、内容宽度、卡片尺寸规则和信息层级。变化主要落在首屏场景、小槿服装与道具、主题点缀色和天气效果。
- 主体保留文章、分类栏与侧栏模块各自独立的圆角卡片和浅色底，不改成无框列表；文章的列表／网格排列继续服从原有设置。
- 首屏不显示「向下阅读」按钮或其他额外的下滑按钮，直接通过正常滚动进入主体。
- 文章封面、作者头像、内容顺序与真实统计不随季节或明暗模式替换；作者头像不擅自改成小槿。
- 场景与角色必须给标题留出清楚的空间；禁止雨雪、花瓣、装饰图案穿过正文、代码块或操作控件。
- 首屏与内容区自然衔接。装饰不承担必要信息，关闭装饰后页面依然完整可用。

### 季节切换与明暗模式

- 导航旁只保留一个四季图画切换按钮，以春花、夏浪、秋叶、冬雪表示当前季节，不再显示「季」字；点击顺序为春 → 夏 → 秋 → 冬 → 春，不恢复四个常驻选项。
- 鼠标提示、键盘焦点提示与可访问名称应说明当前季节及下一步，例如「当前：春，点击切换至夏」。手机无需悬停也能了解切换结果。
- 记住访客手动选择。首次默认季节由统一配置或明确的日期规则决定；若按月份推断，使用站点时区，不硬编码开发当天的季节或依赖服务器本地时区。
- 季节和亮色／暗色／跟随系统是独立设置。选冬季不强制暗色，切换季节不覆盖用户的明暗偏好。
- 初始状态在首屏绘制前尽量正确应用，避免先显示其他季节或亮色再闪回；保持 SSR 与客户端状态一致。存储不可用或数据无效时使用可靠默认值。
- 季节状态统一管理，背景、配色、角色和天气从同一状态派生。连续点击、图片尚未加载或切页时，不得出现旧请求覆盖新选择、多个季节混合或布局跳动。
- 明暗模式均检查四季。暗色使用独立的界面颜色与合适的场景光线，不直接给整个页面和角色统一叠黑遮罩。

### 小槿的角色与素材

- 正式名字为「小槿」，昵称「槿槿」。保持同一位原创 Q 版猫耳女孩的身份：灰白发、青绿眼睛、卷云状呆毛、小朵木槿发夹，日常服装以奶白与低饱和配色为主。
- 四季调整衣着、道具、动作和表情，保持脸型、发色、眼睛及标志特征一致。不使用未经授权的第三方角色模型代替她。
- 首页首屏中的小槿融入场景；只有当首屏角色离开可见区域后，才展示角落陪伴形态，避免两个小槿同时出现。移动端不得遮挡文章、分页、评论或导航。
- 四季首屏采用同一位二次元少女的主题插画（`*-anime-v2`），春为湖畔春光、夏为安静海湾、秋为雨雾木廊、冬为雪岸暖窗；桌面与手机独立构图，冬季另有夜景。壁纸已含人物时隐藏首屏小槿立绘，角落陪伴继续使用原有小槿小立绘，不改形象、尺寸和交互。壁纸少女不替代小槿的 Q 版角色设定。
- 不显示小看板娘旁的 X 关闭按钮；保留已有收起偏好与可访问的唤回入口，新切页或切换季节不得强行展开访客已收起的角色。
- 待机动作轻而少，气泡短小、可关闭，不频繁自动弹出，不强制打字等待，不默认播放音效。基础交互不需要引入聊天后台或外部 AI 服务。
- 用户已授权小槿交互优化：沿用原四季小立绘与桌面 140×180／手机 105×135 的尺寸，桌面默认显示小槿，优先选择留白一侧，并避开评论、分页和浮动操作控件。用户反馈桌面只剩花后，取消「留白不足自动收成花」；桌面仅在访客手动收起时显示花，点击花必须能展开。手机继续默认 44×44 的木槿花入口。
- 手机始终默认花入口，主动点击后短暂展开；滚动、切页、输入或达到配置时长后收回。手机临时展开不覆盖桌面收起偏好；不恢复 X 按钮，气泡中提供「收起陪伴」，键盘 Escape 可收起。
- 点击才出现当前季节的短气泡，默认约 4.5 秒后淡出，点击气泡文字也可关闭；手机展开默认约 12 秒。时长由 `seasonConfig.companionOptions` 控制，文案在各季 `greeting` 中配置。
- 当前轻动作是静态图的轻呼吸与短促点击反馈，不宣称已有眨眼、衣摆分层、摇扇或 Live2D 动作。滚动、隐藏标签页和减少动态时暂停对应动作；首屏内与沉浸阅读中不出现角落角色。
- 静态设定图不等同于 Live2D 模型或可用动画。先核对现有看板娘方案支持的素材形式，再给出透明 PNG、分层素材、序列帧或模型的制作要求。
- 网页文字、按钮、背景、小槿和需运动的道具分别制作。不要把带字概念图整张铺成正式界面，再在上面放透明点击区域。

### 清晰度、排版与可访问性

- 正文与界面沿用项目系统字体配置；文学感主要由站名与插画表现。禁止把生成图里的错字、模糊文字或装饰字体当作正文标准。
- 第一版尺寸起点：正文 `16px`、行高 `1.7`；文章卡片标题桌面 `22px`、手机 `20px`；卡片圆角 `16px`；桌面列间距 `24px`；手机左右留白约 `16px`。适配时使用项目现有容器与断点，避免机械套用截图坐标。
- 可点击控件的触控区域至少 `44 × 44px`；键盘可操作并有清楚的焦点样式。图标按钮需要可访问名称，菜单应正确处理焦点和关闭操作。
- 普通文字对比度至少 `4.5:1`，大字至少 `3:1`；必要的控件轮廓与状态对比度至少 `3:1`。不只用颜色表示季节、当前页或选中状态。
- 检查手机、平板、桌面和文字放大后的重排；正文不横向溢出，代码块可独立横向滚动。
- 桌面背景母版以 `3840 × 2160` 为制作目标，手机需要独立的竖向构图或经过确认的裁切。母版分辨率不是所有设备的下载尺寸要求。
- 使用项目现有图片处理能力提供适当尺寸与现代格式，设置尺寸或宽高比避免布局偏移；首屏关键图优先，其余季节素材按需加载，不首屏下载所有高清母版。
- 正式引用的素材放在仓库约定的资产目录，不依赖聊天图片地址、桌面文件、临时目录或本机 `.codex` 路径。保留来源与授权信息；生成素材须人工检查手部、风筝线、边缘和角色一致性。

### 动态效果与资源管理

- 原有基础是 `SakuraEffect.astro` 与 `sakura.worker.ts` 樱花动画；新增四季状态、雨雪与场景基础见 `seasonConfig.ts`、`season-utils.ts` 和 `season-weather.ts`。当前小槿为透明静态换装层，不是完整 Live2D 动画。
- 优先参考现有 Canvas／Worker、设置开关与资源清理机制，分别设计雨和雪的轨迹；不要只替换樱花贴图就宣称雨雪完成。
- 秋雨为稀疏、细淡、略倾斜的雨线；冬雪为少量、缓慢、带轻微横移和远近差异的雪点。范围限制在首屏室外，避开檐下和室内角色。
- 第一阶段先完成可调的速度、密度、大小、透明度和显示范围；檐水、水面涟漪、积雪等复杂效果另行细化，不自动扩展需求。
- 雨雪仅通过 `src/config/seasonConfig.ts` 的 `weatherEnabled` 总开关和各季 `weather` 控制，不添加前台按钮或复选框，也不读取旧的访客雨雪开关偏好；当前密度为初版的两倍（雨：桌面 112／手机 48，雪：桌面 92／手机 40）。动态层不拦截点击，尊重 `prefers-reduced-motion`；减少动态时雨雪和持续角色动作停止。
- 首屏离开视野或标签页隐藏时暂停对应装饰动画；手机降低粒子密度与渲染开销，避免多套天气渲染器同时运行。
- Swup 切页、季节切换和反复开关后，检查 Canvas、Worker、动画循环及监听器不会重复创建或泄漏；异步初始化失效后不得重新挂载已关闭的效果。
- 动效、存储、图片或模型加载失败时，保留静态背景与可用内容。音频始终由访客主动开启。

### 交付与验收

- 设计任务交付清楚的整页稿与必要的局部图，区分视觉参考、确定的数值规则、待实现能力和仍需调整的细节。
- 实现说明列明实际涉及的文件、步骤、依赖、验收方法和回退方式。先对照现有实现，避免只给泛泛建议或要求重写整站。
- 实现任务按上方 Testing Guidelines 完成适用检查；纯文档修改无需跑站点构建，不将静态设计稿描述成已验证的交互。
- UI 验收覆盖四季与明暗组合、桌面／手机、初次访问、保存偏好、连续切换、Swup 切页、小槿收起恢复、减少动态与素材加载失败状态。
- 输出真实截图与检查结果，区分占位素材和最终素材；未执行的检查、未达到的效果和已有问题必须如实说明。
- 未经用户授权，不提交或推送代码，不部署或发布站点，不把设计方向确认视为发布授权。

### 设置兼容与实施边界

- 用户手动主题色优先于季节默认配色，季节切换不得删除原有色相偏好；重置主题色后恢复当前季节默认值。
- 四季图画按钮不触发导航或刷新，不改变阅读滚动位置和键盘焦点；切换结果通过简短状态提示告知。
- 导航首屏不模糊壁纸，仅用很淡且四周渐隐的底色衬字，不显示整块厚重底板或常驻白色搜索块；搜索悬停／聚焦时才有轻底色，进入阅读区后底色略实。首屏文字跟随实际壁纸光线：日景深字、冬夜浅字，不能只按界面明暗模式决定，避免白字直接落在明亮插画上。站标使用「云山与初日」SVG，不再使用 A 字母图标。
- 导航悬停／按下状态同步覆盖原按钮 `::before` 使用的底色变量，避免残留深黑色块；下拉菜单仅保留图标和文字，不显示白色或深色整块底板、边框、阴影与背景模糊，字色与当前首屏光线配套。
- 首页下滑后的导航配色从当前 `--page-bg`、`--deep-text`、`--btn-content` 等主题变量派生，随四季、明暗及手动主题色同步，不使用固定灰绿底色。首页首屏继续沿用插画光线对应的透明背景和字色规则，修复阅读区配色时不得覆盖首屏样式。
- 四季功能提供集中开关，关闭后回到原有 Firefly 壁纸与设置流程。素材失败时显示可用的静态回退，不能留下空白首屏或阻断文章。
- 背景母版、小槿透明素材和界面分别交付，记录实际尺寸；生成结果未达到 4K 时如实标注，不通过放大伪称原生高清。
- 实施分阶段交付可运行的结果：先接入四季状态、配色、场景和基础交互，再打磨角色动作、雨雪节奏及移动构图。不将未完成的动画或素材报告为最终成品。

### 文章与归档阅读界面

- 已确认采用「首页四季场景、内页安静阅读」的方向。用户随后要求所有非首页统一清爽内页样式，包括资源、友链、关于、动态、项目、相册和支持本站等；由 `seasonConfig.innerLayout` 集中控制。内页不再显示旧主题壁纸横幅、波浪、厚导航底板和无关的文章分类快捷栏；保留各页原有内容、筛选、图库、加密及其他业务功能。
- 内页使用季节淡底色、独立圆角卡片和同一套导航，不显示大幅风景或天气动画。首页仍保留完整四季首屏。
- 扩展现有文章模板、`ArchivePanel` 和 `SideBar`，不另起一套内容、搜索或筛选系统。文章的加密、封面、系列导航、评论、许可、分享、推荐及沉浸阅读继续服从原配置。
- 文章页突出分类、标题、摘要、日期和作者，正文桌面约 17px、手机 16px。桌面与手机均提供正文内的折叠目录，原浮动／沉浸目录保留；加密文章不得提前渲染正文目录。
- 归档按真实发布时间分组；保留分类／标签组合筛选及年份折叠，不再显示右侧时间索引。开发环境草稿是否出现沿用原内容工具，不伪造计数或修改文章来匹配设计图。
- 用户后续明确调整：左右侧栏只在首页显示，所有非首页（包括文章、归档及后续页面）均为居中单栏，手机底部侧栏模块也仅首页显示。通过 `sidebarLayoutConfig.homeOnly` 统一控制；一般内页最大宽度约 1080px，文章阅读区约 960px，移动端保持原响应式留白。
- 首页原有侧栏及组件配置保留，内页隐藏组件而非删除，保证 Swup 返回首页后可正常恢复。该显示范围调整独立于 `seasonConfig.innerLayout`，不随四季阅读样式开关变化。
- SSR 与 Swup 共用页面范围判断，切页必须同步阅读界面类名；从内页回首页须恢复完整首屏，进入其他页面须恢复其原样式。小槿保持原有小立绘与交互。

### 导航与文章浏览入口

- 顶层导航为「首页、文章、资源、友链、更多、关于」，「关于」和「更多」保留下拉选项。用户追加「更多」以减轻关于菜单：「关于」仅包含关于我、联系与交流、支持本站；「更多」收纳动态、项目、相册、GitHub、Gitee。桌面导航与手机抽屉共用配置，继续按页面开关过滤入口。
- 「文章」直达 `/archive/`；进入后显示三个等宽横向选项「按年份、按分类、按标签」，分别复用 `/archive/`、`/categories/`、`/tags/`。用选中底色和勾号同时表达当前视图，支持键盘及 Swup 切页同步，不再在这些页面重复显示首页的分类快捷栏。
- 「资源」复用现有 `/booknav/` 及书签数据，不新增第二套资源系统。关闭的留言、追番等页面不重新显示。
