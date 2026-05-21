# StudyCycle

大学教科書交換プラットフォーム「StudyCycle」のレスポンシブランディングページです。

## すぐページとして動かす

この環境では `npm` が見つからないため、すぐ確認できる静的プレビューを用意しています。

```powershell
.\run-preview.ps1
```

起動したら、ブラウザで次を開きます。

```text
http://127.0.0.1:4173
```

## Next.js 版を動かす

`npm` が使える環境では、次の手順で Next.js アプリとして動かせます。

```powershell
.\run-next.ps1
```

または手動で起動します。

```powershell
npm install
npm run dev
```

その後、ブラウザで表示されるローカル URL を開いてください。

## npm を使えるようにする方法

Windows なら、Node.js の公式 LTS 版を入れるのが一番簡単です。

1. https://nodejs.org/ja を開く
2. LTS 版をダウンロードしてインストールする
3. PowerShell やターミナルを開き直す
4. 次を確認する

```powershell
node -v
npm -v
```

両方のバージョンが表示されれば準備完了です。
