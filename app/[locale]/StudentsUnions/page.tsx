'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<'en' | 'ar'>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        closeSidebar();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    setIsRTL(currentLocale === 'ar');
  }, [currentLocale]);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const closeSidebar = () => {
    setOpen(false);
    setOpenSubmenus(new Set());
  };

  const toggleSubmenu = (href: string) => {
    const newOpenSubmenus = new Set(openSubmenus);
    if (newOpenSubmenus.has(href)) {
      newOpenSubmenus.delete(href);
    } else {
      newOpenSubmenus.add(href);
    }
    setOpenSubmenus(newOpenSubmenus);
  };

  const handleSubmenuKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSubmenu(href);
    }
  };

  const navigationItems = [
    {
      label: { en: 'Home', ar: 'الرئيسية' },
      href: '/',
      submenu: [],
    },
    {
      label: { en: 'About', ar: 'عن الجامعة' },
      href: '/about',
      submenu: [
        { label: { en: 'History', ar: 'التاريخ' }, href: '/about/history' },
        {
          label: { en: 'Vision & Mission', ar: 'الرؤية والرسالة' },
          href: '/about/vision',
        },
        {
          label: { en: 'Leadership', ar: 'القيادة' },
          href: '/about/leadership',
        },
      ],
    },
    {
      label: { en: 'Student Union', ar: 'الاتحاد الطلابي' },
      href: '/union',
      submenu: [
        { label: { en: 'President', ar: 'الرئيس' }, href: '/union/president' },
        {
          label: { en: 'Vice President', ar: 'نائب الرئيس' },
          href: '/union/vice-president',
        },
        { label: { en: 'Events', ar: 'الفعاليات' }, href: '/union/events' },
      ],
    },
    {
      label: { en: 'Services', ar: 'الخدمات' },
      href: '/services',
      submenu: [],
    },
    {
      label: { en: 'Contact', ar: 'اتصل بنا' },
      href: '/contact',
      submenu: [],
    },
  ];

  const executives = [
    {
      name: 'Ahmed Mohamed',
      position: 'President',
      image: 'https://placehold.co/300x300/023f8a/white?text=President',
      description:
        'Leading the student union with vision and dedication to improve campus life.',
    },
    {
      name: 'Sarah Ali',
      position: 'Vice President',
      image: 'https://placehold.co/300x300/02397c/white?text=Vice+President',
      description:
        'Supporting the president and managing day-to-day operations of the union.',
    },
    {
      name: 'Mohamed Hassan',
      position: 'Secretary',
      image: 'https://placehold.co/300x300/ffd700/023f8a?text=Secretary',
      description:
        'Responsible for official documentation and communication within the union.',
    },
    {
      name: 'Noura Ibrahim',
      position: 'Treasurer',
      image: 'https://placehold.co/300x300/023f8a/white?text=Treasurer',
      description:
        "Managing the union's budget and financial activities for student benefit.",
    },
    {
      name: 'Karim Samir',
      position: 'Events Coordinator',
      image: 'https://placehold.co/300x300/02397c/white?text=Events',
      description:
        'Organizing cultural, academic, and social events throughout the academic year.',
    },
    {
      name: 'Layla Mahmoud',
      position: 'Public Relations',
      image: 'https://placehold.co/300x300/ffd700/023f8a?text=PR',
      description:
        'Building relationships with students, faculty, and external organizations.',
    },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
      {/* Header */}

      {/* Main Content - Pushed down to avoid header overlap */}

      {/* Hero Section */}
      <Image
        src='/images/over.png'
        width={1920}
        height={1080}
        alt=''
        priority
        className='hidden'
      />

      <section className="bg-[url('/images/over.png')] bg-cover bg-center bg-no-repeat text-white py-50 relative">
        {/* Optional dark overlay for readability */}
        <div className='absolute inset-0 bg-[#02397c] opacity-70'></div>

        <div className='container mx-auto px-4 text-center relative z-10'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6'>Student Union</h1>
          <h2 className='text-3xl md:text-4xl font-semibold mb-8'>
            Helwan National University
          </h2>
          <p className='text-xl md:text-2xl max-w-4xl mx-auto'>
            Representing student interests, organizing events, and enhancing
            campus life for all students.
          </p>
          <div className='mt-8 flex justify-center'>
            <div className='w-32 h-1 bg-[#ffd700]'></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-[#023f8a] mb-4'>
                About Our Student Union
              </h2>
              <div className='w-24 h-1 bg-[#ffd700] mx-auto mb-6'></div>
              <p className='text-xl text-gray-700 max-w-3xl mx-auto'>
                Learn more about our mission, history, and the work we do to
                support students at Helwan National University.
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <img
                  src='/images/Union.png'
                  alt='Student Union Building'
                  className='rounded-xl shadow-lg w-full h-auto object-cover '
                />
              </div>
              <div>
                <h3 className='text-3xl font-bold text-[#023f8a] mb-6'>
                  Our History & Mission
                </h3>
                <p className='text-lg text-gray-700 mb-6 leading-relaxed'>
                  Our mission is to empower every student by fostering an
                  inclusive, dynamic, and supportive campus community. We are
                  committed to amplifying student voices, advocating for
                  meaningful change, and enriching university life through
                  innovative programs, essential services, and collaborative
                  leadership. Guided by integrity, equity, and student-centered
                  values, we strive to ensure that every student — regardless of
                  background or discipline — feels heard, supported, and
                  inspired to reach their full potential.
                </p>
                {/* <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    We work closely with university administration to advocate for student needs, organize cultural and academic events, and provide support services that enrich the student experience.
                  </p> */}
                <div className='flex flex-wrap gap-4'>
                  {/* <div className="bg-[#023f8a] text-white px-6 py-3 rounded-lg font-semibold">
                      Since 1975
                    </div>
                    <div className="bg-[#ffd700] text-[#023f8a] px-6 py-3 rounded-lg font-semibold">
                      50+ Events Annually
                    </div>
                    <div className="bg-[#02397c] text-white px-6 py-3 rounded-lg font-semibold">
                      15,000+ Students Served
                    </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className='py-20 bg-[#02397c]'>
        <div className='container mx-auto px-4'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-white mb-4'>Who We Are</h2>
              <div className='w-24 h-1 bg-[#ffd700] mx-auto mb-6'></div>
              <p className='text-xl text-gray-200 max-w-3xl mx-auto'>
                Meet the dedicated team of student leaders who work tirelessly
                to represent your interests and enhance your university
                experience.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
              <div className='bg-[#3553b5] bg-opacity-10 p-8 rounded-xl backdrop-blur-sm border border-white/20'>
                <div className='flex items-center mb-6'>
                  <div className='w-16 h-16 bg-[#ffd700] text-[#023f8a] rounded-full flex items-center justify-center mr-4'>
                    <svg
                      className='w-8 h-8'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-white'>
                      Our Purpose
                    </h3>
                    <p className='text-[#ffd700] font-semibold'>
                      Representing Student Voices
                    </p>
                  </div>
                </div>
                <p className='text-gray-200 leading-relaxed'>
                  We serve as the official representative body for all students
                  at Helwan National University. Our primary purpose is to
                  advocate for student rights, address concerns, and ensure that
                  student perspectives are considered in university
                  decision-making processes.
                </p>
              </div>

              <div className='bg-[#3553b5] bg-opacity-10 p-8 rounded-xl backdrop-blur-sm border border-white/20'>
                <div className='flex items-center mb-6'>
                  <div className='w-16 h-16 bg-[#ffd700] text-[#023f8a] rounded-full flex items-center justify-center mr-4'>
                    <svg
                      className='w-8 h-8'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-white'>
                      Our Values
                    </h3>
                    <p className='text-[#ffd700] font-semibold'>
                      Integrity, Service, Excellence
                    </p>
                  </div>
                </div>
                <p className='text-gray-200 leading-relaxed'>
                  We are guided by core values of integrity, service, and
                  excellence. We believe in transparent governance, inclusive
                  representation, and collaborative problem-solving. Our
                  commitment is to serve all students with fairness and
                  dedication.
                </p>
              </div>
            </div>

            <div className='bg-[#3553b5] bg-opacity-5 p-8 rounded-xl backdrop-blur-sm border border-white/20'>
              <h3 className='text-3xl font-bold text-white text-center mb-8'>
                Our Strategic Goals
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div className='text-center'>
                  <div className='w-20 h-20 bg-[#ffd700] text-[#023f8a] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-11 h-11'
                      fill='currentColor'
                      viewBox='2 2 20 20'
                    >
                      <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                  </div>
                  <h4 className='text-xl font-bold text-white mb-3'>
                    Enhance Student Experience
                  </h4>
                  <p className='text-gray-200'>
                    Create engaging programs and services that enrich academic,
                    social, and personal development.
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-20 h-20 bg-[#ffd700] text-[#023f8a] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-10 h-10'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <h4 className='text-xl font-bold text-white mb-3'>
                    Improve Campus Facilities
                  </h4>
                  <p className='text-gray-200'>
                    Advocate for modern, accessible facilities that support
                    learning and student well-being.
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-20 h-20 bg-[#ffd700] text-[#023f8a] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <svg
                      className='w-10 h-10'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <h4 className='text-xl font-bold text-white mb-3'>
                    Foster Community Engagement
                  </h4>
                  <p className='text-gray-200'>
                    Build partnerships with local organizations and create
                    opportunities for civic engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Team Section */}
      <section className='py-20 bg-gradient-to-b from-white to-gray-50'>
        <div className='container mx-auto px-9'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-extrabold text-[#023f8a] mb-4 tracking-tight'>
              Meet Your Student Union Leaders
            </h2>
            <div className='w-32 h-1 bg-[#02397c] mx-auto mb-6 rounded-full'></div>
            <p className='text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'>
              The dream team turning campus ideas into action. Hover to meet the
              faces behind the movement.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-6 md:gap-4 '>
            {[
              {
                name: 'Remah Wael',
                img: '/images/exec/Remah.png',
                desc: 'President — Calling the shots & fighting for your future.',
              },
              {
                name: 'Mostafa Nasser',
                img: '/images/exec/Mostafa.png',
                desc: 'Vice President — Master of ops & campus chaos coordinator.',
              },
              {
                name: 'Bassel Mohamed',
                img: '/images/exec/Bassel.png',
                desc: 'Secretary General — The glue holding it all together.',
              },
              {
                name: 'Roaa Hamdy',
                img: '/images/exec/Roaa.png',
                desc: 'Sports Coordinator — Turning sweat into student glory.',
              },
              {
                name: 'Mai Abdallah',
                img: '/images/exec/mai.png',
                desc: 'Treasurer — Guarding the gold so your events pop off.',
              },
              {
                name: 'Habiba Sami',
                img: '/images/exec/habiba.png',
                desc: 'Events Director — Architect of the best nights on campus.',
              },
              {
                name: 'Mazen Mahmoud',
                img: '/images/exec/Mazen.png',
                desc: 'PR & Outreach — Your voice, amplified across campus.',
              },
              {
                name: 'Habiba Hany',
                img: '/images/exec/Habeba.png',
                desc: 'Academic Affairs — Your grade’s secret weapon.',
              },
              {
                name: 'Youssef Ahmed',
                img: '/images/exec/Youssef.png',
                desc: 'Tech & Media — Making sure you never miss a beat online.',
              },
              {
                name: 'Salma Mowafak',
                img: '/images/exec/Salma.png',
                desc: 'Community Outreach — Linking campus to the real world.',
              },
              {
                name: 'Mounir Mohamed',
                img: '/images/exec/Mounir.png',
                desc: 'Sustainability Lead — Green campus? He’s the reason.',
              },
              {
                name: 'Salma Tarek',
                img: '/images/exec/Salma2.png',
                desc: 'Sustainability Lead — Eco-warrior with a master plan.',
              },
              {
                name: 'Shaza Hady',
                img: '/images/exec/Shaza.png',
                desc: 'Arts & Culture — Turning campus into a creative playground.',
              },
              {
                name: 'Mariam Hassan',
                img: '/images/exec/Mariam.png',
                desc: 'Sustainability Lead — Saving the planet, one event at a time.',
              },
              {
                name: 'Soha Sayed',
                img: '/images/exec/Soha.png',
                desc: 'Sustainability Lead — Zero waste? She’s on it.',
              },
              {
                name: 'Malak Mahmoud',
                img: '/images/exec/Malak.png',
                desc: 'Sustainability Lead — Green goals, student soul.',
              },
            ].map((member, index) => (
              <div
                key={index}
                className='group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-gray-100 hover:border-[#02397c] h-100'
              >
                {/* Full Image */}
                <img
                  src={member.img}
                  alt={member.name}
                  className='w-full h-110 object-cover transition-transform duration-500 group-hover:scale-106'
                />

                {/* Hover Overlay — Name + Desc */}
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 pointer-events-none'>
                  <h3 className='text-xl md:text-2xl font-bold mb-2 drop-shadow-md text-center'>
                    {member.name}
                  </h3>
                  <p className='text-center text-sm md:text-base font-medium leading-relaxed max-w-xs text-gray-100'>
                    {member.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
