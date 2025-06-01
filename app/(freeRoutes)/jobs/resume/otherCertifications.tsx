import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import PageLayout from "@/components/general/PageLayout";
import SearchBar from "@/components/profile/SearchBar";
import { measureY, styles } from "./education";
import React from "react";
import SearchSuggestion from "@/components/jobs/resume/SearchSuggestions";
import FormInput from "@/components/form/FormInput";
import BlueButton from "@/components/buttons/BlueButton";
import NoBgButton from "@/components/buttons/NoBgButton";
import ErrorMessage from "@/components/messsages/Error";
import PopUpMessage from "@/components/jobs/resume/PopUpMessage";
import { useJobsState, useResumeEdit } from "@/zustand/jobsStore";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import protectedApi from "@/helpers/axios";
import handleApiError from "@/helpers/apiErrorHandler";
import { useRouter } from "expo-router";

const formSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  company: zod.string().min(1, "Company is required"),
  link: zod.string().url("Link must be a valid URL").optional(),
})

type FormData = zod.infer<typeof formSchema>;

const windowWidth = Dimensions.get("window").width;

export default function OtherCertifications() {
  let certification = null;
  const { other_certifications: currentCertifications, setJobsState } = useJobsState((state) => state);
  const { edit, id } = useResumeEdit((state) => state);
  if (edit && id) {
    certification = currentCertifications?.find(
      (certification) => certification.id === id,
    );
  }

  const router = useRouter();


  const { control, handleSubmit, setError, watch, setValue, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: certification ? certification.title : "",
      company: certification ? certification.company : "",
      link: certification ? certification.link : "",
    },
  });

  const { title, company, link } = watch();
  const [popUpVisible, setPopUpVisible] = React.useState(false);

  const handleAddCertification: SubmitHandler<FormData> = async (data) => {
    const certificationData = {
      id: Date.now(),
      title: data.title,
      company: data.company,
      link: data.link || "",
    }
    await protectedApi.put('/jobs/resume/add_certification/', { new_certification: certificationData }).then((response) => {
      if (response.data) {
        setJobsState(response.data);
        router.back();
      }
    }).catch((error) => {
      handleApiError(error, setError);
    });
  }

  const handleUpdateCertification: SubmitHandler<FormData> = async (data) => {
    const certificationData = {
      id: certification?.id || Date.now(),
      title: data.title,
      company: data.company,
      link: data.link || "",
    }
    await protectedApi.put('/jobs/resume/update_certification/', certificationData).then((response) => {
      if (response.data) {
        setJobsState(response.data);
        router.back();
      }
    }).catch((error) => {
      handleApiError(error, setError);
    });
  }

  const handleDeleteCertification = async () => {
    await protectedApi.put('/jobs/resume/delete_certification/', { id: certification?.id }).then((response) => {
      if (response.data) {
        setJobsState(response.data);
        router.back();
      }
    }).catch((error) => {
      handleApiError(error, setError);
    });
  };

  // focused search bar states
  const [titleFocused, setTitleFocused] = React.useState(false);
  const [companyFocused, setCompanyFocused] = React.useState(false);

  // refs for search bars
  const titleRef = React.useRef(null);
  const companyRef = React.useRef(null);

  // value for searches
  const [titleText, setTitleText] = React.useState(
    certification ? certification.title : "",
  );
  const [companyText, setCompanyText] = React.useState(
    certification ? certification.company : "",
  );

  // suggestions for searches
  const [titleSuggestions, setTitleSuggestions] = React.useState([]);
  const [companySuggestions, setCompanySuggestions] = React.useState([]);

  // animated values
  const contentOpacity = useAnimatedValue(1);
  const titleTranslateY = useAnimatedValue(0);
  const companyTranslateY = useAnimatedValue(0);

  // functions to handle focus and blue events
  const animateTitle = async () => {
    const titleY = await measureY(titleRef);
    if (titleY && titleFocused) {
      Animated.timing(titleTranslateY, {
        toValue: Platform.OS === "ios" ? -titleY + 32 : -titleY,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(titleTranslateY, {
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

  const animateCompany = async () => {
    const companyY = await measureY(companyRef);
    if (companyY && companyFocused) {
      Animated.timing(companyTranslateY, {
        toValue: Platform.OS === "ios" ? -companyY + 32 : -companyY,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(companyTranslateY, {
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

  // effects to handle focus and blur events
  React.useEffect(() => {
    animateTitle();
  }, [titleFocused]);
  React.useEffect(() => {
    animateCompany();
  }, [companyFocused]);

  return (
    <PageLayout
      headerTitle="Other Certifications"
      showHeader={!titleFocused && !companyFocused}
    >
      <PopUpMessage
        heading="Delete this certification?"
        text="This action will permanently remove this certification from your resume. You won’t be able to undo this."
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={handleDeleteCertification}
        isLoading={isSubmitting}
      />
      <Animated.View style={{ alignItems: "center" }}>
        <View
          style={{
            gap: 48,
            width:
              titleFocused || companyFocused ? windowWidth : windowWidth - 32,
          }}
        >
          <Animated.View style={{ opacity: titleFocused ? 1 : contentOpacity }}>
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Certification Title</Text>
            </Animated.View>
            <Animated.View
              style={{ transform: [{ translateY: titleTranslateY }] }}
              ref={titleRef}
            >
              <SearchBar
                isFocused={titleFocused}
                setIsFocused={setTitleFocused}
                placeholder="ex: Python Developer"
                text={titleText}
                onChangeText={setTitleText}
              />
              <View
                style={{
                  display: titleFocused ? "flex" : "none",
                  height: "100%",
                  backgroundColor: "#f7f7f7",
                }}
              >
                {titleText && (
                  <SearchSuggestion
                    title={titleText}
                    onPress={() => {
                      setTitleFocused(false);
                      Keyboard.dismiss();
                      setValue('title', titleText)
                    }}
                  />
                )}
                {titleSuggestions.map((item, index) => (
                  <SearchSuggestion
                    key={index}
                    title={item}
                    onPress={() => {
                      setTitleFocused(false);
                      Keyboard.dismiss();
                      setValue('title', item);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
          <Animated.View
            style={{ opacity: companyFocused ? 1 : contentOpacity }}
          >
            <Animated.View style={{ opacity: contentOpacity }}>
              <Text style={styles.label}>Certified By</Text>
            </Animated.View>
            <Animated.View
              style={{ transform: [{ translateY: companyTranslateY }] }}
              ref={companyRef}
            >
              <SearchBar
                isFocused={companyFocused}
                setIsFocused={setCompanyFocused}
                placeholder="ex: Google"
                text={companyText}
                onChangeText={setCompanyText}
              />
              <View
                style={{
                  display: companyFocused ? "flex" : "none",
                  height: "100%",
                  backgroundColor: "#f7f7f7",
                }}
              >
                {companyText && (
                  <SearchSuggestion
                    title={companyText}
                    onPress={() => {
                      setCompanyFocused(false);
                      Keyboard.dismiss();
                      setValue('company', companyText);
                    }}
                  />
                )}
                {companySuggestions.map((item, index) => (
                  <SearchSuggestion
                    key={index}
                    title={item}
                    onPress={() => {
                      setCompanyFocused(false);
                      Keyboard.dismiss();
                      setValue('company', item);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
          <View>
            <Text style={styles.label}>Certification Link</Text>
            <Controller
              control={control}
              name="link"
              render={({ field: { onChange, value } }) => (
                <FormInput
                  placeholder="ex: https://www.example.com/certification"
                  value={value || ''}
                  onChangeText={onChange}
                  topMargin={false}
                  error={errors.link?.message}
                />
              )}
            />
          </View>
          <View style={{ gap: 16 }}>
            <BlueButton
              title={certification ? "Update" : "Save"}
              onPress={
                certification
                  ? handleSubmit(handleUpdateCertification)
                  : handleSubmit(handleAddCertification)
              }
              loading={isSubmitting}
              disabled={
                certification
                  ? (certification.title === title &&
                    certification.link === link &&
                    certification.company === company) ||
                  !title ||
                  !company ||
                  !link
                  : !title || !company || !link
              }
            />
            {certification && (
              <NoBgButton
                title="Delete"
                onPress={() => setPopUpVisible(true)}
                dangerButton
              />
            )}
          </View>
          {errors.root?.message && (
            <View style={{ marginTop: 8 }}>
              <ErrorMessage message={errors.root?.message} />
            </View>
          )}
        </View>
      </Animated.View>
    </PageLayout>
  );
}
