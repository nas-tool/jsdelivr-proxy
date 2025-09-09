import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const { url } = req;
  const path = url === '/' ? '' : url.slice(1);
  
  // 健康检查
  if (path === '' || path === '/') {
    res.status(200).json({
      code: 200,
      message: 'ok',
      status: 'ok'
    });
    return;
  }
  
  // 代理请求
  const targetUrl = `https://cdn.jsdelivr.net/gh/geeklinux-io/${path}`;
  
  try {
    const startTime = Date.now();
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const upstreamTime = Date.now() - startTime;
    
    // 设置响应头
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
    res.setHeader('x-envoy-upstream-service-time', upstreamTime.toString());
    res.setHeader('x-envoy-upstream-healthchecked-cluster', 'hkg');
    res.setHeader('x-envoy-expected-rq-timeout-ms', '5000');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    // 发送二进制数据
    res.status(200).send(Buffer.from(arrayBuffer));
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Network error' });
  }
}