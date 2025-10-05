import axios from 'axios';
import { apiUrl } from '@/constants/env';
import { useStore } from '@/zustand/auth/stores';

export const api = axios.create({
	baseURL: apiUrl + '/api/accounts',
	timeout: 10000,
});

const secureApi = axios.create({
	baseURL: apiUrl + '/api/accounts',
	timeout: 10000,
})

secureApi.interceptors.request.use((config) => {
	const token = useStore.getState().access;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


secureApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			useStore.getState().refresh
		) {
			originalRequest._retry = true;

			try {
				const refreshToken = useStore.getState().refresh;


				const refreshResponse = await axios.post(
					apiUrl + '/api/accounts/token_generator/',
					{ refresh_token: refreshToken }
				);

				const newAccessToken = refreshResponse.data.access;
				const newRefreshToken = refreshResponse.data.refresh;

				// Update tokens in Zustand store
				useStore.getState().setStore({ access: newAccessToken, refresh: newRefreshToken });

				// Update the original request with new token
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// Retry the original request
				return api(originalRequest);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				// Optionally clear tokens and redirect to login
				useStore.getState().setStore({ access: null, refresh: null });
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default secureApi
