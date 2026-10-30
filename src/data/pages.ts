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
      title: 'The whole person. The bigger picture.',
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
            'The STAY-STRONG registry describes a study of exercise and nutrition alongside semaglutide. See the study information and original record for details and status.',
          ],
        },
        {
          id: 'technology',
          title: 'Digital tools, carefully evaluated',
          paragraphs: [
            'Digital assessment may offer new ways to study cognition and physical function. A 2024 paper describes the development and first-stage validation of a digital Digit Symbol Substitution Test.',
            'The authors call for further validation. Early findings are not evidence of regulatory approval or a replacement for clinical assessment. The 6 Vital platform describes related cognitive-measurement and patient/caregiver tools.',
          ],
        },
        {
          id: 'collaboration',
          title: 'A starting point for collaboration',
          paragraphs: [
            'Our public research profile connects clinical epidemiology, endocrinology, cognitive assessment, and physical function. Explore the selected publications and institutional profile to assess scientific overlap.',
            'A dedicated collaboration contact and student-opportunity information have not yet been approved for this draft. No vacancies or funding availability are implied.',
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
      title: 'Find the question that matters to you.',
      intro:
        'A first look at publicly registered studies. A registry status is not a promise of current availability; the research team must confirm next steps.',
      // Individual study content comes from the validated Astro collection.
      sections: [],
    },
    about: {
      title: 'Curious minds. Connected research.',
      intro:
        'The research group brings together work led by Prof. Tali Cukierman-Yaffe across clinical, academic, and digital-health settings.',
      sections: [
        {
          id: 'tali',
          title: 'Prof. Tali Cukierman-Yaffe',
          paragraphs: [
            'Tali is an endocrinologist and clinical epidemiologist whose publicly documented research focuses on diabetes, cognitive function, and the challenges of care in older age.',
            'Her institutional biographies describe leadership of the Centre for Successful Aging with Diabetes at Sheba Medical Center and the Endocrinology and Diabetes Service for Women & in Pregnancy. Exact current titles and wording await her review.',
          ],
        },
        {
          id: 'connections',
          title: 'Across organizations, around shared questions',
          paragraphs: [
            'Public institutional profiles describe the following connections. These are distinct roles, not a claim that this draft is an official website of any institution.',
          ],
          bullets: [
            'Tel Aviv University: Associate Professor appointment in public health/epidemiology, as listed in CRIS.',
            'Sheba Medical Center: clinical and research work in diabetes and aging, alongside women’s endocrine care.',
            'PHRI: Senior International Fellow.',
            'Cuenca Institute: listed on the board; Herczeg Institute on Aging: membership described in the TAU biography.',
          ],
        },
        {
          id: 'six-vital',
          title: '6 Vital: a digital-health strand',
          paragraphs: [
            'The project owner identifies 6 Vital as a platform created by Tali. Its public website describes digital cognitive measurement, caregiver/patient-management tools, and a patient app.',
            'The platform’s exact relationship to individual studies, ownership, product status, and preferred web address should be confirmed before launch. It is not this website’s enrollment or medical-care service.',
          ],
        },
        {
          id: 'people',
          title: 'The people behind the work',
          paragraphs: [
            'A reviewed team roster, portraits, supervision information, and open positions will be added when available. We have not invented team members or published an unapproved recruitment advertisement.',
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
      title: 'A clearer connection to research.',
      intro:
        'For clinicians and collaborators helping people learn about research. Share information, not patient details, through this draft.',
      sections: [
        {
          id: 'referrals',
          title: 'Considering a patient referral?',
          paragraphs: [
            'Start with the relevant study’s official record and its complete eligibility criteria. Published broad criteria are only a starting point, not an eligibility determination.',
            'With the patient’s permission, share the study information with them. The research team must confirm current site availability and use its approved screening and consent process.',
          ],
          bullets: [
            'Do not send names, diagnoses, referrals, or medical documents through GitHub or this website.',
            'An institution-approved secure referral channel and professional contact are still pending.',
            'A completed study is not a referral opportunity.',
          ],
        },
        {
          id: 'partners',
          title: 'Academic & research partnerships',
          paragraphs: [
            'The research connects clinical epidemiology, diabetes, cognition, physical function, and digital assessment. Selected publications and institutional profiles provide a source-based starting point for collaboration.',
            'Dedicated collaborator contact details will be added after approval. For clinical services, use the official hospital channel rather than this informational draft.',
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
      title: 'Your questions come first.',
      intro:
        'Learning about a study does not commit you to taking part. An enquiry is not enrollment or informed consent.',
      sections: [
        {
          id: 'learn',
          title: '1. Get to know the study',
          paragraphs: [
            'Read about its purpose, location, practical commitment, and current source information. A short website summary cannot replace the full approved participant information, risks, and eligibility criteria.',
            'If you are helping a family member, discuss their preferences and permission. Do not submit someone else’s medical details here.',
          ],
        },
        {
          id: 'ask',
          title: '2. Talk with the research team',
          paragraphs: [
            'An approved enquiry route is not available on this draft yet. Once it is ready, the team can explain the study, answer questions, and discuss whether an approved screening process is appropriate.',
            'Please do not use GitHub issues for participant enquiries. No contact or health information is collected by this website.',
          ],
        },
        {
          id: 'decide',
          title: '3. Take time to decide',
          paragraphs: [
            'The study team explains participation, possible risks and benefits, alternatives, and the consent process. You may ask questions and discuss the decision with people you trust.',
            'Participation is voluntary. A website enquiry is not consent to research, and no personal benefit or place in a study is guaranteed.',
          ],
        },
      ],
      sources: [
        {
          label: 'Israel Ministry of Health: participating in clinical trials',
          url: 'https://me.health.gov.il/en/older-adult/services-rights/living-with-a-condition/treatments/clinical-trials/',
        },
      ],
    },
    publications: {
      title: 'Evidence behind the questions.',
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
      title: 'Privacy, by keeping things simple.',
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
      title: 'Designed to be easier to use.',
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
      title: 'האדם השלם. התמונה הרחבה.',
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
            'המחברים מציינים צורך בתיקוף נוסף. ממצאים ראשוניים אינם אישור רגולטורי ואינם תחליף להערכה קלינית. אתר פלטפורמת 6 Vital מתאר כלי מדידה קוגניטיבית וכלים למטופלים ולמטפלים.',
          ],
        },
        {
          id: 'collaboration',
          title: 'נקודת פתיחה לשיתוף פעולה',
          paragraphs: [
            'הפרופיל הציבורי של המחקר מחבר בין אפידמיולוגיה קלינית, אנדוקרינולוגיה, הערכה קוגניטיבית ותפקוד גופני. אפשר לעיין בפרסומים ובפרופיל המוסדי כדי לזהות תחומי עניין משותפים.',
            'פרטי קשר ייעודיים ומידע על הזדמנויות לסטודנטים עדיין ממתינים לאישור. אין כאן הודעה על משרות או על מימון זמין.',
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
      title: 'למצוא את השאלה שחשובה לכם.',
      intro:
        'היכרות ראשונית עם מחקרים הרשומים במקורות ציבוריים. סטטוס ברישום אינו מבטיח זמינות נוכחית; הצוות צריך לאשר את הצעד הבא.',
      sections: [],
    },
    about: {
      title: 'סקרנות משותפת. מחקר מחובר.',
      intro:
        'הקבוצה מרכזת את המחקר בהובלת פרופ׳ טלי צוקרמן־יפה במסגרות קליניות, אקדמיות ודיגיטליות.',
      sections: [
        {
          id: 'tali',
          title: 'פרופ׳ טלי צוקרמן־יפה',
          paragraphs: [
            'טלי היא אנדוקרינולוגית ואפידמיולוגית קלינית. המחקר שלה, כפי שמתואר במקורות הציבוריים, מתמקד בסוכרת, בתפקוד קוגניטיבי ובאתגרי הטיפול בגיל המבוגר.',
            'הביוגרפיות המוסדיות מתארות ניהול של המרכז להזדקנות מוצלחת עם סוכרת בשיבא ושל השירות לאנדוקרינולוגיה ולסוכרת בנשים ובהיריון. הניסוח והתארים העדכניים עדיין ממתינים לבדיקה שלה.',
          ],
        },
        {
          id: 'connections',
          title: 'בין ארגונים, סביב שאלות משותפות',
          paragraphs: [
            'הקשרים הבאים מתוארים בפרופילים מוסדיים ציבוריים. אלו תפקידים נפרדים, ואין בכך טענה שטיוטה זו היא אתר רשמי של מוסד כלשהו.',
          ],
          bullets: [
            'אוניברסיטת תל אביב: מינוי כפרופסור חבר בבריאות הציבור ובאפידמיולוגיה, לפי הפרופיל המוסדי.',
            'המרכז הרפואי שיבא: עבודה קלינית ומחקרית בסוכרת ובהזדקנות, לצד אנדוקרינולוגיה בנשים.',
            'PHRI: עמיתה בין־לאומית בכירה.',
            'מכון קואנקה: מופיעה בחבר המנהלים; מכון הרצג לחקר ההזדקנות: חברות המתוארת בביוגרפיה באוניברסיטה.',
          ],
        },
        {
          id: 'six-vital',
          title: '6 Vital: חלק מהעשייה הדיגיטלית',
          paragraphs: [
            'בעל הפרויקט מציין ש־6 Vital היא פלטפורמה שטלי יצרה. האתר הציבורי מתאר מדידה קוגניטיבית דיגיטלית, כלים לניהול ולתמיכה במטופלים ובמטפלים, ואפליקציה למטופלים.',
            'הקשר המדויק למחקרים, הבעלות, סטטוס המוצרים וכתובת האתר המועדפת דורשים אישור לפני השקה. הפלטפורמה אינה שירות ההרשמה או הטיפול הרפואי של אתר זה.',
          ],
        },
        {
          id: 'people',
          title: 'האנשים שמאחורי המחקר',
          paragraphs: [
            'רשימת צוות מאושרת, תמונות, מידע על הנחיה והזדמנויות יצורפו כאשר יהיו זמינים. לא המצאנו חברי צוות ולא פרסמנו מודעת גיוס שלא אושרה.',
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
      title: 'חיבור ברור יותר למחקר.',
      intro:
        'לצוותים רפואיים ולשותפים המסייעים לאנשים להכיר מחקרים. דרך טיוטה זו משתפים מידע על המחקר, לא מידע על מטופלים.',
      sections: [
        {
          id: 'referrals',
          title: 'שוקלים להפנות מטופל או מטופלת?',
          paragraphs: [
            'מומלץ להתחיל ברישום הרשמי ובקריטריונים המלאים של המחקר הרלוונטי. קריטריונים כלליים המופיעים באתר הם נקודת פתיחה בלבד, לא קביעה של התאמה.',
            'בהסכמת המטופל או המטופלת, אפשר לשתף עמם את המידע על המחקר. צוות המחקר צריך לאשר זמינות עדכנית ולהשתמש בתהליך המאושר לבדיקת התאמה ולהסכמה מדעת.',
          ],
          bullets: [
            'אין להעביר שמות, אבחנות, הפניות או מסמכים רפואיים באתר או ב־GitHub.',
            'מסלול הפניה מאובטח ופרטי קשר מקצועיים עדיין ממתינים לאישור המוסד.',
            'מחקר שהושלם אינו פתוח להפניות לצורך השתתפות.',
          ],
        },
        {
          id: 'partners',
          title: 'שותפויות אקדמיות ומחקריות',
          paragraphs: [
            'העשייה מחברת בין אפידמיולוגיה קלינית, סוכרת, קוגניציה, תפקוד גופני והערכה דיגיטלית. הפרסומים והפרופילים המוסדיים הם נקודת פתיחה מבוססת מקורות לשיתוף פעולה.',
            'פרטי קשר ייעודיים יתווספו לאחר אישור. לקבלת שירות רפואי יש להשתמש בערוץ הרשמי של בית החולים, ולא בטיוטת אתר המידע.',
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
      title: 'קודם כול, השאלות שלכם.',
      intro:
        'קריאה על מחקר אינה מחייבת השתתפות. פנייה אינה הרשמה למחקר ואינה הסכמה מדעת.',
      sections: [
        {
          id: 'learn',
          title: '1. להכיר את המחקר',
          paragraphs: [
            'קראו על מטרת המחקר, המיקום, הזמן והפעולות הנדרשים והמידע העדכני במקור. סיכום קצר באתר אינו מחליף את המידע המאושר המלא, הסיכונים וקריטריוני ההתאמה.',
            'אם אתם מסייעים לבן או לבת משפחה, שוחחו על רצונם וקבלו את רשותם. אין לשלוח כאן מידע רפואי על אדם אחר.',
          ],
        },
        {
          id: 'ask',
          title: '2. לדבר עם צוות המחקר',
          paragraphs: [
            'בטיוטה זו עדיין אין מסלול פנייה מאושר. כאשר יופעל מסלול כזה, הצוות יוכל להסביר על המחקר, לענות על שאלות ולדון בתהליך המאושר לבדיקת התאמה.',
            'אין להשתמש בפניות GitHub לצורך השתתפות. האתר אינו אוסף פרטי קשר או מידע רפואי.',
          ],
        },
        {
          id: 'decide',
          title: '3. לקחת זמן להחליט',
          paragraphs: [
            'צוות המחקר מסביר את פרטי ההשתתפות, הסיכונים והתועלת האפשריים, החלופות ותהליך ההסכמה. אפשר לשאול שאלות ולהתייעץ עם אנשים שאתם סומכים עליהם.',
            'ההשתתפות היא מרצון. פנייה באתר אינה הסכמה למחקר, ואין הבטחה לתועלת אישית או למקום במחקר.',
          ],
        },
      ],
      sources: [
        {
          label: 'משרד הבריאות: השתתפות במחקרים קליניים',
          url: 'https://me.health.gov.il/older-adult/services-rights/living-with-a-condition/treatments/clinical-trials/',
        },
      ],
    },
    publications: {
      title: 'הראיות שמאחורי השאלות.',
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
      title: 'פרטיות מתחילה בפשטות.',
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
      title: 'נועד להיות פשוט יותר לשימוש.',
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
