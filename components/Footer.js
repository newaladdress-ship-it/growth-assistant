'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto w-full bg-surface-container-lowest border-t border-outline-variant/50 py-xl px-gutter max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-xl text-on-surface-variant">
            <div className="space-y-md col-span-1 md:col-span-2">
                <Link href="/" className="font-headline-md text-headline-md font-bold text-primary block">
                    AIGrowth Assistant
                </Link>
                <p className="font-body-sm text-body-sm leading-relaxed max-w-xs">
                    Empowering digital teams with surgical precision analytics and growth strategies driven by advanced AI.
                </p>
                <p className="text-body-sm opacity-60">© 2026 AIGrowth Assistant. All rights reserved.</p>
                <p className="text-body-sm text-on-surface-variant font-medium pt-1">
                    Developed by{' '}
                    <a
                        href="https://imrandigitals.online/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold hover:underline inline-flex items-center gap-1 transition-colors"
                    >
                        Imran Digitals
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                </p>
            </div>

            <div className="flex flex-col gap-sm">
                <span className="font-label-md text-label-md font-bold text-on-surface">Platform</span>
                <Link href="/dashboard" className="font-body-sm text-body-sm hover:text-primary transition-all">Dashboard</Link>
                <Link href="/analysis/report" className="font-body-sm text-body-sm hover:text-primary transition-all">Features</Link>
                <Link href="/history" className="font-body-sm text-body-sm hover:text-primary transition-all">Audit History</Link>
            </div>

            <div className="flex flex-col gap-sm">
                <span className="font-label-md text-label-md font-bold text-on-surface">Support & Legal</span>
                <Link href="/settings" className="font-body-sm text-body-sm hover:text-primary transition-all">Settings</Link>
                <Link href="/privacy" className="font-body-sm text-body-sm hover:text-primary transition-all">Privacy Policy</Link>
                <Link href="/terms" className="font-body-sm text-body-sm hover:text-primary transition-all">Terms & Conditions</Link>
            </div>
        </footer>
    );
}
