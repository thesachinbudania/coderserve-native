import React from 'react';
import PageLayout from "@/components/general/PageLayout";
import { Image, View } from 'react-native';
import useFetchData from '@/helpers/general/handleFetchedData';
import { Post } from '@/app/(protected)/talks/index';
import BottomName from '@/components/profile/home/BottomName';
import NoData from '@/components/general/NoData';


export default function VotedPosts() {
    const RenderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={{ backgroundColor: '#f5f5f5', paddingBottom: 8, width: '100%', paddingHorizontal: -16 }}>
            <Post data={item} />
        </View>
    );

    const { RenderData, combinedData, initialLoading} = useFetchData({ url: '/api/talks/voted_posts/', RenderItem });

    return (
        <PageLayout headerTitle="Voted Posts" >
            <View style={[{marginHorizontal: -16, marginTop: -24}, initialLoading && {flex: 1}]}>
            <RenderData />
</View>
{
    !initialLoading && (combinedData.length === 0 ? (
        <NoData text="You haven't voted on any posts yet. Once you upvote or downvote, the'll appear here for easy tracking."/>
    ): <BottomName />)
}
        </PageLayout>
    );
}