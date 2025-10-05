import Layout from '@/components/general/PageLayout';
import FieldLabel from '@/components/form/FieldLabel';
import { View } from 'react-native';
import FormInput from '@/components/form/FormInput';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import Note from '@/components/form/Note';
import ErrorMessage from '@/components/messsages/Error';
import PopUpMessage from '@/components/profile/PopUpMessage';
import LockedButton from '@/components/profile/LockedButton';
import { formatDate } from '@/helpers/helpers';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';
import { useRouter } from 'expo-router';

const formSchema = zod.object({
  first_name: zod.string(),
  last_name: zod.string(),
  last_name_changed: zod.string(),
})

type FormData = zod.infer<typeof formSchema>

export default function Page() {
  const { first_name: currentFirstName, last_name: currentLastName, last_name_changed: lastNameChanged } = useUserStore(state => state);
  const setUser = useUserStore(state => state.setUser);
  const { watch, setError, control, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      first_name: currentFirstName || '',
      last_name: currentLastName || '',
      last_name_changed: new Date().toString(),
    },
    resolver: zodResolver(formSchema)
  })
  const router = useRouter();
  const { first_name, last_name } = watch();
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const [recentlyChanged, setRecentlyChanged] = React.useState(false);
  const [changeableDate, setChangeableDate] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (lastNameChanged) {
      protectedApi.get('/accounts/fetch_server_time/').then(response => {
        const serverTime = response.data.server_time;
        const lastChanged = new Date(lastNameChanged).getTime();
        const now = new Date(serverTime).getTime();
        if (now - lastChanged < (60 * 24 * 60 * 60 * 1000)) {
          setRecentlyChanged(true);
        }
        const canChange = new Date(lastNameChanged).getTime() + (60 * 24 * 60 * 60 * 1000);
        setChangeableDate(formatDate(new Date(canChange).toString()))
      })
    }
  }, [])

  const saveFullName: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/update_name/', data).then(() => {
      setUser(data)
      router.dismiss(2);
    }).catch(error => {
      handleApiError(error, setError)
    })
  }

  return (
    <Layout
      headerTitle='Name'
    >
      <PopUpMessage
        heading='Confirm Profile Name Change'
        text="Are you sure you want to update your profile name? Once changed, you won't be able to modify it again for 60 days."
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={handleSubmit(saveFullName)}
        isLoading={isSubmitting}
      />
      <View style={{ gap: 48 }}>
        <View>
          <FieldLabel label='First Name'></FieldLabel>
          <Controller
            control={control}
            name='first_name'
            render={({ field: { value, onChange } }) => (
              <FormInput
                placeholder='Natasha'
                value={value}
                onChangeText={onChange}
                disabled={recentlyChanged}
              />
            )}
          />
        </View>
        <View>
          <FieldLabel label='Last Name'></FieldLabel>
          <Controller
            control={control}
            name='last_name'
            render={({ field: { value, onChange } }) => (
              <FormInput
                placeholder='Jackson'
                value={value}
                onChangeText={onChange}
                disabled={recentlyChanged}
              />
            )}
          />
        </View>
        <View style={{ gap: 32 }}>
          <View style={{ gap: 8 }}>
            {
              recentlyChanged ?
                <LockedButton
                  unlockDate={changeableDate || ''}
                /> :
                <BlueButton
                  title='Update'
                  disabled={(first_name === currentFirstName && last_name === currentLastName) || !first_name || !last_name}
                  onPress={() => setPopUpVisible(true)}
                />

            }
            {
              errors.root?.message && <ErrorMessage message={errors.root.message} />
            }
          </View>
          {
            !recentlyChanged && <Note note="If you change your profile name, you won't be able to modify it again for 60 days." />
          }

        </View>
      </View>
    </Layout>
  )
}
