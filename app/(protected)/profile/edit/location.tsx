import { StyleSheet, Text, View } from 'react-native'
import Layout from '@/components/general/PageLayout';
import LocationSelectMenu from '@/components/form/LocationSelectMenu';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import ErrorMessage from '@/components/messsages/Error';
import PopUpMessage from '@/components/profile/PopUpMessage';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  country: zod.string().nullish(),
  state: zod.string().nullish(),
  city: zod.string().nullish(),
})

type FormData = zod.infer<typeof formSchema>

export default function Location() {
  const currentCountry = useUserStore(state => state.country)
  const currentState = useUserStore(state => state.state)
  const currentCity = useUserStore(state => state.city)
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  const { setValue, watch, handleSubmit, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      country: currentCountry,
      state: currentState,
      city: currentCity,
    },
    resolver: zodResolver(formSchema)
  })

  const { country, state, city } = watch();

  const [popUpVisible, setPopUpVisible] = React.useState(false);

  const saveLocation: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/update_location_details/', data).then(() => {
      setUser({ country, state, city })
      setPopUpVisible(true)
    }).catch(error => handleApiError(error, setError))
  }

  return (
    <Layout
      headerTitle='Location'
    >
      <PopUpMessage
        heading='Location Updated'
        text='Your new location has been saved. Enjoy content, events, and recommendations tailored to your area.'
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={() => router.back()}
        isLoading={false}
        singleButton
      />
      <Text style={styles.heading}>Personalize Your Local Experience</Text>
      <Text style={styles.content}>
        Sharing your location allows us to serve you regional content, local events, and community insights tailored to your area. This helps create a more meaningful and connected experience, ensuring you get the most relevant updates while keeping your data private.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, the location information you provide will be visible to everyone on and off Coder Serve unless your profile is set to private.
      </Text>
      <View style={{ marginTop: 32, marginBottom: 48 }}>
        <LocationSelectMenu
          selectedCountry={country || null}
          setSelectedCountry={(country: string) => setValue('country', country)}
          selectedState={state || null}
          setSelectedState={(state: string) => setValue('state', state)}
          selectedCity={city || null}
          setSelectedCity={(city: string) => setValue('city', city)}
        />
      </View>
      <View style={{ marginBottom: 8 }}>
        <BlueButton
          title='Update'
          onPress={handleSubmit(saveLocation)}
          loading={isSubmitting}
          disabled={(currentCountry === country && currentCity === city && currentState === state) || !country || !state || !city}
        />
      </View>
      {
        errors.root?.message && <ErrorMessage message={errors.root.message} />
      }
    </Layout>
  )
}


export const styles = StyleSheet.create({
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
