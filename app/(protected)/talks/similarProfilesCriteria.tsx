import PageLayout from '@/components/general/PageLayout';
import CheckBox from '@/components/form/Checkbox'
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useUserStore } from '@/zustand/stores';
import { useJobsState } from '@/zustand/jobsStore';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import DefaultButton from '@/components/buttons/BlueButton';
import protectedApi from '@/helpers/axios';
import FullScreenActivity from '@/components/FullScreenActivity';
import * as zod from 'zod';
import { useForm, FormProvider, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const Select = ({ disabled = false, state, setState, title, subTitle }: { disabled?: boolean, state?: any, setState?: any, title: string, subTitle: string | string[] }) => {
  return (
    disabled ? (
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Image source={require('@/assets/images/lockGreyed.png')} style={{ width: 20, height: 20, objectFit: 'contain' }} />
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#a6a6a6' }}>{title}</Text>
          {
            Array.isArray(subTitle) ? (
              subTitle.map((item, index) => (
                <Text key={index} style={{ fontSize: 13, color: '#a6a6a6' }}>{item}</Text>
              ))
            ) : (
              <Text style={{ fontSize: 13, color: '#a6a6a6' }}>{subTitle}</Text>
            )
          }
        </View>

      </View>
    ) : (
      <CheckBox
        state={state}
        setState={setState}
        size='md'
      >
        <View style={{ gap: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text>
          {
            Array.isArray(subTitle) ? (
              subTitle.map((item, index) => (
                <Text key={index} style={{ fontSize: 13, color: '#737373' }}>{item}</Text>
              ))
            ) : (
              <Text style={{ fontSize: 13, color: '#737373' }}>{subTitle}</Text>
            )
          }
        </View>
      </CheckBox>
    )
  )
}

const schema = zod.object({
  education: zod.boolean(),
  place: zod.boolean(),
  institution: zod.boolean(),
})

export default function SimilarProfilesCriteria() {
  const user = useUserStore((state) => state);
  const [initialState, setInitialState] = React.useState({ education: false, place: false, institution: false })
  const [currentState, setCurrentState] = React.useState({ education: false, place: false, institution: false })
  const jobs = useJobsState();
  const degrees: string[] = [];
  const insitutionsName: string[] = [];
  if (jobs.degrees) {
    jobs.degrees.forEach((degree) => {
      if (degree.type === 0) {
        degrees.push(`${degree.degree}, ${degree.field_of_study}`);
        insitutionsName.push(degree.institution);
      }
    });
  }


  // fetch and inital loading of criteria
  const [initialLoading, setInitialLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCriteria = async () => {
      try {
        const response = await protectedApi.get('jobs/spotlight_criteria/');
        setInitialState({ education: response.data.education, place: response.data.place, institution: response.data.institution })
        setCurrentState({ education: response.data.education, place: response.data.place, institution: response.data.institution })
      } catch (error) {
        console.log(error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchCriteria();
  }, []);


  //apply new criteria
  const [updatingCrtieria, setUpdatingCrtieria] = React.useState(false);
  const updateCriteria = async () => {
    try {
      setUpdatingCrtieria(true);
      await protectedApi.put('jobs/spotlight_criteria/', currentState);
      setInitialState(currentState);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingCrtieria(false);
    }
  }
  return (
    initialLoading ? <FullScreenActivity /> :
      <>
        <PageLayout
          headerTitle='Adjust Criteria'
          bottomPadding={false}
        >
          <View style={{ gap: 48, paddingBottom: 64 }}>
            <Select
              title='Current Place'
              state={currentState.place}
              setState={(state: boolean) => setCurrentState((prev) => ({ ...prev, place: state }))}
              subTitle={`${user.city}, ${user.state}, ${user.country}`}
            />
            <Select
              title='Education'
              state={currentState.education}
              setState={(state: boolean) => setCurrentState((prev) => ({ ...prev, education: state }))}
              subTitle={degrees}
            />
            <Select
              title='School/College'
              state={currentState.institution}
              setState={(state: boolean) => setCurrentState((prev) => ({ ...prev, institution: state }))}
              subTitle={insitutionsName}
            />
            <Select
              disabled
              title='Job Role (Upgrade to Pro)'
              subTitle={jobs.previous_experience ? jobs.previous_experience.map((job) => job.job_role) : 'No Previous Experience Added'}
            />
            <Select
              disabled
              title='Company (Upgrade to Pro)'
              subTitle={jobs.previous_experience ? jobs.previous_experience.map((job) => job.company.name) : 'No Previous Experience Added'}
            />
            <Select
              disabled
              title='Certifications (Upgrade to Pro)'
              subTitle={'None'}
            />
            <Select
              disabled
              title='Other Certifications (Upgrade to Pro)'
              subTitle={jobs.other_certifications ? jobs.other_certifications.map((cert) => `${cert.title}, Certified by ${cert.company}`) : 'None'}
            />
          </View>
        </PageLayout>
        <BottomFixedSingleButton>
          <DefaultButton
            title='Apply'
            disabled={(!currentState.place && !currentState.education && !currentState.institution) || (currentState.place === initialState.place && currentState.education === initialState.education && currentState.institution === initialState.institution)}
            onPress={updateCriteria}
            loading={updatingCrtieria}
          />
        </BottomFixedSingleButton>
      </>
  );
}
