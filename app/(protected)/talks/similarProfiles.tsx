import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import ImageLoader from '@/components/ImageLoader';
import UnorderedList from '@/components/general/UnorderedList';
import BottomName from '@/components/profile/home/BottomName';
import BottomFixedContainer from '@/components/general/BottomFixedContainer';
import Button from '@/components/buttons/BlueButton';
import { useRouter } from 'expo-router';
import { useFetch } from '@/helpers/useFetch';
import { apiUrl } from '@/constants/env';
import type { Degrees } from '@/zustand/jobsStore';
import { useJobsState } from '@/zustand/jobsStore';
import DataWrapper from '@/components/general/DataWrapper';
import React from 'react';

function matchDegrees(user1Degrees: Degrees, user2Degrees: Degrees): string[] {
  const matched: string[] = [];

  const set2 = new Set(user2Degrees.map(d => `${d.degree.toLowerCase()}|${d.field_of_study.toLowerCase()}`));

  for (const d1 of user1Degrees) {
    const key = `${d1.degree.toLowerCase()}|${d1.field_of_study.toLowerCase()}`;
    if (set2.has(key)) {
      matched.push(d1.degree + ' in ' + d1.field_of_study);
    }
  }

  return matched;
}

const ProfileOption = ({ data }: { data: any }) => {
  const { degrees } = useJobsState();
  const matchedDegrees = degrees ? matchDegrees(degrees, data['user_resume']['degrees']) : [];
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [{ padding: 16, borderWidth: 1, borderColor: '#eeeeee', borderRadius: 12 }, pressed && { borderColor: '#006dff' }]}
      onPress={() => router.push(`/(freeRoutes)/profile/userProfile/${data['username']}`)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <ImageLoader
          size={45}
          uri={data['profile_image']}
        />
        <View style={{ gap: 4 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{data['first_name']} {data['last_name']}</Text>
          <Text style={{ fontSize: 11, color: '#737373' }}>@{data['username']}</Text>
        </View>
      </View>
      <View style={{ marginTop: 24, paddingVertical: 8, borderRadius: 8, paddingHorizontal: 16, backgroundColor: '#f5f5f5' }}>
        <UnorderedList
          items={[
            matchedDegrees[0],
            `Lives in ${data['city']}, ${data['state']}, ${data['country']}`,
          ]}
          gap={0}
          textStyle={{ fontSize: 13, lineHeight: 0 }}
        />
      </View>
    </Pressable>
  )
}

export default function SimilarProfiles() {
  const router = useRouter();

  const [combinedData, setCombinedData] = React.useState<any[]>([]);
  const [nextPage, setNextPage] = React.useState<string | null>(`${apiUrl}/api/jobs/similar_profiles/`);
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [isPaginating, setIsPaginating] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const { data, isLoading, refetch } = useFetch(nextPage || '');

  React.useEffect(() => {
    if (data) {
      if (refreshing) {
        setCombinedData([]);
        setRefreshing(false);
      }
      setCombinedData(prev => [...prev, ...data.results]);
      setNextPage(data.next);
      setIsPaginating(false);
      if (initialLoading) {
        setInitialLoading(false);
      }
    }
  }, [data]);

  const handleEndReached = () => {
    if (!isPaginating && nextPage && !initialLoading) {
      setIsPaginating(true);
      refetch();
    }
  };

  return (
    <>
      <DataWrapper
        isLoading={initialLoading}
        header='Similar Profiles'
      >
        <FlatList
          data={combinedData}
          renderItem={({ item }) => <ProfileOption data={item} />}
          keyExtractor={(item) => item['username']}
          contentContainerStyle={{ gap: 16, paddingHorizontal: 16, paddingTop: 24 }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onRefresh={() => {
            setRefreshing(true);
            refetch(`${apiUrl}/api/jobs/similar_profiles/`);
          }}
          refreshing={refreshing}
          ListFooterComponent={
            <>
              {isLoading || nextPage ? (
                <View style={{ width: '100%', height: 128, marginBottom: 77, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator color={'#202020'} />
                </View>
              ) : (
                <View style={{ marginBottom: 77 }}>
                  <BottomName />
                </View>
              )}
            </>
          }
        />
      </DataWrapper>

      <BottomFixedContainer>
        <Button
          title='Adjust Criteria'
          onPress={() => router.push('/(protected)/talks/similarProfilesCriteria')}
        />
      </BottomFixedContainer>
    </>
  );
}
