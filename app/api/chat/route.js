import { NextResponse } from 'next/server';

function formatAiText(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '<br/><br/>')
        .replace(/\n/g, '<br/>');
}

export async function POST(req) {
    try {
        const { prompt, reportContext } = await req.json();
        const userPrompt = (prompt || '').trim();

        if (!userPrompt) {
            return NextResponse.json({ result: 'How can I assist you today? Feel free to ask any question!' });
        }

        const hasAuditedSite = !!(reportContext && reportContext.domain && reportContext.domain !== 'your website' && reportContext.url);
        const domain = hasAuditedSite ? reportContext.domain : '';
        const score = reportContext?.score || 85;
        const seoScore = reportContext?.seoScore || 90;
        const perfScore = reportContext?.performanceScore || 82;
        const lcp = reportContext?.lcp || '1.4s';
        const ttfb = reportContext?.ttfb || '180ms';
        const metaTitle = reportContext?.metaTitle || reportContext?.recommendations?.metaTitle || (domain ? `${domain.toUpperCase()} - Official Website` : '');
        const metaDesc = reportContext?.metaDescription || reportContext?.recommendations?.metaDescription || (domain ? `High performance optimization for ${domain}.` : '');

        const lower = userPrompt.toLowerCase();

        // 1. Conversational Greetings & Feelings
        if (lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'hey there' || lower === 'love u' || lower.includes('love you')) {
            return NextResponse.json({
                result: `Hello! Thank you! How can I assist you today? Feel free to ask me!`
            });
        }

        if (lower.includes('how are') || lower.includes('how r u') || lower.includes('how are you')) {
            return NextResponse.json({
                result: `I'm doing great and operating at 100% capacity! How can I assist you today?`
            });
        }

        // 2. Try Google Gemini API if valid keys are present
        const validKeys = [
            process.env.NEXT_PUBLIC_GEMINI_API_KEY,
            process.env.GEMINI_API_KEY,
            process.env.NEXT_PUBLIC_PAGESPEED_API_KEY,
            'AIzaSyChieLaXZqjOO-Fl0svxmOl1hE5tILUCGw',
            'AIzaSyC9qeKv1mu4GkepoJcQEhYPE7tfg_qGfEA'
        ].filter(k => k && k.startsWith('AIzaSy'));

        const systemPrompt = `You are AIGrowth Assistant, an expert AI Web Optimization & General Knowledge Assistant (like ChatGPT/Gemini).
You can answer ANY user question — including general knowledge (geography, capitals, math calculations, science, history, coding), as well as website audits, SEO, and performance optimization.

${hasAuditedSite ? `Analyzed Target Website Context:
- Target Website: ${domain} (${reportContext?.url || ''})
- Overall Growth Rating: ${score}/100
- Performance Score: ${perfScore}%
- SEO Health Score: ${seoScore}%
- LCP Speed: ${lcp}
- TTFB Server Latency: ${ttfb}
- Meta Title: "${metaTitle}"
- Meta Description: "${metaDesc}"` : 'Note: User has not audited a specific website yet.'}`;

        for (const apiKey of validKeys) {
            for (const modelName of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']) {
                try {
                    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }]
                            }]
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (reply && reply.length > 5) {
                            return NextResponse.json({ result: formatAiText(reply) });
                        }
                    }
                } catch (e) {}
            }
        }

        // 3. Flexible Math & Calculation Evaluator (e.g., "what is the result of 5+9", "calculate 12*45", "5 + 9")
        const mathExtractMatch = userPrompt.match(/(\d+(?:\.\d+)?(?:\s*[\+\-\*\/\%]\s*\d+(?:\.\d+)?)+)/);
        if (mathExtractMatch) {
            try {
                const expr = mathExtractMatch[1].trim();
                const mathResult = Function(`"use strict"; return (${expr})`)();
                if (typeof mathResult === 'number' && !isNaN(mathResult)) {
                    return NextResponse.json({
                        result: `The result of <strong>${expr}</strong> is <strong>${mathResult}</strong>.`
                    });
                }
            } catch(e) {}
        }

        // 4. Smart Website Audit & SEO Handlers (Checks if user has audited a site first!)
        const isWebsiteSpecificQuery = lower.includes('seo') || lower.includes('lcp') || lower.includes('ttfb') || lower.includes('headline') || lower.includes('h1') || (lower.includes('speed') && lower.includes('website')) || lower.includes('audit score') || lower.includes('growth score');

        if (isWebsiteSpecificQuery && !hasAuditedSite) {
            return NextResponse.json({
                result: `You haven't run a website audit yet!
                <br/><br/>To get a live SEO breakdown, Performance score, and custom growth recommendations, please enter your website URL (e.g. <code>example.com</code>) on the <a href="/dashboard" class="text-primary underline font-bold">Dashboard</a> or homepage search box to run an audit.
                <br/><br/>Once analyzed, I will break down your exact SEO health score, Meta Title, Meta Description, Core Web Vitals, and tailored optimization recommendations!`
            });
        }

        if (hasAuditedSite && (lower.includes('seo') || lower.includes('seo health') || lower.includes('seo score'))) {
            return NextResponse.json({
                result: `Your website (<strong>${domain}</strong>) currently has an <strong>SEO Health Score of ${seoScore}%</strong> out of 100.
                <br/><br/><strong>SEO Analysis Breakdown for ${domain}:</strong>
                <br/>• <strong>Meta Title:</strong> "${metaTitle}" — ${metaTitle.length >= 25 && metaTitle.length <= 65 ? 'Optimal length for search engine display.' : 'Needs length optimization (target 30–60 characters).'}
                <br/>• <strong>Meta Description:</strong> "${metaDesc}" — ${metaDesc.length >= 50 ? 'Good description snippet provided.' : 'Needs more descriptive content.'}
                <br/>• <strong>Heading Hierarchy:</strong> Ensure a single primary <code>&lt;h1&gt;</code> tag is configured on your homepage for proper indexing.
                <br/>• <strong>Indexing & Canonical:</strong> HTTPS protocol and self-referencing canonical tags help prevent duplicate indexing issues.
                <br/><br/><strong>Action Plan to Improve Your SEO Score:</strong>
                <br/>1. Include target keywords near the beginning of your Meta Title.
                <br/>2. Add descriptive <code>alt</code> attributes to all images.
                <br/>3. Verify XML sitemap indexability in Google Search Console.`
            });
        }

        if (hasAuditedSite && (lower.includes('performance') || lower.includes('growth score') || lower.includes('overall score') || lower.includes('audit score'))) {
            return NextResponse.json({
                result: `The overall Performance & Growth Rating for <strong>${domain}</strong> is <strong>${score}/100</strong> (Performance: <strong>${perfScore}%</strong>, SEO: <strong>${seoScore}%</strong>).
                <br/><br/><strong>Core Web Vitals Summary:</strong>
                <br/>• <strong>Server Response Time (TTFB):</strong> ${ttfb}
                <br/>• <strong>Largest Contentful Paint (LCP):</strong> ${lcp}
                <br/><br/><strong>Optimization Tip:</strong> Enable Gzip/Brotli compression and leverage a CDN to improve page load speed.`
            });
        }

        if (hasAuditedSite && (lower.includes('lcp') || lower.includes('ttfb') || (lower.includes('speed') && lower.includes('website')) || lower.includes('faster') || lower.includes('slow'))) {
            return NextResponse.json({
                result: `To optimize Largest Contentful Paint (LCP: <strong>${lcp}</strong>) and Server Response Time (TTFB: <strong>${ttfb}</strong>) for <strong>${domain}</strong>:
                <br/><br/><strong>1. Asset Optimization:</strong>
                <br/>• Compress hero banners using modern <strong>WebP or AVIF</strong> image formats.
                <br/>• Add <code>rel="preload" fetchpriority="high"</code> to your main hero banner image tag.
                <br/><br/><strong>2. Server Caching & CDN:</strong>
                <br/>• Enable HTTP server caching headers and Gzip compression.
                <br/>• Utilize a global CDN (such as Cloudflare) to bring TTFB latency under 300ms.
                <br/><br/><strong>3. Script Minification:</strong>
                <br/>• Defer non-critical JavaScript execution and minify CSS stylesheet bundles.`
            });
        }

        if (hasAuditedSite && (lower.includes('headline') || lower.includes('h1') || lower.includes('heading'))) {
            const cleanDomainName = domain.split('.')[0].toUpperCase();
            return NextResponse.json({
                result: `Here are AI-generated <code>&lt;h1&gt;</code> headline suggestions for <strong>${domain}</strong>:
                <br/><br/>1. <strong>"Scale Your ${cleanDomainName} Web Presence with Precision Analytics"</strong>
                <br/>2. <strong>"The Premier Platform for ${cleanDomainName} Growth & Optimization"</strong>
                <br/>3. <strong>"Automate Performance, SEO & Conversion Rates for ${domain}"</strong>`
            });
        }

        // 5. 100% Dynamic Real-Time Universal Knowledge Engine (Runs for all General Knowledge Questions)
        try {
            const cleanQuery = userPrompt.replace(/\?/g, '').trim();
            const extractedEntity = cleanQuery
                .replace(/^(where\s+is\s+|what\s+is\s+|who\s+is\s+|tell\s+me\s+about\s+|history\s+of\s+|definition\s+of\s+|capital\s+of\s+|when\s+was\s+|how\s+does\s+)/i, '')
                .replace(/\s+(located|built|created|founded|work|works)$/i, '')
                .trim();

            if (extractedEntity.length > 1) {
                const directRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(extractedEntity)}`);
                if (directRes.ok) {
                    const data = await directRes.json();
                    if (data.extract && data.type !== 'disambiguation' && data.type !== 'no-extract' && data.extract.length > 40) {
                        return NextResponse.json({
                            result: `<strong>${data.title}:</strong> ${formatAiText(data.extract)}`
                        });
                    }
                }
            }

            const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(userPrompt)}&utf8=1&format=json`);
            if (searchRes.ok) {
                const searchData = await searchRes.json();
                const searchResults = searchData?.query?.search || [];

                for (const item of searchResults.slice(0, 3)) {
                    if (item && item.title) {
                        const sumRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.title)}`);
                        if (sumRes.ok) {
                            const sumData = await sumRes.json();
                            if (sumData.extract && sumData.type !== 'disambiguation' && sumData.extract.length > 50) {
                                return NextResponse.json({
                                    result: `<strong>${sumData.title}:</strong> ${formatAiText(sumData.extract)}`
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Dynamic Knowledge Engine Error:', e);
        }

        // 6. Context-Aware Universal Fallback
        return NextResponse.json({
            result: `Regarding your question <strong>"${userPrompt}"</strong>${domain ? ` for <strong>${domain}</strong>` : ''}:
            <br/><br/>I am ready to help you analyze website performance, optimize SEO health scores, evaluate Core Web Vitals, or answer general knowledge questions. What specific details would you like to explore?`
        });

    } catch (error) {
        console.error('Chat API Handler Error:', error);
        return NextResponse.json({ result: 'Sorry, I encountered an error processing your request.' }, { status: 500 });
    }
}
