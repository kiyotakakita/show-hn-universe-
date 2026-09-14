import React, { useState, useMemo } from 'react';
import { ShowHnProject, ClusterId, InnovationVoid } from './types';
import { generateFullConstellation } from './data/mockProjects';
import { INNOVATION_VOIDS } from './data/clusters';
import { GalaxyCanvas } from './components/GalaxyCanvas';
import { GalaxyHUD } from './components/GalaxyHUD';
import { ProjectDetailPanel } from './components/ProjectDetailPanel';
import { InnovationVoidModal } from './components/InnovationVoidModal';
import { HelpModal } from './components/HelpModal';
import { fetchLiveShowHnStories } from './services/hackerNewsService';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<ShowHnProject[]>(() => generateFullConstellation());
  const [selectedProject, setSelectedProject] = useState<ShowHnProject | null>(null);
  const [hoveredProject, setHoveredProject] = useState<ShowHnProject | null>(null);
  const [activeCluster, setActiveCluster] = useState<ClusterId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Attempt to load dynamically generated data.json if available
  React.useEffect(() => {
    const dataUrl = `${import.meta.env.BASE_URL || './'}data.json`.replace('//', '/');
    fetch(dataUrl)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data: ShowHnProject[] | null) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects((prev) => {
            const existingIds = new Set(data.map((d) => d.id));
            const remainingOriginal = prev.filter((p) => !existingIds.has(p.id));
            return [...data, ...remainingOriginal];
          });
          showNotification(`🌟 build_universe.py で生成された ${data.length}件の星雲データを同期しました`);
        }
      })
      .catch(() => {
        // Silently use default constellation if data.json not yet generated
      });
  }, []);

  const supernovaCount = useMemo(
    () => projects.filter((p) => p.isSupernova).length,
    [projects]
  );

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4500);
  };

  const handleSelectProject = (project: ShowHnProject) => {
    setSelectedProject(project);
    setAutoRotate(false); // Stop rotation when inspecting a star
  };

  const handleSelectCluster = (cluster: ClusterId | 'all') => {
    setActiveCluster(cluster);
    setSelectedProject(null);
  };

  const handleResetView = () => {
    setSelectedProject(null);
    setActiveCluster('all');
    setSearchQuery('');
    setAutoRotate(true);
  };

  const handleFetchLive = async () => {
    setIsFetchingLive(true);
    try {
      const liveItems = await fetchLiveShowHnStories(4);
      if (liveItems.length === 0) {
        showNotification('現在新着のShow HNがありません。後ほど再度お試しください。');
        return;
      }

      // Filter out duplicates if already in list
      setProjects((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const novelItems = liveItems.filter((item) => !existingIds.has(item.id));
        if (novelItems.length === 0) {
          showNotification('最新のShow HNはすでに銀河に配置されています！');
          return prev;
        }
        showNotification(`✨ ${novelItems.length}件の最新Show HNを新星(Supernova)として銀河に配置しました！`);
        return [...novelItems, ...prev];
      });

      // Automatically focus on the newest supernova!
      if (liveItems.length > 0) {
        setSelectedProject(liveItems[0]);
      }
    } catch (err) {
      console.error(err);
      showNotification('Hacker News APIの取得に失敗しました。時間をおいて再試行してください。');
    } finally {
      setIsFetchingLive(false);
    }
  };

  const handleFlyToVoid = (v: InnovationVoid) => {
    // Create a virtual supernova waypoint star in that void for exploration
    const virtualStar: ShowHnProject = {
      id: `void-${Date.now()}`,
      title: `[Innovation Void] ${v.title}`,
      url: 'https://news.ycombinator.com',
      hnUrl: 'https://news.ycombinator.com',
      points: 999,
      commentsCount: 0,
      author: 'you (future founder)',
      postedDate: 'Coming Soon',
      cluster: v.clusterA,
      position: v.position,
      tags: ['#InnovationVoid', '#NextBigThing', '#Unexplored'],
      summary: {
        oneLiner: v.opportunity,
        highlights: [
          `未開拓領域の空白地帯です。`,
          `提案アイデア: ${v.suggestedApp}`,
          `市場ポテンシャル予測: ${v.potentialScore}%`,
        ],
        targetAudience: 'この市場の最初の開拓者になりたい個人開発者・創業者。',
        hackIdea: '今すぐプロトタイプを作って「Show HN」に投下してみましょう！',
      },
      isSupernova: true,
    };

    setProjects((prev) => [virtualStar, ...prev]);
    setSelectedProject(virtualStar);
    setAutoRotate(false);
    showNotification(`🌌 空白宙域「${v.title}」へカメラを誘導しました`);
  };

  return (
    <main className="relative w-screen h-screen bg-[#030712] overflow-hidden select-none">
      {/* 3D Three.js Galaxy Scene */}
      <GalaxyCanvas
        projects={projects}
        selectedProject={selectedProject}
        hoveredProject={hoveredProject}
        activeCluster={activeCluster}
        searchQuery={searchQuery}
        autoRotate={autoRotate}
        onSelectProject={handleSelectProject}
        onHoverProject={setHoveredProject}
      />

      {/* Floating HUD controls */}
      <GalaxyHUD
        totalStars={projects.length}
        supernovaCount={supernovaCount}
        activeCluster={activeCluster}
        searchQuery={searchQuery}
        autoRotate={autoRotate}
        isFetchingLive={isFetchingLive}
        hoveredProject={hoveredProject}
        onSelectCluster={handleSelectCluster}
        onSearchChange={setSearchQuery}
        onToggleAutoRotate={() => setAutoRotate((prev) => !prev)}
        onResetView={handleResetView}
        onFetchLiveHn={handleFetchLive}
        onOpenVoidModal={() => setIsVoidModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
      />

      {/* Slide-in Project Detail Panel */}
      <ProjectDetailPanel
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectRelated={handleSelectProject}
        allProjects={projects}
      />

      {/* Modals */}
      <InnovationVoidModal
        isOpen={isVoidModalOpen}
        onClose={() => setIsVoidModalOpen(false)}
        voids={INNOVATION_VOIDS}
        onFlyToVoid={handleFlyToVoid}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Cosmic Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#0b132b]/95 border border-cyan-400/40 text-cyan-300 text-xs font-mono-code shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{notification}</span>
        </div>
      )}
    </main>
  );
}
