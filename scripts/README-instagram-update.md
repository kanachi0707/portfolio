# Instagram Latest JSON Update

このスクリプトは `instagram-latest.json` を更新します。

実行例:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\update-instagram-json.ps1
```

動き:
- Instagram プロフィールページから最新投稿 shortcode を取得
- `instagram-latest.json` の `url` と `updatedAt` を更新
- 取得失敗時は既存URL、なければ固定フォールバック投稿を保持
- `status` と `error` を JSON に残す

注意:
- Instagram 側の HTML 構造変更で壊れる可能性があります
- その場合でもサイトは `fallbackUrl` を表示できます
