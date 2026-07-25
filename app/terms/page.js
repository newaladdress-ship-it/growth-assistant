'use client';

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-background text-on-background font-body min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Terms & Conditions" showSearch={false} />

                <div className="max-w-[900px] mx-auto p-lg md:p-xl w-full flex-1 space-y-xl">
                    {/* Header Hero Banner */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl shadow-sm relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 space-y-sm">
                            <span className="text-primary font-bold text-label-sm uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">Legal Terms</span>
                            <h1 className="text-headline-lg font-headline-lg font-black text-on-surface">Terms & Conditions</h1>
                            <p className="text-on-surface-variant text-body-md">
                                Effective Date: January 1, 2026 | Last Updated: July 25, 2026
                            </p>
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl shadow-sm space-y-xl text-on-surface-variant leading-relaxed text-body-md">
                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using <strong>AIGrowth Assistant</strong> ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree to all of these terms, you are expressly prohibited from using the Platform and must discontinue use immediately.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">2. Description of Services</h2>
                            <p>
                                AIGrowth Assistant provides AI-driven website analysis, SEO health evaluations, PageSpeed benchmarks, Core Web Vitals diagnostics, and interactive AI chat assistance for digital growth optimization.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">3. Acceptable Use Policy</h2>
                            <p>When utilizing our audit tool and AI services, you agree not to:</p>
                            <ul className="list-disc pl-lg space-y-xs">
                                <li>Submit malicious URLs or attempt denial-of-service (DoS) attacks on third-party target websites.</li>
                                <li>Reverse engineer, scrape, or automate queries in a manner that exceeds platform rate limits.</li>
                                <li>Use the AI Assistant to generate harmful, illegal, or abusive content.</li>
                                <li>Share or expose unauthorized API tokens or account credentials.</li>
                            </ul>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">4. Intellectual Property</h2>
                            <p>
                                The platform, including code, design systems, visual interfaces, logos, and algorithms, is the exclusive intellectual property of AIGrowth Assistant. Submitted website audit reports remain accessible for your operational growth use.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">5. Disclaimer of Warranties</h2>
                            <p>
                                Audit reports and AI optimization recommendations are provided on an "AS IS" and "AS AVAILABLE" basis. While we utilize live Lighthouse engines and advanced AI models to ensure surgical accuracy, performance benchmarks may vary based on external server conditions.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">6. Limitation of Liability</h2>
                            <p>
                                In no event shall AIGrowth Assistant or its developers be liable for indirect, consequential, or incidental damages arising out of your reliance on website audit metrics or third-party web changes.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">7. Contact & Inquiries</h2>
                            <p>
                                For questions regarding these Terms & Conditions, please visit our <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> or access your account <Link href="/settings" className="text-primary underline font-semibold">Settings Page</Link>.
                            </p>
                        </section>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
