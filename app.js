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

// ダミーのツイートデータ
const tweets = [
  { text: '汚れつちまつた悲しみに\\n今日も小雪の降りかかる\\n汚れつちまつた悲しみに\\n今日も風さへ吹きすぎる' },
  { text: '智恵子は東京に空が無いといふ、ほんとの空が見たいといふ。智恵子は東京に空が無いといふ、私は驚いて空を見る。' },
  { text: '恥の多い生涯を送ってきました。自分には、人間の生活というものが、見当つかないのです。自分は隣人と、ほとんど会話が出来ません。そこで考え出したのは、道化でした。最後の求愛でした。' },
  { text: 'やは肌のあつき血潮にふれも見でさびしからずや道を説く君\\n乳ぶさおさへ神秘のとばりそとけりぬここなる花の紅ぞ濃き' },
  { text: 'ある日の事でございます。御釈迦様は極楽の蓮池のふちを、独りでぶらぶら御歩きになっていらっしゃいました。' },
  { text: '二人はデッキの手すりに寄りかかって、蝸牛が背のびをしたように延びて、海を抱え込んでいる函館の街を見ていた。' },
  { text: '友がみなわれよりえらく見ゆる日よ\\n花を買ひ来て\\n妻としたしむ\\n一握の砂' },
  { text: '吾輩は猫である。名前はまだ無い。\\nある穏やかな日に大きな猫が前後不覚に寝ている。\\n彼は純粋の黒猫である。' },
];

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
      tweets: JSON.stringify(tweets),
      EIGHTH_WALL_APP_KEY,
    });
  });

  // https://（暗号化）での接続を待ち受けるサーバーを起動する
  server.listen(PORT, () => {
    console.log(`
--------------------------------------------------
App listening at https://${IPv4}:${PORT}/
IP Address: ${IPv4}
Port: ${PORT}
--------------------------------------------------
    `);
  });
})();