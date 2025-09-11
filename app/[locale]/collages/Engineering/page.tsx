'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Define TypeScript interfaces for your data structures
interface ProgramDetails {
  description: string;
  advantages: string[];
  opportunities: string[];
  curriculumLink: string;
}
interface AcademicProgram {
  id: number;
  name: string;
  duration: string;
  description: string;
  curriculum: string[];
  image: string;
  details: ProgramDetails;
}
interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
  image: string;
  details: string;
}
interface StudentActivity {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  highlights: string[];
  date: string;
  details: string;
}
interface UpcomingEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  speakers: string[];
  tags: string[];
}
interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  description: string;
  location: string;
}
interface FAQItem {
  question: string;
  answer: string;
}
const App: React.FC = () => {
  // State with proper TypeScript types
  const [selectedProgram, setSelectedProgram] =
    useState<AcademicProgram | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedActivity, setSelectedActivity] =
    useState<StudentActivity | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UpcomingEvent | null>(
    null
  );
  const [selectedGalleryItem, setSelectedGalleryItem] =
    useState<GalleryItem | null>(null);
  const [currentNewsIndex, setCurrentNewsIndex] = useState<number>(0);
  const [activeActivityCategory, setActiveActivityCategory] =
    useState<string>('All');
  const [showAllActivities, setShowAllActivities] = useState<boolean>(false);
  const [galleryScrollPosition, setGalleryScrollPosition] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Data arrays with explicit types
  const academicPrograms: AcademicProgram[] = [
    {
      id: 1,
      name: 'Intelligent Systems Engineering',
      duration: '4.5 years',
      description:
        'Advanced program focusing on AI, machine learning, and intelligent automation systems.',
      curriculum: [
        'Artificial Intelligence',
        'Machine Learning',
        'Neural Networks',
        'Robotics',
        'Computer Vision',
        'Natural Language Processing',
        'Intelligent Control Systems',
        'Data Mining',
        'Deep Learning',
        'Cognitive Systems',
      ],
      image: '/images/programs/ISE.jpg',
      details: {
        description:
          'Our Intelligent Systems Engineering program prepares students for the future of technology by focusing on artificial intelligence, machine learning, and intelligent automation. Students gain hands-on experience with cutting-edge AI technologies and develop systems that can learn, adapt, and make decisions. The program emphasizes both theoretical foundations and practical applications in areas like robotics, computer vision, and cognitive computing.',
        advantages: [
          'Cutting-edge curriculum developed in collaboration with industry leaders',
          'State-of-the-art laboratories with advanced AI and robotics equipment',
          'Opportunities for research projects with faculty members',
          'Strong industry connections for internships and job placements',
          'Focus on both theoretical foundations and practical applications',
          'Interdisciplinary approach combining computer science, engineering, and mathematics',
        ],
        opportunities: [
          'AI Research Scientist',
          'Machine Learning Engineer',
          'Data Scientist',
          'Robotics Engineer',
          'Computer Vision Specialist',
          'Natural Language Processing Engineer',
          'Intelligent Systems Architect',
          'Autonomous Systems Developer',
          'AI Consultant',
          'Research and Development Engineer',
        ],
        curriculumLink: 'https://example.com/ise-curriculum',
      },
    },
    {
      id: 2,
      name: 'Mechatronics Engineering',
      duration: '4 years',
      description:
        'Integration of mechanical, electrical, and computer systems for advanced automation solutions.',
      curriculum: [
        'Mechanical Systems',
        'Electrical Circuits',
        'Control Systems',
        'Robotics',
        'Sensors and Actuators',
        'Embedded Systems',
        'Industrial Automation',
        'System Integration',
        'Digital Signal Processing',
        'Mechanical Design',
      ],
      image: '/images/programs/Mechatronics.jpg',
      details: {
        description:
          'The Mechatronics Engineering program combines mechanical engineering, electronics, computer science, and control engineering to create intelligent systems. Students learn to design and develop complex systems that integrate mechanical components with electronic controls and software. This interdisciplinary approach prepares graduates for careers in robotics, automation, and advanced manufacturing industries.',
        advantages: [
          'Hands-on learning with real-world industrial applications',
          'Access to advanced manufacturing and robotics laboratories',
          'Project-based curriculum with industry-sponsored projects',
          'Strong focus on system integration and interdisciplinary design',
          'Excellent job placement rate in automation and manufacturing sectors',
          'Opportunities for international collaborations and exchange programs',
        ],
        opportunities: [
          'Mechatronics Engineer',
          'Automation Engineer',
          'Robotics Technician',
          'Control Systems Engineer',
          'Industrial Engineer',
          'Product Design Engineer',
          'Systems Integration Specialist',
          'Manufacturing Engineer',
          'Quality Assurance Engineer',
          'Technical Sales Engineer',
        ],
        curriculumLink: 'https://example.com/mechatronics-curriculum',
      },
    },
    {
      id: 3,
      name: 'Architecture Engineering',
      duration: '4.5 years',
      description:
        'Comprehensive study of architectural design, building systems, and sustainable construction.',
      curriculum: [
        'Architectural Design',
        'Building Systems',
        'Structural Engineering',
        'Sustainable Design',
        'Construction Management',
        'Urban Planning',
        'Building Information Modeling',
        'Environmental Systems',
        'Interior Design',
        'Historic Preservation',
      ],
      image: '/images/programs/Architecture.jpg',
      details: {
        description:
          'Our Architecture Engineering program combines artistic design with technical engineering principles. Students learn to create functional, aesthetically pleasing, and sustainable buildings and structures. The curriculum emphasizes innovative design solutions, advanced building technologies, and environmental responsibility. Graduates are prepared to address the complex challenges of modern architecture and urban development.',
        advantages: [
          'Studio-based learning environment fostering creativity and innovation',
          'Access to advanced design software and fabrication laboratories',
          'Focus on sustainable and environmentally responsible design',
          'Strong connections with architectural firms and construction companies',
          'Opportunities for participation in design competitions',
          'Integration of traditional architectural principles with modern technologies',
        ],
        opportunities: [
          'Architectural Designer',
          'Project Architect',
          'Sustainable Design Consultant',
          'Urban Planner',
          'Construction Manager',
          'Building Information Modeling (BIM) Specialist',
          'Interior Designer',
          'Historic Preservation Specialist',
          'Facility Manager',
          'Real Estate Developer',
        ],
        curriculumLink: 'https://example.com/architecture-curriculum',
      },
    },
    {
      id: 4,
      name: 'Cybersecurity Engineering',
      duration: '4.5 years',
      description:
        'Focused on protecting digital systems, networks, and data through advanced security engineering and risk management.',
      curriculum: [
        'Network Security',
        'Cryptography',
        'Operating System Security',
        'Secure Software Development',
        'Ethical Hacking & Penetration Testing',
        'Digital Forensics',
        'Cloud Security',
        'Cyber Risk Management',
        'Incident Response & Recovery',
        'Compliance and Cyber Law',
      ],
      image: '/images/programs/Cybersecurity.jpg',
      details: {
        description:
          'The Cybersecurity Engineering program equips students with the skills to safeguard information systems against evolving cyber threats. Through hands-on labs, secure coding practices, and real-world case studies, students gain expertise in protecting critical infrastructure, managing vulnerabilities, and ensuring regulatory compliance. Graduates are prepared for careers in security operations, risk assessment, digital forensics, and cybersecurity architecture across diverse industries.',
        advantages: [
          'Hands-on training in state-of-the-art cybersecurity laboratories',
          'Curriculum aligned with industry certifications (CISSP, CEH, etc.)',
          'Simulated cyber attack and defense exercises',
          'Strong industry partnerships for internships and job placement',
          'Focus on both offensive and defensive security techniques',
          'Preparation for in-demand cybersecurity certifications',
        ],
        opportunities: [
          'Cybersecurity Analyst',
          'Security Operations Center (SOC) Engineer',
          'Penetration Tester',
          'Security Architect',
          'Incident Responder',
          'Digital Forensics Investigator',
          'Security Consultant',
          'Chief Information Security Officer (CISO)',
          'Cloud Security Engineer',
          'Compliance and Risk Manager',
        ],
        curriculumLink: 'https://example.com/cybersecurity-curriculum',
      },
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'New Research Lab Opens for Intelligent Systems',
      date: 'September 15, 2025',
      content:
        'The Faculty of Engineering has launched a state-of-the-art research laboratory dedicated to intelligent systems and artificial intelligence. The new facility will support groundbreaking research in machine learning, computer vision, and robotics.',
      image: '/images/news/1.jpg',
      details:
        'The new Intelligent Systems Research Laboratory is equipped with cutting-edge technology including high-performance computing clusters, advanced robotics platforms, and specialized AI development environments. The lab will serve as a hub for interdisciplinary research projects involving students and faculty from multiple departments. With a focus on practical applications, researchers will work on projects related to autonomous systems, computer vision for medical applications, and natural language processing for Arabic dialects. The facility has received funding from both government grants and industry partnerships, totaling over $2 million in investments.',
    },
    {
      id: 2,
      title: 'Students Win National Engineering Competition',
      date: 'September 10, 2025',
      content:
        'A team of Mechatronics Engineering students secured first place in the National Engineering Innovation Challenge with their autonomous navigation system for industrial robots.',
      image: '/images/news/2.jpg',
      details:
        'The student team from the Mechatronics Engineering department developed an innovative autonomous navigation system that enables industrial robots to operate efficiently in dynamic environments with moving obstacles. Their system uses a combination of LiDAR sensors, computer vision algorithms, and real-time path planning to navigate complex factory layouts. The technology demonstrated 30% faster operation times compared to existing commercial solutions while maintaining superior safety standards. The team received a $50,000 prize and has been invited to present their work at the International Robotics Conference next month. Faculty advisors praised the students for their exceptional problem-solving skills and innovative approach to engineering challenges.',
    },
    {
      id: 3,
      title: 'Sustainable Architecture Design Exhibition',
      date: 'September 5, 2025',
      content:
        'The Architecture Engineering department hosted a successful exhibition showcasing student projects focused on sustainable building design and eco-friendly construction methods.',
      image: '/images/news/3.jpg',
      details:
        "The Sustainable Architecture Design Exhibition featured over 40 student projects that demonstrated innovative approaches to eco-friendly building design. Highlights included zero-energy residential complexes, adaptive reuse of historic buildings, and modular construction systems that reduce waste by 60%. Several projects incorporated advanced materials like self-healing concrete, photovoltaic glass, and bio-based insulation. Industry professionals from leading architecture firms attended the exhibition, with three projects receiving interest for potential commercial development. The exhibition also included workshops on sustainable design principles and panel discussions with experts in green building technologies. This annual event has become a key platform for showcasing the department's commitment to environmental responsibility in architectural practice.",
    },
    {
      id: 4,
      title: 'Industry Partnership for Smart Manufacturing',
      date: 'August 28, 2025',
      content:
        'The faculty has established a new partnership with leading technology companies to advance research in smart manufacturing and industrial automation systems.',
      image: '/images/news/4.jpg',
      details:
        "The Faculty of Engineering has formed a strategic partnership with three major technology companies to create a Smart Manufacturing Innovation Center. This collaboration will focus on developing next-generation industrial automation systems that integrate IoT sensors, predictive maintenance algorithms, and digital twin technology. The partnership includes a $3 million investment in equipment and research funding over the next five years. Students and faculty will work on joint research projects addressing challenges in production efficiency, quality control, and energy optimization in manufacturing processes. The center will also offer specialized training programs for industry professionals and create internship opportunities for students. This partnership strengthens the faculty's position as a leader in industrial innovation and ensures that academic research remains closely aligned with industry needs and technological trends.",
    },
  ];

  // Student Activities Data
  const studentActivities: StudentActivity[] = [
    {
      id: 1,
      title: 'Engineering Innovation Challenge',
      category: 'Competition',
      image: '/images/Activity/Engineering Innovation Challenge.jpg',
      description:
        'Students showcase their innovative engineering solutions to real-world problems in this annual competition.',
      highlights: [
        'Team-based engineering projects',
        'Industry judges and mentors',
        'Prizes and internship opportunities',
      ],
      date: 'March 15-17, 2025',
      details:
        'The Engineering Innovation Challenge is our flagship competition where students from different engineering disciplines collaborate to solve real-world engineering problems. Teams work for several weeks to develop innovative solutions, which are then presented to a panel of industry experts and faculty judges. The competition fosters creativity, teamwork, and practical problem-solving skills essential for future engineers.',
    },
    {
      id: 2,
      title: 'Robotics Club',
      category: 'Club',
      image: '/images/Activity/Robotics Club.jpg',
      description:
        'Hands-on experience in designing, building, and programming robots for various applications and competitions.',
      highlights: [
        'Weekly workshops and training sessions',
        'Participation in national robotics competitions',
        'Collaboration with industry partners',
      ],
      date: 'Ongoing',
      details:
        'The Robotics Club offers students hands-on experience in robotics design, construction, and programming. Members work on various projects throughout the year, from simple educational robots to complex autonomous systems. The club participates in national competitions and collaborates with industry partners on real-world robotics challenges. Weekly meetings include workshops, project work, and guest lectures from robotics professionals.',
    },
    {
      id: 3,
      title: 'Sustainable Design Workshop',
      category: 'Workshop',
      image: '/images/Activity/architectural and engineering projects.jpg',
      description:
        'Learn sustainable design principles and apply them to real architectural and engineering projects.',
      highlights: [
        'Hands-on design projects',
        'Expert lectures from industry professionals',
        'Focus on eco-friendly materials',
      ],
      date: 'April 10-12, 2025',
      details:
        'This intensive three-day workshop focuses on sustainable design principles and their application in real-world engineering and architectural projects. Participants learn about eco-friendly materials, energy-efficient design, and sustainable construction methods. The workshop includes hands-on design projects, expert lectures from industry professionals, and site visits to sustainable buildings. Upon completion, participants receive a certificate recognizing their expertise in sustainable design.',
    },
    {
      id: 4,
      title: 'Hackathon 24/7',
      category: 'Event',
      image: '/images/Activity/hack.jpg',
      description:
        'A 24-hour coding marathon where students work in teams to develop innovative software solutions.',
      highlights: [
        'Round-the-clock coding session',
        'Mentorship from industry experts',
        'Food and refreshments provided',
      ],
      date: 'May 5-6, 2025',
      details:
        'Hackathon 24/7 is a 24-hour coding marathon where student teams work intensively to develop innovative software solutions to challenging problems. Participants receive mentorship from industry experts and have access to cutting-edge development tools. The event fosters creativity, collaboration, and rapid prototyping skills. Food and refreshments are provided throughout the event, and prizes are awarded to the top solutions in various categories.',
    },
    {
      id: 5,
      title: 'Engineering Career Fair',
      category: 'Career',
      image: '/images/Activity/engineering companies.jpg',
      description:
        'Connect with leading engineering companies for internships, co-op positions, and full-time positions.',
      highlights: [
        'Networking with industry recruiters',
        'Resume review sessions',
        'Interview preparation workshops',
      ],
      date: 'February 20, 2025',
      details:
        'The annual Engineering Career Fair connects students with over 50 leading engineering companies offering internships, co-op positions, and full-time roles. The event provides excellent networking opportunities, resume review sessions, and interview preparation workshops. Students can explore career paths and connect with recruiters from top technology firms and engineering organizations.',
    },
    {
      id: 6,
      title: 'Research Symposium',
      category: 'Academic',
      image: '/images/Activity/Research Symposium.jpg',
      description:
        'Present research findings to faculty, peers, and industry partners in a professional conference setting.',
      highlights: [
        'Presentation of research projects',
        'Feedback from experts',
        'Publication opportunities',
      ],
      date: 'June 10-11, 2025',
      details:
        'The Research Symposium provides students with a platform to present their research findings to faculty, peers, and industry partners in a professional conference setting. Participants receive valuable feedback from experts in their field, and outstanding research may lead to publication opportunities. The symposium recognizes excellence in research with awards for the best presentations and posters.',
    },
  ];

  // Upcoming Events Data
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: 'AI & Machine Learning Conference',
      type: 'Conference',
      date: 'October 15-17, 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Main Auditorium, Engineering Building',
      image: '/images/news/1.jpg',
      description:
        'Join industry leaders and academic experts for three days of cutting-edge presentations, workshops, and networking opportunities in artificial intelligence and machine learning.',
      speakers: [
        'Dr. Sarah Johnson - Chief AI Scientist, TechInnovate',
        'Prof. Michael Chen - Stanford University',
        'Dr. Emma Rodriguez - Google AI Research',
      ],
      tags: ['AI', 'Machine Learning', 'Research'],
    },
    {
      id: 2,
      title: 'Engineering Career Expo',
      type: 'Career',
      date: 'October 22, 2025',
      time: '10:00 AM - 4:00 PM',
      location: 'Student Center, Hall A & B',
      image: '/images/news/2.jpg',
      description:
        'Connect with over 50 leading engineering companies offering internships, co-op positions, and full-time roles. Perfect opportunity to network and explore career paths.',
      speakers: ['Recruiters from top engineering firms'],
      tags: ['Career', 'Networking', 'Internships'],
    },
    {
      id: 3,
      title: 'Sustainable Engineering Workshop',
      type: 'Workshop',
      date: 'November 5, 2025',
      time: '1:00 PM - 6:00 PM',
      location: 'Green Tech Laboratory',
      image: '/images/news/1.jpg',
      description:
        'Hands-on workshop focused on sustainable engineering practices, green materials, and eco-friendly design principles for the next generation of engineers.',
      speakers: ['Dr. Alan Thompson - Sustainability Director, EcoBuild'],
      tags: ['Sustainability', 'Workshop', 'Design'],
    },
    {
      id: 4,
      title: 'Robotics Challenge Finals',
      type: 'Competition',
      date: 'November 12, 2025',
      time: '2:00 PM - 8:00 PM',
      location: 'Robotics Arena, Innovation Center',
      image: '/images/news/2.jpg',
      description:
        'Watch the final round of our annual robotics competition where student teams showcase their autonomous robots in a series of challenging tasks and obstacle courses.',
      speakers: ['Faculty Judges', 'Industry Experts'],
      tags: ['Robotics', 'Competition', 'Innovation'],
    },
  ];

  // Gallery Data (Images only)
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Research Lab Opening Ceremony',
      category: 'Events',
      image: '/images/gallery/1.jpg',
      date: 'September 15, 2025',
      description:
        'Grand opening of the new Intelligent Systems Research Laboratory with faculty, students, and industry partners.',
      location: 'Engineering Building',
    },
    {
      id: 2,
      title: 'Student Competition Victory',
      category: 'Achievements',
      image: '/images/gallery/2.jpg',
      date: 'September 10, 2025',
      description:
        'Mechatronics Engineering students celebrate their first-place win at the National Engineering Innovation Challenge.',
      location: 'National Competition Center',
    },
    {
      id: 3,
      title: 'Sustainable Architecture Exhibition',
      category: 'Student Work',
      image: '/images/gallery/3.jpg',
      date: 'September 5, 2025',
      description:
        'Architecture Engineering students present their sustainable design projects at the annual exhibition.',
      location: 'Design Studio',
    },
    {
      id: 4,
      title: 'Industry Partnership Signing',
      category: 'Partnerships',
      image: '/images/gallery/4.jpg',
      date: 'August 28, 2025',
      description:
        'Signing ceremony for the new industry partnership with leading technology companies for smart manufacturing research.',
      location: 'Administration Building',
    },
    {
      id: 5,
      title: 'Graduation Ceremony 2025',
      category: 'Events',
      image: '/images/gallery/5.jpg',
      date: 'July 15, 2025',
      description:
        'Annual graduation ceremony celebrating the achievements of our engineering graduates.',
      location: 'Main Auditorium',
    },
    {
      id: 6,
      title: 'Robotics Club Workshop',
      category: 'Student Activities',
      image: '/images/gallery/6.jpg',
      date: 'August 20, 2025',
      description:
        'Robotics Club members working on their latest robot design during a weekly workshop session.',
      location: 'Robotics Laboratory',
    },
    {
      id: 7,
      title: 'Engineering Career Fair',
      category: 'Events',
      image: '/images/gallery/7.jpg',
      date: 'February 20, 2025',
      description:
        'Students networking with industry recruiters at the annual Engineering Career Fair.',
      location: 'Student Center',
    },
    {
      id: 8,
      title: 'Architecture Design Studio',
      category: 'Facilities',
      image: '/images/gallery/8.jpg',
      date: 'August 5, 2025',
      description:
        'Architecture Engineering students working in the design studio on their latest projects.',
      location: 'Architecture Building',
    },
    {
      id: 9,
      title: 'Cybersecurity Lab',
      category: 'Facilities',
      image: '/images/gallery/9.jpg',
      date: 'September 1, 2025',
      description:
        'Students conducting hands-on training in the state-of-the-art cybersecurity laboratory.',
      location: 'Cybersecurity Center',
    },
  ];

  // FAQ Data
  const faqs: FAQItem[] = [
    {
      question:
        'What are the admission requirements for your engineering programs?',
      answer:
        'Admission requirements include a high school diploma with strong grades in mathematics and science subjects, passing our entrance examination, and a personal interview. Specific requirements may vary by program, so we recommend checking the detailed requirements for your chosen program on our admissions page.',
    },
    {
      question: 'Do you offer scholarships or financial aid?',
      answer:
        'Yes, we offer a variety of scholarships based on academic merit, financial need, and specific talents. Our financial aid office can help you explore options including government grants, institutional scholarships, and work-study programs. Approximately 40% of our students receive some form of financial assistance.',
    },
    {
      question: 'What career support services do you provide for students?',
      answer:
        'Our Career Development Center offers comprehensive services including resume workshops, mock interviews, career counseling, and networking events. We host two major career fairs annually with over 100 companies, and maintain strong industry connections that lead to internship and job opportunities for our graduates.',
    },
    {
      question: 'Can I transfer credits from another university?',
      answer:
        'Yes, we accept transfer credits from accredited institutions. Credits are evaluated on a case-by-case basis by our admissions office. Generally, courses with a grade of C or better that are equivalent to our curriculum can be transferred. We recommend scheduling a consultation with our transfer credit advisor for detailed information.',
    },
    {
      question:
        'What research opportunities are available for undergraduate students?',
      answer:
        'Undergraduate students have numerous research opportunities through our faculty-led research projects, summer research programs, and independent study courses. Many of our students co-author papers with faculty members and present at national conferences. Our research centers in AI, robotics, sustainable design, and cybersecurity actively seek undergraduate research assistants.',
    },
    {
      question: 'Do you have international exchange programs?',
      answer:
        'Yes, we have partnerships with over 30 universities worldwide for student exchange programs. These programs typically last one semester and allow students to earn credits toward their degree while experiencing a different educational system and culture. We also offer short-term study abroad programs during summer and winter breaks.',
    },
  ];

  // Filter activities by category
  const filteredActivities: StudentActivity[] =
    activeActivityCategory === 'All'
      ? studentActivities
      : studentActivities.filter(
          activity => activity.category === activeActivityCategory
        );

  // Get unique categories for filtering
  const categories: string[] = [
    'All',
    ...Array.from(
      new Set(studentActivities.map(activity => activity.category))
    ),
  ];

  // Modal and interaction handlers with proper types
  const closeModal = (): void => {
    setSelectedProgram(null);
    setSelectedNews(null);
    setSelectedActivity(null);
    setSelectedEvent(null);
    setSelectedGalleryItem(null);
  };

  const openNewsModal = (news: NewsItem): void => {
    setSelectedNews(news);
  };

  const openActivityModal = (activity: StudentActivity): void => {
    setSelectedActivity(activity);
  };

  const openEventModal = (event: UpcomingEvent): void => {
    setSelectedEvent(event);
  };

  const openGalleryModal = (item: GalleryItem): void => {
    setSelectedGalleryItem(item);
  };

  const nextNews = (): void => {
    setCurrentNewsIndex(prevIndex => (prevIndex + 1) % newsItems.length);
  };

  const prevNews = (): void => {
    setCurrentNewsIndex(
      prevIndex => (prevIndex - 1 + newsItems.length) % newsItems.length
    );
  };

  // Gallery scroll functions
  const scrollGallery = (direction: number): void => {
    if (typeof document !== 'undefined') {
      const gallery = document.getElementById('gallery-slider');
      if (gallery) {
        const scrollAmount = 300;
        const newPosition = gallery.scrollLeft + direction * scrollAmount;
        gallery.scrollLeft = newPosition;
        setGalleryScrollPosition(newPosition);
      }
    }
  };

  // Auto-advance news slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex(prevIndex => (prevIndex + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsItems.length]);

  // Handle scroll blocking when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (
        selectedProgram ||
        selectedNews ||
        selectedActivity ||
        selectedEvent ||
        selectedGalleryItem
      ) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [
    selectedProgram,
    selectedNews,
    selectedActivity,
    selectedEvent,
    selectedGalleryItem,
  ]);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-[#023f8a] via-[#0352b5] to-[#1a73e8] text-white overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div className='space-y-8'>
              <div className='inline-block bg-[#ffd700] bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2'>
                <span className='text-sm text-[#023f8a] font-bold '>
                  Faculty of engineering
                </span>
              </div>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
                Shape the Future with
                <span className='block text-[#ffd700]'>
                  Cutting-Edge Engineering
                </span>
              </h1>
              <p className='text-xl md:text-2xl text-blue-100 leading-relaxed'>
                Join a community of innovators, researchers, and future leaders
                in engineering. Where ideas become reality and students become
                pioneers.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <a href='#programs'>
                  <button className='bg-[#ffd700] text-[#023f8a] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
                    Explore Programs
                  </button>
                </a>
                <button className='border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-[#023f8a] transform hover:scale-105 transition-all duration-300'>
                  Schedule a Tour
                </button>
              </div>
              <div className='grid grid-cols-3 gap-6 pt-8'>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold text-[#ffd700]'>
                    4
                  </div>
                  <div className='text-sm opacity-90'>Specialized Programs</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold text-[#ffd700]'>
                    95%
                  </div>
                  <div className='text-sm opacity-90'>Employment Rate</div>
                </div>
                <div className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold text-[#ffd700]'>
                    50+
                  </div>
                  <div className='text-sm opacity-90'>Industry Partners</div>
                </div>
              </div>
            </div>
            <div className='relative'>
              {/* <div className="absolute -inset-4 bg-[#ff6b35] rounded-3xl blur opacity-30 "></div> */}
              <div className='relative bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20'>
                <Image
                  src='/images/Activity/engineering companies.jpg'
                  alt='Engineering Companies'
                  width={400}
                  height={300}
                  className='w-full h-full object-cover transition-transform duration-500 '
                />
                <div className='mt-6 grid grid-cols-2 gap-4'>
                  <div className='bg-[#02397c] bg-opacity-10 rounded-lg p-3'>
                    <div className='text-2xl font-bold text-[#ffd700]'>
                      3,500+
                    </div>
                    <div className='text-xs text-blue-100'>Students</div>
                  </div>
                  <div className='bg-[#02397c] bg-opacity-10 rounded-lg p-3'>
                    <div className='text-2xl font-bold text-[#ffd700]'>
                      150+
                    </div>
                    <div className='text-xs text-blue-100'>Faculty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent'></div>
      </section>

      {/* About University Section */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#023f8a] mb-4'>
              About Our University
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Pioneering engineering education through innovation, research, and
              industry collaboration
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20'>
            <div className='space-y-6'>
              <div className='inline-block bg-[#023f8a] text-white px-4 py-2 rounded-full text-sm font-medium'>
                Since 1995
              </div>
              <h3 className='text-3xl font-bold text-gray-900'>
                Engineering Excellence for Over 25 Years
              </h3>
              <p className='text-lg text-gray-700 leading-relaxed'>
                Founded in 1995, our Faculty of Engineering has established
                itself as a leader in engineering education and research. We
                combine rigorous academic programs with hands-on learning
                experiences to prepare students for successful careers in a
                rapidly evolving technological landscape.
              </p>
              <p className='text-lg text-gray-700 leading-relaxed'>
                Our commitment to innovation is reflected in our
                state-of-the-art facilities, industry partnerships, and research
                centers. Students work alongside renowned faculty on
                cutting-edge projects that address real-world challenges in
                artificial intelligence, sustainable design, cybersecurity, and
                advanced manufacturing.
              </p>
              <div className='grid grid-cols-2 gap-6 pt-6'>
                <div className='bg-[#023f8a]/5 p-6 rounded-xl'>
                  <div className='text-3xl font-bold text-[#023f8a] mb-2'>
                    45+
                  </div>
                  <div className='text-gray-700 font-medium'>Research Labs</div>
                </div>
                <div className='bg-[#023f8a]/5 p-6 rounded-xl'>
                  <div className='text-3xl font-bold text-[#023f8a] mb-2'>
                    200+
                  </div>
                  <div className='text-gray-700 font-medium'>
                    Research Papers
                  </div>
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='relative group'>
                <div className=''></div>
                <Image
                  src='/images/Activity/engineering companies.jpg'
                  alt='Research Lab'
                  width={400}
                  height={300}
                  className='relative rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500'
                />
              </div>
              <div className='relative group'>
                <div className=''></div>
                <Image
                  src='/images/Activity/engineering companies.jpg'
                  alt='Student Project'
                  width={400}
                  height={300}
                  className='relative rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500 mt-8'
                />
              </div>
              <div className='relative group'>
                <div className=''></div>
                <Image
                  src='/images/Activity/engineering companies.jpg'
                  alt='Campus Life'
                  width={400}
                  height={300}
                  className='relative rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500'
                />
              </div>
              <div className='relative group'>
                <div className=''></div>
                <Image
                  src='/images/Activity/engineering companies.jpg'
                  alt='Graduation'
                  width={400}
                  height={300}
                  className='relative rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-500 mt-8'
                />
              </div>
            </div>
          </div>
          <div className='bg-gradient-to-r from-[#023f8a]/5 to-[#0352b5]/5 rounded-3xl p-8 md:p-12'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-[#023f8a] text-white rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.283-.988-2.386l-.548-.547z'
                    />
                  </svg>
                </div>
                <h4 className='text-xl font-bold text-gray-900 mb-2'>
                  Innovation & Research
                </h4>
                <p className='text-gray-600'>
                  Cutting-edge research facilities and faculty-led projects that
                  push the boundaries of engineering knowledge.
                </p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-[#0352b5] text-white rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <h4 className='text-xl font-bold text-gray-900 mb-2'>
                  Industry Connections
                </h4>
                <p className='text-gray-600'>
                  Strong partnerships with leading companies providing
                  internships, projects, and employment opportunities.
                </p>
              </div>
              <div className='text-center'>
                <div className='w-16 h-16 bg-[#1a73e8] text-white rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <h4 className='text-xl font-bold text-gray-900 mb-2'>
                  Student Success
                </h4>
                <p className='text-gray-600'>
                  Comprehensive support services and career development programs
                  ensuring student achievement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Programs Section */}
      <main
        className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'
        id='programs'
      >
        <section className='mb-16'>
          <div className='bg-[#023f8a] text-white p-8 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-bold text-center mb-2'>
              Academic Programs
            </h2>
            <p className='text-center text-blue-100'>
              Explore our comprehensive engineering programs designed to prepare
              students for successful careers in various engineering fields.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {academicPrograms.map(program => (
              <div
                key={program.id}
                className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer flex flex-col'
                onClick={() => setSelectedProgram(program)}
              >
                <div className='relative h-48 overflow-hidden'>
                  <Image
                    src={program.image}
                    alt={program.name}
                    width={400}
                    height={192}
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/400x300/6b7280/ffffff?text=No+Image';
                    }}
                  />
                  <div className='absolute top-4 right-4'>
                    <span className='bg-[#023f8a] text-white text-xs font-medium px-2.5 py-0.5 rounded-full'>
                      {program.duration}
                    </span>
                  </div>
                </div>
                {/* Ø®Ù„ÙŠ Ø§Ù„Ù†ØµÙˆØµ ØªØªÙ…Ø¯Ø¯ Ø¹Ø´Ø§Ù† Ø§Ù„Ø²Ø±Ø§Ø± ÙŠÙØ¶Ù„ ØªØ­Øª */}
                <div className='p-6 flex flex-col flex-grow'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    {program.name}
                  </h3>
                  <p className='text-gray-600 mb-4'>{program.description}</p>
                  <div className='border-t pt-4 flex flex-col flex-grow'>
                    <h4 className='font-semibold text-gray-900 mb-2'>
                      Course Curriculum
                    </h4>
                    <ul className='space-y-1 mb-4'>
                      {program.curriculum.slice(0, 4).map((course, index) => (
                        <li
                          key={index}
                          className='text-gray-600 text-sm flex items-center'
                        >
                          <svg
                            className='w-4 h-4 mr-2 text-green-500'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          {course}
                        </li>
                      ))}
                    </ul>
                    {program.curriculum.length > 4 && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedProgram(program);
                        }}
                        className='self-start mt-auto bg-[#023f8a] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-300 inline-flex items-center cursor-pointer w-auto'
                      >
                        Read more
                        <svg
                          className='w-4 h-4 ml-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Student Activities Section */}
        <section className='mb-16'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-[#023f8a] mb-4'>
              Student Activities
            </h2>
            <p className='text-gray-600 mb-8 max-w-3xl mx-auto'>
              Experience a vibrant campus life with diverse activities that
              complement your academic journey and help you develop valuable
              skills beyond the classroom.
            </p>
            {/* Category Filter */}
            <div className='flex flex-wrap justify-center gap-2 mb-8'>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveActivityCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-all duration-300 ${
                    activeActivityCategory === category
                      ? 'bg-[#023f8a] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-[#023f8a] hover:text-white shadow-sm'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {filteredActivities.slice(0, 3).map(activity => (
              <div
                key={activity.id}
                className='bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-103 transition-all duration-300 hover:shadow-lg'
                onClick={() => openActivityModal(activity)}
              >
                <div className='relative h-32 overflow-hidden'>
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={400}
                    height={128}
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/400x300/6b7280/ffffff?text=Activity+Image';
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                    <div className='p-3 w-full'>
                      <span className='inline-block bg-white text-[#023f8a] text-xs font-medium px-2 py-1 rounded-full mb-1'>
                        {activity.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <span className='bg-[#023f8a]/10 text-[#023f8a] text-xs font-medium px-2 py-1 rounded-full mr-2'>
                      {activity.category}
                    </span>
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2'>
                    {activity.title}
                  </h3>
                  <p className='text-gray-600 mb-3 text-sm line-clamp-2'>
                    {activity.description}
                  </p>
                  <div className='mb-3'>
                    <ul className='space-y-1'>
                      {activity.highlights.slice(0, 2).map((highlight, idx) => (
                        <li
                          key={idx}
                          className='flex items-start text-gray-700 text-xs'
                        >
                          <svg
                            className='w-3 h-3 mr-1 text-[#023f8a] mt-0.5 flex-shrink-0'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className='text-[#023f8a] text-sm font-medium hover:text-[#012d66] transition-colors duration-300 inline-flex items-center cursor-pointer'>
                    Learn More
                    <svg
                      className='w-3 h-3 ml-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Expandable Activities Section */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 transition-all duration-500 ease-in-out ${
              showAllActivities
                ? 'opacity-100 max-h-96'
                : 'opacity-0 max-h-0 overflow-hidden'
            }`}
          >
            {filteredActivities.slice(3).map(activity => (
              <div
                key={activity.id}
                className='bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-103 transition-all duration-300 hover:shadow-lg'
                onClick={() => openActivityModal(activity)}
              >
                <div className='relative h-32 overflow-hidden'>
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/400x300/6b7280/ffffff?text=Activity+Image';
                    }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                    <div className='p-3 w-full'>
                      <span className='inline-block bg-white text-[#023f8a] text-xs font-medium px-2 py-1 rounded-full mb-1'>
                        {activity.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <span className='bg-[#023f8a]/10 text-[#023f8a] text-xs font-medium px-2 py-1 rounded-full mr-2'>
                      {activity.category}
                    </span>
                  </div>
                  <h3 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2'>
                    {activity.title}
                  </h3>
                  <p className='text-gray-600 mb-3 text-sm line-clamp-2'>
                    {activity.description}
                  </p>
                  <div className='mb-3'>
                    <ul className='space-y-1'>
                      {activity.highlights.slice(0, 2).map((highlight, idx) => (
                        <li
                          key={idx}
                          className='flex items-start text-gray-700 text-xs'
                        >
                          <svg
                            className='w-3 h-3 mr-1 text-[#023f8a] mt-0.5 flex-shrink-0'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className='text-[#023f8a] text-sm font-medium hover:text-[#012d66] transition-colors duration-300 inline-flex items-center cursor-pointer'>
                    Learn More
                    <svg
                      className='w-3 h-3 ml-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* View More Button */}
          <div className='text-center mt-8'>
            <button
              onClick={() => setShowAllActivities(!showAllActivities)}
              className='bg-[#023f8a] text-white px-6 py-3 rounded-lg hover:bg-[#012d66] transition-colors duration-300 font-medium flex items-center mx-auto group cursor-pointer'
            >
              <span>
                {showAllActivities
                  ? 'Show Less Activities'
                  : 'View More Activities'}
              </span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-y-0.5 ${
                  showAllActivities ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className='mb-16'>
          <div className='bg-gradient-to-r from-[#023f8a] to-[#0352b5] text-white p-8 rounded-lg shadow-md mb-8'>
            <h2 className='text-3xl font-bold mb-2'>Upcoming Events</h2>
            <p className='text-blue-100'>
              Don't miss these exciting opportunities to learn, network, and
              grow
            </p>
          </div>
          <div className='space-y-6'>
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col md:flex-row'
                onClick={() => openEventModal(event)}
              >
                <div className='md:w-1/3 h-48 md:h-auto relative'>
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={192}
                    className='w-full h-full object-cover'
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://placehold.co/400x300/6b7280/ffffff?text=Event+Image';
                    }}
                  />
                  <div className='absolute top-4 left-4'>
                    <span className='bg-[#023f8a] text-white text-xs font-medium px-3 py-1 rounded-full'>
                      {event.type}
                    </span>
                  </div>
                </div>
                <div className='md:w-2/3 p-6'>
                  <div className='flex flex-wrap items-center mb-3 gap-2'>
                    <h3 className='text-xl font-bold text-gray-900'>
                      {event.title}
                    </h3>
                  </div>
                  <div className='flex flex-wrap gap-4 mb-4 text-sm'>
                    <div className='flex items-center text-gray-600'>
                      <svg
                        className='w-4 h-4 mr-1 text-[#023f8a]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                      {event.date}
                    </div>
                    <div className='flex items-center text-gray-600'>
                      <svg
                        className='w-4 h-4 mr-1 text-[#023f8a]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      {event.time}
                    </div>
                    <div className='flex items-center text-gray-600'>
                      <svg
                        className='w-4 h-4 mr-1 text-[#023f8a]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      {event.location}
                    </div>
                  </div>
                  <p className='text-gray-600 mb-4 leading-relaxed'>
                    {event.description}
                  </p>
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className='bg-[#023f8a]/10 text-[#023f8a] text-xs font-medium px-2.5 py-1 rounded-full'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className='flex flex-col sm:flex-row gap-3'>
                    <button className='flex-1 bg-[#023f8a] text-white py-2 px-4 rounded-lg hover:bg-[#012d66] transition-colors duration-300 font-medium text-sm cursor-pointer'>
                      Register Now
                    </button>
                    <button className='flex-1 bg-white text-[#023f8a] border border-[#023f8a] py-2 px-4 rounded-lg hover:bg-[#023f8a]/10 transition-colors duration-300 font-medium text-sm cursor-pointer'>
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* News Section */}
        <section className='mb-16'>
          <div className='bg-[#023f8a] text-white p-8 rounded-lg shadow-md mb-8'>
            <h2 className='text-2xl font-bold text-center mb-2'>Latest News</h2>
            <p className='text-center text-blue-100'>
              Stay updated with the latest developments, achievements, and
              events from our faculty.
            </p>
          </div>
          <div className='relative bg-white rounded-lg shadow-md overflow-hidden'>
            {/* News Slider */}
            <div className='relative h-80 md:h-96'>
              {newsItems.map((news, index) => (
                <div
                  key={news.id}
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    index === currentNewsIndex
                      ? 'opacity-100 transform translate-x-0'
                      : 'opacity-0 transform translate-x-full'
                  }`}
                >
                  <div className='h-full flex flex-col md:flex-row'>
                    <div className='md:w-1/2 h-48 md:h-full'>
                      <Image
                        src={news.image}
                        alt={news.title}
                        width={400}
                        height={384}
                        className='w-full h-full object-cover'
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/400x250/6b7280/ffffff?text=No+Image';
                        }}
                      />
                    </div>
                    <div className='md:w-1/2 p-6'>
                      <div className='flex items-center mb-2'>
                        <span className='bg-[#023f8a] text-white text-xs font-medium px-2.5 py-0.5 rounded-full'>
                          {news.date}
                        </span>
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-3'>
                        {news.title}
                      </h3>
                      <p className='text-gray-600 leading-relaxed'>
                        {news.content}
                      </p>
                      <button
                        onClick={() => openNewsModal(news)}
                        className='mt-4 bg-[#023f8a] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-300 cursor-pointer inline-flex items-center'
                      >
                        Read more
                        <svg
                          className='w-4 h-4 ml-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Navigation Buttons */}
              <button
                onClick={prevNews}
                className='absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 cursor-pointer rounded-full p-2 shadow-md transition-all duration-300 z-10'
              >
                <svg
                  className='w-5 h-5 text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
              <button
                onClick={nextNews}
                className='absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 cursor-pointer rounded-full p-2 shadow-md transition-all duration-300 z-10'
              >
                <svg
                  className='w-5 h-5 text-gray-800'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </div>
            {/* Dots Indicator */}
            <div className='flex justify-center py-4 space-x-2'>
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNewsIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentNewsIndex
                      ? 'bg-[#023f8a]'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Gallery / Media Centre Section */}
        <section className='mb-16'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-[#023f8a] mb-2'>Gallery</h2>
            <p className='text-gray-600 mb-8 max-w-3xl mx-auto'>
              Explore our vibrant community through photos that capture the
              spirit of innovation, collaboration, and achievement.
            </p>
          </div>
          {/* Horizontal Gallery Slider */}
          <div className='relative'>
            {/* Scroll Buttons */}
            <button
              onClick={() => scrollGallery(-1)}
              className='absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-300 z-10'
            >
              <svg
                className='w-5 h-5 text-gray-800'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <button
              onClick={() => scrollGallery(1)}
              className='absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-300 z-10'
            >
              <svg
                className='w-5 h-5 text-gray-800'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
            {/* Gallery Slider */}
            <div
              id='gallery-slider'
              className='flex space-x-6 overflow-x-auto scrollbar-hide py-6 px-4'
              style={{ scrollBehavior: 'smooth' }}
            >
              {galleryItems.map(item => (
                <div
                  key={item.id}
                  className='flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-103 transition-all duration-300 hover:shadow-lg flex flex-col  '
                  onClick={() => openGalleryModal(item)}
                >
                  <div className='relative h-56 overflow-hidden'>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={224}
                      className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://placehold.co/400x300/6b7280/ffffff?text=Gallery+Image';
                      }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end'>
                      <div className='p-4 w-full'>
                        <span className='inline-block bg-white text-[#023f8a] text-xs font-medium px-3 py-1 rounded-full mb-2'>
                          {item.date}
                        </span>
                        <h3 className='text-white font-bold text-lg mb-1'>
                          {item.title}
                        </h3>
                        <span className='bg-[#023f8a]/10 text-[#023f8a] text-xs font-medium px-3 py-1 rounded-full'>
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='p-4 flex flex-col flex-grow'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='bg-[#023f8a]/10 text-[#023f8a] text-xs font-medium px-3 py-1 rounded-full'>
                        {item.category}
                      </span>
                      <span className='text-gray-500 text-xs'>{item.date}</span>
                    </div>
                    <h3 className='font-bold text-gray-900 text-lg mb-2 line-clamp-2'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow'>
                      {item.description}
                    </p>
                    <button className='cursor-pointer mt-auto w-full bg-[#023f8a] text-white py-2 px-4 rounded-lg hover:bg-[#012d66] transition-colors duration-300 font-medium text-sm flex items-center justify-center'>
                      <span>View Details</span>
                      <svg
                        className='w-4 h-4 ml-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Scroll Indicator */}
            <div className='flex justify-center mt-4'>
              <div className='bg-gray-200 rounded-full h-2 w-32'>
                <div
                  className='bg-[#023f8a] h-2 rounded-full transition-all duration-300'
                  style={{
                    width: `${(galleryScrollPosition / (galleryItems.length * 320)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FAQs Section */}
      <section className='py-2 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-[#023f8a] mb-4'>
              Frequently Asked Questions
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Find answers to the most common questions about our programs,
              admissions, and student life
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden'
              >
                <button
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                  className='w-full text-left p-6 focus:outline-none mt-9 cursor-pointer'
                >
                  <div className='flex items-center justify-between'>
                    <h3 className='text-xl font-bold text-gray-900 pr-4'>
                      {faq.question}
                    </h3>
                    <div
                      className={`transform transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`}
                    >
                      <svg
                        className='w-6 h-6 text-[#023f8a]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeFaq === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className='px-6 pb-6 '>
                    <div className='w-12 h-1 bg-[#023f8a] mb-4'></div>
                    <p className='text-gray-700 leading-relaxed text-lg'>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-16 text-center'>
            <p className='text-gray-600 mb-6 text-lg'>Still have questions?</p>
            <button className='cursor-pointer mb-6 bg-[#023f8a] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#012d66] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl'>
              Contact Our Admissions Team
            </button>
          </div>
        </div>
      </section>

      {/* Students Union of Engineering Section */}
      <section className='py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              Students Union of Engineering
            </h2>
            <p className='text-xl text-blue-100 max-w-3xl mx-auto'>
              Empowering engineering students through representation, advocacy,
              and community building
            </p>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16'>
            <div className='bg-[#3553b5] bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 cursor-pointer'>
              <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mb-6 mx-auto'>
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-center'>
                Student Representation
              </h3>
              <p className='text-center leading-relaxed'>
                We represent the interests of all engineering students in
                faculty meetings, university committees, and external
                organizations. Your voice matters, and we ensure it's heard at
                every level.
              </p>
            </div>
            <div className='bg-[#3553b5] bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 cursor-pointer'>
              <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mb-6 mx-auto'>
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-center'>
                Academic Support
              </h3>
              <p className='text-center leading-relaxed'>
                From tutoring sessions to exam preparation workshops, we provide
                comprehensive academic support to help you excel in your
                engineering studies and achieve your academic goals.
              </p>
            </div>
            <div className='bg-[#3553b5] bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 cursor-pointer'>
              <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mb-6 mx-auto'>
                <svg
                  className='w-8 h-8'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-center'>
                Social & Professional Events
              </h3>
              <p className='text-center leading-relaxed'>
                Connect with fellow engineering students through networking
                events, industry talks, social gatherings, and professional
                development workshops that prepare you for your future career.
              </p>
            </div>
          </div>
          <div className='bg-[#3553b5] bg-opacity-5 rounded-3xl p-8 md:p-12 backdrop-blur-sm mb-16'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
              <div>
                <h3 className='text-3xl font-bold mb-6'>
                  Meet Our Executive Committee
                </h3>
                <div className='space-y-6'>
                  <div className='flex items-center'>
                    <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mr-4'>
                      <span className='font-bold text-lg'>A</span>
                    </div>
                    <div>
                      <h4 className='text-xl font-semibold'>
                        Ahmed Al-Mansoori
                      </h4>
                      <p className='text-blue-100'>President</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mr-4'>
                      <span className='font-bold text-lg'>S</span>
                    </div>
                    <div>
                      <h4 className='text-xl font-semibold'>Sarah Khan</h4>
                      <p className='text-blue-100'>Vice President</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mr-4'>
                      <span className='font-bold text-lg'>M</span>
                    </div>
                    <div>
                      <h4 className='text-xl font-semibold'>Mohammed Hassan</h4>
                      <p className='text-blue-100'>Academic Affairs Director</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center mr-4'>
                      <span className='font-bold text-lg'>L</span>
                    </div>
                    <div>
                      <h4 className='text-xl font-semibold'>Layla Ibrahim</h4>
                      <p className='text-blue-100'>Social & Events Director</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='relative'>
                {/* <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur opacity-30 animate-pulse"></div> */}
                <div className='relative bg-[#3553b5] bg-opacity-10 backdrop-blur-sm rounded-3xl p-8'>
                  <img
                    src='https://placehold.co/600x400/3b82f6/ffffff?text=Executive+Committee'
                    alt='Executive Committee'
                    className='w-full h-auto rounded-2xl shadow-2xl'
                  />
                  <div className='mt-6 text-center'>
                    <p className='text-lg'>
                      Our dedicated team working to enhance your engineering
                      student experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Academic Programs */}
      {selectedProgram && (
        <div className='fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/60 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Header with Image */}
            <div className='relative'>
              <Image
                src={selectedProgram.image}
                alt={selectedProgram.name}
                width={600}
                height={300}
                className='w-full h-64 object-cover rounded-t-2xl'
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/600x400/6b7280/ffffff?text=No+Image';
                }}
              />
              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl flex items-end p-6'>
                <h3 className='text-3xl font-bold text-white drop-shadow-lg'>
                  {selectedProgram.name}
                </h3>
              </div>
              {/* Close button */}
              <button
                onClick={closeModal}
                className='cursor-pointer absolute top-4 right-4 bg-white/90 text-gray-800 rounded-full p-2 shadow hover:bg-white transition'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className='p-6 space-y-8'>
              {/* Program Description */}
              <section>
                <h4 className='flex items-center text-xl font-semibold text-[#023f8a] mb-3'>
                  <svg
                    className='w-6 h-6 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Program Description
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {selectedProgram.details.description}
                </p>
              </section>
              {/* Advantages */}
              <section>
                <h4 className='flex items-center text-xl font-semibold text-[#023f8a] mb-3'>
                  <svg
                    className='w-6 h-6 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Advantages of the Program
                </h4>
                <ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {selectedProgram.details.advantages.map(
                    (advantage, index) => (
                      <li
                        key={index}
                        className='flex items-start text-gray-700 bg-gray-50 p-3 rounded-lg'
                      >
                        <svg
                          className='w-5 h-5 mr-2 text-green-600 mt-0.5 flex-shrink-0'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {advantage}
                      </li>
                    )
                  )}
                </ul>
              </section>
              {/* Job Opportunities */}
              <section>
                <h4 className='flex items-center text-xl font-semibold text-[#023f8a] mb-3'>
                  <svg
                    className='w-6 h-6 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                  Job Opportunities
                </h4>
                <ul className='space-y-2'>
                  {selectedProgram.details.opportunities.map(
                    (opportunity, index) => (
                      <li
                        key={index}
                        className='flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg'
                      >
                        <svg
                          className='w-4 h-4 mr-2 text-[#023f8a]'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        {opportunity}
                      </li>
                    )
                  )}
                </ul>
              </section>
              {/* Curriculum Link */}
              <div className='pt-6 border-t text-center'>
                <a
                  href={selectedProgram.details.curriculumLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center bg-[#023f8a] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-300 font-medium shadow'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                  View Full Curriculum & Regulations
                </a>
                <p className='text-sm text-gray-500 mt-2'>Opens in a new tab</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for News */}
      {selectedNews && (
        <div className='fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn'>
            <div className='relative'>
              <Image
                src={selectedNews.image}
                alt={selectedNews.title}
                width={400}
                height={256}
                className='w-full h-64 object-cover rounded-t-2xl'
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/400x250/6b7280/ffffff?text=No+Image';
                }}
              />
              <button
                onClick={closeModal}
                className='cursor-pointer absolute top-4 right-4 bg-white rounded-full p-2 shadow hover:bg-gray-100 transition'
              >
                <svg
                  className='w-6 h-6 text-gray-700'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='p-6'>
              <div className='flex items-center mb-3'>
                <span className='bg-[#023f8a] text-white text-xs font-medium px-3 py-1 rounded-full'>
                  {selectedNews.date}
                </span>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                {selectedNews.title}
              </h3>
              <p className='text-gray-700 leading-relaxed'>
                {selectedNews.details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Event */}
      {selectedEvent && (
        <div className='fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/40 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
            {/* ØµÙˆØ±Ø© + Ø²Ø± Ø§Ù„Ø¥ØºÙ„Ø§Ù‚ */}
            <div className='relative'>
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                width={600}
                height={300}
                className='w-full h-72 object-cover rounded-t-2xl'
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/600x400/6b7280/ffffff?text=Event+Image';
                }}
              />
              <button
                onClick={closeModal}
                className='absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-md hover:bg-gray-200 transition'
              >
                <svg
                  className='w-6 h-6 text-gray-700'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='p-6 space-y-6'>
              {/* type */}
              <div className='flex items-center gap-3'>
                <span className='bg-[#023f8a] text-white text-xs font-semibold px-3 py-1 rounded-full'>
                  {selectedEvent.type}
                </span>
                <span className='text-gray-500 text-sm'>
                  {selectedEvent.date}
                </span>
              </div>
              {/* Title */}
              <h3 className='text-2xl font-bold text-gray-900'>
                {selectedEvent.title}
              </h3>
              {/* Time & Location + Tags */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>
                    Time & Location
                  </h4>
                  <div className='space-y-2 text-sm text-gray-600'>
                    <div className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      {selectedEvent.time}
                    </div>
                    <div className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                      </svg>
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-800 mb-2'>Tags</h4>
                  <div className='flex flex-wrap gap-2'>
                    {selectedEvent.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className='bg-[#023f8a]/10 text-[#023f8a] text-xs font-medium px-3 py-1 rounded-full'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Description
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {selectedEvent.description}
                </p>
              </div>
              <div>
                <h4 className='font-semibold text-gray-800 mb-2'>
                  Featured Speakers
                </h4>
                <ul className='space-y-1'>
                  {selectedEvent.speakers.map((speaker, idx) => (
                    <li
                      key={idx}
                      className='text-gray-700 text-sm flex items-center'
                    >
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {speaker}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t'>
                <button className='flex-1 bg-[#023f8a] text-white py-2.5 rounded-lg hover:bg-[#012d66] transition font-medium text-sm'>
                  Register Now
                </button>
                <button className='flex-1 bg-white text-[#023f8a] border border-[#023f8a] py-2.5 rounded-lg hover:bg-[#023f8a]/10 transition font-medium text-sm'>
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Gallery */}
      {selectedGalleryItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'>
          <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden'>
            <div className='relative w-full h-64 md:h-80'>
              <Image
                src={selectedGalleryItem.image}
                alt={selectedGalleryItem.title}
                fill
                className='object-cover rounded-t-2xl'
              />
              <button
                onClick={closeModal}
                className='cursor-pointer absolute top-4 right-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            <div className='p-6 space-y-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <span className='bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full'>
                  {selectedGalleryItem.category}
                </span>
                <span className='text-gray-500 text-sm'>
                  {selectedGalleryItem.date}
                </span>
              </div>
              <h3 className='text-3xl font-bold text-gray-900 dark:text-gray-100'>
                {selectedGalleryItem.title}
              </h3>
              <div className='flex items-center text-gray-500 text-sm gap-1'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
                {selectedGalleryItem.location}
              </div>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                {selectedGalleryItem.description}
              </p>
              <button className='mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors w-full cursor-pointer'>
                Explore More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Student Activity */}
      {selectedActivity && (
        <div className='fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/60 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
            {/* Header with Image */}
            <div className='relative'>
              <Image
                src={selectedActivity.image}
                alt={selectedActivity.title}
                width={600}
                height={300}
                className='w-full h-64 object-cover rounded-t-2xl'
                onError={e => {
                  (e.target as HTMLImageElement).src =
                    'https://placehold.co/600x400/6b7280/ffffff?text=No+Image';
                }}
              />
              {/* Overlay */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl flex items-end p-6'>
                <h3 className='text-3xl font-bold text-white drop-shadow-lg'>
                  {selectedActivity.title}
                </h3>
              </div>
              {/* Close button */}
              <button
                onClick={closeModal}
                className='cursor-pointer absolute top-4 right-4 bg-white/90 text-gray-800 rounded-full p-2 shadow hover:bg-white transition'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
            {/* Content */}
            <div className='p-6 space-y-8'>
              {/* Activity Category and Date */}
              <div className='flex flex-wrap items-center gap-4'>
                <span className='bg-[#023f8a]/10 text-[#023f8a] text-sm font-medium px-3 py-1 rounded-full'>
                  {selectedActivity.category}
                </span>
                <span className='text-gray-500 text-sm'>
                  {selectedActivity.date}
                </span>
              </div>

              {/* Activity Description */}
              <section>
                <h4 className='text-xl font-semibold text-[#023f8a] mb-3'>
                  About This Activity
                </h4>
                <p className='text-gray-700 leading-relaxed'>
                  {selectedActivity.details}
                </p>
              </section>

              {/* Key Highlights */}
              <section>
                <h4 className='flex items-center text-xl font-semibold text-[#023f8a] mb-3'>
                  <svg
                    className='w-6 h-6 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Key Highlights
                </h4>
                <ul className='space-y-3'>
                  {selectedActivity.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className='flex items-start text-gray-700 bg-gray-50 p-4 rounded-lg'
                    >
                      <svg
                        className='w-5 h-5 mr-3 text-green-600 mt-0.5 flex-shrink-0'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='leading-relaxed'>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Benefits */}
              <section>
                <h4 className='flex items-center text-xl font-semibold text-[#023f8a] mb-3'>
                  <svg
                    className='w-6 h-6 mr-2'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                      clipRule='evenodd'
                    />
                  </svg>
                  What You'll Gain
                </h4>
                <div className='bg-blue-50 p-6 rounded-xl'>
                  <ul className='space-y-2 text-gray-700'>
                    <li className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Practical skills in{' '}
                      {selectedActivity.category.toLowerCase()}
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Networking opportunities with peers and professionals
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Hands-on experience applying engineering concepts
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='w-4 h-4 mr-2 text-[#023f8a]'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Leadership and teamwork development
                    </li>
                  </ul>
                </div>
              </section>

              {/* Call to Action */}
              <div className='pt-6 border-t text-center'>
                <button
                  onClick={closeModal}
                  className='inline-flex items-center bg-[#023f8a] text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-300 font-medium shadow'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 17h5l-5 5v-5zM4 18l2-2M2 12h20M2 6l2 2'
                    />
                  </svg>
                  Participate in This Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default App;
