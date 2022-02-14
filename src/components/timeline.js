import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import usePhotos from '../hooks/use-photos';
import Post from './post';
import FirebaseContext from '../context/firebase';
import UserContext from '../context/user';
import { getUserByUserId } from '../services/firebase';
import TimelineSkeleton from './timeline-skeleton';

export default function Timeline() {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const { photos } = usePhotos();

  const [listOfPhotos, setListOfPhotos] = useState(null);
  //not working as intended better useRef() to keep value between re renders
  // const [lastDocument, setLastDocument] = useState(null);
  let lastDocument = useRef(null);

  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false); //is there any documents in the collection

  const observer = useRef();
  const lastPostElementRef = useCallback(
    node => {
      if (nextPosts_loading) return;
      const obsOptions = {
        root: null,
        threshold: 0.7, //scrolling 70% of the image and then it will be intersecting
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

  useEffect(() => {
    if (photos) {
      const { lastDoc } = photos[0];

      //storing last Document
      lastDocument.current = lastDoc;
    }
    setListOfPhotos(photos);
  }, [photos]);

  //Fetching More (INFINTE SCROLL)
  const fetchMore = async userId => {
    setNextPostsLoading(true); //loading State
    const result = await firebase
      .firestore()
      .collection('photos')
      .orderBy('dateCreated')
      // .where('userId', 'in', following)
      .startAfter(lastDocument.current)
      .limit(3)
      .get();

    //unAttach event Listeners when there is no more documents in the Firestore
    const isCollectionEmpty = result.size === 0;

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
          const { username } = user;

          return { username, ...photo, userLikedPhoto };
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

  return (
    <div className="container col-span-2">
      {!listOfPhotos ? (
        <TimelineSkeleton />
      ) : listOfPhotos.length > 0 ? (
        <div>
          {listOfPhotos.map((content, index) => {
            if (listOfPhotos.length === index + 1) {
              return (
                <div key={content.docId} ref={lastPostElementRef}>
                  <Post content={content} />
                </div>
              );
            } else {
              return <Post key={content.docId} content={content} />;
            }
          })}
          {nextPosts_loading ? (
            // <p className=" text-xl text-center w-full font-bold">Loading...</p>
            <TimelineSkeleton />
          ) : isEmpty ? (
            <p className="w-full text-lg font-bold text-center mb-16 mt-8">
              You Saw All Followed Users Photos
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
