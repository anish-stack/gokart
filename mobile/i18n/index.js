import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';
import kn from './locales/kn.json';
import te from './locales/te.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  bn: { translation: bn },
  kn: { translation: kn },
  te: { translation: te },
};

const deviceLanguage = Localization.getLocales?.()[0]?.languageCode || 'en';
const initialLanguage = Object.keys(resources).includes(deviceLanguage) ? deviceLanguage : 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

export default i18n;
