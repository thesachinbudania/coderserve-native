import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import ImageLoader from '@/components/ImageLoader';
import BlueButton from '@/components/buttons/BlueButton';
import NoBgButton from '@/components/buttons/NoBgButton';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import PopUp from '@/components/messsages/PopUp';
import ErrorMessage from '@/components/messsages/Error';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';
import { useRouter } from 'expo-router';

const formSchema = zod.object({
  profile_image: zod.any().nullish()
})

type FormData = zod.infer<typeof formSchema>

export default function ProfileImage() {
  const profileImage = useUserStore(state => state.profile_image);
  const setUser = useUserStore(state => state.setUser);
  const { handleSubmit, setValue, watch, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      profile_image: null
    },
    resolver: zodResolver(formSchema)
  })
  const { profile_image: image } = watch();
  const width = Dimensions.get('window').width;
  const router = useRouter();

  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);

  const updateProfileImage: SubmitHandler<FormData> = async (data) => {
    const form: any = new FormData();
    form.append('profile_image', {
      uri: data.profile_image.uri,
      type: 'image/jpeg',
      name: 'profile_image.jpg'
    })
    await protectedApi.put("/accounts/change_profile_image/", form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      const newImageUrl = response.data.profile_image;
      setUser({ profile_image: newImageUrl })
      setValue('profile_image', null);
      setPopUpVisible(true)
    }).catch(error => {
      handleApiError(error, setError)
    })
  }


  const deleteProfileImage: SubmitHandler<FormData> = async () => {
    protectedApi.put("/accounts/delete_profile_image/").then((response) => {
      const newImageUrl = response.data.profile_image;
      setUser({ profile_image: newImageUrl });
      setValue('profile_image', null);
      router.back();
    }).catch((error) => {
      handleApiError(error, setError)
    }
    )
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

  /*	async function saveImage() {
      if (image) {
        try {
          const response = await setProfileImageMutation(image).unwrap();
          const newImageUrl = response.profile_image;
          setUser({ profile_image: newImageUrl })
          setImage(null);
          setPopUpVisible(true);
        }
        catch (e) {
          console.log(e);
          setErrored(true);
        }
      }
    }
    async function deleteImage() {
      try {
        const response = await deleteProfileImageMutation({}).unwrap();
        const newImageUrl = response.profile_image;
        setUser({ profile_image: newImageUrl })
        setImage(null);
        navigation.goBack();
      }
      catch (e) {
        console.log(e);
        setErrored(true);
      }
    }
  */
  return (
    <Layout
      headerTitle='Profile Image'
    >
      <PopUp
        visible={deleteConfirmVisible}
        setVisible={setDeleteConfirmVisible}
      >
        <Text style={styles.popUpHeading}>Confirm Profile Image Deletion</Text>
        <Text style={styles.popUpText}>Are you sure you want to delete your profile image? Your profile image is an important part of your identity on our platform. It helps others recognize you and builds trust in the community.</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ width: ((width - 80) / 2) }}>
            <BlueButton
              title='Yes, Delete'
              dangerButton
              onPress={handleSubmit(deleteProfileImage)}
            />
          </View>
          <View style={{ width: ((width - 80) / 2) }}>
            <GreyBgButton
              title='Cancel'
              onPress={() => setDeleteConfirmVisible(false)}
            />
          </View>
        </View>
      </PopUp>
      <PopUp
        visible={popUpVisible}
        setVisible={setPopUpVisible}
      >
        <Text style={styles.popUpHeading}>Profile Picture Updated</Text>
        <Text style={styles.popUpText}>Your new profile image has been successfully saved and is now live. Thanks for keeping your profile fresh and vibrant.</Text>
        <BlueButton
          title='Okay'
          onPress={() => router.back()}
        />
      </PopUp>
      <View style={styles.imageContainer}>
        {
          !image ?
            <ImageLoader
              uri={image ? image : profileImage}
              size={148}
            />
            :
            <Image
              source={image}
              style={{ width: 148, height: 148, borderRadius: 74, borderWidth: 2, borderColor: '#f5f5f5' }}
            />


        }
      </View>
      <View style={styles.buttonContainer}>
        {!image ? (
          <><BlueButton
            title='Update'
            onPress={() => openImagePicker()}
          />
            {
              profileImage?.endsWith('default_profile_image.png') ? (
                <NoBgButton
                  title='Cancel'
                  onPress={() => router.back()}
                />
              )
                :
                <NoBgButton
                  title='Delete'
                  dangerButton
                  loading={isSubmitting}
                  onPress={() => setDeleteConfirmVisible(true)}
                />
            }
          </>) : (<>
            <BlueButton
              title='Save'
              loading={isSubmitting}
              onPress={handleSubmit(updateProfileImage)}
            />
            <NoBgButton
              title='Cancel'
              dangerButton
              onPress={() => setValue('profile_image', null)}
            />
          </>)
        }
      </View>
      {
        errors.root?.message && <ErrorMessage
          message={errors.root.message}
        />
      }

    </Layout>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 24,
    marginBottom: 48,
    alignItems: 'center'
  },
  buttonContainer: {
    gap: 16,
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
    marginBottom: 32,
    color: '#737373',
  }
})
