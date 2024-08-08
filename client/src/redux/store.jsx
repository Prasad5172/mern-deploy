import { applyMiddleware, combineReducers, legacy_createStore } from '@reduxjs/toolkit';
import { libraryReducer } from './library/Reducer';
import thunk from 'redux-thunk';

const rootReducers = combineReducers({
  library:libraryReducer
})

export const store = legacy_createStore(rootReducers,applyMiddleware(thunk))
