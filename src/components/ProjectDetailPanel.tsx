import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ExternalLink,
  MessageSquare,
  Flame,
  User,
  Calendar,
  Sparkles,
  Lightbulb,
  Compass,
  Cpu,
  Share2,
  Check,
} from 'lucide-react';
import { ShowHnProject } from '../types';
import { CLUSTERS } from '../data/clusters';

interface ProjectDetailPanelProps {
  project: ShowHnProject | null;
  onClose: () => void;
  onSelectRelated?: (project: ShowHnProject) => void;
  allProjects: ShowHnProject[];
}

export const ProjectDetailPanel: React.FC<ProjectDetailPanelProps> = ({
  project,
  onClose,
  onSelectRelated,
  allProjects,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!project) return null;

  const cluster = CLUSTERS[project.cluster];

  // Find 2 nearby projects in the same cluster
  const relatedProjects = allProjects
    .filter((p) => p.cluster === project.cluster && p.id !== project.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${project.title}\n${project.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <motion.aside
        key={project.id}
        initial={{ opacity: 0, x: 80, y: 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed z-40 right-0 top-0 bottom-0 w-full sm:w-[460px] max-w-full bg-[#070d1e]/95 backdrop-blur-xl border-l border-cyan-500/20 shadow-2xl flex flex-col overflow-hidden text-gray-100"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-slate-900/90 to-[#0b132b]">
          <div className="flex items-center space-x-2.5">
            <span
              className="w-3 h-3 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: cluster.color, boxShadow: `0 0 10px ${cluster.color}` }}
            />
            <span className="text-xs font-mono-code uppercase tracking-wider text-cyan-400 font-semibold">
              {cluster.nameJa}
            </span>
            {project.isSupernova && (
              <span className="px-2 py-0.5 text-[10px] font-mono-code font-bold uppercase rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse">
                Supernova 新星
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              id="share-project-btn"
              onClick={handleShare}
              title="URLをコピー"
              className="p-1.5 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              id="close-panel-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Title and Author Meta */}
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold leading-snug text-white group-hover:text-cyan-300 transition-colors">
              {project.title}
            </h2>

            {/* Hacker News Telemetry Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-mono-code text-gray-400">
              <span className="flex items-center space-x-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                <Flame className="w-3.5 h-3.5" />
                <span>{project.points} pts</span>
              </span>
              <span className="flex items-center space-x-1 text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{project.commentsCount} comments</span>
              </span>
              <span className="flex items-center space-x-1 text-gray-400">
                <User className="w-3.5 h-3.5 text-gray-500" />
                <span>{project.author}</span>
              </span>
              <span className="flex items-center space-x-1 text-gray-400">
                <Calendar className="w-3.5 h-3.5 text-gray-500" />
                <span>{project.postedDate}</span>
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              id="open-repo-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 text-center"
            >
              <span>プロジェクトを開く</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              id="open-hn-link"
              href={project.hnUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all text-center"
            >
              <span>HN スレッド</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* AI Analysis Section (LLM Breakdown) */}
          <div className="rounded-2xl bg-gradient-to-b from-[#0f172a]/90 to-[#0c1322]/90 border border-cyan-500/20 p-4 space-y-4 shadow-inner">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-mono-code font-bold uppercase tracking-wider">
                AI 衛星解析レポート
              </span>
            </div>

            {/* ひとことで言うと */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono-code uppercase text-gray-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>ひとことで言うと</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-medium pl-2.5 border-l border-cyan-500/40">
                {project.summary.oneLiner}
              </p>
            </div>

            {/* ここが新しい/面白い */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono-code uppercase text-gray-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>ここが新しい / 面白い</span>
              </div>
              <ul className="space-y-1.5 pl-2.5">
                {project.summary.highlights.map((point, idx) => (
                  <li key={idx} className="text-xs text-gray-300 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* どんな人に刺さりそうか */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono-code uppercase text-gray-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>どんな人に刺さりそうか</span>
              </div>
              <p className="text-xs text-indigo-200/90 pl-2.5">
                {project.summary.targetAudience}
              </p>
            </div>

            {/* 改善・クローン開発のヒント（アイデアの種） */}
            <div className="mt-2 pt-3 border-t border-slate-800/80 space-y-1.5 bg-amber-500/5 -mx-4 -mb-4 p-4 rounded-b-2xl">
              <div className="text-[11px] font-mono-code uppercase text-amber-400 flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">開発の種（自分ならどう作るか）</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {project.summary.hackIdea}
              </p>
            </div>
          </div>

          {/* Tech Tags */}
          <div>
            <div className="text-xs font-mono-code text-gray-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>テクノロジー分類タグ</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-mono-code rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Celestial Cluster Info */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center space-x-2 text-gray-300 font-semibold">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>星団座標・天体情報</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              {cluster.description}
            </p>
            <div className="text-[10px] font-mono-code text-cyan-400/80">
              Sector: [{project.position.map((n) => n.toFixed(1)).join(', ')}]
            </div>
          </div>

          {/* Related Stars in same constellation */}
          {relatedProjects.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-mono-code text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>近傍の星（同星団プロジェクト）</span>
                <span className="text-[10px] text-cyan-400 font-normal">タップで航行</span>
              </div>
              <div className="space-y-2">
                {relatedProjects.map((rp) => (
                  <button
                    key={rp.id}
                    onClick={() => onSelectRelated?.(rp)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/50 hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs text-gray-200 group-hover:text-cyan-300 truncate font-medium">
                        {rp.title.replace(/^Show HN:\s*/, '')}
                      </div>
                      <div className="text-[10px] font-mono-code text-gray-500">
                        ★ {rp.points} pts • {rp.commentsCount} comments
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-cyan-400">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
