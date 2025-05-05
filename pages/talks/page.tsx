import {
  Animated,
  Dimensions,
  Keyboard,
  Pressable,
  StyleSheet,
  ScrollView,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import { Header } from "../jobs/Home";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../profile/components/SearchBar";
import ImageLoader from "../../components/ImageLoader";

const width = Dimensions.get("window").width;
type OptionChipProps = {
  title: string;
  onPress?: () => void;
  selected?: boolean;
};
function OptionChip({
  title,
  onPress = () => {},
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
      <Text style={[optionChipStyles.text, !selected && { color: "#737373" }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const optionChipStyles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
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
});

export default function Page() {
  const menuRef = React.useRef<any>(null);
  const navigation = useNavigation();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // search bar animation values
  const searchBarMarginTop = useAnimatedValue(0);
  const contentWidth = useAnimatedValue(width - 32);
  const contentOpacity = useAnimatedValue(1);

  React.useEffect(() => {
    if (isSearchFocused) {
      console.log("happening");
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          display: "flex",
          height: 54,
          marginBottom: 0,
          paddingBottom: 0,
        },
      });
    }
  }, [isSearchFocused]);
  React.useEffect(() => {
    if (isSearchFocused) {
      Animated.timing(searchBarMarginTop, {
        toValue: -96,
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
        <View
          style={{
            width: width - 32,
            marginTop: 32,
          }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            <OptionChip title="Trending" selected={true} />
            <OptionChip title="Following" selected={false} />
          </View>
        </View>
        <View style={styles.postsContainer}>
          <Post />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  postsContainer: {
    backgroundColor: "#f5f5f5",
    gap: 16,
    paddingTop: 8,
    marginTop: 16,
    width: width,
  },
});
