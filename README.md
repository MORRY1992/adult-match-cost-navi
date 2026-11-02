# 大人のマッチング実費ナビ

18歳以上向けの恋活・婚活・出会いサービスの費用比較。公式確認済みの支払総額・決済経路・オプションと、ポイント消費換算、自動更新・解約条件を分離して表示する静的サイト。

- `npm test`: 料金計算と初期広告停止を検証
- `npm run build`: `dist/`へ18ページ+404とSEO設定を出力
- `npm run check`: 出力・内部リンク・広告停止状態を確認
- Node.js 22以上。追加ライブラリ・有料APIなし。

Cloudflare Pages: Framework `None`, build command `npm run build`, output directory `dist`, production branch `main`。正式URLは公開後に確認する。

公式出典・照合日時は `data/services.json`、運用は `docs/OPERATIONS.md`、検証は `docs/QA.md`。未確認の料金はnull、広告は未承認・配信停止。公開前のURL候補を稼働実績と扱わない。
