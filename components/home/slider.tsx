import Image from 'next/image';
import Marquee from 'react-fast-marquee';

import type { TopNewsItem } from '@/components/home/TopNews';

interface NewsCardProps {
  news: TopNewsItem;
  local: string;
}

interface NewsMarqueeProps {
  items: TopNewsItem[];
  local: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, local }) => (
  <div className='mx-6 w-[320px] md:w-[410px] h-[360px] group relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all overflow-hidden hover:-translate-y-1 flex flex-col'>
    <div className='relative h-[200px] w-full overflow-hidden'>
      <Image
        src={news.image}
        alt={local === 'ar' ? news.title.ar : news.title.en}
        fill
        className='object-cover transition-transform duration-300 group-hover:scale-105'
      />
    </div>

    <div className='relative flex-1 p-4 flex flex-col'>
      <h3 className='text-lg font-bold text-gray-800 group-hover:text-[#023e8a] transition-colors'>
        {local === 'ar' ? news.title.ar : news.title.en}
      </h3>
      <p className='text-sm text-gray-500 mt-1'>
        {local === 'ar' ? news.author.ar : news.author.en} •{' '}
        {local === 'ar' ? news.date.ar : news.date.en}
      </p>

      <a
        href={`/news/${news.id}`}
        className='absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] px-4 py-2 text-sm font-medium text-white bg-[#023e8a] rounded-lg hover:bg-[#0353a4] transition-colors text-center'
      >
        {local === 'ar' ? 'اقرأ المزيد' : 'Read More'}
      </a>
    </div>
  </div>
);

export default function NewsMarquee({ items, local }: NewsMarqueeProps) {
  return (
    <section
      className='flex flex-col items-center justify-center gap-12 py-14 overflow-hidden'
      dir='ltr'
    >
      <Marquee
        pauseOnHover
        speed={30}
        gradient={false}
        direction={local === 'ar' ? 'right' : 'left'}
      >
        {items.map(item => (
          <NewsCard news={item} local={local} key={item.id} />
        ))}
      </Marquee>
    </section>
  );
}
