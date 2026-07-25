'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';

export default function HistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [minScoreFilter, setMinScoreFilter] = useState(0);
    const [userHistory, setUserHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const router = useRouter();

    const { history: localHistory, setActiveReport, deleteReport } = useAppState();
    const { user, loading: authLoading, getUserAnalyses } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth?redirect=/history');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        async function fetchHistory() {
            if (user) {
                setLoadingHistory(true);
                const firestoreHistory = await getUserAnalyses();
                // Map firestore history items or combine with local history for current session
                const formatted = firestoreHistory.map(item => ({
                    id: item.id,
                    domain: item.domain || (item.url ? item.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0] : 'Unknown'),
                    url: item.url,
                    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
                    timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
                    score: item.report?.score || 85,
                    seoScore: item.report?.seoScore || 88,
                    performanceScore: item.report?.performanceScore || 82,
                    uxScore: item.report?.uxScore || 85,
                    accessibilityScore: item.report?.accessibilityScore || 90,
                    status: item.report?.status || 'Completed',
                    ...item.report
                }));
                
                // Also merge any local session reports created by this user
                const combined = [...formatted];
                localHistory.forEach(localItem => {
                    if (!combined.some(c => c.domain === localItem.domain)) {
                        combined.push(localItem);
                    }
                });
                setUserHistory(combined);
                setLoadingHistory(false);
            } else {
                setUserHistory([]);
                setLoadingHistory(false);
            }
        }

        fetchHistory();
    }, [user, localHistory]);

    const activeHistoryList = user ? userHistory : [];

    const handleView = (report) => {
        setActiveReport(report);
        router.push('/analysis/report');
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('Delete this audit report from history?')) {
            deleteReport(id);
            setUserHistory(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleDownloadSingle = (report, e) => {
        e.stopPropagation();
        const jsonStr = JSON.stringify(report, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.domain}_report.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleExportAll = () => {
        const jsonStr = JSON.stringify(activeHistoryList, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aigrowth_history_export.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const now = Date.now();
    const filteredHistory = activeHistoryList.filter(report => {
        const matchesDomain = (report.domain || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesScore = (report.score || 0) >= minScoreFilter;
        let matchesDate = true;
        if (dateFilter === '7days') {
            matchesDate = (now - (report.timestamp || 0)) <= (86400000 * 7);
        } else if (dateFilter === '30days') {
            matchesDate = (now - (report.timestamp || 0)) <= (86400000 * 30);
        }
        return matchesDomain && matchesScore && matchesDate;
    });

    return (
        <div className="bg-background text-on-background font-body min-h-screen">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Audit History" showSearch={false} />

                <div className="p-gutter max-w-container-max mx-auto space-y-lg w-full flex-1">
                    {/* Filters and Actions Bar */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-md flex flex-col lg:flex-row gap-md items-center shadow-sm">
                        <div className="relative flex-1 w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg py-2.5 pl-10 pr-4 text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none"
                                placeholder="Search domains or reports..."
                                type="text"
                            />
                        </div>
                        <div className="flex flex-wrap gap-sm w-full lg:w-auto">
                            <div className="relative">
                                <select
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                    className="appearance-none bg-surface-container-low border border-outline-variant/50 rounded-lg py-2.5 pl-4 pr-10 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-on-surface"
                                >
                                    <option value="all">Filter by Date</option>
                                    <option value="7days">Last 7 Days</option>
                                    <option value="30days">Last 30 Days</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                            </div>
                            <div className="relative">
                                <select
                                    value={minScoreFilter}
                                    onChange={(e) => setMinScoreFilter(parseInt(e.target.value) || 0)}
                                    className="appearance-none bg-surface-container-low border border-outline-variant/50 rounded-lg py-2.5 pl-4 pr-10 text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-on-surface"
                                >
                                    <option value={0}>Min Score</option>
                                    <option value={90}>Above 90</option>
                                    <option value={80}>Above 80</option>
                                    <option value={50}>Above 50</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">filter_list</span>
                            </div>
                            <button onClick={handleExportAll} className="bg-surface border border-outline-variant/50 text-on-surface-variant font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Export All
                            </button>
                        </div>
                    </div>

                    {/* Main Data Table Container */}
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                                        <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant">Domain</th>
                                        <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant">Analysis Date</th>
                                        <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant">Growth Score</th>
                                        <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                                        <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/20">
                                    {filteredHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-lg py-xl text-center text-on-surface-variant">No history records found matching criteria.</td>
                                        </tr>
                                    ) : (
                                        filteredHistory.map((report) => (
                                            <tr key={report.id} onClick={() => handleView(report)} className="hover:bg-surface-container-lowest transition-colors cursor-pointer">
                                                <td className="px-lg py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center text-primary">
                                                            <span className="material-symbols-outlined text-[18px]">language</span>
                                                        </div>
                                                        <span className="font-body-md text-body-md font-medium text-on-surface">{report.domain}</span>
                                                    </div>
                                                </td>
                                                <td className="px-lg py-4 text-on-surface-variant font-body-sm text-body-sm">{report.date}</td>
                                                <td className="px-lg py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-headline-md text-headline-md font-bold ${report.score >= 80 ? 'text-primary' : report.score >= 60 ? 'text-tertiary' : 'text-error'}`}>{report.score}</span>
                                                        <span className={`material-symbols-outlined ${report.score >= 80 ? 'text-green-500' : report.score >= 60 ? 'text-amber-500' : 'text-error'} text-[18px]`}>
                                                            {report.score >= 80 ? 'trending_up' : report.score >= 60 ? 'trending_flat' : 'trending_down'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-lg py-4">
                                                    <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${report.score >= 80 ? 'bg-primary/10 text-primary border border-primary/20' : report.score >= 60 ? 'bg-tertiary/10 text-tertiary border border-tertiary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                                <td className="px-lg py-4 text-right space-x-2">
                                                    <button onClick={() => handleView(report)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer" title="View Report">
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </button>
                                                    <button onClick={(e) => handleDownloadSingle(report, e)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors cursor-pointer" title="Download JSON">
                                                        <span className="material-symbols-outlined">file_download</span>
                                                    </button>
                                                    <button onClick={(e) => handleDelete(report.id, e)} className="p-2 text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer" title="Delete">
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
