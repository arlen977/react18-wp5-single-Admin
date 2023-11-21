import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Storage from "./storage";
const sotrage = new Storage();

const _resources = {};

const importFn = require.context("../../locales/", false, /\.json$/);

importFn.keys().forEach(item => {
    // 注意: 这里需要 .default才可以找到路径const com = importFn(item).default
    let key = item.slice(2, -5);

    _resources[key] = { translation: importFn(item) };
});

i18n.use(initReactI18next).init({
    resources: _resources,
    // lng: "zh-Hant",
    // fallbackLng: "zh-Hant",
    lng: sotrage.getS("language") ? sotrage.getS("language") : "en",
    fallbackLng: sotrage.getS("language") ? sotrage.getS("language") : "en",

    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
