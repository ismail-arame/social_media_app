import propTypes from 'prop-types';
import { useState, useContext, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import AddComment from './add-comment';
import FirebaseContext from '../../context/firebase';

export default function Comments({
  photoDocId,
  comments: allComments, //allComments === comments array it is just an alias
  posted, //
  commentInput,
}) {
  //comments is just a name to explain what we are storing in the state
  const { firebase } = useContext(FirebaseContext);

  const [comments, setComments] = useState(allComments);

  useEffect(() => {
    //Realitime Comment Functionality
    const unSubscribeFromSnapshot = firebase
      .firestore()
      .collection('photos')
      .doc(photoDocId)
      .onSnapshot(snapshot => {
        setComments(snapshot.data().comments);
      });

    return () => unSubscribeFromSnapshot();
  }, [firebase, photoDocId]);

  return (
    <>
      <div className=" p-4 pt-1 pb-4 ">
        {comments.length >= 3 && (
          <p className="text-sm text-gray-base mb-1 cursor-pointer">
            View all {comments.length} comments
          </p>
        )}
        {comments.slice(0, 2).map(item => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link to={`/p/${item.displayName}`}>
              <span className="mr-1 font-semibold text-sm">
                {item.displayName}
              </span>
            </Link>
            <span className="text-black-light text-sm">{item.comment}</span>
          </p>
        ))}
        <p className=" text-gray-light uppercase text-[10px] mt-2 tracking-wide">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        photoDocId={photoDocId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  photoDocId: propTypes.string.isRequired,
  comments: propTypes.array.isRequired,
  posted: propTypes.number.isRequired,
  commentInput: propTypes.object,
};
