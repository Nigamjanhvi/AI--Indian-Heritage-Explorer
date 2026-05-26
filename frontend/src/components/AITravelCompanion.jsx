import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Clipboard, Maximize2, Mic, Minimize2, RefreshCw, Send, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import api from '../api/axios.js';

const promptChips = [
  'Best forts in Rajasthan',
  'Temples in South India',
  'Kerala backwaters',
  'Himachal road trip',
  'Honeymoon destinations',
  'Family vacation ideas',
  'Budget backpacking trip',
  'Food trails in India'
];

const followUps = ['Make it budget friendly', 'Add food stops', 'Suggest best season'];

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function friendlyError(error) {
  if (!error.response) return 'Unable to connect to AI service. Please check if the backend is running.';
  return 'AI Assistant temporarily unavailable. I can still help with a simple travel suggestion if you try again.';
}

export default function AITravelCompanion() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: 'Hi, I am your AI Travel Companion. Ask me about India trips, weather, packing, food, temples, road trips, safety, festivals or hidden gems.',
      time: timeNow()
    }
  ]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  async function sendPrompt(prompt) {
    const message = prompt.trim();
    if (!message || loading) return;

    setOpen(true);
    setInput('');
    setLastPrompt(message);
    setMessages(current => [...current, { role: 'user', text: message, time: timeNow() }]);
    setLoading(true);

    try {
      const convo = messages.map(m => ({ role: m.role, content: m.text }));
      // include the new user message at the end of conversation history
      convo.push({ role: 'user', content: message });

      const { data } = await api.post('/ai/chat', { message, conversationHistory: convo });

      if (!data || data.success === false) {
        const err = (data && data.message) ? data.message : 'AI service returned an error.';
        setMessages(current => [...current, { role: 'ai', text: friendlyError({ response: { data: { message: err } } }), time: timeNow(), error: true }]);
        setLoading(false);
        return;
      }

      // Support structured responses: data.parsed.json or data.parsed.text
      const parsed = data.parsed || null; // parsed is the JSON object returned by backend when available
      const responseText = (parsed && parsed.text) || data.response || data.reply || data.answer || 'I can help with that. Tell me your destination, dates and budget.';
      const aiMessage = { role: 'ai', text: responseText, time: timeNow() };
      if (parsed) aiMessage.structured = parsed;

      setMessages(current => [...current, aiMessage]);
    } catch (error) {
      setMessages(current => [...current, { role: 'ai', text: friendlyError(error), time: timeNow(), error: true }]);
    } finally {
      setLoading(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    sendPrompt(input);
  }

  function voiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert('Voice input is not supported in this browser.');
    const recognition = new Recognition();
    recognition.onresult = event => setInput(event.results[0][0].transcript);
    recognition.start();
  }

  async function copyText(text) {
    await navigator.clipboard?.writeText(text);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className={`mb-4 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950 ${expanded ? 'h-[82vh] w-[min(760px,calc(100vw-40px))]' : 'h-[650px] w-[min(400px,calc(100vw-32px))]'}`}
          >
            <header className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-slate-950 to-orange-700 p-4 text-white dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <Bot size={20} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">AI Travel Companion</h2>
                  <p className="text-xs text-orange-100">Trips, food, culture, weather and tips</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="rounded-md p-2 hover:bg-white/10" onClick={() => setExpanded(value => !value)} aria-label="Expand chat">
                  {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
                </button>
                <button className="rounded-md p-2 hover:bg-white/10" onClick={() => setOpen(false)} aria-label="Close chat">
                  <X size={17} />
                </button>
              </div>
            </header>

            <div className="h-[calc(100%-132px)] overflow-y-auto bg-[#fbf4e8] p-4 dark:bg-slate-900">
              <div className="mb-4 flex flex-wrap gap-2">
                {promptChips.slice(0, expanded ? promptChips.length : 4).map(chip => (
                  <button
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-orange-50 dark:bg-slate-800 dark:text-slate-200"
                    key={chip}
                    onClick={() => sendPrompt(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`} key={`${message.time}-${index}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.role === 'user' ? 'rounded-tr-sm bg-saffron text-white' : message.error ? 'rounded-tl-sm bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100' : 'rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}>
                      {/* If assistant provided structured data, show a compact card */}
                      {message.structured && (
                        <div className="mb-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-semibold text-slate-500">{message.structured.type || 'Travel'}</div>
                              <div className="mt-1 text-lg font-bold">{message.structured.title || message.structured.destination || 'Recommendation'}</div>
                              {message.structured.destination && <div className="mt-1 text-sm text-slate-600">{message.structured.destination}</div>}
                            </div>
                            <div className="ml-4 text-sm text-slate-500">{message.time}</div>
                          </div>
                          {message.structured.attractions && message.structured.attractions.length > 0 && (
                            <div className="mt-3 text-sm">
                              <div className="font-semibold text-slate-700 dark:text-slate-200">Top attractions</div>
                              <ul className="mt-2 list-disc pl-5 text-slate-700 dark:text-slate-300">
                                {message.structured.attractions.slice(0,5).map((a,i) => <li key={i}>{a}</li>)}
                              </ul>
                            </div>
                          )}
                          {message.structured.foods && message.structured.foods.length > 0 && (
                            <div className="mt-3 text-sm">
                              <div className="font-semibold text-slate-700 dark:text-slate-200">Foods to try</div>
                              <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{message.structured.foods.join(', ')}</div>
                            </div>
                          )}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap leading-6">{message.text}</p>
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs opacity-70">
                        <span>{message.time}</span>
                        {message.role === 'ai' && (
                          <button onClick={() => copyText(message.text)} aria-label="Copy answer">
                            <Clipboard size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-300">Thinking</p>
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2].map(dot => <span className="h-2 w-2 animate-pulse rounded-full bg-saffron" style={{ animationDelay: `${dot * 130}ms` }} key={dot} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {!loading && messages.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {followUps.map(item => <button className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-800" key={item} onClick={() => sendPrompt(`${lastPrompt}. ${item}`)}>{item}</button>)}
                </div>
              )}
            </div>

            <form onSubmit={submit} className="flex h-[68px] items-center gap-2 border-t border-orange-100 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
              <button type="button" className="btn-secondary rounded-full px-3" onClick={voiceInput} aria-label="Voice input">
                <Mic size={16} />
              </button>
              <input className="input rounded-full text-sm" value={input} onChange={event => setInput(event.target.value)} placeholder="Ask anything about your trip..." />
              <button type="button" className="btn-secondary rounded-full px-3" onClick={() => lastPrompt && sendPrompt(lastPrompt)} disabled={!lastPrompt || loading} aria-label="Regenerate">
                <RefreshCw size={16} />
              </button>
              <button className="btn-primary rounded-full px-3" disabled={!input.trim() || loading} aria-label="Send message">
                <Send size={16} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-saffron text-white shadow-2xl shadow-orange-700/40"
        onClick={() => setOpen(value => !value)}
        aria-label="Open AI Travel Companion"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-saffron/40" />
        <Sparkles className="relative" />
      </motion.button>
    </div>
  );
}
