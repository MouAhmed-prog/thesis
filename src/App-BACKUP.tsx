import {
  Award,
  BarChart2,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Database,
  FileSpreadsheet,
  GitMerge,
  GraduationCap,
  Info,
  Layers,
  Monitor,
  Network,
  Pause,
  Play,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import {
  DESCRIPTIVE_STATS,
  FUTURE_HORIZONS,
  HYPOTHESES,
  METHODOLOGY,
  PROBLEMATIC,
  RECOMMENDATIONS,
  RELIABILITY,
  THESIS_META,
  VARIABLES
} from "./data";

import InteractiveChart from "./components/InteractiveChart";
import RegressionSimulator from "./components/RegressionSimulator";

export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(12); // seconds per slide
  const [progress, setProgress] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<"telecom" | "classic" | "cosmic">("telecom");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Interactive slide search/navigation state
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

  // Variable tree interactive focus state
  const [variableFocus, setVariableFocus] = useState<"none" | "independent" | "dependent">("none");
  const [dimensionFocus, setDimensionFocus] = useState<string | null>(null);

  const totalSlides = 11;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Slides Title Map
  const slides = [
    { title: "الغلاف الأكاديمي", subtitle: "ورقة التعريف واللجنة المستجوبة" },
    { title: "إشكالية الدراسة", subtitle: "السؤال المحوري والأسئلة الفرعية" },
    { title: "فرضيات البحث", subtitle: "علاقة الأثر والدلالة الإحصائية المقترحة" },
    { title: "التعريفات الإجرائية", subtitle: "بنية المتغير المستقل والتابع بالتفصيل" },
    { title: "منهجية الميدان", subtitle: "الأدوات والمجتمع وأسلوب المسح" },
    { title: "هيكل عينة الميدان", subtitle: "لوحة تفاعلية لخصائص المستجوبين" },
    { title: "معاملات الثبات والتوافق", subtitle: "نتائج معامل ألفا كرونباخ الإحصائية" },
    { title: "التحليل الوصفي والارتباط", subtitle: "المتوسطات والربط البسيط بين المتغيرين" },
    { title: "التحليل الاستدلالي (التنبؤ)", subtitle: "معادلات الانحدار البسيط والمتعدد ومحاكاتها" },
    { title: "التوصيات والآفاق", subtitle: "خارطة الطريق الأكاديمية والعملية المقترحة" },
    { title: "الصفحة الختامية", subtitle: "شكر وتقدير للجنة المناقشة الموقرة" }
  ];

  // Colors based on theme - Algerian Telecom brand colors with warm academic background
  const getThemeColors = () => {
    switch (currentTheme) {
      case "telecom":
        return {
          primary: "text-emerald-600",
          primaryBg: "bg-emerald-600",
          borderGlow: "border-emerald-500/40",
          gradient: "from-amber-50 via-orange-50 to-amber-50",
          accentText: "text-orange-600",
          accentBg: "bg-orange-600",
          cardBg: "bg-white",
          cardBorder: "border-gray-200",
          textMain: "text-gray-900",
          textSecondary: "text-gray-600"
        };
      case "classic":
        return {
          primary: "text-emerald-600",
          primaryBg: "bg-emerald-600",
          borderGlow: "border-emerald-500/40",
          gradient: "from-orange-50 via-amber-50 to-orange-50",
          accentText: "text-orange-600",
          accentBg: "bg-orange-600",
          cardBg: "bg-white",
          cardBorder: "border-gray-200",
          textMain: "text-gray-900",
          textSecondary: "text-gray-600"
        };
      case "cosmic":
        return {
          primary: "text-emerald-600",
          primaryBg: "bg-emerald-600",
          borderGlow: "border-emerald-500/40",
          gradient: "from-amber-50 via-orange-50 to-amber-50",
          accentText: "text-orange-600",
          accentBg: "bg-orange-600",
          cardBg: "bg-white",
          cardBorder: "border-gray-200",
          textMain: "text-gray-900",
          textSecondary: "text-gray-600"
        };
    }
  };

  const themeColors = getThemeColors();

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1 < totalSlides ? prev + 1 : 0));
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 >= 0 ? prev - 1 : totalSlides - 1));
    setProgress(0);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
    setProgress(0);
    setIsNavOpen(false);
  };

  // Keyboard navigation representing presenter clicker logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // Aligned with Arabic RTL logic: Left arrow advances next slide
        nextSlide();
      } else if (e.key === "ArrowRight") {
        // Right arrow recedes previous slide
        prevSlide();
      } else if (e.key === "Space" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autoplay handler
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            nextSlide();
            return 0;
          }
          return p + (100 / (autoplaySpeed * 10)); // updates 10 times a second
        });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, autoplaySpeed, currentSlide]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.gradient} ${themeColors.textMain} flex relative font-sans overflow-hidden transition-all duration-700`}>
      {/* Subtle decorative background */}
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Compact top bar */}
        <header className={`border-b ${themeColors.cardBorder} ${themeColors.cardBg} shadow-sm backdrop-blur-md px-6 py-4 flex items-center justify-between z-40 relative shrink-0`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg`}>
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${themeColors.textMain} tracking-tight leading-none`}>
                منصة العرض الأكاديمي التفاعلي
              </h1>
              <span className={`text-base ${themeColors.textSecondary} font-mono mt-0.5 block`}>
                Ziane Achour Univ. of Djelfa
              </span>
            </div>
          </div>

          {/* Utility controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2.5 rounded-lg transition-all border ${
                isPlaying ? `${themeColors.primaryBg} text-white border-transparent` : `${themeColors.cardBg} ${themeColors.textSecondary} ${themeColors.cardBorder} hover:${themeColors.textMain}`
              }`}
              title={isPlaying ? "إيقاف مؤقت" : "تشغيل تلقائي"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-2.5 rounded-lg ${themeColors.cardBg} ${themeColors.textSecondary} hover:${themeColors.textMain} ${themeColors.cardBorder} border transition-all`}
              title={isFullscreen ? "خروج من وضع ملء الشاشة" : "ملء الشاشة"}
            >
              <Monitor className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Slides Visual Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center relative overflow-y-auto">
          {isPlaying && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-64 h-2 bg-gray-300 rounded-full overflow-hidden z-50 shadow-lg">
              <div className={`h-full ${themeColors.primaryBg} transition-all duration-100`} style={{ width: `${progress}%` }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex-1 w-full flex flex-col justify-center"
            >
            {/* Slide 0: Cover Slide */}
            {currentSlide === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2 md:py-8">
                {/* Academic Metadata */}
                <div className="lg:col-span-7 space-y-6 text-right order-2 lg:order-1">
                  <div className="space-y-2">
                    <span className={`${themeColors.primary} text-sm font-mono tracking-widest font-semibold flex items-center gap-1.5 uppercase`}>
                      <span className={`w-2 h-2 rounded ${themeColors.primaryBg} inline-block animate-pulse`} />
                      جامعة زيان عاشور الجلفة - كلية العلوم الاقتصادية
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                      {THESIS_META.title}
                    </h2>
                    <p className={`text-gray-700 text-lg md:text-xl border-r-4 ${themeColors.borderGlow} border-current pr-3 mt-3 py-1 bg-gray-50 rounded-l max-w-2xl`}>
                      {THESIS_META.subTitle}
                    </p>
                  </div>

                  {/* Authors and Supervisors Card with beautiful Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-2 border-gray- shadow-lg200 p-5 rounded-2xl glow-shadow max-w-2xl">
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 uppercase tracking-widest block font-mono">
                        من إعداد الطالبين الباحثين:
                      </span>
                      {THESIS_META.students.map((student, sidx) => (
                        <div key={sidx} className="flex items-center gap-2 text-base font-bold text-gray-900">
                          <Users className={`w-5 h-5 ${themeColors.primary} shrink-0`} />
                          <span>{student}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-gray-500 uppercase tracking-widest block font-mono">
                        تحت إشراف وتوجيه الفاضل:
                      </span>
                      <div className={`flex items-center gap-2 text-base font-bold ${themeColors.accentText}`}>
                        <Award className={`w-5 ${themeColors.accentText} shrink-0`} />
                        <span>{THESIS_META.supervisor}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 leading-normal max-w-xl">
                    مذكرة مكملة لنيل شهادة ماستر أكاديمي في شعبة علوم التسيير - تخصص إدارة أعمال. نوقشت علناً وأجيزت من طرف لجنة المناقشة الموقرة لولاية الجلفة.
                  </p>
                </div>

                {/* Cover Emblem Art */}
                <div className="lg:col-span-5 flex justify-center order-1 lg:order-2 relative py-4 lg:py-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl" />
                  <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center p-8 relative">
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-ping pointer-events-none" style={{ animationDuration: "3s" }} />

                    {/* Outer core circle with telecom styling */}
                    <div className="w-full h-full rounded-full bg-white border-2 border-gray- shadow-lg300 shadow-2xl flex flex-col items-center justify-center text-center p-6 relative">
                      <div className={`w-16 h-16 rounded-2xl bg-slate-800 border ${themeColors.borderGlow} border-current flex items-center justify-center mb-4`}>
                        <Monitor className={`w-8 h-8 ${themeColors.primary}`} />
                      </div>
                      <h3 className="text-sm font-bold text-gray-700 font-mono">اتصالات الجزائر</h3>
                      <p className="text-xs text-gray-500 max-w-[180px] mt-1 leading-normal">
                        المديرية العملية بولاية الجلفة - الجزائر
                      </p>
                      <div className={`mt-4 flex items-center gap-1 ${themeColors.accentBg} bg-opacity-20 border ${themeColors.borderGlow} border-current px-2.5 py-1 rounded-full`}>
                        <CheckCircle2 className={`w-3 h-3 ${themeColors.accentText}`} />
                        <span className={`text-xs font-bold ${themeColors.accentText}`}>{THESIS_META.defenseDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 1: Main Problematic */}
            {currentSlide === 1 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور الأول</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <Info className={`w-7 h-7 ${themeColors.primary}`} />
                    إشكالية الأثر التقني في الأداء المؤسسي
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Question Details */}
                  <div className="md:col-span-4 bg-white border-2 border-gray- shadow-lg300 p-6 rounded-2xl space-y-4">
                    <h4 className="text-base font-bold tracking-wider uppercase text-gray-600">طبيعة الإشكال العملي</h4>
                    <p className="text-base text-gray-700 leading-relaxed text-justify">
                      تفترض أدبيات التسيير الحديثة أن امتلاك وسائل التكنولوجيا يخلق دفعاً كفاءاتياً. يكمن السؤال حول كيفية مواءمة اتصالات الجزائر (كمتعامل وطني رائد بمدينة الجلفة) لاستثماراتها التكنولوجية مع مستويات أدائها وعلاقته بالأبعاد الخمسة.
                    </p>
                    <div className={`p-4 bg-gray-50 border ${themeColors.borderGlow} border-current rounded-xl`}>
                      <span className={`text-sm ${themeColors.primary} block font-mono font-bold`}>مجتمع الدراسة:</span>
                      <p className="text-base text-gray-700 font-mono mt-1">موظفو المديرية بمختلف فروعهم بالجلفة</p>
                    </div>
                  </div>

                  {/* Right Column: Key Problem Question Display */}
                  <div className="md:col-span-8 space-y-4">
                    {/* Principal problem questions bar */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-gray-300 shadow-lg relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-2 h-full ${themeColors.primaryBg}`} />
                      <span className={`text-sm font-bold ${themeColors.primary} uppercase tracking-widest font-mono`}>الإشكالية الرئيسية الكبرى:</span>
                      <p className="text-lg md:text-xl font-bold text-slate-100 mt-3 leading-relaxed">
                        &quot;{PROBLEMATIC.main}&quot;
                      </p>
                    </div>

                    {/* Sub questions collapsible lists */}
                    <div className="space-y-3">
                      <span className="text-sm font-bold text-gray-600 block font-mono">الأسئلة البحثية المتفرعة (5 أسئلة):</span>
                      <div className="grid grid-cols-1 gap-3">
                        {PROBLEMATIC.subQuestions.map((q, idx) => (
                          <div key={idx} className="flex items-start gap-3 bg-gray-50 border-2 border-gray- shadow-md300 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                            <span className={`w-6 h-6 bg-slate-800 border ${themeColors.borderGlow} border-current ${themeColors.primary} rounded-lg flex items-center justify-center font-mono text-sm font-semibold shrink-0 mt-0.5`}>
                              {idx + 1}
                            </span>
                            <p className="text-base text-gray-900 mt-0.5 font-medium leading-relaxed">{q}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 2: Research Hypotheses */}
            {currentSlide === 2 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور الثاني</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <GitMerge className={`w-7 h-7 ${themeColors.primary}`} />
                    الفرضيات العلمية المقترحة وصحة اختبارها
                  </h3>
                </div>

                <div className="bg-slate-800/50 border border-gray-300 p-5 rounded-xl mb-4">
                  <span className={`text-sm font-bold ${themeColors.primary} font-mono uppercase block`}>الفرضية الرئيسية العامة للبحث:</span>
                  <p className="text-base md:text-lg text-gray-900 mt-2 leading-relaxed font-semibold">
                    &quot;{HYPOTHESES.main}&quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {HYPOTHESES.subHypotheses.map((h, idx) => {
                    // Check if it's approved natively in the study (Security and software are approved; others are not direct)
                    const isApproved = h.status.includes("دال إحصائياً");
                    const isSignificant = isApproved && !h.status.includes("عكسي");

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col justify-between h-48 transition-all hover:translate-y-[-2px] ${
                          isSignificant
                            ? `${themeColors.accentBg} bg-opacity-10 border-current ${themeColors.borderGlow}`
                            : isApproved
                            ? "bg-orange-600/10 border-orange-600/40"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-mono text-gray-500 block mb-2">الفرضية الفرعية {idx + 1}</span>
                          <p className="text-base text-gray-900 font-medium leading-relaxed line-clamp-4">
                            {h.text}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-gray-300/60 flex items-center justify-between text-sm">
                          <span className="text-gray-500 font-mono">التحقق الإحصائي:</span>
                          <span className={`font-semibold ${
                            isSignificant ? themeColors.accentText : isApproved ? "text-orange-400" : "text-gray-600"
                          }`}>
                            {h.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Slide 3: Operational Definitions of Variables */}
            {currentSlide === 3 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور الثالث</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <Database className={`w-7 h-7 ${themeColors.primary}`} />
                    النمذجة والتعريفات الإجرائية لمتغيرات الدراسة
                  </h3>
                </div>

                <p className="text-base text-gray-600 leading-normal max-w-3xl">
                  تحديد دقيق للمحاور الهيكلية المستقرة في الاستبانة والجانب النظري. انقر فوق أي بُعد لاستعراض أبعاده وعناصره الإجرائية المعرّفة بالميدان.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                  {/* Independent variables row */}
                  <div className="space-y-4">
                    <div className={`bg-gradient-to-l from-slate-800 to-slate-900 p-4 border ${themeColors.borderGlow} border-current rounded-2xl`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${themeColors.primary} uppercase tracking-widest font-mono`}>النموذج الهيكلي:</span>
                        <span className={`text-sm px-2.5 py-0.5 rounded-full ${themeColors.primaryBg} bg-opacity-30 ${themeColors.primary} font-semibold`}>المتغير المستقل</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-100 mt-2">{VARIABLES.independent.name}</h4>
                      <p className="text-sm text-gray-600 leading-normal mt-1">{VARIABLES.independent.definition}</p>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {VARIABLES.independent.dimensions.map((dim, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setDimensionFocus(dim.name);
                            setVariableFocus("independent");
                          }}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                            dimensionFocus === dim.name && variableFocus === "independent"
                              ? `${themeColors.primaryBg} bg-opacity-20 border-current ${themeColors.borderGlow} shadow-md`
                              : "bg-gray-50 border-gray-300 hover:border-slate-600 hover:bg-gray-100"
                          }`}
                        >
                          <h5 className="text-sm font-bold text-gray-900">{dim.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dim.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dependent variable row */}
                  <div className="space-y-4">
                    <div className={`bg-gradient-to-l from-slate-800 to-slate-900 p-4 border ${themeColors.borderGlow} border-current rounded-2xl`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-bold ${themeColors.accentText} uppercase tracking-widest font-mono`}>مخرجات الكفاءة العامة:</span>
                        <span className={`text-sm px-2.5 py-0.5 rounded-full ${themeColors.accentBg} bg-opacity-30 ${themeColors.accentText} font-semibold`}>المتغير التابع</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-100 mt-2">{VARIABLES.dependent.name}</h4>
                      <p className="text-sm text-gray-600 leading-normal mt-1">{VARIABLES.dependent.definition}</p>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {VARIABLES.dependent.dimensions.map((dim, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setDimensionFocus(dim.name);
                            setVariableFocus("dependent");
                          }}
                          className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                            dimensionFocus === dim.name && variableFocus === "dependent"
                              ? `${themeColors.accentBg} bg-opacity-20 border-current ${themeColors.borderGlow} shadow-md`
                              : "bg-gray-50 border-gray-300 hover:border-slate-600 hover:bg-gray-100"
                          }`}
                        >
                          <h5 className="text-sm font-bold text-gray-900">{dim.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{dim.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive variable explanation panel */}
                <AnimatePresence>
                  {dimensionFocus && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3 rounded-xl border border-gray-300 text-sm text-justify text-gray-700 relative"
                    >
                      <button
                        onClick={() => setDimensionFocus(null)}
                        className="absolute left-3 top-3 text-xs hover:text-white bg-slate-800 px-2 py-0.5 rounded"
                      >
                        إغلاق التفسير
                      </button>
                      <h5 className={`font-bold ${themeColors.primary} mb-1 text-base`}>
                        تفصيل بُعد: {dimensionFocus} ({variableFocus === "independent" ? "المستقل" : "التابع"})
                      </h5>
                      <span className="leading-relaxed text-sm">
                        {variableFocus === "independent"
                          ? VARIABLES.independent.dimensions.find(d => d.name === dimensionFocus)?.desc
                          : VARIABLES.dependent.dimensions.find(d => d.name === dimensionFocus)?.desc}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Slide 4: Methodology and Survey Tools */}
            {currentSlide === 4 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور الرابع</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <Briefcase className={`w-7 h-7 ${themeColors.primary}`} />
                    المنهجية العلمية المتبعة وأدوات جمع البيانات
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  {/* Research design cards */}
                  <div className="md:col-span-4 bg-white border-2 border-gray- shadow-lg300 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className={`text-sm ${themeColors.primary} block font-mono font-bold tracking-wider mb-2`}>منهج الدراسة العام:</span>
                      <h4 className="text-xl font-bold text-white mb-3">{METHODOLOGY.approach}</h4>
                      <p className="text-base text-gray-700 leading-relaxed text-justify">
                        يعد هذا المنهج الأمثل لتشخيص الظواهر وعلاقات الارتباط والأثر علميًا ووصفها ومقارنتها كمياً وكيفياً بالمديرية العملية لاتصالات الجزائر بالجلفة.
                      </p>
                    </div>
                    <div className="pt-4 border-t border-gray-300 mt-4">
                      <span className="text-sm text-gray-500 block font-col">أسلوب حصر المجتمع:</span>
                      <p className="text-base font-semibold text-gray-900 mt-1">{METHODOLOGY.sample.type}</p>
                    </div>
                  </div>

                  {/* Study Tools Interactive grid */}
                  <div className="md:col-span-8 flex flex-col justify-between p-5 bg-gray-50 border-2 border-gray- shadow-md300 rounded-2xl space-y-4">
                    <span className="text-sm font-bold text-gray-600 block font-mono">طرق وأدوات البحث المعتمدة (التكامل المنهجي):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {METHODOLOGY.tools.map((tool, idx) => (
                        <div key={idx} className="bg-gray-50 border-2 border-gray- shadow-md300 p-5 rounded-xl space-y-2 hover:bg-white transition-colors">
                          <div className={`w-10 h-10 rounded-lg ${themeColors.primaryBg} bg-opacity-20 border ${themeColors.borderGlow} border-current flex items-center justify-center`}>
                            {idx === 0 ? <FileSpreadsheet className={`w-5 h-5 ${themeColors.primary}`} /> : idx === 1 ? <Users className={`w-5 h-5 ${themeColors.primary}`} /> : <Monitor className={`w-5 h-5 ${themeColors.primary}`} />}
                          </div>
                          <h4 className="text-base font-bold text-slate-100">{tool.title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed text-justify">{tool.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className={`p-4 ${themeColors.primaryBg} bg-opacity-10 border ${themeColors.borderGlow} border-current rounded-xl flex items-center justify-between text-sm flex-wrap gap-3`}>
                      <div>
                        <span className="text-gray-600 font-mono">إجمالي مجتمع الميدان:</span>
                        <strong className="text-gray-900 font-mono mx-1.5">50 عامل</strong>
                      </div>
                      <div>
                        <span className="text-gray-600 font-mono">الاستمارات الصالحة المسترجعة:</span>
                        <strong className={`${themeColors.primary} font-mono mx-1.5`}>{METHODOLOGY.sample.valid} مفردة</strong>
                      </div>
                      <div>
                        <span className="text-gray-600 font-mono">نسبة الاستجابة الكلية:</span>
                        <strong className={`${themeColors.accentText} font-mono mx-1.5`}>{METHODOLOGY.sample.rate}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 5: Demographic Sample characteristics Dashboard */}
            {currentSlide === 5 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور الخامس</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <Users className={`w-7 h-7 ${themeColors.primary}`} />
                    لوحة التحليل الديموغرافي التفاعلي لعينة الميدان
                  </h3>
                </div>

                <p className="text-base text-gray-600 leading-normal max-w-2xl">
                  استعرض وصفي مفصّل لتراكم مستويات الخبرة والتعليم والجنس والوظيفة للمستجوبين بالمؤسسة تم فحصهم بواسطة برنامج SPSS.
                </p>

                {/* Embed the majestic InteractiveChart component */}
                <InteractiveChart />
              </div>
            )}

            {/* Slide 6: Cronbach's Alpha Reliability Verification */}
            {currentSlide === 6 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور السادس</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <Shield className={`w-7 h-7 ${themeColors.primary}`} />
                    معاملات ثبات الاستبيان (ألفا كرونباخ)
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-base text-gray-700 leading-relaxed text-justify">
                      {RELIABILITY.desc} يُجمع الخبراء الإحصائيون أن قيم ألفا كرونباخ التي تتخطى العتبة الكلاسيكية (0.60 أو 0.70) تؤكد متانة وتناغم المقياس العلمي وقدرة الأداة على إعطاء نتائج متماثلة ومستقرة إذا تم تكرار التطبيق في بيئة عمل مماثلة.
                    </p>
                    <div className="p-5 bg-white border-2 border-gray- shadow-lg300 rounded-2xl space-y-4">
                      {RELIABILITY.fields.map((field, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-200/50 pb-3 last:border-none last:pb-0">
                          <div>
                            <h4 className="text-base font-bold text-gray-900">{field.name}</h4>
                            <span className="text-sm text-gray-500 font-mono mt-1 block">عدد مؤشراته: {field.items}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-semibold px-3 py-1 rounded ${themeColors.accentBg} ${themeColors.accentText} border ${themeColors.borderGlow} border-current bg-opacity-20`}>
                              {field.ranking}
                            </span>
                            <span className={`text-xl font-mono font-bold ${themeColors.primary}`}>
                              α = {field.value.toFixed(3)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`lg:col-span-5 ${themeColors.primaryBg} bg-opacity-10 border ${themeColors.borderGlow} border-current rounded-2xl p-6 text-center space-y-4 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
                    <span className={`text-sm font-bold ${themeColors.primary} uppercase tracking-widest font-mono`}>التقييم الأكاديمي الكلي للثبات:</span>
                    <div className={`text-5xl ${themeColors.accentText} font-black animate-pulse`}>ثبات معزز</div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {RELIABILITY.standard}
                    </p>
                    <div className="flex justify-center gap-1.5 mt-2">
                      <span className={`w-2 h-2 rounded-full ${themeColors.accentBg}`} />
                      <span className={`w-2 h-2 rounded-full ${themeColors.accentBg} animate-pulse`} />
                      <span className={`w-2 h-2 rounded-full ${themeColors.accentBg}`} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 7: Descriptives & Correlation */}
            {currentSlide === 7 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور السابع</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <BarChart2 className={`w-7 h-7 ${themeColors.primary}`} />
                    التحليل الوصفي للمتغيرات ومصفوفة الارتباط لبيرسون
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Descriptives table */}
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-sm font-bold text-gray-600 block font-mono">جدول الإحصاء الوصفي للأبعاد (الترتيب التنازلي الحسابي):</span>
                    <div className="border border-gray-300 bg-white rounded-xl overflow-hidden shadow">
                      <table className="w-full text-right border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-100 border-b border-gray-300 text-gray-600">
                            <th className="p-4 font-semibold">بُعد المتغير المستقل</th>
                            <th className="p-4 font-semibold font-mono text-center">المتوسط الحسابي</th>
                            <th className="p-4 font-semibold font-mono text-center">الانحراف المعياري</th>
                            <th className="p-4 font-semibold font-mono text-center">النطاق</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/50">
                          {DESCRIPTIVE_STATS.map((stat, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 text-gray-700 transition-colors">
                              <td className="p-4 font-bold text-base">{stat.arabicName}</td>
                              <td className={`p-4 font-mono text-center ${themeColors.primary} font-bold text-base`}>{stat.mean.toFixed(4)}</td>
                              <td className="p-4 font-mono text-center text-gray-600">{stat.sd.toFixed(5)}</td>
                              <td className="p-4 font-mono text-center text-gray-500">[{stat.min.toFixed(2)} - {stat.max.toFixed(2)}]</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Association & Pearson Correlation */}
                  <div className="lg:col-span-5 space-y-4">
                    <span className={`text-sm font-bold ${themeColors.accentText} block font-mono`}>طبيعة وقوة الارتباط الكلي (Pearson Correlation):</span>
                    <div className="bg-white border-2 border-gray- shadow-lg300 rounded-2xl p-5 space-y-4">
                      <div className={`flex justify-between items-center ${themeColors.primaryBg} bg-opacity-10 px-4 py-3 rounded-xl border ${themeColors.borderGlow} border-current`}>
                        <span className="text-base text-gray-700 font-semibold font-mono">معامل ارتباط بيرسون (r_xy):</span>
                        <span className={`text-2xl font-mono font-black ${themeColors.primary}`}>0.627**</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-100 px-4 py-2.5 rounded-xl text-sm">
                        <span className="text-gray-600 font-mono">مستوى الدلالة (Sig. 2-tailed):</span>
                        <span className="text-gray-900 font-mono font-semibold">0.001</span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-100 px-4 py-2.5 rounded-xl text-sm">
                        <span className="text-gray-600 font-mono">حجم عينة الميدان المحسوبة (N):</span>
                        <span className="text-gray-900 font-mono font-semibold">38 عامل</span>
                      </div>
                      <p className="text-sm text-gray-600 text-justify leading-relaxed">
                        ** تشير الدلالة الإحصائية عند مستوى المعنوية (0.01) إلى وجود <strong>علاقة طردية قوية ذات دلالة إحصائية</strong>. ترتفع معها نواتج الأداء الكلي لاتصالات الجزائر بالجلفة تصاعديًا مع ارتفاع مستويات الاهتمام بأمن المعلومات والشبكات والتطبيقات التكنولوجية.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 8: Inferential Regression Simulation Tools */}
            {currentSlide === 8 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور الثامن</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <Zap className={`w-7 h-7 ${themeColors.primary}`} />
                    نمذجة الاستدلال وأثر الانحدار الإحصائي
                  </h3>
                </div>

                <p className="text-base text-gray-600 leading-normal max-w-2xl">
                  لوحة المحاكاة الرياضية التنبؤية للأداء المؤسسي بناءً على الأوزان الإحصائية المستخرجة من برنامج SPSS. حرك المقاييس لتلاحظ تغير نتائج التنبؤ المالي والخدمي.
                </p>

                {/* Embed the majestic RegressionSimulator component */}
                <RegressionSimulator />
              </div>
            )}

            {/* Slide 9: Recommendations and Thesis Outlook */}
            {currentSlide === 9 && (
              <div className="space-y-6 py-2 md:py-6">
                <div className="border-b border-gray-300 pb-3">
                  <span className={`text-sm font-mono ${themeColors.primary} font-semibold`}>المحور التاسع</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mt-2">
                    <GraduationCap className={`w-7 h-7 ${themeColors.primary}`} />
                    التوصيات الاستراتيجية المسطّرة والمقترحات
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* List of study recommendations */}
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-sm font-bold text-gray-600 block font-mono">طرق العمل وخارطة الطريق المقترحة (التوصيات):</span>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {RECOMMENDATIONS.map((recom, idx) => (
                        <div key={idx} className="bg-white border-2 border-gray- shadow-lg200 p-4 rounded-xl hover:bg-gray-100 transition-all flex items-start gap-3">
                          <span className={`w-2.5 h-2.5 rounded ${themeColors.primaryBg} shrink-0 mt-2`} />
                          <div>
                            <span className={`text-sm font-bold px-3 py-1 rounded ${themeColors.primaryBg} ${themeColors.primary} border ${themeColors.borderGlow} border-current bg-opacity-20 font-mono mb-2 inline-block`}>
                              بُعد {recom.type}
                            </span>
                            <p className="text-base text-gray-900 leading-relaxed text-justify">{recom.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Future Horizons */}
                  <div className="lg:col-span-5 space-y-4 bg-gray-50 border-2 border-gray- shadow-md300 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
                    <h4 className={`text-base font-bold uppercase tracking-wider ${themeColors.primary} font-mono mb-4 flex items-center gap-2 border-b border-gray-300 pb-3`}>
                      <Sparkles className={`w-5 h-5 ${themeColors.primary}`} />
                      آفاق وتوجهات الدراسات المستقبلية المسطرة
                    </h4>

                    <div className="space-y-3">
                      {FUTURE_HORIZONS.map((hor, idx) => (
                        <div key={idx} className="bg-gray-50 border-2 border-gray- shadow-md200 p-4 rounded-lg hover:border-gray-300 transition-colors flex gap-3">
                          <div className={`w-9 h-9 ${themeColors.primaryBg} bg-opacity-20 border ${themeColors.borderGlow} border-current rounded flex items-center justify-center shrink-0`}>
                            {idx === 0 ? <Sparkles className={`w-4 h-4 ${themeColors.primary}`} /> : idx === 1 ? <ShieldAlert className={`w-4 h-4 ${themeColors.primary}`} /> : <GitMerge className={`w-4 h-4 ${themeColors.primary}`} />}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed text-justify">{hor.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 10: Closing Acknowledgements Slide */}
            {currentSlide === 10 && (
              <div className="py-8 md:py-16 text-center space-y-8 relative flex flex-col items-center justify-center min-h-[400px]">
                {/* Moving background stars logic */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)] pointer-events-none" />

                <div className={`w-24 h-24 rounded-2xl ${themeColors.primaryBg} bg-opacity-20 border ${themeColors.borderGlow} border-current p-0.5 animate-bounce flex items-center justify-center shadow-lg shadow-emerald-950/40 mb-4`} style={{ animationDuration: "2s" }}>
                  <Award className={`w-12 h-12 ${themeColors.primary}`} />
                </div>

                <div className="space-y-3 max-w-3xl">
                  <h1 className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-${themeColors.primary} to-${themeColors.accentText} tracking-tight leading-normal`}>
                    شكراً على حسن الإصغاء والمتابعة
                  </h1>
                  <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed border-t border-gray-300 pt-4">
                    نتقدم بخالص الشكر والتقدير إلى السادة الأفاضل رئيس وأعضاء لجنة المناقشة الموقرة لتقييم المذكرة وتصويبها بملاحظاتهم القيمة.
                  </p>
                </div>

                <div className="pt-8 grid grid-cols-2 gap-5 max-w-lg w-full">
                  <div className="space-y-1 bg-white border-2 border-gray- shadow-lg300 p-4 rounded-xl">
                    <span className="text-xs text-gray-500 font-mono">الباحث الأول:</span>
                    <h4 className="text-base font-bold text-gray-900">براهـيمـي عبـدالله</h4>
                  </div>
                  <div className="space-y-1 bg-white border-2 border-gray- shadow-lg300 p-4 rounded-xl">
                    <span className="text-xs text-gray-500 font-mono">الباحث الثاني:</span>
                    <h4 className="text-base font-bold text-gray-900">غيـثـي سليمــان</h4>
                  </div>
                </div>

                <p className="text-sm text-gray-500 font-mono mt-10">
                  جامعة زيان عاشور الجلفة - كلية العلوم الاقتصادية والتجارية وعلوم التسيير
                </p>
              </div>
            )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right Vertical Navigation Sidebar */}
      <aside className={`w-20 border-l ${themeColors.cardBorder} ${themeColors.cardBg} shadow-lg backdrop-blur-md flex flex-col items-center py-4 gap-3 z-40 shrink-0 transition-all duration-300 ${
        isNavOpen ? "w-80" : "w-20"
      }`}>
        {/* Toggle Navigation Button */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className={`w-16 h-16 rounded-xl ${themeColors.primaryBg} text-white flex items-center justify-center transition-all hover:scale-105 shadow-lg mb-2`}
          title="فتح/إغلاق فهرس المحاور"
        >
          {isNavOpen ? <ChevronRight className="w-7 h-7" /> : <Layers className="w-7 h-7" />}
        </button>

        {/* Slide navigation or list */}
        {!isNavOpen ? (
          <>
            {/* Compact slide indicators */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto py-2 items-center w-full px-2">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-14 h-14 rounded-lg border-2 transition-all flex items-center justify-center text-base font-bold ${
                    currentSlide === idx
                      ? `${themeColors.borderGlow} ${themeColors.primary} ${themeColors.cardBg} border-current shadow-md`
                      : `${themeColors.cardBorder} ${themeColors.textSecondary} hover:${themeColors.textMain} hover:border-gray-400`
                  }`}
                  title={s.title}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto w-full px-4 pb-4">
            <h3 className={`text-sm font-bold ${themeColors.textSecondary} uppercase tracking-wider mb-3 text-right`}>
              فهرس المحاور
            </h3>
            <div className="space-y-2">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-full p-4 rounded-xl border text-right transition-all ${
                    currentSlide === idx
                      ? `${themeColors.primaryBg} text-white border-transparent shadow-lg`
                      : `${themeColors.cardBg} ${themeColors.cardBorder} hover:shadow-md ${themeColors.textMain}`
                  }`}
                >
                  <span className={`text-xs font-mono leading-none tracking-wider mb-1 block ${currentSlide === idx ? "text-white/90" : themeColors.textSecondary}`}>
                    المحور {idx + 1}
                  </span>
                  <h4 className={`text-sm font-bold ${currentSlide === idx ? "text-white" : themeColors.textMain}`}>
                    {s.title}
                  </h4>
                  <p className={`text-xs mt-0.5 truncate ${currentSlide === idx ? "text-white/80" : themeColors.textSecondary}`}>{s.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Presentation visual bottom controls - standard slick footer */}
      <footer className="border-t border-gray-200 bg-gray-100/85 backdrop-blur-md px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-40 fixed bottom-0 right-0 left-0">
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-gray-700 rounded-lg border border-gray-300 transition-colors"
            title="الشريحة السابقة (السهم الأيمن للكيبورد)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Miniature index markers */}
          <div className="flex items-center gap-1 px-3">
            {slides.map((_, sidx) => (
              <button
                key={sidx}
                onClick={() => goToSlide(sidx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === sidx ? "w-6 bg-cyan-400" : "w-2.5 bg-slate-800 hover:bg-slate-700"
                }`}
                title={`الذهاب إلى: ${slides[sidx].title}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-gray-700 rounded-lg border border-gray-300 transition-colors"
            title="الشريحة التالية (السهم الأيسر أو مسافة الكيبورد)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Live contextual metadata details */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1 bg-slate-900/50 px-2.5 py-1 rounded border border-gray-200 text-gray-600 font-mono">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>عرض تفاعلي مباشر</span>
          </div>

          <span className="text-gray-500 hidden sm:inline">|</span>

          <span className="text-[11px] font-bold text-gray-700 leading-none">
            {slides[currentSlide].title} - <span className="text-gray-500 font-medium">{slides[currentSlide].subtitle}</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
