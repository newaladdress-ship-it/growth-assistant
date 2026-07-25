'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';
import { AuditEngine } from '@/lib/auditEngine';

export default function AnalysisLoadingPage() {
    const router = useRouter();
    const { activeTargetUrl, saveReport } = useAppState();
    const { saveAnalysisToFirestore } = useAuth();
    const { hostname } = AuditEngine.cleanDomain(activeTargetUrl);

    const [currentStep, setCurrentStep] = useState(1);
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {
        let isMounted = true;

        const reportPromise = AuditEngine.analyzeWebsite(activeTargetUrl).catch((err) => {
            console.error('Audit execution error:', err);
            return null;
        });

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev > 1) {
                    setCurrentStep((step) => Math.min(4, step + 1));
                    return prev - 1;
                } else {
                    clearInterval(timer);
                    reportPromise.then(async (genReport) => {
                        if (!isMounted) return;
                        if (genReport) {
                            saveReport(genReport);
                            try {
                                await saveAnalysisToFirestore(activeTargetUrl, genReport);
                            } catch(e) {}
                        }
                        router.push('/analysis/report');
                    });
                    return 0;
                }
            });
        }, 1000);

        return () => {
            isMounted = false;
            clearInterval(timer);
        };
    }, [activeTargetUrl]);

    return (
        <div className="bg-background text-on-background font-body min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Dashboard" />

                <div className="flex-1 flex flex-col items-center justify-start py-3xl px-gutter max-w-5xl mx-auto w-full">
                    <div className="relative w-48 h-48 flex items-center justify-center mb-xl">
                        <div className="absolute inset-0 rounded-full bg-secondary-container/20 ai-pulse-ring"></div>
                        <div className="absolute inset-0 rounded-full bg-secondary-container/10 ai-pulse-ring" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute inset-0 rounded-full bg-secondary-container/5 ai-pulse-ring" style={{ animationDelay: '2s' }}></div>
                        <div className="relative z-10 w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-secondary-fixed">
                            <span className="material-symbols-outlined text-5xl text-secondary animate-pulse">psychology</span>
                        </div>
                    </div>

                    <div className="text-center mb-2xl">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm font-bold">Auditing {hostname}</h2>
                        <p className="text-body-md text-on-surface-variant max-w-md mx-auto">
                            Auditing website architecture, Core Web Vitals, and SEO footprint for {activeTargetUrl}...
                        </p>
                    </div>

                    <div className="w-full max-w-4xl mb-3xl">
                        <div className="relative flex items-center justify-between">
                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-surface-container-highest -translate-y-1/2 z-0"></div>
                            <div className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${(currentStep / 4) * 100}%` }}></div>

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-xl">language</span>
                                </div>
                                <span className="font-label-md text-label-md text-primary font-bold">Crawling Pages</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 2 ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-highest text-outline'}`}>
                                    <span className="material-symbols-outlined text-xl">troubleshoot</span>
                                </div>
                                <span className={`font-label-md text-label-md ${currentStep >= 2 ? 'text-primary font-bold' : 'text-outline'}`}>Analyzing SEO</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 3 ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-highest text-outline'}`}>
                                    <span className="material-symbols-outlined text-xl">speed</span>
                                </div>
                                <span className={`font-label-md text-label-md ${currentStep >= 3 ? 'text-primary font-bold' : 'text-outline'}`}>Performance Check</span>
                            </div>

                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= 4 ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-highest text-outline'}`}>
                                    <span className="material-symbols-outlined text-xl">auto_awesome</span>
                                </div>
                                <span className={`font-label-md text-label-md ${currentStep >= 4 ? 'text-primary font-bold' : 'text-outline'}`}>Generating Strategy</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-2xl text-label-sm text-outline flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                        Estimated time remaining: <span>{timeLeft}</span> seconds
                    </p>
                </div>

                <Footer />
            </main>
        </div>
    );
}
