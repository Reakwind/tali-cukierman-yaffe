import type { Locale } from '../i18n/ui';

export interface TeamMember {
  id: string;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  bio: Record<Locale, string>;
  photo?: {
    src: string;
    alt: Record<Locale, string>;
    credit: Record<Locale, string>;
    /** CSS object-position for framing the portrait in its circular crop. */
    position: string;
  };
}

/**
 * Drafted 2026-10-31 from official public sources (TAU, Sheba, Cuenca Institute,
 * registry/conference records). Content and translations await each person's
 * review. No contact details: enquiries are not enabled on this draft.
 */
export const team: TeamMember[] = [
  {
    id: 'tali',
    name: {
      en: 'Prof. Tali Cukierman-Yaffe',
      he: 'פרופ׳ טלי צוקרמן־יפה',
    },
    role: {
      en: 'Head of the research group · Endocrinologist and clinical epidemiologist',
      he: 'ראשת קבוצת המחקר · אנדוקרינולוגית ואפידמיולוגית קלינית',
    },
    bio: {
      en: 'Prof. Tali Cukierman-Yaffe is an endocrinologist and clinical epidemiologist. She heads the Centre for Successful Aging with Diabetes at Sheba Medical Center and is an Associate Professor in the Department of Epidemiology at the Gray Faculty of Medical and Health Sciences, Tel Aviv University, where she is a member of the Herczeg Institute on Aging. She also serves on the board of the Cuenca Institute. Her research addresses the challenges of treating diabetes in older age, including cognitive sub-studies of major cardiovascular trials in people with diabetes and technological tools for assessing cognitive and physical function. She leads the group’s studies — STAY-STRONG, GRACE-780G, and a BIRAX-funded project developing a machine-learning platform for physical-function assessment — and was part of the international multidisciplinary panel behind the 2026 “Sarcopenia in Diabetes” consensus. She is also a Senior International Fellow at the Population Health Research Institute, McMaster University, and scientific lead of the International Geriatric Diabetes Society.',
      he: 'פרופ׳ טלי צוקרמן־יפה היא אנדוקרינולוגית ואפידמיולוגית קלינית. היא עומדת בראש המרכז להזדקנות מוצלחת עם סוכרת במרכז הרפואי שיבא ומכהנת כפרופסור חבר במחלקה לאפידמיולוגיה בפקולטה למדעי הרפואה והבריאות ע״ש גריי באוניברסיטת תל אביב, וחברה במכון הרצוג לחקר ההזדקנות. כמו כן, היא חברה בוועד המנהל של מכון קואנקה. מחקריה מתמקדים באתגרי הטיפול בסוכרת בגיל המבוגר, ובכלל זה הובלת תת־מחקרים קוגניטיביים במחקרים קליניים גדולים ופיתוח כלים טכנולוגיים להערכת התפקוד הקוגניטיבי והגופני. היא מובילה את מחקרי הקבוצה — STAY-STRONG, GRACE-780G ופרויקט במימון BIRAX לפיתוח פלטפורמת למידת מכונה להערכה תפקודית — ושותפה בוועדת מומחים בינלאומית שגיבשה מסמך קונצנזוס בנושא סרקופניה בסוכרת (2026). בנוסף, היא עמיתה בכירה בינלאומית במכון לחקר בריאות האוכלוסייה באוניברסיטת מקמאסטר שבהמילטון, קנדה, ומובילה את התחום המדעי של האגודה הבינלאומית לגריאטריה וסוכרת.',
    },
    photo: {
      src: '/images/team/tali.jpg',
      alt: {
        en: 'Portrait of Prof. Tali Cukierman-Yaffe',
        he: 'דיוקן של פרופ׳ טלי צוקרמן־יפה',
      },
      credit: {
        en: 'Photo: Cuenca Institute',
        he: 'צילום: מכון קואנקה',
      },
      position: '50% 18%',
    },
  },
  {
    id: 'naama',
    name: {
      en: 'Dr. Naama Peltz-Sinvani',
      he: 'ד״ר נעמה פלץ סינואני',
    },
    role: {
      en: 'Endocrinologist · Head of the Clinical Research Unit, Division of Endocrinology, Diabetes and Metabolism, Sheba Medical Center',
      he: 'אנדוקרינולוגית · ראש היחידה למחקר קליני במכון לאנדוקרינולוגיה, סוכרת ומטבוליזם, המרכז הרפואי שיבא',
    },
    bio: {
      en: 'Dr. Naama Peltz-Sinvani is an endocrinologist at Sheba Medical Center, where she heads the Clinical Research Unit of the Division of Endocrinology, Diabetes and Metabolism. She completed a dedicated fellowship in sarcopenia and serves as the division’s lead physician for sarcopenia research, clinical assessment, and management. She is a co-investigator on the group’s research in older adults with diabetes, including the GRACE-780G trial and studies of cognitive function and physical capacity in type 1 diabetes, and she is an endocrinologist on the medical staff of Sheba Longevity.',
      he: 'ד״ר נעמה פלץ סינואני היא אנדוקרינולוגית במרכז הרפואי שיבא ועומדת בראש היחידה למחקר קליני במכון לאנדוקרינולוגיה, סוכרת ומטבוליזם. היא בוגרת השתלמות עמיתים (פלושיפ) ייעודית בתחום הסרקופניה ומשמשת הרופאה המובילה ביחידה למחקר סרקופניה, להערכה קלינית ולניהול הטיפול. היא חוקרת במחקרי הקבוצה בגיל המבוגר עם סוכרת, ובהם מחקר GRACE-780G ומחקרים על התפקוד הקוגניטיבי והיכולת הגופנית בסוכרת סוג 1, ומשמשת גם אנדוקרינולוגית בצוות הרפואי של מרכז שיבא לונג׳ביטי.',
    },
    photo: {
      src: '/images/team/naama.webp',
      alt: {
        en: 'Portrait of Dr. Naama Peltz-Sinvani',
        he: 'דיוקן של ד״ר נעמה פלץ סינואני',
      },
      credit: {
        en: 'Photo: Sheba Longevity',
        he: 'צילום: שיבא לונג׳ביטי',
      },
      position: '45% 35%',
    },
  },
  {
    id: 'hagar',
    name: {
      en: 'Hagar Shimon',
      he: 'הגר שמעון',
    },
    role: {
      en: 'Research coordinator and PhD candidate',
      he: 'רכזת מחקר ודוקטורנטית',
    },
    bio: {
      en: 'Hagar Shimon is a research coordinator at the Centre for Successful Aging with Diabetes at Sheba Medical Center and a PhD candidate at Tel Aviv University’s School of Public Health. She is the first author of the GRACE-780G results abstract, presented in a late-breaking oral session at the 2026 EASD Annual Meeting, and a member of the study teams working on sarcopenia, nutrition, and physical function in older adults with diabetes. She has spoken on nutrition for muscle preservation at a 2026 Israel Endocrine Society session on emerging sarcopenia therapies and coauthored work from the multidisciplinary “Diabetes 360” clinic for older adults with type 2 diabetes.',
      he: 'הגר שמעון היא רכזת מחקר במרכז להזדקנות מוצלחת עם סוכרת במרכז הרפואי שיבא ודוקטורנטית בבית הספר לבריאות הציבור באוניברסיטת תל אביב. היא הכותבת הראשית של תקציר תוצאות מחקר GRACE-780G, שהוצג במושב הרצאות קצרות בכנס השנתי של האגודה האירופית לחקר הסוכרת (EASD 2026), וחברה בצוותי המחקר העוסקים בסרקופניה, בתזונה ובתפקוד הגופני בגיל המבוגר עם סוכרת. היא הרצתה על תזונה לשמירה על מסת השריר ביום עיון של האיגוד הישראלי לאנדוקרינולוגיה שהוקדש לטיפולים חדשים בסרקופניה, ושותפה לפרסומים ממרפאת ״סוכרת 360״ הרב־תחומית למבוגרים עם סוכרת סוג 2.',
    },
  },
  {
    id: 'yasmin',
    name: {
      en: 'Yasmin Alt',
      he: 'יסמין אלט',
    },
    role: {
      en: 'Research coordinator',
      he: 'רכזת מחקר',
    },
    bio: {
      en: 'Yasmin Alt is a research coordinator at the Centre for Successful Aging with Diabetes at Sheba Medical Center. She is a member of the study teams for GRACE-780G and for research on cognitive function and physical capacity in older adults with type 1 diabetes.',
      he: 'יסמין אלט היא רכזת מחקר במרכז להזדקנות מוצלחת עם סוכרת במרכז הרפואי שיבא. היא חברה בצוותי המחקר של GRACE-780G ושל מחקר על התפקוד הקוגניטיבי והיכולת הגופנית בגיל המבוגר עם סוכרת סוג 1.',
    },
  },
  {
    id: 'tal',
    name: {
      en: 'Tal Yahalom-Peri',
      he: 'טל יהלום פרי',
    },
    role: {
      en: 'PhD candidate',
      he: 'דוקטורנטית',
    },
    bio: {
      en: 'Tal Yahalom-Peri is a PhD candidate at the School of Public Health, Tel Aviv University, conducting her research at Sheba Medical Center under the supervision of Prof. Tali Cukierman-Yaffe. With more than 25 years of experience as a physical-activity specialist, she lectures to undergraduate physical-education students and fitness professionals. Her research evaluates a combined exercise and nutritional intervention on muscle mass, strength, and physical function in older adults with type 2 diabetes and obesity treated with semaglutide — the STAY-STRONG randomized controlled trial — and she has published on movement patterns, physical function, and metabolic health in aging populations with type 2 diabetes. She received the Cuenca Institute Excellence Scholarship in 2026 for her STAY-STRONG research.',
      he: 'טל יהלום פרי היא דוקטורנטית בבית הספר לבריאות הציבור באוניברסיטת תל אביב ועורכת את מחקרה במרכז הרפואי שיבא בהנחיית פרופ׳ טלי צוקרמן־יפה. היא בעלת ניסיון של יותר מ־25 שנה כמומחית לפעילות גופנית, ומרצה לסטודנטים לחינוך גופני ולאנשי מקצוע בתחום הכושר הגופני. מחקרה בוחן את השפעתן של התערבות משולבת של פעילות גופנית ותזונה על מסת השריר, על הכוח ועל התפקוד הגופני בקרב מבוגרים עם סוכרת סוג 2 והשמנה המטופלים בסמגלוטיד — במחקר STAY-STRONG — ופרסמה מחקרים על דפוסי תנועה, תפקוד גופני ובריאות מטבולית בגיל המבוגר עם סוכרת סוג 2. היא זכתה במלגת הצטיינות של מכון קואנקה לשנת 2026 על מחקרה במסגרת STAY-STRONG.',
    },
    photo: {
      src: '/images/team/tal.jpg',
      alt: {
        en: 'Portrait of Tal Yahalom-Peri',
        he: 'דיוקן של טל יהלום פרי',
      },
      credit: {
        en: 'Photo: Cuenca Institute',
        he: 'צילום: מכון קואנקה',
      },
      position: '50% 22%',
    },
  },
  {
    id: 'itay',
    name: {
      en: 'Itay Cohen',
      he: 'איתי כהן',
    },
    role: {
      en: 'MSc student in epidemiology · Expert rehabilitation psychologist',
      he: 'סטודנט לתואר שני באפידמיולוגיה · פסיכולוג שיקומי מומחה',
    },
    bio: {
      en: 'Itay Cohen is an expert rehabilitation psychologist and an MSc student in epidemiology at the School of Public Health, Tel Aviv University, supervised by Prof. Tali Cukierman-Yaffe. His thesis, conducted at the Centre for Successful Aging with Diabetes at Sheba Medical Center, validates a digital self-administered version of the Digit Symbol Substitution Test (DSST) as an accessible screening tool for identifying cognitive decline among older adults with type 1 diabetes. His work combines neuropsychological assessment, clinical research, and digital health, with the aim of enabling routine cognitive screening in diabetes clinics. He received the Cuenca Institute Research Scholarship in 2026 and has presented posters at two Cuenca Institute conferences.',
      he: 'איתי כהן הוא פסיכולוג שיקומי מומחה וסטודנט לתואר שני באפידמיולוגיה בבית הספר לבריאות הציבור באוניברסיטת תל אביב, בהנחיית פרופ׳ טלי צוקרמן־יפה. עבודת התזה שלו, המתבצעת במרכז להזדקנות מוצלחת עם סוכרת בשיבא, מתקפת גרסה דיגיטלית למילוי עצמי של מבחן ה־DSST ככלי סקר נגיש לאיתור ירידה קוגניטיבית בקרב מבוגרים עם סוכרת סוג 1 — סיבוך שכיח שלרוב אינו מאובחן ופוגע ביכולת הטיפול העצמי. עבודתו משלבת אבחון נוירופסיכולוגי, מחקר קליני ובריאות דיגיטלית, מתוך כוונה לאפשר סקר קוגניטיבי שגרתי במרפאות סוכרת. הוא זכה במלגת המחקר של מכון קואנקה לשנת 2026 והציג פוסטרים בשני כנסי המכון.',
    },
    photo: {
      src: '/images/team/itay.png',
      alt: {
        en: 'Portrait of Itay Cohen',
        he: 'דיוקן של איתי כהן',
      },
      credit: {
        en: 'Photo: Cuenca Institute',
        he: 'צילום: מכון קואנקה',
      },
      position: '50% 50%',
    },
  },
];
