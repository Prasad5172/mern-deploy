import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartReducer';
import thunk from 'redux-thunk';

export const store = configureStore({
  reducer: { library: cartReducer },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    thunk,
  ],
});
