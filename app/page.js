'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';
import Footer from '@/components/Footer';

export default function LandingPage() {
    const [urlInput, setUrlInput] = useState('');
    const router = useRouter();
    const { setActiveTargetUrl } = useAppState();
    const { user, userProfile, logoutUser, saveAnalysisToFirestore } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedUrl = urlInput.trim();
        if (!trimmedUrl) return;

        setActiveTargetUrl(trimmedUrl);

        if (user) {
            await saveAnalysisToFirestore(trimmedUrl);
            router.push('/analysis/loading');
        } else {
            if (typeof window !== 'undefined') {
                localStorage.setItem('pending_url', trimmedUrl);
            }
            router.push(`/auth?pendingUrl=${encodeURIComponent(trimmedUrl)}`);
        }
    };

    return (
        <div className="bg-background text-on-background font-body min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-16">
                <div className="flex justify-between items-center h-full px-gutter max-w-container-max mx-auto">
                    <Link href="/" className="flex items-center gap-base cursor-pointer">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">AIGrowth</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-xl">
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#product">Product</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#solutions">Solutions</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#pricing">Pricing</a>
                        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md" href="#resources">Resources</a>
                    </div>

                    <div className="flex items-center gap-md">
                        {user ? (
                            <div className="flex items-center gap-sm">
                                <Link href="/settings" className="flex items-center gap-2 hover:bg-surface-container py-1 px-2.5 rounded-full border border-outline-variant/30 cursor-pointer">
                                    {(userProfile?.photoURL || user?.photoURL) ? (
                                        <img src={userProfile?.photoURL || user?.photoURL} alt={userProfile?.displayName || 'User'} className="w-8 h-8 rounded-full object-cover border border-primary/40" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                            {(userProfile?.displayName || user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="hidden sm:inline font-label-md text-label-md text-on-surface max-w-[120px] truncate">
                                        {userProfile?.displayName || user?.displayName || user?.email?.split('@')[0]}
                                    </span>
                                </Link>
                                <Link className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-sm" href="/dashboard">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logoutUser}
                                    title="Sign Out"
                                    className="bg-surface-container-high border border-outline-variant text-on-surface px-md py-sm rounded-lg font-label-md text-label-md hover:bg-error/10 hover:text-error hover:border-error/30 transition-all cursor-pointer"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link className="hidden sm:block text-primary font-label-md text-label-md px-md py-sm hover:opacity-80 transition-all active:scale-95" href="/auth">Log In</Link>
                                <Link className="bg-primary-container text-on-primary-container px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-sm" href="/auth?mode=register">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>


            <main className="pt-16 flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-2xl pb-3xl px-gutter">
                    <div className="max-w-container-max mx-auto relative z-10 text-center lg:text-left grid lg:grid-cols-2 items-center gap-2xl">
                        <div className="space-y-lg">
                            <div className="inline-flex items-center gap-sm px-md py-xs rounded-full bg-surface-container-high border border-outline-variant/50 text-primary font-label-sm text-label-sm animate-fade-in">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                Trusted by 500+ High-Growth Teams
                            </div>
                            <h1 className="font-display text-display tracking-tight text-on-surface max-w-[600px] mx-auto lg:mx-0">
                                Scale Your Web Presence with <span className="text-primary italic">AI Precision</span>
                            </h1>
                            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[540px] mx-auto lg:mx-0">
                                Automate SEO audits, performance benchmarks, and accessibility compliance with our premium neural-guided optimization suite.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-md pt-md max-w-lg mx-auto lg:mx-0">
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">language</span>
                                    <input
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md bg-white shadow-sm outline-none"
                                        placeholder="https://yourwebsite.com"
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-md justify-center lg:justify-start">
                                    <button type="submit" className="bg-primary text-on-primary px-3xl py-md rounded-xl font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-sm cursor-pointer">
                                        Analyze Website <span className="material-symbols-outlined text-md">arrow_forward</span>
                                    </button>
                                    <Link className="bg-white border border-outline-variant text-on-surface px-3xl py-md rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-all active:scale-95 inline-flex items-center justify-center" href="/dashboard">
                                        View Demo
                                    </Link>
                                </div>
                            </form>
                        </div>

                        <div className="relative mt-xl lg:mt-0 group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50 transition-opacity group-hover:opacity-70"></div>
                            <div className="relative bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden aspect-video transform lg:rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
                                <div className="flex items-center gap-xs px-md py-sm border-b border-outline-variant/20 bg-surface-container-low">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-error/20 border border-error/30"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-surface-dim border border-outline-variant/30"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-secondary/20 border border-secondary/30"></div>
                                    </div>
                                </div>
                                <div className="p-lg space-y-md">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-primary">stellarflow.io</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">Growth Score 94/100</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-md">
                                        <div className="p-md bg-surface-container-low rounded-xl">
                                            <span className="text-xs text-outline block">SEO Health</span>
                                            <span className="text-lg font-bold text-primary">98%</span>
                                        </div>
                                        <div className="p-md bg-surface-container-low rounded-xl">
                                            <span className="text-xs text-outline block">Performance</span>
                                            <span className="text-lg font-bold text-secondary">88%</span>
                                        </div>
                                        <div className="p-md bg-surface-container-low rounded-xl">
                                            <span className="text-xs text-outline block">Accessibility</span>
                                            <span className="text-lg font-bold text-tertiary">96%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
