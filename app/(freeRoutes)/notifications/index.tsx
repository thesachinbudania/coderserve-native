import { Text, View, ScrollView } from 'react-native';
import ListPageLayout from '@/components/general/ListPageLayout';
import React from 'react';
import ImageLoader from '@/components/ImageLoader';
import BlueButton from '@/components/buttons/BlueButton';
import OptionChip from '@/components/general/OptionChip';
import { useFetchData, DataList } from '@/helpers/general/handleFetchedData';
import timeAgo, { formatDateTime } from '@/helpers/timeAgo';
import protectedApi from '@/helpers/axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import NoData from '@/components/general/NoData';
import { apiUrl } from '@/constants/env';
import { useNotificationsUnreadStore } from '@/zustand/stores';


function FollowRequest({ request, handleRefresh, created_at }: { request: any, handleRefresh: () => void, created_at: string }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await protectedApi.post(`/accounts/accept_follow_request/${request.request_id}/`);
      handleRefresh();
      // Optionally, you can refresh the data or show a success message
    } catch (error) {
      console.error('Error accepting follow request:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={[{ flexDirection: 'row', gap: 8 }, request.accepted && { alignItems: 'center' }]}>
      <View>
        <ImageLoader size={64} uri={apiUrl + request.sender.profile_image} />
      </View>
      <View style={{ marginTop: 8 }}>
        {
          request.accepted ? (
            <Text style={{ fontSize: 13, color: "#737373" }}>You accepted <Text style={{ fontWeight: 'bold', color: 'black' }}>{request.sender.first_name + "'s"}</Text> follow request</Text>
          ) : (
            <Text style={{ fontSize: 13, color: "#737373" }}><Text style={{ fontWeight: 'bold', color: 'black' }}>{request.sender.first_name}</Text> has requested to follow you</Text>
          )
        }
        <Text style={{ color: "#a6a6a6", marginTop: 8, fontSize: 11 }}>{timeAgo(created_at)}</Text>
        {
          !request.accepted && (
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
          )
        }

      </View>

    </View>
  )
}

function AccountNotification({ notification }: { notification: any }) {
  return (
    <View>
      <Text style={{ fontSize: 14, fontWeight: "bold" }}>{notification.payload.heading}</Text>
      <Text style={{ fontSize: 13, color: "#737373", marginTop: 8 }}>{notification.payload.subheading}</Text>
      <Text style={{ fontSize: 11, color: "#a6a6a6", marginTop: 8, textAlign: 'right' }}>{formatDateTime(notification.created_at).time}</Text>
    </View>
  )
}

const tabs: Record<string, string> = {
  'Account': 'account',
  'Your Journey': 'journey',
  'Job Alerts': 'job_alerts',
  'Follow Requests': 'follow_requests',
  'Upvotes': 'upvotes',
  'Downvotes': 'downvotes',
  'Comments': 'comments',
  'Replies': 'replies',
  'Tags': 'tags',
  'Support': 'support',
}

const noDataText: Record<string, string> = {
  'account': 'No notifications here.',
  'journey': 'Track your learning progress, module completions, project milestones, and key achievements.',
  'job_alerts': 'Stay ahead with new job opportunities, recruiter views, interview updates, and application responses.',
  'follow_requests': 'Manage incoming follow requests and decide who gets to be part of your space. Grow your audience and meaningful connections.',
  'upvotes': 'People appreciate your content. View all the upvotes you’ve received on your posts - all live here',
  'downvotes': 'Constructive feedback lives here. Monitor downvotes to reflect and refine your contributions.',
  'comments': 'See what others are saying. Get notified when others comment on your posts - every voice matter',
  'replies': 'Never miss a response. All replies to your comments and discussions will show up here.',
  'tags': 'You’ve been mentioned! Find every post or comment where you’re tagged or referenced.',
  'support': 'Need help or raised a ticket? All support conversations and system notices are tracked right here.',
}

export default function Notifications() {
  const [selectedTab, setSelectedTab] = React.useState('account')
  const { isLoading, initialLoading, combinedData, handleEndReached, handleRefresh, refreshing } = useFetchData({ url: `/api/home/notifications/${selectedTab}/` });
  const { top } = useSafeAreaInsets();
  const notificationsStore = useNotificationsUnreadStore();

  const labelledData = React.useMemo(() => {
    const data: any[] = []
    let lastDateLabel: string | null = null;
    combinedData.forEach(notification => {
      const notificationDate = dayjs(notification.created_at);
      let dateLabel = notificationDate.isToday() ? 'Today' : notificationDate.isYesterday() ? 'Yesterday' : notificationDate.format('D MMM YYYY');
      if (dateLabel !== lastDateLabel) {
        data.push({ id: `separator-${dateLabel}`, date: dateLabel, isSeparator: true });
        lastDateLabel = dateLabel;
      }
      data.push({ ...notification });
    });
    return data;
  }, [combinedData])

  const currentUnreadCount = notificationsStore[selectedTab as keyof typeof notificationsStore];

  React.useEffect(() => {
    handleRefresh();
  }, [currentUnreadCount]);

  return (
    <>
      <ListPageLayout
        headerTitle='Notifications'
      >
        {
          combinedData.length === 0 && !isLoading && !initialLoading ? (
            <NoData text={noDataText[selectedTab]} />
          ) : (
            <View style={{ marginTop: 54, paddingTop: 16 }}>
              <DataList
                data={labelledData}
                RenderItem={({ item }) =>
                  item.isSeparator ?
                    <Text style={{ fontSize: 11, color: "#a6a6a6", textAlign: 'center', fontWeight: "bold", paddingTop: 16, paddingBottom: 8 }}>{item.date}</Text>
                    : item.category === 'follow_requests' ? <FollowRequest request={item.payload} handleRefresh={handleRefresh} created_at={item.created_at} /> : <AccountNotification notification={item} />}
                initialLoading={initialLoading}
                refreshing={refreshing}
                onEndReached={handleEndReached}
                onRefresh={handleRefresh}
                allowSearch={false}
                onSearchChange={() => { }}
              />
            </View>
          )
        }
      </ListPageLayout>
      <View
        style={{ width: '100%', position: 'absolute', top: top + 57, zIndex: 10, left: 0 }}
      >
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, padding: 16, backgroundColor: "#fff" }}
          style={{ flexDirection: 'row', width: '100%' }}
        >
          {
            Object.keys(tabs).map((tab) => {
              const key = tabs[tab] as keyof typeof notificationsStore;
              const count = notificationsStore[key];
              const title = typeof count === 'number' && count > 0 ? `${tab} (${count})` : tab;
              return (
                <OptionChip
                  key={tab}
                  title={title}
                  selected={selectedTab == tabs[tab]}
                  onPress={() => setSelectedTab(tabs[tab])}
                />
              )
            })
          }
        </ScrollView>
        <View style={{ height: 8, width: '100%', backgroundColor: "#f5f5f5" }} />
      </View>
    </>
  );
}
