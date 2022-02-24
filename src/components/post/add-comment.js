import { useState, useContext } from 'react';
import propTypes from 'prop-types';
import FirebaseContext from '../../context/firebase';
import UserFirestoreContext from '../../context/user-firestore';

export default function AddComment({
  photoDocId,
  commentInput,
  comments, // from the useState in comments.js file
  setComments, // from the useState in comments.js file
}) {
  //the comment that the active user will post
  const [comment, setComment] = useState('');
  const { firebase, FieldValue } = useContext(FirebaseContext);

  //Active User username
  const {
    userFirestore: { username, profileImageSrc },
  } = useContext(UserFirestoreContext);

  const handleSubmitComment = async event => {
    event.preventDefault();

    //Showing Comments in the Post Components
    // { displayName: username, comment: comment } => ES6 Syntax
    setComments([
      ...comments,
      {
        displayName: username,
        comment,
        dateCreated: Date.now(),
        profileImageSrc,
      },
    ]);

    //empty the Field
    setComment('');

    //Adding Comments to Firestore Database
    return firebase
      .firestore()
      .collection('photos')
      .doc(photoDocId)
      .update({
        comments: FieldValue.arrayUnion({
          displayName: username,
          comment,
          dateCreated: Date.now(),
          profileImageSrc,
        }),
      });
  };

  return (
    <div className="border-t border-gray-lightweight">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={event =>
          comment.length >= 1 //comment is a string so we need to check that the user typed
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          aria-label="add a comment"
          autoComplete="off"
          className="text-sm text-gray-base w-full mr-2 py-5 px-4 focus:outline-none"
          type="text"
          placeholder="Add a comment..."
          name="add-comment"
          value={comment}
          onChange={({ target }) => {
            setComment(target.value);
          }}
          ref={commentInput}
        />
        <button
          className={`text-sm font-semibold text-blue-light  ${
            !comment && 'opacity-25'
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

AddComment.propTypes = {
  photoDocId: propTypes.string.isRequired,
  comments: propTypes.array.isRequired,
  setComment: propTypes.func,
  commentInput: propTypes.object,
};
