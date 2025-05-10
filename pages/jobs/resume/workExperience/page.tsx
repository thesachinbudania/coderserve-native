import PageLayout from "../../../profile/controlCentre/accountCenter/PageLayout";
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
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
import {
  useDeleteExpereinceMutation,
  useUpdateExperienceMutation,
  useUpdateJobExperienceMutation,
  useCompaniesDataMutation,
} from "../../apiSlice";
import jobRoles from "./jobRolesName";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { setPreviousExperience } from "../../../../app/jobsSlice";
import Error from "../../../../components/messsages/Error";
import { useNavigation } from "@react-navigation/native";
import NoBgButton from "../../../../components/buttons/NoBgButton";
import PopUpMessage from "./PopUpMessage";
import { useRemoveFooter } from "../../../../helpers/hideFooter";

const jobTypeOptions = [
  "Full Time",
  "Part Time",
  "Internship",
  "Freelance",
  "Self Employed",
];

const workModeOptions = ["On-site", "Hybrid", "Remote"];

export function SearchSuggestion({
  title,
  onPress = () => {},
}: {
  title: string;
  onPress?: () => void;
}) {
  const { width } = Dimensions.get("window");
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          pointerEvents="none"
          style={[{ padding: 16, flexDirection: "row", gap: 8 }]}
        >
          <Image
            source={require("../../../profile/components/assets/searchIcon.png")}
            style={{ width: 20, height: 20 }}
          />
          <Text
            style={[
              { fontSize: 15, width: width - 48 },
              pressed && { color: "#006dff" },
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function WorkExperience({ route }: { route: any }) {
  useRemoveFooter(route.params.addFooterOnUnmount);
  let experience = null;
  const experiences = useSelector(
    (state: RootState) => state.jobs.previousExperience,
  );
  if (route.params && route.params.edit) {
    const experienceId = route.params.id;
    experience = experiences?.find((exp) => exp.id === experienceId);
  }

  // animation related stuff
  const contentOpacity = useAnimatedValue(1);

  const jobRoleRef = React.useRef(null);
  const jobRoleTranslate = useAnimatedValue(0);
  const [jRFocused, setJRFocused] = React.useState(false);

  const jobDescRef = React.useRef(null);
  const jobDescTranslate = useAnimatedValue(0);
  const [jDFocused, setJDFocused] = React.useState(false);

  // function to handle back button press
  const handleBackButtonPress = () => {
    if (jRFocused || jDFocused) {
      setJRFocused(false);
      setJDFocused(false);
      return true;
    }
    return false;
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonPress,
    );
    return () => {
      backHandler.remove();
    };
  }, [jRFocused, jDFocused]);

  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  React.useEffect(() => {
    if (jRFocused || jDFocused) {
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }
  }, [jRFocused, jDFocused]);

  const [searchText, setSearchText] = React.useState(
    experience ? experience.company.name : "",
  );

  const windowWidth = Dimensions.get("window").width;
  const [error, setError] = React.useState("");

  const navigation = useNavigation();

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

  // states of the selected and filled fields
  const [jobType, setJobType] = React.useState<string | null>(
    experience ? experience.job_type : null,
  );
  const [jobRole, setJobRole] = React.useState(
    experience ? experience.job_role : "",
  );
  const [company, setCompany] = React.useState<{
    name: string;
    logo: string | null;
  } | null>(experience ? experience.company : null);
  const [workMode, setWorkMode] = React.useState<string | null>(
    experience ? experience.work_mode : null,
  );
  const [joinMonth, setJoinMonth] = React.useState(
    experience ? experience.joining_month : "",
  );
  const [joinYear, setJoinYear] = React.useState(
    experience ? experience.joining_year : "",
  );
  const [endMonth, setEndMonth] = React.useState(
    experience ? experience.end_month : "",
  );
  const [endYear, setEndYear] = React.useState(
    experience ? experience.end_year : "",
  );
  const [country, setCountry] = React.useState<string | null>(
    experience ? experience.country : null,
  );
  const [state, setState] = React.useState<string | null>(
    experience ? experience.state : null,
  );
  const [city, setCity] = React.useState<string | null>(
    experience ? experience.city : null,
  );
  const [description, setDescription] = React.useState(
    experience ? experience.description : "",
  );

  const [updateJobExperience, { isLoading }] = useUpdateJobExperienceMutation();

  const dispatch = useDispatch();

  const handleSave = async () => {
    const data = {
      id: Date.now(),
      job_type: jobType,
      job_role: jobRole,
      company: company,
      joining_month: joinMonth,
      joining_year: joinYear,
      end_month: endMonth,
      end_year: endYear,
      work_mode: workMode,
      country,
      state,
      city,
      description,
    };

    try {
      const response = await updateJobExperience({
        new_experience: data,
      }).unwrap();
      if (response) {
        dispatch(setPreviousExperience(response.previous_experience));
      }
      navigation.goBack();
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error updating job experience:", error);
    }
  };

  // logics for handling company name search
  async function searchCompanyName(name: string) {
    try {
      const response = await companiesData({
        detail: false,
        data: name,
      }).unwrap();
      if (response && searchText.length > 0) {
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
      setCompaniesSuggestions([]);
    }
  }, [searchText]);

  // logics for handling job role search
  const [jobRolesSuggestions, setJobRolesSuggestions] = React.useState<any[]>(
    [],
  );
  const [jobRolesSearchText, setJobRolesSearchText] = React.useState(
    experience ? experience.job_role : "",
  );

  const filterTopJobRoles = (searchText: string) => {
    const lowerSearch = searchText.toLowerCase();
    const matches = jobRoles
      .filter((role) => role.toLowerCase().includes(lowerSearch))
      .slice(0, 3);

    setJobRolesSuggestions(matches);
  };

  React.useEffect(() => {
    if (jobRolesSearchText.length > 0) {
      filterTopJobRoles(jobRolesSearchText);
    } else {
      setJobRolesSuggestions([]);
    }
  }, [jobRolesSearchText]);

  // logics for handling updating the job experience
  const [updateExperience, { isLoading: updateLoading }] =
    useUpdateExperienceMutation();
  const handleUpdateExperience = async () => {
    const data = {
      id: experience?.id || Date.now(),
      job_type: jobType,
      job_role: jobRole,
      company: company,
      joining_month: joinMonth,
      joining_year: joinYear,
      end_month: endMonth,
      end_year: endYear,
      work_mode: workMode,
      country,
      state,
      city,
      description,
    };
    try {
      const response = await updateExperience(data).unwrap();
      if (response) {
        dispatch(setPreviousExperience(response.previous_experience));
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  // logics for deleting experience
  const [deleteExperience, { isLoading: deleteLoading }] =
    useDeleteExpereinceMutation();
  const [showPopUp, setShowPopUp] = React.useState(false);
  const handleDeleteExperience = async () => {
    try {
      const response = await deleteExperience({ id: experience?.id }).unwrap();
      if (response) {
        dispatch(setPreviousExperience(response.previous_experience));
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Animated.View style={{ zIndex: 100, opacity: 0 }}></Animated.View>
      <PageLayout
        headerTitle="Experience"
        showHeader={!jRFocused && !jDFocused}
        scrollEnabled={scrollEnabled}
      >
        <PopUpMessage
          heading="Delete this experience?"
          text="This action will permanently remove this experience from your resume. You won’t be able to undo this."
          visible={showPopUp}
          setVisible={setShowPopUp}
          onPress={handleDeleteExperience}
          isLoading={deleteLoading}
        />
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
                  onChangeText={setJobRolesSearchText}
                  text={jobRolesSearchText}
                  placeholder="ex: Java Developer"
                />
                <View
                  style={{
                    display: jDFocused ? "flex" : "none",
                    height: "100%",
                    backgroundColor: "#f7f7f7",
                  }}
                >
                  {jobRolesSearchText && (
                    <SearchSuggestion
                      title={jobRolesSearchText}
                      onPress={() => {
                        setJDFocused(false);
                        Keyboard.dismiss();
                        setJobRole(jobRolesSearchText);
                      }}
                    />
                  )}
                  {jobRolesSuggestions.map((item, index) => (
                    <SearchSuggestion
                      key={index}
                      title={item}
                      onPress={() => {
                        setJobRolesSearchText(item);
                        setJDFocused(false);
                        Keyboard.dismiss();
                        setJobRole(item);
                      }}
                    />
                  ))}
                </View>
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
                  text={searchText}
                />
                <View
                  style={{
                    display: jRFocused ? "flex" : "none",
                    height: "100%",
                    backgroundColor: "#f7f7f7",
                    paddingTop: 8,
                  }}
                >
                  {searchText && (
                    <SearchSuggestion
                      title={searchText}
                      onPress={() => {
                        setJRFocused(false);
                        Keyboard.dismiss();
                        setCompany({ name: searchText, logo: null });
                      }}
                    />
                  )}

                  {companiesSuggestions.map((item, index) => (
                    <SearchSuggestion
                      key={index}
                      title={item.company_name}
                      onPress={() => {
                        setSearchText(item.company_name);
                        setJRFocused(false);
                        Keyboard.dismiss();
                        setCompany({
                          name: item.company_name,
                          logo: item.company_logo,
                        });
                      }}
                    />
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
                <Text style={styles.label}>Ending Date</Text>
                <DateSelect
                  placeholder="Dec 2022"
                  selectedMonth={endMonth}
                  selectedYear={endYear}
                  setSelectedMonth={setEndMonth}
                  setSelectedYear={setEndYear}
                  presentOption
                />
              </View>
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Work Mode</Text>
              <SelectMenu
                placeholder="Select Work Mode"
                options={workModeOptions}
                selected={workMode}
                onSelect={setWorkMode}
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
              style={{
                opacity: contentOpacity,
                marginBottom: Platform.OS === "ios" ? 64 : 112,
              }}
            >
              <BlueButton
                title={experience ? "Update" : "Save"}
                onPress={experience ? handleUpdateExperience : handleSave}
                loading={experience ? updateLoading : isLoading}
                disabled={
                  experience ?
                    jobType === null ||
                    jobRole === "" ||
                    company === null ||
                    joinMonth === "" ||
                    joinYear === "" ||
                    endMonth === "" ||
                    endYear === "" ||
                    workMode === null ||
                    country === null ||
                    state === null ||
                    city === null ||
                    (
                      jobType === experience.job_type &&
                      jobRole === experience.job_role &&
                      company?.name === experience.company.name &&
                      joinMonth === experience.joining_month &&
                      joinYear === experience.joining_year &&
                      endMonth === experience.end_month &&
                      endYear === experience.end_year &&
                      workMode === experience.work_mode &&
                      country === experience.country &&
                      state === experience.state &&
                      city === experience.city &&
                      description === experience.description
                    )
                    :
                    jobType === null ||
                    jobRole === "" ||
                    company === null ||
                    joinMonth === "" ||
                    joinYear === "" ||
                    endMonth === "" ||
                    endYear === "" ||
                    workMode === null ||
                    country === null ||
                    state === null ||
                    city === null
                }
              />
              {experience && (
                <View style={{ marginTop: 16 }}>
                  <NoBgButton
                    dangerButton
                    title="Delete"
                    onPress={() => setShowPopUp(true)}
                  />
                </View>
              )}
              {error && (
                <View style={{ marginTop: 8 }}>
                  <Error message={error} />
                </View>
              )}
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
