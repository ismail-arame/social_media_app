import propTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState } from 'react';

import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Image({ imageSrc, caption }) {
  const [isLazyLoading, setLazyLoading] = useState(false);
  return (
    <div
      className={`h-[650px] w-full transition-colors ${
        isLazyLoading ? 'bg-gray-lazy opacity-90' : ''
      }`}
    >
      <LazyLoadImage
        src={imageSrc}
        alt="post"
        className=" object-cover h-full w-full bg-gray-base z-20"
        width="100%"
        height="100%"
        effect="blur"
        threshold={280}
        beforeLoad={() => setLazyLoading(true)}
        afterLoad={() => setLazyLoading(false)}
      />
    </div>
  );
}

Image.propTypes = {
  imageSrc: propTypes.string.isRequired,
  caption: propTypes.string.isRequired,
};
// <img src={imageSrc} alt="post" className=" object-cover h-full w-full" />
