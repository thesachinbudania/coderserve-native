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




  return (
    <>
      <ListPageLayout
        headerTitle='Messages'
      >
        {
          combinedData.length > 0 || initialLoading || isLoading || refreshing ?
            <DataList
              data={filteredData}
              RenderItem={RenderItem}
              initialLoading={initialLoading}
              refreshing={refreshing}
              allowSearch={true}
              onSearchChange={setSearchQuery}
              onEndReached={handleEndReached}
              onRefresh={handleRefresh}
            />
            :

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
              <Image source={require('@/assets/images/messages.png')} style={{ height: 128, width: 138, objectFit: 'contain' }}></Image>
              <Text style={[styles.emptyText, { marginTop: 32 }]}>Private chats with people you follow - and those who follow you - will show up here.</Text>
              <Text style={styles.emptyText}>Start a converstion and stay connected!</Text>
            </View>
        }
      </ListPageLayout>

      <FloatingButton
        onPress={() => router.push('/(freeRoutes)/messages/recipients')}
      />
      <BottomDrawer
        sheetRef={drawerRef}
        draggableIconHeight={0}
        closeOnPressMask={false}
      >
        <View style={{ marginHorizontal: 16 }}>
          <Image source={require('@/assets/images/home/allowNotifications.png')} style={{ height: 60, width: 60, marginHorizontal: 'auto' }} />
          <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center', marginTop: 12 }}>Enable Notifications to Use Messages</Text>
          <Text style={{ fontSize: 13, textAlign: 'center', color: "#73737", marginTop: 12 }}>To receive and reply to messages in real time, notifications are required. Enable notifications so you never miss a message or important update on Coder Serve.</Text>
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
