import { useState, useContext } from 'react';
import propTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';

export default function Actions({
  photoDocId,
  totalLikes,
  userLikedPhoto,
  handleFocus,
}) {
  const {
    user: { uid: userId = '' },
  } = useContext(UserContext);
  // console.log('userId', userId);
  const [toggleLiked, setToggleLiked] = useState(userLikedPhoto);
  const [likes, setLikes] = useState(totalLikes);
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleToggleLiked = async () => {
    setToggleLiked(toggleLiked => !toggleLiked);

    console.log(photoDocId);
    console.log(toggleLiked);
    //let's say we passed userLikedPhoto value is false then inside the async function it will change the state to true but setState() is asynchronous so the firebase call will recieve the toggleLiked value as false and in the next render toggleLiked will be true (the nature of setState() HOOK !)

    //if toggleLiked => true  means the user already liked the photo so we need to toggle it (false) and remove it from the likes Array
    await firebase
      .firestore()
      .collection('photos')
      .doc(photoDocId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      });

    setLikes(toggleLiked ? likes - 1 : likes + 1);
  };

  return (
    <>
      <div className=" flex justify-between p-4">
        <div className="flex items-center">
          <svg
            onClick={handleToggleLiked}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                handleToggleLiked();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`w-8 mr-4 select-none cursor-pointer transition-colors focus:outline-none hover:stroke-gray-light ${
              toggleLiked
                ? 'fill-red text-red-primary hover:stroke-red-primary animate-[wiggle_0.5s_ease-in]'
                : '#8e8e8e'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            onClick={handleFocus}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                handleFocus();
              }
            }}
            className="w-8 text-black-light select-none cursor-pointer transition-colors focus:outline-none hover:text-gray-light hover:animate-[bounceModified_1.4s_linear]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </div>
      <div className="p-4 py-0">
        <div className="font-bold">
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </div>
      </div>
    </>
  );
}

Actions.propTypes = {
  photoDocId: propTypes.string.isRequired,
  totalLikes: propTypes.number.isRequired,
  userLikedPhoto: propTypes.bool.isRequired,
  handleFocus: propTypes.func.isRequired,
};
