import Layout from "@/components/general/PageLayout";
import TextAreaInput from "@/components/form/TextAreaInput";
import {
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
} from "react-native";
import BlueButton from "@/components/buttons/BlueButton";
import React from "react";
import ErrorMessage from "@/components/messsages/Error";
import { useJobsState } from "@/zustand/jobsStore";
import { useRouter } from "expo-router";
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import protectedApi from "@/helpers/axios";
import handleApiError from "@/helpers/apiErrorHandler";

const formSchema = zod.object({
  about: zod.string().min(1, "About section is required"),
})

type FormData = zod.infer<typeof formSchema>

export default function About() {
  const { about: currentAbout, setJobsState } = useJobsState(state => state);
  const router = useRouter();

  const { control, watch, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      about: currentAbout || ''
    },
    resolver: zodResolver(formSchema),
  })

  const { about: text } = watch();

  const updateAbout: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put("/jobs/resume/update/", data).then(() => {
      setJobsState({ about: data.about })
      router.back();
    }).catch(error => handleApiError(error, setError))
  }

  return (
    <Layout headerTitle="About">
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>
          <Text style={styles.label}>Tell Us About You</Text>
          <Controller
            control={control}
            name="about"
            render={({ field: { onChange, value } }) => (
              <TextAreaInput
                placeholder="Write here"
                text={value}
                setText={onChange}
                error={errors.about?.message}
              />
            )}
          />
          <View style={{ marginTop: 48, marginBottom: 8 }}>
            <BlueButton
              title="Save"
              onPress={handleSubmit(updateAbout)}
              loading={isSubmitting}
              disabled={text === currentAbout || text === ""}
            />
          </View>
          {
            errors.root?.message && <ErrorMessage message={errors.root.message} />
          }
        </>
      </TouchableWithoutFeedback>
    </Layout>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginBottom: 8,
    color: "#a6a6a6",
  },
});
