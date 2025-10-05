import { createApi } from '@reduxjs/toolkit/query/react';

export const jobsApiSlice = createApi({
	reducerPath: 'jobsApi',
	baseQuery: baseQueryWithReAuth,
	endpoints: builder => ({
		updateResume: builder.mutation({
			query: data => ({
				url: '/resume/update/',
				method: 'PUT',
				body: data
			})
		}),
		getResume: builder.query({
			query: () => ({
				url: '/resume/update/',
				method: 'GET',
			}),
		}),
		companiesData: builder.mutation({
			query: (data: { detail: boolean, data: string }) => {
				let pattern = '';
				if (data.detail) {
					pattern = `/companies_search_recommendations/${data.data}/`;
				}
				else {
					pattern = `/companies_search_recommendations/?q=${data.data}`;
				}
				return ({
					url: pattern,
					method: 'GET',
				})
			}
		}),
		updateJobExperience: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/update_job_experience/',
					method: 'PUT',
					body: data
				})
			}
		}),
		updateExperience: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/update_experience/',
					method: 'PUT',
					body: data
				})
			}
		}),
		deleteExpereince: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/delete_experience/',
					method: 'PUT',
					body: data
				})
			}
		}),
		addDegree: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/add_degree/',
					method: 'PUT',
					body: data
				})
			}
		}),
		updateDegree: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/update_degree/',
					method: 'PUT',
					body: data
				})
			}
		}),
		deleteDegree: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/delete_degree/',
					method: 'PUT',
					body: data
				})
			}
		}),
		addCertification: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/add_certification/',
					method: 'PUT',
					body: data
				})
			}
		}),
		updateCertification: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/update_certification/',
					method: 'PUT',
					body: data
				})
			}
		}),
		deleteCertification: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/delete_certification/',
					method: 'PUT',
					body: data
				})
			}
		}),
		updateSkills: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/update_skills/',
					method: 'PUT',
					body: data
				})
			}
		}),
		addLanguages: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/add_language/',
					method: 'PUT',
					body: data
				})
			}
		}),
		updateLanguages: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/update_language/',
					method: 'PUT',
					body: data
				})
			}
		}),
		deleteLanguages: builder.mutation({
			query: (data) => {
				return ({
					url: '/resume/delete_language/',
					method: 'PUT',
					body: data
				})
			}
		}),
	})
})

export const { useAddLanguagesMutation, useUpdateLanguagesMutation, useDeleteLanguagesMutation, useUpdateSkillsMutation, useAddCertificationMutation, useUpdateCertificationMutation, useDeleteCertificationMutation, useAddDegreeMutation, useDeleteDegreeMutation, useUpdateDegreeMutation, useDeleteExpereinceMutation, useUpdateExperienceMutation, useUpdateJobExperienceMutation, useCompaniesDataMutation, useUpdateResumeMutation, useGetResumeQuery } = jobsApiSlice
