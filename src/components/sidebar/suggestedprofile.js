import { useState } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
} from '../../services/firebase';

export default function SuggestedProfile({
  profileDocId, //suggested Profile Do Id
  loggedInUserDocId, //active User Doc Id
  username,
  fullName,
  profileId, // userId of the Profile suggested
  loggedInUserId, // userId of the Active User
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

  return !followed ? (
    <div className="rounded flex flex-row items-center justify-between">
      <div className="flex items-center justify-between">
        <img
          src={`/images/avatars/${username}.jpg`}
          alt="user profile"
          className="rounded-full w-9 mr-3 flex"
          onError={e => {
            e.target.src = '/images/avatars/default.png';
          }}
        />
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
