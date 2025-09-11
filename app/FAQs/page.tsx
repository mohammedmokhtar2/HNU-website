// 'use client' ;
// import { useState } from 'react';

// // Define types for our FAQ data structure
// interface Translation {
//   ar: string;
//   en: string;
// }

// interface FAQItem {
//   question: Translation;
//   answer: Translation;
// }

// interface FAQCategory {
//   id: string;
//   title: Translation;
//   icon: string;
//   items: FAQItem[];
// }

// // This component represents only the FAQ Categories section
// const FAQSection = () => {
//   const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar'>('en');
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);

//   // Color palette extracted from the provided image
//   const colors = {
//     primary: '#003897', // Deep blue from logo and header
//     secondary: '#0052B4', // Slightly lighter blue
//     accent: '#FF6F00', // Orange from logo elements
//     background: '#F8FAFC', // Light gray/white background
//     text: '#1A1A1A',
//     textSecondary: '#4A5568',
//     cardBackground: '#FFFFFF',
//     border: '#E2E8F0',
//     hover: '#0052B4',
//   };

//   const faqs: FAQCategory[] = [
//     {
//       id: 'admissions',
//       title: {
//         ar: 'القبول والتقديم',
//         en: 'Admissions & Applications',
//       },
//       icon: '📚',
//       items: [
//         {
//           question: {
//             ar: 'ما هي متطلبات القبول للطلاب الدوليين؟',
//             en: 'What are the admission requirements for international students?',
//           },
//           answer: {
//             ar: 'يجب على الطلاب الدوليين تقديم شهادات الثانوية العامة، وإثبات الكفاءة في اللغة الإنجليزية (TOEFL/IELTS)، ونسخة من جواز السفر، وإكمال نموذج التقديم الإلكتروني. قد تختلف المتطلبات الإضافية حسب التخصص.',
//             en: 'International students need to submit their high school transcripts, proof of English proficiency (TOEFL/IELTS), passport copy, and complete the online application form. Additional requirements may vary by program.',
//           },
//         },
//         {
//           question: {
//             ar: 'متى يبدأ فترة التقديم للعام الدراسي القادم؟',
//             en: 'When does the application period open for the next academic year?',
//           },
//           answer: {
//             ar: 'تبدأ عمليات التقديم عادةً في يناير للالفصل الدراسي الخريف، وفي سبتمبر للالفصل الدراسي الربيع. يُشجع على التقديم المبكر لأن بعض البرامج لها سعة محدودة.',
//             en: 'Applications typically open in January for the Fall semester and in September for the Spring semester. Early applications are encouraged as some programs have limited capacity.',
//           },
//         },
//         {
//           question: {
//             ar: 'ما هي المستندات التي يجب إرسالها مع طلب التقديم؟',
//             en: 'What documents do I need to submit with my application?',
//           },
//           answer: {
//             ar: 'المستندات المطلوبة تشمل: نموذج التقديم المكتمل، الشهادات الرسمية، خطابات التوصية، البيان الشخصي، السيرة الذاتية/السيرة المهنية، ورسوم التقديم. تتغير المتطلبات الدقيقة حسب البرنامج.',
//             en: 'Required documents include: completed application form, official transcripts, letters of recommendation, personal statement, resume/CV, and application fee. Specific requirements vary by program.',
//           },
//         },
//         {
//           question: {
//             ar: 'هل هناك رسوم لتقديم الطلب؟ وما مبلغها؟',
//             en: 'Is there an application fee and how much is it?',
//           },
//           answer: {
//             ar: 'نعم، هناك رسوم غير قابلة للإرجاع بقيمة 500 جنيه مصري للطلاب المصريين و50 دولارًا أمريكيًا للطلاب الدوليين. تغطي هذه الرسوم تكلفة معالجة طلب التقديم.',
//             en: 'Yes, there is a non-refundable application fee of EGP 500 for Egyptian students and $50 USD for international students. This fee covers the cost of processing your application.',
//           },
//         },
//       ],
//     },
//     {
//       id: 'academics',
//       title: {
//         ar: 'الأكاديميات',
//         en: 'Academics',
//       },
//       icon: '🎓',
//       items: [
//         {
//           question: {
//             ar: 'ما هي البرامج الجامعية التي تقدمها؟',
//             en: 'What undergraduate programs do you offer?',
//           },
//           answer: {
//             ar: 'نحن نقدم برامج في الهندسة وإدارة الأعمال والقانون والطب والصيدلة وتكنولوجيا العلوم الصحية التطبيقية وعلوم الحاسوب. تم تصميم كل برنامج لتلبية معايير الصناعة وتوفير خبرة عملية.',
//             en: 'We offer programs in Engineering, Business Administration, Law, Medicine, Pharmacy, Applied Health Sciences Technology, and Computer Science. Each program is designed to meet industry standards and provide practical experience.',
//           },
//         },
//         {
//           question: {
//             ar: 'هل يمكنني تحويل الساعات المعتمدة من جامعة أخرى؟',
//             en: 'Can I transfer credits from another university?',
//           },
//           answer: {
//             ar: 'نعم، نقبل تحويل الساعات المعتمدة من مؤسسات معتمدة. يمكنك تحويل ما يصل إلى 60 ساعة معتمدة (ما يعادل سنتين) لبرامج البكالوريوس. يتطلب الأمر تقييم الدورات الدراسية السابقة الخاصة بك.',
//             en: 'Yes, we accept transfer credits from accredited institutions. You can transfer up to 60 credits (equivalent to 2 years) for undergraduate programs. An evaluation of your previous coursework is required.',
//           },
//         },
//       ],
//     },
//     {
//       id: 'financial',
//       title: {
//         ar: 'المساعدات المالية',
//         en: 'Financial Aid',
//       },
//       icon: '💰',
//       items: [
//         {
//           question: {
//             ar: 'ما هي المنح الدراسية المتاحة للطلاب؟',
//             en: 'What scholarships are available for students?',
//           },
//           answer: {
//             ar: 'نحن نقدم منحًا دراسية قائمة على الجدارة، ومساعدات مالية قائمة على الحاجة، ومنحًا دراسية رياضية، وجوائز تفوق أكاديمي. قد يكون الطلاب الدوليون مؤهلين أيضًا لبرامج منح دراسية محددة.',
//             en: 'We offer merit-based scholarships, need-based financial aid, sports scholarships, and academic excellence awards. International students may also be eligible for specific scholarship programs.',
//           },
//         },
//         {
//           question: {
//             ar: 'كيف يمكنني التقدم للحصول على المساعدة المالية؟',
//             en: 'How can I apply for financial aid?',
//           },
//           answer: {
//             ar: 'تُقدَّم طلبات المساعدة المالية من خلال بوابتنا الإلكترونية. ستحتاج إلى تقديم مستندات مالية، وإكمال نموذج FAFSA المعادل، وتقديم أي مواد إضافية مطلوبة بحلول الموعد النهائي المحدد.',
//             en: "Financial aid applications are submitted through our online portal. You'll need to provide financial documentation, complete the FAFSA equivalent form, and submit any additional required materials by the specified deadline.",
//           },
//         },
//       ],
//     },
//     {
//       id: 'campus',
//       title: {
//         ar: 'حياة الحرم الجامعي والمرافق',
//         en: 'Campus Life & Facilities',
//       },
//       icon: '🏫',
//       items: [
//         {
//           question: {
//             ar: 'ما هي الخيارات السكنية المتاحة للطلاب؟',
//             en: 'What housing options are available for students?',
//           },
//           answer: {
//             ar: 'نحن نوفر أماكن إقامة داخل الحرم الجامعي للطلاب الذكور والإناث، بالإضافة إلى المساعدة في العثور على سكن خارج الحرم. يشمل السكن الداخلي خطط وجبات وحراسة على مدار الساعة.',
//             en: 'We offer on-campus dormitories for both male and female students, as well as assistance with finding off-campus housing. On-campus housing includes meal plans and 24/7 security.',
//           },
//         },
//         {
//           question: {
//             ar: 'ما هي المرافق الرياضية والتجميلية التي تتوفر في الحرم الجامعي؟',
//             en: 'What sports and recreational facilities do you have?',
//           },
//           answer: {
//             ar: 'يتميز الحرم الجامعي بمركز رياضي حديث يحتوي على مرافق داخلية وخارجية، بما في ذلك صالة رياضية، حمام سباحة، ملعب كرة قدم، ملاعب كرة سلة، ملاعب تنس، ومركز لياقة بدنية. كما أن لدينا العديد من الأندية والمنظمات الطلابية.',
//             en: 'Our campus features a modern sports complex with indoor and outdoor facilities including a gym, swimming pool, football field, basketball courts, tennis courts, and fitness center. We also have various student clubs and organizations.',
//           },
//         },
//         {
//           question: {
//             ar: 'هل هناك مطاعم داخل الحرم الجامعي؟',
//             en: 'Is there on-campus dining available?',
//           },
//           answer: {
//             ar: 'نعم، لدينا عدة خيارات تناول الطعام تشمل مقهى رئيسي، محلات قهوة، ومحال طعام. نقدم خطط وجبات متنوعة ونراعي القيود الغذائية. كما يوجد عدد من المطاعم والمقاهي بالقرب من الحرم.',
//             en: 'Yes, we have multiple dining options including a main cafeteria, coffee shops, and food courts. We offer various meal plans and accommodate dietary restrictions. The campus also has several restaurants and cafes nearby.',
//           },
//         },
//         {
//           question: {
//             ar: 'ما هي خيارات النقل المتاحة للذهاب والإياب من الحرم الجامعي؟',
//             en: 'What transportation options are available to and from campus?',
//           },
//           answer: {
//             ar: 'يتمتع الحرم الجامعي باتصال جيد بالمواصلات العامة، بما في ذلك الحافلات والمترو. كما نوفر خدمات حافلات نقل إلى المناطق المجاورة، ونقدم بطاقات تنقل عامة بأسعار مخفضة للطلاب.',
//             en: 'The campus is well-connected with public transportation including buses and metro. We also provide shuttle services to nearby areas and offer discounted public transportation passes for students.',
//           },
//         },
//       ],
//     },
//     {
//       id: 'career',
//       title: {
//         ar: 'خدمات الوظائف والتدريبات',
//         en: 'Career Services & Internships',
//       },
//       icon: '💼',
//       items: [
//         {
//           question: {
//             ar: 'ما الخدمات الوظيفية التي تقدمونها؟',
//             en: 'What career services do you provide?',
//           },
//           answer: {
//             ar: 'مركزنا المهني يقدم المساعدة في كتابة السيرة الذاتية، التحضير للمقابلات، الاستشارات المهنية، المعارض الوظيفية، الفعاليات التفاعلية، ووصول إلى لوحة إعلانات الوظائف. كما نقدم ورش عمل حول التنمية المهنية.',
//             en: 'Our career center offers resume writing assistance, interview preparation, career counseling, job fairs, networking events, and access to job boards. We also provide workshops on professional development.',
//           },
//         },
//         {
//           question: {
//             ar: 'هل تساعدون الطلاب في العثور على تدريبات؟',
//             en: 'Do you help students find internships?',
//           },
//           answer: {
//             ar: 'نعم، لدينا شراكات مع أكثر من 200 شركة ومؤسسة. يساعد مركزنا المهني الطلاب في العثور على تدريبات، فرص العمل التعاوني، والوظائف الجزئية المتعلقة بمنطقهم الأكاديمي.',
//             en: 'Yes, we have partnerships with over 200 companies and organizations. Our career center actively helps students find internships, co-op opportunities, and part-time jobs related to their field of study.',
//           },
//         },
//         {
//           question: {
//             ar: 'ما هو معدل التوظيف للخريجين؟',
//             en: 'What is the employment rate for graduates?',
//           },
//           answer: {
//             ar: 'معدل التوظيف للخريجين هو 95% خلال ستة أشهر من التخرج. نحافظ على علاقات قوية مع أصحاب العمل ونقوم بتعقب نتائج الخريجين بشكل دوري لضمان أن برامجنا تلبي احتياجات الصناعة.',
//             en: 'Our graduate employment rate is 95% within 6 months of graduation. We maintain strong relationships with employers and regularly track graduate outcomes to ensure our programs meet industry needs.',
//           },
//         },
//         {
//           question: {
//             ar: 'هل تقدمون فرص للتواصل مع الخريجين؟',
//             en: 'Do you offer alumni networking opportunities?',
//           },
//           answer: {
//             ar: 'نعم، لدينا شبكة خريجين نشطة تضم أكثر من 50,000 عضو في جميع أنحاء العالم. ننظم فعاليات تواصل دورية، وبرامج توجيه، ونقدم وصولًا إلى دليل الخريجين للاتصال المهني.',
//             en: 'Yes, we have an active alumni network with over 50,000 members worldwide. We host regular networking events, mentorship programs, and provide access to our alumni directory for professional connections.',
//           },
//         },
//       ],
//     },
//   ];

//   const toggleLanguage = () => {
//     setSelectedLanguage(selectedLanguage === 'en' ? 'ar' : 'en');
//   };

//   const getTranslation = (obj: Translation): string => {
//     return obj[selectedLanguage];
//   };

//   return (
//     <div
//       className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4'
//       dir={selectedLanguage === 'ar' ? 'rtl' : 'ltr'}
//     >
//       {/* Language Toggle */}
//       <div className='flex justify-end mb-8'>
//         <button
//           onClick={toggleLanguage}
//           className='text-sm font-medium text-blue-900 hover:text-blue-700 transition-colors px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100'
//         >
//           {selectedLanguage === 'en' ? 'العربية' : 'English'}
//         </button>
//       </div>

//       {/* Header */}
//       <div className='text-center mb-12'>
//         <h1 className='text-4xl md:text-5xl font-bold text-blue-900 mb-4'>
//           Frequently Asked Questions
//         </h1>
//         <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
//           Find answers to the most common questions about Helwan National
//           University
//         </p>
//       </div>

//       {/* FAQ Categories Section */}
//       <div className='max-w-7xl mx-auto'>
//         <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
//           {/* Category List - Sidebar */}
//           <div className='lg:col-span-1'>
//             <div className='sticky top-8 space-y-3'>
//               <h3 className='text-xl font-bold text-blue-900 mb-4 flex items-center'>
//                 <svg
//                   className='w-5 h-5 mr-2'
//                   fill='currentColor'
//                   viewBox='0 0 24 24'
//                 >
//                   <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
//                 </svg>
//                 Browse Categories
//               </h3>

//               {faqs.map(category => (
//                 <button
//                   key={category.id}
//                   onClick={() =>
//                     setActiveCategory(
//                       activeCategory === category.id ? null : category.id
//                     )
//                   }
//                   className={`w-full text-left p-5 rounded-2xl transition-all duration-300 ease-out flex items-center space-x-4 group ${
//                     activeCategory === category.id
//                       ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-xl scale-105 transform'
//                       : 'bg-white hover:bg-blue-50 border border-gray-200 hover:shadow-lg hover:border-blue-200'
//                   }`}
//                 >
//                   <span className='text-3xl'>{category.icon}</span>
//                   <div>
//                     <span
//                       className={`font-semibold block ${activeCategory === category.id ? 'text-white' : 'text-gray-800'}`}
//                     >
//                       {getTranslation(category.title)}
//                     </span>
//                     <span
//                       className={`text-sm ${activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'}`}
//                     >
//                       {category.items.length} questions
//                     </span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className='lg:col-span-2'>
//             {activeCategory ? (
//               <div className='bg-white rounded-2xl shadow-xl p-8 border border-gray-100'>
//                 <div className='flex items-center justify-between mb-8'>
//                   <div className='flex items-center space-x-3'>
//                     <span className='text-3xl'>
//                       {faqs.find(c => c.id === activeCategory)?.icon}
//                     </span>
//                     <h2 className='text-2xl font-bold text-blue-900'>
//                       {/* {getTranslation(faqs.find(c => c.id === activeCategory)?.title)} */}
//                       {getTranslation(
//                         faqs.find(c => c.id === activeCategory)?.title ?? {
//                           ar: '',
//                           en: '',
//                         }
//                       )}
//                     </h2>
//                   </div>
//                   <span className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
//                     {faqs.find(c => c.id === activeCategory)?.items.length}{' '}
//                     questions
//                   </span>
//                 </div>

//                 <div className='space-y-6'>
//                   {faqs
//                     .find(c => c.id === activeCategory)
//                     ?.items.map((item, index) => (
//                       <div
//                         key={index}
//                         className='p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border-l-4 border-blue-900 hover:shadow-md transition-all duration-200'
//                       >
//                         <h4 className='text-lg font-semibold text-gray-800 mb-3 leading-relaxed'>
//                           {getTranslation(item.question)}
//                         </h4>
//                         <p className='text-gray-600 leading-relaxed'>
//                           {getTranslation(item.answer)}
//                         </p>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             ) : (
//               <div className='bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center'>
//                 <div className='text-6xl mb-4'>❓</div>
//                 <h3 className='text-xl font-semibold text-gray-800 mb-4'>
//                   Select a category to view questions
//                 </h3>
//                 <p className='text-gray-500'>
//                   Choose one of the categories from the sidebar to see the
//                   frequently asked questions and their answers.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FAQSection;
