export const locales = ['en', 'he'] as const;
export type Locale = (typeof locales)[number];

const en = {
  brand: 'Cukierman-Yaffe',
  group: 'Research group',
  fullName: 'Prof. Tali Cukierman-Yaffe',
  groupName: 'The Cukierman-Yaffe research group',
  description:
    'Research at the intersection of diabetes, cognition, and healthy aging.',
  draft: 'WORK IN PROGRESS',
  draftText:
    'A website draft. Content and translations await research-team review; enquiries are not yet available.',
  skip: 'Skip to main content',
  menu: 'Menu',
  mainNavigation: 'Main navigation',
  explore: 'Explore studies',
  learn: 'Learn more',
  home: 'Home',
  nav: {
    research: 'Our research',
    studies: 'Studies',
    about: 'The group',
    'for-clinicians': 'For clinicians',
  },
  footerExplore: 'Explore',
  footerKnow: 'Good to know',
  participation: 'About participation',
  publications: 'Selected publications',
  privacy: 'Privacy',
  accessibility: 'Accessibility',
  footerNote:
    'Understanding the whole person. Connecting science with everyday life.',
  medicalNote:
    'Research information, not medical advice. This draft does not collect patient information or enroll participants.',
  back: 'Back to studies',
  sources: 'Sources & further reading',
  copyNote:
    'Editorial summary for review. Refer to the original source and the research team for current information.',
};

export const ui: Record<Locale, typeof en> = {
  en,
  he: {
    brand: 'צוקרמן־יפה',
    group: 'קבוצת המחקר',
    fullName: 'פרופ׳ טלי צוקרמן־יפה',
    groupName: 'קבוצת המחקר של פרופ׳ טלי צוקרמן־יפה',
    description: 'מחקר בנקודת המפגש בין סוכרת, תפקוד קוגניטיבי והזדקנות בריאה.',
    draft: 'האתר בתהליך פיתוח',
    draftText:
      'זוהי טיוטת אתר. התוכן והתרגומים ממתינים לבדיקת צוות המחקר; עדיין לא ניתן לשלוח פניות.',
    skip: 'דילוג לתוכן הראשי',
    menu: 'תפריט',
    mainNavigation: 'ניווט ראשי',
    explore: 'למחקרים שלנו',
    learn: 'למידע נוסף',
    home: 'בית',
    nav: {
      research: 'המחקר שלנו',
      studies: 'מחקרים',
      about: 'על הקבוצה',
      'for-clinicians': 'לצוותים רפואיים',
    },
    footerExplore: 'להכיר את המחקר',
    footerKnow: 'כדאי לדעת',
    participation: 'על השתתפות במחקר',
    publications: 'פרסומים נבחרים',
    privacy: 'פרטיות',
    accessibility: 'נגישות',
    footerNote: 'להבין את האדם השלם. לחבר בין המדע לחיי היום־יום.',
    medicalNote:
      'מידע מחקרי, לא ייעוץ רפואי. טיוטת האתר אינה אוספת מידע על מטופלים ואינה מבצעת הרשמה למחקרים.',
    back: 'בחזרה למחקרים',
    sources: 'מקורות וקריאה נוספת',
    copyNote:
      'סיכום עריכתי המיועד לבדיקה. למידע עדכני יש לעיין במקור ולפנות לצוות המחקר.',
  },
};
