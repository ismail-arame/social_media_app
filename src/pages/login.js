// const Login = () => {
//   return <p>I am the Login Page</p>;
// };

// export default Login;

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';

export default function Login() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);
  console.log(firebase);

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isInvalid = password === '' || emailAddress === '';

  const handleLogin = async event => {
    event.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      history.push(ROUTES.DASHBOARD);
    } catch (error) {
      setEmailAddress('');
      setPassword('');
      setError(error.message);
    }
  };

  useEffect(() => {
    document.title = 'Login - Instagram';
  }, []);

  // console.log(history);
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

          <form onSubmit={handleLogin} method="POST">
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
              Log In
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 border rounded border-gray-primary">
          <p className="text-sm">
            i don't have an account?{` `}
            <Link to={ROUTES.SIGN_UP} className="font-bold text-blue-medium ">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
