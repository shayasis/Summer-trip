export type Weather = 'must' | 'pref' | 'any';

export interface Slot {
  when: string;
  what: string;
  note?: string;
}

export interface Day {
  n: number;
  date: string; // d.m
  weekday: string;
  base: 'flachau' | 'kaprun';
  title: string;
  place: string;
  image: string;
  weather?: { level: Weather; label: string };
  flexible?: boolean;
  slots: Slot[];
  tip?: { label: string; text: string };
}

export interface Flight {
  number: string;
  date: string;
  from: { city: string; code: string; terminal: string; time: string };
  to: { city: string; code: string; terminal: string; time: string; nextDay?: boolean };
  duration: string;
}

export interface Hotel {
  base: 'flachau' | 'kaprun';
  town: string;
  name: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  mapQuery: string;
  image: string;
}

export const DEPARTURE = new Date('2027-08-03T06:00:00+03:00');

export const FLIGHTS: Flight[] = [
  {
    number: 'LY353',
    date: 'שלישי 3.8.2027',
    from: { city: 'תל אביב', code: 'TLV', terminal: '3', time: '06:00' },
    to: { city: 'מינכן', code: 'MUC', terminal: '1', time: '09:05' },
    duration: '4:05 שעות',
  },
  {
    number: 'LY352',
    date: 'חמישי 12.8.2027',
    from: { city: 'מינכן', code: 'MUC', terminal: '1', time: '20:00' },
    to: { city: 'תל אביב', code: 'TLV', terminal: '3', time: '00:45', nextDay: true },
    duration: '3:45 שעות',
  },
];

export const HOTELS: Hotel[] = [
  {
    base: 'flachau',
    town: 'פלאכו',
    name: 'Hotel Pongauerhof',
    checkIn: '3.8',
    checkOut: '7.8',
    nights: 4,
    mapQuery: 'Hotel Pongauerhof Flachau',
    image: 'img/hotel-flachau.jpg',
  },
  {
    base: 'kaprun',
    town: 'קפרון',
    name: 'Carpe Solem Kaprun Apartments by ALPS RESORTS',
    checkIn: '7.8',
    checkOut: '12.8',
    nights: 5,
    mapQuery: 'Carpe Solem Kaprun Apartments',
    image: 'img/hotel-kaprun.jpg',
  },
];

export const CAR = {
  company: 'Europcar',
  car: 'Skoda Superb Combi או דומה',
  carNote: 'סטיישן, גיר אוטומטי (קטגוריה SWAR)',
  pickup: { date: 'שלישי 3.8', time: '10:00' },
  dropoff: { date: 'שישי 13.8 (לפי השובר)', time: '10:00' },
  location: 'שדה התעופה מינכן · Airport Center (Terminalstraße Mitte), קומה 3',
  mapQuery: 'Europcar Munich Airport Terminalstrasse Mitte Airportcenter',
  bring: [
    'שובר ההשכרה',
    'דרכון',
    'רישיון נהיגה ישראלי (כרטיס פלסטיק)',
    'רישיון נהיגה בינלאומי (מוציאים בחנויות אופטיקה)',
    'כרטיס אשראי בינלאומי על שם הנהג הראשי, עם מסגרת פנויה לפיקדון. לא דיינרס ולא דיירקט',
  ],
  included: [
    'קילומטראז\' בלתי מוגבל',
    'ביטול השתתפות עצמית (Premium protection)',
    'ביטוח תאונות אישיות וכיסוי בסיסי',
    'נהג נוסף אחד ללא תשלום',
    'צמיגי חורף, אגרות ומיסים',
    'אישור מעבר לאוסטריה',
  ],
  payAtPickup: [
    { what: 'תוספת מעבר גבול לאוסטריה', price: '39.66 €' },
    { what: 'נהג נוסף (מעבר לראשון)', price: '11.45 € ליום, עד 83.90 €' },
    { what: 'נהג צעיר, מתחת לגיל 23', price: '11.90 € ליום, עד 59.50 €' },
    { what: 'כיסא בטיחות / בוסטר לילד', price: '14.17 € ליום, עד 73.49 €' },
    { what: 'GPS', price: '10.50 € ליום, עד 126 €' },
  ],
  rules: [
    'פיקדון בכרטיס אשראי: כ-400 € לרכב רגיל (עד 2,500 € לרכבים מיוחדים). רק Visa, MasterCard, Amex או Diners',
    'הביטוח לא מכסה נזק לצמיגים, לשמשות, לגג ולתחתית הרכב, וגם לא אובדן מפתח',
    'דמי טיפול בנזק: 95 €. דמי טיפול בדוח חניה או תנועה: 45 € בנוסף לקנס',
    'אסור לצאת למדינה שלא אושרה מראש. קנס של 500 € (אוסטריה מאושרת)',
    'ביטול חינם עד 48 שעות לפני האיסוף. אחר כך 45 € + מע"מ. אי-הגעה: 95 € + מע"מ',
    'אין צורך לחתום על ביטוחים נוספים בדלפק',
  ],
};

export const DAYS: Day[] = [
  {
    n: 1, date: '3.8', weekday: 'שלישי', base: 'flachau', place: 'מינכן ← פלאכו',
    title: 'נחיתה והגעה לפלאכו', image: 'img/d1.jpg',
    slots: [
      { when: '09:05', what: 'נחיתה במינכן (LY353, טרמינל 1).' },
      { when: '10:00', what: 'איסוף הרכבים מ-Europcar ב-Airport Center, קומה 3. ייקח בערך שעה.', note: 'לשלם בדלפק את תוספת מעבר הגבול לאוסטריה (39.66 €).' },
      { when: '10:30–13:30', what: 'נסיעה לפלאכו (כ-2.5 שעות).', note: 'עצירה בתחנת דלק לפני הגבול לקניית ויניטה, אם לא נקנתה מראש.' },
      { when: 'צהריים', what: "ארוחה וצ'ק-אין ב-Hotel Pongauerhof." },
      { when: '16:00', what: 'מגלשת ההרים Lucky Flitzer בפלאכו.', note: 'לבדוק שעות פתיחה.' },
      { when: 'ערב', what: 'סופרמרקט וארוחת ערב משותפת.' },
    ],
    tip: { label: 'שימו לב', text: 'הסופרים נסגרים מוקדם יחסית, בערך ב-19:00–20:00.' },
  },
  {
    n: 2, date: '4.8', weekday: 'רביעי', base: 'flachau', place: 'רמזאו · אלטנמרקט',
    title: 'ריטיסברג וטרמה אמדה', image: 'img/d2.jpg',
    weather: { level: 'pref', label: 'צריך מזג אוויר טוב' },
    slots: [
      { when: 'בוקר', what: 'נסיעה לרמזאו (כ-40 דקות) והר ההרפתקאות Rittisberg: מגלשת הרים, פארק חבלים, מסלול יחפים ומתחמי משחק.' },
      { when: 'צהריים', what: 'ארוחה בבקתה על ההר.' },
      { when: 'אחה"צ', what: 'מרחצאות Therme Amadé באלטנמרקט, דקות מפלאכו: בריכת גלים, מגלשות ומקפצות.' },
      { when: 'ערב', what: 'פלאכו.' },
    ],
    tip: { label: 'בגשם', text: 'מחליפים עם יום 4 (זלצבורג), או עושים רק את הטרמה.' },
  },
  {
    n: 3, date: '5.8', weekday: 'חמישי', base: 'flachau', place: 'האלשטאט · גוזאו',
    title: 'מכרה המלח, האלשטאט ואגם גוזאו', image: 'img/d3.jpg',
    weather: { level: 'any', label: 'מתאים גם בגשם' },
    slots: [
      { when: '08:00', what: 'יציאה להאלשטאט (כשעה ורבע).', note: 'באוגוסט החניות מתמלאות מוקדם.' },
      { when: 'בוקר', what: 'מכרה המלח Salzwelten Hallstatt: רכבל למעלה, מגלשות עץ, רכבת כורים ואגם תת-קרקעי.', note: 'להזמין סלוט מראש ולקחת שכבה חמה.' },
      { when: 'צהריים', what: 'סיור קצר בעיירה וארוחה על שפת האגם.' },
      { when: 'אחה"צ', what: 'אגם גוזאו (כ-25 דקות מהאלשטאט): הליכה קלה לאורך האגם וסירות פדלים.', note: 'אפשר לעשות רק חלק מהסיבוב אם הילדים עייפים.' },
      { when: 'ערב', what: 'חזרה לפלאכו דרך אנברג (כשעה).' },
    ],
    tip: { label: 'בגשם', text: 'המכרה תת-קרקעי. מדלגים רק על גוזאו.' },
  },
  {
    n: 4, date: '6.8', weekday: 'שישי', base: 'flachau', place: 'זלצבורג',
    title: 'זלצבורג', image: 'img/d4.jpg',
    weather: { level: 'any', label: 'יום הגיבוי של חלק 1' },
    slots: [
      { when: 'בוקר', what: 'נסיעה לזלצבורג (כ-50 דקות), חניה בחניון העיר העתיקה. גני מיראבל ומדרחוב גטריידגאסה.' },
      { when: 'לפני הצהריים', what: 'רכבל המצודה ל-Hohensalzburg לתצפית.', note: 'זה הדבר הראשון לוותר עליו אם הילדים מתעייפים.' },
      { when: 'צהריים', what: 'ארוחה בעיר העתיקה.' },
      { when: 'אחה"צ', what: 'ארמון Hellbrunn ומזרקות השעשועים. הוא בדרום העיר, על הדרך חזרה.' },
      { when: 'ערב', what: 'חזרה לפלאכו ואריזה.' },
    ],
    tip: { label: 'להביא', text: 'בגדים להחלפה לילדים. במזרקות של הלברון נרטבים.' },
  },
  {
    n: 5, date: '7.8', weekday: 'שבת', base: 'kaprun', place: 'פלאכו ← קפרון',
    title: 'מעבר לקפרון ונקיק זיגמונד-טון', image: 'img/d5.jpg',
    slots: [
      { when: '10:00', what: "צ'ק-אאוט בפלאכו ונסיעה לקפרון (כשעה)." },
      { when: 'בוקר מאוחר', what: 'נקיק Sigmund-Thun-Klamm: גשרי עץ בתוך הנקיק עד אגם Klammsee, כשעה הלוך וחזור.' },
      { when: 'צהריים', what: "צ'ק-אין ב-Carpe Solem Kaprun.", note: 'לבקש את ה-Summer Card של האזור.' },
      { when: 'אחה"צ', what: 'ביקור קצר בטירת קפרון.', note: 'לבדוק מראש שהיא פתוחה למבקרים באותו יום.' },
      { when: 'ערב', what: 'ארוחה וסיור רגלי במרכז קפרון.' },
    ],
    tip: { label: 'חשוב', text: 'זו שבת: קניות סופר גדולות היום, כי מחר (ראשון) הסופרים סגורים. בשבת הם נסגרים בערך ב-18:00.' },
  },
  {
    n: 6, date: '8.8', weekday: 'ראשון', base: 'kaprun', place: 'קיצשטיינהורן · צל-אם-זי',
    title: 'קרחון קיצשטיינהורן ואגם צל', image: 'img/d6.jpg',
    weather: { level: 'must', label: 'רק ביום בהיר' }, flexible: true,
    slots: [
      { when: 'בוקר מוקדם', what: 'רכבלים ל-Gipfelwelt 3000 על קיצשטיינהורן. Ice Arena עם מגלשות שלג ורצפת תצפית.', note: 'מעילים, כובעים ומשקפי שמש.' },
      { when: 'צהריים', what: 'ארוחה במסעדה הפנורמית על ההר.' },
      { when: 'אחה"צ', what: 'אגם צל: סירות פדלים או מנוע חשמלי, שחייה בחוף הרחצה והליכה בטיילת.', note: 'זה יום ראשון, אז צפוי עומס.' },
      { when: 'ערב', what: 'ארוחה בעיר העתיקה של צל-אם-זי.' },
    ],
    tip: { label: 'שימו לב', text: 'הסופרים סגורים היום. הקניות נעשות אתמול.' },
  },
  {
    n: 7, date: '9.8', weekday: 'שני', base: 'kaprun', place: 'קרימל',
    title: 'מפלי קרימל', image: 'img/d7.jpg',
    weather: { level: 'any', label: 'מתאים גם בגשם קל' },
    slots: [
      { when: 'בוקר', what: 'נסיעה לקרימל (כשעה) ומסלול המפלים ביער.', note: 'להגיע מוקדם, לפני העומס.' },
      { when: 'צהריים', what: 'WasserWelten Krimml: מתחם משחקי מים ומדע ליד הכניסה למפלים.' },
      { when: 'אחה"צ', what: 'חזרה לקפרון ומנוחה בבריכה.' },
    ],
    tip: { label: 'בגשם', text: 'המפלים מרשימים גם בגשם קל, עם מעיל גשם.' },
  },
  {
    n: 8, date: '10.8', weekday: 'שלישי', base: 'kaprun', place: 'קפרון',
    title: 'הסכרים הגבוהים ואחה"צ חופשי', image: 'img/d8.jpg',
    weather: { level: 'pref', label: 'עדיף מזג אוויר טוב' }, flexible: true,
    slots: [
      { when: 'בוקר עד 13:00', what: 'הסכרים הגבוהים של קפרון: אוטובוסים מחניית Kesselfall ומעלית פתוחה עד מאגר Mooserboden.' },
      { when: 'אחה"צ', what: 'חופשי באמת: בריכה, אגם או קניות.', note: 'אם הילדים רוצים עוד אקשן: מגלשת ההרים Maisi Flitzer בקפרון.' },
      { when: 'ערב', what: 'ארוחת ערב משותפת של 3 המשפחות.' },
    ],
    tip: { label: 'להזמין', text: 'שולחן ל-12 מראש.' },
  },
  {
    n: 9, date: '11.8', weekday: 'רביעי', base: 'kaprun', place: 'גרוסגלוקנר',
    title: 'כביש גרוסגלוקנר', image: 'img/d9.jpg',
    weather: { level: 'must', label: 'רק ביום בהיר' }, flexible: true,
    slots: [
      { when: '08:30', what: 'יציאה. פארק החיות Wildpark Ferleiten בכניסה הצפונית לכביש, בהתחלה או בסוף היום.' },
      { when: 'בוקר–צהריים', what: 'עצירות תצפית ומשחק בשלג בנקודות הגבוהות.' },
      { when: 'צהריים', what: 'Kaiser-Franz-Josefs-Höhe: מרמוטות מקרוב ותצפית לקרחון. ארוחה במקום.' },
      { when: 'ערב', what: 'חזרה לקפרון וערב רגוע, כולל אריזה.' },
    ],
  },
  {
    n: 10, date: '12.8', weekday: 'חמישי', base: 'kaprun', place: 'קפרון ← מינכן',
    title: 'חזרה הביתה', image: 'img/d10.jpg',
    slots: [
      { when: '10:00', what: "צ'ק-אאוט ונסיעה לכיוון מינכן (כ-2.5–3 שעות)." },
      { when: '13:00–16:00', what: 'ארוחת צהריים וקניות אחרונות בדרך או באזור מינכן.' },
      { when: '16:30', what: 'תדלוק והחזרת הרכבים ל-Europcar, Airport Center קומה 3.' },
      { when: '17:00', what: "צ'ק-אין בשדה, טרמינל 1." },
      { when: '20:00', what: 'טיסה LY352 לישראל. נחיתה ב-00:45 בלילה.' },
    ],
  },
];

export const WEATHER_ROWS = [
  { day: 2, name: 'ריטיסברג', level: 'pref' as Weather, need: 'כן', plan: 'מחליפים עם יום 4 (זלצבורג), או עושים רק את הטרמה' },
  { day: 3, name: 'האלשטאט', level: 'any' as Weather, need: 'לא', plan: 'המכרה תת-קרקעי; מדלגים רק על גוזאו' },
  { day: 4, name: 'זלצבורג', level: 'any' as Weather, need: 'לא', plan: 'יום הגיבוי של חלק 1' },
  { day: 6, name: 'קיצשטיינהורן', level: 'must' as Weather, need: 'כן, חובה', plan: 'מחליפים עם יום 7 או 8' },
  { day: 7, name: 'קרימל', level: 'any' as Weather, need: 'לא ממש', plan: 'המפלים מרשימים גם בגשם קל, עם מעיל גשם' },
  { day: 8, name: 'הסכרים', level: 'pref' as Weather, need: 'עדיף', plan: 'מחליפים עם יום 7' },
  { day: 9, name: 'גרוסגלוקנר', level: 'must' as Weather, need: 'כן, חובה', plan: 'מחליפים עם יום 7 או 8' },
];

export const CHECKLIST: { id: string; text: string }[] = [
  { id: 'vignette', text: 'ויניטה דיגיטלית ל-3 הרכבים. קנייה באינטרנט נכנסת לתוקף רק אחרי 18 יום, אז לקנות מראש או בתחנת דלק לפני הגבול' },
  { id: 'rental', text: 'לוודא מול Europcar את מועד ההחזרה: בשובר כתוב 13.8 ב-10:00, אבל מחזירים ב-12.8 אחה"צ' },
  { id: 'license', text: 'רישיון נהיגה בינלאומי לכל נהג (בחנויות אופטיקה) וכרטיס אשראי בינלאומי עם מסגרת לפיקדון' },
  { id: 'saltmine', text: 'להזמין מראש סלוט למכרה המלח בהאלשטאט (5.8, בוקר)' },
  { id: 'cards', text: 'לשאול את המלון בקפרון על ה-Summer Card של צל-אם-זי–קפרון, ואת המלון בפלאכו על כרטיס קיץ מקומי' },
  { id: 'hours', text: 'לבדוק שעות פתיחה של Lucky Flitzer ב-3.8 ושל טירת קפרון ב-7.8' },
  { id: 'glockner', text: 'אגרת כביש גרוסגלוקנר לכל אחד מ-3 הרכבים (אפשר לרכוש באינטרנט)' },
  { id: 'dinner', text: 'שולחן ל-12 לארוחה המשותפת ב-10.8' },
  { id: 'shopping', text: 'קניות סופר עד שבת 7.8, כי בראשון 8.8 הסופרים סגורים' },
  { id: 'packing', text: 'לארוז: מעילים וכובעים לקרחון ולגרוסגלוקנר, בגדי ים, מעילי גשם, בגדים להחלפה להלברון' },
];
