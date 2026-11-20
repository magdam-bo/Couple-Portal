# 推しカプポータルサイト

React / TypeScript / Vite で作る、日本語の創作設定図鑑です。
ホームのワールド一覧から、人物・カップリング・世界設定を閲覧します。
編集画面はありません。JSONを編集してコミットするとGitHub Actionsが検証・ビルド・公開します。

## 実行

Node.js 22以上を推奨します。

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

`npm run build` はJSON・関連ID検証 → 型検査 → Viteビルド → AI用JSON出力の順で実行します。
AI用JSONは開発サーバーでも、本番ビルド・previewでも利用できます。

## GitHub Pagesで公開

1. 指定のリポジトリの `main` に本ソースを登録します（既存ファイルは先に確認してください）。
2. リポジトリの Settings → Pages → Build and deployment → Source を **GitHub Actions** にします。
3. Actions の **Build and deploy Pages** が完了すると、deployジョブに公開URLが表示されます。
4. 初回push後に設定を変えた場合は Actions → Build and deploy Pages → Run workflow で再実行します。

`.github/workflows/pages.yml` を同梱しています。PRではテストとビルドのみ、mainでは公開も実行します。
Viteの相対baseとHashRouterを使用するため、リポジトリ名に依存せず、詳細ページの再読み込みでも404になりません。
公開URLは実際のGitHub Pagesデプロイ成功後に確認してください。

## データ構造

| ディレクトリ | 1ファイルの単位 | 主な関連ID |
|---|---|---|
| `data/worlds/` | ワールド | `id` |
| `data/groups/` | 作品・グループ | `worldId` |
| `data/characters/` | キャラクター | `worldId`, `groupIds[]` |
| `data/couples/` | カップリング | `worldId`, `characterIds[2]` |
| `data/lore/` | 世界設定資料 | `worldId` |
| `data/events/` | 年表イベント | `worldId`, `characterIds[]`, `coupleIds[]` |

すべてのデータは固有IDを持ちます。IDは英小文字・数字・ハイフンです。
キャラクターはグループ未所属・複数所属に対応します。
カップリングのグループは構成するキャラクターの所属から導出します。グループをまたぐ組も登録できます。
攻め受けを未確定のまま省略することもできます。
グループ・人物参照は同一ワールド内で検証し、重複ID・存在しない参照はビルドエラーになります。

### 設定の状態

各レコードに `status` が必要です。プロフィールなどの各設定項目も `{ "text": "内容", "status": "confirmed" }` で記録します。

| 値 | 表示 | 扱い |
|---|---|---|
| `confirmed` | 確定 | 本編の確定設定 |
| `draft` | 仮設定 | 未確定 |
| `if` | IF | 別の可能性の設定 |
| `deprecated` | 廃止 | 現在は採用しない設定 |

通常の表示は確定設定のみです。「すべての設定」で他の状態をラベル付きで確認できます。
設定の階層はレコードの状態を上限として解釈します。IFレコード内のconfirmed項目も、IF内で確定した設定であり、本編の確定設定ではありません。
未登録の設定を補完しないでください。廃止データは削除するか `deprecated` にします。
空文字・空の配列・未登録のプロフィール見出しは表示しません。

### 人物の追加例

`data/characters/` にIDと同名のJSONを追加します。以下は構造例であり、登場人物の確定設定ではありません。

```json
{
  "id": "example-character",
  "status": "draft",
  "worldId": "idol",
  "groupIds": ["revival"],
  "name": "入力する名前",
  "summary": "短い紹介",
  "profile": {
    "reading": { "text": "読み方", "status": "draft" },
    "age": { "text": "年齢", "status": "draft" }
  },
  "personality": {
    "personality": [{ "text": "性格", "status": "draft" }]
  },
  "speech": {
    "firstPerson": { "text": "一人称", "status": "draft" },
    "names": [{ "characterId": "maya", "text": "呼称", "status": "draft" }],
    "samples": [{ "text": "台詞", "status": "draft" }]
  },
  "relationships": [{ "characterId": "maya", "text": "関係の説明", "status": "draft" }],
  "aiNotes": ["この人物を解釈するときの注意"]
}
```

`profile` キー: `reading`, `age`, `height`, `birthday`, `affiliation`, `appearance`。
`personality` キー: `personality`, `likes`, `dislikes`, `hobbies`, `skills`, `behavior`, `past`, `episodes`。
`speech` キー: `firstPerson`, `secondPerson`, `features[]`, `samples[]`, `names[]`。
独自の項目名も記録できます。その場合は `src/data.ts` の `labels` に日本語の見出しを追加してください。
名前と所属は基本データから表示され、プロフィールに重複保存する必要はありません。

### カップリングの詳細

`data/couples/` の既存ファイルを参考にしてください。
`characterIds` は2人のID、`roles` は `{ "semeId": "人物ID", "ukeId": "人物ID" }` です。
`details` に `meeting`（出会い）、`current`（現在）、`changes`（変化）、`episodes`（重要エピソード）の設定配列を登録します。
`perspectives` は人物ごとに分離した配列です。`characterId`、`feelings[]`（感情）、`recognition[]`（認識）、`callsPartner`（呼び方）を記録します。
`relatedCharacterIds` に関連する人物を指定できます。

### 世界設定と年表

`data/lore/` の `sections` 配列に `{ "id": "history", "title": "歴史", "entries": [...] }` を追加します。
概要・歴史・地理・社会制度・組織・施設・用語集・年表を任意に追加できます。
時系列のイベントは `data/events/` に以下の構造で登録できます。

```json
{
  "id": "example-event",
  "status": "draft",
  "worldId": "idol",
  "title": "出来事の名前",
  "date": "時期（自由形式）",
  "description": "説明",
  "characterIds": [],
  "coupleIds": []
}
```

### 画像・テーマ

`public/images/` に画像を置き、人物・ワールドの `image` に `images/ファイル名.png` を指定します。
未設定・画像読み込み失敗時はアイコンで代替します。画像の権利を確認して登録してください。
人物の立ち絵は全体が見えるように表示します。
ワールドとグループの `themeColor` は `#` 付き6桁の色指定です。
`sortOrder`（任意の数値）でワールドの並び順を制御できます。

## AI向けJSON

ビルド時、元の設定と状態を保ったまま次の静的ファイルを生成します。

- `ai/index.json`: 各種データのIDとファイル位置、解釈上の注意
- `ai/characters/{id}.json`: 人物ごとの構造化設定
- `ai/couples/{id}.json`: カップリングごとの構造化設定
- `ai/worlds/{id}.json`: ワールドの概要
- `ai/worlds/{id}-bundle.json`: ワールドに属する全資料
- `ai/groups/{id}.json`, `ai/lore/{id}.json`, `ai/events/{id}.json`
- `data/`: 元JSONの配布用コピー

サイトからJSONへのリンクを開けます。認証APIやChatGPTへの自動同期は第1段階には含みません。
`aiNotes` は各レコードに記録できます。Markdown自動生成は `scripts/export-data.mjs` と同じ `loadData()` を使って追加できます。
厳密なデータ定義は `scripts/schema.mjs`、画面用の型は `src/types/index.ts` です。

## 第1段階の内容

- 3ワールド、2グループ、12人、2組、3つの世界設定資料
- 一覧・詳細・検索・所属絞り込み・相互リンク・パンくず・戻るリンク
- 確定/仮/IF/廃止の状態管理、未登録項目の非表示
- ダークテーマ、PC/スマートフォン対応、画像代替
- データ参照テスト、ビルド時のJSON検証、GitHub Pages公開ワークフロー

画像や長文設定は未登録です。初期内容は既に確認されている設定だけの最小データです。
今後は詳細な人物設定・世界設定・画像の追加、Markdown出力、データ定義のJSON Schema配布を追加できます。
