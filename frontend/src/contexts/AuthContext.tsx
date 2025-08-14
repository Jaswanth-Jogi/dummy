'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
  loading: boolean;
  backendStatus: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string>('⏳ Checking...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔄 onAuthStateChanged triggered for:', firebaseUser?.email);

      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setToken(token);

        // Call backend login endpoint
        if (token) {
          try {
            console.log('🔄 Calling backend login endpoint...');
            const response = await fetch('http://localhost:3001/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ token }),
            });

            const result = await response.json();
            if (result.success) {
              console.log('✅ Backend login successful:', result.message);
              setBackendStatus('✅ Backend connected');
            } else {
              console.log('❌ Backend login failed:', result.message);
              setBackendStatus('❌ Backend connection failed');
            }
          } catch (error) {
            console.error('❌ Error calling backend:', error);
            setBackendStatus('❌ Backend connection failed');
          }
        }
      } else {
        setToken(null);
        setBackendStatus('⏳ Not connected');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    // User will be set by onAuthStateChanged
  };

  const logout = async () => {
    await signOut(auth);
    setToken(null);
    setBackendStatus('⏳ Not connected');
  };

  const sendEmailVerification = async () => {
    if (!user) throw new Error('No user logged in');
    const result = await authService.sendEmailVerification(user);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    if (!user || !token) return false;
    const result = await authService.checkEmailVerification(user.uid, token);
    return result.success && result.emailVerified;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      sendEmailVerification, 
      checkEmailVerification, 
      loading, 
      backendStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
