'use client';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Expand } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function ChatWidget() {
  //add code to on click in large device open chat with large size and in small device open full screen
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ from: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState('');
  const locale = useLocale();

  const sendMessage = async () => {
    if (!input) return;

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    const userMessage = input;
    setInput('');

    try {
      const res = await fetch('https://YOUR-N8N-WEBHOOK-URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, { from: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: 'An error occurred while connecting.' },
      ]);
    }
  };

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  return (
    <div>
      {/* Button to open/close chat */}
      <Button
        // if button is open hidden button
        className={
          isOpen
            ? 'hidden'
            : 'bg-slate-900 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-6 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] fixed z-40 rounded-full shadow-lg transition-all duration-200 hover:bg-slate-800 text-white bottom-10 right-10 w-24 h-24 hover:scale-110'
        }
        onClick={() => setIsOpen(!isOpen)}
        data-slot='button'
        aria-label='Open chat'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-bot w-16 h-16'
          aria-hidden='true'
        >
          <path d='M12 8V4H8'></path>
          <rect width='16' height='12' x='4' y='8' rx='2'></rect>
          <path d='M2 14h2'></path>
          <path d='M20 14h2'></path>
          <path d='M15 13v2'></path>
          <path d='M9 13v2'></path>
        </svg>
      </Button>

      {/* Chat box */}
      {isOpen && (
        <div
          className={`
            ${
              isMobile
                ? isExpanded
                  ? 'fixed top-0 left-0 w-full h-full'
                  : 'fixed bottom-20 right-5 w-90 h-96'
                : isExpanded
                  ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/4 h-3/4'
                  : 'fixed bottom-20 right-5 w-90 h-96'
            }
               bg-white rounded-xl shadow-lg flex flex-col z-50
                  transition-all duration-300
            `}
        >
          {/* header */}
          <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-slate-900 text-white rounded-t-xl'>
            <div className='flex items-center gap-3'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-bot w-6 h-6'
                aria-hidden='true'
              >
                <path d='M12 8V4H8'></path>
                <rect width='16' height='12' x='4' y='8' rx='2'></rect>
                <path d='M2 14h2'></path>
                <path d='M20 14h2'></path>
                <path d='M15 13v2'></path>
                <path d='M9 13v2'></path>
              </svg>
                                {locale === 'ar'
                    ? 'المساعد زقزوقي'
                    : 'Zaqzouqi Assistant'
                  }
              <span className='font-medium'></span>
            </div>

            <div className='flex items-center gap-2 w-24 h-8 mr-2 ml-2 justify-center rounded-md'>
              <Button
                data-slot='button'
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-white hover:text-accent-foreground dark:hover:bg-white/30 h-8 rounded-md gap-1.5 has-[&gt;svg]:px-2.5 p-2"
                title='Clear conversation history'
                disabled={messages.length === 0}
                onClick={() => setMessages([])}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='lucide lucide-rotate-ccw w-4 h-4'
                  aria-hidden='true'
                >
                  <path d='M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'></path>
                  <path d='M3 3v5h5'></path>
                </svg>
              </Button>

              <Button
                data-slot='button'
                title='Expand & collapse chat'
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-white hover:text-accent-foreground dark:hover:bg-white/30 h-8 rounded-md gap-1.5 has-[&gt;svg]:px-2.5 p-2"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  aria-hidden='true'
                >
                  <Expand className='w-4 h-4' />
                  <path d='M18 6 6 18'></path>
                  <path d='m6 6 12 12'></path>
                </svg>
              </Button>
              <Button
                data-slot='button'
                title='Clear conversation history'
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-white hover:text-accent-foreground dark:hover:bg-white/30 h-8 rounded-md gap-1.5 has-[&gt;svg]:px-2.5 p-2"
                onClick={() => {
                  setMessages([]);
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  className='lucide lucide-x w-4 h-4'
                  aria-hidden='true'
                >
                  <path d='M18 6 6 18'></path>
                  <path d='m6 6 12 12'></path>
                </svg>
              </Button>
            </div>
          </div>

          {/* messages */}
          <div className='flex-1 overflow-y-auto p-3 space-y-2'>
            {messages.length === 0 ? (
              <div className='text-center text-gray-500 py-8'>
                {/* use locale to translate */}
                <p className='text-sm'>                  {locale === 'ar'
                    ? 'اهلا بيك انا زقزوقي! موجود هنا لمساعدتك. اسألني أي شيء عن الجامعة!'
                    : 'Hi there! I am Zaqzouqi. Ask me anything about University!'
                  }</p>
                <p className='text-xs mt-2'>
                  {locale === 'ar'
                    ? 'يمكنني المساعدة في الكورسات، القبول، الكليات والاقسام، والمزيد.'
                    : 'I can help with courses, admissions, campus facilities, and more.'
                  }
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <span
                    className={`px-3 py-2 rounded-lg max-w-[75%] text-sm ${
                      msg.from === 'user'
                        ? 'bg-slate-800 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* message input */}
          <div className='p-4 border-t border-gray-200 text-gray-500'>
            <div className='flex gap-2'>
              <input
                className='flex-1 border rounded-md px-3 py-1 text-base outline-none'
                placeholder={locale === 'ar' ? 'اسأل عن الجامعة...' : 'Ask about University...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                disabled={!input}
                className='px-3 bg-slate-900 hover:bg-slate-700 text-white rounded-md disabled:opacity-50'
              >
                ➤
              </Button>
            </div>
            <p className='text-xs text-gray-500 mt-2 text-center'>
              {locale === 'ar'
                ? 'قد ينتج الذكاء الاصطناعي زقزوقي معلومات غير دقيقة .'
                : 'Zaqzouqi AI may produce inaccurate information.'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
