import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import InputField from '@/components/form/FormInput';
import FieldLabel from '@/components/form/FieldLabel';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import ErrorMessage from '@/components/messsages/Error';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import PopUp from '@/components/messsages/PopUp';
import Note from '@/components/form/Note';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/zustand/stores';
import protectedApi from '@/helpers/axios';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import handleApiError from '@/helpers/apiErrorHandler';
import PopUpMessage from '@/components/profile/PopUpMessage';

export function formatDateTime(isoString: string) {
  const date = new Date(isoString);

  // Format the date (e.g., 20 Jan 2025)
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return `${formattedDate}`;
}


const formSchema = zod.object({
  username: zod.string().min(3, { message: 'Username should contain at least 3 characters!' }),
})

type FormData = zod.infer<typeof formSchema>;

export default function Username() {
  const currentUsername = useUserStore(state => state.username);
  const lastUsernameChanged = useUserStore(state => state.last_username_changed);
  const setUser = useUserStore(state => state.setUser);
  const [recentlyChanged, setRecentlyChanged] = React.useState(false);
  const [changeableDate, setChangeableDate] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (lastUsernameChanged) {
      protectedApi.get('/accounts/fetch_server_time/').then(response => {
        const serverTime = response.data.server_time;
        const lastChanged = new Date(lastUsernameChanged).getTime();
        const now = new Date(serverTime).getTime();
        if (now - lastChanged < (30 * 24 * 60 * 60 * 1000)) {
          setRecentlyChanged(true);
        }
        const canChange = new Date(lastUsernameChanged).getTime() + (30 * 24 * 60 * 60 * 1000);
        setChangeableDate(formatDateTime(new Date(canChange).toString()))
      })

    }
  }, [])

  const { setError, handleSubmit, watch, control, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUsername || '',
    },
  });

  const username = watch('username');

  const timeoutRef = React.useRef<any>();

  const [message, setMessage] = React.useState('');
  const [didErrored, setDidErrored] = React.useState(false);
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const router = useRouter();

  const width = Dimensions.get('window').width;

  React.useEffect(() => {
    setDidErrored(true);
    setMessage('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (username.length > 0 && username != currentUsername) {
      timeoutRef.current = setTimeout(() => {
        verifyUsername();
      }, 500);
    }
    else {
      setMessage('');
    }

  }, [username])



  async function verifyUsername() {
    try {
      await protectedApi.put('/accounts/verify_username_taken/', { username: username });
      setDidErrored(false);
      setMessage("Congratulations! The username you've chosen is available and ready for you to claim.");
    }
    catch (error: any) {
      setDidErrored(true);
      const errorMessage = error.response.data.username[0];
      if (errorMessage === 'custom user with this username already exists.') {
        setMessage("Oops, it looks like you're a bit late – that username is already taken.");
      }
      else if (errorMessage) {
        setMessage(errorMessage);
      }
      else {
        setMessage('Something went wrong!')
      }
    }
  }

  const updateUsername: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put("/accounts/set_username/", {
      username: data.username,
      last_username_changed: new Date().toISOString(),
    }).then(() => {
      setUser({ username: data.username, last_username_changed: new Date().toString() })
      router.back();
    }).catch(error => {
      handleApiError(error, setError)
      setConfirmVisible(false);
    })
  }

  return (
    <Layout
      headerTitle='Username'
    >
      <PopUpMessage
        visible={confirmVisible}
        setVisible={setConfirmVisible}
        heading='Confirm Username Change'
        text='Are you sure you want to update your username? Once changed, you won’t be able to modify it again for 30 days.'
        onPress={handleSubmit(updateUsername)}
        isLoading={isSubmitting}
      />
      <FieldLabel label='Your Username' />
      <View style={{ gap: 8 }}>
        <Controller
          control={control}
          name='username'
          render={({ field: { value, onChange } }) => (
            <InputField
              placeholder='Username'
              value={value}
              onChangeText={onChange}
              disabled={recentlyChanged}
              error={errors.username?.message}
            />
          )}
        />
        <ErrorMessage message={message} status={didErrored ? 'error' : "success"} />
      </View>
      <View style={{ marginTop: 48, marginBottom: 32, gap: 8 }}>
        {
          recentlyChanged ?
            <View style={{ gap: 32 }}>
              <View style={styles.disabledButton}>
                <Image source={require('@/assets/images/lock.png')} style={styles.lockIcon} />
              </View>
              <Text style={{ textAlign: 'center', color: '#737373', fontSize: 11 }}>You can update your name after {changeableDate}</Text>
            </View> :
            <BlueButton
              title='Update'
              disabled={username === currentUsername || username === '' || didErrored}
              onPress={() => setConfirmVisible(true)}
            />
        }
        {
          errors.root?.message && <ErrorMessage message={errors.root.message} />
        }
      </View>
      {
        !recentlyChanged && <Note note="If you change your profile name, you won't be able to modify it again for 30 days." />
      }

    </Layout>
  )
}


const styles = StyleSheet.create({
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
  },
  disabledButton: {
    backgroundColor: '#a8b8c8',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  lockIcon: {
    width: 20,
    height: 20,
  }

})
