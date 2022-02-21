import propTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

//lazy loaded Images
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useState } from 'react';

export default function Photos({ photos }) {
  console.log('photos', photos);
  const [isLazyLoading, setLazyLoading] = useState(false);
  return (
    <div className="h-16 border-t border-gray-primary mt-12 pt-4">
      <div className="grid grid-cols-3 gap-8 mt-4 mb-12">
        {!photos ? (
          <>
            {[...new Array(6)].map((_, index) => (
              <SkeletonTheme
                key={index}
                baseColor="#f1f3f5"
                highlightColor="#FAFAFA"
              >
                <p>
                  <Skeleton
                    count={1}
                    className="w-full"
                    height={350}
                    borderRadius={0}
                    duration={1}
                  />
                </p>
              </SkeletonTheme>
            ))}
          </>
        ) : photos.length > 0 ? (
          photos.map(photo => (
            <div key={photo.docId} className=" relative group">
              <div
                className={`w-full h-80 transition-colors  ${
                  isLazyLoading ? 'bg-gray-lazy2 animate-pulse-faster' : ''
                }`}
              >
                <LazyLoadImage
                  src={photo.imageSrc}
                  alt={photo.caption}
                  className="object-cover h-full w-full"
                  width="100%"
                  height="100%"
                  effect="blur"
                  threshold={350}
                  beforeLoad={() => setLazyLoading(true)}
                  afterLoad={() => setLazyLoading(false)}
                />
              </div>
              <div className="absolute bottom-0 left-0 bg-gray-200 z-10 h-full w-full justify-center items-center bg-black-faded group-hover:flex hidden cursor-pointer">
                <p className=" font-bold text-white flex items-center mr-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-8 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {photo.likes.length}
                </p>
                <p className="flex items-center text-white font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-8 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {photo.comments.length}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-2xl font-semibold">
            No Posts Yet
          </p>
        )}
      </div>
    </div>
  );
}

Photos.propTypes = {
  photos: propTypes.array,
};
