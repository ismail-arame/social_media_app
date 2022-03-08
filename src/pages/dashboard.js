import { useEffect } from 'react';

import Header from '../components/header';
import Timeline from '../components/timeline';
import UploadModal from '../components/upload-modal';

// => '../components/sidebar/index' but index is the entry point so react knows that already without needing to write it
import Sidebar from '../components/sidebar';
import useUser from '../hooks/use-user';
import UserFirestoreContext from '../context/user-firestore';
import LikesModal from '../components/likes-modal/likes-modal';
// import PostModal from '../components/post-modal';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Instagram';
  }, []);
  const { user: userFirestore } = useUser();

  return (
    <UserFirestoreContext.Provider value={{ userFirestore }}>
      <div className="bg-gray-background " id="container">
        <Header />
        <UploadModal />
        <LikesModal />
        <div className="grid grid-cols-3 gap-6 mx-auto max-w-screen-lg justify-between px-10 mt-24">
          <Timeline />
          <Sidebar />
        </div>
      </div>
    </UserFirestoreContext.Provider>
  );
}
