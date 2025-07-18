import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TestTube, FlaskConical, BookOpen, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';

const AnalysisCard = ({ icon, title, description, onClick, selected }) => (
  <motion.button
    onClick={onClick}
    className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 text-left w-full ${
      selected
        ? 'bg-blue-600 text-white border-blue-600 shadow-xl'
        : 'bg-white/80 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
        selected ? 'bg-white/20' : 'bg-blue-100'
      }`}>
        {React.cloneElement(icon, { 
          className: `h-6 w-6 ${selected ? 'text-white' : 'text-blue-600'}` 
        })}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className={`text-sm leading-relaxed ${selected ? 'text-blue-100' : 'text-gray-600'}`}>
      {description}
    </p>
  </motion.button>
);

const SubOptionCard = ({ icon, title, description, onClick, comingSoon = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center ios-shadow border hover:shadow-lg transition-shadow"
  >
    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
      {React.cloneElement(icon, { className: "h-7 w-7 text-gray-600" })}
    </div>
    <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{description}</p>
    
    {comingSoon ? (
      <div className="bg-gray-100 text-gray-500 py-2 px-4 rounded-xl text-sm font-medium">
        Coming Soon
      </div>
    ) : (
      <Button 
        onClick={onClick}
        className="ios-button h-10 text-sm rounded-xl px-6 group w-full"
      >
        Go to Protocols
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    )}
  </motion.div>
);

export default function HomeEn() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const handleAnalysisSelect = (analysisType) => {
    setSelectedAnalysis(analysisType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
            Instrumental Analysis
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Complex plant biochemical analysis, now simplified.
            <br />
            Please select your analysis method first.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* First Step: Analysis Method Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <AnalysisCard
              icon={<TestTube />}
              title="Spectrophotometry"
              description="Provides various biochemical analysis methods using spectrophotometer."
              onClick={() => handleAnalysisSelect('spectrophotometry')}
              selected={selectedAnalysis === 'spectrophotometry'}
            />
            <AnalysisCard
              icon={<FlaskConical />}
              title="HPLC"
              description="Provides precision analysis methods using High-Performance Liquid Chromatography."
              onClick={() => handleAnalysisSelect('hplc')}
              selected={selectedAnalysis === 'hplc'}
            />
          </div>

          {/* Second Step: Sub-options for selected analysis method */}
          <AnimatePresence>
            {selectedAnalysis === 'spectrophotometry' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <SubOptionCard
                  icon={<Settings />}
                  title="Epoch Spectrophotometer Usage Guide"
                  description="Guide for using Epoch spectrophotometer and measurement procedures."
                  comingSoon={true}
                />
                <SubOptionCard
                  icon={<BookOpen />}
                  title="Spectrophotometric Analysis Protocols"
                  description="Provides various analysis protocols for chlorophyll, phenols, antioxidant activity, and more."
                  onClick={() => window.location.href = createPageUrl("Analysis_en")}
                />
              </motion.div>
            )}

            {selectedAnalysis === 'hplc' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="flex justify-center"
              >
                <div className="w-full max-w-md">
                  <SubOptionCard
                    icon={<FlaskConical />}
                    title="HPLC Analysis Protocol Manual"
                    description="Provides detailed protocols for High-Performance Liquid Chromatography analysis."
                    comingSoon={true}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}