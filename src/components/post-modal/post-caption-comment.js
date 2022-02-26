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
        //Comments
        setComments(snapshot.data().comments);
      });

    return () => unSubscribeFromSnapshot();
  }, [firebase, photoDocId, activeUserId]);

  const handleToggleCommentLiked = async comment => {
    let updatedComments = [];

    console.log(photoDocId);

    //comments => all the comments that we stored in the state
    comments.forEach(item => {
      if (
        item.displayName === comment.displayName &&
        item.dateCreated === comment.dateCreated
      ) {
        updatedComments.push({
          comment: item.comment,
          commentLikes: item.commentLikes.some(
            userId => userId === activeUserId
          )
            ? item.commentLikes.filter(userId => userId !== activeUserId)
            : [...item.commentLikes, activeUserId],
          dateCreated: item.dateCreated,
          displayName: item.displayName,
          profileImageSrc: item.profileImageSrc,
        });
      } else {
        updatedComments.push({
          comment: item.comment,
          commentLikes: item.commentLikes,
          dateCreated: item.dateCreated,
          displayName: item.displayName,
          profileImageSrc: item.profileImageSrc,
        });
      }
    });

    console.log('updatedComments', updatedComments);

    await firebase.firestore().collection('photos').doc(photoDocId).update({
      comments: updatedComments,
    });
  };

  console.log('comments', comments);

  // the header size is => 65px
  //the actions size is => 185px (the like and comment section)
  return (
    <>
      <div className="pl-4 pr-2 absolute top-[65px] bottom-[185px] right-0 w-full">
        <div className="grid auto-rows-min h-full overflow-y-scroll">
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
            {comments &&
              comments.map((comment, i) => (
                <div key={i} className="flex justify-between">
                  <div className="flex items-start mt-6">
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
                          {comment?.commentLikes?.length === 1
                            ? `${comment?.commentLikes?.length} like`
                            : `${comment?.commentLikes?.length} likes`}
                        </span>
                        <span className="text-gray-base font-medium tracking-wide text-xs cursor-pointer">
                          reply
                        </span>
                      </div>
                    </div>
                  </div>
                  <svg
                    onClick={() => handleToggleCommentLiked(comment)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') {
                        handleToggleCommentLiked(comment);
                      }
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    tabIndex={0}
                    className={`w-4 mr-4 select-none cursor-pointer transition-colors focus:outline-none hover:stroke-gray-light ${
                      comment?.commentLikes?.some(
                        userId => userId === activeUserId
                      )
                        ? 'fill-red text-red-primary hover:stroke-red-primary animate-[wiggle_0.5s_ease-in]'
                        : '#8e8e8e'
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
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
