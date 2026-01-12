import React from 'react'
import PageLayout from '@/components/general/PageLayout'
import NoData from '@/components/general/NoData'

const Contests = () => {
    return (
        <PageLayout headerTitle="Contests">
            <NoData text="No contests yet. We'll notify you when the next one is announced - get ready to compete with coders around the world!" />
        </PageLayout>
    )
}

export default Contests