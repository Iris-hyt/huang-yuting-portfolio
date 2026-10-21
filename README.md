# 黄钰婷个人介绍网站

这是一个无需安装依赖的单页个人网站，使用原生 HTML、CSS 和 JavaScript 构建。直接双击 `index.html` 即可预览，也可以部署到 GitHub Pages、Netlify 等静态网站托管服务。

## 文件说明

```text
.
├─ index.html                     页面内容与个人信息
├─ styles.css                    视觉样式与响应式布局
├─ script.js                     导航、滚动动画与邮箱复制
├─ start-mobile-preview.ps1      启动手机可访问的局域网预览
├─ start-public-preview.ps1      启动所有设备可访问的公网预览
├─ assets/
│  ├─ portrait.jpg               从简历中提取的个人照片
│  ├─ 黄钰婷-简历.pdf            可下载的简历
│  ├─ favicon.svg                网站图标
│  └─ social-preview.png         社交分享预览图
└─ README.md
```

## 本地预览

最简单的预览方式是双击 `index.html`。

如果希望更接近正式部署环境，可以在本目录打开终端并运行：

```powershell
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 手机预览

手机和电脑连接同一个 Wi-Fi 后，在本目录打开 PowerShell 并运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-mobile-preview.ps1
```

脚本会启动局域网 HTTP 服务，并输出形如 `http://192.168.1.10:8080/` 的手机访问地址。把该地址输入手机浏览器即可查看。

注意：

- 此地址仅在电脑开机且预览服务运行时有效。
- 手机与电脑必须处于同一个 Wi-Fi 网络。
- 如果手机无法连接，请在 Windows 防火墙提示中允许 Python 访问“专用网络”。
- 如果希望不在同一 Wi-Fi 的人也能访问，需要将网站部署到 GitHub Pages、Netlify 等公开托管平台。

## 公网临时预览

如果希望任何设备都能通过链接查看，可以运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-public-preview.ps1
```

脚本会启动本地网站，并通过 Cloudflare Quick Tunnel 生成一个 `https://...trycloudflare.com` 临时公网地址。该地址：

- 只要求电脑开机、联网且两个预览进程继续运行；
- 不要求访问者与电脑处于同一个 Wi-Fi；
- 任何拿到链接的人都可以访问，分享时请注意隐私；
- 重启电脑或关闭进程后会失效，再次运行脚本会获得新地址。

如需长期稳定的公网网址和自定义域名，建议部署到 GitHub Pages、Cloudflare Pages 或 Netlify。

## 修改个人信息

所有可见内容都在 `index.html` 对应区块中：

- 首屏与基本资料：搜索 `hero`
- 个人简介：搜索 `id="about"`
- 精选项目：搜索 `id="projects"`
- 能力与工具：搜索 `id="skills"`
- 教育与经历：搜索 `id="experience"`
- 联系方式：搜索 `id="contact"`

人物照片位于 `assets/portrait.jpg`，使用相同文件名替换即可。简历文件位于 `assets/黄钰婷-简历.pdf`，更新时可以使用相同文件名覆盖。

主色和字体集中在 `styles.css` 顶部的 `:root` 变量中；邮箱位于 `index.html` 的 `contact` 区块和 `data-copy-email` 属性中，修改时需要同步更新这两处。

## 部署到 GitHub Pages

1. 新建 GitHub 仓库，将 `outputs` 目录中的文件上传到仓库根目录。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. 分支选择 `main`，目录选择 `/ (root)`，保存。
5. 等待部署完成后访问 GitHub 提供的网址。

如果 GitHub Pages 地址为 `https://用户名.github.io/仓库名/`，建议在 `index.html` 中增加：

```html
<meta property="og:url" content="https://用户名.github.io/仓库名/">
```

并把 `og:image` 改为完整网址，例如：

```html
<meta property="og:image" content="https://用户名.github.io/仓库名/assets/social-preview.png">
```

## 部署到 Netlify

1. 登录 Netlify，选择 **Add new site → Import an existing project**。
2. 连接 GitHub 仓库，或直接将 `outputs` 文件夹拖入 Netlify Drop。
3. 构建命令留空，发布目录填写 `.`。
4. 部署完成后，在 `index.html` 中把 `og:image` 更新为网站完整网址。

## 隐私说明

简历中的手机号没有放在公开网页上，网站仅展示邮箱和所在城市。如需公开展示手机号或其他社交账号，可以直接在 `contact` 区块补充。

## 仍需补充或确认

- 是否公开展示手机号。
- 是否添加 GitHub、LinkedIn、小红书、微信公众号等社交链接。
- 项目部分目前仅使用简历中的真实信息，没有添加虚假项目链接或成果。如有个性化项目页面、作品图片或可公开链接，可以继续补充。
