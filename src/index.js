// import './wdyr'; // WhyDidYouRender

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebase, FieldValue } from './lib/firebase';
import { BrowserRouter as Router } from 'react-router-dom';

//react-loader-spinner LIBRARY
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Triangle } from 'react-loader-spinner';

import { Provider } from 'react-redux';
import store from './redux/store';
import './styles/app.css'; //tailwind css

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue }}>
    <Provider store={store}>
      <Router>
        <Suspense
          fallback={
            <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center">
              <Triangle
                height="200"
                width="200"
                color="#4b5563"
                ariaLabel="loading"
              />
              <p className="text-2xl font-semibold text-black-light animate-pulse-fast">
                LOADING...
              </p>
            </div>
          }
        >
          <App />
        </Suspense>
      </Router>
    </Provider>
  </FirebaseContext.Provider>,
  document.getElementById('root')
);

//*-*-*-*-*-*-*-*-*-*-*-*-*-*-*  PROJECT ARCHETICTURE  *-*-*-*-*-*-*-*-*-*-*-*-*-*-*

/*

// client side rendered app: react (cra)
   //  => database whiche is Firebase
   // => react-loading-skeleton
   // tailwand 


// folder structure
   // src
      // => components  
      // => constants   
      // => context
      // => helpers  
      // => hooks  
      // => pages
      // => lib (firebase is going to live in here)  
      // => services (firebase functions in here)  
      // =>  styles (tailwind's folder (app/tailwind)) 

*/
