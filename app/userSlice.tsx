import { createSlice } from '@reduxjs/toolkit';

type UserState = {
  username: string | null,
  lastUsernameChanged: string | null,
  email: string | null,
  firstName: string | null,
  lastName: string | null,
  lastNameChanged: string | null,
  profilePicture: string | null,
  backgroundCode: string | null,
  backgroundImage: string | null,
  backgroundType: string | null,
  country: string | null,
  city: string | null,
  state: string | null,
  gender: string | null,
  dateJoined: string | null,
  device: string | null,
  gitHub: string | null,
  dobDate: string | null,
  dobMonth: string | null,
  dobYear: string | null,
  website: string | null,
  mobileCountryCode: string | null,
  mobileNumber: string | null,
  whatsappCountryCode: string | null,
  whatsappNumber: string | null,
}


const userState: UserState = {
  username: null,
  lastUsernameChanged: null,
  email: null,
  firstName: null,
  lastName: null,
  lastNameChanged: null,
  profilePicture: null,
  backgroundCode: '1',
  backgroundImage: null,
  backgroundType: null,
  country: null,
  city: null,
  state: null,
  gender: null,
  dateJoined: null,
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
}

const userSlice = createSlice({
  initialState: userState,
  name: 'user',
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username || state.username;
      state.lastUsernameChanged = action.payload.lastUsernameChanged || state.lastUsernameChanged;
      state.email = action.payload.email || state.email;
      state.firstName = action.payload.firstName || state.firstName;
      state.lastName = action.payload.lastName || state.lastName;
      state.lastNameChanged = action.payload.lastNameChanged || state.lastNameChanged;
      state.profilePicture = action.payload.profilePicture || state.profilePicture;
      state.backgroundCode = action.payload.backgroundCode || state.backgroundCode;
      state.backgroundImage = action.payload.backgroundImage || state.backgroundImage;
      state.backgroundType = action.payload.backgroundType || state.backgroundType;
      state.country = action.payload.country || state.country;
      state.city = action.payload.city || state.city;
      state.state = action.payload.state || state.state;
      state.gender = action.payload.gender || state.gender;
      state.dateJoined = action.payload.dateJoined || state.dateJoined;
      state.device = action.payload.device || state.device;
      state.gitHub = action.payload.gitHub || state.gitHub;
      state.dobDate = action.payload.dobDate || state.dobDate;
      state.dobMonth = action.payload.dobMonth || state.dobMonth;
      state.dobYear = action.payload.dobYear || state.dobYear;
      state.website = action.payload.website || state.website;
      state.mobileCountryCode = action.payload.mobileCountryCode || state.mobileCountryCode;
      state.mobileNumber = action.payload.mobileNumber || state.mobileNumber;
      state.whatsappCountryCode = action.payload.whatsappCountryCode || state.whatsappCountryCode;
      state.whatsappNumber = action.payload.whatsappNumber || state.whatsappNumber
    },
    clearUser: (state) => {
      state.username = null;
      state.lastUsernameChanged = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.lastNameChanged = null;
      state.profilePicture = null;
      state.backgroundCode = null;
      state.backgroundImage = null;
      state.backgroundType = null;
      state.country = null;
      state.city = null;
      state.state = null;
      state.gender = null;
      state.dateJoined = null;
      state.device = null;
      state.gitHub = null;
      state.dobDate = null;
      state.dobMonth = null;
      state.dobYear = null;
      state.website = null;
      state.mobileCountryCode = null;
      state.mobileNumber = null;
      state.whatsappCountryCode = null;
      state.whatsappNumber = null;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setCountry: (state, action) => {
      state.country = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
  }
})

export const { setUser, clearUser, setUsername, setCountry, setCity, setState } = userSlice.actions;

export default userSlice.reducer;
