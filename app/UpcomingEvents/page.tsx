// 'use client' ;
// import React, { useState, useEffect } from 'react';

// type Translation = {
//   en: string;
//   ar: string;
// };

// type EventType = {
//   id: number;
//   title: Translation;
//   date: string;
//   time: Translation;
//   location: Translation;
//   description: Translation;
//   category: Translation;
//   image: string;
// };

// const upcomingEvents: EventType[] = [
//   {
//     id: 1,
//     title: {
//       en: 'International Conference on Advanced Materials',
//       ar: 'المؤتمر الدولي حول المواد المتقدمة',
//     },
//     date: '2024-03-15',
//     time: {
//       en: '9:00 AM - 5:00 PM',
//       ar: '9:00 صباحاً - 5:00 مساءً',
//     },
//     location: {
//       en: 'Main Auditorium, HNU Campus',
//       ar: 'القاعة الرئيسية، حرم جامعة حلوان',
//     },
//     description: {
//       en: 'Join us for a comprehensive conference featuring leading experts in materials science and engineering. Explore the latest research and innovations in advanced materials.',
//       ar: 'انضم إلينا في مؤتمر شامل يضم خبراء بارزين في علوم وهندسة المواد. استكشف أحدث الأبحاث والابتكارات في المواد المتقدمة.',
//     },
//     category: {
//       en: 'Academic',
//       ar: 'أكاديمي',
//     },
//     image:
//       'https://placehold.co/600x400/0066cc/ffffff?text=Materials+Conference',
//   },
//   {
//     id: 2,
//     title: {
//       en: 'Student Innovation Challenge 2024',
//       ar: 'تحدي الابتكار للطلاب 2024',
//     },
//     date: '2024-03-20',
//     time: {
//       en: '8:00 AM - 6:00 PM',
//       ar: '8:00 صباحاً - 6:00 مساءً',
//     },
//     location: {
//       en: 'Engineering Building, Room 301',
//       ar: 'مبنى الهندسة، الغرفة 301',
//     },
//     description: {
//       en: 'Showcase your innovative ideas and projects in this annual competition. Cash prizes and recognition await the most creative solutions.',
//       ar: 'عرض أفكارك ومشاريعك المبتكرة في هذه المسابقة السنوية. تنتظر الجوائز النقدية والتقدير لأكثر الحلول إبداعًا.',
//     },
//     category: {
//       en: 'Competition',
//       ar: 'مسابقة',
//     },
//     image:
//       'https://placehold.co/600x400/0066cc/ffffff?text=Innovation+Challenge',
//   },
//   {
//     id: 3,
//     title: {
//       en: 'Workshop on AI and Machine Learning',
//       ar: 'ورشة عمل حول الذكاء الاصطناعي والتعلم الآلي',
//     },
//     date: '2024-03-25',
//     time: {
//       en: '10:00 AM - 4:00 PM',
//       ar: '10:00 صباحاً - 4:00 مساءً',
//     },
//     location: {
//       en: 'Computer Science Lab, Building B',
//       ar: 'مختبر علوم الحاسوب، المبنى ب',
//     },
//     description: {
//       en: 'Hands-on workshop covering the fundamentals of artificial intelligence and machine learning with practical applications and coding exercises.',
//       ar: 'ورشة عمل عملية تغطي أساسيات الذكاء الاصطناعي والتعلم الآلي مع تطبيقات عملية وتمارين برمجة.',
//     },
//     category: {
//       en: 'Workshop',
//       ar: 'ورشة عمل',
//     },
//     image: 'https://placehold.co/600x400/0066cc/ffffff?text=AI+Workshop',
//   },
//   {
//     id: 4,
//     title: {
//       en: 'Career Fair & Networking Event',
//       ar: 'معرض وظائف وفعالية تواصل',
//     },
//     date: '2024-03-30',
//     time: {
//       en: '11:00 AM - 7:00 PM',
//       ar: '11:00 صباحاً - 7:00 مساءً',
//     },
//     location: {
//       en: 'University Hall, Main Campus',
//       ar: 'قاعة الجامعة، الحرم الرئيسي',
//     },
//     description: {
//       en: 'Connect with top employers, explore career opportunities, and network with professionals from various industries. Free resume review sessions available.',
//       ar: 'تواصل مع أصحاب العمل الرئيسيين، واستكشف فرص العمل، وقم بالشبكة مع المهنيين من مختلف الصناعات. جلسات مراجعة السيرة الذاتية المجانية متاحة.',
//     },
//     category: {
//       en: 'Career',
//       ar: 'وظيفي',
//     },
//     image: 'https://placehold.co/600x400/0066cc/ffffff?text=Career+Fair',
//   },
// ];

// const App: React.FC = () => {
//   const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
//   const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
//   const [previewEvent, setPreviewEvent] = useState<EventType | null>(null);

//   const toggleLanguage = () => {
//     setCurrentLanguage(currentLanguage === 'en' ? 'ar' : 'en');
//   };

//   const handleEventClick = (event: EventType) => {
//     setPreviewEvent(event);
//   };

//   const openModal = (event: EventType) => {
//     setSelectedEvent(event);
//   };

//   const closeModal = () => {
//     setSelectedEvent(null);
//   };

//   // Set the first event as preview on initial load
//   useEffect(() => {
//     if (upcomingEvents.length > 0 && !previewEvent) {
//       setPreviewEvent(upcomingEvents[0]);
//     }
//   }, [previewEvent]);

//   // Color scheme based on HNU branding
//   // const primaryColor = '#0066cc'; // Blue from the logo
//   // const accentColor = '#ff9900'; // Orange for highlights

//   return (
//     <div className='min-h-screen bg-gray-50'>
//       {/* Language Toggle Button */}
//       <div className='flex justify-end p-4'>
//         <button
//           onClick={toggleLanguage}
//           className='bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center space-x-2'
//         >
//           <span>{currentLanguage === 'en' ? 'العربية' : 'English'}</span>
//           <svg
//             className='w-5 h-5'
//             fill='none'
//             stroke='currentColor'
//             viewBox='0 0 24 24'
//           >
//             <path
//               strokeLinecap='round'
//               strokeLinejoin='round'
//               strokeWidth={2}
//               d='M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129'
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Top Upcoming Events Section */}
//       <section className='py-12'>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//           <div className='text-center mb-12'>
//             <h2 className='text-3xl md:text-4xl font-bold text-blue-800 mb-4'>
//               {currentLanguage === 'en'
//                 ? 'Top Upcoming Events'
//                 : 'أهم الفعاليات القادمة'}
//             </h2>
//             <p className='text-gray-600 text-lg max-w-3xl mx-auto'>
//               {currentLanguage === 'en'
//                 ? 'Stay updated with the most important academic, cultural, and professional events happening at Helwan National University.'
//                 : 'ابق على اطلاع بأهم الفعاليات الأكاديمية والثقافية والمهنية التي تحدث في جامعة حلوان الوطنية.'}
//             </p>
//           </div>

//           {/* Event Preview Section */}
//           {previewEvent && (
//             <div className='mb-12 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300'>
//               <div className='relative'>
//                 <img
//                   src={previewEvent.image}
//                   alt={previewEvent.title[currentLanguage]}
//                   className='w-full h-80 md:h-96 object-cover'
//                 />
//                 <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent'></div>

//                 <div className='absolute bottom-0 left-0 right-0 p-8'>
//                   <div className='flex items-center mb-4'>
//                     <span className='bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full'>
//                       {previewEvent.category[currentLanguage]}
//                     </span>
//                   </div>

//                   <h3 className='text-2xl md:text-3xl font-bold text-white mb-4'>
//                     {previewEvent.title[currentLanguage]}
//                   </h3>

//                   <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
//                     <div className='flex items-center text-white'>
//                       <svg
//                         className='w-5 h-5 mr-2'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       <span>{previewEvent.date}</span>
//                     </div>

//                     <div className='flex items-center text-white'>
//                       <svg
//                         className='w-5 h-5 mr-2'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       <span>{previewEvent.location[currentLanguage]}</span>
//                     </div>

//                     <div className='flex items-center text-white'>
//                       <svg
//                         className='w-5 h-5 mr-2'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       <span>{previewEvent.time[currentLanguage]}</span>
//                     </div>
//                   </div>

//                   <div className='flex flex-col sm:flex-row gap-4'>
//                     <button
//                       onClick={() => openModal(previewEvent)}
//                       className='bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex-1'
//                     >
//                       {currentLanguage === 'en'
//                         ? 'View Details'
//                         : 'عرض التفاصيل'}
//                     </button>
//                     <button
//                       onClick={() => setPreviewEvent(null)}
//                       className='bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-800 transition-colors duration-200 font-medium flex-1'
//                     >
//                       {currentLanguage === 'en'
//                         ? 'Hide Preview'
//                         : 'إخفاء المعاينة'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Upcoming Events Grid */}
//           <div className='flex flex-col md:flex-row gap-6 overflow-x-auto pb-4'>
//             {upcomingEvents.map(event => (
//               <div
//                 key={event.id}
//                 className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex-shrink-0 w-full md:w-80 ${
//                   previewEvent?.id === event.id
//                     ? 'ring-4 ring-blue-500 scale-105'
//                     : ''
//                 }`}
//                 onClick={() => handleEventClick(event)}
//               >
//                 <div className='relative h-48 overflow-hidden'>
//                   <img
//                     src={event.image}
//                     alt={event.title[currentLanguage]}
//                     className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
//                   />
//                   <div className='absolute top-4 right-4'>
//                     <span className='bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
//                       {event.category[currentLanguage]}
//                     </span>
//                   </div>
//                 </div>

//                 <div className='p-6 flex flex-col h-full'>
//                   <div className='flex-grow'>
//                     <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2'>
//                       {event.title[currentLanguage]}
//                     </h3>

//                     <div className='flex items-center text-gray-600 text-sm mb-2'>
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {event.date}
//                     </div>

//                     <div className='flex items-center text-gray-600 text-sm mb-2'>
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {event.location[currentLanguage]}
//                     </div>

//                     <div className='flex items-center text-gray-600 text-sm mb-4'>
//                       <svg
//                         className='w-4 h-4 mr-1'
//                         fill='currentColor'
//                         viewBox='0 0 20 20'
//                       >
//                         <path
//                           fillRule='evenodd'
//                           d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z'
//                           clipRule='evenodd'
//                         />
//                       </svg>
//                       {event.time[currentLanguage]}
//                     </div>

//                     <p className='text-gray-700 text-sm line-clamp-3'>
//                       {event.description[currentLanguage]}
//                     </p>
//                   </div>

//                   {/* Fixed position button */}
//                   <div className='mt-4'>
//                     <button
//                       className='w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm'
//                       onClick={e => {
//                         e.stopPropagation();
//                         openModal(event);
//                       }}
//                     >
//                       {currentLanguage === 'en'
//                         ? 'View Details'
//                         : 'عرض التفاصيل'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Event Modal */}
//       {selectedEvent && (
//         <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
//           <div className='bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
//             <div className='relative'>
//               <img
//                 src={selectedEvent.image}
//                 alt={selectedEvent.title[currentLanguage]}
//                 className='w-full h-64 object-cover rounded-t-xl'
//               />
//               <button
//                 onClick={closeModal}
//                 className='absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200'
//               >
//                 <svg
//                   className='w-6 h-6'
//                   fill='none'
//                   stroke='currentColor'
//                   viewBox='0 0 24 24'
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     strokeWidth={2}
//                     d='M6 18L18 6M6 6l12 12'
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className='p-6'>
//               <div className='flex items-center mb-4'>
//                 <span className='bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full'>
//                   {selectedEvent.category[currentLanguage]}
//                 </span>
//               </div>

//               <h2 className='text-2xl font-bold text-gray-900 mb-4'>
//                 {selectedEvent.title[currentLanguage]}
//               </h2>

//               <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
//                 <div className='flex items-center text-gray-700'>
//                   <svg
//                     className='w-5 h-5 mr-2 text-blue-800'
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                   <span>{selectedEvent.date}</span>
//                 </div>

//                 <div className='flex items-center text-gray-700'>
//                   <svg
//                     className='w-5 h-5 mr-2 text-blue-800'
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                   <span>{selectedEvent.location[currentLanguage]}</span>
//                 </div>

//                 <div className='flex items-center text-gray-700'>
//                   <svg
//                     className='w-5 h-5 mr-2 text-blue-800'
//                     fill='currentColor'
//                     viewBox='0 0 20 20'
//                   >
//                     <path
//                       fillRule='evenodd'
//                       d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z'
//                       clipRule='evenodd'
//                     />
//                   </svg>
//                   <span>{selectedEvent.time[currentLanguage]}</span>
//                 </div>
//               </div>

//               <div className='border-t pt-6'>
//                 <h3 className='font-bold text-gray-900 mb-3'>
//                   {currentLanguage === 'en'
//                     ? 'Event Description'
//                     : 'وصف الفعالية'}
//                 </h3>
//                 <p className='text-gray-700 leading-relaxed'>
//                   {selectedEvent.description[currentLanguage]}
//                 </p>
//               </div>

//               <div className='mt-6 flex justify-end'>
//                 <button
//                   onClick={closeModal}
//                   className='bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium'
//                 >
//                   {currentLanguage === 'en' ? 'Close' : 'إغلاق'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
