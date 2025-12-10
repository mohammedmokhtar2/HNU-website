import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- DATA FROM YOUR INDEX.TS (Embedded) ---

const heroSection = {
  title: { en: 'Welcome to HNU Official Website', ar: ' مرحبًا بكم في الموقع الرسمي لجامعة حلوان الاهلية' },
  description: { en: 'Discover excellence in education, innovation, and community...', ar: 'اكتشف التميز في التعليم والابتكار والمجتمع...' },
  image: '/home.jpeg',
};

const aboutSection = {
  title: { en: 'About Us', ar: 'ماذا عنا' },
  description: { en: 'Helwan National University is dedicated to fostering innovation...', ar: 'تكرس جامعة حلوان جهودها لتعزيز الابتكار...' },
};

const factsAndNumbers = {
  items: [
    { label: { ar: 'الطلاب', en: 'Students' }, number: { ar: '١٥,٠٠٠', en: '15000' } },
    { label: { ar: 'البرامج', en: 'Programs' }, number: { ar: '٢٥', en: '25' } },
    { label: { ar: 'الشركاء', en: 'Partners' }, number: { ar: '٣', en: '3' } },
  ]
};

const topNewsItems = [
  {
    title: { ar: 'الجامعة الاهلية لحلوان تتصدر التصنيفات', en: 'HNU Ranks #1 in National University Rankings' },
    description: { ar: 'تم تصنيف الجامعة الاهلية لحلوان في المرتبة الأولى...', en: 'Helwan National University has been ranked first...' },
    image: '/home.jpeg',
    date: new Date('2024-03-10'),
    slug: 'hnu-ranks-1'
  },
  {
    title: { ar: 'مركز بحثي جديد للذكاء الاصطناعي', en: 'New Research Center for AI' },
    description: { ar: 'يسرنا الإعلان عن افتتاح مركزنا البحثي...', en: 'We are excited to announce the opening...' },
    image: '/home.jpeg',
    date: new Date('2024-03-08'),
    slug: 'new-ai-center'
  }
];

const topEventsItems = [
  {
    title: { en: 'Annual Science Fair 2024', ar: 'المعرض العلمي السنوي ٢٠٢٤' },
    description: { en: 'Join us for the biggest science exhibition...', ar: 'انضم إلينا في أكبر معرض علمي...' },
    image: '/home.jpeg',
    date: new Date('2024-03-15'),
    slug: 'science-fair-2024'
  }
];

const facultiesData = [
  { id: 'cs', slug: 'computer-science-engineering', name: { en: 'Faculty of Computer Science & IT', ar: 'كلية علوم الحاسوب وتكنولوجيا المعلومات' }, type: 'TECHNICAL' },
  { id: 'eng-cs', slug: 'engineering', name: { en: 'Faculty of Engineering', ar: 'كلية الهندسة' }, type: 'TECHNICAL' },
  { id: 'business-admin', slug: 'business', name: { en: 'Faculty of Business', ar: 'كلية التجارة وإدارة الأعمال' }, type: 'OTHER' },
  { id: 'medicine', slug: 'medicine', name: { en: 'Faculty of Medicine', ar: 'كلية الطب البشري' }, type: 'MEDICAL' },
  { id: 'dentistry', slug: 'dentistry', name: { en: 'Faculty of Dentistry', ar: 'كلية طب الأسنان' }, type: 'MEDICAL' },
  { id: 'applied-health', slug: 'applied-health-sciences-technology', name: { en: 'Faculty of Applied Health Sciences', ar: 'كلية العلوم الصحية التطبيقية' }, type: 'MEDICAL' },
  { id: 'physical-therapy', slug: 'Faculty-of-Physical-Therapy', name: { en: 'Faculty of Physical Therapy', ar: 'كلية العلاج الطبيعي' }, type: 'MEDICAL' },
  { id: 'arts', slug: 'Faculty-of-Arts-and-Applied-Arts', name: { en: 'Faculty of Arts & Applied Arts', ar: 'كلية الفنون والفنون التطبيقية' }, type: 'ARTS' },
  { id: 'sciences', slug: 'science', name: { en: 'Faculty of Science', ar: 'كلية العلوم' }, type: 'OTHER' },
  { id: 'law', slug: 'law', name: { en: 'Faculty of Law', ar: 'كلية الحقوق' }, type: 'OTHER' },
];

async function main() {
  console.log('🗑️  Cleaning old data...');
  // Delete existing data to prevent duplicates (Order matters!)
  await prisma.section.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.blogs.deleteMany({});
  await prisma.college.deleteMany({});
  
  console.log('🌱 Starting Full Autofill...');

  // 1. Create University
  const university = await prisma.university.upsert({
    where: { slug: 'hnu' },
    update: {},
    create: {
      slug: 'hnu',
      name: { en: "Helwan National University", ar: "جامعة حلوان الأهلية" },
      config: {},
    },
  });

  // 2. Create Sections (Hero, About, Numbers, Activities)
  await prisma.section.createMany({
    data: [
      {
        universityId: university.id,
        type: 'HERO',
        order: 1,
        title: heroSection.title,
        content: { en: heroSection.description.en, ar: heroSection.description.ar },
        mediaUrl: { en: heroSection.image, ar: heroSection.image }
      },
      {
        universityId: university.id,
        type: 'ABOUT',
        order: 2,
        title: aboutSection.title,
        content: { en: aboutSection.description.en, ar: aboutSection.description.ar },
      },
      {
        universityId: university.id,
        type: 'NUMBERS', // Mapping FactsAndNumbers
        order: 3,
        content: factsAndNumbers.items as any, // Storing array as JSON
      },
      {
        universityId: university.id,
        type: 'STUDENT_ACTIVITIES', // Mapping Student Activities
        order: 4,
        content: { note: "Imported from index.ts" }, // Placeholder for now
      }
    ]
  });

  // 3. Create Blogs (News)
  for (const news of topNewsItems) {
    await prisma.blogs.create({
      data: {
        slug: news.slug,
        title: news.title,
        content: news.description,
        image: [news.image],
        universityId: university.id,
        isEvent: false,
        publishedAt: news.date,
      }
    });
  }

  // 4. Create Events
  for (const event of topEventsItems) {
    await prisma.blogs.create({
      data: {
        slug: event.slug,
        title: event.title,
        content: event.description,
        image: [event.image],
        universityId: university.id,
        isEvent: true,
        publishedAt: event.date,
      }
    });
  }

  // 5. Create Colleges & Programs
  for (const f of facultiesData) {
    const college = await prisma.college.create({
      data: {
        slug: f.slug,
        name: f.name,
        type: f.type as any,
        universityId: university.id,
        // Create a default Hero section for the college page
        sections: {
            create: {
                type: 'HERO',
                order: 1,
                title: f.name,
                content: { en: "Welcome to the faculty.", ar: "مرحبًا بكم في الكلية." }
            }
        },
        // Create a dummy Program so the list isn't empty
        programs: {
            create: {
                name: { en: "General Program", ar: "البرنامج العام" },
                config: {}
            }
        }
      }
    });
  }

  console.log('✅ Database fully synced with index.ts data!');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); })