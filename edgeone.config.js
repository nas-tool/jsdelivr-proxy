module.exports = {
  // EdgeOne 配置
  runtime: 'nodejs18',
  entry: 'server.js',
  routes: [
    {
      path: '/',
      handler: 'server.js'
    },
    {
      path: '/*',
      handler: 'server.js'
    }
  ],
  environment: {
    NODE_ENV: 'production'
  }
};