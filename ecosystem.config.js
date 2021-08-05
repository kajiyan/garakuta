// PM2（https://pm2.keymetrics.io/）を使って Node で起動したサーバーの永続化を行います
// このファイルは PM2 の設定ファイルです

module.exports = {
  apps: [
    {
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      ignore_watch:['node_modules', 'src'],
      name: 'garakuta',
      script: './app.js',
      watch: process.env.NODE_ENV === 'development',
    },
  ],
};