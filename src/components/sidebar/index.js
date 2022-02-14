import useUser from '../../hooks/use-user';
import User from './user';
import Suggestions from './suggestions';

export default function Sidebar() {
  const {
    user: { username, fullName, userId, following, docId },
  } = useUser();

  return (
    <div className="p-4">
      <User username={username} fullName={fullName} />
      <Suggestions
        loggedInUserId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
}
