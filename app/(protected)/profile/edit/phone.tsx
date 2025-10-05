import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import InputField from '@/components/form/FormInput';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/profile/PopUpMessage';
import ErrorMessage from '@/components/messsages/Error';
import SelectMenu from '@/components/form/SelectMenu';
import countryData from '@/constants/targetCountries';
import { useUserStore } from '@/zustand/stores';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  mobileCountryCode: zod.string(),
  mobile: zod.string()
})

type FormData = zod.infer<typeof formSchema>

const { width } = Dimensions.get('window')

export default function GitHub() {
  const currentPhoneNumber = useUserStore(state => state.mobile)
  const currentCountryCode = useUserStore(state => state.mobileCountryCode)
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  const { control, handleSubmit, watch, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      mobile: currentPhoneNumber || '',
      mobileCountryCode: currentCountryCode || '',
    },
    resolver: zodResolver(formSchema)
  })

  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const { mobileCountryCode, mobile } = watch();

  const countryCodes = countryData.map((country) => (
    [country.name, country.code]
  ))

  const updatePhone: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put("/accounts/update_phone_number/", data).then(() => {
      setUser({ mobile, mobileCountryCode })
      setPopUpVisible(true)
    }).catch(error => handleApiError(error, setError))
  }

  return (
    <Layout
      headerTitle='Phone'
    >			<PopUpMessage
        heading='Phone Number Updated'
        text='Your phone number has been successfully updated and will help keep your account secure and notifications timely.'
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={() => router.back()}
        isLoading={false}
        singleButton
      />

      <Text style={styles.heading}>Stay Connected</Text>
      <Text style={styles.content}>
        Adding your phone number ensures you receive timely notifications, enhances account security, and simplifies recovery if needed. Your number is securely handled and used solely to improve your experience.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, the phone number you provide will not appear on your public profile. It will only be used for verification and recruiter communication when you apply for a job.
      </Text>
      <View style={{ marginTop: 32, marginBottom: 48, flexDirection: 'row', gap: 16 }}>
        <View style={{ width: (width - 48) * 3 / 7 }}>
          <Controller
            control={control}
            name={'mobileCountryCode'}
            render={({ field: { value, onChange } }) => (
              <SelectMenu
                options={countryCodes}
                onSelect={onChange}
                selected={value || ''}
                placeholder='Country Code'
              />

            )}
          />
        </View>
        <View style={{ width: (width - 48) * 4 / 7 }}>
          <Controller
            control={control}
            name={'mobile'}
            render={({ field: { value, onChange } }) => (
              <InputField
                value={value}
                onChangeText={onChange}
                placeholder='Mobile number'
                topMargin={false}
                autocomplete='tel'
                keyboardType='number-pad'
              />
            )}
          />

        </View>
      </View>
      <View style={{ gap: 8 }}>
        <BlueButton
          title='Update'
          disabled={(mobile === currentPhoneNumber && mobileCountryCode === currentCountryCode) || mobile === '' || !mobileCountryCode}
          onPress={handleSubmit(updatePhone)}
          loading={isSubmitting}
        />
        {
          errors.root?.message && <ErrorMessage message={errors.root.message} />
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
