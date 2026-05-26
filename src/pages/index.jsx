import Layout from "./Layout.jsx";

import Analysis from "./Analysis";
import AnalysisEn from "./Analysis_en";

import Results from "./Results";
import ResultsEn from "./Results_en";

import Home from "./Home";
import HomeEn from "./Home_en";

import HPLC from "./HPLC";
import HPLCEn from "./HPLC_en";

import HPLC_Results from "./HPLC_Results";
import HPLCResultsEn from "./HPLC_Results_en";

import Kjeldahl from "./Kjeldahl";
import KjeldahlEn from "./Kjeldahl_en";

import MainHome from "./MainHome";
import MainHomeEn from "./MainHome_en";

import PhysiologicalMeasurement from "./PhysiologicalMeasurement";
import PhysiologicalMeasurementEn from "./PhysiologicalMeasurement_en";

import Li6800 from "./Li6800";
import Li6800En from "./Li6800_en";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    Analysis: Analysis,
    Analysis_en: AnalysisEn,
    
    Results: Results,
    Results_en: ResultsEn,
    
    Home: Home,
    Home_en: HomeEn,
    
    HPLC: HPLC,
    HPLC_en: HPLCEn,
    
    HPLC_Results: HPLC_Results,
    HPLC_Results_en: HPLCResultsEn,

    Kjeldahl: Kjeldahl,
    Kjeldahl_en: KjeldahlEn,

    Physiological: PhysiologicalMeasurement,
    Physiological_en: PhysiologicalMeasurementEn,

    Li6800: Li6800,
    Li6800_en: Li6800En,

    // [추가] MainHome도 PAGES 목록에 명시적으로 추가해두는 것이 안전합니다.
    MainHome: MainHome,
    MainHome_en: MainHomeEn,
}

function _getCurrentPage(url) {
    // ✨ [핵심 수정] 루트 경로('/')이거나 비어있을 때 'MainHome'을 반환하도록 강제 설정
    if (url === '/' || url === '') {
        return 'MainHome';
    }

    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    // 대소문자 구분 없이 찾기
    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    
    // 페이지를 못 찾으면 기본값으로 첫 번째 페이지를 반환하는데, 
    // 루트 경로 처리를 위에서 했으므로 이제 안전합니다.
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                <Route path="/" element={<MainHome />} />
                <Route path="/mainhome_en" element={<MainHomeEn />} />
                
                <Route path="/Analysis" element={<Analysis />} />
                <Route path="/analysis_en" element={<AnalysisEn />} />
                
                <Route path="/Results" element={<Results />} />
                <Route path="/results_en" element={<ResultsEn />} />
                
                <Route path="/Home" element={<Home />} />
                <Route path="/home_en" element={<HomeEn />} />
                
                <Route path="/HPLC" element={<HPLC />} />
                <Route path="/hplc" element={<HPLC />} />
                <Route path="/hplc_en" element={<HPLCEn />} />
                
                <Route path="/HPLC_Results" element={<HPLC_Results />} />
                <Route path="/hplc_results" element={<HPLC_Results />} />
                <Route path="/hplc_results_en" element={<HPLCResultsEn />} />

                <Route path="/Kjeldahl" element={<Kjeldahl />} />
                <Route path="/kjeldahl" element={<Kjeldahl />} />
                <Route path="/kjeldahl_en" element={<KjeldahlEn />} />

                <Route path="/Physiological" element={<PhysiologicalMeasurement />} />
                <Route path="/physiological" element={<PhysiologicalMeasurement />} />
                <Route path="/physiological_en" element={<PhysiologicalMeasurementEn />} />

                <Route path="/Li6800" element={<Li6800 />} />
                <Route path="/li6800" element={<Li6800 />} />
                <Route path="/li6800_en" element={<Li6800En />} />

            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}