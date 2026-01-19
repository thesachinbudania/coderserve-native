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
import SmallTextButton from '@/components/buttons/SmallTextButton';

function matchDegrees(user1Degrees: Degrees, user2Degrees: Degrees): string[] {
  const matched: string[] = [];

  const set2 = new Set(user2Degrees.map(d => `${d.degree.toLowerCase()}|${d.field_of_study.toLowerCase()}`));

  for (const d1 of user1Degrees) {
    const key = `${d1.degree.toLowerCase()}|${d1.field_of_study.toLowerCase()}`;
    if (set2.has(key)) {
      matched.push(d1.degree + ' in ' + d1.field_of_study);
    }
  }
  if (matched.length > 0) {
    return matched;
  }
  return [`${user2Degrees[0].degree} in ${user2Degrees[0].field_of_study}`];
}

const ProfileOption = ({ data }: { data: any }) => {
  const { degrees } = useJobsState();
  const matchedDegrees = degrees ? matchDegrees(degrees, data['user_resume']['degrees']) : [];
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [{ padding: 16, borderWidth: 1, borderColor: '#f5f5f5', borderRadius: 12 }, pressed && { borderColor: '#006dff' }]}
      onPress={() => router.push(`/(freeRoutes)/profile/userProfile/${data['username']}`)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View>
          <ImageLoader
            size={45}
            uri={data['profile_image']}
          />
        </View>
        <View style={{ gap: 8, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, lineHeight: 15 }}>{data['first_name']} {data['last_name']}</Text>
            {data.is_contact && (
              <Text style={{ fontSize: 9, color: 'white', backgroundColor: "#004aad", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, lineHeight: 9 }}>Contact</Text>
            )}
          </View>
          <Text style={{ fontSize: 12, color: '#a6a6a6', lineHeight: 11 }}>@{data['username']}</Text>
        </View>
      </View>
      <View style={{ marginTop: 24, borderRadius: 8, padding: 8, backgroundColor: '#f5f5f5' }}>
        <UnorderedList
          items={[
            matchedDegrees[0],
            `Lives in ${data['city']}, ${data['state']}, ${data['country']}`,
          ]}
          gap={-4}
          textStyle={{ fontSize: 13, lineHeight: 13, color: '#737373' }}
        />
        <View style={[unorderedListStyles.listItem, { marginTop: -4 }]}>
          <Text style={unorderedListStyles.bullet}>{'\u2022'}</Text>
          <SmallTextButton
            style={{ fontSize: 13, lineHeight: 13, textDecorationLine: 'underline', color: '#737373' }}
            onPress={() => router.push(`/(freeRoutes)/profile/userProfile/${data['username']}`)}
            title='See More'
          >
          </SmallTextButton>
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
        permissionDrawerRef.current?.close();
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
              ) : combinedData.length > 3 ? (
                <View style={{ marginBottom: 64 }}>
                  <BottomName />
                </View>
              ) : null}
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
          <Text style={{ textAlign: "center", fontSize: 15, fontWeight: 'bold', marginTop: 16, lineHeight: 15 }}>Connect with your Network</Text>
          <Text style={{ textAlign: "center", fontSize: 13, marginTop: 14, color: "#737373" }}>Find friends, peers, and colleagues already on Coder Serve. Allow contact access so we can help you discover and connect instantly.</Text>
          <BlueButton title='Allow Contacts' style={{ marginTop: 30 }} onPress={handleAllowContacts} />
        </View>
      </BottomDrawer>
    </>
  );
}
