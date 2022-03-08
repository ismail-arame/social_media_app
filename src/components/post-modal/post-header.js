import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPostModalOpen } from '../../redux/post-modal/post-modal.actions';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function PostModalHeader({
  postUserUsername,
  postUserFullName,
  postUserProfileImageSrc,
  activeBtnFollow,
  isFollowingProfile,
  handleToggleFollow,
}) {
  const dispatch = useDispatch();
  const [isLazyLoading, setLazyLoading] = useState(false);

  return (
    <header className="flex items-center h-8 border-b border-gray-lightweight py-8 px-4">
      <div
        className={`w-11 h-11 rounded-full mr-4 transition-colors ${
          isLazyLoading ? 'bg-gray-lazy2 animate-pulse-faster' : ''
        }`}
      >
        <LazyLoadImage
          width="100%"
          height="100%"
          effect="blur"
          src={postUserProfileImageSrc}
          alt={`${postUserUsername} img`}
          className="rounded-full w-full h-full border border-gray-lightweight object-cover"
          beforeLoad={() => setLazyLoading(true)}
          afterLoad={() => setLazyLoading(false)}
          onError={e => {
            e.target.src = '/images/avatars/default.png';
          }}
        />
      </div>
      <div className="flex flex-col justify-center mr-5">
        <Link
          to={`/p/${postUserUsername}`}
          onClick={() => dispatch(setPostModalOpen())}
        >
          <p className=" font-semibold text-sm text-black-light">
            {postUserUsername}
          </p>
        </Link>
        <p className="text-xs text-gray-light">{postUserFullName}</p>
      </div>
      <div className="flex items-center">
        {activeBtnFollow ? (
          <>
            <div
              className={`mr-1 ${isFollowingProfile ? '' : 'text-blue-light'}`}
            >
              •
            </div>
            <button
              className={`font-semibold text-sm rounded ${
                isFollowingProfile
                  ? 'text-black-light w-16'
                  : 'text-blue-light w-12'
              } h-8 tracking-wide`}
              type="button"
              onClick={handleToggleFollow}
            >
              {isFollowingProfile ? 'Following' : 'Follow'}
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
