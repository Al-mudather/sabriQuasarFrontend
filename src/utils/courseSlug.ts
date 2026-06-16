// Arabic -> Latin transliteration so a fully-Arabic course title produces a
// readable, unique slug rather than a generic fallback. Covers the 28 letters
// plus common alef/hamza variants and taa-marbuta; Eastern-Arabic digits fold
// to ASCII. Diacritics (harakat), the superscript alef and tatweel are stripped
// before lookup. Approximate, romanisation-only — this segment is cosmetic.
const ARABIC_TRANSLIT: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'a', 'آ': 'a', 'ٱ': 'a',
  'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'ة': 'h', 'و': 'w', 'ي': 'y', 'ى': 'y',
  'ء': '', 'ؤ': '', 'ئ': '',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
}

function transliterateArabic (text: string): string {
  // Strip harakat (U+064B–U+0652), superscript alef (U+0670) and tatweel (U+0640).
  const stripped = text.replace(/[ً-ْٰـ]/g, '')
  let out = ''
  for (const ch of stripped) out += ARABIC_TRANSLIT[ch] ?? ch
  return out
}

// Short, ASCII-only slug for the cosmetic :name segment of a course URL.
//
// The :name segment is purely decorative — loadCourse() resolves the course
// off :code/:pk/:id and never reads params.name — so we shrink it aggressively.
// encodeURIComponent on an Arabic title produced a wall of "%D8%A7%D9%84…"
// (≈9 chars per Arabic letter), which is what made shared links enormous. We
// transliterate Arabic to Latin first, then keep only Latin letters/digits and
// collapse other runs into a single '+'. Pure-symbol titles fall back to
// "course". Old long links keep resolving since the segment is ignored on load.
//
//   "MRCS PART A COURSE"  -> "MRCS+PART+A+COURSE"
//   "مختبرات - الكورس..." -> "mkhtbrat+alkwrs+..."
export function courseSlug (title: string): string {
  const slug = transliterateArabic(title ?? '')
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9]+/g, '+') // non-Latin/non-digit runs -> single '+'
    .replace(/^\++|\++$/g, '')      // trim leading/trailing '+'
  return slug || 'course'
}
