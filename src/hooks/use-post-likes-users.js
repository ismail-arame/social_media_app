import { useState, useEffect } from 'react';

import {
  getPostLikesUsers,
  getPhotoByDateCreatedAndImageSrc,
} from '../services/firebase';

import { useSelector, shallowEqual } from 'react-redux';
import { selectLikesModalOpen } from '../redux/likes-modal/likes-modal.selectors';

export default function usePostLikesUsers(dateCreated, imageSrc, activeUserId) {
  const likesModalOpen = useSelector(selectLikesModalOpen, shallowEqual);
  const [postLikesUsers, setPostLikesUsers] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getProfileFollowingUsersData() {
      if (likesModalOpen) {
        setLoading(true);
        const [photo] = await getPhotoByDateCreatedAndImageSrc(
          dateCreated,
          imageSrc,
          activeUserId
        );
        const response = await getPostLikesUsers(photo.likes);
        console.log('response', response);
        setPostLikesUsers(response);
        setLoading(false);
      }
    }

    // console.log('userr', user);
    if (dateCreated && imageSrc && activeUserId) getProfileFollowingUsersData();
  }, [likesModalOpen, dateCreated, imageSrc, activeUserId]);

  return { postLikesUsers, isLoading };
}
