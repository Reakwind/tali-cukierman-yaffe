import type { Locale } from '../i18n/ui';

export const pageKeys = [
  'research',
  'studies',
  'about',
  'for-clinicians',
  'participation',
  'publications',
  'privacy',
  'accessibility',
] as const;
export type PageKey = (typeof pageKeys)[number];
interface Section {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: { label: string; path: string }[];
}
interface Page {
  title: string;
  intro: string;
  sections: Section[];
  sources?: { label: string; url: string }[];
}

export const pages: Record<Locale, Record<PageKey, Page>> = {
  en: {
    research: {
      title: 'Our research',
      intro:
        'We study how to measure and support physical and cognitive function in older adults with diabetes. Our featured work spans exercise and nutrition, machine-learning assessment, and automated insulin delivery.',
      sections: [
        {
          id: 'cognition',
          title: 'Diabetes & cognitive health',
          paragraphs: [
            'Thinking, memory, and processing speed can affect the demands of diabetes self-management. Our research includes cognitive analyses within ORIGIN, ACCORD-MIND, and REWIND, alongside work on cognitive assessment in older adults.',
            'The digital Digit Symbol Substitution Test is one example: a 2024 paper describes its development and first-stage validation. Further validation is needed for self-administration and different clinical settings.',
          ],
        },
        {
          id: 'movement',
          title: 'Movement, strength & independence',
          paragraphs: [
            'STAY-STRONG tests whether exercise and nutritional support alongside semaglutide help preserve muscle mass, strength, and physical function in older adults with type 2 diabetes and overweight or obesity.',
            'The BIRAX collaboration with Swansea University asks a different question: how can machine learning help assess physical capacity? It focuses on measurement, while STAY-STRONG tests an intervention.',
          ],
          links: [
            { label: 'STAY-STRONG study page', path: 'studies/stay-strong/' },
            { label: 'BIRAX project page', path: 'studies/birax/' },
          ],
        },
        {
          id: 'technology',
          title: 'Diabetes technology and assessment',
          paragraphs: [
            'GRACE-780G evaluated the MiniMed 780G automated insulin-delivery system alongside standard care in 42 older adults with type 1 diabetes. The trial followed participants for 12 months, including people with cognitive impairment.',
            'Our digital methods use the 6 Vital smartphone app to capture movement data from phone sensors and cognitive data from our digital cognitive test, combined with machine learning to identify frailty.',
          ],
          links: [
            {
              label: 'GRACE-780G study page',
              path: 'studies/hybrid-closed-loop/',
            },
          ],
        },
        {
          id: 'six-vital',
          title: '6 Vital',
          paragraphs: [
            '6 Vital is a digital-health platform created by Tali. Its public website describes digital cognitive measurement, caregiver/patient-management tools, and a patient app.',
            '6 Vital is separate from this website and from the studies listed here. Its clinical claims and availability are described on its own site.',
          ],
        },
        {
          id: 'collaboration',
          title: 'Clinical and research collaboration',
          paragraphs: [
            'Our work combines randomized trials, clinical epidemiology, body-composition imaging, functional testing, wearables, and digital cognitive assessment. Study pages link the research design to its related publications.',
            'For clinicians considering a referral, the relevant starting point is the study’s participant information and current site status. For academic collaboration, explore the methods, outputs, and team’s research interests.',
          ],
        },
      ],
      sources: [
        {
          label: 'TAU research profile',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
        {
          label: 'Digital assessment paper (2024)',
          url: 'https://doi.org/10.1111/dom.15657',
        },
        { label: '6 Vital platform', url: 'https://6-vital.com/' },
      ],
    },
    studies: {
      title: 'Studies',
      intro:
        'BIRAX and STAY-STRONG are welcoming participants. Find out who each study is for and what taking part involves, or explore our other research and findings.',
      // Individual study content comes from the validated Astro collection.
      sections: [],
    },
    about: {
      title: 'The team',
      intro:
        'The people behind the studies: clinicians, researchers, coordinators, and students at Sheba Medical Center and Tel Aviv University.',
      sections: [
        {
          id: 'people',
          title: 'Profiles',
          paragraphs: [
            'The group combines clinical research, epidemiology, and digital-health work at Sheba Medical Center and Tel Aviv University.',
            'Profiles are based on official public sources. Contact details are not listed here.',
          ],
        },
      ],
    },
    'for-clinicians': {
      title: 'For clinicians & collaborators',
      intro:
        'For clinicians, researchers, and collaborators. Share study information with patients — never patient details.',
      sections: [
        {
          id: 'referrals',
          title: 'Considering a referral?',
          paragraphs: [
            'Check three things before you act: the dated status on the study page, who the study is for, and the complete eligibility criteria in the official record. Broad summaries on this site are a starting point only.',
            'BIRAX and STAY-STRONG are actively recruiting. With the patient’s permission, share the relevant study page with them. The participation section explains the next step; the study team can discuss eligibility, visit arrangements, and which site is suitable.',
          ],
          bullets: [
            'Do not send names, diagnoses, referrals, or medical documents through GitHub or this website.',
            'Look for the participation invitation on studies that are recruiting.',
            'Study pages link to an official trial record or project source, with the date it was checked. A registry or funding listing does not confirm current openings.',
          ],
        },
        {
          id: 'partners',
          title: 'Working with us',
          paragraphs: [
            'STAY-STRONG brings together exercise, nutritional support, and body-composition and functional assessment. BIRAX develops machine-learning approaches to physical-capacity assessment with Swansea. GRACE-780G evaluates automated insulin delivery in older adults with type 1 diabetes.',
            'Study pages include research design and related outputs. The selected publications include conference abstracts, methodological work, clinical proposals, and reviews. Tali’s institutional profile provides the wider research record. For clinical care, use the official hospital channels.',
          ],
        },
      ],
      sources: [
        {
          label: 'STAY-STRONG official registry record',
          url: 'https://clinicaltrials.gov/study/NCT06497595',
        },
        {
          label: 'TAU research profile',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
        {
          label: 'Official Sheba service information',
          url: 'https://eng.sheba.co.il/Center-for-Treatment-and-Study-Diabetes-in-Old-Age',
        },
      ],
    },
    participation: {
      title: 'Participating in research',
      intro:
        'BIRAX and STAY-STRONG are welcoming participants. Leave your contact details below to speak with our research team about taking part.',
      sections: [],
    },
    publications: {
      title: 'Selected publications',
      intro:
        'Selected research articles, clinical proposals, and conference outputs related to our methods and studies, including STAY-STRONG, BIRAX, and GRACE-780G. This is a curated selection, not a complete bibliography.',
      sections: [],
      sources: [
        {
          label: 'Full institutional publication profile',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
      ],
    },
    privacy: {
      title: 'Privacy',
      intro:
        'The participation form asks for a first name and a phone number or email address so the research team can get in touch.',
      sections: [
        {
          id: 'collection',
          title: 'Study enquiries',
          paragraphs: [
            'Enquiries are addressed to Itay Cohen, Hagar Shimon, Yasmin Alt, and Prof. Tali Cukierman-Yaffe. The form includes the study you are asking about and your chosen contact details.',
            'The website has no participant database, accounts, advertising trackers, or browser-storage features. Enquiry messages are handled in the research team’s email inboxes.',
          ],
        },
        {
          id: 'links',
          title: 'When you follow an external link',
          paragraphs: [
            'Institutional websites, registries, publication providers, and the 6 Vital platform operate separately and have their own privacy practices. They are linked, not embedded.',
            'The contact form does not ask for medical histories, patient documents, or file uploads.',
          ],
        },
        {
          id: 'public-repo',
          title: 'The website source',
          paragraphs: [
            'The public source repository contains website code and public research information. Contact-form enquiries are not sent to GitHub.',
          ],
        },
      ],
    },
    accessibility: {
      title: 'Accessibility',
      intro:
        'Our target is WCAG 2.2 AA. This work-in-progress website has not been certified, and manual testing remains part of the work.',
      sections: [
        {
          id: 'features',
          title: 'Built into the experience',
          paragraphs: [
            'The site uses semantic headings and landmarks, visible keyboard focus, a skip link, readable type, responsive layouts, and native navigation controls. Content and navigation are available without JavaScript.',
            'Hebrew pages use right-to-left layouts. Language links preserve the current page so you do not have to find it again.',
          ],
        },
        {
          id: 'testing',
          title: 'What has been tested',
          paragraphs: [
            'Automated checks cover desktop browser engines and mobile viewports, layout overflow, keyboard navigation, and common accessibility issues.',
            'Automated scans and device emulation cannot establish full accessibility. Real-phone, screen-reader, and translated-content reviews are still needed before launch.',
          ],
        },
        {
          id: 'feedback',
          title: 'An accessible contact route is still needed',
          paragraphs: [
            'A public accessibility contact has not yet been approved. It will be added before launch. For now, non-sensitive website problems can be reported in the source repository, without personal or medical information.',
          ],
        },
      ],
      sources: [
        {
          label: 'Website issues (public — no personal information)',
          url: 'https://github.com/reakwind/tali-cukierman-yaffe/issues',
        },
      ],
    },
  },
  he: {
    research: {
      title: 'המחקר שלנו',
      intro:
        'אנו חוקרים כיצד למדוד תפקוד גופני וקוגניטיבי במבוגרים עם סוכרת וכיצד לתמוך בו. המחקרים המוצגים עוסקים בפעילות גופנית ותזונה, בהערכה באמצעות למידת מכונה ובמתן אינסולין אוטומטי.',
      sections: [
        {
          id: 'cognition',
          title: 'סוכרת ובריאות קוגניטיבית',
          paragraphs: [
            'חשיבה, זיכרון ומהירות עיבוד עשויים להשפיע על הדרישות הכרוכות בניהול עצמי של סוכרת. המחקר כולל ניתוחים קוגניטיביים במסגרת ORIGIN, ACCORD-MIND ו־REWIND, לצד מחקר בהערכה קוגניטיבית בגיל המבוגר.',
            'מבחן החלפת סמלים בספרות בגרסה דיגיטלית הוא דוגמה לכך: מאמר משנת 2024 מתאר את פיתוחו ואת התיקוף הראשוני שלו. נדרש תיקוף נוסף לשימוש עצמאי ובמסגרות קליניות שונות.',
          ],
        },
        {
          id: 'movement',
          title: 'תנועה, כוח ועצמאות',
          paragraphs: [
            'מחקר STAY-STRONG בוחן אם פעילות גופנית ותמיכה תזונתית לצד סמגלוטייד מסייעות בשמירה על מסת השריר, הכוח והתפקוד הגופני במבוגרים עם סוכרת מסוג 2 ועודף משקל או השמנה.',
            'שיתוף הפעולה במימון BIRAX עם אוניברסיטת סוונסי שואל שאלה אחרת: כיצד למידת מכונה יכולה לסייע בהערכת יכולת גופנית? הוא מתמקד במדידה, בעוד STAY-STRONG בוחן התערבות.',
          ],
          links: [
            { label: 'למחקר STAY-STRONG', path: 'studies/stay-strong/' },
            { label: 'למיזם BIRAX', path: 'studies/birax/' },
          ],
        },
        {
          id: 'technology',
          title: 'טכנולוגיות סוכרת והערכה',
          paragraphs: [
            'מחקר GRACE-780G בחן את מערכת MiniMed 780G למתן אינסולין אוטומטי לצד הטיפול הרגיל ב־42 מבוגרים עם סוכרת מסוג 1. המחקר כלל מעקב של 12 חודשים, גם אחר משתתפים עם פגיעה קוגניטיבית.',
            'השיטות הדיגיטליות שלנו עושות שימוש באפליקציית 6 Vital בטלפון לאיסוף נתוני תנועה מחיישני המכשיר ונתונים קוגניטיביים ממבחן דיגיטלי שפיתחנו, בשילוב למידת מכונה לזיהוי שבריריות.',
          ],
          links: [
            {
              label: 'לעמוד מחקר GRACE-780G',
              path: 'studies/hybrid-closed-loop/',
            },
          ],
        },
        {
          id: 'six-vital',
          title: '6 Vital',
          paragraphs: [
            '6 Vital היא פלטפורמה דיגיטלית שטלי יצרה. האתר הציבורי מתאר מדידה קוגניטיבית דיגיטלית, כלים לניהול ולתמיכה במטופלים ובמטפלים, ואפליקציה למטופלים.',
            '6 Vital נפרדת מאתר זה ומהמחקרים המוצגים כאן. הטענות הקליניות והזמינות שלה מתוארות באתר שלה.',
          ],
        },
        {
          id: 'collaboration',
          title: 'שיתוף פעולה קליני ומחקרי',
          paragraphs: [
            'העבודה משלבת מחקרים אקראיים, אפידמיולוגיה קלינית, דימות של הרכב הגוף, בדיקות תפקוד, חיישנים לבישים והערכה קוגניטיבית דיגיטלית. עמודי המחקרים מחברים בין תכנון המחקר לפרסומים הקשורים אליו.',
            'לצוותים רפואיים השוקלים הפניה, נקודת ההתחלה היא המידע למשתתפים ומצב הגיוס העדכני במרכז הרלוונטי. לקראת שיתוף פעולה אקדמי אפשר לעיין בשיטות, בתוצרים ובתחומי העניין של הצוות.',
          ],
        },
      ],
      sources: [
        {
          label: 'פרופיל המחקר באוניברסיטת תל אביב (באנגלית)',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
        {
          label: 'מאמר ההערכה הדיגיטלית, 2024 (באנגלית)',
          url: 'https://doi.org/10.1111/dom.15657',
        },
        { label: 'פלטפורמת 6 Vital (באנגלית)', url: 'https://6-vital.com/' },
      ],
    },
    studies: {
      title: 'מחקרים',
      intro:
        'מחקרי BIRAX ו־STAY-STRONG מגייסים משתתפים. קראו למי כל מחקר מיועד ומה כוללת ההשתתפות, או הכירו מחקרים נוספים ואת ממצאיהם.',
      sections: [],
    },
    about: {
      title: 'הצוות',
      intro:
        'האנשים שמאחורי המחקרים: קלינאים, חוקרים, רכזי מחקר וסטודנטים במרכז הרפואי שיבא ובאוניברסיטת תל אביב.',
      sections: [
        {
          id: 'people',
          title: 'פרופילים',
          paragraphs: [
            'הקבוצה משלבת מחקר קליני, אפידמיולוגיה ובריאות דיגיטלית במרכז הרפואי שיבא ובאוניברסיטת תל אביב.',
            'פרופילים אלה מבוססים על מקורות ציבוריים רשמיים. פרטי קשר אינם מוצגים כאן.',
          ],
        },
      ],
    },
    'for-clinicians': {
      title: 'לצוותים רפואיים ולחוקרים',
      intro:
        'לצוותים רפואיים, לחוקרים ולשותפים. משתפים מידע על מחקרים — לעולם לא מידע על מטופלים.',
      sections: [
        {
          id: 'referrals',
          title: 'שוקלים להפנות מטופל או מטופלת?',
          paragraphs: [
            'שלושה דברים שכדאי לבדוק לפני שפועלים: הסטטוס והתאריך בעמוד המחקר, למי המחקר מיועד, וקריטריוני ההתאמה המלאים ברישום הרשמי. הסיכומים באתר הם נקודת פתיחה בלבד.',
            'מחקרי BIRAX ו־STAY-STRONG מגייסים משתתפים. בהסכמת המטופל או המטופלת, אפשר לשתף עמם את עמוד המחקר הרלוונטי. אזור ההשתתפות מסביר מה הצעד הבא; הצוות יוכל לדון בתנאי ההתאמה, בביקורים ובמרכז המתאים.',
          ],
          bullets: [
            'אין להעביר שמות, אבחנות, הפניות או מסמכים רפואיים באתר או ב־GitHub.',
            'חפשו את ההזמנה להשתתפות במחקרים שמגייסים משתתפים.',
            'עמודי המחקרים מקשרים לרישום הרשמי או למקור המיזם, בציון מועד הבדיקה. רישום מחקר או מימון אינם מאשרים שיש כרגע מקומות פנויים.',
          ],
        },
        {
          id: 'partners',
          title: 'עבודה משותפת',
          paragraphs: [
            'מחקר STAY-STRONG משלב פעילות גופנית, תמיכה תזונתית והערכת הרכב גוף ותפקוד. BIRAX מפתח שיטות למידת מכונה להערכת יכולת גופנית בשיתוף סוונסי. GRACE-780G בוחן מתן אינסולין אוטומטי במבוגרים עם סוכרת מסוג 1.',
            'עמודי המחקרים כוללים תכנון מחקר ותוצרים קשורים. הפרסומים הנבחרים כוללים תקצירי כנס, עבודה מתודולוגית, הצעות קליניות וסקירות. הפרופיל המוסדי של טלי מציג את רשימת המחקר הרחבה. לקבלת טיפול רפואי יש לפנות בערוצי בית החולים הרשמיים.',
          ],
        },
      ],
      sources: [
        {
          label: 'הרישום הרשמי של STAY-STRONG (באנגלית)',
          url: 'https://clinicaltrials.gov/study/NCT06497595',
        },
        {
          label: 'פרופיל המחקר באוניברסיטת תל אביב (באנגלית)',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
        {
          label: 'מידע רשמי על השירות בשיבא (באנגלית)',
          url: 'https://eng.sheba.co.il/Center-for-Treatment-and-Study-Diabetes-in-Old-Age',
        },
      ],
    },
    participation: {
      title: 'השתתפות במחקר',
      intro:
        'מחקרי BIRAX ו־STAY-STRONG מגייסים משתתפים. השאירו פרטי קשר כדי לשוחח עם צוות המחקר על השתתפות.',
      sections: [],
    },
    publications: {
      title: 'פרסומים נבחרים',
      intro:
        'מבחר מאמרי מחקר, הצעות קליניות ותוצרי כנס הקשורים לשיטות ולמחקרים שלנו, ובהם STAY-STRONG,‏ BIRAX ו־GRACE-780G. זהו מבחר ערוך, ולא רשימת פרסומים מלאה.',
      sections: [],
      sources: [
        {
          label: 'פרופיל הפרסומים המלא באוניברסיטה (באנגלית)',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
      ],
    },
    privacy: {
      title: 'פרטיות',
      intro:
        'טופס הפנייה מבקש שם פרטי וטלפון או כתובת אימייל כדי שצוות המחקר יוכל ליצור קשר.',
      sections: [
        {
          id: 'collection',
          title: 'פניות בנוגע למחקרים',
          paragraphs: [
            'הפניות ממוענות לאיתי כהן, הגר שמעון, יסמין אלט ופרופ׳ טלי צוקרמן־יפה. הטופס כולל את המחקר שעליו שאלתם ואת פרטי הקשר שבחרתם למסור.',
            'אין באתר מאגר משתתפים, חשבונות משתמשים, מעקב פרסומי או שמירה בדפדפן. הודעות הפנייה מטופלות בתיבות האימייל של צוות המחקר.',
          ],
        },
        {
          id: 'links',
          title: 'כשעוברים לאתר אחר',
          paragraphs: [
            'אתרי מוסדות, מאגרי מחקרים, ספקי פרסומים ופלטפורמת 6 Vital פועלים בנפרד ולפי מדיניות הפרטיות שלהם. הם מקושרים, לא מוטמעים באתר.',
            'טופס הפנייה אינו מבקש היסטוריה רפואית, מסמכי מטופלים או העלאת קבצים.',
          ],
        },
        {
          id: 'public-repo',
          title: 'קוד האתר',
          paragraphs: [
            'המאגר הציבורי מכיל את קוד האתר ומידע מחקרי ציבורי. פניות דרך הטופס אינן נשלחות ל־GitHub.',
          ],
        },
      ],
    },
    accessibility: {
      title: 'נגישות',
      intro:
        'היעד שלנו הוא WCAG 2.2 ברמת AA. האתר עדיין בפיתוח, לא הוסמך, ובדיקה ידנית היא חלק מהעבודה הנדרשת.',
      sections: [
        {
          id: 'features',
          title: 'חלק מהתכנון עצמו',
          paragraphs: [
            'האתר משתמש בכותרות ובמבנה סמנטי, בסימון מיקוד נראה, בקישור לדילוג לתוכן, בטקסט קריא, בפריסה מותאמת למסכים ובניווט המבוסס על רכיבי הדפדפן. התוכן והניווט זמינים גם ללא JavaScript.',
            'דפי עברית מוצגים מימין לשמאל. מעבר שפה שומר על הדף הנוכחי, כדי שלא תצטרכו לחפש אותו מחדש.',
          ],
        },
        {
          id: 'testing',
          title: 'מה נבדק',
          paragraphs: [
            'בדיקות אוטומטיות מכסות מנועי דפדפנים ותצוגות ניידות, גלילה אופקית לא רצויה, ניווט מקלדת ובעיות נגישות נפוצות.',
            'סריקות אוטומטיות והדמיית מכשירים אינן קובעות נגישות מלאה. נדרשות עדיין בדיקות בטלפונים אמיתיים, בקורא מסך ובתוכן המתורגם לפני השקה.',
          ],
        },
        {
          id: 'feedback',
          title: 'נדרש עדיין ערוץ פנייה נגיש',
          paragraphs: [
            'איש קשר ציבורי לנגישות טרם אושר ויצורף לפני השקה. בינתיים אפשר לדווח במאגר הקוד על בעיות באתר שאינן כוללות מידע אישי או רפואי.',
          ],
        },
      ],
      sources: [
        {
          label: 'דיווח על בעיה באתר (ציבורי — ללא מידע אישי)',
          url: 'https://github.com/reakwind/tali-cukierman-yaffe/issues',
        },
      ],
    },
  },
};
