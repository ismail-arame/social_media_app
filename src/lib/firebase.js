import Firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

//here i want to import the seed file
//moving the database into firebase collections using seedDatabase function
// import { seedDatabase } from '../seed';

const config = {
  apiKey: 'AIzaSyB-LRDTEugC_L3izbYlsHTJXPPhuZbqTU8',
  authDomain: 'instagram-clone-859e3.firebaseapp.com',
  projectId: 'instagram-clone-859e3',
  storageBucket: 'instagram-clone-859e3.appspot.com',
  messagingSenderId: '423272654756',
  appId: '1:423272654756:web:a50d6b1a89caff0cdf8331',
};

const firebase = Firebase.initializeApp(config);

const { FieldValue } = Firebase.firestore;

//here is where i want to call the seed file (Only ONCE!)
//seedDatabase(firebase);

// console.log('Firebase', Firebase);
// console.log('firebase', firebase);

export { firebase, FieldValue };
