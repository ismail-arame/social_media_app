import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
  try {
    const result = await firebase
      .firestore()
      .collection('users')
      .where('username', '==', username.toLowerCase().trim())
      .get();

    return result.docs.length > 0;
  } catch (error) {
    console.log(error.message);
  }
}

//get user from the firestore where the userId === userId (passed from the authUser)
export async function getUserByUserId(userId) {
  //we need a function that we can call (firebase service) that gets the user data based on the id
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .get();

  //item => user document (the one we queried for using the uid (ID))
  //docId => very helpful when dealing with CRUD Operations
  const user = result.docs.map(item => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

//get Suggested Profiles

//we don't wanna suggest to the user the profiles that he already following
export async function getSuggestedProfiles(userId, following) {
  let query = firebase.firestore().collection('users');

  //we wanna query only for the documents which thier userId doesn't exist in the array of the active user followings and the activeUserId [...following, userId]
  if (following.length > 0)
    query = query.where('userId', 'not-in', [...following, userId]);
  else {
    query = query.where('userId', '!=', userId);
  }

  const result = await query.limit(10).get();

  const suggestedProfiles = result.docs.map(profile => {
    return {
      ...profile.data(),
      docId: profile.id,
    };
  });

  return suggestedProfiles;
}

//The where() method takes three parameters: a field to filter on, a comparison operator, and a value.

//other method for getting Suggested Users
// export async function getSuggestedProfiles(userId, following) {
//   const result = await firebase.firestore().collection('users').limit(10).get();

//   return result.docs
//     .map(profile => {
//       return {
//         ...profile.data(),
//         docId: profile.id,
//       };
//     })
//     .filter(
//       profile =>
//         profile.userId !== userId && !following.includes(profile.userId)
//     );
// }

//update the LoggedIn User Following
//go to the document Id of the Active User and updating the Following array of the active User with the Profile Suggested Id
export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id (karl's profile)
  profileId, // the user Id that Active User requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
  //if the active user is already following the profile we wanna UnFollow by removing the profileId from the Following array of the Active User
}

//update the Followed User Followers
//go to the document Id of the Followed User and updating the Followers array of the Followed User with the Active User Id
export async function updateFollowedUserFollowers(
  profileDocId, //Followed Suggested Profile document id
  loggedInUserId, // the Id of the Active User
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserId)
        : FieldValue.arrayUnion(loggedInUserId),
    });
}

//getting photos of the people the active user Followed
export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .orderBy('dateCreated')
    .limit(1)
    .get();

  const userFollowedPhotos = result.docs.map(photo => {
    return {
      ...photo.data(),
      docId: photo.id,
    };
  });
  const lastDoc = result.docs[result.docs.length - 1]; //Infinite Scrolling

  //if you wanna await within a map use Promise.all
  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async photo => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) userLikedPhoto = true;

      //in the header of the Post we wanna display the owner of the Post
      //in the firestore photos schema there is not the username of the Post owner
      //user = [{username: ..., fullName:...,  ...others}]
      const [user] = await getUserByUserId(photo.userId);
      const { username } = user;

      return { username, ...photo, userLikedPhoto, lastDoc };
    })
  );

  return photosWithUserDetails;
}

//INFINITE SCROLL

//getting photos of the people the active user Followed
// export async function getPhotos(userId, following) {
//   const result = await firebase
//     .firestore()
//     .collection('photos')
//     .where('userId', 'in', following)
//     .get();

//   const userFollowedPhotos = result.docs.map(photo => {
//     return {
//       ...photo.data(),
//       docId: photo.id,
//     };
//   });
//   // console.log(userFollowedPhotos);

//   //if you wanna await within a map use Promise.all
//   const photosWithUserDetails = await Promise.all(
//     userFollowedPhotos.map(async photo => {
//       let userLikedPhoto = false;
//       if (photo.likes.includes(userId)) userLikedPhoto = true;

//       //in the header of the Post we wanna display the owner of the Post
//       //in the firestore photos schema there is not the username of the Post owner
//       //user = [{username: ..., fullName:...,  ...others}]
//       const [user] = await getUserByUserId(photo.userId);
//       const { username } = user;

//       return { username, ...photo, userLikedPhoto };
//     })
//   );

//   return photosWithUserDetails;
// }
