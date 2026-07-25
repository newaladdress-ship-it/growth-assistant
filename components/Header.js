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
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center h-16 px-lg">
            <div className="flex items-center gap-md">
                <button
                    onClick={() => window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
                    className="md:hidden p-2 hover:bg-surface-container rounded-full transition-all cursor-pointer"
                    aria-label="Open navigation menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="font-headline-md text-headline-md font-bold text-on-surface">{title}</h1>
            </div>

            <div className="flex items-center gap-lg">
                {showSearch && (
                    <div className="hidden sm:flex items-center bg-surface-container-low px-md py-sm rounded-full border border-outline-variant/30 w-64">
                        <span className="material-symbols-outlined text-outline text-md">search</span>
                        <input
                            className="bg-transparent border-none focus:ring-0 text-body-sm font-body-sm w-full ml-xs text-on-surface outline-none"
                            placeholder="Search projects..."
                            type="text"
                        />
                    </div>
                )}

                <div className="flex items-center gap-sm">
                    {/* Header PWA Install Button */}
                    <button
                        onClick={installApp}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                        title={isInstalled ? 'App Installed' : 'Install App'}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {isInstalled ? 'check_circle' : 'download'}
                        </span>
                        <span className="hidden xs:inline">
                            {isInstalled ? 'Installed' : 'Install App'}
                        </span>
                    </button>

                    <Link href="/history" className="hover:bg-surface-container rounded-full p-2 cursor-pointer active:opacity-70 transition-all">
                        <span className="material-symbols-outlined">search</span>
                    </Link>
                    <Link href="/settings" className="hover:bg-surface-container rounded-full p-2 cursor-pointer active:opacity-70 transition-all relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-xs">
                            <Link href="/settings" className="flex items-center gap-2 hover:bg-surface-container py-1 px-2.5 rounded-full border border-outline-variant/30 cursor-pointer">
                                {photoURL ? (
                                    <img src={photoURL} alt={displayName} className="w-8 h-8 rounded-full object-cover border border-primary/40" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="hidden sm:inline font-label-md text-label-md text-on-surface max-w-[120px] truncate">
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
                        <Link href="/auth" className="text-primary font-label-md text-label-md px-md py-sm hover:underline">
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
