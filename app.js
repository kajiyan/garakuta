const https = require('https');

const devcert = require('devcert');
const express = require('express');

const PORT = 3000;

const app = express();

(async () => {
  // https:// でサーバーを起動するために必要な証明書を生成する
  const { key, cert } = await devcert.certificateFor('localhost');
  const server = https.createServer({ key, cert }, app);

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // https://（暗号化）での接続を待ち受けるサーバーを起動する
  server.listen(PORT, () => {
    console.log(`App listening at https://localhost:${PORT}/`);
  });
})();