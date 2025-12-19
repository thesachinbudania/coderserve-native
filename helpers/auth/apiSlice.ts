import { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { fetchBaseQuery, createApi, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setTokenState } from './signUpSlice';

import type { RootState } from '@/appHelpers/store';


const baseQuery = fetchBaseQuery({
	baseUrl: 'https://api.coderserve.com/api/accounts',
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).signUp.token.access;
		if (token) {
			headers.set('AUTHORIZATION', `Bearer ${token}`);
		}
		return headers
	}
})

const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);
	if (result.error && result.error.status === 401) {
		const refresh_token = (api.getState() as RootState).signUp.token.refresh;
		const refreshResult: any = await baseQuery({
			url: '/token_generator/',
			method: 'POST',
			body: {
				refresh_token
			}
		}, api, extraOptions);
		if (refreshResult.data) {
			const token = refreshResult.data.access;
			const newRefreshToken = refreshResult.data.refresh;
			api.dispatch(setTokenState({ access: token, refresh: newRefreshToken }));
			const newResult = await baseQuery(args, api, extraOptions);
			return newResult;
		}
	}
	return result
}

export const apiSlice = createApi({
	baseQuery: baseQueryWithReAuth,
	endpoints: builder => ({
		signIn: builder.mutation({
			query: data => ({
				url: '/login/',
				method: 'POST',
				body: data,
			})
		}),
		signUp: builder.mutation({
			query: userData => ({
				url: '/sign_up/',
				method: 'POST',
				body: userData
			})
		}),
		validateOtp: builder.mutation({
			query: data => ({
				url: '/otp_validator/',
				method: 'PUT',
				body: data
			})
		}),
		resendOtp: builder.mutation({
			query: data => ({
				url: '/resend_otp/',
				method: 'PUT',
				body: data,
			})
		}),
		verifyUsernameTaken: builder.mutation({
			query: username => ({
				url: '/verify_username_taken/',
				method: 'PUT',
				body: {
					username: username,
				}
			}),
		}),
		setUsername: builder.mutation({
			query: username => ({
				url: '/set_username/',
				method: 'PUT',
				body: {
					username: username,
				}
			})
		}),
		setProfileImage: builder.mutation({
			query: image => {
				const formData: any = new global.FormData()
				formData.append("profile_image", {
					uri: image.uri,
					type: 'image/jpeg',
					name: 'profile_image.jpg'
				})
				return ({
					url: '/change_profile_image/',
					method: 'PUT',
					body: formData,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})

			}
		}),
		setLocation: builder.mutation({
			query: data => ({
				url: '/update_location_details/',
				method: 'PUT',
				body: data
			})
		}),
		sendForgotPasswordOtp: builder.mutation({
			query: email => ({
				url: '/resend_otp/',
				method: 'PUT',
				body: {
					email: email,
					otp_for: 'forgot_password'
				}
			})
		}),
		saveNewPassword: builder.mutation({
			query: data => ({
				url: `/forgot_password_save_password/${data.email}/`,
				method: 'PUT',
				body: {
					password: data.password
				}
			})
		}),
		tokenValidator: builder.mutation({
			query: () => ({
				url: '/auth_token_validator/',
				method: 'GET',
			})
		})

	})

})

export const { useTokenValidatorMutation, useSignUpMutation, useValidateOtpMutation, useSaveNewPasswordMutation, useSendForgotPasswordOtpMutation, useResendOtpMutation, useVerifyUsernameTakenMutation, useSetUsernameMutation, useSetProfileImageMutation, useSetLocationMutation, useSignInMutation } = apiSlice;
