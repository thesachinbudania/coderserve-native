import { Animated, BackHandler, Dimensions, Keyboard, Platform, Text, useAnimatedValue, View } from 'react-native'
import FormInput from '@/components/form/FormInput';
import { TopNav, measureY, setSuggestions, styles } from '@/components/jobs/resume/educationUtils';
import SearchBar from '@/components/profile/SearchBar';
import React, { SetStateAction } from 'react';
import DateSelect from '@/components/jobs/resume/DateSelect';
import LocationSelectMenu from '@/components/form/LocationSelectMenu';
import BlueButton from '@/components/buttons/BlueButton';
import { degrees, fieldsOfStudy, universities } from '@/constants/jobsEducationSuggestions';
import SearchSuggestion from '@/components/jobs/resume/SearchSuggestions';
import { useJobsState, useResumeEdit } from '@/zustand/jobsStore';
import Error from '@/components/messsages/Error';
import NoBgButton from '@/components/buttons/NoBgButton';
import PopUpMessage from '@/components/jobs/resume/PopUpMessage';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import handleApiError from '@/helpers/apiErrorHandler';
import protectedApi from '@/helpers/axios';
import { useRouter } from 'expo-router';

const formSchema = zod.object({
  id: zod.number(),
  type: zod.number(),
  degree: zod.string(),
  field_of_study: zod.string(),
  marks: zod.string(),
  institution: zod.string(),
  joining_month: zod.string(),
  joining_year: zod.string(),
  end_month: zod.string(),
  end_year: zod.string(),
  country: zod.string(),
  state: zod.string(),
  city: zod.string(),
});

type FormData = zod.infer<typeof formSchema>;

const windowWidth = Dimensions.get('window').width;

export default function Education({ page, setPage, setShowHeader, setScrollEnabled }: { page: number, setPage: React.Dispatch<SetStateAction<number>>, setShowHeader: React.Dispatch<React.SetStateAction<boolean>>, setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  let editDegree = null;
  const { degrees: currentDegrees, setJobsState } = useJobsState(state => state)
  const { edit, id } = useResumeEdit(state => state);
  if (edit && id) {
    const degree = currentDegrees?.find((degree) => degree.id === id);
    if (degree?.type === 0) {
      editDegree = degree;
    }
  }

  const router = useRouter();

  const { control, handleSubmit, setError, setValue, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      id: editDegree ? editDegree.id : Date.now(),
      type: editDegree ? editDegree.type : 0,
      degree: editDegree ? editDegree.degree : '',
      field_of_study: editDegree ? editDegree.field_of_study : '',
      marks: editDegree ? editDegree.marks : '',
      institution: editDegree ? editDegree.institution : '',
      joining_month: editDegree ? editDegree.joining_month : '',
      joining_year: editDegree ? editDegree.joining_year : '',
      end_month: editDegree ? editDegree.end_month : '',
      end_year: editDegree ? editDegree.end_year : '',
      country: editDegree ? editDegree.country : '',
      state: editDegree ? editDegree.state : '',
      city: editDegree ? editDegree.city : '',
    },
    resolver: zodResolver(formSchema),
  });

  const { degree, field_of_study, marks, institution, joining_month, joining_year, end_month, end_year, country, state, city } = watch();

  const handleDelete: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/delete_degree/', { id: data.id }).then((response) => {
      if (response.data) {
        setJobsState({ degrees: response.data['degrees'] });
      }
      router.back();
    }).catch(error => handleApiError(error, setError));
  }

  const handleSave: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/add_degree/', { new_degree: data }).then((response) => {
      console.log(response.data)
      if (response.data) {
        setJobsState({ degrees: response.data['degrees'] });
      }
      router.back();
    }).catch(error => handleApiError(error, setError));
  }

  const handleUpdate: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/update_degree/', data).then((response) => {
      if (response.data) {
        setJobsState({ degrees: response.data['degrees'] });
      }
      router.back();
    }).catch(error => handleApiError(error, setError));
  }

  // popup for confirming delete
  const [showPopUp, setShowPopUp] = React.useState(false);

  // focused search bar states
  const [degreeFocused, setDegreeFocused] = React.useState(false);
  const [fieldOfStudyFocused, setFieldOfStudyFocused] = React.useState(false);
  const [universityFocused, setUniversityFocused] = React.useState(false);


  React.useEffect(() => {
    if (degreeFocused || fieldOfStudyFocused || universityFocused) {
      setScrollEnabled(false);
    }
    else {
      setScrollEnabled(true);
    }
  }, [degreeFocused, fieldOfStudyFocused, universityFocused])
  // refs for search bars 
  const degreeRef = React.useRef(null);
  const fieldOfStudyRef = React.useRef(null);
  const universityRef = React.useRef(null);

  // values for searches
  const [degreeSearchText, setDegreeSearchText] = React.useState(editDegree ? editDegree.degree : '');
  const [fieldOfStudySearchText, setFieldOfStudySearchText] = React.useState(editDegree ? editDegree.field_of_study : '');
  const [universitySearchText, setUniversitySearchText] = React.useState(editDegree ? editDegree.institution : '');

  // suggestions for searches
  const [degreeSuggestions, setDegreeSuggestions] = React.useState<any[]>([]);
  const [fieldOfStudySuggestions, setFieldOfStudySuggestions] = React.useState<any[]>([]);
  const [universitySuggestions, setUniversitySuggestions] = React.useState<any[]>([]);

  // function to handle search suggestions
  React.useEffect(() => {
    setSuggestions(degreeSearchText, setDegreeSuggestions, degrees);
  }, [degreeSearchText])

  React.useEffect(() => {
    setSuggestions(fieldOfStudySearchText, setFieldOfStudySuggestions, fieldsOfStudy);
  }, [fieldOfStudySearchText])

  React.useEffect(() => {
    setSuggestions(universitySearchText, setUniversitySuggestions, universities);
  }, [universitySearchText])

  // effect for hiding header on search bars focused
  React.useEffect(() => {
    if (degreeFocused || fieldOfStudyFocused || universityFocused) {
      setShowHeader(false);
    }
    else {
      setShowHeader(true);
    }
  }, [degreeFocused, fieldOfStudyFocused, universityFocused])

  // animated values
  const contentOpacity = useAnimatedValue(1);
  const degreeTranslateY = useAnimatedValue(0);
  const fieldOfStudyTranslateY = useAnimatedValue(0);
  const universityTranslateY = useAnimatedValue(0);

  // function to handle focus and blur events
  const animatedDegree = async () => {
    const degreeY = await measureY(degreeRef);
    if (degreeY && degreeFocused) {
      Animated.timing(degreeTranslateY, {
        toValue: Platform.OS === 'ios' ? -degreeY + 32 : -degreeY,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
    else {
      Animated.timing(degreeTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }

  const animatedFieldOfStudy = async () => {
    const fieldOfStudyY = await measureY(fieldOfStudyRef);
    if (fieldOfStudyY && fieldOfStudyFocused) {
      Animated.timing(fieldOfStudyTranslateY, {
        toValue: Platform.OS === 'ios' ? -fieldOfStudyY + 32 : -fieldOfStudyY,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
    else {
      Animated.timing(fieldOfStudyTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }

  const animatedUniversity = async () => {
    const universityY = await measureY(universityRef);
    if (universityY && universityFocused) {
      Animated.timing(universityTranslateY, {
        toValue: Platform.OS === 'ios' ? -universityY + 32 : -universityY,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
    else {
      Animated.timing(universityTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }

  // effects to handle focus and blur events
  React.useEffect(() => {
    animatedDegree();
  }, [degreeFocused])

  React.useEffect(() => {
    animatedFieldOfStudy();
  }, [fieldOfStudyFocused])

  React.useEffect(() => {
    animatedUniversity();
  }, [universityFocused])

  // effect for handling back button
  React.useEffect(() => {
    const backAction = () => {
      if (degreeFocused || fieldOfStudyFocused || universityFocused) {
        switch (true) {
          case degreeFocused:
            setDegreeFocused(false);
            setDegreeSearchText(editDegree ? editDegree.degree : '');
            setValue('degree', editDegree ? editDegree.degree : '');
            break;
          case fieldOfStudyFocused:
            setFieldOfStudyFocused(false);
            setFieldOfStudySearchText(editDegree ? editDegree.field_of_study : '');
            setValue('field_of_study', editDegree ? editDegree.field_of_study : '');
            break;
          case universityFocused:
            setUniversityFocused(false);
            setUniversitySearchText(editDegree ? editDegree.institution : '');
            setValue('institution', editDegree ? editDegree.institution : '');
            break;
        }
        Keyboard.dismiss();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [])
  return (
    <>
      <PopUpMessage
        heading='Delete this education?'
        text='This action will permanently remove this education from your resume. You won’t be able to undo this.'
        visible={showPopUp}
        setVisible={setShowPopUp}
        onPress={handleSubmit(handleDelete)}
        isLoading={isSubmitting}
      />
      <Animated.View style={{ opacity: contentOpacity }}>
        <TopNav
          page={page}
          setPage={setPage}
        />
      </Animated.View>
      <Animated.View style={{ alignItems: 'center', marginTop: 48 }}>
        <View style={{ width: degreeFocused || fieldOfStudyFocused || universityFocused ? windowWidth : windowWidth - 32, gap: 48 }}>
          <Animated.View style={{ opacity: degreeFocused ? 1 : contentOpacity }}>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Degree</Text>
            </Animated.View>
            <Animated.View
              ref={degreeRef}
              style={{ transform: [{ translateY: degreeTranslateY }] }}
            >
              <SearchBar
                isFocused={degreeFocused}
                setIsFocused={setDegreeFocused}
                placeholder='ex: Bachelor of Engineering'
                text={degreeSearchText}
                onChangeText={setDegreeSearchText}
              />
              <View
                style={{
                  display: degreeFocused ? "flex" : "none",
                  height: "100%",
                  backgroundColor: "#fff",
                }}
              >
                {
                  degreeSearchText &&
                  <SearchSuggestion
                    title={degreeSearchText}
                    onPress={() => {
                      setDegreeFocused(false);
                      Keyboard.dismiss();
                      setValue('degree', degreeSearchText);
                    }}
                  />
                }
                {degreeSuggestions.map((item, index) => (
                  <SearchSuggestion
                    key={index}
                    title={item}
                    onPress={() => {
                      setDegreeSearchText(item);
                      setDegreeFocused(false);
                      Keyboard.dismiss();
                      setValue('degree', item);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
          <Animated.View style={{ opacity: fieldOfStudyFocused ? 1 : contentOpacity }}>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Field of Study</Text>
            </Animated.View>
            <Animated.View
              ref={fieldOfStudyRef}
              style={{ transform: [{ translateY: fieldOfStudyTranslateY }] }}
            >
              <SearchBar
                isFocused={fieldOfStudyFocused}
                setIsFocused={setFieldOfStudyFocused}
                placeholder='ex: Computer Science'
                text={fieldOfStudySearchText}
                onChangeText={setFieldOfStudySearchText}
              />
              <View
                style={{
                  display: fieldOfStudyFocused ? "flex" : "none",
                  height: "100%",
                  backgroundColor: "#f7f7f7",
                }}
              >
                {
                  fieldOfStudySearchText &&
                  <SearchSuggestion
                    title={fieldOfStudySearchText}
                    onPress={() => {
                      setFieldOfStudyFocused(false);
                      Keyboard.dismiss();
                      setValue('field_of_study', fieldOfStudySearchText);
                    }}
                  />
                }
                {fieldOfStudySuggestions.map((item, index) => (
                  <SearchSuggestion
                    key={index}
                    title={item}
                    onPress={() => {
                      setFieldOfStudySearchText(item);
                      setFieldOfStudyFocused(false);
                      Keyboard.dismiss();
                      setValue('field_of_study', item);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
          <Animated.View style={{ opacity: contentOpacity }}>
            <Text style={styles.label}>Percentage of Mark Obtained (Out of 100)</Text>
            <Controller
              control={control}
              name='marks'
              render={({ field: { onChange, value } }) => (
                <FormInput
                  placeholder='ex: 85.4'
                  keyboardType='numeric'
                  value={value}
                  onChangeText={onChange}
                  topMargin={false}
                  error={errors.marks?.message}
                />
              )}
            />
          </Animated.View>
          <Animated.View style={{ opacity: universityFocused ? 1 : contentOpacity }}>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>University/College/Institution</Text>
            </Animated.View>
            <Animated.View
              ref={universityRef}
              style={{ transform: [{ translateY: universityTranslateY }] }}
            >
              <SearchBar
                isFocused={universityFocused}
                setIsFocused={setUniversityFocused}
                placeholder='ex: Madras Institute of Technology'
                text={universitySearchText}
                onChangeText={setUniversitySearchText}
              />
              <View
                style={{
                  display: universityFocused ? "flex" : "none",
                  height: "100%",
                  backgroundColor: "#f7f7f7",
                }}
              >
                {
                  universitySearchText &&
                  <SearchSuggestion
                    title={universitySearchText}
                    onPress={() => {
                      setUniversityFocused(false);
                      Keyboard.dismiss();
                      setValue('institution', universitySearchText);
                    }}
                  />
                }
                {universitySuggestions.map((item, index) => (
                  <SearchSuggestion
                    key={index}
                    title={item}
                    onPress={() => {
                      setUniversitySearchText(item);
                      setUniversityFocused(false);
                      Keyboard.dismiss();
                      setValue('institution', item);
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
                setSelectedMonth={(setEndMonth: string) => setValue('end_month', setEndMonth)}
                setSelectedYear={(endYear: string) => setValue('end_year', endYear)}
                presentOption
              />
            </View>
          </Animated.View>
          <Animated.View style={{ opacity: contentOpacity }}>
            <Text style={styles.label}>Location</Text>
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
            <BlueButton
              title={editDegree ? "Update" : "Save"}
              onPress={editDegree ? handleSubmit(handleUpdate) : handleSubmit(handleSave)}
              loading={isSubmitting}
              disabled={editDegree ? (
                !degree ||
                !field_of_study ||
                !marks ||
                !institution ||
                !joining_month ||
                !joining_year ||
                !end_month ||
                !end_year ||
                !country ||
                !state ||
                !city ||
                (
                  editDegree.degree === degree &&
                  editDegree.field_of_study === field_of_study &&
                  editDegree.marks === marks &&
                  editDegree.institution === institution &&
                  editDegree.joining_month === joining_month &&
                  editDegree.joining_year === joining_year &&
                  editDegree.end_month === end_month &&
                  editDegree.end_year === end_year &&
                  editDegree.country === country &&
                  editDegree.state === state &&
                  editDegree.city === city

                )

              )
                : (
                  !degree ||
                  !field_of_study ||
                  !marks ||
                  !institution ||
                  !joining_month ||
                  !joining_year ||
                  !end_month ||
                  !end_year ||
                  !country ||
                  !state ||
                  !city

                )}
            />
            {
              editDegree &&
              <View style={{ marginTop: 16 }}>
                <NoBgButton
                  title='Delete'
                  dangerButton
                  onPress={() => setShowPopUp(true)}
                />
              </View>
            }
            {
              errors.root?.message &&
              <View style={{ marginTop: 8 }}>
                <Error message={errors.root.message} />
              </View>
            }

          </Animated.View>
        </View>
      </Animated.View>
    </>
  )
}

