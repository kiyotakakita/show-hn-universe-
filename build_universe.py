#!/usr/bin/env python3
"""
build_universe.py - Show HN Universe 3D Point Cloud Generator

処理内容:
1. Hacker News API (showstories.json) から最新のShow HN投稿を取得
2. OpenAI gpt-4o-mini で日本語要約・開発ヒント・クラスタ分類・タグを構造化生成
3. OpenAI text-embedding-3-small で各プロジェクトのテキストをベクトル化 (1536次元)
4. PCA (主成分分析) または SVD で 3次元 (X, Y, Z) に次元削減
5. 宇宙空間スケール (約 -40 ~ +40) に正規化・スケーリング
6. フロントエンドがそのまま読み込める public/data.json (および data.json) に保存

推奨ライブラリ:
    pip install openai requests numpy scikit-learn
    (※未インストールの環境でも、標準ライブラリによる自己完結フォールバックで即座に動作します)

使用方法:
    export OPENAI_API_KEY="your-openai-api-key"
    python3 build_universe.py --limit 30

    ※ APIキーなしでテスト実行したい場合:
    python3 build_universe.py --limit 15 --dry-run
"""

import os
import sys
import json
import math
import argparse
import datetime
import html
import re
import urllib.request
import urllib.error
from typing import List, Dict, Any, Tuple

# Optional requests import with urllib fallback
try:
    import requests
    def http_get_json(url: str, timeout: int = 15) -> Any:
        return requests.get(url, timeout=timeout).json()
except ImportError:
    def http_get_json(url: str, timeout: int = 15) -> Any:
        req = urllib.request.Request(url, headers={'User-Agent': 'ShowHNUniverse/1.0'})
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode('utf-8'))

# Optional numpy / scikit-learn imports with pure-Python fallback
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

try:
    from sklearn.decomposition import PCA
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

# OpenAI client setup
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
client = None
if OPENAI_API_KEY:
    try:
        from openai import OpenAI
        client = OpenAI(api_key=OPENAI_API_KEY)
    except ImportError:
        pass

# 6つの銀河星団の座標定義
CLUSTERS = {
    'ai-agents': {
        'name': 'AI & Autonomous Agents',
        'nameJa': '人工知能・自律エージェント星団',
        'center': [-42.0, 14.0, -18.0],
    },
    'devtools-compilers': {
        'name': 'DevTools & Compilers',
        'nameJa': '開発ツール・高速言語星団',
        'center': [36.0, 24.0, -20.0],
    },
    'web-creative': {
        'name': 'Web, Canvas & 3D',
        'nameJa': 'Web・3Dビジュアル星団',
        'center': [-28.0, -24.0, 26.0],
    },
    'privacy-decentralized': {
        'name': 'Privacy & P2P Crypto',
        'nameJa': 'プライバシー・分散暗号星団',
        'center': [38.0, -18.0, 22.0],
    },
    'productivity-pkm': {
        'name': 'PKM & Workflow Sync',
        'nameJa': '知的生産・ナレッジ連携星団',
        'center': [0.0, 36.0, 28.0],
    },
    'systems-hardware': {
        'name': 'Systems & Embedded',
        'nameJa': '低レイヤ・インフラ星団',
        'center': [2.0, -36.0, -26.0],
    },
}

def clean_html(raw_html: str) -> str:
    """HTMLタグを除去してプレーンテキスト化"""
    if not raw_html:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', raw_html)
    clean = html.unescape(clean)
    return " ".join(clean.split())

def fetch_show_hn(limit: int = 30) -> List[Dict[str, Any]]:
    """Hacker News APIからShow HNストーリーID一覧と各詳細を取得"""
    print(f"📡 Hacker Newsから最新のShow HNを取得中 (上限: {limit}件)...")
    url = "https://hacker-news.firebaseio.com/v0/showstories.json"
    story_ids = http_get_json(url, timeout=15)[:limit]

    items = []
    for idx, sid in enumerate(story_ids, 1):
        try:
            detail_url = f"https://hacker-news.firebaseio.com/v0/item/{sid}.json"
            detail = http_get_json(detail_url, timeout=10)
            if not detail or not detail.get("title"):
                continue

            cleaned_text = clean_html(detail.get("text", ""))
            items.append({
                "id": sid,
                "title": detail.get("title", ""),
                "url": detail.get("url", f"https://news.ycombinator.com/item?id={sid}"),
                "hnUrl": f"https://news.ycombinator.com/item?id={sid}",
                "points": detail.get("score", 1),
                "commentsCount": detail.get("descendants", 0),
                "author": detail.get("by", "anonymous"),
                "time": detail.get("time", 0),
                "text": cleaned_text[:500],
            })
            print(f"  [{idx}/{len(story_ids)}] 取得完了: {detail.get('title')[:55]}...")
        except Exception as e:
            print(f"  ⚠️ アイテム {sid} の取得スキップ: {e}")

    return items

def analyze_project_with_llm(item: Dict[str, Any], dry_run: bool = False) -> Dict[str, Any]:
    """LLMを用いて要約、面白さ、ターゲット、開発の種、クラスタ判定、タグをJSON生成"""
    if dry_run or not client:
        # Dry-run / 簡易キーワード分類フォールバック
        title_lower = (item['title'] + " " + item['text']).lower()
        if any(w in title_lower for w in ['ai', 'agent', 'llm', 'gpt', 'speech', 'voice', 'model', 'prompt']):
            cluster = 'ai-agents'
        elif any(w in title_lower for w in ['rust', 'wasm', 'compiler', 'cli', 'tui', 'zig', 'debug']):
            cluster = 'devtools-compilers'
        elif any(w in title_lower for w in ['3d', 'webgl', 'three', 'canvas', 'css', 'ui', 'shader', 'audio', 'music']):
            cluster = 'web-creative'
        elif any(w in title_lower for w in ['crypto', 'p2p', 'privacy', 'encrypt', 'vault', 'security']):
            cluster = 'privacy-decentralized'
        elif any(w in title_lower for w in ['note', 'pkm', 'task', 'habit', 'second brain', 'time', 'markdown']):
            cluster = 'productivity-pkm'
        else:
            cluster = 'systems-hardware'

        clean_t = item['title'].replace('Show HN:', '').strip()
        return {
            "cluster": cluster,
            "tags": [f"#{cluster.split('-')[0].capitalize()}", "#ShowHN", "#DeveloperTool"],
            "summary": {
                "oneLiner": f"{clean_t} を実現する注目の個人開発プロダクト。",
                "highlights": [
                    "Hacker Newsの最新Show HNとして投稿された尖った実装。",
                    "実用性とミニマリズムを両立した設計アプローチ。",
                ],
                "targetAudience": f"{CLUSTERS[cluster]['nameJa']}に関心を持つ開発者やクリエイター。",
                "hackIdea": "このアイデアを参考に、自分ならローカル特化版やモバイル対応版をクローンしてみる。",
            }
        }

    prompt = f"""
以下のHacker Newsの自作アプリ（Show HN）情報を分析し、厳密なJSON形式で出力してください。

【タイトル】: {item['title']}
【URL】: {item['url']}
【開発者の投稿文】: {item['text']}

【クラスタ識別子（この中から最も近い1つを選択）】:
- "ai-agents" (AI, LLM, 自律エージェント, 音声/画像AI)
- "devtools-compilers" (開発ツール, Rust, WASM, CLI, コンパイラ, デバッガ)
- "web-creative" (Webフロントエンド, 3D, Canvas, WebGL, デザイン)
- "privacy-decentralized" (プライバシー, 暗号化, P2P, セルフホスト)
- "productivity-pkm" (知的生産, 第二の脳, ノート, タスク, 習慣)
- "systems-hardware" (OS, 低レイヤ, 組込み, IoT, ネットワーク, DB)

JSONフォーマット:
{{
  "cluster": "選択したクラスタID",
  "tags": ["#タグ1", "#タグ2", "#タグ3"],
  "summary": {{
    "oneLiner": "ひとことで言うと（1行の日本語）",
    "highlights": [
      "ここが新しい/面白い点1",
      "ここが新しい/面白い点2"
    ],
    "targetAudience": "どんな人に刺さりそうか（1行の日本語）",
    "hackIdea": "開発の種・クローン改善案（自分ならどうアップデートするか）"
  }}
}}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        data = json.loads(response.choices[0].message.content)
        if data.get("cluster") not in CLUSTERS:
            data["cluster"] = "devtools-compilers"
        return data
    except Exception as e:
        print(f"  ⚠️ LLM要約エラー ({item['title'][:30]}): {e}")
        return analyze_project_with_llm(item, dry_run=True)

def get_embeddings(texts: List[str], dry_run: bool = False) -> List[List[float]]:
    """OpenAI text-embedding-3-small でテキスト群をベクトル化 (N × 1536)"""
    if dry_run or not client:
        print("ℹ️ Dry-run モード: 擬似埋め込みベクトル (1536次元) を生成します。")
        import random
        random.seed(42)
        return [[random.gauss(0, 1) for _ in range(1536)] for _ in texts]

    print(f"🧠 OpenAI text-embedding-3-small で {len(texts)} 件のベクトル化を実行中...")
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=texts
    )
    return [d.embedding for d in response.data]

def pure_python_pca_3d(vectors: List[List[float]]) -> List[List[float]]:
    """NumPy非依存の純粋PythonによるPCA (べき乗法 / Power Iteration) 3次元削減"""
    n = len(vectors)
    dim = len(vectors[0])
    if n == 0:
        return []

    # 1. 中心化 (Mean Centering)
    mean_vec = [sum(vectors[i][d] for i in range(n)) / n for d in range(dim)]
    centered = [[vectors[i][d] - mean_vec[d] for d in range(dim)] for i in range(n)]

    components = []
    # 3つの主成分をべき乗法で抽出
    for _ in range(3):
        import random
        # ランダム単位ベクトル初期化
        w = [random.gauss(0, 1) for _ in range(dim)]
        w_norm = math.sqrt(sum(x * x for x in w)) or 1.0
        w = [x / w_norm for x in w]

        # 直前の主成分と直交化 (Gram-Schmidt)
        for prev_w in components:
            dot = sum(w[d] * prev_w[d] for d in range(dim))
            w = [w[d] - dot * prev_w[d] for d in range(dim)]
        w_norm = math.sqrt(sum(x * x for x in w)) or 1.0
        w = [x / w_norm for x in w]

        # べき乗法 (Power Iteration: A^T * A * w)
        for _ in range(8):
            Aw = [sum(centered[i][d] * w[d] for d in range(dim)) for i in range(n)]
            new_w = [sum(centered[i][d] * Aw[i] for i in range(n)) for d in range(dim)]
            # 直交化
            for prev_w in components:
                dot = sum(new_w[d] * prev_w[d] for d in range(dim))
                new_w = [new_w[d] - dot * prev_w[d] for d in range(dim)]
            norm = math.sqrt(sum(x * x for x in new_w)) or 1.0
            w = [x / norm for x in new_w]

        components.append(w)

    # 各点の内積射影
    reduced = []
    for i in range(n):
        coords = [sum(centered[i][d] * comp[d] for d in range(dim)) for comp in components]
        reduced.append(coords)

    return reduced

def reduce_dimensions_to_3d(vectors: List[List[float]], clusters: List[str]) -> List[List[float]]:
    """PCAで 1536次元を 3次元 (X, Y, Z) に圧縮し、銀河クラスタ中心座標とブレンド"""
    n_samples = len(vectors)
    print(f"🌌 {n_samples}件のベクトルをPCA次元削減 (1536D -> 3D) 処理中...")

    if n_samples < 3:
        import random
        reduced = [[random.uniform(-5, 5) for _ in range(3)] for _ in range(n_samples)]
    elif HAS_SKLEARN:
        pca = PCA(n_components=3, random_state=42)
        reduced = pca.fit_transform(np.array(vectors, dtype=np.float32)).tolist()
    elif HAS_NUMPY:
        arr = np.array(vectors, dtype=np.float32)
        centered = arr - np.mean(arr, axis=0)
        _, _, vt = np.linalg.svd(centered, full_matrices=False)
        reduced = np.dot(centered, vt[:3].T).tolist()
    else:
        reduced = pure_python_pca_3d(vectors)

    # 各次元の標準化
    for dim in range(3):
        vals = [pt[dim] for pt in reduced]
        mean_v = sum(vals) / n_samples
        variance = sum((x - mean_v) ** 2 for x in vals) / n_samples
        std_v = math.sqrt(variance) if variance > 1e-6 else 1.0
        for pt in reduced:
            pt[dim] = (pt[dim] - mean_v) / std_v

    # 銀河の広がりスケール
    final_positions = []
    for i in range(n_samples):
        cluster_key = clusters[i]
        center = CLUSTERS.get(cluster_key, CLUSTERS['systems-hardware'])['center']

        pca_x = reduced[i][0] * 11.0
        pca_y = reduced[i][1] * 9.0
        pca_z = reduced[i][2] * 11.0

        x = round(center[0] * 0.7 + pca_x, 2)
        y = round(center[1] * 0.7 + pca_y, 2)
        z = round(center[2] * 0.7 + pca_z, 2)

        final_positions.append([x, y, z])

    return final_positions

def main():
    parser = argparse.ArgumentParser(description="Show HN Universe 3D Galaxy Data Builder")
    parser.add_argument("--limit", type=int, default=30, help="取得する最新Show HNの上限件数 (デフォルト: 30)")
    parser.add_argument("--output", type=str, default="public/data.json", help="出力先JSONファイルパス")
    parser.add_argument("--dry-run", action="store_true", help="OpenAI APIを呼ばずにモック動作をテストする")
    args = parser.parse_args()

    dry_run = args.dry_run or (not OPENAI_API_KEY)
    if dry_run and not args.dry_run:
        print("ℹ️ OPENAI_API_KEY 未設定のため、自動的に --dry-run モードで実行します。")

    # 1. Show HNの最新投稿を取得
    raw_items = fetch_show_hn(limit=args.limit)
    if not raw_items:
        print("❌ Show HN の取得に失敗しました。")
        return

    # 2. LLMで各プロジェクトを解析・構造化
    print(f"\n🤖 各プロジェクトの要約とクラスタ分類を実行中 ({len(raw_items)}件)...")
    processed_items = []
    embedding_texts = []
    clusters = []

    for i, item in enumerate(raw_items, 1):
        print(f"  [{i}/{len(raw_items)}] 解析中: {item['title'][:45]}...")
        analysis = analyze_project_with_llm(item, dry_run=dry_run)

        posted_date = (
            datetime.datetime.fromtimestamp(item['time']).strftime('%Y-%m-%d')
            if item['time'] else "2025-02-18"
        )

        entry = {
            "id": item["id"],
            "title": item["title"],
            "url": item["url"],
            "hnUrl": item["hnUrl"],
            "points": item["points"],
            "commentsCount": item["commentsCount"],
            "author": item["author"],
            "postedDate": posted_date,
            "cluster": analysis["cluster"],
            "position": [0.0, 0.0, 0.0],  # 次のステップで付与
            "tags": analysis.get("tags", ["#ShowHN"]),
            "summary": analysis.get("summary", {}),
            "isSupernova": (i <= 3)  # 最新3件は新星として輝かせる
        }
        processed_items.append(entry)
        clusters.append(analysis["cluster"])

        emb_text = f"{item['title']} - {item['text']} - {analysis.get('summary', {}).get('oneLiner', '')}"
        embedding_texts.append(emb_text)

    # 3. テキストをベクトル化 (Embedding)
    vectors = get_embeddings(embedding_texts, dry_run=dry_run)

    # 4. PCAで3次元座標 (X, Y, Z) を算出
    positions_3d = reduce_dimensions_to_3d(vectors, clusters)
    for i, pos in enumerate(positions_3d):
        processed_items[i]["position"] = pos

    # 5. JSONファイルへ書き出し
    out_paths = [args.output]
    if args.output != "public/data.json" and os.path.exists("public"):
        out_paths.append("public/data.json")
    if args.output != "data.json":
        out_paths.append("data.json")

    for p in out_paths:
        parent_dir = os.path.dirname(p)
        if parent_dir:
            os.makedirs(parent_dir, exist_ok=True)
        with open(p, "w", encoding="utf-8") as f:
            json.dump(processed_items, f, ensure_ascii=False, indent=2)
        print(f"✨ 宇宙マップデータを出力しました: {p} ({len(processed_items)} 星)")

    print("\n🚀 完了しました！フロントエンドがこの data.json を読み込み、3D銀河に星々を展開します。")

if __name__ == "__main__":
    main()
