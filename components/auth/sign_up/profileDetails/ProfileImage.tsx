import Layout from '@/components/auth/sign_up/profileDetails/Layout';
import { Image, Pressable, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BlueButton from '@/components/buttons/BlueButton';
import NoBgButton from '@/components/buttons/NoBgButton';
import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as Haptics from 'expo-haptics';
import ErrorText from '@/components/messsages/Error';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import secureApi from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  profile_image: zod.any().nullish()
})

type FormData = zod.infer<typeof formSchema>

export default function ProfileImageScreen() {
  const { handleSubmit, setValue, watch, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      profile_image: null
    },
    resolver: zodResolver(formSchema)
  })
  const wizard = useWizard();

  const { profile_image } = watch();

  const updateProfileImage: SubmitHandler<FormData> = async (data) => {
    const form: any = new FormData();
    form.append('profile_image', {
      uri: data.profile_image.uri,
      type: 'image/jpeg',
      name: 'profile_image.jpg'
    })
    await secureApi.put("/change_profile_image/", form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(() => {
      wizard.nextStep();
    }).catch(error => {
      handleApiError(error, setError)
    })
  }


  async function openImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1]
    })
    if (!result.canceled) {
      setValue('profile_image', result.assets[0])
    }
  }

  return (
    <Layout
      step='Step 2 of 3'
      title="Profile Image"
      subtitle="Upload a profile image to add a personal touch to your account."
    >
      <View style={styles.container}>
        <View>
          <Pressable onPress={() => {
            openImagePicker();
            Haptics.selectionAsync();
          }} style={{ zIndex: 1 }}>
            {
              ({ pressed }) => (
                <View style={[styles.plusIconView, pressed && { backgroundColor: '#006dff' }]}>
                  <Image
                    source={require('./assets/add.png')}
                    style={styles.plusIcon}
                  />
                </View>
              )
            }
          </Pressable>
          )

          <Image
            source={profile_image ? { uri: profile_image.uri } : require('./assets/user.png')}
            style={[styles.imageView, profile_image && { borderRadius: 80, borderWidth: 2, borderColor: '#f5f5f5' }]}
          />
        </View>
        <View style={{ gap: 16, width: '100%' }}>
          <BlueButton
            title='Next'
            onPress={handleSubmit(updateProfileImage)}
            disabled={!profile_image}
            loading={isSubmitting}
          />
          {errors.profile_image?.message && typeof errors.profile_image.message === 'string' && <ErrorText message={errors.profile_image.message} />}
          {errors.root?.message && <ErrorText message={errors.root.message} />}
          <NoBgButton
            title='Skip'
            onPress={() => wizard.nextStep()}
          />
        </View>
      </View>
    </Layout>
  )
}


const styles = StyleSheet.create({
  imageView: {
    height: 160,
    width: 160,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    gap: 48,
  },
  plusIcon: {
    height: 32,
    width: 32,
    margin: 6,
  },
  plusIconView: {
    backgroundColor: 'black',
    borderRadius: 24,
    marginBottom: -36,
    marginRight: -4,
    zIndex: 1,
    alignSelf: 'flex-end',
  }
})
