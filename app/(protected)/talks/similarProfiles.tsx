import { ActivityIndicator, FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import ImageLoader from '@/components/ImageLoader';
import UnorderedList, { styles as unorderedListStyles } from '@/components/general/UnorderedList';
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
import * as Contacts from 'expo-contacts'
import BottomDrawer from '@/components/BottomDrawer';
import BlueButton from '@/components/buttons/BlueButton';
import { useFocusEffect } from 'expo-router';
import protectedApi from '@/helpers/axios';

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
        <View style={{ gap: 4, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{data['first_name']} {data['last_name']}</Text>
            {data.is_contact && (
              <Text style={{ fontSize: 9, color: 'white', backgroundColor: "#004aad", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>Contact</Text>
            )}
          </View>
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
        <View style={unorderedListStyles.listItem}>
          <Text style={unorderedListStyles.bullet}>{'\u2022'}</Text>
          <Text style={[unorderedListStyles.detailText, { fontSize: 13, lineHeight: 0, textDecorationLine: 'underline' }]} onPress={() => router.push(`/(freeRoutes)/profile/userProfile/${data['username']}`)}>See More</Text>
        </View>
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

  // get users contacts permissions and store their contacts in a state
  const permissionDrawerRef = React.useRef<any>(null)
  const [contactsPermission, setContactsPermission] = React.useState<Contacts.PermissionResponse | null>(null)

  React.useEffect(() => {
    Contacts.getPermissionsAsync().then((response) => {
      setContactsPermission(response);
    })
  }, [])

  useFocusEffect(React.useCallback(() => {
    if (!contactsPermission) return;
    if (contactsPermission?.granted) {
      const getContacts = async () => {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        const phoneNumbers = data.flatMap(c => c.phoneNumbers ?? []).map(p => p.number);
        protectedApi.post('/accounts/contacts/', { contacts: phoneNumbers }).then(res => console.log(res.data))
      };
      getContacts();
    }
    else {
      permissionDrawerRef.current?.open();
    }
  }, [contactsPermission]))


  function handleAllowContacts() {
    if (contactsPermission?.canAskAgain) {
      Contacts.requestPermissionsAsync().then((response) => {
        setContactsPermission(response);
      })
    }
    else {
      Linking.openSettings();
    }
  }


  React.useEffect(() => {
    if (data) {
      if (refreshing) {
        setCombinedData([]);
        setRefreshing(false);
      }
      // include data.results in combinedData if the username doesn't exists already
      setCombinedData(prev => [...prev, ...data.results.filter((item: any) => !prev.some((prevItem) => prevItem.username === item.username))]);
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
      <BottomDrawer sheetRef={permissionDrawerRef} draggableIconHeight={0}>
        <View style={{ paddingHorizontal: 16 }}>
          <Image
            source={require('@/assets/images/talks/telephone.png')}
            style={{ width: 60, height: 60, marginHorizontal: 'auto' }}
          />
          <Text style={{ textAlign: "center", fontSize: 15, fontWeight: 'bold', marginTop: 16 }}>Connect with your Network</Text>
          <Text style={{ textAlign: "center", fontSize: 13, marginTop: 16, color: "#737373" }}>Find friends, peers, and colleagues already on Coder Serve. Allow contact access so we can help you discover and connect instantly.</Text>
          <BlueButton title='Allow Contacts' style={{ marginTop: 32 }} onPress={handleAllowContacts} />
        </View>
      </BottomDrawer>
    </>
  );
}
