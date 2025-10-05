import { ActivityIndicator, Platform, Pressable, Text, View, ScrollView, Dimensions } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import React from 'react';
import ImageLoader from '@/components/ImageLoader';
import BlueButton from '@/components/buttons/BlueButton';
import OptionChip from '@/components/general/OptionChip';
import useFetchData from '@/helpers/general/handleFetchedData';
import timeAgo from '@/helpers/timeAgo';
import protectedApi from '@/helpers/axios';


function FollowRequest({ request, handleRefresh }: { request: any, handleRefresh: () => void }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await protectedApi.post(`/accounts/accept_follow_request/${request.id}/`);
      handleRefresh();
      // Optionally, you can refresh the data or show a success message
    } catch (error) {
      console.error('Error accepting follow request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ paddingVertical: 16, flexDirection: 'row', gap: 8 }}>
      <ImageLoader size={64} uri={request.sender.profile_image} />
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 13, color: "#737373" }}><Text style={{ fontWeight: 'bold', color: 'black' }}>{request.sender.first_name}</Text> has requested to follow you</Text>
        <Text style={{ color: "#a6a6a6", marginTop: 8 }}>{timeAgo(request.created_at)}</Text>
        <View style={{ marginTop: 16, flexDirection: 'row', gap: 16, width: 256 }}>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton title='Decline' outlined dangerButton />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton title='Accept'
              loading={isLoading}
              onPress={handleAccept}
            />
          </View>
        </View>
      </View>

    </View>
  )
}

const { width } = Dimensions.get('window')
const tabs = ['Account', 'Your Journey', 'Job Alerts', 'Follow Requests', 'Upvotes', 'Downvotes']
export default function Notifications() {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const { isLoading, initialLoading, combinedData, handleEndReached, handleRefresh } = useFetchData({ url: '/api/accounts/follow_request_list/' });
  const platform = Platform.OS;
  return (
    <>
      <PageLayout
        headerTitle='Notifications'
      >
        <View style={{ marginTop: 44 }}>
          <View style={{ height: 8, width: width, backgroundColor: '#f5f5f5', marginHorizontal: -16 }}></View>
          {
            initialLoading && (
              <View style={{ width: '100%', flex: 1, height: 500, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                <ActivityIndicator size='large' color='#202020' />
              </View>
            )
          }
          {
            !initialLoading && !isLoading && combinedData.length === 0 && (
              <View style={{ flex: 1, justifyContent: 'center', height: 500, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#737373' }}>No notifications yet</Text>
              </View>
            )
          }
          {
            !initialLoading && !isLoading && combinedData.length > 0 && combinedData.map((item) => (
              <FollowRequest
                key={item.id}
                request={item}
                handleRefresh={handleRefresh}
              />
            ))
          }
        </View>
      </PageLayout>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, padding: 16 }}
        style={{ position: 'absolute', backgroundColor: 'white', top: platform === 'ios' ? 120 : 57, zIndex: 10, left: 0, flexDirection: 'row', width: '100%' }}
      >
        {
          tabs.map((tab, index) => (
            <OptionChip
              title={tab}
              selected={selectedTab == index}
              onPress={() => setSelectedTab(index)}
            />
          ))
        }
      </ScrollView>
    </>
  );
}
