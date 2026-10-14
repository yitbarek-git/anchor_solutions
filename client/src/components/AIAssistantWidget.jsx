import React, { useState, useEffect, useRef } from 'react';
import { BrandLogo } from '../assets/BrandLogo.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { LOCATION_DATA } from '../utils/location.js';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Shield,
  CreditCard,
  MapPin,
  ArrowRight,
  ExternalLink,
  Minimize2,
  Maximize2,
  RefreshCw,
  Phone,
} from 'lucide-react';

function formatInlineStyles(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function formatAssistantText(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let currentList = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`}>
          {currentList.map((item, idx) => (
            <li key={idx}>{formatInlineStyles(item)}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ') || trimmed.startsWith('•')) {
      const cleanItem = trimmed.replace(/^[-•*]\s*/, '');
      currentList.push(cleanItem);
    } else {
      flushList();
      if (trimmed === '') {
        elements.push(<div key={`gap-${lineIdx}`} style={{ height: '0.45rem' }} />);
      } else {
        elements.push(
          <p key={`p-${lineIdx}`}>
            {formatInlineStyles(trimmed)}
          </p>
        );
      }
    }
  });

  flushList();
  return elements;
}

export function AIAssistantWidget({ navigate }) {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const getInitialGreeting = () => {
    return language === 'am'
      ? {
          role: 'model',
          text: 'ሰላም! ወደ Anchor Solutions Educational Platform እንኳን በደህና መጡ። በባሕር ዳር ከተማ የሚገኙ ኮርሶቻችንን፣ የቴሌብር ክፍያ እና የምዝገባ ሂደቶችን በተመለከተ ምን ልርዳዎት?',
          suggestedActions: [
            { label: 'የኮርሶች ዝርዝር እና ዋጋ', query: 'ምን አይነት ኮርሶች አሏችሁ? ዋጋቸውስ ስንት ነው?' },
            { label: 'የቴሌብር አከፋፈል', query: 'በቴሌብር እንዴት መክፈል እችላለሁ?' },
            { label: 'አድራሻ እና ስልክ', query: 'የባሕር ዳር ቢሮ አድራሻ እና ስልክ የት ነው?' },
          ],
        }
      : {
          role: 'model',
          text: 'Hello! Welcome to Anchor Solutions Educational Platform. I can assist you with our practical training courses, official Telebirr payment instructions, tuition fees in ETB, and our Bahir Dar campus location. How can we help you today?',
          suggestedActions: [
            { label: 'Courses & Tuition', query: 'What courses are available and how much do they cost?' },
            { label: 'Telebirr Payment Guide', query: 'How do I pay with Telebirr?' },
            { label: 'Campus Address & Phone', query: 'Where is your campus in Bahir Dar?' },
          ],
        };
  };

  const [messages, setMessages] = useState([getInitialGreeting()]);

  // Update greeting when language changes if no conversation has taken place
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([getInitialGreeting()]);
    }
  }, [language]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, loading]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (messageText = null) => {
    const textToSend = (messageText || inputMessage).trim();
    if (!textToSend || loading) return;

    const userMsg = { role: 'user', text: textToSend };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const history = updatedMessages
        .slice(1)
        .map(m => ({ role: m.role, text: m.text }));

      const res = await api.ai.chat(textToSend, history, language);

      if (res && res.success && res.data) {
        setIsOnline(true);
        setMessages(prev => [
          ...prev,
          {
            role: 'model',
            text: res.data.reply,
            suggestedActions: res.data.suggestedActions || [],
          },
        ]);
      } else {
        const errorReply = language === 'am'
          ? 'ይቅርታ፣ ምላሽ መስጠት አልተቻለም። እባክዎ በቀጥታ በ 0902 18 44 40 ይደውሉልን።'
          : 'Sorry, I encountered a temporary connection issue. You can call admissions directly at 0902 18 44 40.';
        setMessages(prev => [
          ...prev,
          { role: 'model', text: errorReply },
        ]);
      }
    } catch (err) {
      setIsOnline(false);
      const errorReply = language === 'am'
        ? 'የግንኙነት መቋረጥ አጋጥሟል። እባክዎ በስልክ 0902 18 44 40 ወይም 0952 58 77 50 ያግኙን።'
        : 'Network error encountered. Please call admissions at 0902 18 44 40 or 0952 58 77 50.';
      setMessages(prev => [
        ...prev,
        { role: 'model', text: errorReply },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.link) {
      if (navigate) {
        navigate(action.link);
      } else {
        window.location.pathname = action.link;
      }
      setIsOpen(false);
    } else if (action.query) {
      handleSend(action.query);
    }
  };

  const handleReset = () => {
    setMessages([getInitialGreeting()]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Circular Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="anchor-ai-launcher"
          aria-label={language === 'am' ? 'የአንከር ረዳትን ክፈት' : 'Open Anchor Solutions Assistant'}
          title={language === 'am' ? 'የአንከር ረዳት' : 'Anchor Solutions Assistant'}
        >
          <div className="anchor-ai-launcher-icon-wrapper">
            <MessageSquare size={24} />
            {isOnline && (
              <>
                <span className="anchor-ai-status-pulse" />
                <span className="anchor-ai-status-dot" />
              </>
            )}
          </div>
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={`anchor-ai-panel ${isMinimized ? 'is-minimized' : ''} ${language === 'am' ? 'lang-am' : ''}`}
          role="dialog"
          aria-label={language === 'am' ? 'የአንከር ረዳት' : 'Anchor Solutions Assistant'}
        >
          {/* Header */}
          <div className="anchor-ai-header">
            <div className="anchor-ai-header-brand">
              <div className="anchor-ai-header-icon-box">
                <BrandLogo size={24} showWordmark={false} />
              </div>
              <div className="anchor-ai-header-info">
                <div className="anchor-ai-header-title-row">
                  <h3 className="anchor-ai-header-title">
                    {language === 'am' ? 'የአንከር ረዳት' : 'Anchor Solutions Assistant'}
                  </h3>
                  {isOnline && (
                    <span className="anchor-ai-online-badge">
                      <span className="anchor-ai-online-dot" />
                      {language === 'am' ? 'ቀጥታ' : 'Live'}
                    </span>
                  )}
                </div>
                <p className="anchor-ai-header-subtitle">
                  {language === 'am' ? 'ምን ልርዳዎት?' : 'How can we help you?'}
                </p>
              </div>
            </div>

            <div className="anchor-ai-header-controls">
              <button
                type="button"
                onClick={handleReset}
                title={language === 'am' ? 'ውይይት አድስ' : 'Reset conversation'}
                className="anchor-ai-control-btn"
                aria-label={language === 'am' ? 'ውይይት አድስ' : 'Reset conversation'}
              >
                <RefreshCw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? (language === 'am' ? 'አስፋ' : 'Expand') : (language === 'am' ? 'አሳንስ' : 'Minimize')}
                className="anchor-ai-control-btn"
                aria-label={isMinimized ? (language === 'am' ? 'አስፋ' : 'Expand') : (language === 'am' ? 'አሳንስ' : 'Minimize')}
              >
                {isMinimized ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={language === 'am' ? 'ዝጋ' : 'Close'}
                className="anchor-ai-control-btn"
                aria-label={language === 'am' ? 'ረዳትን ዝጋ' : 'Close assistant'}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Verified Information Strip */}
              <div className="anchor-ai-strip">
                <div className="anchor-ai-strip-item">
                  <CreditCard size={13} style={{ color: 'var(--color-gold)' }} />
                  <span>
                    Telebirr: <strong className="anchor-ai-strip-accent">Tizta</strong> (0902 18 44 40)
                  </span>
                </div>
                <div className="anchor-ai-strip-item">
                  <MapPin size={13} style={{ color: 'var(--color-gold)' }} />
                  <span>Bahir Dar (Kebele 04)</span>
                </div>
              </div>

              {/* Conversation Area */}
              <div className="anchor-ai-body">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={idx}
                      className={`anchor-ai-msg-group ${isUser ? 'is-user' : 'is-model'}`}
                    >
                      <div className="anchor-ai-bubble">
                        {isUser ? msg.text : formatAssistantText(msg.text)}
                      </div>

                      {/* Quick Action Suggestion Chips */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="anchor-ai-actions-wrap">
                          {msg.suggestedActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={() => handleActionClick(action)}
                              className="anchor-ai-action-chip"
                            >
                              <span>{action.label}</span>
                              {action.link ? (
                                <ExternalLink size={12} style={{ opacity: 0.8 }} />
                              ) : (
                                <ArrowRight size={12} style={{ opacity: 0.8 }} />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading / Typing State */}
                {loading && (
                  <div className="anchor-ai-msg-group is-model">
                    <div className="anchor-ai-typing-indicator">
                      <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
                      <span>{language === 'am' ? 'ምላሽ በማዘጋጀት ላይ...' : 'Preparing response...'}</span>
                      <div className="anchor-ai-dots">
                        <span className="anchor-ai-dot" />
                        <span className="anchor-ai-dot" />
                        <span className="anchor-ai-dot" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="anchor-ai-composer"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    language === 'am'
                      ? 'ስለ ኮርሶች፣ ቴሌብር ወይም አድራሻ ይጠይቁ...'
                      : 'Type your message or question...'
                  }
                  className="anchor-ai-input"
                  maxLength={500}
                  disabled={loading}
                  aria-label={language === 'am' ? 'የመልእክት ማስገቢያ' : 'Message'}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="anchor-ai-send-btn"
                  aria-label={language === 'am' ? 'ላክ' : 'Send message'}
                >
                  <Send size={16} />
                </button>
              </form>

              {/* Security & Verification Disclaimer */}
              <div className="anchor-ai-footer-note">
                <span className="anchor-ai-footer-badge">
                  <Shield size={12} />
                  <span>
                    {language === 'am'
                      ? 'ይፋዊ መረጃ • ክፍያዎች በአስተዳዳሪ ይረጋገጣሉ'
                      : 'Verified data • Desk verified payments'}
                  </span>
                </span>
                <span>Bahir Dar, Ethiopia</span>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default AIAssistantWidget;
