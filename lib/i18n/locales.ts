export type Locale = "fr" | "wo" | "en" | "ar";

export type LocaleInfo = {
  code: Locale;
  label: string;
  short: string;
  flag: string;
  rtl: boolean;
};

export const LOCALES: LocaleInfo[] = [
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷", rtl: false },
  { code: "wo", label: "Wolof", short: "WO", flag: "🇸🇳", rtl: false },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧", rtl: false },
  { code: "ar", label: "العربية", short: "AR", flag: "🇸🇦", rtl: true },
];

export const DEFAULT_LOCALE: Locale = "fr";

export function getLocaleInfo(code: Locale): LocaleInfo {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
