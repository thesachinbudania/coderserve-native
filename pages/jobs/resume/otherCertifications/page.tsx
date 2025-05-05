import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  Text,
  useAnimatedValue,
  View,
} from "react-native";
import PageLayout from "../../../profile/controlCentre/accountCenter/PageLayout";
import SearchBar from "../../../profile/components/SearchBar";
import { measureY, styles } from "../education/page";
import React from "react";
import { SearchSuggestion } from "../workExperience/page";
import FormInput from "../../../../components/form/FormInput";
import BlueButton from "../../../../components/buttons/BlueButton";
import NoBgButton from "../../../../components/buttons/NoBgButton";
import {
  useDeleteCertificationMutation,
  useUpdateCertificationMutation,
  useAddCertificationMutation,
} from "../../apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setOtherCertifications } from "../../../../app/jobsSlice";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../../../app/store";
import ErrorMessage from "../../../../components/messsages/Error";
import PopUpMessage from "../workExperience/PopUpMessage";
import { useRemoveFooter } from "../../../../helpers/hideFooter";

const windowWidth = Dimensions.get("window").width;

export default function OtherCertifications({ route }: { route: any }) {
  useRemoveFooter(route.params.addFooterOnUnmount);
  let certification = null;
  const currentCertifications = useSelector(
    (state: RootState) => state.jobs.otherCertifications,
  );
  if (route.params && route.params.edit) {
    const certificationId = route.params.id;
    certification = currentCertifications?.find(
      (certification) => certification.id === certificationId,
    );
  }

  // final values for the form
  const [title, setTitle] = React.useState(
    certification ? certification.title : "",
  );
  const [company, setCompany] = React.useState(
    certification ? certification.company : "",
  );
  const [link, setLink] = React.useState(
    certification ? certification.link : "",
  );

  const [error, setError] = React.useState("");
  const [popUpVisible, setPopUpVisible] = React.useState(false);

  const [addCertification, { isLoading: isAddCertificationLoading }] =
    useAddCertificationMutation();
  const [updateCertification, { isLoading: isUpdateCertificationLoading }] =
    useUpdateCertificationMutation();
  const [deleteCertification, { isLoading: isDeleteCertificationLoading }] =
    useDeleteCertificationMutation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // functions to handle the api calls
  async function handleAddCertification() {
    const data = {
      id: Date.now(),
      title,
      company,
      link,
    };
    try {
      const response = await addCertification({
        new_certification: data,
      }).unwrap();
      if (response) {
        dispatch(setOtherCertifications(response["other_certifications"]));
      }
      navigation.goBack();
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      console.log(error);
    }
  }

  const handleUpdateCertification = async () => {
    const data = {
      id: certification?.id || Date.now(),
      title,
      company,
      link,
    };
    try {
      const response = await updateCertification(data).unwrap();
      if (response) {
        dispatch(setOtherCertifications(response["other_certifications"]));
      }
      navigation.goBack();
    } catch {
      setError("Something went wrong. Please try again later.");
      console.log(error);
    }
  };

  const handleDeleteCertification = async () => {
    try {
      const response = await deleteCertification({
        id: certification?.id,
      }).unwrap();
      if (response) {
        dispatch(setOtherCertifications(response["other_certifications"]));
      }
      navigation.goBack();
    } catch {
      setError("Something went wrong. Please try again later.");
      console.log(error);
    }
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
        isLoading={isDeleteCertificationLoading}
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
                      setTitle(titleText);
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
                      setTitle(item);
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
                      setCompany(companyText);
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
                      setCompany(item);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </Animated.View>
          <View>
            <Text style={styles.label}>Certification Link</Text>
            <FormInput
              placeholder="URL"
              value={link}
              onChangeText={setLink}
              topMargin={false}
            />
          </View>
          <View style={{ gap: 16 }}>
            <BlueButton
              title={certification ? "Update" : "Save"}
              onPress={
                certification
                  ? handleUpdateCertification
                  : handleAddCertification
              }
              loading={
                certification
                  ? isUpdateCertificationLoading
                  : isAddCertificationLoading
              }
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
          {error && (
            <View style={{ marginTop: 8 }}>
              <ErrorMessage message={error} />
            </View>
          )}
        </View>
      </Animated.View>
    </PageLayout>
  );
}
