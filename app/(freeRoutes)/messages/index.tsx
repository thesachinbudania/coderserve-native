import { Dimensions, Text, Pressable, View, Image, StyleSheet } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import FloatingButton from '@/components/buttons/FlotingButton';
import { useRouter } from 'expo-router';
import React from 'react';
import useFetchData from '@/helpers/general/handleFetchedData';
import ImageLoader from '@/components/ImageLoader';
import TruncatedText from '@/components/general/TruncatedText';
import { formatTime } from '@/helpers/helpers';
import SearchBar from '@/components/form/SearchBar';




export default function Messages() {
  const router = useRouter()
  const width = Dimensions.get('window').width;
  function RenderItem({ item }: { item: any }) {
    const profileImage = item.other_participant.profile_image;
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
            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.other_participant.first_name} {item.unseen_count > 0 && <Text style={{ color: "#737373" }}>({item.unseen_count})</Text>}</Text>
            <Text style={{ fontSize: 11, color: "#b4b4b4" }}>{messageTime}</Text>
          </View>
          <TruncatedText
            style={{ fontSize: 13, color: "#737373" }}
          >{item.last_message?.content || ''}</TruncatedText>
        </View>
      </Pressable>
    )
  }
  const [searchQuery, setSearchQuery] = React.useState('');
  const { RenderData, combinedData, initialLoading, isLoading, setFilteredData } = useFetchData({ url: '/api/home/list_conversations/', RenderItem });

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

  return (
    <>
      <PageLayout
        headerTitle='Messages'
      >
        {
          combinedData.length > 0 || initialLoading || isLoading ?
            <View style={{ gap: 52 }}>
              <SearchBar onChangeText={setSearchQuery} />
              <RenderData />
            </View>
            :

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('@/assets/images/messages.png')} style={{ height: 128, width: 128, objectFit: 'contain' }}></Image>
              <Text style={[styles.emptyText, { marginTop: 32 }]}>Private chats with people you follow - and those who follow you - will show up here.</Text>
              <Text style={styles.emptyText}>Start a converstion and stay connected!</Text>
            </View>
        }
      </PageLayout>

      <FloatingButton
        onPress={() => router.push('/(freeRoutes)/messages/recipients')}
      />
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
