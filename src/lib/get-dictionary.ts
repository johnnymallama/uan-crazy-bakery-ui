import 'server-only';
import type { Locale } from '../../i18n-config';

const dictionaries = {
  en: () => import('@/lib/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/lib/dictionaries/es.json').then((module) => module.default),
};

const orderDictionaries = {
  en: () => import('@/lib/dictionaries/order.json').then((module) => module.default),
  es: () => import('@/lib/dictionaries/order.json').then((module) => module.default),
};

const privacyDictionaries = {
  en: () => import('@/lib/dictionaries/privacy.en.json').then((module) => module.default),
  es: () => import('@/lib/dictionaries/privacy.es.json').then((module) => module.default),
};

const termsDictionaries = {
  en: () => import('@/lib/dictionaries/terms.en.json').then((module) => module.default),
  es: () => import('@/lib/dictionaries/terms.es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const dictionary = await (dictionaries[locale]?.() ?? dictionaries.en());
  const orderDictionary = await (orderDictionaries[locale]?.() ?? orderDictionaries.en());
  const privacyDictionary = await (privacyDictionaries[locale]?.() ?? privacyDictionaries.en());
  const termsDictionary = await (termsDictionaries[locale]?.() ?? termsDictionaries.en());
  return { ...dictionary, ...orderDictionary, ...privacyDictionary, ...termsDictionary };
};