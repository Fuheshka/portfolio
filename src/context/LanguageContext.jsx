import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('aero_lang');
    if (saved === 'en' || saved === 'ru') return saved;
    // Default to browser language or English
    const browserLang = navigator.language?.toLowerCase();
    return browserLang?.startsWith('ru') ? 'ru' : 'en';
  });

  useEffect(() => {
    localStorage.setItem('aero_lang', lang);
  }, [lang]);

  const setLang = (newLang) => {
    if (newLang === 'en' || newLang === 'ru') {
      setLangState(newLang);
    }
  };

  const t = (key) => {
    if (!key) return '';
    const currentDict = translations[lang] || translations.en;
    if (currentDict[key]) return currentDict[key];
    const fallbackDict = translations.en;
    return fallbackDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
