import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'ms' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('parentSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.language) {
          setLanguageState(parsed.language as Language);
        }
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }

    // Listen for storage changes from other tabs/windows or components
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('parentSettings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          if (parsed.language) {
            setLanguageState(parsed.language as Language);
          }
        } catch (e) {
          console.error('Error loading settings:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // Also update localStorage so other components stay in sync
    const savedSettings = localStorage.getItem('parentSettings');
    let settings = { language: lang };
    if (savedSettings) {
      try {
        settings = { ...JSON.parse(savedSettings), language: lang };
      } catch (e) {
        console.error('Error updating settings:', e);
      }
    }
    localStorage.setItem('parentSettings', JSON.stringify(settings));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
