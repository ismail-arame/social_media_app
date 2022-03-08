import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function LikesModalSkeleton() {
  return (
    <div className="grid grid-cols-10 items-center px-4 py-2">
      <div className=" flex justify-between items-center col-span-2">
        <Skeleton
          count={1}
          height={37}
          width={37}
          circle="true"
          className="mb-1.5"
        />
      </div>
      <div className="flex flex-col justify-center col-span-4 ml-[-10px]">
        <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
          <p>
            <Skeleton count={1} height={15} />
          </p>
        </SkeletonTheme>
        <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
          <p>
            <Skeleton count={1} height={15} width={105} />
          </p>
        </SkeletonTheme>
      </div>
    </div>
  );
}
