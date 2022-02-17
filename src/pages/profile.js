import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { getUserByUsername } from '../services/firebase';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import { useContext } from 'react';
import useUser from '../hooks/use-user';
import UserFirestoreContext from '../context/user-firestore';
import Header from '../components/header';
import UserProfile from '../components/profile';

export default function Profile() {
  const { user: userFirestore } = useUser();

  // NESTED ROUTING => /p/:username
  const { username } = useParams();
  const history = useHistory();

  //the user Profile we are looking for exist or not
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkUserExists() {
      //if username Exist we get userFirestore data else we get false
      const [user] = await getUserByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, history]);

  //REMEMBER If you get an Error complaining about cannot destructuer userFirestore Context
  // then Wrap the Profile Component with the UserFirestoreContext.Provider Component
  //we give mt-24 because the header is ovrfolwing the page so we we have to push UserProfile a little bit down
  return user?.username ? (
    <UserFirestoreContext.Provider value={{ userFirestore }}>
      <div className=" bg-gray-background">
        <Header />
        <div className="max-w-screen-lg px-10 mx-auto mt-24">
          <UserProfile user={user} />
        </div>
      </div>
    </UserFirestoreContext.Provider>
  ) : null;
}

//use React.memo() (Try if u need it or not)
//RE RENDERING OBJECT REFERENCE WARNING !! => if we pass the same user to UserProfile Component it will re render even if the object is the same (object is not the same in the HEAP (every object has diffrent reference))
