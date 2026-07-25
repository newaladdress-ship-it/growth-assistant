'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        {
            title: 'Getting Started',
            icon: 'rocket_launch',
            desc: 'Learn how to analyze websites, run audits, and navigate your dashboard.'
        },
        {
            title: 'Audit Metrics & SEO',
            icon: 'analytics',
            desc: 'Understand Core Web Vitals (LCP, TTFB, CLS), meta tags, and Lighthouse scores.'
        },
        {
            title: 'AI Chat Assistant',
            icon: 'chat',
            desc: 'Discover how to ask questions, generate strategies, and consult our AI engine.'
        },
        {
            title: 'Account & API Keys',
            icon: 'key',
            desc: 'Manage dark/light themes, update profile photo, and generate integration keys.'
        }
    ];

    const faqs = [
        {
            q: 'How does AIGrowth Assistant audit a website?',
            a: 'When you submit a website URL, our server performs a direct, real-time HTTP fetch to parse HTML meta tags, title length, H1 headings, image alt attributes, and SSL certificates. We also query Google PageSpeed Insights for Lighthouse Core Web Vitals.'
        },
        {
            q: 'Are the audit results live or pre-cached?',
            a: 'All audit reports are 100% live and generated in real time when you enter a URL. The system measures actual Time-To-First-Byte (TTFB) latency and scans the latest HTML payload of the target site.'
        },
        {
            q: 'What are Core Web Vitals and why do they matter?',
            a: 'Core Web Vitals are Google metric standards (including LCP, TTFB, and CLS) that measure user experience. LCP (Largest Contentful Paint) measures loading speed, TTFB measures server latency, and CLS measures visual stability.'
        },
        {
            q: 'How do I switch between Light and Dark mode?',
            a: 'Go to your Settings page from the sidebar navigation. Under the Preferences section, click the Theme Mode toggle to switch between Light and Dark interfaces.'
        },
        {
            q: 'Can the AI Assistant answer general knowledge questions?',
            a: 'Yes! Our AIGrowth Assistant is equipped with a dual AI engine and real-time knowledge pipeline that answers general knowledge, geography, science, history, math calculations, and website optimization questions.'
        },
        {
            q: 'Where are my past website audit reports stored?',
            a: 'Your past website audit reports are saved to your account history. You can view, open, or delete previous reports anytime by clicking "History" in the left sidebar.'
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const filteredFaqs = faqs.filter(
        f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background text-on-background font-body min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Help Center" showSearch={false} />

                <div className="max-w-container-max mx-auto p-lg md:p-xl w-full flex-1 space-y-2xl">
                    {/* Hero Search Section */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl md:p-2xl shadow-sm text-center relative overflow-hidden space-y-md">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 max-w-2xl mx-auto space-y-md">
                            <span className="text-primary font-bold text-label-sm uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">Knowledge Base & Support</span>
                            <h1 className="text-headline-lg font-headline-lg font-black text-on-surface">How can we help you today?</h1>
                            <p className="text-body-md text-on-surface-variant">
                                Search our knowledge base for answers to audit metrics, AI chat capabilities, and account settings.
                            </p>

                            <div className="relative mt-md">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search help topics, metrics, or questions..."
                                    className="w-full bg-surface border border-outline-variant/50 rounded-2xl pl-12 pr-4 py-3.5 text-body-md focus:border-primary transition-all outline-none text-on-surface shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Help Categories */}
                    <section className="space-y-lg">
                        <h2 className="text-headline-md font-bold text-on-surface">Browse by Topic</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                            {categories.map((cat, idx) => (
                                <div key={idx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-lg space-y-sm hover:border-primary/50 transition-all shadow-sm">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                                    </div>
                                    <h3 className="text-label-lg font-bold text-on-surface">{cat.title}</h3>
                                    <p className="text-body-sm text-on-surface-variant leading-relaxed">{cat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* FAQ Accordion Section */}
                    <section className="space-y-lg">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-md">
                            <div>
                                <h2 className="text-headline-md font-bold text-on-surface">Frequently Asked Questions</h2>
                                <p className="text-body-sm text-on-surface-variant">Quick answers to common questions about audits, metrics, and account usage.</p>
                            </div>
                        </div>

                        <div className="space-y-md">
                            {filteredFaqs.length === 0 ? (
                                <div className="p-xl bg-surface-container-lowest rounded-2xl border text-center text-on-surface-variant">
                                    No help topics found matching "{searchQuery}".
                                </div>
                            ) : (
                                filteredFaqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div key={idx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm transition-all">
                                            <button
                                                onClick={() => toggleFaq(idx)}
                                                className="w-full flex items-center justify-between p-lg text-left font-bold text-on-surface hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                                            >
                                                <span className="text-body-md pr-md">{faq.q}</span>
                                                <span className="material-symbols-outlined text-primary transition-transform duration-200">
                                                    {isOpen ? 'expand_less' : 'expand_more'}
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-lg pb-lg text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-md bg-surface/30">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    {/* Contact & Links Footer Card */}
                    <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-lg">
                        <div className="space-y-xs text-center md:text-left">
                            <h3 className="text-headline-sm font-bold text-on-surface">Still have questions?</h3>
                            <p className="text-body-sm text-on-surface-variant">Visit settings to manage profile preferences or review legal policies.</p>
                        </div>
                        <div className="flex gap-md flex-wrap justify-center">
                            <Link href="/settings" className="bg-primary text-on-primary px-xl py-3 rounded-xl font-bold text-label-md hover:opacity-90 transition-all active:scale-95">
                                Settings
                            </Link>
                            <Link href="/privacy" className="border border-outline-variant text-on-surface px-xl py-3 rounded-xl font-bold text-label-md hover:bg-surface-container transition-all">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="border border-outline-variant text-on-surface px-xl py-3 rounded-xl font-bold text-label-md hover:bg-surface-container transition-all">
                                Terms & Conditions
                            </Link>
                        </div>
                    </section>
                </div>

                <Footer />
            </main>
        </div>
    );
}
