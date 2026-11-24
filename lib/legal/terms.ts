import type { LegalDoc } from "./types";

/* Terms of Service & Refund Policy. Written for the site as it runs today:
 * everything is free, no purchases, no paid entry, no virtual currency, no
 * prize draws. Rewrite the "free", "tournaments" and "refunds" sections (and
 * get them reviewed) BEFORE adding anything paid. */

export const termsEn: LegalDoc = {
  eyebrow: "Terms",
  title: "Terms of Service & Refund Policy",
  lead: "The rules for using Gamers Exile, and how refunds work.",
  metaDescription:
    "The Gamers Exile terms of service and refund policy: who can join, teams, clips, community rules, moderation and appeals, tournaments and refunds.",
  updatedLabel: "Last updated",
  contentsLabel: "Contents",
  sections: [
    {
      id: "agreement",
      heading: "Agreement",
      blocks: [
        {
          p: "These terms apply when you use gamersexile.net or gamersexile.org (\"Gamers Exile\", \"we\"). By creating an account or using the site, you agree to them and to our Privacy & Cookie Policy. The Gamers Exile Discord server is also governed by Discord's own terms.",
        },
      ],
    },
    {
      id: "eligibility",
      heading: "Who can join",
      blocks: [
        {
          list: [
            "You must be 18 or older.",
            "One account per person. Don't sell, share or transfer accounts.",
            "Keep your sign-in secure; you are responsible for what happens on your account.",
            "Use a name and details that aren't misleading or offensive.",
          ],
        },
      ],
    },
    {
      id: "free",
      heading: "Gamers Exile is free",
      blocks: [
        {
          p: "Everything on Gamers Exile is currently free: membership, teams, clips, reactions and tournaments. We don't sell anything on the site. There are no paid entries, paid random rewards, loot boxes, betting, wagering or virtual currency, and you can't buy, sell or trade anything through the site.",
        },
      ],
    },
    {
      id: "teams",
      heading: "Teams",
      blocks: [
        {
          list: [
            "You can be on one team per game.",
            "The captain can edit the team, remove members, hand over captaincy, create and revoke invite links, and disband the team.",
            "Invite links can expire and have a use limit. Anyone with a valid link can join, so share them carefully.",
            "You need to add your Discord username to join a team. Only members of your teams can see it.",
            "Team names, tags and descriptions must follow the conduct rules below.",
          ],
        },
      ],
    },
    {
      id: "content",
      heading: "Your clips and content",
      blocks: [
        {
          list: [
            "You keep ownership of the clips, names and other content you post.",
            "You give us a non-exclusive, worldwide, royalty-free licence to host, show, copy and share your content on Gamers Exile and our official channels (such as our Discord and social accounts) while it is on the site, plus a reasonable time to remove copies after you delete it.",
            "Only post what you have the right to post. Game footage must follow the publisher's content policy, and don't include music, streams or videos you don't have rights to.",
            "Clips can be up to 45 MB (MP4, WebM or MOV), and each person can upload 10 clips a day.",
            "To report a copyright problem, email hello@gamersexile.net with the work concerned, the clip link, your contact details and a statement that you believe in good faith the use isn't authorised. We act quickly and tell the uploader, who can respond.",
          ],
        },
      ],
    },
    {
      id: "conduct",
      heading: "Conduct",
      blocks: [
        { p: "Respect each other and play fair. On Gamers Exile you must not:" },
        {
          list: [
            "post anything illegal, including child sexual abuse material, terrorist content, or the sale of illegal goods",
            "harass, threaten, dox or attack anyone, including for their religion, ethnicity, nationality, gender or disability",
            "post sexual, nude or graphic violent content",
            "post content that insults religion or offends public morals, or that local law forbids",
            "promote gambling, betting or skin gambling, run scams or phishing, or sell accounts",
            "cheat, exploit, boost, share accounts in competitions, or use fake identities",
            "impersonate staff, creators, brands or other players",
            "spam, use fake accounts, mass-report, or farm reactions",
          ],
        },
      ],
    },
    {
      id: "moderation",
      heading: "Reports, moderation and appeals",
      blocks: [
        {
          list: [
            "Use the Report button on any clip. Reports are anonymous to the person reported. False or bad-faith reports break these terms too.",
            "A clip reported by several members may be hidden automatically until a moderator reviews it.",
            "We may remove content, or restrict, suspend or close accounts, that break these terms or the law.",
            "Where we can, we tell you what we did, why, and which rule applied.",
            "You can appeal any decision within 6 months by emailing hello@gamersexile.net. Someone who wasn't involved in the first decision reviews it.",
          ],
        },
      ],
    },
    {
      id: "tournaments",
      heading: "Tournaments and events",
      blocks: [
        {
          p: "Tournaments and community events are free to enter. Each event's rules, including format, schedule, who can take part and any prizes, are announced on our Discord before it starts. Prizes, if offered, are provided by Gamers Exile or its sponsors, are never funded by players' payments, and can't be exchanged for cash unless the event rules say so. Cheating or breaking the event rules means disqualification.",
        },
      ],
    },
    {
      id: "third-parties",
      heading: "Other services",
      blocks: [
        {
          p: "The site links to and works with services we don't control, such as Discord, MEE6, Clerk, and game publishers and stores. Their own terms and policies apply when you use them.",
        },
      ],
    },
    {
      id: "liability",
      heading: "Availability and liability",
      blocks: [
        {
          p: "We run Gamers Exile with reasonable care, but it is free and provided as available, and we may change or pause features. We are not liable for indirect losses or for events outside our reasonable control. Nothing in these terms limits liability that the law doesn't allow to be limited, or your rights as a consumer.",
        },
      ],
    },
    {
      id: "ending",
      heading: "Closing your account",
      blocks: [
        {
          p: "You can stop using Gamers Exile at any time and ask us to delete your account by emailing hello@gamersexile.net. We may close accounts that seriously or repeatedly break these terms.",
        },
      ],
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      blocks: [
        {
          p: "We will post any update here and change the date at the top. For significant changes, we will give at least 14 days' notice on the site or on our Discord before they take effect.",
        },
      ],
    },
    {
      id: "law",
      heading: "Governing law and disputes",
      blocks: [
        {
          p: "These terms are governed by the laws of the country where the operator of Gamers Exile is established. If you live in the EU or another country whose consumer laws give you rights that can't be waived, you keep those rights and can bring a claim in your local courts. Please contact us first; most issues can be solved quickly.",
        },
      ],
    },
    {
      id: "refunds",
      heading: "Refund policy",
      blocks: [
        { p: "Gamers Exile doesn't sell anything today, so there is nothing to refund." },
        {
          p: "If we ever introduce paid features, we will publish their prices and refund terms here before the first sale. Your legal rights will always apply, including the 14-day right to cancel online purchases in the EU and the UK, and the protections of consumer law in the UAE, Saudi Arabia and other countries.",
        },
        {
          p: "We never charge to enter tournaments or events, and we never ask for payment or passwords by Discord message. If anyone asks you to pay in our name, report it to hello@gamersexile.net.",
        },
      ],
    },
    {
      id: "contact",
      heading: "Contact",
      blocks: [{ p: "Questions about these terms: hello@gamersexile.net" }],
    },
  ],
};

export const termsAr: LegalDoc = {
  eyebrow: "الشروط",
  title: "شروط الخدمة وسياسة الاسترداد",
  lead: "قواعد استخدام Gamers Exile، وكيف يتم الاسترداد.",
  metaDescription:
    "شروط خدمة Gamers Exile وسياسة الاسترداد: من يحق له الانضمام، والفرق، والمقاطع، وقواعد المجتمع، والإشراف والاعتراض، والبطولات والاسترداد.",
  updatedLabel: "آخر تحديث",
  contentsLabel: "المحتويات",
  sections: [
    {
      id: "agreement",
      heading: "الاتفاق",
      blocks: [
        {
          p: "تسري هذه الشروط عند استخدامك gamersexile.net أو gamersexile.org (\"Gamers Exile\" أو \"نحن\"). بإنشاء حساب أو استخدام الموقع، توافق عليها وعلى سياسة الخصوصية وملفات تعريف الارتباط. ويخضع خادم Gamers Exile على Discord أيضًا لشروط Discord الخاصة.",
        },
      ],
    },
    {
      id: "eligibility",
      heading: "من يحق له الانضمام",
      blocks: [
        {
          list: [
            "يجب أن يكون عمرك 18 عامًا فأكثر.",
            "حساب واحد لكل شخص. لا يجوز بيع الحسابات أو مشاركتها أو نقلها.",
            "حافظ على أمان تسجيل دخولك، فأنت مسؤول عما يحدث في حسابك.",
            "استخدم اسمًا وبيانات غير مضللة وغير مسيئة.",
          ],
        },
      ],
    },
    {
      id: "free",
      heading: "Gamers Exile مجاني",
      blocks: [
        {
          p: "كل ما في Gamers Exile مجاني حاليًا: العضوية والفرق والمقاطع والتفاعلات والبطولات. لا نبيع أي شيء على الموقع. لا توجد رسوم مشاركة، ولا مكافآت عشوائية مدفوعة، ولا صناديق غنائم، ولا مراهنات أو رهانات، ولا عملة افتراضية، ولا يمكنك شراء أو بيع أو مبادلة أي شيء عبر الموقع.",
        },
      ],
    },
    {
      id: "teams",
      heading: "الفرق",
      blocks: [
        {
          list: [
            "يمكنك الانضمام إلى فريق واحد لكل لعبة.",
            "يستطيع القائد تعديل الفريق، وإزالة الأعضاء، وتسليم القيادة، وإنشاء روابط الدعوة وإلغاؤها، وحلّ الفريق.",
            "لروابط الدعوة مدة صلاحية وحد لعدد مرات الاستخدام. يستطيع أي شخص لديه رابط صالح الانضمام، فشاركها بحذر.",
            "يجب إضافة اسم المستخدم في Discord للانضمام إلى فريق، ولا يراه إلا أعضاء فرقك.",
            "يجب أن تلتزم أسماء الفرق ورموزها وأوصافها بقواعد السلوك أدناه.",
          ],
        },
      ],
    },
    {
      id: "content",
      heading: "مقاطعك ومحتواك",
      blocks: [
        {
          list: [
            "تبقى مالكًا للمقاطع والأسماء وأي محتوى آخر تنشره.",
            "تمنحنا ترخيصًا غير حصري وعالميًا ومجانيًا لاستضافة محتواك وعرضه ونسخه ومشاركته على Gamers Exile وقنواتنا الرسمية (مثل Discord وحساباتنا على مواقع التواصل) طوال وجوده على الموقع، ومدة معقولة لإزالة النسخ بعد حذفه.",
            "لا تنشر إلا ما يحق لك نشره. يجب أن تلتزم لقطات الألعاب بسياسة المحتوى لدى الناشر، ولا تُدرج موسيقى أو بثوثًا أو مقاطع لا تملك حقوقها.",
            "يصل حجم المقطع إلى 45 ميغابايت (MP4 أو WebM أو MOV)، ويمكن لكل شخص رفع 10 مقاطع يوميًا.",
            "للإبلاغ عن مشكلة في حقوق النشر، راسلنا على hello@gamersexile.net مع ذكر العمل المعني ورابط المقطع وبيانات التواصل وإقرار بأنك تعتقد بحسن نية أن الاستخدام غير مصرّح به. نتصرف بسرعة ونبلغ صاحب المقطع، ويحق له الرد.",
          ],
        },
      ],
    },
    {
      id: "conduct",
      heading: "السلوك",
      blocks: [
        { p: "احترم الآخرين والعب بنزاهة. يُمنع على Gamers Exile:" },
        {
          list: [
            "نشر أي محتوى مخالف للقانون، بما في ذلك مواد استغلال الأطفال، والمحتوى الإرهابي، وبيع السلع المحظورة",
            "التحرّش بأي شخص أو تهديده أو نشر بياناته أو مهاجمته، بما في ذلك بسبب دينه أو أصله أو جنسيته أو جنسه أو إعاقته",
            "نشر محتوى جنسي أو عارٍ أو عنيف",
            "نشر محتوى يسيء إلى الأديان أو يخالف الآداب العامة أو يحظره القانون المحلي",
            "الترويج للمقامرة أو المراهنات أو المقامرة بالأغراض الافتراضية، أو الاحتيال أو التصيّد، أو بيع الحسابات",
            "الغش أو استغلال الثغرات أو رفع التصنيف بالنيابة أو مشاركة الحسابات في المنافسات أو استخدام هويات مزيفة",
            "انتحال شخصية الفريق أو صنّاع المحتوى أو العلامات التجارية أو لاعبين آخرين",
            "الرسائل المزعجة أو الحسابات الوهمية أو البلاغات الجماعية أو تضخيم التفاعلات",
          ],
        },
      ],
    },
    {
      id: "moderation",
      heading: "البلاغات والإشراف والاعتراض",
      blocks: [
        {
          list: [
            "استخدم زر الإبلاغ على أي مقطع. لا يعرف المبلَّغ عنه هوية المبلِّغ، والبلاغات الكاذبة أو المغرضة تُعدّ مخالفة لهذه الشروط.",
            "قد يُخفى المقطع الذي يبلّغ عنه عدد من الأعضاء تلقائيًا حتى يراجعه المشرف.",
            "يحق لنا إزالة المحتوى أو تقييد الحسابات أو إيقافها أو إغلاقها عند مخالفة هذه الشروط أو القانون.",
            "نبلغك حيثما أمكن بما فعلناه وسببه والقاعدة المطبّقة.",
            "يمكنك الاعتراض على أي قرار خلال 6 أشهر بمراسلة hello@gamersexile.net، ويراجعه شخص لم يشارك في القرار الأول.",
          ],
        },
      ],
    },
    {
      id: "tournaments",
      heading: "البطولات والفعاليات",
      blocks: [
        {
          p: "المشاركة في البطولات وفعاليات المجتمع مجانية. تُعلن قواعد كل فعالية، بما فيها النظام والجدول ومن يحق له المشاركة وأي جوائز، على Discord قبل بدئها. الجوائز، إن وُجدت، يقدمها Gamers Exile أو رعاته، ولا تُموَّل أبدًا من مدفوعات اللاعبين، ولا تُستبدل بالنقد ما لم تنص قواعد الفعالية على ذلك. ويؤدي الغش أو مخالفة القواعد إلى الاستبعاد.",
        },
      ],
    },
    {
      id: "third-parties",
      heading: "الخدمات الأخرى",
      blocks: [
        {
          p: "يرتبط الموقع بخدمات لا نتحكم فيها ويعمل معها، مثل Discord وMEE6 وClerk وناشري الألعاب ومتاجرها. تسري شروطها وسياساتها الخاصة عند استخدامك لها.",
        },
      ],
    },
    {
      id: "liability",
      heading: "التوفر والمسؤولية",
      blocks: [
        {
          p: "ندير Gamers Exile بعناية معقولة، لكنه مجاني ويُقدَّم حسب التوفر، وقد نغيّر الميزات أو نوقفها مؤقتًا. لسنا مسؤولين عن الخسائر غير المباشرة أو عن الأحداث الخارجة عن سيطرتنا المعقولة. ولا يحدّ أي بند في هذه الشروط من مسؤولية لا يجيز القانون تحديدها، أو من حقوقك بصفتك مستهلكًا.",
        },
      ],
    },
    {
      id: "ending",
      heading: "إغلاق حسابك",
      blocks: [
        {
          p: "يمكنك التوقف عن استخدام Gamers Exile في أي وقت وطلب حذف حسابك بمراسلة hello@gamersexile.net. ويحق لنا إغلاق الحسابات التي تخالف هذه الشروط مخالفة جسيمة أو متكررة.",
        },
      ],
    },
    {
      id: "changes",
      heading: "التعديلات على هذه الشروط",
      blocks: [
        {
          p: "ننشر أي تحديث هنا ونغيّر التاريخ في أعلى الصفحة. وفي حال التعديلات الجوهرية، نعلن عنها على الموقع أو على Discord قبل 14 يومًا على الأقل من سريانها.",
        },
      ],
    },
    {
      id: "law",
      heading: "القانون الواجب التطبيق والنزاعات",
      blocks: [
        {
          p: "تخضع هذه الشروط لقوانين الدولة التي يقيم فيها مشغّل Gamers Exile. إذا كنت تقيم في الاتحاد الأوروبي أو في دولة تمنحك قوانين حماية المستهلك فيها حقوقًا لا يجوز التنازل عنها، فإنك تحتفظ بتلك الحقوق ويحق لك رفع الدعوى أمام محاكم بلدك. يرجى التواصل معنا أولًا، فمعظم المشكلات تُحل بسرعة.",
        },
      ],
    },
    {
      id: "refunds",
      heading: "سياسة الاسترداد",
      blocks: [
        { p: "لا يبيع Gamers Exile أي شيء حاليًا، لذا لا يوجد ما يُسترد." },
        {
          p: "إذا أضفنا ميزات مدفوعة يومًا ما، سننشر أسعارها وشروط استردادها هنا قبل أول عملية بيع. وستبقى حقوقك القانونية سارية دائمًا، بما فيها حق إلغاء المشتريات عبر الإنترنت خلال 14 يومًا في الاتحاد الأوروبي والمملكة المتحدة، وحماية قوانين المستهلك في الإمارات والمملكة العربية السعودية وغيرهما.",
        },
        {
          p: "لا نفرض أي رسوم للمشاركة في البطولات أو الفعاليات، ولا نطلب أبدًا مدفوعات أو كلمات مرور عبر رسائل Discord. إذا طلب منك أحد الدفع باسمنا، فأبلغ عنه على hello@gamersexile.net",
        },
      ],
    },
    {
      id: "contact",
      heading: "التواصل",
      blocks: [{ p: "للأسئلة حول هذه الشروط: hello@gamersexile.net" }],
    },
  ],
};
