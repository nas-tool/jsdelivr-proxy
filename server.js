import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// 健康检查路由
app.get('/', (req, res) => {
  res.json({
    code: 200,
    message: 'ok',
    status: 'ok'
  });
});

// 通配符路由处理所有其他请求（必须放在具体路由之后）
app.get('*', async (req, res) => {
  const path = req.path.slice(1); // 移除开头的斜杠
  const targetUrl = `https://cdn.jsdelivr.net/gh/nas-tool/${path}`;
  
  try {
    const startTime = Date.now();
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const upstreamTime = Date.now() - startTime;
    
    // 设置响应头
    res.set({
      'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
      'x-envoy-upstream-service-time': upstreamTime.toString(),
      'x-envoy-upstream-healthchecked-cluster': 'zh-cn',
      'x-envoy-expected-rq-timeout-ms': '5000',
      'Cache-Control': 'public, max-age=31536000, immutable'
    });
    
    // 发送二进制数据
    res.send(Buffer.from(arrayBuffer));
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Network error' });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`jsdelivr-proxy server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});