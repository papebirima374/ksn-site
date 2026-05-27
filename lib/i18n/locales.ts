export type Locale = "fr" | "wo" | "en" | "ar" | "it" | "es";

export type LocaleInfo = {
  code: Locale;
  label: string;
  short: string;
  flag: string;
  rtl: boolean;
  disabled?: boolean; // si true: visible dans le picker mais désactivé
  comingSoon?: boolean; // si true: tag "Bientôt"
};

export const LOCALES: LocaleInfo[] = [
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷", rtl: false },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧", rtl: false },
  { code: "ar", label: "العربية", short: "AR", flag: "🇸🇦", rtl: true },
  { code: "it", label: "Italiano", short: "IT", flag: "🇮🇹", rtl: false },
  { code: "es", label: "Español", short: "ES", flag: "🇪🇸", rtl: false },
  { code: "wo", label: "Wolof", short: "WO", flag: "🇸🇳", rtl: false, disabled: true, comingSoon: true },
];

export const ACTIVE_LOCALES = LOCALES.filter((l) => !l.disabled);

export const DEFAULT_LOCALE: Locale = "fr";

export function getLocaleInfo(code: Locale): LocaleInfo {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}
