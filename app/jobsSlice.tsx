import { createSlice } from '@reduxjs/toolkit';

export type OtherCertifications = {
  id: number,
  title: string,
  company: string,
  link: string
}[]

export type Languages = {
  id: number,
  language: string,
  rating: number,
}[]

export type PreviousExperience = {
  id: number,
  job_type: string,
  job_role: string,
  city: string,
  company: {
    name: string,
    logo: string | null,
  },
  country: string,
  description: string,
  end_month: string,
  end_year: string,
  joining_month: string,
  joining_year: string,
  state: string,
  work_mode: string,
}[]

export type Degrees = {
  id: number,
  type: number,
  degree: string,
  field_of_study: string,
  marks: string,
  institution: string,
  joining_month: string,
  joining_year: string,
  end_month: string,
  end_year: string,
  country: string,
  state: string,
  city: string,
}[]


type JobsState = {
  employmentStatus: number | null,
  salaryCurrency: string | null,
  salary: number | null,
  about: string | null,
  previousExperience: PreviousExperience | null,
  degrees: Degrees | null,
  otherCertifications: OtherCertifications | null,
  skills: string[] | null,
  languages: Languages | null,
}

const JobsState: JobsState = {
  employmentStatus: null,
  salaryCurrency: null,
  salary: null,
  about: null,
  previousExperience: null,
  degrees: null,
  otherCertifications: null,
  skills: null,
  languages: null,
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
    },
    setPreviousExperience: (state, action) => {
      state.previousExperience = action.payload;
    },
    setDegrees: (state, action) => {
      state.degrees = action.payload;
    },
    setOtherCertifications: (state, action) => {
      state.otherCertifications = action.payload;
    },
    setSkills: (state, action) => {
      state.skills = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
  },
});

export const { setLanguages, setSkills, setOtherCertifications, setDegrees, setPreviousExperience, setEmploymentStatus, setSalary, setAbout } = jobsSlice.actions;
export default jobsSlice.reducer;
