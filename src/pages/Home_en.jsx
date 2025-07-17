
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Beaker, Cpu, ChevronRight, Home, FlaskConical } from 'lucide-react';

const TabButton = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`w-full sm:w-auto flex-1 sm:flex-initial text-center px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 backdrop-blur-md ${
      isActive
        ? 'bg-blue-600/90 text-white shadow-lg border border-blue-400/50'
        : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
    }`}
  >
    {children}
  </button>
);

const SubTabButton = ({ children, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md ${
      isActive
        ? 'bg-white/90 text-blue-600 shadow-md border border-white/50'
        : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
    }`}
  >
    {children}
  </button>
);

export default function HomePageEn() {
  const [mainTab, setMainTab] = useState(null);
  const [subTab, setSubTab] = useState(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 동영상 */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full overflow-hidden">
          <iframe 
            src="https://player.vimeo.com/video/1102177877?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
            className="absolute inset-0 w-full h-full"
            style={{
              width: '100%',
              height: '100%',
              minWidth: '100vw',
              minHeight: '100vh',
              objectFit: 'cover',
              transform: 'scale(1.2)',
              transformOrigin: 'center center'
            }}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Scientist experiments"
          />
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="relative z-10 min-h-screen p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <header className="text-center py-12 text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-6xl font-bold tracking-tight drop-shadow-lg"
            >
              Instrumental Analysis
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl mt-3 drop-shadow-md opacity-90"
            >
              기기 분석
            </motion.h2>
          </header>

          <main>
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl mb-10 border border-white/20"
            >
              <TabButton onClick={() => { setMainTab('spectrophotometer'); setSubTab(null); }} isActive={mainTab === 'spectrophotometer'}>
                Spectrophotometer
              </TabButton>
              <TabButton onClick={() => { setMainTab('hplc'); setSubTab(null); }} isActive={mainTab === 'hplc'}>
                HPLC
              </TabButton>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mainTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[280px]"
              >
                {mainTab === 'spectrophotometer' && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
                    <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white/10 backdrop-blur-md rounded-xl mb-6 border border-white/20">
                      <SubTabButton onClick={() => setSubTab('program')} isActive={subTab === 'program'}>
                        <Cpu className="h-5 w-5" /> Program Usage
                      </SubTabButton>
                      <SubTabButton onClick={() => setSubTab('protocol')} isActive={subTab === 'protocol'}>
                        <Beaker className="h-5 w-5" /> Analysis Protocols
                      </SubTabButton>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={subTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {subTab === 'protocol' && (
                          <Link
                            to={createPageUrl("Analysis_en")}
                            className="block text-center bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white"
                          >
                            <h3 className="text-2xl font-bold mb-2 drop-shadow-md">Spectrophotometer Analysis Protocols</h3>
                            <p className="mb-6 opacity-90 drop-shadow-sm">Explore various spectrophotometer analysis protocols and analyze your data.</p>
                            <div className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600/80 backdrop-blur-md text-white font-semibold rounded-full shadow-lg border border-blue-400/50 hover:bg-blue-500/80 transition-colors">
                              Go to Protocols <ChevronRight className="h-5 w-5" />
                            </div>
                          </Link>
                        )}
                        {subTab === 'program' && (
                           <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 text-white">
                              <h3 className="text-2xl font-bold drop-shadow-md">Coming Soon</h3>
                              <p className="mt-2 opacity-90 drop-shadow-sm">Program usage guide for spectrophotometer (Epoch) is currently under development.</p>
                            </div>
                        )}
                        {subTab === null && (
                          <div className="text-center text-white/80 p-8 rounded-2xl">
                            <p>Please select program usage or analysis protocols from above.</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
                {mainTab === 'hplc' && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
                     <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 text-white">
                        <h3 className="text-2xl font-bold drop-shadow-md">Coming Soon</h3>
                        <p className="mt-2 opacity-90 drop-shadow-sm">HPLC analysis protocol manual is currently under development.</p>
                      </div>
                  </div>
                )}
                {mainTab === null && (
                  <div className="text-center text-white/80 p-8 rounded-2xl">
                    <p>Please select a type of instrumental analysis from above.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          
          <footer className="text-center py-10 mt-10 text-white/70">
              <p className="drop-shadow-sm">© 2024 Instrumental Analysis System. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
