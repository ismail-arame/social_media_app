import { useState } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Header({ username, profileImageSrc }) {
  const [isLazyLoading, setLazyLoading] = useState(false);
  return (
    // <div className="flex border-b border-gray-transparent h-4 p-4 py-8">
    <div className="flex h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className=" flex items-center">
          <div
            className={`rounded-full h-8 w-8 mr-3 transition-colors  ${
              isLazyLoading ? 'bg-gray-lazy2 animate-pulse-faster' : ''
            }`}
          >
            <LazyLoadImage
              width="100%"
              height="100%"
              effect="opacity"
              src={profileImageSrc}
              alt={`${username} profile`}
              className="flex rounded-full h-full w-full object-cover border border-gray-transparent"
              beforeLoad={() => setLazyLoading(true)}
              afterLoad={() => setLazyLoading(false)}
              onError={e => {
                e.target.src = '/images/avatars/default.png';
              }}
            />
          </div>
          <p className="font-semibold text-sm">{username}</p>
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  username: propTypes.string.isRequired,
};
