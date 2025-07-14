
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const isEnglish = location.pathname.includes('_en');

  // 현재 분석 타입과 페이지 상태 확인
  const isResultsPage = currentPageName.includes("Results");
  const isAnalysisPage = currentPageName.includes("Analysis") && !currentPageName.includes("Results");
  const currentAnalysisType = new URLSearchParams(location.search).get("analysis_type");
  const currentTab = new URLSearchParams(location.search).get("tab");

  useEffect(() => {
    if (isEnglish) {
      document.documentElement.lang = 'en';
    } else {
      document.documentElement.lang = 'ko';
    }
  }, [isEnglish]);

  const getPageTitle = () => {
    if (currentPageName.includes("Results")) {
      return location.pathname.includes('_en') ? "Data Analysis & Results" : "데이터 분석 및 결과";
    }
    if (currentPageName.includes("Analysis")) {
      return location.pathname.includes('_en') ? "Analysis Protocols" : "분석 프로토콜";
    }
    return "Plant Biochemical Analysis";
  };

  // 언어 전환을 위한 URL 생성 함수
  const createLanguageSwitchUrl = (targetLanguage) => {
    const searchParams = new URLSearchParams(location.search);
    
    if (isResultsPage) {
      // Results 페이지의 경우
      const basePageName = targetLanguage === 'en' ? 'Results_en' : 'Results';
      let url = createPageUrl(basePageName);
      if (currentAnalysisType) {
        searchParams.set('analysis_type', currentAnalysisType);
      }
      if (currentTab) {
        searchParams.set('tab', currentTab);
      }
      return url + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    } else if (isAnalysisPage) {
      // Analysis 페이지의 경우
      const basePageName = targetLanguage === 'en' ? 'Analysis_en' : 'Analysis';
      let url = createPageUrl(basePageName);
      // Analysis 페이지에서 선택된 분석이 있다면 URL fragment로 전달
      if (currentAnalysisType) {
        searchParams.set('selected', currentAnalysisType);
      }
      return url + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    } else {
      // 기타 페이지의 경우 기본 페이지로 이동
      return createPageUrl(targetLanguage === 'en' ? 'Analysis_en' : 'Analysis');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .ios-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .ios-shadow {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 20px rgba(0, 0, 0, 0.03);
        }
        
        .ios-shadow-lg {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 30px rgba(0, 0, 0, 0.06);
        }
        
        .ios-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .ios-button {
          background: linear-gradient(135deg, #007AFF 0%, #0051D5 100%);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }
        
        .ios-button-secondary {
          background: rgba(142, 142, 147, 0.12);
          color: #007AFF;
          border: none;
          border-radius: 12px;
          font-weight: 600;
        }
        
        .ios-input {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          font-size: 16px;
          padding: 16px;
        }
        
        .ios-input:focus {
          border-color: #007AFF;
          box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        /* Hide number input arrows */
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        /* Mobile responsive improvements */
        @media (max-width: 640px) {
          .ios-input {
            font-size: 16px; /* Prevents zoom on iOS */
            padding: 12px;
          }
        }

        /* Language switch animation */
        .language-switch {
          position: relative;
          overflow: hidden;
        }
        
        .language-option {
          position: relative;
          z-index: 2;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .language-active {
          color: #1f2937;
        }
        
        .language-inactive {
          color: #6b7280;
        }
        
        .language-inactive:hover {
          background-color: rgba(156, 163, 175, 0.1);
        }
      `}</style>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 ios-blur bg-white/80 border-b border-gray-200/60 ios-shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link to={createPageUrl(isEnglish ? "Analysis_en" : "Analysis")} className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ios-shadow">
                    <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">PlantAnalyzer</h1>
                    <p className="text-xs text-gray-500 font-medium truncate">{getPageTitle()}</p>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center bg-gray-200/80 rounded-full p-1 language-switch relative">
                {/* 애니메이션 배경 */}
                <motion.div
                  className="absolute inset-1 bg-white rounded-full shadow-md"
                  initial={false}
                  animate={{
                    x: isEnglish ? '100%' : '0%',
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    width: 'calc(50% - 2px)',
                  }}
                />
                
                <Link 
                  to={createLanguageSwitchUrl('ko')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 language-option ${
                    !isEnglish ? 'language-active' : 'language-inactive'
                  }`}
                >
                  KO
                </Link>
                <Link 
                  to={createLanguageSwitchUrl('en')}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-300 language-option ${
                    isEnglish ? 'language-active' : 'language-inactive'
                  }`}
                >
                  EN
                </Link>
              </div>

            </div>
          </div>
        </header>

        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
