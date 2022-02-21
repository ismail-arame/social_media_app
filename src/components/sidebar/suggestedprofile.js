import { useState } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
} from '../../services/firebase';

import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function SuggestedProfile({
  profileDocId, //suggested Profile Do Id
  loggedInUserDocId, //active User Doc Id
  username,
  fullName,
  profileId, // userId of the Profile suggested
  loggedInUserId, // userId of the Active User
  profileImageSrc, //profile Image
}) {
  //if we followed a suggested user we wanna re render using State HOOK to remove the followed user from the suggested Sidebar
  const [followed, setFollowed] = useState(false);

  async function handleFollowedUser() {
    setFollowed(true);

    //the current statte of followed value is (false) because the new state (true) will be applied to the next render

    //current state => (followed = false)
    // console.log(followed); // => false
    //update the loggedIn User Following array
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    //update the Followed User Followers array
    await updateFollowedUserFollowers(profileDocId, loggedInUserId, false);
  }

  const [isLazyLoading, setLazyLoading] = useState(false);

  return !followed ? (
    <div className="rounded flex flex-row items-center justify-between">
      <div className="flex items-center justify-between">
        <div
          className={`rounded-full w-9 h-9 mr-3 transition-colors  ${
            isLazyLoading ? 'bg-gray-lazy2 animate-pulse-faster' : ''
          }`}
        >
          <LazyLoadImage
            width="100%"
            height="100%"
            effect="opacity"
            src={profileImageSrc}
            alt="user profile"
            className="rounded-full w-full h-full flex object-cover border border-gray-transparent"
            beforeLoad={() => setLazyLoading(true)}
            afterLoad={() => setLazyLoading(false)}
            onError={e => {
              e.target.src = '/images/avatars/default.png';
            }}
          />
        </div>
        <div className="flex flex-col justify-center">
          <Link to={`/p/${username}`}>
            <p className=" font-semibold text-sm text-black-light">
              {username}
            </p>
          </Link>
          <p className="text-xs text-gray-light">{fullName}</p>
        </div>
      </div>
      <button
        type="button"
        className="rounded text-xs font-bold text-blue-light"
        onClick={handleFollowedUser}
      >
        Follow
      </button>
    </div>
  ) : null;
}

SuggestedProfile.propTypes = {
  profileDocId: propTypes.string.isRequired,
  loggedInUserDocId: propTypes.string.isRequired,
  username: propTypes.string.isRequired,
  fullName: propTypes.string.isRequired,
  profileId: propTypes.string.isRequired,
  loggedInUserId: propTypes.string.isRequired,
};
