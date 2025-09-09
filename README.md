# jsdelivr-proxy-express

一个基于 Express.js 的 jsdelivr CDN 代理服务。

## 功能特性

- 🚀 高性能的 CDN 代理服务
- 📦 支持所有 jsdelivr.net 资源访问
- 🔄 自动错误处理和重试机制
- 📊 包含上游响应时间统计
- 💾 优化的缓存策略

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务

开发模式（支持热重载）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务默认运行在 `http://localhost:3000`

### 使用方法

访问任何 jsdelivr 资源，只需将 `https://cdn.jsdelivr.net/gh/geeklinux-io/` 替换为你的服务地址：

```
原始地址: https://cdn.jsdelivr.net/gh/geeklinux-io/example/file.js
代理地址: http://localhost:3000/example/file.js
```

### 健康检查

访问根路径进行健康检查：
```bash
curl http://localhost:3000/
```

返回：
```json
{
  "code": 200,
  "message": "ok",
  "status": "ok"
}
```

## 环境变量

- `PORT`: 服务端口号（默认: 3000）

## 技术栈

- Node.js 18+
- Express.js
- node-fetch

## 部署

### Docker 部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2 部署

```bash
npm install -g pm2
pm2 start server.js --name "jsdelivr-proxy"
```

## 许可证

MIT License
