import { memo, useState } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { LazyLoadImage } from 'react-lazy-load-image-component';

//showing nice layout of Skeleton when username and fullName are not defined
const User = ({ username, fullName, profileImageSrc }) => {
  const [isLazyLoading, setLazyLoading] = useState(false);

  return !username || !fullName ? (
    <div className="grid grid-cols-4 gap-4  mb-12 items-center">
      <div className=" flex justify-between items-center col-span-1">
        <Skeleton count={1} height={61} width={61} circle="true" />
      </div>
      <div className=" col-span-3">
        <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
          <p>
            <Skeleton count={2} height={20} className=" mb-0.5" />
          </p>
        </SkeletonTheme>
      </div>
    </div>
  ) : (
    <Link
      to={`/p/${username}`}
      className="rounded flex items-center justify-start mb-6"
    >
      <div className=" flex items-center justify-between">
        <div
          className={`w-14 h-14 mr-3 rounded-full transition-colors  ${
            isLazyLoading ? 'bg-gray-lazy2 animate-pulse-faster' : ''
          }`}
        >
          <LazyLoadImage
            width="100%"
            height="100%"
            effect="blur"
            src={profileImageSrc}
            alt={`${username} profile`}
            className="rounded-full w-full h-full flex border border-gray-transparent object-cover"
            beforeLoad={() => setLazyLoading(true)}
            afterLoad={() => setLazyLoading(false)}
            onError={e => {
              e.target.src = '/images/avatars/default.png';
            }}
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-md text-black-light font-bold">{username}</p>
          <p className=" text-sm text-gray-light">{fullName}</p>
        </div>
      </div>
    </Link>
  );
};

//saving re renders with memo because we're passing the same props to User component
export default memo(User);

//PropTypes are a mechanism to ensure that components use the correct data type and pass the right data, and that components use the right type of props, and that receiving components receive the right type of props.17 août 2020
User.propTypes = {
  username: propTypes.string,
  fullName: propTypes.string,
};

//to Track Functional components
// User.whyDidYouRender = true;
