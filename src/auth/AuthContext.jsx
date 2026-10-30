import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../shared/data/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [shopProfile, setShopProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load shop profile from Firestore
  const fetchShopProfile = async (uid) => {
    try {
      if (!isFirebaseConfigured) return null;
      const ref = doc(db, 'shops', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setShopProfile(data);
        return data;
      }
      setShopProfile(null);
      return null;
    } catch (err) {
      console.error('Error fetching shop profile:', err);
      return null;
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchShopProfile(user.uid);
      } else {
        setShopProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    if (!isFirebaseConfigured) {
      // Preview mode fallback
      const mockUser = { uid: 'demo_user_1', email };
      setCurrentUser(mockUser);
      setShopProfile({
        shopName: 'Rahima Store',
        ownerName: 'Md. Rahima',
        phone: '01700000000',
      });
      return mockUser;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await fetchShopProfile(cred.user.uid);
      return cred.user;
    } catch (err) {
      let msg = 'Failed to sign in. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Network error. Please check your internet connection.';
      }
      throw new Error(msg);
    }
  };

  const register = async (email, password) => {
    if (!isFirebaseConfigured) {
      const mockUser = { uid: 'demo_user_1', email };
      setCurrentUser(mockUser);
      return mockUser;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return cred.user;
    } catch (err) {
      let msg = 'Registration failed.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.';
      }
      throw new Error(msg);
    }
  };

  const saveShopProfile = async (profile) => {
    if (!currentUser) throw new Error('You must be signed in to set up a shop.');

    const data = {
      shopName: profile.shopName,
      ownerName: profile.ownerName,
      phone: profile.phone,
      createdAt: serverTimestamp(),
      demoLoaded: false,
    };

    if (isFirebaseConfigured) {
      const ref = doc(db, 'shops', currentUser.uid);
      await setDoc(ref, data, { merge: true });
    }

    setShopProfile(data);
    return data;
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setShopProfile(null);
  };

  const value = {
    currentUser,
    shopProfile,
    loading,
    isFirebaseConfigured,
    login,
    register,
    logout,
    saveShopProfile,
    refreshProfile: () => currentUser && fetchShopProfile(currentUser.uid),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
