import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Target, ArrowRight, Sparkles, Rocket } from 'lucide-react';
import { InnovationVoid } from '../types';
import { CLUSTERS } from '../data/clusters';

interface InnovationVoidModalProps {
  isOpen: boolean;
  onClose: () => void;
  voids: InnovationVoid[];
  onFlyToVoid: (v: InnovationVoid) => void;
}

export const InnovationVoidModal: React.FC<InnovationVoidModalProps> = ({
  isOpen,
  onClose,
  voids,
  onFlyToVoid,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#080e22] border border-purple-500/30 p-5 sm:p-7 shadow-2xl shadow-purple-950/50 text-gray-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-purple-500/20">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-purple-400">
                <Zap className="w-5 h-5 animate-bounce text-purple-400" />
                <span className="text-xs font-mono-code font-bold uppercase tracking-wider">
                  Innovation Void Finder
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
                未開拓市場・空白地帯ファインダー
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                点群マップ上でプロジェクトが密集していない「クラスタ間の境界領域」をスキャン。世界中の個人開発者がまだ手をつけていない、次のキラーアプリの種を導出しました。
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Voids */}
          <div className="mt-5 space-y-4">
            {voids.map((item) => {
              const clusterA = CLUSTERS[item.clusterA];
              const clusterB = CLUSTERS[item.clusterB];

              return (
                <div
                  key={item.id}
                  className="rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 p-4 space-y-3 transition-all group"
                >
                  {/* Clusters bridged */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-xs font-mono-code">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ backgroundColor: `${clusterA.color}22`, color: clusterA.color }}
                      >
                        {clusterA.nameJa.replace('星団', '')}
                      </span>
                      <span className="text-purple-400 font-bold">×</span>
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ backgroundColor: `${clusterB.color}22`, color: clusterB.color }}
                      >
                        {clusterB.nameJa.replace('星団', '')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-mono-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        ポテンシャル: {item.potentialScore}%
                      </span>
                      <span className="text-[10px] font-mono-code text-gray-400 bg-slate-800 px-2 py-0.5 rounded">
                        {item.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-display font-bold text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Opportunity & App Idea */}
                  <div className="space-y-1.5 text-xs">
                    <div className="text-gray-400 flex items-start space-x-1.5">
                      <Target className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item.opportunity}</span>
                    </div>

                    <div className="text-purple-200 bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20 flex items-start space-x-2">
                      <Rocket className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        <strong className="text-purple-300">提案アイデア: </strong>
                        {item.suggestedApp}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Fly to Void */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        onFlyToVoid(item);
                        onClose();
                      }}
                      className="flex items-center space-x-1.5 text-xs font-mono-code text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                    >
                      <span>この空白宙域へ航行</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-center text-xs text-purple-300/80">
            💡 あなたが思いついたアイデアも、Hacker Newsに「Show HN」として投稿すれば新しい星としてこの銀河に輝きます！
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
