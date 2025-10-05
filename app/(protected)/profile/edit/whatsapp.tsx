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
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  whatsappCountryCode: zod.string(),
  whatsappNumber: zod.string(),
})

type FormData = zod.infer<typeof formSchema>


const { width } = Dimensions.get('window')

export default function GitHub() {
  const currentPhoneNumber = useUserStore(state => state.whatsappNumber)
  const currentCountryCode = useUserStore(state => state.whatsappCountryCode)
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  const { watch, handleSubmit, setError, control, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      whatsappCountryCode: currentCountryCode || '',
      whatsappNumber: currentPhoneNumber || '',
    },
    resolver: zodResolver(formSchema),
  })

  const { whatsappNumber, whatsappCountryCode } = watch();
  const [popUpVisible, setPopUpVisible] = React.useState(false);

  const countryCodes = countryData.map((country) => (
    [country.name, country.code]
  ))
  const updatePhone: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/update_whatsapp_number/', data).then(() => {
      setUser({ whatsappCountryCode, whatsappNumber })
      setPopUpVisible(true)
    }).catch(error => handleApiError(error, setError))
  }

  return (
    <>
      <Layout
        headerTitle='WhatsApp'
      >
        <PopUpMessage
          heading='WhatsApp Number Updated'
          text='Your WhatsApp number has been successfully updated and will help keep your account secure and notifications timely.'
          visible={popUpVisible}
          setVisible={setPopUpVisible}
          onPress={() => router.back()}
          isLoading={false}
          singleButton
        />
        <Text style={styles.heading}>Stay Connected</Text>
        <Text style={styles.content}>
          Adding your WhatsApp number ensures you receive timely notifications, enhances account security, and simplifies recovery if needed. Your number is securely handled and used solely to improve your experience.
        </Text>
        <Text style={[styles.content, { marginTop: 24 }]}>
          Kindly note, the WhatsApp number you provide will not appear on your public profile. It will only be used for verification and recruiter communication when you apply for a job.
        </Text>
        <View style={{ marginTop: 32, marginBottom: 48, flexDirection: 'row', gap: 16 }}>
          <View style={{ width: (width - 48) * 3 / 7 }}>
            <Controller
              control={control}
              name={'whatsappCountryCode'}
              render={({ field: { value, onChange } }) => (
                <SelectMenu
                  options={countryCodes}
                  onSelect={onChange}
                  selected={value}
                  placeholder='Country Code'
                />
              )}
            />
          </View>
          <View style={{ width: (width - 48) * 4 / 7 }}>
            <Controller
              control={control}
              name={'whatsappNumber'}
              render={({ field: { value, onChange } }) => (
                <InputField
                  value={value}
                  onChangeText={onChange}
                  placeholder='WhatsApp Number'
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
            disabled={(whatsappNumber === currentPhoneNumber && whatsappCountryCode === currentCountryCode) || whatsappNumber === '' || whatsappCountryCode === ''}
            onPress={handleSubmit(updatePhone)}
            loading={isSubmitting}
          />
          {
            errors.root?.message && <ErrorMessage message={errors.root.message} />
          }
        </View>
      </Layout>
    </>

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
