import { View, StyleSheet } from 'react-native';
import Layout from '@/components/auth/sign_up/profileDetails/Layout';
import SelectMenu from '@/components/form/SelectMenu';
import countryData from '@/constants/targetCountries';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import ErrorMessage from '@/components/messsages/Error';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import secureApi from '@/helpers/auth/axios';
import handleApiError from '@/helpers/apiErrorHandler';
import { useStore } from '@/zustand/auth/stores'
import { useUserStore, useTokensStore } from '@/zustand/stores';


const formSchema = zod.object({
  country: zod.string().nullish(),
  state: zod.string().nullish(),
  city: zod.string().nullish()
})
type FormData = zod.infer<typeof formSchema>


export default function LocationSelectPage() {
  const { handleSubmit, watch, setError, setValue, control, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      country: null,
      state: null,
      city: null
    },
    resolver: zodResolver(formSchema)
  })
  const { access, refresh } = useStore(state => state)
  const { setUser } = useUserStore(state => state)
  const { setTokens } = useTokensStore(state => state)

  // converting the countries list to the format provided by the library	
  const [countries, setCountries] = React.useState<{ name: string, id: number }[] | null>(null);
  React.useEffect(() => {
    GetCountries().then((countries) => {
      setCountries(countries);
    })
  }, [])

  const router = useRouter();


  const { country: selectedCountry, state: selectedState, city: selectedCity } = watch();

  // storing the id of the selecte country
  const [selectedCountryId, setSelectedCountryId] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (selectedCountry) {
      const country = countries?.find((country) => (country.name === selectedCountry));
      if (country) {
        setSelectedCountryId(country.id);
      }
    }
  }, [selectedCountry])

  // storing the states list
  const [states, setStates] = React.useState<{ name: string, id: number }[] | null>(null);
  React.useEffect(() => {
    if (selectedCountryId) {
      setSelectedStateId(null);
      setValue('state', null);
      setValue('city', null);
      GetState(selectedCountryId).then((states) => {
        setStates(states);
      })
    }
  }, [selectedCountryId])

  // storing the id of the selected state
  const [selectedStateId, setSelectedStateId] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (selectedState) {
      const state = states?.find((state) => (state.name === selectedState));
      if (state) {
        setSelectedStateId(state.id);
      }
    }
  }, [selectedState])

  // storing the cities list
  const [cities, setCities] = React.useState<{ name: string, id: number }[] | null>(null);
  React.useEffect(() => {
    if (selectedStateId && selectedCountryId) {
      setValue('city', null);
      GetCity(selectedCountryId, selectedStateId).then((cities) => {
        setCities(cities);
      })
    }
  }, [selectedStateId, selectedCountryId])

  const updateLocation: SubmitHandler<FormData> = async (data) => {
    secureApi.put('/update_location_details/', data).then(async () => {
      const response = await secureApi.get('/auth_token_validator/');
      setUser(
        response.data
      )
      setTokens({ access, refresh });
      router.replace('/')
    }).catch(error => {
      handleApiError(error, setError)
    })
  }


  return (
    <View style={{ flex: 1 }}>
      <Layout
        step='Step 3 of 3'
        title='Location'
        subtitle='Certain features require your current location to deliver a personalized experience.'
      >
        <View style={styles.container}>
          <View style={{ gap: 16 }}>
            <Controller
              control={control}
              name='country'
              render={({ field: { onChange, value } }) => (
                <SelectMenu
                  placeholder='Select Country'
                  options={!countries ? [] : countries.map((country) => (country.name))}
                  onSelect={onChange}
                  selected={value ? value : null}
                  error={errors.country?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='state'
              render={({ field: { onChange, value } }) => (
                <SelectMenu
                  placeholder='Select State'
                  options={!states ? [] : states.map((state) => (state.name))}
                  onSelect={onChange}
                  selected={value ? value : null}
                  error={!selectedCountryId ? 'Please select a country first' : errors.state?.message}
                />
              )}
            />
            <Controller
              control={control}
              name='city'
              render={({ field: { onChange, value } }) => (
                <SelectMenu
                  placeholder='Select District/City'
                  options={!cities ? [] : cities.map((city) => (city.name))}
                  onSelect={onChange}
                  selected={value ? value : null}
                  error={!selectedStateId ? 'Please select a state first' : errors.city?.message}
                />
              )}
            />
            {
              errors.root?.message && typeof errors.root.message === 'string' && <ErrorMessage message={errors.root.message} />
            }
          </View>
          <BlueButton
            title="Complete"
            onPress={handleSubmit(updateLocation)}
            loading={isSubmitting}
            disabled={!selectedCity || !selectedCountry || !selectedState}
          />

        </View>
      </Layout>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    marginTop: 48,
    gap: 48,
  }
})
