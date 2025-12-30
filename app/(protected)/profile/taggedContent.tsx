import React from 'react';
import PageLayout from "@/components/general/PageLayout";
import { Image, View } from 'react-native';
import useFetchData from '@/helpers/general/handleFetchedData';
import { Post } from '@/app/(protected)/talks';
import BottomName from '@/components/profile/home/BottomName';
import NoData from '@/components/general/NoData';


export default function CommentHistory() {
    const RenderItem = ({ item, index }: { item: any; index: number }) => (
        <View style={{ backgroundColor: '#f5f5f5', paddingBottom: 8, width: '100%', paddingHorizontal: -16 }}>
            <Post data={item} />
        </View>
    );

    const { RenderData, combinedData, initialLoading } = useFetchData({ url: '/api/talks/replied_to_posts/', RenderItem });

    return (
        <PageLayout headerTitle="Tagged Content" >
            <View style={{ marginHorizontal: -16, marginTop: -24 }}>
                <RenderData />
            </View>
            {
                !initialLoading && (combinedData.length === 0 ? (
                    <NoData text="You haven't been tagged in any posts yet. When someone tags you, it'll show up here." />
                ) : <BottomName />)
            }
        </PageLayout>
    );
}