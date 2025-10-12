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
  LayoutChangeEvent
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
import { useFocusEffect } from 'expo-router';

const width = Dimensions.get("window").width;

export function HashChip({ title }: { title: string }) {
  return (
    <View style={hashChipStyles.container}>
      <Text style={hashChipStyles.text}>{title}</Text>
    </View>
  )
}

const hashChipStyles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: '#a6a6a6',
  },
  container: {
    borderWidth: 0.5,
    borderColor: '#a6a6a6',
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
      // enable interaction of child pressable
    >
  <View style={postStyles.headContainer}>
        <Pressable
        onPress={(event) => {
          event.stopPropagation();
          router.push('/(freeRoutes)/profile/userProfile/' + data.author.username);
        }}
        >
        <ImageLoader
          size={48}
          uri={data.author.profile_image}
        />
        </Pressable>
        <View style={{ gap: 6 }}>
          <Text style={postStyles.name}>{data.author.first_name}</Text>
          <Text style={postStyles.time}>{result}</Text>
        </View>
      </View>
      <View style={{ marginTop: 32 }} pointerEvents="none">
        <Text style={postStyles.content}>
          {data.title}
        </Text>
      </View>
      <View
        style={{ marginTop: 16 }}
        pointerEvents="none"
        onLayout={(e) => {
          // container width is handled via state inside Hashtags component if needed; this inline approach measures per post
        }}
      >
        <SingleLineHashtags hashtags={data.hashtags} />
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
    color: "#a6a6a6",
  },
  content: {
    fontSize: 15,
    textAlign: "justify",
  },
  image: {
    height: 156,
    width: '100%',
    borderRadius: 12,
  }
});

function SingleLineHashtags({ hashtags }: { hashtags: string[] }) {
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [chipWidths, setChipWidths] = React.useState<number[]>([]);
  const [ready, setReady] = React.useState(false);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    setContainerWidth(prev => (Math.abs(prev - w) > 1 ? w : prev));
  };

  const onChipLayout = (index: number, w: number) => {
    setChipWidths(prev => {
      const next = [...prev];
      next[index] = w;
      // when all chips are measured, mark ready
      if (next.filter(Boolean).length === hashtags.length) {
        setReady(true);
      }
      return next;
    });
  };

  // compute visible count only when ready
  const visibleCount = React.useMemo(() => {
    if (!ready || !containerWidth) return hashtags.length;

    const gap = 8;
    let used = 0;
    let count = 0;

    for (let i = 0; i < chipWidths.length; i++) {
      const w = chipWidths[i] || 0;
      const extra = count === 0 ? 0 : gap;
      if (used + extra + w <= containerWidth) {
        used += extra + w;
        count++;
      } else break;
    }
    return count;
  }, [ready, containerWidth, chipWidths, hashtags.length]);

  const overflow = Math.max(0, hashtags.length - visibleCount);

  return (
    <View
      style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}
      onLayout={onContainerLayout}
    >
      {hashtags.map((h, i) => (
        <View
          key={`${h}-${i}`}
        >
          <HashChip title={`#${h}`} />
        </View>
      ))}

      {ready && overflow > 0 && (
        <View style={{ marginLeft: 8 }}>
          <HashChip title={`+${overflow}`} />
        </View>
      )}
    </View>
  );
}

export default function Page() {
  const menuRef = React.useRef<any>(null);
  const similarProfileInactiveMenuRef = React.useRef<any>(null);
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [incompleteProfileText, setIncompleteProfileText] = React.useState("");
  const [postsUrl, setPostsUrl] = React.useState('/api/talks/posts/');
  const [selectedTab, setSelectedTab] = React.useState<'trending' | 'following' | 'custom'>('trending');
  const [userHashtags, setUserHashtags] = React.useState<string[]>([]);
  const [loadingPrefs, setLoadingPrefs] = React.useState(false);
  const navigation = useNavigation();
  const focused = useIsFocused();
  const listRef = React.useRef<ScrollView>(null);
  const { isLoading, initialLoading, refreshing, combinedData, handleEndReached, handleRefresh } = useFetchData({ url: postsUrl });
  useTabPressScrollToTop(listRef, 'talks', handleRefresh);
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

  // Fetch user's hashtag preferences to determine whether to show the Custom chip
  const fetchPreferences = React.useCallback(async () => {
    setLoadingPrefs(true);
    try {
      const resp = await protectedApi.get('/talks/preferences/hashtags/');
      const names = (resp.data?.hashtags || []).map((h: any) => h.name);
      setUserHashtags(names);
    } catch (err) {
      console.error('Error fetching hashtag preferences', err);
    } finally {
      setLoadingPrefs(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Also refetch preferences when screen gains focus so Custom chip updates immediately
  useFocusEffect(
    React.useCallback(() => {
      fetchPreferences();
    }, [fetchPreferences])
  );

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
{
              loadingPrefs ? <ActivityIndicator style={{ marginLeft: 8 }} /> : (
                userHashtags.length > 0 && (
                  <OptionChip
                    title="Custom"
                    selected={selectedTab === 'custom'}
                    onPress={async () => {
                      setSelectedTab('custom');
                      // Use the dedicated preferences posts endpoint which returns posts matching user's hashtag preferences
                      setPostsUrl('/api/talks/preferences/posts/');
                    }}
                  />
                )
              )
            }
            <OptionChip
              title="Trending"
              selected={selectedTab === 'trending'}
              onPress={() => {
                setSelectedTab('trending');
                setPostsUrl('/api/talks/posts/');
              }}
            />
            <OptionChip
              title="Following"
              selected={selectedTab === 'following'}
              onPress={() => {
                // For now, leave following behavior as-is (no feed filter change)
                setSelectedTab('following');
              }}
            />
          </View>
        </Animated.View>
        {(initialLoading || isLoading)&& (
          <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='#202020' />
          </View>
        )}
        {!initialLoading && combinedData.length > 0 && combinedData.map((data, index) => (
          <Animated.View key={index} style={{ backgroundColor: '#f5f5f5', paddingTop: 8, opacity: contentOpacity, width: '100%' }}><Post data={data} /></Animated.View>
        ))}
        {!initialLoading && 
        <View style={{paddingTop:  8, backgroundColor:  "#f5f5f5", width: '100%' }}>
          <View style={{width: '100%', backgroundColor: "white"}}>
          <BottomName />
          </View>
        </View>}
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
          <MenuButton
          onPress={() => {
            menuRef?.current.close();
            router.push("/(protected)/talks/hashtags");
          }}
          >
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
            <Text style={{ textAlign: 'center', color: '#a6a6a6', fontSize: 13 }}>
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
    width: 20,
    tintColor: "#737373"
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
    color: "#a6a6a6",
    marginTop: 8,
  },
});
