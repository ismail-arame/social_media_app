//Profile user photos

import { useState, useEffect } from 'react';
import { getUserPhotosByUserId } from '../services/firebase';

export default function useProfilePhotos(profileUserId) {
  const [photos, setPhotos] = useState(null);

  useEffect(() => {
    async function getProfilePhotos() {
      let profileUserPhotos = [];

      profileUserPhotos = await getUserPhotosByUserId(profileUserId);
      setPhotos(profileUserPhotos);
    }

    getProfilePhotos();
  }, [profileUserId]);

  return { photos }; //ES6 => {photos: photos}
}
