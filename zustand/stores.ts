import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'
import protectedApi from '@/helpers/axios'
import { useJobsState } from './jobsStore'

export interface UserState {
  username: string | null
  user_id: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  profile_image: string | null
  background_pattern_code: number | null
  background_image: string | null
  background_type: string | null
  gender: string | null
  country: string | null
  city: string | null
  state: string | null
  date_joined: string | null
  device: string | null
  gitHub: string | null
  dobDate: string | null
  dobMonth: string | null
  dobYear: string | null
  website: string | null
  mobileCountryCode: string | null
  mobile: string | null
  whatsappCountryCode: string | null
  whatsappNumber: string | null
  last_name_changed: string | null
  last_username_changed: string | null
  following: number | null
  followers: number | null
  posts: number | null
  setUser: (user: Partial<UserState>) => void
}

export const useUserStore = create<UserState>((set) => ({
  username: null,
  user_id: null,
  email: null,
  first_name: null,
  last_name: null,
  profile_image: null,
  background_pattern_code: null,
  background_image: null,
  background_type: null,
  gender: null,
  country: null,
  city: null,
  state: null,
  date_joined: null,
  device: null,
  gitHub: null,
  dobDate: null,
  dobMonth: null,
  dobYear: null,
  website: null,
  mobileCountryCode: null,
  mobile: null,
  whatsappCountryCode: null,
  whatsappNumber: null,
  last_name_changed: null,
  last_username_changed: null,
  following: null,
  followers: null,
  posts: null,
  setUser: (user) => set(user),
}))

interface TokensState {
  refresh: string | null
  access: string | null
  setTokens: (tokens: { refresh?: string | null; access?: string | null }) => Promise<void>
  clearTokens: () => Promise<void>
}

interface NotificationsUnreadState {
  account: number
  journey: number
  job_alerts: number
  follow_requests: number
  upvotes: number
  downvotes: number
  comments: number
  replies: number
  tags: number
  support: number
  setNotificationsUnread: (notificationsUnread: Partial<NotificationsUnreadState>) => void
}

export const useNotificationsUnreadStore = create<NotificationsUnreadState>((set) => ({
  account: 0,
  journey: 0,
  job_alerts: 0,
  follow_requests: 0,
  upvotes: 0,
  downvotes: 0,
  comments: 0,
  replies: 0,
  tags: 0,
  support: 0,
  setNotificationsUnread: (notificationsUnread) => set(notificationsUnread),
}))

export const useTokensStore = create<TokensState>((set) => ({
  refresh: null,
  access: null,
  setTokens: async (tokens) => {
    set(tokens)
    if (tokens.access) await SecureStore.setItemAsync('accessToken', tokens.access)
    if (tokens.refresh) await SecureStore.setItemAsync('refreshToken', tokens.refresh)
  },
  clearTokens: async () => {
    set({ refresh: null, access: null })
    await SecureStore.deleteItemAsync('accessToken')
    await SecureStore.deleteItemAsync('refreshToken')
  }
}))

export async function syncUser() {
  const { setUser } = useUserStore.getState()
  const { setJobsState } = useJobsState.getState()
  const response = await protectedApi.get('/accounts/auth_token_validator/')
  setUser(response.data)
  const resumeState = await protectedApi.get('/jobs/resume/update_resume/')
  setJobsState(resumeState.data)
}
