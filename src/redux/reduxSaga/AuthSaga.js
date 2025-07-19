import {call, put, select, takeLatest} from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {postApi} from '../../utils/helpers/ApiRequest';
import ShowAlert from '../../utils/helpers/ShowAlert';
import constants from '../../utils/helpers/Constant';
import {
  getTokenFailure,
  getTokenSuccess,
  getNameSuccess,
  getNameFailure,
  getUserTypeSuccess,
  signinSuccess,
  signinFailure,
  logoutSuccess,
  logoutFailure,
  otpSuccess,
  otpFailure,
} from '../reducer/AuthReducer';

let getItem = state => state.AuthReducer;

export function* getTokenSaga() {
  try {
    console.log('About to fetch token from AsyncStorage');
    const response = yield call(AsyncStorage.getItem, constants.TOKEN);
    const response1 = yield call(AsyncStorage.getItem, constants.NAME);
    console.log('Fetched token from AsyncStorage:', response); // Check here

    if (response != null) {
      yield put(getTokenSuccess(response));
      yield put(getNameSuccess(response1));
    } else {
      yield put(getTokenSuccess(null));
      yield put(getNameSuccess(null));
    }
  } catch (error) {
    console.log('Error in getTokenSaga:', error); // Add error log
    yield put(getTokenFailure(error));
    yield put(getNameFailure(error));
  }
}

//SignIn for user

export function* signinSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'user/send-otp', action.payload, header);

    console.log('iyqgdyeqgdyg', response);
    if (response?.status === 200) {
      yield put(signinSuccess(response.data));
    } else {
      yield put(signinFailure(response.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    // Extract and serialize only the relevant error info
    const serializableError = {
      message: error.message,
      code: error.code,
      response: error.response ? error.response.data : null,
    };

    yield put(signinFailure(serializableError));
  }
}

export function* otpSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(postApi, 'user/login', action.payload, header);
    console.log('responseresponse', response);

    if (response?.status === 200) {
      const token = response?.data?.token;
      const name = response?.data?.user?.name;
      console.log('Response token:', token); // Check if token is being returned

      if (token) {
        try {
          console.log('Storing token in AsyncStorage:', token);
          yield call(AsyncStorage.setItem, constants.TOKEN, token);
          yield call(AsyncStorage.setItem, constants.NAME, name);

          const storedToken = yield call(AsyncStorage.getItem, constants.TOKEN);
          const storedName = yield call(AsyncStorage.getItem, constants.NAME);
          console.log('Token saved successfully:', storedToken);
          console.log('Name saved successfully:', storedName);

          // Dispatch action to trigger getTokenSaga to fetch and use the token
          yield put({type: 'Auth/getTokenRequest'});
          yield put(getTokenSuccess(response?.data?.token));
          yield put(getNameSuccess(response?.data?.user?.name));
        } catch (error) {
          console.log('Failed to save token to AsyncStorage:', error);
        }

        yield put(otpSuccess(token));
      } else {
        console.log('Token is undefined or null, not saving to AsyncStorage');
      }
    } else {
      yield put(otpFailure(response?.data));
      ShowAlert(response?.data?.message);
    }
  } catch (error) {
    yield put(otpFailure(error));
  }
}

// export function* getTokenSaga() {
//   try {
//     console.log('About to fetch token from AsyncStorage');
//     const response = yield call(AsyncStorage.getItem, constants.TOKEN);
//     console.log('Fetched token from AsyncStorage:', response); // Check here

//     if (response != null) {
//       yield put(getTokenSuccess(response));

//       // Assuming userType should be derived or fetched; if undefined, handle here
//     } else {
//       yield put(getTokenSuccess(null));
//     }
//   } catch (error) {
//     console.log('Error in getTokenSaga:', error);  // Add error log
//     yield put(getTokenFailure(error));
//   }
// }

/* LOGOUT */
export function* userLogoutSaga() {
  console.log('LOGOUT');
  try {
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    yield put(getTokenSuccess(null));
    yield put(logoutSuccess());
  } catch (error) {
    yield put(logoutFailure());
  }
}

// export function* userLogoutSaga() {
//   try {
//     const items = yield select(getItem);

//     const headers = {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       accesstoken: items?.getTokenResponse,
//     };

//     const response = yield call(postApi, 'user/logout', {}, headers); // Assuming postApi(url, body, headers)

//     yield put(logoutSuccess(response.data));
//     yield call(AsyncStorage.removeItem, constants.TOKEN);
//     yield put(getTokenSuccess(null));

//     ShowAlert(response?.data?.message);
//   } catch (error) {
//     const serializableError = {
//       message: error.message,
//       code: error.code,
//       response: error.response ? error.response.data : null,
//     };

//     yield put(logoutFailure(serializableError));
//   }
// }

const watchFunction = [
  (function* () {
    yield takeLatest('Auth/getTokenRequest', getTokenSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/signinRequest', signinSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/otpRequest', otpSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/logoutRequest', userLogoutSaga);
  })(),
];

export default watchFunction;
