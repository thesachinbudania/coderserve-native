import axios from 'axios';
import { apiUrl } from '../constants/env';
import { useTokensStore } from '../zustand/stores';

export const api = axios.create({
	baseURL: apiUrl + '/api/',
	timeout: 10000,
});

const protectedApi = axios.create({
	baseURL: apiUrl + '/api/',
	timeout: 10000,
})

protectedApi.interceptors.request.use((config) => {
	const token = useTokensStore.getState().access;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});


protectedApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			useTokensStore.getState().refresh
		) {
			originalRequest._retry = true;

			try {
				const refreshToken = useTokensStore.getState().refresh;


				const refreshResponse = await axios.post(
					apiUrl + '/api/accounts/token_generator/',
					{ refresh_token: refreshToken }
				);

				const newAccessToken = refreshResponse.data.access;
				const newRefreshToken = refreshResponse.data.refresh;

				// Update tokens in Zustand store
				useTokensStore.getState().setTokens({ access: newAccessToken, refresh: newRefreshToken });

				// Update the original request with new token
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				// Retry the original request
				return api(originalRequest);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				// Optionally clear tokens and redirect to login
				useTokensStore.getState().setTokens({ access: null, refresh: null });
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default protectedApi 
