import {
  Animated,
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import { Header } from "@/app/(protected)/jobs/index";
import React from "react";
import SearchBar from "@/components/profile/SearchBar";
import ImageLoader from "@/components/ImageLoader";
import BottomName from "@/components/profile/home/BottomName";
import BottomSheet from "@/components/messsages/BottomSheet";
import { MenuButton } from "@/app/(protected)/jobs/index";
import { useRouter, useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

const width = Dimensions.get("window").width;
type OptionChipProps = {
  title: string;
  onPress?: () => void;
  selected?: boolean;
};

function OptionChip({
  title,
  onPress = () => { },
  selected = false,
}: OptionChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        optionChipStyles.container,
        !selected && { backgroundColor: "#f5f5f5" },
      ]}
    >
      <Text style={[optionChipStyles.text, !selected && { color: "#737373", fontWeight: 'normal' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

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
    borderWidth: 1,
    borderColor: '#737373',
    borderRadius: 6,
    padding: 6
  }
})

const optionChipStyles = StyleSheet.create({
  container: {
    height: 38,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 32,
    backgroundColor: "#202020",
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
    color: "white",
  },
});

function Post() {
  return (
    <View style={postStyles.container}>
      <View style={postStyles.headContainer}>
        <ImageLoader
          size={48}
          uri="https://api.coderserve.com/media/profile_images/default_profile_image.png"
        />
        <View style={{ gap: 4 }}>
          <Text style={postStyles.name}>Emma Watson</Text>
          <Text style={postStyles.time}>2 hours ago</Text>
        </View>
      </View>
      <View style={{ marginTop: 32 }}>
        <Text style={postStyles.content}>
          Docker isn't just about containers anymore - it's the backbone of
          modern development workflows, eliminating environment mismatches and
          simlifying deployment.
        </Text>
      </View>
      <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
        <HashChip title="#docker" />
        <HashChip title="#devops" />
        <HashChip title="#containers" />
      </View>
      <View style={{ marginTop: 16 }}>
        <Image source={require('@/assets/images/profile/Background/3.png')} style={postStyles.image} />
      </View>
    </View>
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
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const navigation = useNavigation();
  const focused = useIsFocused();

  React.useEffect(() => {
    if (!isSearchFocused && focused) {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "flex" } });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "none",
        },
      });
    }
  }, [isSearchFocused, focused]);

  // search bar animation values
  const searchBarMarginTop = useAnimatedValue(0);
  const contentWidth = useAnimatedValue(width - 32);
  const contentOpacity = useAnimatedValue(1);

  React.useEffect(() => {
    if (isSearchFocused) {
      Animated.timing(searchBarMarginTop, {
        toValue: -88,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentWidth, {
        toValue: width,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(searchBarMarginTop, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentWidth, {
        toValue: width - 32,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: !isSearchFocused ? "white" : "#f7f7f7",
      }}
    >
      <ScrollView
        contentContainerStyle={{ width: width, alignItems: "center" }}
      >
        <Animated.View style={{ width: contentWidth }}>
          <Animated.View style={{ opacity: contentOpacity }}>
            <Header menuRef={menuRef} />
          </Animated.View>
          <Pressable onPress={() => Keyboard.dismiss()}>
            <Animated.View
              style={{
                transform: [{ translateY: searchBarMarginTop }],
              }}
            >
              <SearchBar
                onChangeText={setSearch}
                isFocused={isSearchFocused}
                setIsFocused={setIsSearchFocused}
              />
            </Animated.View>
          </Pressable>
        </Animated.View>
        <Animated.View
          style={{
            width: width - 32,
            marginTop: 32,
            opacity: contentOpacity,

          }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={styles.addHashContainer}>
              <Image source={require('@/assets/images/jobs/plus.png')} style={styles.addHashImage} />
            </View>
            <OptionChip title="Trending" selected={true} />
            <OptionChip title="Following" selected={false} />
          </View>
        </Animated.View>
        <Animated.View style={[styles.postsContainer, { opacity: contentOpacity }]}>
          <Post />
          <Post />
          <View style={{ backgroundColor: 'white' }}>
            <BottomName />
          </View>
        </Animated.View>
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
    </View>
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
