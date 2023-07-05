import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
const availbleLanguage = ['en', 'zh', 'ko', 'ja', 'vi', 'fil', 'ms', 'hi', 'id']
const option = {
  order: ['naviagtor', 'htmlTag', 'path', 'subdomail'],
  checkWhitelist: true
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    fallbackLng: 'en',
    lng: window.localStorage.getItem('language')|| 'en',
    debug: true,
    whitelist: availbleLanguage,
    detection: option,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });


export default i18n;