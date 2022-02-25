import { useState, useContext, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPostModalOpen } from '../../redux/post-modal/post-modal.actions';
import AddComment from '../post/add-comment';
import Actions from '../post/actions';
import FirebaseContext from '../../context/firebase';

export default function PostModalCaptionComment({
  photoDocId,
  postUserProfileImageSrc,
  postUserUsername,
  caption,
  posted,
  comments: allComments,
  commentInput,
  //actions
  totalLikes,
  userLikedPhoto,
  handleFocus,
  activeUserId,
}) {
  const dispatch = useDispatch();

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

  console.log('comments', comments);

  // the header size is => 65px
  //the actions size is => 185px (the like and comment section)
  return (
    <>
      <div className="pl-4 pr-2 absolute top-[65px] bottom-[185px] right-0 w-full">
        <div className="grid auto-rows-min h-full overflow-hidden hover:overflow-y-scroll scroll">
          <section
            className="flex items-start mt-4"
            aria-label="caption section"
          >
            <div className="w-11 w- h-11 rounded-full mr-3 ">
              <img
                src={postUserProfileImageSrc}
                alt={`${postUserUsername} img`}
                className="rounded-full h-full w-full border border-gray-lightweight object-cover"
              />
            </div>
            <div className="flex flex-col">
              <div className="self-center">
                <Link
                  to={`/p/${postUserUsername}`}
                  onClick={() => dispatch(setPostModalOpen())}
                >
                  <span className="font-semibold text-sm mr-1">
                    {postUserUsername}
                  </span>
                </Link>
                <span className="text-sm">{caption}</span>
              </div>
              <div className="mt-3">
                <span className="text-[12px] text-gray-light">
                  {formatDistance(posted, new Date())}{' '}
                </span>
              </div>
            </div>
          </section>
          <section className="grid auto-rows-min" aria-label="comments section">
            {comments.map((comment, i) => (
              <div key={i} className="flex items-start mt-6">
                <div className="w-9 w- h-9 rounded-full mr-3 ">
                  <img
                    src={comment.profileImageSrc}
                    alt={`${comment.displayName} img`}
                    className="rounded-full h-full w-full border border-gray-lightweight object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <div className="">
                    <Link
                      to={`/p/${comment.displayName}`}
                      onClick={() => dispatch(setPostModalOpen())}
                    >
                      <span className="font-semibold text-sm mr-1">
                        {comment.displayName}
                      </span>
                    </Link>
                    <span className="text-sm">{comment.comment}</span>
                  </div>
                  <div className="flex mt-3 items-center">
                    <span className="text-[12px] text-gray-light mr-3">
                      {formatDistance(comment.dateCreated, new Date())}{' '}
                    </span>
                    <span className="text-gray-base font-medium tracking-wide text-xs mr-3 cursor-pointer">
                      likes
                    </span>
                    <span className="text-gray-base font-medium tracking-wide text-xs cursor-pointer">
                      reply
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
      <div className="flex flex-col absolute bottom-0 right-0 border-t border-gray-lightweight w-full z-30 bg-white">
        <Actions
          photoDocId={photoDocId}
          totalLikes={totalLikes}
          userLikedPhoto={userLikedPhoto}
          posted={posted} //dateCreated
          handleFocus={handleFocus}
          activeUserId={activeUserId}
        />
        <div className="text-gray-light text-[10px] px-4 mt-2 mb-4 tracking-wide">
          {formatDistance(posted, new Date()).toUpperCase()} AGO
        </div>
        <AddComment
          photoDocId={photoDocId}
          comments={comments}
          setComments={setComments}
          commentInput={commentInput}
        />
      </div>
    </>
  );
}
