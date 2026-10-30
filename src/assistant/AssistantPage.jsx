import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../shared/data/DataContext';
import ConfirmationCard from '../shared/ui/ConfirmationCard';
import VerifiedDataCard from '../shared/ui/VerifiedDataCard';
import { processAssistantQuery } from './toolDispatcher';
import { formatMoney } from '../shared/lib/money';

export default function AssistantPage() {
  const { products, customers, sales, ledger, expenses, recordBaki, recordPayment } = useData();

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'ai',
      text: 'আসসালামু আলাইকুম! আমি আপনার ডিজিটাল হিসাববন্ধু। আপনার দোকানের বিক্রি, বাকি বা স্টক সম্পর্কে বাংলায় প্রশ্ন করুন অথবা নির্দেশ দিন।',
      timestamp: '10:00 AM',
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const handleToggleVoice = () => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'bn-BD';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };


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

  const handleSend = async (e) => {
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

    try {
      const response = await processAssistantQuery(query, {
        products,
        customers,
        sales,
        ledger,
        expenses,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: response.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          verifiedData: response.verifiedData,
          proposal: response.proposal,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: 'দুঃখিত, অনুরোধটি প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleConfirmProposal = async (proposal) => {
    try {
      if (proposal.type === 'baki') {
        await recordBaki({
          customerId: proposal.customerId,
          amount: proposal.amount,
          note: proposal.originalText,
          proposalId: proposal.id,
          createdBy: 'ai',
        });
      } else if (proposal.type === 'payment') {
        await recordPayment({
          customerId: proposal.customerId,
          amount: proposal.amount,
          note: proposal.originalText,
          proposalId: proposal.id,
          createdBy: 'ai',
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `sys_${Date.now()}`,
          sender: 'ai',
          text: `সফলভাবে সংরক্ষিত হয়েছে! ${proposal.customerName}-এর হিসাবে ${formatMoney(proposal.amount)} যোগ করা হয়েছে।`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      alert('Failed to save confirmed action: ' + err.message);
    }
  };

  const handleCancelProposal = (proposal) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `sys_${Date.now()}`,
        sender: 'ai',
        text: 'বাতিল করা হয়েছে। কোনো তথ্য সংরক্ষণ করা হয়নি। (Cancelled — Nothing saved)',
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
          <p className="text-xs text-slate-500">
            Bangla business conversation, allowlisted tools & propose-confirm safety
          </p>
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
            <span>হিসাববন্ধু তথ্য যাচাই করছে… (Thinking)</span>
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

        {/* Voice Input Mic Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          title={isListening ? 'Listening (কথা বলুন)…' : 'Voice input (Bangla speech)'}
          className={`p-3 rounded-xl text-base transition flex items-center justify-center min-w-[48px] min-h-[48px] ${
            isListening
              ? 'bg-red-600 text-white animate-pulse shadow-md ring-2 ring-red-400'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input in Bangla'}
        >
          {isListening ? '🔴' : '🎤'}
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
