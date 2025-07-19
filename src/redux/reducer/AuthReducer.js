import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: {},
  token: null,
  name: null,
  isLoading: true,
  getTokenResponse: null,
  getNameResponse: null,
  error: {},
  signUpResponse: {},
  signinResponse: {},
  otpResponse: {},
  logoutResponse: {},
  userType: '',
};

const AuthSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    //token for user
    getTokenRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getTokenSuccess(state, action) {
      state.isLoading = false;
      state.getTokenResponse = action.payload;
      state.status = action.type;
    },

    getTokenFailure(state, action) {
      state.isLoading = false;
      state.error = action.error;
      state.status = action.type;
    },
    //name for user
    getNameRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    getNameSuccess(state, action) {
      state.isLoading = false;
      state.getNameResponse = action.payload;
      state.status = action.type;
    },

    getNameFailure(state, action) {
      state.isLoading = false;
      state.error = action.error;
      state.status = action.type;
    },
    //////////////////////////////////////////////////////////////// for user
    setTokenRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    setTokenSuccess(state, action) {
      state.isLoading = false;
      state.token = action.payload;
      state.status = action.type;
    },
    setTokenFailure(state, action) {
      state.isLoading = false;
      state.error = action.error;
      state.status = action.type;
    },
    //
    setNameRequest(state, action) {
      state.isLoading = true;
      state.status = action.type;
    },
    setNameSuccess(state, action) {
      state.isLoading = false;
      state.name = action.payload;
      state.status = action.type;
    },
    setNameFailure(state, action) {
      state.isLoading = false;
      state.error = action.error;
      state.status = action.type;
    },

    //SignIn for user
    signinRequest(state, action) {
      state.status = action.type;
    },
    signinSuccess(state, action) {
      state.signinResponse = action.payload;
      state.status = action.type;
    },
    signinFailure(state, action) {
      state.signinResponse = action.payload;
      state.error = action.error;
      state.status = action.type;
    },

    otpRequest(state, action) {
      state.status = action.type;
    },
    otpSuccess(state, action) {
      state.otpResponse = action.payload;
      state.status = action.type;
    },
    otpFailure(state, action) {
      state.otpResponse = action.payload;
      state.error = action.error;
      state.status = action.type;
    },

    //registration for user
    signUpRequest(state, action) {
      state.status = action.type;
    },
    signUpSuccess(state, action) {
      state.signUpResponse = action.payload;
      state.status = action.type;
    },
    signUpFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
      // state.signUpResponse = action.payload;
    },

    //logout
    logoutRequest(state, action) {
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      state.logoutResponse = action.payload;
      state.status = action.type;
    },
    logoutFailure(state, action) {
      state.error = action.error;
      state.status = action.type;
    },
  },
});

export const {
  getTokenRequest,
  getTokenSuccess,
  getTokenFailure,

  getNameRequest,
  getNameSuccess,
  getNameFailure,

  getUserTypeSuccess,

  signinRequest,
  signinSuccess,
  signinFailure,

  otpRequest,
  otpSuccess,
  otpFailure,

  signUpRequest,
  signUpSuccess,
  signUpFailure,

  logoutRequest,
  logoutSuccess,
  logoutFailure,

  setTokenRequest,
  setTokenSuccess,
  setTokenFailure,

  setNameRequest,
  setNameSuccess,
  setNameFailure,
} = AuthSlice.actions;

export default AuthSlice.reducer;
