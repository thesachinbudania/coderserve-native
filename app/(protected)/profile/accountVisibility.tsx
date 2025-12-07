import { ActivityIndicator, Text, StyleSheet, View } from 'react-native';
import PageLayout from '@/components/general/PageLayout';
import ToggleSwitch from '@/components/buttons/ToggleSwitch';
import * as React from 'react';
import BottomDrawer from '@/components/BottomDrawer';
import GreyBgButton from '@/components/buttons/GreyBgButton';
import BlueButton from '@/components/buttons/BlueButton';
import * as zod from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import protectedApi from '@/helpers/axios';

const formSchema = zod.object({
  permission_status: zod.number().int().min(0).max(4).nullish()
});

type FormData = zod.infer<typeof formSchema>;

export default function AccountVisibility() {
  const drawerRef = React.useRef<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { handleSubmit, setValue, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permission_status: 0
    }
  });


  const permissionStatus = watch('permission_status');

  React.useEffect(() => {
    async function fetchCurrentVisibility() {
      try {
        const response = await protectedApi.get('/accounts/user_visibility/');
        setValue('permission_status', response.data.visibility);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching current visibility status:', error);
      }
    }
    fetchCurrentVisibility();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await protectedApi.put('/accounts/user_visibility/', {
        visibility: permissionStatus === 0 ? 1 : 0
      });
      setValue('permission_status', permissionStatus === 0 ? 1 : 0);
      drawerRef.current?.close();
    } catch (error) {
      console.error('Error updating account visibility:', error);
    }
  }

  return (
    <PageLayout
      headerTitle="Account Visibility"
      flex1={isLoading}
    >
      {
        isLoading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
          </View>
          : <>
            <View style={styles.container}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ gap: 4 }}>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{permissionStatus === 1 ? "Private" : "Public"}</Text>
                  <Text style={{ fontSize: 12, color: "#a6a6a6" }}>Your account is set to {permissionStatus === 1 ? "private" : "public"} now.</Text>
                </View>
                <ToggleSwitch
                  value={permissionStatus === 1}
                  onValueChange={() => drawerRef.current?.open()}
                  size='large'
                />
              </View>
            </View>
            <Text style={{ fontSize: 12, color: "#a6a6a6", textAlign: 'justify', marginTop: 32 }}>
              A Public profile is like an open book - anyone can see the full picture of you. From your profile image, name, global rank, username, background image, and posts, to the deeper details like your current place, followers, following, about, experiences, education, certifications (including other certifications), projects, and streak - it’s all visible to everyone.
            </Text>
            <Text style={{ fontSize: 12, color: "#a6a6a6", textAlign: 'justify', marginTop: 16 }}>
              A Private profile gives you more control. The essentials (your profile image, name, global rank, username, background image, and posts) stay visible to everyone so they can still find and recognize you. But all the other details are shared only with your followers.
            </Text>
            <BottomDrawer sheetRef={drawerRef} draggableIconHeight={0}>
              <View style={{ paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>
                  {permissionStatus === 0 ? "Switch to Private Profile" : "Make Your Profile Public?"}
                </Text>
                <Text style={{ fontSize: 13, color: "#a6a6a6", textAlign: 'center', marginTop: 12 }}>
                  {permissionStatus === 0 ? "Only your basic info will remain visible. Detailed sections like your experiences, education and certifications will be shared only with your followers." : "EEveryone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.Everyone on the platform will be able to view your full profile - including your posts, experiences, education and certifications.veryone on the platform will be able to view your full profile - including your posts, experiences, education and certifications."}
                </Text>
                <View style={{ flexDirection: 'row', gap: 16, width: '100%', marginTop: 24 }}>
                  <View style={{ flex: 1 / 2 }}>
                    <GreyBgButton
                      title='Cancel'
                      onPress={() => drawerRef.current?.close()}
                    />
                  </View>
                  <View style={{ flex: 1 / 2 }}>
                    <BlueButton
                      title='Confirm'
                      onPress={handleSubmit(onSubmit)}
                      loading={isSubmitting}
                    />
                  </View>
                </View>
              </View>
            </BottomDrawer>
          </>
      }
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#f5f5f5"
  }
})