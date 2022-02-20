import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useRef, useContext } from 'react';
import UserFirestoreContext from '../context/user-firestore';
import { CameraIcon } from '@heroicons/react/outline';

//https://headlessui.dev and see there docs there
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { firebase, FieldValue } from '../lib/firebase';

//upload selectors
import {
  selectOpenUploadModal,
  selectSelectedUploadFile,
  selectUploadFileLoading,
} from '../redux/upload/upload.selectors';

//upload actions
import {
  setOpenUploadModal,
  setSelectedUploadFile,
  setUploadFileLoading,
} from '../redux/upload/upload.actions';

export default function UploadModal() {
  console.log('FieldValue.serverTimestamp() **', FieldValue.serverTimestamp());
  const { userFirestore } = useContext(UserFirestoreContext);

  const filePickerRef = useRef(null);
  const captionRef = useRef(null);

  const openUploadModal = useSelector(selectOpenUploadModal, shallowEqual);
  const selectedUploadFile = useSelector(
    selectSelectedUploadFile,
    shallowEqual
  );
  const uploadFileLoading = useSelector(selectUploadFileLoading, shallowEqual);

  console.log('uploadFileLoading ***', uploadFileLoading);

  const dispatch = useDispatch();

  //setting the selected Upload file to redux state
  const addImageToPost = e => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    //once the reader finishes reading the image file then we store in the state
    reader.onload = readerEvent => {
      // console.log('event file picker :  ', readerEvent.target.result);
      dispatch(setSelectedUploadFile(readerEvent.target.result));
    };
  };

  //Uploading the File to Firebase Storage (and show it on the TimeLine realtime using onSnapshot that we already done)
  const uploadPost = async () => {
    if (uploadFileLoading) return; //Guard Clause

    //setting the uplaod file loading to true
    dispatch(setUploadFileLoading());

    const storage = firebase.storage();

    // 1) create a post and add to Firestore 'photos' collection
    // 2) get the post ID of the newly created post
    // 3) upload the image to firebase storage with the post ID
    // 4) get a download URL from the firebase storage and update the original post with image

    // 1)
    const resultDocRef = await firebase.firestore().collection('photos').add({
      caption: captionRef.current.value,
      comments: [],
      dateCreated: Date.now(),
      likes: [],
      userId: userFirestore.userId,
    });

    // 2)
    console.log('new document reference added with ID', resultDocRef.id);

    // 3)
    // => Creating Refrence
    const storageRef = storage.ref();
    const imageRef = storageRef.child(`photos/${resultDocRef.id}/image`);

    //uploading file
    await imageRef
      .putString(selectedUploadFile, 'data_url')
      .then(async snapshot => {
        // 4)
        // => snapshot.ref === imageRef
        const downloadURL = await snapshot.ref.getDownloadURL();
        await firebase
          .firestore()
          .collection('photos')
          .doc(resultDocRef.id)
          .update({
            imageSrc: downloadURL,
          });
      });

    dispatch(setOpenUploadModal()); //closing the modal after finishing uploading
    dispatch(setUploadFileLoading(false)); //stop upload file loading if upload have finished
    dispatch(setSelectedUploadFile(null)); // stting the selected file (image) to null
  };

  return (
    <Transition.Root show={openUploadModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-y-auto"
        onClose={() => dispatch(setOpenUploadModal())}
      >
        <div className="flex items-end justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className=" fixed inset-0 bg-black-light backdrop-blur-[2px] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 scale-95"
          >
            <div className="inline-block w-full max-w-sm p-6 px-4 pt-5 pb-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div>
                {selectedUploadFile ? (
                  <img
                    src={selectedUploadFile}
                    alt="selected upload file"
                    className="w-full object-contain cursor-pointer"
                    onClick={() => dispatch(setSelectedUploadFile(null))}
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-500"
                      aria-hidden="true"
                    />
                  </div>
                )}

                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium "
                    >
                      Upload photo
                    </Dialog.Title>

                    <div>
                      <input
                        ref={filePickerRef}
                        type="file"
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>

                    <div className="mt-2">
                      <input
                        className="border-none focus:ring-0 w-full text-center focus:outline-none"
                        type="text"
                        ref={captionRef}
                        placeholder="Please enter a caption..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    disabled={!selectedUploadFile}
                    className="inline-flex justify-center w-full rounded-md border border-gray-transparent shadow-sm px-4 py-2 bg-red-primary text-base font-medium text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-primary sm:text-sm disabled:bg-gray-light disabled:cursor-not-allowed hover:disabled:bg-gray-light"
                    onClick={uploadPost}
                  >
                    {uploadFileLoading ? (
                      <svg
                        role="status"
                        class="inline mr-3 w-4 h-4 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      ''
                    )}
                    {uploadFileLoading ? 'Uploading...' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
