'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';
import { usePWAInstall } from '@/lib/usePWAInstall';

export default function Sidebar() {
    const pathname = usePathname();
    const { userProfile: appProfile } = useAppState();
    const { user, userProfile, logoutUser } = useAuth();
    const { isInstalled, installApp } = usePWAInstall();

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => setIsMobileOpen(prev => !prev);
        const handleClose = () => setIsMobileOpen(false);

        window.addEventListener('toggle-mobile-sidebar', handleToggle);
        window.addEventListener('close-mobile-sidebar', handleClose);
        return () => {
            window.removeEventListener('toggle-mobile-sidebar', handleToggle);
            window.removeEventListener('close-mobile-sidebar', handleClose);
        };
    }, []);

    // Close mobile drawer when pathname changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const displayName = userProfile?.displayName || user?.displayName || appProfile?.name || 'User';
    const email = userProfile?.email || user?.email || '';
    const photoURL = userProfile?.photoURL || user?.photoURL || null;

    const initials = displayName
        ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
        { name: 'AI Assistant', href: '/ai-chat', icon: 'chat' },
        { name: 'History', href: '/history', icon: 'history' },
        { name: 'Settings', href: '/settings', icon: 'settings' },
    ];

    const sidebarContent = (
        <div className="h-full flex flex-col p-md">
            <div className="flex items-center justify-between mb-3xl px-sm">
                <Link href="/" onClick={() => setIsMobileOpen(false)} className="cursor-pointer block">
                    <span className="font-headline-lg text-headline-lg font-black text-primary">AIGrowth</span>
                </Link>
                {/* Mobile close button */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    aria-label="Close menu"
                >
                    <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
            </div>

            <nav className="flex-1 space-y-sm">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all active:translate-x-1 duration-150 ${
                                isActive
                                    ? 'bg-secondary-container text-on-secondary-container border-l-4 border-primary font-bold'
                                    : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span className="font-label-md text-label-md">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Sidebar PWA Install Button */}
                <button
                    onClick={() => { installApp(); setIsMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all active:scale-95 duration-150 cursor-pointer ${
                        isInstalled
                            ? 'bg-primary/10 text-primary font-semibold border border-primary/20'
                            : 'bg-gradient-to-r from-primary/15 to-secondary/15 text-primary hover:bg-primary/20 font-bold border border-primary/30'
                    }`}
                >
                    <span className="material-symbols-outlined text-[22px]">
                        {isInstalled ? 'check_circle' : 'install_desktop'}
                    </span>
                    <div className="flex-1 flex items-center justify-between">
                        <span className="font-label-md text-label-md">
                            {isInstalled ? 'App Installed' : 'Install App'}
                        </span>
                        {!isInstalled && (
                            <span className="text-[10px] bg-primary text-on-primary font-bold px-1.5 py-0.5 rounded-md">
                                PWA
                            </span>
                        )}
                    </div>
                </button>
            </nav>

            <div className="mt-auto space-y-sm border-t border-outline-variant/20 pt-md">
                <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    {photoURL ? (
                        <img src={photoURL} alt={displayName} className="w-9 h-9 rounded-full object-cover border border-outline-variant/40" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                            {initials}
                        </div>
                    )}
                    <div className="overflow-hidden">
                        <p className="font-label-md text-label-md text-on-surface font-bold truncate">{displayName}</p>
                        <p className="text-label-sm text-outline truncate">{email || 'Starter Plan'}</p>
                    </div>
                </div>

                <Link
                    href="/analysis/loading"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all mb-md flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                    Analyze Website
                </Link>

                <Link
                    href="/help"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-low rounded-xl px-4 py-2 transition-colors"
                >
                    <span className="material-symbols-outlined">help</span>
                    <span className="font-label-md text-label-md">Help Center</span>
                </Link>
                
                {user ? (
                    <button
                        onClick={() => { logoutUser(); setIsMobileOpen(false); }}
                        className="w-full flex items-center gap-3 text-on-surface-variant hover:bg-error/10 hover:text-error rounded-xl px-4 py-2 transition-colors cursor-pointer text-left"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        <span className="font-label-md text-label-md">Sign Out</span>
                    </button>
                ) : (
                    <Link
                        href="/auth"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 text-primary hover:bg-surface-container-low rounded-xl px-4 py-2 transition-colors"
                    >
                        <span className="material-symbols-outlined">login</span>
                        <span className="font-label-md text-label-md">Sign In</span>
                    </Link>
                )}

                <div className="pt-2 text-center text-xs text-on-surface-variant/70 border-t border-outline-variant/10">
                    Developed by{' '}
                    <a
                        href="https://imrandigitals.online/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold hover:underline inline-flex items-center gap-0.5"
                    >
                        Imran Digitals
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Fixed Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-[280px] bg-surface border-r border-outline-variant/20 shadow-md flex-col z-40 hidden md:flex">
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    {/* Drawer container */}
                    <aside className="relative w-[280px] max-w-[85vw] bg-surface h-full shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-300">
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
}
