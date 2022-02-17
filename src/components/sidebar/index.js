import { useContext } from 'react';
import User from './user';
import Suggestions from './suggestions';
import UserFirestoreContext from '../../context/user-firestore';

export default function Sidebar() {
  const {
    userFirestore: { username, fullName, userId, following, docId },
  } = useContext(UserFirestoreContext);

  return (
    <div className="p-4 sticky h-screen box-border top-24">
      <User username={username} fullName={fullName} />
      <Suggestions
        loggedInUserId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
}
