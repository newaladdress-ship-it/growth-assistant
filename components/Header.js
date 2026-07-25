'use client';

import React from 'react';
import Link from 'next/link';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';
import { usePWAInstall } from '@/lib/usePWAInstall';

export default function Header({ title = 'Dashboard', showSearch = true }) {
    const { userProfile: appUserProfile } = useAppState();
    const { user, userProfile, logoutUser } = useAuth();
    const { isInstalled, installApp } = usePWAInstall();

    const displayName = userProfile?.displayName || user?.displayName || appUserProfile?.name || 'User';
    const photoURL = userProfile?.photoURL || user?.photoURL || null;

    return (
        <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center h-16 px-md md:px-lg">
            <div className="flex items-center gap-sm md:gap-md">
                {/* Mobile Brand Logo */}
                <Link href="/" className="md:hidden flex items-center gap-1.5 font-bold text-primary font-headline-md text-lg">
                    <span>AIGrowth</span>
                </Link>
                <h1 className="hidden md:block font-headline-md text-headline-md font-bold text-on-surface">{title}</h1>
            </div>

            <div className="flex items-center gap-xs sm:gap-md">
                {/* Mobile Navigation Quick Bar */}
                <nav className="flex md:hidden items-center gap-1 mr-1">
                    <Link href="/dashboard" className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="Dashboard">
                        <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    </Link>
                    <Link href="/ai-chat" className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="AI Assistant">
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                    </Link>
                    <Link href="/history" className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant hover:text-primary transition-colors" title="History">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                    </Link>
                </nav>

                {showSearch && (
                    <div className="hidden sm:flex items-center bg-surface-container-low px-md py-sm rounded-full border border-outline-variant/30 w-48 md:w-64">
                        <span className="material-symbols-outlined text-outline text-md">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm w-full ml-xs text-on-surface outline-none"
                            placeholder="Search..."
                            type="text"
                        />
                    </div>
                )}

                <div className="flex items-center gap-xs">
                    {/* Header PWA Install Button */}
                    <button
                        onClick={installApp}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                        title={isInstalled ? 'App Installed' : 'Install App'}
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            {isInstalled ? 'check_circle' : 'download'}
                        </span>
                        <span className="hidden sm:inline">
                            {isInstalled ? 'Installed' : 'Install'}
                        </span>
                    </button>

                    <Link href="/settings" className="hover:bg-surface-container rounded-full p-1.5 cursor-pointer active:opacity-70 transition-all text-on-surface-variant" title="Settings">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-xs ml-1">
                            <Link href="/settings" className="flex items-center gap-1.5 hover:bg-surface-container py-1 px-2 rounded-full border border-outline-variant/30 cursor-pointer">
                                {photoURL ? (
                                    <img src={photoURL} alt={displayName} className="w-7 h-7 rounded-full object-cover border border-primary/40" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="hidden lg:inline font-label-md text-label-md text-on-surface max-w-[100px] truncate">
                                    {displayName}
                                </span>
                            </Link>
                            <button
                                onClick={logoutUser}
                                title="Sign out"
                                className="hover:bg-error/10 text-on-surface-variant hover:text-error rounded-full p-1.5 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-md">logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link href="/auth" className="text-primary font-label-md text-xs sm:text-label-md px-sm py-xs hover:underline">
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
