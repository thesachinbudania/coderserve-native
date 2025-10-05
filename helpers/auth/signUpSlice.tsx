import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface SignUpState {
	email: string | null;
	token: {
		refresh: string | null;
		access: string | null;
	}
}

const initialState: SignUpState = {
	email: null,
	token: {
		refresh: null,
		access: null
	}
}

const signUpSlice = createSlice({
	name: 'signUp',
	initialState: initialState,
	reducers: {
		setEmailState: (state, action: PayloadAction<{ email: string }>) => {
			state.email = action.payload.email;
		},
		setTokenState: (state, action: PayloadAction<{ refresh: string, access: string }>) => {
			state.token.refresh = action.payload.refresh;
			state.token.access = action.payload.access;
		}
	}
})

export const { setEmailState, setTokenState } = signUpSlice.actions;

export default signUpSlice.reducer;
