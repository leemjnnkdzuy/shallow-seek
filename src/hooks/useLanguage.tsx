import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useEffect, useState } from 'react';
import en from '../i18n/en.json';
import vi from '../i18n/vi.json';
import zh from '../i18n/zh.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
      zh: { translation: zh },
    },
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export const useLanguage = () => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguageState] = useState(i18n.language);

  useEffect(() => {
    const loadLang = async () => {
      try {
        const res = await window.electron?.db.getSetting('language');
        if (res?.success && res.value) {
          if (res.value !== i18n.language) {
            i18n.changeLanguage(res.value);
            setCurrentLanguageState(res.value);
          }
        }
      } catch (error) {
        console.error('Failed to load language from DB:', error);
      }
    };
    loadLang();
  }, []);

  useEffect(() => {
    const unsubscribe = window.electron?.windowControls.onLanguageChanged((newLang: string) => {
      if (newLang !== i18n.language) {
        i18n.changeLanguage(newLang);
        setCurrentLanguageState(newLang);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const changeLanguage = async (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguageState(lng);
    localStorage.setItem('language', lng);
    window.electron?.windowControls.notifyLanguageChanged(lng);
    try {
      await window.electron?.db.setSetting('language', lng);
    } catch (error) {
      console.error('Failed to save language to DB:', error);
    }
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
  };
};
