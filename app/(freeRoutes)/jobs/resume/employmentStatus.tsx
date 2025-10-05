import { Pressable, StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/jobs/ChangeSettingsLayout'
import BlueButton from '@/components/buttons/BlueButton';
import React from 'react'
import * as Haptics from 'expo-haptics';
import PopUpMessage from '@/components/general/PopUpMessage';
import { useJobsState } from '@/zustand/jobsStore';
import { useRouter } from 'expo-router';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import handleApiError from '@/helpers/apiErrorHandler';
import ErrorMessage from '@/components/messsages/Error';
import protectedApi from '@/helpers/axios';

const options = {
  'Open to Work': 'Currently unemployed and seeking opportunities.',
  'Employed, but Exploring': 'Working, yet open to better career options.',
  'Fresher, Ready to Start': 'Just starting out and eager to begin.',
  'Not Looking Right Now': 'Satisfied with the current situation.'
}

function Button({ title, subTitle, selected, setSelected, index }: { index: number, title: string, subTitle: string, selected: boolean, setSelected: React.Dispatch<React.SetStateAction<number | null>> }) {
  return (
    <Pressable onPress={
      () => {
        Haptics.selectionAsync();
        setSelected(index);
      }
    }>
      {
        <View style={[buttonStyles.container, selected && { backgroundColor: '#202020' }]}>
          <View style={[buttonStyles.selectCircle, selected && { borderColor: 'white' }]}>
          </View>
          <View >
            <Text style={[buttonStyles.heading, selected && { color: 'white' }]}>{title}</Text>
            <Text style={buttonStyles.text}>{subTitle}</Text>
          </View>
        </View>
      }
    </Pressable>
  )
}

const buttonStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 16
  },
  selectCircle: {
    borderWidth: 3,
    borderColor: '#a6a6a6',
    borderRadius: 50,
    height: 16,
    width: 16
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: '#a6a6a6',
    paddingRight: 16,
    marginTop: 4
  }
})

const formSchema = zod.object({
  employment_status: zod.number().int().min(0).max(3).nullish()
});

type FormData = zod.infer<typeof formSchema>;

export default function updateEmploymentStatus() {
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const { employment_status: currentState, setJobsState } = useJobsState(state => state);
  const router = useRouter();

  const { handleSubmit, control, watch, setError, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employment_status: currentState
    }
  });

  const selected = watch('employment_status');

  const updateStatus: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put("/jobs/resume/update/", data).then(() => {
      setJobsState({ employment_status: data.employment_status });
      setPopUpVisible(true);
    }).catch(error => {
      handleApiError(error, setError)
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Layout
        headerTitle='Employment Status'
        heading='Set Your Employment Status'
        text="Your employment status helps us connect you with the right opportunities, whether you're actively job hunting, open to better career options, or just exploring. Choose the option that best reflects your current situation to get the most relevant job recommendations and networking connections."
      >
        <PopUpMessage
          heading='Employment Status Updated'
          text='Your employment status has been saved. You’ll now receive tailored recommendations and opportunities based on your current status.'
          visible={popUpVisible}
          setVisible={setPopUpVisible}
          isLoading={false}
          singleButton
          onPress={() => {
            setPopUpVisible(false);
            router.back();
          }}
        />
        <View style={{ gap: 8, marginBottom: 48 }}>
          <Controller
            control={control}
            name="employment_status"
            render={({ field: { onChange, value } }) => (
              <View style={{ gap: 16 }}>
                {
                  Object.keys(options).map((key, index) => (
                    // @ts-ignore
                    <Button title={key} subTitle={options[key]}
                      key={key}
                      selected={value === index}
                      setSelected={onChange}
                      index={index}
                    />
                  ))
                }
              </View>
            )}
          />
          {errors.employment_status?.message && <ErrorMessage message={errors.employment_status.message} />}
        </View>
        <View style={{ gap: 8 }}>
          <BlueButton
            title='Update'
            loading={isSubmitting}
            disabled={selected === null || selected === currentState}
            onPress={selected != null ? handleSubmit(updateStatus) : () => { }}
          />
          {errors.root?.message && <ErrorMessage message={errors.root.message} />}
        </View>
      </Layout>
    </View>
  )
}
