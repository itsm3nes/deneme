import tr, { type Dictionary } from "./dictionaries/tr";
import en from "./dictionaries/en";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function resolveLocale(locale: string | undefined): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

export function getDictionary(locale: string | undefined): Dictionary {
  return dictionaries[resolveLocale(locale)];
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export type { Dictionary };
export * from "./config";
