import { useState, useEffect } from 'react';

import {
  getProfileFollowingUsers,
  getUserByUserId,
} from '../services/firebase';
import { useSelector, shallowEqual } from 'react-redux';
import { selectFollowingModalOpen } from '../redux/following-modal/following-modal.selectors';

export default function useProfileFollowingUsers(profileUserId) {
  const followingModalOpen = useSelector(
    selectFollowingModalOpen,
    shallowEqual
  );
  const [profileFollowingUsers, setProfileFollowingUsers] = useState(null);

  useEffect(() => {
    async function getProfileFollowingUsersData() {
      if (followingModalOpen) {
        if (profileFollowingUsers) {
          return;
        } else {
          const [profileUser] = await getUserByUserId(profileUserId);
          console.log('profileUser', profileUser);
          const response = await getProfileFollowingUsers(profileUser.userId);
          setProfileFollowingUsers(response);
        }
      }
    }

    // console.log('userr', user);
    if (profileUserId) getProfileFollowingUsersData();
  }, [profileUserId, followingModalOpen, profileFollowingUsers]);

  return { profileFollowingUsers };
}
