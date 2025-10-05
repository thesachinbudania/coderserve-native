import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PageLayout from "@/components/general/PageLayout";
import { styles } from "./education";
import SelectMenu from "@/components/form/SelectMenu";
import React from "react";
import { spokenLanguages } from "@/constants/languages";
import BlueButton from "@/components/buttons/BlueButton";
import ErrorMessage from "@/components/messsages/Error";
import NoBgButton from "@/components/buttons/NoBgButton";
import PopUpMessage from "@/components/general/PopUpMessage";
import { useJobsState, useResumeEdit } from "@/zustand/jobsStore";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import handleApiError from "@/helpers/apiErrorHandler";
import protectedApi from "@/helpers/axios";
import { useRouter } from "expo-router";

const fromSchema = zod.object({
  id: zod.number(),
  language: zod.string().min(1, "Language is required"),
  rating: zod.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
});

type FormData = zod.infer<typeof fromSchema>;

const ratingWords = [
  "Beginner",
  "Basic",
  "Intermediate",
  "Proficient",
  "Fluent",
];

export default function Languages() {
  let currentLanguage = null;
  const { languages, setJobsState } = useJobsState(state => state);
  const { edit, id } = useResumeEdit(state => state);
  if (edit && id) {
    currentLanguage = languages?.find((language) => language.id === id);
  }
  const router = useRouter();

  const { control, setError, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      id: currentLanguage ? currentLanguage.id : Date.now(),
      language: currentLanguage ? currentLanguage.language : "",
      rating: currentLanguage ? currentLanguage.rating : 0,
    },
  });

  const { language, rating } = watch();

  const [showPopUp, setShowPopUp] = React.useState(false);

  const handleAddLanguage: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/add_language/', { new_language: data }).then((response) => {
      if (response.data) {
        setJobsState(response.data);
        router.back();
      }
    }).catch(error => handleApiError(error, setError));
  }

  const handleUpdateLanguage: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/update_language/', data).then((response) => {
      if (response.data) {
        setJobsState(response.data);
        router.back();
      }
    }).catch(error => handleApiError(error, setError));
  };

  const handleDeleteLanguage = async () => {
    if (!currentLanguage) return;
    await protectedApi.put('/jobs/resume/delete_language/', { id: currentLanguage.id }).then((response) => {
      if (response.data) {
        setJobsState(response.data);
        router.back();
      }
    }).catch(error => handleApiError(error, setError));
  };

  return (
    <PageLayout headerTitle="Languages">
      <PopUpMessage
        heading="Delete this language?"
        text="This action will permanently remove this language from your resume. You won’t be able to undo this."
        visible={showPopUp}
        setVisible={setShowPopUp}
        onPress={handleSubmit(handleDeleteLanguage)}
        isLoading={isSubmitting}
      />
      <Text style={styles.label}>Highlight Your Linguistic Strengths</Text>
      <Controller
        control={control}
        name="language"
        render={({ field: { onChange, value } }) => (
          <SelectMenu
            title="Select Language"
            placeholder="Select Language"
            selected={value}
            onSelect={onChange}
            options={spokenLanguages}
          />
        )}
      />
      <View style={languageStyles.ratingContainer}>
        {rating > 0 && (
          <Text style={languageStyles.ratingWord}>
            {ratingWords[rating - 1]}
          </Text>
        )}
        <Controller
          control={control}
          name="rating"
          render={({ field: { onChange, value } }) => (
            <Rating
              stars={value}
              setStars={onChange}
            />
          )}
        />
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
        onPress={currentLanguage ? handleSubmit(handleUpdateLanguage) : handleSubmit(handleAddLanguage)}
        loading={isSubmitting}
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
      {errors.root?.message && (
        <View style={{ marginTop: 8 }}>
          <ErrorMessage message={errors.root?.message} />
        </View>
      )}
    </PageLayout>
  );
}

export function Rating({
  size = 48,
  stars,
  editable = true,
  setStars = () => { },
}: {
  size?: number;
  stars: number;
  editable?: boolean;
  setStars?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const maxRating = 5;
  const selectedStar = require("@/assets/images/jobs/star.png");
  const unselectedStar = require("@/assets/images/jobs/startUnselected.png");
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
