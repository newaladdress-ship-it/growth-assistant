'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEYS = {
    HISTORY: 'aigrowth_history',
    ACTIVE_URL: 'aigrowth_active_url',
    ACTIVE_REPORT: 'aigrowth_active_report',
    PROFILE: 'aigrowth_user_profile',
    API_KEYS: 'aigrowth_api_keys',
    THEME: 'aigrowth_theme'
};

const DEFAULT_REPORTS = [];

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
    const [history, setHistoryState] = useState([]);
    const [activeTargetUrl, setActiveTargetUrlState] = useState('https://stellarflow.io');
    const [activeReport, setActiveReportState] = useState(DEFAULT_REPORTS[0]);
    const [userProfile, setUserProfileState] = useState({ name: 'Alex Rivera', email: 'alex.rivera@aigrowth.ai', plan: 'Premium Plan' });
    const [apiKeys, setApiKeysState] = useState([
        { id: 'key-1', name: 'Production Analytics', key: 'ag_prod_••••••••••••x7q2', lastUsed: '2h ago' },
        { id: 'key-2', name: 'Staging Environment', key: 'ag_stg_••••••••••••k9v1', lastUsed: 'Never used' }
    ]);
    const [theme, setThemeState] = useState('light');

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Load History
        const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
        if (storedHistory) {
            try { setHistoryState(JSON.parse(storedHistory)); } catch(e) { setHistoryState(DEFAULT_REPORTS); }
        } else {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(DEFAULT_REPORTS));
            setHistoryState(DEFAULT_REPORTS);
        }

        // Load Active Target URL
        const storedUrl = localStorage.getItem(STORAGE_KEYS.ACTIVE_URL);
        if (storedUrl) setActiveTargetUrlState(storedUrl);

        // Load Active Report
        const storedReport = localStorage.getItem(STORAGE_KEYS.ACTIVE_REPORT);
        if (storedReport) {
            try { setActiveReportState(JSON.parse(storedReport)); } catch(e) {}
        } else {
            setActiveReportState(DEFAULT_REPORTS[0]);
        }

        // Load User Profile
        const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (storedProfile) {
            try { setUserProfileState(JSON.parse(storedProfile)); } catch(e) {}
        }

        // Load API Keys
        const storedKeys = localStorage.getItem(STORAGE_KEYS.API_KEYS);
        if (storedKeys) {
            try { setApiKeysState(JSON.parse(storedKeys)); } catch(e) {}
        }

        // Load Theme
        const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        setThemeState(storedTheme);
        applyThemeClass(storedTheme);
    }, []);

    const applyThemeClass = (t) => {
        if (typeof document === 'undefined') return;
        if (t === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    };

    const setTheme = (t) => {
        setThemeState(t);
        localStorage.setItem(STORAGE_KEYS.THEME, t);
        applyThemeClass(t);
    };

    const setActiveTargetUrl = (url) => {
        setActiveTargetUrlState(url);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_URL, url);
    };

    const setActiveReport = (report) => {
        setActiveReportState(report);
        localStorage.setItem(STORAGE_KEYS.ACTIVE_REPORT, JSON.stringify(report));
    };

    const saveReport = (report) => {
        setHistoryState(prev => {
            const index = prev.findIndex(r => r.id === report.id || r.domain === report.domain);
            let updated;
            if (index >= 0) {
                updated = [...prev];
                updated[index] = report;
            } else {
                updated = [report, ...prev];
            }
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
            return updated;
        });
        setActiveReport(report);
    };

    const deleteReport = (id) => {
        setHistoryState(prev => {
            const updated = prev.filter(r => r.id !== id);
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
            return updated;
        });
    };

    const setUserProfile = (profile) => {
        setUserProfileState(profile);
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    };

    const addApiKey = (name) => {
        const randomHex = Math.random().toString(36).substring(2, 10);
        const newKey = {
            id: 'key-' + Date.now(),
            name: name || 'New API Key',
            key: `ag_live_••••••••••••${randomHex}`,
            lastUsed: 'Just created'
        };
        setApiKeysState(prev => {
            const updated = [newKey, ...prev];
            localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(updated));
            return updated;
        });
        return newKey;
    };

    const deleteApiKey = (id) => {
        setApiKeysState(prev => {
            const updated = prev.filter(k => k.id !== id);
            localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AppStateContext.Provider value={{
            history,
            activeTargetUrl,
            activeReport,
            userProfile,
            apiKeys,
            theme,
            setTheme,
            setActiveTargetUrl,
            setActiveReport,
            saveReport,
            deleteReport,
            setUserProfile,
            addApiKey,
            deleteApiKey
        }}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    return useContext(AppStateContext);
}
