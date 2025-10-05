import { StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import InputField from '@/components/form/FormInput';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/profile/PopUpMessage';
import ErrorMessage from '@/components/messsages/Error';
import { useUserStore } from '@/zustand/stores';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import handleApiError from '@/helpers/apiErrorHandler';
import protectedApi from '@/helpers/axios';

const formSchema = zod.object({
  website: zod.string().url('Please enter a valid website URL'),
})

type FormData = zod.infer<typeof formSchema>;

export default function GitHub() {
  const currentWebsite = useUserStore(state => state.website)
  const setUser = useUserStore(state => state.setUser);
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const router = useRouter();

  const { control, handleSubmit, setError, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      website: currentWebsite || '',
    },
  });

  const { website } = watch();

  const updateWebsite: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put("/accounts/update_website/", data).then(() => {
      setUser({ website: data.website })
      setPopUpVisible(true);
    }).catch(error => {
      console.log(error)
      handleApiError(error, setError)
    })
  }

  return (
    <Layout
      headerTitle='Website'
    >			<PopUpMessage
        heading='Website Updated'
        text='Your website has been successfully added to your profile. Visitors can now explore more about you through your shared link.'
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={() => router.back()}
        isLoading={false}
        singleButton
      />

      <Text style={styles.heading}>Boost Your Professional Persence</Text>
      <Text style={styles.content}>
        Adding your website highlights your portfolio, projects, or personal brand, increasing your professional visibility and job opportunities. Your website is securely linked and used solely to enhance your hiring prospects.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, your website will not appear on your public profile - it will only be included in your resume and shared with recruiters when you apply for a job.
      </Text>
      <View style={{ marginTop: 32, marginBottom: 48 }}>
        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, value } }) => (
            <InputField
              value={value}
              onChangeText={onChange}
              placeholder='Website URL'
              error={errors.website?.message}
            />
          )}
        />
      </View>
      <View style={{ gap: 8 }}>
        <BlueButton
          title='Update'
          disabled={website === currentWebsite || website === ''}
          onPress={handleSubmit(updateWebsite)}
          loading={isSubmitting}
        />
        {errors.root?.message &&
          <ErrorMessage message={errors.root.message} />
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
