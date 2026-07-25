'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc,
    getDocs
} from 'firebase/firestore';
import { auth, secondaryAuth, db } from './firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUserProfile(userSnap.data());
                    } else {
                        const initialProfile = {
                            uid: currentUser.uid,
                            email: currentUser.email,
                            displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
                            plan: 'Starter Free',
                            createdAt: new Date().toISOString(),
                            lastLogin: new Date().toISOString()
                        };
                        await setDoc(userRef, initialProfile);
                        setUserProfile(initialProfile);
                    }
                } catch (err) {
                    console.error('Error fetching user profile from Firestore:', err);
                }
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Register a new user without logging into main auth state
    const registerUser = async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const createdUser = userCredential.user;

        if (name) {
            await updateProfile(createdUser, { displayName: name });
        }

        // Defer Firestore user document creation to first login via onAuthStateChanged
        // to avoid unauthenticated permission errors on secondaryAuth instance
        await signOut(secondaryAuth);
        return createdUser;
    };

    // Log in existing user
    const loginUser = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const loggedInUser = userCredential.user;

        try {
            const userRef = doc(db, 'users', loggedInUser.uid);
            await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserProfile(userSnap.data());
            }
        } catch (err) {
            console.warn('Firestore profile sync warning:', err?.message);
        }

        return loggedInUser;
    };

    // Logout user
    const logoutUser = async () => {
        await signOut(auth);
        setUser(null);
        setUserProfile(null);
    };

    // Update profile (name, photo) in Firebase Auth and Firestore
    const updateUserProfile = async ({ displayName, photoURL }) => {
        const activeUser = auth.currentUser || user;
        if (!activeUser) return;

        const updates = {};
        if (displayName !== undefined) updates.displayName = displayName;
        if (photoURL !== undefined) updates.photoURL = photoURL;

        // Update Firebase Auth user
        await updateProfile(activeUser, updates);

        // Update Firestore user document
        try {
            const userRef = doc(db, 'users', activeUser.uid);
            await setDoc(userRef, updates, { merge: true });
        } catch (err) {
            console.warn('Firestore profile update warning:', err?.message);
        }

        // Update local context profile state
        setUserProfile(prev => ({
            ...prev,
            ...updates
        }));
    };

    // Save website analysis record to Firestore
    const saveAnalysisToFirestore = async (url, reportData = {}) => {
        const activeUser = auth.currentUser || user;
        if (!activeUser) return null;

        try {
            const analysisRef = collection(db, 'users', activeUser.uid, 'analyses');
            const cleanDomain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
            const newAnalysis = {
                url,
                domain: cleanDomain,
                createdAt: new Date().toISOString(),
                status: 'Completed',
                report: reportData
            };
            const docRef = await addDoc(analysisRef, newAnalysis);
            return { id: docRef.id, ...newAnalysis };
        } catch (error) {
            console.warn('Firestore analysis save warning:', error?.message);
            return null;
        }
    };

    // Fetch user analyses history from Firestore
    const getUserAnalyses = async () => {
        const activeUser = auth.currentUser || user;
        if (!activeUser) return [];
        try {
            const analysisRef = collection(db, 'users', activeUser.uid, 'analyses');
            const snapshot = await getDocs(analysisRef);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (error) {
            console.error('Error fetching user analyses from Firestore:', error);
            return [];
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading,
            registerUser,
            loginUser,
            logoutUser,
            updateUserProfile,
            saveAnalysisToFirestore,
            getUserAnalyses
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
