import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map ISO 639-1 language codes to ISO 3166-1 country codes
// This is a simplified mapping - some languages may be spoken in multiple countries
export function getCountryCode(languageCode: string): string {
  const languageToCountry: Record<string, string> = {
    en: "GB", // English -> United Kingdom
    es: "ES", // Spanish -> Spain
    fr: "FR", // French -> France
    de: "DE", // German -> Germany
    it: "IT", // Italian -> Italy
    pt: "PT", // Portuguese -> Portugal
    ru: "RU", // Russian -> Russia
    ja: "JP", // Japanese -> Japan
    ko: "KR", // Korean -> South Korea
    zh: "CN", // Chinese -> China
    ar: "SA", // Arabic -> Saudi Arabia
    hi: "IN", // Hindi -> India
    tr: "TR", // Turkish -> Turkey
    nl: "NL", // Dutch -> Netherlands
    pl: "PL", // Polish -> Poland
    vi: "VN", // Vietnamese -> Vietnam
    th: "TH", // Thai -> Thailand
    sv: "SE", // Swedish -> Sweden
    da: "DK", // Danish -> Denmark
    fi: "FI", // Finnish -> Finland
    el: "GR", // Greek -> Greece
    cs: "CZ", // Czech -> Czech Republic
    ro: "RO", // Romanian -> Romania
    hu: "HU", // Hungarian -> Hungary
    he: "IL", // Hebrew -> Israel
    id: "ID", // Indonesian -> Indonesia
    ms: "MY", // Malay -> Malaysia
    uk: "UA", // Ukrainian -> Ukraine
    bn: "BD", // Bengali -> Bangladesh
    fa: "IR", // Persian -> Iran
  };

  return languageToCountry[languageCode.toLowerCase()] || "US";
}
