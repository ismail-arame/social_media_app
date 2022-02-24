import propTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PhotoDetail from './photo-detail';

export default function Photos({ photos }) {
  // console.log('photos', photos);

  return (
    <div className="h-16 border-t border-gray-primary mt-12 pt-4">
      <div className="grid grid-cols-3 gap-8 mt-4 mb-12">
        {!photos ? (
          <>
            {[...new Array(6)].map((_, index) => (
              <SkeletonTheme
                key={index}
                baseColor="#f1f3f5"
                highlightColor="#FAFAFA"
              >
                <p>
                  <Skeleton
                    count={1}
                    className="w-full"
                    height={350}
                    borderRadius={0}
                    duration={1}
                  />
                </p>
              </SkeletonTheme>
            ))}
          </>
        ) : photos.length > 0 ? (
          photos.map(photo => (
            <PhotoDetail key={photo.docId} photoContent={photo} />
          ))
        ) : (
          <p className="col-span-3 text-center text-2xl font-semibold">
            No Posts Yet
          </p>
        )}
      </div>
    </div>
  );
}

Photos.propTypes = {
  photos: propTypes.array,
};
