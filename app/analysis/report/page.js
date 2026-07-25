'use client';

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAppState } from '@/lib/appState';

export default function AnalysisReportPage() {
    const { activeReport } = useAppState();
    const report = activeReport || {
        domain: 'stellarflow.io',
        url: 'https://stellarflow.io',
        date: 'Oct 24, 2024',
        score: 94,
        seoScore: 98,
        performanceScore: 88,
        uxScore: 92,
        accessibilityScore: 96,
        status: 'Optimized',
        lcp: '1.1s',
        ttfb: '180ms',
        cls: '0.01',
        strengths: [],
        weaknesses: [],
        recommendations: { metaTitle: '', heroH1: '' }
    };

    const circumference = 502.4;
    const strokeDashoffset = circumference - ((report.score || 90) / 100) * circumference;

    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard: ' + text);
        });
    };

    const exportCurrentReport = () => {
        const jsonStr = JSON.stringify(report, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.domain}_audit_report.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-background text-on-background min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Analysis Report" showSearch={false} />

                <section className="p-gutter max-w-container-max mx-auto space-y-gutter w-full flex-1">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
                        <div>
                            <div className="flex items-center gap-2 text-on-surface-variant mb-1">
                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                <span className="text-label-md font-label-md">Report Generated on {report.date}</span>
                            </div>
                            <h3 className="text-display font-display tracking-tight font-bold">{report.domain} Audit</h3>
                        </div>
                        <button onClick={exportCurrentReport} className="bg-surface-container-lowest border border-outline-variant text-on-surface flex items-center gap-2 px-6 py-3 rounded-xl font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">download</span>
                            Export Report
                        </button>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                        {/* Overall Growth Score Card */}
                        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-xl shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10 text-center">
                                <span className="text-label-sm font-label-sm uppercase tracking-widest text-primary mb-6 block font-bold">Overall Growth Score</span>
                                <div className="relative inline-flex items-center justify-center">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                                        <circle
                                            className="text-status-success transition-all duration-1000"
                                            cx="96" cy="96" fill="transparent" r="80"
                                            stroke="currentColor"
                                            strokeDasharray="502.4"
                                            strokeDashoffset={strokeDashoffset}
                                            strokeWidth="12"
                                        ></circle>
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-display font-display font-bold text-on-surface">{report.score}</span>
                                        <span className="text-body-sm font-body-sm text-on-surface-variant">out of 100</span>
                                    </div>
                                </div>
                                <div className="mt-8 flex items-center justify-center gap-2 text-status-success bg-status-success/10 px-4 py-1 rounded-full">
                                    <span className="material-symbols-outlined text-sm">trending_up</span>
                                    <span className="text-label-md font-label-md font-bold">{report.status} ({report.score}/100)</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Insights Summary */}
                        <div className="lg:col-span-8 bg-primary text-on-primary rounded-2xl p-xl shadow-md flex flex-col justify-between relative">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined">auto_awesome</span>
                                    <h4 className="font-headline-md text-headline-md font-bold">AI Insights Summary</h4>
                                </div>
                                <p className="font-body-lg text-body-lg leading-relaxed opacity-90">
                                    Your website <strong className="font-bold">{report.domain}</strong> currently holds a growth rating of <strong class="font-bold">{report.score}/100</strong>.
                                    SEO health is scored at <strong className="font-bold">{report.seoScore}%</strong> and Largest Contentful Paint (LCP) is measured at <strong class="font-bold">{report.lcp}</strong> with a TTFB server response of <strong className="font-bold">{report.ttfb}</strong>.
                                </p>
                            </div>
                            <div className="mt-8 flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                                    <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">LCP Latency</span>
                                    <span className="font-bold">{report.lcp}</span>
                                </div>
                                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                                    <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">TTFB Response</span>
                                    <span className="font-bold">{report.ttfb}</span>
                                </div>
                                <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                                    <span className="block text-xs uppercase tracking-wider opacity-70 mb-1">CLS Metric</span>
                                    <span className="font-bold">{report.cls}</span>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Score Grid */}
                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <span className="text-status-success font-bold text-headline-md">{report.seoScore}</span>
                                </div>
                                <h5 className="text-label-md font-label-md font-bold mb-1">SEO Health</h5>
                                <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                    <div className="h-full bg-status-success" style={{ width: `${report.seoScore}%` }}></div>
                                </div>
                                <p className="text-body-sm font-body-sm text-on-surface-variant mt-4">Meta tags and indexing structure are optimal.</p>
                            </div>

                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <span className="material-symbols-outlined">speed</span>
                                    </div>
                                    <span className="text-status-warning font-bold text-headline-md">{report.performanceScore}</span>
                                </div>
                                <h5 className="text-label-md font-label-md font-bold mb-1">Performance</h5>
                                <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                    <div className="h-full bg-status-warning" style={{ width: `${report.performanceScore}%` }}></div>
                                </div>
                                <p className="text-body-sm font-body-sm text-on-surface-variant mt-4">Asset minification and caching strategies evaluated.</p>
                            </div>

                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <span className="material-symbols-outlined">ads_click</span>
                                    </div>
                                    <span className="text-status-success font-bold text-headline-md">{report.uxScore}</span>
                                </div>
                                <h5 className="text-label-md font-label-md font-bold mb-1">User Experience</h5>
                                <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                    <div className="h-full bg-status-success" style={{ width: `${report.uxScore}%` }}></div>
                                </div>
                                <p className="text-body-sm font-body-sm text-on-surface-variant mt-4">Navigation hierarchy and responsive layout flow.</p>
                            </div>

                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                                        <span className="material-symbols-outlined">accessibility</span>
                                    </div>
                                    <span className="text-status-success font-bold text-headline-md">{report.accessibilityScore}</span>
                                </div>
                                <h5 className="text-label-md font-label-md font-bold mb-1">Accessibility</h5>
                                <div className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                                    <div className="h-full bg-status-success" style={{ width: `${report.accessibilityScore}%` }}></div>
                                </div>
                                <p className="text-body-sm font-body-sm text-on-surface-variant mt-4">Screen reader & WCAG accessibility standards evaluated.</p>
                            </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-gutter">
                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-xl">
                                <h4 className="font-headline-md text-headline-md font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-status-success">check_circle</span>
                                    Core Strengths
                                </h4>
                                <ul className="space-y-4">
                                    {(report.strengths || []).map((s, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="w-2 h-2 bg-status-success rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                                <span className="font-bold block text-on-surface">{s.title}</span>
                                                <span className="text-body-sm text-on-surface-variant">{s.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-xl">
                                <h4 className="font-headline-md text-headline-md font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-status-warning">error</span>
                                    Critical Weaknesses
                                </h4>
                                <ul className="space-y-4">
                                    {(report.weaknesses || []).map((w, idx) => (
                                        <li key={idx} className="flex items-start gap-4">
                                            <div className="w-2 h-2 bg-status-warning rounded-full mt-2 flex-shrink-0"></div>
                                            <div>
                                                <span className="font-bold block text-on-surface">{w.title}</span>
                                                <span className="text-body-sm text-on-surface-variant">{w.desc}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Content Generator Cards */}
                        <div className="lg:col-span-12 space-y-md">
                            <div className="flex items-center justify-between">
                                <h4 className="font-headline-md text-headline-md font-bold">AI Growth Recommendations</h4>
                                <Link href="/ai-chat" className="text-primary font-bold text-label-md hover:underline">Ask AI Assistant</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                                <div className="group bg-surface-container-lowest border-2 border-dashed border-outline-variant/50 rounded-2xl p-lg hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">META TITLE</span>
                                        <span onClick={() => copyText(report.recommendations?.metaTitle || '')} className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer">content_copy</span>
                                    </div>
                                    <h5 className="font-bold mb-2 text-on-surface">Optimized Homepage Title</h5>
                                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 italic text-body-md text-on-surface-variant">
                                        "{report.recommendations?.metaTitle}"
                                    </div>
                                </div>

                                <div className="group bg-surface-container-lowest border-2 border-dashed border-outline-variant/50 rounded-2xl p-lg hover:border-primary/50 transition-all">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">HERO H1</span>
                                        <span onClick={() => copyText(report.recommendations?.heroH1 || '')} className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors cursor-pointer">content_copy</span>
                                    </div>
                                    <h5 className="font-bold mb-2 text-on-surface">Conversion-Focused Hero H1</h5>
                                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 italic text-body-md text-on-surface-variant">
                                        "{report.recommendations?.heroH1}"
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
