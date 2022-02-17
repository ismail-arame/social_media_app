//Followed user photos

import { useState, useEffect, useContext } from 'react';
// import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import { getPhotos, getUserByUserId } from '../services/firebase';

export default function usePhotos() {
  const [photos, setPhotos] = useState(null);
  // const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);

  const { uid: userId } = user;

  useEffect(() => {
    async function getTimelinePhotos(userId) {
      //destructring the array then destructuring Object =>  [{following: [...],  ...others}]
      const [{ following }] = await getUserByUserId(userId);
      let followedUserPhotos = [];

      //does the user actually follow people ?
      if (following.length > 0) {
        followedUserPhotos = await getPhotos(userId, following);
        setPhotos(followedUserPhotos);
      } else {
        //if the active user have not followed anyone we have to stop the skeleton loading and tell him to follow people
        setPhotos([]);
      }
    }

    console.log(userId);
    if (userId) getTimelinePhotos(userId);
  }, [userId]);

  return { photos }; //ES6 => {photos: photos}
}
