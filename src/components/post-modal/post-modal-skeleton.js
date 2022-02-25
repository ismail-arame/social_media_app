import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import React from 'react';

export default function PostModalSkeleton() {
  return (
    <div className="grid auto-rows-min h-full">
      <header className="flex items-center h-8 border-b border-gray-lightweight py-8 px-4">
        <div className="w-11 h-11 rounded-full mr-3">
          <Skeleton
            count={1}
            height={37}
            width={37}
            circle="true"
            className="mr-3 mb-1.5"
          />
        </div>
        <div className="flex flex-col items-center justify-center mr-5">
          <SkeletonTheme baseColor="#f1f3f5" highlightColor="#FAFAFA">
            <p>
              <Skeleton count={1} height={13} width={140} borderRadius={0} />
              <Skeleton count={1} height={13} width={105} borderRadius={0} />
            </p>
          </SkeletonTheme>
        </div>
        <div className="flex items-center"></div>
      </header>
      <div className="pl-4 pr-2 absolute top-[65px] bottom-[185px] right-0 w-full">
        <div className="grid auto-rows-min h-full relative">
          <div className=" absolute right-1/2 top-1/2 translate-x-1/2 translate-y-[-50%]">
            <svg
              role="status"
              className="inline w-6 h-6 text-[#343a40] animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col absolute bottom-0 right-0 border-t border-gray-lightweight w-full z-30 bg-white">
        <div className="flex flex-col items-start pl-4 pt-4 justify-center mb-14">
          <SkeletonTheme baseColor="#f1f3f5" highlightColor="#FAFAFA">
            <p>
              <Skeleton
                count={1}
                height={16}
                width={160}
                borderRadius={0}
                className="mb-2"
              />
              <Skeleton
                count={1}
                height={16}
                width={243}
                borderRadius={0}
                className="mb-2"
              />
              <Skeleton count={1} height={16} width={85} borderRadius={0} />
            </p>
          </SkeletonTheme>
        </div>
      </div>
    </div>
  );
}
