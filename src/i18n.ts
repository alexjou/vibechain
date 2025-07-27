import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';
import translationES from './locales/es/translation.json';
import connectWalletEN from './locales/en/connect_wallet.json';
import connectWalletPT from './locales/pt/connect_wallet.json';
import connectWalletES from './locales/es/connect_wallet.json';

const resources = {
  en: { translation: { ...translationEN, ...connectWalletEN } },
  pt: { translation: { ...translationPT, ...connectWalletPT } },
  es: { translation: { ...translationES, ...connectWalletES } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
