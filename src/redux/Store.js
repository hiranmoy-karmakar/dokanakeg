import {configureStore} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import AuthReducer from './reducer/AuthReducer';
import ProfileReducer from './reducer/ProfileReducer';
import RootSaga from './reduxSaga/RootSaga';
// import createSagaMiddleware from 'redux-saga';
const createSagaMiddleware = require('redux-saga').default;

let SagaMiddleware = createSagaMiddleware();

const middleware = (getDefaultMiddleware) => [
  ...getDefaultMiddleware({ thunk: false }), // Disable default thunk middleware
  SagaMiddleware,
  logger,
];

const store = configureStore({
  reducer: {
    AuthReducer: AuthReducer,
    ProfileReducer:ProfileReducer,
  },
  middleware,
});

SagaMiddleware.run(RootSaga);

export default store;
