import { AlertTriangle, HelpCircle, RefreshCw, ShieldCheck, Sliders } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function RegressionSimulator() {
  const [modelType, setModelType] = useState<'simple' | 'multiple'>('multiple');

  // Simple regression states
  const [ictScore, setIctScore] = useState<number>(4.0);

  // Multiple regression states
  const [infra, setInfra] = useState<number>(4.1);
  const [software, setSoftware] = useState<number>(4.1);
  const [hr, setHr] = useState<number>(4.0);
  const [security, setSecurity] = useState<number>(4.1);
  const [culture, setCulture] = useState<number>(3.9);

  const [predictedScore, setPredictedScore] = useState<number>(3.91);

  // Reset values
  const handleReset = () => {
    setIctScore(4.02);
    setInfra(4.08);
    setSoftware(4.09);
    setHr(3.96);
    setSecurity(4.11);
    setCulture(3.90);
  };

  useEffect(() => {
    if (modelType === 'simple') {
      // Y = 0.943 + 0.737 * X
      const score = 0.943 + 0.737 * ictScore;
      setPredictedScore(Math.min(5.0, Math.max(1.0, Number(score.toFixed(3)))));
    } else {
      // Y = 1.961 + 0.080*Infra - 0.467*Software + 0.076*HR + 0.530*Security + 0.270*Culture
      const score = 1.961 + 
                    0.080 * infra - 
                    0.467 * software + 
                    0.076 * hr + 
                    0.530 * security + 
                    0.270 * culture;
      setPredictedScore(Math.min(5.0, Math.max(1.0, Number(score.toFixed(3)))));
    }
  }, [modelType, ictScore, infra, software, hr, security, culture]);

  // Interpret score range
  const getPerformanceRating = (score: number) => {
    if (score >= 4.2) return { text: "أداء ممتاز وريادي", color: "text-emerald-700 bg-emerald-50 border-emerald-300" };
    if (score >= 3.4) return { text: "أداء مرتفع ومستقر", color: "text-orange-700 bg-orange-50 border-orange-300" };
    if (score >= 2.6) return { text: "أداء متوسط مقبول", color: "text-amber-700 bg-amber-50 border-amber-300" };
    return { text: "أداء منخفض وبيروقراطي", color: "text-rose-700 bg-rose-50 border-rose-300" };
  };

  const rating = getPerformanceRating(predictedScore);

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // Let's make gauge half circle (from -180deg to 0deg) or full. We'll use full circle but only show progress.
  // The normalized score (1.0 to 5.0) converted to percentage (0% to 100%)
  const percentage = ((predictedScore - 1) / 4) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-gray-100 pb-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Sliders className="w-7 h-7 text-emerald-700" />
            نموذج المحاكاة التنبؤية للأداء المؤسسي
          </h3>
          <p className="text-lg text-gray-600 mt-2">
            مبني على معادلات الانحدار الإحصائي المستخرجة من تحليل برنامج SPSS لبيانات الميدان
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModelType('multiple')}
            className={`px-5 py-2.5 rounded-lg text-base font-bold transition-all border-2 ${
              modelType === 'multiple'
                ? 'bg-emerald-600 text-white shadow-md border-emerald-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
            }`}
          >
            الانحدار المتعدد (النموذج الفرعي)
          </button>
          <button
            onClick={() => setModelType('simple')}
            className={`px-5 py-2.5 rounded-lg text-base font-bold transition-all border-2 ${
              modelType === 'simple'
                ? 'bg-emerald-600 text-white shadow-md border-emerald-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
            }`}
          >
            الانحدار البسيط (النموذج الكلي)
          </button>
          <button
            onClick={handleReset}
            className="p-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors border-2 border-gray-300"
            title="إعادة التعيين لمتوسطات الميدان الفعلية"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Sliders Controls */}
        <div className="lg:col-span-7 space-y-5">
          {modelType === 'simple' ? (
            <div className="space-y-5 bg-white border-2 border-gray-300 p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">مستوى تكنولوجيا المعلومات العام (X)</span>
                <span className="text-2xl font-mono font-bold text-white bg-emerald-600 px-4 py-2 rounded-lg border-2 border-emerald-700 shadow-md">
                  {ictScore.toFixed(2)} / 5.00
                </span>
              </div>
              <input
                type="range"
                min="1.00"
                max="5.00"
                step="0.05"
                value={ictScore}
                onChange={(e) => setIctScore(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-3 rounded-full"
              />
              <div className="flex justify-between text-base text-gray-600 font-mono font-semibold">
                <span>1.00 (منخفض جداً)</span>
                <span>3.00 (متوسط)</span>
                <span>5.00 (مرتفع جداً)</span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-justify bg-emerald-50 p-5 rounded-lg border-2 border-emerald-200">
                <strong className="text-gray-900">صيغة النموذج الكلي:</strong> <code className="text-emerald-700 font-mono font-bold text-xl">Y = 0.943 + 0.737 * X</code>. 
                أي أن أي زيادة بوحدة واحدة في مستوى تكنولوجيا المعلومات بالمؤسسة تقود تلقائياً لتحسين الأداء بمقدار <span className="text-emerald-700 font-bold text-xl">0.737</span> درجة، بمستوى دلالة إحصائية ممتاز (<code className="text-gray-700 font-semibold">p = 0.001</code>).
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Infrastructure */}
              <div className="space-y-3 bg-white border-2 border-gray-300 p-4 rounded-xl">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">البنية التحتية والشبكات (Beta = 0.089)</span>
                  <span className="font-mono text-emerald-600 font-bold text-xl">{infra.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={infra}
                  onChange={(e) => setInfra(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-2.5 rounded-full"
                />
              </div>

              {/* Software (Negative weight) */}
              <div className="space-y-3 bg-white border-2 border-gray-300 p-4 rounded-xl">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    البرمجيات والأنظمة (Beta = -0.364)
                    <HelpCircle className="w-5 h-5 text-rose-600 cursor-help" title="تفسير الوزن السالب إحصائياً" />
                  </span>
                  <span className="font-mono text-emerald-600 font-bold text-xl">{software.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={software}
                  onChange={(e) => setSoftware(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-2.5 rounded-full"
                />
              </div>

              {/* Technical HR */}
              <div className="space-y-3 bg-white border-2 border-gray-300 p-4 rounded-xl">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">الموارد البشرية التقنية (Beta = 0.072)</span>
                  <span className="font-mono text-emerald-600 font-bold text-xl">{hr.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={hr}
                  onChange={(e) => setHr(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-2.5 rounded-full"
                />
              </div>

              {/* Security */}
              <div className="space-y-3 bg-emerald-50 p-5 rounded-xl border-2 border-emerald-300 shadow-md">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-emerald-700 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    الأمن والخصوصية الرقمية (Beta = 0.639) ★ الأكثر تأثيراً
                  </span>
                  <span className="font-mono text-emerald-700 font-bold text-xl">{security.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={security}
                  onChange={(e) => setSecurity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 h-2.5 rounded-full"
                />
              </div>

              {/* Digital Culture */}
              <div className="space-y-3 bg-white border-2 border-gray-300 p-4 rounded-xl">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">الثقافة والاستراتيجية الرقمية (Beta = 0.297)</span>
                  <span className="font-mono text-emerald-600 font-bold text-xl">{culture.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={culture}
                  onChange={(e) => setCulture(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-2.5 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Prediction Output & Interpretation */}
        <div className="lg:col-span-5 bg-white border-2 border-gray-200 p-6 rounded-2xl flex flex-col items-center justify-between text-center min-h-[300px] shadow-md">
          <span className="text-lg font-semibold text-gray-600 uppercase tracking-wider">الأداء المؤسسي المتوقع</span>

          {/* Graphical Gauge Ring */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-gray-200 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-emerald-600 transition-all duration-300 ease-out fill-none"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-mono font-black text-gray-900 tracking-tight">{predictedScore.toFixed(2)}</span>
              <span className="text-sm text-gray-500">من أصل 5.00</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className={`py-3 px-5 rounded-xl text-lg font-bold border-2 transition-all ${rating.color}`}>
              {rating.text}
            </div>

            {modelType === 'multiple' && (
              <div className="flex gap-3 p-4 bg-rose-50 border-2 border-rose-300 rounded-lg items-start text-right text-base text-rose-800 leading-relaxed">
                <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-1" />
                <p>
                  <strong className="font-bold">ملاحظة فنية:</strong> يعود الوزن المتناقض والسالب لبُعد البرمجيات (-0.467) لوجود ارتباط تشابكي عالٍ بين الأبعاد (التعددية الخطية) وتأثير الكبت الإحصائي ببرنامج SPSS، ولا يعني إطلاقا أن جودة النظام البرمجي تضر بمستوى الأداء فعلياً.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
