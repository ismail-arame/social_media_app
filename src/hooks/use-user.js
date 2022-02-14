import { useState, useEffect, useContext } from 'react';
import UserContext from '../context/user';
import { getUserByUserId } from '../services/firebase';

export default function useUser() {
  const { user } = useContext(UserContext);

  const [activeUser, setActiveUser] = useState({});

  useEffect(() => {
    //the best way to query in firestore is by the unique ID Identifier (uid)
    async function getUserObjByUserId() {
      //we need a function that we can call (firebase service) that gets the user data based on the id
      const [response] = await getUserByUserId(user?.uid);
      setActiveUser(response);
    }
    if (user?.uid) {
      getUserObjByUserId();
    }
  }, [user]);

  return { user: activeUser };
}
