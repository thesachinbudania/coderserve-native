import PageLayout from "@/components/general/PageLayout";
import {
  Animated,
  BackHandler,
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import SelectMenu from "@/components/form/SelectMenu";
import React from "react";
import DateSelect from "@/components/jobs/resume/DateSelect";
import LocationSelectMenu from "@/components/form/LocationSelectMenu";
import TextAreaInput from "@/components/form/TextAreaInput";
import BlueButton from "@/components/buttons/BlueButton";
import SearchBar from "@/components/profile/SearchBar";
import jobRoles from "@/constants/jobRolesName";
import Error from "@/components/messsages/Error";
import NoBgButton from "@/components/buttons/NoBgButton";
import PopUpMessage from "@/components/jobs/resume/PopUpMessage";
import SearchSuggestion from "@/components/jobs/resume/SearchSuggestions";
import { useJobsState, useResumeEdit } from "@/zustand/jobsStore";
import protectedApi from "@/helpers/axios";
import * as zod from 'zod';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import handleApiError from "@/helpers/apiErrorHandler";
import { useRouter } from "expo-router";

const formSchema = zod.object({
  id: zod.number().optional(),
  job_type: zod.string().nullable(),
  job_role: zod.string().min(1, "Job role is required"),
  company: zod.object({
    name: zod.string().min(1, "Company name is required"),
    logo: zod.string().nullable(),
  }),
  joining_month: zod.string().min(1, "Joining month is required"),
  joining_year: zod.string().min(1, "Joining year is required"),
  end_month: zod.string().min(1, "Ending month is required"),
  end_year: zod.string().min(1, "Ending year is required"),
  work_mode: zod.string().nullable(),
  country: zod.string().nullable(),
  state: zod.string().nullable(),
  city: zod.string().nullable(),
  description: zod.string().optional(),
});

type FormData = zod.infer<typeof formSchema>

const jobTypeOptions = [
  "Full Time",
  "Part Time",
  "Internship",
  "Freelance",
  "Self Employed",
];

const workModeOptions = ["On-site", "Hybrid", "Remote"];



export default function WorkExperience() {
  let experience = null;
  const { previous_experience: experiences, setJobsState } = useJobsState(state => state)
  const { edit, id } = useResumeEdit(state => state)
  if (edit && id) {
    experience = experiences?.find((exp) => exp.id === id);
  }
  const router = useRouter();

  // animation related stuff
  const contentOpacity = useAnimatedValue(1);

  const jobRoleRef = React.useRef(null);
  const jobRoleTranslate = useAnimatedValue(0);
  const [jRFocused, setJRFocused] = React.useState(false);

  const jobDescRef = React.useRef(null);
  const jobDescTranslate = useAnimatedValue(0);
  const [jDFocused, setJDFocused] = React.useState(false);

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
  const [companiesSuggestions, setCompaniesSuggestions] = React.useState<any[]>(
    [],
  );

  const { control, watch, handleSubmit, setError, setValue, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      id: experience ? experience.id : Date.now(),
      job_type: experience ? experience.job_type : null,
      job_role: experience ? experience.job_role : "",
      company: experience ? experience.company : { name: "", logo: null },
      joining_month: experience ? experience.joining_month : "",
      joining_year: experience ? experience.joining_year : "",
      end_month: experience ? experience.end_month : "",
      end_year: experience ? experience.end_year : "",
      work_mode: experience ? experience.work_mode : null,
      country: experience ? experience.country : null,
      state: experience ? experience.state : null,
      city: experience ? experience.city : null,
      description: experience ? experience.description : "",
    }
  })

  const { job_type, job_role, company, joining_month, joining_year, end_month, end_year, work_mode, country, state, city, description } = watch();
  const handleSave: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/update_job_experience/', { new_experience: data }).then((response) => {
      setJobsState({ previous_experience: response.data.previous_experience })
      router.back();
    }).catch(error => handleApiError(error, setError))
  }

  // logics for handling company name search
  async function searchCompanyName(name: string) {
    await protectedApi.get(`/jobs/companies_search_recommendations/?q=${name}`).then((response) => {
      if (response.data && searchText.length > 0) {
        setCompaniesSuggestions(response.data)
      }
    })
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
  const handleUpdate: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/update_experience/', data).then((response) => {
      setJobsState({ previous_experience: response.data.previous_experience });
      router.back();
    }).catch(error => handleApiError(error, setError));
  }

  // logics for deleting experience
  const [showPopUp, setShowPopUp] = React.useState(false);
  const handleDelete = async () => {
    await protectedApi.put('/jobs/resume/delete_experience/', { id: experience?.id }).then((response) => {
      setJobsState({ previous_experience: response.data.previous_experience });
      router.back();
    }).catch(error => handleApiError(error, setError));
  }

  // function to handle back button press
  const handleBackButtonPress = () => {
    if (jRFocused || jDFocused) {
      if (jRFocused) {
        setValue("company.name", "");
        setJRFocused(false);
        setSearchText("");
      }
      if (jDFocused) {
        setValue("job_role", "");
        setJDFocused(false);
        setJobRolesSearchText("");
      }
      Keyboard.dismiss();
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
          onPress={handleSubmit(handleDelete)}
          isLoading={isSubmitting}
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
              <Controller
                control={control}
                name="job_type"
                render={({ field: { onChange, value } }) => (
                  <SelectMenu
                    placeholder="Select Job Type"
                    options={jobTypeOptions}
                    selected={value}
                    onSelect={onChange}
                    allowSearch={false}
                  />
                )}
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
                        setValue("job_role", jobRolesSearchText);
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
                        setValue("job_role", item);
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
                        setValue("company", { name: searchText, logo: null })
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
                        setValue("company", {
                          name: item.company_name,
                          logo: item.company_logo,
                        })
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
                  selectedMonth={joining_month}
                  selectedYear={joining_year}
                  setSelectedMonth={(month: string) => setValue('joining_month', month)}
                  setSelectedYear={(year: string) => setValue('joining_year', year)}
                />
              </View>
              <View style={{ flex: 1 / 2 }}>
                <Text style={styles.label}>Ending Date</Text>
                <DateSelect
                  placeholder="Dec 2022"
                  selectedMonth={end_month}
                  selectedYear={end_year}
                  setSelectedMonth={(month: string) => setValue('end_month', month)}
                  setSelectedYear={(year: string) => setValue('end_year', year)}
                  presentOption
                />
              </View>
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Work Mode</Text>
              <Controller
                control={control}
                name='work_mode'
                render={({ field: { value, onChange } }) => (
                  <SelectMenu
                    placeholder="Select Work Mode"
                    options={workModeOptions}
                    selected={value}
                    onSelect={onChange}
                    allowSearch={false}
                  />
                )}
              />

            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Job Location</Text>
              <LocationSelectMenu
                selectedCountry={country}
                setSelectedCountry={(country: string) => setValue('country', country)}
                selectedState={state}
                setSelectedState={(state: string) => setValue('state', state)}
                selectedCity={city}
                setSelectedCity={(city: string) => setValue('city', city)}
              />
            </Animated.View>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Job Description (Optional)</Text>
              <Controller
                control={control}
                name='description'
                render={({ field: { onChange, value } }) => (
                  <TextAreaInput
                    placeholder="Write here"
                    text={value || ''}
                    setText={onChange}
                  />
                )}
              />
            </Animated.View>
            <Animated.View
              style={{
                opacity: contentOpacity,
              }}
            >
              <BlueButton
                title={experience ? "Update" : "Save"}
                onPress={experience ? handleSubmit(handleUpdate) : handleSubmit(handleSave)}
                loading={isSubmitting}
                disabled={
                  experience ?
                    job_type === null ||
                    job_role === "" ||
                    company.name === '' ||
                    joining_month === "" ||
                    joining_year === "" ||
                    end_month === "" ||
                    end_year === "" ||
                    work_mode === null ||
                    country === null ||
                    state === null ||
                    city === null ||
                    (
                      job_type === experience.job_type &&
                      job_role === experience.job_role &&
                      company?.name === experience.company.name &&
                      joining_month === experience.joining_month &&
                      joining_year === experience.joining_year &&
                      end_month === experience.end_month &&
                      end_year === experience.end_year &&
                      work_mode === experience.work_mode &&
                      country === experience.country &&
                      state === experience.state &&
                      city === experience.city &&
                      description === experience.description
                    )
                    :
                    job_type === null ||
                    job_role === "" ||
                    company.name === '' ||
                    joining_month === "" ||
                    joining_year === "" ||
                    end_month === "" ||
                    end_year === "" ||
                    work_mode === null ||
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
              {errors.root?.message && (
                <View style={{ marginTop: 8 }}>
                  <Error message={errors.root.message} />
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
