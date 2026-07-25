'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';
import { useEffect } from 'react';

export default function DashboardPage() {
    const [urlInput, setUrlInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const {
        history,
        userProfile,
        setActiveTargetUrl,
        setActiveReport,
        deleteReport
    } = useAppState();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth?redirect=/dashboard');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface gap-md">
                <span className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                <p className="font-label-md text-label-md text-on-surface-variant font-medium">Please sign in to access your dashboard...</p>
            </div>
        );
    }

    const handleAuditSubmit = (e) => {
        e.preventDefault();
        if (!urlInput.trim()) return;
        setActiveTargetUrl(urlInput.trim());
        router.push('/analysis/loading');
    };

    const handleViewReport = (report) => {
        setActiveReport(report);
        router.push('/analysis/report');
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this audit report?')) {
            deleteReport(id);
        }
    };

    const totalScans = history.length;
    const avgScore = Math.round(history.reduce((acc, r) => acc + (r.score || 0), 0) / (totalScans || 1));
    const totalIssues = history.reduce((acc, r) => acc + (r.weaknesses ? r.weaknesses.length * 15 : 30), 0);

    const filteredHistory = history.filter(r => r.domain.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-background text-on-background font-body min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title={`Welcome back, ${userProfile.name.split(' ')[0]}`} />

                <div className="p-lg md:p-2xl max-w-container-max mx-auto w-full space-y-xl flex-1">
                    {/* Analysis Input Section */}
                    <section className="bg-surface-container-lowest rounded-xl p-xl soft-shadow border border-outline-variant/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="relative z-10 space-y-md">
                            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Optimize your web presence</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                                Enter your website URL to receive an AI-powered growth analysis, performance scoring, and actionable SEO improvements.
                            </p>
                            <form onSubmit={handleAuditSubmit} className="flex flex-col sm:flex-row gap-sm items-stretch mt-lg">
                                <div className="flex-1 relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">language</span>
                                    <input
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md bg-white outline-none"
                                        placeholder="https://yourwebsite.com"
                                        type="text"
                                        required
                                    />
                                </div>
                                <button type="submit" className="bg-primary text-on-primary font-label-md text-label-md px-xl py-4 rounded-xl shadow-lg hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer">
                                    <span>Analyze Website</span>
                                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">bolt</span>
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Quick Stats Bento */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
                        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-md">
                                <div className="p-sm bg-primary/10 rounded-lg">
                                    <span className="material-symbols-outlined text-primary">visibility</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                            </div>
                            <div>
                                <span className="font-label-md text-label-md text-on-surface-variant">Total Scans</span>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{totalScans.toLocaleString()}</h3>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-md">
                                <div className="p-sm bg-secondary/10 rounded-lg">
                                    <span className="material-symbols-outlined text-secondary">analytics</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+4.2</span>
                            </div>
                            <div>
                                <span className="font-label-md text-label-md text-on-surface-variant">Avg. Score</span>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{avgScore}/100</h3>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-md">
                                <div className="p-sm bg-tertiary-container/10 rounded-lg">
                                    <span className="material-symbols-outlined text-tertiary">task_alt</span>
                                </div>
                                <span className="text-xs font-bold text-primary bg-primary-fixed px-2 py-1 rounded-full">85%</span>
                            </div>
                            <div>
                                <span className="font-label-md text-label-md text-on-surface-variant">Issues Fixed</span>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{totalIssues.toLocaleString()}</h3>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-md">
                                <div className="p-sm bg-outline-variant/20 rounded-lg">
                                    <span className="material-symbols-outlined text-on-surface">layers</span>
                                </div>
                            </div>
                            <div>
                                <span className="font-label-md text-label-md text-on-surface-variant">Active Projects</span>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">{Math.max(1, Math.min(18, totalScans))}</h3>
                            </div>
                        </div>
                    </section>

                    {/* Recent Reports Section */}
                    <section className="space-y-md">
                        <div className="flex items-center justify-between">
                            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Recent Reports</h2>
                            <Link href="/history" className="text-primary font-label-md text-label-md hover:underline">View all history</Link>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-surface-container-low/50">
                                            <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/10">Website</th>
                                            <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/10">Date</th>
                                            <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/10">Growth Score</th>
                                            <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/10">Status</th>
                                            <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/10 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/10">
                                        {filteredHistory.slice(0, 5).map((report) => (
                                            <tr key={report.id} onClick={() => handleViewReport(report)} className="hover:bg-surface-container-lowest transition-colors group cursor-pointer">
                                                <td className="px-lg py-md">
                                                    <div className="flex items-center gap-sm">
                                                        <div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center text-primary">
                                                            <span className="material-symbols-outlined text-sm">public</span>
                                                        </div>
                                                        <span className="font-body-md text-body-md font-medium">{report.domain}</span>
                                                    </div>
                                                </td>
                                                <td className="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">{report.date}</td>
                                                <td className="px-lg py-md">
                                                    <div className="flex items-center gap-xs">
                                                        <div className="w-16 bg-surface-container rounded-full h-1.5 overflow-hidden">
                                                            <div className="bg-green-500 h-full" style={{ width: `${report.score}%` }}></div>
                                                        </div>
                                                        <span className={`text-body-sm font-bold ${report.score >= 80 ? 'text-green-600' : report.score >= 60 ? 'text-amber-600' : 'text-error'}`}>{report.score}</span>
                                                    </div>
                                                </td>
                                                <td className="px-lg py-md">
                                                    <span className={`inline-flex items-center gap-xs px-2 py-1 rounded-full ${report.score >= 80 ? 'bg-green-100 text-green-700' : report.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-error-container text-on-error-container'} font-label-sm text-label-sm`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${report.score >= 80 ? 'bg-green-500' : report.score >= 60 ? 'bg-amber-500' : 'bg-error'}`}></span>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-lg py-md text-right">
                                                    <button onClick={() => handleViewReport(report)} className="p-2 text-on-surface-variant hover:text-primary transition-colors inline-block" title="View Report">
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </button>
                                                    <button onClick={(e) => handleDelete(report.id, e)} className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors inline-block ml-1" title="Delete">
                                                        <span class="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>

                <Footer />
            </main>
        </div>
    );
}
