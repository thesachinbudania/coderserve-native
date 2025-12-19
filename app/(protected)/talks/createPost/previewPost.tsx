import { ActivityIndicator, Dimensions, Image, Text, View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import { useUserStore } from '@/zustand/stores';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import FullWidthImage from '@/components/FullWidthImage';
import EditorPreview from '@/components/talks/createPost/EditorPreview';

const { width } = Dimensions.get('window');

const HashChip = ({ hashtag }: { hashtag: string }) => {
  return (
    <View style={hashChipStyles.container}>
      <Text style={hashChipStyles.text}>
        #{hashtag}
      </Text>
    </View>
  )
}

const hashChipStyles = StyleSheet.create({
  crossContainer: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24
  },
  text: {
    fontSize: 11,
    color: '#737373',
  },
  container: {
    borderWidth: 0.5,
    borderColor: '#737373',
    borderRadius: 6,
    padding: 4,
    flexDirection: 'row',
    gap: 8,
  }
});


function Header() {
  const router = useRouter();
  const user = useUserStore(state => state);
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.headerContainer, { paddingTop: top + 8 }]}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {user.profile_image && (
          <ImageLoader size={48} uri={user.profile_image} border={1} />
        )}
        <View style={{ gap: 6, justifyContent: "center" }}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.headerName}
          >{user.first_name}</Text>
          <Text style={styles.secondaryHeaderText}>
            Preview
          </Text>
        </View>
      </View>
      <IconButton onPress={() => router.back()}>
        <View style={{ padding: 2 }}>
          <Image
            source={require("@/assets/images/close.png")}
            style={styles.headerIcon}
          />
        </View>
      </IconButton>
    </View>
  );
}

export function PostContent({ title, hashtags, thumbnail, content = null }: { title: string, hashtags: string[], thumbnail: string, content?: string | null }) {
  const [contentHeight, setContentHeight] = React.useState(1);
  const [contentLoading, setContentLoading] = React.useState(content ? true : false);
  return (
    <View>
      <View style={[styles.postContainer]}>
        {title && (
          <Text style={styles.postHeading}>
            {title}
          </Text>
        )}
        {
          title && hashtags.length > 0 && (
            <View style={styles.hashTagContainer}>
              {hashtags.map((hashtag, index) => (
                <HashChip key={index} hashtag={hashtag} />
              ))}
            </View>
          )
        }
        {
          title && hashtags.length > 0 && thumbnail && (
            <View style={{ marginTop: 16 }}>
              <Image source={{ uri: thumbnail }} style={{ width: '100%', height: 144, borderRadius: 12 }} />
            </View>
          )
        }
      </View>
      {
        contentLoading && (
          <ActivityIndicator style={{ marginTop: 48, marginBottom: 32 }} />
        )
      }
      <View style={{ height: contentLoading ? 1 : contentHeight, overflow: 'hidden' }}>
        {
          title && hashtags.length > 0 && content && (
            <EditorPreview editorState={content} dom={{
              scrollEnabled: false,
              style: { height: contentHeight, overflow: 'visible' },
              onMessage: (event) => {
                try {
                  const msg = JSON.parse(event.nativeEvent.data);
                  if (msg.type === 'HEIGHT') {
                    setContentHeight(msg.height);
                    setContentLoading(false);
                  }
                } catch { }
              },
            }} />
          )
        }
      </View>
    </View>
  );
}


export default function PreviewPost() {
  const { title, hashtags, thumbnail, content } = useNewPostStore();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 48, backgroundColor: 'white' }}
    >
      <Header />
      <PostContent title={title} hashtags={hashtags} thumbnail={thumbnail ? thumbnail.uri : undefined} content={content} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  headerName: {
    fontSize: 15,
    fontWeight: "bold",
    width: width - 140,
  },
  secondaryHeaderText: {
    fontSize: 11,
    color: "#737373",
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  postContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#eee',
    padding: 16,
    marginBottom: 16
  },
  postHeading: {
    fontSize: 13,
    color: "#737373"
  },
  hashTagContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 16,
  },
});
