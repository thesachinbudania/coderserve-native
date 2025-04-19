import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../../app/jobsApiSlice';

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
		})
	})
})

export const { useCompaniesDataMutation, useUpdateResumeMutation, useGetResumeQuery } = jobsApiSlice
