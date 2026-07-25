'use client';

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-background text-on-background font-body min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Privacy Policy" showSearch={false} />

                <div className="max-w-[900px] mx-auto p-lg md:p-xl w-full flex-1 space-y-xl">
                    {/* Header Hero Banner */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl shadow-sm relative overflow-hidden">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 space-y-sm">
                            <span className="text-primary font-bold text-label-sm uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">Legal Documentation</span>
                            <h1 className="text-headline-lg font-headline-lg font-black text-on-surface">Privacy Policy</h1>
                            <p className="text-on-surface-variant text-body-md">
                                Effective Date: January 1, 2026 | Last Updated: July 25, 2026
                            </p>
                        </div>
                    </div>

                    {/* Main Content Sections */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl shadow-sm space-y-xl text-on-surface-variant leading-relaxed text-body-md">
                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">1. Introduction</h2>
                            <p>
                                Welcome to <strong>AIGrowth Assistant</strong> ("we", "our", or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our website, AI website growth assistant, and audit platform.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">2. Information We Collect</h2>
                            <p>We collect information that you provide to us as well as data automatically gathered during platform usage:</p>
                            <ul className="list-disc pl-lg space-y-xs">
                                <li><strong>Account & Profile Information:</strong> Display name, email address, profile picture, and authentication credentials managed via Firebase.</li>
                                <li><strong>Website Audit Data:</strong> Target website URLs submitted for PageSpeed, SEO, accessibility, and Core Web Vitals analysis.</li>
                                <li><strong>AI Chat Conversations:</strong> Questions, prompt history, and context shared with our AIGrowth Assistant.</li>
                                <li><strong>Technical & Device Data:</strong> IP address, browser type, operating system, and local storage preferences (theme preferences and cached audit history).</li>
                            </ul>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">3. How We Use Your Information</h2>
                            <p>We utilize collected information for the following legitimate purposes:</p>
                            <ul className="list-disc pl-lg space-y-xs">
                                <li>To execute real-time website performance, SEO, and Core Web Vitals audits.</li>
                                <li>To generate personalized growth recommendations and response context using AI model integrations (Google Gemini API).</li>
                                <li>To maintain your account preferences, theme settings, and audit history.</li>
                                <li>To secure our platform and prevent fraudulent or illegal activities.</li>
                            </ul>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">4. Third-Party Integrations & APIs</h2>
                            <p>Our platform interfaces with reputable third-party services to deliver live analytics and intelligence:</p>
                            <ul className="list-disc pl-lg space-y-xs">
                                <li><strong>Google PageSpeed Insights API:</strong> Evaluates Lighthouse performance metrics for submitted URLs.</li>
                                <li><strong>Google Generative AI (Gemini API):</strong> Processes natural language queries to generate optimization strategies.</li>
                                <li><strong>Firebase Authentication & Storage:</strong> Manages secure user authentication and profile data storage.</li>
                            </ul>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">5. Data Security & Storage</h2>
                            <p>
                                We employ industry-standard encryption protocols (TLS/SSL) for data in transit and secure cloud infrastructure for data at rest. Audit history and user preferences are also securely maintained in local browser storage for quick access.
                            </p>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">6. Your Rights & Choices</h2>
                            <p>You maintain full control over your personal data:</p>
                            <ul className="list-disc pl-lg space-y-xs">
                                <li><strong>Access & Update:</strong> Modify your profile display name and photo anytime in <Link href="/settings" className="text-primary underline">Settings</Link>.</li>
                                <li><strong>Data Deletion:</strong> Clear your audit history or delete generated API keys directly from the dashboard.</li>
                                <li><strong>Theme Customization:</strong> Toggle between Light and Dark interface modes freely.</li>
                            </ul>
                        </section>

                        <section className="space-y-sm">
                            <h2 className="text-headline-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2">7. Contact Us</h2>
                            <p>
                                If you have questions or concerns about this Privacy Policy, please reach out via our support portal or visit our <Link href="/settings" className="text-primary underline font-semibold">Settings Page</Link>.
                            </p>
                        </section>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
