'use client';

import type { ForEgyptGroupContent } from '@/types/pageSections';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { PageSection } from '@/types/pageSections';
import type { StudentUnionsContent } from '@/types/pageSections';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ForEgyptSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function ForEgyptGroupSection({
  section,
  locale,
  getLocalizedContent,
}: ForEgyptSectionProps) {
  const content = section.content as ForEgyptGroupContent;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  // === HERO SECTION ===
  const heroTitle = getLocalizedContent(content?.heroSection?.title);
  const heroLogo = content?.heroSection?.logo || '';
  const heroBg = content?.heroSection?.bgImageUrl || '';

  // === ABOUT SECTION ===
  const aboutTitle = getLocalizedContent(content?.aboutSection?.title);
  const aboutImage = content?.aboutSection?.imageUrl || '';
  const aboutDescription = getLocalizedContent(
    content?.aboutSection?.description
  );

  // === MISSION SECTION ===
  const missionTitle = getLocalizedContent(content?.ourMissionSection?.title);
  const missionDescription = getLocalizedContent(
    content?.ourMissionSection?.description
  );
  const missionImage = content?.ourMissionSection?.imageUrl || '';

  // === CONTACT SECTION ===
  const contactTitle = getLocalizedContent(content?.contactUsSection?.title);
  const socialButtons = content?.contactUsSection?.socialMediaButtons || [];

  //  ourTeamSection: {
  //   title: BaseContent;
  //   name: BaseContent[];
  //   role: BaseContent[];
  //   photo: string[];
  // };

  // === OURTEAM SECTION ===
  const teamTitle = getLocalizedContent(content?.ourTeamSection?.title || '');
  const teamMembers = content?.ourTeamSection?.members || [];

  const teamData = teamMembers.map((member: any) => ({
    name: getLocalizedContent(member?.name || ''),
    role: getLocalizedContent(member?.role || ''),
    photo: member?.photo || '',
  }));

  console.log('Team Title:', teamTitle);
  console.log('Team Members:', teamMembers);
  console.log('Team Data:', teamData);

  // Define the socialIcons array to match the order of socialButtons
  const socialIcons = [FaFacebookF, FaInstagram, FaTiktok];

  const isMobile =
    typeof window !== 'undefined' ? window.innerWidth < 1024 : false;

  return (
    <>
      {/* === SECTION 1: HERO (Full viewport height) === */}
      <section className='relative min-h-screen w-full flex items-center justify-center text-center'>
        <div className='absolute inset-0 overflow-hidden'>
          <Image
            src={heroBg}
            alt='Hero Background'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-[#3f3013] opacity-70'></div>
        </div>
        <div className='relative z-10 space-y-6 text-white max-w-4xl px-6'>
          {heroLogo && (
            <div className='mx-auto w-40 h-40 lg:w-32 lg:h-32 relative'>
              <Image
                src={heroLogo}
                alt='Student Union Logo'
                fill
                className='object-contain rounded-full'
              />
            </div>
          )}
          {heroTitle && (
            <h1 className='text-3xl md:text-5xl font-bold leading-tight px-4'>
              {heroTitle}
            </h1>
          )}
        </div>
      </section>

      {/* === SECTION 2: ABOUT (Now full height + centered) === */}
      <section
        className='min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-r from-[#ffffff] to-[#ffffff] text-black  '
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Left: Text Content */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center px-6 lg:px-16 py-12 lg:py-0'>
          <div className='max-w-xl space-y-5'>
            {aboutTitle && (
              <h2 className='text-3xl md:text-4xl font-extrabold'>
                {aboutTitle}
              </h2>
            )}
            {aboutDescription && (
              <p className='text-lg leading-relaxed opacity-95'>
                {aboutDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right: Full-Height Image */}
        {aboutImage && (
          <div className='w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen'>
            <Image
              src={aboutImage}
              alt='About Student Union'
              fill
              className='object-cover'
            />
          </div>
        )}
      </section>

      {/* === SECTION 3: OUR MISSION (Full height, layout preserved) === */}
      <section className='min-h-screen w-full flex items-center justify-center px-4 md:px-8'>
        <div
          className={`relative max-w-[1400px] w-full ${
            isMobile
              ? 'flex flex-col items-center gap-8'
              : 'flex flex-row justify-center items-center gap-8'
          }`}
        >
          <motion.div
            className={`${
              isMobile
                ? 'w-full h-[400px] relative'
                : `w-[1000px] h-[500px] rounded-xl overflow-hidden shadow-xl relative z-0 ${
                    locale === 'ar' ? 'mr-90' : 'ml-90'
                  }`
            }`}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{
              opacity: 1,
              x: isMobile ? 0 : locale === 'ar' ? -200 : 200,
            }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src={missionImage}
              alt='Our Mission'
              width={700}
              height={500}
              className={`w-full h-full object-cover rounded-xl ${
                isMobile ? 'filter blur-[2px]' : ''
              }`}
            />

            {isMobile && (
              <div className='absolute inset-0 bg-gradient-to-r from-[#3f3013]/80 to-[#c7ab65]/80 flex flex-col justify-center items-center p-6 rounded-xl'>
                <h3 className='text-3xl font-bold text-white mb-4 text-center'>
                  {missionTitle}
                </h3>
                <p className='text-md text-white/90 mb-6 leading-relaxed text-center'>
                  {missionDescription}
                </p>
                <a
                  href='#'
                  className='bg-gradient-to-r from-[#3f3013] to-[#c7ab65] text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
                >
                  {locale === 'ar' ? 'المزيد' : 'Learn More'}
                </a>
              </div>
            )}
          </motion.div>

          {!isMobile && (
            <motion.div
              className={`w-[700px] h-[350px] p-6 bg-gradient-to-r from-[#3f3013] to-[#c7ab65]/60 rounded-xl shadow-lg flex flex-col justify-center ${
                locale === 'ar' ? 'text-right rtl right-10' : 'text-left left-5'
              } z-10 absolute top-1/2 transform -translate-y-1/2`}
              initial={{ opacity: 0, x: locale === 'ar' ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className='text-3xl font-bold text-white mb-4 break-words'>
                {missionTitle}
              </h3>
              <p className='text-md text-white/90 mb-6 leading-relaxed break-words'>
                {missionDescription}
              </p>
              <a
                href='#'
                className='bg-gradient-to-r from-[#3f3013] to-[#c7ab65] w-50 text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
              >
                {locale === 'ar' ? 'المزيد' : 'Learn More'}
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* === SECTION 4: OUR TEAM === */}
      <section
        className='w-full py-16 px-6 lg:px-16 bg-gradient-to-b from-gray-50 to-white'
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className='max-w-6xl mx-auto'>
          {teamTitle && (
            <h2 className='text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-800'>
              {teamTitle}
            </h2>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
            {teamData.length > 0 ? (
              teamData.map(
                (
                  member: { name: string; role: string; photo: string },
                  index: number
                ) => (
                  <motion.div
                    key={index}
                    className='bg-white rounded-xl shadow-lg overflow-hidden flex flex-col items-center text-center p-6'
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {member.photo ? (
                      <div className='w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-100'>
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={128}
                          height={128}
                          className='object-cover w-full h-full'
                        />
                      </div>
                    ) : (
                      <div className='w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center'>
                        <span className='text-gray-500 text-lg'>?</span>
                      </div>
                    )}
                    <h3 className='text-xl font-bold text-gray-800'>
                      {member.name}
                    </h3>
                    <p className='text-blue-600 mt-1'>{member.role}</p>
                  </motion.div>
                )
              )
            ) : (
              <p className='col-span-full text-center text-gray-500'>
                {locale === 'ar'
                  ? 'لم يتم إضافة أعضاء للفريق بعد'
                  : 'No team members available yet'}
              </p>
            )}
          </div>
        </div>
      </section>
      
      {/* === SECTION 4: CONTACT US (Reduced height, blue background, title, buttons, learn more) === */}
      <section
        className='mt-16 min-h-[300px] w-full flex flex-col items-center justify-center text-white px-6 lg:px-24 bg-[#3f3013]'
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className='relative z-10 max-w-3xl text-center space-y-8'>
          {contactTitle && (
            <h2 className='text-3xl md:text-4xl font-bold'>{contactTitle}</h2>
          )}
          <div className='flex justify-center space-x-4 rtl:space-x-reverse mb-6'>
            {socialButtons.slice(0, 3).map((btn, idx) => {
              const Icon = socialIcons[idx];
              const url = btn.url;
              return (
                <Button key={idx} asChild variant='link'>
                  <Link
                    href={url}
                    className='w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors font-bold'
                    {...(url.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    aria-label={getLocalizedContent(btn.text)}
                  >
                    <Icon size={24} />
                  </Link>
                </Button>
              );
            })}
          </div>
          <a
            href='#'
            className='inline-block bg-gradient-to-r from-[#c7ab65] to-[#c7ab65] text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
          >
            {locale === 'ar' ? 'المزيد' : 'Learn More'}
          </a>
        </div>
      </section>
    </>
  );
}
