import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from '../pages/authentication/signUp/signUpSlice';
import authSliceReducer from './slices';
import userSliceReducer from './userSlice';
import jobsSliceReducer from './jobsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiSlice } from '../pages/authentication/apiSlice';
import { profileApiSlice } from '../pages/profile/apiSlice';
import { jobsApiSlice } from '../pages/jobs/apiSlice';


const userPersistConfig = {
	key: 'user',
	storage: AsyncStorage,
}

const persistedUserReducer = persistReducer(userPersistConfig, userSliceReducer);

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		signUp: signUpReducer,
		auth: authSliceReducer,
		jobs: jobsSliceReducer,
		user: persistedUserReducer,
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
