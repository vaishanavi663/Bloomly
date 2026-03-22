'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { AuthModal } from '@/components/AuthModal';
import { CrisisModal } from '@/components/CrisisModal';
import { usePathname, useRouter } from 'next/navigation';

interface AppContextType {
  userSession: any;
  setUserSession: React.Dispatch<React.SetStateAction<any>>;
  showAuthModal: boolean;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCrisisModal: boolean;
  setShowCrisisModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentMood: string;
  setCurrentMood: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: (session: any) => void;
  handleCrisisDetected: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userSession, setUserSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [currentMood, setCurrentMood] = useState('neutral');
  const pathname = usePathname();
  const router = useRouter();
  
  const handleLogin = (session: any) => {
    setUserSession(session);
    setShowAuthModal(false);
  };

  const handleCrisisDetected = () => {
    setShowCrisisModal(true);
  };

  const protectedPages = ['/chat', '/voice', '/mood', '/circles', '/challenges', '/relax', '/gratitude', '/sleep', '/recommendations'];

  useEffect(() => {
    if (protectedPages.includes(pathname) && !userSession) {
      setShowAuthModal(true);
      router.push('/');
    }
  }, [pathname, userSession, router]);

  const value = {
    userSession,
    setUserSession,
    showAuthModal,
    setShowAuthModal,
    showCrisisModal,
    setShowCrisisModal,
    currentMood,
    setCurrentMood,
    handleLogin,
    handleCrisisDetected
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      <CrisisModal 
        isOpen={showCrisisModal} 
        onClose={() => setShowCrisisModal(false)} 
      />
    </AppContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AppProvider');
  }
  return context;
}
