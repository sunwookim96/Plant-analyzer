
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

export default function HomePage() {
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
              기기 분석
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl mt-3 drop-shadow-md opacity-90"
            >
              Instrumental Analysis
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
                분광광도계
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
                        <Cpu className="h-5 w-5" /> 프로그램 이용 방법
                      </SubTabButton>
                      <SubTabButton onClick={() => setSubTab('protocol')} isActive={subTab === 'protocol'}>
                        <Beaker className="h-5 w-5" /> 분석 프로토콜 선택
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
                            to={createPageUrl("Analysis")}
                            className="block text-center bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white"
                          >
                            <h3 className="text-2xl font-bold mb-2 drop-shadow-md">분광광도계 분석 프로토콜</h3>
                            <p className="mb-6 opacity-90 drop-shadow-sm">다양한 분광광도계 분석 프로토콜을 확인하고, 데이터를 분석하세요.</p>
                            <div className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600/80 backdrop-blur-md text-white font-semibold rounded-full shadow-lg border border-blue-400/50 hover:bg-blue-500/80 transition-colors">
                              프로토콜 페이지로 이동 <ChevronRight className="h-5 w-5" />
                            </div>
                          </Link>
                        )}
                        {subTab === 'program' && (
                           <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 text-white">
                              <h3 className="text-2xl font-bold drop-shadow-md">향후 추가 예정</h3>
                              <p className="mt-2 opacity-90 drop-shadow-sm">분광광도계(Epoch) 프로그램 이용 방법은 현재 준비 중입니다.</p>
                            </div>
                        )}
                        {subTab === null && (
                          <div className="text-center text-white/80 p-8 rounded-2xl">
                            <p>프로그램 이용 방법 또는 분석 프로토콜을 선택해주세요.</p>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
                {mainTab === 'hplc' && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6">
                     <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 text-white">
                        <h3 className="2xl font-bold drop-shadow-md">향후 추가 예정</h3>
                        <p className="mt-2 opacity-90 drop-shadow-sm">HPLC용 분석 프로토콜 매뉴얼은 현재 준비 중입니다.</p>
                      </div>
                  </div>
                )}
                {mainTab === null && (
                  <div className="text-center text-white/80 p-8 rounded-2xl">
                    <p>기기 유형을 선택하여 자세한 정보를 확인하세요.</p>
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
