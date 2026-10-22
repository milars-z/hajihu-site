# 哈基狐的夜间实验室

Hajihu's little corner of the internet.

一个纯 HTML、CSS、JavaScript 的静态小网站。给好奇心留一盏灯。当前版本：v1.3。

## 内容

- 原创内嵌 SVG 狐狸与夜间工作台插画，可切换桌灯。
- Canvas 星图：让散落的星星连成狐狸、重新打散、点击产生涟漪。
- 六张可轮换的虚构夜间纸条。
- 「未完成博物馆」：三件可展开的开放问题，一株会开出星星的月光小芽。
- 狐狸鼻尖藏着五个可轮换的小念头，支持鼠标、触摸和键盘。
- 「窗外来信」：附原始来源的独立看图札记。首篇《失真也可以是证据》讨论 Euclid 爱因斯坦环照片与解释的边界。
- 月亮小窗：公开、非安全的 `milars` 口令彩蛋与临时星光，不是真实认证或私密空间。
- 响应式布局、键盘操作、减少动态效果偏好支持。

本站文案、独立评论与 SVG 插画为本站创作；科学事实附来源链接。窗外来信中的 ESA 天文照片是按许可转载的第三方图像，署名与许可见下文及文章页。没有外部运行依赖、字体请求、CDN、登录、分析追踪或浏览器持久化存储，不收集个人信息。

## 使用

直接打开 `index.html` 即可使用，无需构建或安装依赖。也可以通过任何静态文件服务器预览，例如已有 Python 的环境：

```sh
python3 -m http.server 8000
```

访问 `http://localhost:8000`。部署时保留以下目录结构：

```text
index.html
styles.css
script.js
letters/
  distortion.html
assets/
  einstein-ring-ngc6505.jpg
```

本版本不修改部署流程、服务器或基础设施配置。

## 交互与无障碍

- 所有按钮支持 Tab、Enter / Space。
- 博物馆使用原生 `details` / `summary`，无需脚本也能展开阅读；种子可循环经历等待、发芽、星星花三个阶段。
- 星图可通过 Tab 聚焦，Enter / Space 切换秩序，方向键移动涟漪。
- 星图支持鼠标及触摸；可用「暂停漂浮」停止动画。
- 开启系统「减少动态效果」时，星图默认暂停，状态切换即时完成，茶汽动画停止。
- 页面失去可见性或星图滚出视口时，星图停止请求动画帧。
- 没有 JavaScript 时，插画与手记仍可阅读。

## 维护

- 首页文案与插画：`index.html`
- 窗外来信文章：`letters/distortion.html`
- 自托管许可图像：`assets/einstein-ring-ngc6505.jpg`
- 颜色、排版与响应式布局：`styles.css`
- 桌灯、星图、纸条：`script.js`

无需密钥、环境变量或后端服务。

## 静态资源缓存

HTML 中的 CSS 与 JavaScript 使用同一版本查询参数（当前为 `?v=1.3`），避免发布后浏览器将新 HTML 与旧资源混用。每次更改样式或脚本时，同步更新这两个版本参数与页脚版本。v1.1.1 同时修正了博物馆样式与媒体查询中的多余前导字符。


## 第三方图像署名与许可

- 文件：`assets/einstein-ring-ngc6505.jpg`（1920 × 1920 JPEG，原文件未修改）。
- 标题：Close-up of the Einstein ring around galaxy NGC 6505
- 原图来源：https://www.esa.int/ESA_Multimedia/Images/2025/02/Close-up_of_the_Einstein_ring_around_galaxy_NGC_6505
- 精确署名：ESA/Euclid/Euclid Consortium/NASA, image processing by J.-C. Cuillandre, G. Anselmi, T. Li
- 许可：[CC BY-SA 3.0 IGO](https://creativecommons.org/licenses/by-sa/3.0/igo/)
- 本站自托管原始文件，未修改、未裁切、未调色；仅按屏幕宽度等比缩放完整画幅。
- 该图像许可与本站独立原创评论分开，不暗示 ESA、Euclid 团队或原论文作者对本站的认可。复用该图像时请保留其署名并遵守许可条件。

## 窗外来信资料

首篇《失真也可以是证据》由哈基狐写于 2026-10-23（UTC+08），类别为看图札记，使用 2025-02-10 发布的资料，不作为最新新闻。

- ESA 观测说明：https://www.esa.int/Science_Exploration/Space_Science/Euclid/Euclid_discovers_a_stunning_Einstein_ring
- 研究论文：https://arxiv.org/html/2502.06505v1
- 模型不确定性讨论：https://arxiv.org/html/2502.06505v1#S4.SS3

文章无需 JavaScript，可直接打开，或在 GitHub Pages 子路径及普通静态服务器上访问。所有本地资源使用相对路径。


## 月亮小窗说明

这是公开静态网页中的游戏式彩蛋，不是真实认证、隐私区域或安全边界。用户指定的名字 `milars` 明文存在于公开源代码中，任何人都可以查看或绕过。请勿放入敏感内容、真实密码或私人聊天。

- 入口为首页插画下方的月亮按钮，支持键盘、鼠标和触摸。
- 原生对话框提供焦点约束与 Escape 关闭；关闭后返回入口焦点，浏览器 Back 关闭小窗、Forward 重新打开门口。
- 名字输入只在浏览器内比较，不提交、不记录、不持久化；支持 Enter 提交。
- 星星只存在于当前打开的会客室。回到门口、关闭小窗或刷新页面都会清空。
- 不包含私人资料、后端、登录、真实鉴权、分析或第三方请求。
- v1.3 同时提高了纸张区域小字号文字的对比度。
