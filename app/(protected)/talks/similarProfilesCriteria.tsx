import PageLayout from '@/components/general/PageLayout';
import CheckBox from '@/components/form/Checkbox'
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useUserStore } from '@/zustand/stores';
import { useJobsState } from '@/zustand/jobsStore';
import BottomFixedSingleButton from '@/components/general/BottomFixedContainer';
import DefaultButton from '@/components/buttons/BlueButton';
import PopUpMessage from '@/components/profile/PopUpMessage';

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

export default function SimilarProfilesCriteria() {
  const user = useUserStore((state) => state);
  const [placeState, setPlaceState] = React.useState(true)
  const [educationState, setEducationState] = React.useState(true)
  const [popUpVisible, setPopUpVisible] = React.useState(false);
  const jobs = useJobsState();
  const degrees: string[] = [];
  if (jobs.degrees) {
    jobs.degrees.forEach((degree) => {
      if (degree.type === 0) {
        degrees.push(`${degree.degree}, ${degree.field_of_study}`);
      }
    });
  }
  React.useEffect(() => {
    if (!placeState || !educationState) {
      setPopUpVisible(true);
    } else {
      setPopUpVisible(false);
    }
  }, [placeState, educationState]);
  return (
    <>
      <PageLayout
        headerTitle='Adjust Criteria'
        bottomPadding={false}
      >
        <PopUpMessage
          heading='Minimum Criteria Required'
          text='To show you the best possible matches, at least 2 crtierias need to stay selected.'
          visible={popUpVisible}
          setVisible={setPopUpVisible}
          onPress={() => {
            setEducationState(true)
            setPlaceState(true)
            setPopUpVisible(false)
          }}
          isLoading={false}
          singleButton
        />

        <View style={{ gap: 48 }}>
          <Select
            title='Current Place'
            state={placeState}
            setState={setPlaceState}
            subTitle={`${user.city}, ${user.state}, ${user.country}`}
          />
          <Select
            title='Education'
            state={educationState}
            setState={setEducationState}
            subTitle={degrees}
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
            subTitle={jobs.other_certifications ? jobs.other_certifications.map((cert) => `${cert.title}, Certified by ${cert.company}`) : 'No Certifications Added'}
          />
        </View>
      </PageLayout>
      <BottomFixedSingleButton>
        <DefaultButton
          title='Apply'
          disabled
        />
      </BottomFixedSingleButton>
    </>
  );
}
