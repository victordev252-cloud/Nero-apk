import en from './locales/en.json';
import so from './locales/so.json';
import ar from './locales/ar.json';

const translations = { en, so, ar };

class I18n {
  constructor() {
    this.lang = 'en';
  }

  setLanguage(lang) {
    if (translations[lang]) {
      this.lang = lang;
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  t(key) {
    const keys = key.split('.');
    let val = translations[this.lang];
    for (const k of keys) {
      val = val?.[k];
    }
    return val || key;
  }
}

export const i18n = new I18n();
