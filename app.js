const https = require('https');
const path = require('path');

const devcert = require('devcert');
const express = require('express');
const connectLiveReload = require('connect-livereload');
const livereload = require('livereload');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.config.js');

const PORT = 3000;

const app = express();
const compiler = webpack(config);
const liveReloadServer = livereload.createServer();

liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});

// テンプレートエンジンに ejs を使用する
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(connectLiveReload({
  ignore: [/\.js(\?.*)?$/],
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
// リクエストボディの JSON, Content-Type が application/x-www-form-urlencoded をパースできるようにする
app.use(express.json());
// ブラウザに変更を通知する、HMR に対応している箇所はリロードせずに更新される
app.use(express.urlencoded({ extended: false }));
// public フォルダのファイルを参照できるようにする 
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  // https:// でサーバーを起動するために必要な証明書を生成する
  const { key, cert } = await devcert.certificateFor('localhost');
  const server = https.createServer({ key, cert }, app);

  app.get('/', (req, res) => {
    // views/home.ejs を表示する
    res.render('home', {
      title: 'Express',
    });
  });

  // https://（暗号化）での接続を待ち受けるサーバーを起動する
  server.listen(PORT, () => {
    console.log(`App listening at https://localhost:${PORT}/`);
  });
})();