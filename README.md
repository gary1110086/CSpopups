# Little Daily · 真实网页框架

网站地址：[打开 Little Daily](https://gary1110086.github.io/CSpopups/) · [中文入口](https://gary1110086.github.io/CSpopups/?lang=zh)

A real multipage browsing experience for a community scam-awareness booth.

当前主入口已经改为真实多页面网站。文章直接占据浏览器页面，没有网页内的假地址栏、假标签栏、顶部计时器或游戏工具条。广告打开真实的新标签页，文章分类、相关阅读、搜索、视频目录与观看页通过真实 URL 导航。

这是可试玩的框架原型，不是最终活动版本。本轮没有自动结束、后台倒计时、结束弹窗或跨标签汇总评分。弹窗按文章实际在前台浏览的时间陆续出现，切换标签时暂停安排，每种情境在当前标签会话里安排一次；不会在 60 秒后终止浏览。关闭的弹窗在刷新与正常返回后保持关闭。新标签各有自己的会话记录，尚未做跨标签或跨电脑进度同步。

## 试玩

Windows 双击 `Start-game.cmd` 或 `Start-booth.cmd`。也可以直接打开 `index.html`。推荐通过 HTTP 预览，与上线环境一致：

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

打开 http://127.0.0.1:5173/index.html 。这是本机预览地址，不能分享给其他电脑。开场连接检查只是本地演示，完成后真实导航到文章页，不接入 Cloudflare 或其他身份验证服务。

## 中途跳转

在文章或相关阅读累计前台浏览约 30 秒后，下一次文章内或广告上的普通点击会触发一次重定向：`article.html` / `story.html` → `redirect.html` → `cornhub.html`。中转页短暂显示正常的打开提示，约 240ms 后使用浏览器导航到 Cornhub；不使用网页内切屏、假地址栏或夸张动画。它是静态网站中的客户端重定向，不是服务器 HTTP 302。

触发状态先保存到本标签会话；浏览器返回会直接回到原文章，不经过中转页，也不会再次截走点击。Ctrl / Cmd / Shift / Alt 点击、网站顶栏和对话框操作保持原行为。该机制没有倒计时显示，也不结束浏览。Cornhub 是同一 GitHub Pages 项目下的虚构教学页面，没有外跳到真实成人网站；沿用非露骨影视封面素材。旧的 `nightroom.html` 链接会保留查询参数并转到新页面。

## 页面与代码

| 文件 | 用途 |
| --- | --- |
| `index.html` | 一次性连接检查入口 |
| `article.html` | Little Daily 文章、分类、搜索 |
| `story.html` | 相关阅读独立页面 |
| `offer.html` | 广告落地页与第二步演示，以查询参数区分情境 |
| `cornhub.html` | Cornhub 视频目录、搜索、分类、分页、观看页 |
| `redirect.html` | 固定站内目的地的真实文档中转 |
| `nightroom.html` | 兼容旧链接，重定向到 Cornhub |
| `about.html` | 教学用途与隐私说明 |
| `404.html` | 失效链接的返回入口 |
| `site.js` / `site.css` | 真实页面导航、交互与适配 |
| `content.js` / `styles.css` | 沿用原中英文内容和视觉样式 |
| `nightroom.js` / `nightroom.css` | 沿用视频站内容与交互 |
| `legacy.html` / `app.js` | 原完整游戏与模拟浏览器，留作对照 |

`booth.html` 和两个 Windows 启动器都进入新的 `index.html`。旧版说明见 `design/legacy-game-readme.md`。现有两个 offline/booth ZIP 保留为旧版快照，不是此次网站框架。

## GitHub Pages 发布

本地项目中的 `Just-One-Minute-website.zip` 是网站专用包，不提交到公开仓库。完整解压后，把内部文件（包括 `assets/` 和 `.nojekyll`）放在 GitHub 仓库的发布目录；确保 `index.html` 就在该目录顶层，不要上传 ZIP 代替网站文件。

在仓库 **Settings → Pages → Deploy from a branch** 选择对应分支和 `/(root)`，保存并等待部署完成。最终网址以 GitHub Pages 设置页显示的地址为准。普通项目网址通常为 `https://用户名.github.io/仓库名/`。本项目的导航和素材均使用相对位置，可部署在仓库子路径。

GitHub Free 使用公开仓库发布 Pages 时，代码也会公开。仓库仅跟踪网站运行文件、公开说明和 Git 配置；本地设计资料、原版游戏、旧版 ZIP 与代理指引都通过白名单 `.gitignore` 留在本地。Pages 从 `main` 分支根目录发布。

官方设置说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 隐私、素材与边界

- Little Daily、Cornhub 与广告品牌为虚构教学场景。跳转是真实的网页导航；付款、安装与权限请求是演示，不执行真实交易、下载或系统通知授权，也没有密码、银行卡或验证码输入表单。
- 中英文偏好、当前浏览记录与视频站局部状态使用当前标签的 `sessionStorage`，不会上传。存储不可用时仍可浏览，但刷新后不保留关闭状态。未接入统计服务、广告 SDK、远程字体或外部 CDN。
- 主图、商品图及非露骨视频封面沿用此前内置 Image Gen 生成的本地素材，详见 `design/nightroom-assets.md`（本地项目资料，不在网站 ZIP 中）。
- 普通广告样式参考 [Google AdSense 广告设置](https://support.google.com/adsense/answer/9305577?hl=en) 。原始视觉与文案由本项目实现，没有接入 Google 广告服务；正常广告不自动等于诈骗。
- 部署上线后，托管商会处理访问请求；本站没有自建后台或玩家账号服务。

## English

Little Daily is a real multipage browsing prototype for a community scam-awareness activity. It uses the browser’s own address bar, tabs, history and reload controls. Ads open native tabs; articles, search results and video pages navigate through real URLs. There is no visible timer, automatic ending, replay loop or cross-tab/device score synchronization in this prototype.

After about 30 seconds of foreground article browsing, one ordinary content or ad click follows a real document relay to the fictional Cornhub page. Browser Back returns directly to the article, and the redirection happens only once per tab session. The legacy video URL forwards to the new Cornhub route.

Open `index.html`, or serve the directory over HTTP. `Just-One-Minute-website.zip` contains the files intended for static hosting, including GitHub Pages project paths. Extract it and publish the files, not the ZIP itself. The public project site is https://gary1110086.github.io/CSpopups/ . Pages publishes from the root of the main branch.

Brands and scenarios are fictional. No payment, software installation, notification permission or personal-data submission is performed. Per-tab preferences and actions stay in session storage. Existing images were generated with Image Gen. Google AdSense documentation informed ordinary ad formats; Google does not provide this site’s ads or endorse the scenarios.

The connection-check appearance was inspired by Cloudflare-style verification, but the current page uses Little Daily branding and does not connect to or claim verification by Cloudflare. Original generated imagery and the site implementation are project assets; third-party documentation is referenced for attribution only.
