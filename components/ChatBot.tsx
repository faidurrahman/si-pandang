import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askPandangAI } from '../services/geminiService';
import { SERVICES } from '../constants';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      text: 'SELAMAT DATANG BAPAK/IBU.\n\nSaya Asisten SI-PANDANG, siap membantu Anda terkait informasi layanan administrasi kepegawaian di Kecamatan Ujung Pandang.\n\nAda yang bisa saya bantu?', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const context = SERVICES.map(s => 
      `${s.title}: ${s.description}. Syarat: ${s.requirements.map(r => r.label).join(', ')}`
    ).join('\n');

    const response = await askPandangAI(input, context);
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      text: response, 
      timestamp: new Date() 
    }]);
    setIsLoading(false);
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-6 right-6 z-[1000] bg-white rounded-[2rem] shadow-2xl w-[92vw] sm:w-[420px] flex flex-col border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[85vh]">
          <div className="bg-[#0a1e3b] p-5 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center font-black text-[#0a1e3b] text-xs shadow-lg">SP</div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-tight">Asisten SI-PANDANG</h3>
                <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">Layanan Kepegawaian</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f8fafc]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[92%] p-5 rounded-2xl text-[13px] leading-[1.6] shadow-sm whitespace-pre-wrap break-words ${
                  msg.role === 'user' 
                  ? 'bg-amber-500 text-[#0a1e3b] rounded-tr-none font-bold' 
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 font-medium'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex space-x-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 flex space-x-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tulis pertanyaan Anda..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-[13px] focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none font-medium transition-all shadow-inner"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[#0a1e3b] text-white p-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 group shrink-0"
            >
              <svg className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="btn-asisten-ai"
        >
          <div className="relative">
             <svg className="w-6 h-6 text-[#0a1e3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
             </svg>
             <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
          </div>
          <span className="uppercase tracking-[0.1em] text-[11px] font-black">Asisten SI-PANDANG</span>
        </button>
      )}
    </>
  );
};