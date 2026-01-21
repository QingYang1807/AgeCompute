
import React, { useState, useEffect, useCallback } from 'react';
import { calculateAge } from './utils.ts';
import { AgeDetails, InsightResponse } from './types.ts';
import { getCulturalInsight } from './services/geminiService.ts';

// 可复用卡片组件
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
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Fetch cultural insights using Gemini
  const fetchInsight = useCallback(async (details: AgeDetails) => {
    setLoadingInsight(true);
    try {
      const data = await getCulturalInsight(
        birthDate,
        details.zhousui,
        details.xusui,
        details.zodiac
      );
      setInsight(data);
    } catch (error) {
      console.error("Failed to fetch cultural insight:", error);
    } finally {
      setLoadingInsight(false);
    }
  }, [birthDate]);

  const handleCalculate = useCallback(() => {
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) return;

    const details = calculateAge(date);
    setAgeDetails(details);
    fetchInsight(details);
  }, [birthDate, fetchInsight]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 导航栏 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">算</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight chinese-font">AgeCompute</h1>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">精确计算周岁与虚岁</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 介绍区域 */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 chinese-font">纯粹的年龄计算</h2>
          <p className="text-slate-600 leading-relaxed max-w-2xl">
            排除干扰，直观呈现周岁、虚岁、生肖及已历经的光阴。
          </p>
        </section>

        {/* 输入区域 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-100">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">选择出生日期</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleCalculate}
              className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg active:scale-95"
            >
              更新计算
            </button>
          </div>
        </div>

        {ageDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 核心岁数 */}
            <Card title="年龄对比" className="md:col-span-2 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                  <span className="text-slate-500 text-sm mb-1">实足周岁</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">{ageDetails.zhousui}</span>
                    <span className="text-slate-400 font-medium text-lg">岁</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 text-center">按公历生日计算，每过一个生日加一岁</p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center justify-center border border-red-100">
                  <span className="text-red-700 text-sm mb-1">传统虚岁</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-red-600">{ageDetails.xusui}</span>
                    <span className="text-red-400 font-medium text-lg">岁</span>
                  </div>
                  <p className="text-[10px] text-red-400 mt-2 text-center">按农历年份计算，每过一个春节加一岁</p>
                </div>
              </div>
            </Card>

            {/* 文化解读 (Gemini AI) */}
            <Card title="文化解读" className="md:col-span-2 bg-gradient-to-br from-white to-red-50/20">
              {loadingInsight ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-slate-400 text-xs">正在通过 Gemini AI 生成文化解读...</p>
                </div>
              ) : insight ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">文化纪年</h4>
                      <p className="text-slate-700 leading-relaxed text-sm">{insight.culturalSignificance}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">生肖性格</h4>
                      <p className="text-slate-700 leading-relaxed text-sm">{insight.zodiacReading}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-red-50">
                    <h4 className="text-[10px] font-bold text-red-400 uppercase mb-2">生命建议</h4>
                    <p className="text-red-800 font-medium italic chinese-font">“{insight.lifeStageAdvice}”</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-center py-4 text-sm">点击更新计算以获取 AI 深度解读</p>
              )}
            </Card>

            {/* 光阴统计 */}
            <Card title="时间维度">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">生肖</span>
                  <span className="font-bold text-slate-800 text-lg">{ageDetails.zodiac}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">出生至今</span>
                  <span className="font-bold text-slate-800">{ageDetails.daysLived.toLocaleString()} 天</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500">下个生日</span>
                  <span className="font-bold text-red-600">{ageDetails.nextBirthdayDays} 天后</span>
                </div>
              </div>
            </Card>

            {/* 历法信息 */}
            <Card title="农历映射">
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">出生农历日期</p>
                  <p className="text-sm font-medium text-slate-700">{ageDetails.lunarBirthDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-[10px] text-slate-400 uppercase mb-1">今日农历日期</p>
                  <p className="text-sm font-medium text-slate-700">{ageDetails.lunarCurrentDate}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 算法附录 */}
        <footer className="mt-12 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-500">
            <div>
              <h4 className="font-bold text-slate-700 mb-2">虚岁算法原理</h4>
              <p className="leading-relaxed">
                虚岁计算基于农历年份。出生即为1岁，随后每经过一个春节（大年初一）即增加1岁。本计算器严格遵循此逻辑，通过当前农历年与出生农历年的差值加1得出。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2">周岁算法原理</h4>
              <p className="leading-relaxed">
                周岁采用国际标准。出生为0岁，每经过一次公历生日增加1岁。如果在当前年份尚未到达生日，则岁数为年份差减1。
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
