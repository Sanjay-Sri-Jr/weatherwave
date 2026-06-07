const DEFAULT_FALLBACK = 'UTC';

const IANA_ABBREVIATION_OVERRIDES = {
  'Asia/Kolkata': 'IST',
  'Asia/Calcutta': 'IST',
  UTC: 'UTC',
  'Etc/UTC': 'UTC',
  'Etc/GMT': 'GMT',
};

const isReadableAbbreviation = (value) => /^[A-Z]{2,6}$/.test(value);

const toAcronym = (value) => {
  if (!value) return null;

  const words = value
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z]/g, ''))
    .filter(Boolean);

  if (!words.length) return null;

  return words.map((word) => word[0].toUpperCase()).join('');
};

export function getTimezoneAbbreviation(timeZone, options = {}) {
  const { date = new Date(), fallback = DEFAULT_FALLBACK } = options;

  if (typeof timeZone !== 'string' || !timeZone.trim()) {
    return fallback;
  }

  const normalizedTimeZone = timeZone.trim();

  try {
    const shortParts = new Intl.DateTimeFormat('en-US', {
      timeZone: normalizedTimeZone,
      timeZoneName: 'short',
      hour: 'numeric',
    }).formatToParts(date);

    const shortName = shortParts.find((part) => part.type === 'timeZoneName')?.value ?? '';

    if (isReadableAbbreviation(shortName)) {
      return shortName;
    }

    const longParts = new Intl.DateTimeFormat('en-US', {
      timeZone: normalizedTimeZone,
      timeZoneName: 'long',
      hour: 'numeric',
    }).formatToParts(date);

    const longName = longParts.find((part) => part.type === 'timeZoneName')?.value ?? '';

    return (
      IANA_ABBREVIATION_OVERRIDES[normalizedTimeZone] ??
      toAcronym(longName) ??
      shortName ??
      fallback
    );
  } catch {
    return IANA_ABBREVIATION_OVERRIDES[normalizedTimeZone] ?? fallback;
  }
}