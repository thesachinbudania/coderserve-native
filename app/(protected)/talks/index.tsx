import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Header } from "@/app/(protected)/jobs/index";
import React from "react";
import ImageLoader from "@/components/ImageLoader";
import BottomName from "@/components/profile/home/BottomName";
import BottomSheet from "@/components/messsages/BottomSheet";
import { MenuButton } from "@/app/(protected)/jobs/index";
import { useRouter, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { isTalksProfileCompleted } from "@/zustand/jobsStore";
import DefaultButton from "@/components/buttons/BlueButton";
import { useTabPressScrollToTop } from "@/helpers/hooks/useTabBarScrollToTop";
import useSearchBar from "@/helpers/general/searchBar";
import useFetchData from "@/helpers/general/handleFetchedData";
import FullWidthImage from "@/components/FullWidthImage";
import { formatDistanceToNow } from "date-fns";
import OptionChip from "@/components/general/OptionChip";
import protectedApi from "@/helpers/axios";
import Search from "@/components/talks/home/Search";

const width = Dimensions.get("window").width;

function HashChip({ title }: { title: string }) {
  return (
    <View style={hashChipStyles.container}>
      <Text style={hashChipStyles.text}>{title}</Text>
    </View>
  )
}

const hashChipStyles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: '#737373',
  },
  container: {
    borderWidth: 0.5,
    borderColor: '#737373',
    borderRadius: 6,
    padding: 4
  }
})

export function Post({ data }: { data: any }) {
  const router = useRouter();
  let result = formatDistanceToNow(new Date(data.created_at), { addSuffix: true });
  result = result.replace(/^about\s/, '');
  result = result.replace(/^almost\s/, '');
  result = result.replace(/^in\s/, '');
  result = result.replace(/^less than\s/, '');

  return (
    <Pressable
      android_ripple={{ color: '#f5f5f5' }}
      style={postStyles.container}
      onPress={() => {
        router.push(`/talks/viewPost/${data.id}`);
      }}
    >
      <View style={postStyles.headContainer} pointerEvents="none">
        <ImageLoader
          size={48}
          uri={data.author.profile_image}
        />
        <View style={{ gap: 6 }}>
          <Text style={postStyles.name}>{data.author.first_name} {data.author.last_name}</Text>
          <Text style={postStyles.time}>{result}</Text>
        </View>
      </View>
      <View style={{ marginTop: 32 }} pointerEvents="none">
        <Text style={postStyles.content}>
          {data.title}
        </Text>
      </View>
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }} pointerEvents="none">
        {
          data.hashtags.map((hashtag: string, index: number) => (
            <HashChip key={index} title={`#${hashtag}`} />
          ))
        }
      </View>
      <View style={{ marginTop: 16 }} pointerEvents="none">
        <FullWidthImage imageUrl={data.thumbnail} />
      </View>
    </Pressable>
  );
}

const postStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  headContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  time: {
    fontSize: 11,
    color: "#737373",
  },
  content: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "justify",
  },
  image: {
    height: 156,
    width: '100%',
    borderRadius: 12,
  }
});

export default function Page() {
  const menuRef = React.useRef<any>(null);
  const similarProfileInactiveMenuRef = React.useRef<any>(null);
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [incompleteProfileText, setIncompleteProfileText] = React.useState("");
  const navigation = useNavigation();
  const focused = useIsFocused();
  const listRef = React.useRef<ScrollView>(null);
  useTabPressScrollToTop(listRef, 'talks');
  const { isLoading, initialLoading, refreshing, combinedData, handleEndReached, handleRefresh } = useFetchData({ url: '/api/talks/posts/' });
  const [searchResults, setSearchResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchSearchResults = async () => {
      if (search.trim() === "" || search.length < 3) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await protectedApi.get(`talks/search_suggestions/?q=${encodeURIComponent(search)}`);
        const data = await response.data;
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300); // Adjust the debounce delay as needed

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const { contentWidth, contentOpacity, searchBarMarginTop } = useSearchBar({ setIsSearchFocused, isSearchFocused });
  const handleAddPostPress = () => {
    if (isTalksProfileCompleted()) {
      router.push("/(protected)/talks/createPost");
    } else {
      setIncompleteProfileText("Your profile is incomplete. Please complete your profile to start creating and sharing posts with the community.")
      similarProfileInactiveMenuRef?.current.open();
    }
  }

  const similarProfileOnClickHandler = () => {
    if (isTalksProfileCompleted()) {
      menuRef?.current.close();
      router.push("/(protected)/talks/similarProfiles");
    } else {
      menuRef?.current.close();
      setIncompleteProfileText("Your profile is incomplete. Please provide all the required details to enable you to access similar profiles.")
      similarProfileInactiveMenuRef?.current.open();
    }
  }

  React.useEffect(() => {
    if (!isSearchFocused && focused) {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex", height: 54 } });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "none",
        },
      });
    }
  }, [isSearchFocused, focused]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: !isSearchFocused ? "white" : "#f7f7f7",
          alignItems: 'center',
          minHeight: '100%'
        }}
        ref={listRef}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        scrollEnabled={!isSearchFocused}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            handleEndReached();
          }
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ width: contentWidth }}>
          <Animated.View style={{ opacity: contentOpacity }}>
            <Header
              menuRef={menuRef}
              forTalks
            />
          </Animated.View>
          <Animated.View
            style={{
              transform: [{ translateY: searchBarMarginTop }],
            }}
          >
            <Search
              search={search}
              setSearch={setSearch}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              searchResults={searchResults}
            />
          </Animated.View>
        </Animated.View>
        <Animated.View
          style={{
            width: width - 32,
            marginTop: 32,
            opacity: contentOpacity,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Pressable
              style={({ pressed }) => [styles.addHashContainer, pressed && { backgroundColor: '#d9d9d9' }]}
              onPress={() => {
                handleAddPostPress();
              }}
            >
              <Image source={require('@/assets/images/jobs/plus.png')} style={styles.addHashImage} />
            </Pressable>
            <OptionChip title="Trending" selected={true} />
            <OptionChip title="Following" selected={false} />
          </View>
        </Animated.View>
        {initialLoading && (
          <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='#202020' />
          </View>
        )}
        {!initialLoading && combinedData.length > 0 && combinedData.map((data, index) => (
          <Animated.View key={index} style={{ backgroundColor: '#f5f5f5', paddingTop: 8, opacity: contentOpacity, width: '100%' }}><Post data={data} /></Animated.View>
        ))}
        {!initialLoading && <BottomName />}
      </ScrollView>
      <BottomSheet
        menuRef={menuRef}
        height={392}>
        <View style={styles.menuContainer}>
          <MenuButton
            onPress={() => {
              menuRef?.current.close();
              router.push("/(protected)/talks/profile");
            }}
          >
            <Text style={styles.menuButtonHeading}>Your Profile</Text>
            <Text style={styles.menuButtonText}>
              Manage your profile, activity and views.
            </Text>
          </MenuButton>
          <MenuButton
            onPress={() => {
              menuRef?.current.close();
              similarProfileOnClickHandler()
            }}
          >
            <Text style={styles.menuButtonHeading}>Similar Profiles</Text>
            <Text style={styles.menuButtonText}>
              Find users with similar backgrounds.
            </Text>
          </MenuButton>
          <MenuButton>
            <Text style={styles.menuButtonHeading}>HashTags</Text>
            <Text style={styles.menuButtonText}>
              Follow topics that interest you the most.
            </Text>
          </MenuButton>
          <MenuButton dark>
            <Text
              style={[styles.menuButtonHeading, { color: "white" }]}
            >
              Go Pro
            </Text>
            <Text style={[styles.menuButtonText, { color: "white" }]}>
              Unlock exclusive features and enhance profile visibility.
            </Text>
          </MenuButton>
        </View>
      </BottomSheet>
      <BottomSheet
        menuRef={similarProfileInactiveMenuRef}
        height={168}>
        <View style={{ gap: 32 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>Complete Your Profile</Text>
            <Text style={{ textAlign: 'center', color: '#737373', fontSize: 13 }}>
              {incompleteProfileText}
            </Text>
          </View>
          <DefaultButton
            title='Update Profile'
            onPress={() => {
              similarProfileInactiveMenuRef?.current.close();
              router.push("/(protected)/talks/profile/update");
            }}
          />
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  postsContainer: {
    backgroundColor: "#f5f5f5",
    gap: 8,
    paddingTop: 8,
    marginTop: 16,
    width: width,
  },
  addHashContainer: {
    backgroundColor: '#f5f5f5',
    height: 36,
    width: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addHashImage: {
    height: 20,
    width: 20
  },
  menuContainer: {
    gap: 16,
  },
  menuButtonHeading: {
    fontSize: 15,
    fontWeight: "bold",
  },
  menuButtonText: {
    fontSize: 12,
    color: "#737373",
    marginTop: 8,
  },
});
