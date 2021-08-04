# garakuta
SSL（`https://○○○○○○○`）で環境構築するために [devcert](https://www.npmjs.com/package/devcert) を使用します。  
Windows で devcert を使用するのに PC へ以下から OpenSSL をインストールして、参照できるようにパスを通します。PowerShell やコマンドプロンプトなどの CLI が起動している場合、アプリケーションを再起動することでパスが反映されます。  
また、VS Code のターミナルからの使用を想定をしている場合、OpenSSL のパスを VS Code より先に設定する必要がありました。  

#### Windows への OpenSSL インストール参考サイト

- [OpenSSLをWindows10にインストールする](https://blog.katsubemakito.net/articles/install-openssl-windows10)
- [Win32/Win64 OpenSSL Installer for Windows - Shining Light Productions](https://slproweb.com/products/Win32OpenSSL.html)