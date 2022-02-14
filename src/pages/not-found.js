import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Not Found - Instagram';
  }, []);

  return (
    <div className="bg-gray-background">
      <div className="flex flex-col items-center justify-center gap-4 mx-auto max-w-screen-lg">
        <p className="text-center text-2xl mt-6">Not Found!</p>
        <Link to="/">
          <button
            type="button"
            className="rounded text-md font-bold text-blue-light"
          >
            GO BACK HOME
          </button>
        </Link>
      </div>
    </div>
  );
}
