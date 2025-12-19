import { create } from 'zustand';
import { useUserStore } from './stores';

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


export type JobsState = {
  employment_status: number | null,
  expected_salary_currency: string | null,
  expected_salary: number | null,
  about: string | null,
  previous_experience: PreviousExperience | null,
  degrees: Degrees | null,
  other_certifications: OtherCertifications | null,
  skills: string[] | null,
  languages: Languages | null,
  setJobsState: (jobsState: Partial<JobsState>) => void
}


export const useJobsState = create<JobsState>((set) => ({
  employment_status: null,
  expected_salary_currency: null,
  expected_salary: null,
  about: null,
  previous_experience: null,
  degrees: null,
  other_certifications: null,
  skills: null,
  languages: null,

  setJobsState: (jobsState) => set(jobsState),
}))

type ResumeEdit = {
  edit: boolean,
  id: number | null,

  setResumeEdit: (resumeEdit: Partial<ResumeEdit>) => void
}

export const useResumeEdit = create<ResumeEdit>((set) => ({
  edit: false,
  id: null,

  setResumeEdit: (resumeEdit) => set(resumeEdit),
}));


export const isTalksProfileCompleted = () => {
  const { about, previous_experience, degrees } = useJobsState.getState();
  return (
    about !== null &&
    previous_experience !== null &&
    degrees !== null &&
    degrees.length > 0 &&
    about != '' && 
    previous_experience.length > 0
  );
}
