import React, { useState, useRef, useEffect } from 'react';
import ConfirmationCard from '../shared/ui/ConfirmationCard';
import VerifiedDataCard from '../shared/ui/VerifiedDataCard';
import { getDhakaDateKey } from '../shared/lib/dates';

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি আপনার হিসাববন্ধু। আপনার দোকানের বিক্রি, বাকি বা স্টক সম্পর্কে বাংলায় প্রশ্ন করুন অথবা নির্দেশ দিন।',
      timestamp: '10:00 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const exampleChips = [
    'Kar kache sob theke beshi baki ache?',
    'Aj koto bikri holo?',
    'Ki ki jinis shesh hoye ashche?',
    'Rahim ke 500 taka baki dilam',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = (e) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Phase 2 UI interaction simulation (will wire to Gemini tool dispatcher in Phase 5)
    setTimeout(() => {
      setIsThinking(false);

      if (query.toLowerCase().includes('baki ache') || query.includes('সব থেকে বেশি বাকি')) {
        // GP-6 Read Simulation
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: 'আপনার মোট বকেয়া বাকি ২,২৪০ টাকা। সবচেয়ে বেশি বাকি করিম মিয়ার কাছে ১,২০০ টাকা, এরপর নাসিমা বেগম ৮৫০ টাকা এবং রহিম ১৯০ টাকা।',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            verifiedData: {
              title: 'Top Debtors (শীর্ষ বাকিদার)',
              items: [
                { name: 'Karim Mia', balance: 1200 },
                { name: 'Nasima Begum', balance: 850 },
                { name: 'Rahim', balance: 190 },
              ],
              total: 2240,
            },
          },
        ]);
      } else if (query.toLowerCase().includes('baki dilam') || query.includes('বাকি দিলাম')) {
        // GP-7 Propose Simulation
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: 'রহিমকে ৫০০ টাকা বাকি দেওয়ার জন্য তথ্য প্রস্তুত করা হয়েছে। আপনি কি এই এন্ট্রিটি নিশ্চিত করতে চান?',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            proposal: {
              id: `prop_${Date.now()}`,
              type: 'baki',
              customerName: 'Rahim',
              amount: 500,
              dateKey: getDhakaDateKey(),
              originalText: query,
            },
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'ai',
            text: 'আমি আপনার অনুরোধটি বুঝতে পেরেছি। সম্পূর্ণ জেমিনি মডেল সংযোগ ফেজ ৫ এ সক্রিয় হবে।',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    }, 600);
  };

  const handleConfirmProposal = async (proposal) => {
    // Propose-Confirm pattern
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        text: `সফলভাবে সংরক্ষিত হয়েছে! রহিমের নতুন বাকি ব্যালেন্স ৬৯০ টাকা।`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCancelProposal = (proposal) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        text: 'বাতিল করা হয়েছে। কোনো তথ্য সংরক্ষণ করা হয়নি।',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span>হিসাববন্ধু AI Assistant</span>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              Gemini Powered
            </span>
          </h1>
          <p className="text-xs text-slate-500">Bangla business conversation and propose-confirm actions</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1" role="log" aria-live="polite">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                {!isUser && (
                  <span className="bg-indigo-700 text-white font-extrabold px-1.5 py-0.2 rounded-xs text-[9px]">
                    AI
                  </span>
                )}
                <span>{isUser ? 'You' : 'HisabBondhu'}</span>
                <span>• {m.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-teal-700 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                }`}
                lang={!isUser ? 'bn' : undefined}
              >
                {m.text}
              </div>

              {/* Verified Data Card if available */}
              {m.verifiedData && (
                <div className="max-w-[85%] w-full">
                  <VerifiedDataCard
                    title={m.verifiedData.title}
                    data={m.verifiedData.items}
                    total={m.verifiedData.total}
                  />
                </div>
              )}

              {/* Propose-Confirm Card if available */}
              {m.proposal && (
                <div className="max-w-[85%] w-full">
                  <ConfirmationCard
                    proposal={m.proposal}
                    onConfirm={handleConfirmProposal}
                    onCancel={handleCancelProposal}
                  />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
            <span className="animate-spin">⚙️</span>
            <span>হিসাববন্ধু ভাবছে… (Thinking)</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Example Chips */}
      <div className="py-2 flex gap-1.5 overflow-x-auto no-scrollbar">
        {exampleChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInput(chip)}
            className="shrink-0 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-3 py-1.5 rounded-full border border-slate-200 transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="relative flex items-center gap-2 pt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="বাংলায় বলুন বা লিখুন (e.g. Rahim ke 500 taka baki dilam)…"
          className="flex-1 px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-700 pr-12 shadow-xs"
        />

        {/* Mic Button (P2 Placeholder) */}
        <button
          type="button"
          disabled
          title="Voice input will be available in Phase 6 / Chrome Android"
          className="p-3 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed text-base"
          aria-label="Voice input (P2)"
        >
          🎤
        </button>

        <button
          type="submit"
          disabled={!input.trim()}
          className="px-4 py-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition"
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
