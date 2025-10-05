import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import React from 'react';
import TextInput from '@/components/form/FormInput';
import { useSetGenderMutation } from '@/helpers/profile/apiSlice';
import ErrorMessage from '@/components/messsages/Error';
import BlueButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/profile/PopUpMessage';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { current } from '@reduxjs/toolkit';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';

export function SelectionButton({ onPress = () => { }, selected = false, title }: { onPress?: () => void, selected?: boolean, title: string }) {
  return (
    <Pressable onPress={onPress}>
      <View style={[buttonStyles.buttonContainer, selected && { backgroundColor: '#202020' }]}>
        <View style={[buttonStyles.selectDot, selected && { borderColor: 'white' }]}></View>
        <Text style={[buttonStyles.buttonText, selected && { color: 'white' }]}>{title}</Text>
      </View>
      )
    </Pressable>
  )
}

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#eeeeee',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 15,
  },
  selectDot: {
    width: 16,
    height: 16,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#eeeeee',
  }
})

const formSchema = zod.object({
  gender: zod.string().nullish()
})

type FormData = zod.infer<typeof formSchema>

export default function Gender() {
  const currentGender = useUserStore((state) => state.gender);
  const setUser = useUserStore((state) => state.setUser);

  const { watch, control, setError, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      gender: !currentGender ? null : currentGender === 'Male' || currentGender === 'Female' ? currentGender : 'Other'
    },
    resolver: zodResolver(formSchema)
  })
  const { gender } = watch();

  const updateGender: SubmitHandler<FormData> = async () => {
    await protectedApi.put("/accounts/update_gender/", { gender: gender === 'Other' ? otherGender : gender }).then(() => {
      setUser({ gender: gender === 'Other' ? otherGender : gender })
      setPopUpVisible(true);
    }).catch(error => {
      handleApiError(error, setError)
    })
  }

  const [otherGender, setOtherGender] = React.useState<string>(gender === 'Other' ? currentGender || '' : '');
  const router = useRouter();
  const [popUpVisible, setPopUpVisible] = React.useState(false)

  function isButtonEnabled() {
    if (!gender) {
      return true
    }
    if (gender === 'Other') {
      return otherGender === '' || otherGender === currentGender;
    }
    else {
      return gender === currentGender;
    }
  }
  return (
    <Layout
      headerTitle='Gender'
    >
      <PopUpMessage
        heading='Gender Updated'
        text="Your gender selection is now save! Your identity shines through every detail. We're excited to support your unique journey."
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        isLoading={false}
        singleButton
        onPress={() => {
          router.back();
        }}
      />

      <Text style={styles.heading}>Customize Your Experience</Text>
      <Text style={styles.content}>
        Sharing your gender helps us tailor content, recommendations, and community connections to your unique needs. Your input not only enhances your personal experience but also contributes to creating a more inclusive platform for everyone.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, the gender information you provide will not appear on your public profile. It will only be included in your resume and seen by recruiters when you apply for a job.
      </Text>
      <KeyboardAvoidingView behavior='padding' style={{ marginTop: 32, gap: 16, flex: 1 }}>
        <Controller
          control={control}
          name={"gender"}
          render={({ field: { value, onChange } }) => (
            <>
              <SelectionButton
                title='Male'
                onPress={() => onChange('Male')}
                selected={value === 'Male'}
              />
              <SelectionButton
                title='Female'
                onPress={() => onChange('Female')}
                selected={value === 'Female'}
              />
              <Pressable onPress={() => onChange('Other')}>
                <View style={[buttonStyles.buttonContainer, value === 'Other' && { backgroundColor: '#202020' }]}>
                  <View style={[buttonStyles.selectDot, { alignSelf: 'flex-start' }, gender === 'Other' && { backgroundColor: 'white' }]}></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[buttonStyles.buttonText, value === 'Other' && { color: 'white' }]}>Other</Text>
                    <TextInput
                      placeholder='Specify here'
                      value={typeof otherGender === 'string' ? otherGender : ''}
                      onChangeText={setOtherGender}
                      light={value === 'Other'}
                    />
                  </View>
                </View>
              </Pressable>
            </>

          )}
        />

        <View style={{ gap: 8, marginTop: 48 }}>
          <BlueButton
            title='Update'
            onPress={handleSubmit(updateGender)}
            loading={isSubmitting}
            disabled={isButtonEnabled()}
          />
          {
            errors.root?.message && <ErrorMessage message={errors.root.message} />
          }
        </View>
      </KeyboardAvoidingView>
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
