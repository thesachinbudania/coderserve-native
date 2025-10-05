import axios from 'axios'
import { apiUrl } from '../constants/env'
import { useTokensStore } from '../zustand/stores'

export const api = axios.create({
  baseURL: `${apiUrl}/api/`,
  timeout: 10000,
})

const protectedApi = axios.create({
  baseURL: `${apiUrl}/api/`,
  timeout: 10000,
})

protectedApi.interceptors.request.use((config) => {
  const { access } = useTokensStore.getState()
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

protectedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { refresh, setTokens, clearTokens } = useTokensStore.getState()
    if (error.response?.status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true

      try {
        const response = await api.post('/accounts/token_generator/', { refresh_token: refresh })
        const { access_token: access, refresh_token: newRefresh } = response.data.token
        await setTokens({ access, refresh: newRefresh })
        originalRequest.headers.Authorization = `Bearer ${access}`
        return protectedApi(originalRequest)
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default protectedApi
