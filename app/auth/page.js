'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useAppState } from '@/lib/appState';
import Footer from '@/components/Footer';

function AuthContent() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginUser, registerUser, user, saveAnalysisToFirestore } = useAuth();
    const { setActiveTargetUrl } = useAppState();
    const router = useRouter();
    const searchParams = useSearchParams();

    const pendingUrl = searchParams.get('pendingUrl') || searchParams.get('url') || '';
    const isRegisterMode = searchParams.get('mode') === 'register' || isSignUp;

    useEffect(() => {
        if (searchParams.get('mode') === 'register') {
            setIsSignUp(true);
        }
    }, [searchParams]);

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            handlePostAuthRedirect();
        }
    }, [user]);

    const redirectPath = searchParams.get('redirect') || '';

    const handlePostAuthRedirect = async () => {
        let urlToAnalyze = pendingUrl;
        if (!urlToAnalyze && typeof window !== 'undefined') {
            urlToAnalyze = localStorage.getItem('pending_url') || '';
        }

        if (urlToAnalyze) {
            setActiveTargetUrl(urlToAnalyze);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('pending_url');
            }
            if (user) {
                await saveAnalysisToFirestore(urlToAnalyze);
            }
            router.push('/analysis/loading');
        } else if (redirectPath) {
            router.push(redirectPath);
        } else {
            router.push('/dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            if (isSignUp) {
                if (!name.trim()) {
                    setError('Please enter your full name');
                    setLoading(false);
                    return;
                }
                await registerUser(email.trim(), password, name.trim());
                setPassword('');
                setIsSignUp(false);
                setSuccessMsg('Account registered successfully! Please log in with your credentials to analyze.');
            } else {
                await loginUser(email.trim(), password);
                await handlePostAuthRedirect();
            }
        } catch (err) {
            let msg = 'Authentication failed. Please try again.';
            if (err.code === 'auth/email-already-in-use') {
                msg = 'An account with this email already exists. Please log in.';
            } else if (err.code === 'auth/invalid-email') {
                msg = 'Please enter a valid email address.';
            } else if (err.code === 'auth/weak-password') {
                msg = 'Password should be at least 6 characters.';
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                msg = 'Invalid email or password.';
            } else {
                console.warn('Auth Error:', err.message || err);
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background text-on-background font-body min-h-screen flex flex-col justify-between">
            {/* Top Navigation */}
            <nav className="w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 h-16">
                <div className="flex justify-between items-center h-full px-gutter max-w-container-max mx-auto">
                    <Link href="/" className="flex items-center gap-base cursor-pointer">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">AIGrowth</span>
                    </Link>
                    <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md">
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex items-center justify-center py-2xl px-gutter">
                <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl p-xl space-y-lg">
                    
                    {/* Header text */}
                    <div className="text-center space-y-xs">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-sm">
                            <span className="material-symbols-outlined text-2xl">lock</span>
                        </div>
                        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
                            {isSignUp ? 'Create your Account' : 'Welcome Back'}
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {isSignUp
                                ? 'Sign up with Firebase to analyze your website and store audit history.'
                                : 'Sign in to access your website growth reports and AI insights.'}
                        </p>
                    </div>

                    {/* Pending URL notification banner */}
                    {pendingUrl && (
                        <div className="p-md rounded-xl bg-primary/10 border border-primary/30 flex items-start gap-md">
                            <span className="material-symbols-outlined text-primary text-xl mt-0.5">travel_explore</span>
                            <div className="text-body-sm text-on-surface">
                                <span className="font-semibold block text-primary">Target Website Queued</span>
                                <span className="break-all font-mono text-xs opacity-90">{pendingUrl}</span>
                            </div>
                        </div>
                    )}

                    {/* Auth Toggle Tabs */}
                    <div className="flex p-1 bg-surface-container-high rounded-xl border border-outline-variant/30">
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(false); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 py-sm rounded-lg font-label-md text-label-md transition-all ${
                                !isSignUp
                                    ? 'bg-white text-on-surface shadow-sm font-semibold'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsSignUp(true); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 py-sm rounded-lg font-label-md text-label-md transition-all ${
                                isSignUp
                                    ? 'bg-white text-on-surface shadow-sm font-semibold'
                                    : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Success Banner */}
                    {successMsg && (
                        <div className="p-md rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 font-medium text-body-sm flex items-center gap-sm">
                            <span className="material-symbols-outlined text-lg text-emerald-600">check_circle</span>
                            <span>{successMsg}</span>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="p-md rounded-xl bg-error/10 border border-error/30 text-error text-body-sm flex items-center gap-sm">
                            <span className="material-symbols-outlined text-lg">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form method="POST" onSubmit={handleSubmit} autoComplete="on" className="space-y-md">
                        {isSignUp && (
                            <div>
                                <label htmlFor="name" className="block text-label-md font-label-md text-on-surface mb-xs">Full Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-md">person</span>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Rivera"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md outline-none"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-label-md font-label-md text-on-surface mb-xs">Email Address</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-md">mail</span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-label-md font-label-md text-on-surface mb-xs">Password</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-md">lock</span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    autoComplete={isSignUp ? "new-password" : "current-password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-sm disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}
                                    <span className="material-symbols-outlined text-md">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-xs">
                        <p className="text-body-sm text-on-surface-variant">
                            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
                            <button
                                type="button"
                                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                className="text-primary font-semibold hover:underline"
                            >
                                {isSignUp ? 'Log In' : 'Register now'}
                            </button>
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">
                <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
