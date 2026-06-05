import { Briefcase, Calendar, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { DEMOGRAPHIC_DATA } from '../data';

export default function InteractiveChart() {
  const [activeTab, setActiveTab] = useState<'gender' | 'age' | 'education' | 'experience' | 'jobLevel'>('gender');

  const tabs = [
    { id: 'gender', name: 'الجنس', icon: Users, color: 'from-emerald-600 to-emerald-500' },
    { id: 'age', name: 'الفئات العمرية', icon: Calendar, color: 'from-orange-600 to-orange-500' },
    { id: 'education', name: 'المستوى التعليمي', icon: GraduationCap, color: 'from-emerald-600 to-emerald-500' },
    { id: 'experience', name: 'سنوات الخبرة', icon: Briefcase, color: 'from-orange-600 to-orange-500' },
    { id: 'jobLevel', name: 'المستوى الوظيفي', icon: ShieldCheck, color: 'from-emerald-600 to-emerald-500' },
  ] as const;

  const currentData = DEMOGRAPHIC_DATA[activeTab];

  // Calculate coordinates for circular representation if gender, or max percentages for scaling
  const maxVal = Math.max(...currentData.map(d => d.percentage));

  // Academic commentary based on selection
  const getCommentary = (tab: typeof activeTab) => {
    switch (tab) {
      case 'gender':
        return 'يظهر التوزيع أن الغالبية العظمى من العينة هم ذكور (73.7٪)، وهي طبيعة متوافقة مع خصائص القطاع التقني والتشغيلي لشركة اتصالات الجزائر، لاسيما في التدخلات الخارجية وهندسة الشبكات الميدانية بمدينة الجلفة.';
      case 'age':
        return 'تحتل الفئة العمرية (36-45 سنة) الصدارة بنسبة 57.9٪، تليها الفئة الشابة (25-35 سنة) بنسبة 26.3٪. مما يعكس أن قوة العمل تتمتع بنضج مهني ومزيج مثالي بين الحيوية وتراكم الخبرة والقدرة الفائقة على استخدام واستيعاب التقنيات الحديثة.';
      case 'education':
        return 'تسجل النخب الجامعية (ليسانس، ماستر، ماجستير، دكتوراه) اكتساحاً بنسبة 81.5٪ من إجمالي الموظفين، حيث يتصدر حاملو شهادة الماستر بنسبة 36.8٪. هذا المستوى العلمي المتفوق يمثل بنية خصبة لاستيعاب استراتيجيات الأتمتة وأمن المعلومات والأكواد البرمجية.';
      case 'experience':
        return 'يمتلك أكثر من 73.6٪ من العينة خبرة تتجاوز 10 سنوات داخل المؤسسة. هذا الاستقرار الوظيفي يعزز الذاكرة التنظيمية، ويضمن تراكماً مهارياً يتيح للموظفين المقارنة الواعية بين الأداء التقليدي والأداء في ظل رقمنة المعاملات.';
      case 'jobLevel':
        return 'يشكل الموظفون التنفيذيون نسبة 52.6٪، بينما يمثل المشرفون ورؤساء الأقسام 44.7٪. يضمن هذا التقارب العددي كفاءة انتقال التوجيهات الرقمية وجودة التقييم لعمليات الربط والأنظمة والشكاوى بالمديرية العملية.';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
      <div className="flex flex-wrap gap-3 mb-8 border-b-2 border-gray-100 pb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 border-2 ${
                isActive
                  ? 'bg-gradient-to-r text-white shadow-lg border-transparent ' + tab.color
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Charts Display */}
        <div className="lg:col-span-7 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentData.map((item, idx) => {
                const percentageOfMax = (item.percentage / maxVal) * 100;
                return (
                  <div key={idx} className="space-y-2 group">
                    <div className="flex justify-between text-xl">
                      <span className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-gray-600 font-mono text-xl">
                        {item.count} موظف ({item.percentage}%)
                      </span>
                    </div>
                    {/* Beautiful bar meter */}
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 p-[2px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${tabs.find(t => t.id === activeTab)?.color}`}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Academic Interpretive Column */}
        <div className="lg:col-span-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl opacity-50" />
          <h4 className="text-lg font-semibold uppercase tracking-wider text-emerald-700 font-mono mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            التفسير الأكاديمي والتحليل السوسيومهني
          </h4>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-gray-700 text-xl leading-relaxed text-justify"
            >
              {getCommentary(activeTab)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
