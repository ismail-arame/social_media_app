import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username.toLowerCase().trim())
    .get();

  return result.docs.length > 0;
}

//Profile Page => checking if the username the active user looking for exist in Firestore or not
export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username.toLowerCase().trim())
    .get();

  return result.docs.map(profile => {
    return {
      ...profile.data(),
      docId: profile.id,
    };
  });
}

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Profile Photos *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//Profile (getting photos of users we search for =>  www.instagram.com/p/username)
export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', userId)
    .orderBy('dateCreated', 'desc')
    .limit(3)
    .get();

  const lastDoc = result.docs[result.docs.length - 1]; //Infinite Scrolling

  //WARNING! : => when building pop up component remember to pass in username and profileImageSrc because you will need it (ismail from the past)
  if (!result.empty) {
    return result.docs.map(item => {
      return {
        ...item.data(),
        docId: item.id,
        lastDoc,
      };
    });
  } else {
    return [];
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

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Following and Followers Functionality *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

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

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Toggle Follow *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//Profile Page Toggling Follow and Unfollow and make changes to Firestore Database
export async function toggleFollow(
  loggedInUserDocId,
  profileUserId,
  profileDocId,
  followingUserId, //loggedInUserId => logged in user is the one that follows the profile User (userFirestore)
  isFollowingProfile
) {
  await updateLoggedInUserFollowing(
    loggedInUserDocId,
    profileUserId,
    isFollowingProfile
  );
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}

//Checking if the Current Logged In User is Following the User Profile searched (wwww.instagram.com/p/Profile)
export async function isUserFollowingProfile() {}

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* TimeLine Photos *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//INFINITE SCROLL
//getting photos of the people the active user Followed
export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .orderBy('dateCreated', 'desc')
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
      const { username, profileImageSrc } = user;

      return { username, profileImageSrc, ...photo, userLikedPhoto, lastDoc };
    })
  );

  //if the active user have not followed anyone we have to stop the skeleton loading and tell him to follow people

  if (photosWithUserDetails) {
    return photosWithUserDetails;
  } else {
    //  => if the user follow people that have no posts we returned an empty array []
    return [];
  }
}

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Post Modal Photo *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//Data needed for a specific Post Modal based on dateCreated and imageSrc
export async function getPhotoByDateCreatedAndImageSrc(
  dateCreated,
  imageSrc,
  activeUserId
) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('dateCreated', '==', dateCreated)
    .where('imageSrc', '==', imageSrc)
    .get();

  const userPostPhoto = result.docs.map(photo => {
    return {
      ...photo.data(),
      docId: photo.id,
    };
  });

  const photosWithUserDetails = await Promise.all(
    userPostPhoto.map(async photo => {
      let userLikedPhoto = false;
      if (photo.likes.includes(activeUserId)) userLikedPhoto = true;

      //in the header of the Post we wanna display the owner of the Post
      //in the firestore photos schema there is not the username of the Post owner
      //user = [{username: ..., fullName:...,  ...others}]
      const [user] = await getUserByUserId(photo.userId);
      const { username, profileImageSrc } = user;

      return { username, profileImageSrc, ...photo, userLikedPhoto };
    })
  );

  //if the active user have not followed anyone we have to stop the skeleton loading and tell him to follow people

  console.log('photosWithUserDetails', photosWithUserDetails);
  return photosWithUserDetails;
}

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Followers Modal Data *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//getting all the users that follows the profile user (Profile Followers)
export const getProfileFollowersUsers = async profileUserId => {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('following', 'array-contains', profileUserId)
    .where('userId', '!=', profileUserId)
    .get();

  if (!result.empty) {
    return result.docs.map(user => {
      return {
        ...user.data(),
        docId: user.id,
      };
    });
  } else {
    return [];
  }
};

// const getData = async () => {
//   const response = await getProfileFollowersUsers(user.userId);
//   console.log('response followers', response);
// };
// getData();

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Followers Modal Data *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//getting all the users that the profile User is Following (Profile Following)
export const getProfileFollowingUsers = async profileUserId => {
  console.log('userrr', profileUserId);
  const result = await firebase
    .firestore()
    .collection('users')
    .where('followers', 'array-contains', profileUserId)
    .where('userId', '!=', profileUserId)
    .get();

  if (!result.empty) {
    return result.docs.map(user => {
      return {
        ...user.data(),
        docId: user.id,
      };
    });
  } else {
    return [];
  }
};

// *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_* Likes Modal Data *_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*

//getting al the users that liked a Post
export const getPostLikesUsers = async likesArray => {
  const usersLikedPostData = await Promise.all(
    likesArray.map(async likeUserId => {
      const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', '==', likeUserId)
        .get();

      return {
        ...result.docs[0].data(),
        docId: result.docs[0].id,
      };
    })
  );

  return usersLikedPostData;
};
