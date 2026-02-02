export interface SeoAnalysisResult {
    identifier: string;
    score: number;
    text: string;
    status: 'good' | 'ok' | 'bad';
    current?: number; 
    max?: number;
    min?: number;
    unit?: 'chars' | 'words' | 'count';
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function analyzeSeo(
    content: string, 
    keyword: string, 
    title: string, 
    metaTitle: string, 
    metaDesc: string,
    metaKeywords: string 
) {
    const results: SeoAnalysisResult[] = [];
    
    // 0. SANITIZE KEYWORD
    if (!keyword || !keyword.trim()) {
        return { results: [], score: 0 };
    }
    
    const cleanKeyword = keyword.trim().replace(/\s+/g, ' ');
    const plainText = content.replace(/<[^>]*>/g, ' '); 
    const keywordRegex = new RegExp(`\\b${escapeRegExp(cleanKeyword)}\\b`, 'i');

    // --- 1. KEYWORD EXISTENCE CHECKS ---

    // A. Article Title
    const titleHasKw = keywordRegex.test(title);
    results.push({
        identifier: 'kwInTitle',
        score: titleHasKw ? 10 : 0,
        text: titleHasKw ? "Keyword in Title" : "Keyword missing in Title",
        status: titleHasKw ? 'good' : 'bad'
    });

    // B. Meta Title
    const targetMetaTitle = metaTitle || title; 
    const metaTitleHasKw = keywordRegex.test(targetMetaTitle);
    results.push({
        identifier: 'kwInMetaTitle',
        score: metaTitleHasKw ? 10 : 0,
        text: metaTitleHasKw ? "Keyword in Meta Title" : "Keyword missing in Meta Title",
        status: metaTitleHasKw ? 'good' : 'bad'
    });

    // C. Meta Description
    const metaDescHasKw = keywordRegex.test(metaDesc);
    results.push({
        identifier: 'kwInMetaDesc',
        score: metaDescHasKw ? 10 : 0,
        text: metaDescHasKw ? "Keyword in Meta Desc" : "Keyword missing in Meta Desc",
        status: metaDescHasKw ? 'good' : 'bad'
    });

    // D. Meta Keywords
    const metaKeywordsHasKw = keywordRegex.test(metaKeywords);
    results.push({
        identifier: 'kwInMetaKeywords',
        score: metaKeywordsHasKw ? 10 : 0,
        text: metaKeywordsHasKw ? "Keyword in Meta Tags" : "Keyword missing in Meta Tags",
        status: metaKeywordsHasKw ? 'good' : 'bad'
    });

    // E. Article Content
    const contentHasKw = keywordRegex.test(plainText);
    results.push({
        identifier: 'kwInContent',
        score: contentHasKw ? 10 : 0,
        text: contentHasKw ? "Keyword in Content" : "Keyword missing in Content",
        status: contentHasKw ? 'good' : 'bad'
    });


    // --- 2. LENGTH & BEST PRACTICE CHECKS ---

    // A. Meta Title Length
    const mtLen = (targetMetaTitle || "").length;
    let mtScore = 10;
    let mtMsg = "Title length perfect";
    
    if (mtLen === 0) { mtScore = 0; mtMsg = "Title empty"; }
    else if (mtLen > 60) { mtScore = 5; mtMsg = "Title too long (>60)"; }
    else if (mtLen < 10) { mtScore = 5; mtMsg = "Title too short (<10)"; }

    results.push({
        identifier: 'Meta Title Length',
        score: mtScore,
        text: mtMsg,
        status: mtScore > 7 ? 'good' : mtScore > 4 ? 'ok' : 'bad',
        current: mtLen, 
        max: 60,
        unit: 'chars'
    });

    // B. Meta Description Length
    const mdLen = (metaDesc || "").length;
    let mdScore = 10;
    let mdMsg = "Desc. length perfect";

    if (mdLen === 0) { mdScore = 0; mdMsg = "Description empty"; }
    else if (mdLen > 160) { mdScore = 5; mdMsg = "Desc. too long (>160)"; }
    else if (mdLen < 50) { mdScore = 5; mdMsg = "Desc. too short (<50)"; }

    results.push({
        identifier: 'Meta Desc Length',
        score: mdScore,
        text: mdMsg,
        status: mdScore > 7 ? 'good' : mdScore > 4 ? 'ok' : 'bad',
        current: mdLen, 
        max: 160,
        unit: 'chars'
    });

    // C. Word Count
    const wordCount = plainText.trim().split(/\s+/).filter(w => w.length > 0).length;
    let wordScore = 10;
    if (wordCount < 300) wordScore = 4;
    
    results.push({
        identifier: 'Word Count',
        score: wordScore,
        text: wordCount < 300 ? "Content thin (<300 words)" : "Good content depth",
        status: wordScore > 7 ? 'good' : 'bad',
        current: wordCount, 
        min: 300,
        unit: 'words'
    });

    const totalScore = results.reduce((acc, curr) => acc + curr.score, 0);
    // Normalize to 0-100
    const finalScore = results.length > 0 ? Math.round((totalScore / (results.length * 10)) * 100) : 0;

    return { results, score: finalScore };
}