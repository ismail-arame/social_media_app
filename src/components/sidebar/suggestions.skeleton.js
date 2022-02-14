import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SuggestionSkeleton() {
  return (
    <div className="grid grid-cols-10 gap-5 mb-3.5 items-center">
      <div className=" flex justify-between items-center col-span-2">
        <Skeleton
          count={1}
          height={37}
          width={37}
          circle="true"
          className="mb-1.5"
        />
      </div>
      <div className="flex flex-col justify-center col-span-5">
        <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
          <p>
            <Skeleton count={1} height={13} />
          </p>
        </SkeletonTheme>
        <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
          <p>
            <Skeleton count={1} height={13} width={105} />
          </p>
        </SkeletonTheme>
      </div>
    </div>
  );
}
