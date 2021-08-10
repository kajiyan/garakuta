const https = require('https');
const os = require('os');
const path = require('path');

const devcert = require('devcert');
const dotenv = require('dotenv');
const express = require('express');
const connectLiveReload = require('connect-livereload');
const livereload = require('livereload');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config.js');

const app = express();
const IPv4 = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i.family == 'IPv4' && !i.internal).address;

// 設定ファイル .env の内容を process.env へ展開する
dotenv.config();

// テンプレートエンジンに ejs を使用する
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// リクエストボディの JSON, Content-Type が application/x-www-form-urlencoded をパースできるようにする
app.use(express.json());
// ブラウザに変更を通知する、HMR に対応している箇所はリロードせずに更新される
app.use(express.urlencoded({ extended: false }));
// public フォルダのファイルを参照できるようにする 
app.use(express.static(path.join(__dirname, 'public')));

// 開発時のみ以下の if 文の中が有効となる
if (app.get('env') === 'development') {
  const compiler = webpack(config);
  const liveReloadServer = livereload.createServer();

  // js 以外のファイルが上書きされたときにブラウザを更新する設定
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });

  app.use(connectLiveReload({
    src: 'http://localhost:35729/livereload.js?snipver=1',
  }));

  // express に webpack-dev-middleware を組み込む
  // webpack.config.js の設定内容で使用する
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));
}

(async () => {
  const { HOST, PORT, EIGHTH_WALL_APP_KEY } = process.env;
  // IP Address がサポートされていない別の方法で SSL にするか
  // https:// でサーバーを起動するために必要な証明書を生成する
  const { key, cert } = await devcert.certificateFor(HOST);
  const server = https.createServer({ key, cert }, app);

  app.get('/', (req, res) => {
    // views/home.ejs を表示する
    res.render('home', {
      title: 'Express',
      EIGHTH_WALL_APP_KEY,
    });
  });

  // https://（暗号化）での接続を待ち受けるサーバーを起動する
  server.listen(PORT, () => {
    console.log(`
App listening at https://${IPv4}:${PORT}/
IP Address: ${IPv4}
Port: ${PORT}
    `);
  });
})();