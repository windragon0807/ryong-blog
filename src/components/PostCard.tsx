import { Post } from '@/service/posts';
import Image from 'next/image';
import Link from 'next/link';

type Props = { post: Post };
export default function PostCard({
  post: { title, description, date, category, path },
}: Props) {
  return (
    // NOTE_1
    <Link href={`/posts/${path}`}>
      <article className='rounded-md overflow-hidden shadow-lg'>
        <Image
          className='w-full'
          src={`/images/posts/${path}.png`}
          alt={title}
          width={300}
          height={200}
        />
        <div className='flex flex-col items-center p-4'>
          <time className='self-end'>{date.toString()}</time>
          <h3 className='text-lg font-bold'>{title}</h3>
          <p className='w-full truncate text-center'>{description}</p>
          <span className='text-sm rounded-lg bg-green-100 px-2 my-2'>
            {category}
          </span>
        </div>
      </article>
    </Link>
  );
}

/** [ NOTE_1 ]
 * 같은 의미 단위 묶음 => <article> 사용
 * 시간 및 일자 표현 => <time> 사용
 * 제목 => <h3> 사용
 * 메인 설명 => <p> 사용
 * 꾸며진 단어 단위 => <span> 사용
 */