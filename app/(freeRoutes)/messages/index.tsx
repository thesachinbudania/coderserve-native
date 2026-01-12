import { Dimensions, Text, Pressable, View, Image, StyleSheet, Linking, AppState } from 'react-native';
import ListPageLayout from '@/components/general/ListPageLayout';
import FloatingButton from '@/components/buttons/FlotingButton';
import { useRouter } from 'expo-router';
import React from 'react';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import ImageLoader from '@/components/ImageLoader';
import TruncatedText from '@/components/general/TruncatedText';
import { formatTime } from '@/helpers/helpers';
import * as Notification from 'expo-notifications';
import BottomDrawer from '@/components/BottomDrawer';
import BlueButton from '@/components/buttons/BlueButton';
import SearchBar from '@/components/form/SearchBar';
import OptionChip from '@/components/general/OptionChip';


export default function Messages() {
  const router = useRouter()
  const width = Dimensions.get('window').width;
  function RenderItem({ item }: { item: any }) {
    const profileImage = item.other_participant?.profile_image || '';
    const messageTime = formatTime(item.last_message_time)
    return (
      <Pressable
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => {
          router.push('/(freeRoutes)/messages/chat/' + item.id);
        }}
      >
        <ImageLoader size={48} uri={profileImage} />
        <View style={{ gap: 8, marginLeft: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: width - 96 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.other_participant?.first_name || ''} {item.unseen_count > 0 && <Text style={{ color: "#737373" }}>({item.unseen_count})</Text>}</Text>
            <Text style={{ fontSize: 11, color: "#b4b4b4" }}>{messageTime}</Text>
          </View>
          <TruncatedText
            style={{ fontSize: 13, color: "#737373" }}
            negativeWidth={96}
          >{item.last_message?.content || ''}</TruncatedText>
        </View>
      </Pressable>
    )
  }
  const { combinedData, initialLoading, refreshing, handleEndReached, handleRefresh, isLoading, setFilteredData, searchQuery, setSearchQuery, filteredData } = useFetchData({ url: '/api/home/list_conversations/', allowSearch: true });

  React.useEffect(() => {
    if (searchQuery === '') {
      setFilteredData(combinedData);
    } else {
      const filtered = combinedData.filter((item) =>
        item.other_participant.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.other_participant.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, combinedData]);


  // show notification drawer if not permitted
  const drawerRef = React.useRef<any>(null);
  const [permission, setPermission] = React.useState<Notification.PermissionResponse | null>(null)

  React.useEffect(() => {
    Notification.getPermissionsAsync().then((permission) => {
      setPermission(permission)
    })
  }, [])

  const checkPermissions = () => {
    if (permission && !permission.granted) {
      setTimeout(() => {
        drawerRef.current?.open()
      }, 2000)
    }
    else {
      drawerRef.current?.close()
    }
  }

  React.useEffect(() => {
    checkPermissions()
  }, [permission])

  // check for permissions again after switching to the app
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkPermissions();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const [tab, setTab] = React.useState<'direct' | 'groups' | 'job_updates'>('direct')


  return (
    <>
      <ListPageLayout
        headerTitle='Messages'
        flex1
      >
        <DataList
          data={tab === 'direct' ? filteredData : []}
          RenderItem={RenderItem}
          initialLoading={initialLoading}
          refreshing={refreshing}
          allowSearch={false}
          onSearchChange={setSearchQuery}
          onEndReached={handleEndReached}
          onRefresh={handleRefresh}
          customHeader={<View>
            <View style={{}}>
              <SearchBar onChangeText={setSearchQuery} />
              <View style={{ backgroundColor: '#f5f5f5', paddingBottom: 8, marginHorizontal: -16 }}>
                <View style={{ flexDirection: 'row', gap: 16, paddingTop: 32, paddingBottom: 16, backgroundColor: 'white', paddingHorizontal: 16 }}>
                  <OptionChip
                    selected={tab === 'direct'}
                    title="Direct"
                    onPress={() => setTab('direct')}
                  />
                  <OptionChip
                    selected={tab === 'groups'}
                    title="Groups"
                    onPress={() => setTab('groups')}
                  />
                  <OptionChip
                    selected={tab === 'job_updates'}
                    title="Job Updates"
                    onPress={() => setTab('job_updates')}
                  />
                </View>
              </View>
            </View>
          </View>}
          noData={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
            <Image source={require('@/assets/images/messages.png')} style={{ height: 120, width: 130, objectFit: 'contain' }}></Image>
            <Text style={[styles.emptyText, { marginTop: 28 }]}>{tab === 'direct' ? 'Private chats with people you follow - and those who follow you - will show up here. Start a converstion and stay connected!' : tab === 'groups' ? 'Direct ideas grow stronger together! Create or join a group, collaborate to learn and grow as a team.' : 'Your job-related chats live here. Apply to your dream job roles and be the first to hear back from recruiters - all in one place.'}</Text>
          </View>}
        />

      </ListPageLayout>
      {
        tab != 'job_updates' && (
          <FloatingButton
            onPress={() => router.push('/(freeRoutes)/messages/recipients')}
          />
        )
      }

      <BottomDrawer
        sheetRef={drawerRef}
        draggableIconHeight={0}
        closeOnPressMask={false}
      >
        <View style={{ marginHorizontal: 16 }}>
          <Image source={require('@/assets/images/home/allowNotifications.png')} style={{ height: 60, width: 60, marginHorizontal: 'auto' }} />
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 12 }}>Enable Notifications to Use Messages</Text>
          <Text style={{ fontSize: 13, textAlign: 'center', color: "#737373", marginTop: 12 }}>To receive and reply to messages in real time, notifications are required. Enable notifications so you never miss a message or important update on Coder Serve.</Text>
          <BlueButton
            title="Allow notifications"
            style={{ marginTop: 32 }}
            onPress={() => {
              Linking.openSettings();
            }}
          />
        </View>
      </BottomDrawer>
    </>
  )
}

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 11,
    color: '#a6a6a6',
    textAlign: 'center',
  }
})
