"use client";

import {
  useState,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Sparkles, Plus } from "lucide-react";
import { BotIcon } from "@/components/visuals/BotIcon";
import { useLanguage } from "@/i18n/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function Chatbot() {
  const { locale, t } = useLanguage();
  const triggerHints = t.chatbot.triggerHints[locale];
  const suggestedQuestions = t.chatbot.suggestedQuestions[locale];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeHint, setActiveHint] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;

    const intervalId = window.setInterval(() => {
      setActiveHint((current) => (current + 1) % triggerHints.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [isOpen, triggerHints.length]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (!isOpen) return;
    const saved = document.body.style.overflow;
    // Only lock on small screens
    if (window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = saved;
    };
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setHasInteracted(true);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ?? "Sorry, I couldn't process that. Please try again."
        );
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.reply ?? "Sorry, I couldn't process that. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Oops! Something went wrong. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Format message content — handle markdown bold, links, line breaks
  const formatMessage = (text: string) => {
    // Convert markdown links [text](url) to anchor tags
    let formatted = text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="chatbot-link">$1</a>'
    );
    // Convert bare URLs to anchor tags (skip if already inside an anchor tag)
    formatted = formatted.replace(
      /(?<!href=["'])(?<!=["'])(https?:\/\/[^\s<>"')\]]+)/g,
      '<a href="$1" target="_blank" rel="noreferrer" class="chatbot-link">$1</a>'
    );
    // Convert markdown bold **text** to strong
    formatted = formatted.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="text-white/90 font-semibold">$1</strong>'
    );
    // Convert line breaks
    formatted = formatted.replace(/\n/g, "<br/>");
    return formatted;
  };

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="chat-trigger-wrap"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="chatbot-trigger-wrap"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={triggerHints[activeHint]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.28, ease: easeOut }}
                className="chatbot-trigger-hint"
              >
                <span className="chatbot-trigger-hint-dot" aria-hidden />
                <span>{triggerHints[activeHint]}</span>
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={() => setIsOpen(true)}
              className="chatbot-trigger"
              aria-label="Open assistant"
              data-cursor-grow
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="chatbot-trigger-core" aria-hidden>
                <BotIcon size={64} animated />
              </span>

              <span className="chatbot-trigger-status" aria-hidden>
                <span className="chatbot-trigger-status-dot" />
              </span>

              {!hasInteracted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="chatbot-trigger-badge"
                >
                  {t.chatbot.newBadge[locale]}
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="chatbot-window"
            ref={chatContainerRef}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="flex items-center gap-3">
                <div className="chatbot-avatar">
                  <BotIcon size={20} className="text-purple-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {t.chatbot.assistantName[locale]}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[10px] text-white/45">
                      {t.chatbot.onlineNow[locale]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* New Chat Button */}
                {messages.length > 0 && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={startNewChat}
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-all duration-300 hover:border-emerald-400/30 hover:bg-emerald-500/10 hover:text-emerald-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Start new chat"
                    title="New Chat"
                  >
                    <Plus size={16} />
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="chatbot-close"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Messages area */}
            <div className="chatbot-messages" data-lenis-prevent>
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col items-center px-4 py-6 text-center"
                >
                  <div className="chatbot-welcome-icon">
                    <BotIcon size={32} className="text-purple-300" />
                  </div>
                  <h4 className="mt-4 text-sm font-semibold text-white">
                    {t.chatbot.welcomeTitle[locale]}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">
                    {t.chatbot.welcomeBody[locale]}
                  </p>

                  {/* Suggested questions */}
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((q) => (
                      <motion.button
                        key={q}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => sendMessage(q)}
                        className="chatbot-suggestion"
                      >
                        {q}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    ease: easeOut,
                    delay: i === messages.length - 1 ? 0.05 : 0,
                  }}
                  className={`chatbot-msg-row ${
                    msg.role === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`chatbot-msg-avatar ${
                      msg.role === "user"
                        ? "chatbot-msg-avatar-user"
                        : "chatbot-msg-avatar-bot"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User size={12} />
                    ) : (
                      <BotIcon size={12} />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`chatbot-bubble ${
                      msg.role === "user"
                        ? "chatbot-bubble-user"
                        : "chatbot-bubble-bot"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatMessage(msg.content),
                    }}
                  />
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="chatbot-msg-row chatbot-msg-bot"
                >
                  <div className="chatbot-msg-avatar chatbot-msg-avatar-bot">
                    <BotIcon size={12} />
                  </div>
                  <div className="chatbot-bubble chatbot-bubble-bot">
                    <div className="chatbot-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <form onSubmit={handleSubmit} className="chatbot-input-area">
              <div className="chatbot-input-wrapper">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.chatbot.inputPlaceholder[locale]}
                  rows={1}
                  className="chatbot-input"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="chatbot-send"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Send message"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
