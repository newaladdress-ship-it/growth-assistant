'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';
import { AuditEngine } from '@/lib/auditEngine';

export default function AiChatPage() {
    const { activeReport } = useAppState();
    const { user, userProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth?redirect=/ai-chat');
        }
    }, [user, authLoading, router]);

    const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'there';
    const report = activeReport || null;

    const [messages, setMessages] = useState([
        {
            id: 'init-1',
            sender: 'ai',
            time: 'Just now',
            text: `Hello ${displayName}! How can I help you today?`
        }
    ]);
    const [inputVal, setInputVal] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = (e) => {
        if (e) e.preventDefault();
        if (!inputVal.trim()) return;
        const msgText = inputVal.trim();
        setInputVal('');
        sendUserMessage(msgText);
    };

    const sendQuickPrompt = (promptText) => {
        sendUserMessage(promptText);
    };

    const sendUserMessage = async (text) => {
        const userMsg = {
            id: 'usr-' + Date.now(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: text
        };
        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        try {
            const answer = await AuditEngine.askGemini(text, report || {});
            const aiMsg = {
                id: 'ai-' + Date.now(),
                sender: 'ai',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                text: answer
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error('AI response error:', err);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="bg-background text-on-background font-body h-screen flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 md:ml-[280px] h-screen flex flex-col bg-background relative">
                <Header title="AI Growth Assistant" showSearch={false} />

                <section className="flex-1 flex flex-col overflow-hidden max-w-5xl mx-auto w-full px-gutter">
                    <div className="flex-1 overflow-y-auto pt-xl pb-base space-y-6 scroll-smooth">
                        <div className="flex justify-center">
                            <span className="text-[10px] font-bold tracking-widest text-outline uppercase bg-surface-container px-3 py-1 rounded-full">Today</span>
                        </div>

                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-4 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-surface-container-highest text-on-surface' : 'bg-secondary text-white'}`}>
                                    <span className="material-symbols-outlined text-[18px]">{msg.sender === 'user' ? 'person' : 'smart_toy'}</span>
                                </div>
                                <div className={`flex flex-col gap-2 ${msg.sender === 'user' ? 'items-end text-right' : ''}`}>
                                    <div className={`px-4 py-3 rounded-2xl max-w-md border border-outline-variant/10 shadow-sm ${msg.sender === 'user' ? 'bg-surface-container-high text-on-surface-variant rounded-tr-none' : 'bg-surface-container-lowest text-on-surface rounded-tl-none'}`}>
                                        <div className="leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text }}></div>
                                    </div>
                                    <span className="text-[11px] text-on-surface-variant font-medium">{msg.sender === 'user' ? 'You' : 'Assistant'} • {msg.time}</span>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex gap-4 max-w-3xl">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                                </div>
                                <div className="flex items-center bg-surface-container-low px-4 py-3 rounded-2xl rounded-tl-none border border-outline-variant/5">
                                    <span className="text-xs text-on-surface-variant italic">
                                        {report?.domain ? `AI is analyzing ${report.domain}...` : `AI Growth Assistant is thinking...`}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pb-xl space-y-md">
                        <div className="flex gap-sm overflow-x-auto pb-2 no-scrollbar">
                            <button onClick={() => sendQuickPrompt('How do I fix LCP?')} className="bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface text-label-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer">
                                How do I fix LCP?
                            </button>
                            <button onClick={() => sendQuickPrompt('Explain my website SEO Health score')} className="bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface text-label-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer">
                                Explain SEO score
                            </button>
                            <button onClick={() => sendQuickPrompt('Generate H1 Headlines')} className="bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface text-label-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer">
                                Generate H1 Headlines
                            </button>
                            <button onClick={() => sendQuickPrompt('How to improve TTFB?')} className="bg-surface-container border border-outline-variant/30 hover:border-primary text-on-surface text-label-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer">
                                Improve TTFB
                            </button>
                        </div>

                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                placeholder={report?.domain ? `Ask AI about ${report.domain} or general questions...` : "Ask AI any question or audit website..."}
                                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl pl-5 pr-14 py-4 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-all shadow-md"
                            />
                            <button type="submit" className="absolute right-2 bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
