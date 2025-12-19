import { StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import InputField from '@/components/form/FormInput';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/profile/PopUpMessage';
import ErrorMessage from '@/components/messsages/Error';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import handleApiError from '@/helpers/apiErrorHandler';
import { useRouter } from 'expo-router';
import protectedApi from '@/helpers/axios';

const formSchema = zod.object({
  gitHub: zod.string().url('Please enter a valid GitHub URL'),
})

type FormData = zod.infer<typeof formSchema>;

export default function GitHub() {
  const currentGithub = useUserStore(state => state.gitHub)
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  const { control, handleSubmit, setError, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gitHub: currentGithub || '',
    },
  });
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const { gitHub } = watch();

  const updateGitHub: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put("/accounts/update_github/", data).then(() => {
      setUser({ gitHub })
      setPopUpVisible(true);
    }).catch(error => handleApiError(error, setError))
  }

  return (
    <Layout
      headerTitle='GitHub'
    >			<PopUpMessage
        heading='GitHub Updated'
        text='Get ready to impress recruiters and unlock new opportunities with you coding prowess.'
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={() => router.back()}
        isLoading={false}
        singleButton
      />

      <Text style={styles.heading}>Enhance Your Hiring Prospects</Text>
      <Text style={styles.content}>
        Adding your GitHub profile showcases your coding projects and contributions, boosting your professional visibility and connecting you with job opportunities. Your profile is securely linked and used solely to improve your hiring prospects.</Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, your GitHub profile will not appear on your public profile. It will only be included in your resume and shared with recruiters when you apply for a job.
      </Text>
      <View style={{ marginTop: 32, marginBottom: 48 }}>
        <Controller
          control={control}
          name="gitHub"
          render={({ field: { onChange, value }, }) => (
            <InputField
              value={value}
              onChangeText={onChange}
              placeholder='GitHub URL'
              error={errors.gitHub?.message}
            />
          )}
        />
      </View>
      <View style={{ gap: 8 }}>
        <BlueButton
          title='Update'
          disabled={gitHub === currentGithub || gitHub === ''}
          onPress={handleSubmit(updateGitHub)}
          loading={isSubmitting}
        />
        {
          errors.root?.message && (
            <ErrorMessage message={errors.root.message} />
          )
        }
      </View>
    </Layout>
  )
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  content: {
    fontSize: 13,
    color: '#737373',
    textAlign: 'justify',
  }
})
