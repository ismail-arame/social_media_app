import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';

export default function PostModalCaptionComment({
  postUserProfileImageSrc,
  postUserUsername,
  caption,
  posted,
  comments,
}) {
  return (
    <div className="h-full px-4 py-4">
      <div className="flex flex-col ">
        <section className="flex items-start" aria-label="caption section">
          <div className="w-11 w- h-11 rounded-full mr-3 ">
            <img
              src={postUserProfileImageSrc}
              alt={`${postUserUsername} img`}
              className="rounded-full h-full w-full border border-gray-transparent object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="self-center">
              <span className="font-semibold text-sm mr-1">
                {postUserUsername}
              </span>
              <span className="text-sm">{caption}</span>
            </div>
            <div className="mt-3">
              <span className="text-[12px] text-gray-light">
                {formatDistance(posted, new Date())}{' '}
              </span>
            </div>
          </div>
        </section>
        <section className="flex flex-col" aria-label="comments section">
          {comments.map(comment => (
            <div className="flex items-start mt-6">
              <div className="w-9 w- h-9 rounded-full mr-3 ">
                <img
                  src={comment.profileImageSrc}
                  alt={`${comment.displayName} img`}
                  className="rounded-full h-full w-full border border-gray-transparent object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="">
                  <Link to={`/p/${comment.displayName}`}>
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
  );
}
