'use client';

import React, { useState } from 'react';
import { usePWAInstall } from '@/lib/usePWAInstall';

export default function InstallPWA() {
  const { isInstalled, isInstallable, installApp, isIos, showIosTip, setShowIosTip } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <>
      {/* Floating Install Prompt Banner */}
      <div className="fixed bottom-6 right-6 z-50 max-w-md bg-surface-container-highest/95 backdrop-blur-md border border-primary/30 p-4 rounded-2xl shadow-2xl transition-all duration-300 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-on-primary shadow-md flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">download</span>
          </div>
          <div>
            <h4 className="font-label-md text-label-md font-bold text-on-surface">Install AIGrowth App</h4>
            <p className="text-xs text-on-surface-variant">Install on Android, Mac, Windows & iOS for offline access</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={installApp}
            className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-semibold shadow-md active:scale-95 transition-all whitespace-nowrap cursor-pointer"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            aria-label="Dismiss install prompt"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* iOS Instructions Modal */}
      {showIosTip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-highest border border-outline-variant/30 max-w-sm w-full rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 text-primary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">ios_share</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">Install on iOS Safari</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Tap the <span className="font-bold text-primary">Share</span> icon at the bottom of Safari, then select <span className="font-bold text-primary font-semibold">"Add to Home Screen"</span> to install AIGrowth as a native app.
            </p>
            <button
              onClick={() => setShowIosTip(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
