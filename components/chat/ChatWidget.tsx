'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import {
  Expand,
  Loader2,
  Send,
  Bot,
  RotateCcw,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useBot } from '../../hooks/use-bot';
import './chat-widget.css';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ChatWidget() {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset between mouse and button top-left corner

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tooltipIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const locale = useLocale();
  const pathname = usePathname();

  // Tooltip messages
  const tooltips = [
    {
      ar: 'مرحباً! أنا مساعدك الشخصي. اسألني عن الكليات والبرامج!',
      en: 'Hi! I am your personal assistant. Ask me about colleges and programs!',
    },
    {
      ar: 'يمكنني مساعدتك في معلومات القبول والتسجيل في الجامعة',
      en: 'I can help you with admission and registration information',
    },
    {
      ar: 'اسألني عن المواعيد المهمة والأنشطة الطلابية',
      en: 'Ask me about important dates and student activities',
    },
    {
      ar: 'أحتاج مساعدتك في اختيار التخصص المناسب؟ أنا هنا!',
      en: 'Need help choosing the right major? I am here!',
    },
    {
      ar: 'اكتشف خدمات الجامعة والمرافق المتاحة',
      en: 'Discover university services and available facilities',
    },
  ];

  // Use the custom bot hook
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearSession,
  } = useBot();

  // Function to detect if text is Arabic
  const isArabicText = (text: string) => {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    return arabicRegex.test(text);
  };

  // Mouse event handlers للسحب
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return; // السحب يشتغل بس لما تكون expanded

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !isExpanded) return;

      setDragPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    },
    [isDragging, dragOffset, isExpanded]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setIsAnimating(true);
    setNewMessage(true);
    sendMessage(input);
    setInput('');

    // Reset animation states
    setTimeout(() => {
      setIsAnimating(false);
      setNewMessage(false);
    }, 500);
  };

  // Tooltip management functions
  const startTooltipCycle = useCallback(() => {
    if (tooltipIntervalRef.current) {
      clearInterval(tooltipIntervalRef.current);
    }

    tooltipIntervalRef.current = setInterval(() => {
      if (!isOpen) {
        setShowTooltip(true);
        setCurrentTooltipIndex(prev => (prev + 1) % tooltips.length);

        // Hide tooltip after 20 seconds
        setTimeout(() => {
          setShowTooltip(false);
        }, 20000);
      }
    }, 10000); // Show new tooltip every 10 seconds
  }, [isOpen, tooltips.length]);

  const stopTooltipCycle = useCallback(() => {
    if (tooltipIntervalRef.current) {
      clearInterval(tooltipIntervalRef.current);
      tooltipIntervalRef.current = null;
    }
    setShowTooltip(false);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // useEffect للـ mouse events أثناء السحب
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // حفظ آخر موقع في localStorage
  useEffect(() => {
    if (isExpanded && dragPosition.x !== 0 && dragPosition.y !== 0) {
      localStorage.setItem('chatWindowPosition', JSON.stringify(dragPosition));
    }
  }, [dragPosition, isExpanded]);

  // استرجاع آخر موقع عند فتح النافذة
  useEffect(() => {
    if (isExpanded && !isMobile) {
      const savedPosition = localStorage.getItem('chatWindowPosition');
      if (savedPosition) {
        const position = JSON.parse(savedPosition);
        setDragPosition(position);
      } else {
        // Default position (center of screen)
        const defaultX = (window.innerWidth - 800) / 2; // 800 = w-2/4 approximate width
        const defaultY = (window.innerHeight - 600) / 2; // 600 = h-4/5 approximate height
        setDragPosition({ x: Math.max(0, defaultX), y: Math.max(0, defaultY) });
      }
    }
  }, [isExpanded, isMobile]);

  // Start tooltip cycle when component mounts
  useEffect(() => {
    startTooltipCycle();
    return () => stopTooltipCycle();
  }, [startTooltipCycle, stopTooltipCycle]);

  // Stop tooltips when chat is open, restart when closed
  useEffect(() => {
    if (isOpen) {
      stopTooltipCycle();
    } else {
      // Start tooltip cycle after a delay when chat is closed
      const timeoutId = setTimeout(() => {
        startTooltipCycle();
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, startTooltipCycle, stopTooltipCycle]);

  if (pathname?.includes('/admin')) {
    return null;
  }

  return (
    <div>
      {/* Enhanced Floating Action Button */}
      <div
        className={`fixed bottom-6 z-50 transition-all duration-500 ease-out ${
          isOpen
            ? 'opacity-0 scale-0 pointer-events-none'
            : 'opacity-100 scale-100'
        } ${locale === 'ar' ? 'left-6' : 'right-6'}`}
      >
        <div
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 300);
          }}
          aria-label='Open chat'
          className='relative cursor-pointer'
        >
          {/* صورة البوت مع أنيميشن */}
          <motion.div
            animate={{
              y: [0, -6, 0], // floating effect
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className='relative'
          >
            <Image
              src='/chat_bot_logo.jpg'
              alt='Alternative Bot'
              width={70}
              height={70}
              className='rounded-full object-cover shadow-xl'
            />

            {/* Pulse animation */}
            {/* <div className='absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-600'></div> */}

            {/* Notification dot */}
            {messages.length > 0 && (
              <div className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold animate-bounce'>
                {messages.length}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tooltip Display */}
      {showTooltip && !isOpen && (
        <div
          className={`fixed bottom-26 max-w-xs bg-white border border-gray-300 text-black rounded-lg shadow-lg p-4 text-sm z-50 transition-all duration-500 ease-in-out transform ${
            showTooltip
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          } ${locale === 'ar' ? 'left-6' : 'right-6'}`}
        >
          <div
            className={`flex items-start gap-3 ${
              locale === 'ar' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <Bot className='w-4 h-4 text-blue-500' />
                <span className='font-semibold text-blue-600'>
                  {locale === 'ar'
                    ? 'مساعد جامعة حلوان الاهلية'
                    : 'HNU Assistant'}
                </span>
              </div>
              <p
                className={`text-gray-700 ${locale === 'ar' ? 'text-right' : 'text-left'}`}
              >
                {tooltips[currentTooltipIndex][locale as 'ar' | 'en']}
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className='text-gray-400 hover:text-gray-600 transition-colors duration-200 text-lg leading-none'
              aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
            >
              ×
            </button>
          </div>
          {/* Arrow pointing to the chat button */}
          <div
            className={`absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white ${
              locale === 'ar' ? 'left-8' : 'right-8'
            } -bottom-1`}
          ></div>
        </div>
      )}

      {/* Enhanced Chat Box */}
      {isOpen && (
        <div
          className={`
            ${
              isMobile
                ? isExpanded
                  ? 'fixed top-0 left-0 w-full h-full'
                  : `fixed bottom-20 w-96 h-[36rem] ${locale === 'ar' ? 'left-4' : 'right-4'}`
                : isExpanded
                  ? 'fixed w-2/4 h-4/5 max-w-4xl'
                  : `fixed bottom-20 w-96 h-[36rem] ${locale === 'ar' ? 'left-4' : 'right-4'}`
            }
            bg-white rounded-2xl shadow-2xl flex flex-col z-50
            transition-all duration-500 ease-out
            ${isOpen ? 'animate-in slide-in-from-bottom-4 fade-in-0 zoom-in-95' : ''}
            border border-gray-200/50 backdrop-blur-sm
            ${isExpanded && !isMobile ? 'draggable-window' : ''}
          `}
          {...(isExpanded &&
            !isMobile && {
              style: {
                left: `${dragPosition.x}px`,
                top: `${dragPosition.y}px`,
                transform: 'none',
              },
            })}
        >
          {/* Enhanced Header */}
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-200/50 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-2xl ${
              locale === 'ar' ? 'flex-row-reverse' : ''
            } ${isExpanded && !isMobile ? 'cursor-move' : ''}`}
            onMouseDown={handleMouseDown}
          >
            <div
              className={`flex items-center gap-3 ${locale === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <div className='relative'>
                {/* <Bot className='w-6 h-6 animate-pulse' /> */}
                <Image
                  src='/chat_bot_logo.jpg'
                  alt='Alternative Bot'
                  width={36}
                  height={36}
                  className='rounded-full object-cover animate-pulse'
                />
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping'></div>
              </div>
              <div className={locale === 'ar' ? 'text-right' : 'text-left'}>
                <h3 className='font-semibold text-sm'>
                  {locale === 'ar'
                    ? 'مساعد جامعة حلوان الاهلية'
                    : 'HNU Assistant'}
                </h3>
                <p className='text-xs text-gray-300'>
                  {locale === 'ar' ? 'متاح الآن' : 'Online'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200'
                title={locale === 'ar' ? 'مسح المحادثة' : 'Clear conversation'}
                disabled={messages.length === 0}
                onClick={clearMessages}
              >
                <RotateCcw className='w-4 h-4' />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200'
                title={locale === 'ar' ? 'تكبير/تصغير' : 'Expand/Collapse'}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <Minimize2 className='w-4 h-4' />
                ) : (
                  <Maximize2 className='w-4 h-4' />
                )}
              </Button>

              <Button
                variant='ghost'
                size='sm'
                className='h-8 w-8 p-0 text-gray-300 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200'
                title={locale === 'ar' ? 'إغلاق' : 'Close'}
                onClick={() => {
                  clearSession();
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
              >
                <X className='w-4 h-4' />
              </Button>
            </div>
          </div>

          {/* Enhanced Messages Area */}
          <div className='messages-container flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50'>
            {messages.length === 0 ? (
              <div
                className={`text-center text-gray-500 py-12 animate-fade-in ${locale === 'ar' ? 'text-right' : 'text-left'} flex items-center justify-center flex-col gap-4 px-4`}
              >
                <div className='mb-4'>
                  {/* <Bot className='w-12 h-12 mx-auto text-blue-500 animate-bounce' /> */}
                  <Image
                    src='/chat_bot_logo.jpg'
                    alt='Alternative Bot'
                    width={70}
                    height={70}
                    className='rounded-full object-cover'
                  />
                </div>
                <p className='text-sm font-medium mb-2'>
                  {locale === 'ar'
                    ? 'اهلا بيك انا مساعدك الشخصي موجود هنا لمساعدتك. اسألني أي شيء عن جامعة حلوان الاهلية !'
                    : // translate to english
                      'Welcome! I am your personal assistant here to help you. Ask me anything about Helwan National University!'}
                </p>
                <p className='text-xs text-gray-400'>
                  {locale === 'ar'
                    ? 'يمكنني المساعدة في الكورسات، القبول، الكليات والاقسام، والمزيد.'
                    : 'I can help with courses, admissions, campus facilities, and more.'}
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => {
                  const messageIsArabic = isArabicText(msg.text);
                  return (
                    <div
                      key={i}
                      className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in-0 duration-300 message-delay-${Math.min(i, 9)}`}
                    >
                      <div
                        className={`message-bubble px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                          msg.from === 'user'
                            ? `bg-gradient-to-r from-blue-500 to-gray-900 text-white ${locale === 'ar' ? 'rounded-bl-md' : 'rounded-br-md'}`
                            : `bg-white text-gray-800 border border-gray-200 ${locale === 'ar' ? 'rounded-br-md' : 'rounded-bl-md'}`
                        }`}
                      >
                        <p
                          className={`whitespace-pre-wrap ${
                            msg.from === 'user'
                              ? locale === 'ar'
                                ? 'text-right'
                                : 'text-left'
                              : messageIsArabic
                                ? 'text-right'
                                : 'text-left'
                          }`}
                          dir={
                            msg.from === 'user'
                              ? locale === 'ar'
                                ? 'rtl'
                                : 'ltr'
                              : messageIsArabic
                                ? 'rtl'
                                : 'ltr'
                          }
                        >
                          {msg.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className='flex justify-start animate-in slide-in-from-bottom-2 fade-in-0'>
                    <div className='bg-white text-gray-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-200'>
                      <div className='flex space-x-1'>
                        <div className='typing-dot w-2 h-2 bg-gray-400 rounded-full'></div>
                        <div className='typing-dot w-2 h-2 bg-gray-400 rounded-full'></div>
                        <div className='typing-dot w-2 h-2 bg-gray-400 rounded-full'></div>
                      </div>
                      <span className='text-sm text-gray-500'>
                        {locale === 'ar' ? 'جاري الكتابة...' : 'Typing...'}
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Enhanced Input Area */}
          <div className='p-4 border-t border-gray-200/50 bg-white rounded-b-2xl text-black'>
            <div
              className={`flex gap-3 items-end ${locale === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <div className='flex-1 relative'>
                <input
                  ref={inputRef}
                  className={`chat-input w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${locale === 'ar' ? 'text-right' : 'text-left'}`}
                  placeholder={
                    locale === 'ar'
                      ? 'اسأل عن الجامعة...'
                      : 'Ask about University...'
                  }
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e =>
                    e.key === 'Enter' && !e.shiftKey && handleSendMessage()
                  }
                  disabled={isLoading}
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
                {input && (
                  <div
                    className={`absolute top-1/2 transform -translate-y-1/2 text-xs text-gray-400 ${locale === 'ar' ? 'left-3' : 'right-3'}`}
                  >
                    {input.length}/500
                  </div>
                )}
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-gradient-to-r from-blue-500 to-gray-900 hover:from-blue-600 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Send className='w-4 h-4' />
                )}
              </Button>
            </div>

            <div className='mt-3 text-center'>
              <p className='text-xs text-gray-400'>
                {locale === 'ar'
                  ? 'قد ينتج مساعد جامعة حلوان الاهلية معلومات غير دقيقة.'
                  : 'HNU Assistant may produce inaccurate information.'}
              </p>
              {error && (
                <p className='text-xs text-red-500 mt-1 animate-pulse'>
                  {locale === 'ar'
                    ? 'حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.'
                    : 'Connection error. Please try again.'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
