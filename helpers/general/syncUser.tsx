import { useUserStore } from "@/zustand/stores"
import protectedApi from "../axios"
import { useJobsState } from "@/zustand/jobsStore"

import errorHandler from "./errorHandler"

export default async function syncUser() {
    try {
        const { setUser } = useUserStore.getState()
        const { setJobsState } = useJobsState.getState()
        const response = await protectedApi.get('/accounts/auth_token_validator/')
        setUser(response.data)
        const resumeState = await protectedApi.get('/jobs/resume/update_resume/')
        setJobsState(resumeState.data)
    } catch (error: any) {
        errorHandler(error)
        console.error('Error syncing user:', error)
    }
}