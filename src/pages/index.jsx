import Layout from "./Layout.jsx";

import Analysis from "./Analysis";

import Results from "./Results";

import Analysis_en from "./Analysis_en";

import Results_en from "./Results_en";

import Home from "./Home";

import Home_en from "./Home_en";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Analysis: Analysis,
    
    Results: Results,
    
    Analysis_en: Analysis_en,
    
    Results_en: Results_en,
    
    Home: Home,
    
    Home_en: Home_en,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Analysis" element={<Analysis />} />
                
                <Route path="/Results" element={<Results />} />
                
                <Route path="/Analysis_en" element={<Analysis_en />} />
                
                <Route path="/Results_en" element={<Results_en />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Home_en" element={<Home_en />} />
                
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