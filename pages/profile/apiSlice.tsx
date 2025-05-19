import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '@/appHelpers/apiSlice';

export const profileApiSlice = createApi({
	reducerPath: 'profileApi',
	baseQuery: baseQueryWithReAuth,
	endpoints: builder => ({
		sendOtp: builder.mutation({
			queryFn: async () => {
				const response = await fetchBaseQuery({
					url: '/otp_generator/',
					method: 'POST',
					body: {
						email,
						otp_for
					}
				})
				return response
			}	
		})
	})
})

export const { useSendOtpMutation } = profileApiSlice
