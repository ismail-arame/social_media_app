import { useState, useContext, useEffect, useRef } from 'react';
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

  //if it's false we will add the commentInput value to comments array else (true) we'll add the commentInput value to replies array
  const isReplyComment = useRef(false);

  const replyComment = useRef(null); //the comment the active user clicked to reply
  const replyComment2 = useRef(null); //the replyCOmment the active user clicked to reply

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
          replies: item.replies,
          isReplyShow: item.isReplyShow,
        });
      } else {
        updatedComments.push({
          comment: item.comment,
          commentLikes: item.commentLikes,
          dateCreated: item.dateCreated,
          displayName: item.displayName,
          profileImageSrc: item.profileImageSrc,
          replies: item.replies,
          isReplyShow: item.isReplyShow,
        });
      }
    });

    console.log('updatedComments', updatedComments);

    await firebase.firestore().collection('photos').doc(photoDocId).update({
      comments: updatedComments,
    });
  };

  const handleToggleReplyCommentLiked = async (comment, replyComment) => {
    let updatedComments = [];

    const likedReplyComment = replyComment.replyLikes.some(
      userId => userId === activeUserId
    )
      ? replyComment.replyLikes.filter(userId => userId !== activeUserId)
      : [...replyComment.replyLikes, activeUserId];

    //comments => all the comments that we stored in the state
    comments.forEach(item => {
      updatedComments.push({
        comment: item.comment,
        commentLikes: item.commentLikes,
        dateCreated: item.dateCreated,
        displayName: item.displayName,
        profileImageSrc: item.profileImageSrc,
        replies: item.replies,
        isReplyShow: item.isReplyShow,
      });

      if (
        item.displayName === comment.displayName &&
        item.dateCreated === comment.dateCreated
      ) {
        const updatedCommentsLength = updatedComments.length;
        updatedComments[updatedCommentsLength - 1].replies.forEach(el => {
          if (
            el.displayName === replyComment.displayName &&
            el.dateCreated === replyComment.dateCreated
          ) {
            el.replyLikes = likedReplyComment;
          }
        });
      }
    });

    console.log('updatedComments reply', updatedComments);

    await firebase.firestore().collection('photos').doc(photoDocId).update({
      comments: updatedComments,
    });
  };

  const handleToggleShowReplies = async comment => {
    let updatedComments = [];

    //comments => all the comments that we stored in the state
    comments.forEach(item => {
      if (
        item.displayName === comment.displayName &&
        item.dateCreated === comment.dateCreated
      ) {
        updatedComments.push({
          comment: item.comment,
          commentLikes: item.commentLikes,
          dateCreated: item.dateCreated,
          displayName: item.displayName,
          profileImageSrc: item.profileImageSrc,
          replies: item.replies,
          isReplyShow: !item.isReplyShow,
        });
      } else {
        updatedComments.push({
          comment: item.comment,
          commentLikes: item.commentLikes,
          dateCreated: item.dateCreated,
          displayName: item.displayName,
          profileImageSrc: item.profileImageSrc,
          replies: item.replies,
          isReplyShow: item.isReplyShow,
        });
      }
    });

    await firebase.firestore().collection('photos').doc(photoDocId).update({
      comments: updatedComments,
    });
  };
  // the header size is => 65px
  //the actions size is => 185px (the like and comment section)
  return (
    <>
      <div className="pl-4 pr-2 absolute top-[65px] bottom-[185px] right-0 w-full">
        <div className="grid auto-rows-min h-full overflow-y-scroll overflow-x-hidden">
          <section
            className="flex items-start mt-4"
            aria-label="caption section"
          >
            <div className="w-11 w- h-11 rounded-full mr-4 ">
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
                <div key={i} className="flex flex-col">
                  <div className="flex justify-between">
                    <div className="flex items-start mt-6">
                      <div className="w-9 w- h-9 rounded-full mr-4 ">
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
                          <span className="text-sm text-black-light">
                            {comment.comment}
                          </span>
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
                          <span
                            className="text-gray-base font-medium tracking-wide text-xs cursor-pointer"
                            onClick={() => {
                              isReplyComment.current = true;
                              replyComment.current = comment;
                              commentInput.current.focus();
                              commentInput.current.value = `@${
                                comment.displayName
                              }${` `}`;
                            }}
                          >
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
                  {comment?.replies?.length > 0 && (
                    <section
                      className="grid auto-rows-min mt-10 ml-[52px]"
                      aria-label="comments section"
                    >
                      <div className="flex items-center">
                        <span className="border-b border-gray-light mr-4 w-6 h-0"></span>
                        <span
                          className=" text-xs text-gray-light font-semibold cursor-pointer"
                          onClick={() => handleToggleShowReplies(comment)}
                        >
                          {comment.isReplyShow
                            ? 'Hide Replies'
                            : `Show Replies (${comment?.replies?.length})`}
                        </span>
                      </div>
                      {comment.isReplyShow &&
                        comment &&
                        comment.replies.map((replyComment, i) => (
                          <div key={i} className="flex flex-col ">
                            <div className="flex justify-between">
                              <div className="flex items-start mt-6">
                                <div className="w-9 w- h-9 rounded-full mr-4 ">
                                  <img
                                    src={replyComment.profileImageSrc}
                                    alt={`${replyComment.displayName} img`}
                                    className="rounded-full h-full w-full border border-gray-lightweight object-cover"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <div className="">
                                    <Link
                                      to={`/p/${replyComment.displayName}`}
                                      onClick={() =>
                                        dispatch(setPostModalOpen())
                                      }
                                    >
                                      <span className="font-semibold text-sm mr-1">
                                        {replyComment.displayName}
                                      </span>
                                    </Link>
                                    {replyComment.comment.split(' ').shift() ===
                                    `@${comment.displayName}` ? (
                                      <span className="text-sm text-black-light">
                                        <span className="text-sm text-blue-medium">
                                          {replyComment.comment
                                            .split(' ')
                                            .shift()}
                                        </span>
                                        {`${` `} ${replyComment.comment
                                          .split(' ')
                                          .slice(1)
                                          .join(' ')}`}
                                      </span>
                                    ) : (
                                      <span className="text-sm text-black-light">
                                        {replyComment.comment}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex mt-3 items-center">
                                    <span className="text-[12px] text-gray-light mr-3">
                                      {formatDistance(
                                        replyComment.dateCreated,
                                        new Date()
                                      )}{' '}
                                    </span>
                                    <span className="text-gray-base font-medium tracking-wide text-xs mr-3 cursor-pointer">
                                      {replyComment?.commentLikes?.length === 1
                                        ? `${replyComment?.replyLikes?.length} like`
                                        : `${replyComment?.replyLikes?.length} likes`}
                                    </span>
                                    <span
                                      className="text-gray-base font-medium tracking-wide text-xs cursor-pointer"
                                      onClick={() => {
                                        isReplyComment.current = true;
                                        replyComment2.current = comment;
                                        console.log(
                                          replyComment.current,
                                          comment
                                        );
                                        commentInput.current.focus();
                                        commentInput.current.value = `@${
                                          replyComment.displayName
                                        }${` `}`;
                                      }}
                                    >
                                      reply
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <svg
                                onClick={() =>
                                  handleToggleReplyCommentLiked(
                                    comment,
                                    replyComment
                                  )
                                }
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                tabIndex={0}
                                className={`w-4 mr-4 select-none cursor-pointer transition-colors focus:outline-none hover:stroke-gray-light ${
                                  replyComment?.replyLikes?.some(
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
                          </div>
                        ))}
                    </section>
                  )}
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
          isReplyComment={isReplyComment}
          replyComment={replyComment}
          replyComment2={replyComment2}
        />
      </div>
    </>
  );
}
