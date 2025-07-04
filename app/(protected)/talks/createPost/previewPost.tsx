import { Dimensions, Image, Text, View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageLoader from '@/components/ImageLoader';
import IconButton from '@/components/buttons/IconButton';
import { useUserStore } from '@/zustand/stores';
import { useNewPostStore } from '@/zustand/talks/newPostStore';

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


export default function PreviewPost() {
  const { title, hashtags, thumbnail } = useNewPostStore();
  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 16, flex: 1, paddingBottom: 48, backgroundColor: 'white' }}
    >
      <Header />
      <View style={styles.postContainer}>
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
            <Image source={{ uri: thumbnail.uri }} style={{ borderRadius: 8, width: '100%', height: 144, marginTop: 16 }} />
          )
        }
      </View>
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
    width: width - 192,
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
  },
  postHeading: {
    fontSize: 13,
  },
  hashTagContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 16,
  },
});
