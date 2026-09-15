GitHubのリポジトリトップにそのままコピペして使える、海外の開発# 🌌 Show HN Universe

> **A living, interactive 3D galaxy of "Show HN" projects, updated daily.**

Explore the latest creations from indie hackers and open-source developers worldwide as stars in an interactive 3D point cloud, clustered by semantic similarity.

[![Daily Universe Update](https://github.com/kiyotakakita/show-hn-universe-/actions/workflows/cron.yml/badge.svg)](https://github.com/kiyotakakita/show-hn-universe-/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- Add a screenshot or GIF of your 3D universe here -->
<!-- ![Demo Screenshot](assets/demo.png) -->

🔗 **[Live Demo](https://kiyotakakita.github.io/show-hn-universe-/)**

---

## ✨ Features

- **🪐 Semantic 3D Galaxy**: Projects are embedded and projected into 3D space. Projects with similar goals, tech stacks, or architectures naturally cluster together.
- **🤖 AI-Powered Digest**: Click on any star to view an instant TL;DR of what the app does, why it's interesting, and who it's built for.
- **🔄 Fully Automated Pipeline**: Powered by GitHub Actions. Every morning, new `Show HN` projects are ingested, embedded, and mapped without manual intervention.
- **📱 Touch & Orbit Controls**: Seamless exploration on both mobile browsers and desktop (rotate, pinch-to-zoom, and tap).

---

## 🛠️ How It Works

```text
  [ Hacker News API ]
          │ (Fetch latest Show HN items)
          ▼
  [ OpenAI Embeddings ]
          │ (Vectorize title & description)
          ▼
  [ Dimensionality Reduction ]
          │ (Map vectors to 3D coords: X, Y, Z)
          ▼
    [ data.json ] ───► [ Three.js / WebGL Frontend ]
                               (Render Interactive Galaxy)

1.  Ingestion (fetcher.py): Fetches new Show HN submissions via the official
    Hacker News Firebase API.
2.  Embedding & Layout (embedder.py): Generates text embeddings for each project
    and reduces them into 3D coordinates (x, y, z).
3.  Visualization (index.html / Frontend): Renders a lightweight, dark-mode 3D
    cosmos where developers can fly around and inspect projects.

🚀 Local Development

Prerequisites

  - Python 3.10+
  - OpenAI API Key

Setup Backend

# Clone the repository
git clone https://github.com/kiyotakakita/show-hn-universe-.git
cd show-hn-universe-

# Install dependencies
pip install -r requirements.txt

# Set your API key
export OPENAI_API_KEY="your-openai-api-key"

# Run the pipeline manually to generate data.json
python backend/fetcher.py

Run Frontend

Simply serve the frontend directory with any static server:

# Example with Python's built-in server
python -m http.server 8000
# Then open http://localhost:8000 in your browser

🗺️ Roadmap & Ideas

- [ ] Constellation Links: Draw subtle glowing edges between projects with
  cosine similarity > 0.85.
- [ ] "Innovation Voids": Highlight empty spaces in the universe where untapped
  product opportunities exist.
- [ ] Filter by Tech Stack: Toggle visibility for #Rust, #AI, #LocalFirst, #TUI,
  etc.
- [ ] "Great Minds Think Alike": Paste your own project/idea to see where it
  lands in the galaxy.

🤝 Contributing

Pull requests, feature ideas, and feedback are welcome! Feel free to open an
Issue or submit a PR.

📄 License

This project is open-sourced under the MIT License.


---

### コピペした後の調整ポイント（2箇所だけ）
1. `YOUR_USERNAME` となっている部分を、ご自身の**GitHubユーザー名**に一括置換してください。
2. もしスマホやPCで動いている画面のスクリーンショットが撮れたら、リポジトリに `demo.png` などの名前で置いて、画像リンクのコメントアウト（`<!-- ![Demo Screenshot]... -->`）を外すと、海外の開発者からのスター（★）が付きやすくなります！
