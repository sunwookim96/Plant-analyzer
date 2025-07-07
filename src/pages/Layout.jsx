
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf, FlaskConical, BarChart3 } from "lucide-react";

// Helper function to get page URL
const createPageUrl = (page) => `/${page.toLowerCase()}`;

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname.startsWith(createPageUrl("Results"))) {
      return "데이터 분석 및 결과";
    }
    if (location.pathname.startsWith(createPageUrl("Analysis"))) {
      return "분석 프로토콜";
    }
    return "Plant Biochemical Analysis";
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
      `}</style>

      <div className="relative z-10">
        <header className="sticky top-0 z-50 ios-blur bg-white/80 border-b border-gray-200/60 ios-shadow">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Link to={createPageUrl("Analysis")} className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ios-shadow">
                    <Leaf className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 tracking-tight">PlantAnalyzer</h1>
                    <p className="text-xs text-gray-500 font-medium">{getPageTitle()}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  );
}
