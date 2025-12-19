import { StyleSheet, Text, View } from 'react-native';
import Layout from '@/components/general/PageLayout';
import React from 'react';
import BlueButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/general/PopUpMessage';
import DatePicker from '@/components/profile/DatePicker';
import ErrorMessage from '@/components/messsages/Error';
import { useUserStore } from '@/zustand/stores';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'expo-router';
import handleApiError from '@/helpers/apiErrorHandler';
import protectedApi from '@/helpers/axios';


const thisYear = new Date().getFullYear();

const formSchema = zod.object({
  dobDate: zod.string(),
  dobMonth: zod.string(),
  dobYear: zod.string(),
})

type FormData = zod.infer<typeof formSchema>

export default function SelectDate() {
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const { dobDate: currentDate, dobMonth: currentMonth, dobYear: currentYear } = useUserStore(state => state);
  const setUser = useUserStore((state) => state.setUser);

  const { setValue, setError, watch, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    defaultValues: {
      dobDate: currentDate || '',
      dobMonth: currentMonth || '',
      dobYear: currentYear || '',
    },
    resolver: zodResolver(formSchema)
  })

  const router = useRouter();
  const { dobDate, dobMonth, dobYear } = watch();

  const updateDob: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/accounts/update_birthday/', data).then(() => {
      setUser({ dobDate, dobMonth, dobYear })
      setPopUpVisible(true);
    }).catch(error => {
      handleApiError(error, setError)
    })
  }

  return (
    <Layout
      headerTitle='Birthday'
      defaultBack={false}
      flex1={false}
      customBack={() => router.back()}
    >
      <PopUpMessage
        heading='Birthday Updated'
        text='Your birthday is now saved - get ready for personalized surprises and celebrations on your special day.'
        visible={popUpVisible}
        setVisible={setPopUpVisible}
        onPress={() => {
          router.dismiss(2);
        }}
        isLoading={false}
        singleButton
      />

      <Text style={styles.heading}>Celebrate Your Journey</Text>
      <Text style={styles.content}>
        Sharing your birthday helps us craft a personalized experience just for you - unlocking birthday surprises, exclusive offers, and content that celebrates your special day, all while keeping your information secure.
      </Text>
      <Text style={[styles.content, { marginTop: 24 }]}>
        Kindly note, the birthday information you provide will not appear on your public profile. It will only be included in your resume and seen by recruiters when you apply for a job.
      </Text>
      <View style={{ marginTop: 32 }}>

        <View>
          <DatePicker
            date={dobDate}
            month={dobMonth}
            year={dobYear}
            setSelectedDate={(date: string) => setValue('dobDate', date)}
            setSelectedMonth={(month: string) => setValue('dobMonth', month)}
            setSelectedYear={(year: string) => setValue('dobYear', year)}
            leastYears={10}
          />
          <View style={{ gap: 8, marginTop: 48 }}>
            <BlueButton
              title='Update'
              onPress={handleSubmit(updateDob)}
              loading={isSubmitting}
              disabled={(dobDate === currentDate && dobMonth === currentMonth && dobYear === currentYear) || dobDate === '--' || dobMonth === '--' || dobYear === '--'}
            />
            {
              errors.root?.message && <ErrorMessage message={errors.root.message} />
            }
          </View>
        </View>
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
