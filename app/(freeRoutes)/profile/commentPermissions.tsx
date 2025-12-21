import PageLayout from "@/components/general/PageLayout";
import { Text, View, ActivityIndicator } from 'react-native';
import SelectButton from "@/components/buttons/SelectButton";
import React from 'react';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler } from "react-hook-form";
import BlueButton from "@/components/buttons/BlueButton";
import BottomDrawer from "@/components/BottomDrawer";
import GreyBgButton from "@/components/buttons/GreyBgButton";
import protectedApi from "@/helpers/axios";

const options = [
  { 'Everyone': 'Anyone can comment on my posts.' },
  { 'Followers Only': 'Only users who follow me can comment on my posts.' },
  { 'Mutual Followers Only': 'Only users who follow me and I follow back can comment on my posts.' },
  { 'Following Only': 'Only users I follow can comment on my posts.' },
  { 'Followers and Following Only': "Only users who follow me or whom I follow can comment on my posts." }
]

const formSchema = zod.object({
  permission_status: zod.number().int().min(0).max(4).nullish()
});

type FormData = zod.infer<typeof formSchema>;

export default function CommentPersmissions() {

  const { handleSubmit, control, setValue, watch, formState: { isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permission_status: 0
    }
  });

  const [initialLoading, setInitialLoading] = React.useState(true);
  const permissionStatus = watch('permission_status');
  const [currentPermission, setCurrentPermission] = React.useState<number | null>(null);

  const drawerRef = React.useRef<any>(null);

  React.useEffect(() => {
    async function fetchCurrentPermission() {
      try {
        const response = await protectedApi.get('/accounts/comment_permission/');
        setValue('permission_status', response.data.comment_permissions);
        setCurrentPermission(response.data.comment_permissions);
        setInitialLoading(false);
      } catch (error) {
        console.error('Error fetching current permission status:', error);
      }
    }
    fetchCurrentPermission();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await protectedApi.put('/accounts/comment_permission/', {
        comment_permissions: data.permission_status
      });
      setCurrentPermission(data.permission_status || 0);
      drawerRef.current?.close();
    } catch (error) {
      console.error('Error updating permission status:', error);
    }
  };
  return (
    <PageLayout
      headerTitle="Comment Permissions"
      flex1={initialLoading}
    >
      {
        initialLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={'#202020'} />
          </View>
        ) :
          <>
            <Text style={{ color: "#a6a6a6", fontSize: 11 }}>Control who can comment on your posts by selecting one of the options below.</Text>
            <Controller
              control={control}
              name="permission_status"
              render={({ field: { onChange, value } }) => (
                <View style={{ gap: 16, marginTop: 32 }}>
                  {options.map((option, index) => {
                    const [key, subTitle] = Object.entries(option)[0];
                    return (
                      <SelectButton
                        title={key}
                        subTitle={subTitle}
                        key={key}
                        selected={value === index}
                        setSelected={onChange}
                        index={index}
                      />
                    );
                  })}
                </View>
              )}
            />
            <BlueButton
              title='Update Permission'
              style={{ marginTop: 48 }}
              onPress={() => drawerRef.current?.open()}
              disabled={currentPermission === permissionStatus}
            />
            <BottomDrawer sheetRef={drawerRef} draggableIconHeight={0}>
              <View style={{ paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Apply Comment Settings?</Text>
                <Text style={{ fontSize: 13, color: "#a6a6a6", textAlign: 'center', marginTop: 12 }}>Your new comment preference will apply to all existing and future posts. Are you sure you want to proceed?</Text>
                <View style={{ flexDirection: 'row', gap: 16, width: '100%', marginTop: 24 }}>
                  <View style={{ flex: 1 / 2 }}>
                    <GreyBgButton
                      title='Cancel'
                      onPress={() => drawerRef.current?.close()}
                    />
                  </View>
                  <View style={{ flex: 1 / 2 }}>
                    <BlueButton
                      title='Apply'
                      onPress={handleSubmit(onSubmit)}
                      loading={isSubmitting}
                    />
                  </View>
                </View>
              </View>
            </BottomDrawer>
          </>
      }
    </PageLayout >
  )
}