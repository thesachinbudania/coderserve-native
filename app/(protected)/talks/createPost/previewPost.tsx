import { ActivityIndicator, Dimensions, Image, Pressable, Text, View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import { useUserStore } from '@/zustand/stores';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import EditorPreview from '@/components/talks/createPost/EditorPreview';
import BottomName from '@/components/profile/home/BottomName';
import { HashChip as HashChipTalk } from '..';

const { width } = Dimensions.get('window');

const BackButton = () => {
  const router = useRouter();
  return (
    <View style={{ marginHorizontal: -16, paddingVertical: 8, marginTop: 32, backgroundColor: "#f5f5f5" }}>
      <View style={{ padding: 16, backgroundColor: "white" }}>
        <Pressable
          style={({ pressed }) => [{ height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#f5f5f5' }, pressed && { backgroundColor: "#d9d9d9" }]}
          onPress={() => router.back()}
        >
          <Text style={{ fontSize: 13 }}>Back</Text>
        </Pressable>
      </View>
    </View>
  )
}

export const HashChip = ({ hashtag, light = false }: { hashtag: string, light?: boolean }) => {
  return (
    <View style={[hashChipStyles.container, light && { borderColor: "#a6a6a6" }]}>
      <Text style={[hashChipStyles.text, light && { color: "#a6a6a6" }]}>
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
    lineHeight: 11
  },
  container: {
    borderWidth: 1,
    borderColor: '#737373',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
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
      <View style={{ flexDirection: "row", gap: 8 }}>
        {user.profile_image && (
          <View>
            <ImageLoader size={45} uri={user.profile_image} border={1} />
          </View>
        )}
        <View style={{ gap: 8, justifyContent: "center" }}>
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
        <Image
          source={require("@/assets/images/close.png")}
          style={styles.headerIcon}
        />
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
                <HashChipTalk key={index} title={hashtag} />
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
          <ActivityIndicator style={{ marginTop: 48, marginBottom: 32 }} color={'#202020'} />
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
      contentContainerStyle={{ paddingHorizontal: 16, backgroundColor: 'white', minHeight: "100%" }}
    >
      <Header />
      <PostContent title={title} hashtags={hashtags} thumbnail={thumbnail ? thumbnail.uri : undefined} content={content} />
      {content && <>
        <BackButton />
        <BottomName />
      </>}
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
    lineHeight: 15
  },
  secondaryHeaderText: {
    fontSize: 11,
    color: "#737373",
    lineHeight: 11
  },
  headerIcon: {
    width: 20,
    height: 20,
  },
  postContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#f5f5f5',
    padding: 16,
    marginBottom: 32
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
