import PageLayout from '@/components/general/PageLayout';
import TextAreaInput from '@/components/form/TextAreaInput';
import React from 'react';
import { Text, View } from 'react-native';
import BlueButton from '@/components/buttons/BlueButton';
import { useNewPostStore } from '@/zustand/talks/newPostStore';
import { useRouter } from 'expo-router';
import { current } from '@reduxjs/toolkit';

export default function Headline() {
  const { title: currentHeadline, setNewPost } = useNewPostStore();
  const [headline, setHeadline] = React.useState(currentHeadline || '');
  const router = useRouter();
  return (
    <PageLayout
      headerTitle='Headline'
    >
      <Text style={{ fontSize: 11, color: '#a6a6a6', marginBottom: 8, lineHeight: 11 }}>
        Grab attention with a strong title
      </Text>
      <View style={{ marginBottom: 48 }}>
        <TextAreaInput
          placeholder='Write here'
          maxLength={250}
          text={headline}
          setText={setHeadline}
        />
      </View>
      <BlueButton
        title='Save'
        disabled={headline.length === 0 || (currentHeadline != null && currentHeadline == headline)}
        onPress={() => {
          setNewPost({ title: headline });
          router.back();
        }}
      />
    </PageLayout>

  );
}
