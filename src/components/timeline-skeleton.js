import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TimelineSkeleton = () => {
  return (
    <div>
      {[...new Array(2)].map((_, index) => (
        <SkeletonTheme key={index} baseColor="#ebe8e8" highlightColor="#FAFAFA">
          <div className="rounded  border bg-white border-gray-transparent border-b-white	 translate-y-[5px] rounded-br-none rounded-bl-none">
            <div className="flex h-4 p-4 py-8">
              <div className="flex items-center">
                <div className=" flex items-center">
                  <Skeleton
                    count={1}
                    height={37}
                    width={37}
                    circle="true"
                    className="mr-3 mb-1.5"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <SkeletonTheme baseColor="#f1f3f5" highlightColor="#FAFAFA">
                      <p>
                        <Skeleton
                          count={1}
                          height={13}
                          width={140}
                          borderRadius={0}
                        />
                        <Skeleton
                          count={1}
                          height={13}
                          width={105}
                          borderRadius={0}
                        />
                      </p>
                    </SkeletonTheme>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p>
            <Skeleton
              count={1}
              height={550}
              // width={624}
              borderRadius={0}
              //always use w-full (className) not magic numbers
              className="w-full border border-gray-transparent rounded-tl-none rounded-tr-none mb-6 border-t-0 rounded"
            />
          </p>
        </SkeletonTheme>
      ))}
    </div>
  );
};

export default TimelineSkeleton;
