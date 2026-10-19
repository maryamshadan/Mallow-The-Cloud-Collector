import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles, Heart, Bot, Minimize2, Maximize2 } from 'lucide-react';
import { ChatMessage, MallowMood } from '../types';
import { soundFx } from '../utils/soundFx';
import { useVisitor } from '../context/VisitorContext';

const QUICK_PROMPTS = [
  'Tell me a tiny cloud bedtime story',
  'What is your favorite dream?',
  'Can you tell me a cloud joke?',
  'I am feeling a little sleepy...',
  'How do you make cloud pillows so soft?',
];

interface MallowChatProps {
  onMoodChange?: (mood: MallowMood) => void;
}

export const MallowChat: React.FC<MallowChatProps> = ({ onMoodChange }) => {
  const { visitor } = useVisitor();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [engineSource, setEngineSource] = useState<'gemini' | 'rule-based' | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'init-1',
      sender: 'mallow',
      text: visitor.nickname
        ? `Hello, ${visitor.nickname}! *gentle bounce* What's on your mind today? Want to whisper a dream or hear a tiny story?`
        : `Hello, little dreamer! *gentle bounce* I'm Mallow. What's on your mind? Would you like to whisper a dream or hear a story?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: 'happy',
    },
  ]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    soundFx.playPuff();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          visitorName: visitor.nickname,
          context: {
            visitCount: visitor.visitCount,
            lastExperience: visitor.lastExperience,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const mallowMsg: ChatMessage = {
          id: `msg-${Date.now()}-m`,
          sender: 'mallow',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: data.mood || 'happy',
        };
        setMessages((prev) => [...prev, mallowMsg]);
        setEngineSource(data.source === 'gemini' ? 'gemini' : 'rule-based');
        if (data.mood) {
          onMoodChange?.(data.mood);
        }
        soundFx.playChime(659.25);
      } else {
        throw new Error('No reply received');
      }
    } catch (err) {
      console.warn('Chat request failed, using local fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-fallback`,
        sender: 'mallow',
        text: `*fluff cuddle* My cloud antenna got a bit misty, but I'm always here with you! Every dream you share makes our sky shine brighter.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: 'dreamy',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      soundFx.playChime(523.25);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Launcher (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            soundFx.playChime(783.99);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all toy-button group"
          aria-label="Open chat with Mallow"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span>Talk to Mallow</span>
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 w-[92vw] sm:w-96 sky-card rounded-3xl border-2 border-purple-300/80 dark:border-purple-700/80 shadow-2xl flex flex-col transition-all overflow-hidden ${
            isMinimized ? 'h-16' : 'h-[500px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
                ☁️
              </div>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                  <span>Mallow the Cloud</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20">
                    {engineSource === 'gemini' ? '✦ Gemini AI' : '✦ Storybook Engine'}
                  </span>
                </h3>
                <span className="text-[10px] text-purple-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Always listening in the sky
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                {messages.map((m) => {
                  const isMallow = m.sender === 'mallow';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMallow ? 'items-start' : 'items-end'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isMallow
                            ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-purple-100 border border-purple-100 dark:border-purple-800 shadow-xs'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.timestamp}</span>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-800 text-purple-400 border border-purple-100 dark:border-purple-800 w-20">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Carousel */}
              <div className="px-3 py-2 bg-purple-50/70 dark:bg-slate-800/70 border-t border-purple-100/60 dark:border-purple-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 text-[11px] font-semibold border border-purple-200/80 dark:border-purple-800/80 hover:bg-purple-100 transition-colors shrink-0"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-purple-100 dark:border-purple-900/60 flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Whisper a dream or question..."
                  maxLength={160}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-white border border-purple-200 dark:border-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
