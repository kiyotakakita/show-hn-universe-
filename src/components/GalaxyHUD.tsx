import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  RotateCcw,
  Compass,
  Radio,
  Layers,
  HelpCircle,
  Zap,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { ClusterId, ShowHnProject } from '../types';
import { CLUSTERS } from '../data/clusters';

interface GalaxyHUDProps {
  totalStars: number;
  supernovaCount: number;
  activeCluster: ClusterId | 'all';
  searchQuery: string;
  autoRotate: boolean;
  isFetchingLive: boolean;
  hoveredProject: ShowHnProject | null;
  onSelectCluster: (cluster: ClusterId | 'all') => void;
  onSearchChange: (query: string) => void;
  onToggleAutoRotate: () => void;
  onResetView: () => void;
  onFetchLiveHn: () => void;
  onOpenVoidModal: () => void;
  onOpenHelpModal: () => void;
}

export const GalaxyHUD: React.FC<GalaxyHUDProps> = ({
  totalStars,
  supernovaCount,
  activeCluster,
  searchQuery,
  autoRotate,
  isFetchingLive,
  hoveredProject,
  onSelectCluster,
  onSearchChange,
  onToggleAutoRotate,
  onResetView,
  onFetchLiveHn,
  onOpenVoidModal,
  onOpenHelpModal,
}) => {
  const [showClusterMenu, setShowClusterMenu] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Bar: Brand, Stats & Live Fetch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
        {/* Logo & Subtitle */}
        <div className="pointer-events-auto flex items-center space-x-3 bg-[#070d1e]/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-950/40">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-md shadow-cyan-500/30">
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-base font-display font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Show HN</span>
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Universe
                </span>
              </h1>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                v2.5
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono-code hidden sm:block">
              Hacker News自作アプリ群の動的3D銀河観測
            </p>
          </div>

          <div className="h-6 w-px bg-slate-700/60 mx-1 hidden sm:block" />

          {/* Star Counter Telemetry */}
          <div className="hidden md:flex items-center space-x-3 text-xs font-mono-code text-gray-400">
            <div>
              <span className="text-gray-500">観測星数: </span>
              <span className="text-cyan-300 font-bold">{totalStars}</span>
            </div>
            {supernovaCount > 0 && (
              <div className="flex items-center space-x-1 text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>新星 +{supernovaCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls: Live Fetch & Innovation Void */}
        <div className="pointer-events-auto flex items-center flex-wrap gap-2">
          {/* Live Fetch Button */}
          <button
            id="fetch-live-hn-btn"
            onClick={onFetchLiveHn}
            disabled={isFetchingLive}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono-code font-semibold shadow-lg shadow-amber-950/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {isFetchingLive ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isFetchingLive ? 'HN最新取得中...' : '新星を観測 (Live HN)'}</span>
          </button>

          {/* Innovation Void Button */}
          <button
            id="open-void-modal-btn"
            onClick={onOpenVoidModal}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono-code font-semibold transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">空白地帯 (Void)</span>
            <span className="sm:hidden">アイデア発掘</span>
          </button>

          {/* Help modal */}
          <button
            id="help-btn"
            onClick={onOpenHelpModal}
            className="p-2 rounded-xl bg-[#070d1e]/80 hover:bg-slate-800 text-gray-400 hover:text-white border border-slate-700/60 transition-colors"
            title="操作方法・遊び方"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Hover HUD Tooltip (if hovering on a star) */}
      {hoveredProject && (
        <div className="pointer-events-none self-center mb-auto mt-4 px-4 py-2 rounded-xl bg-black/85 backdrop-blur-md border border-cyan-400/40 text-center shadow-xl shadow-cyan-950/60 animate-fadeIn max-w-sm">
          <div className="text-xs font-mono-code text-cyan-400 font-semibold flex items-center justify-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>{CLUSTERS[hoveredProject.cluster].nameJa}</span>
          </div>
          <div className="text-sm font-display font-bold text-white truncate">
            {hoveredProject.title}
          </div>
          <div className="text-[11px] font-mono-code text-gray-400">
            ★ {hoveredProject.points} pts • クリックでAI解析を表示
          </div>
        </div>
      )}

      {/* Bottom Bar: Clusters Selector, Synchro Search & Camera Controls */}
      <div className="flex flex-col gap-2.5 w-full">
        {/* Clusters Navigation Pills */}
        <div className="pointer-events-auto flex items-center overflow-x-auto no-scrollbar gap-1.5 py-1 px-1">
          <button
            id="filter-all"
            onClick={() => onSelectCluster('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-medium whitespace-nowrap transition-all ${
              activeCluster === 'all'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/80 text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            🌌 全星団 (All)
          </button>

          {Object.values(CLUSTERS).map((cluster) => {
            const isSelected = activeCluster === cluster.id;
            return (
              <button
                key={cluster.id}
                id={`filter-${cluster.id}`}
                onClick={() => onSelectCluster(cluster.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono-code font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? 'text-white border shadow-md'
                    : 'bg-slate-900/80 text-gray-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
                style={{
                  backgroundColor: isSelected ? cluster.color : undefined,
                  borderColor: isSelected ? cluster.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: cluster.color }}
                />
                <span>{cluster.nameJa.replace('星団', '')}</span>
              </button>
            );
          })}
        </div>

        {/* Search Radar & Camera Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Synchro Radar Input */}
          <div className="pointer-events-auto relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              id="synchro-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="思考シンクロ検索 (例: 3D, Rust, 音声AI, PKM, Closebytes)..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#070d1e]/85 backdrop-blur-md border border-cyan-500/30 text-white placeholder-gray-500 text-xs font-mono-code focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-mono-code"
              >
                ×
              </button>
            )}
          </div>

          {/* Camera & Orbit Utility Buttons */}
          <div className="pointer-events-auto flex items-center justify-between sm:justify-end space-x-2">
            <button
              id="toggle-auto-rotate-btn"
              onClick={onToggleAutoRotate}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono-code border transition-all ${
                autoRotate
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/80 text-gray-400 hover:text-white border-slate-800'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              <span>{autoRotate ? '自転中' : '静止'}</span>
            </button>

            <button
              id="reset-view-btn"
              onClick={onResetView}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-gray-400 hover:text-white border border-slate-800 text-xs font-mono-code transition-all"
              title="視点を宇宙中心にリセット"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>原点復帰</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
