
import React, { useState, useEffect, useCallback } from 'react';
import { calculateAge, formatFullDate } from './utils';
import { AgeDetails, InsightResponse } from './types';
import { getCulturalInsight } from './services/geminiService';

// Reusable Components
const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-6 ${className}`}>
    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-l-4 border-red-500 pl-3">{title}</h3>
    {children}
  </div>
);

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('1995-01-01');
  const [ageDetails, setAgeDetails] = useState<AgeDetails | null>(null);
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = useCallback(async () => {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return;

    const details = calculateAge(date);
    setAgeDetails(details);
    
    setLoading(true);
    const culturalData = await getCulturalInsight(
      birthDate, 
      details.zhousui, 
      details.xusui, 
      details.zodiac
    );
    setInsight(culturalData);
    setLoading(false);
  }, [birthDate]);

  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">算</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight chinese-font">AgeCompute</h1>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">华夏古今年龄算法集成</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Intro Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 chinese-font">跨越时空的年岁</h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            周岁源于西方，严谨科学；虚岁承自华夏，感怀生命。在这里，我们为您精确拆解这两种截然不同的时间尺度。
          </p>
        </section>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">选择您的出生日期</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleCalculate}
              disabled={loading}
              className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? '洞察中...' : '开始计算'}
            </button>
          </div>
        </div>

        {ageDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Ages */}
            <Card title="核心岁数" className="md:col-span-2 overflow-hidden">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                  <span className="text-slate-500 text-sm mb-1">现代周岁</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">{ageDetails.zhousui}</span>
                    <span className="text-slate-400 font-medium text-lg">岁</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">足岁计龄，过完生日加一岁</p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-red-100">
                  <span className="text-red-700 text-sm mb-1">传统虚岁</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-red-600">{ageDetails.xusui}</span>
                    <span className="text-red-400 font-medium text-lg">岁</span>
                  </div>
                  <p className="text-[10px] text-red-400 mt-2 text-center">毛岁计龄，过完春节加一岁</p>
                </div>
              </div>
            </Card>

            {/* Time Stats */}
            <Card title="光阴记事">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">属相</span>
                  <span className="font-bold text-slate-800 text-lg">生肖 · {ageDetails.zodiac}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">已历经</span>
                  <span className="font-bold text-slate-800">{ageDetails.daysLived.toLocaleString()} 天</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">距离下次生日</span>
                  <span className="font-bold text-red-600">{ageDetails.nextBirthdayDays} 天</span>
                </div>
              </div>
            </Card>

            {/* Lunar Info */}
            <Card title="历法映射">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">出生农历</p>
                  <p className="text-sm font-medium text-slate-700">{ageDetails.lunarBirthDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">今日农历</p>
                  <p className="text-sm font-medium text-slate-700">{ageDetails.lunarCurrentDate}</p>
                </div>
              </div>
            </Card>

            {/* Gemini Insight */}
            {insight && (
              <Card title="大师点评 (Gemini)" className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-red-400 text-xs font-bold uppercase mb-2">文化命格</h4>
                    <p className="text-slate-200 leading-relaxed italic">{insight.culturalSignificance}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-red-400 text-xs font-bold uppercase mb-2">属相解读</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{insight.zodiacReading}</p>
                    </div>
                    <div>
                      <h4 className="text-red-400 text-xs font-bold uppercase mb-2">人生箴言</h4>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-red-200 font-medium chinese-font">“{insight.lifeStageAdvice}”</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Cultural Appendix */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-500">
            <div>
              <h4 className="font-bold text-slate-700 mb-2">关于“虚岁” (Xusui)</h4>
              <p className="leading-relaxed">
                中国传统计龄方法。生下来就算一岁，然后每过一个农历春节，就增加一岁。虚岁体现了对“孕期”这一生命起源的尊重，以及对季节轮回的重视。极端情况下，除夕出生的人在初一即为“两岁”。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2">关于“周岁” (Zhousui)</h4>
              <p className="leading-relaxed">
                国际通用计龄方法，也是我国现行法律文件使用的标准。刚生下来为零岁，每过一次公历生日增加一岁。它是基于地球公转周期的纯物理时间计量。
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
