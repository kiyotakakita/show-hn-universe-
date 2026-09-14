import { ShowHnProject } from '../types';
import { CLUSTERS } from './clusters';

// Utility to create natural jittered points around a cluster center
function jitter(center: [number, number, number], spread = 12): [number, number, number] {
  return [
    center[0] + (Math.random() - 0.5) * spread * 2,
    center[1] + (Math.random() - 0.5) * spread * 2,
    center[2] + (Math.random() - 0.5) * spread * 2,
  ];
}

export const INITIAL_SHOW_HN_PROJECTS: ShowHnProject[] = [
  // Web & Creative (including Closebytes)
  {
    id: 39482010,
    title: 'Show HN: Closebytes – Explore GitHub repos as an interactive 3D universe',
    url: 'https://github.com/closebytes/closebytes',
    hnUrl: 'https://news.ycombinator.com/item?id=39482010',
    points: 482,
    commentsCount: 124,
    author: 'novastars',
    postedDate: '2025-02-18',
    cluster: 'web-creative',
    position: jitter(CLUSTERS['web-creative'].centerPosition, 6),
    tags: ['#3D', '#WebGL', '#ThreeJS', '#OSS', '#VisualMap'],
    summary: {
      oneLiner: 'GitHubの膨大なオープンソースリポジトリを3D星雲マップとして可視化・探索するWebツール。',
      highlights: [
        'リポジトリ間の類似度や依存関係を有向グラフ・点群として配置。',
        '星をクリックするとコミット推移や関連ライブラリが連鎖的に光る。',
        'WebGPU / WebGLによる60FPSのスムーズな宇宙航行UI。',
      ],
      targetAudience: '新しいOSSツールやライブラリを直感的な探検気分で見つけたいエンジニア。',
      hackIdea: 'スター数だけでなく、「自分のGemini相談履歴やローカルコードベース」と類似したOSSが光るパーソナライズ版を作れば神ツールになる。',
    },
  },
  {
    id: 39510234,
    title: 'Show HN: RaytraceGL – Real-time path tracer running in 4KB of WebGL',
    url: 'https://github.com/photon-dev/raytrace-gl',
    hnUrl: 'https://news.ycombinator.com/item?id=39510234',
    points: 319,
    commentsCount: 52,
    author: 'shader_witch',
    postedDate: '2025-02-14',
    cluster: 'web-creative',
    position: jitter(CLUSTERS['web-creative'].centerPosition, 8),
    tags: ['#Graphics', '#WebGL', '#Shader', '#Demoscene'],
    summary: {
      oneLiner: 'たった4KBのGLSLフラグメントシェーダーだけで動作するリアルタイム・パストレーサー。',
      highlights: [
        'BVHなしで球体と直方体の反射・屈折・ソフトシャドウをリアルタイム計算。',
        'スマホブラウザでも即座に起動し、驚異的なビジュアルを生成。',
      ],
      targetAudience: 'グラフィックスプログラマ、デモシーン愛好家、シェーダーマニア。',
      hackIdea: 'マイク音声と同期して光の波形がリアルタイムに歪む3Dオーディオビジュアライザーに進化させる。',
    },
  },
  {
    id: 39498112,
    title: 'Show HN: InfiniteCanvas.js – Zero-dependency infinite zoom whiteboard engine',
    url: 'https://github.com/alex-dev/infinite-canvas',
    hnUrl: 'https://news.ycombinator.com/item?id=39498112',
    points: 275,
    commentsCount: 68,
    author: 'alex_whiteboard',
    postedDate: '2025-02-11',
    cluster: 'web-creative',
    position: jitter(CLUSTERS['web-creative'].centerPosition, 7),
    tags: ['#Canvas', '#TypeScript', '#InfiniteCanvas', '#Frontend'],
    summary: {
      oneLiner: '依存ライブラリゼロで軽量かつ滑らかな無限キャンバス・パン/ズームエンジン。',
      highlights: [
        '数万個のノードを画面内外の空間インデックス(QuadTree)で超高速カリング。',
        'トラックパッドとタッチジェスチャーに完璧に対応した慣性スクロール。',
      ],
      targetAudience: 'MiroやFigmaライクな無限キャンバスツールを自作したいWeb開発者。',
      hackIdea: 'Markdownやコードスニペットを貼るだけで自動でノード化されるミニマムな個人用ノートを作る。',
    },
  },
  {
    id: 39441203,
    title: 'Show HN: NeumorphSound – WebAudio synthesizer with haptic feedback visualizer',
    url: 'https://github.com/soundwave/neumorph-synth',
    hnUrl: 'https://news.ycombinator.com/item?id=39441203',
    points: 184,
    commentsCount: 39,
    author: 'soundwave',
    postedDate: '2025-02-05',
    cluster: 'web-creative',
    position: jitter(CLUSTERS['web-creative'].centerPosition, 9),
    tags: ['#WebAudio', '#CreativeCoding', '#Synth', '#UI'],
    summary: {
      oneLiner: 'Web Audio APIとCanvasを活用した触感フィードバック付きインタラクティブ・シンセ。',
      highlights: [
        '波形を指で直接なぞって音色を生成できるオーガニックなUI。',
        'MIDIコントローラーの接続にも対応し低レイテンシで発音。',
      ],
      targetAudience: '電子音楽制作者、インタラクティブメディアデザイナー。',
      hackIdea: 'タイピングのキーストローク音をアンビエントな瞑想音楽に自動変換するBGM拡張機能にする。',
    },
  },

  // AI & Autonomous Agents
  {
    id: 39534012,
    title: 'Show HN: LocalWhisperFlow – Real-time on-device voice agent in 50MB',
    url: 'https://github.com/echolabs/whisper-flow',
    hnUrl: 'https://news.ycombinator.com/item?id=39534012',
    points: 620,
    commentsCount: 188,
    author: 'echolabs',
    postedDate: '2025-02-19',
    cluster: 'ai-agents',
    position: jitter(CLUSTERS['ai-agents'].centerPosition, 6),
    tags: ['#AI', '#Speech', '#LocalLLM', '#Whisper', '#VoiceAgent'],
    summary: {
      oneLiner: 'クラウドを一切介さずブラウザ/ローカルだけで動く超軽量リアルタイム音声対話エージェント。',
      highlights: [
        'WASM + WebGPUで最適化されたWhisperとQwenを組み合わせ、レイテンシ300ms以下を実現。',
        '音声の割り込み（Barge-in）に対応し、相槌も打てる。',
        '完全オフライン・プライバシー安全。',
      ],
      targetAudience: '機密情報を扱うビジネスパーソンや、音声UIを組み込みたい個人開発者。',
      hackIdea: 'デスクトップの作業画面を見守りながら、独り言に反応して勝手にGitHub Issueを起票してくれる相棒にする。',
    },
  },
  {
    id: 39521190,
    title: 'Show HN: AgentSmith – Multi-agent CLI that debugs your git repo autonomously',
    url: 'https://github.com/smith-cli/agentsmith',
    hnUrl: 'https://news.ycombinator.com/item?id=39521190',
    points: 412,
    commentsCount: 95,
    author: 'agent_neo',
    postedDate: '2025-02-16',
    cluster: 'ai-agents',
    position: jitter(CLUSTERS['ai-agents'].centerPosition, 8),
    tags: ['#AI', '#Agents', '#CLI', '#Git', '#Automation'],
    summary: {
      oneLiner: 'Gitコミット履歴とエラーログを走査し、複数エージェントが議論しながら自動修正PRを作るCLI。',
      highlights: [
        '「テスター」「アーキテクト」「コーダー」の3役エージェントが衝突解決を討論。',
        'テストコマンドを裏で実行し、グリーンになるまで自律ループ。',
      ],
      targetAudience: 'CIが落ちたときの修正時間を削減したいDevOps・ソフトウェア開発者。',
      hackIdea: 'ローカルのDockerコンテナ内で安全に破壊的実験をさせ、ベストなリファクタ案を提案するGUIを作る。',
    },
  },
  {
    id: 39478233,
    title: 'Show HN: SynapseEmbed – Fast local vector search in browser IndexedDB',
    url: 'https://github.com/synapse-db/synapse-embed',
    hnUrl: 'https://news.ycombinator.com/item?id=39478233',
    points: 345,
    commentsCount: 71,
    author: 'vector_voyager',
    postedDate: '2025-02-09',
    cluster: 'ai-agents',
    position: jitter(CLUSTERS['ai-agents'].centerPosition, 7),
    tags: ['#VectorDB', '#Embeddings', '#IndexedDB', '#LocalAI'],
    summary: {
      oneLiner: 'ブラウザのIndexedDB上でHNSWインデックスを構築し、高速セマンティック検索を可能にするライブラリ。',
      highlights: [
        'サーバーレス・バックエンド不要で10万件のドキュメントを10ms以内でベクトル類似度検索。',
        'ONNX Runtime Webと直結してテキストを即時ベクトル化。',
      ],
      targetAudience: '個人向けナレッジベースやプライベートな検索ツールを作りたい開発者。',
      hackIdea: 'ブラウザのブックマークや閲覧履歴を全自動でクラスタリングし、思考の散らかりを星図化する拡張機能。',
    },
  },
  {
    id: 39433290,
    title: 'Show HN: OpenReflect – Self-improving prompt optimizer with genetic algorithms',
    url: 'https://github.com/openreflect/reflect',
    hnUrl: 'https://news.ycombinator.com/item?id=39433290',
    points: 289,
    commentsCount: 64,
    author: 'genetic_prompt',
    postedDate: '2025-02-04',
    cluster: 'ai-agents',
    position: jitter(CLUSTERS['ai-agents'].centerPosition, 9),
    tags: ['#AI', '#PromptEngineering', '#GeneticAlgorithms', '#LLM'],
    summary: {
      oneLiner: '遺伝的アルゴリズムを用いてLLMのプロンプトを自動変異・交差させ、精度を極限まで高めるツール。',
      highlights: [
        'テストセットに対するスコアを適応度として数世代にわたりプロンプトを自動進化。',
        '人間が思いつかない言い回しや推論ステップを発見。',
      ],
      targetAudience: 'LLMプロダクトのプロンプト精度チューニングに悩むAIエンジニア。',
      hackIdea: 'コード生成用のプロンプトに特化させ、トークン消費量を最小限に抑えつつ正答率を保つ圧縮器にする。',
    },
  },

  // DevTools & Compilers
  {
    id: 39518844,
    title: 'Show HN: RustWire – A blazing fast Wireshark TUI written in pure Rust',
    url: 'https://github.com/rustwire/rustwire',
    hnUrl: 'https://news.ycombinator.com/item?id=39518844',
    points: 540,
    commentsCount: 112,
    author: 'ferris_net',
    postedDate: '2025-02-15',
    cluster: 'devtools-compilers',
    position: jitter(CLUSTERS['devtools-compilers'].centerPosition, 7),
    tags: ['#Rust', '#TUI', '#Networking', '#DevTools', '#PacketAnalysis'],
    summary: {
      oneLiner: 'ターミナル上でリッチに動作する、Rust製の超軽量パケットキャプチャ＆プロトコル解析ツール。',
      highlights: [
        'Ratatuiベースの美しいダッシュボードでTCPストリームをリアルタイム追跡。',
        'eBPFフックを用いたゼロコピーパケット解析でCPU使用率1%未満。',
      ],
      targetAudience: 'SRE、インフラエンジニア、ターミナル作業を愛するRust信者。',
      hackIdea: 'WebSocketやgRPCの通信フレームを自動デコードし、APIのスキーマ変更を警告するプラグインを追加。',
    },
  },
  {
    id: 39491022,
    title: 'Show HN: TinyWasm – WebAssembly runtime in under 500 lines of C99',
    url: 'https://github.com/wasmcraft/tinywasm',
    hnUrl: 'https://news.ycombinator.com/item?id=39491022',
    points: 398,
    commentsCount: 81,
    author: 'c99_artisan',
    postedDate: '2025-02-10',
    cluster: 'devtools-compilers',
    position: jitter(CLUSTERS['devtools-compilers'].centerPosition, 8),
    tags: ['#WASM', '#C', '#Compiler', '#Embedded', '#VirtualMachine'],
    summary: {
      oneLiner: 'たった500行のC言語で書かれた、組込みマイコンでも動く極小WebAssemblyインタプリタ。',
      highlights: [
        '動的メモリ確保（malloc）不要、固定スタックだけでWASMバイトコードを実行。',
        'ESP32やRaspberry Pi PicoなどのIoTエッジで安全にサンドボックスコードを走らせられる。',
      ],
      targetAudience: '組込み開発者、言語処理系・仮想マシン学習者。',
      hackIdea: 'ブラウザのWebRTCと直接通信して、マイコン側で動的にプラグインコードを更新できるファームウェアにする。',
    },
  },
  {
    id: 39462201,
    title: 'Show HN: SQLLens – Visual explain plan and index recommender for SQLite',
    url: 'https://github.com/sqllens/lens',
    hnUrl: 'https://news.ycombinator.com/item?id=39462201',
    points: 312,
    commentsCount: 54,
    author: 'sqlite_ninja',
    postedDate: '2025-02-07',
    cluster: 'devtools-compilers',
    position: jitter(CLUSTERS['devtools-compilers'].centerPosition, 7),
    tags: ['#SQLite', '#Database', '#Performance', '#SQL'],
    summary: {
      oneLiner: 'SQLiteの実行計画(EXPLAIN QUERY PLAN)をグラフィカルに可視化し、最適なインデックスを提案するデスクトップアプリ。',
      highlights: [
        'スキャンコストが高いテーブル結合を赤くハイライト。',
        '「CREATE INDEX」の候補をワンクリックでテスト実行しベンチマーク比較。',
      ],
      targetAudience: 'モバイルアプリ開発者、ローカルファースト開発者、DBパフォーマンスチューニング担当。',
      hackIdea: 'ORMapperの生成したSQLを監視し、スロークエリが発生した瞬間にVS Code上にインライン警告を出す拡張機能。',
    },
  },
  {
    id: 39429112,
    title: 'Show HN: FlameLens – Interactive CPU flame graph generator with zero overhead',
    url: 'https://github.com/flamelens/flamelens',
    hnUrl: 'https://news.ycombinator.com/item?id=39429112',
    points: 260,
    commentsCount: 43,
    author: 'perf_guru',
    postedDate: '2025-02-03',
    cluster: 'devtools-compilers',
    position: jitter(CLUSTERS['devtools-compilers'].centerPosition, 9),
    tags: ['#Profiling', '#Performance', '#FlameGraph', '#Linux'],
    summary: {
      oneLiner: '本番環境のオーバーヘッドほぼゼロでCPUスタックをサンプリングし、動的な炎グラフをブラウザに描画するツール。',
      highlights: [
        'Linux perfデータをリアルタイムにストリーミング集計。',
        '関数の差分比較（Diff Flame Graph）を直感的にズームイン可能。',
      ],
      targetAudience: '高負荷APIのチューニングを行うバックエンドエンジニア。',
      hackIdea: 'AIがホットスポット関数を自動解析し、「ここをイテレータから配列スライスに変更すると20%高速化」とアドバイス。',
    },
  },

  // Privacy & P2P Systems
  {
    id: 39527710,
    title: 'Show HN: VaultDrop – End-to-end encrypted file sharing with zero signups via WebRTC',
    url: 'https://github.com/vaultdrop/vaultdrop',
    hnUrl: 'https://news.ycombinator.com/item?id=39527710',
    points: 490,
    commentsCount: 130,
    author: 'crypto_cypher',
    postedDate: '2025-02-17',
    cluster: 'privacy-decentralized',
    position: jitter(CLUSTERS['privacy-decentralized'].centerPosition, 7),
    tags: ['#WebRTC', '#P2P', '#Privacy', '#E2EE', '#Crypto'],
    summary: {
      oneLiner: 'サーバーにデータを1バイトも保存せず、ブラウザ同士が直接P2Pで暗号化ファイルを爆速転送するツール。',
      highlights: [
        'QRコードまたはワンタイムURLでシグナリング。',
        'AES-GCMクライアント側暗号化により、中継サーバーにも中身は一切見えない。',
        '10GB以上の大容量ファイルもブラウザキャッシュを活用して転送可能。',
      ],
      targetAudience: 'プライバシーを最重視するギーク、友人同士でギガ単位の動画やコードをやり取りしたい人。',
      hackIdea: 'クリップボードのテキストやスクリーンショットを同一Wi-Fi内の全端末でAirDrop風に即時同期する機能。',
    },
  },
  {
    id: 39501833,
    title: 'Show HN: GhostMesh – Decentralized offline mesh messenger for emergency comms',
    url: 'https://github.com/ghostmesh/ghostmesh',
    hnUrl: 'https://news.ycombinator.com/item?id=39501833',
    points: 415,
    commentsCount: 88,
    author: 'mesh_wanderer',
    postedDate: '2025-02-12',
    cluster: 'privacy-decentralized',
    position: jitter(CLUSTERS['privacy-decentralized'].centerPosition, 8),
    tags: ['#MeshNetwork', '#Bluetooth', '#Decentralized', '#Offline'],
    summary: {
      oneLiner: 'インターネットが遮断されてもBluetooth Low EnergyとWi-Fi Directでバケツリレー通信できるP2Pメッセンジャー。',
      highlights: [
        '災害時や野外フェスなど電波が届かない場所でスマホ同士が自動でルーター役になる。',
        '端末間で署名付き暗号メッセージをマルチホップ転送。',
      ],
      targetAudience: 'アウトドア愛好家、防災意識の高い人、検閲耐性通信を求める人々。',
      hackIdea: '小型LoRaアンテナと接続し、山岳地帯でも数キロメートル離れた相手にテキストを届けるハイブリッド端末化。',
    },
  },
  {
    id: 39458902,
    title: 'Show HN: PasskeyZero – Self-hosted passkey manager without cloud dependencies',
    url: 'https://github.com/passkeyzero/passkeyzero',
    hnUrl: 'https://news.ycombinator.com/item?id=39458902',
    points: 298,
    commentsCount: 62,
    author: 'zero_trust',
    postedDate: '2025-02-06',
    cluster: 'privacy-decentralized',
    position: jitter(CLUSTERS['privacy-decentralized'].centerPosition, 6),
    tags: ['#Passkeys', '#WebAuthn', '#SelfHosted', '#Security'],
    summary: {
      oneLiner: 'Big Techのクラウドに頼らず、自宅サーバーでWebAuthnパスキーを暗号化保管・同期するオープンソースマネージャー。',
      highlights: [
        'FIDO2クレデンシャルをローカル暗号化SQLiteで安全に管理。',
        'Docker1発で起動、リバースプロキシ配下で安全に動作。',
      ],
      targetAudience: 'セルフホスト狂信者、プライバシー意識の高いセキュリティエンジニア。',
      hackIdea: 'スマートウォッチを生体認証トークンとして紐付け、近づくだけでPCがアンロックされる仕組み。',
    },
  },

  // Productivity & PKM
  {
    id: 39529944,
    title: 'Show HN: LoomGraph – Bi-directional knowledge graph with automatic timeline synthesis',
    url: 'https://github.com/loomgraph/loom',
    hnUrl: 'https://news.ycombinator.com/item?id=39529944',
    points: 512,
    commentsCount: 145,
    author: 'thought_weaver',
    postedDate: '2025-02-18',
    cluster: 'productivity-pkm',
    position: jitter(CLUSTERS['productivity-pkm'].centerPosition, 6),
    tags: ['#PKM', '#SecondBrain', '#Markdown', '#KnowledgeGraph'],
    summary: {
      oneLiner: '日々の走り書きメモから、思考の変遷とアイデアの結びつきを時系列3Dグラフで自動再構成するノートツール。',
      highlights: [
        'タグ付け不要。自然言語の文脈からメモ同士の関連リンクをバックグラウンド自動生成。',
        '「3ヶ月前の自分は何に悩んでいたか」をタイムトラベルして見渡せるUI。',
      ],
      targetAudience: 'リサーチャー、作家、アイデアの断片が散らかって整理がつかない個人開発者。',
      hackIdea: '「まだ書かれていないミッシングリンク（思考の空白）」を検知して、「次に考えるべき問い」をプロンプトしてくれる機能。',
    },
  },
  {
    id: 39485122,
    title: 'Show HN: FastHabit – Minimalist keyboard-only habit tracker with terminal aesthetic',
    url: 'https://github.com/fasthabit/app',
    hnUrl: 'https://news.ycombinator.com/item?id=39485122',
    points: 334,
    commentsCount: 77,
    author: 'vim_habits',
    postedDate: '2025-02-10',
    cluster: 'productivity-pkm',
    position: jitter(CLUSTERS['productivity-pkm'].centerPosition, 8),
    tags: ['#Habits', '#Minimalism', '#Vim', '#KeyboardFirst'],
    summary: {
      oneLiner: 'マウスを一度も触らずVimキーバインドで1秒で記録できる、ミニマリスト向け習慣記録アプリ。',
      highlights: [
        'アプリ起動から今日のチェック完了まで最速1.5秒。',
        'GitHubの草（コントリビューショングラフ）風のヒートマップがローカルに美しく描画。',
      ],
      targetAudience: 'Vim/Emacs使い、多機能な習慣アプリに疲れて挫折した人。',
      hackIdea: 'コミットログや特定プロセスの稼働時間を検知して、「コーディング1時間」などを全自動チェックイン。',
    },
  },
  {
    id: 39449830,
    title: 'Show HN: FocusMonk – Distraction blocker that generates harsh code reviews when you procrastinate',
    url: 'https://github.com/focusmonk/monk',
    hnUrl: 'https://news.ycombinator.com/item?id=39449830',
    points: 421,
    commentsCount: 99,
    author: 'zen_hacker',
    postedDate: '2025-02-06',
    cluster: 'productivity-pkm',
    position: jitter(CLUSTERS['productivity-pkm'].centerPosition, 7),
    tags: ['#Productivity', '#Focus', '#Gamification', '#Humor'],
    summary: {
      oneLiner: 'SNSを見てサボると、AIがあなたの書いた過去の恥ずかしいコードを辛口レビューして戒めてくる集中支援アプリ。',
      highlights: [
        'ユーモアと羞恥心で即座にエディタに戻りたくなるゲーミフィケーション。',
        'ポモドーロ完了時には厳格な禅僧の褒め言葉が届く。',
      ],
      targetAudience: '締切前のプログラマー、集中力が続かずXやYouTubeを開いてしまう人。',
      hackIdea: 'サボった時間に応じてGitHubのREADMEに「本日サボり中」のバッジが自動でコミットされる罰ゲームモード。',
    },
  },

  // Systems & Embedded
  {
    id: 39512300,
    title: 'Show HN: MicroOS – 32-bit x86 hobby operating system bootable in under 100ms',
    url: 'https://github.com/microkernel/microos',
    hnUrl: 'https://news.ycombinator.com/item?id=39512300',
    points: 460,
    commentsCount: 104,
    author: 'kernel_crafter',
    postedDate: '2025-02-13',
    cluster: 'systems-hardware',
    position: jitter(CLUSTERS['systems-hardware'].centerPosition, 6),
    tags: ['#OS', '#Kernel', '#x86', '#Assembly', '#LowLevel'],
    summary: {
      oneLiner: 'QEMUで100ms以内に起動し、プリエンプティブ・マルチタスクとGUIウィンドウマネージャを備えた自作OS。',
      highlights: [
        'アセンブリとCで書かれ、ディスクフットプリントはわずか2MB。',
        'シンプルなTCP/IPスタックを内蔵し、HTTPサーバーとしても応答可能。',
      ],
      targetAudience: 'OS自作に憧れるプログラマ、低レイヤの仕組みを深く理解したい人。',
      hackIdea: 'ブラウザ上のv86エミュレータと連動させて、Web上でクリック1回で自作OSのシェルを触れるデモサイトを作る。',
    },
  },
  {
    id: 39471180,
    title: 'Show HN: EdgeKV – Ultra-fast embedded key-value store using io_uring and NVMe',
    url: 'https://github.com/edgekv/engine',
    hnUrl: 'https://news.ycombinator.com/item?id=39471180',
    points: 380,
    commentsCount: 65,
    author: 'uring_speed',
    postedDate: '2025-02-08',
    cluster: 'systems-hardware',
    position: jitter(CLUSTERS['systems-hardware'].centerPosition, 8),
    tags: ['#Storage', '#io_uring', '#Linux', '#KeyValue', '#C'],
    summary: {
      oneLiner: 'Linuxのio_uringを極限まで使い倒し、シングルスレッドで秒間200万クエリを叩き出す組込みKVS。',
      highlights: [
        'RocksDBの1/10のメモリフットプリントで同等以上のランダムリード性能。',
        'クラッシュリカバリを保証するログ先行書き込み（WAL）設計。',
      ],
      targetAudience: 'ハイパフォーマンス分散ストレージ開発者、データベースアーキテクト。',
      hackIdea: 'TypeScriptから直接呼べるNode.jsアドオン（N-API）を作り、ローカルDBとして気軽に使えるようにする。',
    },
  },
  {
    id: 39438910,
    title: 'Show HN: PineBLE – Sniff and decode BLE advertisements with a $4 microcontroller',
    url: 'https://github.com/pineble/sniffer',
    hnUrl: 'https://news.ycombinator.com/item?id=39438910',
    points: 295,
    commentsCount: 48,
    author: 'rf_explorer',
    postedDate: '2025-02-04',
    cluster: 'systems-hardware',
    position: jitter(CLUSTERS['systems-hardware'].centerPosition, 7),
    tags: ['#Hardware', '#BLE', '#ESP32', '#IoT', '#ReverseEngineering'],
    summary: {
      oneLiner: '400円のESP32ボードで周囲のスマートタグやBluetoothビーコンを傍受・パースするオープンソースツール。',
      highlights: [
        'AirTagやTileの近接信号をリアルタイムに視覚化。',
        'Web Serial API経由でブラウザから直接ファームウェア書き込み＆ログ確認が可能。',
      ],
      targetAudience: 'IoTハッカー、ハードウェア電子工作ファン、セキュリティ研究者。',
      hackIdea: '自宅に入った時にスマホのBLE電波をキャッチして部屋の照明を自動でつけるスマートホーム連動。',
    },
  },
];

// Generate 40 additional realistic Show HN projects to populate the universe (~60 total)
const TOPIC_PRESETS = [
  {
    cluster: 'ai-agents' as const,
    titles: [
      'Show HN: PromptCraft – Visual node-based workflow for chaining local LLMs',
      'Show HN: NeuroAudio – Text-to-sound-effects model running in 120MB',
      'Show HN: GitBrain – Let an AI agent review your PR before your teammates do',
      'Show HN: AgentFS – Virtual filesystem where every folder is a dynamic LLM query',
      'Show HN: SpeechMesh – P2P speech synthesis using WebRTC data channels',
      'Show HN: SemanticGrep – Ripgrep but with local vector embeddings',
      'Show HN: AutoDiagram – Turn messy meeting transcripts into clean Mermaid diagrams',
    ],
    tags: ['#AI', '#LLM', '#Agents', '#Audio', '#Embeddings'],
  },
  {
    cluster: 'devtools-compilers' as const,
    titles: [
      'Show HN: TypeCheckr – 10x faster TypeScript type checker written in Zig',
      'Show HN: MicroTrace – eBPF tracing tool for debugging slow HTTP requests',
      'Show HN: Cargo-Audit-UI – Visual vulnerability dependency tree for Rust projects',
      'Show HN: JsonPeek – Instant billion-row JSON query engine using SIMD',
      'Show HN: ShaderPlay – Live GLSL shader editor with multi-pass render graph',
      'Show HN: Wasmer-CLI – Run desktop Linux binaries inside WASM sandbox',
      'Show HN: GitSurg – Interactive terminal tool for surgically splitting commits',
    ],
    tags: ['#Rust', '#Zig', '#WASM', '#Compiler', '#CLI', '#Performance'],
  },
  {
    cluster: 'web-creative' as const,
    titles: [
      'Show HN: VoxelForge – Collaborative 3D voxel world builder in browser',
      'Show HN: FlowChart3D – Walk inside your software architecture in WebVR',
      'Show HN: MinimalPaper – Distraction-free Markdown editor with fluid physics',
      'Show HN: ChromaticMap – Visualizing color palettes from classic movie scenes',
      'Show HN: AudioSphere – 3D planetary audio visualizer for Spotify tracks',
      'Show HN: PixelFont – Procedural typography generator rendered with WebGPU',
      'Show HN: VectorField – Interactive vector field simulator using Euler integration',
    ],
    tags: ['#3D', '#WebGL', '#Canvas', '#Design', '#CreativeCoding'],
  },
  {
    cluster: 'privacy-decentralized' as const,
    titles: [
      'Show HN: SecretSync – Zero-knowledge encrypted sync for Obsidian vaults',
      'Show HN: AnonMail – Self-hosted burner email forwarding with Tor onion routing',
      'Show HN: GhostDNS – Encrypted DNS-over-HTTPS resolver with ad-blocking rules',
      'Show HN: P2PShare – Share files between phones without servers or routers',
      'Show HN: KeyGuardian – Split your master encryption key with Shamir secret sharing',
      'Show HN: PrivateSearch – Federated search engine that aggregates without tracking',
    ],
    tags: ['#Privacy', '#E2EE', '#P2P', '#Crypto', '#SelfHosted'],
  },
  {
    cluster: 'productivity-pkm' as const,
    titles: [
      'Show HN: TimeBlockr – Calendar app that prevents back-to-back meeting fatigue',
      'Show HN: MindPalace – Spatial 3D memory palace for memorizing foreign languages',
      'Show HN: ClippyReborn – AI desktop companion that organizes messy download folders',
      'Show HN: QuickRef – Instant cheatsheets for 500+ CLI tools in your menu bar',
      'Show HN: DailySprint – 15-minute micro task organizer for solo founders',
      'Show HN: BookDigest – Export Kindle highlights into structured spaced-repetition cards',
    ],
    tags: ['#PKM', '#Productivity', '#SecondBrain', '#Memory', '#Workflow'],
  },
  {
    cluster: 'systems-hardware' as const,
    titles: [
      'Show HN: PicoTerm – $5 standalone mechanical keyboard terminal with e-ink',
      'Show HN: NetProbe – Real-time latency jitter radar for home fiber networks',
      'Show HN: FlashFS – High endurance wear-leveling filesystem for SPI NOR flash',
      'Show HN: SolarSensor – Wireless environmental monitor powered solely by ambient light',
      'Show HN: BareMetalRust – Operating system kernel running on Raspberry Pi 5',
      'Show HN: ZeroProxy – High-throughput reverse proxy with zero CPU copy overhead',
    ],
    tags: ['#IoT', '#Hardware', '#Embedded', '#Kernel', '#Networking'],
  },
];

let nextId = 39600000;
export function generateFullConstellation(): ShowHnProject[] {
  const result: ShowHnProject[] = [...INITIAL_SHOW_HN_PROJECTS];

  TOPIC_PRESETS.forEach((preset) => {
    const cluster = CLUSTERS[preset.cluster];
    preset.titles.forEach((title, idx) => {
      nextId++;
      const pts = Math.floor(100 + Math.random() * 450);
      const comments = Math.floor(pts * (0.2 + Math.random() * 0.3));
      const pos = jitter(cluster.centerPosition, 10);
      const daysAgo = Math.floor(Math.random() * 20) + 1;
      const dateStr = `2025-02-${String(Math.max(1, 28 - daysAgo)).padStart(2, '0')}`;

      result.push({
        id: nextId,
        title,
        url: `https://github.com/project-${nextId}/${title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(9, 30)}`,
        hnUrl: `https://news.ycombinator.com/item?id=${nextId}`,
        points: pts,
        commentsCount: comments,
        author: `hacker_${idx + 10}`,
        postedDate: dateStr,
        cluster: preset.cluster,
        position: pos,
        tags: preset.tags.slice(0, 3 + Math.floor(Math.random() * 3)),
        summary: {
          oneLiner: `${title.replace(/^Show HN:\s*/, '')} をテーマにした、開発者のこだわりが詰まった注目プロジェクト。`,
          highlights: [
            `${cluster.nameJa}の最新トレンドを捉えた効率的なアーキテクチャ。`,
            `余計な依存関係を削ぎ落とし、超軽量で快適なユーザー体験を実現。`,
            `開発コミュニティからのフィードバックを受けて急速に進化中。`,
          ],
          targetAudience: `${cluster.name}に関心があるエンジニア、個人開発者、ギーク層。`,
          hackIdea: `このツールのアイデアを自作のワークフローに組み込むか、自分の得意な言語（Rust/TypeScript）でミニマルクローンを作る。`,
        },
      });
    });
  });

  return result;
}
