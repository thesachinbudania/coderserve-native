import { Text, View } from "react-native";
import PageLayout from "@/components/general/PageLayout";
import { styles } from "./education";
import FormInput from "@/components/form/FormInput";
import React from "react";
import BlueButton from "@/components/buttons/BlueButton";
import ErrorMessage from "@/components/messsages/Error";
import { useJobsState } from "@/zustand/jobsStore";
import * as zod from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import protectedApi from "@/helpers/axios";
import handleApiError from "@/helpers/apiErrorHandler";
import { useRouter } from "expo-router";

const formSchema = zod.object({
  skill1: zod.string().min(1, "Skill 1 is required"),
  skill2: zod.string().min(1, "Skill 2 is required"),
  skill3: zod.string().min(1, "Skill 3 is required"),
});

type FormData = zod.infer<typeof formSchema>;


// migrating this entire page to zustand and axios and expo router and react hook from from rtk query

export default function() {
  const { skills, setJobsState } = useJobsState((state) => state);
  let areSkills = false;
  if (skills && skills.length > 0) {
    areSkills = true;
  }

  const router = useRouter();

  const { control, watch, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill1: areSkills && skills ? skills[0] : "",
      skill2: areSkills && skills ? skills[1] : "",
      skill3: areSkills && skills ? skills[2] : "",
    },
  });

  const { skill1, skill2, skill3 } = watch();

  const handleUpdateSkills: SubmitHandler<FormData> = async (data) => {
    const formData = [data.skill1, data.skill2, data.skill3];
    await protectedApi.put('/jobs/resume/update_skills/', { skills: formData }).then(() => {
      setJobsState({ skills: formData });
      router.back();
    }).catch(error => handleApiError(error, setError));
  }

  return (
    <PageLayout headerTitle="Skills">
      <View>
        <Text style={styles.label}>Showcase Your Skills</Text>
        <View style={{ gap: 16, marginBottom: 48 }}>
          <Controller
            control={control}
            name="skill1"
            render={({ field: { onChange, value } }) => (
              <FormInput
                placeholder="ex: Problem Solving"
                value={value}
                onChangeText={onChange}
                topMargin={false}
                error={errors.skill1?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="skill2"
            render={({ field: { onChange, value } }) => (
              <FormInput
                placeholder="ex: Team Collaboration"
                value={value}
                onChangeText={onChange}
                topMargin={false}
                error={errors.skill2?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="skill3"
            render={({ field: { onChange, value } }) => (
              <FormInput
                placeholder="ex: Time Management"
                value={value}
                onChangeText={onChange}
                topMargin={false}
                error={errors.skill3?.message}
              />
            )}
          />
        </View>
        <BlueButton
          title="Save"
          loading={isSubmitting}
          onPress={handleSubmit(handleUpdateSkills)}
          disabled={
            areSkills && skills
              ? (skill1 === skills[0] &&
                skill2 === skills[1] &&
                skill3 === skills[2]) ||
              skill1 === "" ||
              skill2 === "" ||
              skill3 === ""
              : skill1 === "" || skill2 === "" || skill3 === ""
          }
        />
        {errors.root?.message && (
          <View style={{ marginTop: 8 }}>
            <ErrorMessage message={errors.root?.message} />
          </View>
        )}
      </View>
    </PageLayout>
  );
}
