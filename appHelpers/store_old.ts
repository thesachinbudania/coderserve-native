import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from '../pages/authentication/signUp/signUpSlice';
import authSliceReducer from './slices';
import jobsSliceReducer from './jobsSlice';
import { persistStore } from 'redux-persist';

import { apiSlice } from '../pages/authentication/apiSlice';
import { profileApiSlice } from '../pages/profile/apiSlice';
import { jobsApiSlice } from '../pages/jobs/apiSlice';


export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		signUp: signUpReducer,
		auth: authSliceReducer,
		jobs: jobsSliceReducer,
		[profileApiSlice.reducerPath]: profileApiSlice.reducer,
		[jobsApiSlice.reducerPath]: jobsApiSlice.reducer,
	},
	// @ts-ignore
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: {
			ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
		}
	}).concat(apiSlice.middleware)
		.concat(profileApiSlice.middleware)
		.concat(jobsApiSlice.middleware),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
