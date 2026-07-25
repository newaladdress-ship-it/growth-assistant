'use client';

import { useState, useEffect } from 'react';

let globalDeferredPrompt = null;
const listeners = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    listeners.forEach((listener) => listener(e));
  });

  window.addEventListener('appinstalled', () => {
    globalDeferredPrompt = null;
    listeners.forEach((listener) => listener(null));
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true)
    ) {
      setIsInstalled(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(userAgent));
    }

    const handler = (prompt) => {
      setDeferredPrompt(prompt);
    };

    listeners.add(handler);
    return () => listeners.delete(handler);
  }, []);

  const installApp = async () => {
    if (isIos) {
      setShowIosTip(true);
      return;
    }

    if (!deferredPrompt) {
      // Fallback hint for standard desktop Chrome / Edge if event hasn't fired or was already captured
      alert('To install AIGrowth on your device, click the Install App icon in your browser address bar (Top Right corner of Chrome/Edge) or select "Install App" from the browser menu.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const isInstallable = !isInstalled;

  return {
    isInstallable,
    isInstalled,
    installApp,
    isIos,
    showIosTip,
    setShowIosTip,
  };
}
