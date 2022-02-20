import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProfileSkeleton() {
  return (
    <>
      <div className="container flex justify-center">
        <Skeleton
          count={1}
          height={165}
          width={165}
          circle="true"
          duration={1}
        />
      </div>
      <div className="flex flex-col justify-center items-center col-span-2">
        <div className="container flex items-center">
          <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
            <p>
              <Skeleton
                count={1}
                height={30}
                width={110}
                duration={1}
                className=" mr-6"
              />
            </p>
          </SkeletonTheme>
          <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
            <p>
              <Skeleton count={1} height={30} width={110} duration={1} />
            </p>
          </SkeletonTheme>
        </div>
        <div className="container flex mt-6">
          <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
            <p>
              <Skeleton count={1} height={30} width={460} duration={1} />
            </p>
          </SkeletonTheme>
        </div>
        <div className="container mt-6">
          <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
            <p>
              <Skeleton count={1} height={30} width={340} duration={1} />
            </p>
          </SkeletonTheme>
        </div>
      </div>
    </>
  );
}
