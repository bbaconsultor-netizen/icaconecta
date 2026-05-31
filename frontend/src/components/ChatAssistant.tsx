import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Leaf } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const MAX_QUESTIONS = 6;
const STORAGE_KEY = 'icaconecta_assistant';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [sessionId] = useState(() => {
    const existing = sessionStorage.getItem('icaconecta_session');
    if (existing) return existing;
    const id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem('icaconecta_session', id);
    return id;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Restaurar estado al montar
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.messages || []);
        setQuestionsUsed(parsed.questionsUsed || 0);
      } catch {}
    }
  }, []);

  // Persistir estado
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, questionsUsed }));
  }, [messages, questionsUsed]);

  // Auto-scroll al final
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const limitReached = questionsUsed >= MAX_QUESTIONS;
  const remaining = MAX_QUESTIONS - questionsUsed;

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || limitReached) return;

    const newUserMsg: ChatMessage = { role: 'user', content: trimmed };
    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/assistant/chat`,
        {
          message: trimmed,
          history: messages,
          session_id: sessionId,
        },
        { timeout: 60000 }
      );
      const reply: ChatMessage = { role: 'assistant', content: response.data.reply };
      setMessages([...updatedHistory, reply]);
      setQuestionsUsed((n) => n + 1);
    } catch (error: any) {
      const errMsg: ChatMessage = {
        role: 'assistant',
        content: '⚠️ Hubo un problema al procesar tu pregunta. Inténtalo de nuevo en unos segundos.',
      };
      setMessages([...updatedHistory, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          data-testid="assistant-open-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-brand-primary hover:bg-brand-teal text-white p-4 rounded-full shadow-2xl shadow-brand-teal/40 transition-all hover:scale-110 group"
          title="Asistente virtual"
        >
          <div className="relative">
            <MessageCircle size={26} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse"></span>
          </div>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Asistente Agro Digital
          </span>
        </button>
      )}

      {/* Panel del chat */}
      {isOpen && (
        <div
          data-testid="assistant-panel"
          className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-brand-primary text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center backdrop-blur">
                <Leaf size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  Asesor Agro Digital
                  <Sparkles size={12} className="text-amber-300" />
                </h3>
                <p className="text-[10px] text-white/70 font-medium uppercase tracking-wider">
                  {remaining} pregunta{remaining !== 1 ? 's' : ''} restante{remaining !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              data-testid="assistant-close-btn"
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"
          >
            {messages.length === 0 && (
              <div className="text-center py-8 px-3">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-brand-teal/10 text-brand-primary items-center justify-center mb-3">
                  <Leaf size={28} />
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  ¡Hola! Soy tu asesor digital agro.
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Te ayudo a digitalizar tu negocio agrícola o ganadero. Pregúntame sobre tecnología, herramientas, ERPs, IoT, e-commerce y más.
                </p>
                <div className="space-y-2 text-left">
                  {[
                    '¿Qué ERP me recomiendas para mi chacra?',
                    '¿Cómo vendo mis frutas online?',
                    '¿Cómo automatizo el riego?',
                  ].map((q) => (
                    <button
                      key={q}
                      data-testid={`suggestion-${q.slice(0, 10)}`}
                      onClick={() => setInput(q)}
                      className="w-full text-left px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-brand-teal/5 hover:border-brand-teal transition-colors"
                    >
                      💡 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-brand-primary text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            {limitReached && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-amber-900 mb-1">
                  Has alcanzado el límite de 6 preguntas por sesión.
                </p>
                <p className="text-[11px] text-amber-700">
                  Para continuar la conversación, recarga la página.
                </p>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 p-3 bg-white">
            <div className="flex gap-2 items-end">
              <input
                data-testid="assistant-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || limitReached}
                placeholder={limitReached ? 'Límite alcanzado' : 'Escribe tu pregunta...'}
                className="flex-1 px-4 py-2.5 bg-slate-100 border border-transparent focus:bg-white focus:border-brand-teal rounded-xl text-sm outline-none disabled:opacity-50 transition-colors"
              />
              <button
                data-testid="assistant-send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading || limitReached}
                className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-teal disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
              Asistente con IA · Especialista en agricultura digital
            </p>
          </div>
        </div>
      )}
    </>
  );
}
