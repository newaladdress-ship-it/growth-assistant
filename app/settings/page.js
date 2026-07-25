'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAppState } from '@/lib/appState';
import { useAuth } from '@/lib/authContext';

export default function SettingsPage() {
    const {
        theme,
        setTheme,
        apiKeys,
        addApiKey,
        deleteApiKey
    } = useAppState();

    const { user, userProfile, updateUserProfile } = useAuth();

    const [nameInput, setNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [photoPreview, setPhotoPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const currentName = userProfile?.displayName || user?.displayName || '';
        const currentEmail = userProfile?.email || user?.email || '';
        const currentPhoto = userProfile?.photoURL || user?.photoURL || '';

        setNameInput(currentName);
        setEmailInput(currentEmail);
        setPhotoPreview(currentPhoto);
    }, [user, userProfile]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Please select an image smaller than 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!nameInput.trim()) {
            alert('Please enter a valid display name.');
            return;
        }

        setSaving(true);
        try {
            await updateUserProfile({
                displayName: nameInput.trim(),
                photoURL: photoPreview
            });
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleGenerateKey = () => {
        const keyName = prompt('Enter a name for your new API Key:', 'Integration API Key');
        if (keyName) {
            addApiKey(keyName);
        }
    };

    const handleCopyKey = (keyStr) => {
        navigator.clipboard.writeText(keyStr).then(() => {
            alert('API Key copied to clipboard!');
        });
    };

    const handleDeleteKey = (id) => {
        if (confirm('Are you sure you want to delete this API Key?')) {
            deleteApiKey(id);
        }
    };

    const initials = nameInput
        ? nameInput.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="bg-background text-on-background font-body min-h-screen pb-32">
            <Sidebar />

            <main className="md:ml-[280px] min-h-screen flex flex-col">
                <Header title="Settings" showSearch={false} />

                <div className="max-w-[800px] mx-auto px-lg mt-xl space-y-2xl w-full flex-1">
                    {/* Section: Account & Profile */}
                    <section className="space-y-lg">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-md">
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Account Profile</h3>
                                <p className="text-on-surface-variant font-body-sm text-body-sm">Manage your profile picture, display name, and account email.</p>
                            </div>
                        </div>

                        {/* Photo Upload Row */}
                        <div className="flex items-center gap-xl p-md bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-primary/20 text-primary font-bold text-xl flex items-center justify-center border-2 border-primary/30">
                                        {initials}
                                    </div>
                                )}
                                <div className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="space-y-xs">
                                <h4 className="font-label-md text-label-md font-bold text-on-surface">Profile Photo</h4>
                                <p className="text-body-sm text-on-surface-variant">Click to upload a new picture (PNG, JPG, or GIF up to 2MB).</p>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-primary font-semibold text-label-sm hover:underline"
                                >
                                    Upload Photo
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                            <div className="space-y-sm">
                                <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-bold">Display Name</label>
                                <input
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-2xl px-md py-3 text-body-md focus:border-primary transition-all shadow-sm outline-none text-on-surface"
                                    placeholder="Your name"
                                    type="text"
                                />
                            </div>
                            <div className="space-y-sm">
                                <label className="font-label-md text-label-md text-on-surface-variant ml-1 font-bold">Email Address</label>
                                <input
                                    value={emailInput}
                                    disabled
                                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-2xl px-md py-3 text-body-md text-outline cursor-not-allowed outline-none"
                                    placeholder="name@example.com"
                                    type="email"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: Preferences */}
                    <section className="space-y-lg pt-xl border-t border-outline-variant/20">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-md">
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Preferences</h3>
                                <p className="text-on-surface-variant font-body-sm text-body-sm">Customize your dashboard experience and visual theme.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-lg bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm">
                            <div className="flex items-center gap-md">
                                <span className="material-symbols-outlined text-primary">dark_mode</span>
                                <div>
                                    <p className="font-label-md text-label-md font-bold text-on-surface">Theme Mode</p>
                                    <p className="text-body-sm text-on-surface-variant">Switch between light and dark visual interfaces.</p>
                                </div>
                            </div>
                            <div className="flex bg-surface-container rounded-full p-1 border border-outline-variant/20">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`px-lg py-2 rounded-full text-label-sm font-bold transition-all cursor-pointer ${theme === 'light' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}
                                >
                                    Light
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`px-lg py-2 rounded-full text-label-sm font-bold transition-all cursor-pointer ${theme === 'dark' ? 'bg-surface shadow-sm text-primary' : 'text-on-surface-variant'}`}
                                >
                                    Dark
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Section: API Keys */}
                    <section className="space-y-lg pt-xl border-t border-outline-variant/20">
                        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-md">
                            <div>
                                <h3 className="font-headline-md text-headline-md text-on-surface font-bold">API Keys</h3>
                                <p className="text-on-surface-variant font-body-sm text-body-sm">Access tokens for third-party integrations and custom automations.</p>
                            </div>
                            <button onClick={handleGenerateKey} className="flex items-center gap-2 bg-primary text-on-primary px-lg py-2 rounded-lg text-label-sm font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer">
                                <span className="material-symbols-outlined !text-[18px]">add</span>
                                New Key
                            </button>
                        </div>
                        <div className="space-y-md">
                            {apiKeys.length === 0 ? (
                                <div className="p-lg bg-surface-container-lowest border rounded-2xl text-center text-on-surface-variant">No API keys generated yet.</div>
                            ) : (
                                apiKeys.map((k) => (
                                    <div key={k.id} className="p-lg bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm flex items-center justify-between">
                                        <div className="space-y-xs">
                                            <p className="font-label-md text-label-md font-bold text-on-surface">{k.name}</p>
                                            <div className="flex items-center gap-md">
                                                <code className="bg-surface-container px-2 py-1 rounded text-[12px] text-primary font-mono">{k.key}</code>
                                                <span className="text-[12px] text-on-surface-variant italic">Last used: {k.lastUsed}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-sm">
                                            <button onClick={() => handleCopyKey(k.key)} className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer" title="Copy Key">
                                                <span className="material-symbols-outlined !text-[20px]">content_copy</span>
                                            </button>
                                            <button onClick={() => handleDeleteKey(k.id)} className="p-2 hover:bg-surface-container rounded-full text-error cursor-pointer" title="Delete Key">
                                                <span className="material-symbols-outlined !text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                {/* Sticky Footer Actions */}
                <div className="fixed bottom-0 left-0 md:left-[280px] right-0 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 p-lg shadow-lg z-30">
                    <div className="max-w-[800px] mx-auto flex justify-between items-center">
                        <p className="text-body-sm text-on-surface-variant font-medium hidden sm:block">Changes saved directly to Firebase & Firestore</p>
                        <div className="flex gap-md w-full sm:w-auto">
                            <button
                                onClick={() => {
                                    setNameInput(userProfile?.displayName || user?.displayName || '');
                                    setPhotoPreview(userProfile?.photoURL || user?.photoURL || '');
                                }}
                                className="flex-1 sm:flex-none border border-outline-variant/50 text-on-surface-variant px-2xl py-3 rounded-2xl text-label-md font-bold hover:bg-surface-container transition-all cursor-pointer"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="flex-1 sm:flex-none bg-primary text-on-primary px-2xl py-3 rounded-2xl text-label-md font-bold hover:opacity-90 active:scale-95 shadow-lg shadow-primary/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <Footer />
            </main>
        </div>
    );
}
