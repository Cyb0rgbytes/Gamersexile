import type { LegalDoc } from "./types";

/* Privacy & Cookie Policy. Describes the site as it runs today: accounts
 * (Clerk), teams, clips, reactions and reports (Cloudflare D1/R2), request
 * logs, and only strictly necessary cookies. Update it BEFORE adding any new
 * data type, vendor, payment, analytics or AI feature. */

export const privacyEn: LegalDoc = {
  eyebrow: "Privacy",
  title: "Privacy & Cookie Policy",
  lead: "What Gamers Exile collects, why, who it is shared with, and the choices you have.",
  metaDescription:
    "How Gamers Exile handles your personal data and cookies: what we collect, why, who we share it with, how long we keep it and your rights.",
  updatedLabel: "Last updated",
  contentsLabel: "Contents",
  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      blocks: [
        {
          p: "Gamers Exile (gamersexile.net and gamersexile.org) is a gaming community site run by the Gamers Exile team. We decide how your personal data is used, which makes us its \"controller\". The company that operates the site is being registered; its name and address will be added here as soon as it is.",
        },
        { p: "For anything about your data, email hello@gamersexile.net." },
      ],
    },
    {
      id: "age",
      heading: "Who can use Gamers Exile",
      blocks: [
        {
          p: "Gamers Exile is for people aged 18 or over. If we learn that an account belongs to someone younger, we close it and delete its data.",
        },
      ],
    },
    {
      id: "what-we-collect",
      heading: "What we collect and why",
      blocks: [
        {
          table: {
            head: ["Data", "Why we use it", "Legal basis", "How long we keep it"],
            rows: [
              [
                "Account: email address, how you sign in (Discord, Google, Twitch or email), and the username, name and profile picture that sign-in provides",
                "To create your account and keep it secure",
                "Contract",
                "While your account is open; deleted within 30 days of closing it",
              ],
              [
                "Profile: display name, avatar, and the Discord username you add",
                "To show who posted a clip or joined a team. Your Discord username is shown only to members of your teams",
                "Contract",
                "While your account is open, or until you remove it",
              ],
              [
                "Teams: teams you create or join, your role, invite links",
                "To run teams",
                "Contract",
                "Until the team is disbanded; invite links expire after 1 to 30 days",
              ],
              [
                "Clips: the videos and poster images you upload, their title, game, size and length",
                "To publish your highlights",
                "Contract",
                "Until you or a moderator delete them; unfinished uploads are removed after 1 day",
              ],
              [
                "Reactions and reports you make",
                "To show reactions and keep the community safe",
                "Contract; legitimate interests (safety)",
                "While the clip exists",
              ],
              [
                "Technical data: IP address, browser and request details, error logs",
                "Security, preventing abuse and fixing faults",
                "Legitimate interests",
                "Up to 30 days",
              ],
            ],
          },
        },
        {
          p: "We do not sell your personal data, show advertising, or use analytics or tracking tools. We do not make decisions about you based solely on automated processing.",
        },
        {
          p: "The leaderboard shows the public ranking of our Discord server as published by MEE6 (usernames, avatars, levels and XP). MEE6 controls that data; to change what it publishes, use your MEE6 or Discord settings or contact MEE6.",
        },
      ],
    },
    {
      id: "sharing",
      heading: "Who we share data with",
      blocks: [
        {
          table: {
            head: ["Who", "What for", "Where"],
            rows: [
              ["Clerk", "Sign-in and account management", "United States"],
              ["Cloudflare", "Hosting, database, file storage and security", "Global network"],
              [
                "Discord, Google, Twitch",
                "Only if you sign in with them: they confirm who you are and share your basic profile with us",
                "Their own locations",
              ],
              ["Authorities", "Only when the law requires it", "The country concerned"],
            ],
          },
        },
        { p: "Clerk and Cloudflare process data on our behalf under their data processing terms." },
      ],
    },
    {
      id: "transfers",
      heading: "International transfers",
      blocks: [
        {
          p: "Your data may be processed outside your country, including in the United States. For people in the EU, the EEA and the UK, we rely on the EU-US Data Privacy Framework where the provider is certified, and otherwise on the European Commission's Standard Contractual Clauses. For people in Saudi Arabia, Egypt and other countries with their own transfer rules, we rely on the safeguards those laws allow.",
        },
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      blocks: [
        {
          list: [
            "See the personal data we hold about you and get a copy",
            "Correct data that is wrong",
            "Delete your account and the data linked to it",
            "Receive your data in a portable format",
            "Object to or restrict how we use it",
            "Withdraw consent at any time, where we rely on consent",
            "Complain to a data protection authority",
          ],
        },
        {
          p: "To use any of these rights, email hello@gamersexile.net from the address on your account. We reply within one month. Deleting your account removes your profile, your clips and your team memberships; teams you captain must first be handed over or disbanded.",
        },
        {
          p: "You can complain to your local data protection authority in the EU, the UAE Data Office, the Saudi Data and AI Authority (SDAIA), Egypt's Personal Data Protection Centre, or the authority in your country.",
        },
      ],
    },
    {
      id: "security",
      heading: "Security",
      blocks: [
        {
          p: "Connections to the site are encrypted, access to data is limited to the people who run the site, and uploaded files are checked and stored privately. If a breach is likely to put you at risk, we will tell you and the relevant authorities within the time the law requires.",
        },
      ],
    },
    {
      id: "cookies",
      heading: "Cookies",
      blocks: [
        { p: "Gamers Exile uses only cookies that are strictly necessary for the site to work:" },
        {
          table: {
            head: ["Cookie", "Set by", "Purpose", "Lasts"],
            rows: [
              ["ge_lang", "Gamers Exile", "Remembers the language you chose", "1 year"],
              ["__session, __client_uat, __clerk_*", "Clerk", "Keeps you signed in securely", "Session to 1 year"],
              ["__cf_bm, cf_clearance", "Cloudflare", "Protection against bots and attacks", "Up to 1 year"],
            ],
          },
        },
        {
          p: "Because these cookies are strictly necessary, we don't ask for consent. We use no analytics, advertising or tracking cookies. If that ever changes, we will ask first, with Accept and Reject options of equal weight, and load nothing optional before you choose.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      blocks: [
        {
          p: "We will post any update here and change the date at the top. For significant changes, we will also announce them on the site or on our Discord before they take effect.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [{ p: "Questions or requests: hello@gamersexile.net" }],
    },
  ],
};

export const privacyAr: LegalDoc = {
  eyebrow: "الخصوصية",
  title: "سياسة الخصوصية وملفات تعريف الارتباط",
  lead: "ما الذي يجمعه Gamers Exile، ولماذا، ومع من نشاركه، وما الخيارات المتاحة لك.",
  metaDescription:
    "كيف يتعامل Gamers Exile مع بياناتك الشخصية وملفات تعريف الارتباط: ما نجمعه، ولماذا، ومع من نشاركه، ومدة الاحتفاظ به، وحقوقك.",
  updatedLabel: "آخر تحديث",
  contentsLabel: "المحتويات",
  sections: [
    {
      id: "who-we-are",
      heading: "من نحن",
      blocks: [
        {
          p: "Gamers Exile (gamersexile.net وgamersexile.org) موقع لمجتمع الألعاب يديره فريق Gamers Exile. نحن من يحدد كيفية استخدام بياناتك الشخصية، أي أننا \"المتحكم\" فيها. الشركة المشغّلة للموقع قيد التسجيل، وسنضيف اسمها وعنوانها هنا فور اكتمال ذلك.",
        },
        { p: "لأي أمر يخص بياناتك، راسلنا على hello@gamersexile.net" },
      ],
    },
    {
      id: "age",
      heading: "من يحق له استخدام الموقع",
      blocks: [
        {
          p: "Gamers Exile مخصص لمن بلغوا 18 عامًا فأكثر. إذا تبيّن لنا أن حسابًا يعود لشخص أصغر سنًا، نغلقه ونحذف بياناته.",
        },
      ],
    },
    {
      id: "what-we-collect",
      heading: "البيانات التي نجمعها ولماذا",
      blocks: [
        {
          table: {
            head: ["البيانات", "سبب استخدامها", "الأساس القانوني", "مدة الاحتفاظ"],
            rows: [
              [
                "الحساب: البريد الإلكتروني، وطريقة تسجيل الدخول (Discord أو Google أو Twitch أو البريد الإلكتروني)، واسم المستخدم والاسم والصورة التي توفرها تلك الخدمة",
                "إنشاء حسابك وحمايته",
                "العقد",
                "طوال مدة الحساب، وتُحذف خلال 30 يومًا من إغلاقه",
              ],
              [
                "الملف الشخصي: الاسم الظاهر والصورة الرمزية واسم المستخدم في Discord الذي تضيفه",
                "إظهار صاحب المقطع أو عضو الفريق. لا يرى اسمك في Discord إلا أعضاء فرقك",
                "العقد",
                "طوال مدة الحساب أو حتى تحذفه",
              ],
              [
                "الفرق: الفرق التي تنشئها أو تنضم إليها، ودورك فيها، وروابط الدعوة",
                "إدارة الفرق",
                "العقد",
                "حتى حلّ الفريق، وتنتهي روابط الدعوة بعد يوم إلى 30 يومًا",
              ],
              [
                "المقاطع: الفيديوهات وصور الغلاف التي ترفعها، وعناوينها، واللعبة، والحجم والمدة",
                "نشر لقطاتك",
                "العقد",
                "حتى تحذفها أنت أو المشرف، وتُحذف عمليات الرفع غير المكتملة بعد يوم واحد",
              ],
              [
                "التفاعلات والبلاغات التي تقدمها",
                "إظهار التفاعلات وحماية المجتمع",
                "العقد؛ المصلحة المشروعة (السلامة)",
                "ما دام المقطع موجودًا",
              ],
              [
                "البيانات التقنية: عنوان IP، وتفاصيل المتصفح والطلبات، وسجلات الأخطاء",
                "الأمان ومنع الإساءة وإصلاح الأعطال",
                "المصلحة المشروعة",
                "حتى 30 يومًا",
              ],
            ],
          },
        },
        {
          p: "لا نبيع بياناتك الشخصية، ولا نعرض إعلانات، ولا نستخدم أدوات تحليل أو تتبع. ولا نتخذ قرارات بشأنك تعتمد على المعالجة الآلية وحدها.",
        },
        {
          p: "تعرض لوحة الصدارة الترتيب العام لخادم Discord الخاص بنا كما ينشره MEE6 (أسماء المستخدمين والصور الرمزية والمستويات ونقاط الخبرة). يتحكم MEE6 في هذه البيانات، ولتغيير ما ينشره استخدم إعدادات MEE6 أو Discord أو تواصل مع MEE6.",
        },
      ],
    },
    {
      id: "sharing",
      heading: "مع من نشارك البيانات",
      blocks: [
        {
          table: {
            head: ["الجهة", "الغرض", "المكان"],
            rows: [
              ["Clerk", "تسجيل الدخول وإدارة الحسابات", "الولايات المتحدة"],
              ["Cloudflare", "الاستضافة وقاعدة البيانات وتخزين الملفات والحماية", "شبكة عالمية"],
              [
                "Discord وGoogle وTwitch",
                "فقط إذا سجّلت الدخول عبرها: تؤكد هويتك وتشاركنا ملفك الأساسي",
                "مواقعها الخاصة",
              ],
              ["الجهات الرسمية", "فقط عندما يفرض القانون ذلك", "الدولة المعنية"],
            ],
          },
        },
        { p: "تعالج Clerk وCloudflare البيانات نيابة عنا وفق شروط معالجة البيانات الخاصة بكل منهما." },
      ],
    },
    {
      id: "transfers",
      heading: "نقل البيانات خارج بلدك",
      blocks: [
        {
          p: "قد تُعالَج بياناتك خارج بلدك، بما في ذلك في الولايات المتحدة. لمستخدمي الاتحاد الأوروبي والمنطقة الاقتصادية الأوروبية والمملكة المتحدة، نعتمد إطار خصوصية البيانات بين الاتحاد الأوروبي والولايات المتحدة إن كان المزوّد معتمدًا فيه، وإلا فالبنود التعاقدية القياسية الصادرة عن المفوضية الأوروبية. ولمستخدمي المملكة العربية السعودية ومصر وغيرهما من الدول التي لديها قواعد خاصة بالنقل، نعتمد الضمانات التي تسمح بها تلك القوانين.",
        },
      ],
    },
    {
      id: "rights",
      heading: "حقوقك",
      blocks: [
        {
          list: [
            "الاطلاع على بياناتك الشخصية لدينا والحصول على نسخة منها",
            "تصحيح البيانات غير الدقيقة",
            "حذف حسابك والبيانات المرتبطة به",
            "الحصول على بياناتك بصيغة قابلة للنقل",
            "الاعتراض على استخدامها أو تقييده",
            "سحب موافقتك في أي وقت عندما نعتمد على الموافقة",
            "تقديم شكوى إلى جهة حماية البيانات",
          ],
        },
        {
          p: "لممارسة أي من هذه الحقوق، راسلنا على hello@gamersexile.net من البريد المسجّل في حسابك، وسنرد خلال شهر. يؤدي حذف الحساب إلى حذف ملفك الشخصي ومقاطعك وعضويتك في الفرق، ويجب أولًا تسليم قيادة الفرق التي تقودها أو حلّها.",
        },
        {
          p: "يمكنك تقديم شكوى إلى جهة حماية البيانات المحلية في الاتحاد الأوروبي، أو مكتب الإمارات للبيانات، أو الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)، أو مركز حماية البيانات الشخصية في مصر، أو الجهة المختصة في بلدك.",
        },
      ],
    },
    {
      id: "security",
      heading: "الأمان",
      blocks: [
        {
          p: "الاتصال بالموقع مشفّر، والوصول إلى البيانات مقصور على القائمين على الموقع، والملفات المرفوعة تُفحص وتُخزَّن بشكل خاص. إذا وقع اختراق يُرجَّح أن يعرّضك للخطر، نبلغك ونبلغ الجهات المختصة خلال المهلة التي يحددها القانون.",
        },
      ],
    },
    {
      id: "cookies",
      heading: "ملفات تعريف الارتباط",
      blocks: [
        { p: "يستخدم Gamers Exile ملفات تعريف الارتباط الضرورية فقط لعمل الموقع:" },
        {
          table: {
            head: ["الملف", "مصدره", "الغرض", "المدة"],
            rows: [
              ["ge_lang", "Gamers Exile", "يتذكّر اللغة التي اخترتها", "سنة واحدة"],
              ["__session و__client_uat و__clerk_*", "Clerk", "يبقيك مسجّل الدخول بأمان", "من مدة الجلسة حتى سنة"],
              ["__cf_bm وcf_clearance", "Cloudflare", "الحماية من الروبوتات والهجمات", "حتى سنة"],
            ],
          },
        },
        {
          p: "لأن هذه الملفات ضرورية، لا نطلب موافقتك عليها. ولا نستخدم ملفات للتحليلات أو الإعلانات أو التتبع. وإذا تغيّر ذلك يومًا، سنطلب موافقتك أولًا بخياري قبول ورفض متساويين، ولن نحمّل أي ملف اختياري قبل أن تختار.",
        },
      ],
    },
    {
      id: "changes",
      heading: "التعديلات على هذه السياسة",
      blocks: [
        {
          p: "ننشر أي تحديث هنا ونغيّر التاريخ في أعلى الصفحة. وفي حال التعديلات الجوهرية، نعلن عنها أيضًا على الموقع أو على Discord قبل سريانها.",
        },
      ],
    },
    {
      id: "contact",
      heading: "التواصل",
      blocks: [{ p: "للأسئلة أو الطلبات: hello@gamersexile.net" }],
    },
  ],
};
