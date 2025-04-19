import PageLayout from "../../../profile/controlCentre/accountCenter/PageLayout";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import SelectMenu from "../../../../components/form/SelectMenu";
import React from "react";
import DateSelect from "./DateSelect";
import LocationSelectMenu from "../../../../components/form/LocationSelectMenu";
import TextAreaInput from "../../../../components/form/TextAreaInput";
import BlueButton from "../../../../components/buttons/BlueButton";
import SearchBar from "../../../profile/components/SearchBar";
import { useCompaniesDataMutation } from "../../apiSlice";

const jobTypeOptions = [
  "Full Time",
  "Part Time",
  "Internship",
  "Freelance",
  "Self Employed",
];

const workModeOptions = ["On-site", "Hybrid", "Remote"];

function SearchSuggestion({
  title,
  onPress = () => {},
}: {
  title: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          pointerEvents="none"
          style={[
            { padding: 16, flexDirection: "row", gap: 8 },
            pressed && { backgroundColor: "black" },
          ]}
        >
          <Image
            source={require("../../../profile/components/assets/searchIcon.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text style={[{ fontSize: 15 }, !pressed && { color: "#006dff" }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function WorkExperience() {
  // states of the selected and filled fields
  const [jobType, setJobType] = React.useState<string | null>(null);
  const [jobRole, setJobRole] = React.useState("");
  const [joinMonth, setJoinMonth] = React.useState("");
  const [joinYear, setJoinYear] = React.useState("");
  const [endMonth, setEndMonth] = React.useState("");
  const [endYear, setEndYear] = React.useState("");
  const [country, setCountry] = React.useState<string | null>(null);
  const [state, setState] = React.useState<string | null>(null);
  const [city, setCity] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState("");

  // animation related stuff
  const contentOpacity = useAnimatedValue(1);

  const jobRoleRef = React.useRef(null);
  const jobRoleTranslate = useAnimatedValue(0);
  const [jRFocused, setJRFocused] = React.useState(false);

  const jobDescRef = React.useRef(null);
  const jobDescTranslate = useAnimatedValue(0);
  const [jDFocused, setJDFocused] = React.useState(false);

  const [_, setSearchFocused] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const searchBarOpacity = useAnimatedValue(0);

  const windowWidth = Dimensions.get("window").width;

  const measureYJR = async () => {
    let pos = null;
    // @ts-ignore
    await jobRoleRef.current?.measure((x, y, width, height, pageX, pageY) => {
      pos = pageY;
    });
    return pos;
  };

  const measureYJD = async () => {
    let pos = null;
    // @ts-ignore
    await jobDescRef.current?.measure((x, y, width, height, pageX, pageY) => {
      pos = pageY;
    });
    return pos;
  };

  const animateJobDesc = async () => {
    const jobDescPos = await measureYJD();
    if (jDFocused && jobDescPos) {
      Animated.timing(jobDescTranslate, {
        toValue: Platform.OS === "ios" ? -jobDescPos + 32 : -jobDescPos,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(searchBarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(jobDescTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(searchBarOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const animateJobRole = async () => {
    const jobRolePos = await measureYJR();
    if (jRFocused && jobRolePos) {
      Animated.timing(jobRoleTranslate, {
        toValue: Platform.OS === "ios" ? -jobRolePos + 32 : -jobRolePos,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(searchBarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(jobRoleTranslate, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(searchBarOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  React.useEffect(() => {
    animateJobRole();
  }, [jRFocused]);

  React.useEffect(() => {
    animateJobDesc();
  }, [jDFocused]);

  // search related functionality
  const [companiesData] = useCompaniesDataMutation();
  const [companiesSuggestions, setCompaniesSuggestions] = React.useState<any[]>(
    [],
  );
  async function searchCompanyName(name: string) {
    try {
      const response = await companiesData({
        detail: false,
        data: name,
      }).unwrap();
      if (response) {
        setCompaniesSuggestions(response);
      }
    } catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    if (searchText.length > 0) {
      searchCompanyName(searchText);
    } else {
    }
  }, [searchText]);

  return (
    <>
      <Animated.View style={{ zIndex: 100, opacity: 0 }}></Animated.View>
      <PageLayout
        headerTitle="Experience"
        showHeader={!jRFocused && !jDFocused}
      >
        <Animated.View style={{ marginHorizontal: -16, alignItems: "center" }}>
          <Animated.View
            style={[
              styles.formContainer,
              jRFocused || jDFocused
                ? { width: windowWidth }
                : { width: windowWidth - 32 },
            ]}
          >
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Job Type</Text>
              <SelectMenu
                placeholder="Select Job Type"
                options={jobTypeOptions}
                selected={jobType}
                onSelect={setJobType}
                allowSearch={false}
              />
            </Animated.View>
            <Animated.View style={{ opacity: jDFocused ? 1 : contentOpacity }}>
              <Animated.View style={{ opacity: contentOpacity }}>
                <Text style={styles.label}>Job Role</Text>
              </Animated.View>
              <Animated.View
                ref={jobDescRef}
                style={{ transform: [{ translateY: jobDescTranslate }] }}
              >
                <SearchBar
                  isFocused={jDFocused}
                  setIsFocused={setJDFocused}
                  onChangeText={setSearchText}
                  placeholder="ex: Java Developer"
                />
                <View
                  style={{
                    display: jDFocused ? "flex" : "none",
                    height: "100%",
                    backgroundColor: "#f7f7f7",
                  }}
                ></View>
              </Animated.View>
            </Animated.View>
            <Animated.View style={{ opacity: jRFocused ? 1 : contentOpacity }}>
              <Animated.View style={{ opacity: contentOpacity }}>
                <Text style={styles.label}>Company Name </Text>
              </Animated.View>
              <Animated.View
                ref={jobRoleRef}
                style={{ transform: [{ translateY: jobRoleTranslate }] }}
              >
                <SearchBar
                  isFocused={jRFocused}
                  setIsFocused={setJRFocused}
                  onChangeText={setSearchText}
                  placeholder={"ex: Coder Serve"}
                />
                <View
                  style={{
                    display: jRFocused ? "flex" : "none",
                    height: "100%",
                    backgroundColor: "#f7f7f7",
                    paddingTop: 8,
                  }}
                  pointerEvents="none"
                >
                  {companiesSuggestions.map((item, index) => (
                    <SearchSuggestion key={index} title={item.company_name} />
                  ))}
                </View>
              </Animated.View>
            </Animated.View>
            <Animated.View
              style={{ flexDirection: "row", gap: 16, opacity: contentOpacity }}
            >
              <View style={{ flex: 1 / 2 }}>
                <Text style={styles.label}>Joining Date</Text>
                <DateSelect
                  placeholder="Jan 2000"
                  selectedMonth={joinMonth}
                  selectedYear={joinYear}
                  setSelectedMonth={setJoinMonth}
                  setSelectedYear={setJoinYear}
                />
              </View>
              <View style={{ flex: 1 / 2 }}>
                <Text style={styles.label}>Joining Date</Text>
                <DateSelect
                  placeholder="Dec 2022"
                  selectedMonth={endMonth}
                  selectedYear={endYear}
                  setSelectedMonth={setEndMonth}
                  setSelectedYear={setEndYear}
                />
              </View>
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Work Mode</Text>
              <SelectMenu
                placeholder="Select Work Mode"
                options={workModeOptions}
                selected={jobType}
                onSelect={setJobType}
                allowSearch={false}
              />
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Job Location</Text>
              <LocationSelectMenu
                selectedCountry={country}
                setSelectedCountry={setCountry}
                selectedState={state}
                setSelectedState={setState}
                selectedCity={city}
                setSelectedCity={setCity}
              />
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Job Description (Optional)</Text>
              <TextAreaInput
                placeholder="Write here"
                text={description}
                setText={setDescription}
              />
            </Animated.View>
            <Animated.View
              style={{ opacity: contentOpacity, marginBottom: 48 }}
            >
              <BlueButton title="Save" />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </PageLayout>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 8,
    color: "#a6a6a6",
  },
  formContainer: {
    gap: 48,
  },
});
