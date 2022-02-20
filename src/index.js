// import './wdyr'; // WhyDidYouRender

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebase, FieldValue } from './lib/firebase';

import { Provider } from 'react-redux';
import store from './redux/store';
import './styles/app.css'; //tailwind css

ReactDOM.render(
  <FirebaseContext.Provider value={{ firebase, FieldValue }}>
    <Provider store={store}>
      <App />
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
