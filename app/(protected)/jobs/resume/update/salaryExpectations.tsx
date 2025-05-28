import { View, StyleSheet } from 'react-native';
import Layout from '@/components/jobs/ChangeSettingsLayout';
import SelectMenu from '@/components/form/SelectMenu';
import InputField from '@/components/form/FormInput';
import React from 'react';
import targetCountries from '@/constants/targetCountries';
import BlueButton from '@/components/buttons/BlueButton';
import ErrorMessage from '@/components/messsages/Error';
import PopUpMessage from '@/components/general/PopUpMessage';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useJobsState } from '@/zustand/jobsStore';
import protectedApi from '@/helpers/axios';
import handleApiError from '@/helpers/apiErrorHandler';

const formSchema = zod.object({
  expected_salary: zod.string().min(1, 'Salary is required').regex(/^\d+$/, 'Salary must be a number'),
  expected_salary_currency: zod.string().min(1, 'Currency is required')
});

type FormData = zod.infer<typeof formSchema>;


const currencyOptions = Array.from(
  new Map(
    targetCountries.map((country) => [`${country.currencyName}-${country.currency}`, [country.currencyName, country.currency]])
  ).values()
);

export default function() {
  const { expected_salary: currentSalary, expected_salary_currency: currentCurrency, setJobsState } = useJobsState(state => state)
  const router = useRouter();

  const { control, handleSubmit, setError, watch, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expected_salary: currentSalary ? String(currentSalary) : '',
      expected_salary_currency: currentCurrency || ''
    }
  });

  const currency = watch('expected_salary_currency');
  const salary = watch('expected_salary');
  const [popupVisible, setPopupVisible] = React.useState(false);

  const updateSalary: SubmitHandler<FormData> = async (data) => {
    await protectedApi.put('/jobs/resume/update/', data)
      .then(() => {
        setJobsState({ expected_salary: Number(data.expected_salary), expected_salary_currency: data.expected_salary_currency });
        setPopupVisible(true);
      })
      .catch(error => {
        handleApiError(error, setError);
      });
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Layout
        headerTitle='Salary Expectation'
        heading="Set Your Salary Expectation"
        text='Setting your salary expectations allows us to match you with opportunities that align with your skills and career goals, ensuring tailored job recommendations and smoother negotiations.'
        secondaryText="Kindly note, Your salary expectation remains confidential - it won't appear on your public profile, be included in your resume, or be shared with recruiters when you apply for a job. It is used solely to help you find the right job match."
      >
        <PopUpMessage
          heading='Salary Expectation Updated'
          text='Your salary expectation has been saved. You’ll now receive tailored recommendations and opportunities based on your expected salary.'
          visible={popupVisible}
          setVisible={setPopupVisible}
          isLoading={false}
          singleButton
          onPress={() => {
            router.back();
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{ flex: 2 / 5 }}>
              <Controller
                control={control}
                name='expected_salary_currency'
                render={({ field: { onChange, value } }) => (
                  <SelectMenu
                    options={currencyOptions}
                    placeholder='Currency'
                    selected={value}
                    onSelect={onChange}
                  />
                )}
              />
            </View>
            <View style={{ flex: 3 / 5 }}>
              <Controller
                control={control}
                name='expected_salary'
                render={({ field: { onChange, value } }) => (
                  <InputField
                    placeholder='Expected Salary'
                    value={value}
                    onChangeText={onChange}
                    keyboardType='numeric'
                    topMargin={false}
                  />
                )}
              />
            </View>
          </View>
          <View style={{ gap: 4 }}>
            <BlueButton
              title='Update'
              onPress={handleSubmit(updateSalary)}
              loading={isSubmitting}
              disabled={!currency || !salary || (currency === currentCurrency && salary === String(currentSalary))}
            />
            {errors.expected_salary?.message && <ErrorMessage message={errors.expected_salary.message} />}
            {errors.expected_salary_currency?.message && <ErrorMessage message={errors.expected_salary_currency.message} />}
            {errors.root?.message && <ErrorMessage message={errors.root.message} />}
          </View>
        </View>
      </Layout >
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    gap: 16,
    marginBottom: 48,
  }
})
