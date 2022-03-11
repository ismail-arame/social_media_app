import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import usePhotos from '../hooks/use-photos';
import Post from './post';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import { getUserByUserId } from '../services/firebase';
import TimelineSkeleton from './timeline-skeleton';
import UserFirestoreContext from '../context/user-firestore';

import { shallowEqual, useSelector } from 'react-redux';
import { selectUploadFileLoading } from '../redux/upload/upload.selectors';

export default function Timeline() {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const { photos } = usePhotos();
  const {
    userFirestore: { following = [] },
  } = useContext(UserFirestoreContext);

  //uplading File Loading Status
  const uploadFileLoading = useSelector(selectUploadFileLoading, shallowEqual);

  console.log('following', following);
  const [listOfPhotos, setListOfPhotos] = useState(null);
  //not working as intended better useRef() to keep value between re renders
  // const [lastDocument, setLastDocument] = useState(null);
  let lastDocument = useRef(null);
  let isFetchMoreDataEmpty = useRef(false);
  let leaveWhileLoop = useRef(false);

  //using this Ref t check if a photo uploaded is the same when i change the likes or comments on it (without it thae image uploaded creates another copy of itself (and the reason is setListOfPhotos dosn't set the state unless react re renders))
  let photoUploaded = useRef(null);

  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false); //is there any documents in the collection
  //to know whether a user have Followed people posts or no

  useEffect(() => {
    console.log('useEffect', following);
    console.log('useEffect photos', photos);
    if (photos && photos.length > 0) {
      let numOfDocs = 0;
      const { lastDoc } = photos[0];
      //storing last Document
      lastDocument.current = lastDoc;
      // console.log(photos);
      //making realtime Timeline Posts (checking if the first image already exist in the listOfPhotos )
      //if it exists already do nothing else add it to the TimeLine Component
      // unSubscribeFromSnapshot = null;

      // while (following.length || numOfDocs === 0){

      // }
      //because firebase cannot query an array that has more then 10 elements
      const followingArr = following.slice(0, 9);
      const unSubscribeFromSnapshot = firebase
        .firestore()
        .collection('photos')
        .where('userId', 'in', followingArr)
        .orderBy('dateCreated', 'desc')
        .limit(1)
        .onSnapshot(async snapshot => {
          const photo = snapshot.docs[0].data();
          let userLikedPhoto = false;
          if (photo.likes.includes(user?.uid)) userLikedPhoto = true;

          const [userPhoto] = await getUserByUserId(photo.userId);
          const { username, profileImageSrc } = userPhoto;

          if (listOfPhotos) {
            if (
              !listOfPhotos.some(
                photo => photo.docId === snapshot.docs[0].id
              ) &&
              !uploadFileLoading &&
              snapshot.docs[0].data().imageSrc &&
              photoUploaded.current !== snapshot.docs[0].id
            ) {
              photoUploaded.current = snapshot.docs[0].id;
              setListOfPhotos(listOfPhotos => [
                {
                  ...snapshot.docs[0].data(),
                  docId: snapshot.docs[0].id,
                  username,
                  profileImageSrc,
                  userLikedPhoto,
                },
                ...listOfPhotos,
              ]);
            }
          } else {
            if (
              !photos.some(photo => photo.docId === snapshot.docs[0].id) &&
              !uploadFileLoading &&
              snapshot.docs[0].data().imageSrc &&
              photoUploaded.current !== snapshot.docs[0].id
            ) {
              photoUploaded.current = snapshot.docs[0].id;
              setListOfPhotos(listOfPhotos => [
                {
                  ...snapshot.docs[0].data(),
                  docId: snapshot.docs[0].id,
                  username,
                  profileImageSrc,
                  userLikedPhoto,
                },
                ...listOfPhotos,
              ]);
            }
          }
          return () => unSubscribeFromSnapshot();
        });
    }

    // console.log('photos', photos);
    setListOfPhotos(photos);
  }, [photos, firebase]);

  const observer = useRef();
  const lastPostElementRef = useCallback(
    node => {
      if (nextPosts_loading) return;
      const obsOptions = {
        root: null,
        threshold: 0, //scrolling 70% of the image and then it will be intersecting
        rootMargin: `0px`,
      };

      if (observer.current) observer.current.disconnect();
      //everything that it's watching as soon as they become visible they will be in the entries array
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          console.log('visible');
          console.log(isEmpty);
          if (!isEmpty) {
            fetchMore(user?.uid);
          }
        }
      }, obsOptions);
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [nextPosts_loading, isEmpty]
  );
  console.log(lastPostElementRef); //the last element fetched is being observed (To Perform Infinite Scrolling)

  //Fetching More (INFINTE SCROLL)
  const fetchMore = async userId => {
    let numOfDocs = 0;
    let result;
    leaveWhileLoop.current = false;
    const [{ following }] = await getUserByUserId(userId);
    console.log('following  FETCH MORE ********', following);

    //because 'in' inside where doesn't take more than 10 elements in an array
    while (following.length > 0 && numOfDocs === 0) {
      setNextPostsLoading(true); //loading State
      const followingArr = following.splice(0, 9);

      result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', 'in', followingArr)
        .orderBy('dateCreated', 'desc')
        .startAfter(lastDocument.current)
        .limit(6)
        .get();

      isFetchMoreDataEmpty.current = result.empty;

      numOfDocs = result.docs.length;
    }

    //unAttach event Listeners when there is no more documents in the Firestore
    const isCollectionEmpty = isFetchMoreDataEmpty.current;

    if (!isCollectionEmpty) {
      const userFollowedPhotos = result.docs.map(photo => {
        return {
          ...photo.data(),
          docId: photo.id,
        };
      });

      const photosWithUserDetails = await Promise.all(
        userFollowedPhotos.map(async photo => {
          let userLikedPhoto = false;
          if (photo.likes.includes(userId)) userLikedPhoto = true;

          const [user] = await getUserByUserId(photo.userId);
          const { username, profileImageSrc } = user;

          return { username, profileImageSrc, ...photo, userLikedPhoto };
        })
      );

      const lastDoc = result.docs[result.docs.length - 1]; //Infinite Scrolling
      setListOfPhotos(listOfPhotos => [
        ...listOfPhotos,
        ...photosWithUserDetails,
      ]);

      // setLastDocument(lastDoc);
      lastDocument.current = lastDoc;
    } else {
      setIsEmpty(true);
    }
    setNextPostsLoading(false);
  };

  //first we get listOfPhotos as null if the user has FOllowed profiles that have posts listOfPhotos.length > 0 else we return an Empty array to stop the Skeleton Loading and tell the user to follow peaple to see posts

  //if Active User following array is Empty we returned an empty array [] in the /hooks/use-photos.js Custom Hook
  //if the user follow people that have no posts we returned an empty array [] in /services/firebase.js getphotos()

  return (
    <div className="container col-span-2">
      {!listOfPhotos ? (
        <TimelineSkeleton numberOfTimelineSkeleton={2} />
      ) : listOfPhotos.length > 0 ? (
        <div>
          {listOfPhotos.map((content, index) => {
            if (listOfPhotos.length === index + 1) {
              return (
                <div key={content.docId} ref={lastPostElementRef}>
                  <Post content={content} activeUserId={user.uid} />
                </div>
              );
            } else {
              return (
                <Post
                  key={content.docId}
                  content={content}
                  activeUserId={user.uid}
                />
              );
            }
          })}
          {nextPosts_loading ? (
            // <p className=" text-xl text-center w-full font-bold">Loading...</p>
            <TimelineSkeleton numberOfTimelineSkeleton={1} />
          ) : isEmpty ? (
            <p className="w-full text-lg font-bold text-center mb-16 mt-8">
              Follow More People For More Posts
            </p>
          ) : null}
        </div>
      ) : (
        <p className=" text-center text-2xl">Follow people to see Photos </p>
      )}
    </div>
  );
}

// #EFEFEF   ==>  baseColor
// #FAFAFA   ==>  highlightColor
//   <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
//   <p>
//     <Skeleton count={2} height={20} className=" mb-0.5" />
//   </p>
// </SkeletonTheme>

//we need to get the logged in user's photos
//on loading the photos,we need to use React Skeleton
//if we have photos, render them (create a post component)
//if the user have no photos, tell theme to create photos
