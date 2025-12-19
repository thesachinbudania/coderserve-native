import { createApi } from '@reduxjs/toolkit/query/react';

export const profileApiSlice = createApi({
	reducerPath: 'profileApi',
	baseQuery: baseQueryWithReAuth,
	endpoints: builder => ({
		sendOtp: builder.mutation({
			query: data => {
				return ({
					url: '/resend_otp/',
					method: 'PUT',
					body: data
				})

			}
		}),
		changeEmailSendOtp: builder.mutation({
			query: data => ({
				url: `/change_email_send_otp/${data.email}/`,
				method: 'PUT',
				body: { temp_email: data.temp_email }
			})
		}),
		changeEmailSaveEmail: builder.mutation({
			query: () => ({
				url: `/change_email_save_email/`,
				method: 'PUT',
			})
		}),
		changePassword: builder.mutation({
			query: data => ({
				url: '/change_password/',
				method: 'PUT',
				body: data
			})
		}),
		getLoginHistory: builder.query({
			query: () => ({
				url: '/get_login_history/',
				method: 'GET',
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
		setBackgroundImage: builder.mutation({
			query: image => {
				const formData: any = new global.FormData()
				formData.append("background_image", {
					uri: image.uri,
					type: 'image/jpeg',
					name: 'background_image.jpg'
				})
				formData.append('background_type', 'custom'
				)
				return ({
					url: '/change_background_image/',
					method: 'PUT',
					body: formData,
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})

			}
		}),

		deleteProfileImage: builder.mutation({
			query: () => ({
				url: '/delete_profile_image/',
				method: 'PUT',
				body: {}
			})
		}),
		deleteBackgroundImage: builder.mutation({
			query: () => ({
				url: '/delete_background_image/',
				method: 'PUT',
				body: {}
			})
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
		setFullName: builder.mutation({
			query: data => ({
				url: '/update_name/',
				method: 'PUT',
				body: data
			})
		}),
		setLocation: builder.mutation({
			query: data => ({
				url: '/update_location_details/',
				method: 'PUT',
				body: data
			})
		}),
		setGitHub: builder.mutation({
			query: data => ({
				url: '/update_github/',
				method: 'PUT',
				body: data
			})
		}),
		setWebsite: builder.mutation({
			query: data => ({
				url: '/update_website/',
				method: 'PUT',
				body: data
			})
		}),
		setPhoneNumber: builder.mutation({
			query: data => ({
				url: '/update_phone_number/',
				method: 'PUT',
				body: data
			})
		}),
		setWhatsappNumber: builder.mutation({
			query: data => ({
				url: '/update_whatsapp_number/',
				method: 'PUT',
				body: data
			})
		}),
		setDob: builder.mutation({
			query: data => ({
				url: '/update_birthday/',
				method: 'PUT',
				body: data,
			})
		}),
		setGender: builder.mutation({
			query: data => ({
				url: '/update_gender/',
				method: 'PUT',
				body: data,
			})
		}),
		setBackground: builder.mutation({
			query: data => ({
				url: '/update_background_pattern/',
				method: 'PUT',
				body: data,
			})
		})

	})
})

export const { useDeleteBackgroundImageMutation, useSetBackgroundImageMutation, useSetBackgroundMutation, useSetGenderMutation, useSetDobMutation, useSetWhatsappNumberMutation, useSetPhoneNumberMutation, useSetWebsiteMutation, useSetGitHubMutation, useSetLocationMutation, useSetFullNameMutation, useSetUsernameMutation, useDeleteProfileImageMutation, useSetProfileImageMutation, useSendOtpMutation, useGetLoginHistoryQuery, useChangeEmailSendOtpMutation, useChangeEmailSaveEmailMutation, useChangePasswordMutation } = profileApiSlice
