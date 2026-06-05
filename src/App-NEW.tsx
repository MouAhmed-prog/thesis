import {
    Award,
    CheckCircle2,
    ChevronRight,
    Layers,
    Monitor,
    Network,
    Pause,
    Play,
    Users
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import {
    THESIS_META
} from "./data";


export default function App() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoplaySpeed, setAutoplaySpeed] = useState<number>(12);
  const [progress, setProgress] = useState<number>(0);
  const [currentTheme, setCurrentTheme] = useState<"telecom" | "classic" | "cosmic">("telecom");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [variableFocus, setVariableFocus] = useState<"none" | "independent" | "dependent">("none");
  const [dimensionFocus, setDimensionFocus] = useState<string | null>(null);

  const totalSlides = 11;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Professional colors - Clean and sophisticated
  const colors = {
    primary: "emerald-700",
    accent: "orange-600", 
    bg: "stone-50",
    card: "white",
    text: "gray-900",
    textLight: "gray-600",
    border: "gray-200"
  };

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") nextSlide();
      else if (e.key === "ArrowRight") prevSlide();
      else if (e.key === "Space" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            nextSlide();
            return 0;
          }
          return p + (100 / (autoplaySpeed * 10));
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
    <div className={`min-h-screen bg-${colors.bg} text-${colors.text} flex relative font-sans overflow-hidden`}>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top header */}
        <header className={`border-b border-${colors.border} bg-${colors.card} shadow-sm px-8 py-5 flex items-center justify-between z-40`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-${colors.primary} flex items-center justify-center shadow-md`}>
              <Network className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold text-${colors.text} leading-none`}>
                منصة العرض الأكاديمي التفاعلي
              </h1>
              <span className={`text-lg text-${colors.textLight} mt-1 block`}>
                Ziane Achour University - Djelfa
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-3 rounded-xl transition-all border-2 ${
                isPlaying ? `bg-${colors.primary} text-white border-${colors.primary}` : `bg-white text-${colors.textLight} border-${colors.border} hover:border-${colors.primary}`
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-3 rounded-xl bg-white text-${colors.textLight} border-2 border-${colors.border} hover:border-${colors.primary} transition-all`}
            >
              <Monitor className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto">
          {isPlaying && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-80 h-2 bg-gray-200 rounded-full overflow-hidden z-50 shadow-lg">
              <div className={`h-full bg-${colors.primary} transition-all duration-100`} style={{ width: `${progress}%` }} />
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex-1 w-full flex flex-col justify-center"
            >
              {/* Slide 0: Cover */}
              {currentSlide === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
                  <div className="space-y-8 text-right">
                    <div>
                      <span className={`text-${colors.primary} text-lg font-semibold tracking-wide uppercase`}>
                        جامعة زيان عاشور الجلفة
                      </span>
                      <h2 className={`text-5xl md:text-6xl font-bold text-${colors.text} leading-tight mt-3`}>
                        {THESIS_META.title}
                      </h2>
                      <p className={`text-2xl text-${colors.textLight} mt-6 border-r-4 border-${colors.primary} pr-6`}>
                        {THESIS_META.subTitle}
                      </p>
                    </div>

                    <div className={`grid grid-cols-2 gap-6 bg-white border-2 border-${colors.border} p-8 rounded-2xl shadow-lg`}>
                      <div>
                        <span className={`text-base text-${colors.textLight} block mb-3`}>الطالبان الباحثان:</span>
                        {THESIS_META.students.map((s, i) => (
                          <div key={i} className="flex items-center gap-2 mb-2">
                            <Users className={`w-6 h-6 text-${colors.primary}`} />
                            <span className={`text-xl font-semibold text-${colors.text}`}>{s}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <span className={`text-base text-${colors.textLight} block mb-3`}>المشرف:</span>
                        <div className="flex items-center gap-2">
                          <Award className={`w-6 h-6 text-${colors.accent}`} />
                          <span className={`text-xl font-semibold text-${colors.accent}`}>{THESIS_META.supervisor}</span>
                        </div>
                      </div>
                    </div>

                    <p className={`text-lg text-${colors.textLight} leading-relaxed`}>
                      مذكرة مكملة لنيل شهادة ماستر أكاديمي في شعبة علوم التسيير - تخصص إدارة أعمال
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className={`w-96 h-96 rounded-full border-4 border-${colors.border} bg-white shadow-2xl flex items-center justify-center`}>
                      <div className="text-center">
                        <Monitor className={`w-24 h-24 text-${colors.primary} mx-auto mb-6`} />
                        <h3 className={`text-2xl font-bold text-${colors.text}`}>اتصالات الجزائر</h3>
                        <p className={`text-lg text-${colors.textLight} mt-2`}>المديرية العملية - الجلفة</p>
                        <div className={`mt-6 inline-flex items-center gap-2 bg-${colors.accent} bg-opacity-10 border-2 border-${colors.accent} px-6 py-3 rounded-full`}>
                          <CheckCircle2 className={`w-6 h-6 text-${colors.accent}`} />
                          <span className={`text-lg font-bold text-${colors.accent}`}>{THESIS_META.defenseDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add other slides here with same clean styling */}
              
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Right sidebar */}
      <aside className={`w-24 border-l-2 border-${colors.border} bg-${colors.card} shadow-lg flex flex-col items-center py-6 gap-4 z-40 ${
        isNavOpen ? "w-96" : "w-24"
      } transition-all duration-300`}>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className={`w-16 h-16 rounded-xl bg-${colors.primary} text-white flex items-center justify-center hover:scale-105 transition-all shadow-md`}
        >
          {isNavOpen ? <ChevronRight className="w-8 h-8" /> : <Layers className="w-8 h-8" />}
        </button>

        {!isNavOpen ? (
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto items-center w-full px-2">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-16 h-16 rounded-xl border-3 transition-all flex items-center justify-center text-xl font-bold shadow-sm ${
                  currentSlide === idx
                    ? `bg-${colors.primary} text-white border-${colors.primary}`
                    : `bg-white text-${colors.textLight} border-${colors.border} hover:border-${colors.primary}`
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto w-full px-6">
            <h3 className={`text-lg font-bold text-${colors.textLight} uppercase mb-4 text-right`}>فهرس المحاور</h3>
            <div className="space-y-3">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`w-full p-5 rounded-xl border-2 text-right transition-all ${
                    currentSlide === idx
                      ? `bg-${colors.primary} text-white border-${colors.primary} shadow-lg`
                      : `bg-white text-${colors.text} border-${colors.border} hover:border-${colors.primary} hover:shadow-md`
                  }`}
                >
                  <span className={`text-sm block mb-1 ${currentSlide === idx ? "text-white/80" : `text-${colors.textLight}`}`}>
                    المحور {idx + 1}
                  </span>
                  <h4 className="text-lg font-bold">{s.title}</h4>
                  <p className={`text-sm mt-1 ${currentSlide === idx ? "text-white/70" : `text-${colors.textLight}`}`}>{s.subtitle}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
