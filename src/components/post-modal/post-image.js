import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function PostModalImage({ imageSrc, username }) {
  const [isLazyLoading, setLazyLoading] = useState(false);
  return (
    <>
      {!imageSrc ? (
        <Skeleton count={1} className="h-full w-full" />
      ) : (
        <div
          className={`h-full w-full transition-colors ${
            isLazyLoading ? 'bg-gray-lazy animate-pulse-faster' : ''
          }`}
        >
          <LazyLoadImage
            src={imageSrc}
            height="100%"
            width="100%"
            effect="blur"
            alt={`${username} post`}
            className=" object-cover h-full w-full bg-gray-base z-20 cursor-pointer"
            beforeLoad={() => setLazyLoading(true)}
            afterLoad={() => setLazyLoading(false)}
          />
        </div>
      )}
    </>
  );
}
