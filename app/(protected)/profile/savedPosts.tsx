import React from 'react';
import PageLayout from "@/components/general/PageLayout";
import { Image, View } from 'react-native';
import useFetchData from '@/helpers/general/handleFetchedData';
import { Post } from '@/app/(protected)/talks/index';
import BottomName from '@/components/profile/home/BottomName';
import NoData from '@/components/general/NoData';


export default function CommentHistory() {
    const RenderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={{ backgroundColor: '#f5f5f5', paddingBottom: 8, width: '100%', paddingHorizontal: -16 }}>
            <Post data={item} />
        </View>
    );

    const { RenderData, combinedData, initialLoading} = useFetchData({ url: '/api/talks/saved_posts/', RenderItem });
    return (
        <PageLayout headerTitle="Saved Posts" flex1={initialLoading} >
            <View style={[{marginHorizontal: -16, marginTop: -24}, initialLoading && {flex: 1}]}>
            <RenderData />
</View>
{
    !initialLoading && (combinedData.length === 0 ? (
        <NoData text="No comments yet. Once you join discussions, all your comments will be collected here."/>
    ): <BottomName />)
}
        </PageLayout>
    );
}