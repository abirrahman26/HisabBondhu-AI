import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, loginDemo } = useAuth();

  // Interactive Live AI Sandbox state on the homepage
  const [activeQuery, setActiveQuery] = useState('কার কাছে সবচেয়ে বেশি বাকি আছে?');
  const [simulatedResponse, setSimulatedResponse] = useState({
    text: 'বর্তমানে আপনার দোকানে মোট ১ জন গ্রাহকের কাছে বকেয়া আছে। শীর্ষে আছেন রহিম (০১৭০০০০০০০১) যার বাকি ৳১,৫০০।',
    items: [
      { name: 'Rahim (রহিম)', phoneLast4: '0001', balance: 1500 },
      { name: 'Karim (করিম)', phoneLast4: '0002', balance: 400 },
    ],
    total: 1900,
  });

  const queryDemos = {
    'কার কাছে সবচেয়ে বেশি বাকি আছে?': {
      text: 'বর্তমানে আপনার দোকানে মোট ২ জন গ্রাহকের কাছে বকেয়া আছে। শীর্ষে আছেন রহিম যার বাকি ৳১,৫০০।',
      items: [
        { name: 'Rahim (রহিম)', phoneLast4: '0001', balance: 1500 },
        { name: 'Karim (করিম)', phoneLast4: '0002', balance: 400 },
      ],
      total: 1900,
    },
    'আজকে কত বিক্রি হলো?': {
      text: 'আজকের সর্বমোট বিক্রি ৳২,৯০০ (নগদ ও বাকি মিলিয়ে)। আনুমানিক মুনাফা ৳৪৫০।',
      items: [
        { name: 'Miniket Rice (মিনিকেট চাল)', amount: 1400 },
        { name: 'Soybean Oil (সয়াবিন তেল)', amount: 900 },
        { name: 'Sugar (চিনি)', amount: 600 },
      ],
      total: 2900,
    },
    'কোন কোন পণ্যের স্টক কম?': {
      text: 'বর্তমানে ২টি পণ্যের স্টক সতর্কতা মাত্রার নিচে নেমে এসেছে। দ্রুত মজুত বাড়ানোর পরামর্শ দেওয়া হচ্ছে।',
      items: [
        { name: 'Iodized Salt (লবণ)', stockQty: 4, unit: 'packet' },
        { name: 'Red Lentil (মসুর ডাল)', stockQty: 8, unit: 'kg' },
      ],
      total: undefined,
    },
    'রহিম কে ৫০০ টাকা বাকি দিলাম': {
      text: 'রহিম-এর খতিয়ানে ৫০০ টাকা বাকি যোগ করার প্রস্তুতি নেওয়া হয়েছে। নিচের প্রস্তাবটি নিশ্চিত করুন:',
      proposal: {
        type: 'বাকি দেওয়া (Baki Given)',
        customer: 'Rahim (০১৭০০০০০০০১)',
        amount: '৳৫০০',
        safety: 'প্রোপোজ-কনফার্ম সুরক্ষা সক্রিয়',
      },
      items: undefined,
      total: undefined,
    },
  };

  const handleSelectQuery = (q) => {
    setActiveQuery(q);
    setSimulatedResponse(queryDemos[q] || queryDemos['কার কাছে সবচেয়ে বেশি বাকি আছে?']);
  };

  const handleInstantDemo = async () => {
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch {
      navigate('/login');
    }
  };

  const featuresList = [
    {
      icon: '🎙️',
      title: 'বাংলা ভয়েস ও চ্যাট AI',
      subtitle: 'মুখের কথায় স্বয়ংক্রিয় হিসাব',
      desc: 'মুখে বাংলায় বলুন বা বাংলিশে টাইপ করুন (যেমন: "Rahim ke 500 taka baki dilam")—হিসাববন্ধু তাৎক্ষণিক বুঝে খতিয়ান ও বিক্রির ভাউচার তৈরি করবে।',
      tag: 'Gemini 2.5 Flash',
      color: 'from-sky-500/20 to-blue-600/20 border-sky-500/30 text-sky-300',
    },
    {
      icon: '📖',
      title: 'ডিজিটাল বাকি খাতা',
      subtitle: 'গ্রাহক অনুযায়ী নির্ভুল খতিয়ান',
      desc: 'কার কাছে কত বকেয়া আছে, শেষ কবে জমা দিয়েছেন—সব এক ক্লিকে। ভুল বা অতিরিক্ত টাকা এড়াতে বিল্ট-ইন সেফগার্ড ও অ্যাডভান্স ব্যালেন্স অ্যালার্ট।',
      tag: 'Baki Khata',
      color: 'from-indigo-500/20 to-purple-600/20 border-indigo-500/30 text-indigo-300',
    },
    {
      icon: '⚡',
      title: 'সুপারফাস্ট POS সেলস',
      subtitle: 'ক্যাশ, বিকাশ ও বাকি পেমেন্ট',
      desc: 'মুহূর্তের মধ্যে যেকোনো পণ্য বিক্রি করুন। নগদ, বিকাশ, নগদ বা বাকি নির্বাচন করুন। ইনভেন্টরি থেকে স্বয়ংক্রিয়ভাবে স্টক হ্রাস পাবে।',
      tag: 'Point of Sale',
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30 text-emerald-300',
    },
    {
      icon: '📦',
      title: 'স্মার্ট ইনভেন্টরি অ্যালার্ট',
      subtitle: 'মজুদ ফুরানোর আগেই সতর্কতা',
      desc: 'চাল, ডাল, তেল, চিনি—কোন পণ্য কতটুকু আছে সবসময় চোখের সামনে। পণ্য শেষ হয়ে আসার আগেই স্বয়ংক্রিয় লো-স্টক সতর্কবার্তা।',
      tag: 'Real-time Stock',
      color: 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-300',
    },
    {
      icon: '🛡️',
      title: 'জিরো-ম্যাথ হ্যালুসিনেশন',
      subtitle: '১০০% নিশ্চিত গাণিতিক নির্ভুলতা',
      desc: 'কৃত্রিম বুদ্ধিমত্তা কখনো আন্দাজে কোনো যোগ-বিয়োগ করে না। সমস্ত হিসাব অ্যাপ্লিকেশন কোডের মাধ্যমে লেজার থেকে সরাসরি ক্যালকুলেট করা হয়।',
      tag: 'Deterministic Math',
      color: 'from-cyan-500/20 to-sky-600/20 border-cyan-500/30 text-cyan-300',
    },
    {
      icon: '📊',
      title: 'লাভ-ক্ষতি ও দৈনিক রিপোর্ট',
      subtitle: 'দিনের শেষে স্পষ্ট ব্যবসার চিত্র',
      desc: 'আজকে মোট কত বিক্রি হলো, কত খরচ হলো আর কত নিট লাভ হলো—কোনো খাতা কলম ছাড়াই তাৎক্ষণিক গ্রাফ ও সামারি দেখুন।',
      tag: 'Net Profit Tracking',
      color: 'from-emerald-500/20 to-green-600/20 border-emerald-500/30 text-emerald-300',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xl group-hover:border-sky-400/50 transition">
              ✨
            </span>
            <div>
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                হিসাববন্ধু AI
              </span>
              <span className="ml-2 text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full font-bold">
                PRO FINTECH
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-sky-300 transition">বৈশিষ্ট্যসমূহ</a>
            <a href="#voice-ai" className="hover:text-sky-300 transition">ভয়েস AI</a>
            <a href="#themes" className="hover:text-sky-300 transition">ডিজাইন ও থিম</a>
            <a href="#security" className="hover:text-sky-300 transition">নিরাপত্তা</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="glow-btn-primary px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center gap-2"
              >
                <span>📊 ড্যাশবোর্ড খুলুন</span>
                <span>→</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="px-3.5 sm:px-4 py-2 rounded-xl border border-white/15 text-slate-200 hover:bg-white/10 font-bold text-xs sm:text-sm transition"
                >
                  লগইন
                </button>
                <button
                  type="button"
                  onClick={handleInstantDemo}
                  className="glow-btn-primary px-4 sm:px-5 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition flex items-center gap-1.5"
                >
                  <span>⚡ ইনস্ট্যান্ট ডেমো</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4">
        {/* Ambient Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-7 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-sky-400/30 text-xs sm:text-sm text-sky-300 shadow-xl animate-float">
            <span className="p-1 rounded-full bg-sky-400 text-slate-950 text-[10px] font-black">AI</span>
            <span>বাংলাদেশের প্রথম বাংলা ভয়েস ও ইন্টেলিজেন্ট ডিজিটাল খাতা</span>
            <span className="text-sky-400">✨</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2] max-w-4xl mx-auto">
            দোকানের হিসাব হবে এবার মুখে মুখে —{' '}
            <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              নির্ভুল, সহজ ও নিরাপদ
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            মুদি ও খুচরা ব্যবসায়ীদের জন্য সম্পূর্ণ বাংলা ভাষায় তৈরি ডিজিটাল সহকারী। বাকির খাতা, পণ্য বিক্রি, স্টক ও নিট লাভের পূর্ণাঙ্গ হিসাব রাখুন বাংলায় কথা বলে বা লিখে।
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full sm:w-auto glow-btn-primary px-8 py-4 rounded-2xl font-black text-base shadow-2xl flex items-center justify-center gap-2.5 transition transform hover:scale-105 active:scale-95"
            >
              <span>⚡ এক ক্লিকে ডেমো প্রবেশ করুন</span>
              <span>→</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('voice-ai');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto glass-card px-7 py-4 rounded-2xl font-bold text-base text-slate-200 border-white/15 hover:border-sky-400/50 hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <span>🎙️ লাইভ ভয়েস AI ট্রায়াল</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto text-xs">
            <div className="glass-card p-3 rounded-xl border-white/10 text-slate-300">
              <span className="block text-lg mb-1">🔒</span>
              <span className="font-bold text-white block">১০০% গাণিতিক নির্ভুলতা</span>
              <span className="text-[11px] text-slate-400">জিরো হ্যালুসিনেশন</span>
            </div>
            <div className="glass-card p-3 rounded-xl border-white/10 text-slate-300">
              <span className="block text-lg mb-1">🇧🇩</span>
              <span className="font-bold text-white block">বাংলা ভয়েস কমান্ড</span>
              <span className="text-[11px] text-slate-400">কথ্য ভাষা ও বাংলিশ</span>
            </div>
            <div className="glass-card p-3 rounded-xl border-white/10 text-slate-300">
              <span className="block text-lg mb-1">⚡</span>
              <span className="font-bold text-white block">রিয়েল-টাইম স্টক</span>
              <span className="text-[11px] text-slate-400">স্বয়ংক্রিয় মজুত হ্রাস</span>
            </div>
            <div className="glass-card p-3 rounded-xl border-white/10 text-slate-300">
              <span className="block text-lg mb-1">⚖️</span>
              <span className="font-bold text-white block">জাজ মূল্যায়ন মোড</span>
              <span className="text-[11px] text-slate-400">১-ক্লিকে কাল্পনিক ডেটা</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Voice AI Sandbox Widget */}
      <section id="voice-ai" className="py-16 px-4 relative bg-slate-950/60 border-y border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              LIVE INTERACTIVE PREVIEW
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              হোমপেজেই সরাসরি পরখ করুন বাংলা ভয়েস AI
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              নিচের যে কোনো প্রশ্নে ক্লিক করুন এবং দেখুন হিসাববন্ধু AI কীভাবে তাৎক্ষণিক যাচাইকৃত ডেটাসহ উত্তর দেয়
            </p>
          </div>

          {/* Sample Prompt Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
            {Object.keys(queryDemos).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuery(q)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  activeQuery === q
                    ? 'glow-btn-primary text-white shadow-lg ring-1 ring-sky-300'
                    : 'glass-card text-slate-300 hover:text-white border-white/10'
                }`}
              >
                <span>💬</span>
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Interactive Chat Box Simulator */}
          <div className="glass-panel p-5 sm:p-7 rounded-3xl border border-sky-500/30 shadow-2xl space-y-5 max-w-2xl mx-auto">
            {/* User message */}
            <div className="flex flex-col items-end">
              <span className="text-[11px] text-slate-400 mb-1">দোকানদার (You)</span>
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-sm font-semibold shadow-md border border-sky-400/30">
                {activeQuery}
              </div>
            </div>

            {/* AI Assistant response */}
            <div className="flex flex-col items-start space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 font-black px-2 py-0.5 rounded-md text-[10px]">
                  AI
                </span>
                <span className="text-xs text-slate-400 font-bold">হিসাববন্ধু AI Assistant</span>
              </div>
              <div className="glass-card text-slate-100 rounded-2xl rounded-tl-xs px-4 py-3 text-sm leading-relaxed border-white/10 w-full shadow-lg">
                <p>{simulatedResponse.text}</p>

                {/* If verified data table */}
                {simulatedResponse.items && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-sky-500/20 space-y-2 text-xs">
                    <div className="flex justify-between text-sky-300 font-bold border-b border-white/10 pb-1.5 text-[11px] uppercase">
                      <span>তালিকাভুক্ত তথ্য (Verified Data)</span>
                      <span>পরিমাণ / ব্যালেন্স</span>
                    </div>
                    {simulatedResponse.items.map((it, i) => (
                      <div key={i} className="flex justify-between py-1 text-slate-300">
                        <span>{it.name}</span>
                        <span className="font-bold text-white tabular-nums">
                          {it.balance !== undefined
                            ? `৳${it.balance.toLocaleString()}`
                            : it.amount !== undefined
                            ? `৳${it.amount.toLocaleString()}`
                            : `${it.stockQty} ${it.unit}`}
                        </span>
                      </div>
                    ))}
                    {simulatedResponse.total && (
                      <div className="border-t border-white/10 pt-1.5 flex justify-between font-black text-emerald-400">
                        <span>মোট:</span>
                        <span>৳{simulatedResponse.total.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* If proposal */}
                {simulatedResponse.proposal && (
                  <div className="mt-3 p-3.5 rounded-xl bg-sky-950/40 border-2 border-sky-400/40 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-sky-300">
                      <span>পদক্ষেপ: {simulatedResponse.proposal.type}</span>
                      <span className="text-amber-300">নিশ্চিতকরণ আবশ্যক</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>গ্রাহক: {simulatedResponse.proposal.customer}</span>
                      <span className="font-black text-sky-400 text-sm">{simulatedResponse.proposal.amount}</span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => alert('ডেমো প্রস্তাব বাতিল করা হয়েছে।')}
                        className="flex-1 py-1.5 border border-white/15 text-slate-300 rounded-lg hover:bg-white/10 font-bold text-xs"
                      >
                        বাতিল
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('সফলভাবে বাকি সংরক্ষণ করা হয়েছে!')}
                        className="flex-1 py-1.5 glow-btn-primary font-bold text-xs rounded-lg text-white"
                      >
                        কনফার্ম করুন ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/assistant')}
                className="text-xs text-sky-400 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>সম্পূর্ণ AI অ্যাসিস্ট্যান্ট পেজে যান</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section id="features" className="py-20 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            FEATURES & CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            দোকান পরিচালনার জন্য প্রয়োজনীয় সব ফিচার
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            চিরাচরিত খাতার ঝামেলা দূর করে আধুনিক প্রযুক্তির সাহায্যে দোকান পরিচালনাকে করুন আরও দ্রুত ও নির্ভুল
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuresList.map((f, i) => (
            <div
              key={i}
              className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 hover:border-sky-500/40 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-3xl p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition transform">
                    {f.icon}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${f.color}`}>
                    {f.tag}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition">
                    {f.title}
                  </h3>
                  <p className="text-xs text-sky-400 font-semibold mt-0.5">{f.subtitle}</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{f.desc}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>১০০% ক্লাউড সিঙ্ক</span>
                <span className="text-sky-400 group-hover:translate-x-1 transition">সুবিধা দেখুন →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Themes & Aesthetics Section */}
      <section id="themes" className="py-16 px-4 bg-slate-950/70 border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-widest px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              MODERN FINTECH DESIGN
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              আন্তর্জাতিক মানের ডার্ক গ্লাস থিম ও নান্দনিক ফন্ট
            </h2>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              hisabibondhu.com দ্বারা অনুপ্রাণিত ডার্ক নেভি ব্যাকড্রপ, গ্লাস কার্ড ও খাঁটি বাংলা ফন্ট হিন্দ সিলিগুড়ি
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-2xl border-white/10 space-y-2">
              <span className="text-2xl">🎨</span>
              <h4 className="font-bold text-white text-base">ডার্ক গ্লাস ফিনটেক থিম</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                চোখের জন্য আরামদায়ক গভীর নেভি ব্যাকগ্রাউন্ড (#061126), সাবলীল অ্যাম্বিয়েন্ট গ্রেডিয়েন্ট ও ১৬ পিক্সেল ব্যাকড্রপ ব্লার।
              </p>
            </div>
            <div className="glass-card p-5 rounded-2xl border-white/10 space-y-2">
              <span className="text-2xl">✍️</span>
              <h4 className="font-bold text-white text-base">হিন্দ সিলিগুড়ি টাইপোগ্রাফি</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                বাংলা লেখার স্পষ্টতা ও সৌন্দর্য নিশ্চিত করতে হিন্দ সিলিগুড়ি ফন্ট (৩০০-৮০০ ওয়েট) এবং Exo 2 এর ডিজিটাল কম্বিনেশন।
              </p>
            </div>
            <div className="glass-card p-5 rounded-2xl border-white/10 space-y-2">
              <span className="text-2xl">✨</span>
              <h4 className="font-bold text-white text-base">স্মুথ অ্যানিমেশন ও গ্লো ইফেক্ট</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                কার্ড হোভার ও স্পর্শে সূক্ষ্ম লিফট, বাটন গ্লো হ্যালো এবং ফ্লুয়িড রেসপন্সিভ মোবাইল ইন্টারফেস।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Invariants */}
      <section id="security" className="py-16 px-4 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20">
            SECURITY & RELIABILITY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            নিরাপত্তা ও ব্যবসায়িক গোপনীয়তার নিশ্চয়তা
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            আপনার দোকানের হিসাব শুধুমাত্র আপনারই নিয়ন্ত্রণাধীন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl border-white/10 space-y-3">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>এলোউ-লিস্টেড টুলিং আর্কিটেকচার</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              AI মডেল সরাসরি ডাটাবেজে হাত দিতে পারে না। কেবল নির্ধারিত ও যাচাইকৃত টুলের মাধ্যমেই ডেটা প্রদর্শিত ও প্রপোজ হয়।
            </p>
          </div>
          <div className="glass-card p-5 rounded-2xl border-white/10 space-y-3">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              <span>প্রোপোজ-কনফার্ম সেফটি গার্ড</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              বাকির হিসাব বা পেমেন্ট এন্ট্রির মতো গুরুত্বপূর্ণ আর্থিক পদক্ষেপে দোকানদারের সরাসরি সবুজ বাটন কনফার্মেশন ছাড়া কোনো তথ্য সেভ হয় না।
            </p>
          </div>
        </div>
      </section>

      {/* Final Call to Action Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl border border-sky-400/40 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -left-20 -top-20 w-60 h-60 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              আজই আপনার দোকানের হিসাব ডিজিটাল করুন
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              কোনো জটিল প্রশিক্ষণ ছাড়াই এখনই ১-ক্লিকে ইনস্ট্যান্ট ডেমো চালিয়ে পরীক্ষা করে দেখুন
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 relative z-10">
            <button
              type="button"
              onClick={handleInstantDemo}
              className="glow-btn-primary px-8 py-3.5 rounded-xl font-black text-base shadow-xl"
            >
              ⚡ ডেমো ড্যাশবোর্ডে প্রবেশ করুন
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="glass-card px-6 py-3.5 rounded-xl font-bold text-slate-200 hover:bg-white/10 transition border-white/15"
            >
              নতুন অ্যাকাউন্ট / সাইন ইন
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-slate-950/90 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="text-sky-400">✨</span>
            <span>হিসাববন্ধু AI — ডিজিটাল খাতা ও স্মার্ট অ্যাসিস্ট্যান্ট</span>
          </div>
          <div className="flex gap-4">
            <a href="#features" className="hover:text-slate-200 transition">ফিচারসমূহ</a>
            <a href="#voice-ai" className="hover:text-slate-200 transition">ভয়েস AI</a>
            <a href="#themes" className="hover:text-slate-200 transition">থিম</a>
            <Link to="/settings" className="hover:text-slate-200 transition">সেটিংস</Link>
          </div>
          <p>© 2026 HisabBondhu AI. Proudly built for Bangladeshi retail shopkeepers.</p>
        </div>
      </footer>
    </div>
  );
}
