import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  Search, 
  X, 
  Maximize2, 
  Trophy, 
  Clock, 
  Star,
  ChevronRight,
  Filter
} from 'lucide-react';
import gamesData from './data/games.json';

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(gamesData.map(g => g.category))];

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-bg-base text-text-main flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-bg-sidebar sidebar-border hidden md:flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-2 text-brand font-black text-xl tracking-tighter mb-10">
          GAMENODE <div className="w-2 h-2 bg-brand rounded-full" />
        </div>

        <div className="space-y-1 mb-8">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-nav-active text-white font-medium text-sm shadow-sm">
            <Trophy className="w-4 h-4 text-brand" /> Library
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-text-muted hover:text-white font-medium text-sm transition-colors">
            <Gamepad2 className="w-4 h-4" /> Discover
          </button>
        </div>

        <div className="mb-6">
          <div className="text-[11px] font-bold text-gray-600 uppercase tracking-widest px-4 mb-4">
            Categories
          </div>
          <nav className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-nav-active text-white' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-8 border-t border-border">
          <div className="inline-block px-2 py-0.5 bg-text-muted/10 text-text-muted text-[10px] font-mono rounded mb-4">
            v1.2-stable
          </div>
          <div className="text-[11px] text-gray-600 space-y-1">
            <div>Loaded from <strong className="text-gray-400">games.json</strong></div>
            <div>{gamesData.length} games cached via iFrame loader.</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-bg-base overflow-hidden">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-border shrink-0">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              placeholder="Search your local library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e212a] border border-border rounded-xl py-2 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-all text-sm text-text-main placeholder:text-text-dim"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-text-muted hover:text-white transition-colors">
              <Star className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 rounded-full bg-nav-active border border-border flex items-center justify-center">
              <span className="text-xs font-bold text-text-muted text-center leading-none">NV</span>
            </div>
          </div>
        </header>

        {/* Scrollable Grid Area */}
        <section className="flex-1 overflow-y-auto p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[12px] font-bold text-gray-600 uppercase tracking-widest">
              {activeCategory === 'All' ? 'Installed Games' : `${activeCategory} Games`}
            </h2>
            <div className="text-[12px] text-gray-600">Showing {filteredGames.length} items</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, idx) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  className="game-card flex flex-col bg-bg-sidebar rounded-2xl border border-border overflow-hidden hover:border-brand/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedGame(game)}
                >
                  <div className="h-36 bg-[#1e1b4b] relative overflow-hidden flex items-center justify-center p-4">
                    <img 
                      src={game.thumbnail} 
                      alt={game.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1550745679-322131bf42c7?w=800&q=80`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-transparent" />
                    <div className="absolute bottom-3 right-3 bg-black/60 px-2.5 py-1 rounded-md text-[9px] font-bold text-emerald-400 tracking-wide backdrop-blur-sm border border-emerald-400/20">
                      IFRAME READY
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-4">
                      <h3 className="text-[15px] font-bold text-white mb-1">{game.title}</h3>
                      <div className="text-[11px] text-text-dim flex items-center gap-1.5">
                        {game.category} <span className="w-1 h-1 bg-gray-700 rounded-full" /> {Math.floor(Math.random() * 50) + 1}MB
                      </div>
                    </div>
                    <button className="mt-auto w-full py-2.5 bg-brand text-white text-[13px] font-bold rounded-lg hover:bg-brand/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/10">
                      Launch Game
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600">
              <Search className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-sm font-medium">No games match your selection.</p>
            </div>
          )}
        </section>
      </main>

      {/* Theater Mode Overlay */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0b0c10] flex flex-col"
          >
            <header className="h-16 px-6 bg-bg-sidebar border-b border-border flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-white">{selectedGame.title}</h3>
                  <span className="text-[10px] text-text-dim uppercase font-bold tracking-widest">{selectedGame.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-md border border-emerald-500/20">
                   ONLINE
                 </div>
              </div>
            </header>

            <div className="flex-1 bg-black overflow-hidden flex items-center justify-center p-0 md:p-8">
              <div className="w-full h-full max-w-7xl aspect-video bg-[#14161c] shadow-2xl relative border border-border overflow-hidden">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>
            </div>
            
            <footer className="h-12 border-t border-border px-8 flex items-center justify-between bg-bg-sidebar text-[10px] font-bold text-gray-600 tracking-wider">
              <div className="flex gap-4">
                <span>AUTHOR: {selectedGame.author.toUpperCase()}</span>
                <span>SYSTEM: WEB-NATIVE</span>
              </div>
              <div className="flex gap-6">
                <button className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3" /> FULLSCREEN
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
