"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAppConfig, AppConfig } from './config-parser';

type TranslationKeys = string;
type Translations = Record<string, Record<string, string>>;

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: TranslationKeys, fallback?: string) => string;
  availableLanguages: string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children, config }: { children: React.ReactNode, config: AppConfig }) {
  const [language, setLanguage] = useState<string>(config.language || 'en');
  const translations: Translations = config.translations || {};
  const availableLanguages = Object.keys(translations).length > 0 ? Object.keys(translations) : ['en'];

  const t = (key: string, fallback?: string) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    // Fallback to English if not found
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return fallback || key;
  };

  // Hydration sync
  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang && availableLanguages.includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, [availableLanguages]);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('app_lang', lang);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t, availableLanguages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}
