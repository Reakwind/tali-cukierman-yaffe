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
        'Research connecting metabolic health, cognition, and physical function — from clinical questions to digital assessment tools.',
      sections: [
        {
          id: 'cognition',
          title: 'Diabetes & cognitive health',
          paragraphs: [
            'How does diabetes relate to thinking and memory? Publicly documented work includes cognitive analyses within ORIGIN, ACCORD-MIND, and REWIND, and research on cognitive assessment in older adults with diabetes.',
            'Selected publications are linked below. Findings from a particular study should not be read as personal treatment advice.',
          ],
        },
        {
          id: 'movement',
          title: 'Movement, strength & independence',
          paragraphs: [
            'Physical function is another part of the picture. Research includes muscle strength, frailty, and the practical challenges of managing diabetes in older age.',
            'STAY-STRONG studies exercise and nutrition alongside semaglutide.',
          ],
          links: [
            { label: 'STAY-STRONG study page', path: 'studies/stay-strong/' },
          ],
        },
        {
          id: 'technology',
          title: 'Digital tools, carefully evaluated',
          paragraphs: [
            'Digital assessment may offer new ways to study cognition and physical function. A 2024 paper describes the development and first-stage validation of a digital Digit Symbol Substitution Test.',
            'The authors call for further validation. Early findings are not evidence of regulatory approval or a replacement for clinical assessment.',
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
          title: 'A starting point for collaboration',
          paragraphs: [
            'Our public research profile connects clinical epidemiology, endocrinology, cognitive assessment, and physical function. Explore the selected publications and institutional profile to assess scientific overlap.',
            'Collaboration and supervision are considered case by case. Use the research themes and publications to assess fit; the institutional profile is the current contact route.',
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
        'Our studies — who they are for and what they involve. Each page explains the study in plain language and shows when the information was last updated. The research team confirms who can take part.',
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
      sources: [
        {
          label: 'TAU biography and institute roles',
          url: 'https://en-cuenca-institute.tau.ac.il/board-of-directors',
        },
        {
          label: 'PHRI international fellows',
          url: 'https://www.phri.ca/collaborations/phri-international-fellows/',
        },
        {
          label: 'Sheba older-adult diabetes service',
          url: 'https://eng.sheba.co.il/Center-for-Treatment-and-Study-Diabetes-in-Old-Age',
        },
        { label: '6 Vital platform', url: 'https://6-vital.com/' },
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
            'With the patient’s permission, share the study page with them. Until the study referral route opens, contact the Sheba service through its official page (linked below); current availability is confirmed through the official record.',
          ],
          bullets: [
            'Do not send names, diagnoses, referrals, or medical documents through GitHub or this website.',
            'A completed study is not a referral opportunity.',
            'Every study page links to its official record — the safest link to verify and share.',
          ],
        },
        {
          id: 'partners',
          title: 'Working with us',
          paragraphs: [
            'Methods and themes: randomized controlled trials, clinical epidemiology, cognitive and physical-function assessment, wearables and imaging, and digital assessment tools. Start from the research pages, then the selected publications.',
            'For collaboration or supervision, start from Tali’s TAU research profile (linked below); a dedicated professional contact route is being prepared. For clinical care, use the official hospital channels.',
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
        'Taking part in research is voluntary. Asking a question is not enrollment or consent — the study team explains the study and discusses risks and consent before you decide.',
      sections: [],
      sources: [
        {
          label: 'Israel Ministry of Health: participating in clinical trials',
          url: 'https://me.health.gov.il/en/older-adult/services-rights/living-with-a-condition/treatments/clinical-trials/',
        },
      ],
    },
    publications: {
      title: 'Selected publications',
      intro:
        'A small selection of source-verified publications, not a complete bibliography. Visit the institutional profile for the full record.',
      sections: [
        {
          id: 'digital-assessment',
          title: 'Digital cognitive assessment · 2024',
          paragraphs: [
            'Development and first-stage validation of a digital version of the Digit Symbol Substitution test for use in assessing cognitive function in older people with diabetes. Diabetes, Obesity and Metabolism. DOI: 10.1111/dom.15657.',
            'This reports first-stage validation; the authors call for further studies, particularly self-administration and different clinical settings.',
          ],
        },
        {
          id: 'rewind',
          title: 'Cognitive outcomes in REWIND · 2020',
          paragraphs: [
            'Effect of dulaglutide on cognitive impairment in type 2 diabetes: an exploratory analysis of the REWIND trial. The Lancet Neurology. DOI: 10.1016/S1474-4422(20)30173-3.',
            'An exploratory analysis should not be presented as a personal treatment recommendation.',
          ],
        },
        {
          id: 'technology-review',
          title: 'Technology & older-adult diabetes care · 2023',
          paragraphs: [
            'The Growing Role of Technology in the Care of Older Adults With Diabetes. Diabetes Care. PubMed: 37471606.',
            'A review of the developing evidence, barriers, and research needs for technology in older-adult diabetes care.',
          ],
        },
      ],
      sources: [
        {
          label: 'Digital assessment paper · DOI',
          url: 'https://doi.org/10.1111/dom.15657',
        },
        {
          label: 'REWIND exploratory analysis · DOI',
          url: 'https://doi.org/10.1016/S1474-4422(20)30173-3',
        },
        {
          label: 'Technology review · PubMed',
          url: 'https://pubmed.ncbi.nlm.nih.gov/37471606/',
        },
        {
          label: 'Full institutional publication profile',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
      ],
    },
    privacy: {
      title: 'Privacy',
      intro:
        'This draft is an informational website, not a place to submit medical or contact information.',
      sections: [
        {
          id: 'collection',
          title: 'What this website does — and does not do',
          paragraphs: [
            'No submission forms, accounts, analytics, advertising trackers, or browser-storage features have been added. The draft does not accept participant applications or referrals.',
            'If hosted online, the hosting provider may process technical access data such as IP addresses and request logs to deliver and protect the site. A lack of application forms does not mean the hosting provider processes no data.',
          ],
        },
        {
          id: 'links',
          title: 'When you follow an external link',
          paragraphs: [
            'Institutional websites, registries, publication providers, and the 6 Vital platform operate separately and have their own privacy practices. They are linked, not embedded.',
            'An approved enquiry platform will need its own clear controller, purpose, contact, access, and retention information before registration can be activated. Those decisions are still pending.',
          ],
        },
        {
          id: 'public-repo',
          title: 'Keep personal information out of GitHub',
          paragraphs: [
            'The source repository and its issues are public. Do not post medical histories, contact details, patient documents, or study applications there.',
            'This draft privacy explanation is not a claim of legal certification or an institution-approved privacy notice.',
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
        'מחקר המחבר בין בריאות מטבולית, קוגניציה ותפקוד גופני — משאלות קליניות ועד כלי הערכה דיגיטליים.',
      sections: [
        {
          id: 'cognition',
          title: 'סוכרת ובריאות קוגניטיבית',
          paragraphs: [
            'כיצד סוכרת קשורה לחשיבה ולזיכרון? העבודות המתועדות במקורות הציבוריים כוללות ניתוחים קוגניטיביים במסגרת מחקרי ORIGIN, ACCORD-MIND ו־REWIND, ומחקר על הערכה קוגניטיבית במבוגרים עם סוכרת.',
            'פרסומים נבחרים מקושרים בהמשך. אין לראות בממצאי מחקר מסוים המלצה טיפולית אישית.',
          ],
        },
        {
          id: 'movement',
          title: 'תנועה, כוח ועצמאות',
          paragraphs: [
            'תפקוד גופני הוא חלק נוסף בתמונה. תחומי המחקר כוללים כוח שריר, שבריריות ואת האתגרים המעשיים של ניהול סוכרת בגיל המבוגר.',
            'הרישום של מחקר STAY-STRONG מתאר בחינה של פעילות גופנית ותזונה לצד טיפול בסמגלוטייד. לפרטים ולסטטוס יש לעיין בדף המחקר וברישום המקורי.',
          ],
        },
        {
          id: 'technology',
          title: 'כלים דיגיטליים הנבחנים בזהירות',
          paragraphs: [
            'הערכה דיגיטלית עשויה לפתוח דרכים חדשות לחקר קוגניציה ותפקוד גופני. מאמר משנת 2024 מתאר פיתוח ותיקוף ראשוני של גרסה דיגיטלית למבחן החלפת סמלים בספרות.',
            'המחברים מציינים צורך בתיקוף נוסף. ממצאים ראשוניים אינם אישור רגולטורי ואינם תחליף להערכה קלינית.',
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
          title: 'נקודת פתיחה לשיתוף פעולה',
          paragraphs: [
            'הפרופיל הציבורי של המחקר מחבר בין אפידמיולוגיה קלינית, אנדוקרינולוגיה, הערכה קוגניטיבית ותפקוד גופני. אפשר לעיין בפרסומים ובפרופיל המוסדי כדי לזהות תחומי עניין משותפים.',
            'שיתופי פעולה והנחיה נבחנים לגופו של עניין. אפשר להשתמש בתחומי המחקר ובפרסומים כדי להעריך התאמה; הפרופיל המוסדי הוא מסלול הקשר הנוכחי.',
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
        'המחקרים שלנו — למי הם מיועדים ומה הם כוללים. כל עמוד מסביר את המחקר בשפה פשוטה ומראה מתי המידע עודכן לאחרונה. צוות המחקר מאשר מי יכול להשתתף.',
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
      sources: [
        {
          label: 'ביוגרפיה ותפקידים במכוני האוניברסיטה (באנגלית)',
          url: 'https://en-cuenca-institute.tau.ac.il/board-of-directors',
        },
        {
          label: 'העמיתים הבין־לאומיים של PHRI (באנגלית)',
          url: 'https://www.phri.ca/collaborations/phri-international-fellows/',
        },
        {
          label: 'השירות לסוכרת בגיל המבוגר בשיבא (באנגלית)',
          url: 'https://eng.sheba.co.il/Center-for-Treatment-and-Study-Diabetes-in-Old-Age',
        },
        { label: 'פלטפורמת 6 Vital (באנגלית)', url: 'https://6-vital.com/' },
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
            'בהסכמת המטופל או המטופלת, אפשר לשתף עמם את עמוד המחקר. עד לפתיחת מסלול ההפניה, אפשר לפנות לשירות שיבא דרך העמוד הרשמי (מקושר למטה); זמינות עדכנית נבדקת דרך הרישום הרשמי.',
          ],
          bullets: [
            'אין להעביר שמות, אבחנות, הפניות או מסמכים רפואיים באתר או ב־GitHub.',
            'מחקר שהושלם אינו פתוח להפניות לצורך השתתפות.',
            'כל עמוד מחקר מקשר לרישום הרשמי — זהו הקישור הבטוח ביותר לאימות ולשיתוף.',
          ],
        },
        {
          id: 'partners',
          title: 'עבודה משותפת',
          paragraphs: [
            'שיטות ותחומים: מחקרים אקראיים מבוקרים, אפידמיולוגיה קלינית, הערכת תפקוד קוגניטיבי וגופני, אביזרי לבישה ודימות, וכלי הערכה דיגיטליים. אפשר להתחיל מעמודי המחקר ומשם לפרסומים הנבחרים.',
            'לשיתוף פעולה או להנחיה, אפשר להתחיל מהפרופיל המחקרי של טלי באוניברסיטת תל אביב (מקושר למטה); מסלול קשר מקצועי ייעודי בהכנה. לקבלת טיפול רפואי יש להשתמש בערוצים הרשמיים של בית החולים.',
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
        'השתתפות במחקר היא בהתנדבות. שליחת שאלה אינה הרשמה ואינה הסכמה מדעת — צוות המחקר מסביר על המחקר ודן בסיכונים ובהסכמה לפני שמחליטים.',
      sections: [],
      sources: [
        {
          label: 'משרד הבריאות: השתתפות במחקרים קליניים',
          url: 'https://me.health.gov.il/older-adult/services-rights/living-with-a-condition/treatments/clinical-trials/',
        },
      ],
    },
    publications: {
      title: 'פרסומים נבחרים',
      intro:
        'מבחר קטן של פרסומים שנבדקו מול המקורות, לא רשימת פרסומים מלאה. לרשימה המלאה אפשר לעיין בפרופיל המוסדי.',
      sections: [
        {
          id: 'digital-assessment',
          title: 'הערכה קוגניטיבית דיגיטלית · 2024',
          paragraphs: [
            'פיתוח ותיקוף ראשוני של גרסה דיגיטלית למבחן החלפת סמלים בספרות, לצורך הערכת תפקוד קוגניטיבי במבוגרים עם סוכרת. פורסם ב־Diabetes, Obesity and Metabolism. מזהה DOI: 10.1111/dom.15657.',
            'מדובר בתיקוף ראשוני. המחברים מציינים צורך במחקרים נוספים, במיוחד בשימוש עצמאי ובמסגרות קליניות שונות.',
          ],
        },
        {
          id: 'rewind',
          title: 'תוצאות קוגניטיביות במחקר REWIND · 2020',
          paragraphs: [
            'השפעת דולגלוטייד על פגיעה קוגניטיבית בסוכרת מסוג 2: ניתוח חקרני של מחקר REWIND. פורסם ב־The Lancet Neurology. מזהה DOI: 10.1016/S1474-4422(20)30173-3.',
            'אין להציג ניתוח חקרני כהמלצה לטיפול אישי.',
          ],
        },
        {
          id: 'technology-review',
          title: 'טכנולוגיה וטיפול בסוכרת בגיל המבוגר · 2023',
          paragraphs: [
            'סקירה על תפקידה המתפתח של טכנולוגיה בטיפול במבוגרים עם סוכרת. פורסמה ב־Diabetes Care. מזהה PubMed: 37471606.',
            'הסקירה עוסקת בראיות המתפתחות, בחסמים ובצורכי המחקר בתחום.',
          ],
        },
      ],
      sources: [
        {
          label: 'מאמר ההערכה הדיגיטלית — מקור (באנגלית)',
          url: 'https://doi.org/10.1111/dom.15657',
        },
        {
          label: 'הניתוח החקרני של REWIND — מקור (באנגלית)',
          url: 'https://doi.org/10.1016/S1474-4422(20)30173-3',
        },
        {
          label: 'סקירת הטכנולוגיה — PubMed (באנגלית)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/37471606/',
        },
        {
          label: 'פרופיל הפרסומים המלא באוניברסיטה (באנגלית)',
          url: 'https://cris.tau.ac.il/en/persons/tali-cukierman-yaffe/',
        },
      ],
    },
    privacy: {
      title: 'פרטיות',
      intro: 'זוהי טיוטת אתר מידע, לא מקום למסירת פרטים רפואיים או פרטי קשר.',
      sections: [
        {
          id: 'collection',
          title: 'מה האתר עושה — ומה לא',
          paragraphs: [
            'לא נוספו טפסי שליחה, חשבונות משתמשים, שירותי ניתוח גלישה, מעקב פרסומי או שמירה בדפדפן. הטיוטה אינה מקבלת בקשות להשתתפות או הפניות.',
            'אם האתר יאוחסן ברשת, ספק האחסון עשוי לעבד מידע טכני כמו כתובות IP ויומני גישה לצורך הפעלת האתר והגנתו. היעדר טפסים אינו מבטיח שספק האחסון אינו מעבד מידע.',
          ],
        },
        {
          id: 'links',
          title: 'כשעוברים לאתר אחר',
          paragraphs: [
            'אתרי מוסדות, מאגרי מחקרים, ספקי פרסומים ופלטפורמת 6 Vital פועלים בנפרד ולפי מדיניות הפרטיות שלהם. הם מקושרים, לא מוטמעים באתר.',
            'לפני הפעלת פניות, מערכת מאושרת תצטרך להציג מידע ברור על הגוף האחראי, מטרת האיסוף, פרטי קשר, גישה ושמירה. ההחלטות האלה עדיין ממתינות לאישור.',
          ],
        },
        {
          id: 'public-repo',
          title: 'לא משתפים מידע אישי ב־GitHub',
          paragraphs: [
            'מאגר הקוד והפניות אליו ציבוריים. אין לפרסם בהם היסטוריה רפואית, פרטי קשר, מסמכים או בקשות להשתתפות.',
            'הסבר טיוטה זה אינו אישור משפטי ואינו הודעת פרטיות שאושרה בידי מוסד רפואי.',
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
