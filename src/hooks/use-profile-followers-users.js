import { useState, useEffect } from 'react';

import {
  getProfileFollowersUsers,
  getUserByUserId,
} from '../services/firebase';
import { useSelector, shallowEqual } from 'react-redux';
import { selectFollowersModalOpen } from '../redux/followers-modal/followers-modal.selectors';

export default function useProfileFollowersUsers(profileUserId) {
  const followersModalOpen = useSelector(
    selectFollowersModalOpen,
    shallowEqual
  );
  const [profileFollowersUsers, setProfileFollowersUsers] = useState(null);

  useEffect(() => {
    async function getProfileFollowersUsersData() {
      if (followersModalOpen) {
        if (profileFollowersUsers) {
          return;
        } else {
          const [profileUser] = await getUserByUserId(profileUserId);
          console.log('profileUser', profileUser);
          const response = await getProfileFollowersUsers(profileUser.userId);
          setProfileFollowersUsers(response);
        }
      }
    }

    // console.log('userr', user);
    if (profileUserId) getProfileFollowersUsersData();
  }, [profileUserId, followersModalOpen, profileFollowersUsers]);

  return { profileFollowersUsers };
}
