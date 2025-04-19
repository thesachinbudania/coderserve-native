import { createSlice } from '@reduxjs/toolkit';

type JobsState = {
  employmentStatus: number | null,
  salaryCurrency: string | null,
  salary: number | null,
  about: string | null,
}

const JobsState: JobsState = {
  employmentStatus: null,
  salaryCurrency: null,
  salary: null,
  about: null,
}

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: JobsState,
  reducers: {
    setEmploymentStatus: (state, action) => {
      state.employmentStatus = action.payload;
    },
    setSalary: (state, action) => {
      state.salaryCurrency = action.payload.currency;
      state.salary = action.payload.salary;
    },
    setAbout: (state, action) => {
      state.about = action.payload;
    }
  },
});

export const { setEmploymentStatus, setSalary, setAbout } = jobsSlice.actions;
export default jobsSlice.reducer;
