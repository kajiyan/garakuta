# SING US
SSL（`https://○○○○○○○`）で環境構築するために [devcert](https://www.npmjs.com/package/devcert) （※1）を使用します。  
Windows で devcert を使用するのに PC へ以下から OpenSSL をインストールして、参照できるようにパスを通します。PowerShell やコマンドプロンプトなどの CLI が起動している場合、アプリケーションを再起動することでパスが反映されます。  
また、VS Code のターミナルからの使用を想定をしている場合、OpenSSL のパスを VS Code より先頭に設定する必要がありました。  

※1 IPアドレスをサポートしていない。例えば `127.0.0.1` では証明書を生成できない。`localhost` とする必要がある。

#### Windows への OpenSSL インストール参考サイト

- [OpenSSLをWindows10にインストールする](https://blog.katsubemakito.net/articles/install-openssl-windows10)
- [Win32/Win64 OpenSSL Installer for Windows - Shining Light Productions](https://slproweb.com/products/Win32OpenSSL.html)

## リロードについて
`src` ディレクトリ以下の js ファイルは HMR されます。  
その他のファイル、サーバー側のプログラムが更新されたときはブラウザが更新（リロード）されます。

8th wall engine version 17.0.5.476
threejs r123

## 8th Wall のセットアップ
参考ページ
- [Local Hosting | 8th Wall Documentation](https://www.8thwall.com/docs/web/#local-hosting)
- [8thwall/web: 8th Wall Web projects and resources.](https://github.com/8thwall/web)

1. アカウントに[ログイン](https://www.8thwall.com/login)します。
2. WORKSPACE へ移動して「Start a new project」から新規プロジェクトを作成します。
3. 制作したプロジェクトの Project メニューへ移動、DOMAINS の「Setup Domains」→「Setup this project for self-hosting or local development」をクリックして IP アドレスを登録する。IP アドレスは `package.json` に記述されている `start` を実行することで得ることができます。
4. プロジェクトの Settings メニューへ移動、「Self-Hosting」→「My App Key」で表示される文字列をコピーする。
5. HTML ファイルに「`<script src="//cdn.8thwall.com/web/xrextras/xrextras.js"></script>`」「`<script async src="//apps.8thwall.com/xrweb?appKey={コピーした App Key}"></script>`」を追加（※1）する。（※ App Key が記載されているファイルはWeb上, Github上で公開しないように注意）
6. 制作したプロジェクトの Project メニューへ移動、「Device Authorization」をクリックして検証する携帯端末で表示された QR コードを撮影して端末を認証する。
7. 検証する携帯端末と開発するパソコン（ローカルサーバーを起動しているパソコン）を同一のネットワーク（Wi-Fi）に接続する。
8. 検証する携帯端末で https://{ 登録したIP アドレス }:{ ポート番号 } へアクセスする。

手順 1 ~ 5 は最初に一度だけ行うだけでいい。基本的に開発時は手順 6 ~ 8 のみを行うが、IP が変わってしまう場合があるので手順 3 で登録した IP アドレスが現在の IP アドレスと一致しているかは確認が必要。

※1 8th Wall の engine version が 17.0.5.476 の場合に併せて Three.js を使用する場合、Three.js r123 `<script src="//cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.min.js"></script>` も 8th Wall より先に追加する。