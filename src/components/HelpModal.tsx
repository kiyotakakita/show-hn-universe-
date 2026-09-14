import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MousePointer, Hand, Sparkles, Search, Compass, RefreshCw } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#080e22] border border-cyan-500/30 p-5 sm:p-6 shadow-2xl text-gray-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-display font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>Show HN 宇宙銀河の歩き方</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <MousePointer className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">回転とズーム操作</div>
                <p className="text-gray-400 mt-0.5 leading-relaxed">
                  <strong>PC:</strong> マウスドラッグで3D空間を全方向に回転。ホイールで拡大・縮小。
                  <br />
                  <strong>スマホ:</strong> 1本指スワイプで回転、2本指ピンチでズーム。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">星をタップしてAI要約を読む</div>
                <p className="text-gray-400 mt-0.5 leading-relaxed">
                  輝く星をクリックするとカメラが滑らかに接近し、右側のテレメトリパネルに「ひとことで言うと」「ここが新しい」「開発の種（クローン案）」などのAI解析レポートが開きます。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">新星を観測（Live Hacker News）</div>
                <p className="text-gray-400 mt-0.5 leading-relaxed">
                  上部の「新星を観測」ボタンを押すと、公式Hacker News APIからリアルタイムに最新のShow HNを取得し、銀河に光る新星（Supernova）としてリアルタイム配置します。
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Search className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">思考シンクロ検索 ＆ 空白地帯発見</div>
                <p className="text-gray-400 mt-0.5 leading-relaxed">
                  自分が考えているキーワード（例:「点群」「音声認識」「WASM」「PKM」）を入力すると合致する星だけが光ります。「空白地帯」ボタンでは、星団と星団の間の未開拓アイデアを発掘できます。
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono-code text-xs transition-colors"
            >
              探査を開始する
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
