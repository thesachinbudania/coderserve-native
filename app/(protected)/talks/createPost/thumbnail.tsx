import { Image, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import BlueButton from '@/components/buttons/BlueButton';
import NoBgButton from '@/components/buttons/NoBgButton';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import PopUpMessage from '@/components/profile/PopUpMessage';
import ErrorMessage from '@/components/messsages/Error';
import PopUp from '@/components/messsages/PopUp';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BackgroundImageLoader from '@/components/BackgroundImageLoader';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';
import { useNewPostStore } from '@/zustand/talks/newPostStore';

const formSchema = zod.object({
  background_image: zod.any().nullish(),
  background_type: zod.string()
})

type FormData = zod.infer<typeof formSchema>

export default function UploadBackground() {
  const { watch, handleSubmit, setValue, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      background_type: 'custom',
      background_image: null,
    },
    resolver: zodResolver(formSchema)
  })

  const { background_image: image } = watch();
  const { setNewPost } = useNewPostStore();

  const [uploadPopUp, setUploadPopUp] = React.useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const router = useRouter();

  const backgroundImage = useUserStore(state => state.background_image);
  const backgroundType = useUserStore(state => state.background_type);
  const setUser = useUserStore(state => state.setUser);

  const updateBackground: SubmitHandler<FormData> = async (data) => {
    if (data.background_image) {
      setNewPost({ thumbnail: data.background_image })
      router.back();
    }
  }

  const deleteBackground: SubmitHandler<FormData> = async () => {
    await protectedApi.put('/accounts/delete_background_image/').then(() => {
      setUser({ background_image: '', background_type: 'default' })
      setValue('background_image', null)
      router.dismiss(2);
    }).catch((error) => {
      handleApiError(error, setError)
    })
  }

  async function openImagePicker() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      aspect: [3, 1]
    })
    if (!result.canceled) {
      setValue('background_image', result.assets[0])
    }
  }

  return (
    <Layout
      headerTitle='Thumbnail'
    >
      <PopUpMessage
        visible={uploadPopUp}
        setVisible={setUploadPopUp}
        heading='Upload Successful'
        text='Your custom background image has been uplaoded and applied. Your profile now sports a fresh, new look!'
        singleButton
        onPress={() => {
          router.back();
          router.back();
        }}
        isLoading={false}
      />
      <PopUp
        visible={deleteConfirmVisible}
        setVisible={setDeleteConfirmVisible}
      >
        <Text style={styles.popUpHeading}>Delete Custom Background!</Text>
        <Text style={styles.popUpText}>Removing your custom background will revert your profile to the default profile background image. Do you want to proceed?</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton
              title='Yes, Delete'
              dangerButton
              onPress={handleSubmit(deleteBackground)}
              loading={isSubmitting}
            />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <GreyBgButton
              title='Cancel'
              onPress={() => setDeleteConfirmVisible(false)}
            />
          </View>
        </View>
      </PopUp>
      {!image ?
        (
          backgroundType === 'custom' && backgroundImage ?
            <View style={{ overflow: 'hidden', borderRadius: 8 }}>
              <BackgroundImageLoader size={144} uri={backgroundImage} />
            </View>
            : (
              <View style={styles.imageContainer}>
                <Image source={require('@/assets/images/profile/uploadIcon.png')} style={styles.uploadIcon} />
              </View>
            )
        )
        :
        <Image source={{ uri: image.uri }} style={{ borderRadius: 8, width: '100%', height: 144 }} />
      }
      <View style={{ gap: 16, marginTop: 48 }}>
        {image ?
          <>
            <BlueButton
              title="Save"
              onPress={handleSubmit(updateBackground)}
              loading={isSubmitting}
            />
            <NoBgButton
              title='Cancel'
              onPress={() => { setValue('background_image', null) }}
            />
          </> :
          <>
            <BlueButton
              title={backgroundType === 'default' ? 'Upload' : 'Update'}
              onPress={openImagePicker}
            />
            {
              backgroundType === 'default' ? (
                <NoBgButton
                  title='Cancel'
                  onPress={() => { router.back() }}
                />
              ) : (
                <NoBgButton
                  title='Delete'
                  dangerButton
                  onPress={() => setDeleteConfirmVisible(true)}
                />
              )
            }
          </>
        }
        {
          errors.root?.message && <ErrorMessage message={errors.root.message} />
        }
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    height: 144
  },
  uploadIcon: {
    height: 48,
    width: 48,
  },
  popUpHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  popUpText: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    color: '#737373',
  }
})
