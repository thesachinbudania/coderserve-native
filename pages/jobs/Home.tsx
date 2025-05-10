import {
  Animated,
  Dimensions,
  Pressable,
  Keyboard,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useAnimatedValue,
} from "react-native";
import BottomName from "../profile/home/BottomName";
import ImageLoader from "../../components/ImageLoader";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import IconButton from "../../components/buttons/IconButton";
import SearchBar from "../profile/components/SearchBar";
import React from "react";
import MapView from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { NavigationProps } from "./page";
import RBSheet from "react-native-raw-bottom-sheet";
import { Portal } from "@gorhom/portal";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export function Header({ menuRef }: { menuRef: React.RefObject<any> }) {
  const navigation = useNavigation<NavigationProps>();
  const user = useSelector((state: RootState) => state.user);
  const resume = useSelector((state: RootState) => state.jobs);
  let jobRole = null;
  if (resume.previousExperience && resume.previousExperience.length > 0) {
    jobRole = resume.previousExperience[0].job_role;
  }
  return (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {user.profilePicture && (
          <ImageLoader size={48} uri={user.profilePicture} border={1} />
        )}
        <View style={{ gap: 6, justifyContent: "center" }}>
          <Text style={styles.headerName}>{user.firstName}</Text>
          <Text style={styles.secondaryHeaderText}>
            {jobRole || "What's your job role?"}
          </Text>
        </View>
      </View>
      <View style={{ gap: 16, flexDirection: "row" }}>
        <IconButton onPress={() => navigation.navigate("Messages")}>
          <Image
            source={require("../assets/Chats.png")}
            style={styles.headerIcon}
          />
        </IconButton>
        <IconButton
          onPress={() => {
            menuRef?.current.open();
          }}
        >
          <Image
            source={require("../assets/Menu.png")}
            style={styles.headerIcon}
          />
        </IconButton>
      </View>
    </View>
  );
}

function ListingChip({ title }: { title: string }) {
  return (
    <View style={jobStyles.chip}>
      <Text style={{ fontSize: 12 }}>{title}</Text>
    </View>
  );
}

function JobListing() {
  const navigation = useNavigation<NavigationProps>();
  return (
    <Pressable onPress={() => navigation.navigate("JobView")}>
      {({ pressed }) => (
        <View
          style={[jobStyles.container, pressed && { borderColor: "#006dff" }]}
        >
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <View style={jobStyles.logoContainer}>
              <Image
                source={require("./assets/capGemini.png")}
                style={jobStyles.logo}
              />
            </View>
            <View>
              <Text style={jobStyles.companyName}>Capgemini</Text>
              <Text style={jobStyles.companyLocation}>Banglore, India</Text>
            </View>
          </View>
          <Text style={[styles.heading, { marginTop: 16 }]}>
            Senior Salesforce Developer
          </Text>
          <View style={jobStyles.chipContainer}>
            <ListingChip title="Full Time" />
            <ListingChip title="On-site" />
            <ListingChip title="4 - 5 lakh" />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const jobStyles = StyleSheet.create({
  chip: {
    flex: 1 / 3,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
  },
  chipContainer: {
    marginTop: 16,
    flexDirection: "row",
    gap: 16,
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  companyName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#004aad",
  },
  companyLocation: {
    fontSize: 12,
    color: "#a6a6a6",
    marginTop: 4,
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 8,
  },
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
  },
});

export function MenuButton({
  children,
  dark = false,
  onPress = () => { },
}: {
  children: React.ReactNode;
  dark?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      {({ pressed }) =>
        !dark ? (
          <View
            style={[
              countrySelectStyles.container,
              pressed && { borderColor: "#006dff" },
            ]}
          >
            {children}
          </View>
        ) : (
          <LinearGradient
            colors={!pressed ? ["#000000", "#3e3e3e"] : ["#0b53ff", "#da85ff"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[countrySelectStyles.container, { padding: 0 }]}
          >
            <View style={{ padding: 16 }}>{children}</View>
          </LinearGradient>
        )
      }
    </Pressable>
  );
}

function CountrySelectOption() {
  return (
    <MenuButton>
      <Text style={countrySelectStyles.heading}>Country</Text>
      <View style={countrySelectStyles.bottomContainer}>
        <Image
          source={require("./assets/pin.png")}
          style={countrySelectStyles.pin}
        />
        <Text style={countrySelectStyles.countryName}>India</Text>
      </View>
    </MenuButton>
  );
}

const countrySelectStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pin: {
    height: 15,
    width: 15,
  },
  countryName: {
    fontSize: 12,
    color: "#737373",
  },
});

export default function Home() {
  const [search, setSearch] = React.useState("");
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const navigation = useNavigation<NavigationProps>();

  const menuRef = React.useRef<any>(null);
  const searchBarMarginTop = useAnimatedValue(0);
  const searchBarMarginRight = useAnimatedValue(0);
  const filterButtonWidth = useAnimatedValue(0);
  const width = Dimensions.get("window").width;
  const contentWidth = useAnimatedValue(width - 32);
  const contentOpacity = useAnimatedValue(1);

  React.useEffect(() => {
    if (isSearchFocused) {
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
      Animated.timing(searchBarMarginRight, {
        toValue: -16,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(filterButtonWidth, {
        toValue: 0,
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
      Animated.timing(searchBarMarginRight, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.timing(filterButtonWidth, {
        toValue: -52,
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
                flexDirection: "row",
                gap: 16,
              }}
            >
              <View style={{ flex: 1 }}>
                <SearchBar
                  onChangeText={setSearch}
                  isFocused={isSearchFocused}
                  setIsFocused={setIsSearchFocused}
                  placeholder=""
                  placholderText={["Search by Job Roles", "ex: Java Developer"]}
                />
              </View>
              <View
                style={[{ width: 48 }, isSearchFocused && { display: "none" }]}
              >
                <IconButton
                  square
                  onPress={() => navigation.navigate("Filters")}
                >
                  <Image
                    source={require("../assets/Filter.png")}
                    style={{ height: 28, width: 28 }}
                  />
                </IconButton>
              </View>
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <View style={styles.mapContainer}>
                <MapView style={{ height: 208, width: "100%" }} />
                <View style={styles.moreJobButton}>
                  <Text style={{ opacity: 1 }}>View nearby jobs</Text>
                </View>
              </View>
              <View style={styles.jobListingContainer}>
                <Text style={styles.heading}>Recent Jobs</Text>
                <JobListing />
                <JobListing />
                <JobListing />
                <JobListing />
                <JobListing />
              </View>
            </Animated.View>
            <BottomName />
            <Portal>
              <RBSheet
                ref={menuRef}
                height={392}
                closeOnPressMask
                customStyles={{
                  container: {
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    padding: 16,
                  },
                  draggableIcon: {
                    backgroundColor: "#000",
                  },
                }}
              >
                <View style={styles.menuContainer}>
                  <CountrySelectOption />
                  <MenuButton
                    onPress={() => {
                      menuRef?.current.close();
                      navigation.navigate("ResumeHome");
                    }}
                  >
                    <Text style={styles.menuButtonHeading}>Resume</Text>
                    <Text style={styles.menuButtonText}>
                      Navigate to your resume.
                    </Text>
                  </MenuButton>
                  <MenuButton>
                    <Text style={styles.menuButtonHeading}>Applied Jobs</Text>
                    <Text style={styles.menuButtonText}>
                      Track your job applications in one place
                    </Text>
                  </MenuButton>
                  <MenuButton dark>
                    <Text
                      style={[styles.menuButtonHeading, { color: "white" }]}
                    >
                      Go Pro
                    </Text>
                    <Text style={[styles.menuButtonText, { color: "white" }]}>
                      Unlock premium features and boost your job search
                    </Text>
                  </MenuButton>
                </View>
              </RBSheet>
            </Portal>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  jobListingContainer: {
    marginTop: 32,
    gap: 16,
  },
  heading: {
    fontSize: 15,
    fontWeight: "bold",
  },
  moreJobButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    position: "absolute",
    bottom: 16,
    right: 16,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
  },
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
  },
  secondaryHeaderText: {
    fontSize: 11,
    color: "#737373",
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 32,
    borderWidth: 1,
    borderColor: "#eee",
    position: "relative",
  },
});
