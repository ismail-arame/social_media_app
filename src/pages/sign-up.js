import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import * as ROUTES from '../constants/routes';
import FirebaseContext from '../context/firebase';
import { doesUsernameExist } from '../services/firebase';

export default function SignUp() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'SignUp - Instagram';
  }, []);

  const isInvalid = password === '' || emailAddress === '';

  const handleSignUp = async event => {
    event.preventDefault();

    //checking if the username is already taken
    const usernameExists = await doesUsernameExist(username);

    if (!usernameExists) {
      try {
        /// authentication
        ////// -> emailAddress & password & username (displayName)
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);
        console.log(createdUserResult.user);

        createdUserResult.user.updateProfile({
          displayName: username.trim(),
        });

        // firebase user collection (create a document)
        firebase
          .firestore()
          .collection('users')
          .add({
            profileImageSrc: '/images/avatars/default.png',
            userId: createdUserResult.user.uid,
            username: username.toLowerCase().trim(),
            fullName,
            emailAddress: emailAddress.toLowerCase().trim(),
            following: [createdUserResult.user.uid],
            followers: [],
            dateCreated: new Date(),
          });

        //Redirecting to DASHBOARD if sign-up success
        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName('');
        setEmailAddress('');
        setPassword('');
        setError(error.message);
      }
    } else {
      setUsername('');
      setError('That username is already taken, please try another.');
    }
  };

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen ">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col justify-center items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="images/logo.png"
              alt="instagram logo "
              className="mt-2 w-2/6 mb-4"
            />
          </h1>

          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <form onSubmit={handleSignUp} method="POST">
            <input
              aria-label="enter your username"
              type="text"
              value={username}
              placeholder="Username"
              onChange={({ target }) => setUsername(target.value)}
              className="px-4 py-5 text-sm text-gray-base w-full mr-3 h-2 border border-gray-primary rounded mb-2"
            />
            <input
              aria-label="enter your full name"
              type="text"
              value={fullName}
              placeholder="Full Name"
              onChange={({ target }) => setFullName(target.value)}
              className="px-4 py-5 text-sm text-gray-base w-full mr-3 h-2 border border-gray-primary rounded mb-2"
            />
            <input
              aria-label="enter your email addresse"
              type="text"
              value={emailAddress}
              placeholder="Email Addresse"
              onChange={({ target }) => setEmailAddress(target.value)}
              className="px-4 py-5 text-sm text-gray-base w-full mr-3 h-2 border border-gray-primary rounded mb-2"
            />
            <input
              aria-label="enter your password"
              type="password"
              value={password}
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
              className="px-4 py-5 text-sm text-gray-base w-full mr-3 h-2 border border-gray-primary rounded mb-2"
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white rounded w-full h-8 font-bold ${
                isInvalid && 'opacity-50'
              }`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border rounded border-gray-primary">
          <p className="text-sm">
            i already have an account{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium ">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// const handleSignUp = async event => {
//   event.preventDefault();

//   try {
//     const { user } = await firebase
//       .auth()
//       .createUserWithEmailAndPassword(emailAddress, password);

//     console.log(user);

//     //documentReference
//     const userRef = firebase.firestore().doc(`users/${user.uid}`);
//     //documentSnapshot
//     const snapShot = await userRef.get();
//     console.log(snapShot.id);

//     if (!snapShot.exists) {
//       const dateCreated = new Date();
//       await userRef.set({
//         dateCreated,
//         emailAddress,
//         followers: [],
//         following: [],
//         fullName,
//         userId: snapShot.id,
//         username,
//       });
//     }
//   } catch (error) {
//     console.log('error creating user ', error.message);
//   }
// };
