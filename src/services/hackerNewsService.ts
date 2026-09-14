import { ShowHnProject, ClusterId } from '../types';
import { CLUSTERS } from '../data/clusters';

function guessCluster(title: string, text: string): ClusterId {
  const content = (title + ' ' + text).toLowerCase();

  if (content.includes('ai') || content.includes('llm') || content.includes('agent') || content.includes('gpt') || content.includes('prompt') || content.includes('speech') || content.includes('voice') || content.includes('vision') || content.includes('model')) {
    return 'ai-agents';
  }
  if (content.includes('rust') || content.includes('wasm') || content.includes('compiler') || content.includes('cli') || content.includes('terminal') || content.includes('debug') || content.includes('profil') || content.includes('zig')) {
    return 'devtools-compilers';
  }
  if (content.includes('3d') || content.includes('webgl') || content.includes('three') || content.includes('canvas') || content.includes('ui') || content.includes('css') || content.includes('design') || content.includes('audio') || content.includes('synth')) {
    return 'web-creative';
  }
  if (content.includes('crypto') || content.includes('p2p') || content.includes('privacy') || content.includes('encrypt') || content.includes('security') || content.includes('vault') || content.includes('passkey') || content.includes('tor')) {
    return 'privacy-decentralized';
  }
  if (content.includes('note') || content.includes('pkm') || content.includes('task') || content.includes('habit') || content.includes('time') || content.includes('markdown') || content.includes('graph') || content.includes('focus')) {
    return 'productivity-pkm';
  }
  return 'systems-hardware';
}

function extractTags(title: string, cluster: ClusterId): string[] {
  const tags: string[] = ['#ShowHN'];
  const t = title.toLowerCase();

  if (t.includes('ai')) tags.push('#AI');
  if (t.includes('rust')) tags.push('#Rust');
  if (t.includes('wasm')) tags.push('#WASM');
  if (t.includes('3d') || t.includes('webgl')) tags.push('#3D');
  if (t.includes('cli') || t.includes('tui')) tags.push('#CLI');
  if (t.includes('p2p')) tags.push('#P2P');
  if (t.includes('privacy')) tags.push('#Privacy');
  if (t.includes('python')) tags.push('#Python');
  if (t.includes('react') || t.includes('vue')) tags.push('#Web');

  if (tags.length <= 2) {
    if (cluster === 'ai-agents') tags.push('#Agents', '#LLM');
    else if (cluster === 'devtools-compilers') tags.push('#DevTools', '#Code');
    else if (cluster === 'web-creative') tags.push('#Creative', '#Frontend');
    else if (cluster === 'privacy-decentralized') tags.push('#Decentralized', '#Security');
    else if (cluster === 'productivity-pkm') tags.push('#Workflow', '#Productivity');
    else tags.push('#Systems', '#Hardware');
  }

  return tags;
}

export async function fetchLiveShowHnStories(limit = 4): Promise<ShowHnProject[]> {
  try {
    const listRes = await fetch('https://hacker-news.firebaseio.com/v0/showstories.json');
    if (!listRes.ok) throw new Error('Failed to fetch Show HN story IDs');
    const ids: number[] = await listRes.json();
    const targetIds = ids.slice(0, limit);

    const items: ShowHnProject[] = [];

    for (const id of targetIds) {
      try {
        const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!itemRes.ok) continue;
        const data = await itemRes.json();
        if (!data || !data.title) continue;

        const cluster = guessCluster(data.title, data.text || '');
        const clusterInfo = CLUSTERS[cluster];
        
        // Place new supernovas close to their cluster center with a glowing orbit
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 8;
        const pos: [number, number, number] = [
          clusterInfo.centerPosition[0] + Math.cos(angle) * radius,
          clusterInfo.centerPosition[1] + (Math.random() - 0.5) * 6,
          clusterInfo.centerPosition[2] + Math.sin(angle) * radius,
        ];

        const cleanTitle = data.title;
        const cleanText = (data.text || '').replace(/<[^>]*>?/gm, '').slice(0, 400);

        items.push({
          id: data.id,
          title: cleanTitle,
          url: data.url || `https://news.ycombinator.com/item?id=${data.id}`,
          hnUrl: `https://news.ycombinator.com/item?id=${data.id}`,
          points: data.score || 1,
          commentsCount: data.descendants || 0,
          author: data.by || 'anonymous',
          postedDate: new Date(data.time * 1000).toISOString().split('T')[0],
          cluster,
          position: pos,
          tags: extractTags(cleanTitle, cluster),
          summary: {
            oneLiner: cleanText
              ? `${cleanText.slice(0, 90)}...`
              : `${cleanTitle.replace(/^Show HN:\s*/i, '')} - 海外の個人開発者による最新プロジェクト。`,
            highlights: [
              `Hacker Newsに投稿されたばかりのリアルタイム新着（Supernova）。`,
              `${clusterInfo.nameJa}領域の新鮮な実験的アプローチ。`,
              `URL: ${data.url ? new URL(data.url).hostname : 'news.ycombinator.com'} にて即時アクセス可能。`,
            ],
            targetAudience: `${clusterInfo.name}の最先端動向をいち早くキャッチしたいギーク。`,
            hackIdea: `この投稿に書かれたREADMEを読み、不足している機能（モバイル対応、ローカルオフライン化、日本語ローカライズなど）を先行して作ってみる。`,
          },
          rawText: cleanText,
          isSupernova: true,
        });
      } catch (err) {
        console.warn('Error fetching item details:', err);
      }
    }

    return items;
  } catch (error) {
    console.error('Show HN fetch error:', error);
    throw error;
  }
}
