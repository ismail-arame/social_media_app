import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { getSuggestedProfiles } from '../../services/firebase';
import 'react-loading-skeleton/dist/skeleton.css';
import SuggestionSkeleton from './suggestions.skeleton';
// import { Link } from 'react-router-dom';
import SuggestedProfile from './suggestedprofile';

export default function Suggestions({
  loggedInUserId,
  following,
  loggedInUserDocId,
}) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function suggestedProfilesAsync() {
      const response = await getSuggestedProfiles(loggedInUserId, following);
      setProfiles(response);
    }
    if (loggedInUserId) suggestedProfilesAsync();
  }, [loggedInUserId, following]);

  return !profiles ? (
    <div className="flex flex-col">
      <SuggestionSkeleton />
      <SuggestionSkeleton />
      <SuggestionSkeleton />
      <SuggestionSkeleton />
      <SuggestionSkeleton />
    </div>
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col ">
      <div className="text-sm flex items-center align-items justify-between mb-2 mt-3.5">
        <p className="font-bold text-md text-black-light">
          Suggestions For You
        </p>
      </div>
      <div className=" mt-2.5 grid gap-5">
        {profiles
          .filter((_, index) => index < 5)
          .map(profile => {
            return (
              <SuggestedProfile
                key={profile.docId}
                profileDocId={profile.docId}
                username={profile.username}
                fullName={profile.fullName}
                profileId={profile.userId} // userId of the Profile suggested
                loggedInUserId={loggedInUserId} // userId of the Active User
                loggedInUserDocId={loggedInUserDocId}
              />
            );
          })}
      </div>
    </div>
  ) : null;
}

Suggestions.propTypes = {
  loggedInUserId: propTypes.string,
  following: propTypes.array,
  loggedInUserDocId: propTypes.string,
};

//<div
// key={profile.userId}
// className=" grid grid-cols-6 gap-0.5 justify-items-start items-center"
// >
// <div className=" col-span-1">
//   <img
//     src={`/images/avatars/${profile.username}.jpg`}
//     alt={`${profile.username} profile`}
//     className="rounded-full w-full"
//   />
// </div>
// <div className="col-span-4 flex flex-col justify-center">
//   <p className="text-sm font-bold text-black-light">
//     {profile.username}
//   </p>
//   <p className="text-xs text-gray-primary">{profile.fullName}</p>
// </div>
// <div className=" col-span-1">
//   <button
//     type="button"
//     className=" font-bold text-xs rounded inline-block text-blue-light w-20 h-8"
//   >
//     Follow
//   </button>
// </div>
// </div>

//<div className="flex flex-col justify-center">
// <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
// <p>
//   <Skeleton count={2} height={15} className=" mb-0.5" />
// </p>
// </SkeletonTheme>
// </div>
