# 资源下载中心

一个美观、响应式的资源下载网站，支持分类导航和搜索功能。

## 功能特性

- 分类导航首页，展示所有资源分类
- 分类详情页，展示该分类下的所有下载项目
- 子分类筛选功能
- 全局搜索和子分类内搜索
- 网格/列表视图切换
- 响应式设计，适配各种设备
- 美观的UI设计，友好的交互体验

## 文件结构
/download/
├── index.html # 主页面 - 分类导航
├── download.html # 下载页面
├── css/
│ ├── style.css # 通用样式
│ ├── index.css # 首页样式
│ └── download.css # 下载页面样式
├── js/
│ ├── main.js # 通用功能
│ ├── index.js # 首页逻辑
│ ├── download.js # 下载页面逻辑
│ └── utils.js # 工具函数
├── data/
│ ├── navigation.json # 导航分类数据
│ └── .json # 各个分类数据
├── assets/ # 静态资源目录
└── README.md # 项目说明文档

text

## 使用方法

1. 将整个项目文件夹部署到Web服务器
2. 在浏览器中打开 `index.html`
3. 点击分类卡片进入对应的下载页面
4. 在下载页面可以使用搜索和筛选功能查找资源

## 数据格式说明

### 导航数据 (navigation.json)
存储网站的分类导航信息，每个分类包含：
- id: 分类唯一标识（建议使用中文）
- name: 分类名称
- icon: Font Awesome图标类名
- description: 分类描述
- color: 分类主题色（十六进制）

### 分类数据 (分类名.json)
每个分类一个JSON文件，包含：
- category: 分类ID
- categoryName: 分类显示名称
- subcategories: 子分类数组
- items: 下载项目数组

每个下载项目包含：
- id: 项目唯一标识
- name: 项目名称
- description: 项目描述
- icon: Font Awesome图标类名
- subcategory: 所属子分类ID
- downloadLink: 下载链接
- fileSize: 文件大小
- version: 版本号
- platforms: 支持平台数组
- tags: 标签数组

## 添加新分类

1. 在 `data/navigation.json` 中添加新分类
2. 创建对应的分类JSON文件（如 `软件.json`）
3. 按照模板格式添加下载项目数据
4. 刷新页面即可看到新分类

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 注意事项

- 下载链接需要是有效的URL地址
- 图标使用Font Awesome，需要网络连接
- JSON文件使用UTF-8编码，支持中文
- 如需离线使用，请下载Font Awesome文件到本地

2. /download/assets/favicon.ico
您可以从网上下载一个合适的favicon图标，或者使用以下网站生成：
```
https://favicon.io/
```
```
https://realfavicongenerator.net/
```
或者使用简单的纯色图标，也可以暂时不添加favicon。

将所有文件按照上述结构保存到 /download/ 目录下

在浏览器中直接打开 index.html 即可运行

首页会显示"音乐"分类卡片

点击"音乐"卡片进入下载页面

在下载页面可以：

使用子分类筛选（流行音乐、古典音乐、影视原声、工具软件）

使用全局搜索和子分类内搜索

切换网格/列表视图

点击"下载"按钮下载文件

点击"详情"按钮查看项目详细信息
