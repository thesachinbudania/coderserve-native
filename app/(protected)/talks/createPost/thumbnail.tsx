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
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import FullWidthImage from '@/components/FullWidthImage';

const formSchema = zod.object({
  background_image: zod.any().nullish(),
  background_type: zod.string()
})

type FormData = zod.infer<typeof formSchema>

export default function UploadBackground() {
  const { thumbnail: currentThumbnail, setNewPost } = useNewPostStore();
  const { watch, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      background_image: currentThumbnail,
    },
    resolver: zodResolver(formSchema)
  })

  const { background_image: image } = watch();

  const [uploadPopUp, setUploadPopUp] = React.useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const router = useRouter();

  const updateBackground = async () => {
    if (image) {
      setNewPost({ thumbnail: image })
      router.back();
    }
  }

  const deleteBackground: SubmitHandler<FormData> = async () => {
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
        <View style={styles.imageContainer}>
          <Image source={require('@/assets/images/profile/uploadIcon.png')} style={styles.uploadIcon} />
        </View>
        :
        <Image style={{width: '100%', height: 144, borderRadius: 12}} source={{uri: image.uri || image}} />
      }
      <View style={{ gap: 16, marginTop: 48 }}>
        {(currentThumbnail && (image && image.uri != currentThumbnail.uri)) || (!currentThumbnail && image) ?
          <>
            <BlueButton
              title="Save"
              onPress={updateBackground}
              loading={isSubmitting}
            />
            <NoBgButton
              title='Cancel'
              onPress={() => { setValue('background_image', null) }}
            />
          </> :
          <>
            <BlueButton
              title={!image ? 'Upload' : 'Update'}
              onPress={openImagePicker}
            />
            <NoBgButton
              title='Cancel'
              onPress={() => { router.back() }}
            />
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
