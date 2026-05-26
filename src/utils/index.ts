// 페이지 ID와 화면에 표시될 제목을 매핑하는 객체
export const PAGE_TITLES: { [key: string]: string } = {
    MainHome: "Plant Analyzer",
    MainHome_en: "Plant Analyzer",          // ✅ 여기가 핵심! 메인 홈 제목
    Home: "Instrumental Analysis",       // 기기 분석 제목
    Home_en: "Instrumental Analysis",
    
    // 나머지 페이지 제목들
    Physiological: "Physiological Measurement",
    Analysis: "Analysis Setup",
    Analysis_en: "Analysis Setup",
    Results: "Analysis Results",
    Results_en: "Analysis Results",
    HPLC: "HPLC Analysis",
    HPLC_en: "HPLC Analysis",
    HPLC_Results: "HPLC Results",
    HPLC_Results_en: "HPLC Results",
    Kjeldahl: "Kjeldahl Method",
    Kjeldahl_en: "Kjeldahl Method",
    Physiological_en: "Physiological Measurement",
    Li6800: "Li-6800 Guide",
    Li6800_en: "LI-6800 Guide",
};

export function createPageUrl(pageName: string) {
    // 1. 메인 홈(MainHome)이면 루트 경로('/') 반환
    if (pageName === 'MainHome') {
        return '/';
    }

    // 2. 나머지는 소문자로 변환하여 경로 생성
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}