'use client';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { PageSection } from '@/types/pageSections';
import type { StudentUnionsContent } from '@/types/pageSections';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // If you use next/link

interface StudentUnionsSectionProps {
  section: PageSection;
  locale: 'ar' | 'en';
  getLocalizedContent: (content: any) => string;
}

export function StudentUnionsSection({
  section,
  locale,
  getLocalizedContent,
}: StudentUnionsSectionProps) {
  const content = section.content as StudentUnionsContent;

  if (!content) {
    return (
      <div className='min-h-[400px] bg-gray-100 flex items-center justify-center'>
        <p className='text-gray-500'>Content not available</p>
      </div>
    );
  }

  const heroTitle = getLocalizedContent(content.heroSection.title);
  const heroLogo = content.heroSection.logo;
  const heroBg = content.heroSection.bgImageUrl;

  const aboutTitle = getLocalizedContent(content.aboutSection.title);
  const aboutImage = content.aboutSection.imageUrl;
  const aboutDescription = getLocalizedContent(
    content.aboutSection.description
  );

  const missionTitle = getLocalizedContent(content.ourMissionSection.title);
  const missionDescription = getLocalizedContent(
    content.ourMissionSection.description
  );
  const missionImage = content.ourMissionSection.imageUrl;

  const contactTitle = getLocalizedContent(content.contactUsSection.title);
  const socialButtons = content.contactUsSection.socialMediaButtons || [];

  // this is new form line 50 to 58
  const teamTitle = getLocalizedContent(content.ourTeamSection.title);
  const teamNames = content.ourTeamSection.name.map(n =>
    getLocalizedContent(n)
  );
  const teamRoles = content.ourTeamSection.role.map(r =>
    getLocalizedContent(r)
  );
  const teamPhotos = content.ourTeamSection.photo;
  // here

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
          <div className='absolute inset-0 bg-[#02397c] opacity-70'></div>
        </div>
        <div className='relative z-10 space-y-6 text-white max-w-4xl px-6'>
          {heroLogo && (
            <div className='mx-auto w-30 h-30 lg:w-32 lg:h-32 relative'>
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
              <div className='absolute inset-0 bg-gradient-to-r from-[#063574]/80 to-[#035683]/80 flex flex-col justify-center items-center p-6 rounded-xl'>
                <h3 className='text-3xl font-bold text-white mb-4 text-center'>
                  {missionTitle}
                </h3>
                <p className='text-md text-white/90 mb-6 leading-relaxed text-center'>
                  {missionDescription}
                </p>
                <a
                  href='#'
                  className='bg-gradient-to-r from-[#077599] to-[#01778f] text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
                >
                  {locale === 'ar' ? 'المزيد' : 'Learn More'}
                </a>
              </div>
            )}
          </motion.div>

          {!isMobile && (
            <motion.div
              className={`w-[700px] h-[350px] p-6 bg-gradient-to-r from-[#162e51] to-[#1954a6]/60 rounded-xl shadow-lg flex flex-col justify-center ${
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
                className='bg-gradient-to-r from-[#074199] to-[#396ca7] w-50 text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
              >
                {locale === 'ar' ? 'المزيد' : 'Learn More'}
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* === SECTION 4: CONTACT US (Reduced height, blue background, title, buttons, learn more) === */}
      <section
        className='mt-16 min-h-[300px] w-full flex flex-col items-center justify-center text-white px-6 lg:px-24 bg-blue-900'
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
            className='inline-block bg-gradient-to-r from-[#077599] to-[#01778f] text-white font-semibold px-6 py-2 rounded shadow-md hover:scale-105 transition-transform duration-300'
          >
            {locale === 'ar' ? 'المزيد' : 'Learn More'}
          </a>
        </div>
      </section>
    </>
  );
}
