import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import React from 'react';
import PopUp from '@/components/messsages/PopUp';
import BlueButton from '@/components/buttons/BlueButton';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import { useUserStore } from '@/zustand/stores';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import errorHandler from '@/helpers/general/errorHandler';

const formSchema = zod.object({
  background_pattern_code: zod.number(),
  background_type: zod.string(),
})

type FormData = zod.infer<typeof formSchema>


const backgroundImages = [
  require('@/assets/images/profile/Background/1.png'),
  require('@/assets/images/profile/Background/2.png'),
  require('@/assets/images/profile/Background/3.png'),
  require('@/assets/images/profile/Background/4.png'),
  require('@/assets/images/profile/Background/5.png'),
  require('@/assets/images/profile/Background/6.png'),
  require('@/assets/images/profile/Background/7.png'),
  require('@/assets/images/profile/Background/8.png'),
];

const mappedImages = {
  1: require('@/assets/images/profile/Background/1.png'),
  2: require('@/assets/images/profile/Background/2.png'),
  3: require('@/assets/images/profile/Background/3.png'),
  4: require('@/assets/images/profile/Background/4.png'),
  5: require('@/assets/images/profile/Background/5.png'),
  6: require('@/assets/images/profile/Background/6.png'),
  7: require('@/assets/images/profile/Background/7.png'),
  8: require('@/assets/images/profile/Background/8.png'),
}

function Button({ onPress = () => { }, selected = false, title }: { onPress?: () => void, selected?: boolean, title: string }) {
  return (
    <Pressable style={{ flex: 1 }} onPress={onPress}>
      {
        ({ pressed }) => (
          <View style={[styles.button, !selected && { backgroundColor: '#f5f5f5' }, pressed && !selected && { backgroundColor: '#d9d9d9' },]}>
            <Text style={[styles.buttonText, !selected && { color: 'black' }]}>{title}</Text>
          </View>
        )
      }

    </Pressable>
  )
}

export default function Background() {
  const { watch, control, handleSubmit, formState: { isSubmitting } } = useForm<FormData>({
    defaultValues: {
      background_pattern_code: 1,
      background_type: 'default',
    },
    resolver: zodResolver(formSchema)
  })

  const { background_pattern_code } = watch()

  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const updateBackground: SubmitHandler<FormData> = async (data) => {
    protectedApi.put('/accounts/update_background_pattern/', data).then(() => {
      setUser(({ background_pattern_code: background_pattern_code, background_type: 'default' }))
      router.back();
    }).catch((error) => {
      errorHandler(error);
      console.log(error)
    })
  }

  return (
    <Layout
      headerTitle='Profile Background'
    >
      <PopUp
        visible={popUpVisible}
        setVisible={setPopUpVisible}
      >
        {// @ts-ignore
          <Image source={[1, 2, 3, 4, 5, 6, 7, 8].includes(background_pattern_code) ? mappedImages[background_pattern_code] : mappedImages[1]} style={[styles.bgImage, { height: 132 }]} />
        }
        <View style={{ marginTop: 16, marginBottom: 48 }}>
          <Text style={styles.popUpText}>Your profile is about to get a fresh new look!</Text>
          <Text style={styles.popUpText}>Ready to set this as your background image?</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flex: 1 / 2 }}>
            <GreyBgButton
              title='Cancel'
              onPress={() => setPopUpVisible(false)}
            />
          </View>
          <View style={{ flex: 1 / 2 }}>
            <BlueButton
              title='Yes, Update'
              onPress={handleSubmit(updateBackground)}
              loading={isSubmitting}
            />
          </View>
        </View>
      </PopUp>
      <View style={styles.buttonsContainer}>
        <Button
          selected
          title='Select'
        />
        <Button
          title='Upload'
          onPress={() => router.push('/profile/edit/uploadBackground')}
        />
      </View>
      <View style={styles.backgroundContainer}>
        <Controller
          control={control}
          name='background_pattern_code'
          render={({ field: { onChange } }) => (
            <>
              {
                backgroundImages.map((image, index) => (
                  <Pressable
                    key={index}
                    onPress={
                      () => {
                        onChange(index + 1 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8);
                        setPopUpVisible(true);
                      }
                    }
                  >
                    {
                      ({ pressed }) => (
                        <Image
                          source={image}
                          style={[styles.bgImage, pressed && { borderWidth: 2, borderColor: 'black' }]}
                        />

                      )
                    }
                  </Pressable>
                ))
              }

            </>
          )}
        />
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  backgroundContainer: {
    gap: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    gap: 4,
    marginBottom: 32,
  },
  button: {
    height: 45,
    flex: 1 / 2,
    backgroundColor: '#202020',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
  },
  bgImage: {
    width: '100%',
    height: 144,
    borderRadius: 8,
  },
  popUpText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#737373',
  }
})
