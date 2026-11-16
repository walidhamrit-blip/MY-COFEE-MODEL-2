import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  Compass,
  Copy,
  Download,
  Expand,
  Globe2,
  MapPin,
  Maximize2,
  Menu as MenuIcon,
  Minimize2,
  MoveHorizontal,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Sparkles,
  UsersRound,
  UtensilsCrossed,
  X,
} from "lucide-react";

type Lang = "en" | "ar";
type LocalText = { en: string; ar: string };
type BookingContext = { seating?: string; experience?: string } | null;

const tx = (en: string, ar: string): LocalText => ({ en, ar });
const px = (id: number, w = 1800, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const copy = {
  en: {
    skip: "Skip to content",
    nav: { story: "Our story", menu: "Menu", ritual: "The ritual", tour: "Virtual tour", visit: "Visit" },
    book: "Book a table",
    language: "العربية",
    menuOpen: "Open navigation",
    menuClose: "Close navigation",
    hero: {
      eyebrow: "Specialty coffee house · Fine dining lounge",
      line1: "Tripoli,",
      line2: "poured slowly.",
      body: "In the heart of Hay Al-Andalus, rare origins, an evening kitchen and the warmth of Libyan hospitality meet beneath one golden light.",
      explore: "Enter the experience",
      tour: "Take the virtual tour",
      scroll: "Scroll to savour",
      open: "Open in Tripoli",
      closed: "Currently closed",
      opens: "Opens at 07:00",
      fridayOpens: "Friday opening at 15:00",
      localTime: "Local time",
      address: "17 Gargaresh Road · Hay Al-Andalus",
    },
    story: {
      eyebrow: "A house, not a hurry",
      title: "An ode to the hours between day and night.",
      body1: "MY COFFEE began with a simple conviction: a cup can hold an entire sense of place. Ours is Tripoli at golden hour—Mediterranean air, the murmur of Gargaresh, and a table that always makes room for one more.",
      body2: "By day, our baristas trace each origin with exacting care. As evening settles, the room softens and the kitchen takes the lead. Nothing is rushed. Every detail has a reason.",
      quote: "Luxury here is not distance. It is attention.",
      quoteBy: "The MY COFFEE philosophy",
      stats: [
        ["04", "distinct rooms, one seamless evening"],
        ["02", "brew bars for espresso and slow coffee"],
        ["01", "Tripoli address, rooted in Libyan welcome"],
      ],
      pillars: [
        ["Libyan generosity", "Cardamom, dates and orange blossom appear with restraint—familiar notes, newly expressed."],
        ["Measured craft", "Every brew is weighed, timed and tasted. Every plate leaves the pass with intention."],
        ["Evening rhythm", "Light, sound and service gently change as afternoon gives way to dinner."],
      ],
    },
    menu: {
      eyebrow: "The house menu",
      title: "From first light to the last course.",
      intro: "A concise menu of expressive coffee, delicate pâtisserie and Mediterranean plates with a Libyan accent.",
      note: "Prices are in Libyan dinars. Please tell our team about allergies; several dishes can be adapted.",
      pairing: "House pairing",
      pairingText: "Ask for the pastry or course your barista would choose with your coffee.",
      categories: "Menu categories",
      item: "menu item",
    },
    ritual: {
      eyebrow: "The ritual of a cup",
      title: "Three gestures. One quiet transformation.",
      instruction: "Scroll to follow the ritual",
      stage: "Chapter",
      reducedTitle: "From origin to cup",
    },
    tour: {
      eyebrow: "Visite guidée · جولة افتراضية",
      title: "Wander before you arrive.",
      intro: "Move through four distinct atmospheres. Drag the scene to look around, then touch a gold marker to discover the details.",
      drag: "Drag or use arrow keys to look around",
      points: "points of interest",
      rooms: "spatial zones",
      auto: "Start gentle pan",
      pause: "Pause gentle pan",
      reset: "Reset view",
      expand: "Expand tour",
      collapse: "Exit expanded tour",
      discover: "Discover detail",
      closeDetail: "Close detail",
      reserveZone: "Request this setting",
      previous: "Previous zone",
      next: "Next zone",
      zone: "Zone",
      disclaimer: "A photographic, interactive preview of our spaces; furnishings and seasonal details may evolve.",
    },
    experiences: {
      eyebrow: "Curated evenings",
      title: "Some moments deserve their own setting.",
      intro: "Small-format experiences, thoughtfully paced and personally hosted.",
      perGuest: "per guest",
      from: "From",
      reserve: "Reserve this experience",
      includes: "The experience includes",
      private: "A room of your own",
      privateText: "For private dinners, brand gatherings and family celebrations of 12–40 guests, our team will compose the room, menu and pace around you.",
      privateCta: "Plan a private gathering",
    },
    gallery: {
      eyebrow: "Atmosphere, in frames",
      title: "A study in crema, linen and low light.",
      view: "Open photograph",
      close: "Close gallery",
      previous: "Previous photograph",
      next: "Next photograph",
    },
    hospitality: {
      eyebrow: "The art of hosting",
      title: "Service that notices, never interrupts.",
      items: [
        ["Water before questions", "A cool welcome arrives first. Menus and recommendations follow only when you are settled."],
        ["Your pace sets ours", "A quiet conversation, a working afternoon or a long dinner—each table is read differently."],
        ["Care without compromise", "Allergies and preferences are discussed discreetly with the kitchen, never treated as an afterthought."],
      ],
    },
    reservation: {
      eyebrow: "Your table awaits",
      title: "Let the evening unfold.",
      body: "Tell us how you would like to spend your time at MY COFFEE. We will shape the setting around it.",
      cta: "Request a table",
      steps: ["Choose your moment", "Share your preferences", "Send to our concierge"],
      note: "For parties of more than 12, select the private gathering option and tell us your ideal guest count in the notes.",
    },
    visit: {
      eyebrow: "Find your way",
      title: "In Tripoli, close to the Mediterranean.",
      addressLabel: "Our address",
      address: "17 Gargaresh Road, Hay Al-Andalus, Tripoli, Libya",
      directions: "Open in Google Maps",
      hoursLabel: "Opening hours",
      hours: [["Saturday — Thursday", "07:00 — 00:00"], ["Friday", "15:00 — 00:00"], ["Kitchen last order", "23:15"]],
      contactLabel: "Concierge",
      phone: "+218 91 240 0017",
      email: "hello@mycoffee.ly",
      landmark: "A discreet gold emblem marks the entrance on Gargaresh Road. Evening valet service is available.",
    },
    footer: {
      line: "Specialty coffee · Fine dining · Libyan hospitality",
      rights: "MY COFFEE Tripoli. All rights reserved.",
      photo: "Photography via Pexels",
      top: "Back to top",
    },
    booking: {
      title: "Reserve your moment",
      intro: "Create a table request in two short steps. Your preferred time is not confirmed until our concierge replies.",
      step: "Step",
      of: "of",
      details: "Table details",
      guest: "Your details",
      date: "Preferred date",
      time: "Preferred time",
      guests: "Guests",
      guestUnit: "guests",
      seating: "Seating preference",
      seatingOptions: ["No preference", "Espresso bar", "Majlis lounge", "Dining room", "Evening terrace", "Private gathering"],
      occasion: "Experience or occasion",
      occasionPlaceholder: "Optional — birthday, Chef’s Counter…",
      continue: "Continue",
      back: "Back",
      name: "Your name",
      namePlaceholder: "How should we welcome you?",
      phone: "Phone number",
      phonePlaceholder: "+218 …",
      email: "Email (optional)",
      emailPlaceholder: "you@example.com",
      notes: "Notes for our team",
      notesPlaceholder: "Allergies, accessibility, a quiet corner or a special detail…",
      consent: "I understand this is a request, not an instant confirmation.",
      submit: "Save table request",
      close: "Close reservation",
      required: "Please complete this field.",
      phoneError: "Enter a valid phone number with at least 7 digits.",
      emailError: "Enter a valid email address or leave this field empty.",
      consentError: "Please acknowledge the request status.",
      timeError: "Choose a time within our opening hours.",
      successEyebrow: "Request prepared",
      successTitle: "One last gesture.",
      successBody: "Your request is saved on this device. Send it to our concierge on WhatsApp to receive a personal confirmation.",
      successBodySession: "Your request is ready. Browser storage is unavailable, so send it now or copy the details before closing this window.",
      reference: "Request reference",
      whatsapp: "Send via WhatsApp",
      share: "Share request",
      copy: "Copy details",
      calendar: "Add a pending calendar hold",
      newRequest: "Start another request",
      saved: "Details copied to your clipboard.",
      copyError: "Your browser blocked clipboard access. Please use the share button instead.",
      shareError: "Sharing is unavailable here. Your details were copied instead.",
      summary: "MY COFFEE table request",
      pending: "Pending concierge confirmation",
      experiencePrefix: "Experience",
    },
  },
  ar: {
    skip: "انتقل إلى المحتوى",
    nav: { story: "حكايتنا", menu: "القائمة", ritual: "طقس القهوة", tour: "الجولة الافتراضية", visit: "زورونا" },
    book: "احجز طاولتك",
    language: "English",
    menuOpen: "افتح قائمة التنقل",
    menuClose: "أغلق قائمة التنقل",
    hero: {
      eyebrow: "قهوة مختصة · مجلس طعام راقٍ",
      line1: "طرابلس،",
      line2: "على مَهَل.",
      body: "في قلب حي الأندلس، تلتقي البنّات النادرة بمطبخ المساء ودفء الضيافة الليبية تحت ضوءٍ ذهبي واحد.",
      explore: "ابدأ التجربة",
      tour: "خذ جولة افتراضية",
      scroll: "انزل على مهل",
      open: "نستقبلكم الآن في طرابلس",
      closed: "نحن مغلقون الآن",
      opens: "نفتح في 07:00",
      fridayOpens: "نفتح الجمعة في 15:00",
      localTime: "التوقيت المحلي",
      address: "١٧ طريق قرقارش · حي الأندلس",
    },
    story: {
      eyebrow: "بيتٌ لا يعرف العجلة",
      title: "قصيدة للساعات التي بين النهار والليل.",
      body1: "بدأت MY COFFEE بيقينٍ بسيط: قد تتّسع الفنجان لمكانٍ بأكمله. مكاننا هو طرابلس وقت الغروب—نسيم المتوسط، وحوار قرقارش الهادئ، وطاولةٌ تتّسع دائماً لضيفٍ آخر.",
      body2: "نهاراً، يتتبّع خبراؤنا حكاية كل محصول بعناية دقيقة. وعندما يهدأ المساء، ينخفض الضوء ويتقدّم المطبخ. لا شيء يستعجل، ولكل تفصيلٍ سبب.",
      quote: "الفخامة هنا ليست تكلّفاً، بل انتباه.",
      quoteBy: "فلسفة MY COFFEE",
      stats: [
        ["٠٤", "مساحات مختلفة، ومساء واحد متصل"],
        ["٠٢", "باران للإسبريسو والقهوة المقطّرة"],
        ["٠١", "عنوان طرابلسي يحفظ أصول الضيافة"],
      ],
      pillars: [
        ["كرم ليبي", "الهيل والتمر وزهر البرتقال حضورٌ رهيف—نكهات نعرفها، بصياغة جديدة."],
        ["حِرفة محسوبة", "كل تقطيرة توزن وتُوقَّت وتُذاق، وكل طبق يخرج من المطبخ بقصدٍ واضح."],
        ["إيقاع المساء", "يتبدّل الضوء والصوت والخدمة بلطف حين يفسح العصر مجاله للعشاء."],
      ],
    },
    menu: {
      eyebrow: "قائمة الدار",
      title: "من أول الضوء إلى آخر طبق.",
      intro: "قائمة منتقاة من القهوة المعبّرة، والمخبوزات الرقيقة، وأطباق متوسطية بلمسة ليبية.",
      note: "الأسعار بالدينار الليبي. أخبر فريقنا عن الحساسية الغذائية؛ يمكن تعديل عدد من الأطباق.",
      pairing: "اختيار الدار",
      pairingText: "اسأل خبير القهوة عن الحلى أو الطبق الذي يختاره لفنجانك.",
      categories: "أقسام القائمة",
      item: "صنف من القائمة",
    },
    ritual: {
      eyebrow: "طقس الفنجان",
      title: "ثلاث حركات، وتحوّلٌ هادئ.",
      instruction: "انزل لتتبع الطقس",
      stage: "الفصل",
      reducedTitle: "من المحصول إلى الفنجان",
    },
    tour: {
      eyebrow: "Visite guidée · جولة افتراضية",
      title: "تجوّل قبل أن تصل.",
      intro: "تنقّل بين أربع أجواء مختلفة. اسحب المشهد لتنظر حولك، ثم المس العلامة الذهبية لتكتشف التفاصيل.",
      drag: "اسحب أو استخدم أسهم لوحة المفاتيح للنظر حولك",
      points: "نقاط للاستكشاف",
      rooms: "مساحات متصلة",
      auto: "ابدأ الحركة الهادئة",
      pause: "أوقف الحركة الهادئة",
      reset: "أعد زاوية النظر",
      expand: "وسّع الجولة",
      collapse: "اخرج من العرض الموسّع",
      discover: "اكتشف التفصيل",
      closeDetail: "أغلق التفصيل",
      reserveZone: "اطلب هذه المساحة",
      previous: "المساحة السابقة",
      next: "المساحة التالية",
      zone: "المساحة",
      disclaimer: "معاينة تصويرية تفاعلية لمساحاتنا؛ قد تتغيّر الأثاث والتفاصيل الموسمية.",
    },
    experiences: {
      eyebrow: "أمسيات منتقاة",
      title: "بعض اللحظات تستحق مساحةً تشبهها.",
      intro: "تجارب محدودة الضيوف، بإيقاع مدروس وضيافة شخصية.",
      perGuest: "للضيف",
      from: "ابتداءً من",
      reserve: "احجز هذه التجربة",
      includes: "تشمل التجربة",
      private: "مساحة لكم وحدكم",
      privateText: "للعشاءات الخاصة ولقاءات العلامات والمناسبات العائلية من ١٢ إلى ٤٠ ضيفاً، ننسّق المكان والقائمة والإيقاع حول مناسبتكم.",
      privateCta: "خطّط لمناسبة خاصة",
    },
    gallery: {
      eyebrow: "الأجواء في لقطات",
      title: "دراسة في الكريما والكتّان والضوء الخافت.",
      view: "افتح الصورة",
      close: "أغلق معرض الصور",
      previous: "الصورة السابقة",
      next: "الصورة التالية",
    },
    hospitality: {
      eyebrow: "فن الاستضافة",
      title: "خدمة تلاحظ كل شيء، ولا تقاطع شيئاً.",
      items: [
        ["الماء قبل الأسئلة", "تصل أولاً ضيافة باردة، ثم تأتي القائمة والاقتراحات بعد أن تأخذ راحتك."],
        ["إيقاعك هو إيقاعنا", "حديث هادئ، أو ظهيرة عمل، أو عشاء طويل—لكل طاولة طريقتها في القراءة."],
        ["عناية بلا مساومة", "نناقش الحساسية والتفضيلات مع المطبخ بخصوصية، ولا نتركها للصدفة."],
      ],
    },
    reservation: {
      eyebrow: "طاولتك بانتظارك",
      title: "دع المساء يمضي كما تحب.",
      body: "أخبرنا كيف تريد أن تقضي وقتك في MY COFFEE، وسنهيّئ التفاصيل من حولك.",
      cta: "اطلب طاولة",
      steps: ["اختر موعدك", "شاركنا تفضيلاتك", "أرسل الطلب إلى المضيف"],
      note: "لمجموعات أكثر من ١٢ ضيفاً، اختر «مناسبة خاصة» واذكر العدد الذي تفضّله في الملاحظات.",
    },
    visit: {
      eyebrow: "الطريق إلينا",
      title: "في طرابلس، على مقربة من المتوسط.",
      addressLabel: "عنواننا",
      address: "١٧ طريق قرقارش، حي الأندلس، طرابلس، ليبيا",
      directions: "افتح في خرائط Google",
      hoursLabel: "ساعات الاستقبال",
      hours: [["السبت — الخميس", "07:00 — 00:00"], ["الجمعة", "15:00 — 00:00"], ["آخر طلب للمطبخ", "23:15"]],
      contactLabel: "المضيف",
      phone: "+218 91 240 0017",
      email: "hello@mycoffee.ly",
      landmark: "شعار ذهبي هادئ يدلّك على المدخل في طريق قرقارش. خدمة صف السيارات متاحة مساءً.",
    },
    footer: {
      line: "قهوة مختصة · طعام راقٍ · ضيافة ليبية",
      rights: "MY COFFEE طرابلس. جميع الحقوق محفوظة.",
      photo: "الصور من Pexels",
      top: "العودة إلى الأعلى",
    },
    booking: {
      title: "احجز لحظتك",
      intro: "أنشئ طلب طاولة في خطوتين قصيرتين. لا يتأكد الموعد المفضل إلا بعد ردّ المضيف.",
      step: "الخطوة",
      of: "من",
      details: "تفاصيل الطاولة",
      guest: "بياناتك",
      date: "التاريخ المفضل",
      time: "الوقت المفضل",
      guests: "عدد الضيوف",
      guestUnit: "ضيوف",
      seating: "المساحة المفضلة",
      seatingOptions: ["لا تفضيل", "بار الإسبريسو", "المجلس", "قاعة الطعام", "شرفة المساء", "مناسبة خاصة"],
      occasion: "التجربة أو المناسبة",
      occasionPlaceholder: "اختياري — عيد ميلاد، طاولة الشيف…",
      continue: "تابع",
      back: "رجوع",
      name: "الاسم",
      namePlaceholder: "كيف تحب أن نرحّب بك؟",
      phone: "رقم الهاتف",
      phonePlaceholder: "+218 …",
      email: "البريد الإلكتروني (اختياري)",
      emailPlaceholder: "you@example.com",
      notes: "ملاحظات لفريقنا",
      notesPlaceholder: "حساسية غذائية، احتياجات وصول، ركن هادئ أو تفصيل خاص…",
      consent: "أفهم أن هذا طلب حجز، وليس تأكيداً فورياً.",
      submit: "احفظ طلب الطاولة",
      close: "أغلق الحجز",
      required: "يرجى إكمال هذا الحقل.",
      phoneError: "أدخل رقم هاتف صحيحاً من ٧ أرقام على الأقل.",
      emailError: "أدخل بريداً صحيحاً أو اترك الحقل فارغاً.",
      consentError: "يرجى تأكيد فهم حالة الطلب.",
      timeError: "اختر وقتاً ضمن ساعات الاستقبال.",
      successEyebrow: "تم تجهيز الطلب",
      successTitle: "بقيت خطوة واحدة.",
      successBody: "حُفظ طلبك على هذا الجهاز. أرسله إلى مضيفنا عبر واتساب لتصلك تأكيداتك شخصياً.",
      successBodySession: "طلبك جاهز. التخزين غير متاح في المتصفح، لذا أرسله الآن أو انسخ التفاصيل قبل إغلاق هذه النافذة.",
      reference: "مرجع الطلب",
      whatsapp: "أرسل عبر واتساب",
      share: "شارك الطلب",
      copy: "انسخ التفاصيل",
      calendar: "أضف موعداً مؤقتاً للتقويم",
      newRequest: "ابدأ طلباً آخر",
      saved: "نُسخت التفاصيل إلى الحافظة.",
      copyError: "منع المتصفح الوصول إلى الحافظة. يرجى استخدام زر المشاركة بدلاً من ذلك.",
      shareError: "المشاركة غير متاحة هنا؛ نسخنا التفاصيل بدلاً من ذلك.",
      summary: "طلب طاولة MY COFFEE",
      pending: "بانتظار تأكيد المضيف",
      experiencePrefix: "التجربة",
    },
  },
} as const;

const menuCategories = [
  {
    id: "signatures",
    label: tx("House signatures", "توقيعات الدار"),
    note: tx("Espresso, reimagined with a quiet Libyan accent.", "الإسبريسو بصياغة جديدة ولمسة ليبية رهيفة."),
    image: px(39576775, 1400, 1500),
    items: [
      { name: tx("Andalus Cloud", "سحابة الأندلس"), desc: tx("Double espresso, orange-blossom silk milk, toasted sesame praline.", "إسبريسو مزدوج، حليب حريري بزهر البرتقال، وبرالين السمسم المحمّص."), price: 18, tags: [tx("House signature", "توقيع الدار")] },
      { name: tx("Gargaresh Gold", "ذهب قرقارش"), desc: tx("Saffron, green cardamom, espresso and a fine cap of steamed milk.", "زعفران وهيل أخضر وإسبريسو، تعلوها طبقة رقيقة من الحليب المبخّر."), price: 19, tags: [tx("Warm spice", "توابل دافئة")] },
      { name: tx("Date & Demerara", "التمر والديميرارا"), desc: tx("Ristretto, Medjool date molasses, raw sugar and cultured cream.", "ريستريتو ودبس تمر مجهول وسكر خام وقشطة طازجة."), price: 17, tags: [tx("Not too sweet", "حلاوة متزنة")] },
      { name: tx("Midnight Tonic", "تونيك منتصف الليل"), desc: tx("Espresso, clarified citrus tonic, rosemary and a long shard of ice.", "إسبريسو وتونيك حمضيات صافٍ وإكليل الجبل مع قطعة ثلج طويلة."), price: 16, tags: [tx("Sparkling", "منعش")] },
    ],
  },
  {
    id: "slow",
    label: tx("Slow coffee", "قهوة على مهل"),
    note: tx("Single origins brewed to order, with a card for every harvest.", "محاصيل أحادية المصدر تُحضّر عند الطلب، وبطاقة لكل موسم."),
    image: px(14679166, 1400, 1500),
    items: [
      { name: tx("Ethiopia · Guji", "إثيوبيا · غوجي"), desc: tx("Jasmine, bergamot and white apricot. V60, washed heirloom.", "ياسمين وبرغموت ومشمش أبيض. V60، محصول مغسول."), price: 16, tags: [tx("Floral", "زهري"), tx("V60", "V60")] },
      { name: tx("Colombia · Huila", "كولومبيا · هويلا"), desc: tx("Cacao nib, red plum and panela. Kalita Wave, washed caturra.", "حبيبات الكاكاو والبرقوق الأحمر والبانيلا. كاليتا ويف، كاتورا مغسولة."), price: 15, tags: [tx("Balanced", "متوازنة"), tx("Kalita", "كاليتا")] },
      { name: tx("Tripoli House Roast", "محمصة طرابلس"), desc: tx("Brazil and Ethiopia; cocoa, dried fig and a soft caramel finish.", "البرازيل وإثيوبيا؛ كاكاو وتين مجفف ونهاية كراميل هادئة."), price: 12, tags: [tx("Batch brew", "تقطير جماعي")] },
      { name: tx("Panama · Boquete Geisha", "بنما · بوكيتي غيشا"), desc: tx("Honeysuckle, mandarin and black tea. A limited, tableside pour-over.", "زهر العسل واليوسفي والشاي الأسود. تقطير محدود أمام طاولتك."), price: 28, tags: [tx("Limited harvest", "محصول محدود")] },
    ],
  },
  {
    id: "patisserie",
    label: tx("Pâtisserie", "فن الحلويات"),
    note: tx("Laminated, glazed and finished in small batches through the day.", "تُحضّر وتُلمّع على دفعات صغيرة طوال اليوم."),
    image: px(20002837, 1400, 1500),
    items: [
      { name: tx("Orange-Blossom Basboussa", "بسبوسة زهر البرتقال"), desc: tx("Fine semolina, cultured butter, orange blossom and pistachio dust.", "سميد ناعم وزبدة طازجة وزهر برتقال وغبار الفستق."), price: 14, tags: [tx("Vegetarian", "نباتي")] },
      { name: tx("Pistachio Croissant", "كرواسون الفستق"), desc: tx("Twice-baked, Sicilian pistachio frangipane and orange zest.", "مخبوز مرتين مع فرانجيبان الفستق الصقلي وقشر البرتقال."), price: 15, tags: [tx("Contains nuts", "يحتوي مكسرات")] },
      { name: tx("Chocolate & Olive Oil", "الشوكولاتة وزيت الزيتون"), desc: tx("70% dark chocolate, Ligurian olive oil, sea salt and crème fraîche.", "شوكولاتة داكنة ٧٠٪ وزيت زيتون ورشة ملح بحري وكريم طازج."), price: 16, tags: [tx("Gluten-free", "خالٍ من الغلوتين")] },
      { name: tx("Medjool Date Tart", "تارت تمر المجهول"), desc: tx("Brown-butter sablé, date caramel, tahini and vanilla Chantilly.", "سابليه بالزبدة المحمّصة وكراميل التمر والطحينة وشانتيه الفانيليا."), price: 17, tags: [tx("House favourite", "مفضل لدى ضيوفنا")] },
    ],
  },
  {
    id: "dinner",
    label: tx("Evening kitchen", "مطبخ المساء"),
    note: tx("Mediterranean produce, Libyan memory, a contemporary hand.", "خيرات متوسطية وذاكرة ليبية بلمسة معاصرة."),
    image: px(7627408, 1400, 1500),
    items: [
      { name: tx("Charred Octopus", "أخطبوط مشوي"), desc: tx("Smoked freekeh, preserved lemon, chickpea silk and wild oregano.", "فريكة مدخنة وليمون مخلل ومهروس حمص حريري وزعتر بري."), price: 48, tags: [tx("Coastal", "من الساحل")] },
      { name: tx("Twelve-Hour Lamb", "لحم ضأن اثنتي عشرة ساعة"), desc: tx("Date jus, smoked eggplant, freekeh crisp and young almonds.", "صلصة التمر وباذنجان مدخن ورقائق فريكة ولوز طازج."), price: 62, tags: [tx("Chef’s signature", "توقيع الشيف")] },
      { name: tx("Mediterranean Sea Bass", "قاروص المتوسط"), desc: tx("Fennel, green harissa, confit tomato and grilled citrus.", "شمر وهريسة خضراء وطماطم مطهوة ببطء وحمضيات مشوية."), price: 58, tags: [tx("Gluten-free", "خالٍ من الغلوتين")] },
      { name: tx("Wild Mushroom Risotto", "ريزوتو الفطر البري"), desc: tx("Carnaroli rice, roasted mushrooms, aged Parmesan and thyme oil.", "أرز كارنارولي وفطر محمّص وبارميزان معتّق وزيت الزعتر."), price: 44, tags: [tx("Vegetarian", "نباتي")] },
    ],
  },
];

const ritualScenes = [
  {
    number: "01",
    label: tx("Origin", "المصدر"),
    title: tx("We begin far from the cup.", "نبدأ بعيداً عن الفنجان."),
    body: tx("Each lot is chosen for clarity, not novelty. Altitude, processing and harvest become a map of what the coffee can say.", "نختار كل محصول لصفائه لا لغرابته. الارتفاع والمعالجة والحصاد خريطة لما تستطيع القهوة أن تقوله."),
    detail: tx("Seasonal lots · Transparent sourcing", "محاصيل موسمية · مصادر واضحة"),
    image: px(4927138, 2200, 1300),
  },
  {
    number: "02",
    label: tx("Fire", "النار"),
    title: tx("Roasting is an act of listening.", "التحميص فنّ الإصغاء."),
    body: tx("A measured roast opens sweetness while protecting the character of the farm. The profile is tasted, adjusted, then tasted again.", "تحميص محسوب يوقظ الحلاوة ويحفظ شخصية المزرعة. نذوق المزيج ونعدّله ثم نذوقه من جديد."),
    detail: tx("Small batches · Rested with patience", "دفعات صغيرة · راحة بلا استعجال"),
    image: px(4787610, 2200, 1300),
  },
  {
    number: "03",
    label: tx("Water", "الماء"),
    title: tx("Time becomes aroma.", "يصير الوقت عطراً."),
    body: tx("A spiral of water, a precise temperature, a few unhurried minutes. The final gesture is yours: pause, inhale, taste.", "دوامة ماء وحرارة دقيقة ودقائق بلا عجلة. أما الحركة الأخيرة فلك: توقّف، تنشّق، ثم تذوّق."),
    detail: tx("Brewed to order · Served without hurry", "يُحضّر عند الطلب · ويُقدّم بلا استعجال"),
    image: px(3200707, 2200, 1300),
  },
];

const tourZones = [
  {
    id: "bar",
    name: tx("The Espresso Bar", "بار الإسبريسو"),
    subtitle: tx("Precision in motion", "الدقة في حركة"),
    description: tx("Travertine, smoked oak and the theatre of extraction. Take a front-row seat to the craft.", "ترافرتين وبلوط مدخّن ومشهد الاستخلاص. اجلس في الصف الأول أمام الحِرفة."),
    image: px(32132452, 2400, 1400),
    hotspots: [
      { x: 30, y: 44, title: tx("The extraction theatre", "مسرح الاستخلاص"), detail: tx("Two dedicated grinders let the barista move between the house espresso and a rotating micro-lot without compromise.", "مطحنان مستقلان يتيحان للخبير التنقل بين إسبريسو الدار والمحاصيل الصغيرة دون مساومة.") },
      { x: 71, y: 60, title: tx("A seat at the bar", "مقعد عند البار"), detail: tx("Six low-lit stools place you close enough to watch the dose, distribution and first golden drop.", "ستة مقاعد بضوء خافت تضعك على مقربة من الوزن والتوزيع وأول قطرة ذهبية.") },
    ],
  },
  {
    id: "majlis",
    name: tx("The Majlis Lounge", "المجلس"),
    subtitle: tx("Conversation, held softly", "حديثٌ يحتضنه الهدوء"),
    description: tx("Deep velvet, low tables and a contemporary reading of Libyan gathering.", "مخمل عميق وطاولات منخفضة وقراءة معاصرة للمجالس الليبية."),
    image: px(15362788, 2400, 1400),
    hotspots: [
      { x: 24, y: 63, title: tx("A contemporary majlis", "مجلس معاصر"), detail: tx("Generous seat depths and low, rounded tables are arranged for long conversations rather than quick turnover.", "مقاعد رحبة وطاولات منخفضة مستديرة رُتّبت للحوارات الطويلة لا لسرعة تبديل الضيوف.") },
      { x: 74, y: 35, title: tx("Light that follows the evening", "ضوء يتبع المساء"), detail: tx("Warm pools of light grow softer after sunset, while acoustic plaster keeps voices intimate.", "تزداد دوائر الضوء الدافئة هدوءاً بعد الغروب، بينما يحفظ الجص العازل خصوصية الأصوات.") },
    ],
  },
  {
    id: "dining",
    name: tx("The Dining Room", "قاعة الطعام"),
    subtitle: tx("The evening, composed", "المساء بتفاصيل مرتّبة"),
    description: tx("Linen, handmade ceramics and an open view toward the evening kitchen.", "كتّان وخزف صنعته الأيدي وإطلالة مفتوحة على مطبخ المساء."),
    image: px(17057034, 2400, 1400),
    hotspots: [
      { x: 66, y: 49, title: tx("The chef’s counter", "طاولة الشيف"), detail: tx("Eight seats face the pass for a five-course progression shaped by the day’s finest produce.", "ثمانية مقاعد تواجه المطبخ لتجربة خمسة أطباق تتشكل حسب أجود مكونات اليوم.") },
      { x: 29, y: 69, title: tx("Tableware with a sense of place", "أدوات مائدة تحمل روح المكان"), detail: tx("Unglazed rims, sand-toned glazes and hammered brass echo Tripoli’s earth and old medina metalwork.", "حواف خزفية غير مصقولة وألوان رملية ونحاس مطروق تستحضر أرض طرابلس وصنعة مدينتها القديمة.") },
    ],
  },
  {
    id: "terrace",
    name: tx("The Evening Terrace", "شرفة المساء"),
    subtitle: tx("Mediterranean air after dark", "نسيم المتوسط بعد الغروب"),
    description: tx("Olive trees, linen canopies and Gargaresh glowing beyond the balustrade.", "أشجار زيتون ومظلات كتّانية وقرقارش يتوهّج خلف السور."),
    image: px(810042, 2400, 1400),
    hotspots: [
      { x: 77, y: 58, title: tx("The blue-hour tables", "طاولات الساعة الزرقاء"), detail: tx("West-facing tables are held for the brief, beautiful interval between sunset and dinner.", "طاولات باتجاه الغرب مخصّصة للحظات الجميلة القصيرة بين الغروب والعشاء.") },
      { x: 37, y: 34, title: tx("A garden of shade", "حديقة من الظل"), detail: tx("Olive, jasmine and rosemary soften the architecture and scent the terrace as the air cools.", "الزيتون والياسمين وإكليل الجبل يليّن العمارة ويعطّر الشرفة كلما اعتدل الهواء.") },
    ],
  },
];

const experiences = [
  {
    id: "origin",
    number: "I",
    title: tx("The Origin Table", "طاولة الأصول"),
    subtitle: tx("A guided slow-coffee flight", "رحلة موجّهة في القهوة المقطّرة"),
    description: tx("Three origins, three brew methods and a language for discovering what you love—hosted at the brew bar.", "ثلاثة مصادر وثلاث طرق تحضير ولغة جديدة تكتشف بها ما تحب—بضيافة خبير عند بار التقطير."),
    image: px(35819402, 1400, 1050),
    duration: tx("75 minutes", "٧٥ دقيقة"),
    seats: tx("Up to 6 guests", "حتى ٦ ضيوف"),
    price: "95",
    includes: [tx("Three seasonal origins", "ثلاثة محاصيل موسمية"), tx("A comparative tasting guide", "دليل للتذوق المقارن"), tx("A patisserie pairing", "حلى مرافق من اختيار الدار")],
  },
  {
    id: "chef",
    number: "II",
    title: tx("The Chef’s Counter", "طاولة الشيف"),
    subtitle: tx("Five courses at the pass", "خمسة أطباق أمام المطبخ"),
    description: tx("A front-row evening shaped around coastal produce, live fire and the quiet conversation between chef and guest.", "أمسية في الصف الأول حول خيرات الساحل والنار والحوار الهادئ بين الشيف وضيفه."),
    image: px(6327536, 1400, 1050),
    duration: tx("2½ hours", "ساعتان ونصف"),
    seats: tx("8 seats nightly", "٨ مقاعد كل مساء"),
    price: "185",
    includes: [tx("Five-course seasonal menu", "قائمة موسمية من خمسة أطباق"), tx("Coffee and botanical pairings", "مرافقات قهوة ونباتات"), tx("A signed menu to take home", "قائمة موقّعة تأخذها معك")],
  },
  {
    id: "terrace",
    number: "III",
    title: tx("Blue Hour on the Terrace", "الساعة الزرقاء على الشرفة"),
    subtitle: tx("A private sunset interlude", "لحظة غروب خاصة"),
    description: tx("Your own corner of the terrace, a composed menu and a slow arc from Mediterranean sunset to candlelight.", "ركن خاص بكم على الشرفة وقائمة منتقاة ومسار هادئ من غروب المتوسط إلى ضوء الشموع."),
    image: px(27381531, 1400, 1050),
    duration: tx("2 hours", "ساعتان"),
    seats: tx("2–12 guests", "٢–١٢ ضيفاً"),
    price: "120",
    includes: [tx("A reserved terrace setting", "ركن محجوز على الشرفة"), tx("Sharing menu for your table", "قائمة أطباق للمشاركة"), tx("Sunset coffee ritual", "طقس قهوة وقت الغروب")],
  },
];

const gallery = [
  { image: px(36794604, 1200, 900), caption: tx("Rosetta, poured at the espresso bar", "روزيتا رُسمت عند بار الإسبريسو") },
  { image: px(38648040, 1200, 900), caption: tx("The house espresso, after dark", "إسبريسو الدار بعد الغروب") },
  { image: px(12660003, 1200, 900), caption: tx("Morning layers from the pâtisserie", "طبقات الصباح من مشغل الحلويات") },
  { image: px(15671371, 1200, 900), caption: tx("Linen and low light in the dining room", "كتّان وضوء خافت في قاعة الطعام") },
  { image: px(373639, 1200, 900), caption: tx("A final note of cream and cacao", "نوتة أخيرة من الكريما والكاكاو") },
  { image: px(10204269, 1200, 900), caption: tx("A pause, held in ceramic", "لحظة سكون في فنجان خزفي") },
];

function SmartImage({ src, alt, className = "", imgClassName = "", eager = false }: { src: string; alt: string; className?: string; imgClassName?: string; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-[#EADFCB] ${className}`} role={failed ? "img" : undefined} aria-label={failed ? alt : undefined}>
      {!loaded && !failed && <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#EFE6D2] to-[#E2D3B4]" />}
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`image-grade h-full w-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gold/50"><Coffee size={28} strokeWidth={1} /></div>
      )}
    </div>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 56, clipPath: "inset(0 0 16% 0)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.32em] text-gold"><span className="h-px w-8 bg-gold/60" />{children}</div>;
}

function GoldButton({ children, onClick, type = "button", className = "", ariaLabel }: { children: ReactNode; onClick?: () => void; type?: "button" | "submit"; className?: string; ariaLabel?: string }) {
  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={`group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#2B1C10] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}>
      <span className="absolute inset-0 translate-y-full bg-[#D4AF37] transition-transform duration-500 ease-out group-hover:translate-y-0" />
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </button>
  );
}

function OutlineButton({ children, onClick, className = "", ariaLabel }: { children: ReactNode; onClick?: () => void; className?: string; ariaLabel?: string }) {
  return <button type="button" onClick={onClick} aria-label={ariaLabel} className={`group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-cream/20 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-cream transition-all duration-300 hover:border-gold/50 hover:bg-gold/5 ${className}`}>{children}</button>;
}

function useTripoliStatus() {
  const read = useCallback(() => {
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Tripoli", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
    const value = (type: string) => parts.find((p) => p.type === type)?.value || "";
    const weekday = value("weekday");
    const hour = Number(value("hour"));
    const minute = Number(value("minute"));
    const total = hour * 60 + minute;
    const start = weekday === "Fri" ? 15 * 60 : 7 * 60;
    return { open: total >= start, time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`, friday: weekday === "Fri" };
  }, []);
  const [status, setStatus] = useState(read);
  useEffect(() => {
    const id = window.setInterval(() => setStatus(read()), 30000);
    return () => window.clearInterval(id);
  }, [read]);
  return status;
}

function Header({ lang, setLang, onBook }: { lang: Lang; setLang: (lang: Lang) => void; onBook: () => void }) {
  const c = copy[lang];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("story");
  const links = [
    ["story", c.nav.story], ["menu", c.nav.menu], ["ritual", c.nav.ritual], ["tour", c.nav.tour], ["visit", c.nav.visit],
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -65%", threshold: [0, 0.2, 0.5] });
    links.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, [lang]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [open]);
  const go = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <>
      <motion.header initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-6 ${scrolled ? "pt-3" : "pt-5"}`}>
        <div className={`mx-auto flex max-w-[1440px] items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500 sm:px-5 ${scrolled ? "border-gold/20 bg-[#FBF6EE]/85 shadow-2xl shadow-[#8A6F57]/20 backdrop-blur-xl" : "border-cream/10 bg-white/25 backdrop-blur-md"}`}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group flex items-center gap-3 text-start" aria-label="MY COFFEE — home">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 font-display text-sm italic text-gold transition-colors group-hover:bg-gold group-hover:text-[#2B1C10]">M</span>
            <span className="leading-none"><span className="block text-[12px] font-semibold tracking-[0.25em] text-cream">MY COFFEE</span><span className="mt-1.5 block text-[7px] uppercase tracking-[0.32em] text-hazelnut">Tripoli · Libya</span></span>
          </button>
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">
            {links.map(([id, label]) => <button key={id} onClick={() => go(id)} className={`relative py-3 text-[10px] uppercase tracking-[0.16em] transition-colors ${active === id ? "text-gold" : "text-cream/70 hover:text-cream"}`}>{label}<span className={`absolute inset-x-0 bottom-1 mx-auto h-px bg-gold transition-transform duration-300 ${active === id ? "scale-x-100" : "scale-x-0"}`} /></button>)}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="flex h-10 items-center gap-2 rounded-full border border-cream/10 px-3 text-[10px] font-medium text-cream/80 transition-colors hover:border-gold/40 hover:text-gold sm:px-4" aria-label={lang === "en" ? "Switch to Arabic" : "التبديل إلى الإنجليزية"}><Globe2 size={13} /><span>{c.language}</span></button>
            <button onClick={onBook} className="hidden h-10 items-center gap-2 rounded-full bg-gold px-5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#2B1C10] transition-colors hover:bg-[#D4AF37] md:inline-flex"><CalendarDays size={14} />{c.book}</button>
            <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full border border-cream/10 text-cream xl:hidden" aria-label={open ? c.menuClose : c.menuOpen} aria-expanded={open}>{open ? <X size={18} /> : <MenuIcon size={18} />}</button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {open && <motion.div className="fixed inset-0 z-40 bg-espresso/95 px-6 pb-8 pt-28 backdrop-blur-2xl xl:hidden" initial={{ opacity: 0, clipPath: "circle(0% at 90% 5%)" }} animate={{ opacity: 1, clipPath: "circle(150% at 90% 5%)" }} exit={{ opacity: 0, clipPath: "circle(0% at 90% 5%)" }} transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}>
          <nav className="flex h-full flex-col justify-center gap-1" aria-label="Mobile navigation">
            {links.map(([id, label], i) => <motion.button key={id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 + i * 0.06 }} onClick={() => go(id)} className="border-b border-gold/10 py-4 text-start font-display text-4xl text-cream"><span className="me-5 align-middle text-[10px] not-italic text-gold">0{i + 1}</span>{label}</motion.button>)}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8"><GoldButton onClick={() => { setOpen(false); onBook(); }} className="w-full">{c.book}<ArrowUpRight size={15} /></GoldButton><p className="mt-6 text-center text-xs leading-6 text-hazelnut">{c.hero.address}</p></motion.div>
          </nav>
        </motion.div>}
      </AnimatePresence>
    </>
  );
}

function Hero({ lang, onBook }: { lang: Lang; onBook: () => void }) {
  const c = copy[lang];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const status = useTripoliStatus();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const line = (text: string, delay: number, italic = false) => <span className="block overflow-hidden pb-[0.12em]"><motion.span className={`block ${italic ? "italic text-gold" : ""}`} initial={reduce ? false : { y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1.25, delay, ease: [0.16, 1, 0.3, 1] }}>{text}</motion.span></span>;
  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden" aria-label="MY COFFEE Tripoli">
      <motion.div className="absolute -inset-y-[12%] inset-x-0" style={reduce ? undefined : { y: bgY }}>
        <motion.div className="h-full w-full" initial={{ scale: 1 }} animate={{ scale: reduce ? 1 : 1.08 }} transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}>
          <SmartImage src={px(7590623, 2400, 1400)} alt={lang === "en" ? "Sunlit coffee house interior glowing with warm light" : "أجواء مقهى مشمسة تتوهج بضوء دافئ"} eager className="h-full w-full" imgClassName="object-[52%_50%]" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,246,238,.95)_0%,rgba(251,246,238,.72)_45%,rgba(251,246,238,.25)_78%,rgba(251,246,238,.55)_100%)] rtl:bg-[linear-gradient(-90deg,rgba(251,246,238,.95)_0%,rgba(251,246,238,.72)_45%,rgba(251,246,238,.25)_78%,rgba(251,246,238,.55)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-white/35" />
      <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(120,90,50,.28)]" />
      <motion.div style={reduce ? undefined : { y: contentY, opacity }} className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 pb-24 pt-28 sm:px-10 lg:px-16">
        <div className="max-w-4xl">
          <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.8 }} className="mb-7 flex items-center gap-4 text-[9px] uppercase tracking-[0.32em] text-gold sm:text-[10px]"><span className="h-px w-10 bg-gold" />{c.hero.eyebrow}</motion.div>
          <h1 className="font-display text-[clamp(4rem,10vw,9.5rem)] font-normal leading-[0.79] tracking-[-0.045em] text-cream rtl:leading-[1.02] rtl:tracking-normal">{line(c.hero.line1, 0.35)}{line(c.hero.line2, 0.5, true)}</h1>
          <motion.p initial={reduce ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9 }} className="mt-8 max-w-xl text-sm font-light leading-7 text-cream/70 sm:text-base sm:leading-8">{c.hero.body}</motion.p>
          <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.8 }} className="mt-8 flex flex-wrap gap-3">
            <GoldButton onClick={onBook}>{c.book}<ArrowUpRight size={16} /></GoldButton>
            <OutlineButton onClick={() => document.getElementById("tour")?.scrollIntoView({ behavior: "smooth" })}><Compass size={15} />{c.hero.tour}</OutlineButton>
          </motion.div>
        </div>
        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 1 }} className="absolute bottom-7 start-6 flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-hazelnut sm:start-10 lg:start-16"><span className={`h-1.5 w-1.5 rounded-full ${status.open ? "bg-gold shadow-[0_0_12px_#d4af37]" : "bg-hazelnut"}`} /><span>{status.open ? c.hero.open : c.hero.closed}</span><span className="hidden h-3 w-px bg-cream/15 sm:block" /><span className="hidden text-cream/70 sm:block" dir="ltr">{status.time} <span className="text-hazelnut">· {c.hero.localTime}</span></span></motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="absolute bottom-8 end-6 z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-cream/45 sm:flex sm:end-10 lg:end-16"><span>{c.hero.scroll}</span><motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}><ArrowDown size={14} /></motion.span></motion.div>
    </section>
  );
}

function Story({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const icons = [Coffee, Sparkles, Clock3];
  return (
    <section id="story" className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="ambient-glow absolute -start-80 top-0 h-[700px] w-[700px] rounded-full" />
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="relative order-2 lg:order-1 lg:col-span-5">
            <Reveal><SmartImage src={px(35518412, 1200, 1500)} alt={lang === "en" ? "Warmly lit tables inside MY COFFEE" : "طاولات دافئة الضوء داخل MY COFFEE"} className="aspect-[4/5] rounded-t-[180px]" /></Reveal>
            <Reveal delay={0.2} className="absolute -bottom-10 -end-4 w-[48%] border-[6px] border-espresso sm:-end-10"><SmartImage src="https://images.pexels.com/photos/2858192/pexels-photo-2858192.png?auto=compress&cs=tinysrgb&fit=crop&w=900&h=900" alt={lang === "en" ? "Barista carefully preparing coffee" : "خبير قهوة يحضّر الفنجان بعناية"} className="aspect-square" /></Reveal>
            <div className="absolute -start-4 top-10 hidden font-display text-[9rem] leading-none text-stroke sm:block">M</div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7 lg:ps-10">
            <Reveal><Eyebrow>{c.story.eyebrow}</Eyebrow><h2 className="max-w-3xl font-display text-4xl leading-[1.12] tracking-tight text-cream sm:text-5xl lg:text-6xl rtl:leading-[1.35]">{c.story.title}</h2></Reveal>
            <Reveal delay={0.1}><div className="mt-8 grid gap-5 text-sm font-light leading-8 text-hazelnut md:grid-cols-2"><p>{c.story.body1}</p><p>{c.story.body2}</p></div></Reveal>
            <Reveal delay={0.15}><blockquote className="my-10 border-s border-gold/50 ps-6 font-display text-2xl italic leading-relaxed text-cream/85 sm:text-3xl">“{c.story.quote}”<footer className="mt-3 font-sans text-[9px] not-italic uppercase tracking-[0.25em] text-gold">{c.story.quoteBy}</footer></blockquote></Reveal>
            <div className="grid gap-7 sm:grid-cols-3">
              {c.story.pillars.map(([title, body], i) => { const Icon = icons[i]; return <Reveal key={title} delay={0.12 + i * 0.08}><Icon size={19} strokeWidth={1.2} className="mb-4 text-gold" /><h3 className="text-xs font-medium uppercase tracking-[0.12em] text-cream">{title}</h3><p className="mt-3 text-xs font-light leading-6 text-hazelnut">{body}</p></Reveal>; })}
            </div>
          </div>
        </div>
        <div className="mt-28 grid border-y border-gold/15 sm:grid-cols-3">
          {c.story.stats.map(([num, label], i) => <Reveal key={num + label} delay={i * 0.08} className="flex items-center gap-5 border-b border-gold/10 py-8 last:border-0 sm:border-b-0 sm:border-e sm:px-8 sm:last:border-e-0"><span className="font-display text-5xl italic text-gold">{num}</span><span className="max-w-[180px] text-[10px] uppercase leading-5 tracking-[0.12em] text-hazelnut">{label}</span></Reveal>)}
        </div>
      </div>
    </section>
  );
}

function MenuSection({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const [active, setActive] = useState(0);
  const category = menuCategories[active];
  return (
    <section id="menu" className="relative bg-velvet py-24 sm:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <Reveal className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><Eyebrow>{c.menu.eyebrow}</Eyebrow><h2 className="max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">{c.menu.title}</h2></div><p className="max-w-md text-sm font-light leading-7 text-hazelnut">{c.menu.intro}</p></Reveal>
        <Reveal delay={0.1} className="no-scrollbar mt-12 flex gap-2 overflow-x-auto border-b border-gold/15 pb-4" >
          <div role="tablist" aria-label={c.menu.categories} className="flex gap-2">
            {menuCategories.map((cat, i) => <button role="tab" aria-selected={active === i} aria-controls="menu-panel" id={`tab-${cat.id}`} key={cat.id} onClick={() => setActive(i)} className={`whitespace-nowrap rounded-full border px-5 py-3 text-[10px] uppercase tracking-[0.14em] transition-all duration-300 ${active === i ? "border-gold bg-gold text-[#2B1C10]" : "border-cream/10 text-hazelnut hover:border-gold/30 hover:text-cream"}`}><span className="me-2 text-[8px] opacity-60">0{i + 1}</span>{cat.label[lang]}</button>)}
          </div>
        </Reveal>
        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${category.id}`} className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div key={category.id} initial={{ opacity: 0, clipPath: "inset(10% 0 10% 0)", scale: 0.98 }} animate={{ opacity: 1, clipPath: "inset(0% 0 0% 0)", scale: 1 }} exit={{ opacity: 0, clipPath: "inset(5% 0 5% 0)" }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="lg:sticky lg:top-28">
                <SmartImage src={category.image} alt={category.label[lang]} className="aspect-[4/3] rounded-sm lg:aspect-[4/4.4]" />
                <div className="mt-5 flex items-start gap-4"><span className="mt-1 h-px w-8 shrink-0 bg-gold/50" /><p className="font-display text-xl italic leading-relaxed text-cream/75">{category.note[lang]}</p></div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div key={category.id} initial="hidden" animate="show" exit="exit" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } }, exit: { opacity: 0, transition: { duration: 0.18 } } }}>
                {category.items.map((item) => <motion.article key={item.name.en} variants={{ hidden: { opacity: 0, x: lang === "en" ? 24 : -24 }, show: { opacity: 1, x: 0, transition: { duration: 0.55 } } }} className="group border-b border-gold/10 py-7 first:pt-0">
                  <div className="flex items-baseline gap-4"><h3 className="font-display text-2xl text-cream transition-colors group-hover:text-gold sm:text-[1.7rem]">{item.name[lang]}</h3><span className="min-w-4 flex-1 border-b border-dotted border-cream/15" /><span className="whitespace-nowrap text-sm text-gold" dir="ltr">{item.price} <span className="text-[10px] text-hazelnut">{lang === "ar" ? "د.ل" : "LYD"}</span></span></div>
                  <p className="mt-3 max-w-xl text-xs font-light leading-6 text-hazelnut sm:text-[13px]">{item.desc[lang]}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag.en} className="rounded-full border border-gold/15 px-3 py-1 text-[8px] uppercase tracking-[0.12em] text-gold/80">{tag[lang]}</span>)}</div>
                </motion.article>)}
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex items-start gap-4 rounded-sm border border-gold/15 bg-espresso/40 p-5"><Sparkles size={17} className="mt-1 shrink-0 text-gold" strokeWidth={1.2} /><div><h4 className="text-[10px] uppercase tracking-[0.18em] text-cream">{c.menu.pairing}</h4><p className="mt-2 text-xs leading-6 text-hazelnut">{c.menu.pairingText}</p></div></div>
          </div>
        </div>
        <p className="mt-10 text-[10px] leading-5 tracking-wide text-hazelnut/70">{c.menu.note}</p>
      </div>
    </section>
  );
}

function RitualLayer({ progress, index, lang }: { progress: MotionValue<number>; index: number; lang: Lang }) {
  const scene = ritualScenes[index];
  const start = index / 3;
  const end = (index + 1) / 3;
  const opacity = useTransform(progress, [Math.max(0, start - 0.1), start + 0.055, end - 0.045, Math.min(1, end + 0.04)], index === 0 ? [1, 1, 1, 0] : index === 2 ? [0, 1, 1, 1] : [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, end], [1.06, 1]);
  const copyY = useTransform(progress, [start, Math.min(1, start + 0.14)], [45, 0]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.div className="absolute inset-0" style={{ scale }}><SmartImage src={scene.image} alt={scene.title[lang]} className="h-full w-full" /></motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,246,238,.94),rgba(251,246,238,.6)_52%,rgba(251,246,238,.2))] rtl:bg-[linear-gradient(-90deg,rgba(251,246,238,.94),rgba(251,246,238,.6)_52%,rgba(251,246,238,.2))]" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-transparent to-espresso/40" />
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-6 pb-24 pt-28 sm:px-10 lg:px-16">
        <motion.div style={{ y: copyY }} className="max-w-2xl">
          <div className="mb-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-gold"><span className="font-display text-5xl font-normal italic">{scene.number}</span><span className="h-px w-10 bg-gold/50" />{scene.label[lang]}</div>
          <h3 className="font-display text-4xl leading-tight text-cream sm:text-6xl lg:text-7xl">{scene.title[lang]}</h3>
          <p className="mt-7 max-w-lg text-sm font-light leading-8 text-cream/70">{scene.body[lang]}</p>
          <p className="mt-7 text-[9px] uppercase tracking-[0.24em] text-gold/75">{scene.detail[lang]}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Ritual({ lang }: { lang: Lang }) {
  const c = copy[lang];
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.16], ["inset(7% 8% 7% 8% round 160px)", "inset(0% 0% 0% 0% round 0px)"]);
  const [stage, setStage] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setStage(Math.min(2, Math.floor(v * 3)))), [scrollYProgress]);
  const goStage = (i: number) => { if (!ref.current) return; const top = ref.current.getBoundingClientRect().top + window.scrollY; window.scrollTo({ top: top + i * window.innerHeight * 1.05, behavior: "smooth" }); };
  if (reduce) return <section id="ritual" className="py-24"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"><Eyebrow>{c.ritual.eyebrow}</Eyebrow><h2 className="mb-12 font-display text-4xl sm:text-6xl">{c.ritual.reducedTitle}</h2><div className="grid gap-6 lg:grid-cols-3">{ritualScenes.map((scene) => <article key={scene.number} className="border border-gold/15 bg-velvet"><SmartImage src={scene.image} alt={scene.title[lang]} className="aspect-[4/3]" /><div className="p-6"><span className="font-display text-3xl italic text-gold">{scene.number}</span><h3 className="mt-4 font-display text-3xl">{scene.title[lang]}</h3><p className="mt-4 text-sm leading-7 text-hazelnut">{scene.body[lang]}</p></div></article>)}</div></div></section>;
  return (
    <section id="ritual" ref={ref} className="relative h-[360vh] bg-espresso">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
          {ritualScenes.map((_, i) => <RitualLayer key={i} progress={scrollYProgress} index={i} lang={lang} />)}
        </motion.div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 pt-24 sm:px-10 lg:px-16"><div className="mx-auto flex max-w-[1440px] items-start justify-between"><div><Eyebrow>{c.ritual.eyebrow}</Eyebrow><p className="hidden max-w-xs text-xs leading-6 text-cream/45 md:block">{c.ritual.title}</p></div><span className="text-[9px] uppercase tracking-[0.2em] text-cream/40">{c.ritual.instruction}</span></div></div>
        <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/35 p-2 backdrop-blur-md">
          {ritualScenes.map((scene, i) => <button key={scene.number} onClick={() => goStage(i)} aria-current={stage === i ? "step" : undefined} className={`flex items-center gap-2 rounded-full px-4 py-2 text-[9px] uppercase tracking-[0.14em] transition-all ${stage === i ? "bg-gold text-[#2B1C10]" : "text-white/60 hover:text-white"}`}><span>{scene.number}</span><span className={`hidden sm:inline ${stage === i ? "" : "md:hidden"}`}>{scene.label[lang]}</span></button>)}
        </div>
      </div>
    </section>
  );
}

function VirtualTour({ lang, onBook }: { lang: Lang; onBook: (context: BookingContext) => void }) {
  const c = copy[lang];
  const [active, setActive] = useState(0);
  const [hotspot, setHotspot] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [auto, setAuto] = useState(false);
  const [dragging, setDragging] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const drag = useRef({ startX: 0, startY: 0, x: 0, y: 0 });
  const direction = useRef(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.4 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.4 });
  const compassRotate = useTransform(smoothX, [-220, 220], [-65, 65]);
  const hotspotX = useTransform(smoothX, (v) => v * 0.32);
  const zone = tourZones[active];
  const reduce = useReducedMotion();
  const changeZone = useCallback((index: number) => { setActive((index + tourZones.length) % tourZones.length); setHotspot(null); x.set(0); y.set(0); }, [x, y]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      tourZones.forEach((z) => { const image = new Image(); image.src = z.image; });
    }, 1800);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", key); };
  }, [expanded]);
  useAnimationFrame((_, delta) => {
    if (!auto || dragging || reduce) return;
    const limit = (container.current?.clientWidth || 800) * 0.13;
    let next = x.get() + delta * 0.012 * direction.current;
    if (Math.abs(next) >= limit) { direction.current *= -1; next = Math.max(-limit, Math.min(limit, next)); }
    x.set(next);
  });
  const limitX = () => (container.current?.clientWidth || 800) * 0.15;
  const pointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, x: x.get(), y: y.get() };
    setDragging(true); setAuto(false);
  };
  const pointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const limit = limitX();
    x.set(Math.max(-limit, Math.min(limit, drag.current.x + (e.clientX - drag.current.startX) * 0.38)));
    y.set(Math.max(-45, Math.min(45, drag.current.y + (e.clientY - drag.current.startY) * 0.14)));
  };
  const pointerUp = () => setDragging(false);
  const keyboardLook = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault(); setAuto(false);
    const limit = limitX();
    if (e.key === "ArrowLeft") x.set(Math.max(-limit, x.get() - 38));
    if (e.key === "ArrowRight") x.set(Math.min(limit, x.get() + 38));
    if (e.key === "ArrowUp") y.set(Math.max(-45, y.get() - 15));
    if (e.key === "ArrowDown") y.set(Math.min(45, y.get() + 15));
  };
  return (
    <section id="tour" className="relative bg-velvet py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <Reveal className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><Eyebrow>{c.tour.eyebrow}</Eyebrow><h2 className="font-display text-4xl text-cream sm:text-5xl lg:text-6xl">{c.tour.title}</h2></div><div className="max-w-lg"><p className="text-sm font-light leading-7 text-hazelnut">{c.tour.intro}</p><div className="mt-4 flex gap-5 text-[9px] uppercase tracking-[0.15em] text-gold"><span>04 {c.tour.rooms}</span><span>08 {c.tour.points}</span></div></div></Reveal>
      </div>
      <div className={expanded ? "fixed inset-0 z-[80] overflow-y-auto bg-espresso p-3 sm:p-6" : "relative mx-auto mt-12 max-w-[1600px] px-3 sm:px-6"}>
        <motion.div layout className="rounded-lg border border-gold/20 bg-[#F2E9DA] p-2 shadow-2xl shadow-[#8A6F57]/30 sm:p-3">
          <div ref={container} tabIndex={0} onKeyDown={keyboardLook} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} className={`panorama-grab relative isolate select-none overflow-hidden rounded-sm bg-[#EADFCB] ${expanded ? "h-[calc(100svh-235px)] min-h-[430px]" : "h-[62svh] min-h-[480px] sm:h-[68svh]"}`} role="application" aria-label={`${c.tour.title} — ${zone.name[lang]}`}>
            <AnimatePresence initial={false}>
              <motion.div key={zone.id} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                <motion.div className="absolute -inset-x-[18%] -inset-y-[14%]" style={{ x: smoothX, y: smoothY }}>
                  <SmartImage src={zone.image} alt={zone.name[lang]} eager={active === 0} className="h-full w-full" imgClassName="pointer-events-none object-cover" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/45" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(120,90,50,.3)]" />
            <div className="absolute start-5 top-5 z-20 max-w-xs sm:start-8 sm:top-8">
              <AnimatePresence mode="wait"><motion.div key={zone.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}><p className="text-[9px] uppercase tracking-[0.22em] text-gold">{c.tour.zone} 0{active + 1} · {zone.subtitle[lang]}</p><h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">{zone.name[lang]}</h3><p className="mt-3 hidden max-w-sm text-xs leading-6 text-white/75 sm:block">{zone.description[lang]}</p></motion.div></AnimatePresence>
            </div>
            <div className="absolute end-4 top-4 z-30 flex gap-2 sm:end-6 sm:top-6">
              <button onClick={() => { setAuto(!auto); setHotspot(null); }} className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold" aria-label={auto ? c.tour.pause : c.tour.auto} title={auto ? c.tour.pause : c.tour.auto}>{auto ? <Pause size={15} /> : <Play size={15} />}</button>
              <button onClick={() => { x.set(0); y.set(0); setAuto(false); }} className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold" aria-label={c.tour.reset} title={c.tour.reset}><RotateCcw size={15} /></button>
              <button onClick={() => setExpanded(!expanded)} className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold" aria-label={expanded ? c.tour.collapse : c.tour.expand} title={expanded ? c.tour.collapse : c.tour.expand}>{expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}</button>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={`hotspots-${zone.id}`} className="absolute inset-0 z-10" style={{ x: hotspotX }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
                {zone.hotspots.map((point, i) => <button key={point.title.en} onClick={() => setHotspot(hotspot === i ? null : i)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${point.x}%`, top: `${point.y}%` }} aria-label={`${c.tour.discover}: ${point.title[lang]}`} aria-expanded={hotspot === i}><span className="absolute inset-0 -m-3 animate-ping rounded-full border border-gold/40 [animation-duration:2.8s]" /><span className={`relative grid h-9 w-9 place-items-center rounded-full border text-[#2B1C10] shadow-[0_0_25px_rgba(212,175,55,.28)] transition-all ${hotspot === i ? "scale-110 border-white bg-white" : "border-white/60 bg-gold group-hover:scale-110"}`}><span className="text-xs font-semibold">+</span></span></button>)}
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute bottom-5 start-5 z-20 flex items-center gap-3 text-[8px] uppercase tracking-[0.15em] text-white/70 sm:bottom-7 sm:start-8"><MoveHorizontal size={16} className="text-gold" /><span className="hidden sm:inline">{c.tour.drag}</span><span className="sm:hidden">360°</span></div>
            <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 md:flex"><span className="text-[8px] tracking-widest text-white/50">W</span><div className="relative h-8 w-20 overflow-hidden"><motion.div style={{ rotate: compassRotate }} className="absolute left-1/2 top-1 h-6 w-px origin-bottom bg-gold" /><div className="absolute inset-x-0 bottom-0 h-px bg-white/25" /></div><span className="text-[8px] tracking-widest text-white/50">E</span><span className="ms-2 text-[9px] text-gold">360°</span></div>
            <div className="absolute bottom-4 end-4 z-30 flex gap-2 sm:bottom-6 sm:end-6"><button onClick={() => changeZone(active - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md hover:border-gold" aria-label={c.tour.previous}><ChevronLeft size={17} className="rtl:rotate-180" /></button><button onClick={() => changeZone(active + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md hover:border-gold" aria-label={c.tour.next}><ChevronRight size={17} className="rtl:rotate-180" /></button></div>
            <AnimatePresence>
              {hotspot !== null && <motion.div initial={{ opacity: 0, y: 25, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.98 }} transition={{ duration: 0.35 }} className="absolute bottom-16 start-4 z-40 max-w-[calc(100%-2rem)] rounded-sm border border-gold/25 bg-[#FBF6EE]/95 p-5 shadow-2xl backdrop-blur-xl sm:bottom-20 sm:start-8 sm:max-w-sm">
                <button onClick={() => setHotspot(null)} className="absolute end-3 top-3 text-hazelnut hover:text-cream" aria-label={c.tour.closeDetail}><X size={15} /></button><span className="text-[8px] uppercase tracking-[0.2em] text-gold">{zone.name[lang]}</span><h4 className="mt-2 pe-5 font-display text-2xl text-cream">{zone.hotspots[hotspot].title[lang]}</h4><p className="mt-3 text-xs font-light leading-6 text-hazelnut">{zone.hotspots[hotspot].detail[lang]}</p><button onClick={() => onBook({ seating: zone.id })} className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-gold hover:text-cream">{c.tour.reserveZone}<ArrowUpRight size={13} /></button>
              </motion.div>}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2 pt-3 md:grid-cols-4">
            {tourZones.map((item, i) => <button key={item.id} onClick={() => changeZone(i)} className={`group relative flex items-center gap-3 overflow-hidden rounded-sm border p-2 text-start transition-all ${active === i ? "border-gold/55 bg-gold/5" : "border-cream/5 hover:border-gold/25"}`}><SmartImage src={item.image.replace("w=2400", "w=360")} alt="" className="h-12 w-16 shrink-0 sm:w-20" imgClassName={active === i ? "" : "grayscale-[.35] group-hover:grayscale-0"} /><span className="min-w-0"><span className="block text-[8px] tracking-widest text-gold">0{i + 1}</span><span className={`mt-1 block truncate text-[10px] ${active === i ? "text-cream" : "text-hazelnut"}`}>{item.name[lang]}</span></span></button>)}
          </div>
        </motion.div>
      </div>
      <p className="mx-auto mt-5 max-w-[1440px] px-6 text-[9px] leading-5 text-hazelnut/60 sm:px-10 lg:px-16">{c.tour.disclaimer}</p>
    </section>
  );
}

function Experiences({ lang, onBook }: { lang: Lang; onBook: (context: BookingContext) => void }) {
  const c = copy[lang];
  return (
    <section id="experiences" className="relative py-24 sm:py-32">
      <div className="ambient-glow absolute -end-96 top-32 h-[800px] w-[800px] rounded-full" />
      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><Eyebrow>{c.experiences.eyebrow}</Eyebrow><h2 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{c.experiences.title}</h2></div><p className="max-w-sm text-sm font-light leading-7 text-hazelnut">{c.experiences.intro}</p></Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {experiences.map((item, i) => <Reveal key={item.id} delay={i * 0.1} className="h-full"><article className="group flex h-full flex-col overflow-hidden rounded-sm border border-gold/15 bg-velvet transition-colors duration-500 hover:border-gold/35">
            <div className="relative overflow-hidden"><SmartImage src={item.image} alt={item.title[lang]} className="aspect-[4/3]" imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-105" /><span className="absolute start-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/35 font-display italic text-gold backdrop-blur-md">{item.number}</span></div>
            <div className="flex flex-1 flex-col p-6 sm:p-7"><p className="text-[9px] uppercase tracking-[0.2em] text-gold">{item.subtitle[lang]}</p><h3 className="mt-3 font-display text-3xl text-cream">{item.title[lang]}</h3><p className="mt-4 text-xs font-light leading-6 text-hazelnut">{item.description[lang]}</p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-gold/10 py-4 text-[9px] uppercase tracking-[0.1em] text-cream/65"><span className="flex items-center gap-2"><Clock3 size={13} className="text-gold" />{item.duration[lang]}</span><span className="flex items-center gap-2"><UsersRound size={13} className="text-gold" />{item.seats[lang]}</span></div>
              <div className="mt-5"><p className="text-[8px] uppercase tracking-[0.18em] text-hazelnut">{c.experiences.includes}</p><ul className="mt-3 space-y-2">{item.includes.map((inc) => <li key={inc.en} className="flex items-start gap-2 text-[11px] leading-5 text-cream/70"><Check size={12} className="mt-1 shrink-0 text-gold" />{inc[lang]}</li>)}</ul></div>
              <div className="mt-auto flex items-end justify-between gap-4 pt-7"><div><span className="block text-[8px] uppercase tracking-[0.16em] text-hazelnut">{c.experiences.from}</span><span className="font-display text-3xl text-gold" dir="ltr">{item.price} <small className="font-sans text-[9px] text-hazelnut">{lang === "ar" ? "د.ل" : "LYD"}</small></span><span className="block text-[8px] text-hazelnut">{c.experiences.perGuest}</span></div><button onClick={() => onBook({ experience: item.id, seating: item.id === "terrace" ? "terrace" : item.id === "chef" ? "dining" : "bar" })} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/35 text-gold transition-all hover:bg-gold hover:text-[#2B1C10]" aria-label={`${c.experiences.reserve}: ${item.title[lang]}`}><ArrowUpRight size={18} className="rtl:-rotate-90" /></button></div>
            </div>
          </article></Reveal>)}
        </div>
        <Reveal className="mt-8 overflow-hidden rounded-sm border border-gold/20 bg-[linear-gradient(110deg,#F2E9DA,#EADFCB)] p-7 sm:p-10"><div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center"><div className="flex max-w-3xl items-start gap-5"><UtensilsCrossed size={25} strokeWidth={1} className="mt-1 shrink-0 text-gold" /><div><h3 className="font-display text-3xl text-cream">{c.experiences.private}</h3><p className="mt-3 text-xs font-light leading-7 text-hazelnut sm:text-sm">{c.experiences.privateText}</p></div></div><OutlineButton onClick={() => onBook({ seating: "private" })} className="shrink-0">{c.experiences.privateCta}<ArrowUpRight size={15} /></OutlineButton></div></Reveal>
      </div>
    </section>
  );
}

function Gallery({ lang, onOpen }: { lang: Lang; onOpen: (index: number) => void }) {
  const c = copy[lang];
  return (
    <section id="gallery" className="bg-velvet py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"><Reveal><Eyebrow>{c.gallery.eyebrow}</Eyebrow><h2 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">{c.gallery.title}</h2></Reveal>
        <div className="mt-12 grid auto-rows-[230px] grid-cols-2 gap-3 md:grid-cols-4 md:auto-rows-[260px]">
          {gallery.map((item, i) => <motion.button key={item.image} onClick={() => onOpen(i)} initial={{ opacity: 0, y: 45, clipPath: "inset(12% 0 12% 0)" }} whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0% 0)" }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: (i % 4) * 0.06 }} className={`group relative overflow-hidden text-start ${i === 0 || i === 3 ? "row-span-2" : ""} ${i === 1 ? "col-span-2 md:col-span-1" : ""}`} aria-label={`${c.gallery.view}: ${item.caption[lang]}`}><SmartImage src={item.image} alt={item.caption[lang]} className="h-full w-full" imgClassName="transition-transform duration-[1.4s] group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" /><div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-3 p-4 opacity-80 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"><p className="max-w-[220px] text-[10px] leading-5 text-white">{item.caption[lang]}</p><Expand size={15} className="mb-1 shrink-0 text-gold" /></div></motion.button>)}
        </div>
      </div>
    </section>
  );
}

function Hospitality({ lang }: { lang: Lang }) {
  const c = copy[lang];
  return <section className="py-24 sm:py-32"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"><Reveal className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><Eyebrow>{c.hospitality.eyebrow}</Eyebrow><h2 className="font-display text-4xl leading-tight sm:text-5xl">{c.hospitality.title}</h2></div><div className="hidden justify-end lg:flex"><Coffee size={72} strokeWidth={0.6} className="text-gold/25" /></div></Reveal><div className="mt-12 grid border-t border-gold/15 md:grid-cols-3">{c.hospitality.items.map(([title, body], i) => <Reveal key={title} delay={i * 0.1} className="relative border-b border-gold/15 py-8 md:border-b-0 md:border-e md:px-8 md:first:ps-0 md:last:border-e-0"><span className="absolute end-0 top-6 font-display text-6xl italic text-cream/[0.035] md:end-8">0{i + 1}</span><span className="text-[9px] uppercase tracking-[0.2em] text-gold">0{i + 1}</span><h3 className="mt-5 font-display text-2xl text-cream">{title}</h3><p className="mt-4 max-w-sm text-xs font-light leading-7 text-hazelnut">{body}</p></Reveal>)}</div></div></section>;
}

function ReservationAndVisit({ lang, onBook }: { lang: Lang; onBook: () => void }) {
  const c = copy[lang];
  return (
    <>
      <section id="reserve" className="relative overflow-hidden py-24 sm:py-32"><div className="absolute inset-0"><SmartImage src={px(36484101, 2200, 1300)} alt={lang === "en" ? "An intimate restaurant table awaiting guests" : "طاولة حميمة بانتظار الضيوف"} className="h-full w-full" /></div><div className="absolute inset-0 bg-espresso/85" /><div className="ambient-glow absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full" /><div className="relative mx-auto max-w-5xl px-6 text-center sm:px-10"><Reveal><div className="mb-5 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.28em] text-gold"><span className="h-px w-8 bg-gold/60" />{c.reservation.eyebrow}<span className="h-px w-8 bg-gold/60" /></div><h2 className="font-display text-5xl italic leading-tight text-cream sm:text-7xl">{c.reservation.title}</h2><p className="mx-auto mt-6 max-w-xl text-sm font-light leading-8 text-cream/65">{c.reservation.body}</p><GoldButton onClick={onBook} className="mt-8">{c.reservation.cta}<CalendarDays size={15} /></GoldButton></Reveal><div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">{c.reservation.steps.map((step, i) => <Reveal key={step} delay={0.1 + i * 0.08} className="flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.13em] text-cream/55"><span className="grid h-7 w-7 place-items-center rounded-full border border-gold/30 font-display text-sm italic text-gold">{i + 1}</span>{step}</Reveal>)}</div><p className="mx-auto mt-10 max-w-2xl text-[10px] leading-6 text-hazelnut/70">{c.reservation.note}</p></div></section>
      <section id="visit" className="bg-velvet py-24 sm:py-32"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16"><div className="grid gap-14 lg:grid-cols-12"><Reveal className="lg:col-span-5"><Eyebrow>{c.visit.eyebrow}</Eyebrow><h2 className="font-display text-4xl leading-tight sm:text-5xl">{c.visit.title}</h2><div className="mt-10"><p className="text-[9px] uppercase tracking-[0.2em] text-gold">{c.visit.addressLabel}</p><address className="mt-3 max-w-sm font-display text-2xl not-italic leading-relaxed text-cream/85">{c.visit.address}</address><a href="https://www.google.com/maps/search/?api=1&query=Gargaresh%20Road%20Hay%20Al-Andalus%20Tripoli%20Libya" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 border-b border-gold/40 pb-2 text-[10px] uppercase tracking-[0.14em] text-gold hover:text-cream">{c.visit.directions}<ArrowUpRight size={14} /></a></div><p className="mt-10 max-w-md border-s border-gold/30 ps-5 text-xs font-light leading-7 text-hazelnut">{c.visit.landmark}</p></Reveal>
        <div className="lg:col-span-7 lg:ps-10"><Reveal className="grid gap-10 sm:grid-cols-2"><div><div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-gold"><Clock3 size={15} />{c.visit.hoursLabel}</div><div className="mt-5 space-y-4">{c.visit.hours.map(([day, hours]) => <div key={day} className="flex items-center justify-between gap-4 border-b border-gold/10 pb-4 text-xs"><span className="text-hazelnut">{day}</span><span className="whitespace-nowrap text-cream/80" dir="ltr">{hours}</span></div>)}</div></div><div><div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-gold"><MapPin size={15} />{c.visit.contactLabel}</div><div className="mt-5 space-y-4"><a href="tel:+218912400017" className="block font-display text-2xl text-cream transition-colors hover:text-gold" dir="ltr">{c.visit.phone}</a><a href="mailto:hello@mycoffee.ly" className="block text-xs text-hazelnut transition-colors hover:text-gold">{c.visit.email}</a><button onClick={onBook} className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-gold">{c.book}<ArrowUpRight size={14} /></button></div></div></Reveal><Reveal delay={0.15} className="relative mt-10 overflow-hidden rounded-sm border border-gold/15"><SmartImage src={px(287975, 1600, 800)} alt={lang === "en" ? "The MY COFFEE dining room in Tripoli" : "قاعة طعام MY COFFEE في طرابلس"} className="aspect-[16/8]" /><div className="absolute bottom-4 start-4 rounded-full border border-white/25 bg-black/45 px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-md">32.87° N · 13.09° E</div></Reveal></div>
      </div></div></section>
    </>
  );
}

function Lightbox({ lang, index, setIndex, onClose }: { lang: Lang; index: number | null; setIndex: (i: number) => void; onClose: () => void }) {
  const c = copy[lang];
  useEffect(() => {
    if (index === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") setIndex((index + 1) % gallery.length); if (e.key === "ArrowLeft") setIndex((index - 1 + gallery.length) % gallery.length); };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", key); };
  }, [index, onClose, setIndex]);
  return <AnimatePresence>{index !== null && <motion.div role="dialog" aria-modal="true" aria-label={c.gallery.view} className="fixed inset-0 z-[90] flex items-center justify-center bg-espresso/95 p-4 backdrop-blur-xl sm:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><button onClick={onClose} className="absolute end-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream hover:border-gold" aria-label={c.gallery.close}><X size={19} /></button><motion.div key={index} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.45 }} className="max-h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}><SmartImage src={gallery[index].image.replace("w=1200", "w=2400")} alt={gallery[index].caption[lang]} eager className="max-h-[78svh] w-full" imgClassName="max-h-[78svh] object-contain" /><div className="mt-5 flex items-center justify-between gap-4"><p className="text-xs leading-6 text-cream/75"><span className="me-3 text-gold">0{index + 1} / 06</span>{gallery[index].caption[lang]}</p><div className="flex shrink-0 gap-2"><button onClick={() => setIndex((index - 1 + gallery.length) % gallery.length)} className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 hover:border-gold" aria-label={c.gallery.previous}><ArrowLeft size={16} className="rtl:rotate-180" /></button><button onClick={() => setIndex((index + 1) % gallery.length)} className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 hover:border-gold" aria-label={c.gallery.next}><ArrowRight size={16} className="rtl:rotate-180" /></button></div></div></motion.div></motion.div>}</AnimatePresence>;
}

type BookingForm = { date: string; time: string; guests: string; seating: string; occasion: string; name: string; phone: string; email: string; notes: string; consent: boolean };
type SavedRequest = BookingForm & { reference: string; createdAt: string };

function tripoliDate() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Tripoli", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const v = (type: string) => parts.find((p) => p.type === type)?.value || "";
  return `${v("year")}-${v("month")}-${v("day")}`;
}

function BookingModal({ lang, open, onClose, context, notify }: { lang: Lang; open: boolean; onClose: () => void; context: BookingContext; notify: (message: string) => void }) {
  const c = copy[lang];
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<SavedRequest | null>(null);
  const [storedLocally, setStoredLocally] = useState(true);
  const initial: BookingForm = { date: tripoliDate(), time: "20:00", guests: "2", seating: "any", occasion: "", name: "", phone: "", email: "", notes: "", consent: false };
  const [form, setForm] = useState<BookingForm>(initial);
  const firstInput = useRef<HTMLInputElement>(null);
  const times = useMemo(() => {
    const day = new Date(`${form.date}T12:00:00`).getDay();
    const start = day === 5 ? 15 * 60 : 7 * 60;
    const slots: string[] = [];
    for (let m = start; m <= 23 * 60 + 30; m += 60) slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    return slots;
  }, [form.date]);
  useEffect(() => {
    if (!open) return;
    setStep(1); setSaved(null); setErrors({});
    setForm((prev) => ({ ...prev, seating: context?.seating || "any", occasion: context?.experience ? experiences.find((e) => e.id === context.experience)?.title[lang] || "" : "" }));
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => firstInput.current?.focus(), 350);
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", key);
    return () => { document.body.style.overflow = previous; window.clearTimeout(timer); window.removeEventListener("keydown", key); };
  }, [open, context, lang, onClose]);
  useEffect(() => { if (!times.includes(form.time)) setForm((prev) => ({ ...prev, time: times[times.length - 5] || times[0] })); }, [times, form.time]);
  const update = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) => { setForm((prev) => ({ ...prev, [key]: value })); setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; }); };
  const nextStep = () => {
    const next: Record<string, string> = {};
    if (!form.date || form.date < tripoliDate()) next.date = c.booking.required;
    if (!times.includes(form.time)) next.time = c.booking.timeError;
    setErrors(next);
    if (!Object.keys(next).length) setStep(2);
  };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = c.booking.required;
    if (form.phone.replace(/\D/g, "").length < 7) next.phone = c.booking.phoneError;
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = c.booking.emailError;
    if (!form.consent) next.consent = c.booking.consentError;
    setErrors(next);
    if (Object.keys(next).length) return;
    const request: SavedRequest = { ...form, reference: `MC-${Date.now().toString(36).toUpperCase().slice(-6)}`, createdAt: new Date().toISOString() };
    try {
      const parsed = JSON.parse(localStorage.getItem("my-coffee-reservation-requests") || "[]");
      const existing = Array.isArray(parsed) ? parsed : [];
      localStorage.setItem("my-coffee-reservation-requests", JSON.stringify([...existing, request].slice(-10)));
      setStoredLocally(true);
    } catch {
      setStoredLocally(false);
    }
    setSaved(request);
  };
  const seatingIds = ["any", "bar", "majlis", "dining", "terrace", "private"];
  const seatingLabel = saved ? c.booking.seatingOptions[Math.max(0, seatingIds.indexOf(saved.seating))] : "";
  const summary = saved ? [
    c.booking.summary,
    `${c.booking.reference}: ${saved.reference}`,
    `${c.booking.date}: ${saved.date}`,
    `${c.booking.time}: ${saved.time}`,
    `${c.booking.guests}: ${saved.guests}`,
    `${c.booking.seating}: ${seatingLabel}`,
    saved.occasion ? `${c.booking.experiencePrefix}: ${saved.occasion}` : "",
    `${c.booking.name}: ${saved.name}`,
    `${c.booking.phone}: ${saved.phone}`,
    saved.email ? `${c.booking.email}: ${saved.email}` : "",
    saved.notes ? `${c.booking.notes}: ${saved.notes}` : "",
    c.booking.pending,
  ].filter(Boolean).join("\n") : "";
  const copyText = async (announce = true) => {
    let copied = false;
    try { await navigator.clipboard.writeText(summary); copied = true; }
    catch {
      const area = document.createElement("textarea");
      area.value = summary;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      copied = document.execCommand("copy");
      area.remove();
    }
    if (announce) notify(copied ? c.booking.saved : c.booking.copyError);
    return copied;
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: c.booking.summary, text: summary }); return; } catch (e) { if ((e as Error).name === "AbortError") return; } }
    const copied = await copyText(false);
    notify(copied ? c.booking.shareError : c.booking.copyError);
  };
  const downloadCalendar = () => {
    if (!saved) return;
    const compact = saved.date.replace(/-/g, "");
    const startHour = Number(saved.time.slice(0, 2));
    const start = saved.time.replace(":", "") + "00";
    const endHour = (startHour + 2) % 24;
    const endDate = new Date(`${saved.date}T12:00:00Z`);
    if (startHour + 2 >= 24) endDate.setUTCDate(endDate.getUTCDate() + 1);
    const endCompact = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const end = `${String(endHour).padStart(2, "0")}${saved.time.slice(3)}00`;
    const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,");
    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MY COFFEE Tripoli//Reservation Request//EN", "BEGIN:VEVENT", `UID:${saved.reference}@mycoffee.ly`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;TZID=Africa/Tripoli:${compact}T${start}`, `DTEND;TZID=Africa/Tripoli:${endCompact}T${end}`, `SUMMARY:${esc(`MY COFFEE — ${c.booking.pending}`)}`, `DESCRIPTION:${esc(summary)}`, `LOCATION:${esc(c.visit.address)}`, "STATUS:TENTATIVE", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `my-coffee-${saved.reference}.ics`; a.click(); URL.revokeObjectURL(url);
  };
  const field = "mt-2 w-full rounded-sm border border-cream/10 bg-espresso/60 px-4 py-3 text-sm text-cream placeholder:text-hazelnut/40 transition-colors focus:border-gold/50 focus:outline-none";
  const errorText = (key: string) => errors[key] ? <p role="alert" className="mt-2 text-[10px] text-[#B45309]">{errors[key]}</p> : null;
  return <AnimatePresence>{open && <motion.div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/75 p-0 backdrop-blur-md sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div role="dialog" aria-modal="true" aria-labelledby="booking-title" initial={{ opacity: 0, y: 60, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.98 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative max-h-[94svh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-gold/20 bg-velvet shadow-2xl sm:rounded-lg">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gold/10 bg-velvet/95 px-6 py-5 backdrop-blur-xl sm:px-8"><div><span className="text-[8px] uppercase tracking-[0.24em] text-gold">MY COFFEE · TRIPOLI</span><h2 id="booking-title" className="mt-1 font-display text-3xl text-cream">{saved ? c.booking.successEyebrow : c.booking.title}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-cream/10 text-hazelnut hover:border-gold hover:text-gold" aria-label={c.booking.close}><X size={18} /></button></div>
      {!saved ? <form onSubmit={submit} className="p-6 sm:p-8">
        <p className="text-xs font-light leading-6 text-hazelnut">{c.booking.intro}</p>
        <div className="mt-6 flex items-center gap-3"><span className="text-[9px] uppercase tracking-[0.16em] text-hazelnut">{c.booking.step} {step} {c.booking.of} 2</span><div className="h-px flex-1 bg-cream/10"><motion.div className="h-full bg-gold" animate={{ width: step === 1 ? "50%" : "100%" }} /></div><span className="text-[10px] text-gold">{step === 1 ? c.booking.details : c.booking.guest}</span></div>
        <AnimatePresence mode="wait">
          {step === 1 ? <motion.div key="details" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="mt-7 grid gap-5 sm:grid-cols-2">
            <label><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.date}</span><input ref={firstInput} type="date" min={tripoliDate()} value={form.date} onChange={(e) => update("date", e.target.value)} className={`${field} [color-scheme:light]`} />{errorText("date")}</label>
            <label><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.time}</span><select value={form.time} onChange={(e) => update("time", e.target.value)} className={field}>{times.map((time) => <option key={time}>{time}</option>)}</select>{errorText("time")}</label>
            <label><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.guests}</span><select value={form.guests} onChange={(e) => update("guests", e.target.value)} className={field}>{Array.from({ length: 12 }, (_, i) => String(i + 1)).map((n) => <option key={n} value={n}>{n} {c.booking.guestUnit}</option>)}</select></label>
            <label><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.seating}</span><select value={form.seating} onChange={(e) => update("seating", e.target.value)} className={field}>{["any", "bar", "majlis", "dining", "terrace", "private"].map((id, i) => <option key={id} value={id}>{c.booking.seatingOptions[i]}</option>)}</select></label>
            <label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.occasion}</span><input type="text" value={form.occasion} onChange={(e) => update("occasion", e.target.value)} placeholder={c.booking.occasionPlaceholder} className={field} /></label>
            <div className="sm:col-span-2"><GoldButton type="button" onClick={nextStep} className="w-full sm:w-auto">{c.booking.continue}<ArrowRight size={15} className="rtl:rotate-180" /></GoldButton></div>
          </motion.div> : <motion.div key="guest" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="mt-7 grid gap-5 sm:grid-cols-2">
            <label><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.name}</span><input ref={firstInput} type="text" autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={c.booking.namePlaceholder} className={field} />{errorText("name")}</label>
            <label><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.phone}</span><input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder={c.booking.phonePlaceholder} className={field} dir="ltr" />{errorText("phone")}</label>
            <label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.email}</span><input type="email" autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder={c.booking.emailPlaceholder} className={field} dir="ltr" />{errorText("email")}</label>
            <label className="sm:col-span-2"><span className="text-[10px] uppercase tracking-[0.12em] text-cream/70">{c.booking.notes}</span><textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder={c.booking.notesPlaceholder} className={`${field} resize-none`} /></label>
            <label className="flex cursor-pointer items-start gap-3 text-[11px] leading-5 text-hazelnut sm:col-span-2"><input type="checkbox" checked={form.consent} onChange={(e) => update("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-[#b8860b]" /><span>{c.booking.consent}</span></label>{errorText("consent")}
            <div className="flex flex-wrap gap-3 sm:col-span-2"><OutlineButton onClick={() => setStep(1)}><ArrowLeft size={14} className="rtl:rotate-180" />{c.booking.back}</OutlineButton><GoldButton type="submit" className="flex-1 sm:flex-none">{c.booking.submit}<Check size={15} /></GoldButton></div>
          </motion.div>}
        </AnimatePresence>
      </form> : <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-6 sm:p-8">
        <div className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-gold"><Check size={22} /></div><h3 className="mt-5 font-display text-4xl text-cream">{c.booking.successTitle}</h3><p className="mt-4 text-sm font-light leading-7 text-hazelnut">{storedLocally ? c.booking.successBody : c.booking.successBodySession}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-sm border border-gold/15 bg-espresso/50 p-5 text-xs sm:grid-cols-4"><div><span className="block text-[8px] uppercase tracking-widest text-hazelnut">{c.booking.reference}</span><strong className="mt-2 block font-medium text-gold" dir="ltr">{saved.reference}</strong></div><div><span className="block text-[8px] uppercase tracking-widest text-hazelnut">{c.booking.date}</span><strong className="mt-2 block font-medium text-cream" dir="ltr">{saved.date}</strong></div><div><span className="block text-[8px] uppercase tracking-widest text-hazelnut">{c.booking.time}</span><strong className="mt-2 block font-medium text-cream" dir="ltr">{saved.time}</strong></div><div><span className="block text-[8px] uppercase tracking-widest text-hazelnut">{c.booking.guests}</span><strong className="mt-2 block font-medium text-cream">{saved.guests}</strong></div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><a href={`https://wa.me/218912400017?text=${encodeURIComponent(summary)}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-gold px-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#2B1C10] hover:bg-[#D4AF37]"><Share2 size={15} />{c.booking.whatsapp}</a><OutlineButton onClick={share}><Share2 size={15} />{c.booking.share}</OutlineButton><OutlineButton onClick={copyText}><Copy size={15} />{c.booking.copy}</OutlineButton><OutlineButton onClick={downloadCalendar}><Download size={15} />{c.booking.calendar}</OutlineButton></div>
        <button onClick={() => { setSaved(null); setForm(initial); setStep(1); }} className="mt-7 text-[9px] uppercase tracking-[0.15em] text-hazelnut underline decoration-gold/30 underline-offset-4 hover:text-gold">{c.booking.newRequest}</button>
      </motion.div>}
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

function Footer({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  const c = copy[lang];
  return <footer className="border-t border-gold/15 px-6 py-10 sm:px-10 lg:px-16"><div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-7 text-center md:flex-row md:text-start"><div><div className="text-xs font-semibold tracking-[0.28em] text-cream">MY COFFEE</div><p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-hazelnut">{c.footer.line}</p></div><div className="flex flex-wrap items-center justify-center gap-5 text-[9px] uppercase tracking-[0.12em] text-hazelnut"><button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="text-gold hover:text-cream">{c.language}</button><a href="https://www.pexels.com" target="_blank" rel="noreferrer" className="hover:text-cream">{c.footer.photo}</a><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2 hover:text-cream">{c.footer.top}<ArrowUpRight size={12} /></button></div><p className="text-[8px] uppercase tracking-[0.1em] text-hazelnut/60">© {new Date().getFullYear()} {c.footer.rights}</p></div></footer>;
}

export default function App() {
  const [lang, setLangState] = useState<Lang>(() => { try { return localStorage.getItem("my-coffee-language") === "ar" ? "ar" : "en"; } catch { return "en"; } });
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingContext, setBookingContext] = useState<BookingContext>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const openBooking = useCallback((context: BookingContext = null) => { setBookingContext(context); setBookingOpen(true); }, []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = lang === "en" ? "MY COFFEE — Specialty Coffee & Fine Dining in Tripoli" : "MY COFFEE — قهوة مختصة وضيافة راقية في طرابلس";
    try { localStorage.setItem("my-coffee-language", lang); } catch { /* Language still works when storage is unavailable. */ }
  }, [lang]);
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(""), 3500); return () => window.clearTimeout(id); }, [toast]);
  return (
    <div className="min-h-screen overflow-clip bg-espresso text-cream" dir={lang === "ar" ? "rtl" : "ltr"}>
      <a href="#main" className="fixed start-4 top-3 z-[120] -translate-y-20 rounded-full bg-gold px-5 py-3 text-xs text-[#2B1C10] focus:translate-y-0">{copy[lang].skip}</a>
      <motion.div className="fixed inset-x-0 top-0 z-[110] h-[2px] origin-left bg-gold rtl:origin-right" style={{ scaleX: reduce ? 0 : scrollYProgress }} />
      <div className="film-grain" aria-hidden="true" />
      <Header lang={lang} setLang={setLang} onBook={() => openBooking()} />
      <main id="main">
        <Hero lang={lang} onBook={() => openBooking()} />
        <Story lang={lang} />
        <MenuSection lang={lang} />
        <Ritual lang={lang} />
        <VirtualTour lang={lang} onBook={openBooking} />
        <Experiences lang={lang} onBook={openBooking} />
        <Gallery lang={lang} onOpen={setLightbox} />
        <Hospitality lang={lang} />
        <ReservationAndVisit lang={lang} onBook={() => openBooking()} />
      </main>
      <Footer lang={lang} setLang={setLang} />
      <BookingModal lang={lang} open={bookingOpen} onClose={closeBooking} context={bookingContext} notify={setToast} />
      <Lightbox lang={lang} index={lightbox} setIndex={setLightbox} onClose={closeLightbox} />
      <AnimatePresence>{toast && <motion.div role="status" initial={{ opacity: 0, y: 25, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }} className="fixed bottom-6 left-1/2 z-[120] flex w-max max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-gold/25 bg-velvet/95 px-5 py-3 text-xs text-cream shadow-2xl backdrop-blur-xl"><Check size={15} className="shrink-0 text-gold" />{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
