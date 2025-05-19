import { create } from 'zustand'
import * as ExpoSecureStore from 'expo-secure-store'

type UserState = {
	username: string | null
	lastUsernameChanged: string | null
	email: string | null
	first_name: string | null
	last_name: string | null
	lastNameChanged: string | null
	profile_image: string | null
	background_pattern_code: number | null
	background_image: string | null
	background_type: string | null
	country: string | null
	city: string | null
	state: string | null
	gender: string | null
	date_joined: string | null
	device: string | null
	gitHub: string | null
	dobDate: string | null
	dobMonth: string | null
	dobYear: string | null
	website: string | null
	mobileCountryCode: string | null
	mobileNumber: string | null
	whatsappCountryCode: string | null
	whatsappNumber: string | null

	setUser: (user: Partial<UserState>) => void
}

export const useUserStore = create<UserState>((set) => ({
	username: 'sachin',
	lastUsernameChanged: null,
	email: null,
	first_name: null,
	last_name: null,
	lastNameChanged: null,
	profile_image: null,
	background_pattern_code: null,
	background_image: null,
	background_type: null,
	country: null,
	city: null,
	state: null,
	gender: null,
	date_joined: null,
	device: null,
	gitHub: null,
	dobDate: null,
	dobMonth: null,
	dobYear: null,
	website: null,
	mobileCountryCode: null,
	mobileNumber: null,
	whatsappCountryCode: null,
	whatsappNumber: null,

	setUser: (user) => set(user),
}))


type TokensState = {
	refresh: string | null,
	access: string | null,

	setTokens: (tokens: Partial<TokensState>) => void
}

export const useTokensStore = create<TokensState>()((set) => ({
	refresh: null,
	access: null,

	setTokens: async (tokens) => {
		set(tokens)
		await ExpoSecureStore.setItemAsync('refreshToken', tokens.refresh || '')
		await ExpoSecureStore.setItemAsync('accessToken', tokens.access || '')
	},
}))
