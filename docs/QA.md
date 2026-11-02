# 検証記録 2026-11-02

- npm test: 14件成功。料金・一括/継続・セット割引・未確認・ポイント換算・広告許可判定。
- npm run build: index可能18ページ+404、sitemap.xml、robots.txt、JSON-LD、CSPを生成。
- npm run check: 20 HTML、重複しないtitle18、内部リンク370件、未承認広告の外部scriptなし。
- ブラウザー: PC Chromeで初期結果、iPhone3か月プレミアム19,100円、成人向け2サービス絞込を実操作して一致。
- 最初の360px iframeで12px横はみ出しを検出。grid min-contentのレシート幅が原因、修正後、360/390/768/1280pxの4 iframeでscrollWidth=clientWidth、5結果の描画を確認。
- Android実機/iOS実機は未確認。ブラウザーのiframe検証を実機と称さない。
- 公開URL/HTTPヘッダーの本番配信/広告配信/収益は未確認。
