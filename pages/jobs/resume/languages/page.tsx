import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PageLayout from "../../../profile/controlCentre/accountCenter/PageLayout";
import { styles } from "../education/page";
import SelectMenu from "../../../../components/form/SelectMenu";
import React from "react";
import { spokenLanguages } from "./languages";
import BlueButton from "../../../../components/buttons/BlueButton";
import {
  useDeleteLanguagesMutation,
  useUpdateLanguagesMutation,
  useAddLanguagesMutation,
} from "../../apiSlice";
import ErrorMessage from "../../../../components/messsages/Error";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../app/store";
import { setLanguages } from "../../../../app/jobsSlice";
import { useNavigation } from "@react-navigation/native";
import NoBgButton from "../../../../components/buttons/NoBgButton";
import PopUpMessage from "../workExperience/PopUpMessage";
import { useRemoveFooter } from "../../../../helpers/hideFooter";

const ratingWords = [
  "Beginner",
  "Basic",
  "Intermediate",
  "Proficient",
  "Fluent",
];

export default function Languages({ route }: { route: any }) {
  useRemoveFooter(route.params.addFooterOnUnmount);
  let currentLanguage = null;
  const languages = useSelector((state: RootState) => state.jobs.languages);
  if (route.params && route.params.id) {
    const languageId = route.params.id;
    currentLanguage = languages?.find((language) => language.id === languageId);
  }

  // states for holding the form data
  const [language, setLanguage] = React.useState<string | null>(
    currentLanguage ? currentLanguage.language : null,
  );
  const [rating, setRating] = React.useState<number>(
    currentLanguage ? currentLanguage.rating : 0,
  );

  const [error, setError] = React.useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [showPopUp, setShowPopUp] = React.useState(false);

  // hooks for the API calls
  const [addLanguage, { isLoading: isAddLanguageLoading }] =
    useAddLanguagesMutation();
  const [updateLanguage, { isLoading: isUpdateLanguageLoading }] =
    useUpdateLanguagesMutation();
  const [deleteLanguage, { isLoading: isDeleteLanguageLoading }] =
    useDeleteLanguagesMutation();

  // function to handle the form submission
  async function handleAddLanguage() {
    const data = {
      id: Date.now(),
      language,
      rating,
    };
    try {
      const response = await addLanguage({ new_language: data }).unwrap();
      if (response) {
        dispatch(setLanguages(response["languages"]));
      }
      navigation.goBack();
    } catch (e) {
      setError("Something went wrong. Please try again later.");
      console.log(e);
    }
  }

  // function to handle update
  const handleUpdateLanguage = async () => {
    const data = {
      id: currentLanguage?.id || Date.now(),
      language,
      rating,
    };
    try {
      const response = await updateLanguage(data).unwrap();
      if (response) {
        dispatch(setLanguages(response["languages"]));
      }
      navigation.goBack();
    } catch (e) {
      setError("Something went wrong. Please try again later.");
      console.log(e);
    }
  };

  // function to handle delete
  const handleDeleteLanguage = async () => {
    try {
      const response = await deleteLanguage({
        id: currentLanguage?.id,
      }).unwrap();
      if (response) {
        dispatch(setLanguages(response["languages"]));
      }
      navigation.goBack();
    } catch (e) {
      setError("Something went wrong. Please try again later.");
      console.log(e);
    }
  };

  return (
    <PageLayout headerTitle="Languages">
      <PopUpMessage
        heading="Delete this language?"
        text="This action will permanently remove this language from your resume. You won’t be able to undo this."
        visible={showPopUp}
        setVisible={setShowPopUp}
        onPress={handleDeleteLanguage}
        isLoading={isDeleteLanguageLoading}
      />
      <Text style={styles.label}>Highlight Your Linguistic Strengths</Text>
      <SelectMenu
        title="Selecte Language"
        placeholder="Select Language"
        selected={language}
        onSelect={setLanguage}
        options={spokenLanguages}
      />
      <View style={languageStyles.ratingContainer}>
        {rating > 0 && (
          <Text style={languageStyles.ratingWord}>
            {ratingWords[rating - 1]}
          </Text>
        )}
        <Rating stars={rating} setStars={setRating} />
      </View>
      <BlueButton
        title={currentLanguage ? "Update" : "Save"}
        disabled={
          currentLanguage
            ? (currentLanguage.language === language &&
                currentLanguage.rating === rating) ||
              language === null ||
              rating === 0
            : language === null || rating === 0
        }
        onPress={currentLanguage ? handleUpdateLanguage : handleAddLanguage}
        loading={
          currentLanguage ? isUpdateLanguageLoading : isAddLanguageLoading
        }
      />
      {currentLanguage && (
        <View style={{ marginTop: 16 }}>
          <NoBgButton
            title="Delete"
            onPress={() => setShowPopUp(true)}
            dangerButton
          />
        </View>
      )}
      {error && (
        <View style={{ marginTop: 8 }}>
          <ErrorMessage message={error} />
        </View>
      )}
    </PageLayout>
  );
}

export function Rating({
  size = 48,
  stars,
  editable = true,
  setStars = () => {},
}: {
  size?: number;
  stars: number;
  editable?: boolean;
  setStars?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const maxRating = 5;
  const selectedStar = require("../assets/star.png");
  const unselectedStar = require("../assets/startUnselected.png");
  return (
    <View style={languageStyles.starsRow}>
      {Array.from({ length: maxRating }, (_, index) => (
        <Pressable
          onPress={() => (editable ? setStars(index + 1) : {})}
          key={index}
        >
          <View key={index} style={languageStyles.starContainer}>
            <Image
              source={index < stars ? selectedStar : unselectedStar}
              style={{ height: size, width: size }}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const languageStyles = StyleSheet.create({
  ratingContainer: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#f5f5f5",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 48,
    height: 143,
    justifyContent: "flex-end",
  },
  starsRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  starContainer: {},
  star: {
    width: 48,
    height: 48,
  },
  ratingWord: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 48,
    textAlign: "center",
  },
});
